'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Sparkles,
  User,
  Briefcase,
  FileCode2,
  CheckCircle2,
  ArrowRight,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Layers,
  Calendar,
  Globe,
  Zap,
  Server,
  Lock,
  Copy,
  Check,
} from 'lucide-react';
import { SlackIcon } from './icons';
import { StarCasingBackground } from './star-casing-background';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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
    description: 'Autonomous Agentforce Slack workflows, custom Apex engines & Data Cloud.',
    icon: Zap,
  },
  {
    id: 'Autonomous AI & LLM Systems',
    label: 'Autonomous AI & LLM Systems',
    description: 'Bespoke agentic reasoning networks, multimodal pipelines & sovereign LLMs.',
    icon: Cpu,
  },
  {
    id: 'Next-Gen Web & Mobile Platforms',
    label: 'Next-Gen Web & Mobile Platforms',
    description: 'Ultra-low latency reactive frontends, fluid Apple spring physics & native SDKs.',
    icon: Globe,
  },
  {
    id: 'Cloud Infrastructure & DevOps',
    label: 'Cloud Infrastructure & DevOps',
    description: 'Multi-cloud orchestration, zero-trust perimeter security & automated CI/CD.',
    icon: Server,
  },
  {
    id: 'Bespoke Enterprise Architecture',
    label: 'Bespoke Enterprise Architecture',
    description: 'Distributed microservices, real-time message brokers & high-throughput APIs.',
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
  { value: 'To Be Determined', label: 'To Be Determined' },
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
    <div className={`group relative shrink-0 ${sizeClasses} ${className}`}>
      {/* Ambient Grey Glowing Aura (reveals softly on group hover) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-1 rounded-xl bg-white/[0.04] opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* Matte Container with Specular Top Bevel & Deep Charcoal Satin Surface */}
      <div
        className={`relative flex h-full w-full items-center justify-center ${sizeClasses} border border-white/[0.1] bg-gradient-to-b from-[#21232b] via-[#16171d] to-[#0e0f13] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_4px_12px_rgba(0,0,0,0.6)] transition-all duration-300 group-hover:border-zinc-400/50 group-hover:shadow-[0_0_20px_rgba(215,220,230,0.18),inset_0_1px_0_rgba(255,255,255,0.25)]`}
      >
        <Icon className={`${iconSizes} text-zinc-300 transition-colors duration-200 group-hover:text-white`} strokeWidth={1.6} />
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT: CONNECT MODAL
// ============================================================================

export function ConnectModal({ isOpen, onClose }: ConnectModalProps) {
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
  const [inquiryResult, setInquiryResult] = useState<{
    inquiryNumber: string;
    message: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleResetAndClose = useCallback(() => {
    onClose();
    setTimeout(() => {
      setInquiryResult(null);
      setErrorMessage(null);
      setFormData({
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
    }, 300);
  }, [onClose]);

  // Escape key listener to close cleanly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleResetAndClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleResetAndClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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

      const data = await res.json();

      if (data.success) {
        setInquiryResult({
          inquiryNumber: data.inquiryNumber || 'INQ-SUCCESS',
          message: data.message || 'Inquiry registered with Valoria Enterprise Hub.',
        });
      } else {
        setErrorMessage(data.message || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err: unknown) {
      console.error('Submission error:', err);
      setErrorMessage('Could not send your inquiry. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyTicket = () => {
    if (inquiryResult?.inquiryNumber) {
      navigator.clipboard.writeText(inquiryResult.inquiryNumber);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-5 md:p-8 overflow-y-auto">
      {/* 1. Deep Minimal Dark Translucent Backdrop with Vignette */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleResetAndClose}
        className="fixed inset-0 bg-[#040507]/90 backdrop-blur-2xl"
      />

      {/* 2. Main Glassmorphic Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 18 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="relative my-auto w-full max-w-4xl rounded-2xl sm:rounded-3xl border border-white/[0.09] bg-[#090b10]/95 shadow-[0_32px_120px_rgba(0,0,0,0.92),0_0_80px_rgba(255,255,255,0.02),inset_0_1px_1px_rgba(255,255,255,0.12)] backdrop-blur-3xl overflow-hidden text-neutral-200"
      >
        {/* Star Casing Background with EXACTLY ONE Pink Shooting Star */}
        <StarCasingBackground className="opacity-90" />

        {/* Specular Top Rim Light */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent z-10"
        />

        {/* Ambient Radial Dark Gradients */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 -left-40 size-96 rounded-full bg-white/[0.015] blur-3xl z-0"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -right-40 size-96 rounded-full bg-white/[0.012] blur-3xl z-0"
        />

        {/* ------------------------------------------------------------------ */}
        {/* MODAL HEADER: BRAND BAR & MATTE CONTROLS                          */}
        {/* ------------------------------------------------------------------ */}
        <div className="relative z-10 px-5 sm:px-9 pt-7 pb-5 border-b border-white/[0.07] flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <MatteIconBadge icon={Sparkles} size="lg" />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-[10px] font-mono uppercase tracking-widest text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Valoria Inbound Desk · Salesforce Live</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono text-zinc-500">
                  EST. 2026
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-white flex items-center gap-2.5">
                <span>Let&apos;s Connect</span>
              </h2>
              <p className="mt-1 text-xs sm:text-[13px] text-zinc-400 leading-relaxed max-w-xl">
                Collaborate with Valoria Technology. Share your technical requirements, architectural scope, or enterprise roadmap below.
              </p>
            </div>
          </div>

          {/* Close Button: Matte Finish with Ambient Grey Hover Glow */}
          <button
            type="button"
            onClick={handleResetAndClose}
            className="group relative flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.09] bg-gradient-to-b from-[#21232b] via-[#16171d] to-[#0e0f13] text-zinc-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_8px_rgba(0,0,0,0.5)] transition-all duration-200 hover:border-zinc-400/50 hover:text-white hover:shadow-[0_0_18px_rgba(215,220,230,0.16)] active:scale-95"
            aria-label="Close dialog"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* MODAL BODY (SCROLLABLE)                                            */}
        {/* ------------------------------------------------------------------ */}
        <div className="relative z-10 max-h-[74vh] overflow-y-auto px-5 sm:px-9 py-6 space-y-6">
          {inquiryResult ? (
            /* ============================================================== */
            /* SUCCESS TRANSMISSION SCREEN (CRYPTO TICKET)                    */
            /* ============================================================== */
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              className="py-10 flex flex-col items-center justify-center text-center"
            >
              <div className="group relative mb-6">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-2 rounded-full bg-emerald-500/10 blur-xl"
                />
                <div className="relative flex size-16 items-center justify-center rounded-2xl border border-white/[0.12] bg-gradient-to-b from-[#21242b] via-[#16181f] to-[#0f1014] text-emerald-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_0_24px_rgba(16,185,129,0.15)]">
                  <CheckCircle2 className="size-8 stroke-[2.2]" />
                </div>
              </div>

              <span className="font-mono text-[11px] uppercase tracking-widest text-emerald-400 mb-1.5">
                Transmitted via TLS Gateway
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                Inquiry Successfully Logged
              </h3>
              <p className="max-w-md text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                Your partnership proposal is logged directly into the Valoria Salesforce Enterprise Hub. An engineering lead will review your scope and initiate outreach within 24 hours.
              </p>

              {/* Cryptographic Ticket Card */}
              <div className="w-full max-w-lg rounded-2xl border border-white/[0.09] bg-[#0e1017]/80 p-5 text-left font-mono text-xs mb-8 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
                <div className="flex justify-between items-center pb-3 border-b border-white/[0.06]">
                  <span className="text-zinc-500">REFERENCE TICKET:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold tracking-wider text-sm">{inquiryResult.inquiryNumber}</span>
                    <button
                      type="button"
                      onClick={handleCopyTicket}
                      title="Copy Reference Number"
                      className="p-1 rounded-md border border-white/[0.08] bg-white/[0.04] text-zinc-400 hover:text-white hover:border-white/20 transition-colors"
                    >
                      {isCopied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2.5 border-b border-white/[0.06]">
                  <span className="text-zinc-500">ORGANIZATION:</span>
                  <span className="text-zinc-200 font-sans font-medium">{formData.companyName}</span>
                </div>

                <div className="flex justify-between items-center py-2.5 border-b border-white/[0.06]">
                  <span className="text-zinc-500">PRIMARY TRACK:</span>
                  <span className="text-zinc-200 font-sans font-medium truncate max-w-[260px]">
                    {formData.primaryInterest}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3 text-[11px]">
                  <span className="text-zinc-500">HUB STATUS:</span>
                  <span className="text-emerald-400 font-semibold uppercase flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Synchronized with Salesforce</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href="https://join.slack.com/t/valoriatechnology/shared_invite/zt-4grvlnb85-nqRWm616X6d9WD8UFDFvag"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.09] bg-gradient-to-b from-[#21232b] to-[#121318] px-4 py-2.5 text-xs font-medium text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all hover:border-zinc-400/40 hover:text-white hover:shadow-[0_0_16px_rgba(215,220,230,0.14)]"
                >
                  <SlackIcon className="size-3.5" />
                  <span>Join Slack Community</span>
                  <ExternalLink className="size-3 text-zinc-500 group-hover:text-zinc-300" />
                </a>

                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-xs font-semibold text-black shadow-[0_4px_16px_rgba(255,255,255,0.15)] transition-all hover:bg-neutral-200 active:scale-[0.98]"
                >
                  Done
                </button>
              </div>
            </motion.div>
          ) : (
            /* ============================================================== */
            /* REDESIGNED COMPONENT-STYLED MULTI-SECTION FORM                 */
            /* ============================================================== */
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {errorMessage && (
                <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs flex items-center gap-2.5 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                  <ShieldCheck className="size-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* ------------------------------------------------------------ */}
              {/* COMPONENT CARD 1: CLIENT & ENTERPRISE PROFILE               */}
              {/* ------------------------------------------------------------ */}
              <div className="group rounded-2xl border border-white/[0.08] bg-[#0c0e14]/70 p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl transition-all duration-300 hover:border-white/[0.14]">
                <div className="flex items-center gap-3 pb-3 mb-5 border-b border-white/[0.06]">
                  <MatteIconBadge icon={User} size="md" />
                  <div>
                    <span className="font-mono text-[10.5px] font-semibold uppercase tracking-wider text-zinc-400">
                      01 · Client Identity &amp; Organization
                    </span>
                    <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                      Primary Contact &amp; Business Profile
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
                      className="w-full rounded-xl border border-white/[0.08] bg-[#0e1017]/90 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] transition-all duration-200 hover:border-white/20 focus:border-zinc-300/50 focus:bg-[#12141c] focus:outline-none focus:shadow-[0_0_14px_rgba(215,220,230,0.12)]"
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
                      className="w-full rounded-xl border border-white/[0.08] bg-[#0e1017]/90 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] transition-all duration-200 hover:border-white/20 focus:border-zinc-300/50 focus:bg-[#12141c] focus:outline-none focus:shadow-[0_0_14px_rgba(215,220,230,0.12)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                      Phone Number / WhatsApp
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/[0.08] bg-[#0e1017]/90 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] transition-all duration-200 hover:border-white/20 focus:border-zinc-300/50 focus:bg-[#12141c] focus:outline-none focus:shadow-[0_0_14px_rgba(215,220,230,0.12)]"
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
                      className="w-full rounded-xl border border-white/[0.08] bg-[#0e1017]/90 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] transition-all duration-200 hover:border-white/20 focus:border-zinc-300/50 focus:bg-[#12141c] focus:outline-none focus:shadow-[0_0_14px_rgba(215,220,230,0.12)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                      Company / Organization Name <span className="text-zinc-200">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      required
                      placeholder="e.g. Apex Dynamics Corp."
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/[0.08] bg-[#0e1017]/90 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] transition-all duration-200 hover:border-white/20 focus:border-zinc-300/50 focus:bg-[#12141c] focus:outline-none focus:shadow-[0_0_14px_rgba(215,220,230,0.12)]"
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
                      className="w-full rounded-xl border border-white/[0.08] bg-[#0e1017]/90 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] transition-all duration-200 hover:border-white/20 focus:border-zinc-300/50 focus:bg-[#12141c] focus:outline-none focus:shadow-[0_0_14px_rgba(215,220,230,0.12)]"
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
                      className="w-full rounded-xl border border-white/[0.08] bg-[#0e1017] px-3.5 py-2.5 text-xs text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] transition-all duration-200 hover:border-white/20 focus:border-zinc-300/50 focus:outline-none"
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
                      className="w-full rounded-xl border border-white/[0.08] bg-[#0e1017] px-3.5 py-2.5 text-xs text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] transition-all duration-200 hover:border-white/20 focus:border-zinc-300/50 focus:outline-none"
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

              {/* ------------------------------------------------------------ */}
              {/* COMPONENT CARD 2: STRATEGIC ENGAGEMENT TRACK                */}
              {/* ------------------------------------------------------------ */}
              <div className="group rounded-2xl border border-white/[0.08] bg-[#0c0e14]/70 p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl transition-all duration-300 hover:border-white/[0.14]">
                <div className="flex items-center gap-3 pb-3 mb-5 border-b border-white/[0.06]">
                  <MatteIconBadge icon={Briefcase} size="md" />
                  <div>
                    <span className="font-mono text-[10.5px] font-semibold uppercase tracking-wider text-zinc-400">
                      02 · Core Specialization
                    </span>
                    <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                      Primary Engagement Track
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TECH_TRACKS.map((track) => {
                    const isSelected = formData.primaryInterest === track.id;
                    const TrackIcon = track.icon;

                    return (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() => handleSelectTrack(track.id)}
                        className={`group/tile text-left rounded-xl p-3.5 transition-all duration-200 border flex items-start gap-3.5 ${
                          isSelected
                            ? 'border-zinc-300/50 bg-[#161821]/90 shadow-[0_0_24px_rgba(215,220,230,0.12),inset_0_1px_0_rgba(255,255,255,0.15)] text-white'
                            : 'border-white/[0.07] bg-[#0e1017]/60 text-zinc-400 hover:border-white/20 hover:bg-[#12141c]/80 hover:text-zinc-200'
                        }`}
                      >
                        {/* Matte Icon for each tile with grey glow */}
                        <div
                          className={`flex size-8 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 ${
                            isSelected
                              ? 'border-zinc-300/50 bg-gradient-to-b from-[#2a2d38] to-[#161820] text-white shadow-[0_0_14px_rgba(215,220,230,0.2)]'
                              : 'border-white/[0.08] bg-[#16171d] text-zinc-400 group-hover/tile:text-white group-hover/tile:border-white/20'
                          }`}
                        >
                          <TrackIcon className="size-4" strokeWidth={1.6} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-semibold text-xs sm:text-[12.5px] tracking-tight truncate">
                              {track.label}
                            </span>
                            {isSelected && (
                              <span className="size-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-400 leading-snug line-clamp-2">
                            {track.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ------------------------------------------------------------ */}
              {/* COMPONENT CARD 3: TIMELINE & BUDGET ALLOCATION              */}
              {/* ------------------------------------------------------------ */}
              <div className="group rounded-2xl border border-white/[0.08] bg-[#0c0e14]/70 p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl transition-all duration-300 hover:border-white/[0.14]">
                <div className="flex items-center gap-3 pb-3 mb-5 border-b border-white/[0.06]">
                  <MatteIconBadge icon={Calendar} size="md" />
                  <div>
                    <span className="font-mono text-[10.5px] font-semibold uppercase tracking-wider text-zinc-400">
                      03 · Project Cadence &amp; Scale
                    </span>
                    <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                      Execution Timeline &amp; Budget Range
                    </h3>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Timeline Selection */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2.5">
                      Target Delivery Schedule
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {TIMELINES.map((t) => {
                        const isSelected = formData.projectTimeline === t.value;
                        return (
                          <button
                            key={t.value}
                            type="button"
                            onClick={() => handleSelectTimeline(t.value)}
                            className={`rounded-xl p-2.5 text-center border transition-all duration-200 ${
                              isSelected
                                ? 'border-zinc-300/50 bg-[#161821] text-white shadow-[0_0_18px_rgba(215,220,230,0.12),inset_0_1px_0_rgba(255,255,255,0.15)]'
                                : 'border-white/[0.07] bg-[#0e1017]/60 text-zinc-400 hover:border-white/20 hover:text-zinc-200'
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
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2.5">
                      Estimated Investment Scope
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {BUDGETS.map((b) => {
                        const isSelected = formData.budgetRange === b.value;
                        return (
                          <button
                            key={b.value}
                            type="button"
                            onClick={() => handleSelectBudget(b.value)}
                            className={`rounded-xl p-2.5 text-center border transition-all duration-200 ${
                              isSelected
                                ? 'border-zinc-300/50 bg-[#161821] text-white shadow-[0_0_18px_rgba(215,220,230,0.12),inset_0_1px_0_rgba(255,255,255,0.15)]'
                                : 'border-white/[0.07] bg-[#0e1017]/60 text-zinc-400 hover:border-white/20 hover:text-zinc-200'
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

              {/* ------------------------------------------------------------ */}
              {/* COMPONENT CARD 4: ARCHITECTURE SCOPE & STACK                */}
              {/* ------------------------------------------------------------ */}
              <div className="group rounded-2xl border border-white/[0.08] bg-[#0c0e14]/70 p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl transition-all duration-300 hover:border-white/[0.14]">
                <div className="flex items-center gap-3 pb-3 mb-5 border-b border-white/[0.06]">
                  <MatteIconBadge icon={FileCode2} size="md" />
                  <div>
                    <span className="font-mono text-[10.5px] font-semibold uppercase tracking-wider text-zinc-400">
                      04 · Architecture &amp; Technical Scope
                    </span>
                    <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                      Project Vision &amp; Existing Environment
                    </h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                        Project Scope &amp; Problem Statement <span className="text-zinc-200">*</span>
                      </label>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {formData.projectScope.length} chars
                      </span>
                    </div>
                    <textarea
                      name="projectScope"
                      required
                      rows={4}
                      placeholder="Detail your goals, technical constraints, integrations, or challenges you are looking to solve with Valoria..."
                      value={formData.projectScope}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/[0.08] bg-[#0e1017]/90 p-3.5 text-xs text-white placeholder-zinc-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] transition-all duration-200 hover:border-white/20 focus:border-zinc-300/50 focus:bg-[#12141c] focus:outline-none focus:shadow-[0_0_14px_rgba(215,220,230,0.12)] leading-relaxed"
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
                        placeholder="e.g. Salesforce CRM, Slack, AWS, React, Python"
                        value={formData.existingTechStack}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/[0.08] bg-[#0e1017]/90 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] transition-all duration-200 hover:border-white/20 focus:border-zinc-300/50 focus:bg-[#12141c] focus:outline-none focus:shadow-[0_0_14px_rgba(215,220,230,0.12)]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                        Preferred Hosting &amp; Environment
                      </label>
                      <input
                        type="text"
                        name="preferredDeployment"
                        placeholder="e.g. AWS / Hybrid Cloud / Salesforce Lightning"
                        value={formData.preferredDeployment}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/[0.08] bg-[#0e1017]/90 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] transition-all duration-200 hover:border-white/20 focus:border-zinc-300/50 focus:bg-[#12141c] focus:outline-none focus:shadow-[0_0_14px_rgba(215,220,230,0.12)]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------------------ */}
              {/* COMPONENT CARD 5: STATUTORY CONSENT & SUBMISSION            */}
              {/* ------------------------------------------------------------ */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0c0e14]/70 p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06] mb-4">
                  <div className="flex items-center gap-2.5">
                    <MatteIconBadge icon={Lock} size="sm" />
                    <span className="font-mono text-xs text-zinc-300 font-semibold tracking-wide">
                      Enterprise Compliance &amp; Security Assurance
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">
                    256-Bit TLS · Zero Third-Party Telemetry
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

                {/* Action Row */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 mt-4 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    <span>Direct Sync · Valoria Admissions &amp; Inquiries Hub</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleResetAndClose}
                      className="w-full sm:w-auto rounded-xl border border-white/[0.09] bg-gradient-to-b from-[#1e2027] to-[#111216] px-5 py-2.5 text-xs font-medium text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-200 hover:border-zinc-400/40 hover:text-white active:scale-95"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-2.5 text-xs font-semibold text-black shadow-[0_4px_20px_rgba(255,255,255,0.18)] transition-all duration-200 hover:bg-neutral-200 hover:shadow-[0_0_24px_rgba(255,255,255,0.3)] active:scale-[0.98] disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="size-3.5 animate-spin text-black" />
                          <span>Transmitting to Hub...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Project Proposal</span>
                          <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default ConnectModal;
