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

// Adaptive 480p / 24fps Media Constraints. Portrait on mobile (matches the
// `md` breakpoint the mobile video layout itself switches on) so the
// captured frame matches how a phone is actually held, instead of a fixed
// 4:3-landscape capture getting cropped into a portrait-shaped box by
// object-cover. Desktop keeps the original landscape capture — webcams are
// physically landscape sensors, so there's nothing to orient there.
function videoConstraints(): MediaStreamConstraints {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  return {
    video: isMobile
      ? {
          width: { ideal: 480, max: 480 },
          height: { ideal: 640, max: 640 },
          frameRate: { ideal: 24, max: 24 },
        }
      : {
          width: { ideal: 640, max: 640 },
          height: { ideal: 480, max: 480 },
          frameRate: { ideal: 24, max: 24 },
        },
    audio: true,
  };
}

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
  // The mic was taken away by something else on the device — in practice a
  // phone call. There is no browser API that reports "user is on a cellular
  // call", so losing the microphone is the signal we actually get.
  const [deviceBusy, setDeviceBusy] = useState(false);
  // Distinct from permissionDenied: the user chose "Never allow", so the
  // browser will not show a prompt again no matter how many times they click.
  // Only a change in site settings can undo it.
  const [permissionBlocked, setPermissionBlocked] = useState(false);
  // Counts 4 -> 1 before we actually enter the matchmaking queue, so the
  // switch between strangers has a visible beat instead of snapping.
  const [matchCountdown, setMatchCountdown] = useState(0);

  const socketRef = useRef<Socket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const roomIdRef = useRef<string | null>(null);
  const modeRef = useRef<ChatMode>("video");
  const muteGraceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const listenersRef = useRef<Map<MessageType, Set<Listener>>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  // Only true once the user has actually started a chat AND their media is
  // ready. Guards the reconnect handler from shoving us into the matchmaking
  // queue before we can contribute any tracks.
  const readyToMatchRef = useRef(false);
  // Pending "ICE went bad, consider re-queuing" timer, so a recovery can
  // cancel it instead of us tearing down a connection that healed itself.
  const iceRetryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
        // Recovered (or connected for the first time) — cancel any pending
        // "give up and re-queue" timer from an earlier blip.
        if (iceRetryTimerRef.current) {
          clearTimeout(iceRetryTimerRef.current);
          iceRetryTimerRef.current = null;
        }
        applyBandwidthLimitsAndCodecs(pc);
        setConnectionState("connected");
        return;
      }

      // "closed" only happens because *we* closed the connection (teardown,
      // End Call, skip). Re-queuing here caused a phantom rejoin ~2s after
      // the user deliberately left the call.
      if (state === "closed") return;

      if (state !== "failed" && state !== "disconnected") return;

      // "disconnected" is usually transient — ICE frequently recovers on its
      // own after a brief network blip, so give it room rather than tearing
      // a healthy call down. "failed" is terminal and handled quickly.
      const graceMs = state === "failed" ? 1500 : 9000;

      setConnectionState("disconnected");
      if (iceRetryTimerRef.current) clearTimeout(iceRetryTimerRef.current);
      iceRetryTimerRef.current = setTimeout(() => {
        iceRetryTimerRef.current = null;
        // Bail if the user left in the meantime, or if this peer connection
        // is no longer the current one, or if it quietly recovered.
        if (!readyToMatchRef.current) return;
        if (pcRef.current !== pc) return;
        const live = pc.iceConnectionState;
        if (live === "connected" || live === "completed") return;

        teardownPeerConnection();
        setConnectionState("waiting");
        socketRef.current?.emit("queue:join", { mode: modeRef.current });
      }, graceMs);
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

  /**
   * Watch the microphone for being seized by another app.
   *
   * A cellular call is not observable from the browser — there is no API for
   * it. What IS observable is the consequence: iOS and Android hand the mic to
   * the phone call, which mutes (or ends) our audio track. That covers both
   * "already on a call when they open the page" and "a call arrives mid-chat"
   * with one mechanism.
   *
   * The 1.5s grace matters. A track can mute for a beat during a route change
   * (headphones connecting, speaker toggle) and recover on its own; acting on
   * the first mute event would throw people out of working calls. We only
   * treat it as a real interruption if the mic is still gone after the grace.
   */
  const watchAudioInterruption = useCallback((stream: MediaStream) => {
    const track = stream.getAudioTracks()[0];
    if (!track) return;

    const clearGrace = () => {
      if (muteGraceRef.current) {
        clearTimeout(muteGraceRef.current);
        muteGraceRef.current = null;
      }
    };

    const flagBusy = () => {
      clearGrace();
      muteGraceRef.current = setTimeout(() => {
        // readyToMatchRef guards against firing during our own teardown, where
        // we stop these tracks deliberately.
        if (readyToMatchRef.current && (track.muted || track.readyState === "ended")) {
          setDeviceBusy(true);
        }
      }, 1500);
    };

    track.onmute = flagBusy;
    track.onunmute = clearGrace;
    track.onended = () => {
      if (readyToMatchRef.current) setDeviceBusy(true);
    };

    // Already muted at acquisition == the call started before they got here.
    if (track.muted) flagBusy();
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

    const constraints = mode === "audio" ? AUDIO_ONLY_CONSTRAINTS : videoConstraints();

    // These three outcomes need to be told apart, because they mean different
    // things to the user. "Denied" is a choice they made. "Busy" is the device
    // refusing because a phone call already owns the mic. Anything else is
    // usually the constraints being too specific for this hardware, which is
    // the only case worth retrying with looser ones.
    const errName = (e: unknown) => (e as DOMException | undefined)?.name ?? "";
    const isDenied = (e: unknown) => errName(e) === "NotAllowedError" || errName(e) === "SecurityError";
    const isBusy = (e: unknown) => errName(e) === "NotReadableError" || errName(e) === "AbortError";

    /**
     * Tell a one-off decline apart from a standing "Never allow".
     *
     * It matters because they need opposite handling: a one-off decline just
     * means try again, and clicking Start will re-prompt normally. A standing
     * block means the browser will never prompt again, so re-asking is futile
     * and the only way forward is site settings.
     *
     * The Permissions API answers this directly where it exists. Safari does
     * not support querying camera/microphone, so we fall back to timing: a
     * prompt the user actually saw takes at least a moment to dismiss, while a
     * standing block rejects more or less instantly.
     */
    const isPermanentBlock = async (elapsedMs: number) => {
      try {
        const name = (mode === "audio" ? "microphone" : "camera") as PermissionName;
        const status = await navigator.permissions.query({ name });
        if (status.state === "denied") return true;
        if (status.state === "prompt") return false;
      } catch {
        // Permissions API unavailable or doesn't know this name — use timing.
      }
      return elapsedMs < 300;
    };

    const accept = (stream: MediaStream) => {
      localStreamRef.current = stream;
      setLocalStream(stream);
      setPermissionDenied(false);
      setPermissionBlocked(false);
      setDeviceBusy(false);
      watchAudioInterruption(stream);
      return stream;
    };

    const startedAt = Date.now();
    try {
      return accept(await navigator.mediaDevices.getUserMedia(constraints));
    } catch (err) {
      if (isBusy(err)) {
        setDeviceBusy(true);
        throw new Error("Microphone is in use by another app or call");
      }
      if (isDenied(err)) {
        if (await isPermanentBlock(Date.now() - startedAt)) setPermissionBlocked(true);
        setPermissionDenied(true);
        throw new Error("Camera & Microphone permission denied");
      }

      if (mode === "video") {
        try {
          return accept(await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: true }));
        } catch (err2) {
          if (isBusy(err2)) {
            setDeviceBusy(true);
            throw new Error("Microphone is in use by another app or call");
          }
          try {
            return accept(await navigator.mediaDevices.getUserMedia({ video: true, audio: true }));
          } catch (err3) {
            if (isBusy(err3)) {
              setDeviceBusy(true);
              throw new Error("Microphone is in use by another app or call");
            }
            setPermissionDenied(true);
            throw new Error("Camera & Microphone permission denied");
          }
        }
      }
      setPermissionDenied(true);
      throw new Error("Microphone permission denied");
    }
  }, [watchAudioInterruption]);

  /**
   * Wait out a visible 4..1 countdown, then enter the matchmaking queue.
   * Applies to the initial start, "Next", and the automatic rejoin after a
   * partner leaves, so every mode behaves the same way.
   */
  const queueAfterCountdown = useCallback((targetMode: ChatMode) => {
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    let remaining = 4;
    setMatchCountdown(remaining);
    countdownTimerRef.current = setInterval(() => {
      remaining -= 1;
      if (remaining > 0) {
        setMatchCountdown(remaining);
        return;
      }
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
      setMatchCountdown(0);
      // The user may have left during the countdown.
      if (!readyToMatchRef.current) return;
      socketRef.current?.emit("queue:join", { mode: targetMode });
    }, 1000);
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
        queueAfterCountdown(newMode);
      } catch {
        // Stop call process if user denies camera/mic permissions
        readyToMatchRef.current = false;
        setConnectionState("idle");
      }
    },
    [ensureLocalStream, queueAfterCountdown]
  );

  const leaveMatch = useCallback(() => {
    // Genuine exit — stop looking for matches, and this is the one place the
    // camera/mic hardware should actually be released.
    readyToMatchRef.current = false;
    if (iceRetryTimerRef.current) {
      clearTimeout(iceRetryTimerRef.current);
      iceRetryTimerRef.current = null;
    }
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setMatchCountdown(0);
    if (muteGraceRef.current) {
      clearTimeout(muteGraceRef.current);
      muteGraceRef.current = null;
    }
    teardownPeerConnection();
    socketRef.current?.emit("queue:leave");
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    setLocalStream(null);
    setConnectionState("idle");
  }, [teardownPeerConnection]);

  const skipToNext = useCallback(() => {
    // Tell the server we're leaving this pair right away so the partner is
    // released immediately, then serve out the countdown before re-queuing.
    socketRef.current?.emit("queue:leave");
    teardownPeerConnection();
    setConnectionState("waiting");
    queueAfterCountdown(modeRef.current);
  }, [teardownPeerConnection, queueAfterCountdown]);

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
      if (iceRetryTimerRef.current) {
        clearTimeout(iceRetryTimerRef.current);
        iceRetryTimerRef.current = null;
      }
      teardownPeerConnection();
      setConnectionState("disconnected");
      // The peer who pressed "Next" re-queues immediately, while this side
      // was sitting out a 1.5s delay — long enough for the other user to be
      // paired with someone else, which is why Next often needed several
      // presses before it caught. Just long enough to show the state change.
      if (readyToMatchRef.current) {
        setConnectionState("waiting");
        queueAfterCountdown(modeRef.current);
      }
    });

    return () => {
      readyToMatchRef.current = false;
      if (iceRetryTimerRef.current) {
        clearTimeout(iceRetryTimerRef.current);
        iceRetryTimerRef.current = null;
      }
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
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

  return {
    connectionState,
    role,
    isHost: role === "initiator",
    mode,
    localStream,
    remoteStream,
    dataChannelOpen,
    permissionDenied,
    permissionBlocked,
    deviceBusy,
    matchCountdown,
    joinQueue,
    leaveMatch,
    skipToNext,
    sendMessage: emit,
    subscribe,
    replaceOutgoingVideoTrack,
  };
}
