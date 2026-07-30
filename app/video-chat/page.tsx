"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import VideoContainer from "@/components/VideoContainer";
import PermissionDeniedModal from "@/components/PermissionDeniedModal";
import { useWebRTC } from "@/hooks/useWebRTC";

export default function VideoChatPage() {
  const router = useRouter();
  const {
    connectionState,
    matchCountdown,
    isHost,
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
    replaceOutgoingVideoTrack,
  } = useWebRTC();

  useEffect(() => {
    joinQueue("video").catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLeave() {
    leaveMatch();
    router.push("/");
  }

  return (
    <div className="w-full h-dvh flex flex-col overflow-hidden bg-[#070414]">
      <VideoContainer
        matchCountdown={matchCountdown}
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

      <PermissionDeniedModal
        isOpen={permissionDenied}
        mode="video"
        onRetry={() => requestPermissions("video")}
      />
    </div>
  );
}
