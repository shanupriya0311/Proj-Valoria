'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useIntroDone, EASE_OUT } from './intro-provider';
import { useSectionNavigation } from './section-navigation-provider';
import { AnimatedHeadline } from './animated-headline';
import { LiquidMetalButton } from '@/components/ui/liquid-metal';
import { cn } from '@/lib/utils';

/* =============================================================================
   Bespoke Apple-Grade Architectural Icons (Monochromatic & High Craft)
============================================================================= */

/** 1. Product Excellence: Precision faceted geometric gem with internal refraction lines */
function ExcellenceIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={cn('size-3.5 sm:size-4 shrink-0 transition-colors duration-300', className)}
      aria-hidden="true"
    >
      {/* Outer brilliant facet crown & pavilion */}
      <path
        d="M3.2 5.2L5.4 2.2H10.6L12.8 5.2L8 13.8L3.2 5.2Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Internal precision reflections */}
      <path
        d="M3.2 5.2H12.8M5.4 2.2L8 13.8L10.6 2.2M5.4 2.2L8 5.2L10.6 2.2"
        stroke="currentColor"
        strokeWidth="0.85"
        strokeOpacity="0.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** 2. Data Security & Privacy: Precision biometric vault & continuous shield */
function SecurityIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={cn('size-3.5 sm:size-4 shrink-0 transition-colors duration-300', className)}
      aria-hidden="true"
    >
      {/* Shield boundary */}
      <path
        d="M8 1.8L3.2 3.6V7.8C3.2 11.2 5.2 13.6 8 14.3C10.8 13.6 12.8 11.2 12.8 7.8V3.6L8 1.8Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Secure enclave lock body */}
      <rect
        x="6"
        y="7.4"
        width="4"
        height="3.2"
        rx="0.8"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* Shackle */}
      <path
        d="M6.8 7.4V6C6.8 5.34 7.34 4.8 8 4.8C8.66 4.8 9.2 5.34 9.2 6V7.4"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <circle cx="8" cy="9" r="0.6" fill="currentColor" />
    </svg>
  );
}

/** 3. Transparency & Reliability: Concentric optical telemetry aperture with focus core */
function TransparencyIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={cn('size-3.5 sm:size-4 shrink-0 transition-colors duration-300', className)}
      aria-hidden="true"
    >
      {/* Calibrated outer aperture */}
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeDasharray="2.5 1.5"
      />
      {/* Internal optical focus ring */}
      <circle
        cx="8"
        cy="8"
        r="3.2"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* Center telemetry beacon */}
      <circle cx="8" cy="8" r="1.1" fill="currentColor" />
    </svg>
  );
}

/** 4. Post-delivery Support: Perpetual engineering care loop with live telemetry node */
function SupportIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={cn('size-3.5 sm:size-4 shrink-0 transition-colors duration-300', className)}
      aria-hidden="true"
    >
      {/* Perpetual SLA infinity curve */}
      <path
        d="M4.6 10.8C2.8 10.8 1.8 9.6 1.8 8C1.8 6.4 2.8 5.2 4.6 5.2C6.4 5.2 7.4 7.6 8 8C8.6 8.4 9.6 10.8 11.4 10.8C13.2 10.8 14.2 9.6 14.2 8C14.2 6.4 13.2 5.2 11.4 5.2C9.6 5.2 8.6 7.6 8 8C7.4 8.4 6.4 10.8 4.6 10.8Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Active pulse beacon */}
      <circle cx="11.4" cy="8" r="1.1" fill="currentColor" />
    </svg>
  );
}

const PILLARS = [
  {
    id: 'excellence',
    label: 'Product Excellence',
    icon: ExcellenceIcon,
    description: 'Engineered with production-grade craft and rigorous quality floors',
  },
  {
    id: 'security',
    label: 'Data Security & Privacy',
    icon: SecurityIcon,
    description: 'Zero-trust architecture, encrypted workflows, and full enterprise compliance',
  },
  {
    id: 'transparency',
    label: 'Transparency & Reliability',
    icon: TransparencyIcon,
    description: 'Verifiable SLAs, live observability, and predictable high-uptime systems',
  },
  {
    id: 'support',
    label: 'Post-delivery Support',
    icon: SupportIcon,
    description: '24/7 dedicated engineering care, proactive maintenance, and lifecycle scaling',
  },
] as const;

export function HeroSection() {
  const done = useIntroDone();
  const { navigateToSection } = useSectionNavigation();

  const rise = (index: number) => ({
    initial: { opacity: 0, y: 20, filter: 'blur(10px)' },
    animate: done
      ? { opacity: 1, y: 0, filter: 'blur(0px)' }
      : { opacity: 0, y: 20, filter: 'blur(10px)' },
    transition: {
      duration: 0.7,
      ease: EASE_OUT,
      delay: 0.7 + index * 0.1,
    },
  });

  return (
    <section
      id="home"
      className="relative flex flex-col items-center px-6 pt-36 pb-28 text-center sm:pb-32 md:pt-44 overflow-hidden scroll-mt-24"
    >
      {/* Ambient background blurred spheres */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 size-[650px] rounded-full bg-foreground/[0.04] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/4 -translate-y-1/2 size-[450px] rounded-full bg-white/[0.02] blur-3xl"
      />

      {/* Ethereal glowing horizon curves matching reference style */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[340px] sm:top-[360px] left-1/2 -translate-x-1/2 w-[1800px] h-[700px] rounded-[100%] border-t border-white/[0.18] bg-gradient-to-b from-white/[0.04] via-transparent to-transparent shadow-[0_-15px_60px_rgba(200,190,255,0.08)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[410px] sm:top-[430px] left-1/2 -translate-x-1/2 w-[1500px] h-[600px] rounded-[100%] border-t border-white/[0.08]"
      />

      {/* 1. Animated Headline with Blur Cascade & Rotating Text Ticker */}
      <AnimatedHeadline />

      {/* 2. Subtitle Paragraph */}
      <motion.p
        initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
        animate={
          done
            ? { opacity: 1, y: 0, filter: 'blur(0px)' }
            : { opacity: 0, y: 18, filter: 'blur(10px)' }
        }
        transition={{
          duration: 0.75,
          ease: EASE_OUT,
          delay: 0.55,
        }}
        className="z-10 mt-6 max-w-[680px] text-base sm:text-lg md:text-[19px] text-neutral-400 font-normal leading-relaxed text-balance text-center tracking-normal"
      >
        We connect <span className="text-foreground font-medium">data</span>,{' '}
        <span className="text-foreground font-medium">AI models</span>, and{' '}
        <span className="text-foreground font-medium">business workflows</span> to deliver
        smarter insights and practical solutions built around your goals.
      </motion.p>

      {/* 3. Action Buttons (Lowered with Apple spring physics & professional developer styling) */}
      <motion.div
        {...rise(1)}
        className="z-10 mt-12 sm:mt-14 md:mt-16 flex w-full flex-col items-center"
      >
        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 w-full">
          {/* Primary: Discover Our Services */}
          <motion.div
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          >
            <LiquidMetalButton
              type="button"
              size="lg"
              className="min-w-[270px] sm:min-w-[290px] justify-center tracking-tight font-medium"
              icon={
                <svg
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3.5 8h9M8.5 4l4 4-4 4" />
                </svg>
              }
              metalConfig={{
                colorBack: '#3b82f6',
                colorTint: '#93c5fd',
              }}
              onClick={() => {
                navigateToSection('build');
              }}
            >
              Discover Our Services
            </LiquidMetalButton>
          </motion.div>

          {/* Secondary: Apply For Internships */}
          <motion.div
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          >
            <LiquidMetalButton
              type="button"
              size="lg"
              className="min-w-[240px] sm:min-w-[260px] justify-center tracking-tight font-medium"
              metalConfig={{
                colorBack: '#3b82f6',
                colorTint: '#93c5fd',
              }}
              onClick={() => {
                navigateToSection('launch');
              }}
            >
              Apply For Internships
            </LiquidMetalButton>
          </motion.div>
        </div>
      </motion.div>

      {/* 4. Ecosystem & Performance Pillars (Apple-grade precision monochromatic glass dock) */}
      <motion.div
        {...rise(2)}
        className="z-10 mt-12 sm:mt-14 md:mt-16 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 p-1.5 sm:p-2 rounded-2xl sm:rounded-full bg-neutral-950/70 backdrop-blur-xl border border-white/[0.08] shadow-[0_12px_36px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]"
      >
        {PILLARS.map((pillar, index) => {
          const Icon = pillar.icon;
          return (
            <React.Fragment key={pillar.id}>
              <div
                className="group relative flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl sm:rounded-full hover:bg-white/[0.06] transition-all duration-300 cursor-default select-none"
                title={pillar.description}
              >
                <Icon className="text-neutral-400 group-hover:text-white" />
                <span className="text-[12px] sm:text-[13px] font-medium tracking-tight text-neutral-300/90 group-hover:text-white transition-colors duration-300">
                  {pillar.label}
                </span>
              </div>
              {index < PILLARS.length - 1 && (
                <div
                  className="hidden md:block w-px h-3.5 bg-white/[0.1] shrink-0"
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          );
        })}
      </motion.div>
    </section>
  );
}
