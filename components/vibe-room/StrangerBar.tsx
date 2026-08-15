"use client";
import type { MatchState, Stranger } from "@/hooks/useStranger";

interface Props {
  matchState: MatchState;
  stranger: Stranger | null;
  elapsed: number;
  onNext: () => void;
  onClose: () => void;
  hideNext?: boolean;
  closeLabel?: string;
}

export default function StrangerBar({ matchState, stranger, elapsed, onNext, onClose, hideNext, closeLabel = "Close" }: Props) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "7px 14px",
      background: "rgba(255,255,255,0.025)",
      borderRadius: 12,
      marginBottom: 12,
      border: "1px solid rgba(255,255,255,0.07)",
    }}>
      {matchState === "searching" && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            display: "inline-block", width: 7, height: 7, borderRadius: "50%",
            background: "#f59e0b",
            boxShadow: "0 0 0 0 rgba(245,158,11,0.5)",
            animation: "stranger-ping 1.2s ease-in-out infinite",
          }} />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
            Finding a stranger<span style={{ animation: "stranger-dots 1.2s steps(4,end) infinite" }}>...</span>
            <span style={{ marginLeft: 6, color: "rgba(255,255,255,0.2)" }}>{elapsed}s</span>
          </span>
        </div>
      )}

      {matchState === "connected" && stranger && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "#34d399", boxShadow: "0 0 6px #34d399",
              display: "inline-block", flexShrink: 0,
            }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
              Stranger: <strong style={{ color: "rgba(255,255,255,0.85)", fontWeight: 700 }}>@{stranger.username}</strong>
            </span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {!hideNext && (
              <button
                onClick={onNext}
                style={{
                  fontSize: 11, fontWeight: 700, padding: "3px 14px",
                  borderRadius: 20, border: "none", cursor: "pointer",
                  background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.65)",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.14)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
              >
                Next
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                fontSize: 11, fontWeight: 700, padding: "3px 14px",
                borderRadius: 20, border: "none", cursor: "pointer",
                background: "rgba(239,68,68,0.12)", color: "#f87171",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.22)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,68,0.12)")}
            >
              {closeLabel}
            </button>
          </div>
        </>
      )}

      {matchState === "closed" && (
        <>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>— Disconnected</span>
          <button
            onClick={onNext}
            style={{
              fontSize: 11, fontWeight: 700, padding: "3px 14px",
              borderRadius: 20, border: "none", cursor: "pointer",
              background: "rgba(99,102,241,0.18)", color: "#a5b4fc",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(99,102,241,0.3)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(99,102,241,0.18)")}
          >
            Find Stranger
          </button>
        </>
      )}

      <style>{`
        @keyframes stranger-ping {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.5); }
          50% { box-shadow: 0 0 0 5px rgba(245,158,11,0); }
        }
      `}</style>
    </div>
  );
}
