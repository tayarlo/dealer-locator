interface ProductShowcaseProps {
  className?: string;
}

const PRODUCTS = [
  { label: 'TPMS', img: '/products/tpms.png' },
  { label: 'Tyre Inflator', img: '/products/inflator.png' },
  { label: 'Wiper Blades', img: '/products/wiper.png' },
  { label: 'Wiper Fluid', img: '/products/wiper-fluid.png' },
  { label: 'Tyre Repair Kit', img: '/products/repair-kit.png' },
];

/**
 * Hero band below the header. Real product photography (with white
 * backgrounds blended out via mix-blend-mode) sells the assortment far
 * better than abstract icons.
 */
export default function ProductShowcase({ className = '' }: ProductShowcaseProps) {
  return (
    <section
      className={`relative overflow-hidden ${className}`}
      style={{
        background:
          'linear-gradient(135deg, rgba(0,51,160,0.05) 0%, rgba(230,17,106,0.05) 100%)',
        borderTop: '1px solid rgba(0,0,0,0.05)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-10">
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/michelin-logo.png"
              alt="Michelin"
              className="h-7 w-auto select-none"
              style={{ mixBlendMode: 'multiply' }}
              draggable={false}
            />
            <span
              className="hidden sm:block h-8 w-px"
              style={{ background: 'rgba(0,0,0,0.12)' }}
              aria-hidden="true"
            />
            <h2 className="text-sm sm:text-base font-semibold leading-snug" style={{ color: 'var(--ink)' }}>
              Vehicle Accessories<br className="hidden sm:inline" />
              <span className="font-normal" style={{ color: 'var(--ink-soft)' }}> stocked at every dealer</span>
            </h2>
          </div>

          <div className="flex-1">
            <ul className="flex flex-wrap gap-2 sm:gap-2.5">
              {PRODUCTS.map(({ label, img }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 pl-1.5 pr-3.5 py-1 rounded-xl bg-white border text-sm font-medium shadow-sm"
                  style={{
                    borderColor: 'rgba(0,51,160,0.12)',
                    color: 'var(--ink)',
                  }}
                >
                  {/* Product photo sits directly on the white chip — mix-blend
                      multiply makes the white photo background invisible. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={label}
                    className="w-10 h-10 object-contain flex-shrink-0"
                    style={{ mixBlendMode: 'multiply' }}
                    draggable={false}
                  />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
