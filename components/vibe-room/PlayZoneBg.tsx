"use client";

const ITEMS = [
  { e:"🎮", x:6,  y:14, s:26, dur:8,  del:0   },
  { e:"🎲", x:85, y:22, s:20, dur:11, del:1.5 },
  { e:"🏆", x:18, y:68, s:22, dur:9,  del:3   },
  { e:"⭐", x:72, y:54, s:18, dur:7,  del:0.5 },
  { e:"🃏", x:48, y:82, s:20, dur:12, del:2   },
  { e:"🎯", x:90, y:72, s:18, dur:10, del:4   },
  { e:"🕹️", x:32, y:28, s:18, dur:9,  del:1   },
  { e:"💥", x:60, y:8,  s:16, dur:13, del:3.5 },
];

export default function PlayZoneBg() {
  return (
    <>
      <style>{`
        @keyframes pz-float {
          0%,100% { transform:translateY(0) rotate(-8deg); opacity:.12; }
          50%     { transform:translateY(-20px) rotate(8deg); opacity:.22; }
        }
        @keyframes pz-blob {
          0%,100% { transform:scale(1) translate(0,0); }
          40%     { transform:scale(1.1) translate(16px,-12px); }
          70%     { transform:scale(.93) translate(-10px,8px); }
        }
      `}</style>
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(150deg,#030d08 0%,#070f05 50%,#0a0805 100%)" }} />
        {/* emerald blob */}
        <div style={{ position:"absolute", width:480, height:480, borderRadius:"50%", background:"radial-gradient(circle,rgba(16,185,129,.14) 0%,transparent 70%)", top:-140, left:-100, animation:"pz-blob 18s ease-in-out infinite", willChange:"transform" }} />
        {/* amber blob */}
        <div style={{ position:"absolute", width:380, height:380, borderRadius:"50%", background:"radial-gradient(circle,rgba(245,158,11,.10) 0%,transparent 70%)", bottom:-100, right:-80, animation:"pz-blob 22s ease-in-out infinite 5s", willChange:"transform" }} />
        {/* subtle pixel grid */}
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px)", backgroundSize:"44px 44px" }} />
        {/* floating game icons */}
        {ITEMS.map((it, i) => (
          <div key={i} style={{ position:"absolute", left:`${it.x}%`, top:`${it.y}%`, fontSize:it.s, lineHeight:1, animation:`pz-float ${it.dur}s ${it.del}s ease-in-out infinite`, willChange:"transform" }}>
            {it.e}
          </div>
        ))}
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 90% 50% at 50% 100%,rgba(16,185,129,.05) 0%,transparent 100%)" }} />
      </div>
    </>
  );
}
