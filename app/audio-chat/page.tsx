"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AudioChatContainer from "@/components/AudioChatContainer";
import CallInterruptedScreen from "@/components/CallInterruptedScreen";
import PermissionBlockedScreen from "@/components/PermissionBlockedScreen";
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
    permissionBlocked,
    deviceBusy,
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

      {deviceBusy && <CallInterruptedScreen mode="audio" onHome={handleLeave} />}
      {permissionBlocked && <PermissionBlockedScreen mode="audio" onHome={handleLeave} />}
    </div>
  );
}
