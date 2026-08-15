"use client";

const SPARKS = [
  { x: 8,  y: 18, s: 14, dur: 9,  del: 0   },
  { x: 88, y: 12, s: 10, dur: 11, del: 2   },
  { x: 25, y: 72, s: 12, dur: 8,  del: 1   },
  { x: 70, y: 60, s: 16, dur: 13, del: 3.5 },
  { x: 50, y: 88, s: 10, dur: 10, del: 1.5 },
  { x: 92, y: 80, s: 12, dur: 7,  del: 4   },
  { x: 15, y: 45, s: 8,  dur: 12, del: 0.5 },
];

export default function VrHubBg() {
  return (
    <>
      <style>{`
        @keyframes vrh-float {
          0%,100% { transform:translateY(0) rotate(0deg); opacity:.14; }
          50%      { transform:translateY(-16px) rotate(20deg); opacity:.28; }
        }
        @keyframes vrh-blob {
          0%,100% { transform:scale(1) translate(0,0); }
          33%     { transform:scale(1.12) translate(14px,-10px); }
          66%     { transform:scale(.94) translate(-8px,12px); }
        }
        @keyframes vrh-pulse {
          0%,100% { opacity:.55; }
          50%     { opacity:1; }
        }
      `}</style>
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(145deg,#07030f 0%,#0d0620 50%,#050810 100%)" }} />
        {/* purple orb top-left */}
        <div style={{ position:"absolute", width:520, height:520, borderRadius:"50%", background:"radial-gradient(circle,rgba(109,40,217,.13) 0%,transparent 68%)", top:-160, left:-130, animation:"vrh-blob 22s ease-in-out infinite", willChange:"transform" }} />
        {/* teal orb bottom-right */}
        <div style={{ position:"absolute", width:420, height:420, borderRadius:"50%", background:"radial-gradient(circle,rgba(20,184,166,.09) 0%,transparent 68%)", bottom:-120, right:-100, animation:"vrh-blob 28s ease-in-out infinite 6s", willChange:"transform" }} />
        {/* pink accent orb */}
        <div style={{ position:"absolute", width:280, height:280, borderRadius:"50%", background:"radial-gradient(circle,rgba(236,72,153,.07) 0%,transparent 68%)", top:"40%", right:"30%", animation:"vrh-blob 18s ease-in-out infinite 3s", willChange:"transform" }} />
        {/* floating sparkles */}
        {SPARKS.map((sp, i) => (
          <div key={i} style={{ position:"absolute", left:`${sp.x}%`, top:`${sp.y}%`, fontSize:sp.s, lineHeight:1, animation:`vrh-float ${sp.dur}s ${sp.del}s ease-in-out infinite`, willChange:"transform" }}>
            ✦
          </div>
        ))}
        {/* subtle noise overlay */}
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 60% at 50% 0%,rgba(120,80,220,.06) 0%,transparent 100%)" }} />
      </div>
    </>
  );
}
