'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  X,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Search,
  Check,
  Upload,
  Trophy,
  Eye,
  EyeOff,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { ValoriaLogo } from '@/components/valoria-logo';
import { IndiaStateMap } from '@/components/india-state-map';
import { LegalModal } from '@/components/legal-modal';
import { cn } from '@/lib/utils';

// ============================================================================
// DATA: DEGREES & ENGINEERING TRACKS
// ============================================================================

export interface DegreeOption {
  id: string;
  label: string;
  category: "Bachelor's (UG)" | "Master's (PG)";
}

export const DEGREE_OPTIONS: DegreeOption[] = [
  // Bachelor's (UG)
  { id: 'be', label: 'B.E.', category: "Bachelor's (UG)" },
  { id: 'btech', label: 'B.Tech', category: "Bachelor's (UG)" },
  { id: 'bsc', label: 'B.Sc', category: "Bachelor's (UG)" },
  { id: 'bca', label: 'BCA', category: "Bachelor's (UG)" },
  { id: 'bvoc', label: 'B.Voc', category: "Bachelor's (UG)" },
  { id: 'bdes', label: 'B.Des', category: "Bachelor's (UG)" },
  // Master's (PG)
  { id: 'me', label: 'M.E.', category: "Master's (PG)" },
  { id: 'mtech', label: 'M.Tech', category: "Master's (PG)" },
  { id: 'msc', label: 'M.Sc', category: "Master's (PG)" },
  { id: 'mca', label: 'MCA', category: "Master's (PG)" },
  { id: 'mba', label: 'MBA', category: "Master's (PG)" },
];

export const ENGINEERING_TRACKS: string[] = [
  // Bachelor's – Engineering (UG)
  'Computer Science Engineering (CSE)',
  'Information Technology (IT)',
  'Artificial Intelligence & Machine Learning (AI & ML)',
  'Artificial Intelligence & Data Science (AI & DS)',
  'Data Science (DS)',
  'Cyber Security (CS)',
  'Computer Science and Business Systems (CSBS)',
  'Information Science and Engineering (ISE)',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Electrical Engineering (EE)',
  'Electronics & Instrumentation Engineering (EIE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
  'Automobile Engineering (AE)',
  'Mechatronics Engineering (MCT)',
  'Robotics & Automation (RA)',
  'Internet of Things (IoT)',
  'Biomedical Engineering (BME)',
  'Biotechnology (BT)',
  'Chemical Engineering (CHE)',
  'Aerospace Engineering (ASE)',
  'Aeronautical Engineering (ANE)',
  'Agricultural Engineering (AG)',
  'Industrial Engineering (IE)',
  'Production Engineering (PE)',
  'Instrumentation & Control Engineering (ICE)',
  'Environmental Engineering (ENV)',
  'Mining Engineering (MIN)',
  'Food Technology (FT)',
  'Textile Technology (TT)',
  'Marine Engineering (MRE)',

  // Master's – Engineering (PG)
  'Software Engineering (SE)',
  'Cloud Computing',
  'Information Security',
  'Thermal Engineering (TE)',
  'Manufacturing Engineering (MFG)',
  'Engineering Design (ED)',
  'CAD/CAM',
  'Mechatronics (MCT)',
  'Structural Engineering (STR)',
  'Construction Engineering & Management (CEM)',
  'Geotechnical Engineering (GE)',
  'Transportation Engineering (TR)',
  'Power Systems (PS)',
  'Power Electronics (PE)',
  'VLSI Design',
  'Embedded Systems (ES)',
  'Communication Systems (COM)',
  'Control & Instrumentation Engineering (CIE)',
];

const GRADUATION_YEARS = ['2027', '2028', '2029', '2030'];

// ============================================================================
// 3D CIRCULAR ROTATING CYLINDER PICKER FOR DEGREES
// ============================================================================
interface CircularDegreePickerProps {
  selectedDegree: string;
  onSelectDegree: (degree: string) => void;
}

function CircularDegreePicker({
  selectedDegree,
  onSelectDegree,
}: CircularDegreePickerProps) {
  const [filterCategory, setFilterCategory] = useState<'UG' | 'PG'>('UG');
  const [scrollProgress, setScrollProgress] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const wheelOffsetRef = useRef(0);
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filteredDegrees = useMemo(() => {
    if (filterCategory === 'PG') {
      return DEGREE_OPTIONS.filter((d) => d.category === "Master's (PG)");
    }
    return DEGREE_OPTIONS.filter((d) => d.category === "Bachelor's (UG)");
  }, [filterCategory]);

  const currentIndex = useMemo(() => {
    const idx = filteredDegrees.findIndex((d) => d.label === selectedDegree);
    return idx >= 0 ? idx : 0;
  }, [filteredDegrees, selectedDegree]);

  const indexRef = useRef(currentIndex);
  useEffect(() => {
    indexRef.current = currentIndex;
  }, [currentIndex]);

  const handleCategoryChange = (cat: 'UG' | 'PG') => {
    setFilterCategory(cat);
    wheelOffsetRef.current = 0;
    setScrollProgress(0);
    const nextList =
      cat === 'PG'
        ? DEGREE_OPTIONS.filter((d) => d.category === "Master's (PG)")
        : DEGREE_OPTIONS.filter((d) => d.category === "Bachelor's (UG)");
    if (!nextList.some((d) => d.label === selectedDegree) && nextList[0]) {
      onSelectDegree(nextList[0].label);
    }
  };

  const handlePrev = useCallback(() => {
    const nextIdx = (indexRef.current - 1 + filteredDegrees.length) % filteredDegrees.length;
    indexRef.current = nextIdx;
    onSelectDegree(filteredDegrees[nextIdx]!.label);
  }, [filteredDegrees, onSelectDegree]);

  const handleNext = useCallback(() => {
    const nextIdx = (indexRef.current + 1) % filteredDegrees.length;
    indexRef.current = nextIdx;
    onSelectDegree(filteredDegrees[nextIdx]!.label);
  }, [filteredDegrees, onSelectDegree]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const PIXELS_PER_STEP = 120;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const rawDelta =
        e.deltaMode === 1
          ? e.deltaY * 24
          : e.deltaMode === 2
          ? e.deltaY * 100
          : e.deltaY;

      // Clamp per-event delta so fast trackpad flicks feel weighted and never skip abruptly
      const clampedDelta = Math.max(-45, Math.min(45, rawDelta));
      let nextOffset = wheelOffsetRef.current + clampedDelta / PIXELS_PER_STEP;

      while (nextOffset >= 0.5) {
        nextOffset -= 1;
        handleNext();
      }
      while (nextOffset <= -0.5) {
        nextOffset += 1;
        handlePrev();
      }

      wheelOffsetRef.current = nextOffset;
      setScrollProgress(nextOffset);

      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = setTimeout(() => {
        wheelOffsetRef.current = 0;
        setScrollProgress(0);
      }, 110);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    };
  }, [handleNext, handlePrev]);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
      {/* Category Filter Pills & Navigation */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleCategoryChange('UG')}
            className={cn(
              'px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer active:scale-95',
              filterCategory === 'UG'
                ? 'bg-white/[0.14] text-white font-semibold border border-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12)]'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.06]'
            )}
          >
            Bachelor&apos;s (UG)
          </button>
          <button
            type="button"
            onClick={() => handleCategoryChange('PG')}
            className={cn(
              'px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer active:scale-95',
              filterCategory === 'PG'
                ? 'bg-white/[0.14] text-white font-semibold border border-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12)]'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.06]'
            )}
          >
            Master&apos;s (PG)
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous degree"
            className="flex size-7 items-center justify-center rounded-full border border-white/[0.1] text-neutral-400 hover:border-white/20 hover:text-white hover:bg-white/[0.06] transition active:scale-95 cursor-pointer"
          >
            <ChevronUp className="size-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next degree"
            className="flex size-7 items-center justify-center rounded-full border border-white/[0.1] text-neutral-400 hover:border-white/20 hover:text-white hover:bg-white/[0.06] transition active:scale-95 cursor-pointer"
          >
            <ChevronDown className="size-4" />
          </button>
        </div>
      </div>

      {/* 3D Circular Rotary Stage (Mouse Wheel + Click Scrollable) */}
      <div
        ref={stageRef}
        className="relative h-44 w-full overflow-hidden rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-center select-none shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] overscroll-contain cursor-ns-resize"
        style={{ perspective: 900 }}
      >
        {/* Optical Glass Center Bracket */}
        <div className="pointer-events-none absolute inset-x-3 h-12 rounded-xl border border-white/20 bg-white/[0.06] shadow-[0_0_20px_rgba(255,255,255,0.06),inset_0_1px_0_rgba(255,255,255,0.12)] z-0" />

        {/* 3D Cylinder Rotating List */}
        <div
          className="relative w-full h-full flex flex-col items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {filteredDegrees.map((deg, idx) => {
            const total = filteredDegrees.length;
            let rawOffset = idx - currentIndex;
            if (rawOffset > total / 2) rawOffset -= total;
            if (rawOffset < -total / 2) rawOffset += total;

            const effectiveOffset = rawOffset - scrollProgress;
            if (Math.abs(effectiveOffset) > 3.2) return null;

            const rotateX = effectiveOffset * 28;
            const translateY = effectiveOffset * 42;
            const translateZ = Math.cos((effectiveOffset * Math.PI) / 6) * 70 - 70;
            const opacity = Math.max(0.15, 1 - Math.abs(effectiveOffset) * 0.35);
            const scale = Math.max(0.8, 1 - Math.abs(effectiveOffset) * 0.08);
            const isSelected = rawOffset === 0;

            return (
              <motion.button
                key={deg.id}
                type="button"
                onClick={() => onSelectDegree(deg.label)}
                animate={{
                  rotateX,
                  y: translateY,
                  z: translateZ,
                  scale,
                  opacity,
                }}
                transition={{ type: 'spring', stiffness: 320, damping: 30, mass: 0.7 }}
                style={{
                  position: 'absolute',
                  transformStyle: 'preserve-3d',
                }}
                className={cn(
                  'h-12 w-[92%] rounded-xl flex items-center justify-between px-5 font-medium transition-colors cursor-pointer z-10',
                  isSelected
                    ? 'text-white font-semibold text-base'
                    : 'text-neutral-400 text-sm hover:text-white'
                )}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      'size-2 rounded-full transition-all',
                      isSelected
                        ? 'bg-white scale-125 shadow-[0_0_10px_rgba(255,255,255,0.5)]'
                        : 'bg-neutral-600'
                    )}
                  />
                  <span>{deg.label}</span>
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                  {deg.category}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ENGINEERING TRACK: TYPING & AUTO-FILLING DIRECTIONAL SLIDER
// ============================================================================
interface TrackAutofillSliderProps {
  value: string;
  onChange: (val: string) => void;
}

function TrackAutofillSlider({ value, onChange }: TrackAutofillSliderProps) {
  const [query, setQuery] = useState(value);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Find matches based on typing query
  const matchingTracks = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return ENGINEERING_TRACKS.filter((track) => track.toLowerCase().includes(q));
  }, [query]);

  const topMatch = matchingTracks[0] || '';
  const isSelected = Boolean(query && topMatch && query.trim().toLowerCase() === topMatch.trim().toLowerCase());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
  };

  const handleSelectTrack = (track: string) => {
    setQuery(track);
    onChange(track);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <input
          name="course"
          value={query}
          onChange={handleInputChange}
          autoComplete="off"
          placeholder="Search your Field (optional)"
          className="w-full rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-sm sm:text-base font-normal text-white placeholder:text-neutral-500 focus:border-white/30 focus:ring-4 focus:ring-white/[0.08] focus:outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
        />
        <div className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-neutral-400">
          <Search className="size-4" />
        </div>
      </div>

      {/* Auto-Filling Match Card - Directional Slide Animation */}
      <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-black/40 p-3.5 min-h-[58px] flex items-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <AnimatePresence mode="wait" initial={false}>
          {!query.trim() ? (
            <motion.div
              key="empty-prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2.5 text-xs text-neutral-400 font-sans"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.08] text-neutral-400">
                <Search className="size-3.5" />
              </span>
              <span>Type your major field above or select from quick picks below</span>
            </motion.div>
          ) : topMatch ? (
            <motion.div
              key={topMatch}
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -60, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 380,
                damping: 26,
                mass: 0.8,
              }}
              className="flex w-full items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.08] border border-white/[0.12] text-white">
                  <Check className="size-4 stroke-[2.5]" />
                </span>
                <span className="text-sm font-medium text-white truncate block">
                  {topMatch}
                </span>
              </div>

              {/* SELECT / SELECTED BUTTON */}
              <button
                type="button"
                onClick={() => handleSelectTrack(topMatch)}
                className={cn(
                  'shrink-0 flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all active:scale-95 cursor-pointer',
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-[0_0_12px_rgba(52,211,153,0.2)]'
                    : 'bg-white/[0.12] text-white hover:bg-white/[0.18] border border-white/[0.15] shadow-sm'
                )}
              >
                {isSelected ? (
                  <>
                    <Check className="size-3.5 stroke-[2.5]" />
                    <span>SELECTED</span>
                  </>
                ) : (
                  <span>SELECT</span>
                )}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="no-match"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              className="flex items-center gap-2 text-xs text-neutral-400 font-mono"
            >
              <AlertCircle className="size-4 text-neutral-500 shrink-0" />
              <span>No direct match. Custom typed field will be recorded.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Suggested Quick Picks */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider mr-1">
          Popular:
        </span>
        {['Computer Science Engineering (CSE)', 'Artificial Intelligence & Machine Learning (AI & ML)', 'Electronics & Communication Engineering (ECE)', 'Mechanical Engineering (ME)'].map((p) => {
          const isItemActive = query.trim() === p.trim();
          return (
            <button
              key={p}
              type="button"
              onClick={() => handleSelectTrack(p)}
              className={cn(
                'rounded-full px-2.5 py-0.5 text-xs font-medium transition cursor-pointer',
                isItemActive
                  ? 'bg-white/[0.14] text-white font-semibold border border-white/20'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-neutral-400 border border-white/[0.06]'
              )}
            >
              {p.split('(')[1]?.replace(')', '') || p}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// FULL-SCREEN RISING CURTAIN APPLICATION MODAL
// ============================================================================
export interface CurtainApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProgram?: string; // e.g. "salesforce"
}

export function CurtainApplicationModal({
  isOpen,
  onClose,
  defaultProgram = 'salesforce',
}: CurtainApplicationModalProps) {
  const reduceMotion = useReducedMotion();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Form field states
  const [phone, setPhone] = useState('+91 ');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [collegeName, setCollegeName] = useState('');
  const [locationState, setLocationState] = useState('');
  const [district, setDistrict] = useState('');
  const [degree, setDegree] = useState('B.Tech');
  const [track, setTrack] = useState('');
  const [graduationYear, setGraduationYear] = useState('2027');
  const [applyingProgram, setApplyingProgram] = useState(defaultProgram);

  // Legal Agreement & Disclosure States
  const [consentDisclaimer, setConsentDisclaimer] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [activeLegalModalDoc, setActiveLegalModalDoc] = useState<string | null>(null);

  const allConsentsChecked = consentDisclaimer && consentTerms && consentPrivacy;

  const passwordsEntered = password.length > 0 && confirmPassword.length > 0;
  const passwordsMatch = passwordsEntered && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  useEffect(() => {
    if (isOpen) {
      queueMicrotask(() => {
        setApplyingProgram(defaultProgram);
      });
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKey);

      return () => {
        document.body.style.overflow = prevOverflow;
        window.removeEventListener('keydown', handleKey);
      };
    }
  }, [isOpen, onClose, defaultProgram]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setSaveMessage('Submitting your application…');

    const form = e.currentTarget;
    const formData = new FormData(form);

    const firstName = String(formData.get('firstName') || '').trim();
    const lastName = String(formData.get('lastName') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const currentPhone = phone.trim();
    const password = String(formData.get('password') || '').trim();
    const currentCollege = collegeName.trim();
    const currentLocation = locationState.trim();
    const currentDistrict = district.trim();
    const currentDegree = degree.trim();
    const currentDepartment = track.trim();
    // The selected internship program is stored in the Students.Course column.
    const internshipRole =
      applyingProgram === 'salesforce'
        ? 'SALESFORCE DEVELOPER I'
        : applyingProgram === 'ai-pe'
          ? 'AI PRODUCT ENGINEER'
          : applyingProgram === 'sde'
            ? 'Software Development Engineering (SDE)'
            : applyingProgram.toUpperCase();

    const gradYearNum = Number(graduationYear);
   const resumeFile = formData.get('resume') as File | null;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !currentPhone ||
      !password ||
      !confirmPassword ||
      !currentCollege ||
      !currentLocation ||
      !currentDistrict ||
      !currentDegree ||
      !internshipRole ||
      !Number.isInteger(gradYearNum) ||
      gradYearNum <= 0
    ) {
      setSaveMessage(
        'Please fill in all mandatory fields, including College Name, State, and District.'
      );
      setIsSubmitting(false);
      return;
    }

    if (!resumeFile || resumeFile.size === 0) {
      setSaveMessage('Please upload your Resume / CV (PDF, DOC, DOCX) before submitting.');
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setSaveMessage('Passwords do not match. Please verify both password fields.');
      setIsSubmitting(false);
      return;
    }

    if (!consentPrivacy || !consentTerms || !consentDisclaimer) {
      setSaveMessage(
        'Please review and check all 3 mandatory statutory notices and agreements before submitting.'
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const submissionResponse = await fetch('/api/internship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Firstname: firstName,
          Lastname: lastName,
          email,
          password,
          Phone: currentPhone,
          Degree: currentDegree,
          CollegeName: currentCollege,
          State: currentLocation,
          District: currentDistrict,
          Department: currentDepartment,
          Course: internshipRole,
          YOG: gradYearNum,
        }),
      });

      const submissionResult = await submissionResponse.json().catch(() => null);

      if (!submissionResponse.ok) {
        throw new Error(
          submissionResult && typeof submissionResult.message === 'string'
            ? submissionResult.message
            : 'Submission failed. Please try again.'
        );
      }

      setSaveMessage(
        'Application submitted successfully! Our engineering team will review your profile.'
      );

      window.setTimeout(() => {
        form.reset();
        setPhone('+91 ');
        setPassword('');
        setConfirmPassword('');
        setCollegeName('');
        setLocationState('');
        setDistrict('');
        setTrack('');
      }, 1500);
    } catch (error) {
      console.error('Internship submission error:', error);
      setSaveMessage(
        error instanceof Error
          ? error.message
          : 'Submission failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }

  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="curtain-modal-title"
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '100%' }}
          transition={
            reduceMotion
              ? { duration: 0.25 }
              : {
                  type: 'spring',
                  stiffness: 100,
                  damping: 22,
                  mass: 1.4,
                }
          }
          className="fixed inset-0 z-[150] w-screen h-screen bg-background flex flex-col overflow-hidden text-foreground rounded-t-[32px] sm:rounded-t-[44px] shadow-[0_-24px_80px_rgba(0,0,0,0.9)] selection:bg-foreground selection:text-background"
        >
          {/* Top Border — a quiet white/neutral specular line */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-white/30 to-transparent shrink-0 rounded-t-full" />

          {/* CURTAIN HEADER */}
          <header className="shrink-0 border-b border-white/[0.08] bg-black/50 px-6 sm:px-10 py-5 flex items-center justify-between backdrop-blur-xl">
            <div className="flex items-center gap-4">
              {/* Valoria Brand Logo */}
              <div className="w-24 sm:w-28 text-white">
                <ValoriaLogo />
              </div>

              <div className="h-5 w-px bg-white/20 hidden sm:block" />

              <div className="flex items-center gap-2">
                <span className="flex size-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-neutral-300">
                  WINTER COHORT
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close curtain modal"
                className="flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.06] hover:bg-white/[0.14] text-neutral-300 hover:text-white px-4 py-2 text-xs font-medium tracking-wide transition active:scale-95 cursor-pointer"
              >
                <span>Close</span>
                <X className="size-4" />
              </button>
            </div>
          </header>

          {/* CURTAIN FORM BODY + DOCKED FOOTER */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 flex flex-col min-h-0"
          >
            <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-6">
              <div className="mx-auto w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 items-stretch gap-6 pb-2">
              {/* LEFT COLUMN: Internship Role, Candidate Profile & Location Map */}
              <div className="lg:col-span-6 flex flex-col gap-5">
                {/* 1. INTERNSHIP ROLE CARD */}
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-medium uppercase tracking-widest text-neutral-400">
                      Internship Role
                    </span>
                    <span className="rounded-full bg-white/[0.08] border border-white/[0.12] text-neutral-300 px-2.5 py-0.5 text-[11px] font-semibold font-mono">
                      {applyingProgram === 'salesforce'
                        ? '#No.1 CRM'
                        : applyingProgram === 'ai-pe'
                        ? '#FullStack'
                        : applyingProgram === 'sde'
                        ? '#AlgoSystems'
                        : '#No.1 CRM'}
                    </span>
                  </div>
                  <h3 className="mt-2 text-xl font-semibold text-white tracking-tight flex items-center gap-2">
                    <Trophy className="size-5 text-neutral-300" />
                    <span>
                      {applyingProgram === 'salesforce'
                        ? 'SALESFORCE DEVELOPER I'
                        : applyingProgram === 'ai-pe'
                        ? 'AI PRODUCT ENGINEER'
                        : applyingProgram === 'sde'
                        ? 'Software Development Engineering (SDE)'
                        : applyingProgram.toUpperCase()}
                    </span>
                  </h3>

                  {/* Program Switcher Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-white/[0.06] mt-3">
                    {[
                      { id: 'salesforce', label: 'Salesforce & Apex' },
                      { id: 'ai-pe', label: 'AI PE' },
                      { id: 'sde', label: 'SDE Autonomous' },
                    ].map((prog) => (
                      <button
                        key={prog.id}
                        type="button"
                        onClick={() => setApplyingProgram(prog.id)}
                        className={cn(
                          'px-2.5 py-1 text-xs rounded-lg font-medium transition cursor-pointer',
                          applyingProgram === prog.id
                            ? 'bg-white/[0.14] text-white border border-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12)] font-semibold'
                            : 'bg-white/[0.04] border border-white/[0.08] text-neutral-400 hover:text-white hover:border-white/20'
                        )}
                      >
                        {prog.label}
                      </button>
                    ))}
                  </div>
                  <input type="hidden" name="applyingProgram" value={applyingProgram} />
                </div>

                {/* 2. PERSONAL DETAILS CARD */}
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl flex flex-col gap-4">
                  <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400 border-b border-white/[0.06] pb-2 flex items-center justify-between">
                    <span>Candidate Profile</span>
                    <span className="text-neutral-500 font-normal">* Required</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="block text-[13px] font-medium text-neutral-300 tracking-tight">
                      First Name <span className="text-neutral-500">*</span>
                      <input
                        name="firstName"
                        required
                        placeholder="First name"
                        className="mt-1.5 w-full rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2.5 text-sm font-normal text-white placeholder:text-neutral-500 focus:border-white/30 focus:ring-4 focus:ring-white/[0.08] focus:outline-none transition shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                      />
                    </label>

                    <label className="block text-[13px] font-medium text-neutral-300 tracking-tight">
                      Last Name <span className="text-neutral-500">*</span>
                      <input
                        name="lastName"
                        required
                        placeholder="Last name"
                        className="mt-1.5 w-full rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2.5 text-sm font-normal text-white placeholder:text-neutral-500 focus:border-white/30 focus:ring-4 focus:ring-white/[0.08] focus:outline-none transition shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                      />
                    </label>
                  </div>

                  <label className="block text-[13px] font-medium text-neutral-300 tracking-tight">
                    Email Address <span className="text-neutral-500">*</span>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="your.email@domain.com"
                      className="mt-1.5 w-full rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2.5 text-sm font-normal text-white placeholder:text-neutral-500 focus:border-white/30 focus:ring-4 focus:ring-white/[0.08] focus:outline-none transition shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                    />
                  </label>

                  {/* PHONE FIELD (Default: +91) */}
                  <label className="block text-[13px] font-medium text-neutral-300 tracking-tight">
                    Phone Number <span className="text-neutral-500">*</span>
                    <div className="relative mt-1.5">
                      <input
                        name="phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 00000 00000"
                        className="w-full rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2.5 text-sm font-mono font-medium text-white placeholder:text-neutral-500 focus:border-white/30 focus:ring-4 focus:ring-white/[0.08] focus:outline-none transition shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                      />
                    </div>
                  </label>

                  {/* PASSWORD FIELDS (Create Password + ReType Password with Live Verification) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <label className="block text-[13px] font-medium text-neutral-300 tracking-tight">
                      Create Password <span className="text-neutral-500">*</span>
                      <div className="relative mt-1.5">
                        <input
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          autoComplete="new-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create password"
                          className="w-full rounded-xl border border-white/[0.12] bg-white/[0.04] pl-4 pr-10 py-2.5 text-sm font-normal text-white placeholder:text-neutral-500 focus:border-white/30 focus:ring-4 focus:ring-white/[0.08] focus:outline-none transition shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          className="absolute inset-y-0 right-2.5 flex items-center text-neutral-400 hover:text-white transition cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </label>

                    <label className="block text-[13px] font-medium text-neutral-300 tracking-tight">
                      Re-Type Password <span className="text-neutral-500">*</span>
                      <div className="relative mt-1.5">
                        <input
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          autoComplete="new-password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-type password"
                          className={cn(
                            'w-full rounded-xl border bg-white/[0.04] pl-4 pr-10 py-2.5 text-sm font-normal text-white placeholder:text-neutral-500 focus:ring-4 focus:outline-none transition shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]',
                            passwordsMismatch
                              ? 'border-rose-500/50 focus:border-rose-400 focus:ring-rose-500/15'
                              : passwordsMatch
                              ? 'border-emerald-500/50 focus:border-emerald-400 focus:ring-emerald-500/15'
                              : 'border-white/[0.12] focus:border-white/30 focus:ring-white/[0.08]'
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                          className="absolute inset-y-0 right-2.5 flex items-center text-neutral-400 hover:text-white transition cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </label>
                  </div>

                  {/* Live Password Match Status */}
                  {(passwordsMatch || passwordsMismatch) && (
                    <div
                      className={cn(
                        'flex items-center gap-2 text-xs font-medium',
                        passwordsMatch ? 'text-emerald-400' : 'text-rose-400'
                      )}
                    >
                      {passwordsMatch ? (
                        <>
                          <CheckCircle2 className="size-3.5 shrink-0" />
                          <span>Passwords match completely</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="size-3.5 shrink-0" />
                          <span>Passwords do not match</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* 3. LOCATION (INDIA MAP + DISTRICT) */}
                <div className="flex-1 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl flex flex-col justify-between gap-3">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400">
                      Location (State &amp; District) <span className="text-neutral-500">*</span>
                    </span>
                    {locationState && (
                      <span className="text-xs font-mono text-emerald-400 font-semibold">
                        {district ? `${district}, ${locationState}` : locationState}
                      </span>
                    )}
                  </div>
                  <IndiaStateMap
                    selectedState={locationState}
                    onSelectState={(stateName) => setLocationState(stateName)}
                    district={district}
                    onDistrictChange={(val) => setDistrict(val)}
                  />
                  <input type="hidden" name="location" value={locationState} />
                </div>
              </div>

              {/* RIGHT COLUMN: College Name, 3D Degree, Track Slider, Links & Graduation Year */}
              <div className="lg:col-span-6 flex flex-col gap-5">
                {/* 4. COLLEGE NAME (SEPARATE COMPONENT ABOVE DEGREE) */}
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
                  <label className="block">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400 block pb-2 border-b border-white/[0.06] mb-3">
                      College Name <span className="text-neutral-500">*</span>
                    </span>
                    <input
                      name="collegeName"
                      required
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      placeholder="Type your college or university name…"
                      className="w-full rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2.5 text-sm font-normal text-white placeholder:text-neutral-500 focus:border-white/30 focus:ring-4 focus:ring-white/[0.08] focus:outline-none transition shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                    />
                  </label>
                </div>

                {/* 5. DEGREES: 3D ROTATING CYLINDER PICKER */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400">
                      Degree <span className="text-neutral-500">*</span>
                    </span>
                    <span className="text-xs font-mono text-white font-semibold">{degree}</span>
                  </div>
                  <CircularDegreePicker
                    selectedDegree={degree}
                    onSelectDegree={(val) => setDegree(val)}
                  />
                  <input type="hidden" name="degree" value={degree} />
                </div>

                {/* 6. MAJOR FIELD OF STUDY: TYPING & AUTOFILLING SLIDER */}
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400">
                      Major Field of Study <span className="text-neutral-500">(Optional)</span>
                    </span>
                    <span className="text-xs font-mono text-white font-semibold truncate max-w-[200px]">{track}</span>
                  </div>
                  <TrackAutofillSlider
                    value={track}
                    onChange={(val) => setTrack(val)}
                  />
                </div>

                {/* 7. SKILLS, RESUME & PROFESSIONAL LINKS */}
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl flex flex-col gap-4">
                  <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400 border-b border-white/[0.06] pb-2">
                    Professional Footprint
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="block text-[13px] font-medium text-neutral-300 tracking-tight">
                      LinkedIn Profile <span className="text-neutral-500">*</span>
                      <input
                        name="linkedin"
                        type="url"
                        required
                        placeholder="https://linkedin.com/in/username"
                        className="mt-1.5 w-full rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2.5 text-sm font-normal text-white placeholder:text-neutral-500 focus:border-white/30 focus:ring-4 focus:ring-white/[0.08] focus:outline-none transition shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                      />
                    </label>

                    <label className="block text-[13px] font-medium text-neutral-300 tracking-tight">
                      GitHub Profile <span className="text-neutral-500 font-normal">(Optional)</span>
                      <input
                        name="github"
                        type="url"
                        placeholder="https://github.com/username"
                        className="mt-1.5 w-full rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2.5 text-sm font-normal text-white placeholder:text-neutral-500 focus:border-white/30 focus:ring-4 focus:ring-white/[0.08] focus:outline-none transition shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                      />
                    </label>
                  </div>

                  <label className="block text-[13px] font-medium text-neutral-300 tracking-tight">
                    Resume / CV Upload <span className="text-neutral-500">*</span>
                    <span className="mt-1.5 flex min-h-[48px] items-center gap-3 rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-4 py-2 text-sm text-neutral-300 transition hover:border-white/25 cursor-pointer">
                      <Upload className="size-4 text-neutral-400" />
                      <input
                        name="resume"
                        type="file"
                        required
                        accept=".pdf,.doc,.docx"
                        className="min-w-0 flex-1 text-xs file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-white/[0.12] file:px-2.5 file:py-1 file:text-xs file:font-semibold file:text-white hover:file:bg-white/[0.18]"
                      />
                    </span>
                  </label>
                </div>

                {/* 8. GRADUATION YEAR: CORNER CURVED RECTANGULAR BUTTONS (NORMAL SPACING) */}
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400">
                      Graduation Year <span className="text-neutral-500">*</span>
                    </span>
                    <span className="text-xs font-mono text-neutral-400">Batch {graduationYear}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    {GRADUATION_YEARS.map((year) => {
                      const isYearSelected = graduationYear === year;
                      return (
                        <button
                          key={year}
                          type="button"
                          onClick={() => setGraduationYear(year)}
                          className={cn(
                            'min-h-[54px] rounded-2xl border px-4 py-2.5 text-base font-semibold transition-all flex flex-col items-center justify-center cursor-pointer active:scale-95',
                            isYearSelected
                              ? 'border-white/20 bg-white/[0.14] text-white shadow-[0_4px_20px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.12)] scale-[1.03]'
                              : 'border-white/[0.08] bg-white/[0.04] text-neutral-400 hover:border-white/15 hover:bg-white/[0.08] hover:text-white shadow-[0_4px_16px_rgba(0,0,0,0.3)]'
                          )}
                        >
                          <span className="leading-none">{year}</span>
                          <span className={cn('text-[9px] font-mono uppercase mt-1', isYearSelected ? 'text-white/60' : 'text-neutral-500')}>
                            Batch
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <input type="hidden" name="graduationYear" value={graduationYear} />
                </div>
              </div>
            </div>

            {/* ===================================================================
                MANDATORY POINT OF COLLECTION NOTICES & STATUTORY CONSENT
                Authentic, high-craft compliance disclaimers prior to candidate submission
            =================================================================== */}
            <div className="mx-auto w-full max-w-6xl mt-6 rounded-2xl border border-white/[0.1] bg-[#0c0e17]/85 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-3.5">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-200">
                    Point of Collection Disclosures &amp; Statutory Consent
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-neutral-400">
                    {allConsentsChecked ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                        <Check className="size-3" />
                        <span>All 3 Acknowledged</span>
                      </span>
                    ) : (
                      <span className="text-amber-400 font-mono">
                        {[consentPrivacy, consentTerms, consentDisclaimer].filter(Boolean).length} of 3 Acknowledged
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {/* Notice 1: Privacy Notice & applicable consent */}
                <label className="group flex items-start gap-3.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10 transition cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consentPrivacy}
                    onChange={(e) => setConsentPrivacy(e.target.checked)}
                    className="mt-0.5 size-4 rounded border-white/20 bg-white/10 text-emerald-500 focus:ring-emerald-400 focus:ring-offset-0 cursor-pointer shrink-0"
                    required
                  />
                  <div className="text-xs leading-relaxed text-neutral-300/90 font-normal">
                    <span className="font-semibold text-white block mb-0.5 font-sans">
                      1. Privacy Notice &amp; Applicable Consent:
                    </span>
                    I explicitly consent to Valoria Technology collecting and processing my personal, educational, and contact details for internship candidate evaluation, background verification, and cohort communications in strict accordance with the{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveLegalModalDoc('privacy-policy');
                      }}
                      className="text-blue-400 hover:text-blue-300 underline font-medium inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Privacy Policy</span>
                      <ExternalLink className="size-2.5" />
                    </button>
                    {' '}and DPDP Act 2023 regulations.
                  </div>
                </label>

                {/* Notice 2: Internship Application Terms acknowledgement */}
                <label className="group flex items-start gap-3.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10 transition cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consentTerms}
                    onChange={(e) => setConsentTerms(e.target.checked)}
                    className="mt-0.5 size-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-400 focus:ring-offset-0 cursor-pointer shrink-0"
                    required
                  />
                  <div className="text-xs leading-relaxed text-neutral-300/90 font-normal">
                    <span className="font-semibold text-white block mb-0.5 font-sans">
                      2. Internship Application Terms Acknowledgement:
                    </span>
                    I confirm all submitted academic records are truthful, and I agree to be bound by the{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveLegalModalDoc('internship-terms');
                      }}
                      className="text-blue-400 hover:text-blue-300 underline font-medium inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Internship Application Terms</span>
                      <ExternalLink className="size-2.5" />
                    </button>
                    , including strict Non-Disclosure Obligations (NDA), code of conduct, and intellectual property assignment.
                  </div>
                </label>

                {/* Notice 3: Internship Program Disclaimer acknowledgement */}
                <label className="group flex items-start gap-3.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10 transition cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consentDisclaimer}
                    onChange={(e) => setConsentDisclaimer(e.target.checked)}
                    className="mt-0.5 size-4 rounded border-white/20 bg-white/10 text-emerald-500 focus:ring-emerald-400 focus:ring-offset-0 cursor-pointer shrink-0"
                    required
                  />
                  <div className="text-xs leading-relaxed text-neutral-300/90 font-normal">
                    <span className="font-semibold text-white block mb-0.5 font-sans">
                      3. Internship Program Disclaimer Acknowledgement:
                    </span>
                    I acknowledge having reviewed the{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveLegalModalDoc('internship-disclaimer');
                      }}
                      className="text-blue-400 hover:text-blue-300 underline font-medium inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Internship Program Disclaimer</span>
                      <ExternalLink className="size-2.5" />
                    </button>
                    {' '}and{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveLegalModalDoc('payment-policy');
                      }}
                      className="text-blue-400 hover:text-blue-300 underline font-medium inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Payment &amp; Refund Policy</span>
                      <ExternalLink className="size-2.5" />
                    </button>
                    , understanding that this is an experiential training and industrial project implementation programme requiring advance non-refundable fee payment, and does not guarantee permanent employment or placement.
                  </div>
                </label>
              </div>
            </div>

            {/* STATUS MESSAGE BANNER */}
            {saveMessage && (
              <div className="mx-auto w-full max-w-6xl mt-6">
                <div
                  role="status"
                  className={cn(
                    'flex items-center gap-3 rounded-2xl p-4 text-sm font-medium border shadow-lg backdrop-blur-xl',
                    saveMessage.includes('successfully')
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                      : saveMessage.includes('Submitting')
                      ? 'border-white/[0.12] bg-white/[0.06] text-neutral-200'
                      : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                  )}
                >
                  {saveMessage.includes('successfully') ? (
                    <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />
                  ) : saveMessage.includes('Submitting') ? (
                    <Loader2 className="size-5 text-neutral-300 animate-spin shrink-0" />
                  ) : (
                    <AlertCircle className="size-5 text-rose-400 shrink-0" />
                  )}
                  <span>{saveMessage}</span>
                </div>
              </div>
            )}
            </div>

            {/* DOCKED FULL-WIDTH BOTTOM BAR */}
            <footer className="shrink-0 w-full border-t border-white/[0.08] bg-black/80 px-6 sm:px-10 py-4 sm:py-5 backdrop-blur-2xl">
              <div className="mx-auto w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                  <span>Applications reviewed on rolling basis · Valoria Winter Cohort</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {!allConsentsChecked && (
                    <span className="text-[11px] font-mono text-amber-400 hidden sm:inline-block">
                      Acknowledge all 3 notices to submit
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto min-h-[44px] rounded-full border border-white/[0.12] bg-white/[0.05] hover:bg-white/[0.12] text-neutral-300 hover:text-white px-6 py-2.5 text-sm font-medium transition active:scale-[0.97] cursor-pointer"
                  >
                    Dismiss
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || passwordsMismatch || !allConsentsChecked}
                    className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2.5 rounded-full bg-white/[0.14] border border-white/20 hover:bg-white/[0.2] px-8 py-2.5 text-sm sm:text-base font-semibold text-white shadow-[0_4px_20px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.18)] hover:shadow-[0_8px_28px_rgba(255,255,255,0.14)] active:scale-[0.97] transition cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Submitting…</span>
                      </>
                    ) : (
                      <>
                        <span>Apply</span>
                        <ArrowRight className="size-4 stroke-[2.5]" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </footer>
          </form>

          {/* Legal Fullscreen Document Viewer */}
          <LegalModal
            isOpen={activeLegalModalDoc !== null}
            onClose={() => setActiveLegalModalDoc(null)}
            initialDocumentId={activeLegalModalDoc || 'privacy-policy'}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CurtainApplicationModal;
