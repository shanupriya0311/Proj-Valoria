'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  X,
  ShieldCheck,
  FileText,
  Cookie,
  AlertTriangle,
  Scale,
  GraduationCap,
  ScrollText,
  Search,
  ChevronRight,
  CreditCard,
} from 'lucide-react';
import { LEGAL_DOCUMENTS, type LegalDocument } from '@/data/legal-documents';
import { ValoriaLogo } from './valoria-logo';
import { cn } from '@/lib/utils';

export interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDocumentId?: string;
}

const DOCUMENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'privacy-policy': ShieldCheck,
  'terms-and-conditions': FileText,
  'cookie-policy': Cookie,
  'disclaimer': AlertTriangle,
  'grievance-redressal': Scale,
  'internship-disclaimer': GraduationCap,
  'internship-terms': ScrollText,
  'payment-policy': CreditCard,
};

export function LegalModal({
  isOpen,
  onClose,
  initialDocumentId = 'privacy-policy',
}: LegalModalProps) {
  const prefersReduced = useReducedMotion();
  const [selectedId, setSelectedId] = useState<string>(initialDocumentId);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (initialDocumentId && LEGAL_DOCUMENTS[initialDocumentId]) {
      queueMicrotask(() => {
        setSelectedId(initialDocumentId);
      });
    }
  }, [initialDocumentId]);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const activeDoc: LegalDocument = LEGAL_DOCUMENTS[selectedId] || LEGAL_DOCUMENTS['privacy-policy'];

  const websiteDocs = Object.values(LEGAL_DOCUMENTS).filter((d) => d.category === 'website');
  const internshipDocs = Object.values(LEGAL_DOCUMENTS).filter((d) => d.category === 'internship');

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-modal-title"
          className="fixed inset-0 z-[160] flex items-center justify-center p-3 sm:p-6 md:p-10 select-none overflow-hidden"
        >
          {/* 1. Backdrop Scrim with High-Grade GPU Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
          />

          {/* 2. Floating Translucent Glassmorphic Modal Stage */}
          <motion.div
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 16 }}
            animate={prefersReduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="relative z-10 flex flex-col w-full max-w-5xl h-[92vh] max-h-[880px] rounded-3xl sm:rounded-[32px] border border-white/[0.14] bg-[#0c0e17]/90 backdrop-blur-3xl shadow-[0_24px_80px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.18)] overflow-hidden text-neutral-100"
          >
            {/* Top Specular Rim Light */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
            />

            {/* Modal Header */}
            <header className="shrink-0 flex items-center justify-between px-6 sm:px-8 py-4 sm:py-5 border-b border-white/[0.08] bg-black/40 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="w-24 sm:w-28 text-white">
                  <ValoriaLogo />
                </div>
                <div className="h-5 w-px bg-white/20 hidden sm:block" />
                <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-neutral-400 uppercase">
                  <span className="size-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
                  <span>Trust & Legal Architecture</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close legal modal"
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.05] hover:bg-white/[0.12] text-neutral-300 hover:text-white text-xs font-medium transition cursor-pointer active:scale-95"
                >
                  <span>Close</span>
                  <X className="size-3.5" />
                </button>
              </div>
            </header>

            {/* Modal Body: Left Sidebar Tabs + Right Document Reader */}
            <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
              {/* Left Column: Categorized Document Navigation */}
              <aside className="w-full md:w-72 lg:w-80 shrink-0 border-b md:border-b-0 md:border-r border-white/[0.08] bg-black/25 flex flex-col p-4 sm:p-5 overflow-y-auto [scrollbar-width:none]">
                {/* Search Bar */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search documents…"
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs text-white placeholder:text-neutral-500 focus:border-white/25 focus:ring-2 focus:ring-white/10 focus:outline-none transition font-sans"
                  />
                </div>

                {/* Group 1: Website Legal Structure */}
                <div className="mb-5">
                  <h4 className="px-2 mb-2 text-[10.5px] font-mono uppercase tracking-widest text-neutral-400 font-semibold flex items-center justify-between">
                    <span>Website Legal</span>
                    <span className="text-neutral-500 font-normal">All Visitors</span>
                  </h4>
                  <div className="flex flex-col gap-1">
                    {websiteDocs
                      .filter(
                        (d) =>
                          !searchQuery ||
                          d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.summary.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((doc) => {
                        const Icon = DOCUMENT_ICONS[doc.id] || FileText;
                        const isSelected = selectedId === doc.id;
                        return (
                          <button
                            key={doc.id}
                            type="button"
                            onClick={() => setSelectedId(doc.id)}
                            className={cn(
                              'group flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-medium transition cursor-pointer select-none',
                              isSelected
                                ? 'bg-white/[0.14] text-white border border-white/20 shadow-[0_2px_8px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12)]'
                                : 'text-neutral-400 hover:text-white hover:bg-white/[0.05] border border-transparent'
                            )}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Icon
                                className={cn(
                                  'size-4 shrink-0 transition-colors',
                                  isSelected ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-300'
                                )}
                              />
                              <span className="truncate">{doc.title}</span>
                            </div>
                            <ChevronRight
                              className={cn(
                                'size-3.5 shrink-0 transition-transform',
                                isSelected ? 'opacity-100 translate-x-0.5 text-white' : 'opacity-0 text-neutral-500'
                              )}
                            />
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Group 2: Internship Program Information */}
                <div>
                  <h4 className="px-2 mb-2 text-[10.5px] font-mono uppercase tracking-widest text-neutral-400 font-semibold flex items-center justify-between">
                    <span>Internship Program</span>
                    <span className="text-neutral-500 font-normal">Applicants</span>
                  </h4>
                  <div className="flex flex-col gap-1">
                    {internshipDocs
                      .filter(
                        (d) =>
                          !searchQuery ||
                          d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.summary.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((doc) => {
                        const Icon = DOCUMENT_ICONS[doc.id] || GraduationCap;
                        const isSelected = selectedId === doc.id;
                        return (
                          <button
                            key={doc.id}
                            type="button"
                            onClick={() => setSelectedId(doc.id)}
                            className={cn(
                              'group flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-medium transition cursor-pointer select-none',
                              isSelected
                                ? 'bg-white/[0.14] text-white border border-white/20 shadow-[0_2px_8px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12)]'
                                : 'text-neutral-400 hover:text-white hover:bg-white/[0.05] border border-transparent'
                            )}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Icon
                                className={cn(
                                  'size-4 shrink-0 transition-colors',
                                  isSelected ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-300'
                                )}
                              />
                              <span className="truncate">{doc.title}</span>
                            </div>
                            <ChevronRight
                              className={cn(
                                'size-3.5 shrink-0 transition-transform',
                                isSelected ? 'opacity-100 translate-x-0.5 text-white' : 'opacity-0 text-neutral-500'
                              )}
                            />
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Bottom Trust Badge */}
                <div className="mt-auto pt-6 border-t border-white/[0.06] text-[11px] text-neutral-500 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-neutral-400 font-mono">
                    <ShieldCheck className="size-3.5 text-emerald-400" />
                    <span>DPDP Act 2023 Compliant</span>
                  </div>
                  <p className="text-[10px] leading-relaxed">
                    Verified legal notices governing Valoria Technology systems and candidate disclosures.
                  </p>
                </div>
              </aside>

              {/* Right Column: Full Interactive Document Content */}
              <main className="flex-1 flex flex-col min-h-0 bg-black/10 overflow-hidden select-text">
                <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent]">
                  <div className="max-w-3xl mx-auto flex flex-col gap-8 pb-12">
                    {/* Document Header */}
                    <div className="border-b border-white/[0.08] pb-6">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-white/[0.08] border border-white/10 text-neutral-300">
                          {activeDoc.category === 'website' ? 'Website Legal Structure' : 'Internship Program Disclosure'}
                        </span>
                        <span className="text-neutral-500 text-xs font-mono">·</span>
                        <span className="text-xs font-mono text-neutral-400">
                          Version {activeDoc.version}
                        </span>
                        <span className="text-neutral-500 text-xs font-mono">·</span>
                        <span className="text-xs font-mono text-neutral-400">
                          Effective {activeDoc.effectiveDate}
                        </span>
                      </div>

                      <h1
                        id="legal-modal-title"
                        className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans"
                      >
                        {activeDoc.title}
                      </h1>

                      {/* Executive Summary Card */}
                      <div className="mt-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] text-xs sm:text-sm text-neutral-300/90 leading-relaxed font-sans">
                        <span className="font-semibold text-white block mb-1 font-mono text-xs uppercase tracking-wider">
                          Summary & Purpose:
                        </span>
                        {activeDoc.summary}
                      </div>
                    </div>

                    {/* Document Sections */}
                    <div className="flex flex-col gap-8">
                      {activeDoc.sections.map((section, idx) => (
                        <section key={idx} className="flex flex-col gap-3">
                          <h2 className="text-base sm:text-lg font-semibold tracking-tight text-white font-sans border-l-2 border-blue-400/80 pl-3">
                            {section.heading}
                          </h2>
                          <div className="flex flex-col gap-2.5 pl-3">
                            {section.content.map((paragraph, pIdx) => (
                              <p
                                key={pIdx}
                                className="text-xs sm:text-[13.5px] leading-relaxed text-neutral-300/85 font-normal"
                              >
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        </section>
                      ))}
                    </div>

                    {/* Contact & Verification Footer Block */}
                    <div className="mt-6 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300">
                          Questions & Legal Desk
                        </h4>
                        <p className="text-xs text-neutral-400 mt-1">
                          Direct inquiries to{' '}
                          <a
                            href="mailto:contact@valoriatech.page"
                            className="text-blue-400 hover:underline font-mono"
                          >
                            contact@valoriatech.page
                          </a>{' '}
                          or for internship/cohort applications{' '}
                          <a
                            href="mailto:hr@valoriatech.page"
                            className="text-blue-400 hover:underline font-mono"
                          >
                            hr@valoriatech.page
                          </a>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 rounded-full border border-white/15 bg-white/[0.08] hover:bg-white/[0.14] text-xs font-semibold text-white transition active:scale-95 cursor-pointer shrink-0"
                      >
                        I Understand & Acknowledge
                      </button>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default LegalModal;
