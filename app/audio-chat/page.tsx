"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AudioChatContainer from "@/components/AudioChatContainer";
import { useWebRTC } from "@/hooks/useWebRTC";

export default function AudioChatPage() {
  const router = useRouter();
  const {
    connectionState,
    localStream,
    remoteStream,
    dataChannelOpen,
    joinQueue,
    leaveMatch,
    skipToNext,
    sendMessage,
    subscribe,
  } = useWebRTC();

  useEffect(() => {
    joinQueue("audio").catch(() => {
      // Mic permission denied or unavailable — connectionState stays "idle".
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLeave() {
    leaveMatch();
    router.push("/");
  }

  return (
    <div className="w-full h-dvh flex flex-col overflow-hidden bg-[#070414]">
      <AudioChatContainer
        localStream={localStream}
        remoteStream={remoteStream}
        connectionState={connectionState}
        dataChannelOpen={dataChannelOpen}
        sendMessage={sendMessage}
        subscribe={subscribe}
        skipToNext={skipToNext}
        leaveMatch={handleLeave}
      />
    </div>
  );
}
