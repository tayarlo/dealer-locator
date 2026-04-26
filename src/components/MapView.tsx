'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import { Coords, Dealer } from '@/lib/types';

interface MapViewProps {
  dealers: Dealer[];
  selectedDealer: Dealer | null;
  onSelectDealer: (dealer: Dealer) => void;
  userLocation?: Coords | null;
}

const DEFAULT_CENTER: [number, number] = [3.8, 101.7];
const DEFAULT_ZOOM = 7;

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string
  );
}

// Default Michelin Licensee dealer pin — Michelin blue
const dealerIconHtml = `<div style="background:#0033A0;width:32px;height:32px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
</div>`;

// Selected dealer pin — Tayarlo magenta to pop against the cluster of blue
const selectedIconHtml = `<div style="background:#E6116A;width:40px;height:40px;border-radius:50%;border:4px solid white;box-shadow:0 4px 12px rgba(230,17,106,0.45);display:flex;align-items:center;justify-content:center;">
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
</div>`;

const userIconHtml = `<div style="width:18px;height:18px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 0 0 6px rgba(59,130,246,0.25),0 2px 4px rgba(0,0,0,0.2)"></div>`;

export default function MapView({ dealers, selectedDealer, onSelectDealer, userLocation }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const userMarkerRef = useRef<L.Marker | null>(null);
  const onSelectRef = useRef(onSelectDealer);
  onSelectRef.current = onSelectDealer;

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, { zoomControl: true }).setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    const cluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      disableClusteringAtZoom: 15,
      maxClusterRadius: 50,
    });
    map.addLayer(cluster);

    mapRef.current = map;
    clusterRef.current = cluster;

    return () => {
      map.remove();
      mapRef.current = null;
      clusterRef.current = null;
      markersRef.current.clear();
      userMarkerRef.current = null;
    };
  }, []);

  // Sync markers with dealers
  useEffect(() => {
    const cluster = clusterRef.current;
    const map = mapRef.current;
    if (!cluster || !map) return;

    cluster.clearLayers();
    markersRef.current.clear();

    const defaultIcon = L.divIcon({
      className: 'dealer-marker',
      html: dealerIconHtml,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -28],
    });

    const points: L.LatLng[] = [];

    dealers.forEach(dealer => {
      const lat = dealer.latitude;
      const lng = dealer.longitude;
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
      const marker = L.marker([lat as number, lng as number], { icon: defaultIcon });
      const popupHtml = `
        <div style="min-width:180px;font-family:inherit">
          <div style="font-weight:600;color:#111827;margin-bottom:4px;font-size:14px">${escapeHtml(dealer.name)}</div>
          <div style="font-size:12px;color:#6b7280;line-height:1.4">${escapeHtml(dealer.address)}</div>
        </div>
      `;
      marker.bindPopup(popupHtml, { closeButton: true, offset: [0, 0] });
      marker.on('click', () => onSelectRef.current(dealer));
      cluster.addLayer(marker);
      markersRef.current.set(dealer.id, marker);
      points.push(L.latLng(lat as number, lng as number));
    });

    if (points.length > 0 && !selectedDealer) {
      map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 13, animate: true });
    }
    // We deliberately omit selectedDealer from deps — selection handling is in a separate effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealers]);

  // Highlight + zoom to selected dealer
  useEffect(() => {
    const map = mapRef.current;
    const cluster = clusterRef.current;
    if (!map || !cluster) return;

    const defaultIcon = L.divIcon({
      className: 'dealer-marker',
      html: dealerIconHtml,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -28],
    });
    const selectedIcon = L.divIcon({
      className: 'dealer-marker-selected',
      html: selectedIconHtml,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -36],
    });

    markersRef.current.forEach((marker, id) => {
      marker.setIcon(id === selectedDealer?.id ? selectedIcon : defaultIcon);
    });

    if (!selectedDealer) return;
    const lat = selectedDealer.latitude;
    const lng = selectedDealer.longitude;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    const marker = markersRef.current.get(selectedDealer.id);
    if (!marker) return;

    map.flyTo([lat as number, lng as number], 15, { duration: 0.6 });

    const openPopup = () => {
      if (cluster.hasLayer(marker)) {
        cluster.zoomToShowLayer(marker, () => marker.openPopup());
      } else {
        marker.openPopup();
      }
    };
    const t = setTimeout(openPopup, 650);
    return () => clearTimeout(t);
  }, [selectedDealer]);

  // User location marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'user-marker',
        html: userIconHtml,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
        zIndexOffset: 1000,
        interactive: false,
      }).addTo(map);

      if (!selectedDealer) {
        map.flyTo([userLocation.lat, userLocation.lng], 12, { duration: 0.6 });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation]);

  return (
    <div className="relative h-full min-h-[400px] rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css"
        crossOrigin=""
      />
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css"
        crossOrigin=""
      />
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
