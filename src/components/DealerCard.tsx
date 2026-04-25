'use client';

import { Clock, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react';
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
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-[#00529B] bg-blue-50 shadow-md'
          : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
      }`}
    >
      <div className="flex justify-between items-start gap-2 mb-2">
        <h3 className="font-semibold text-gray-900 text-base sm:text-lg leading-tight">
          {dealer.name}
        </h3>
        {distanceKm != null && (
          <span className="px-2 py-0.5 bg-[#00529B]/10 text-[#00529B] text-xs rounded-full whitespace-nowrap font-medium flex-shrink-0">
            {formatDistance(distanceKm)}
          </span>
        )}
      </div>

      <div className="flex items-start gap-2 text-gray-600 mb-2">
        <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-[#00529B]" />
        <p className="text-sm leading-relaxed">{dealer.address}</p>
      </div>

      <a
        href={`tel:${dealer.phone.replace(/\s/g, '')}`}
        onClick={handleCall}
        className="flex items-center gap-2 text-gray-600 mb-2 hover:text-[#00529B] transition-colors"
      >
        <Phone className="w-4 h-4 flex-shrink-0 text-[#00529B]" />
        <span className="text-sm">{dealer.phone}</span>
      </a>

      {dealer.hours && (
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <Clock className="w-4 h-4 flex-shrink-0 text-[#00529B]" />
          <span className="text-sm">{dealer.hours}</span>
        </div>
      )}

      {dealer.products.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {dealer.products.map(product => (
            <span
              key={product}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium"
            >
              {product}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleDirections}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Navigation className="w-4 h-4" />
          Directions
        </button>
        <button
          type="button"
          onClick={handleWhatsApp}
          className="flex items-center gap-2 px-3 py-2 bg-[#25D366] rounded-lg text-sm font-medium text-white hover:bg-[#20BD5A] transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </button>
      </div>
    </div>
  );
}
