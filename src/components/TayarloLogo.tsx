interface TayarloLogoProps {
  /** Visual height of the logo in pixels. Width auto-scales. */
  height?: number;
  /** Show the "Dealer Locator" eyebrow next to the mark. */
  showSubtitle?: boolean;
  className?: string;
}

/**
 * Official Tayarlo brand mark — uses the real logo PNG from /public.
 * For tight spaces, set showSubtitle={false} to render the mark alone.
 */
export default function TayarloLogo({
  height = 44,
  showSubtitle = true,
  className = '',
}: TayarloLogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/tayarlo-logo.png"
        alt="Tayarlo"
        height={height}
        style={{ height, width: 'auto' }}
        className="object-contain select-none"
        draggable={false}
      />
      {showSubtitle && (
        <span
          className="hidden sm:inline-block text-[10px] uppercase tracking-[0.18em] font-semibold pl-3 border-l"
          style={{
            color: 'var(--ink-soft)',
            borderColor: 'rgba(0,0,0,0.12)',
          }}
        >
          Dealer
          <br />
          Locator
        </span>
      )}
    </div>
  );
}
