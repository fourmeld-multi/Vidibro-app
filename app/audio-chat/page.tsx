"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AudioChatContainer from "@/components/AudioChatContainer";
import PermissionDeniedModal from "@/components/PermissionDeniedModal";
import { useWebRTC } from "@/hooks/useWebRTC";

export default function AudioChatPage() {
  const router = useRouter();
  const {
    connectionState,
    matchCountdown,
    localStream,
    remoteStream,
    dataChannelOpen,
    permissionDenied,
    requestPermissions,
    joinQueue,
    leaveMatch,
    skipToNext,
    sendMessage,
    subscribe,
  } = useWebRTC();

  useEffect(() => {
    joinQueue("audio").catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLeave() {
    leaveMatch();
    router.push("/");
  }

  return (
    <div className="w-full h-dvh flex flex-col overflow-hidden bg-[#070414]">
      <AudioChatContainer
        matchCountdown={matchCountdown}
        localStream={localStream}
        remoteStream={remoteStream}
        connectionState={connectionState}
        dataChannelOpen={dataChannelOpen}
        sendMessage={sendMessage}
        subscribe={subscribe}
        skipToNext={skipToNext}
        leaveMatch={handleLeave}
      />

      <PermissionDeniedModal
        isOpen={permissionDenied}
        mode="audio"
        onRetry={() => requestPermissions("audio")}
      />
    </div>
  );
}
