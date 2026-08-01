/**
 * One inline SVG, reused on every directory page.
 *
 * It explains the single thing that genuinely differentiates the product — the
 * call goes directly between two browsers, and the server only introduces them
 * — which is both a selling point and the reason the privacy claims are true
 * rather than a policy promise.
 *
 * Inline SVG rather than a photograph, for three reasons: it costs nothing and
 * needs no licence, it stays sharp at any size and adds no layout shift, and on
 * a site about meeting real strangers a stock or generated face would be the
 * worst possible asset. It is also the approach the ranking competitor actually
 * takes — their pages carry 74 inline SVGs and essentially no photography.
 */
export default function MatchingDiagram({ className = "" }: { className?: string }) {
  return (
    <figure className={`my-10 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-6 sm:px-8 ${className}`}>
      <svg
        viewBox="0 0 560 200"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram: the signaling server introduces two people, then the video and audio travel directly between their two browsers without passing through it."
      >
        <defs>
          <linearGradient id="vdWire" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="50%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>

        {/* Signaling server — dashed lines up to it, because it only introduces */}
        <g>
          <rect x="238" y="12" width="84" height="34" rx="10" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.16)" />
          <text x="280" y="33" textAnchor="middle" fill="#c4b5fd" fontSize="12" fontWeight="600">
            server
          </text>
          <path d="M120 96 C 150 60, 210 44, 238 34" fill="none" stroke="rgba(196,181,253,0.35)" strokeWidth="1.6" strokeDasharray="4 4" />
          <path d="M440 96 C 410 60, 350 44, 322 34" fill="none" stroke="rgba(196,181,253,0.35)" strokeWidth="1.6" strokeDasharray="4 4" />
          <text x="280" y="62" textAnchor="middle" fill="rgba(196,181,253,0.55)" fontSize="9.5">
            introduces only
          </text>
        </g>

        {/* The two peers */}
        {[
          { x: 74, label: "you" },
          { x: 394, label: "a stranger" },
        ].map((p) => (
          <g key={p.label}>
            <rect x={p.x} y="72" width="92" height="76" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.16)" />
            <circle cx={p.x + 46} cy="102" r="12" fill="none" stroke="#c084fc" strokeWidth="2" />
            <path
              d={`M${p.x + 28} 130 a 18 18 0 0 1 36 0`}
              fill="none"
              stroke="#c084fc"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <text x={p.x + 46} y="168" textAnchor="middle" fill="#d8b4fe" fontSize="11.5" fontWeight="600">
              {p.label}
            </text>
          </g>
        ))}

        {/* The direct connection — solid, thick, the point of the whole diagram */}
        <path d="M166 110 L 394 110" stroke="url(#vdWire)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="280" cy="110" r="4.5" fill="#f472b6" />
        <text x="280" y="94" textAnchor="middle" fill="#f9a8d4" fontSize="10.5" fontWeight="700">
          direct · encrypted
        </text>
        <text x="280" y="132" textAnchor="middle" fill="rgba(249,168,212,0.6)" fontSize="9.5">
          video and audio never touch our server
        </text>
      </svg>

      <figcaption className="mt-4 text-xs leading-relaxed text-purple-200/70">
        The server only introduces the two of you. Once connected, video and audio travel straight
        between the two browsers — which is why there is nothing for us to record, and no account
        for a conversation to be attached to.
      </figcaption>
    </figure>
  );
}
