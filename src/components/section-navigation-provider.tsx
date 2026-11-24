'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ValoriaLogo } from './valoria-logo';

export const SECTION_ORDER: Record<string, number> = {
  home: 0,
  build: 1,
  lab: 2,
  launch: 3,
  connect: 4,
};

export const SECTION_CANONICAL: Record<string, string> = {
  home: 'home',
  build: 'build',
  'orbit-revolving-stage': 'build',
  lab: 'lab',
  primitives: 'lab',
  launch: 'launch',
  platform: 'launch',
  console: 'launch',
  connect: 'connect',
  inquiry: 'connect',
};

export const SECTION_NAMES: Record<string, string> = {
  home: 'Home',
  build: 'Build Systems',
  lab: 'Laboratory',
  launch: 'Launch Platform',
  connect: "Let's Connect",
};

interface PendingNavigation {
  id: string;
  label: string;
  elementId: string;
}

interface SectionNavigationContextType {
  activeSection: string;
  setActiveSection: (section: string) => void;
  navigateToSection: (targetIdOrHref: string, e?: React.MouseEvent) => void;
  isTransitioning: boolean;
  isConnectOpen: boolean;
  setIsConnectOpen: (open: boolean) => void;
  openConnect: () => void;
  closeConnect: () => void;
}

const SectionNavigationContext = createContext<SectionNavigationContextType>({
  activeSection: 'home',
  setActiveSection: () => {},
  navigateToSection: () => {},
  isTransitioning: false,
  isConnectOpen: false,
  setIsConnectOpen: () => {},
  openConnect: () => {},
  closeConnect: () => {},
});

export function useSectionNavigation() {
  return useContext(SectionNavigationContext);
}

const SECTION_IDS = ['home', 'build', 'lab', 'launch'] as const;

export function SectionNavigationProvider({ children }: { children: ReactNode }) {
  const prefersReduced = useReducedMotion();
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isConnectOpen, setIsConnectOpen] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [pendingNav, setPendingNav] = useState<PendingNavigation | null>(null);

  // Synchronous state refs to prevent race conditions during transitions
  const isConnectOpenRef = useRef<boolean>(false);
  const isTransitioningRef = useRef<boolean>(false);

  // Remember the previous active section before opening Connect so we can return accurately
  const previousSectionRef = useRef<string>('home');

  // Programmatic scroll tracking for smooth non-skipped scrolling
  const programmaticTargetRef = useRef<string | null>(null);
  const programmaticTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Transition sequence timers
  const jumpTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dissolveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cleanupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearProgrammaticScroll = useCallback(() => {
    programmaticTargetRef.current = null;
    if (programmaticTimerRef.current) {
      clearTimeout(programmaticTimerRef.current);
      programmaticTimerRef.current = null;
    }
  }, []);

  const clearTransitionTimers = useCallback(() => {
    if (jumpTimerRef.current) clearTimeout(jumpTimerRef.current);
    if (dissolveTimerRef.current) clearTimeout(dissolveTimerRef.current);
    if (cleanupTimerRef.current) clearTimeout(cleanupTimerRef.current);
  }, []);

  // Synchronize active section based on scroll position
  const detectActiveSection = useCallback(() => {
    // 1. While cinematic blur transition is active, freeze scroll updates
    if (isTransitioningRef.current) return;

    // 2. If the Let's Connect overlay is open, active section is always 'connect'
    if (isConnectOpenRef.current) {
      setActiveSection('connect');
      return;
    }

    if (typeof window === 'undefined') return;

    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    const innerHeight = window.innerHeight || 800;
    const docHeight = document.documentElement.scrollHeight || document.body.scrollHeight || innerHeight;

    // If actively smooth-scrolling toward an adjacent clicked section:
    if (programmaticTargetRef.current) {
      const targetId = programmaticTargetRef.current;
      const targetEl = document.getElementById(targetId);
      const probeY = Math.min(innerHeight * 0.35, 260);

      if (targetId === 'home' && scrollY < 80) {
        clearProgrammaticScroll();
        setActiveSection('home');
        return;
      }

      if (targetEl) {
        const rect = targetEl.getBoundingClientRect();
        if (rect.top <= probeY + 120 && rect.bottom >= probeY - 120) {
          clearProgrammaticScroll();
          setActiveSection(targetId);
          return;
        }
      }

      // Maintain target selection during smooth scroll transit
      setActiveSection(targetId);
      return;
    }

    // 1. Top of page -> Home
    if (scrollY < 80) {
      setActiveSection('home');
      return;
    }

    // 2. Near bottom of page -> Launch
    if (docHeight > innerHeight + 100 && scrollY + innerHeight >= docHeight - 120) {
      setActiveSection('launch');
      return;
    }

    // 3. Focal probe line positioned in upper-third of viewport
    const probeY = Math.min(innerHeight * 0.35, 260);
    let bestSection = 'home';
    let maxCoverage = -1;

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.height === 0) continue;

      // Exact match: focal line is inside section span
      if (rect.top <= probeY && rect.bottom > probeY) {
        bestSection = id;
        maxCoverage = Infinity;
        break;
      }

      // Coverage fallback: calculate visible height in viewport
      const visibleTop = Math.max(0, rect.top);
      const visibleBottom = Math.min(innerHeight, rect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);

      if (visibleHeight > maxCoverage) {
        maxCoverage = visibleHeight;
        bestSection = id;
      }
    }

    setActiveSection(bestSection);
  }, [clearProgrammaticScroll]);

  // Execute cinematic Valoria transition sequence
  const triggerCinematicTransition = useCallback(
    (targetId: string, label: string, elementId: string) => {
      clearTransitionTimers();
      clearProgrammaticScroll();

      isTransitioningRef.current = true;
      setIsTransitioning(true);
      setPendingNav({
        id: targetId,
        label,
        elementId,
      });
      setActiveSection(targetId);

      // Phase 1: Wait 240ms for blur backdrop to fully establish, then reposition behind the blur
      jumpTimerRef.current = setTimeout(() => {
        if (targetId === 'connect') {
          isConnectOpenRef.current = true;
          setIsConnectOpen(true);
          setActiveSection('connect');
        } else {
          isConnectOpenRef.current = false;
          setIsConnectOpen(false);
          if (typeof document !== 'undefined') {
            document.body.style.overflow = '';
          }
          const targetEl =
            document.getElementById(elementId) || document.getElementById(targetId);

          if (targetEl) {
            const navOffset =
              targetId === 'home' || elementId === 'home'
                ? 0
                : Math.max(0, targetEl.getBoundingClientRect().top + window.scrollY - 84);
            window.scrollTo({ top: navOffset, behavior: 'instant' });
          } else if (targetId === 'home') {
            window.scrollTo({ top: 0, behavior: 'instant' });
          }
          setActiveSection(targetId);
        }
      }, 240);

      // Phase 2: Hold logo animation stage, then smoothly dissolve the blur overlay
      dissolveTimerRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 680);

      // Phase 3: Cleanup pending nav after exit fade completes
      cleanupTimerRef.current = setTimeout(() => {
        isTransitioningRef.current = false;
        setPendingNav(null);
        detectActiveSection();
      }, 980);
    },
    [clearTransitionTimers, clearProgrammaticScroll, detectActiveSection]
  );

  // Main navigation handler
  const navigateToSection = useCallback(
    (targetInput: string, e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
      }

      // Normalize string (e.g. "/#lab" -> "lab", "#launch" -> "launch", "/#connect" -> "connect")
      const cleanId = targetInput.replace(/^(\/?#)/, '').trim();
      const canonicalTarget = SECTION_CANONICAL[cleanId] || cleanId;
      const targetLabel = SECTION_NAMES[canonicalTarget] || canonicalTarget;

      const currentCanonical = isConnectOpenRef.current
        ? 'connect'
        : SECTION_CANONICAL[activeSection] || activeSection;

      const currentIdx = SECTION_ORDER[currentCanonical] ?? 0;
      const targetIdx = SECTION_ORDER[canonicalTarget] ?? 0;

      // Condition 1: Going from anywhere to Let's Connect
      const isGoingToConnect = canonicalTarget === 'connect' || cleanId === 'connect';

      // Condition 2: Going back from Let's Connect to the website
      const isComingFromConnect = isConnectOpenRef.current || currentCanonical === 'connect';

      // Condition 3: Skipping sections on the main page (distance > 1, e.g. Home -> Lab, Home -> Launch, Build -> Launch)
      const isSkipping =
        targetIdx !== undefined &&
        currentIdx !== undefined &&
        Math.abs(targetIdx - currentIdx) > 1;

      // Track previous section before opening connect
      if (isGoingToConnect && !isComingFromConnect && activeSection !== 'connect') {
        previousSectionRef.current = activeSection;
      }

      // When skipping sections OR navigating to/from Connect, trigger the cinematic Valoria logo loading & blur transition
      if (isGoingToConnect || isComingFromConnect || isSkipping) {
        triggerCinematicTransition(canonicalTarget, targetLabel, cleanId);
        return;
      }

      // Adjacent direct section navigation on main page (e.g. Home <-> Build, Build <-> Lab, Lab <-> Launch)
      setActiveSection(canonicalTarget);
      programmaticTargetRef.current = canonicalTarget;

      if (programmaticTimerRef.current) {
        clearTimeout(programmaticTimerRef.current);
      }
      programmaticTimerRef.current = setTimeout(() => {
        clearProgrammaticScroll();
        detectActiveSection();
      }, 1800);

      const targetEl =
        document.getElementById(cleanId) || document.getElementById(canonicalTarget);

      if (targetEl) {
        const navOffset =
          cleanId === 'home' || canonicalTarget === 'home'
            ? 0
            : Math.max(0, targetEl.getBoundingClientRect().top + window.scrollY - 84);

        window.scrollTo({ top: navOffset, behavior: 'smooth' });

        const onScrollEnd = () => {
          clearProgrammaticScroll();
          detectActiveSection();
          window.removeEventListener('scrollend', onScrollEnd);
        };
        window.addEventListener('scrollend', onScrollEnd, { once: true });
      }
    },
    [
      activeSection,
      triggerCinematicTransition,
      clearProgrammaticScroll,
      detectActiveSection,
    ]
  );

  const openConnect = useCallback(() => {
    if (!isConnectOpenRef.current && activeSection !== 'connect') {
      previousSectionRef.current = activeSection;
    }
    triggerCinematicTransition('connect', "Let's Connect", 'connect');
  }, [activeSection, triggerCinematicTransition]);

  const closeConnect = useCallback(() => {
    // Return to the previous section the user was exploring, or default to home
    const returnTarget = previousSectionRef.current || 'home';
    const targetLabel = SECTION_NAMES[returnTarget] || 'Home';
    triggerCinematicTransition(returnTarget, targetLabel, returnTarget);
  }, [triggerCinematicTransition]);

  // Clean, deadlock-free scroll and resize listener
  useEffect(() => {
    let ticking = false;

    const onScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          detectActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Immediate initial detection on mount
    detectActiveSection();

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [detectActiveSection]);

  // If user manually interrupts smooth scroll by scrolling or touching, immediately yield to manual scroll
  useEffect(() => {
    const onUserManualGesture = () => {
      if (programmaticTargetRef.current) {
        clearProgrammaticScroll();
      }
    };

    window.addEventListener('wheel', onUserManualGesture, { passive: true });
    window.addEventListener('touchmove', onUserManualGesture, { passive: true });

    return () => {
      window.removeEventListener('wheel', onUserManualGesture);
      window.removeEventListener('touchmove', onUserManualGesture);
    };
  }, [clearProgrammaticScroll]);

  // Delegated click listener to catch in-page anchor links pointing to sections
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // If click was inside the top navbar, let the navbar component handle it directly
      if ((e.target as HTMLElement)?.closest('[data-slot="valoria-floating-navbar"]')) {
        return;
      }

      const anchor = (e.target as HTMLElement)?.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      if (href.startsWith('#') || href.startsWith('/#')) {
        const cleanId = href.replace(/^(\/?#)/, '').trim();
        const canonical = SECTION_CANONICAL[cleanId] || cleanId;
        if (canonical in SECTION_ORDER) {
          e.preventDefault();
          navigateToSection(cleanId);
        }
      }
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleDocumentClick, { capture: true });
    };
  }, [navigateToSection]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTransitionTimers();
      clearProgrammaticScroll();
    };
  }, [clearTransitionTimers, clearProgrammaticScroll]);

  return (
    <SectionNavigationContext.Provider
      value={{
        activeSection,
        setActiveSection,
        navigateToSection,
        isTransitioning,
        isConnectOpen,
        setIsConnectOpen,
        openConnect,
        closeConnect,
      }}
    >
      {children}

      {/* Cinematic Valoria Logo Loading Stage & Blur Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && pendingNav && (
          <motion.div
            key="section-skip-blur-overlay"
            role="status"
            aria-live="polite"
            aria-label={`Navigating to ${pendingNav.label}`}
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(32px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{
              duration: prefersReduced ? 0.2 : 0.32,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-black/80 backdrop-blur-3xl backdrop-saturate-150 pointer-events-auto select-none"
          >
            {/* Ambient Radial Glowing Aura */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.6, 1.15, 1], opacity: [0, 0.7, 0.45] }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute size-[520px] rounded-full bg-gradient-to-tr from-sky-500/10 via-white/[0.08] to-indigo-500/10 blur-[90px]"
            />

            {/* Center Valoria Logo Loading Stage */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0, filter: 'blur(12px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              exit={{ scale: 1.04, opacity: 0, filter: 'blur(10px)' }}
              transition={{
                duration: 0.36,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative z-10 flex flex-col items-center gap-6"
            >
              {/* Valoria Logo with Specular Shimmer */}
              <div className="relative w-[190px] sm:w-[230px] text-white drop-shadow-[0_4px_32px_rgba(255,255,255,0.35)]">
                <ValoriaLogo />
                {/* Horizontal specular shine beam */}
                <motion.div
                  initial={{ x: '-120%', opacity: 0 }}
                  animate={{ x: '120%', opacity: [0, 0.7, 0] }}
                  transition={{ duration: 0.65, ease: 'easeInOut', delay: 0.1 }}
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                />
              </div>

              {/* Status Capsule Indicator */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: 0.12 }}
                className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-neutral-900/85 border border-white/15 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.14)]"
              >
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-blue-400" />
                </span>
                <span className="text-[11.5px] font-mono tracking-widest uppercase text-neutral-200 font-medium">
                  {pendingNav.label}
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionNavigationContext.Provider>
  );
}
