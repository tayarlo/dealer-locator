'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, X, ChevronDown, Check } from 'lucide-react';
import { STATES, PRODUCTS } from '@/lib/types';

interface FilterPanelProps {
  filters: { state: string; area: string; products: string[] };
  onFilterChange: (filters: { state: string; area: string; products: string[] }) => void;
  areas: string[];
  dealerCount: number;
}

export default function FilterPanel({ filters, onFilterChange, areas, dealerCount }: FilterPanelProps) {
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);

  const stateRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  const closeAll = () => {
    setShowStateDropdown(false);
    setShowAreaDropdown(false);
    setShowProductsDropdown(false);
  };

  useEffect(() => {
    if (!showStateDropdown && !showAreaDropdown && !showProductsDropdown) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      const inside =
        stateRef.current?.contains(target) ||
        areaRef.current?.contains(target) ||
        productsRef.current?.contains(target);
      if (!inside) closeAll();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAll();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [showStateDropdown, showAreaDropdown, showProductsDropdown]);

  const toggleProduct = (product: string) => {
    const newProducts = filters.products.includes(product)
      ? filters.products.filter(p => p !== product)
      : [...filters.products, product];
    onFilterChange({ ...filters, products: newProducts });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#E6116A] rounded-lg">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Find Dealers</h2>
            <p className="text-sm text-gray-500">{dealerCount} dealers found</p>
          </div>
        </div>
        {(filters.state || filters.area || filters.products.length > 0) && (
          <button
            onClick={() => onFilterChange({ state: '', area: '', products: [] })}
            className="text-sm text-[#E6116A] hover:text-[#C00E5C] font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div className="relative" ref={stateRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
          <button
            onClick={() => {
              setShowStateDropdown(!showStateDropdown);
              setShowAreaDropdown(false);
              setShowProductsDropdown(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg bg-white text-left hover:bg-gray-50"
          >
            <span className={filters.state ? 'text-gray-900' : 'text-gray-400'}>
              {filters.state || 'Select State'}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          {showStateDropdown && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {STATES.map(state => (
                <button
                  key={state}
                  onClick={() => {
                    onFilterChange({ ...filters, state, area: '' });
                    setShowStateDropdown(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 text-left"
                >
                  <span className={filters.state === state ? 'text-[#E6116A] font-medium' : 'text-gray-700'}>
                    {state}
                  </span>
                  {filters.state === state && <Check className="w-4 h-4 text-[#E6116A]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative" ref={areaRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
          <button
            onClick={() => {
              setShowAreaDropdown(!showAreaDropdown);
              setShowStateDropdown(false);
              setShowProductsDropdown(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg bg-white text-left hover:bg-gray-50"
          >
            <span className={filters.area ? 'text-gray-900' : 'text-gray-400'}>
              {filters.area || 'Select Area'}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          {showAreaDropdown && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <button
                onClick={() => {
                  onFilterChange({ ...filters, area: '' });
                  setShowAreaDropdown(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 text-left"
              >
                <span className={!filters.area ? 'text-[#E6116A] font-medium' : 'text-gray-700'}>
                  All Areas
                </span>
                {!filters.area && <Check className="w-4 h-4 text-[#E6116A]" />}
              </button>
              {areas.map(area => (
                <button
                  key={area}
                  onClick={() => {
                    onFilterChange({ ...filters, area });
                    setShowAreaDropdown(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 text-left"
                >
                  <span className={filters.area === area ? 'text-[#E6116A] font-medium' : 'text-gray-700'}>
                    {area}
                  </span>
                  {filters.area === area && <Check className="w-4 h-4 text-[#E6116A]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative" ref={productsRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Products</label>
          <button
            onClick={() => {
              setShowProductsDropdown(!showProductsDropdown);
              setShowStateDropdown(false);
              setShowAreaDropdown(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg bg-white text-left hover:bg-gray-50"
          >
            <span className={filters.products.length > 0 ? 'text-gray-900' : 'text-gray-400'}>
              {filters.products.length > 0 ? `${filters.products.length} selected` : 'Select Products'}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          {showProductsDropdown && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
              {PRODUCTS.map(product => (
                <button
                  key={product}
                  onClick={() => toggleProduct(product)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-left"
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    filters.products.includes(product)
                      ? 'bg-[#E6116A] border-[#E6116A]'
                      : 'border-gray-300'
                  }`}>
                    {filters.products.includes(product) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className={filters.products.includes(product) ? 'text-[#E6116A] font-medium' : 'text-gray-700'}>
                    {product}
                  </span>
                </button>
              ))}
              <div className="border-t border-gray-100 p-2">
                <button
                  onClick={() => setShowProductsDropdown(false)}
                  className="w-full px-3 py-2 bg-[#E6116A] text-white text-sm font-medium rounded-md hover:bg-[#C00E5C] transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {filters.products.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {filters.products.map(product => (
            <span
              key={product}
              className="inline-flex items-center gap-1 px-2 py-1 bg-[#E6116A]/10 text-[#E6116A] text-xs rounded-full"
            >
              {product}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleProduct(product);
                }}
                className="hover:bg-[#E6116A]/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
