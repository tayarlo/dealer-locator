interface TayarloLogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

/**
 * Tayarlo brand mark — outlined car icon over the magenta "Tayarlo" wordmark.
 * Pure SVG, scales cleanly. Set showWordmark=false for a tight square mark
 * (used in tight spaces like map markers).
 */
export default function TayarloLogo({
  size = 40,
  showWordmark = true,
  className = '',
}: TayarloLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Soft magenta halo to anchor the icon visually */}
        <rect
          x="2"
          y="2"
          width="60"
          height="60"
          rx="16"
          fill="#FCE8F1"
        />
        {/* Outlined car icon — matches Tayarlo logo style */}
        <path
          d="M16 38 L16 32 C16 30.3 17.3 29 19 29 L21.5 29 L24 22.5 C24.4 21.4 25.5 20.7 26.7 20.7 L37.3 20.7 C38.5 20.7 39.6 21.4 40 22.5 L42.5 29 L45 29 C46.7 29 48 30.3 48 32 L48 38 L44 38 L44 41 C44 42.1 43.1 43 42 43 C40.9 43 40 42.1 40 41 L40 38 L24 38 L24 41 C24 42.1 23.1 43 22 43 C20.9 43 20 42.1 20 41 L20 38 Z"
          stroke="#1F1A2E"
          strokeWidth="2"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Window split */}
        <path
          d="M26 29 L28 23.5 L36 23.5 L38 29"
          stroke="#1F1A2E"
          strokeWidth="2"
          strokeLinejoin="round"
          fill="none"
        />
        <line x1="32" y1="23.5" x2="32" y2="29" stroke="#1F1A2E" strokeWidth="2" />
        {/* Wheels */}
        <circle cx="22" cy="38" r="2.4" fill="#1F1A2E" />
        <circle cx="42" cy="38" r="2.4" fill="#1F1A2E" />
      </svg>

      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span
            className="font-bold tracking-tight"
            style={{
              color: 'var(--tayarlo-primary)',
              fontSize: size * 0.55,
              letterSpacing: '-0.02em',
            }}
          >
            Tayarlo
          </span>
          <span
            className="text-[10px] uppercase tracking-[0.18em] mt-0.5 font-medium"
            style={{ color: 'var(--ink-soft)' }}
          >
            Dealer Locator
          </span>
        </div>
      )}
    </div>
  );
}
