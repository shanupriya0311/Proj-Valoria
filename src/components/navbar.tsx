'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import {
  Home,
  FlaskConical,
  Rocket,
  MessageSquareText,
} from 'lucide-react';
import { ValoriaLogo } from './valoria-logo';
import { useIntro, LOGO_SPRING, EASE_OUT } from './intro-provider';
import { useSectionNavigation } from './section-navigation-provider';
import { cn } from '@/lib/utils';

// Bespoke Terminal Icon matching the exact [>_] shape in the reference image
function TerminalPromptIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="18" height="14" x="3" y="5" rx="2.5" />
      <path d="m7 10 2 2-2 2" />
      <path d="M12 14h4" />
    </svg>
  );
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, href: '/#home' },
  { id: 'build', label: 'Build', icon: TerminalPromptIcon, href: '/#build' },
  { id: 'lab', label: 'Lab', icon: FlaskConical, href: '/#lab' },
  { id: 'launch', label: 'Launch', icon: Rocket, href: '/#launch' },
  { id: 'connect', label: "Let's Connect", icon: MessageSquareText, href: '/#connect' },
];

export function Navbar() {
  const { playing } = useIntro();
  const { activeSection, navigateToSection, isConnectOpen } = useSectionNavigation();
  const pathname = usePathname();

  const activeTab = isConnectOpen ? 'connect' : activeSection;

  const handleNavClick = (item: NavItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (pathname === '/') {
      navigateToSection(item.id, e);
    } else {
      window.location.href = item.href;
    }
  };

  return (
    <>
      <header
        data-slot="valoria-floating-navbar"
        className="fixed top-5 sm:top-6 inset-x-0 z-50 flex items-center justify-center px-4 pointer-events-none"
      >
        {/* Floating Glassmorphic Capsule */}
        <div className="pointer-events-auto relative flex items-center gap-3 sm:gap-4 rounded-full border border-white/[0.14] bg-[#0c0d12]/75 backdrop-blur-2xl px-4 sm:px-6 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.65),0_0_30px_rgba(180,160,255,0.08),inset_0_1px_1px_rgba(255,255,255,0.18)] transition-all duration-300">
          {/* Subtle top rim light */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
          />

          {/* Left: Brand Logo (Glide Target) */}
          <Link
            href="/"
            aria-label="Valoria Home"
            onClick={(e) => {
              if (pathname === '/') {
                e.preventDefault();
                navigateToSection('home');
              }
            }}
            className="group relative flex items-center pr-1 focus:outline-none shrink-0"
          >
            {!playing && (
              <motion.div
                layoutId="brand-logo"
                transition={LOGO_SPRING}
                className="w-[105px] sm:w-[125px] text-foreground transition-opacity hover:opacity-90"
              >
                <ValoriaLogo />
              </motion.div>
            )}
          </Link>

          {/* Vertical Divider Line */}
          <div
            aria-hidden="true"
            className="h-5 w-px bg-white/[0.18] shrink-0 mx-0.5 sm:mx-1"
          />

          {/* Right: Nav items with Slide + Deblur Reveal */}
          <motion.nav
            className="flex items-center gap-1 sm:gap-1.5"
            initial={false}
            animate={
              playing
                ? { opacity: 0, x: 20, filter: 'blur(6px)' }
                : { opacity: 1, x: 0, filter: 'blur(0px)' }
            }
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.25 }}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;

              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(item, e)}
                  className={cn(
                    'relative flex items-center gap-2 rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition-colors select-none focus:outline-none',
                    isActive
                      ? 'text-black'
                      : 'text-neutral-400 hover:text-white'
                  )}
                >
                  {/* Sliding solid white pill background for active tab */}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-white shadow-[0_2px_12px_rgba(255,255,255,0.3)]"
                    />
                  )}

                  <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                    <Icon className="size-3.5 sm:size-4 shrink-0" strokeWidth={2} />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </span>
                </a>
              );
            })}
          </motion.nav>
        </div>
      </header>
    </>
  );
}

export default Navbar;
