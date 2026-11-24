'use client';
import React, { useCallback, useRef, useState } from 'react';
import {
  motion,
  useSpring,
  useMotionValue,
  AnimatePresence,
} from 'motion/react';
import {
  CheckCircle2,
  Loader2,
  Terminal,
  Sparkles,
  Check,
  ArrowRight,
  Code2,
  Cloud,
  Cpu,
  EyeOff,
  ChevronDown,
  Award,
  CalendarClock,
  ListChecks,
  Briefcase,
  ShieldCheck,
  FileCheck2,
  AlertCircle,
  Layers,
  Sparkle,
} from 'lucide-react';
import { LiquidMetalButton } from '@/components/ui/liquid-metal';
import { CurtainApplicationModal } from '@/components/curtain-application-modal';
import { cn } from '@/lib/utils';

// Custom bespoke icon for Job Description / Role Specifications
function JobDescriptionIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('size-4 shrink-0', className)}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
      <path d="M14 2v6h6" />
      <path d="m9 13 2 2-2 2" strokeWidth="2" />
      <line x1="13" y1="17" x2="16" y2="17" strokeWidth="2" />
      <line x1="9" y1="9.5" x2="11" y2="9.5" strokeWidth="1.6" strokeOpacity="0.8" />
    </svg>
  );
}

// ============================================================================
// DATA: SALESFORCE SCENARIOS
// ============================================================================
interface SalesforceScenario {
  id: string;
  tabLabel: string;
  title: string;
  prompt: string;
  steps: {
    text: string;
    status: 'passed' | 'loading';
  }[];
  result: string;
}

const SF_SCENARIOS: SalesforceScenario[] = [
  {
    id: 'it-asset',
    tabLabel: '01 · IT Asset Lifecycle',
    title: 'IT Asset Lifecycle Management',
    prompt: 'Scenario: IT Asset Lifecycle Management',
    steps: [
      {
        text: 'Engineered Custom Asset Data Models & Relationships',
        status: 'passed',
      },
      {
        text: 'Automated Asset Lifecycle Using Apex & Triggers',
        status: 'passed',
      },
      {
        text: 'Need to develop LWC-Based Inventory & Operations Dashboards',
        status: 'loading',
      },
      {
        text: 'Need to implement Role-Based Access & Approval Workflows',
        status: 'loading',
      },
    ],
    result: "Deployed to 'force-app/main/default/classes/AssetLifecycleController.cls' in 14ms",
  },
  {
    id: 'source-to-pay',
    tabLabel: '02 · Source-to-Pay',
    title: 'Source-to-Pay & Supplier Lifecycle Management',
    prompt: 'Scenario: Source-to-Pay & Supplier Lifecycle Management',
    steps: [
      {
        text: 'Designed Supplier & Procurement Data Architecture',
        status: 'passed',
      },
      {
        text: 'Automated Purchase Workflows Using Apex & SOQL',
        status: 'passed',
      },
      {
        text: 'Need to develop LWC-Based Procurement Management Interfaces',
        status: 'loading',
      },
      {
        text: 'Need to implement Multi-Level Approvals & Financial Governance',
        status: 'loading',
      },
    ],
    result: "Validated SOQL governor bounds & Trigger execution: 0 DML exceptions",
  },
  {
    id: 'icso',
    tabLabel: '03 · Claims & ICSO',
    title: 'Insurance Claims & Settlement Operations (ICSO)',
    prompt: 'Scenario: Insurance Claims & Settlement Operations (ICSO)',
    steps: [
      {
        text: 'Architected Policy, Claims & Settlement Data Models',
        status: 'passed',
      },
      {
        text: 'Engineered Claims Processing Logic Using Apex',
        status: 'passed',
      },
      {
        text: 'Need to develop LWC-Based Claims Assessment & Tracking Systems',
        status: 'loading',
      },
      {
        text: 'Need to implement Approval Hierarchies & Secure Access Controls',
        status: 'loading',
      },
    ],
    result: "Integrated ICSO Claims Engine with Real-Time Apex Event Bus",
  },
];

// ============================================================================
// DATA: AI PE SCENARIOS (4 Scenarios)
// ============================================================================
const AI_PE_SCENARIOS: SalesforceScenario[] = [
  {
    id: 'sales-biz-ops',
    tabLabel: '01 · Sales & Biz Ops',
    title: 'Sales & Business Operations',
    prompt: 'Scenario: Sales & Business Operations',
    steps: [
      {
        text: 'AI-powered lead management and customer profiling dashboard.',
        status: 'passed',
      },
      {
        text: 'Automated follow-up scheduling and email generation.',
        status: 'passed',
      },
      {
        text: 'Sales pipeline tracking with interactive analytics.',
        status: 'loading',
      },
      {
        text: 'AI-driven lead scoring and sales performance predictions.',
        status: 'loading',
      },
    ],
    result: "Pipeline Scoring Engine & Automated Outreach Synced (98.4% accuracy)",
  },
  {
    id: 'retail-supply-chain',
    tabLabel: '02 · Retail & Supply Chain',
    title: 'Retail & Supply Chain',
    prompt: 'Scenario: Retail & Supply Chain',
    steps: [
      {
        text: 'Real-time inventory and warehouse management dashboard.',
        status: 'passed',
      },
      {
        text: 'AI-based demand forecasting and stock prediction.',
        status: 'passed',
      },
      {
        text: 'Supplier management and automated purchase order generation.',
        status: 'loading',
      },
      {
        text: 'Low-stock alerts and intelligent inventory recommendations.',
        status: 'loading',
      },
    ],
    result: "Forecasting Engine calibrated across 140+ SKUs · 0 stockout alerts",
  },
  {
    id: 'hr-recruitment',
    tabLabel: '03 · HR & Recruitment',
    title: 'HR & Recruitment',
    prompt: 'Scenario: HR & Recruitment',
    steps: [
      {
        text: 'Resume parsing and AI-powered candidate profiling.',
        status: 'passed',
      },
      {
        text: 'Job description generation and candidate-job matching.',
        status: 'passed',
      },
      {
        text: 'Recruitment pipeline and interview scheduling dashboard.',
        status: 'loading',
      },
      {
        text: 'Candidate evaluation and recruitment analytics.',
        status: 'loading',
      },
    ],
    result: "Semantic Candidate Matcher active · 4.2x faster screening",
  },
  {
    id: 'finance-accounting',
    tabLabel: '04 · Finance & Accounting',
    title: 'Finance & Accounting',
    prompt: 'Scenario: Finance & Accounting',
    steps: [
      {
        text: 'Digital invoice processing and expense management dashboard.',
        status: 'passed',
      },
      {
        text: 'AI-powered invoice data extraction and categorization.',
        status: 'passed',
      },
      {
        text: 'Multi-level expense approval and payment tracking workflows.',
        status: 'loading',
      },
      {
        text: 'Financial analytics, budget monitoring, and anomaly detection.',
        status: 'loading',
      },
    ],
    result: "OCR Ledger & Anomaly Detection verified · 99.6% extraction precision",
  },
];

// ============================================================================
// DATA: SDE SCENARIOS (3 Scenarios)
// ============================================================================
const SDE_SCENARIOS: SalesforceScenario[] = [
  {
    id: 'enterprise-ops-workforce',
    tabLabel: '01 · Enterprise Ops & Workforce',
    title: 'Enterprise Operations & Workforce Management',
    prompt: 'Scenario: Enterprise Operations & Workforce Management',
    steps: [
      {
        text: 'Priority queue-based task scheduling and resource allocation.',
        status: 'passed',
      },
      {
        text: 'Graph algorithms for project dependency management and topological sorting.',
        status: 'passed',
      },
      {
        text: 'Greedy and dynamic programming algorithms for workload optimization.',
        status: 'loading',
      },
      {
        text: 'Load balancing and efficient task distribution across available resources.',
        status: 'loading',
      },
    ],
    result: "DAG Topological Scheduler & Load Balancer active (O(V + E) verified)",
  },
  {
    id: 'banking-financial',
    tabLabel: '02 · Banking & Financial',
    title: 'Banking & Financial Services',
    prompt: 'Scenario: Banking & Financial Services',
    steps: [
      {
        text: 'HashMap-based transaction tracking and account balance management.',
        status: 'passed',
      },
      {
        text: 'Sliding window algorithms for identifying unusual transaction patterns.',
        status: 'passed',
      },
      {
        text: 'Graph-based analysis to identify suspicious transaction relationships.',
        status: 'loading',
      },
      {
        text: 'Queue-based transaction processing with optimized data retrieval.',
        status: 'loading',
      },
    ],
    result: "Sliding Window Anomaly Engine & O(1) Ledger Lookup synced",
  },
  {
    id: 'transportation-supply-chain',
    tabLabel: '03 · Transport & Supply Chain',
    title: 'Transportation & Supply Chain',
    prompt: 'Scenario: Transportation & Supply Chain',
    steps: [
      {
        text: "Graph-based shortest-path routing using Dijkstra's and A* algorithms.",
        status: 'passed',
      },
      {
        text: 'Priority queue-based delivery scheduling and allocation.',
        status: 'passed',
      },
      {
        text: 'Dynamic route optimization considering traffic and delivery constraints.',
        status: 'loading',
      },
      {
        text: 'Performance analysis of routing algorithms across large delivery networks.',
        status: 'loading',
      },
    ],
    result: "A* & Dijkstra Routing Matrix calibrated · sub-12ms path convergence",
  },
];

// ============================================================================
// DATA: TOP NAVIGATION TABS (Salesforce, AI PE, SDE)
// ============================================================================
interface MainTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  prompt: string;
  steps: {
    text: string;
    status: 'passed' | 'loading';
  }[];
  result: string;
}

const MAIN_TABS: MainTab[] = [
  {
    id: 'salesforce',
    label: 'Salesforce',
    icon: Cloud,
    prompt:
      'Make my save button show a fluid spring press, loading state, then "Saved" for enterprise Salesforce operations.',
    steps: SF_SCENARIOS[0]!.steps,
    result: "Optimized 'components/save-button.tsx' with spring stiffness: 240, damping: 20",
  },
  {
    id: 'ai-pe',
    label: 'AI PE',
    icon: Cpu,
    prompt:
      'Orchestrate AI Product Engineer workflows across Sales, Supply Chain, HR & Recruitment, and Finance.',
    steps: AI_PE_SCENARIOS[0]!.steps,
    result: AI_PE_SCENARIOS[0]!.result,
  },
  {
    id: 'sde',
    label: 'SDE',
    icon: Code2,
    prompt:
      'Architect resilient distributed microservices, event-driven streaming queues, and zero-downtime containerized CI/CD.',
    steps: [
      {
        text: 'Distributed consensus caching via Redis cluster & Raft engine',
        status: 'passed',
      },
      {
        text: 'Zero-downtime canary deployment pipeline via Docker & Kubernetes',
        status: 'passed',
      },
      {
        text: 'Multi-region latency optimization & gRPC binary stream buffering',
        status: 'loading',
      },
      {
        text: 'Auto-scaling policy & circuit breaker fault-tolerance matrix',
        status: 'loading',
      },
    ],
    result: 'Distributed mesh active: 99.999% uptime, p99 latency < 8ms',
  },
];

// ============================================================================
// SECOND COMPONENT: LUXURY CANDIDATE BLUEPRINT & SPECIFICATION DOSSIER
// (Job Description, Responsibility, Duration, Certification)
// ============================================================================
type DocTabId = 'job-description' | 'responsibility' | 'certification' | 'duration';

const DOSSIER_TABS: {
  id: DocTabId;
  label: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'job-description', label: 'Job Description', icon: Briefcase },
  { id: 'responsibility', label: 'Responsibilities', badge: '8 Duties', icon: ListChecks },
  { id: 'certification', label: 'Certification', badge: 'Criteria', icon: Award },
  { id: 'duration', label: 'Duration & Phases', badge: '2 Phases', icon: CalendarClock },
];

const PROGRAM_JOB_DESCRIPTIONS: Record<
  string,
  { title: string; trackBadge: string; roleIcon: React.ComponentType<{ className?: string }>; paragraphs: string[] }
> = {
  salesforce: {
    title: 'Job Description – Salesforce Developer I',
    trackBadge: 'Salesforce Ecosystem & Lightning Cloud',
    roleIcon: Cloud,
    paragraphs: [
      'Valoria Technology is offering an opportunity for aspiring Salesforce Developers to develop their technical knowledge and gain practical exposure to the Salesforce ecosystem. The programme focuses on building a strong foundation in the Salesforce platform, including CRM fundamentals, data modelling, business logic, automation and Lightning-based application development.',
      "Participants will gain an understanding of Salesforce technologies and enterprise application development practices through structured technical learning and guided, hands-on project development alongside Valoria Technology's developers. The programme is designed to bridge the gap between theoretical knowledge and practical software development experience in an enterprise-oriented environment.",
    ],
  },
  'ai-pe': {
    title: 'Job Description – AI Product Engineer',
    trackBadge: 'Full-Stack Architecture & Generative AI',
    roleIcon: Cpu,
    paragraphs: [
      'Valoria Technology is offering an opportunity for aspiring AI Product Engineers to develop their skills in full-stack application development and AI-powered software engineering. The programme focuses on building a strong foundation in frontend and backend technologies, database management, API development and modern web application architecture, while introducing the fundamentals of Artificial Intelligence and Generative AI.',
      "Participants will learn how to leverage AI tools and technologies throughout the software development lifecycle, including application planning, coding, debugging, testing, optimisation and deployment. Through structured technical learning and guided, hands-on project development alongside Valoria Technology's developers, participants will gain practical exposure to building and deploying intelligent, AI-powered digital products in an enterprise-oriented environment.",
    ],
  },
  sde: {
    title: 'Job Description – Software Development Engineer (SDE)',
    trackBadge: 'Algorithms, Data Structures & Systems',
    roleIcon: Code2,
    paragraphs: [
      'Valoria Technology is offering an opportunity for aspiring Software Development Engineers to strengthen their programming and problem-solving skills through a structured learning programme focused on Data Structures and Algorithms (DSA). The programme emphasizes core computer science concepts, algorithm design, computational thinking, time and space complexity, and efficient problem-solving techniques.',
      "Participants will develop a strong understanding of fundamental data structures and algorithms and explore their practical application in software engineering. Through guided, hands-on development alongside Valoria Technology's developers, participants will gain practical exposure to implementing algorithms, solving engineering challenges and applying efficient programming approaches to enterprise-oriented software projects.",
    ],
  },
};

const PROGRAM_RESPONSIBILITIES = [
  'Actively participate in scheduled training sessions, practical learning activities and technical discussions.',
  'Complete assigned tasks, exercises and assessments within the communicated timelines.',
  'Apply the knowledge gained during training to practical development activities and project work.',
  'Collaborate with mentors, developers and fellow participants during project development.',
  'Participate in project reviews, technical evaluations and feedback sessions.',
  'Maintain professional communication, teamwork and a responsible learning environment.',
  'Follow the programme guidelines and use the provided technical resources appropriately.',
  'Demonstrate consistent participation, learning progress and commitment throughout the programme.',
];

const PROGRAM_CERTIFICATION = [
  {
    heading: 'Training and Project Completion:',
    body: 'Participants who successfully complete both the training programme and assigned internship project work will be eligible to receive a Training Completion Certificate, Internship / Work Experience Certificate and Letter of Appreciation, subject to the applicable completion and evaluation criteria.',
  },
  {
    heading: 'Training Completion Only:',
    body: 'Participants who successfully complete the training programme but do not complete the assigned internship project work will be eligible to receive only the Training Completion Certificate.',
  },
  {
    heading: 'Programme Requirements:',
    body: 'Issuance of completion documents is subject to fulfilment of the respective programme requirements and successful evaluation.',
  },
];

const PROGRAM_DURATION_PHASES = [
  {
    heading: 'Phase 1 – Technical Training:',
    body: 'Participants undergo structured technical training focused on the selected programme, covering relevant concepts, tools, technologies and practical learning activities.',
  },
  {
    heading: 'Phase 2 – Internship Project Development:',
    body: "Participants apply their acquired knowledge through guided, hands-on project development alongside Valoria Technology's development team.",
  },
];

// ============================================================================
// MAIN LAUNCH PAGE COMPONENT (CONTAINING BOTH COMPONENTS 1 & 2)
// ============================================================================
export function LaunchSection() {
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const applicationButtonRef = useRef<HTMLButtonElement>(null);
  const closeApplicationSheet = useCallback(() => {
    setIsApplicationOpen(false);
    window.requestAnimationFrame(() => applicationButtonRef.current?.focus());
  }, []);

  // Top Navigation Tabs: Salesforce, AI PE, SDE
  const [activeTab, setActiveTab] = useState<string>('salesforce');
  // Salesforce Scenarios: 01 IT Asset, 02 Source-to-Pay, 03 ICSO
  const [activeScenarioIdx, setActiveScenarioIdx] = useState<number>(0);

  // Stealth Dossier State (Hidden for casual visitors, discoverable by careful applicants)
  const [isDossierRevealed, setIsDossierRevealed] = useState<boolean>(false);
  const [dossierRoleOverride, setDossierRoleOverride] = useState<'salesforce' | 'ai-pe' | 'sde' | null>(null);
  const [activeDocTab, setActiveDocTab] = useState<DocTabId>('job-description');

  const dossierRole =
    dossierRoleOverride ??
    (activeTab === 'ai-pe' || activeTab === 'sde' ? (activeTab as 'ai-pe' | 'sde') : 'salesforce');

  // Mouse tracking inside the "Apply for Internship" sandbox area
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const springX = useSpring(rawMouseX, { stiffness: 320, damping: 28 });
  const springY = useSpring(rawMouseY, { stiffness: 320, damping: 28 });
  const rotateX = useSpring(0, { stiffness: 320, damping: 25 });
  const rotateY = useSpring(0, { stiffness: 320, damping: 25 });
  const [isHoveringStage, setIsHoveringStage] = useState(false);

  const handleStageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    rawMouseX.set(x);
    rawMouseY.set(y);

    const normX = (x / rect.width - 0.5) * 2;
    const normY = (y / rect.height - 0.5) * 2;

    rotateX.set(-normY * 7);
    rotateY.set(normX * 8);
  };

  const handleStageMouseEnter = () => {
    setIsHoveringStage(true);
  };

  const handleStageMouseLeave = () => {
    setIsHoveringStage(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  const currentTab = MAIN_TABS.find((t) => t.id === activeTab) || MAIN_TABS[0]!;
  const isScenarioTab = activeTab === 'salesforce' || activeTab === 'ai-pe' || activeTab === 'sde';
  const activeScenarios =
    activeTab === 'ai-pe'
      ? AI_PE_SCENARIOS
      : activeTab === 'sde'
      ? SDE_SCENARIOS
      : SF_SCENARIOS;
  const currentScenario = activeScenarios[activeScenarioIdx] || activeScenarios[0]!;

  const dossierJobDescription =
    PROGRAM_JOB_DESCRIPTIONS[dossierRole] || PROGRAM_JOB_DESCRIPTIONS.salesforce!;

  return (
    <>
      <section
        id="launch"
        className="relative w-full bg-black text-white mt-16 sm:mt-24 pt-24 sm:pt-36 pb-24 sm:pb-36 px-4 sm:px-6 md:px-8 lg:px-12 border-t border-white/[0.08] overflow-hidden scroll-mt-24"
      >
        {/* Anchor for nav compatibility */}
        <div id="platform" className="absolute -top-24 pointer-events-none" />

        {/* Spatial Horizon Separator Line */}
        <div className="w-full flex items-center justify-center mb-14 sm:mb-20 px-4">
          <div className="h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </div>

        {/* Minimal Technical Dot-Matrix Background Design */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_75%_50%_at_50%_25%,#000_60%,transparent_100%)] opacity-70"
        />

        {/* Ambient background glow matching luxury dark palette */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[800px] rounded-full bg-white/[0.025] blur-[140px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/4 -translate-y-1/2 size-[450px] rounded-full bg-emerald-500/[0.02] blur-[100px]"
        />

        <div className="relative w-full max-w-[1360px] mx-auto flex flex-col items-center">
          {/* ================================================================ */}
          {/* LANDING HEADER: "Launch Programs for Freshers"                   */}
          {/* ================================================================ */}
          <div className="flex flex-col items-center text-center mb-10 sm:mb-14 max-w-3xl select-none">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono tracking-wider text-neutral-300 uppercase mb-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span>Valoria Early Careers · 2027 Cohort</span>
            </div>

            {/* Main Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
              Launch Programs for Freshers
            </h2>

            {/* Subtitle */}
            <p className="mt-4 text-sm sm:text-base md:text-lg text-neutral-400 max-w-2xl leading-relaxed font-sans">
              Industry-grade enterprise engineering tracks, guided production development, and accelerated dual certification.
            </p>
          </div>

          {/* ================================================================ */}
          {/* 1. TOP NAVIGATION PILLS (Salesforce, SDE, AI PE)                  */}
          {/* ================================================================ */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 sm:mb-12 select-none">
            {MAIN_TABS.map((tab) => {
              const isActive = tab.id === activeTab;
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setActiveScenarioIdx(0);
                  }}
                  className={cn(
                    'relative px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all select-none focus:outline-none cursor-pointer flex items-center gap-2',
                    isActive
                      ? 'text-white'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-console-tab"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-white/[0.12] border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.08)]"
                    />
                  )}
                  <TabIcon className="size-3.5 relative z-10 shrink-0 text-current" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

        {/* ================================================================ */}
        {/* COMPONENT 1: macOS ORCHESTRATOR TERMINAL WINDOW (IMAGE 1)         */}
        {/* ================================================================ */}
        <div className="w-full relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/[0.1] bg-[#0c0c11]/95 shadow-[0_24px_80px_rgba(0,0,0,0.85),inset_0_1px_0_0_rgba(255,255,255,0.12)] backdrop-blur-2xl">
          {/* macOS Title Bar */}
          <div className="flex h-12 items-center justify-between border-b border-white/[0.08] bg-black/50 px-4 sm:px-6 select-none">
            {/* Traffic Lights */}
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 shadow-sm" />
              <span className="size-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 shadow-sm" />
              <span className="size-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 shadow-sm" />
            </div>

            {/* Center Prompt Title */}
            <div className="flex items-center gap-2 text-xs sm:text-[13px] font-mono text-neutral-300">
              <span className="text-neutral-500">&gt;_</span>
              <Terminal className="size-3.5 text-neutral-400" />
              <span className="text-neutral-200">
                {activeTab === 'salesforce'
                  ? 'Salesforce Developer'
                  : activeTab === 'ai-pe'
                  ? 'AI Product Engineer'
                  : 'Software Development Engineer'}
              </span>
            </div>

            {/* Right Status Dot: CRM */}
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-[11px] font-mono text-neutral-300 font-semibold uppercase tracking-widest hidden sm:inline">
                {activeTab === 'ai-pe' ? 'AI' : activeTab === 'sde' ? 'SDE' : 'CRM'}
              </span>
            </div>
          </div>

          {/* Console Body 2-Column Grid */}
          <div className="grid lg:grid-cols-[1.18fr_1fr] min-h-[460px] divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08]">
            {/* LEFT COLUMN: Prompt & Steps List */}
            <div className="p-6 sm:p-8 flex flex-col justify-between bg-black/40">
              <div>
                {/* For Salesforce & AI PE: Scenario Segmented Switcher */}
                {isScenarioTab && (
                  <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] mb-4">
                    {activeScenarios.map((scen, idx) => {
                      const isScenActive = activeScenarioIdx === idx;
                      return (
                        <button
                          key={scen.id}
                          type="button"
                          onClick={() => setActiveScenarioIdx(idx)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-150 cursor-pointer active:scale-95 whitespace-nowrap',
                            isScenActive
                              ? 'bg-white/15 text-white font-semibold border border-white/20 shadow-xs'
                              : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                          )}
                        >
                          {scen.tabLabel}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Prompt Box (Image 1 style) */}
                <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 sm:p-4.5 mb-6 shadow-inner">
                  <span className="text-neutral-400 font-mono text-sm select-none">
                    &gt;
                  </span>
                  {isScenarioTab ? (
                    <p className="text-xs sm:text-sm font-mono font-medium text-emerald-400 leading-relaxed">
                      Scenario: {currentScenario.title}
                    </p>
                  ) : (
                    <p className="text-xs sm:text-sm font-medium text-white leading-relaxed">
                      {currentTab.prompt}
                    </p>
                  )}
                </div>

                {/* Steps List with Green Ticks and Rotating Yellow Circle Loading */}
                <ol className="space-y-3.5">
                  {(isScenarioTab
                    ? currentScenario.steps
                    : currentTab.steps
                  ).map((step, idx) => {
                    const isPassed = step.status === 'passed';
                    return (
                      <motion.li
                        key={step.text}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, delay: idx * 0.08 }}
                        className="flex items-start justify-between gap-3 text-xs sm:text-[13px] leading-relaxed group"
                      >
                        {/* Left: Status Icon + Step Text */}
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 shrink-0">
                            {isPassed ? (
                              /* Green Tick */
                              <CheckCircle2 className="size-4 text-emerald-400" />
                            ) : (
                              /* 3 and 4: Rotating Yellow Circle Loading */
                              <Loader2 className="size-4 text-amber-400 animate-spin" />
                            )}
                          </span>
                          <span
                            className={cn(
                              'font-sans transition-colors',
                              isPassed ? 'text-neutral-200' : 'text-neutral-300'
                            )}
                          >
                            {step.text}
                          </span>
                        </div>

                        {/* Right: Loading Tick Like Feature Badge */}
                        <div className="shrink-0 pl-2">
                          {isPassed ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              <Check className="size-2.5 stroke-[2.5]" />
                              <span>Verified</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                              <span className="size-1.5 rounded-full bg-amber-400 animate-ping" />
                              <span>Help Wanted</span>
                            </span>
                          )}
                        </div>
                      </motion.li>
                    );
                  })}
                </ol>
              </div>

              {/* Bottom Result Pill (Image 1 style) */}
              <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-3.5 text-amber-400 shrink-0" />
                  <span className="font-mono text-[11px] sm:text-xs text-neutral-300 truncate max-w-[280px] sm:max-w-md">
                    {isScenarioTab
                      ? currentScenario.result
                      : currentTab.result}
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                  VERIFIED
                </span>
              </div>
            </div>

            {/* RIGHT COLUMN: Live Interactive Sandbox with "Apply for Internship" */}
            <div className="relative p-6 sm:p-8 flex flex-col justify-between bg-grid-dots bg-black/25">
              {/* Header Badges: • localhost:3000 & CRM SANDBOX */}
              <div className="flex items-center justify-between z-10">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-black/60 px-2.5 py-1 font-mono text-[11px] text-neutral-300 shadow-xs">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  localhost:3000
                </span>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                  {activeTab === 'ai-pe'
                    ? 'FULL STACK'
                    : activeTab === 'sde'
                    ? 'ALGORITHMS & SYSTEMS'
                    : 'CRM SANDBOX'}
                </span>
              </div>

              {/* Center Component Stage with Mouse Tracking in this Area */}
              <div
                onMouseMove={handleStageMouseMove}
                onMouseEnter={handleStageMouseEnter}
                onMouseLeave={handleStageMouseLeave}
                className="relative my-auto py-12 sm:py-16 flex flex-col items-center justify-center gap-4 rounded-2xl overflow-hidden cursor-default select-none"
              >
                {/* Dynamic Mouse Tracking Radial Spotlight */}
                <motion.div
                  className="pointer-events-none absolute size-80 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-300"
                  style={{
                    left: springX,
                    top: springY,
                    background:
                      'radial-gradient(circle, rgba(59,130,246,0.22) 0%, rgba(147,197,253,0.09) 45%, transparent 75%)',
                    opacity: isHoveringStage ? 1 : 0,
                  }}
                />

                {isScenarioTab && (
                  <motion.div
                    style={{
                      perspective: 800,
                      rotateX,
                      rotateY,
                      transformStyle: 'preserve-3d',
                    }}
                    className="relative z-10 flex flex-col items-center gap-3.5 will-change-transform"
                  >
                    {/* The Modern Glassmorphic Apply for Internship Button */}
                    <div className="p-1">
                      <motion.div
                        whileHover={{
                          scale: 1.035,
                          filter: 'drop-shadow(0 14px 28px rgba(99, 102, 241, 0.45))',
                        }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 340, damping: 24 }}
                      >
                        <LiquidMetalButton
                          ref={applicationButtonRef}
                          type="button"
                          size="lg"
                          variant="glass"
                          className="min-w-[280px] justify-center"
                          icon={<ArrowRight className="size-4 stroke-[2.4]" />}
                          metalConfig={{
                            colorBack: '#4f46e5',
                            colorTint: '#38bdf8',
                            speed: 0.55,
                            distortion: 0.18,
                            repetition: 4.5,
                          }}
                          onClick={() => setIsApplicationOpen(true)}
                          aria-haspopup="dialog"
                          aria-expanded={isApplicationOpen}
                        >
                          Apply for Internship
                        </LiquidMetalButton>
                      </motion.div>
                    </div>

                    {/* Non-touchable label: Work on Enterprise Projects */}
                    <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-neutral-400 text-xs font-mono tracking-wide select-none pointer-events-none">
                      <Sparkles className="size-3 text-amber-400/80 shrink-0" />
                      <span>Work on Enterprise Projects</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Bottom Telemetry Bar */}
              <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-3 border-t border-white/[0.06] font-mono z-10">
                <span>Spring Mass: 0.9 · Damping: 24</span>
                <span className="text-emerald-400/90 flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {isHoveringStage ? 'Active 3D Gyro Tracking' : '100% GPU Rendered'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* COMPONENT 2: LUXURY CANDIDATE BLUEPRINT & SPECIFICATION DOSSIER   */}
        {/* (Discreet / Sealed candidate specifications; expands into HUD)  */}
        {/* ================================================================ */}
        <div className="w-full max-w-[960px] mx-auto mt-12 sm:mt-16 flex flex-col items-center">
          <AnimatePresence mode="wait">
            {!isDossierRevealed ? (
              /* ------------------------------------------------------------ */
              /* STATE A: SEALED SPECIFICATION CAPSULE                        */
              /* ------------------------------------------------------------ */
              <motion.div
                key="sealed-capsule"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -8 }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                className="w-full relative group"
              >
                {/* Ambient specular highlight */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-white/5 to-sky-500/10 opacity-30 blur-xl group-hover:opacity-70 transition duration-500"
                />

                <div className="relative w-full rounded-2xl border border-white/[0.08] hover:border-white/[0.18] bg-[#0C0E14]/90 backdrop-blur-2xl p-5 sm:p-7 shadow-[0_16px_40px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    {/* Left Column: Attention Beacon, Heading, Discretion Note */}
                    <div className="space-y-2.5 max-w-xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/25 text-emerald-300 font-mono text-[11px] font-medium tracking-wide">
                          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>ROLE SPECIFICATION</span>
                        </span>
                        <span className="text-neutral-600 font-mono text-[11px] select-none">·</span>
                        <span className="text-neutral-400 font-mono text-[11px]">
                          INTERNSHIP BLUEPRINT
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
                        Role Blueprint, Responsibilities &amp; Evaluation Criteria
                      </h3>

                      <p className="text-xs sm:text-[13px] text-neutral-400 leading-relaxed">
                        <span className="text-neutral-200 font-medium">Programme Overview:</span> Detailed role descriptions, 8-point commitments, phase breakdown, and dual certification requirements are preserved in this blueprint. Review thoroughly before applying.
                      </p>

                      {/* Pill counters */}
                      <div className="flex items-center gap-2 pt-1 flex-wrap text-[11px] font-mono text-neutral-400 select-none">
                        <span className="px-2.5 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06]">
                          3 Tracks Synced
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06]">
                          8 Core Commitments
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06]">
                          2 Phase Roadmap
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06]">
                          Certification Rules
                        </span>
                      </div>
                    </div>

                    {/* Right Column: Classic Glassmorphic Job Description Action Trigger */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2.5 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/[0.06]">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                        onClick={() => setIsDossierRevealed(true)}
                        className="relative flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] active:bg-white/[0.18] border border-white/20 hover:border-white/35 text-white font-medium text-xs sm:text-sm backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(0,0,0,0.25)] transition-all cursor-pointer group/btn overflow-hidden"
                      >
                        {/* Specular sheen glass reflection */}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.16] via-transparent to-transparent opacity-80 group-hover/btn:opacity-100 transition-opacity"
                        />

                        {/* Custom Job Description Icon */}
                        <JobDescriptionIcon className="text-sky-300 group-hover/btn:text-white transition-colors relative z-10" />

                        <span className="relative z-10 font-semibold tracking-tight">
                          Job Description
                        </span>

                        <ChevronDown className="size-3.5 text-neutral-300 group-hover/btn:text-white group-hover/btn:translate-y-0.5 transition-all relative z-10" />
                      </motion.button>
                      <span className="text-[11px] font-mono text-neutral-400 select-none">
                        Click to view role specifications
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* ------------------------------------------------------------ */
              /* STATE B: UNSEALED SPECIFICATION DOSSIER (RICH INTERACTIVE)   */
              /* ------------------------------------------------------------ */
              <motion.div
                key="unsealed-dossier"
                initial={{ opacity: 0, scale: 0.98, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 14 }}
                transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                className="w-full rounded-2xl border border-white/[0.12] bg-[#0B0D13]/95 backdrop-blur-3xl shadow-[0_24px_64px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.08)] overflow-hidden"
              >
                {/* 1. Header Command Bar: Live Decrypted Badge, Role Selector & Re-seal Button */}
                <div className="px-5 sm:px-7 pt-4 pb-3.5 border-b border-white/[0.08] bg-black/40 flex flex-wrap items-center justify-between gap-3">
                  {/* Left: Decrypted status + Track quick-switcher */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
                      <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="tracking-wider uppercase font-semibold">
                        DOSSIER UNSEALED · VERIFIED
                      </span>
                    </div>

                    <span className="text-neutral-700 hidden sm:inline select-none">|</span>

                    {/* Role Quick Selector */}
                    <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                      {(['salesforce', 'ai-pe', 'sde'] as const).map((rKey) => {
                        const isRoleActive = dossierRole === rKey;
                        const rLabel =
                          rKey === 'salesforce' ? 'Salesforce' : rKey === 'ai-pe' ? 'AI PE' : 'SDE';
                        return (
                          <button
                            key={rKey}
                            type="button"
                            onClick={() => setDossierRoleOverride(rKey)}
                            className={cn(
                              'px-2.5 py-1 rounded-md text-xs font-mono transition-all cursor-pointer',
                              isRoleActive
                                ? 'bg-white/15 text-white font-semibold shadow-xs'
                                : 'text-neutral-400 hover:text-white'
                            )}
                          >
                            {rLabel}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right: Re-seal Button */}
                  <button
                    type="button"
                    onClick={() => setIsDossierRevealed(false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-neutral-400 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition-all cursor-pointer"
                  >
                    <EyeOff className="size-3.5" />
                    <span>Re-seal Dossier</span>
                  </button>
                </div>

                {/* 2. Segmented Navigation Tabs */}
                <div className="flex items-center gap-1.5 px-5 sm:px-7 pt-3 pb-2.5 border-b border-white/[0.06] bg-black/20 overflow-x-auto [scrollbar-width:none] select-none">
                  {DOSSIER_TABS.map((tab) => {
                    const isSelected = activeDocTab === tab.id;
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveDocTab(tab.id)}
                        className={cn(
                          'relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer select-none whitespace-nowrap',
                          isSelected
                            ? 'text-white'
                            : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                        )}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="dossier-tab-pill"
                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                            className="absolute inset-0 rounded-xl bg-white/[0.12] border border-white/[0.15] shadow-xs"
                          />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                          <Icon className="size-4 shrink-0" />
                          <span>{tab.label}</span>
                          {tab.badge && (
                            <span
                              className={cn(
                                'text-[10px] font-mono px-1.5 py-0.5 rounded-full',
                                isSelected
                                  ? 'bg-white/20 text-white'
                                  : 'bg-white/[0.06] text-neutral-400'
                              )}
                            >
                              {tab.badge}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* 3. Tab Content Panels */}
                <div className="p-5 sm:p-8 bg-black/35 min-h-[380px]">
                  {/* ------------------------------------------------------ */}
                  {/* TAB 1: JOB DESCRIPTION                                 */}
                  {/* ------------------------------------------------------ */}
                  {activeDocTab === 'job-description' && (
                    <div className="space-y-6">
                      {/* Role Header Banner */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-white/[0.08] bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-white/[0.08] border border-white/10 flex items-center justify-center shrink-0">
                            {React.createElement(dossierJobDescription.roleIcon, {
                              className: 'size-5 text-white',
                            })}
                          </div>
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
                              {dossierJobDescription.title}
                            </h3>
                            <p className="text-xs font-mono text-neutral-400">
                              {dossierJobDescription.trackBadge}
                            </p>
                          </div>
                        </div>

                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 font-mono text-xs self-start sm:self-auto">
                          Active Engineering Blueprint
                        </span>
                      </div>

                      {/* Structured Narrative Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Paragraph 1 Card */}
                        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 space-y-3 relative overflow-hidden group hover:border-white/20 transition-all">
                          <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
                            <Layers className="size-3.5" />
                            <span className="tracking-wider uppercase">01 · Technical Foundation</span>
                          </div>
                          <p className="text-sm text-neutral-300 leading-relaxed font-sans">
                            {dossierJobDescription.paragraphs[0]}
                          </p>
                        </div>

                        {/* Paragraph 2 Card */}
                        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 space-y-3 relative overflow-hidden group hover:border-white/20 transition-all">
                          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                            <Sparkle className="size-3.5" />
                            <span className="tracking-wider uppercase">02 · Enterprise Exposure</span>
                          </div>
                          <p className="text-sm text-neutral-300 leading-relaxed font-sans">
                            {dossierJobDescription.paragraphs[1]}
                          </p>
                        </div>
                      </div>

                      {/* Track Takeaway Micro-Pills */}
                      <div className="pt-2 flex items-center gap-2 flex-wrap text-xs font-mono text-neutral-400">
                        <span className="text-neutral-500">Focus:</span>
                        <span className="px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-neutral-300">
                          Structured Technical Learning
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-neutral-300">
                          Guided Hands-on Development
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-neutral-300">
                          Enterprise-Oriented Environment
                        </span>
                      </div>
                    </div>
                  )}

                  {/* ------------------------------------------------------ */}
                  {/* TAB 2: ROLES & RESPONSIBILITIES                        */}
                  {/* ------------------------------------------------------ */}
                  {activeDocTab === 'responsibility' && (
                    <div className="space-y-5">
                      <div className="space-y-1">
                        <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                          <ListChecks className="size-5 text-sky-400" />
                          <span>Roles and Responsibilities</span>
                        </h3>
                        <p className="text-xs sm:text-[13px] text-neutral-400 font-mono">
                          {'//'} Participants enrolled in the Valoria Technology Internship Programme are expected to:
                        </p>
                      </div>

                      {/* 8 Responsibilities Responsive 2-Col Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        {PROGRAM_RESPONSIBILITIES.map((item, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-white/[0.06] hover:border-white/15 bg-white/[0.02] p-4 flex items-start gap-3.5 transition-all group"
                          >
                            <span className="size-6 rounded-lg bg-white/[0.06] border border-white/10 text-amber-400 font-mono text-xs font-semibold flex items-center justify-center shrink-0 pt-0.5">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            <p className="text-xs sm:text-[13px] text-neutral-300 leading-relaxed font-sans group-hover:text-white transition-colors">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ------------------------------------------------------ */}
                  {/* TAB 3: CERTIFICATION CRITERIA                          */}
                  {/* ------------------------------------------------------ */}
                  {activeDocTab === 'certification' && (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                          <Award className="size-5 text-emerald-400" />
                          <span>Programme Completion and Certification</span>
                        </h3>
                        <p className="text-xs sm:text-[13px] text-neutral-400 font-mono">
                          {'//'} Evaluation pathways &amp; credential distribution policy
                        </p>
                      </div>

                      {/* Pathways Side-by-Side */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Pathway A: Training and Project Completion */}
                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.03] p-5 space-y-4 relative overflow-hidden shadow-[0_8px_30px_rgba(16,185,129,0.08)]">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                              <CheckCircle2 className="size-4 text-emerald-400" />
                              <span>Full Honors Credential</span>
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-400/15 border border-emerald-400/30 text-emerald-300">
                              RECOMMENDED
                            </span>
                          </div>

                          <h4 className="text-sm sm:text-base font-semibold text-white">
                            Training and Project Completion
                          </h4>

                          <p className="text-xs sm:text-[13px] text-neutral-300 leading-relaxed font-sans">
                            {PROGRAM_CERTIFICATION[0]!.body}
                          </p>

                          {/* Credentials Badges */}
                          <div className="pt-2 border-t border-emerald-500/20 space-y-1.5 text-xs font-mono text-emerald-300/90">
                            <div className="flex items-center gap-2">
                              <span className="size-1.5 rounded-full bg-emerald-400" />
                              <span>Training Completion Certificate</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="size-1.5 rounded-full bg-emerald-400" />
                              <span>Internship / Work Experience Certificate</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="size-1.5 rounded-full bg-emerald-400" />
                              <span>Letter of Appreciation</span>
                            </div>
                          </div>
                        </div>

                        {/* Pathway B: Training Completion Only */}
                        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 space-y-4 relative overflow-hidden hover:border-white/15 transition-all">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1.5">
                              <FileCheck2 className="size-4 text-neutral-400" />
                              <span>Partial Completion</span>
                            </span>
                          </div>

                          <h4 className="text-sm sm:text-base font-semibold text-white">
                            Training Completion Only
                          </h4>

                          <p className="text-xs sm:text-[13px] text-neutral-300 leading-relaxed font-sans">
                            {PROGRAM_CERTIFICATION[1]!.body}
                          </p>

                          {/* Credentials Badges */}
                          <div className="pt-2 border-t border-white/[0.06] space-y-1.5 text-xs font-mono text-neutral-400">
                            <div className="flex items-center gap-2">
                              <span className="size-1.5 rounded-full bg-neutral-400" />
                              <span>Training Completion Certificate Only</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Mandatory Requirements Notice */}
                      <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 flex items-start gap-3">
                        <AlertCircle className="size-4 text-amber-400 shrink-0 mt-0.5" />
                        <div className="text-xs sm:text-[13px] text-neutral-300 leading-relaxed">
                          <span className="font-semibold text-amber-300 font-mono">
                            Programme Requirements:
                          </span>{' '}
                          {PROGRAM_CERTIFICATION[2]!.body}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ------------------------------------------------------ */}
                  {/* TAB 4: DURATION & PHASES                               */}
                  {/* ------------------------------------------------------ */}
                  {activeDocTab === 'duration' && (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                          <CalendarClock className="size-5 text-sky-400" />
                          <span>Programme Duration</span>
                        </h3>
                        <p className="text-xs sm:text-[13px] text-neutral-400 font-mono">
                          {'//'} The Valoria Technology Internship Programme is structured into two phases:
                        </p>
                      </div>

                      {/* Two Phase Structured Roadmap */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {PROGRAM_DURATION_PHASES.map((phase, idx) => (
                          <div
                            key={phase.heading}
                            className="rounded-xl border border-white/[0.08] hover:border-white/15 bg-white/[0.02] p-5 space-y-3 relative group transition-all"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-semibold">
                                Stage 0{idx + 1}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.06] text-neutral-300">
                                Sequential
                              </span>
                            </div>

                            <h4 className="text-sm sm:text-base font-semibold text-white">
                              {phase.heading}
                            </h4>

                            <p className="text-xs sm:text-[13px] text-neutral-300 leading-relaxed font-sans">
                              {phase.body}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Timeline Governance & Scheduling Callout */}
                      <div className="rounded-xl border border-white/[0.08] bg-black/40 p-4 sm:p-5 space-y-3 text-xs sm:text-[13px] text-neutral-300 font-sans leading-relaxed">
                        <div className="flex items-start gap-3">
                          <span className="text-neutral-500 font-mono select-none pt-0.5">{'//'}</span>
                          <p>
                            The duration allocated to each phase is determined by the respective Valoria Technology department and may vary depending on the selected programme and its learning objectives.
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="text-neutral-500 font-mono select-none pt-0.5">{'//'}</span>
                          <p>
                            The detailed phase-wise schedule, programme duration, commencement date and completion timeline will be communicated to selected candidates during the selection and onboarding process.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Candidate Footer Action Bar */}
                <div className="px-5 sm:px-8 py-4 bg-black/60 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
                    <span className="text-xs sm:text-[13px] text-neutral-300 font-mono">
                      Prerequisites verified · Ready for{' '}
                      <span className="text-white font-semibold">
                        {dossierRole === 'salesforce'
                          ? 'Salesforce Developer I'
                          : dossierRole === 'ai-pe'
                          ? 'AI Product Engineer'
                          : 'Software Development Engineer'}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setIsDossierRevealed(false)}
                      className="text-xs font-mono text-neutral-400 hover:text-white px-3 py-2 cursor-pointer transition-colors"
                    >
                      Close &amp; Re-seal
                    </button>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                      onClick={() => {
                        setActiveTab(dossierRole);
                        setIsApplicationOpen(true);
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs sm:text-sm hover:bg-neutral-100 transition-all cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                    >
                      <span>Apply for this Track</span>
                      <ArrowRight className="size-3.5 stroke-[2.4]" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons Below the Card (Matching Image 2) */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-7">
            {/* 1. Explore Playground Button (Primary White Pill) */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={() => {
                document.getElementById('lab')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 rounded-full bg-white text-black hover:bg-neutral-100 font-semibold px-7 py-3 text-sm shadow-[0_0_24px_rgba(255,255,255,0.2)] transition-all cursor-pointer"
            >
              <span>Explore Playground</span>
              <ArrowRight className="size-4 stroke-[2.2]" />
            </motion.button>

            {/* 2. Browse Primitives Button (Secondary Translucent Glass Pill) */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={() => {
                document.getElementById('lab')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/15 px-7 py-3 text-sm font-medium transition-all cursor-pointer"
            >
              <span>Browse Primitives</span>
            </motion.button>
          </div>
        </div>
      </div>
      </section>
      <CurtainApplicationModal
        isOpen={isApplicationOpen}
        onClose={closeApplicationSheet}
        defaultProgram={activeTab}
      />
    </>
  );
}

export default LaunchSection;
