'use client';

import { useState } from 'react';
import { LocateFixed, Loader2, X } from 'lucide-react';
import { Coords } from '@/lib/types';

interface Props {
  onLocate: (coords: Coords | null) => void;
  active: boolean;
}

export default function UseMyLocationButton({ onLocate, active }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    if (active) {
      onLocate(null);
      return;
    }
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setError('Geolocation is not supported in this browser.');
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLoading(false);
        onLocate({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      err => {
        setLoading(false);
        setError(
          err.code === 1
            ? 'Location permission denied.'
            : err.code === 3
              ? 'Location request timed out.'
              : 'Could not get your location.'
        );
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 }
    );
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition ${
          active
            ? 'bg-[#00529B] text-white hover:bg-[#0077D9]'
            : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
        } ${loading ? 'opacity-70 cursor-wait' : ''}`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : active ? (
          <X className="w-4 h-4" />
        ) : (
          <LocateFixed className="w-4 h-4" />
        )}
        {active ? 'Stop using my location' : 'Use my location'}
      </button>
      {error && <p className="text-xs text-red-600 mt-1.5 px-1">{error}</p>}
    </div>
  );
}
