import { Wind, Droplets, Gauge, Wrench, CircleDot } from 'lucide-react';

interface ProductShowcaseProps {
  className?: string;
}

const PRODUCTS = [
  { label: 'TPMS Valve Caps', icon: CircleDot },
  { label: 'Tyre Inflator', icon: Gauge },
  { label: 'Wiper Blades', icon: Wind },
  { label: 'Wiper Fluid', icon: Droplets },
  { label: 'Tyre Repair Kit', icon: Wrench },
];

/**
 * Horizontal showcase of the 5 Michelin Lifestyle accessories every
 * dealer in the directory is licensed to carry. Sits between the header
 * and the search/list — sets product expectations before the user dives in.
 */
export default function ProductShowcase({ className = '' }: ProductShowcaseProps) {
  return (
    <section
      className={`relative overflow-hidden ${className}`}
      style={{
        background:
          'linear-gradient(135deg, rgba(0,51,160,0.04) 0%, rgba(230,17,106,0.05) 100%)',
        borderTop: '1px solid rgba(0,0,0,0.04)',
        borderBottom: '1px solid rgba(0,0,0,0.04)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
          <div className="flex-shrink-0">
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: 'var(--michelin-blue)' }}
            >
              Every dealer carries
            </p>
            <h2 className="text-base sm:text-lg font-bold mt-1 leading-tight" style={{ color: 'var(--ink)' }}>
              Genuine Michelin Lifestyle
              <br className="hidden sm:inline" /> Accessories
            </h2>
          </div>

          <div className="flex-1">
            <ul className="flex flex-wrap gap-2 sm:gap-2.5">
              {PRODUCTS.map(({ label, icon: Icon }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border text-sm font-medium shadow-sm"
                  style={{
                    borderColor: 'rgba(0,51,160,0.12)',
                    color: 'var(--ink)',
                  }}
                >
                  <span
                    className="flex items-center justify-center w-7 h-7 rounded-md"
                    style={{ background: 'var(--michelin-blue-tint)' }}
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{ color: 'var(--michelin-blue)' }}
                      strokeWidth={2.2}
                    />
                  </span>
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
