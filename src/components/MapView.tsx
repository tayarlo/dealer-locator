'use client';

import { useEffect, useRef } from 'react';
import { Dealer } from '@/lib/types';
import L from 'leaflet';

interface MapViewProps {
  dealers: Dealer[];
  selectedDealer: Dealer | null;
  onSelectDealer: (dealer: Dealer) => void;
}

export default function MapView({ dealers, selectedDealer, onSelectDealer }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    import('leaflet').then(L => {
      mapRef.current = L.map(mapContainerRef.current!).setView([3.8, 101.5], 11);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(mapRef.current);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const defaultIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="background:#00529B;width:32px;height:32px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    const selectedIcon = L.divIcon({
      className: 'custom-marker-selected',
      html: `<div style="background:#F47D21;width:40px;height:40px;border-radius:50%;border:4px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;transform:scale(1.2);">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
      </div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    dealers.forEach(dealer => {
      if (dealer.latitude && dealer.longitude) {
        const icon = selectedDealer?.id === dealer.id ? selectedIcon : defaultIcon;
        const marker = L.marker([dealer.latitude, dealer.longitude], { icon })
          .addTo(mapRef.current!)
          .on('click', () => onSelectDealer(dealer));
        markersRef.current.push(marker);
      }
    });

    if (selectedDealer?.latitude && selectedDealer?.longitude) {
      mapRef.current.panTo([selectedDealer.latitude, selectedDealer.longitude], {
        animate: true,
        duration: 0.5
      });
    }
  }, [dealers, selectedDealer, onSelectDealer]);

  return (
    <div className="relative h-full min-h-[400px] rounded-xl overflow-hidden border border-gray-100">
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  );
}
