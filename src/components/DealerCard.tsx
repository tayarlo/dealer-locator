'use client';

import { Search, MapPin, Phone, MessageCircle, Navigation, Filter, X } from 'lucide-react';
import { Dealer } from '@/lib/types';
import { useState, useMemo } from 'react';

interface DealerCardProps {
  dealer: Dealer;
  isSelected: boolean;
  onSelect: (dealer: Dealer) => void;
}

export default function DealerCard({ dealer, isSelected, onSelect }: DealerCardProps) {
  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const phone = dealer.whatsapp.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone}`, '_blank');
  };

  const handleDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    const address = encodeURIComponent(dealer.address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank');
  };

  return (
    <div
      onClick={() => onSelect(dealer)}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-[#00529B] bg-blue-50 shadow-md'
          : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 text-lg leading-tight">{dealer.name}</h3>
        {isSelected && (
          <span className="px-2 py-1 bg-[#00529B] text-white text-xs rounded-full">
            Selected
          </span>
        )}
      </div>

      <div className="flex items-start gap-2 text-gray-600 mb-3">
        <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-[#00529B]" />
        <p className="text-sm leading-relaxed">{dealer.address}</p>
      </div>

      <div className="flex items-center gap-2 text-gray-600 mb-4">
        <Phone className="w-4 h-4 flex-shrink-0 text-[#00529B]" />
        <p className="text-sm">{dealer.phone}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {dealer.products.map((product, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium"
          >
            {product}
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleDirections}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Navigation className="w-4 h-4" />
          Directions
        </button>
        <button
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
