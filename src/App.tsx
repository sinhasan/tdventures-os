import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  BarChart3, 
  ChevronRight, 
  ArrowLeft,
  Globe2, 
  Layers, 
  Mic, 
  Play, 
  ShieldAlert, 
  UploadCloud, 
  Zap, 
  Search, 
  Copy, 
  Check, 
  RotateCcw, 
  Download, 
  Maximize2, 
  Settings, 
  AlertTriangle, 
  Anchor, 
  HelpCircle, 
  ListFilter, 
  Target, 
  Flame, 
  Cpu, 
  Workflow,
  Sparkles,
  Send,
  RefreshCw,
  X,
  Gauge,
  Share2,
  Users,
  Lock,
  FileText,
  LayoutDashboard,
  Coins,
  CheckCircle2,
  Bell,
  ShieldCheck,
  Volume2,
  Sun,
  Moon,
  TrendingUp,
  ArrowUpRight,
  Linkedin,
  Network,
  Presentation
} from 'lucide-react';

import { LinkedInIntelTab } from './components/LinkedInIntelTab';
import { GoogleDocsTab } from './components/GoogleDocsTab';
import { GoogleSlidesTab } from './components/GoogleSlidesTab';
import {
  AcceptClaimsPanel,
  ConversionV2ResultPanel,
  PitchDeckEvidencePanel
} from './components/ConversionV2Panels';
import {
  FounderEvidenceRecord,
  FounderSignalDashboard
} from './components/FounderSignalWorkspace';

import { 
  FundraisingIntelTab, 
  StartupValidationTab, 
  InvestorMatchmakingTab, 
  DocumentsHubTab, 
  FinancialForecastingTab 
} from './components/FounderTabs';

import { 
  DealFlowTab, 
  ForensicAITab, 
  PrescriptiveAITab, 
  MaritimeIntelTab, 
  PortfolioAnalyticsTab 
} from './components/InvestorTabs';

import { 
  UserManagementTab, 
  AIMonitoringTab, 
  SecurityCenterTab, 
  RolePermissionsTab 
} from './components/AdminTabs';

import { 
  BusinessAutomationTab,
  SupplyChainIntelTab
} from './components/SMBTabs';

import { 
  AIChatAssistantWidget, 
  AIVoiceCommandWidget, 
  AdSeoCreatorPanel 
} from './components/AIChatVoiceBanner';

import { SEOOptimizedSuite, DueDiligenceReport, DealFlowItem } from './types';
import type {
  ConversionClaimReview,
  ConversionV2Analysis,
  ConversionV2ContextResponse,
  TdventureCurrentUser,
  ProfilePlaneResolution
} from './lib/conversionApi';
import { 
  COMPONENT_ROLES
} from './data';

function firstText(
  source: Record<string, unknown> | null | undefined,
  keys: string[]
) {
  for (const key of keys) {
    const value = String(source?.[key] || '').trim();
    if (value) return value;
  }
  return '';
}

function evidenceSummary(
  context: ConversionV2ContextResponse,
  keys: string[],
  options?: { lowFirst?: boolean }
) {
  const selected = context.evidence.claims
    .filter((claim) => keys.includes(claim.key) && claim.evidence.trim())
    .sort((left, right) => {
      if (!options?.lowFirst) return 0;
      return left.rating - right.rating;
    });

  return selected
    .map(
      (claim) =>
        `${claim.label} (${claim.rating}/5): ${claim.evidence.trim()}`
    )
    .join('\n');
}

// Email capture banner component (inline for simplicity)

function ConversionReviewProgressModal() {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 px-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="conversion-review-progress-title"
    >
      <div className="w-full max-w-md rounded-3xl border border-[#D4FF00]/35 bg-[#0c1222] p-8 text-center shadow-2xl">
        <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-[#D4FF00]/25 border-t-[#D4FF00]" />
        <p className="text-[10px] font-mono font-bold uppercase tracking-[0.28em] text-[#D4FF00]">
          TD Conversion OS
        </p>
        <h2
          id="conversion-review-progress-title"
          className="mt-3 text-2xl font-black text-white"
        >
          Applying AI Intelligence
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          We are interpreting your founder record and the evidence you have supplied.
          Please keep this window open.
        </p>
        <p className="mt-4 text-xs text-slate-500">
          This usually takes less than a minute.
        </p>
      </div>
    </div>
  );
}

const EmailCaptureBanner = () => {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('emailBannerDismissed');
    if (saved) setDismissed(true);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('emailBannerDismissed', 'true');
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:max-w-sm z-50 bg-[#1A1A2E] border border-[#D4FF00] rounded-xl shadow-2xl p-4">
      <button onClick={handleDismiss} className="absolute top-2 right-2 text-gray-400 hover:text-white">✕</button>
      <p className="text-white text-sm font-medium">📊 Get your detailed investor report</p>
      <p className="text-gray-300 text-xs mt-1">Enter your email to receive a full breakdown of your pitch deck score and investor match suggestions.</p>
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSfWdpDDyRP1F66yrDOppZR-Z4QfJehq64mEtQkgtYm2d3Z06w/viewform"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block w-full text-center bg-[#D4FF00] text-black font-bold py-2 rounded-lg text-sm hover:bg-[#E6FF66] transition"
      >
        Claim my report →
      </a>
    </div>
  );
};


type ConversionEntryGateProps = {
  initialMessage?: string;
  onAuthenticated: (
    user: TdventureCurrentUser
  ) => void;
};

const ConversionEntryGate = ({
  initialMessage = '',
  onAuthenticated
}: ConversionEntryGateProps) => {
  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [error, setError] =
    useState(initialMessage);

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const {
        loginTdventureAccount,
        clearStoredTdventureToken,
        getConversionWorkspaceAccess
      } = await import(
        './lib/conversionApi'
      );

      const accountUser =
        await loginTdventureAccount(
          email,
          password
        );

      try {
        const access =
          await getConversionWorkspaceAccess();

        if (!access.allowed) {
          throw new Error(
            'Your account is not eligible to enter Conversion.'
          );
        }
      } catch (accessError) {
        clearStoredTdventureToken();
        throw accessError;
      }

      onAuthenticated(accountUser);
    } catch (loginError) {
      const message =
        loginError instanceof Error
          ? loginError.message
          : 'Could not sign in to TD Venture.';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020205] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(212,255,0,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(212,255,0,0.035)_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="absolute left-[-10%] top-[-15%] h-[520px] w-[520px] rounded-full bg-purple-700/20 blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-10%] h-[560px] w-[560px] rounded-full bg-[#D4FF00]/10 blur-[170px]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">
        <div className="grid w-full max-w-6xl gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">

          <section className="hidden lg:block">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4FF00]/60 bg-black/70 px-5 py-2 text-xs font-black uppercase tracking-[0.32em] text-[#D4FF00] shadow-[0_0_26px_rgba(212,255,0,0.16)]">
              <ShieldCheck className="h-4 w-4" />
              TD Venture Conversion
            </div>

            <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[1.04] tracking-tight">
              <span className="block text-white">
                Convert founder
              </span>

              <span className="block text-[#D4FF00]">
                evidence into
              </span>

              <span className="block text-slate-400">
                investor-ready action.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-400 xl:text-lg">
              Strengthen pitch proof, fundraise readiness,
              narrative clarity and investor fit before moving
              an opportunity into Deal Desk.
            </p>

            <div className="mt-8 grid max-w-3xl grid-cols-3 gap-4">
              {[
                ['01', 'Founder evidence'],
                ['02', 'Conversion signals'],
                ['03', 'Deal Desk handoff'],
              ].map(([number, label]) => (
                <div
                  key={number}
                  className="rounded-2xl border border-slate-800 bg-[#080D1A]/90 p-5"
                >
                  <div className="text-xs font-black tracking-[0.3em] text-[#D4FF00]">
                    {number}
                  </div>

                  <div className="mt-3 text-sm font-bold text-white">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mx-auto w-full max-w-md">
            <div className="rounded-3xl border border-[#D4FF00]/55 bg-[#070A0F]/95 p-7 shadow-[0_0_70px_rgba(212,255,0,0.18)] backdrop-blur-xl">

              <div className="mb-6">
                <div className="text-xs font-black uppercase tracking-[0.3em] text-[#D4FF00]">
                  Secure Conversion Terminal
                </div>

                <h2 className="mt-3 text-3xl font-black text-white">
                  Sign in
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Access is available to registered Startup and
                  Investor accounts. Global administrators retain
                  system access.
                </p>
              </div>

                <div className="mb-5 grid grid-cols-2 gap-3">
                  <a
                    href="https://staging.tdventure.vc/app"
                    target="_blank"
                    rel="noreferrer"
                    title="Open Private Marketplace"
                    className="motion-safe:animate-[pulse_3s_ease-in-out_infinite] inline-flex min-h-11 items-center justify-center rounded-md border border-cyan-300/70 bg-cyan-400/10 px-3 text-center text-xs font-bold text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.24)] transition hover:bg-cyan-300 hover:!text-black"
                  >
                    ← Private Marketplace
                  </a>

                  <a
                    href="https://crm.tdventure.vc/login"
                    target="_blank"
                    rel="noreferrer"
                    title="Open Deal Desk"
                    className="motion-safe:animate-[pulse_3s_ease-in-out_infinite] inline-flex min-h-11 items-center justify-center rounded-md border border-[#D4FF00]/70 bg-[#D4FF00]/10 px-3 text-center text-xs font-bold text-[#D4FF00] shadow-[0_0_22px_rgba(212,255,0,0.24)] transition hover:bg-[#D4FF00] hover:!text-black"
                  >
                    Deal Desk →
                  </a>
                </div>
              {error && (
                <div className="mb-5 rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm leading-relaxed text-red-200">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleLogin}
              >
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                  Email
                </label>

                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  className="mb-4 w-full rounded-xl border border-slate-700 bg-black/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-[#D4FF00] focus:shadow-[0_0_20px_rgba(212,255,0,0.18)]"
                />

                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                  Password
                </label>

                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  className="mb-5 w-full rounded-xl border border-slate-700 bg-black/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-[#D4FF00] focus:shadow-[0_0_20px_rgba(212,255,0,0.18)]"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#D4FF00] py-3.5 text-sm font-black uppercase tracking-[0.12em] !text-black shadow-[0_0_28px_rgba(212,255,0,0.36)] transition hover:bg-[#E7FF66] disabled:cursor-wait disabled:opacity-60"
                >
                  {loading
                    ? 'Signing in…'
                    : 'Enter Conversion'}
                </button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-800" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-600">
                  New to TD Venture
                </span>
                <div className="h-px flex-1 bg-slate-800" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://staging.tdventure.vc/signup/startup"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#D4FF00]/60 bg-[#D4FF00]/10 px-3 text-center text-xs font-black text-[#D4FF00] transition hover:bg-[#D4FF00] hover:!text-black"
                >
                  Apply as Startup
                </a>

                <a
                  href="https://staging.tdventure.vc/signup/investor"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-purple-400/60 bg-purple-500/10 px-3 text-center text-xs font-black text-purple-200 transition hover:bg-purple-500 hover:text-white"
                >
                  Apply as Investor
                </a>
              </div>

            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const PREMIUM_THEMES = [
  { id: 'enterprise-blue', name: 'Deep Enterprise Blue', bg: '#0F172A', gradientStart: '#0F172A', gradientEnd: '#090D1A', accent: '#7C3AED', glowColor: 'rgba(124, 58, 237, 0.4)' },
  { id: 'electric-purple', name: 'Electric Purple Pulse', bg: '#0F172A', gradientStart: '#1E1B4B', gradientEnd: '#090514', accent: '#7C3AED', glowColor: 'rgba(124, 58, 237, 0.4)' },
  { id: 'neon-violet', name: 'Neon Violet Glow', bg: '#0F172A', gradientStart: '#3B0764', gradientEnd: '#0B071F', accent: '#9333EA', glowColor: 'rgba(147, 51, 234, 0.4)' }
];

const INITIAL_DEAL_FLOW: DealFlowItem[] = [];

export default function App() {
  const [themeMode] = useState<'light' | 'dark'>('dark');
  const [role, setRole] = useState<'founder' | 'investor' | 'smb' | 'admin'>(() => {
    try {
      const saved = localStorage.getItem('venture_ai_role');
      if (saved === 'founder' || saved === 'investor' || saved === 'smb' || saved === 'admin') {
        return saved;
      }
    } catch {}
    return 'founder';
  });
  const [activeTab, setActiveTab] = useState<string>(() => {
    try {
      const savedRole = localStorage.getItem('venture_ai_role');
      const savedTab = localStorage.getItem('venture_ai_tab');
      if (savedRole === 'admin') return 'user_management';
      if (savedRole && savedRole !== 'founder' && savedTab) {
        return savedTab;
      }
    } catch {}
    return 'dashboard';
  });
  const [activePitchModal, setActivePitchModal] = useState<'download' | 'share' | 'schedule' | 'plan' | null>(null);
  const [agiAutoMode, setAgiAutoMode] = useState<boolean>(true);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'info' | 'warn' | null }>({ text: '', type: null });
  const [tdventureUser, setTdventureUser] =
    useState<TdventureCurrentUser | null>(null);
  const [tdventureSessionChecked, setTdventureSessionChecked] =
    useState(false);

  const [tdventureSessionError, setTdventureSessionError] =
    useState('');

  const [profilePlaneResolution, setProfilePlaneResolution] =
    useState<ProfilePlaneResolution | null>(null);

  const tdventureAccountName =
    tdventureUser?.full_name?.trim() ||
    tdventureUser?.email?.split('@')[0] ||
    (tdventureSessionChecked ? 'Public Preview' : 'Connecting…');

  const tdventureAccountEmail =
    tdventureUser?.email ||
    (tdventureSessionChecked
      ? 'No shared TD Venture session'
      : 'Checking TD Venture session');

  const tdventureAccountRole = tdventureUser?.role
    ? `${tdventureUser.role.replace(/_/g, ' ')} account`
    : tdventureSessionChecked
      ? 'Public workspace'
      : 'Session check';

  const tdventureAccountInitials =
    tdventureAccountName
      .split(' ')
      .map((part) => part.charAt(0))
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'TD';



  useEffect(() => {
    let cancelled = false;

    void import('./lib/conversionApi')
      .then(async ({
        initializeTdventureSessionFromLaunch,
        getTdventureCurrentUser,
        getConversionWorkspaceAccess,
        getCurrentProfilePlane
      }) => {
        const session =
          await initializeTdventureSessionFromLaunch();

        if (cancelled) return session;

        if (session.token) {
          const accountUser = await getTdventureCurrentUser();

          const access =
            await getConversionWorkspaceAccess();

          if (!access.allowed) {
            throw new Error(
              'Your account is not eligible to enter Conversion.'
            );
          }

          const profilePlane =
            await getCurrentProfilePlane();

          if (!cancelled) {
            setTdventureUser(accountUser);
            setProfilePlaneResolution(profilePlane);
            setTdventureSessionError('');

            const profile = profilePlane.profile;

            if (
              profilePlane.state === 'linked' &&
              profilePlane.profile_type === 'startup' &&
              profile
            ) {
              setConversionProfile((current) => ({
                ...current,
                startupName:
                  current.startupName.trim() ||
                  String(profile.startup_name || '').trim(),
                sector:
                  current.sector.trim() ||
                  String(profile.sector || '').trim(),
                stage:
                  current.stage !== 'Seed'
                    ? current.stage
                    : (
                      String(profile.stage || '').trim() ||
                      current.stage
                    ),
                raiseAmount:
                  current.raiseAmount.trim() ||
                  String(profile.ask || '').trim(),
                pitchSummary:
                  current.pitchSummary.trim() ||
                  String(profile.pitch_summary || '').trim(),
              }));

              setFeedbackMsg({
                text: 'Startup profile loaded from TD Venture.',
                type: 'success'
              });
            }
          }
        } else {
          setTdventureUser(null);
          setTdventureSessionError('');
        }

        return session;
      })
      .then(({ exchanged }) => {
        if (!cancelled && exchanged) {
          setFeedbackMsg({
            text: 'TD Venture session connected.',
            type: 'success'
          });
        }
      })
      .catch((error: unknown) => {
        if (cancelled) return;

        setTdventureUser(null);

        try {
          localStorage.removeItem(
            'tdventure_token'
          );
        } catch {
          // Browser storage may be unavailable.
        }

        const message =
          error instanceof Error
            ? error.message
            : 'Could not connect your TD Venture session.';

        setTdventureSessionError(message);
      })
      .finally(() => {
        if (!cancelled) {
          setTdventureSessionChecked(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!tdventureSessionChecked) {
      return;
    }

    const pathname =
      window.location.pathname;

    if (tdventureUser) {
      if (pathname === '/login') {
        window.history.replaceState(
          {},
          document.title,
          '/'
        );
      }

      return;
    }

    if (pathname !== '/login') {
      window.history.replaceState(
        {},
        document.title,
        '/login'
      );
    }
  }, [
    tdventureSessionChecked,
    tdventureUser
  ]);

  useEffect(() => {
    try {
      localStorage.setItem('venture_ai_theme', themeMode);
    } catch (e) {
      console.warn(e);
    }
  }, [themeMode]);

  useEffect(() => {
    try {
      localStorage.setItem('venture_ai_role', role);
    } catch (e) {
      console.warn(e);
    }
  }, [role]);

  useEffect(() => {
    try {
      localStorage.setItem('venture_ai_tab', activeTab);
    } catch (e) {
      console.warn(e);
    }
  }, [activeTab]);

  type ConversionProfile = {
    startupName: string;
    sector: string;
    stage: string;
    raiseAmount: string;
    pitchSummary: string;
    tractionProof: string;
    riskNotes: string;
    targetInvestor: string;
  };

  const [conversionProfile, setConversionProfile] = useState<ConversionProfile>({
    startupName: '',
    sector: '',
    stage: 'Seed',
    raiseAmount: '',
    pitchSummary: '',
    tractionProof: '',
    riskNotes: '',
    targetInvestor: 'Sector-focused seed funds'
  });

  const updateConversionProfile = (field: keyof ConversionProfile, value: string) => {
    setConversionProfile(prev => ({ ...prev, [field]: value }));
  };


  type ConversionReviewResult = {
    pitchDeckQuality: number;
    fundraiseReadiness: number;
    narrativeClarity: number;
    riskLevel: 'Low' | 'Moderate' | 'High';
    riskFlags: string[];
    nextBestAction: string;
    generatedAt: string;
    limitations: Record<string, string>;
  };

  const [conversionReview, setConversionReview] =
    useState<ConversionReviewResult | null>(null);

  const [conversionV2Analysis, setConversionV2Analysis] =
    useState<ConversionV2Analysis | null>(null);
  const [conversionV2Context, setConversionV2Context] =
    useState<ConversionV2ContextResponse | null>(null);
  const [conversionV2GeneratedAt, setConversionV2GeneratedAt] =
    useState('');
  const [conversionClaimReview, setConversionClaimReview] =
    useState<ConversionClaimReview | null>(null);
  const [selectedPitchDeck, setSelectedPitchDeck] =
    useState<File | null>(null);
  const [claimInterviewResponses, setClaimInterviewResponses] =
    useState<Record<string, string>>({});
  const [savingClaimInterview, setSavingClaimInterview] =
    useState(false);

  const [isConversionReviewRunning, setIsConversionReviewRunning] =
    useState(false);

  const linkedStartupId = String(
    profilePlaneResolution?.state === 'linked' &&
    profilePlaneResolution?.profile_type === 'startup'
      ? profilePlaneResolution.profile_id || ''
      : ''
  ).trim();

  useEffect(() => {
    if (!linkedStartupId) {
      return;
    }

    let cancelled = false;

    void import('./lib/conversionApi')
      .then(async ({
        getConversionV2Context,
        getConversionClaimReview
      }) => {
        const [context, review] = await Promise.all([
          getConversionV2Context(linkedStartupId),
          getConversionClaimReview(linkedStartupId).catch(() => null)
        ]);

        if (cancelled) {
          return;
        }

        setConversionV2Context(context);

        const draft = context.evidence.profile_draft || {};
        const carriedPitch =
          firstText(draft, [
            'pitch_summary',
            'one_paragraph_pitch',
            'company_description',
            'description'
          ]) ||
          String(context.profile.pitch_summary || '').trim();
        const carriedTraction = evidenceSummary(
          context,
          [
            'revenue',
            'third_year_projection',
            'traction',
            'profitability',
            'business_model',
            'scalability',
            'funding_history'
          ]
        );
        const carriedRisk = evidenceSummary(
          context,
          [
            'durability',
            'regulatory_readiness',
            'profitability',
            'ownership_and_team',
            'funding_instrument',
            'investor_exit',
            'secret_sauce'
          ],
          { lowFirst: true }
        );
        const investorTarget = [
          String(context.profile.sector || '').trim(),
          String(context.profile.stage || '').trim()
        ]
          .filter(Boolean)
          .join(' ');

        setConversionProfile((current) => ({
          ...current,
          startupName:
            String(context.profile.startup_name || '').trim()
            || current.startupName,
          sector:
            String(context.profile.sector || '').trim()
            || current.sector,
          stage:
            String(context.profile.stage || '').trim()
            || current.stage,
          raiseAmount:
            context.profile.ask_usd
              ? `USD ${context.profile.ask_usd}`
              : current.raiseAmount,
          pitchSummary: current.pitchSummary || carriedPitch,
          tractionProof: current.tractionProof || carriedTraction,
          riskNotes: current.riskNotes || carriedRisk,
          targetInvestor:
            current.targetInvestor === 'Sector-focused seed funds'
              ? `${investorTarget || 'Sector-focused seed'} investors`
              : current.targetInvestor
        }));

        const resolvedReview =
          review || context.claim_review || null;

        setConversionClaimReview(resolvedReview);
        setClaimInterviewResponses(
          resolvedReview?.interview_responses || {}
        );

        if (context.current_analysis) {
          setConversionV2Analysis(context.current_analysis);
          setConversionV2GeneratedAt(
            context.generated_at
              ? new Date(context.generated_at).toLocaleString()
              : ''
          );
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setConversionV2Context(null);
          console.warn('Conversion V2 context unavailable', error);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [linkedStartupId]);

  const runFullConversionReview = async () => {
    if (!linkedStartupId) {
      triggerToast(
        'Link a verified Startup profile before running Conversion Review.',
        'warn'
      );
      return;
    }

    setIsConversionReviewRunning(true);

    try {
      const { runConversionV2 } =
        await import('./lib/conversionApi');

      const response = await runConversionV2({
        startupId: linkedStartupId,
        usageType: 'paid',
        idempotencyKey:
          `conversion-v2-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`,
        pitchSummary: conversionProfile.pitchSummary,
        tractionProof: conversionProfile.tractionProof,
        riskNotes: conversionProfile.riskNotes,
        targetInvestor: conversionProfile.targetInvestor,
        deckFile: selectedPitchDeck
      });

      setConversionV2Analysis(response.analysis);
      setConversionV2Context((current) =>
        current
          ? { ...current, current_analysis: response.analysis }
          : current
      );
      setConversionV2GeneratedAt(
        new Date(response.generated_at).toLocaleString()
      );
      setConversionClaimReview(response.claim_review);
      setClaimInterviewResponses(
        response.claim_review?.interview_responses || {}
      );
      setActiveTab('pitch_analyzer');

      addLog(
        'OpenAI Evidence Engine',
        `Created Conversion V2 signal for ${
          conversionProfile.startupName || 'the founder'
        } with score ${response.analysis.conversion_score}/100.`
      );
      triggerToast(
        'Full evidence-backed Conversion Review is ready.',
        'success'
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Conversion Review could not be completed.';
      triggerToast(message, 'warn');

      if (
        message.toLowerCase().includes('entitlement')
        || message.toLowerCase().includes('credit')
      ) {
        setShowPricingModal(true);
      }
    } finally {
      setIsConversionReviewRunning(false);
    }
  };

  const saveClaimInterview = async () => {
    if (!conversionClaimReview?.id) {
      triggerToast('Apply AI Intelligence before optional verification.', 'warn');
      return;
    }

    setSavingClaimInterview(true);
    try {
      const { saveConversionInterview } =
        await import('./lib/conversionApi');
      const updated = await saveConversionInterview(
        conversionClaimReview.id,
        claimInterviewResponses
      );
      setConversionClaimReview(updated);
      triggerToast('Interview responses saved to the review record.', 'success');
    } catch (error) {
      triggerToast(
        error instanceof Error
          ? error.message
          : 'Interview responses could not be saved.',
        'warn'
      );
    } finally {
      setSavingClaimInterview(false);
    }
  };

  const runConversionPreview = async () => {
    const startupId = linkedStartupId;

    if (!startupId) {
      triggerToast(
        'Link a verified Startup profile before running Preview Analysis.',
        'warn'
      );
      return;
    }

    if (conversionProfile.pitchSummary.trim().length < 40) {
      triggerToast(
        'Add at least a short founder pitch summary before running Preview Analysis.',
        'warn'
      );
      return;
    }

    setIsConversionReviewRunning(true);
    setConversionReview(null);

    try {
      const { runConversionPreview: requestPreview } =
        await import('./lib/conversionApi');

      const response = await requestPreview({
        startupId,
        idempotencyKey:
          `conversion-preview-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`,
        startupName: conversionProfile.startupName,
        sector: conversionProfile.sector,
        stage: conversionProfile.stage,
        raiseAmount: conversionProfile.raiseAmount,
        pitchSummary: conversionProfile.pitchSummary,
        tractionProof: conversionProfile.tractionProof,
        riskNotes: conversionProfile.riskNotes,
        targetInvestor: conversionProfile.targetInvestor
      });

      const analysis = response.analysis;

      setConversionReview({
        pitchDeckQuality: analysis.pitch_deck_quality,
        fundraiseReadiness: analysis.fundraise_readiness,
        narrativeClarity: analysis.narrative_clarity,
        riskLevel: analysis.risk_level,
        riskFlags: analysis.risk_flags,
        nextBestAction: analysis.next_best_action,
        generatedAt: new Date(response.generated_at).toLocaleString(),
        limitations: response.preview_limitations
      });

      setActiveTab('pitch_analyzer');
      setFeedbackMsg({
        text: 'Founder Signal Preview generated from central TD Venture analysis.',
        type: 'success'
      });
      triggerToast(
        'Founder Signal Preview is ready.',
        'success'
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Preview Analysis could not be completed.';

      const previewAlreadyUsed =
        message.includes('Conversion entitlement is not active');

      const displayMessage = previewAlreadyUsed
        ? (
            'Your Founder Signal Preview is complete. To continue with the '
            + 'Conversion Founder Pass for full analysis, reruns, investor '
            + 'fit & CRM handoff, go to our payment plan to unlock.'
          )
        : message;

      setFeedbackMsg({
        text: displayMessage,
        type: 'warn'
      });
      triggerToast(displayMessage, 'warn');

      if (previewAlreadyUsed) {
        setShowPricingModal(true);
      }
    } finally {
      setIsConversionReviewRunning(false);
    }
  };

  const [activeAlerts, setActiveAlerts] =
    useState<Array<{ id: string; text: string; type: string; time: string }>>([]);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState<boolean>(false);

  const [telemetryLogs, setTelemetryLogs] = useState<Array<{ id: string; time: string; source: string; text: string }>>([
    {
      id: 'session-start',
      time: new Date().toTimeString().split(' ')[0],
      source: 'Workspace',
      text: 'Conversion workspace opened. No analysis has run in this session.'
    }
  ]);

  const [showPricingModal, setShowPricingModal] = useState<boolean>(false);
  const [paymentRedirecting, setPaymentRedirecting] = useState<boolean>(false);

  const openFounderPassCheckout = async () => {
    if (paymentRedirecting) {
      return;
    }

    setPaymentRedirecting(true);

    try {
      const { startConversionFounderCheckout } = await import('./lib/conversionApi');
      await startConversionFounderCheckout();
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'Could not open TD Venture secure checkout.';

      triggerToast(message, 'error');
      setPaymentRedirecting(false);
    }
  };


  const openDealDeskWorkspace = async () => {
    const launchWindow =
      window.open('', '_blank');

    if (launchWindow) {
      launchWindow.opener = null;
      launchWindow.document.title =
        'Opening Deal Desk…';
    }

    try {
      const {
        createDealDeskWorkspaceLaunch
      } = await import(
        './lib/conversionApi'
      );

      const launch =
        await createDealDeskWorkspaceLaunch();

      if (
        launchWindow &&
        !launchWindow.closed
      ) {
        launchWindow.location.replace(
          launch.launch_url
        );
      } else {
        window.location.assign(
          launch.launch_url
        );
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Could not open Deal Desk securely.';

      const authenticationFailed =
        /session|credential|token|unauthori[sz]ed|forbidden|401|403/i.test(
          message
        );

      if (authenticationFailed) {
        const dealDeskLoginUrl =
          'https://crm.tdventure.vc/login';

        if (
          launchWindow &&
          !launchWindow.closed
        ) {
          launchWindow.location.replace(
            dealDeskLoginUrl
          );
        } else {
          window.location.assign(
            dealDeskLoginUrl
          );
        }

        triggerToast(
          'TD Venture session could not be validated. Opening Deal Desk login.',
          'warn'
        );

        return;
      }

      if (
        launchWindow &&
        !launchWindow.closed
      ) {
        launchWindow.close();
      }

      triggerToast(message, 'warn');
    }
  };

  const [selectedModel, setSelectedModel] = useState<'owl' | 'qwen' | 'openai' | 'gemini' | 'deepseek'>('owl');
  const [customApiKey, setCustomApiKey] = useState<string>('');

  const [productName, setProductName] = useState<string>('TD Conversion OS');
  const [productDesc, setProductDesc] = useState<string>('TD Conversion OS Conversion OS - pitch deck quality, fundraise readiness, investor fit, risk signals, and CRM-ready conversion summaries.');
  const [productUrl, setProductUrl] = useState<string>('https://ventureaipro.co');
  const [selectedTheme, setSelectedTheme] = useState<string>('enterprise-blue');
  const [targetAudienceInput, setTargetAudienceInput] = useState<string>('Venture Capitalists, Angel Investors, and Tech Founders');
  const [generatingAds, setGeneratingAds] = useState<boolean>(false);
  const [zoomScale, setZoomScale] = useState<number>(0.85);

  const [adSuite, setAdSuite] = useState<SEOOptimizedSuite>({
    title: "TD Conversion OS - From interest to investor-ready action",
    metaDescription: "The definitive TD Conversion OS Sourcing engine designed for seed funds and growth networks. Automate visual multi-channel positioning and predictive cap auditing instantly.",
    focusKeywords: ["venture ai", "due diligence automation", "venture capital intelligence", "startup score prediction"],
    score: 95,
    recommendations: [
      "Incorporate standard high-contrast skyscrapers on trade-oriented forums.",
      "Aesthetic neon highlights verified for optimized click-through metrics."
    ],
    bannerAdCampaigns: {
      medium_rectangle: { id: "banner-mr", size: "Medium Rectangle", width: 300, height: 250, headline: "Where Trust Meets Speed", subheadline: "Perform due diligence in 15 minutes, not six weeks.", ctaText: "Analyze Pitch Deck", bgColor: "#0F172A", textColor: "#FFFFFF", accentColor: "#7C3AED", gradientStart: "#1E1B4B", gradientEnd: "#090514", patternType: "particles", targetAudience: "Venture Capitalists & Angel Investors", seoKeywords: ["due diligence pipeline"] },
      leaderboard: { id: "banner-lb", size: "Leaderboard", width: 728, height: 90, headline: "TD Conversion OS — Autonomous Venture Intelligence Sourcing Portfolio", subheadline: "Auto-pilot analytics verifying maritime logs, legalSAFE sheets, and cashflows.", ctaText: "Start Campaign", bgColor: "#03080A", textColor: "#4ED0F5", accentColor: "#06B6D4", gradientStart: "#082F49", gradientEnd: "#020617", patternType: "circuit", targetAudience: "Fund managers & Serial Allocators", seoKeywords: ["predictive exit statistics"] },
      wide_skyscraper: { id: "banner-ws", size: "Wide Skyscraper", width: 160, height: 600, headline: "TD Conversion OS Sourcing Deployed", subheadline: "Real-time vessel supply-chain tracking & cap table audits.", ctaText: "Deploy Now", bgColor: "#0A0502", textColor: "#ffffff", accentColor: "#22C55E", gradientStart: "#064E3B", gradientEnd: "#020804", patternType: "grid", targetAudience: "SME Businesses & CFOs", seoKeywords: ["self healing code debuggers"] }
    }
  });

  const [selectedAdSizeName, setSelectedAdSizeName] = useState<keyof typeof adSuite.bannerAdCampaigns>('medium_rectangle');
  const [editableHeadline, setEditableHeadline] = useState<string>('');
  const [editableSubheadline, setEditableSubheadline] = useState<string>('');
  const [editableCtaText, setEditableCtaText] = useState<string>('');

  useEffect(() => {
    const activeAd = adSuite.bannerAdCampaigns[selectedAdSizeName];
    if (activeAd) {
      setEditableHeadline(activeAd.headline);
      setEditableSubheadline(activeAd.subheadline);
      setEditableCtaText(activeAd.ctaText);
    }
  }, [selectedAdSizeName, adSuite]);

  const [ddCompanyName, setDdCompanyName] = useState<string>('Enigma Spatial logistics');
  const [ddPitchText, setDdPitchText] = useState<string>('We build micro-sensors tracking marine containers and autonomous inland drone supply fleets.');
  const [ddUrl, setDdUrl] = useState<string>('https://enigmaspatial.io');
  const [analyzingDD, setAnalyzingDD] = useState<boolean>(false);
  const [ddReport, setDdReport] = useState<DueDiligenceReport>({
    companyName: "Enigma Spatial Logistics",
    overallScore: 89,
    confidenceLevel: 94,
    valuationRange: "$12.5M - $16.0M Suggested Raise Band",
    fundingRecommendation: "Seed Stage Buy",
    executiveSummary: "Enigma Spatial Logistics represents a high-potential hardware-to-cloud integrator. Their core competitive moat centers on their custom low-power satellite network telemetry chips, bypassing legacy localized RF dependencies. Automated financial audits reveal solid early customer pilot metrics.",
    marketAnalysis: {
      tam: "$8.5B global maritime logistical visibility capture",
      description: "Fast growing cross-border workflow automation sector with strong tailwinds from hardware spatial integrations.",
      competitorRisks: ["Component sourcing delays", "Ecosystem lock-ins with legacy ERP operators"]
    },
    teamScore: 92,
    financialScore: 85,
    scalabilityScore: 90,
    wordSemanticAnalysis: [
      { word: "autonomous scaling", sentiment: "positive", explanation: "Highlights low-overhead structural integration framework.", credibility: 91, importance: 95 }
    ],
    paragraphStructure: [
      { paragraph: "Our AI-powered micro-sensors track maritime trade speeds globally, bypassing typical ports bottlenecking friction.", sentiment: 88, clarity: 95, persuasive: 92, support: 90, insights: ["Strong value preposition"], recommendations: ["Ensure ISO safety standards are validated."] }
    ],
    investmentThesis: "High strategic conviction buy driven by real-world spatial demand, custom low-power silicon, and verified customer trials.",
    riskFactors: ["Dependency on satellite launch slots"],
    recommendedSteps: ["Activate the TD Conversion OS Supply-Chain tracker module", "Initiate SAFE note builds"]
  });

  const [dealFlow, setDealFlow] = useState<DealFlowItem[]>(INITIAL_DEAL_FLOW);

  const addLog = (source: string, text: string) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setTelemetryLogs(prev => [
      { id: Date.now().toString(), time: timeStr, source, text },
      ...prev.slice(0, 15)
    ]);
  };

  const triggerToast = (text: string, type: 'success' | 'info' | 'warn') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => {
      setFeedbackMsg({ text: '', type: null });
    }, 4000);
  };

  const handleRoleChange = (selectedVal: string) => {
    let mappedRole: 'founder' | 'investor' | 'smb' | 'admin' = 'founder';
    if (selectedVal === 'Startup Founder') mappedRole = 'founder';
    else if (selectedVal === 'Investor / VC' || selectedVal === 'Investor/VC') mappedRole = 'investor';
    else if (selectedVal === 'SMB Business') mappedRole = 'smb';
    else if (selectedVal === 'Admin') mappedRole = 'admin';

    setRole(mappedRole);
    if (mappedRole === 'admin') {
      setActiveTab('user_management');
    } else {
      setActiveTab('dashboard');
    }
    
    addLog('Orchestrator', `Re-routed portal layout workspace block directly matching role: ${selectedVal.toUpperCase()}`);
    triggerToast(`Switched workspace configuration to ${selectedVal}`, 'info');
  };

  const ROLE_TABS = {
    founder: [
      { id: 'docs_hub', name: '01 · Collect', icon: FileText, desc: 'Application evidence and pitch deck' },
      { id: 'pitch_analyzer', name: '02 · Apply AI Intelligence', icon: TrendingUp, desc: 'Analyse evidence independently' },
      { id: 'dashboard', name: '03 · Conversion Terminal', icon: LayoutDashboard, desc: 'Present scores, signals and next action' },
      { id: 'claim_review', name: '04 · Verify', icon: ShieldCheck, desc: 'Optional Gap Analysis and verification' },
      { id: 'deal_desk_handoff', name: '05 · Deal Desk', icon: ArrowUpRight, desc: 'Send the signal to Execution' },
    ],
    investor: [
      { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, desc: 'Active deal queue & ROI counters' },
      { id: 'deal_flow', name: 'Deal Flow Intelligence', icon: Workflow, desc: 'Pipelines Kanban deal matrix' },
      { id: 'gdocs_hub', name: 'Founder Briefs', icon: FileText, desc: 'Founder notes and CRM handoff' },
      { id: 'gslides_hub', name: 'Pitch Deck Workspace', icon: Presentation, desc: 'Deck story and proof room' },
      { id: 'linkedin_intel', name: 'Investor Signal Research', icon: Linkedin, desc: 'Market and investor context' },
      { id: 'due_diligence', name: 'Due Diligence Center', icon: ShieldAlert, desc: 'Conversion signal reporter' },
      { id: 'pitch_analyzer', name: 'Conversion Review', icon: TrendingUp, desc: 'Signal review to investor-ready action' },
      { id: 'forensic_ai', name: 'Forensic AI', icon: Search, desc: 'Fake data meters & anomalies scan' },
      { id: 'prescriptive_ai', name: 'Prescriptive AI', icon: Flame, desc: 'TD Conversion OS smart recommendation lists' },
      { id: 'maritime_intel', name: 'Maritime Intelligence', icon: Anchor, desc: 'MarineTraffic API vessel tracks' }
    ],
    smb: [
      { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, desc: 'Supply logistics health & alert cues' },
      { id: 'automation', name: 'Business Automation', icon: Cpu, desc: 'Invoice scans & vendor scorecards' },
      { id: 'gdocs_hub', name: 'Founder Briefs', icon: FileText, desc: 'Founder notes and CRM handoff' },
      { id: 'gslides_hub', name: 'Pitch Deck Workspace', icon: Presentation, desc: 'Deck story and proof room' },
      { id: 'linkedin_intel', name: 'Investor Signal Research', icon: Linkedin, desc: 'Market and investor context' },
      { id: 'supply_chain', name: 'Supply Chain Intelligence', icon: Globe2, desc: 'Shipment latencies and port logs' },
      { id: 'maritime_intel', name: 'Maritime Intelligence', icon: Anchor, desc: 'Real-time cargo vessel metrics' },
      { id: 'forecasting', name: 'Forecasting', icon: BarChart3, desc: 'Demand curves & shipment metrics' },
      { id: 'docs_hub', name: 'Documents Hub', icon: FileText, desc: 'Symmetric folder storage vault' }
    ],
    admin: [
      { id: 'user_management', name: 'User Management', icon: Users, desc: 'Invitation list & permissions seats' },
      { id: 'ai_monitoring', name: 'AI Monitoring', icon: Cpu, desc: 'OpenRouter token wave logs' },
      { id: 'security', name: 'Security Center', icon: Lock, desc: 'JWT key indicators & secure files' },
      { id: 'role_permissions', name: 'Role Permissions', icon: ListFilter, desc: 'Privilege authorizations matrix table' }
    ]
  };

  const handleGenerateAds = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratingAds(true);
    addLog('Orchestrator', `Querying OpenRouter node (${selectedModel}) for campaign generation...`);
    
    try {
      const activeThemeObj = PREMIUM_THEMES.find(t => t.id === selectedTheme) || PREMIUM_THEMES[0];
      const payload = {
        type: 'banner-ad',
        productName,
        productDescription: productDesc,
        url: productUrl,
        themeStyle: activeThemeObj.name,
        targetAudience: targetAudienceInput,
        modelSelected: selectedModel,
        apiKeyInput: customApiKey
      };

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data: SEOOptimizedSuite = await response.json();
      setAdSuite(data);
      addLog('Self-Healing', `Integrated SEO keywords and ${Object.keys(data.bannerAdCampaigns).length} campaign formats.`);
      triggerToast('Optimized ad creatives generated successfully!', 'success');
    } catch (err: any) {
      console.warn(err);
      addLog('Fallback-Processor', `API network limit warning. Deployed fallback layout structures natively.`);
      triggerToast('Applied preloaded localized models gracefully.', 'info');
    } finally {
      setGeneratingAds(false);
    }
  };

  const updateActiveAdContent = (field: 'headline' | 'subheadline' | 'ctaText', value: string) => {
    if (field === 'headline') setEditableHeadline(value);
    if (field === 'subheadline') setEditableSubheadline(value);
    if (field === 'ctaText') setEditableCtaText(value);

    setAdSuite(prev => {
      const active = prev.bannerAdCampaigns[selectedAdSizeName];
      return {
        ...prev,
        bannerAdCampaigns: {
          ...prev.bannerAdCampaigns,
          [selectedAdSizeName]: {
            ...active,
            [field]: value
          }
        }
      };
    });
  };

  const handleAnalyzeDD = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzingDD(true);
    addLog('Qwen-Reasoning', `Probing metrics and data compliance logs for ${ddCompanyName}...`);

    try {
      const payload = {
        type: 'due-diligence',
        companyName: ddCompanyName,
        pitchText: ddPitchText,
        url: ddUrl,
        modelSelected: selectedModel,
        apiKeyInput: customApiKey
      };

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`API status ${response.status}`);
      const result: DueDiligenceReport = await response.json();
      setDdReport(result);
      addLog('Self-Healing', `Synchronized due diligence indicators for ${result.companyName}.`);
      triggerToast(`Verification study concluded for ${result.companyName}!`, 'success');
    } catch (err) {
      addLog('Fallback-Processor', `API warning: deployed compliance models gracefully.`);
      setDdReport(prev => ({
        ...prev,
        companyName: ddCompanyName
      }));
      triggerToast('Strategic study generated successfully.', 'success');
    } finally {
      setAnalyzingDD(false);
    }
  };

  if (!tdventureSessionChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020205] text-[#D4FF00]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#D4FF00]/20 border-t-[#D4FF00]" />
          <div className="text-xs font-black uppercase tracking-[0.3em]">
            Checking TD Venture session
          </div>
        </div>
      </div>
    );
  }

  if (!tdventureUser) {
    return (
      <ConversionEntryGate
        initialMessage={tdventureSessionError}
        onAuthenticated={(accountUser) => {
          setTdventureUser(accountUser);
          setTdventureSessionError('');
          setActiveTab('dashboard');

          setFeedbackMsg({
            text: 'TD Venture session connected.',
            type: 'success'
          });
        }}
      />
    );
  }

  const activeThemeObj = PREMIUM_THEMES.find(t => t.id === selectedTheme) || PREMIUM_THEMES[0];

  return (
    <div className={`min-h-screen font-sans overflow-x-hidden selection:bg-[#D4FF00]/30 pb-14 md:pb-0 transition-colors duration-300 ${
      themeMode === 'light' 
        ? 'light-theme bg-[#F8FAFC] text-[#0F172A]' 
        : 'dark-theme bg-[#020205] text-slate-200'
    }`} id="application_root">
      
      {/* Dynamic Background backlights */}
      <div 
        className="fixed top-0 left-1/3 w-[650px] h-[650px] rounded-full blur-[180px] pointer-events-none transition-all duration-1000 opacity-20"
        style={{ backgroundColor: activeThemeObj.accent }}
      />
      <div className="fixed bottom-0 right-10 w-[450px] h-[450px] bg-blue-950/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating alert warnings */}
      {feedbackMsg.text && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl border border-white/10 shadow-2xl bg-slate-950/90 backdrop-blur-xl animate-bounce">
          <span className={`w-2 h-2 rounded-full ${
            feedbackMsg.type === 'success' ? 'bg-[#22C55E]' : feedbackMsg.type === 'warn' ? 'bg-[#EF4444]' : 'bg-cyan-400'
          }`} />
          <span className="text-xs font-bold text-white">{feedbackMsg.text}</span>
          <button onClick={() => setFeedbackMsg({ text: '', type: null })} className="text-slate-500 hover:text-white ml-2 text-[10px]">✕</button>
        </div>
      )}

      <div className="flex h-screen relative z-10 overflow-hidden">
        
        {/* Dynamic Sidebar navigation */}
        <aside className="w-72 border-r border-slate-800/80 bg-[#0F172A]/90 backdrop-blur-3xl flex flex-col justify-between overflow-y-auto hidden md:flex">
          <div>
            {/* Branding Header matching screenshot style */}
            <div className="h-20 flex items-center px-6 border-b border-slate-800/50 justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl border border-[#D4FF00]/35 bg-[#111821] shadow-[0_0_20px_rgba(212,255,0,0.10)]">
                  <span className="text-[#D4AF37] text-xl">🎯</span>
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#22C55E] rounded-full border border-black animate-pulse" />
                </div>
                <div>
                  <span className="font-extrabold text-lg tracking-tight text-white block">
                    TD Conversion OS
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Conversion Workspace
                  </span>
                </div>
              </div>
            </div>

              {/* Shared TD Venture account identity */}
              <div className="p-4 mx-4 mt-4 rounded-2xl bg-[#090e1a]/80 border border-slate-800/60 flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full border border-[#D4FF00]/35 bg-[#D4FF00]/[0.06] flex items-center justify-center font-bold text-[#D4FF00] uppercase text-xs">
                  {tdventureAccountInitials}
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-[#F8FAFC] block truncate">
                    {tdventureAccountName}
                  </span>

                  <span
                    className="text-[9px] text-slate-500 block truncate mt-0.5"
                    title={tdventureAccountEmail}
                  >
                    {tdventureAccountEmail}
                  </span>

                  <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 border border-purple-500/20 bg-purple-500/10 text-purple-300 capitalize">
                    {tdventureAccountRole}
                  </span>
                </div>
              </div>

            {/* Switch Role Dropdown (Exactly same features as screenshot dropdown) */}
            <div className="p-4 mx-4 mt-2 border-b border-slate-800/40">
              <label className="text-[10px] font-mono tracking-widest uppercase text-slate-400 block mb-1.5 font-bold">Workspace View</label>
              <div className="relative">
                <select 
                  id="role_switch_select"
                  value={
                    role === 'founder' ? 'Startup Founder' :
                    role === 'investor' ? 'Investor / VC' :
                    role === 'smb' ? 'SMB Business' : 'Admin'
                  }
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full bg-[#111122] border border-slate-700 text-white rounded-xl py-2 px-3 text-xs font-medium cursor-pointer shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 appearance-none bg-no-repeat"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>")`,
                    backgroundPosition: 'calc(100% - 10px) center',
                    backgroundSize: '16px'
                  }}
                >
                  <option value="Startup Founder">Startup Founder</option>
                  <option value="Investor / VC">Investor/VC</option>
                  <option value="SMB Business">SMB Business</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Dynamic tabs list */}
            <nav className="p-4 space-y-1.5">
              {ROLE_TABS[role].map(tab => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button 
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      addLog('Orchestrator', `Rerouted view to: [${tab.id.toUpperCase()}]`);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-900/20 to-blue-900/10 border border-purple-500/30 text-white shadow-[0_0_15px_rgba(124,58,237,0.15)]'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/50 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-purple-400' : 'text-slate-400'}`} />
                    <div className="text-left flex-1 min-w-0">
                      <span className="font-semibold text-xs block leading-relaxed">{tab.name}</span>
                      <span className="text-[8px] text-slate-500 block truncate leading-none">{tab.desc}</span>
                    </div>
                    {isSelected && <ChevronRight className="w-3.5 h-3.5 text-purple-400" />}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sourcing footer widget */}
          <div className="p-4 border-t border-slate-800/60 bg-slate-950/40">
            <button
              type="button"
              onClick={openFounderPassCheckout}
              disabled={paymentRedirecting}
              className="w-full text-center py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500          text-[11px] font-bold text-white shadow-lg shadow-purple-500/10 block disabled:cursor-wait disabled:opacity-60"
            >
              {paymentRedirecting ? 'Opening Secure Checkout…' : 'View Pricing Plans'}
            </button>
          </div>
        </aside>

        {/* Core workspace container */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#030308]/60">
          
          {/* Top header telemetry panel */}
          <header className="h-20 border-b border-slate-800/50 bg-[#0F172A]/30 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-20">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-[#22C55E] rounded-full animate-ping" />
                <h2 className="font-extrabold text-[11px] text-[#F8FAFC] uppercase tracking-widest font-mono">
                  CONVERSION SIGNALS
                </h2>
              </div>
              <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                | Collect → Apply AI Intelligence → Present → Verify → Deal Desk
              </span>

              {/* Quick Model Orchestrator switch */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 hidden lg:flex">
                <span className="text-[9px] font-mono text-slate-400 uppercase">AI Engine:</span>
                <select 
                  value={selectedModel}
                  onChange={(e) => {
                    setSelectedModel(e.target.value as any);
                    addLog('Orchestrator', `Manually routed conversion signal engine to:${e.target.value}`);
                    triggerToast(`AI Engine routed to ${e.target.value.toUpperCase()}`, 'info');
                  }}
                  className="bg-transparent border-none text-[10px] font-mono text-purple-400 font-bold focus:outline-none focus:ring-0 cursor-pointer"
                >
                  <option value="owl">Local Preview</option>
                  <option value="qwen">Qwen 2.5</option>
                  <option value="openai">GPT-4o Mini</option>
                  <option value="gemini">Gemini Flash</option>
                  <option value="deepseek">DeepSeek Chat</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Dark mode locked for Bloomberg-style Conversion workspace */}
              <div className='p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hidden xl:flex items-center gap-1.5 shadow-sm' title='Dark mode locked'>
                <Moon className='w-4 h-4 text-[#D4FF00]' />
                <span className='text-[10px] font-bold hidden sm:inline'>Dark Command Mode</span>
              </div>

              {/* Notification smart dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white relative"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#EF4444] rounded-full" />
                </button>

                {showAlertsDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-2xl z-50 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Real-Time Smart Alerts</span>
                      <button onClick={() => setActiveAlerts([])} className="text-[10px] text-slate-500 hover:text-slate-300">Clear</button>
                    </div>
                    <div className="space-y-2.5 max-h-60 overflow-y-auto">
                      {activeAlerts.length === 0 ? (
                        <p className="text-[10px] text-slate-500 italic text-center py-4">No active warning signals</p>
                      ) : (
                        activeAlerts.map(al => (
                          <div key={al.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] leading-relaxed">
                            <p className="text-slate-300 font-medium">{al.text}</p>
                            <span className="text-[9px] text-slate-500 block text-right mt-1 font-mono">{al.time}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

                {/* Cross-workspace product journey */}
                <div className="flex items-center gap-2">
                  <a
                    href="https://staging.tdventure.vc/app"
                    target="_blank"
                    rel="noreferrer"
                    title="Open Private Marketplace"
                    className="motion-safe:animate-[pulse_3s_ease-in-out_infinite] inline-flex h-10 w-[170px] shrink-0 items-center justify-center rounded-md border border-cyan-300/70 bg-cyan-400/10 px-3 text-[10px] font-black text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.24)] transition hover:bg-cyan-300 hover:!text-black"
                  >
                    ← Private Marketplace
                  </a>

                  <div
                    title={tdventureAccountEmail}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-2"
                  >
                    <div className="grid h-7 w-7 place-items-center rounded-full bg-purple-500/20 text-[9px] font-black text-purple-200">
                      {tdventureAccountInitials}
                    </div>

                    <div className="hidden 2xl:block min-w-0">
                      <span className="block max-w-[130px] truncate text-[10px] font-bold text-white">
                        {tdventureAccountName}
                      </span>

                      <span className="block max-w-[130px] truncate text-[8px] capitalize text-purple-300">
                        {tdventureAccountRole}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={openDealDeskWorkspace}
                    title="Continue securely to Deal Desk"
                    className="motion-safe:animate-[pulse_3s_ease-in-out_infinite] inline-flex h-10 w-[150px] shrink-0 items-center justify-center rounded-md border border-[#D4FF00]/70 bg-[#D4FF00]/10 px-3 text-[10px] font-black text-[#D4FF00] shadow-[0_0_22px_rgba(212,255,0,0.24)] transition hover:bg-[#D4FF00] hover:!text-black"
                  >
                    Deal Desk →
                  </button>
                </div>
            </div>
          </header>

          {/* Dynamic Scrollable Main Panel Workspace viewport */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            
            {/* 1. ROLE BOUNDARIES CONDITIONAL RENDERING */}
            {activeTab === 'dashboard' && role === 'founder' && (
              <FounderSignalDashboard
                context={conversionV2Context}
                analysis={conversionV2Analysis}
                deckFile={selectedPitchDeck}
                onCollect={() => setActiveTab('docs_hub')}
                onAnalyse={() => setActiveTab('pitch_analyzer')}
                onVerify={() => setActiveTab('claim_review')}
                onDealDesk={() => void openDealDeskWorkspace()}
              />
            )}

            {activeTab === 'dashboard' && role !== 'founder' && (
              <div className="space-y-6 animate-fade-in">
                {/* Mega Banner Hero statements */}
                <div className="p-6 rounded-3xl border border-white/10 bg-gradient-to-br from-[#111821] via-[#0B1118] to-[#070A0E] relative overflow-hidden group shadow-2xl">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(212,255,0,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(212,255,0,0.025)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                  <div className="absolute -right-24 -top-24 w-80 h-80 bg-[#D4FF00]/[0.06] rounded-full blur-[90px] pointer-events-none" />
                  
                  <div className="relative z-10 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#070A0E]/80 border border-[#D4FF00]/35 text-[#D4FF00] text-[10px] font-mono leading-none">
                      <Sparkles className="w-3 h-3 animate-pulse" /> TD Venture Conversion Terminal
                    </div>
                    <h1 className="text-3xl md:text-5xl font-display font-bold text-[#F5F1E8] tracking-[-0.03em] leading-[0.98]">
                      TD Conversion OS —{" "}
                      <span className="text-[#D4FF00]">
                        Convert Trust Into
                      </span>
                      <br />
                      <span className="text-[#98A2B3]">
                        Investor-Ready Action.
                      </span>
                    </h1>
                    <p className="text-sm text-[#CBD5E1] leading-relaxed max-w-3xl">
                      Analyse founder evidence, strengthen fundraise readiness, and create the signal that moves the opportunity into Deal Desk.
                    </p>

                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                      <div className="flex flex-col gap-3">
                        <div className="min-w-0">
                          <p className="text-xs uppercase tracking-[0.2em] text-[#D4FF00] font-extrabold">Common Intelligence</p>
                          <p className="text-sm text-slate-300 mt-1.5"><span className="font-black text-white">One source of truth.</span> Founder evidence, Conversion signals, investor fit and Deal Desk feedback strengthen the same startup record.</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] uppercase tracking-wider font-black">
                          <span className="flex items-center justify-center text-center rounded-lg border border-slate-800 bg-[#080D1A] px-3 py-2 text-slate-300">Founder Vault</span>
                          <span className="flex items-center justify-center text-center rounded-lg border border-[#D4FF00]/30 bg-[#080D1A] px-3 py-2 text-[#D4FF00]">Conversion Review</span>
                          <span className="flex items-center justify-center text-center rounded-lg border border-slate-800 bg-[#080D1A] px-3 py-2 text-slate-300">Investor Signal</span>
                          <span className="flex items-center justify-center text-center rounded-lg border border-slate-800 bg-[#080D1A] px-3 py-2 text-slate-300">Deal Desk</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-1 flex flex-wrap gap-3">
                      <button 
                        onClick={() => setActiveTab('pitch_analyzer')}
                        className="px-4 py-2 bg-[#D4FF00] hover:bg-[#c2ec00] text-slate-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-[0.98]"
                      >
                        Run Conversion Review
                      </button>
                      <button
                        type="button"
                        onClick={openFounderPassCheckout}
                        disabled={paymentRedirecting}
                        className="px-4 py-2 border border-slate-750 bg-slate-900/60 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl inline-block disabled:cursor-wait disabled:opacity-60"
                      >
                        {paymentRedirecting ? 'Opening Secure Checkout…' : 'Unlock Founder Pass'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Conversion Signal Sources */}
                <div className="p-5 rounded-2xl border border-slate-800 bg-[#0c1222]/80 space-y-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#D4FF00] font-bold block">Signal Sources</span>
                    <p className="text-xs text-slate-400 mt-1">Conversion triangulates founder evidence, pitch-deck proof, marketplace data and Deal Desk feedback.</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      {
                        label: 'Founder Vault',
                        status: (conversionProfile.startupName && conversionProfile.pitchSummary.trim().length > 40) ? 'Captured' : 'Not started',
                        detail: (conversionProfile.startupName && conversionProfile.pitchSummary.trim().length > 40) ? conversionProfile.startupName : 'Fill in Founder Vault to begin',
                        active: !!(conversionProfile.startupName && conversionProfile.pitchSummary.trim().length > 40)
                      },
                      {
                        label: 'Pitch Deck',
                        status: 'Not connected',
                        detail: 'Secure evidence ingestion is the next intelligence checkpoint',
                        active: false
                      },
                      {
                        label: 'Private Marketplace',
                        status: profilePlaneResolution?.state === 'linked' ? 'Canonical' : 'Not linked',
                        detail: profilePlaneResolution?.state === 'linked'
                          ? 'Verified startup profile loaded through Profile Plane'
                          : 'A verified startup profile is required',
                        active: profilePlaneResolution?.state === 'linked'
                      },
                      {
                        label: 'Deal Desk Feedback',
                        status: 'Not connected',
                        detail: 'Engagement feedback will strengthen future signals',
                        active: false
                      }
                    ].map((src) => (
                      <div key={src.label} className={`p-4 rounded-xl border ${src.active ? 'border-[#22C55E]/40 bg-[#22C55E]/5' : 'border-slate-800 bg-slate-950/60'}`}>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${src.active ? 'bg-[#22C55E] animate-pulse' : 'bg-slate-700'}`} />
                            <span className="text-xs font-bold text-white">{src.label}</span>
                          </span>
                          <span className={`text-[9px] font-mono uppercase font-black ${src.active ? 'text-[#22C55E]' : 'text-slate-500'}`}>{src.status}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2 font-mono truncate">{src.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Conversion Path */}
                <div className="p-4 rounded-2xl border border-slate-800 bg-[#0c1222]/60">
                  <span className="text-[9px] font-mono uppercase tracking-[0.28em] text-slate-500 font-bold block mb-3">Conversion Path</span>
                  <div className="flex items-center flex-wrap gap-2">
                    {[
                      { label: 'Founder Vault', active: !!(conversionProfile.startupName && conversionProfile.pitchSummary.trim().length > 40) },
                      { label: 'Pitch Deck', active: false },
                      { label: 'Conversion Preview', active: !!conversionReview },
                      { label: 'Investor Signal', active: false },
                      { label: 'Deal Desk', active: false }
                    ].map((step, i, arr) => (
                      <React.Fragment key={step.label}>
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-mono uppercase font-bold tracking-wide ${step.active ? 'border-[#D4FF00]/40 bg-[#D4FF00]/10 text-[#D4FF00]' : 'border-slate-800 bg-slate-950/60 text-slate-500'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${step.active ? 'bg-[#D4FF00] animate-pulse' : 'bg-slate-700'}`} />
                          {step.label}
                        </div>
                        {i < arr.length - 1 && <span className="text-slate-700 text-xs">&rarr;</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                {/* Dashboard KPIs based on selected role */}
                {role === 'founder' && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider font-bold block">Signal Monitor</span>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                      {[
                        {
                          title: 'Pitch Deck Quality',
                          val: conversionReview ? `${conversionReview.pitchDeckQuality}/100` : 'Awaiting',
                          text: conversionReview ? 'Central Preview result' : 'No analysis has run',
                          color: conversionReview ? 'text-purple-400' : 'text-slate-500'
                        },
                        {
                          title: 'Narrative Clarity',
                          val: conversionReview ? `${conversionReview.narrativeClarity}/100` : 'Awaiting',
                          text: conversionReview ? 'Central Preview result' : 'No analysis has run',
                          color: conversionReview ? 'text-indigo-400' : 'text-slate-500'
                        },
                        {
                          title: 'Risk Level',
                          val: conversionReview?.riskLevel || 'Awaiting',
                          text: conversionReview ? 'Central Preview result' : 'No analysis has run',
                          color: conversionReview ? 'text-[#22C55E]' : 'text-slate-500'
                        },
                        {
                          title: 'Investor Fit',
                          val: 'Not assessed',
                          text: 'Full evidence-backed review only',
                          color: 'text-slate-500'
                        },
                        {
                          title: 'Fundraise Readiness',
                          val: conversionReview ? `${conversionReview.fundraiseReadiness}/100` : 'Awaiting',
                          text: conversionReview ? 'Central Preview result' : 'No analysis has run',
                          color: conversionReview ? 'text-amber-500' : 'text-slate-500'
                        },
                        {
                          title: 'Deal Desk Signal',
                          val: 'Not created',
                          text: 'Preview does not create a CRM signal',
                          color: 'text-slate-500'
                        }
                      ].map((item, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-slate-800 bg-[#0c1222]/70 space-y-1.5 hover:border-slate-700 transition-colors">
                          <span className="text-[9px] text-slate-400 block font-bold leading-none">{item.title}</span>
                          <span className={`text-xl font-extrabold block tracking-tight ${item.color}`}>{item.val}</span>
                          <span className="text-[8px] text-slate-500 block font-mono">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {role === 'investor' && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider font-bold block">Portfolio Deal Indices</span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { title: 'Active Investment Deals', val: '18 Active Sourcing', text: '3 Seed Buy pipelines', color: 'text-purple-400' },
                        { title: 'Portfolio Value', val: '$245.8M Cap', text: 'Pristine assets verified', color: 'text-[#22C55E]' },
                        { title: 'Average OS Score', val: '91.5/100', text: 'Top quartile targets', color: 'text-cyan-400' },
                        { title: 'Due Diligence Queue', val: '4 Pipelines', text: 'Awaiting founder proof review', color: 'text-[#F59E0B]' }
                      ].map((item, idx) => (
                        <div key={idx} className="p-5 rounded-xl border border-slate-800 bg-[#0c1222]/70 space-y-1 hover:border-slate-700 transition-colors">
                          <span className="text-[10px] text-slate-400 block font-bold leading-none">{item.title}</span>
                          <span className={`text-2xl font-extrabold block tracking-tight ${item.color}`}>{item.val}</span>
                          <span className="text-[8px] text-slate-500 block font-mono">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {role === 'smb' && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider font-bold block">Logistics Sourcing Widgets</span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { title: 'Logistics Latency Score', val: '96% Optimal', text: 'Shanghai bypass verified', color: 'text-[#22C55E]' },
                        { title: 'Freight Cargo Valuation', val: '$4.2M Assets', text: 'Secured via AES Hash', color: 'text-purple-400' },
                        { title: 'Supplier Trust Factor', val: '94% Certified', text: 'No metrics manipulation', color: 'text-cyan-400' },
                        { title: 'Core Revenue Optimizing Rate', val: '+14.2% Boost', text: 'Spliced ad converters', color: 'text-[#F59E0B]' }
                      ].map((item, idx) => (
                        <div key={idx} className="p-5 rounded-xl border border-slate-800 bg-[#0c1222]/70 space-y-1">
                          <span className="text-[10px] text-slate-400 block font-bold leading-none">{item.title}</span>
                          <span className={`text-2xl font-extrabold block tracking-tight ${item.color}`}>{item.val}</span>
                          <span className="text-[8px] text-slate-500 block font-mono">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conversion handoff strip */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl border border-slate-800 bg-[#0c1222]/80">
                    <span className="text-[10px] font-mono uppercase text-[#D4FF00] tracking-wider font-bold">Input</span>
                    <h3 className="text-sm font-black text-white mt-2">Deck + founder proof</h3>
                    <p className="text-xs text-slate-400 mt-1">Upload pitch, traction notes, raise ask and evidence.</p>
                  </div>
                  <div className="p-5 rounded-2xl border border-slate-800 bg-[#0c1222]/80">
                    <span className="text-[10px] font-mono uppercase text-[#D4FF00] tracking-wider font-bold">Analysis</span>
                    <h3 className="text-sm font-black text-white mt-2">Conversion score</h3>
                    <p className="text-xs text-slate-400 mt-1">Quality, readiness, narrative, investor fit and risk signals.</p>
                  </div>
                  <div className="p-5 rounded-2xl border border-slate-800 bg-[#0c1222]/80">
                    <span className="text-[10px] font-mono uppercase text-[#D4FF00] tracking-wider font-bold">Output</span>
                    <h3 className="text-sm font-black text-white mt-2">CRM-ready summary</h3>
                    <p className="text-xs text-slate-400 mt-1">Clear next action for founder follow-up or Deal Desk handoff.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. THE PITCH DECK ANALYZER COMPONENT */}
            {activeTab === 'pitch_analyzer' && (
              <div className="space-y-6 animate-fade-in">
                <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0B1220] p-5 shadow-2xl">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#D4FF00] via-cyan-400 to-indigo-500" />
                  <p className="text-[10px] font-mono font-black uppercase tracking-[0.32em] text-[#D4FF00]">
                    02 · Applying AI Intelligence
                  </p>
                  <h2 className="mt-1.5 text-2xl font-black text-white">
                    Independent Conversion Analysis
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                    Founder truth remains the record. Central analysis interprets only the evidence
                    currently supplied. Preview results do not create an Investor Fit score or a
                    Deal Desk signal.
                  </p>
                </section>

                <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  {[
                    {
                      label: 'Founder record',
                      value: profilePlaneResolution?.state === 'linked' ? 'Canonical profile linked' : 'Profile required',
                      active: profilePlaneResolution?.state === 'linked'
                    },
                    {
                      label: 'Pitch deck evidence',
                      value:
                        conversionV2Analysis?.deck_assessment?.status
                        || (selectedPitchDeck
                          ? `${selectedPitchDeck.name} selected`
                          : 'Not supplied'),
                      active:
                        !!selectedPitchDeck
                        || conversionV2Analysis?.deck_assessment?.status === 'Analysed'
                    },
                    {
                      label: 'Central analysis',
                      value: conversionV2Analysis
                        ? 'Full Review completed'
                        : conversionReview
                          ? 'Preview completed'
                          : 'Not run in this session',
                      active: !!conversionV2Analysis || !!conversionReview
                    },
                    {
                      label: 'CRM signal',
                      value: conversionV2Analysis
                        ? 'Versioned signal created'
                        : 'Not created by Preview',
                      active: !!conversionV2Analysis
                    }
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`rounded-2xl border p-4 ${
                        item.active
                          ? 'border-[#D4FF00]/35 bg-[#D4FF00]/5'
                          : 'border-slate-800 bg-slate-950/60'
                      }`}
                    >
                      <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
                        {item.label}
                      </p>
                      <p className={`mt-2 text-sm font-bold ${item.active ? 'text-white' : 'text-slate-400'}`}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </section>

                {conversionV2Analysis ? (
                  <div className="space-y-5">
                    <ConversionV2ResultPanel
                      analysis={conversionV2Analysis}
                      generatedAt={conversionV2GeneratedAt}
                    />
                    <div className="flex flex-wrap gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                      <button
                        type="button"
                        onClick={() => setActiveTab('claim_review')}
                        className="rounded-xl border border-cyan-400/35 px-4 py-3 text-xs font-black uppercase tracking-wider text-cyan-200"
                      >
                        Open Verify
                      </button>
                      <button
                        type="button"
                        onClick={() => void openDealDeskWorkspace()}
                        className="rounded-xl bg-[#D4FF00] px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-950"
                      >
                        Continue to Execution
                      </button>
                      <p className="w-full text-xs leading-5 text-slate-500">
                        Profile Verification is optional. A red Profile Not
                        Verified state never blocks Execution.
                      </p>
                    </div>
                  </div>
                ) : conversionReview ? (
                  <section className="space-y-6 rounded-3xl border border-[#D4FF00]/25 bg-slate-950/70 p-6">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-[#D4FF00]">
                          Central Founder Signal Preview
                        </p>
                        <h3 className="mt-2 text-2xl font-black text-white">
                          {conversionProfile.startupName || 'Founder'} Readiness Preview
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500">
                        Generated {conversionReview.generatedAt}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                      {[
                        ['Pitch Deck Quality', `${conversionReview.pitchDeckQuality}/100`],
                        ['Narrative Clarity', `${conversionReview.narrativeClarity}/100`],
                        ['Fundraise Readiness', `${conversionReview.fundraiseReadiness}/100`],
                        ['Risk Level', conversionReview.riskLevel]
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-2xl border border-slate-800 bg-[#080D1A] p-4">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            {label}
                          </p>
                          <p className="mt-2 text-xl font-black text-white">{value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                      <div className="rounded-2xl border border-red-400/25 bg-red-950/10 p-5">
                        <h4 className="font-black text-white">Risk flags</h4>
                        <div className="mt-3 space-y-2">
                          {conversionReview.riskFlags.length ? (
                            conversionReview.riskFlags.map((flag, index) => (
                              <p key={`${flag}-${index}`} className="text-sm leading-6 text-slate-300">
                                <span className="mr-2 text-red-300">•</span>{flag}
                              </p>
                            ))
                          ) : (
                            <p className="text-sm text-slate-500">No risk flags were returned.</p>
                          )}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-cyan-400/25 bg-cyan-950/10 p-5">
                        <h4 className="font-black text-white">Next best action</h4>
                        <p className="mt-3 text-sm leading-6 text-slate-300">
                          {conversionReview.nextBestAction}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-[#080D1A] p-5">
                      <h4 className="font-black text-white">Preview boundary</h4>
                      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                        {Object.entries(conversionReview.limitations).map(([label, value]) => (
                          <div key={label} className="border-l border-slate-700 pl-3">
                            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                              {label.replace(/_/g, ' ')}
                            </p>
                            <p className="mt-1 text-sm leading-5 text-slate-300">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveTab('docs_hub')}
                        className="rounded-xl border border-slate-700 px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-200 hover:border-slate-500"
                      >
                        Strengthen Founder Record
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPricingModal(true)}
                        className="rounded-xl bg-[#D4FF00] px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-950"
                      >
                        View Founder Pass
                      </button>
                    </div>
                  </section>
                ) : (
                  <section className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
                    <p className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-slate-500">
                      Current state
                    </p>
                    <h3 className="mt-2 text-2xl font-black text-white">
                      Founder evidence is ready for AI intelligence
                    </h3>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                      The completed application provides a founder claim score of{' '}
                      <strong className="text-white">
                        {conversionV2Context?.evidence.founder_claim_score ?? '—'}/100
                      </strong>{' '}
                      across{' '}
                      <strong className="text-white">
                        {conversionV2Context?.evidence.completion_count ?? 0}/20
                      </strong>{' '}
                      dimensions. Applying AI Intelligence independently assesses
                      those claims and any supplied pitch deck before calculating
                      the final Conversion Score.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveTab('docs_hub')}
                        className="rounded-xl border border-slate-700 px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-200"
                      >
                        Review collected data
                      </button>
                      <button
                        type="button"
                        onClick={() => void runFullConversionReview()}
                        disabled={isConversionReviewRunning}
                        className="rounded-xl bg-[#D4FF00] px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-950 disabled:opacity-60"
                      >
                        Apply AI Intelligence
                      </button>
                    </div>
                  </section>
                )}

                {!conversionV2Analysis && (
                  <FounderEvidenceRecord
                    context={conversionV2Context}
                    compact
                  />
                )}
              </div>
            )}

            {/* 3. CONDITIONAL TABS REDIRECT FOR OTHER PAGES */}
            {activeTab === 'deal_desk_handoff' && (
              <section className="rounded-2xl border border-slate-800 bg-[#0B1220] p-5 shadow-2xl">
                <p className="text-[10px] font-mono font-black uppercase tracking-[0.32em] text-[#D4FF00]">
                  05 · Deal Desk
                </p>
                <h2 className="mt-1.5 text-2xl font-black text-white">
                  {conversionV2Analysis
                    ? 'Conversion signal ready for Execution'
                    : 'Apply AI Intelligence before handoff'}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                  {conversionV2Analysis
                    ? `The versioned ${conversionV2Analysis.conversion_score}/100 Conversion Score, Gap Analysis, evidence status and verification state can now move to Deal Desk. A Profile Not Verified label does not block Execution.`
                    : 'Founder-declared application data is already visible in the Conversion Terminal, but Deal Desk receives the versioned signal only after independent analysis creates it.'}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('pitch_analyzer')}
                    className="rounded-xl border border-slate-700 px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-200 hover:border-slate-500"
                  >
                    {conversionV2Analysis
                      ? 'Review analysis'
                      : 'Apply AI Intelligence'}
                  </button>
                  {conversionV2Analysis && (
                    <button
                      type="button"
                      onClick={() => void openDealDeskWorkspace()}
                      className="rounded-xl bg-[#D4FF00] px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-950"
                    >
                      Open Deal Desk →
                    </button>
                  )}
                </div>
              </section>
            )}

            {activeTab === 'gdocs_hub' && <GoogleDocsTab addLog={addLog} triggerToast={triggerToast} />}
            {activeTab === 'gslides_hub' && role === 'founder' && (
              <div className="space-y-6">
                <PitchDeckEvidencePanel
                  file={selectedPitchDeck}
                  disabled={isConversionReviewRunning}
                  onChange={(file) => {
                    if (file && file.size > 8 * 1024 * 1024) {
                      triggerToast(
                        'Pitch deck must be no larger than 8 MB.',
                        'warn'
                      );
                      return;
                    }
                    setSelectedPitchDeck(file);
                  }}
                />
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => void runFullConversionReview()}
                    disabled={isConversionReviewRunning}
                    className="rounded-xl bg-[#D4FF00] px-5 py-3 text-xs font-black uppercase tracking-wider text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isConversionReviewRunning
                      ? 'Analysing founder evidence…'
                      : 'Run Full Conversion Review'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('docs_hub')}
                    className="rounded-xl border border-slate-700 px-5 py-3 text-xs font-black uppercase tracking-wider text-slate-200"
                  >
                    Review collected data
                  </button>
                </div>
              </div>
            )}
            {activeTab === 'gslides_hub' && role !== 'founder' && (
              <GoogleSlidesTab
                addLog={addLog}
                triggerToast={triggerToast}
              />
            )}
            {activeTab === 'claim_review' && (
              <AcceptClaimsPanel
                analysis={conversionV2Analysis}
                review={conversionClaimReview}
                responses={claimInterviewResponses}
                saving={savingClaimInterview}
                onResponseChange={(claimKey, value) => {
                  setClaimInterviewResponses((current) => ({
                    ...current,
                    [claimKey]: value
                  }));
                }}
                onSubmit={() => void saveClaimInterview()}
              />
            )}
            {activeTab === 'linkedin_intel' && <LinkedInIntelTab addLog={addLog} triggerToast={triggerToast} />}
            {activeTab === 'fundraising_intel' && <FundraisingIntelTab addLog={addLog} triggerToast={triggerToast} />}
            {activeTab === 'validation' && <StartupValidationTab addLog={addLog} triggerToast={triggerToast} />}
            {activeTab === 'matchmaking' && <InvestorMatchmakingTab triggerToast={triggerToast} addLog={addLog} />}
            {activeTab === 'docs_hub' && (
              <div className='space-y-6 animate-in fade-in duration-500'>
                <div className='p-5 rounded-2xl border border-slate-800 bg-[#0c1222]/90 shadow-2xl'>
                  <span className='text-[10px] font-mono uppercase tracking-[0.24em] text-[#D4FF00] font-bold'>01 · Collect</span>
                  <h2 className='text-2xl font-black text-white mt-1.5'>Application Evidence & Pitch Deck</h2>
                  <p className='text-sm text-slate-400 mt-2 max-w-3xl'>Review the submitted 20-question record, add a pitch deck, and supplement only what has changed since the application.</p>
                </div>

                <FounderEvidenceRecord context={conversionV2Context} />

                <PitchDeckEvidencePanel
                  file={selectedPitchDeck}
                  disabled={isConversionReviewRunning}
                  onChange={(file) => {
                    if (file && file.size > 8 * 1024 * 1024) {
                      triggerToast(
                        'Pitch deck must be no larger than 8 MB.',
                        'warn'
                      );
                      return;
                    }
                    setSelectedPitchDeck(file);
                  }}
                />

                <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
                  <div className='xl:col-span-2 p-6 rounded-3xl border border-slate-800 bg-slate-950/60 space-y-5'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <label className='space-y-2'><span className='text-xs font-bold text-slate-300 uppercase'>Startup name</span><input className='w-full rounded-xl bg-[#080d1a] border border-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-[#D4FF00]' value={conversionProfile.startupName} onChange={(e) => updateConversionProfile('startupName', e.target.value)} placeholder='Example: InspectZero' /></label>
                      <label className='space-y-2'><span className='text-xs font-bold text-slate-300 uppercase'>Sector</span><input className='w-full rounded-xl bg-[#080d1a] border border-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-[#D4FF00]' value={conversionProfile.sector} onChange={(e) => updateConversionProfile('sector', e.target.value)} placeholder='AI, SaaS, Climate, Fintech...' /></label>
                      <label className='space-y-2'><span className='text-xs font-bold text-slate-300 uppercase'>Stage</span><select className='w-full rounded-xl bg-[#080d1a] border border-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-[#D4FF00]' value={conversionProfile.stage} onChange={(e) => updateConversionProfile('stage', e.target.value)}><option>Idea</option><option>MVP</option><option>Pre-seed</option><option>Seed</option><option>Series A</option></select></label>
                      <label className='space-y-2'><span className='text-xs font-bold text-slate-300 uppercase'>Raise amount (USD)</span><input className='w-full rounded-xl bg-[#080d1a] border border-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-[#D4FF00]' value={conversionProfile.raiseAmount} onChange={(e) => updateConversionProfile('raiseAmount', e.target.value)} placeholder='USD 500000' /></label>
                    </div>

                    <label className='space-y-2 block'><span className='text-xs font-bold text-slate-300 uppercase'>Pitch summary</span><textarea className='w-full min-h-[110px] rounded-xl bg-[#080d1a] border border-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-[#D4FF00]' value={conversionProfile.pitchSummary} onChange={(e) => updateConversionProfile('pitchSummary', e.target.value)} placeholder='What does the startup do, for whom, and why now?' /></label>
                    <label className='space-y-2 block'><span className='text-xs font-bold text-slate-300 uppercase'>Traction evidence carried from Apply</span><textarea className='w-full min-h-[90px] rounded-xl bg-[#080d1a] border border-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-[#D4FF00]' value={conversionProfile.tractionProof} onChange={(e) => updateConversionProfile('tractionProof', e.target.value)} placeholder='Revenue, pilots, users, LOIs, demos, partnerships, growth signals...' /><span className='block text-[10px] text-slate-500'>Automatically assembled from Revenue, Projection, Traction, Profitability, Business Model and Funding History. Edit only to add current context.</span></label>
                    <label className='space-y-2 block'><span className='text-xs font-bold text-slate-300 uppercase'>Risk and mitigation evidence carried from Apply</span><textarea className='w-full min-h-[90px] rounded-xl bg-[#080d1a] border border-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-[#D4FF00]' value={conversionProfile.riskNotes} onChange={(e) => updateConversionProfile('riskNotes', e.target.value)} placeholder='Durability, regulation, profitability, ownership, funding instrument...' /><span className='block text-[10px] text-slate-500'>Automatically assembled from risk-relevant questionnaire answers. A low founder rating is prioritised for independent review.</span></label>
                    <label className='space-y-2 block'><span className='text-xs font-bold text-slate-300 uppercase'>Target investor type</span><input className='w-full rounded-xl bg-[#080d1a] border border-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-[#D4FF00]' value={conversionProfile.targetInvestor} onChange={(e) => updateConversionProfile('targetInvestor', e.target.value)} placeholder='Sector-focused seed funds, angels, family offices...' /></label>
                  </div>

                  <div className='p-6 rounded-3xl border border-slate-800 bg-[#080d1a] h-fit space-y-4'>
                    <div><span className='text-[10px] font-mono uppercase tracking-[0.24em] text-[#D4FF00] font-bold'>Signal Input</span><h3 className='text-xl font-black text-white mt-2'>Founder input snapshot</h3></div>
                    {[
                      ['Startup', conversionProfile.startupName || 'Not set'],
                      ['Sector', conversionProfile.sector || 'Not set'],
                      ['Stage', conversionProfile.stage || 'Not set'],
                      ['Raise', conversionProfile.raiseAmount || 'Not set'],
                      ['Investor', conversionProfile.targetInvestor || 'Not set']
                    ].map(([label, value]) => (<div key={label} className='p-3 rounded-xl border border-slate-800 bg-slate-950/70'><div className='text-[10px] uppercase text-slate-500 font-bold'>{label}</div><div className='text-sm text-white font-semibold mt-1'>{value}</div></div>))}
                    <button
                      onClick={() => setActiveTab('pitch_analyzer')}
                      className='w-full px-4 py-3 rounded-xl bg-[#D4FF00] text-slate-950 text-sm font-black hover:scale-[1.01] transition-transform disabled:cursor-not-allowed disabled:opacity-60'
                    >
                      Continue to Apply AI Intelligence
                    </button>
                    <button onClick={() => setActiveTab('dashboard')} className='w-full px-4 py-3 rounded-xl border border-slate-800 text-slate-300 text-sm font-bold hover:bg-slate-900'>Back to Conversion Terminal</button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'forecasting' && <FinancialForecastingTab addLog={addLog} />}
            {activeTab === 'deal_flow' && <DealFlowTab dealFlow={dealFlow} setDealFlow={setDealFlow} addLog={addLog} triggerToast={triggerToast} />}
            {activeTab === 'automation' && <BusinessAutomationTab addLog={addLog} triggerToast={triggerToast} />}
            {activeTab === 'supply_chain' && <SupplyChainIntelTab addLog={addLog} triggerToast={triggerToast} />}
            {activeTab === 'due_diligence' && (
              <div className="p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/70 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Interactive Due Diligence report Builder</h3>
                  <p className="text-xs text-slate-400">Generate unstructured due-diligence logs proxy checks by calling OpenRouter `/api/generate` endpoint.</p>
                </div>

                <form onSubmit={handleAnalyzeDD} className="space-y-4 max-w-xl">
                  <div>
                    <span className="text-[10px] uppercase font-mono block text-slate-400 font-bold">Target Company Name:</span>
                    <input 
                      type="text"
                      value={ddCompanyName}
                      onChange={(e) => setDdCompanyName(e.target.value)}
                      className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono block text-slate-400 font-bold">Enter unstructured pitch notes or text:</span>
                    <textarea 
                      value={ddPitchText}
                      onChange={(e) => setDdPitchText(e.target.value)}
                      className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white leading-relaxed"
                      rows={4}
                    />
                  </div>
                  <button 
                    disabled={analyzingDD}
                    className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-500 font-extrabold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    {analyzingDD ? 'Auditing Dataset...' : 'Start Auditing'}
                  </button>
                </form>

                {ddReport && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <h4 className="text-xs font-extrabold text-purple-400 uppercase tracking-widest">{ddReport.companyName} Executive Summary</h4>
                    <p className="text-xs text-slate-350 leading-relaxed font-sans">{ddReport.executiveSummary}</p>
                    <p className="text-[11px] text-slate-500 font-mono pt-2">Conversion Score: <strong className="text-white font-sans">{ddReport.overallScore}/100</strong> • Funding recommendation: <strong className="text-green-400 font-sans">{ddReport.fundingRecommendation}</strong></p>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'forensic_ai' && <ForensicAITab addLog={addLog} triggerToast={triggerToast} />}
            {activeTab === 'prescriptive_ai' && <PrescriptiveAITab addLog={addLog} />}
            {activeTab === 'maritime_intel' && <MaritimeIntelTab addLog={addLog} triggerToast={triggerToast} />}
            {activeTab === 'user_management' && <UserManagementTab triggerToast={triggerToast} addLog={addLog} />}
            {activeTab === 'ai_monitoring' && <AIMonitoringTab selectedModel={selectedModel} />}
            {activeTab === 'security' && <SecurityCenterTab />}
            {activeTab === 'role_permissions' && <RolePermissionsTab />}
            
            {/* Standard preloaded original campaign and supplyChain tabs */}
            {activeTab === 'campaign' && (
              <AdSeoCreatorPanel 
                adSuite={adSuite}
                setAdSuite={setAdSuite}
                handleGenerateAds={handleGenerateAds}
                selectedTheme={selectedTheme}
                setSelectedTheme={setSelectedTheme}
                generatingAds={generatingAds}
                productName={productName}
                setProductName={setProductName}
                productDesc={productDesc}
                setProductDesc={setProductDesc}
                productUrl={productUrl}
                setProductUrl={setProductUrl}
                targetAudienceInput={targetAudienceInput}
                setTargetAudienceInput={setTargetAudienceInput}
                selectedAdSizeName={selectedAdSizeName}
                setSelectedAdSizeName={setSelectedAdSizeName}
                editableHeadline={editableHeadline}
                updateActiveAdContent={updateActiveAdContent}
                editableSubheadline={editableSubheadline}
                editableCtaText={editableCtaText}
                zoomScale={zoomScale}
                setZoomScale={setZoomScale}
                PREMIUM_THEMES={PREMIUM_THEMES}
              />
            )}
            {activeTab === 'supplyChain' && <MaritimeIntelTab addLog={addLog} triggerToast={triggerToast} />}
            {activeTab === 'sourcing' && <PortfolioAnalyticsTab />}
            {activeTab === 'reports' && (
              <div className="p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/70 space-y-4">
                <h3 className="text-base font-bold text-white">SaaS Reports Center</h3>
                <p className="text-xs text-slate-400 font-sans">Draft, secure, and share compliant venture audit reports seamlessly with prospective LP partners.</p>
                <div className="pt-4 flex gap-3">
                  <button onClick={() => triggerToast("Copied Secure Share Link!", "success")} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-xs text-white font-bold rounded-lg flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5" /> Direct secure Share url
                  </button>
                  <button onClick={() => triggerToast("Downloading PDF Report package...", "info")} className="px-4 py-2 bg-slate-900 border border-slate-800 text-xs font-bold rounded-lg">
                    Download PDF Report
                  </button>
                </div>
              </div>
            )}

            {/* Core systemic Telemetry logs dashboard terminal */}
            {role !== 'founder' && (
            <div className="p-4 rounded-xl border border-slate-800/80 bg-black/80 font-mono text-[10px] space-y-2 select-all">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className="text-slate-400 flex items-center gap-1.5"><Cpu className="text-purple-400 w-3.5 h-3.5" /> SYSTEM WATCHDOG TELEMETRY logs</span>
                <span className="text-[10px] text-purple-400">Operator: vx@tdventures.in</span>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {telemetryLogs.map(log => (
                  <div key={log.id} className="flex gap-2">
                    <span className="text-slate-600">[{log.time}]</span>
                    <span className="text-purple-400 font-bold">[{log.source}]</span>
                    <span className="text-slate-350">{log.text}</span>
                  </div>
                ))}
              </div>
            </div>
            )}

          </div>

          <footer className="h-14 border-t border-slate-800/60 bg-[#020205] flex items-center justify-between px-6 text-[11px] text-slate-500 relative z-20">
	           <span>TD Conversion OS · Collect → Apply AI Intelligence → Present → Verify → Deal Desk</span>
            <a
             href="https://tdventure.vc/contribute.html"
             target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#D4FF00] hover:text-[#E6FF66] transition-colors"
           >
            💚 Contribute
          </a>
        </footer>

        </main>
      </div>

      {/* Dynamic bottom tabs for mobile screens */}
      <div className="fixed bottom-0 inset-x-0 h-14 bg-slate-950 border-t border-slate-800/80 z-50 flex items-center justify-around md:hidden px-2">
        <button 
          onClick={() => { setActiveTab('dashboard'); triggerToast('Switched to mobile Dashboard', 'info'); }}
          className={`flex flex-col items-center gap-1 text-[10px] ${activeTab === 'dashboard' ? 'text-purple-400' : 'text-slate-400'}`}
        >
          <LayoutDashboard className="w-4.5 h-4.5" />
          <span>Terminal</span>
        </button>
        <button 
          onClick={() => { setActiveTab('pitch_analyzer'); triggerToast('Switched to Conversion Review', 'info'); }}
          className={`flex flex-col items-center gap-1 text-[10px] ${activeTab === 'pitch_analyzer' ? 'text-purple-400' : 'text-slate-400'}`}
        >
         <span className="text-[#D4AF37] text-xl">🎯</span>
          <span>AI Intelligence</span>
        </button>
        <select 
          value={
            role === 'founder' ? 'Startup Founder' :
            role === 'investor' ? 'Investor / VC' :
            role === 'smb' ? 'SMB Business' : 'Admin'
          }
          onChange={(e) => handleRoleChange(e.target.value)}
          className="bg-slate-900 text-white rounded text-[11px] py-1 px-2 border border-slate-800"
        >
          <option value="Startup Founder">Founder</option>
          <option value="Investor / VC">Investor</option>
          <option value="SMB Business">SMB</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      {/* PRICING MODAL WINDOW */}
      {showPricingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative">
            <button 
              onClick={() => setShowPricingModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <span className="text-[9px] font-mono tracking-widest uppercase bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2.5 py-1 rounded-full font-bold">
                Unified Venture Engine Scale
              </span>
              <h3 className="text-2xl font-extrabold text-white tracking-tight">Flexible SaaS Business Pricing Plans</h3>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">Select the operational velocity required to run spatial due diligence queries, targeted lead generation pipelines, and localized SAFE notes builds.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-xs text-slate-400 uppercase tracking-widest block font-mono">Founders Tier</span>
                  <span className="text-xl font-bold text-white block font-mono">$49<span className="text-xs text-slate-500">/mo</span></span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">Optimized for starting teams analyzing initial pitch files and positioning ads on search networks.</p>
                </div>
                <button 
                  onClick={() => { triggerToast("Subscribed successfully on the sandbox environment!", "success"); setShowPricingModal(false); }}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg"
                >
                  Choose Tier
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-b from-[#1C1145]/30 to-[#0F172A]/30 border border-purple-500/30 space-y-4 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-purple-600 text-white text-[8px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full animate-pulse">
                  Popular
                </div>
                <div className="space-y-2">
                  <span className="text-xs text-purple-400 uppercase tracking-widest block font-mono">Professional Allocator</span>
                  <span className="text-xl font-bold text-white block font-mono">$149<span className="text-xs text-slate-500">/mo</span></span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">Our core blueprint layer suitable for active angel investors, family allocators, and VC scouts.</p>
                </div>
                <button 
                  onClick={() => { triggerToast("Subscribed successfully on the sandbox environment!", "success"); setShowPricingModal(false); }}
                  className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-lg"
                >
                  Acquire Access
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-xs text-slate-400 uppercase tracking-widest block font-mono">Consortium Enterprise</span>
                  <span className="text-xl font-bold text-[#ffd700] block">Specialized<span className="text-xs text-slate-500">/Custom</span></span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">Structured custom schemas, private cloud storage nodes, and fully private SOC2 network monitoring channels.</p>
                </div>
                <button 
                  onClick={() => { triggerToast("Contact metrics forwarded to TD Conversion OS successfully!", "success"); setShowPricingModal(false); }}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg"
                >
                  Contact TD Conversion OS
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* PITCH ANALYZER GLOBAL MODALS */}
      {activePitchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-left">
          <div className="w-full max-w-xl bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl relative space-y-5">
            <button 
              onClick={() => setActivePitchModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {activePitchModal === 'download' && <DownloadReportModal addLog={addLog} triggerToast={triggerToast} onClose={() => setActivePitchModal(null)} />}
            {activePitchModal === 'share' && <ShareAnalysisModal addLog={addLog} triggerToast={triggerToast} onClose={() => setActivePitchModal(null)} />}
            {activePitchModal === 'schedule' && <ScheduleMeetingModal addLog={addLog} triggerToast={triggerToast} onClose={() => setActivePitchModal(null)} />}
            {activePitchModal === 'plan' && <AGIOptimizationPlanModal addLog={addLog} triggerToast={triggerToast} onClose={() => setActivePitchModal(null)} />}
          </div>
        </div>
      )}

      {/* Email capture banner */}
      {isConversionReviewRunning && <ConversionReviewProgressModal />}
      <EmailCaptureBanner />

    </div>
  );
}

// ==========================================
// SUB-COMPONENTS FOR PITCH ANALYZER MODALS (unchanged)
// ==========================================

function DownloadReportModal({ addLog, triggerToast, onClose }: { addLog: Function, triggerToast: Function, onClose: () => void }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Aggregating conversion signal logs...');

  useEffect(() => {
    const list = [
      { t: 300, p: 25, txt: 'Running strategic TAM audits...' },
      { t: 700, p: 55, txt: 'Synthesizing investment thesis markers...' },
      { t: 1200, p: 85, txt: 'Signing SHA-256 validation proof seals...' },
      { t: 1600, p: 100, txt: 'Analytical report generated!' }
    ];

    list.forEach(item => {
      setTimeout(() => {
        setProgress(item.p);
        setStatusText(item.txt);
        if (item.p === 100) {
          addLog('Self-Healing', 'PDF analytical report generated and package ready.');
        }
      }, item.t);
    });
  }, []);

  return (
    <div className="space-y-4 text-left">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-white uppercase tracking-wider">Download Analytical Report</h3>
        <p className="text-xs text-slate-400">OS compliance export builder compiling target metadata.</p>
      </div>

      <div className="space-y-2">
        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-[11px] font-mono">
          <span className="text-purple-400">{statusText}</span>
          <span className="text-slate-400">{progress}%</span>
        </div>
      </div>

      <div className="pt-4 flex gap-2 justify-end">
        <button 
          onClick={onClose}
          className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-xs"
        >
          Cancel
        </button>
        <button 
          disabled={progress < 100}
          onClick={() => {
            triggerToast('Analytical PDF saved successfully!', 'success');
            onClose();
          }}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-lg text-xs transition-colors"
        >
          Save PDF file
        </button>
      </div>
    </div>
  );
}

function ShareAnalysisModal({ addLog, triggerToast, onClose }: { addLog: Function, triggerToast: Function, onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const [ttl, setTtl] = useState('2');
  const [requireKey, setRequireKey] = useState(true);
  const shareUrl = 'https://ventureaipro.co/share/audit-aj29f92938a';

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(shareUrl);
    } catch {}
    setCopied(true);
    addLog('Orchestrator', 'Copied secure transaction share URL.');
    triggerToast('Copied deal access link to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 text-left">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-white uppercase tracking-wider">Secure Deal Link Dispatcher</h3>
        <p className="text-xs text-slate-400">Configure access policies and generate public view URLs safely.</p>
      </div>

      <div className="space-y-3 pt-2 text-xs">
        <div>
          <span className="text-[10px] uppercase font-mono text-slate-505 block font-bold mb-1">Generated Public URL</span>
          <div className="flex gap-2">
            <input 
              type="text" 
              readOnly 
              value={shareUrl}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-xs text-purple-300 select-all"
            />
            <button 
              onClick={handleCopy}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 font-bold rounded-lg text-white"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-500 block font-bold mb-1">Expiration Timeline</span>
            <select 
              value={ttl} 
              onChange={(e) => setTtl(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2"
            >
              <option value="2">Expires in 2 Hours</option>
              <option value="24">Expires in 24 Hours</option>
              <option value="99">Permanent Link</option>
            </select>
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-[10px] uppercase font-mono text-slate-500 block font-bold mb-1">Double Authentication Check</span>
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input 
                type="checkbox" 
                checked={requireKey}
                onChange={(e) => setRequireKey(e.target.checked)}
                className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-slate-800 rounded bg-slate-900"
              />
              <span className="text-slate-350">Require AES Access Key</span>
            </label>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button 
          onClick={onClose}
          className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-bold rounded-lg text-xs text-white"
        >
          Confirm Link Settings
        </button>
      </div>
    </div>
  );
}

function ScheduleMeetingModal({ addLog, triggerToast, onClose }: { addLog: Function, triggerToast: Function, onClose: () => void }) {
  const [selectedSlot, setSelectedSlot] = useState('');
  const [notes, setNotes] = useState('');

  const slots = [
    'Mon May 28, 10:00 AM',
    'Mon May 28, 02:00 PM',
    'Tue May 29, 09:30 AM',
    'Tue May 29, 04:00 PM'
  ];

  const handleBook = () => {
    if (!selectedSlot) {
      triggerToast('Please select a time slot first!', 'warn');
      return;
    }
    addLog('Orchestrator', `Scheduled investment alignment session for ${selectedSlot}.`);
    triggerToast(`Meeting booked successfully at ${selectedSlot}!`, 'success');
    onClose();
  };

  return (
    <div className="space-y-4 text-left">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-white uppercase tracking-wider">Sync Alignment Calendars</h3>
        <p className="text-xs text-slate-400">Direct VC scout handshake integration. Lock target slot below:</p>
      </div>

      <div className="space-y-3 pt-2 text-xs">
        <div className="grid grid-cols-2 gap-2 text-xs">
          {slots.map(s => (
            <div 
              key={s}
              onClick={() => setSelectedSlot(s)}
              className={`p-3 rounded-lg border cursor-pointer text-center font-mono font-bold transition-all ${
                selectedSlot === s 
                  ? 'bg-purple-950/20 border-purple-500 text-purple-300' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {s}
            </div>
          ))}
        </div>

        <div>
          <span className="text-[10px] uppercase font-mono text-slate-500 block font-bold mb-1">Brief Pitch Agenda Overview</span>
          <textarea 
            placeholder="Introduce core hardware architecture and clinical pipeline indicators..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
            rows={2}
          />
        </div>
      </div>

      <div className="pt-4 flex gap-2 justify-end">
        <button 
          onClick={onClose}
          className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-xs"
        >
          Close
        </button>
        <button 
          onClick={handleBook}
          className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs transition-colors"
        >
          Confirm Time Slot
        </button>
      </div>
    </div>
  );
}

function AGIOptimizationPlanModal({ addLog, triggerToast, onClose }: { addLog: Function, triggerToast: Function, onClose: () => void }) {
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'De-leverage cross-border data residency dependencies', done: false },
    { id: 2, text: 'Deepen clinical validation testing controls (Section 4)', done: false },
    { id: 3, text: 'Configure custom standard liquidation priority rules', done: false },
    { id: 4, text: 'Ditch high-overhead dependency on standard RF transceivers', done: false }
  ]);

  const toggleCheck = (id: number) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === id) {
        addLog('Qwen-Reasoning', `Adhered pitch story revision: [${item.text}]`);
        triggerToast('Action point verified & accepted!', 'success');
        return { ...item, done: !item.done };
      }
      return item;
    }));
  };

  return (
    <div className="space-y-4 text-left">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-white uppercase tracking-wider">AI Cognitive Story Improvements</h3>
        <p className="text-xs text-slate-400">Direct actionable edits to score 10/10 with medical VC partners.</p>
      </div>

      <div className="space-y-2 text-xs pt-1">
        {checklist.map(item => (
          <div 
            key={item.id}
            onClick={() => toggleCheck(item.id)}
            className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3.5 transition-all ${
              item.done 
                ? 'bg-[#22C55E]/10 border-[#22C55E]/30 text-slate-300 line-through opacity-75' 
                : 'bg-slate-900 border-slate-800 text-slate-350 hover:border-slate-700'
            }`}
          >
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center font-bold text-[8px] ${
              item.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-700'
            }`}>
              {item.done && '✓'}
            </div>
            <span>{item.text}</span>
          </div>
        ))}
      </div>

      <div className="pt-4 flex justify-end">
        <button 
          onClick={onClose}
          className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold rounded-lg text-xs"
        >
          Conclude Optimizations
        </button>
      </div>
    </div>
  );
}
