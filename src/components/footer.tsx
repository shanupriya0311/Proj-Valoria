'use client';

import React, { useState } from 'react';
import { ValoriaLogo } from './valoria-logo';
import { ArrowUpRight, Mail } from 'lucide-react';
import { GithubIcon, SlackIcon } from './icons';
import { LegalModal } from './legal-modal';

export function Footer() {
  const [activeLegalDoc, setActiveLegalDoc] = useState<string | null>(null);

  const openLegal = (docId: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setActiveLegalDoc(docId);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="relative border-t border-white/[0.08] bg-[#07080a] text-neutral-400">
        {/* Subtle top ambient specular light */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />

        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 pt-16 pb-12">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 pb-14 border-b border-white/[0.06]">
            {/* Brand Column (Spans 5 cols on lg) */}
            <div className="lg:col-span-5 flex flex-col items-start gap-4 pr-0 lg:pr-8">
              <button
                type="button"
                onClick={scrollToTop}
                className="group flex items-center transition-opacity hover:opacity-85"
                aria-label="Back to top"
              >
                <div className="w-[130px] text-white">
                  <ValoriaLogo />
                </div>
              </button>

              <p className="text-sm font-normal tracking-wide text-neutral-300 pt-1">
                Where Vision Becomes Technology
              </p>

              <p className="text-xs leading-relaxed text-neutral-500 max-w-sm">
                Next-generation intelligent systems, bespoke software engineering, and production-grade architectures designed to scale.
              </p>

              {/* Direct Official Contact */}
              <div className="pt-2">
                <a
                  href="mailto:contact@valoriatech.page"
                  className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3.5 py-1.5 text-xs text-neutral-300 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
                >
                  <Mail className="size-3.5 text-neutral-400" />
                  <span>contact@valoriatech.page</span>
                </a>
              </div>

              {/* Verified Community Links: Slack & GitHub */}
              <div className="flex items-center gap-2.5 pt-3">
                <a
                  href="https://join.slack.com/t/valoriatechnology/shared_invite/zt-4grvlnb85-nqRWm616X6d9WD8UFDFvag"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 rounded-lg border border-white/[0.08] bg-neutral-900/60 px-3 py-1.5 text-xs font-medium text-neutral-300 transition-all duration-200 hover:border-white/20 hover:bg-neutral-800/80 hover:text-white"
                  aria-label="Join Valoria Technology on Slack"
                >
                  <SlackIcon className="size-3.5 text-neutral-400 transition-colors group-hover:text-white" />
                  <span>Slack Community</span>
                  <ArrowUpRight className="size-3 text-neutral-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                </a>

                <a
                  href="https://github.com/valoriatechnology"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 rounded-lg border border-white/[0.08] bg-neutral-900/60 px-3 py-1.5 text-xs font-medium text-neutral-300 transition-all duration-200 hover:border-white/20 hover:bg-neutral-800/80 hover:text-white"
                  aria-label="Valoria Technology on GitHub"
                >
                  <GithubIcon className="size-3.5 text-neutral-400 transition-colors group-hover:text-white" />
                  <span>GitHub</span>
                  <ArrowUpRight className="size-3 text-neutral-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                </a>
              </div>
            </div>

            {/* Navigation Column (2 cols) */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-300">
                Navigation
              </span>
              <ul className="flex flex-col gap-2.5 text-xs">
                <li>
                  <a href="#home" className="transition-colors hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#build" className="transition-colors hover:text-white">
                    Build & Services
                  </a>
                </li>
                <li>
                  <a href="#lab" className="transition-colors hover:text-white">
                    Laboratory
                  </a>
                </li>
                <li>
                  <a href="#launch" className="transition-colors hover:text-white">
                    Launch
                  </a>
                </li>
              </ul>
            </div>

            {/* Statutory Website Legal (3 cols) */}
            <div className="lg:col-span-3 flex flex-col gap-3">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-300">
                Legal & Governance
              </span>
              <ul className="flex flex-col gap-2.5 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={(e) => openLegal('privacy-policy', e)}
                    className="text-left text-neutral-400 transition-colors hover:text-white"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={(e) => openLegal('terms-and-conditions', e)}
                    className="text-left text-neutral-400 transition-colors hover:text-white"
                  >
                    Website Terms & Conditions
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={(e) => openLegal('cookie-policy', e)}
                    className="text-left text-neutral-400 transition-colors hover:text-white"
                  >
                    Cookie Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={(e) => openLegal('disclaimer', e)}
                    className="text-left text-neutral-400 transition-colors hover:text-white"
                  >
                    Website Disclaimer
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={(e) => openLegal('grievance-redressal', e)}
                    className="text-left text-neutral-400 transition-colors hover:text-white"
                  >
                    Grievance Redressal Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={(e) => openLegal('payment-policy', e)}
                    className="text-left text-neutral-400 transition-colors hover:text-white"
                  >
                    Payment & Refund Policy
                  </button>
                </li>
              </ul>
            </div>

            {/* Careers & Internship (2 cols) */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-300">
                Careers & Talent
              </span>
              <ul className="flex flex-col gap-2.5 text-xs">
                <li>
                  <a
                    href="#launch"
                    className="inline-flex items-center gap-1 font-medium text-neutral-200 transition-colors hover:text-white"
                  >
                    <span>Apply for Internship</span>
                    <ArrowUpRight className="size-3 text-neutral-400" />
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={(e) => openLegal('internship-disclaimer', e)}
                    className="text-left text-neutral-400 transition-colors hover:text-white"
                  >
                    Program Disclaimer
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={(e) => openLegal('internship-terms', e)}
                    className="text-left text-neutral-400 transition-colors hover:text-white"
                  >
                    Application Terms
                  </button>
                </li>
                <li className="pt-1.5">
                  <a
                    href="mailto:hr@valoriatech.page"
                    className="text-[11px] text-neutral-500 transition-colors hover:text-neutral-300"
                  >
                    hr@valoriatech.page
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Fine Print Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
            <p>© 2026 Valoria Technology. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={scrollToTop}
                className="text-neutral-500 transition-colors hover:text-neutral-300"
              >
                Back to top ↑
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Interactive Legal Document Viewer */}
      <LegalModal
        isOpen={activeLegalDoc !== null}
        onClose={() => setActiveLegalDoc(null)}
        initialDocumentId={activeLegalDoc || 'privacy-policy'}
      />
    </>
  );
}

export default Footer;
