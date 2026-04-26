'use client';

import { Clock, MapPin, MessageCircle, Navigation, Phone, ShieldCheck } from 'lucide-react';
import { Dealer, DealerWithDistance } from '@/lib/types';

interface DealerCardProps {
  dealer: Dealer | DealerWithDistance;
  isSelected: boolean;
  onSelect: (dealer: Dealer) => void;
}

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

export default function DealerCard({ dealer, isSelected, onSelect }: DealerCardProps) {
  const distanceKm = (dealer as DealerWithDistance).distanceKm;

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const phone = dealer.whatsapp.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone}`, '_blank');
  };

  const handleDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    const dest =
      dealer.latitude != null && dealer.longitude != null
        ? `${dealer.latitude},${dealer.longitude}`
        : encodeURIComponent(dealer.address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, '_blank');
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={() => onSelect(dealer)}
      data-dealer-id={dealer.id}
      className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-[#E6116A] bg-[#FCE8F1]/40 shadow-[0_8px_24px_-12px_rgba(230,17,106,0.4)]'
          : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-md'
      }`}
    >
      {/* Trust strip + distance */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
          style={{ background: 'var(--michelin-blue-tint)', color: 'var(--michelin-blue)' }}
        >
          <ShieldCheck className="w-3 h-3" strokeWidth={2.5} />
          Michelin Licensee
        </span>
        {distanceKm != null && (
          <span className="px-2.5 py-0.5 bg-[#E6116A] text-white text-xs rounded-full whitespace-nowrap font-semibold">
            {formatDistance(distanceKm)}
          </span>
        )}
      </div>

      <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-snug mb-3">
        {dealer.name}
      </h3>

      <div className="flex items-start gap-2 text-gray-600 mb-2">
        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#E6116A]" />
        <p className="text-sm leading-relaxed">{dealer.address}</p>
      </div>

      <a
        href={`tel:${dealer.phone.replace(/\s/g, '')}`}
        onClick={handleCall}
        className="flex items-center gap-2 text-gray-600 mb-2 hover:text-[#E6116A] transition-colors"
      >
        <Phone className="w-4 h-4 flex-shrink-0 text-[#E6116A]" />
        <span className="text-sm">{dealer.phone}</span>
      </a>

      {dealer.hours && (
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <Clock className="w-4 h-4 flex-shrink-0 text-[#E6116A]" />
          <span className="text-sm">{dealer.hours}</span>
        </div>
      )}

      {dealer.products.length > 0 && (
        <div className="mt-3 mb-4">
          <p
            className="text-[10px] font-semibold uppercase tracking-wider mb-1.5"
            style={{ color: 'var(--ink-soft)' }}
          >
            Carries
          </p>
          <div className="flex flex-wrap gap-1.5">
            {dealer.products.map(product => (
              <span
                key={product}
                className="px-2 py-1 text-xs rounded-md font-medium border"
                style={{
                  background: 'var(--michelin-blue-tint)',
                  color: 'var(--michelin-blue)',
                  borderColor: 'rgba(0,51,160,0.15)',
                }}
              >
                {product}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={handleDirections}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-[#E6116A] rounded-lg text-sm font-semibold text-white hover:bg-[#C00E5C] transition-colors shadow-sm"
        >
          <Navigation className="w-4 h-4" />
          Directions
        </button>
        <button
          type="button"
          onClick={handleWhatsApp}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-[#25D366] rounded-lg text-sm font-semibold text-white hover:bg-[#20BD5A] transition-colors shadow-sm"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </button>
      </div>
    </div>
  );
}
