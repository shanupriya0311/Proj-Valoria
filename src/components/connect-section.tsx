'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Briefcase,
  FileCode2,
  ArrowRight,
  Loader2,
  ExternalLink,
  Cpu,
  Layers,
  Calendar,
  Globe,
  Zap,
  Server,
  Lock,
  Terminal,
  ArrowLeft,
} from 'lucide-react';
import { SlackIcon } from './icons';
import { StarCasingBackground } from './star-casing-background';
import { useSectionNavigation } from './section-navigation-provider';

// ============================================================================
// DATA OPTIONS
// ============================================================================

interface TrackItem {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const TECH_TRACKS: TrackItem[] = [
  {
    id: 'Salesforce Ecosystem & Agentforce',
    label: 'Salesforce Ecosystem & Agentforce',
    description: 'Autonomous Agentforce Slack workflows, custom Apex engines & Data Cloud pipelines.',
    icon: Zap,
  },
  {
    id: 'Autonomous AI & LLM Systems',
    label: 'Autonomous AI & LLM Systems',
    description: 'Bespoke agentic reasoning networks, multimodal inference & private LLM deployments.',
    icon: Cpu,
  },
  {
    id: 'Next-Gen Web & Mobile Platforms',
    label: 'Next-Gen Web & Mobile Platforms',
    description: 'Ultra-low latency reactive frontends, fluid Apple spring physics & cross-platform SDKs.',
    icon: Globe,
  },
  {
    id: 'Cloud Infrastructure & DevOps',
    label: 'Cloud Infrastructure & DevOps',
    description: 'Multi-cloud Kubernetes clusters, zero-trust security perimeters & automated CI/CD.',
    icon: Server,
  },
  {
    id: 'Bespoke Enterprise Architecture',
    label: 'Bespoke Enterprise Architecture',
    description: 'Distributed microservices, real-time message brokers & fault-tolerant high-throughput APIs.',
    icon: Layers,
  },
];

const TIMELINES = [
  { value: 'Immediate (< 1 Month)', label: 'Immediate', sub: '< 1 Month' },
  { value: '1 to 3 Months', label: '1–3 Months', sub: 'Standard Delivery' },
  { value: '3 to 6 Months', label: '3–6 Months', sub: 'Complex Scope' },
  { value: 'Exploratory / Research', label: 'Exploratory', sub: 'Technical Discovery' },
];

const BUDGETS = [
  { value: '$10,000 – $25,000', label: '$10k – $25k' },
  { value: '$25,000 – $50,000', label: '$25k – $50k' },
  { value: '$50,000 – $100,000', label: '$50k – $100k' },
  { value: '$100,000+', label: '$100k+' },
  { value: 'To Be Determined', label: 'TBD' },
];

const COMPANY_SIZES = [
  '1–10 employees',
  '11–50 employees',
  '51–200 employees',
  '201–1,000 employees',
  '1,000+ Enterprise',
];

const INDUSTRIES = [
  'Enterprise SaaS & Software',
  'Fintech & Financial Services',
  'AI, Machine Learning & Robotics',
  'Healthcare & Life Sciences',
  'Logistics & Supply Chain',
  'E-Commerce & Retail',
  'Other',
];

// Continuous Marquee Streams
const INFINITE_STREAM_1 = [
  'AGENTFORCE SLACK AGENTS',
  'AUTONOMOUS REASONING LLMS',
  'OKLCH DARK LUXURY AESTHETICS',
  'NEXT-GEN REACTIVE APIS',
  'ZERO-LATENCY SPRING MOTION',
  'ENTERPRISE DATA CLOUD',
  'SECURE APEX REST PIPELINES',
  'WHERE VISION BECOMES TECHNOLOGY',
];

const INFINITE_STREAM_2 = [
  'DIRECT SALESFORCE HUB INGESTION',
  '256-BIT TLS ENCRYPTED GATEWAY',
  '< 24H ENGINEERING SLA',
  'REAL-TIME CRM WEBHOOKS',
  'BESPOKE DISTRIBUTED ARCHITECTURE',
  'SLACK COMMUNITY COLLABORATION',
  'VALORIA ENTERPRISE DESK',
  'ZERO THIRD-PARTY TELEMETRY',
];

// ============================================================================
// MATTE ICON BADGE COMPONENT (Satin Dark Finish + Ambient Grey Glowing Aura)
// ============================================================================

interface MatteIconBadgeProps {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function MatteIconBadge({ icon: Icon, size = 'md', className = '' }: MatteIconBadgeProps) {
  const sizeClasses = {
    sm: 'size-7 sm:size-8 rounded-lg',
    md: 'size-9 sm:size-10 rounded-xl',
    lg: 'size-11 sm:size-12 rounded-2xl',
  }[size];

  const iconSizes = {
    sm: 'size-3.5',
    md: 'size-4 sm:size-4.5',
    lg: 'size-5 sm:size-5.5',
  }[size];

  return (
    <div className={`group/icon relative shrink-0 ${sizeClasses} ${className}`}>
      {/* Ambient Grey Glowing Aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-1 rounded-xl bg-white/[0.04] opacity-0 blur-md transition-opacity duration-300 group-hover/icon:opacity-100"
      />

      {/* Matte Container with Specular Top Bevel & Deep Charcoal Satin Surface */}
      <div
        className={`relative flex h-full w-full items-center justify-center ${sizeClasses} border border-white/[0.1] bg-gradient-to-b from-[#21232b] via-[#16171d] to-[#0e0f13] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_4px_12px_rgba(0,0,0,0.6)] transition-all duration-300 group-hover/icon:border-zinc-400/50 group-hover/icon:shadow-[0_0_20px_rgba(215,220,230,0.18),inset_0_1px_0_rgba(255,255,255,0.25)]`}
      >
        <Icon className={`${iconSizes} text-zinc-300 transition-colors duration-200 group-hover/icon:text-white`} strokeWidth={1.6} />
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT: CONNECT SECTION (LANDING VIEW OVERLAY & STANDALONE PAGE)
// ============================================================================

export interface ConnectSectionProps {
  standalone?: boolean;
}

export function ConnectSection({ standalone = false }: ConnectSectionProps = {}) {
  const { isConnectOpen, closeConnect } = useSectionNavigation();
  const isOpen = standalone || isConnectOpen;

  const handleReturn = () => {
    if (standalone) {
      window.location.href = '/';
    } else {
      closeConnect();
    }
  };

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    jobTitle: '',
    companyName: '',
    companyWebsite: '',
    companySize: COMPANY_SIZES[1],
    industry: INDUSTRIES[0],
    primaryInterest: TECH_TRACKS[0].id,
    projectTimeline: TIMELINES[1].value,
    budgetRange: BUDGETS[1].value,
    projectScope: '',
    existingTechStack: '',
    preferredDeployment: 'Cloud (AWS / GCP / Azure)',
    consentAgreed: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquiryResult, setInquiryResult] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Lock document body scroll when Let's Connect overlay is open (in embedded mode)
  useEffect(() => {
    if (!standalone && isConnectOpen) {
      document.body.style.overflow = 'hidden';
    } else if (!standalone) {
      document.body.style.overflow = '';
    }
    return () => {
      if (!standalone) {
        document.body.style.overflow = '';
      }
    };
  }, [isConnectOpen, standalone]);

  // Escape key to exit cleanly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!standalone && isConnectOpen) {
          closeConnect();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isConnectOpen, closeConnect, standalone]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectTrack = (trackId: string) => {
    setFormData((prev) => ({ ...prev, primaryInterest: trackId }));
  };

  const handleSelectTimeline = (timelineVal: string) => {
    setFormData((prev) => ({ ...prev, projectTimeline: timelineVal }));
  };

  const handleSelectBudget = (budgetVal: string) => {
    setFormData((prev) => ({ ...prev, budgetRange: budgetVal }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.companyName.trim()) {
      setErrorMessage('Please complete all required fields (Full Name, Work Email, Organization).');
      return;
    }

    if (!formData.projectScope.trim()) {
      setErrorMessage('Please provide a brief summary of your project scope or architectural vision.');
      return;
    }

    if (!formData.consentAgreed) {
      setErrorMessage('Please acknowledge the statutory consent before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data: { success?: unknown } = await res.json();

      if (res.ok && data.success === true) {
        setInquiryResult(true);
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    } catch (err: unknown) {
      console.error('Submission error:', err);
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="connect"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={`z-40 bg-[#050608] min-h-screen overflow-y-auto text-white selection:bg-white selection:text-black ${
            standalone ? 'relative w-full' : 'fixed inset-0'
          }`}
        >
          {/* Star Casing Background with EXACTLY ONE Pink Shooting Star */}
          <StarCasingBackground className="opacity-95" />

          {/* Minimal Technical Dot-Matrix Background Layer */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_20%,#000_60%,transparent_100%)] opacity-50 z-0"
          />

          {/* Ambient Cosmic Halos */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[800px] rounded-full bg-white/[0.02] blur-[150px] z-0"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/3 right-1/4 size-[400px] rounded-full bg-pink-500/[0.012] blur-[120px] z-0"
          />

          {/* Main Landing Page Wrapper (Padded below the floating top navbar) */}
          <div className="relative z-10 w-full max-w-7xl mx-auto pt-28 sm:pt-36 pb-28 sm:pb-36 px-4 sm:px-6 md:px-10 lg:px-12">
            
            {/* -------------------------------------------------------------- */}
            {/* HERO BAR: MINIMAL EDITORIAL SLOGAN & DIRECT CHANNELS           */}
            {/* -------------------------------------------------------------- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-white/[0.08]">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.09] bg-white/[0.03] text-[10.5px] font-mono uppercase tracking-widest text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Valoria Inbound Desk · Salesforce Live</span>
                  </span>
                  <span className="text-[10.5px] font-mono text-zinc-500 hidden sm:inline-block">
                    EST. 2026
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.06]">
                  Where Vision <br />
                  <span className="font-serif italic font-normal text-zinc-300">
                    Becomes Technology.
                  </span>
                </h1>

                <p className="mt-3 text-xs sm:text-sm text-zinc-400 font-light leading-relaxed max-w-xl">
                  Enterprise architecture &amp; engineering inquiry desk. Proposals are reviewed directly by technical leadership with outreach within 24 hours.
                </p>
              </div>

              {/* Direct Channels & Return to Main Site */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="https://join.slack.com/t/valoriatechnology/shared_invite/zt-4grvlnb85-nqRWm616X6d9WD8UFDFvag"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-gradient-to-b from-[#21232b] to-[#121318] px-4 py-2 text-xs font-medium text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all hover:border-zinc-400/40 hover:text-white"
                >
                  <SlackIcon className="size-3.5" />
                  <span>Slack Community</span>
                  <ExternalLink className="size-3 text-zinc-500 group-hover:text-zinc-300" />
                </a>

                <a
                  href="mailto:contact@valoriatech.page"
                  className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-mono text-zinc-400 transition-colors hover:text-white hover:border-white/20"
                >
                  <span>contact@valoriatech.page</span>
                </a>

                <button
                  type="button"
                  onClick={handleReturn}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.05] px-4 py-2 text-xs font-medium text-zinc-300 transition-all hover:bg-white/10 hover:text-white active:scale-95 cursor-pointer"
                >
                  <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
                  <span>Return to Website</span>
                </button>
              </div>
            </div>

            {/* -------------------------------------------------------------- */}
            {/* INFINITE BARS: CONTINUOUS CAPABILITY & TELEMETRY STREAMS       */}
            {/* -------------------------------------------------------------- */}
            <div className="w-full my-10 space-y-2.5">
              <div className="relative w-full overflow-hidden border-y border-white/[0.07] bg-white/[0.015] backdrop-blur-md py-3 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                <div className="flex w-max animate-marquee-left">
                  {[...INFINITE_STREAM_1, ...INFINITE_STREAM_1].map((text, idx) => (
                    <div key={idx} className="flex items-center gap-4 px-6 text-[11px] font-mono tracking-widest text-zinc-400 uppercase select-none">
                      <span className="size-1 rounded-full bg-white/40" />
                      <span className="hover:text-white transition-colors">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative w-full overflow-hidden border-b border-white/[0.07] bg-white/[0.008] backdrop-blur-md py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                <div className="flex w-max animate-marquee-right">
                  {[...INFINITE_STREAM_2, ...INFINITE_STREAM_2].map((text, idx) => (
                    <div key={idx} className="flex items-center gap-4 px-6 text-[10.5px] font-mono tracking-wider text-zinc-500 uppercase select-none">
                      <span className="text-zinc-600">/</span>
                      <span className="hover:text-zinc-300 transition-colors">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------- */}
            {/* SPATIAL INTAKE ARCHITECTURE: BALANCED MULTI-QUADRANT LAYOUT    */}
            {/* -------------------------------------------------------------- */}
            {inquiryResult ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                className="mx-auto my-8 flex max-w-2xl flex-col items-center gap-6 rounded-3xl border border-white/[0.09] bg-[#090b10]/90 p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl sm:p-14"
              >
                <p className="text-base font-medium leading-relaxed text-zinc-100 sm:text-lg" role="status" aria-live="polite">
                  Your inquiry has been submitted successfully!
                </p>

                <button
                  type="button"
                  onClick={handleReturn}
                  className="inline-flex items-center rounded-full border border-white/[0.1] bg-white/[0.05] px-6 py-2.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
                >
                  Done
                </button>
              </motion.div>
            ) : (
              /* Non-Linear Spatially Balanced Intake Grid */
              <form onSubmit={handleSubmit} className="space-y-12">
                {/* 2-Column Balanced Grid (Left Wing & Right Wing) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
                  
                  {/* ========================================================== */}
                  {/* LEFT WING: PHASE 01 (IDENTITY) & PHASE 03 (CADENCE)        */}
                  {/* ========================================================== */}
                  <div className="space-y-10">
                    {/* QUADRANT A: PHASE 01 — CLIENT & ORG IDENTITY */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 pb-3 border-b border-white/[0.07]">
                        <MatteIconBadge icon={User} size="md" />
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                            Phase 01 · Identity &amp; Profile
                          </span>
                          <h3 className="text-base font-semibold text-white tracking-tight">
                            Client &amp; Organization Details
                          </h3>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                            Full Name <span className="text-zinc-200">*</span>
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            required
                            placeholder="e.g. Sarah Jenkins"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-white/[0.08] bg-[#0c0e14]/80 px-4 py-2.5 text-xs text-white placeholder-zinc-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] transition-all duration-200 hover:border-white/20 focus:border-zinc-300/50 focus:bg-[#12141c] focus:outline-none focus:shadow-[0_0_16px_rgba(215,220,230,0.12)]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                            Work Email <span className="text-zinc-200">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            required
                            placeholder="sarah@company.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-white/[0.08] bg-[#0c0e14]/80 px-4 py-2.5 text-xs text-white placeholder-zinc-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] transition-all duration-200 hover:border-white/20 focus:border-zinc-300/50 focus:bg-[#12141c] focus:outline-none focus:shadow-[0_0_16px_rgba(215,220,230,0.12)]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                            Phone / WhatsApp
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            placeholder="+1 (555) 000-0000"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-white/[0.08] bg-[#0c0e14]/80 px-4 py-2.5 text-xs text-white placeholder-zinc-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] transition-all duration-200 hover:border-white/20 focus:border-zinc-300/50 focus:bg-[#12141c] focus:outline-none focus:shadow-[0_0_16px_rgba(215,220,230,0.12)]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                            Job Title / Role
                          </label>
                          <input
                            type="text"
                            name="jobTitle"
                            placeholder="e.g. VP of Engineering"
                            value={formData.jobTitle}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-white/[0.08] bg-[#0c0e14]/80 px-4 py-2.5 text-xs text-white placeholder-zinc-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] transition-all duration-200 hover:border-white/20 focus:border-zinc-300/50 focus:bg-[#12141c] focus:outline-none focus:shadow-[0_0_16px_rgba(215,220,230,0.12)]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                            Company / Org Name <span className="text-zinc-200">*</span>
                          </label>
                          <input
                            type="text"
                            name="companyName"
                            required
                            placeholder="e.g. Apex Dynamics Corp."
                            value={formData.companyName}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-white/[0.08] bg-[#0c0e14]/80 px-4 py-2.5 text-xs text-white placeholder-zinc-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] transition-all duration-200 hover:border-white/20 focus:border-zinc-300/50 focus:bg-[#12141c] focus:outline-none focus:shadow-[0_0_16px_rgba(215,220,230,0.12)]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                            Company Website
                          </label>
                          <input
                            type="url"
                            name="companyWebsite"
                            placeholder="https://apexdynamics.io"
                            value={formData.companyWebsite}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-white/[0.08] bg-[#0c0e14]/80 px-4 py-2.5 text-xs text-white placeholder-zinc-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] transition-all duration-200 hover:border-white/20 focus:border-zinc-300/50 focus:bg-[#12141c] focus:outline-none focus:shadow-[0_0_16px_rgba(215,220,230,0.12)]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                            Company Size
                          </label>
                          <select
                            name="companySize"
                            value={formData.companySize}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-white/[0.08] bg-[#0c0e14] px-4 py-2.5 text-xs text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] transition-all duration-200 hover:border-white/20 focus:border-zinc-300/50 focus:outline-none"
                          >
                            {COMPANY_SIZES.map((size) => (
                              <option key={size} value={size}>
                                {size}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                            Primary Industry
                          </label>
                          <select
                            name="industry"
                            value={formData.industry}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-white/[0.08] bg-[#0c0e14] px-4 py-2.5 text-xs text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] transition-all duration-200 hover:border-white/20 focus:border-zinc-300/50 focus:outline-none"
                          >
                            {INDUSTRIES.map((ind) => (
                              <option key={ind} value={ind}>
                                {ind}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* QUADRANT C: PHASE 03 — CADENCE & BUDGET ALLOCATION */}
                    <div className="space-y-5 pt-4">
                      <div className="flex items-center gap-3 pb-3 border-b border-white/[0.07]">
                        <MatteIconBadge icon={Calendar} size="md" />
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                            Phase 03 · Execution Cadence
                          </span>
                          <h3 className="text-base font-semibold text-white tracking-tight">
                            Target Schedule &amp; Investment Scope
                          </h3>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Timeline Selection */}
                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
                            Delivery Timeline
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {TIMELINES.map((t) => {
                              const isSelected = formData.projectTimeline === t.value;
                              return (
                                <button
                                  key={t.value}
                                  type="button"
                                  onClick={() => handleSelectTimeline(t.value)}
                                  className={`rounded-xl p-2.5 text-center border transition-all duration-200 ${
                                    isSelected
                                      ? 'border-zinc-300/50 bg-[#161821] text-white shadow-[0_0_16px_rgba(215,220,230,0.12),inset_0_1px_0_rgba(255,255,255,0.15)]'
                                      : 'border-white/[0.07] bg-[#0c0e14]/60 text-zinc-400 hover:border-white/20 hover:text-zinc-200'
                                  }`}
                                >
                                  <div className="text-xs font-semibold">{t.label}</div>
                                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{t.sub}</div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Budget Selection */}
                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
                            Estimated Investment Scope
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                            {BUDGETS.map((b) => {
                              const isSelected = formData.budgetRange === b.value;
                              return (
                                <button
                                  key={b.value}
                                  type="button"
                                  onClick={() => handleSelectBudget(b.value)}
                                  className={`rounded-xl p-2.5 text-center border transition-all duration-200 ${
                                    isSelected
                                      ? 'border-zinc-300/50 bg-[#161821] text-white shadow-[0_0_16px_rgba(215,220,230,0.12),inset_0_1px_0_rgba(255,255,255,0.15)]'
                                      : 'border-white/[0.07] bg-[#0c0e14]/60 text-zinc-400 hover:border-white/20 hover:text-zinc-200'
                                  }`}
                                >
                                  <div className="text-xs font-semibold">{b.label}</div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ========================================================== */}
                  {/* RIGHT WING: PHASE 02 (TRACKS) & PHASE 04 (SCOPE & STACK)   */}
                  {/* ========================================================== */}
                  <div className="space-y-10">
                    {/* QUADRANT B: PHASE 02 — SPECIALIZATION TRACK */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 pb-3 border-b border-white/[0.07]">
                        <MatteIconBadge icon={Briefcase} size="md" />
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                            Phase 02 · Specialization Track
                          </span>
                          <h3 className="text-base font-semibold text-white tracking-tight">
                            Core Technology Focus
                          </h3>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        {TECH_TRACKS.map((track) => {
                          const isSelected = formData.primaryInterest === track.id;
                          const TrackIcon = track.icon;

                          return (
                            <button
                              key={track.id}
                              type="button"
                              onClick={() => handleSelectTrack(track.id)}
                              className={`group/tile w-full text-left rounded-xl p-3 sm:p-3.5 transition-all duration-200 border flex items-center gap-3.5 ${
                                isSelected
                                  ? 'border-zinc-300/50 bg-[#161821]/90 shadow-[0_0_20px_rgba(215,220,230,0.12),inset_0_1px_0_rgba(255,255,255,0.15)] text-white'
                                  : 'border-white/[0.07] bg-[#0c0e14]/60 text-zinc-400 hover:border-white/20 hover:bg-[#12141c]/80 hover:text-zinc-200'
                              }`}
                            >
                              <div
                                className={`flex size-8 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 ${
                                  isSelected
                                    ? 'border-zinc-300/50 bg-gradient-to-b from-[#2a2d38] to-[#161820] text-white shadow-[0_0_12px_rgba(215,220,230,0.2)]'
                                    : 'border-white/[0.08] bg-[#16171d] text-zinc-400 group-hover/tile:text-white group-hover/tile:border-white/20'
                                }`}
                              >
                                <TrackIcon className="size-4" strokeWidth={1.6} />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-semibold text-xs sm:text-[13px] tracking-tight truncate">
                                    {track.label}
                                  </span>
                                  {isSelected && (
                                    <span className="size-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] shrink-0" />
                                  )}
                                </div>
                                <p className="text-[11px] text-zinc-400 leading-snug line-clamp-1 mt-0.5">
                                  {track.description}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* QUADRANT D: PHASE 04 — SCOPE & ENVIRONMENT */}
                    <div className="space-y-5 pt-4">
                      <div className="flex items-center gap-3 pb-3 border-b border-white/[0.07]">
                        <MatteIconBadge icon={FileCode2} size="md" />
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                            Phase 04 · Technical Scope
                          </span>
                          <h3 className="text-base font-semibold text-white tracking-tight">
                            Architecture Scope &amp; Problem Statement
                          </h3>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <div className="flex items-center gap-1.5 text-[10.5px] font-mono text-zinc-400">
                              <Terminal className="size-3 text-zinc-500" />
                              <span>valoria:~$ cat requirements.md</span>
                            </div>
                            <span className="text-[10px] font-mono text-zinc-500">
                              {formData.projectScope.length} chars
                            </span>
                          </div>

                          <textarea
                            name="projectScope"
                            required
                            rows={4}
                            placeholder="Describe your technical goals, integrations, bottlenecks, or the systems you are looking to engineer with Valoria..."
                            value={formData.projectScope}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-white/[0.08] bg-[#0c0e14]/90 p-3.5 text-xs text-white placeholder-zinc-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] transition-all duration-200 hover:border-white/20 focus:border-zinc-300/50 focus:bg-[#12141c] focus:outline-none focus:shadow-[0_0_16px_rgba(215,220,230,0.12)] leading-relaxed font-mono"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                              Existing Tech Stack
                            </label>
                            <input
                              type="text"
                              name="existingTechStack"
                              placeholder="e.g. Salesforce CRM, Slack, AWS, React"
                              value={formData.existingTechStack}
                              onChange={handleChange}
                              className="w-full rounded-xl border border-white/[0.08] bg-[#0c0e14]/80 px-4 py-2 text-xs text-white placeholder-zinc-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] transition-all duration-200 hover:border-white/20 focus:border-zinc-300/50 focus:bg-[#12141c] focus:outline-none focus:shadow-[0_0_16px_rgba(215,220,230,0.12)]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                              Preferred Environment
                            </label>
                            <input
                              type="text"
                              name="preferredDeployment"
                              placeholder="e.g. AWS / Hybrid Cloud / Salesforce"
                              value={formData.preferredDeployment}
                              onChange={handleChange}
                              className="w-full rounded-xl border border-white/[0.08] bg-[#0c0e14]/80 px-4 py-2 text-xs text-white placeholder-zinc-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] transition-all duration-200 hover:border-white/20 focus:border-zinc-300/50 focus:bg-[#12141c] focus:outline-none focus:shadow-[0_0_16px_rgba(215,220,230,0.12)]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ========================================================== */}
                {/* BOTTOM SPAN: PHASE 05 — COMPLIANCE & PRIMARY SUBMIT ACTION  */}
                {/* ========================================================== */}
                <div className="pt-8 border-t border-white/[0.08]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06] mb-5">
                    <div className="flex items-center gap-2.5">
                      <MatteIconBadge icon={Lock} size="sm" />
                      <span className="font-mono text-xs text-zinc-300 font-semibold tracking-wide">
                        Enterprise Compliance &amp; Security Guarantee
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">
                      256-Bit TLS · Direct Salesforce Hub Sync
                    </span>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="consentAgreed"
                      checked={formData.consentAgreed}
                      onChange={handleChange}
                      className="mt-0.5 size-4 rounded border-white/20 bg-white/5 text-white accent-white focus:ring-0 cursor-pointer"
                    />
                    <span className="text-[11.5px] leading-relaxed text-zinc-400">
                      I acknowledge that the information provided will be used exclusively by Valoria Technology to evaluate architecture suitability and coordinate technical outreach. I agree to the{' '}
                      <span className="text-zinc-200 underline underline-offset-2">Website Terms</span> and acknowledge the{' '}
                      <span className="text-zinc-200 underline underline-offset-2">Privacy Policy</span>.
                    </span>
                  </label>

                  {/* Submit Action Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-6 border-t border-white/[0.06]">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                      <span className="size-1.5 rounded-full bg-emerald-400" />
                      <span>Transmits directly to Valoria Admissions Hub</span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={handleReturn}
                        className="w-full sm:w-auto rounded-full border border-white/[0.1] bg-white/[0.04] px-6 py-2.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-white px-8 py-3 text-xs font-semibold text-black shadow-[0_4px_24px_rgba(255,255,255,0.22)] transition-all duration-200 hover:bg-neutral-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.35)] active:scale-[0.98] disabled:opacity-60"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="size-4 animate-spin text-black" />
                            <span>Transmitting to Hub...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Project Proposal</span>
                            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {errorMessage && (
                    <p className="mt-4 text-center text-sm text-rose-300" role="alert" aria-live="assertive">
                      {errorMessage}
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ConnectSection;
