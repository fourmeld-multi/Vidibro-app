"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import VideoContainer from "@/components/VideoContainer";
import CallInterruptedScreen from "@/components/CallInterruptedScreen";
import PermissionBlockedScreen from "@/components/PermissionBlockedScreen";
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
    permissionBlocked,
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
    if (permissionDenied && !permissionBlocked) {
      leaveMatch();
      router.replace("/");
    }
  }, [permissionDenied, permissionBlocked, leaveMatch, router]);

  // A standing "Never allow" is the one case we don't bounce home for. The
  // browser won't re-prompt, so sending them back would put them in a loop of
  // clicking Start and landing straight back on the home page with no clue why.
  useEffect(() => {
    if (permissionBlocked) leaveMatch();
  }, [permissionBlocked, leaveMatch]);

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
      {permissionBlocked && <PermissionBlockedScreen mode="video" onHome={handleLeave} />}
    </div>
  );
}
