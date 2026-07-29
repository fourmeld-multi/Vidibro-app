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

// Kept strictly at 480p per the app's bandwidth/CPU budget — every peer,
// regardless of device, sends and receives at the same modest resolution.
const VIDEO_CONSTRAINTS: MediaStreamConstraints = {
  video: {
    width: { ideal: 640, max: 640 },
    height: { ideal: 480, max: 480 },
    frameRate: { ideal: 24, max: 30 },
  },
  audio: true,
};

const AUDIO_ONLY_CONSTRAINTS: MediaStreamConstraints = { audio: true };

function iceServers(): RTCIceServer[] {
  return [
    { urls: process.env.NEXT_PUBLIC_STUN_URL || "stun:stun.l.google.com:19302" },
    {
      // Real Coturn provisioning is separate infra work — these are
      // placeholders until a real TURN server/credentials are wired in.
      urls: process.env.NEXT_PUBLIC_TURN_URL || "turn:REPLACE_WITH_COTURN_HOST:3478",
      username: process.env.NEXT_PUBLIC_TURN_USERNAME || "vidibro-placeholder",
      credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL || "REPLACE_ME",
    },
  ];
}

type Listener = (msg: Envelope) => void;

export function useWebRTC() {
  const [connectionState, setConnectionState] = useState<ConnectionState>("idle");
  const [role, setRole] = useState<PeerRole | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [dataChannelOpen, setDataChannelOpen] = useState(false);
  const [mode, setMode] = useState<ChatMode>("video");

  const socketRef = useRef<Socket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const roomIdRef = useRef<string | null>(null);
  const modeRef = useRef<ChatMode>("video");
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const listenersRef = useRef<Map<MessageType, Set<Listener>>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);

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
    pcRef.current?.getSenders().forEach((s) => s.track?.stop());
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
        setConnectionState("connected");
      } else if (state === "failed" || state === "disconnected" || state === "closed") {
        setConnectionState("disconnected");
      }
    };

    pcRef.current = pc;
    return pc;
  }, []);

  const flushPendingCandidates = useCallback(async (pc: RTCPeerConnection) => {
    for (const c of pendingCandidatesRef.current) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(c));
      } catch {
        // benign if it was already applied or stale
      }
    }
    pendingCandidatesRef.current = [];
  }, []);

  /** Acquire media for the given mode once, kept alive across matches so the
   * local preview never flickers between "Next" clicks. Text mode never
   * touches getUserMedia at all — pure signaling + data channel. */
  const ensureLocalStream = useCallback(async (mode: ChatMode) => {
    if (mode === "text") return null;
    
    // If local stream exists and is active, reuse it
    if (localStreamRef.current && localStreamRef.current.active) {
      const vTracks = localStreamRef.current.getVideoTracks();
      const aTracks = localStreamRef.current.getAudioTracks();
      if (mode === "video" && vTracks.length > 0 && vTracks[0].readyState === "live") {
        return localStreamRef.current;
      }
      if (mode === "audio" && aTracks.length > 0 && aTracks[0].readyState === "live") {
        return localStreamRef.current;
      }
    }

    const constraints = mode === "audio" ? AUDIO_ONLY_CONSTRAINTS : VIDEO_CONSTRAINTS;
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      setLocalStream(stream);
      return stream;
    } catch {
      // Mobile fallback if specific width/height constraints failed on mobile browser
      if (mode === "video") {
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: true });
          localStreamRef.current = fallbackStream;
          setLocalStream(fallbackStream);
          return fallbackStream;
        } catch {
          const basicStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          localStreamRef.current = basicStream;
          setLocalStream(basicStream);
          return basicStream;
        }
      }
      throw new Error("Unable to acquire media stream");
    }
  }, []);

  const joinQueue = useCallback(
    async (newMode: ChatMode = "video") => {
      modeRef.current = newMode;
      setMode(newMode);
      await ensureLocalStream(newMode);
      setConnectionState("waiting");
      socketRef.current?.emit("queue:join");
    },
    [ensureLocalStream]
  );

  const leaveMatch = useCallback(() => {
    teardownPeerConnection();
    socketRef.current?.emit("queue:leave");
    // "End Call" is a full exit, not a rematch — release the camera/mic so
    // the device's recording indicator actually turns off (unlike
    // skipToNext, which intentionally keeps the stream alive for reuse).
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    setLocalStream(null);
    setConnectionState("idle");
  }, [teardownPeerConnection]);

  const skipToNext = useCallback(() => {
    teardownPeerConnection();
    setConnectionState("waiting");
    socketRef.current?.emit("queue:join");
  }, [teardownPeerConnection]);

  useEffect(() => {
    const socket = io(SIGNALING_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      if (modeRef.current) {
        socket.emit("queue:join");
      }
    });

    socket.on("match:found", async ({ roomId, role: myRole }: { roomId: string; role: PeerRole }) => {
      roomIdRef.current = roomId;
      setRole(myRole);
      setConnectionState("connecting");
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
        // benign race, ignore
      }
    });

    socket.on("peer:left", () => {
      teardownPeerConnection();
      setConnectionState("disconnected");
    });

    return () => {
      teardownPeerConnection();
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const replaceOutgoingVideoTrack = useCallback(async (newTrack: MediaStreamTrack) => {
    // 1. Update localStreamRef so new matches use the updated track
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((t) => {
        if (t !== newTrack) {
          localStreamRef.current?.removeTrack(t);
        }
      });
      if (!localStreamRef.current.getVideoTracks().includes(newTrack)) {
        localStreamRef.current.addTrack(newTrack);
      }
    }

    const pc = pcRef.current;
    if (!pc) return;

    // 2. Find video sender across senders and transceivers
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

  return {
    connectionState,
    role,
    isHost: role === "initiator",
    mode,
    localStream,
    remoteStream,
    dataChannelOpen,
    joinQueue,
    leaveMatch,
    skipToNext,
    sendMessage: emit,
    subscribe,
    replaceOutgoingVideoTrack,
  };
}
