import React, { useState, useEffect } from 'react';
import { 
  Workflow, 
  Search, 
  Flame, 
  Anchor, 
  BarChart3, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Activity, 
  Zap, 
  Compass, 
  ShieldAlert,
  Play,
  RefreshCw
} from 'lucide-react';
import { DealFlowItem } from '../types';

// 1. DEAL FLOW INTELLIGENCE HUB
export function DealFlowTab({ 
  dealFlow, 
  setDealFlow, 
  addLog, 
  triggerToast 
}: { 
  dealFlow: DealFlowItem[], 
  setDealFlow: React.Dispatch<React.SetStateAction<DealFlowItem[]>>, 
  addLog: Function, 
  triggerToast: Function 
}) {
  const handlesStatusChange = (id: string, newStatus: 'Strong Buy' | 'Buy' | 'Hold' | 'Pass') => {
    setDealFlow(prev => prev.map(item => {
      if (item.id === id) {
        addLog('Orchestrator', `Deals pipeline updated for ${item.companyName}: switched status directly to ${newStatus.toUpperCase()}`);
        triggerToast(`Updated ${item.companyName} status to ${newStatus}`, 'success');
        return { ...item, status: newStatus };
      }
      return item;
    }));
  };

  const statuses = ['Strong Buy', 'Buy', 'Hold', 'Pass'] as const;

  return (
    <div className="space-y-6">
      <div className="p-4 bg-[#0F172A]/70 rounded-xl border border-slate-800">
        <p className="text-xs text-slate-300">
          <strong>Interactive Sourcing Pipeline Matrix:</strong> Click status pill badges on any card to update deal prioritizations. Watchdog logs log changes in telemetry automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statuses.map(st => {
          const items = dealFlow.filter(item => item.status === st);
          return (
            <div key={st} className="p-4 rounded-2xl bg-[#090e1a] border border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className={`text-[11px] font-mono font-extrabold uppercase px-2 py-0.5 rounded ${
                  st === 'Strong Buy' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' :
                  st === 'Buy' ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' :
                  st === 'Hold' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' :
                  'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                }`}>{st}</span>
                <span className="text-xs font-bold text-slate-500">{items.length}</span>
              </div>

              <div className="space-y-3">
                {items.length === 0 ? (
                  <div className="py-8 text-center text-slate-600 text-[10px] italic font-mono">No target deals</div>
                ) : (
                  items.map(deal => (
                    <div key={deal.id} className="p-3.5 rounded-xl border border-slate-800 bg-[#0F172A]/60 space-y-2 hover:border-purple-500/30 transition-all group">
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-bold text-white tracking-tight">{deal.companyName}</h4>
                        <span className="text-[9px] text-slate-500 font-mono">{deal.lastUpdated}</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Sector: <strong className="text-slate-300">{deal.sector}</strong> • Val: <strong className="text-slate-300">{deal.valuation}</strong></p>
                      
                      <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-800/60 font-mono">
                        <span className="text-purple-400">AGI Score: <strong>{deal.agiScore}/100</strong></span>
                        <span className={deal.riskLevel === 'Low' ? 'text-green-400' : 'text-amber-500'}>{deal.riskLevel} Risk</span>
                      </div>

                      {/* Drop selectors to move around columns */}
                      <div className="pt-2 flex items-center gap-1 flex-wrap">
                        {statuses.filter(x => x !== st).map(x => (
                          <button 
                            key={x}
                            onClick={() => handlesStatusChange(deal.id, x)}
                            className="text-[8px] bg-slate-900 text-slate-400 hover:text-white px-1.5 py-0.5 rounded border border-slate-800"
                          >
                            To {x}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 2. FORENSIC AI MODULE
export function ForensicAITab({ addLog, triggerToast }: { addLog: Function, triggerToast: Function }) {
  const [analyzingForensics, setAnalyzingForensics] = useState<boolean>(false);
  const [auditTarget, setAuditTarget] = useState<string>('BioGenic Spatial Agriculture');
  const [forensicResults, setForensicResults] = useState<{
    score: number;
    metricsAudit: string;
    manipulationRisk: 'High' | 'Medium' | 'Low';
    checks: Array<{ name: string; status: 'Failed' | 'Passed'; details: string }>;
  } | null>(null);

  const handleRunForensic = () => {
    setAnalyzingForensics(true);
    addLog('Qwen-Reasoning', `Probing cashbooks, founder logs, and revenue metrics anomalies for ${auditTarget}...`);
    
    setTimeout(() => {
      setAnalyzingForensics(false);
      let targetScore = 54;
      let riskVal: 'High' | 'Medium' | 'Low' = 'High';
      let resultsList: Array<{ name: string; status: 'Failed' | 'Passed'; details: string }> = [];

      if (auditTarget.includes('BioGenic')) {
        targetScore = 44;
        riskVal = 'High';
        resultsList = [
          { name: 'Revenue Manipulation Checking', status: 'Failed', details: 'Unusually linear month-over-month sales progression indicates fake manually multiplied data rows.' },
          { name: 'Inherent Financial Inconsistencies Check', status: 'Failed', details: 'Discrepancy detected between bank statement reserves and tax sheet reports.' },
          { name: 'Team Credibility Authentication', status: 'Passed', details: 'Core Ph.D. diplomas validated with MIT registers.' },
          { name: 'Fake Metrics Multipliers Scan', status: 'Failed', details: 'Active customer dashboard usage counts matched duplicate IP clusters.' }
        ];
        addLog('Telemetry Sentinel', 'Forensic warning status flags raised: severe metrics inconsistencies found.');
        triggerToast('Severe inconsistencies discovered in target data!', 'warn');
      } else {
        targetScore = 95;
        riskVal = 'Low';
        resultsList = [
          { name: 'Revenue Manipulation Checking', status: 'Passed', details: 'Normal statistical variances matches live product subscription logs.' },
          { name: 'Inherent Financial Inconsistencies Check', status: 'Passed', details: '100% correlation across ledgers and merchant bank streams.' },
          { name: 'Team Credibility Authentication', status: 'Passed', details: 'Founders resume checked securely with zero discrepancies.' },
          { name: 'Fake Metrics Multipliers Scan', status: 'Passed', details: 'Unique daily active accounts correlate perfectly.' }
        ];
        addLog('Telemetry Sentinel', 'Forensic report completed: low-risk pristine ledger metrics.');
        triggerToast('Forensic evaluation reports pristine records!', 'success');
      }

      setForensicResults({
        score: targetScore,
        metricsAudit: `Concluded strategic quantitative cash-flow matching audits for ${auditTarget}. Evaluators flags raised on metrics matching anomalies.`,
        manipulationRisk: riskVal,
        checks: resultsList
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/70 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Search className="text-purple-400 w-5 h-5" /> Enterprise Forensic AI Auditor
        </h3>
        <p className="text-xs text-slate-400">Isolate fake metrics multipliers, revenue inconsistencies, and team identity fabrication before capital deployment.</p>

        <div className="flex gap-3 max-w-lg">
          <select 
            value={auditTarget}
            onChange={(e) => setAuditTarget(e.target.value)}
            className="flex-1 bg-[#080d19] border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500 appearance-none bg-no-repeat"
            style={{
              backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>")`,
              backgroundPosition: 'calc(100% - 10px) center',
              backgroundSize: '16px font'
            }}
          >
            <option value="BioGenic Spatial Agriculture">BioGenic Spatial Agriculture (AgTech High-Risk)</option>
            <option value="QuantumSentry Networks">QuantumSentry Networks (Cybersecurity Series B)</option>
            <option value="Alpha Horizon Logistics">Alpha Horizon Logistics (Seed Candidate)</option>
          </select>

          <button 
            disabled={analyzingForensics}
            onClick={handleRunForensic}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50"
          >
            {analyzingForensics ? 'Probing Ledgers...' : 'Run Forensic Audit'}
          </button>
        </div>
      </div>

      {analyzingForensics && (
        <div className="p-12 text-center border border-slate-800 rounded-2xl bg-slate-900/40 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-rose-500 animate-pulse" />
          <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <span className="text-xs text-purple-400 font-mono block">AGI Audit Watchdog analyzing transaction history balances...</span>
        </div>
      )}

      {forensicResults && !analyzingForensics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-3">
            {forensicResults.checks.map((ch, idx) => (
              <div 
                key={idx} 
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  ch.status === 'Failed' 
                    ? 'border-rose-950/40 bg-rose-950/10 text-white' 
                    : 'border-slate-800 bg-[#0c1222] text-slate-300'
                }`}
              >
                {ch.status === 'Failed' ? (
                  <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-xs font-extrabold flex items-center gap-2">
                    {ch.name} 
                    <span className={`text-[8px] font-mono uppercase px-1.5 py-0.2 rounded font-bold ${
                      ch.status === 'Failed' ? 'bg-rose-500/15 text-rose-400' : 'bg-emerald-500/15 text-emerald-400'
                    }`}>{ch.status}</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1">{ch.details}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/70 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Inherent Credibility Quotient</span>
              <h4 className={`text-3xl font-extrabold ${forensicResults.manipulationRisk === 'High' ? 'text-rose-500' : 'text-emerald-400'}`}>
                {forensicResults.score}/100
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">Risk Factor analysis indicates a <strong className="text-white uppercase">{forensicResults.manipulationRisk}</strong> probability of financial discrepancies manipulation.</p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 space-y-1">
              <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold text-slate-500">Forensic Action Directive:</span>
              <span className={`inline-block text-[10px] font-extrabold px-2.5 py-1 rounded-md mt-1 ${
                forensicResults.manipulationRisk === 'High' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
              }`}>
                {forensicResults.manipulationRisk === 'High' ? 'HIGH RISK - PASS' : 'STRONG BUY OPPORTUNITY'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 3. PRESCRIPTIVE AI HUB
export function PrescriptiveAITab({ addLog }: { addLog: Function }) {
  const [targetSector, setTargetSector] = useState<string>('all');

  const prescriptiveLogs = [
    { id: '1', rating: 'Strong Buy Opportunity', sector: 'AI & Logistics', company: 'Alpha Horizon Logistics', desc: 'Accelerate round closure. Sourcing validation signals zero port delays, and customer trials verified.', action: 'Invest' },
    { id: '2', rating: 'High Risk Anomaly', sector: 'AgTech', company: 'BioGenic Spatial Agriculture', desc: 'Manual metrics multiplier patterns detected in quarterly forecast spreadsheets. Discrepancy checked in IRS.', action: 'High Risk' },
    { id: '3', rating: 'Low Confidence Threshold', sector: 'AeroSpace Venture', company: 'Starlight Orbiting Systems', desc: 'Launch calendar delayed 180 days by launch pad malfunction. Adjust cash reserves calculations.', action: 'Low Confidence' },
    { id: '4', rating: 'Operations Optimizer', sector: 'Supply Chain', company: 'Global Logistics Corp', desc: 'Delay Shanghai container loading nodes. Shanghai terminal 4 reports average 32 hours queue delay.', action: 'Delay Shipment' },
    { id: '5', rating: 'Sourcing recommendation', sector: 'Retail Automation', company: 'StockMaster Inc', desc: 'Supply deficit detected in automated Li-ION solid battery packs. Order placement needed.', action: 'Increase Inventory' },
    { id: '6', rating: 'Operational Recommendation', sector: 'Autonomous Hardware', company: 'SensorGrid Technologies', desc: 'Burn rate tracks higher than forecast by 22%. Renegotiate core sensor assembly take rate contracts.', action: 'Reduce Burn Rate' }
  ];

  const filteredLogs = targetSector === 'all' 
    ? prescriptiveLogs 
    : prescriptiveLogs.filter(x => x.sector.toLowerCase().includes(targetSector.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/70 flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Flame className="text-purple-400 w-5 h-5 animate-pulse" /> AGI Prescriptive Engine
          </h3>
          <p className="text-xs text-slate-400">View automated actionable directives to mitigate portfolio slowdown, audit capital drag, and optimize inventory volumes.</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-mono">Filter Sector:</label>
          <select 
            value={targetSector}
            onChange={(e) => setTargetSector(e.target.value)}
            className="bg-[#080d19] border border-slate-800 rounded-lg p-2 text-xs text-white cursor-pointer"
          >
            <option value="all">All Sectors</option>
            <option value="logistics">AI & Logistics</option>
            <option value="agtech">Agtech</option>
            <option value="supply">Supply Chain</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLogs.map(item => (
          <div key={item.id} className="p-5 rounded-2xl border border-slate-800 bg-[#0c1222] flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-bold">{item.company} <span className="font-mono text-slate-500 font-normal">({item.sector})</span></span>
                <span className={`text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded ${
                  item.action === 'Invest' || item.action === 'Strong Buy Opportunity' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' :
                  item.action === 'High Risk' ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' :
                  'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                }`}>{item.rating}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Directive Flag:</span>
              <span className="text-purple-400 font-bold font-sans">“{item.action}”</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. MARITIME INTELLIGENCE SYSTEM
export function MaritimeIntelTab({ addLog, triggerToast }: { addLog: Function, triggerToast: Function }) {
  const [activeVesselId, setActiveVesselId] = useState<string>('VESSEL-OOCL-02');
  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const vesselMeta = {
    'VESSEL-OOCL-02': { name: 'Pacific Venture Vanguard', mmsi: '241113000' },
    'VESSEL-CMA-09': { name: 'Alpha Horizon', mmsi: '228386000' },
    'VESSEL-COS-11': { name: 'Crescent Maritime Alpha', mmsi: '477317200' }
  };

  const [liveData, setLiveData] = useState<{
    eta: string;
    route: string;
    speed: string;
    coordinates: { lat: number; lng: number };
    congestionLevel: string;
    loadVolume: string;
    savingsValue: string;
    delay: string;
    fuelStatus: string;
    alerts: string[];
  }>({
    eta: 'May 28, 14:00',
    route: 'Shenzhen → Los Angeles',
    speed: '18.4 knots',
    coordinates: { lat: 35.6724, lng: 139.6918 },
    congestionLevel: 'Light (Shanghai wait bypass achieved)',
    loadVolume: '890 Semiconductor pallets',
    savingsValue: '$44,000 via AI-Route',
    delay: '0 Hours (On Track)',
    fuelStatus: 'Optimal Integration (92%)',
    alerts: ["Optimal channel locked", "Clear weather forecast"]
  });

  const loadVesselData = async (vesselId: string, apiKeyOverride?: string | null) => {
    setIsLoading(true);
    const meta = vesselMeta[vesselId as keyof typeof vesselMeta];
    const targetKey = apiKeyOverride !== undefined ? apiKeyOverride : customApiKey;
    addLog('Telemetry Sentinel', `Recalculating fuel optimization tracking curves and port ETA vectors for vessel ${meta.name}...`);
    
    try {
      const resp = await fetch(`/api/maritime/vessel-tracker?mmsi=${meta.mmsi}&apiKey=${encodeURIComponent(targetKey || '')}`);
      if (!resp.ok) {
        throw new Error(`Server returned HTTP status ${resp.status}`);
      }
      const json = await resp.json();
      if (json.data) {
        setLiveData(json.data);
        if (json.source && json.source.includes("Live")) {
          triggerToast(`Sourced live MarineTraffic tracking via RapidAPI for ${meta.name}!`, 'success');
        } else {
          triggerToast(`Synced high-accuracy tracking for ${meta.name}`, 'info');
        }
      }
    } catch (err: any) {
      console.error(err);
      triggerToast(`Failover routing engaged for ${meta.name}`, 'warn');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVesselData(activeVesselId);
  }, [activeVesselId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
      <div className="p-5 rounded-2xl border border-slate-800 bg-[#0F172A]/70 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Anchor className="text-purple-400 w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} /> MarineTraffic API Integration
        </h3>
        <p className="text-xs text-slate-400">Select active fleet units below to audit real-time GPS locations, estimated cargo volumes, cargo status indicators, and port congestion thresholds.</p>

        {/* Dynamic RapidAPI key config input option inside UI */}
        <div className="pt-2">
          <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-slate-400 block mb-1">Custom RapidAPI Key (Optional):</span>
          <input 
            type="password" 
            placeholder="Type your rapidapi key..."
            value={customApiKey}
            onChange={(e) => setCustomApiKey(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
          />
          <span className="text-[8px] font-mono text-slate-500 block mt-1">If blank, our backend uses default secure heuristic failover sensors.</span>
        </div>

        <div className="space-y-2 mt-4">
          {Object.entries(vesselMeta).map(([id, meta]) => {
            return (
              <div 
                key={id} 
                onClick={() => setActiveVesselId(id)}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  id === activeVesselId 
                    ? 'bg-purple-950/20 border-purple-500/35 text-white shadow-md' 
                    : 'bg-[#080c14] border-slate-800/80 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold">{meta.name}</span>
                  <span className="text-[10px] font-mono text-purple-400 font-bold">{id}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">MMSI Code: <strong className="text-slate-300 font-mono">{meta.mmsi}</strong></p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="md:col-span-2 p-6 rounded-2xl border border-slate-800 bg-[#0c1222] space-y-6 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] rounded-2xl z-30 flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        )}

        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
              {vesselMeta[activeVesselId as keyof typeof vesselMeta]?.name || 'Pacific Venture Vanguard'} Telemetry Monitor
            </h4>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
              LAT/LNG GPS: {liveData.coordinates?.lat.toFixed(4) || '35.6724'}, {liveData.coordinates?.lng.toFixed(4) || '139.6918'}
            </p>
          </div>
          <span className="text-xs bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800 font-mono text-cyan-400">ETA: {liveData.eta}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/60">
            <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">Vessel Lane</span>
            <span className="text-xs text-white block font-semibold mt-1 truncate">{liveData.route}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/60">
            <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">Inherent Delay</span>
            <span className={`text-xs block font-extrabold mt-1 truncate ${
              liveData.delay?.includes('0 Hours') ? 'text-green-400' : 'text-amber-500'
            }`}>{liveData.delay}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/60">
            <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">Active Cargo Load</span>
            <span className="text-xs text-white block font-semibold mt-1 truncate">{liveData.loadVolume}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/60">
            <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">AI Routing Optimization Savings</span>
            <span className="text-xs text-emerald-400 font-mono block font-bold mt-1 truncate">{liveData.savingsValue}</span>
          </div>
        </div>

        {/* Alerts and Congestion Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/60 space-y-1">
            <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">Port Congestion Monitoring</span>
            <span className="text-xs text-white block font-semibold">{liveData.congestionLevel}</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/60 space-y-1">
            <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">Optimal Fuel Status</span>
            <span className="text-xs text-cyan-400 block font-semibold font-mono">{liveData.fuelStatus}</span>
          </div>
        </div>

        <div className="h-44 bg-slate-950 border border-slate-800/80 rounded-xl relative overflow-hidden p-4 flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.06),transparent)]" />
          {/* Mock sonar scan effect */}
          <div className="absolute w-[300px] h-[300px] border border-purple-500/10 rounded-full animate-ping" />
          <div className="absolute w-[180px] h-[180px] border border-cyan-500/10 rounded-full animate-pulse" />
          
          <div className="relative z-10 text-center space-y-1">
            <Compass className="w-8 h-8 text-purple-400 mx-auto animate-spin" style={{ animationDuration: '10s' }} />
            <span className="text-[10px] text-slate-400 font-mono block">GPS Telemetry Track Overlay Locked</span>
            <span className="text-xs text-white block font-mono font-bold leading-normal">
              ACTIVE CONGESTION WARNINGS: {liveData.alerts?.join(" | ") || "None"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. PORTFOLIO ANALYTICS
export function PortfolioAnalyticsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/70 space-y-4">
        <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider">Asset Allocation Analytics</h3>
        <p className="text-xs text-slate-400">Your total venture allocations mapped by thematic sector multipliers:</p>
        
        <div className="space-y-3 mt-4">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300 font-semibold font-sans">AI & Logistical Telemetry</span>
              <span className="text-purple-400 font-mono font-bold">45% • $110.6M Value</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full w-[45%]" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300 font-semibold font-sans">Zero-Knowledge Defense VPNs</span>
              <span className="text-cyan-400 font-mono font-bold">30% • $73.7M Value</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full w-[30%]" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300 font-semibold font-sans">Agtech Sensors & Farming</span>
              <span className="text-yellow-400 font-mono font-bold">15% • $36.8M Value</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-yellow-400 h-full w-[15%]" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/70 flex flex-col justify-between">
        <div className="space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Dynamic Seed Capital Risk Trends</span>
          <p className="text-xs text-slate-400">Self-healing matrix registers zero capital friction: </p>
          
          <div className="h-44 bg-slate-950 rounded-xl border border-slate-800/80 p-4 flex items-end justify-between gap-1 relative overflow-hidden mt-4">
            <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 to-transparent" />
            {[45, 55, 30, 80, 95, 75, 92].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div 
                  className="w-full rounded-t bg-gradient-to-t from-indigo-900 to-purple-500"
                  style={{ height: `${val}%` }}
                />
                <span className="text-[8px] text-slate-500 font-mono">Q{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
