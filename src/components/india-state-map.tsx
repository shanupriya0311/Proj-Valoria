'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Check, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { INDIA_STATES, type IndiaStateFeature } from '@/data/india-states-map';
import { cn } from '@/lib/utils';

export interface IndiaStateMapProps {
  selectedState: string;
  onSelectState: (stateName: string) => void;
  district: string;
  onDistrictChange: (district: string) => void;
}

const ZOOM_SCALES = [1, 1.85, 3.1] as const;

export function IndiaStateMap({
  selectedState,
  onSelectState,
  district,
  onDistrictChange,
}: IndiaStateMapProps) {
  const [hoveredState, setHoveredState] = useState<IndiaStateFeature | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState<0 | 1 | 2>(0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const wheelAccumRef = useRef(0);
  const wheelCooldownRef = useRef(0);
  const dragStateRef = useRef<{
    active: boolean;
    moved: boolean;
    startX: number;
    startY: number;
    origPanX: number;
    origPanY: number;
  }>({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    origPanX: 0,
    origPanY: 0,
  });

  const selectedFeature = INDIA_STATES.find((s) => s.name === selectedState) || null;
  const currentScale = ZOOM_SCALES[zoomLevel];

  const clampPan = useCallback((px: number, py: number, level: 0 | 1 | 2) => {
    if (level === 0) return { x: 0, y: 0 };
    const s = ZOOM_SCALES[level];
    const maxOffsetX = (600 * (s - 1)) / (2 * s) + 40;
    const maxOffsetY = (660 * (s - 1)) / (2 * s) + 40;
    return {
      x: Math.max(-maxOffsetX, Math.min(maxOffsetX, px)),
      y: Math.max(-maxOffsetY, Math.min(maxOffsetY, py)),
    };
  }, []);

  const applyZoom = useCallback(
    (nextLevel: 0 | 1 | 2, focusSvgX = 300, focusSvgY = 330) => {
      if (nextLevel === 0) {
        setZoomLevel(0);
        setPan({ x: 0, y: 0 });
        return;
      }
      setZoomLevel(nextLevel);
      setPan((prev) => {
        const targetX = (300 - focusSvgX) * 0.65;
        const targetY = (330 - focusSvgY) * 0.65;
        const blendedX = prev.x * 0.4 + targetX * 0.6;
        const blendedY = prev.y * 0.4 + targetY * 0.6;
        return clampPan(blendedX, blendedY, nextLevel);
      });
    },
    [clampPan]
  );

  // 2-level mouse wheel zoom on the map
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const now = Date.now();
      if (now - wheelCooldownRef.current < 160) return;

      wheelAccumRef.current += e.deltaY;
      const THRESHOLD = 28;

      if (Math.abs(wheelAccumRef.current) < THRESHOLD) return;

      const rect = el.getBoundingClientRect();
      const relX = ((e.clientX - rect.left) / rect.width) * 600;
      const relY = ((e.clientY - rect.top) / rect.height) * 660;

      if (wheelAccumRef.current < 0) {
        // Scroll up / pinch out -> Zoom In (up to Level 2)
        setZoomLevel((prev) => {
          const next = Math.min(2, prev + 1) as 0 | 1 | 2;
          if (next !== prev) {
            applyZoom(next, relX, relY);
          }
          return next;
        });
      } else {
        // Scroll down -> Zoom Out (down to Level 0)
        setZoomLevel((prev) => {
          const next = Math.max(0, prev - 1) as 0 | 1 | 2;
          if (next !== prev) {
            applyZoom(next, relX, relY);
          }
          return next;
        });
      }

      wheelAccumRef.current = 0;
      wheelCooldownRef.current = now;
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [applyZoom]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (zoomLevel === 0) return;
    dragStateRef.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      origPanX: pan.x,
      origPanY: pan.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragStateRef.current.active) return;
    const dx = e.clientX - dragStateRef.current.startX;
    const dy = e.clientY - dragStateRef.current.startY;
    if (Math.hypot(dx, dy) > 4) {
      dragStateRef.current.moved = true;
    }
    const scaleFactor = 1.4 / currentScale;
    setPan(
      clampPan(
        dragStateRef.current.origPanX + dx * scaleFactor,
        dragStateRef.current.origPanY + dy * scaleFactor,
        zoomLevel
      )
    );
  };

  const handlePointerUp = () => {
    dragStateRef.current.active = false;
  };

  const handleStateClick = (state: IndiaStateFeature) => {
    if (dragStateRef.current.moved) return;
    onSelectState(state.name);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Interactive Dark India Map Stage */}
      <div
        ref={containerRef}
        className="relative w-full rounded-xl border border-white/[0.08] bg-black/55 bg-grid-dots p-2.5 sm:p-3 shadow-[inset_0_2px_10px_rgba(0,0,0,0.65)] overflow-hidden select-none touch-none"
      >
        {/* Top-Right Zoom Controls (Level 0 -> 1 -> 2) */}
        <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 rounded-full border border-white/[0.12] bg-black/75 p-1 backdrop-blur-xl shadow-lg">
          <button
            type="button"
            onClick={() => applyZoom(Math.max(0, zoomLevel - 1) as 0 | 1 | 2)}
            disabled={zoomLevel === 0}
            aria-label="Zoom out map"
            className="flex size-6 items-center justify-center rounded-full text-neutral-300 hover:bg-white/[0.1] hover:text-white disabled:opacity-35 disabled:pointer-events-none transition cursor-pointer"
          >
            <ZoomOut className="size-3.5" />
          </button>
          <span className="px-1.5 font-mono text-[10px] font-semibold text-neutral-300 min-w-[26px] text-center">
            {zoomLevel + 1}x
          </span>
          <button
            type="button"
            onClick={() =>
              applyZoom(
                Math.min(2, zoomLevel + 1) as 0 | 1 | 2,
                selectedFeature?.labelX ?? 300,
                selectedFeature?.labelY ?? 330
              )
            }
            disabled={zoomLevel === 2}
            aria-label="Zoom in map"
            className="flex size-6 items-center justify-center rounded-full text-neutral-300 hover:bg-white/[0.1] hover:text-white disabled:opacity-35 disabled:pointer-events-none transition cursor-pointer"
          >
            <ZoomIn className="size-3.5" />
          </button>
          {zoomLevel > 0 && (
            <button
              type="button"
              onClick={() => applyZoom(0)}
              aria-label="Reset map zoom"
              className="flex size-6 items-center justify-center rounded-full text-neutral-400 hover:bg-white/[0.1] hover:text-white transition cursor-pointer"
            >
              <RotateCcw className="size-3" />
            </button>
          )}
        </div>

        <svg
          viewBox="0 0 600 660"
          className={cn(
            'w-full h-auto max-h-[395px] mx-auto block',
            zoomLevel > 0 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
          )}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            setHoveredState(null);
            dragStateRef.current.active = false;
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          role="img"
          aria-label="Interactive map of India for selecting your state"
        >
          <defs>
            <filter id="selected-state-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <motion.g
            animate={{
              scale: currentScale,
              x: pan.x * currentScale,
              y: pan.y * currentScale,
            }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            style={{ originX: '300px', originY: '330px' }}
          >
            {/* State Polygons */}
            <g>
              {INDIA_STATES.map((state) => {
                const isSelected = selectedState === state.name;
                const isHovered = hoveredState?.name === state.name;

                return (
                  <path
                    key={state.id + '-' + state.name}
                    d={state.path}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${state.name}`}
                    aria-pressed={isSelected}
                    onClick={() => handleStateClick(state)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectState(state.name);
                      }
                    }}
                    onMouseEnter={() => setHoveredState(state)}
                    className="cursor-pointer outline-none transition-colors duration-150"
                    fill={
                      isSelected
                        ? 'rgba(52, 211, 153, 0.24)'
                        : isHovered
                        ? 'rgba(255, 255, 255, 0.14)'
                        : 'rgba(255, 255, 255, 0.04)'
                    }
                    stroke={
                      isSelected
                        ? 'rgba(52, 211, 153, 0.9)'
                        : isHovered
                        ? 'rgba(255, 255, 255, 0.6)'
                        : 'rgba(255, 255, 255, 0.16)'
                    }
                    strokeWidth={(isSelected ? 1.8 : isHovered ? 1.35 : 0.85) / Math.sqrt(currentScale)}
                    strokeLinejoin="round"
                    filter={isSelected ? 'url(#selected-state-glow)' : undefined}
                  />
                );
              })}
            </g>

            {/* State Code Abbreviations */}
            <g className="pointer-events-none">
              {INDIA_STATES.filter((s) => s.area > (zoomLevel > 0 ? 40 : 220)).map((state) => {
                const isSelected = selectedState === state.name;
                const isHovered = hoveredState?.name === state.name;
                return (
                  <text
                    key={`label-${state.code}`}
                    x={state.labelX}
                    y={state.labelY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{ fontSize: `${9.5 / Math.pow(currentScale, 0.55)}px` }}
                    className={cn(
                      'font-mono font-semibold tracking-wider transition-colors duration-150',
                      isSelected
                        ? 'fill-emerald-300'
                        : isHovered
                        ? 'fill-white'
                        : 'fill-neutral-400/80'
                    )}
                  >
                    {state.code}
                  </text>
                );
              })}
            </g>
          </motion.g>
        </svg>

        {/* Floating Hover Tooltip Card */}
        <AnimatePresence>
          {hoveredState && (
            <motion.div
              key={hoveredState.code}
              initial={{ opacity: 0, scale: 0.94, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 420, damping: 28 }}
              style={{
                left: Math.min(Math.max(tooltipPos.x + 14, 12), 260),
                top: Math.max(tooltipPos.y - 56, 10),
              }}
              className="pointer-events-none absolute z-20 min-w-[165px] rounded-xl border border-white/[0.15] bg-black/85 px-3.5 py-2.5 shadow-[0_12px_32px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl"
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'size-2 rounded-full shrink-0',
                    selectedState === hoveredState.name
                      ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                      : 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.6)]'
                  )}
                />
                <span className="text-xs font-semibold text-white tracking-tight">
                  {hoveredState.name}
                </span>
              </div>
              <div className="mt-1.5 flex items-center justify-between gap-4 text-[11px] font-mono text-neutral-400">
                <span>Capital</span>
                <span className="text-neutral-200">{hoveredState.capital}</span>
              </div>
              <div className="mt-0.5 flex items-center justify-between gap-4 text-[11px] font-mono text-neutral-400">
                <span>Code</span>
                <span className="text-neutral-200">{hoveredState.code}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected State Badge + District Input Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 rounded-xl border border-white/[0.08] bg-black/40 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-2.5 min-w-0 sm:w-[44%] px-1">
          <span
            className={cn(
              'flex size-7 shrink-0 items-center justify-center rounded-lg border transition-colors',
              selectedFeature
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-white/[0.06] border-white/[0.1] text-neutral-400'
            )}
          >
            {selectedFeature ? <Check className="size-3.5 stroke-[2.5]" /> : <MapPin className="size-3.5" />}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium text-white truncate">
              {selectedFeature ? selectedFeature.name : 'Select state on map'}
            </p>
            {selectedFeature && (
              <p className="text-[10.5px] font-mono text-neutral-400 truncate">
                {selectedFeature.code}
              </p>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <input
            name="district"
            type="text"
            required
            value={district}
            onChange={(e) => onDistrictChange(e.target.value)}
            placeholder="Enter your District *"
            aria-label="District"
            className="w-full rounded-lg border border-white/[0.12] bg-white/[0.04] px-3.5 py-2 text-xs sm:text-sm font-normal text-white placeholder:text-neutral-500 focus:border-white/30 focus:ring-2 focus:ring-white/[0.08] focus:outline-none transition shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
          />
        </div>
      </div>
    </div>
  );
}
