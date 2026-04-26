interface MichelinLicenseeBadgeProps {
  /** Compact = pill-style mini-badge for cards. Full = larger header pill. */
  variant?: 'compact' | 'full';
  className?: string;
}

/**
 * Trust mark certifying every dealer in the directory is an authorised
 * Michelin Lifestyle accessories licensee. Uses the official Michelin
 * logo (Bibendum + wordmark) from /public.
 */
export default function MichelinLicenseeBadge({
  variant = 'full',
  className = '',
}: MichelinLicenseeBadgeProps) {
  if (variant === 'compact') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${className}`}
        style={{
          background: 'var(--michelin-blue-tint)',
          color: 'var(--michelin-blue)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/michelin-logo.png"
          alt="Michelin"
          className="h-3.5 w-auto select-none"
          style={{ mixBlendMode: 'multiply' }}
          draggable={false}
        />
        Vehicle Accessories Licensee
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-3 pl-3 pr-4 py-2 rounded-full border bg-white ${className}`}
      style={{ borderColor: 'rgba(0,51,160,0.18)' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/michelin-logo.png"
        alt="Michelin"
        className="h-9 w-auto select-none"
        style={{ mixBlendMode: 'multiply' }}
        draggable={false}
      />
      <span
        className="h-9 w-px"
        style={{ background: 'rgba(0,0,0,0.12)' }}
        aria-hidden="true"
      />
      <div className="flex flex-col leading-tight gap-0.5">
        <span
          className="text-[10px] font-medium uppercase tracking-[0.16em]"
          style={{ color: 'var(--ink-soft)' }}
        >
          Vehicle Accessories
        </span>
        <span
          className="text-[15px] font-bold leading-none whitespace-nowrap"
          style={{ color: 'var(--michelin-blue)' }}
        >
          Licensee
        </span>
      </div>
    </div>
  );
}
