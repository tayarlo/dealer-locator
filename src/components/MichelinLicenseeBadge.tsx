import { ShieldCheck } from 'lucide-react';

interface MichelinLicenseeBadgeProps {
  /** Compact = pill-style mini-badge for cards. Full = larger header pill. */
  variant?: 'compact' | 'full';
  className?: string;
}

/**
 * Trust mark shown beside dealer info / in the header to certify
 * every dealer in the directory is an Official Michelin Licensee
 * carrying genuine Michelin Lifestyle accessories.
 */
export default function MichelinLicenseeBadge({
  variant = 'full',
  className = '',
}: MichelinLicenseeBadgeProps) {
  if (variant === 'compact') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${className}`}
        style={{
          background: 'var(--michelin-blue-tint)',
          color: 'var(--michelin-blue)',
        }}
      >
        <ShieldCheck className="w-3 h-3" strokeWidth={2.5} />
        Official Michelin Licensee
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2.5 pl-2.5 pr-3.5 py-1.5 rounded-full border ${className}`}
      style={{
        background: 'white',
        borderColor: 'var(--michelin-blue)',
      }}
    >
      <span
        className="flex items-center justify-center w-6 h-6 rounded-full"
        style={{ background: 'var(--michelin-blue)' }}
      >
        <ShieldCheck className="w-3.5 h-3.5 text-white" strokeWidth={2.6} />
      </span>
      <div className="flex flex-col leading-tight">
        <span
          className="text-[10px] font-medium uppercase tracking-[0.14em]"
          style={{ color: 'var(--ink-soft)' }}
        >
          Official
        </span>
        <span
          className="text-[13px] font-bold leading-none"
          style={{ color: 'var(--michelin-blue)' }}
        >
          Michelin Licensee
        </span>
      </div>
    </div>
  );
}
