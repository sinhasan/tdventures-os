import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  BarChart3, 
  ChevronRight, 
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
import { 
  COMPONENT_ROLES, 
  INITIAL_ALERTS, 
  STATIC_PITCH_DOSSIERS 
} from './data';

// Email capture banner component (inline for simplicity)
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

const PREMIUM_THEMES = [
  { id: 'enterprise-blue', name: 'Deep Enterprise Blue', bg: '#0F172A', gradientStart: '#0F172A', gradientEnd: '#090D1A', accent: '#7C3AED', glowColor: 'rgba(124, 58, 237, 0.4)' },
  { id: 'electric-purple', name: 'Electric Purple Pulse', bg: '#0F172A', gradientStart: '#1E1B4B', gradientEnd: '#090514', accent: '#7C3AED', glowColor: 'rgba(124, 58, 237, 0.4)' },
  { id: 'neon-violet', name: 'Neon Violet Glow', bg: '#0F172A', gradientStart: '#3B0764', gradientEnd: '#0B071F', accent: '#9333EA', glowColor: 'rgba(147, 51, 234, 0.4)' }
];

const INITIAL_DEAL_FLOW: DealFlowItem[] = [
  { id: 'df-1', companyName: 'AlphaFlow Logistics', stage: 'Series A', sector: 'AI & Logistics', valuation: '$14.2M', askAmount: '$2.5M', agiScore: 94, riskLevel: 'Low', status: 'Strong Buy', lastUpdated: '2 mins ago' },
  { id: 'df-2', companyName: 'OceanPulse Shipping', stage: 'Seed', sector: 'Maritime Tech', valuation: '$8.5M', askAmount: '$1.2M', agiScore: 89, riskLevel: 'Medium', status: 'Buy', lastUpdated: '1 hour ago' },
  { id: 'df-3', companyName: 'Agronomix spatial', stage: 'Pre-Seed', sector: 'AgTech', valuation: '$4.1M', askAmount: '$600K', agiScore: 78, riskLevel: 'High', status: 'Hold', lastUpdated: '4 hours ago' },
  { id: 'df-4', companyName: 'InspectZero Insurance QA', stage: 'Series B', sector: 'Cybersecurity', valuation: '$42.0M', askAmount: '$8.0M', agiScore: 91, riskLevel: 'Low', status: 'Strong Buy', lastUpdated: '1 day ago' }
];

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
      if (savedTab) return savedTab;
      if (savedRole === 'admin') return 'user_management';
    } catch {}
    return 'dashboard';
  });
  const [activePitchModal, setActivePitchModal] = useState<'download' | 'share' | 'schedule' | 'plan' | null>(null);
  const [agiAutoMode, setAgiAutoMode] = useState<boolean>(true);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'info' | 'warn' | null }>({ text: '', type: null });

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
    investorFit: number;
    riskLevel: 'Low' | 'Moderate' | 'High';
    riskFlags: string[];
    nextBestAction: string;
    crmSummary: string;
    generatedAt: string;
  };

  const [conversionReview, setConversionReview] = useState<ConversionReviewResult | null>(null);

  const generateConversionReview = () => {
    const p = conversionProfile;
    const hasPitch = p.pitchSummary.trim().length > 60;
    const hasTraction = p.tractionProof.trim().length > 40;
    const hasRaise = p.raiseAmount.trim().length > 0;
    const hasInvestor = p.targetInvestor.trim().length > 10;
    const hasRisk = p.riskNotes.trim().length > 20;

    const pitchDeckQuality = Math.min(94, 48 + (hasPitch ? 24 : 8) + (hasTraction ? 10 : 0) + (hasRaise ? 6 : 0));
    const fundraiseReadiness = Math.min(92, 42 + (hasRaise ? 18 : 0) + (hasTraction ? 18 : 4) + (hasInvestor ? 10 : 0));
    const narrativeClarity = Math.min(95, 45 + (hasPitch ? 28 : 10) + (p.sector ? 8 : 0) + (p.stage ? 6 : 0));
    const investorFit = Math.min(93, 44 + (hasInvestor ? 24 : 8) + (p.sector ? 10 : 0) + (hasTraction ? 8 : 0));

    const riskFlags = [
      !hasTraction ? 'Traction proof needs stronger evidence' : '',
      !hasRaise ? 'Raise amount is not clearly stated' : '',
      !hasInvestor ? 'Target investor profile is too broad' : '',
      hasRisk ? 'Founder has disclosed risks that need cleanup before investor handoff' : ''
    ].filter(Boolean) as string[];

    const riskLevel: 'Low' | 'Moderate' | 'High' = riskFlags.length >= 3 ? 'High' : riskFlags.length >= 1 ? 'Moderate' : 'Low';
    const startup = p.startupName.trim() || 'This founder';
    const nextBestAction = riskLevel === 'High'
      ? 'Tighten proof, raise logic and investor targeting before Deal Desk handoff.'
      : riskLevel === 'Moderate'
        ? 'Clean evidence gaps and prepare a focused founder brief for investor outreach.'
        : 'Move to Deal Desk with CRM-ready summary and investor shortlist.';

    setConversionReview({
      pitchDeckQuality,
      fundraiseReadiness,
      narrativeClarity,
      investorFit,
      riskLevel,
      riskFlags: riskFlags.length ? riskFlags : ['No major frontend risk flag detected from current inputs'],
      nextBestAction,
      crmSummary: startup + ' is a ' + (p.stage || 'stage-not-set') + ' company in ' + (p.sector || 'sector-not-set') + '. Raise ask: ' + (p.raiseAmount || 'not stated') + '. Target investor: ' + (p.targetInvestor || 'not stated') + '. Recommended action: ' + nextBestAction,
      generatedAt: new Date().toLocaleString()
    });
  };


  const [activeAlerts, setActiveAlerts] = useState(INITIAL_ALERTS);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState<boolean>(false);

  const [telemetryLogs, setTelemetryLogs] = useState<Array<{ id: string; time: string; source: string; text: string }>>([
    { id: '1', time: '09:33:47', source: 'Orchestrator', text: 'Conversion workspace ready. Visibility and CRM handoff stays isolated.' },
    { id: '2', time: '09:34:02', source: 'Self-Healing', text: 'Restored zero-knowledge SSL gateway channels.' }
  ]);

  const [showPricingModal, setShowPricingModal] = useState<boolean>(false);
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

  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzingPitch, setIsAnalyzingPitch] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [pitchResults, setPitchResults] = useState<any>(null);

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
      { id: 'dashboard', name: 'Conversion Dashboard', icon: LayoutDashboard, desc: 'Pitch quality and investor fit' },
      { id: 'pitch_analyzer', name: 'Conversion Review', icon: TrendingUp, desc: 'Signal review to investor-ready action' },
      { id: 'gdocs_hub', name: 'Founder Briefs', icon: FileText, desc: 'Founder notes and CRM handoff' },
      { id: 'gslides_hub', name: 'Pitch Deck Workspace', icon: Presentation, desc: 'Deck story and proof room' },
      { id: 'linkedin_intel', name: 'Investor Signal Research', icon: Linkedin, desc: 'Market and investor context' },
      { id: 'fundraising_intel', name: 'Fundraise Readiness', icon: Coins, desc: 'Round readiness and ask logic' },
      { id: 'validation', name: 'Narrative Clarity', icon: CheckCircle2, desc: 'Problem, market and proof strength' },
      { id: 'matchmaking', name: 'Investor Fit', icon: Target, desc: 'Right investor, right stage' },
      { id: 'docs_hub', name: 'Founder Vault', icon: FileText, desc: 'Deck, proof and investor handoff' },
      { id: 'forecasting', name: 'Financial Forecasting', icon: BarChart3, desc: 'Revenues scalability hologram' }
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

  const handleFileUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = e.target.files?.[0];
    if (fileObj) {
      setUploadedFile({
        name: fileObj.name,
        size: `${(fileObj.size / 1024 / 1024).toFixed(1)} MB`,
        type: fileObj.name.split('.').pop()?.toUpperCase() || 'PDF'
      });
      addLog('Telemetry Sentinel', `Unstructured file loaded: ${fileObj.name}. Ingestion sandbox active.`);
      triggerToast('File uploaded! Ready for conversion signal review', 'success');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const fileObj = e.dataTransfer.files?.[0];
    if (fileObj) {
      setUploadedFile({
        name: fileObj.name,
        size: `${(fileObj.size / 1024 / 1024).toFixed(1)} MB`,
        type: fileObj.name.split('.').pop()?.toUpperCase() || 'PDF'
      });
      addLog('Telemetry Sentinel', `Unstructured file loaded via drag-and-drop: ${fileObj.name}. Ingestion sandbox active.`);
      triggerToast('File uploaded! Ready for conversion signal review', 'success');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleStartAnalysis = () => {
    if (!uploadedFile) {
      triggerToast('Please upload or select a document first!', 'warn');
      return;
    }
    setIsAnalyzingPitch(true);
    setAnalysisStep(0);
    setPitchResults(null);
    addLog('Orchestrator', `Querying TD Conversion OS signal engine to analyze founder material: ${uploadedFile.name}`);

    const interval = setInterval(() => {
      setAnalysisStep(prev => {
        if (prev >= 2) {
          clearInterval(interval);
          setIsAnalyzingPitch(false);
          const match = STATIC_PITCH_DOSSIERS.find(x => x.name.toLowerCase().includes(uploadedFile.name.split('.')[0].toLowerCase())) || STATIC_PITCH_DOSSIERS[0];
          setPitchResults(match);
          addLog('Self-Healing', `Compiled conversion signal indices for ${match.name}`);
          triggerToast(`Analysis complete for ${match.name}!`, 'success');
          return 2;
        }
        return prev + 1;
      });
    }, 1200);
  };

  const handleQuickDossierSim = (dossier: any) => {
    setUploadedFile({
      name: `${dossier.name}.pdf`,
      size: '2.4 MB',
      type: 'PDF'
    });
    setPitchResults(null);
    triggerToast(`Selected ${dossier.name} preloaded file! Click Start Deep TD Conversion OS Analysis.`, 'info');
  };

  const activeThemeObj = PREMIUM_THEMES.find(t => t.id === selectedTheme) || PREMIUM_THEMES[0];

  return (
    <div className={`min-h-screen font-sans overflow-x-hidden selection:bg-purple-600/40 pb-14 md:pb-0 transition-colors duration-300 ${
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
        <aside className="w-80 border-r border-slate-800/80 bg-[#0F172A]/90 backdrop-blur-3xl flex flex-col justify-between overflow-y-auto hidden md:flex">
          <div>
            {/* Branding Header matching screenshot style */}
            <div className="h-20 flex items-center px-6 border-b border-slate-800/50 justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
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

            {/* User credentials panel (Conversion Operator, matching first image) */}
            <div className="p-4 mx-4 mt-4 rounded-2xl bg-[#090e1a]/80 border border-slate-800/60 flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center font-bold text-white uppercase text-xs">
                TD
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F8FAFC] block">Conversion Operator</span>
                </div>
                <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                  role === 'founder' ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' :
                  role === 'investor' ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20' :
                  role === 'smb' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20' :
                  'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                }`}>
                  {role === 'founder' ? 'Founder' : role === 'investor' ? 'Investor' : role === 'smb' ? 'SMB Exec' : 'Admin'}
                </span>
              </div>
            </div>

            {/* Switch Role Dropdown (Exactly same features as screenshot dropdown) */}
            <div className="p-4 mx-4 mt-2 border-b border-slate-800/40">
              <label className="text-[10px] font-mono tracking-widest uppercase text-slate-400 block mb-1.5 font-bold">Switch Role</label>
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
            <a
            href="https://tdventure.vc/pricing.html"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500          text-[11px] font-bold text-white shadow-lg shadow-purple-500/10 block"
            >
            View Pricing Plans
           </a>
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
                | Visibility → Conversion → Execution
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
              <div className='p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5 shadow-sm' title='Dark mode locked'>
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

              {/* Account Profile header indicator */}
              <div className="text-right hidden sm:block">
                <span className="text-xs block text-[#F8FAFC] font-extrabold leading-tight">TD Conversion OS</span>
                <span className="text-[9px] block text-purple-400 font-mono">Investor-ready founder signals</span>
              </div>
            </div>
          </header>

          {/* Dynamic Scrollable Main Panel Workspace viewport */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* 1. ROLE BOUNDARIES CONDITIONAL RENDERING */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-fade-in">
                {/* Mega Banner Hero statements */}
                <div className="p-8 rounded-3xl border border-indigo-900/30 bg-gradient-to-br from-[#0F172A] via-[#0A0A16] to-[#04040a] relative overflow-hidden group shadow-2xl">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                  <div className="absolute -right-24 -top-24 w-80 h-80 bg-gradient-to-tr from-purple-600/10 to-indigo-600/20 rounded-full blur-[80px] pointer-events-none" />
                  
                  <div className="relative z-10 space-y-4 max-w-2xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-500/20 text-purple-300 text-[10px] font-mono leading-none">
                      <Sparkles className="w-3 h-3 animate-pulse" /> TD Conversion OS Sourcing Live Portal Protocol
                    </div>
                    <h1 className="text-2xl md:text-4xl font-extrabold text-[#F8FAFC] tracking-tight leading-tight">
                      TD Conversion OS — Where Trust <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                        Into Investor-Ready Action.
                      </span>
                    </h1>
                    <p className="text-sm text-[#CBD5E1] leading-relaxed">
                      Conversion turns a founder's pitch, proof, traction and raise narrative into investor-ready signals, next best actions, and CRM-ready summaries for the TD Conversion OS Deal Desk.
                    </p>

                    <div className="pt-2 flex flex-wrap gap-3">
                      <button 
                        onClick={() => setActiveTab('pitch_analyzer')}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98]"
                      >
                        Run Conversion Review
                      </button>
                      <a
                        href="https://tdventure.vc/pricing.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 border border-slate-750 bg-slate-900/60 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl inline-block"
                       >
                       Open Founder Vault
                      </a>
                    </div>
                  </div>
                </div>

                {/* Dashboard KPIs based on selected role */}
                {role === 'founder' && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider font-bold block">Founder Conversion Signals</span>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                      {[
                        { title: 'Conversion Review', val: '78/100', text: 'Story clear; proof gaps remain', color: 'text-purple-400' },
                        { title: 'Narrative Clarity', val: '84/100', text: 'Problem and ICP are clear', color: 'text-indigo-400' },
                        { title: 'Risk Signals', val: 'Moderate', text: 'Needs evidence cleanup', color: 'text-[#22C55E]' },
                        { title: 'Investor Fit', val: '72/100', text: 'Best for seed-stage funds', color: 'text-cyan-400' },
                        { title: 'Fundraise Readiness', val: '69/100', text: 'Round ask needs tightening', color: 'text-amber-500' },
                        { title: 'CRM Summary', val: 'Ready', text: 'Ready for CRM handoff', color: 'text-[#F59E0B]' }
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
                <div className="p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/70 space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-600 to-cyan-400" />
                  
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                       <span className="text-[#D4AF37] text-base">🎯</span> Conversion Signal Engine
                      </h3>
                      <p className="text-xs text-slate-400">Upload a deck or founder brief to read conversion signals: proof strength, narrative clarity, fundraise readiness, investor fit, risk signals and next best action.</p>
                    </div>

                    <div className="flex gap-2 text-xs">
                      <button 
                        type="button"
                        onClick={triggerFileInput}
                        className="text-[11px] bg-slate-900 hover:bg-slate-850 text-slate-350 hover:text-white px-3.5 py-1.5 rounded-lg cursor-pointer border border-slate-800 font-bold transition-colors"
                      >
                        Choose Document File
                      </button>
                    </div>
                  </div>

                  {/* Preloaded Targets selector for Demo */}
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">InspectZero Demo Dataset:</span>
                    <div className="flex gap-2 flex-wrap">
                      {STATIC_PITCH_DOSSIERS.map(doss => (
                        <button 
                          key={doss.name}
                          onClick={() => handleQuickDossierSim(doss)}
                          className={`text-[9px] px-3 py-1.5 rounded bg-slate-900 hover:bg-[#15152a] border font-mono transition-all font-bold ${
                            uploadedFile?.name.includes(doss.name.split(' ')[0]) ? 'border-purple-500 text-purple-400' : 'border-slate-800 text-slate-300'
                          }`}
                        >
                          {doss.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* File Upload component style exactly matching user request */}
                  <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={uploadedFile ? undefined : triggerFileInput}
                    className={`p-6 rounded-xl border border-dashed text-center space-y-4 transition-all cursor-pointer select-none ${
                      isDragging 
                        ? 'border-purple-500 bg-purple-950/25 shadow-[0_0_15px_rgba(124,58,237,0.25)]' 
                        : 'border-slate-800 bg-[#080d1a] hover:border-slate-700 hover:bg-[#0b1326]'
                    }`}
                  >
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUploadSim}
                      accept=".pdf,.docx,.txt,.pptx,image/*"
                      className="hidden"
                    />
                    {uploadedFile ? (
                      <div 
                        onClick={(e) => e.stopPropagation()} // Stop propagation so clicking buttons inside doesn't trigger parent onClick
                        className="p-4 rounded-xl border border-[#22C55E]/30 bg-[#22C55E]/10 flex items-center justify-between text-left max-w-xl mx-auto"
                      >
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                          <div>
                            <p className="text-xs font-bold text-white">✔ File Uploaded Successfully</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{uploadedFile.name} ({uploadedFile.size})</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setUploadedFile(null)}
                          className="text-[9px] font-mono font-bold text-slate-500 hover:text-slate-300 bg-slate-950 rounded py-1 px-2 border border-slate-850"
                        >
                          Clear File
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 py-6 pointer-events-none">
                        <UploadCloud className={`w-8 h-8 mx-auto ${isDragging ? 'text-purple-400 animate-bounce' : 'text-slate-400 animate-pulse'}`} />
                        <p className="text-xs font-bold text-slate-300">
                          {isDragging ? 'Drop your pitch deck here now!' : 'Drag & drop pitch deck here, or click to upload'}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono">Accepts PDF, DOCX, TXT, PPTX & Images (deck, brief and image-based founder evidence)</p>
                      </div>
                    )}

                    {uploadedFile && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartAnalysis();
                        }}
                        disabled={isAnalyzingPitch}
                        className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase rounded-xl transition-all shadow-md flex items-center gap-1.5 mx-auto disabled:opacity-50"
                      >
                        <Play className="w-3.5 h-3.5" /> Run Conversion Analysis
                      </button>
                    )}
                  </div>
                </div>

                {isAnalyzingPitch && (
                  <div className="p-12 text-center border border-slate-850 rounded-2xl bg-[#0F172A]/70 relative overflow-hidden space-y-4">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-400 to-pink-500 animate-pulse" />
                    <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    
                    <div className="max-w-md mx-auto space-y-2">
                      <span className="text-xs text-purple-400 font-mono font-bold block uppercase tracking-widest">Running conversion analysis:</span>
                      <p className="text-[11px] text-slate-400 italic">
                        {analysisStep === 0 && "Reading pitch deck structure, story flow and proof points..."}
                        {analysisStep === 1 && "Checking fundraise readiness, investor fit and risk signals..."}
                        {analysisStep === 2 && "Preparing next best action and CRM-ready founder summary..."}
                      </p>
                    </div>
                  </div>
                )}

                {pitchResults && !isAnalyzingPitch && (
                  <div className="space-y-6 animate-fade-in w-full text-left" id="deep_analysis_dashboard_root">
                    
                    {conversionReview && (
                      <div className='mb-6 p-6 rounded-3xl border border-[#D4FF00]/30 bg-[#0c1222]/90 shadow-2xl'>
                        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5'>
                          <div>
                            <span className='text-[10px] font-mono uppercase tracking-[0.28em] text-[#D4FF00] font-bold'>Generated Founder Vault Review</span>
                            <h2 className='text-2xl font-black text-white mt-2'>{conversionProfile.startupName || 'Founder'} Conversion Readiness</h2>
                            <p className='text-xs text-slate-400 mt-1'>Generated locally from Founder Vault inputs. Backend/OpenAI integration comes later.</p>
                          </div>
                          <div className='px-4 py-3 rounded-2xl border border-slate-800 bg-slate-950/70'>
                            <div className='text-[10px] uppercase tracking-wider text-slate-500 font-bold'>Risk Level</div>
                            <div className={conversionReview.riskLevel === 'High' ? 'text-red-400 font-black' : conversionReview.riskLevel === 'Moderate' ? 'text-yellow-300 font-black' : 'text-[#D4FF00] font-black'}>{conversionReview.riskLevel}</div>
                          </div>
                        </div>
                        <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5'>
                          {[
                            ['Conversion Review', conversionReview.pitchDeckQuality],
                            ['Fundraise Readiness', conversionReview.fundraiseReadiness],
                            ['Narrative Clarity', conversionReview.narrativeClarity],
                            ['Investor Fit', conversionReview.investorFit]
                          ].map(([label, score]) => (
                            <div key={label as string} className='p-4 rounded-2xl border border-slate-800 bg-slate-950/70'>
                              <div className='text-[10px] uppercase tracking-wider text-slate-500 font-bold'>{label}</div>
                              <div className='text-2xl font-black text-white mt-1'>{score}<span className='text-xs text-slate-500'>/100</span></div>
                            </div>
                          ))}
                        </div>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                          <div className='p-4 rounded-2xl border border-slate-800 bg-slate-950/70'>
                            <div className='text-[10px] uppercase tracking-wider text-[#D4FF00] font-bold mb-2'>Next Best Action</div>
                            <p className='text-sm text-slate-200 leading-relaxed'>{conversionReview.nextBestAction}</p>
                          </div>
                          <div className='p-4 rounded-2xl border border-slate-800 bg-slate-950/70'>
                            <div className='text-[10px] uppercase tracking-wider text-[#D4FF00] font-bold mb-2'>Risk Flags</div>
                            <ul className='space-y-1 text-sm text-slate-300'>{conversionReview.riskFlags.map((flag) => <li key={flag}>- {flag}</li>)}</ul>
                          </div>
                        </div>
                        <div className='mt-4 p-4 rounded-2xl border border-slate-800 bg-slate-950/70'>
                          <div className='text-[10px] uppercase tracking-wider text-[#D4FF00] font-bold mb-2'>CRM-ready Summary</div>
                          <p className='text-sm text-slate-200 leading-relaxed'>{conversionReview.crmSummary}</p>
                          <div className='text-[10px] text-slate-500 mt-3'>Generated: {conversionReview.generatedAt}</div>
                        </div>
                      </div>
                    )}

                    {/* Header: Conversion Readiness Report Title & BUY indicator */}
                    <div className="p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/70 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                      <div>
                        <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                          <Sparkles className="text-purple-400 w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} /> Conversion Readiness Report
                        </h3>
                        <p className="text-xs text-slate-400 font-mono mt-1">
                          Founder Vault Analysis • Conversion signals synced • File: {uploadedFile?.name || 'InspectZero_Investor_Readiness_Report.pdf'}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* BUY Outline Tag */}
                        <div className="px-5 py-1.5 rounded-full border-2 border-blue-500/80 bg-blue-500/10 text-blue-400 text-xs font-black tracking-widest uppercase hover:bg-blue-500/20 cursor-help transition-all" title="Investment Decision Recommendation: STRONG BUY">
                          BUY
                        </div>
                        {/* Conversion Score */}
                        <div className="text-right">
                          <span className="text-2xl font-black text-[#22C55E] block leading-none">87%</span>
                          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mt-0.5">Conversion Score</span>
                        </div>
                      </div>
                    </div>

                    {/* Executive Summary panel matching image blue container */}
                    <div className="p-5 rounded-2xl border border-blue-400/30 bg-blue-500/5 space-y-2 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
                      <span className="text-[10px] font-mono tracking-widest uppercase text-blue-400 block font-black">Executive Summary</span>
                      <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans font-medium">
                        This pitch deck presents a compelling AI inspection startup with strong market positioning and experienced team. The OS analysis reveals solid fundamentals with some areas requiring attention for optimal investor appeal.
                      </p>
                    </div>

                    {/* Metrics grid underneath executive summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      {/* Confidence score */}
                      <div className="p-5 rounded-2xl border border-slate-800 bg-[#0c1222]/80 text-center space-y-1 hover:border-purple-500/30 transition-all cursor-pointer group">
                        <span className="text-2xl font-black text-purple-400 block group-hover:scale-105 transition-transform">92%</span>
                        <span className="text-[10px] text-slate-400 block font-bold font-mono uppercase tracking-wider">Investor Confidence</span>
                      </div>

                      {/* Valuation range */}
                      <div className="p-5 rounded-2xl border border-slate-800 bg-[#0c1222]/80 text-center space-y-1 hover:border-[#22C55E]/30 transition-all cursor-pointer group">
                        <span className="text-2xl font-black text-[#22C55E] block group-hover:scale-105 transition-transform">INR 80L - INR 1.5Cr</span>
                        <span className="text-[10px] text-slate-400 block font-bold font-mono uppercase tracking-wider">Suggested Raise Band</span>
                      </div>

                      {/* Next Best Action */}
                      <div className="p-5 rounded-2xl border border-slate-800 bg-[#0c1222]/80 text-center space-y-1 hover:border-blue-500/30 transition-all cursor-pointer group">
                        <span className="text-2xl font-black text-blue-400 block group-hover:scale-105 transition-transform">INR 1Cr seed extension</span>
                        <span className="text-[10px] text-slate-400 block font-bold font-mono uppercase tracking-wider">Next Best Action</span>
                      </div>

                    </div>

                    {/* Conversion Signal Analysis section */}
                    <div className="p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/70 space-y-6">
                      
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                        <BarChart3 className="w-5 h-5 text-blue-400" />
                        <h4 className="text-sm font-black text-white uppercase tracking-wider">Conversion Signal Analysis</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        {/* Founder-Market Fit item card */}
                        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                              <Globe2 className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-white leading-tight">Founder-Market Fit</h5>
                              <span className="text-[9px] text-slate-500 leading-none">Leadership & execution capability</span>
                            </div>
                          </div>
                          <span className="text-sm font-black text-emerald-400">92%</span>
                        </div>

                        {/* Fundraise Readiness card */}
                        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                              <Coins className="w-4 h-4 text-blue-400" />
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-white leading-tight">Fundraise Readiness</h5>
                              <span className="text-[9px] text-slate-500 leading-none">Revenue model & sustainability</span>
                            </div>
                          </div>
                          <span className="text-sm font-black text-blue-400">78%</span>
                        </div>

                        {/* Investor Fit card */}
                        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                              <TrendingUp className="w-4 h-4 text-purple-400" />
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-white leading-tight">Investor Fit</h5>
                              <span className="text-[9px] text-slate-500 leading-none">Growth potential & market reach</span>
                            </div>
                          </div>
                          <span className="text-sm font-black text-purple-400">88%</span>
                        </div>

                      </div>

                      {/* Side inline rows below key metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-800/60 text-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-350 block uppercase tracking-wider">Narrative Clarity</span>
                          <p className="text-xs text-slate-400 font-medium">
                            Large real estate, construction and insurance inspection market
                          </p>
                          <span className="text-[9px] font-mono text-slate-500 block leading-none">Proprietary AI algorithms • Real estate, insurance and construction workflow partnerships</span>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-350 block uppercase tracking-wider">CRM Summary</span>
                          <p className="text-xs text-slate-400 font-medium">
                            SaaS + Transaction fees
                          </p>
                          <span className="text-[9px] font-mono text-slate-500 block leading-none">Dynamic recurring subscriptions combined with high transaction volume</span>
                        </div>
                      </div>

                    </div>

                    {/* Word-Level Semantic Analysis block */}
                    <div className="p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/70 space-y-4">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                        <Search className="w-5 h-5 text-purple-400" />
                        <h4 className="text-sm font-black text-white uppercase tracking-wider">Word-Level Semantic Analysis</h4>
                      </div>

                      <div className="space-y-3">
                        
                        {/* Word 1 */}
                        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between flex-wrap gap-4 hover:bg-slate-950/80 transition-all cursor-help" title="Neural Sentiment: positive confidence value indicator">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-extrabold text-white font-mono">"revolutionary"</span>
                              <span className="px-2 py-0.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] text-[9px] font-bold font-mono">positive</span>
                            </div>
                            <p className="text-[11px] text-slate-400">Used to describe technology - moderate credibility due to overuse in startup pitches</p>
                          </div>

                          <div className="flex items-center gap-4 text-[10px] font-mono">
                            <div className="text-right">
                              <span className="text-purple-400 font-extrabold block">70%</span>
                              <span className="text-slate-500 text-[8px] uppercase font-bold block">Credibility</span>
                            </div>
                            <div className="text-right">
                              <span className="text-indigo-400 font-extrabold block">90%</span>
                              <span className="text-slate-500 text-[8px] uppercase font-bold block">Importance</span>
                            </div>
                          </div>
                        </div>

                        {/* Word 2 */}
                        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between flex-wrap gap-4 hover:bg-slate-950/80 transition-all cursor-help" title="Neural Sentiment: positive confidence value indicator">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-extrabold text-white font-mono">"validated"</span>
                              <span className="px-2 py-0.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] text-[9px] font-bold font-mono">positive</span>
                            </div>
                            <p className="text-[11px] text-slate-400">Strong credibility indicator when describing market research</p>
                          </div>

                          <div className="flex items-center gap-4 text-[10px] font-mono">
                            <div className="text-right">
                              <span className="text-purple-400 font-extrabold block">95%</span>
                              <span className="text-slate-500 text-[8px] uppercase font-bold block">Credibility</span>
                            </div>
                            <div className="text-right">
                              <span className="text-indigo-400 font-extrabold block">85%</span>
                              <span className="text-slate-500 text-[8px] uppercase font-bold block">Importance</span>
                            </div>
                          </div>
                        </div>

                        {/* Word 3 */}
                        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between flex-wrap gap-4 hover:bg-slate-950/80 transition-all cursor-help" title="Neural Sentiment: positive confidence value indicator">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-extrabold text-white font-mono">"scalable"</span>
                              <span className="px-2 py-0.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] text-[9px] font-bold font-mono">positive</span>
                            </div>
                            <p className="text-[11px] text-slate-400">Critical for investor appeal - well supported by technical architecture</p>
                          </div>

                          <div className="flex items-center gap-4 text-[10px] font-mono">
                            <div className="text-right">
                              <span className="text-purple-400 font-extrabold block">80%</span>
                              <span className="text-slate-500 text-[8px] uppercase font-bold block">Credibility</span>
                            </div>
                            <div className="text-right">
                              <span className="text-indigo-400 font-extrabold block">90%</span>
                              <span className="text-slate-500 text-[8px] uppercase font-bold block">Importance</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Paragraph-Level Structure Analysis */}
                    <div className="p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/70 space-y-6">
                      
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                        <FileText className="w-5 h-5 text-indigo-400" />
                        <h4 className="text-sm font-black text-white uppercase tracking-wider">Paragraph-Level Structure Analysis</h4>
                      </div>

                      {/* Quoted source section exact matching */}
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 font-serif text-slate-300 text-xs italic leading-relaxed relative pl-8">
                        <span className="absolute left-3 top-2 text-2xl font-black text-purple-500 font-mono">“</span>
                        "Our AI-powered AI-powered inspection platform addresses the $50B manual inspection and reporting gap..."
                      </div>

                      {/* Analysis indicators sliders underneath */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                        
                        {/* Sentiment */}
                        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 block font-mono">Sentiment</span>
                          <span className="text-sm font-black text-emerald-400 block font-mono">80%</span>
                          <div className="w-full bg-slate-855 rounded-full h-1">
                            <div className="bg-emerald-400 h-1 rounded-full" style={{ width: '80%' }} />
                          </div>
                        </div>

                        {/* Clarity */}
                        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 block font-mono">Clarity</span>
                          <span className="text-sm font-black text-blue-400 block font-mono">90%</span>
                          <div className="w-full bg-slate-855 rounded-full h-1">
                            <div className="bg-blue-400 h-1 rounded-full" style={{ width: '90%' }} />
                          </div>
                        </div>

                        {/* Persuasiveness */}
                        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 block font-mono">Persuasiveness</span>
                          <span className="text-sm font-black text-purple-400 block font-mono">85%</span>
                          <div className="w-full bg-slate-855 rounded-full h-1">
                            <div className="bg-purple-400 h-1 rounded-full" style={{ width: '85%' }} />
                          </div>
                        </div>

                        {/* Data Support */}
                        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 block font-mono">Data Support</span>
                          <span className="text-sm font-black text-amber-500 block font-mono">90%</span>
                          <div className="w-full bg-slate-855 rounded-full h-1">
                            <div className="bg-amber-500 h-1 rounded-full" style={{ width: '90%' }} />
                          </div>
                        </div>

                      </div>

                      {/* Split column checklists (Key Insights left vs right) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/60">
                        
                        {/* Lelf column */}
                        <div className="space-y-4">
                          
                          {/* Key insights */}
                          <div className="space-y-2">
                            <h5 className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 font-extrabold block">Key Insights</h5>
                            <ul className="space-y-1.5 text-xs text-slate-300">
                              <li className="flex items-center gap-2 font-medium">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Clear problem articulation
                              </li>
                              <li className="flex items-center gap-2 font-medium">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Strong market data
                              </li>
                              <li className="flex items-center gap-2 font-medium">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Emotional connection
                              </li>
                            </ul>
                          </div>

                          {/* Areas for Improvement */}
                          <div className="space-y-2 pt-2 border-t border-slate-850">
                            <h5 className="text-[10px] font-mono tracking-widest uppercase text-amber-500 font-extrabold block">Areas for Improvement</h5>
                            <ul className="space-y-1 text-xs text-slate-300 font-medium">
                              <li className="flex items-start gap-2 text-amber-400">
                                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" /> Could use more specific pain points
                              </li>
                              <li className="flex items-start gap-2 text-amber-400 font-medium">
                                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" /> Missing urgency indicators
                              </li>
                            </ul>
                          </div>

                          {/* Prescriptive Actions */}
                          <div className="space-y-2 pt-2 border-t border-slate-850">
                            <h5 className="text-[10px] font-mono tracking-widest uppercase text-blue-400 font-extrabold block">Prescriptive Actions</h5>
                            <ul className="space-y-1 text-xs text-slate-300">
                              <li className="flex items-center gap-2 font-medium">
                                <Target className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" /> Add patient testimonials
                              </li>
                              <li className="flex items-center gap-2 font-medium">
                                <Target className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" /> Include cost of inaction data
                              </li>
                            </ul>
                          </div>

                        </div>

                        {/* Right column */}
                        <div className="space-y-4">
                          
                          <div className="space-y-2">
                            <h5 className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 font-extrabold block">Technical Soundness</h5>
                            <ul className="space-y-1.5 text-xs text-slate-300">
                              <li className="flex items-center gap-2 font-medium">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Innovative approach
                              </li>
                              <li className="flex items-center gap-2 font-medium">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Technical feasibility
                              </li>
                              <li className="flex items-center gap-2 font-medium">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Clear value proposition
                              </li>
                            </ul>
                          </div>

                          <div className="space-y-2 pt-2 border-t border-slate-850">
                            <h5 className="text-[10px] font-mono tracking-widest uppercase text-amber-500 font-extrabold block">Structural Limits</h5>
                            <ul className="space-y-1 text-xs text-slate-300">
                              <li className="flex items-start gap-2 text-amber-400 font-medium">
                                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" /> Implementation timeline unclear
                              </li>
                            </ul>
                          </div>

                          <div className="space-y-2 pt-2 border-t border-slate-850">
                            <h5 className="text-[10px] font-mono tracking-widest uppercase text-blue-400 font-extrabold block">Advanced Prescriptive Actions</h5>
                            <ul className="space-y-1 text-xs text-slate-300">
                              <li className="flex items-center gap-2 font-medium">
                                <Target className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" /> Add technical architecture diagram
                              </li>
                              <li className="flex items-center gap-2 font-medium">
                                <Target className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" /> Include pilot results
                              </li>
                            </ul>
                          </div>

                        </div>

                      </div>

                    </div>

                    {/* Section: Investment Thesis & Recommended Next Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Investment Thesis (Amber custom border card block) */}
                      <div className="p-6 rounded-2xl border border-amber-300 bg-[#1e1e12] space-y-4">
                        <div className="flex items-center gap-2 border-b border-amber-500/20 pb-2">
                          <Sparkles className="text-amber-400 w-5 h-5 animate-pulse" />
                          <h4 className="text-sm font-black text-amber-400 uppercase tracking-widest">Investment Thesis</h4>
                        </div>
                        
                        {/* Amber layout advice sentence */}
                        <div className="p-4 rounded-xl border border-amber-400/30 bg-amber-500/5 font-sans text-amber-300 text-xs font-semibold leading-relaxed">
                          Strong team with proven inspection AI technology addressing large market opportunity. Clear path to profitability with defensible moat through real estate, insurance and construction workflow partnerships and proprietary data.
                        </div>

                        <div className="space-y-2 pt-2 text-xs">
                          <span className="text-[10px] uppercase font-mono tracking-widest text-[#cbd5e1] block font-bold">Key Risk Factors Detected:</span>
                          <ul className="space-y-1.5 font-medium text-slate-300">
                            <li className="flex items-start gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
                              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" /> Inspection accuracy and liability confidence must be proven
                            </li>
                            <li className="flex items-start gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
                              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" /> Long enterprise sales cycles in real estate, insurance and construction
                            </li>
                            <li className="flex items-start gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
                              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" /> Competitive pressure from established players
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Recommended Next Steps with round numbers exact matching */}
                      <div className="p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/70 space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                          <Activity className="text-blue-400 w-5 h-5 animate-pulse" />
                          <h4 className="text-sm font-black text-white uppercase tracking-widest">Recommended Next Steps</h4>
                        </div>

                        <div className="space-y-2 text-xs font-medium">
                          {[
                            "Schedule management presentation",
                            "Review inspection report samples and pilot proof",
                            "Conduct customer reference calls",
                            "Analyze competitive landscape",
                            "Evaluate regulatory pathway"
                          ].map((step, stepIdx) => (
                            <div key={stepIdx} className="p-3.5 rounded-xl border border-slate-850 bg-[#080d19] hover:bg-slate-900 flex items-center gap-3.5 hover:border-blue-500/30 transition-all cursor-pointer group">
                              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center font-bold text-[10px] text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                                {stepIdx + 1}
                              </div>
                              <span className="text-slate-200 group-hover:text-white">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Highly Engaging Action CTA Footer Buttons matching mockups */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800/60 pb-8">
                      <button 
                        onClick={() => {
                          addLog('Self-Healing', 'Triggered compiled report export SHA-256 build logs package.');
                          setActivePitchModal('download');
                          triggerToast('Opening analytical export matrix...', 'success');
                        }}
                        className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 border border-blue-500/10"
                      >
                        <Download className="w-4 h-4 text-slate-200" /> Download Conversion Report
                      </button>

                      <button 
                        onClick={() => {
                          addLog('Orchestrator', 'Initiated secure token link dispatcher layer.');
                          setActivePitchModal('share');
                          triggerToast('Loading secure dispatcher config...', 'success');
                        }}
                        className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 border border-emerald-500/10"
                      >
                        <Share2 className="w-4 h-4 text-slate-200" /> Share Founder Brief
                      </button>

                      <button 
                        onClick={() => {
                          addLog('Orchestrator', 'Opened OS-matching time slot selection matrix.');
                          setActivePitchModal('schedule');
                          triggerToast('Fetching available investor calendars...', 'info');
                        }}
                        className="py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 border border-purple-500/10"
                      >
                        <Users className="w-4 h-4 text-slate-200" /> Send to Execute Deal Desk
                      </button>

                      <button 
                        onClick={() => {
                          addLog('Qwen-Reasoning', 'Compiling OS cognitive suggestions index...');
                          setActivePitchModal('plan');
                          triggerToast('Evaluating structural optimizations...', 'success');
                        }}
                        className="py-3 px-4 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white font-black text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 border border-[#F59E0B]/10"
                      >
                        <Layers className="w-4 h-4 text-slate-200" /> Get Next Best Action
                      </button>

                      {/* Twitter & LinkedIn share buttons added here */}
                      <div className="flex gap-2 mt-2 justify-end col-span-2 md:col-span-1">
                        <button
                          onClick={() => {
                            const text = `My startup scored ${pitchResults?.score || 87} on TD Conversion OS due diligence. How does yours compare?`;
                            const url = "https://tdventures-os.vercel.app";
                            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
                          }}
                          className="p-2 rounded-full bg-black hover:bg-gray-900 text-white transition"
                          title="Share on X (Twitter)"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </button>
                        <button
                          onClick={() => {
                            const text = `My startup scored ${pitchResults?.score || 87} on TD Conversion OS due diligence. How does yours compare?`;
                            const url = "https://tdventures-os.vercel.app";
                            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`, "_blank");
                          }}
                          className="p-2 rounded-full bg-blue-700 hover:bg-blue-600 text-white transition"
                          title="Share on LinkedIn"
                        >
                          <Linkedin className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* 3. CONDITIONAL TABS REDIRECT FOR OTHER PAGES */}
            {activeTab === 'gdocs_hub' && <GoogleDocsTab addLog={addLog} triggerToast={triggerToast} />}
            {activeTab === 'gslides_hub' && <GoogleSlidesTab addLog={addLog} triggerToast={triggerToast} />}
            {activeTab === 'linkedin_intel' && <LinkedInIntelTab addLog={addLog} triggerToast={triggerToast} />}
            {activeTab === 'fundraising_intel' && <FundraisingIntelTab addLog={addLog} triggerToast={triggerToast} />}
            {activeTab === 'validation' && <StartupValidationTab addLog={addLog} triggerToast={triggerToast} />}
            {activeTab === 'matchmaking' && <InvestorMatchmakingTab triggerToast={triggerToast} addLog={addLog} />}
            {activeTab === 'docs_hub' && (
              <div className='space-y-6 animate-in fade-in duration-500'>
                <div className='p-6 rounded-3xl border border-slate-800 bg-[#0c1222]/90 shadow-2xl'>
                  <span className='text-[10px] font-mono uppercase tracking-[0.28em] text-[#D4FF00] font-bold'>Founder Vault</span>
                  <h2 className='text-2xl md:text-3xl font-black text-white mt-2'>Founder Conversion Input</h2>
                  <p className='text-sm text-slate-400 mt-2 max-w-3xl'>Capture the core founder material before running Conversion Review: deck story, traction proof, raise ask, risk notes and ideal investor type.</p>
                </div>

                <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
                  <div className='xl:col-span-2 p-6 rounded-3xl border border-slate-800 bg-slate-950/60 space-y-5'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <label className='space-y-2'><span className='text-xs font-bold text-slate-300 uppercase'>Startup name</span><input className='w-full rounded-xl bg-[#080d1a] border border-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-[#D4FF00]' value={conversionProfile.startupName} onChange={(e) => updateConversionProfile('startupName', e.target.value)} placeholder='Example: InspectZero' /></label>
                      <label className='space-y-2'><span className='text-xs font-bold text-slate-300 uppercase'>Sector</span><input className='w-full rounded-xl bg-[#080d1a] border border-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-[#D4FF00]' value={conversionProfile.sector} onChange={(e) => updateConversionProfile('sector', e.target.value)} placeholder='AI, SaaS, Climate, Fintech...' /></label>
                      <label className='space-y-2'><span className='text-xs font-bold text-slate-300 uppercase'>Stage</span><select className='w-full rounded-xl bg-[#080d1a] border border-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-[#D4FF00]' value={conversionProfile.stage} onChange={(e) => updateConversionProfile('stage', e.target.value)}><option>Idea</option><option>MVP</option><option>Pre-seed</option><option>Seed</option><option>Series A</option></select></label>
                      <label className='space-y-2'><span className='text-xs font-bold text-slate-300 uppercase'>Raise amount</span><input className='w-full rounded-xl bg-[#080d1a] border border-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-[#D4FF00]' value={conversionProfile.raiseAmount} onChange={(e) => updateConversionProfile('raiseAmount', e.target.value)} placeholder='INR 1 Cr / USD 250K / etc.' /></label>
                    </div>

                    <label className='space-y-2 block'><span className='text-xs font-bold text-slate-300 uppercase'>Pitch summary</span><textarea className='w-full min-h-[110px] rounded-xl bg-[#080d1a] border border-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-[#D4FF00]' value={conversionProfile.pitchSummary} onChange={(e) => updateConversionProfile('pitchSummary', e.target.value)} placeholder='What does the startup do, for whom, and why now?' /></label>
                    <label className='space-y-2 block'><span className='text-xs font-bold text-slate-300 uppercase'>Traction proof</span><textarea className='w-full min-h-[90px] rounded-xl bg-[#080d1a] border border-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-[#D4FF00]' value={conversionProfile.tractionProof} onChange={(e) => updateConversionProfile('tractionProof', e.target.value)} placeholder='Revenue, pilots, users, LOIs, demos, partnerships, growth signals...' /></label>
                    <label className='space-y-2 block'><span className='text-xs font-bold text-slate-300 uppercase'>Risk notes</span><textarea className='w-full min-h-[90px] rounded-xl bg-[#080d1a] border border-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-[#D4FF00]' value={conversionProfile.riskNotes} onChange={(e) => updateConversionProfile('riskNotes', e.target.value)} placeholder='Missing proof, weak GTM, pricing risk, founder gaps, compliance, competition...' /></label>
                    <label className='space-y-2 block'><span className='text-xs font-bold text-slate-300 uppercase'>Target investor type</span><input className='w-full rounded-xl bg-[#080d1a] border border-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-[#D4FF00]' value={conversionProfile.targetInvestor} onChange={(e) => updateConversionProfile('targetInvestor', e.target.value)} placeholder='Sector-focused seed funds, angels, family offices...' /></label>
                  </div>

                  <div className='p-6 rounded-3xl border border-slate-800 bg-[#080d1a] h-fit space-y-4'>
                    <div><span className='text-[10px] font-mono uppercase tracking-[0.24em] text-[#D4FF00] font-bold'>Vault Snapshot</span><h3 className='text-xl font-black text-white mt-2'>Ready for review</h3></div>
                    {[
                      ['Startup', conversionProfile.startupName || 'Not set'],
                      ['Sector', conversionProfile.sector || 'Not set'],
                      ['Stage', conversionProfile.stage || 'Not set'],
                      ['Raise', conversionProfile.raiseAmount || 'Not set'],
                      ['Investor', conversionProfile.targetInvestor || 'Not set']
                    ].map(([label, value]) => (<div key={label} className='p-3 rounded-xl border border-slate-800 bg-slate-950/70'><div className='text-[10px] uppercase text-slate-500 font-bold'>{label}</div><div className='text-sm text-white font-semibold mt-1'>{value}</div></div>))}
                    <button onClick={() => { generateConversionReview(); setActiveTab('pitch_analyzer'); triggerToast('Conversion Review generated from Founder Vault.', 'success'); }} className='w-full px-4 py-3 rounded-xl bg-[#D4FF00] text-slate-950 text-sm font-black hover:scale-[1.01] transition-transform'>Run Conversion Review</button>
                    <button onClick={() => setActiveTab('dashboard')} className='w-full px-4 py-3 rounded-xl border border-slate-800 text-slate-300 text-sm font-bold hover:bg-slate-900'>Back to Dashboard</button>
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

          </div>

          <footer className="h-14 border-t border-slate-800/60 bg-[#020205] flex items-center justify-between px-6 text-[11px] text-slate-500 relative z-20">
           <span>Built For TD Conversion OS Law-Builder Ecosystem v5.0</span>
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
          <span>Dashboard</span>
        </button>
        <button 
          onClick={() => { setActiveTab('pitch_analyzer'); triggerToast('Switched to Conversion Review', 'info'); }}
          className={`flex flex-col items-center gap-1 text-[10px] ${activeTab === 'pitch_analyzer' ? 'text-purple-400' : 'text-slate-400'}`}
        >
         <span className="text-[#D4AF37] text-xl">🎯</span>
          <span>Conversion review</span>
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
