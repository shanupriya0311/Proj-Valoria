'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/* =============================================================================
   StackedLogos Component
   
   Multiple logo sets that animate in/out while stacked on top of each other.
   Uses CSS grid with separator lines for Vercel-style grid pattern.
   Both gradient AND border glow follow mouse position.
   Corner vertical borders removed for infinite continuous appearance.
============================================================================= */

export interface StackedLogosProps {
  /** Array of logo groups - each group is an array of React nodes */
  logoGroups: React.ReactNode[][];
  /** Animation duration in seconds. Default: 12 */
  duration?: number;
  /** Stagger factor for animation timing between groups. Default: 0 */
  stagger?: number;
  /** Width of each logo container (or '1fr'). Default: '1fr' */
  logoWidth?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * StackedLogos Component
 *
 * Displays 3 logo displays that animate in/out while stacked.
 * No corner vertical borders for an infinite horizontal feel.
 * Rendered in dark-themed minimalist shades of grey with mouse-following glow.
 */
export const StackedLogos = ({
  logoGroups,
  duration = 12,
  stagger = 0,
  logoWidth = '1fr',
  className,
}: StackedLogosProps) => {
  const itemCount = logoGroups[0]?.length || 0;
  const columns = logoGroups.length;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);

  // Track mouse position for glow effect
  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || !gridRef.current) return;

      const rect = gridRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      containerRef.current.style.setProperty('--mouse-x', `${x}px`);
      containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    },
    []
  );

  return (
    <div
      ref={containerRef}
      className={cn('stacked-logos relative w-full overflow-hidden', className)}
      style={
        {
          '--duration': duration,
          '--items': itemCount,
          '--lists': columns,
          '--stagger': stagger,
          '--logo-width': logoWidth,
          '--cell-height': '46px',
        } as React.CSSProperties
      }
      onMouseMove={handleMouseMove}
    >
      {/* Grid Container (3 Displays across) */}
      <div
        ref={gridRef}
        className="grid relative w-full"
        style={{
          gridTemplateColumns: `repeat(${columns}, ${logoWidth === '1fr' ? 'minmax(0, 1fr)' : logoWidth})`,
        }}
      >
        {/* Mouse-following background glow */}
        <div
          className="stacked-logos__glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 z-10"
          style={{
            background:
              'radial-gradient(280px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(251,191,36,0.1), transparent 70%)',
          }}
        />

        {/* Mouse-following border glow (Internal dividers & horizontal borders) */}
        <div
          className="stacked-logos__border-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 z-20"
          style={{
            background:
              'radial-gradient(320px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(251,191,36,0.85), transparent 45%)',
            maskImage: `
              repeating-linear-gradient(to right, transparent, transparent calc(100% / ${columns} - 1px), black calc(100% / ${columns} - 1px), black calc(100% / ${columns})),
              linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent calc(100% - 1px), black calc(100% - 1px), black 100%)
            `,
            WebkitMaskImage: `
              repeating-linear-gradient(to right, transparent, transparent calc(100% / ${columns} - 1px), black calc(100% / ${columns} - 1px), black calc(100% / ${columns})),
              linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent calc(100% - 1px), black calc(100% - 1px), black 100%)
            `,
            maskComposite: 'add',
            WebkitMaskComposite: 'source-over',
          }}
        />

        {/* 3 Logo Displays (No Corner Vertical Borders) */}
        {logoGroups.map((logos, groupIndex) => (
          <div
            key={groupIndex}
            className="stacked-logos__cell relative grid"
            style={
              {
                '--index': groupIndex,
                gridTemplate: '1fr / 1fr',
                minHeight: '46px',
              } as React.CSSProperties
            }
          >
            {/* Top and Bottom Horizontal Lines */}
            <div className="absolute left-0 right-0 top-0 h-px bg-zinc-800" />
            <div className="absolute left-0 right-0 bottom-0 h-px bg-zinc-800" />

            {/* Inner Vertical Dividers ONLY (No outer left/right corner borders) */}
            {groupIndex < columns - 1 && (
              <div className="absolute top-0 bottom-0 right-0 w-px bg-zinc-800" />
            )}

            {/* Stacked Logos in Each Cell */}
            {logos.map((logo, logoIndex) => (
              <div
                key={logoIndex}
                className="stacked-logos__item col-start-1 row-start-1 grid place-items-center py-2.5 px-1.5"
                data-logo
                style={{ '--i': logoIndex } as React.CSSProperties}
              >
                <div className="stacked-logos__logo w-full h-5 flex items-center justify-center text-zinc-300 hover:text-white transition-colors">
                  {logo}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

StackedLogos.displayName = 'StackedLogos';

/* =============================================================================
   SLEEK MONOCHROMATIC BRAND LOGOS (DARK THEMED SHADES OF GREYS)
============================================================================= */

export function InitechLogo() {
  return (
    <div className="flex items-center gap-1.5 select-none text-zinc-300">
      <svg className="size-3 fill-current shrink-0" viewBox="0 0 24 24">
        <polygon points="12 3 22 21 2 21" />
      </svg>
      <span className="text-[11px] font-sans tracking-tight font-medium text-zinc-200 truncate">Initech</span>
    </div>
  );
}

export function UmbrellaLogo() {
  return (
    <div className="flex items-center gap-1.5 select-none text-zinc-300">
      <svg className="size-3 fill-current shrink-0" viewBox="0 0 24 24">
        <path d="M12 4C5 4 1 12 1 12s4 8 11 8 11-8 11-8-4-8-11-8zm0 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
      </svg>
      <span className="text-[11px] font-sans tracking-tight font-medium text-zinc-200 truncate">Umbrella</span>
    </div>
  );
}

export function WayneLogo() {
  return (
    <div className="flex items-center gap-1.5 select-none text-zinc-300">
      <svg className="size-3 fill-current shrink-0" viewBox="0 0 24 24">
        <rect x="5" y="5" width="14" height="14" rx="2" transform="rotate(45 12 12)" />
      </svg>
      <span className="text-[11px] font-sans tracking-tight font-medium text-zinc-200 truncate">Wayne</span>
    </div>
  );
}

export function HooliLogo() {
  return (
    <div className="flex items-center gap-1.5 select-none text-zinc-300">
      <svg className="size-3 fill-current shrink-0" viewBox="0 0 24 24">
        <circle cx="8" cy="12" r="5" />
        <circle cx="16" cy="12" r="5" fillOpacity="0.45" />
      </svg>
      <span className="text-[11px] font-sans tracking-tight font-medium text-zinc-200 truncate">Hooli</span>
    </div>
  );
}

export function AcmeLogo() {
  return (
    <div className="flex items-center gap-1.5 select-none text-zinc-300">
      <svg className="size-3 fill-current shrink-0" viewBox="0 0 24 24">
        <path d="M12 2L1 21h22L12 2zm0 6l4.5 9h-9L12 8z" />
      </svg>
      <span className="text-[11px] font-sans tracking-tight font-medium text-zinc-200 truncate">Acme</span>
    </div>
  );
}

export function GlobexLogo() {
  return (
    <div className="flex items-center gap-1.5 select-none text-zinc-300">
      <svg className="size-3 fill-none stroke-current shrink-0" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
      </svg>
      <span className="text-[11px] font-sans tracking-tight font-medium text-zinc-200 truncate">Globex</span>
    </div>
  );
}

export function MassiveLogo() {
  return (
    <div className="flex items-center gap-1.5 select-none text-zinc-300">
      <svg className="size-3 fill-current shrink-0" viewBox="0 0 24 24">
        <polygon points="12 2 21 7 21 17 12 22 3 17 3 7" fillOpacity="0.75" />
      </svg>
      <span className="text-[11px] font-sans tracking-tight font-medium text-zinc-200 truncate">Massive</span>
    </div>
  );
}

export function StarkLogo() {
  return (
    <div className="flex items-center gap-1.5 select-none text-zinc-300">
      <svg className="size-3 stroke-current fill-none shrink-0" strokeWidth="2.5" viewBox="0 0 24 24">
        <polyline points="4 7 12 15 20 7" />
        <line x1="12" y1="15" x2="12" y2="21" strokeWidth="2" />
      </svg>
      <span className="text-[11px] font-sans tracking-tight font-medium text-zinc-200 truncate">Stark</span>
    </div>
  );
}

export function CyberdyneLogo() {
  return (
    <div className="flex items-center gap-1.5 select-none text-zinc-300">
      <svg className="size-3 stroke-current fill-none shrink-0" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="12" y1="3" x2="12" y2="21" />
      </svg>
      <span className="text-[11px] font-sans tracking-tight font-medium text-zinc-200 truncate">Cyberdyne</span>
    </div>
  );
}

/* =============================================================================
   MAPPING: 3-COLUMN LOGO GROUPS PER PROJECT (INFINITE STACKED EFFECT)
============================================================================= */
export const PROJECT_CUSTOMER_LOGO_GROUPS: Record<number, React.ReactNode[][]> = {
  0: [
    [<InitechLogo key="p1-1" />, <AcmeLogo key="p1-2" />],
    [<UmbrellaLogo key="p1-3" />, <GlobexLogo key="p1-4" />],
    [<WayneLogo key="p1-5" />, <HooliLogo key="p1-6" />],
  ],
  1: [
    [<WayneLogo key="p2-1" />, <MassiveLogo key="p2-2" />],
    [<HooliLogo key="p2-3" />, <InitechLogo key="p2-4" />],
    [<GlobexLogo key="p2-5" />, <StarkLogo key="p2-6" />],
  ],
  2: [
    [<GlobexLogo key="p3-1" />, <StarkLogo key="p3-2" />],
    [<InitechLogo key="p3-3" />, <AcmeLogo key="p3-4" />],
    [<WayneLogo key="p3-5" />, <CyberdyneLogo key="p3-6" />],
  ],
  3: [
    [<MassiveLogo key="p4-1" />, <UmbrellaLogo key="p4-2" />],
    [<StarkLogo key="p4-3" />, <HooliLogo key="p4-4" />],
    [<AcmeLogo key="p4-5" />, <WayneLogo key="p4-6" />],
  ],
  4: [
    [<InitechLogo key="p5-1" />, <CyberdyneLogo key="p5-2" />],
    [<UmbrellaLogo key="p5-3" />, <GlobexLogo key="p5-4" />],
    [<WayneLogo key="p5-5" />, <HooliLogo key="p5-6" />],
  ],
};

export default StackedLogos;
