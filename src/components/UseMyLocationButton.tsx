'use client';

import { useEffect, useState } from 'react';
import { LocateFixed, Loader2, X } from 'lucide-react';
import { Coords } from '@/lib/types';

interface Props {
  onLocate: (coords: Coords | null) => void;
  active: boolean;
}

type ErrorKind =
  | { kind: 'unsupported' }
  | { kind: 'iframe'; topUrl: string | null }
  | { kind: 'denied' }
  | { kind: 'unavailable'; message: string }
  | { kind: 'timeout' };

export default function UseMyLocationButton({ onLocate, active }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorKind | null>(null);
  const [inIframe, setInIframe] = useState(false);
  const [topHref, setTopHref] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const framed = window.self !== window.top;
    setInIframe(framed);
    if (framed) {
      // Best-effort: same-origin iframes can read top.location.href; cross-origin will throw.
      try {
        setTopHref(window.top?.location.href ?? null);
      } catch {
        setTopHref(null);
      }
    }
  }, []);

  const handleClick = async () => {
    if (active) {
      onLocate(null);
      return;
    }
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setError({ kind: 'unsupported' });
      return;
    }
    if (inIframe) {
      setError({ kind: 'iframe', topUrl: topHref });
      return;
    }

    // If the Permissions API knows we're already denied, surface that
    // up front instead of triggering another silent rejection.
    try {
      const status = await navigator.permissions?.query?.({
        name: 'geolocation' as PermissionName,
      });
      if (status?.state === 'denied') {
        setError({ kind: 'denied' });
        return;
      }
    } catch {
      // permissions API unavailable — fall through to getCurrentPosition
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
        if (err.code === 1) setError({ kind: 'denied' });
        else if (err.code === 2) setError({ kind: 'unavailable', message: err.message });
        else if (err.code === 3) setError({ kind: 'timeout' });
        else setError({ kind: 'unavailable', message: err.message });
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 }
    );
  };

  const ErrorMessage = () => {
    if (!error) return null;
    switch (error.kind) {
      case 'unsupported':
        return <>Your browser doesn&apos;t support location.</>;
      case 'iframe':
        return (
          <>
            Location is blocked inside this preview. Open the page in a new
            tab to use it
            {error.topUrl && (
              <>
                {' '}—{' '}
                <a
                  href="http://localhost:3000/"
                  target="_blank"
                  rel="noreferrer"
                  className="underline font-medium"
                >
                  open localhost:3000
                </a>
              </>
            )}
            .
          </>
        );
      case 'denied':
        return (
          <>
            Location was blocked. Click the 🔒 icon in your address bar →
            Site settings → Location → <strong>Allow</strong>, then reload.
          </>
        );
      case 'timeout':
        return <>Location request timed out — please try again.</>;
      case 'unavailable':
        return <>Could not get your location ({error.message}).</>;
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition ${
          active
            ? 'bg-[#E6116A] text-white hover:bg-[#C00E5C]'
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
      {error && (
        <p className="text-xs text-amber-700 mt-1.5 px-1 leading-relaxed">
          <ErrorMessage />
        </p>
      )}
    </div>
  );
}
