"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import {
  Envelope,
  MessageType,
  isEnvelope,
  makeEnvelope,
} from "@/lib/protocol";

export type ConnectionState =
  | "idle"
  | "waiting"
  | "connecting"
  | "connected"
  | "disconnected";

export type PeerRole = "initiator" | "receiver";
export type ChatMode = "video" | "audio" | "text";

const SIGNALING_URL =
  process.env.NEXT_PUBLIC_SIGNALING_URL?.replace(/\/$/, "") || "http://localhost:4000";

// Adaptive 480p / 24fps Media Constraints
const VIDEO_CONSTRAINTS: MediaStreamConstraints = {
  video: {
    width: { ideal: 640, max: 640 },
    height: { ideal: 480, max: 480 },
    frameRate: { ideal: 24, max: 24 },
  },
  audio: true,
};

const AUDIO_ONLY_CONSTRAINTS: MediaStreamConstraints = { audio: true };

function iceServers(): RTCIceServer[] {
  const stunUrls = [
    process.env.NEXT_PUBLIC_STUN_URL || "stun:stun.l.google.com:19302",
    "stun:stun1.l.google.com:19302",
    "stun:stun2.l.google.com:19302",
    "stun:stun3.l.google.com:19302",
    "stun:global.stun.twilio.com:3478",
  ];

  const servers: RTCIceServer[] = [{ urls: stunUrls }];

  const turnUrl = process.env.NEXT_PUBLIC_TURN_URL;
  const turnUsername = process.env.NEXT_PUBLIC_TURN_USERNAME;
  const turnCredential = process.env.NEXT_PUBLIC_TURN_CREDENTIAL;

  if (turnUrl && turnUsername && turnCredential && !turnUrl.includes("REPLACE_WITH_COTURN_HOST")) {
    servers.push({
      urls: turnUrl,
      username: turnUsername,
      credential: turnCredential,
    });
  } else {
    // Free openrelay fallback endpoints for traversal across strict NATs
    servers.push({
      urls: "turn:openrelay.metered.ca:80",
      username: "openrelay",
      credential: "openrelay",
    });
    servers.push({
      urls: "turn:openrelay.metered.ca:443",
      username: "openrelay",
      credential: "openrelay",
    });
  }

  return servers;
}

function applyBandwidthLimitsAndCodecs(pc: RTCPeerConnection) {
  // 1. Bitrate capping (600 kbps max bitrate for video stream to prevent network degradation)
  pc.getSenders().forEach((sender) => {
    if (sender.track?.kind === "video") {
      const params = sender.getParameters();
      if (!params.encodings || params.encodings.length === 0) {
        params.encodings = [{}];
      }
      params.encodings[0].maxBitrate = 600000; // 600 kbps
      params.encodings[0].maxFramerate = 24;
      sender.setParameters(params).catch(() => {});
    }
  });

  // 2. Codec Preference (VP8 / H.264 for Video, Opus for Audio)
  if (typeof RTCRtpTransceiver !== "undefined" && "setCodecPreferences" in RTCRtpTransceiver.prototype) {
    pc.getTransceivers().forEach((transceiver) => {
      if (transceiver.receiver.track.kind === "video" && typeof RTCRtpReceiver.getCapabilities === "function") {
        const capabilities = RTCRtpReceiver.getCapabilities("video");
        if (capabilities && capabilities.codecs) {
          const preferredCodecs = capabilities.codecs.filter(
            (c) => c.mimeType.toLowerCase() === "video/vp8" || c.mimeType.toLowerCase() === "video/h264"
          );
          if (preferredCodecs.length > 0) {
            transceiver.setCodecPreferences(preferredCodecs);
          }
        }
      }
    });
  }
}

type Listener = (msg: Envelope) => void;

export function useWebRTC() {
  const [connectionState, setConnectionState] = useState<ConnectionState>("idle");
  const [role, setRole] = useState<PeerRole | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [dataChannelOpen, setDataChannelOpen] = useState(false);
  const [mode, setMode] = useState<ChatMode>("video");
  const [permissionDenied, setPermissionDenied] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const roomIdRef = useRef<string | null>(null);
  const modeRef = useRef<ChatMode>("video");
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const listenersRef = useRef<Map<MessageType, Set<Listener>>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  // Only true once the user has actually started a chat AND their media is
  // ready. Guards the reconnect handler from shoving us into the matchmaking
  // queue before we can contribute any tracks.
  const readyToMatchRef = useRef(false);

  const emit = useCallback(<T,>(type: MessageType, payload: T) => {
    const dc = dcRef.current;
    if (!dc || dc.readyState !== "open") return;
    dc.send(JSON.stringify(makeEnvelope(type, payload)));
  }, []);

  const subscribe = useCallback((type: MessageType, cb: Listener) => {
    let set = listenersRef.current.get(type);
    if (!set) {
      set = new Set();
      listenersRef.current.set(type, set);
    }
    set.add(cb);
    return () => set!.delete(cb);
  }, []);

  const teardownPeerConnection = useCallback(() => {
    dcRef.current?.close();
    dcRef.current = null;
    // NOTE: deliberately does NOT stop the senders' tracks. Those tracks are
    // the *local* camera/mic tracks (they were handed to pc.addTrack from
    // localStreamRef), so stopping them here permanently ends the hardware
    // capture — readyState goes to "ended" and cannot be revived. That made
    // the camera go dark on every "Next" and never come back. Closing the
    // peer connection alone detaches them; the local stream stays live and
    // is reused for the next match. Only leaveMatch() truly stops capture.
    pcRef.current?.close();
    pcRef.current = null;
    pendingCandidatesRef.current = [];
    setDataChannelOpen(false);
    setRemoteStream(null);
    setRole(null);
    roomIdRef.current = null;
  }, []);

  const wireDataChannel = useCallback((dc: RTCDataChannel) => {
    dcRef.current = dc;
    dc.onopen = () => setDataChannelOpen(true);
    dc.onclose = () => setDataChannelOpen(false);
    dc.onmessage = (e) => {
      let msg: unknown;
      try {
        msg = JSON.parse(e.data);
      } catch {
        return;
      }
      if (!isEnvelope(msg)) return;
      listenersRef.current.get(msg.type)?.forEach((cb) => cb(msg));
    };
  }, []);

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({ iceServers: iceServers() });

    localStreamRef.current?.getTracks().forEach((track) => {
      pc.addTrack(track, localStreamRef.current as MediaStream);
    });

    pc.onicecandidate = (e) => {
      if (e.candidate && roomIdRef.current) {
        socketRef.current?.emit("signal:ice-candidate", {
          roomId: roomIdRef.current,
          candidate: e.candidate.toJSON(),
        });
      }
    };

    pc.ontrack = (e) => {
      const incomingTrack = e.track;
      let stream = e.streams[0];

      if (!stream) {
        stream = new MediaStream([incomingTrack]);
      } else {
        if (incomingTrack.kind === "video") {
          stream.getVideoTracks().forEach((oldTrack) => {
            if (oldTrack !== incomingTrack) {
              stream.removeTrack(oldTrack);
            }
          });
          if (!stream.getVideoTracks().includes(incomingTrack)) {
            stream.addTrack(incomingTrack);
          }
        }
      }

      setRemoteStream(new MediaStream(stream.getTracks()));
    };

    pc.oniceconnectionstatechange = () => {
      const state = pc.iceConnectionState;
      if (state === "connected" || state === "completed") {
        applyBandwidthLimitsAndCodecs(pc);
        setConnectionState("connected");
      } else if (state === "failed" || state === "disconnected" || state === "closed") {
        setConnectionState("disconnected");
        setTimeout(() => {
          if (modeRef.current && (pcRef.current === null || pcRef.current.iceConnectionState !== "connected")) {
            teardownPeerConnection();
            setConnectionState("waiting");
            socketRef.current?.emit("queue:join", { mode: modeRef.current });
          }
        }, 2000);
      }
    };

    pcRef.current = pc;
    return pc;
  }, [teardownPeerConnection]);

  const flushPendingCandidates = useCallback(async (pc: RTCPeerConnection) => {
    for (const c of pendingCandidatesRef.current) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(c));
      } catch {
        // benign if candidate was already applied
      }
    }
    pendingCandidatesRef.current = [];
  }, []);

  const ensureLocalStream = useCallback(async (mode: ChatMode) => {
    if (mode === "text") {
      setPermissionDenied(false);
      return null;
    }
    
    if (localStreamRef.current && localStreamRef.current.active) {
      const vTracks = localStreamRef.current.getVideoTracks();
      const aTracks = localStreamRef.current.getAudioTracks();
      if (mode === "video" && vTracks.length > 0 && vTracks[0].readyState === "live") {
        setPermissionDenied(false);
        return localStreamRef.current;
      }
      if (mode === "audio" && aTracks.length > 0 && aTracks[0].readyState === "live") {
        setPermissionDenied(false);
        return localStreamRef.current;
      }
    }

    const constraints = mode === "audio" ? AUDIO_ONLY_CONSTRAINTS : VIDEO_CONSTRAINTS;
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      setLocalStream(stream);
      setPermissionDenied(false);
      return stream;
    } catch {
      if (mode === "video") {
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: true });
          localStreamRef.current = fallbackStream;
          setLocalStream(fallbackStream);
          setPermissionDenied(false);
          return fallbackStream;
        } catch {
          try {
            const basicStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = basicStream;
            setLocalStream(basicStream);
            setPermissionDenied(false);
            return basicStream;
          } catch {
            setPermissionDenied(true);
            throw new Error("Camera & Microphone permission denied");
          }
        }
      }
      setPermissionDenied(true);
      throw new Error("Microphone permission denied");
    }
  }, []);

  const joinQueue = useCallback(
    async (newMode: ChatMode = "video") => {
      modeRef.current = newMode;
      setMode(newMode);
      try {
        // Media must be live *before* we enter the queue. Joining first and
        // acquiring the camera afterwards means the server can pair us while
        // localStreamRef is still null, and createPeerConnection() then adds
        // zero tracks — the call "connects" with no video and no audio.
        await ensureLocalStream(newMode);
        readyToMatchRef.current = true;
        setConnectionState("waiting");
        socketRef.current?.emit("queue:join", { mode: newMode });
      } catch {
        // Stop call process if user denies camera/mic permissions
        readyToMatchRef.current = false;
        setConnectionState("idle");
      }
    },
    [ensureLocalStream]
  );

  const leaveMatch = useCallback(() => {
    // Genuine exit — stop looking for matches, and this is the one place the
    // camera/mic hardware should actually be released.
    readyToMatchRef.current = false;
    teardownPeerConnection();
    socketRef.current?.emit("queue:leave");
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    setLocalStream(null);
    setConnectionState("idle");
  }, [teardownPeerConnection]);

  const skipToNext = useCallback(() => {
    teardownPeerConnection();
    setConnectionState("waiting");
    socketRef.current?.emit("queue:join", { mode: modeRef.current });
  }, [teardownPeerConnection]);

  useEffect(() => {
    const socket = io(SIGNALING_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      // Only re-enter the queue on an actual reconnect of an in-progress
      // session. modeRef defaults to "video", so the old truthiness check
      // fired on every first connect and queued the user before their camera
      // had even been requested.
      if (readyToMatchRef.current) {
        socket.emit("queue:join", { mode: modeRef.current });
      }
    });

    socket.on("match:found", async ({ roomId, role: myRole }: { roomId: string; role: PeerRole }) => {
      roomIdRef.current = roomId;
      setRole(myRole);
      setConnectionState("connecting");

      // Safety net: never build a peer connection without media. If anything
      // matched us early, acquire the stream now so addTrack has something to
      // send — otherwise both sides connect to silence and a black frame.
      if (modeRef.current !== "text" && !localStreamRef.current?.active) {
        try {
          await ensureLocalStream(modeRef.current);
        } catch {
          setConnectionState("idle");
          return;
        }
      }

      const pc = createPeerConnection();

      if (myRole === "initiator") {
        const dc = pc.createDataChannel("vidibro-main");
        wireDataChannel(dc);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("signal:offer", { roomId, sdp: offer });
      } else {
        pc.ondatachannel = (e) => wireDataChannel(e.channel);
      }
    });

    socket.on("signal:offer", async ({ sdp }: { sdp: RTCSessionDescriptionInit }) => {
      const pc = pcRef.current;
      if (!pc) return;
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      await flushPendingCandidates(pc);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socketRef.current?.emit("signal:answer", { roomId: roomIdRef.current, sdp: answer });
    });

    socket.on("signal:answer", async ({ sdp }: { sdp: RTCSessionDescriptionInit }) => {
      const pc = pcRef.current;
      if (!pc) return;
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      await flushPendingCandidates(pc);
    });

    socket.on("signal:ice-candidate", async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      const pc = pcRef.current;
      if (!pc || !pc.remoteDescription) {
        pendingCandidatesRef.current.push(candidate);
        return;
      }
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch {
        // benign race
      }
    });

    socket.on("peer:left", () => {
      teardownPeerConnection();
      setConnectionState("disconnected");
      setTimeout(() => {
        if (modeRef.current) {
          setConnectionState("waiting");
          socketRef.current?.emit("queue:join", { mode: modeRef.current });
        }
      }, 1500);
    });

    return () => {
      teardownPeerConnection();
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const replaceOutgoingVideoTrack = useCallback(async (newTrack: MediaStreamTrack) => {
    // 1. Explicitly stop old video track hardware & update localStreamRef
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((t) => {
        if (t !== newTrack) {
          t.stop();
          localStreamRef.current?.removeTrack(t);
        }
      });
      if (!localStreamRef.current.getVideoTracks().includes(newTrack)) {
        localStreamRef.current.addTrack(newTrack);
      }
      setLocalStream(new MediaStream(localStreamRef.current.getTracks()));
    }

    const pc = pcRef.current;
    if (!pc) return;

    // 2. Seamlessly swap active video track without SDP renegotiation
    const senders = pc.getSenders();
    let videoSender = senders.find((s) => s.track && s.track.kind === "video");
    if (!videoSender) {
      videoSender = pc.getTransceivers().find((t) => t.sender.track?.kind === "video" || t.receiver.track?.kind === "video")?.sender;
    }

    if (videoSender) {
      await videoSender.replaceTrack(newTrack);
    } else if (localStreamRef.current) {
      pc.addTrack(newTrack, localStreamRef.current);
    }
  }, []);

  const requestPermissions = useCallback(
    async (targetMode?: ChatMode) => {
      const modeToRequest = targetMode || modeRef.current || "video";
      try {
        await ensureLocalStream(modeToRequest);
        setPermissionDenied(false);
        joinQueue(modeToRequest);
      } catch {
        setPermissionDenied(true);
      }
    },
    [ensureLocalStream, joinQueue]
  );

  return {
    connectionState,
    role,
    isHost: role === "initiator",
    mode,
    localStream,
    remoteStream,
    dataChannelOpen,
    permissionDenied,
    requestPermissions,
    joinQueue,
    leaveMatch,
    skipToNext,
    sendMessage: emit,
    subscribe,
    replaceOutgoingVideoTrack,
  };
}
