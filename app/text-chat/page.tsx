"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import TextChatContainer from "@/components/TextChatContainer";
import { useWebRTC } from "@/hooks/useWebRTC";

export default function TextChatPage() {
  const router = useRouter();
  const {
    connectionState,
    dataChannelOpen,
    joinQueue,
    leaveMatch,
    skipToNext,
    sendMessage,
    subscribe,
  } = useWebRTC();

  useEffect(() => {
    joinQueue("text").catch(() => {
      // Text mode never touches getUserMedia, so this practically never
      // rejects — kept for symmetry with the video/audio pages.
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLeave() {
    leaveMatch();
    router.push("/");
  }

  return (
    <div className="w-full h-dvh flex flex-col overflow-hidden bg-[#070414]">
      <TextChatContainer
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
