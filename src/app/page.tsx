'use client';

import { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, List, Map as MapIcon, Loader2 } from 'lucide-react';
import FilterPanel from '@/components/FilterPanel';
import DealerCard from '@/components/DealerCard';
import { Dealer } from '@/lib/types';
import { SAMPLE_DEALERS, filterDealers, getUniqueAreas } from '@/lib/dealers';

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-gray-100 rounded-xl">
      <Loader2 className="w-8 h-8 animate-spin text-[#00529B]" />
    </div>
  ),
});

export default function Home() {
  const [dealers] = useState<Dealer[]>(SAMPLE_DEALERS);
  const [filters, setFilters] = useState({ state: '', area: '', products: [] as string[] });
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'list' | 'map'>('split');

  const filteredDealers = useMemo(() => filterDealers(dealers, filters), [dealers, filters]);
  const areas = useMemo(() => getUniqueAreas(dealers), [dealers]);

  const handleSelectDealer = useCallback((dealer: Dealer) => {
    setSelectedDealer(prev => prev?.id === dealer.id ? null : dealer);
  }, []);

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00529B] to-[#0077D9] rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-lg">Dealer Locator</h1>
                <p className="text-xs text-gray-500">Michelin Lifestyle</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white shadow-sm text-[#00529B]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`p-2 rounded-md transition-colors hidden md:block ${
                  viewMode === 'split'
                    ? 'bg-white shadow-sm text-[#00529B]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <MapIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'map'
                    ? 'bg-white shadow-sm text-[#00529B]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <MapIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`mb-6 ${viewMode === 'map' ? 'hidden' : ''}`}>
          <FilterPanel
            filters={filters}
            onFilterChange={setFilters}
            areas={areas}
            dealerCount={filteredDealers.length}
          />
        </div>

        {viewMode === 'list' && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDealers.map(dealer => (
              <DealerCard
                key={dealer.id}
                dealer={dealer}
                isSelected={selectedDealer?.id === dealer.id}
                onSelect={handleSelectDealer}
              />
            ))}
            {filteredDealers.length === 0 && (
              <div className="col-span-full text-center py-12">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No dealers found matching your criteria</p>
                <button
                  onClick={() => setFilters({ state: '', area: '', products: [] })}
                  className="mt-4 text-[#00529B] hover:text-[#0077D9] font-medium"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        )}

        {viewMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
              <FilterPanel
                filters={filters}
                onFilterChange={setFilters}
                areas={areas}
                dealerCount={filteredDealers.length}
              />
              <div className="space-y-4">
                {filteredDealers.map(dealer => (
                  <DealerCard
                    key={dealer.id}
                    dealer={dealer}
                    isSelected={selectedDealer?.id === dealer.id}
                    onSelect={handleSelectDealer}
                  />
                ))}
                {filteredDealers.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                    <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No dealers found</p>
                  </div>
                )}
              </div>
            </div>
            <div className="sticky top-24 h-[calc(100vh-200px)]">
              <MapView
                dealers={filteredDealers}
                selectedDealer={selectedDealer}
                onSelectDealer={handleSelectDealer}
              />
            </div>
          </div>
        )}

        {viewMode === 'map' && (
          <div className="h-[calc(100vh-180px)]">
            <MapView
              dealers={filteredDealers}
              selectedDealer={selectedDealer}
              onSelectDealer={handleSelectDealer}
            />
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            © 2026 Tayarlo Sdn Bhd. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
