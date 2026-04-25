'use client';

import { useRef, useState } from 'react';
import { ChevronUp } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  peekHeight?: number;
  expandedHeight?: string;
}

export default function MobileBottomSheet({
  open,
  onOpenChange,
  title,
  subtitle,
  children,
  peekHeight = 88,
  expandedHeight = '82vh',
}: Props) {
  const dragStartYRef = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  const onPointerDown = (e: React.PointerEvent) => {
    dragStartYRef.current = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStartYRef.current == null) return;
    const dy = e.clientY - dragStartYRef.current;
    setDragOffset(open ? Math.max(0, dy) : Math.min(0, dy));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStartYRef.current == null) return;
    const dy = e.clientY - dragStartYRef.current;
    dragStartYRef.current = null;
    setDragOffset(0);

    if (Math.abs(dy) < 6) {
      onOpenChange(!open);
    } else if (dy < -40) {
      onOpenChange(true);
    } else if (dy > 40) {
      onOpenChange(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-label={title}
      className="fixed inset-x-0 bottom-0 z-40 bg-white rounded-t-2xl shadow-[0_-8px_24px_rgba(0,0,0,0.12)] flex flex-col lg:hidden"
      style={{
        height: open ? expandedHeight : `${peekHeight}px`,
        transform: `translateY(${dragOffset}px)`,
        transition: dragStartYRef.current == null ? 'height 280ms ease-out, transform 200ms ease-out' : 'none',
      }}
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="cursor-grab active:cursor-grabbing select-none touch-none px-4 py-3 border-b border-gray-100"
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-2" />
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900 text-sm">{title}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
          <ChevronUp
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
    </div>
  );
}
