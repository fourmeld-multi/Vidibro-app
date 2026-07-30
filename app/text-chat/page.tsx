"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import TextChatContainer from "@/components/TextChatContainer";
import { useWebRTC } from "@/hooks/useWebRTC";

export default function TextChatPage() {
  const router = useRouter();
  const {
    connectionState,
    matchCountdown,
    dataChannelOpen,
    joinQueue,
    leaveMatch,
    skipToNext,
    sendMessage,
    subscribe,
  } = useWebRTC();

  useEffect(() => {
    joinQueue("text").catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLeave() {
    leaveMatch();
    router.push("/");
  }

  return (
    <div className="relative w-full h-dvh flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0e0526] via-[#140836] via-[#1b0840] to-[#0a041c] p-2 sm:p-4">
      {/* Ambient Aurora Glow Mesh Blobs for Rich Background Depth */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-pink-500/20 via-purple-600/15 to-transparent blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 right-10 h-[450px] w-[450px] rounded-full bg-gradient-to-tr from-cyan-500/15 via-pink-500/15 to-transparent blur-[110px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-purple-600/20 via-indigo-500/15 to-transparent blur-[130px] pointer-events-none" />

      <div className="relative z-10 w-full h-full max-w-4xl max-h-[920px] flex flex-col rounded-3xl border border-purple-500/35 shadow-2xl shadow-purple-500/25 overflow-hidden bg-[#0d0725]/95 backdrop-blur-2xl">
        <TextChatContainer
        matchCountdown={matchCountdown}
          connectionState={connectionState}
          dataChannelOpen={dataChannelOpen}
          sendMessage={sendMessage}
          subscribe={subscribe}
          skipToNext={skipToNext}
          leaveMatch={handleLeave}
        />
      </div>
    </div>
  );
}
