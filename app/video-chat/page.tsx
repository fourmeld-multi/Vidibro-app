"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import VideoContainer from "@/components/VideoContainer";
import CallInterruptedScreen from "@/components/CallInterruptedScreen";
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
    deviceBusy,
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

  // No "allow camera" retry prompt. If they decline the browser permission
  // there is nothing useful for us to show — the page cannot work — so they go
  // straight back to the landing page. Tapping Start again re-asks; declining
  // again sends them back again.
  useEffect(() => {
    if (permissionDenied) {
      leaveMatch();
      router.replace("/");
    }
  }, [permissionDenied, leaveMatch, router]);

  // A phone call owns the mic: stop matchmaking immediately rather than pairing
  // this user with a stranger who won't be able to hear them.
  useEffect(() => {
    if (deviceBusy) leaveMatch();
  }, [deviceBusy, leaveMatch]);

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

      {deviceBusy && <CallInterruptedScreen mode="video" onHome={handleLeave} />}
    </div>
  );
}
