"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import VideoContainer from "@/components/VideoContainer";
import { useWebRTC } from "@/hooks/useWebRTC";

export default function VideoChatPage() {
  const router = useRouter();
  const {
    connectionState,
    isHost,
    localStream,
    remoteStream,
    dataChannelOpen,
    joinQueue,
    leaveMatch,
    skipToNext,
    sendMessage,
    subscribe,
    replaceOutgoingVideoTrack,
  } = useWebRTC();

  useEffect(() => {
    joinQueue("video").catch(() => {
      // Camera/mic permission denied or unavailable — connectionState stays
      // "idle" and VideoContainer's own empty state remains visible.
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLeave() {
    leaveMatch();
    router.push("/");
  }

  return (
    <div className="w-full h-dvh flex flex-col overflow-hidden bg-[#070414]">
      <VideoContainer
        localStream={localStream}
        remoteStream={remoteStream}
        connectionState={connectionState}
        dataChannelOpen={dataChannelOpen}
        sendMessage={sendMessage}
        subscribe={subscribe}
        skipToNext={skipToNext}
        leaveMatch={handleLeave}
        isHost={isHost}
        replaceOutgoingVideoTrack={replaceOutgoingVideoTrack}
      />
    </div>
  );
}
