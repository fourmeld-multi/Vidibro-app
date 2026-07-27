"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, ScanFace, Captions, Mic, MicOff, Video, VideoOff } from "lucide-react";
import type { MessageType } from "@/lib/protocol";
import type { SubtitlePayload } from "@/lib/protocol";

// Loaded lazily so users who never enable blur don't pay for the WASM/model
// download on every page load.
type ImageSegmenterModule = typeof import("@mediapipe/tasks-vision");
let mediapipeModulePromise: Promise<ImageSegmenterModule> | null = null;
function loadMediapipe() {
  if (!mediapipeModulePromise) {
    mediapipeModulePromise = import("@mediapipe/tasks-vision");
  }
  return mediapipeModulePromise;
}

const SEGMENTER_WASM_BASE =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";
const SEGMENTER_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite";

type Props = {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  connectionState: "idle" | "waiting" | "connecting" | "connected" | "disconnected";
  dataChannelOpen: boolean;
  sendMessage: <T>(type: MessageType, payload: T) => void;
  subscribe: (type: MessageType, cb: (msg: { payload: unknown }) => void) => () => void;
  replaceOutgoingVideoTrack: (track: MediaStreamTrack | null) => Promise<void>;
};

export default function VideoContainer({
  localStream,
  remoteStream,
  connectionState,
  dataChannelOpen,
  sendMessage,
  subscribe,
  replaceOutgoingVideoTrack,
}: Props) {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const segmenterRef = useRef<import("@mediapipe/tasks-vision").ImageSegmenter | null>(null);

  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [blurEnabled, setBlurEnabled] = useState(false);
  const [blurLoading, setBlurLoading] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  // Lazy initializer: a one-time browser-feature check, safe on the server
  // (falls back to false) and correct on the client's first render.
  const [subtitlesSupported] = useState(
    () =>
      typeof window !== "undefined" &&
      ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
  );
  const [remoteSubtitle, setRemoteSubtitle] = useState("");

  useEffect(() => {
    if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
  }, [remoteStream]);

  // ---- Received subtitles (the remote peer's speech) ----
  useEffect(() => {
    const unsub = subscribe("subtitle", (msg) => {
      const payload = msg.payload as SubtitlePayload;
      setRemoteSubtitle(payload.text);
      if (payload.isFinal) {
        window.setTimeout(() => setRemoteSubtitle((cur) => (cur === payload.text ? "" : cur)), 3000);
      }
    });
    return unsub;
  }, [subscribe]);

  // ---- Local speech recognition -> broadcast over the data channel ----
  useEffect(() => {
    if (!subtitlesEnabled || !subtitlesSupported) return;

    const Ctor =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognition }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognition }).webkitSpeechRecognition;
    if (!Ctor) return;

    const recognizer = new Ctor();
    recognizer.continuous = true;
    recognizer.interimResults = true;
    recognizer.lang = "en-US";

    let lastSent = "";
    recognizer.onresult = (e: SpeechRecognitionEvent) => {
      const result = e.results[e.results.length - 1];
      const text = result[0].transcript.trim();
      if (!text || text === lastSent) return;
      lastSent = text;
      sendMessage<SubtitlePayload>("subtitle", { text, isFinal: result.isFinal });
    };
    recognizer.onerror = () => {};
    recognizer.onend = () => {
      // Chrome stops the recognizer after periods of silence — restart while toggled on.
      if (subtitlesEnabled) {
        try {
          recognizer.start();
        } catch {
          // already running
        }
      }
    };

    try {
      recognizer.start();
    } catch {
      // ignore double-start races
    }

    return () => {
      recognizer.onend = null;
      recognizer.stop();
    };
  }, [subtitlesEnabled, subtitlesSupported, sendMessage]);

  // ---- MediaPipe background blur ----
  const stopBlurLoop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  // A self-recursive rAF loop can't reference its own `useCallback` binding
  // directly (that binding doesn't exist yet inside its own initializer) —
  // routing the recursive call through a ref sidesteps that entirely.
  const runBlurLoopRef = useRef<() => void>(() => {});

  const runBlurLoop = useCallback(() => {
    const video = localVideoRef.current;
    const canvas = canvasRef.current;
    const segmenter = segmenterRef.current;
    if (!video || !canvas || !segmenter || video.videoWidth === 0) {
      rafRef.current = requestAnimationFrame(() => runBlurLoopRef.current());
      return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const result = segmenter.segmentForVideo(video, performance.now());
    const categoryMask = result.categoryMask;
    const mask = categoryMask?.getAsFloat32Array();

    // Layer 1: heavily blurred full frame as the background.
    ctx.filter = "blur(14px)";
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.filter = "none";

    // Layer 2: sharp frame, masked to just the person region, on top.
    // The mask's native resolution rarely matches the video's actual
    // resolution — building the alpha mask at the video's size while
    // reading `mask[i]` as if it were a 1:1 index (the original bug here)
    // scrambles the composite, since row/column boundaries don't line up.
    // Build it at the MASK's own reported width/height instead, then let
    // drawImage's scaling parameters upsize it onto the real canvas.
    if (mask && categoryMask) {
      const maskW = categoryMask.width;
      const maskH = categoryMask.height;
      const sharp = document.createElement("canvas");
      sharp.width = maskW;
      sharp.height = maskH;
      const sctx = sharp.getContext("2d")!;
      sctx.drawImage(video, 0, 0, maskW, maskH);
      const frame = sctx.getImageData(0, 0, maskW, maskH);
      // MediaPipe's selfie segmenter: category 1 = person, category 0 =
      // background — keep person pixels opaque (sharp), make background
      // pixels transparent so the blurred layer underneath shows through.
      for (let i = 0; i < mask.length; i++) {
        if (mask[i] < 0.5) frame.data[i * 4 + 3] = 0;
      }
      sctx.putImageData(frame, 0, 0);
      ctx.drawImage(sharp, 0, 0, maskW, maskH, 0, 0, canvas.width, canvas.height);
    }

    result.close();
    rafRef.current = requestAnimationFrame(() => runBlurLoopRef.current());
  }, []);

  useEffect(() => {
    runBlurLoopRef.current = runBlurLoop;
  }, [runBlurLoop]);

  const toggleBlur = useCallback(async () => {
    if (blurEnabled) {
      stopBlurLoop();
      setBlurEnabled(false);
      await replaceOutgoingVideoTrack(null);
      return;
    }

    setBlurLoading(true);
    try {
      if (!segmenterRef.current) {
        const { FilesetResolver, ImageSegmenter } = await loadMediapipe();
        const fileset = await FilesetResolver.forVisionTasks(SEGMENTER_WASM_BASE);
        segmenterRef.current = await ImageSegmenter.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: SEGMENTER_MODEL_URL, delegate: "GPU" },
          runningMode: "VIDEO",
          outputCategoryMask: true,
        });
      }
      setBlurEnabled(true);
      runBlurLoop();
      const canvasStream = canvasRef.current!.captureStream(24);
      await replaceOutgoingVideoTrack(canvasStream.getVideoTracks()[0]);
    } finally {
      setBlurLoading(false);
    }
  }, [blurEnabled, replaceOutgoingVideoTrack, runBlurLoop, stopBlurLoop]);

  useEffect(() => stopBlurLoop, [stopBlurLoop]);

  function toggleMic() {
    const next = !micEnabled;
    localStream?.getAudioTracks().forEach((t) => (t.enabled = next));
    setMicEnabled(next);
  }

  function toggleCam() {
    const next = !camEnabled;
    localStream?.getVideoTracks().forEach((t) => (t.enabled = next));
    setCamEnabled(next);
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-black ring-2 ring-[var(--accent-4)]/50">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className={`h-full w-full object-cover ${blurEnabled ? "invisible" : ""}`}
        />
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 h-full w-full object-cover ${blurEnabled ? "" : "hidden"}`}
        />
        <span className="glass absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium text-[var(--foreground)]">
          You
        </span>
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2">
          <button
            onClick={toggleMic}
            className={`flex h-9 w-9 items-center justify-center rounded-full ${
              micEnabled ? "bg-black/60 text-white" : "bg-red-500 text-white"
            }`}
            aria-label="Toggle microphone"
          >
            {micEnabled ? <Mic size={15} /> : <MicOff size={15} />}
          </button>
          <button
            onClick={toggleCam}
            className={`flex h-9 w-9 items-center justify-center rounded-full ${
              camEnabled ? "bg-black/60 text-white" : "bg-red-500 text-white"
            }`}
            aria-label="Toggle camera"
          >
            {camEnabled ? <Video size={15} /> : <VideoOff size={15} />}
          </button>
          <button
            onClick={toggleBlur}
            disabled={blurLoading}
            className={`flex h-9 w-9 items-center justify-center rounded-full ${
              blurEnabled ? "btn-gradient text-black/80" : "bg-black/60 text-white"
            }`}
            aria-label="Toggle background blur"
            title="Background blur (visible to the stranger too)"
          >
            {blurLoading ? <Loader2 size={15} className="animate-spin" /> : <ScanFace size={15} />}
          </button>
          {subtitlesSupported && (
            <button
              onClick={() => setSubtitlesEnabled((v) => !v)}
              className={`flex h-9 w-9 items-center justify-center rounded-full ${
                subtitlesEnabled ? "btn-gradient text-black/80" : "bg-black/60 text-white"
              }`}
              aria-label="Toggle live subtitles"
              title="Broadcast live subtitles of your speech"
            >
              <Captions size={15} />
            </button>
          )}
        </div>
      </div>

      <div className="relative aspect-video overflow-hidden rounded-2xl bg-black ring-2 ring-[var(--accent)]/50">
        {connectionState === "connected" && remoteStream ? (
          <video ref={remoteVideoRef} autoPlay playsInline className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-[var(--muted)]">
            {connectionState === "waiting" && "Looking for someone to chat with…"}
            {connectionState === "connecting" && "Connecting…"}
            {connectionState === "idle" && "Press Start to find a stranger"}
            {connectionState === "disconnected" && "Stranger disconnected"}
          </div>
        )}
        <span className="glass absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium text-[var(--foreground)]">
          Stranger
        </span>
        {remoteSubtitle && (
          <p className="absolute bottom-3 left-1/2 max-w-[90%] -translate-x-1/2 rounded-lg bg-black/70 px-3 py-1.5 text-center text-sm text-white">
            {remoteSubtitle}
          </p>
        )}
        {!dataChannelOpen && connectionState === "connected" && (
          <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-1 text-[10px] text-white">
            Syncing…
          </span>
        )}
      </div>
    </div>
  );
}
