"use client";

/** Cosmic dark space background with ambient glowing nebula blobs, starfield dust grid, 
 * and floating subtle particles matching Whisperly theme. */
export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#070410]">
      {/* Subtle starfield particles */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(1.5px 1.5px at 25px 35px, rgba(255,255,255,0.7), transparent), " +
            "radial-gradient(1.5px 1.5px at 120px 180px, rgba(255,255,255,0.45), transparent), " +
            "radial-gradient(1px 1px at 200px 70px, rgba(255,255,255,0.6), transparent), " +
            "radial-gradient(1.8px 1.8px at 290px 240px, rgba(192, 132, 252, 0.8), transparent), " +
            "radial-gradient(1px 1px at 80px 260px, rgba(255,255,255,0.5), transparent), " +
            "radial-gradient(1.5px 1.5px at 340px 110px, rgba(56, 189, 248, 0.6), transparent)",
          backgroundSize: "320px 320px",
        }}
      />

      {/* Grid overlay lines */}
      <div className="absolute inset-0 opacity-15 grid-pattern" />

      {/* Ambient gradient nebula blobs */}
      <div
        className="blob blob-float h-[44rem] w-[44rem] -left-48 -top-44"
        style={{ background: "radial-gradient(circle, rgba(139, 92, 246, 0.45) 0%, rgba(109, 40, 217, 0.15) 70%, transparent 100%)" }}
      />
      <div
        className="blob blob-float-reverse h-[40rem] w-[40rem] -right-36 top-1/6"
        style={{ background: "radial-gradient(circle, rgba(236, 72, 153, 0.35) 0%, rgba(168, 85, 247, 0.1) 70%, transparent 100%)" }}
      />
      <div
        className="blob blob-float h-[36rem] w-[36rem] left-1/3 bottom-[-12rem]"
        style={{ background: "radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, rgba(124, 58, 237, 0.15) 70%, transparent 100%)" }}
      />
    </div>
  );
}

