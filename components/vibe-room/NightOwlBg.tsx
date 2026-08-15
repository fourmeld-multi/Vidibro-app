"use client";

const STARS = Array.from({ length: 38 }, (_, i) => ({
  x:    (i * 7.3  + 11) % 100,
  y:    (i * 13.7 + 5)  % 92,
  size: 1 + (i % 3) * 0.5,
  dur:  1.5 + (i % 5) * 0.7,
  del:  (i * 0.38) % 5,
}));

export default function NightOwlBg() {
  return (
    <>
      <style>{`
        @keyframes now-twinkle {
          0%,100% { opacity:.12; transform:scale(1); }
          50%     { opacity:.9;  transform:scale(1.5); }
        }
        @keyframes now-blob {
          0%,100% { transform:scale(1) translate(0,0); }
          50%     { transform:scale(1.08) translate(-14px,10px); }
        }
        @keyframes now-shoot {
          0%   { transform:translate(0,0) rotate(35deg); opacity:0; width:0px; }
          4%   { opacity:1; }
          50%  { width:90px; opacity:.85; }
          100% { transform:translate(380px,200px) rotate(35deg); opacity:0; width:0px; }
        }
        @keyframes now-shoot2 {
          0%   { transform:translate(0,0) rotate(30deg); opacity:0; width:0px; }
          4%   { opacity:1; }
          50%  { width:60px; opacity:.7; }
          100% { transform:translate(260px,140px) rotate(30deg); opacity:0; width:0px; }
        }
      `}</style>
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(160deg,#020510 0%,#06051a 40%,#030814 100%)" }} />
        {/* indigo blob top-right */}
        <div style={{ position:"absolute", width:550, height:550, borderRadius:"50%", background:"radial-gradient(circle,rgba(67,56,202,.13) 0%,transparent 68%)", top:-170, right:-130, animation:"now-blob 24s ease-in-out infinite", willChange:"transform" }} />
        {/* deep violet blob bottom-left */}
        <div style={{ position:"absolute", width:420, height:420, borderRadius:"50%", background:"radial-gradient(circle,rgba(109,40,217,.10) 0%,transparent 68%)", bottom:-120, left:-80, animation:"now-blob 30s ease-in-out infinite 9s", willChange:"transform" }} />
        {/* moon glow */}
        <div style={{ position:"absolute", width:220, height:220, borderRadius:"50%", background:"radial-gradient(circle,rgba(253,224,71,.07) 0%,transparent 70%)", top:24, right:70 }} />
        {/* shooting star 1 */}
        <div style={{ position:"absolute", left:"8%", top:"12%", height:1.5, background:"linear-gradient(90deg,transparent,rgba(255,255,255,.85),transparent)", animation:"now-shoot 9s 1.5s ease-in infinite", willChange:"transform" }} />
        {/* shooting star 2 */}
        <div style={{ position:"absolute", left:"55%", top:"28%", height:1, background:"linear-gradient(90deg,transparent,rgba(200,210,255,.7),transparent)", animation:"now-shoot2 9s 7s ease-in infinite", willChange:"transform" }} />
        {/* stars */}
        {STARS.map((s, i) => (
          <div key={i} style={{ position:"absolute", left:`${s.x}%`, top:`${s.y}%`, width:s.size, height:s.size, borderRadius:"50%", background:"#fff", animation:`now-twinkle ${s.dur}s ${s.del}s ease-in-out infinite` }} />
        ))}
        {/* horizon glow */}
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 100% 30% at 50% 100%,rgba(67,56,202,.06) 0%,transparent 100%)" }} />
      </div>
    </>
  );
}
