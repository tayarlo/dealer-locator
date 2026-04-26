interface TayarloLogoProps {
  /** Visual height of the logo in pixels. Width auto-scales. */
  height?: number;
  className?: string;
}

/**
 * Official Tayarlo brand mark — renders just the logo PNG. Pair it
 * with <MichelinLicenseeBadge /> on its right via a flex container
 * for the standard "Tayarlo | Michelin licensee" header lockup.
 */
export default function TayarloLogo({
  height = 44,
  className = '',
}: TayarloLogoProps) {
  return (
    <div className={`inline-flex items-center ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/tayarlo-logo.png"
        alt="Tayarlo"
        height={height}
        style={{ height, width: 'auto' }}
        className="object-contain select-none"
        draggable={false}
      />
    </div>
  );
}
