'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { Columns2, List, Loader2, Map as MapIcon, MapPin } from 'lucide-react';
import FilterPanel from '@/components/FilterPanel';
import DealerCard from '@/components/DealerCard';
import SearchBar from '@/components/SearchBar';
import UseMyLocationButton from '@/components/UseMyLocationButton';
import MobileBottomSheet from '@/components/MobileBottomSheet';
import TayarloLogo from '@/components/TayarloLogo';
import MichelinLicenseeBadge from '@/components/MichelinLicenseeBadge';
import ProductShowcase from '@/components/ProductShowcase';
import { Coords, Dealer, DealerWithDistance } from '@/lib/types';
import {
  filterDealers,
  getUniqueAreas,
  searchDealers,
  sortByDistance,
} from '@/lib/dealers';

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-gray-100 rounded-xl">
      <Loader2 className="w-8 h-8 animate-spin text-[#E6116A]" />
    </div>
  ),
});

type ViewMode = 'split' | 'list' | 'map';

const EMPTY_FILTERS = { state: '', area: '', products: [] as string[] };

function DealerLocator() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<Coords | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/dealers')
      .then(async res => {
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setLoadState('error');
          setLoadError(data.error ?? `Request failed: ${res.status}`);
          return;
        }
        setDealers(data.dealers ?? []);
        setLoadState('ready');
      })
      .catch(err => {
        if (cancelled) return;
        setLoadState('error');
        setLoadError(err instanceof Error ? err.message : 'Network error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const dealerIdFromUrl = searchParams.get('dealer');
  const selectedDealer = useMemo(
    () => dealers.find(d => d.id === dealerIdFromUrl) ?? null,
    [dealers, dealerIdFromUrl]
  );

  const setSelectedDealerId = useCallback(
    (id: string | null) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      if (id) params.set('dealer', id);
      else params.delete('dealer');
      const qs = params.toString();
      router.replace(qs ? `?${qs}` : '?', { scroll: false });
    },
    [router, searchParams]
  );

  const handleSelectDealer = useCallback(
    (dealer: Dealer) => {
      const next = selectedDealer?.id === dealer.id ? null : dealer.id;
      setSelectedDealerId(next);
      if (next) setSheetOpen(true);
    },
    [selectedDealer, setSelectedDealerId]
  );

  const visibleDealers = useMemo<Array<Dealer | DealerWithDistance>>(() => {
    let result: Dealer[] = filterDealers(dealers, filters);
    result = searchDealers(result, searchQuery);
    if (userLocation) return sortByDistance(result, userLocation);
    return result;
  }, [dealers, filters, searchQuery, userLocation]);

  const areas = useMemo(() => {
    const scoped = filters.state ? dealers.filter(d => d.state === filters.state) : dealers;
    return getUniqueAreas(scoped);
  }, [dealers, filters.state]);

  // Scroll selected card into view in whichever list is visible.
  useEffect(() => {
    if (!selectedDealer) return;
    const els = document.querySelectorAll(`[data-dealer-id="${selectedDealer.id}"]`);
    els.forEach(el => el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
  }, [selectedDealer]);

  const clearAll = () => {
    setFilters(EMPTY_FILTERS);
    setSearchQuery('');
  };

  const hasActiveFilters =
    !!filters.state ||
    !!filters.area ||
    filters.products.length > 0 ||
    searchQuery.trim().length > 0;
  const noResults = visibleDealers.length === 0;

  const emptyState = (
    <div className="text-center py-10 px-4 bg-white rounded-xl border border-gray-100">
      <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p className="text-gray-700 font-medium mb-1">No dealers found</p>
      <p className="text-sm text-gray-500 mb-4">Try one of these:</p>
      <div className="flex flex-wrap gap-2 justify-center">
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100"
          >
            Clear search
          </button>
        )}
        {filters.products.length > 0 && (
          <button
            onClick={() => setFilters({ ...filters, products: [] })}
            className="px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100"
          >
            Remove product filter
          </button>
        )}
        {filters.area && (
          <button
            onClick={() => setFilters({ ...filters, area: '' })}
            className="px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100"
          >
            Show all areas{filters.state ? ` in ${filters.state}` : ''}
          </button>
        )}
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="px-3 py-1.5 text-sm bg-[#E6116A] text-white rounded-lg hover:bg-[#C00E5C]"
          >
            Clear everything
          </button>
        )}
      </div>
    </div>
  );

  const controlsBlock = (
    <div className="space-y-3">
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <UseMyLocationButton
        active={!!userLocation}
        onLocate={setUserLocation}
      />
      <FilterPanel
        filters={filters}
        onFilterChange={setFilters}
        areas={areas}
        dealerCount={visibleDealers.length}
      />
    </div>
  );

  const loadingState = (
    <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-100">
      <Loader2 className="w-6 h-6 animate-spin text-[#E6116A]" />
      <span className="ml-3 text-sm text-gray-500">Loading dealers…</span>
    </div>
  );

  const errorState = (
    <div className="text-center py-10 px-4 bg-red-50 rounded-xl border border-red-100">
      <p className="text-red-700 font-medium mb-1">Could not load dealers</p>
      <p className="text-sm text-red-600 mb-3">{loadError}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-3 py-1.5 text-sm bg-white border border-red-200 rounded-lg hover:bg-red-50 text-red-700"
      >
        Try again
      </button>
    </div>
  );

  const dealerList = (
    <div className="space-y-3">
      {loadState === 'loading' && loadingState}
      {loadState === 'error' && errorState}
      {loadState === 'ready' && (
        <>
          {visibleDealers.map(dealer => (
            <DealerCard
              key={dealer.id}
              dealer={dealer}
              isSelected={selectedDealer?.id === dealer.id}
              onSelect={handleSelectDealer}
            />
          ))}
          {noResults && emptyState}
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen lg:min-h-[unset]">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            <TayarloLogo size={36} />

            <div className="hidden md:block">
              <MichelinLicenseeBadge variant="full" />
            </div>

            <div className="hidden lg:flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('list')}
                aria-label="List view"
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white shadow-sm text-[#E6116A]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('split')}
                aria-label="Split view"
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'split'
                    ? 'bg-white shadow-sm text-[#E6116A]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Columns2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                aria-label="Map view"
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'map'
                    ? 'bg-white shadow-sm text-[#E6116A]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <MapIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Compact licensee badge for narrow screens (header is too tight) */}
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-2 flex justify-center">
          <MichelinLicenseeBadge variant="full" />
        </div>
      </header>

      {/* Product showcase — only visible in desktop layout (mobile uses bottom sheet over a full-bleed map) */}
      {!isMobile && <ProductShowcase />}

      {/* Mobile layout: map fills viewport with bottom sheet on top */}
      {isMobile && (
        <div>
          <div className="fixed inset-x-0 top-16 bottom-0">
            <MapView
              dealers={visibleDealers}
              selectedDealer={selectedDealer}
              onSelectDealer={handleSelectDealer}
              userLocation={userLocation}
            />
          </div>

          <MobileBottomSheet
            open={sheetOpen}
            onOpenChange={setSheetOpen}
            title={`${visibleDealers.length} ${visibleDealers.length === 1 ? 'dealer' : 'dealers'}`}
            subtitle={hasActiveFilters ? 'Filtered' : 'Tap to browse'}
          >
            <div className="p-4 space-y-3">
              {controlsBlock}
              <div className="pt-2">{dealerList}</div>
            </div>
          </MobileBottomSheet>
        </div>
      )}

      {/* Desktop layout: 3 view modes */}
      {!isMobile && (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {viewMode === 'list' && (
          <>
            <div className="mb-6">{controlsBlock}</div>
            {loadState === 'loading' && loadingState}
            {loadState === 'error' && errorState}
            {loadState === 'ready' && (
              <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {visibleDealers.map(dealer => (
                    <DealerCard
                      key={dealer.id}
                      dealer={dealer}
                      isSelected={selectedDealer?.id === dealer.id}
                      onSelect={handleSelectDealer}
                    />
                  ))}
                </div>
                {noResults && <div className="mt-6">{emptyState}</div>}
              </>
            )}
          </>
        )}

        {viewMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4 max-h-[calc(100vh-130px)] overflow-y-auto pr-2">
              {controlsBlock}
              {dealerList}
            </div>
            <div className="sticky top-24 h-[calc(100vh-130px)]">
              <MapView
                dealers={visibleDealers}
                selectedDealer={selectedDealer}
                onSelectDealer={handleSelectDealer}
                userLocation={userLocation}
              />
            </div>
          </div>
        )}

        {viewMode === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
            <div className="space-y-4">{controlsBlock}</div>
            <div className="h-[calc(100vh-130px)]">
              <MapView
                dealers={visibleDealers}
                selectedDealer={selectedDealer}
                onSelectDealer={handleSelectDealer}
                userLocation={userLocation}
              />
            </div>
          </div>
        )}
      </main>
      )}

      <footer className="hidden lg:block bg-white border-t border-gray-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            © 2026 Tayarlo Sdn Bhd. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#E6116A]" />
        </div>
      }
    >
      <DealerLocator />
    </Suspense>
  );
}
