import { 
  Users, 
  Lock, 
  FileText, 
  LayoutDashboard, 
  Coins, 
  Target, 
  Activity, 
  Layers, 
  BrainCircuit, 
  ShieldAlert, 
  Anchor, 
  Cpu, 
  Globe2, 
  Workflow, 
  Search, 
  Flame, 
  ShieldCheck, 
  ListFilter 
} from 'lucide-react';

export const COMPONENT_ROLES = {
  founder: 'Startup Founder',
  investor: 'Investor / VC',
  smb: 'SMB Business',
  admin: 'Admin'
};

export const INITIAL_ALERTS = [
  { id: 'a-1', text: '⚠️ High-risk investment anomaly detected in Agronomix spatial', type: 'danger', time: '1 min ago' },
  { id: 'a-2', text: '🚢 Port Congestion Alert (Shanghai - Category 4 heavy lag)', type: 'warning', time: '5 mins ago' },
  { id: 'a-3', text: '✔ Due Diligence Completed for AlphaHorizon Logistics', type: 'success', time: '12 mins ago' },
  { id: 'a-4', text: '🚫 Forensic anomaly: BioGenic Agriculture shows fake revenue growth curve', type: 'danger', time: '1 hour ago' },
  { id: 'a-5', text: '💰 Hot Seed opportunity: Series A SaaS with 95 PMF score matches criteria', type: 'success', time: '2 hours ago' }
];

export const INITIAL_CHAT_MSGS = [
  { sender: 'AI', text: 'Greetings, Venture Architect. I have initialized the multi-model intelligence sandbox configured by Shivam Chaturvedi. Select standard queries below or ask any question on startup risk, valuation trends, or maritime delays.' }
];

export const SAMPLE_INVESTORS = [
  { id: 'inv-1', name: 'BlueHorizon Ventures', focus: 'AI & Logistical infrastructure', matchScore: '98%', maxCheck: '$5.0M', status: 'High Interest' },
  { id: 'inv-2', name: 'Emberlight Seed Capital', focus: 'AgTech & Space Automation', matchScore: '92%', maxCheck: '$1.5M', status: 'Active Evaluation' },
  { id: 'inv-3', name: 'Pacific Trade Fund', focus: 'Maritime Logistics & SaaS', matchScore: '89%', maxCheck: '$10.0M', status: 'Introduced' },
  { id: 'inv-4', name: 'Vanguard Alpha Networks', focus: 'Zero-Knowledge Security', matchScore: '84%', maxCheck: '$3.5M', status: 'Diligence Stage' }
];

export const PRESET_DOCUMENTS = [
  { id: 'doc-1', name: 'Clean SAFE Note Model Agreement.pdf', size: '1.2 MB', type: 'SAFE Agreement', status: 'Encrypted', hash: 'SHA-256 e84cd12' },
  { id: 'doc-2', name: 'Series A Cap Table Sheet.xlsx', size: '890 KB', type: 'Cap Table', status: 'Audited', hash: 'SHA-256 9422fe9' },
  { id: 'doc-3', name: 'Global Maritime Trade Vessel Logs.json', size: '3.4 MB', type: 'Supply Chain Logs', status: 'Real-time Sync', hash: 'SHA-256 a11b0e3' },
  { id: 'doc-4', name: 'Technical System Whitepaper.docx', size: '2.1 MB', type: 'Core Whitepaper', status: 'Encrypted', hash: 'SHA-256 f9220ee' }
];

export const SOC2_RULES = [
  { id: 'soc2-1', rule: 'Enterprise End-to-End JWT Session Authorization', status: 'Passing', details: 'All backend REST endpoints require bearer JWT validation passes.' },
  { id: 'soc2-2', rule: 'Continuous 2FA Login Simulation Enforcement', status: 'Passing', details: 'Two-Factor Authentication is triggered dynamically for any system configurations changes.' },
  { id: 'soc2-3', rule: 'High-Isolation Client Sandbox Protocols', status: 'Passing', details: 'Unstructured file parser operates in locked isolated memory threads.' },
  { id: 'soc2-4', rule: 'Encrypted Document Storage on Multi-Cloud Webmappers', status: 'Passing', details: 'Files encrypted using symmetric AES-256 blocks before local disk write.' },
  { id: 'soc2-5', rule: 'Live API Rate Limiting Watchdog', status: 'Passing', details: 'Limits open API routing queries to 60 calls per minute per client key.' }
];

export const ROLE_PERMISSIONS_TABLE = [
  { roleName: 'Startup Founder', dashboard: 'Read/Write', pitchAnalyzer: 'Full Access', supplyChain: 'Standard Scope', forensicAI: 'Muted', adminControls: 'Muted' },
  { roleName: 'Investor / VC', dashboard: 'Read/Write', pitchAnalyzer: 'Full Access', supplyChain: 'Full Access', forensicAI: 'Active Hub', adminControls: 'Muted' },
  { roleName: 'SMB Business', dashboard: 'Read/Write', pitchAnalyzer: 'Muted', supplyChain: 'Full Access', forensicAI: 'Muted', adminControls: 'Muted' },
  { roleName: 'Admin', dashboard: 'Full Access', pitchAnalyzer: 'Full Access', supplyChain: 'Full Access', forensicAI: 'Full Access', adminControls: 'Super-User' }
];

export const STATIC_PITCH_DOSSIERS = [
  { 
    name: "Alpha Horizon Logistics", 
    desc: "Maritime automation hub using zero-lag drone coordinates.",
    problem: "High manual container delays in ports due to fragmented communication.",
    market: "Global logistics container transport SaaS market valued at $14.2 Billion.",
    revenue: "SaaS software subscriptions plus 0.4% transaction take rates on shipments.",
    tam: "$14.2B global TAM, addressing $2.1B initial serviceable market.",
    team: "Co-founded by world-class MIT Marine robotics engineer and veteran DHL cargo logistics COO.",
    financial: 'Cash burn rate optimized to $120K/mo. Present cash reserves secure 24-month runway.',
    risks: "Sourcing shipping lanes congestion, sudden port container quarantine regulations.",
    funding: "High funding probability - 94% confidence score based on validation index.",
    match: "92/100 matching score for Seed & Series A logistics specialized funds."
  },
  { 
    name: "QuantumSentry Networks", 
    desc: "Series B target securing zero-knowledge VPN grids for border defense.",
    problem: "Industrial sabotage through edge router firmware manipulation.",
    market: "Sub-sea marine network security valued at $8.8 Billion in high-altitude zones.",
    revenue: "Enterprise software tier licensing, with average contract value of $240K/year.",
    tam: "$8.8B total market, addressing $1.4B high-priority government grids.",
    team: "Former NSA security cryptography architect and Series A exit security software CFO.",
    financial: 'Highly profitable. Positive cashflows maintained with 44% net margins.',
    risks: "Intellectual property infringement lawsuits, international border software compliance.",
    funding: "Extreme funding probability - 96% confidence index.",
    match: "95/100 matching score for cyber-threat defense specialized VC funds."
  },
  { 
    name: "BioGenic Spatial Agriculture", 
    desc: "AgTech SaaS utilizing drone telemetry & automated crops drone sensors.",
    problem: "Sudden seasonal climate drift destroying localized high-yield cash crops.",
    market: "Precision precision agriculture SaaS valued at $5.3 Billion internationally.",
    revenue: "Monthly recurring platform subscriptions of $45 per acre per year.",
    tam: "$5.3B TAM, addressing $800M domestic organic growers crops.",
    team: "Ph.D. Agronomist with 12 organic patents and custom SaaS engineering architect.",
    financial: 'Pre-revenue. Early validation metrics show 90% customer pilot retention rates.',
    risks: "Weather extreme delays, regulatory drone flight licenses in residential limits.",
    funding: "Moderate funding probability - 78% score based on early milestones.",
    match: "82/100 matching score for smart-greentech and agricultural venture trusts."
  }
];
