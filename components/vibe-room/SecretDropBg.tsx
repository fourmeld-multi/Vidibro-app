"use client";

const HEARTS = [
  { e:"❤️",  x:10, s:18, dur:9,  del:0   },
  { e:"💗",  x:25, s:14, dur:12, del:2.5 },
  { e:"💕",  x:50, s:16, dur:10, del:1   },
  { e:"💌",  x:70, s:14, dur:11, del:3.5 },
  { e:"❤️",  x:85, s:20, dur:8,  del:0.8 },
  { e:"💗",  x:38, s:12, dur:13, del:4.5 },
  { e:"💕",  x:62, s:18, dur:9,  del:2   },
  { e:"🌹",  x:15, s:14, dur:14, del:6   },
  { e:"💞",  x:78, s:16, dur:11, del:1.5 },
];

export default function SecretDropBg() {
  return (
    <>
      <style>{`
        @keyframes sd-rise {
          0%   { transform:translateY(0) scale(1) rotate(-8deg); opacity:0; }
          8%   { opacity:.3; }
          85%  { opacity:.18; }
          100% { transform:translateY(-95vh) scale(.55) rotate(12deg); opacity:0; }
        }
        @keyframes sd-blob {
          0%,100% { transform:scale(1) translate(0,0); }
          40%     { transform:scale(1.1) translate(12px,-14px); }
          70%     { transform:scale(.92) translate(-10px,9px); }
        }
      `}</style>
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(155deg,#0a0208 0%,#100412 50%,#07030e 100%)" }} />
        {/* deep rose blob centre-bottom */}
        <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(190,18,60,.12) 0%,transparent 68%)", bottom:-160, left:"50%", transform:"translateX(-50%)", animation:"sd-blob 20s ease-in-out infinite", willChange:"transform" }} />
        {/* crimson blob top-right */}
        <div style={{ position:"absolute", width:360, height:360, borderRadius:"50%", background:"radial-gradient(circle,rgba(236,72,153,.10) 0%,transparent 68%)", top:-100, right:-80, animation:"sd-blob 25s ease-in-out infinite 6s", willChange:"transform" }} />
        {/* pink blob left */}
        <div style={{ position:"absolute", width:280, height:280, borderRadius:"50%", background:"radial-gradient(circle,rgba(251,113,133,.08) 0%,transparent 68%)", top:"35%", left:-60, animation:"sd-blob 16s ease-in-out infinite 3s", willChange:"transform" }} />
        {/* rising hearts */}
        {HEARTS.map((h, i) => (
          <div key={i} style={{ position:"absolute", left:`${h.x}%`, bottom:"-5%", fontSize:h.s, lineHeight:1, animation:`sd-rise ${h.dur}s ${h.del}s ease-in infinite`, willChange:"transform" }}>
            {h.e}
          </div>
        ))}
        {/* warm glow bottom */}
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 40% at 50% 100%,rgba(190,18,60,.09) 0%,transparent 100%)" }} />
      </div>
    </>
  );
}
