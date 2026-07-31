// Fixed (not random-at-runtime) positions so server and client render
// identically — Math.random() here would cause a hydration mismatch.
const PARTICLES = [
  { top: "18%", left: "12%", size: 3, color: "#f472b6", duration: 7, delay: 0 },
  { top: "62%", left: "8%", size: 2, color: "#22d3ee", duration: 9, delay: 1.2 },
  { top: "30%", left: "88%", size: 3, color: "#c084fc", duration: 8, delay: 0.6 },
  { top: "72%", left: "92%", size: 2, color: "#f472b6", duration: 6.5, delay: 2 },
  { top: "48%", left: "50%", size: 2, color: "#a78bfa", duration: 10, delay: 1.6 },
  { top: "10%", left: "60%", size: 2, color: "#22d3ee", duration: 7.5, delay: 0.4 },
  { top: "85%", left: "35%", size: 3, color: "#c084fc", duration: 8.5, delay: 2.4 },
  { top: "40%", left: "22%", size: 2, color: "#f472b6", duration: 9.5, delay: 1 },
];

/**
 * Purely decorative drifting dots.
 *
 * Deliberately CSS keyframes rather than framer-motion: eight infinite
 * JS-driven animations meant requestAnimationFrame was writing inline styles
 * on the main thread for the entire life of the page, which made every other
 * interaction on the landing page (menu, accordion, buttons) feel a beat
 * behind on mobile. Animating only transform+opacity in CSS hands these to
 * the compositor, so they cost effectively nothing on the main thread.
 */
export default function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full motion-reduce:animate-none"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 6px ${p.color}`,
            opacity: 0.15,
            animation: `vidibroParticleFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
}
