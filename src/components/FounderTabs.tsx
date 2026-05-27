import React, { useState } from 'react';
import { 
  Coins, 
  Target, 
  CheckCircle2, 
  FileText, 
  BarChart3, 
  Lock, 
  Unlock, 
  Download, 
  Copy, 
  Check, 
  Send, 
  TrendingUp, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { SAMPLE_INVESTORS, PRESET_DOCUMENTS } from '../data';

// 1. FUNDRAISING INTELLIGENCE & SAFE BUILDER MOCK
export function FundraisingIntelTab({ addLog, triggerToast }: { addLog: Function, triggerToast: Function }) {
  const [capVal, setCapVal] = useState<string>('8000000');
  const [discountVal, setDiscountVal] = useState<string>('20');
  const [hasProRata, setHasProRata] = useState<boolean>(true);
  const [compiledSafeText, setCompiledSafeText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const handleCompileSafe = () => {
    addLog('Orchestrator', 'Assembling deterministic legal safe paper nodes...');
    const text = `SIMPLE AGREEMENT FOR FUTURE EQUITY (SAFE)
----------------------------------------
ISSUER: VentureAI Pro Sandbox Candidate
VALUATION CAP: $${Number(capVal).toLocaleString()} USD
DISCOUNT RATE: ${100 - Number(discountVal)}% (Conversion discount of ${discountVal}%)
PRO-RATA RIGHT: ${hasProRata ? 'ENABLED' : 'DISABLED'}
COMPLIANCE LAYER: JWT / SOC2 Cryptographic Lock Active

This Agreement certifies that in exchange for payment by the Investor of the Purchase Amount, the Issuer will issue block options. If there is an Equity Financing before the expiration or termination of this Safe, the Issuer will automatically issue to the Investor a number of shares of SAFE Preferred Stock equal to the Purchase Amount divided by the Conversion Price.

Symmetric AES Hash: SHA-256 e84cd1235bd28ceea99407106
Compiled securely via Shivam Chaturvedi Law-Builder v5.0.`;
    setCompiledSafeText(text);
    triggerToast('Perfect! SAFE template generated successfully!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/70 backdrop-blur-md">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Coins className="text-purple-400 w-5 h-5" /> Detailed Fundraising Sourcing & SAFE Builder
        </h3>
        <p className="text-xs text-slate-400 mt-1">Configure investment parameters to generate customized SAFEs on the fly in compliance with Y Combinator standards.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Valuation Cap ($)</label>
            <input 
              type="number"
              value={capVal}
              onChange={(e) => setCapVal(e.target.value)}
              className="w-full bg-[#070b13] border border-slate-800 rounded-lg p-2 mt-1 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Discount Rate (%)</label>
            <input 
              type="number"
              value={discountVal}
              max="100"
              onChange={(e) => setDiscountVal(e.target.value)}
              className="w-full bg-[#070b13] border border-slate-800 rounded-lg p-2 mt-1 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="flex items-center gap-2 pt-5">
            <input 
              type="checkbox"
              id="prorata"
              checked={hasProRata}
              onChange={(e) => setHasProRata(e.target.checked)}
              className="w-4 h-4 accent-purple-600 rounded bg-[#070b13] border-slate-800"
            />
            <label htmlFor="prorata" className="text-xs text-slate-300 font-medium">Pro-Rata Rights</label>
          </div>
        </div>

        <button 
          onClick={handleCompileSafe}
          className="mt-4 px-4 py-2 bg-purple-600 text-xs font-bold text-white rounded-lg hover:bg-purple-500 transition-colors"
        >
          Compile SAFE Agreement
        </button>
      </div>

      {compiledSafeText && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">legal_safe_structure.txt</span>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(compiledSafeText);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                triggerToast('Copied notes draft!', 'success');
              }}
              className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Code'}
            </button>
          </div>
          <pre className="text-xs text-green-400 font-mono p-3 bg-black/50 rounded-lg overflow-x-auto overflow-y-hidden select-all whitespace-pre">
            {compiledSafeText}
          </pre>
        </div>
      )}
    </div>
  );
}

// 2. STARTUP VALIDATION & PMF CHECKLISTS
export function StartupValidationTab({ addLog, triggerToast }: { addLog: Function, triggerToast: Function }) {
  const [pmfRating, setPmfRating] = useState<number>(88);
  const [metricsChecked, setMetricsChecked] = useState<string[]>([
    'v-1', 'v-3'
  ]);

  const checklistItems = [
    { id: 'v-1', text: 'Problem validated by 30+ enterprise customer interviews', reward: '+15 PMF Points' },
    { id: 'v-2', text: 'Demonstrated initial transaction volume take rate metrics', reward: '+20 PMF Points' },
    { id: 'v-3', text: 'Secured pilot program tracking shipping telemetry links', reward: '+18 PMF Points' },
    { id: 'v-4', text: 'Founder equity terms validated against typical cap models', reward: '+12 PMF Points' },
    { id: 'v-5', text: 'Drafted professional SAFE notes folder locked via client key', reward: '+10 PMF Points' }
  ];

  const handleToggle = (id: string, pointsStr: string) => {
    let newChecked;
    if (metricsChecked.includes(id)) {
      newChecked = metricsChecked.filter(item => item !== id);
      setPmfRating(prev => Math.max(20, prev - 12));
    } else {
      newChecked = [...metricsChecked, id];
      setPmfRating(prev => Math.min(100, prev + 12));
    }
    setMetricsChecked(newChecked);
    addLog('Orchestrator', `Recalculating target PMF validation indexes. Present Rating: ${pmfRating}%`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/70 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="text-green-400 w-5 h-5" /> Quantitative Niche Validator Checklist
        </h3>
        <p className="text-xs text-slate-400">Achieve confidence milestones to qualify for direct matches scoring among premium VC portfolios.</p>

        <div className="space-y-2.5 mt-3">
          {checklistItems.map(item => {
            const isChecked = metricsChecked.includes(item.id);
            return (
              <div 
                key={item.id}
                onClick={() => handleToggle(item.id, item.reward)}
                className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                  isChecked 
                    ? 'bg-purple-950/20 border-purple-500/35 text-white' 
                    : 'bg-[#080c14] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                    isChecked ? 'bg-purple-500 border-purple-400 text-white' : 'border-slate-800 bg-slate-900'
                  }`}>
                    {isChecked && <Check className="w-3 h-3" />}
                  </div>
                  <span className="text-xs font-semibold leading-relaxed">{item.text}</span>
                </div>
                <span className="text-[10px] text-purple-400 bg-purple-500/15 border border-purple-500/20 rounded-md px-1.5 py-0.5 font-mono">{item.reward}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/70 flex flex-col justify-between">
        <div className="space-y-3">
          <span className="text-[10px] font-mono uppercase text-purple-400 block tracking-wider font-bold">Moat Quotient Score</span>
          <h4 className="text-3xl font-extrabold text-white">{pmfRating}/100</h4>
          <p className="text-xs text-slate-400 leading-relaxed">Your validation indicators predict a stellar fundraising probability. Top 5% among enterprise logistics groups.</p>
          
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-4">
            <div 
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-500"
              style={{ width: `${pmfRating}%` }}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-2">
          <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">AGI recommendation:</span>
          <p className="text-xs text-slate-300 italic">“Perfect. Ensure professional legal materials folder matches before launching VC round matchmakers.”</p>
        </div>
      </div>
    </div>
  );
}

// 3. INVESTOR MATCHMAKING
export function InvestorMatchmakingTab({ triggerToast, addLog }: { triggerToast: Function, addLog: Function }) {
  const [contacted, setContacted] = useState<string[]>([]);

  const handleContact = (id: string, name: string) => {
    setContacted(prev => [...prev, id]);
    addLog('Orchestrator', `Forwarded encrypted founder dossier secure packets to ${name}`);
    triggerToast(`Encrypted pitch packet forwarded to ${name}!`, 'success');
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-950/15">
        <p className="text-xs text-blue-300 leading-relaxed font-sans">
          <strong>Autonomous Matchmaking Pipeline Active:</strong> The ecosystem cross-references your TAM parameters, PMF checklist milestones, and revenue model with portfolio allocation trends globally to score investor convenience thresholds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SAMPLE_INVESTORS.map(inv => {
          const isSent = contacted.includes(inv.id);
          return (
            <div key={inv.id} className="p-5 rounded-2xl border border-slate-800 bg-[#0F172A]/70 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-slate-900 border border-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded-full">{inv.focus}</span>
                  <span className="text-xs text-green-400 font-mono font-bold">{inv.matchScore} Match</span>
                </div>
                <h4 className="text-base font-extrabold text-white mt-1">{inv.name}</h4>
                <p className="text-xs text-slate-400">Typical Check Size Cap: <strong className="text-slate-200">{inv.maxCheck}</strong> • Status indicator: <strong className="text-purple-400 font-mono">{inv.status}</strong></p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">Zero-Knowledge Secure Tunnel</span>
                <button 
                  disabled={isSent}
                  onClick={() => handleContact(inv.id, inv.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isSent 
                      ? 'bg-slate-800 text-green-400 cursor-default flex items-center gap-1 border border-green-500/20' 
                      : 'bg-purple-600 hover:bg-purple-500 text-white'
                  }`}
                >
                  {isSent ? '✓ Pitch Forwardeded' : 'Forward Pitch'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 4. DOCUMENTS HUB WITH DIGITAL AES LOCKED VAULT
export function DocumentsHubTab({ addLog, triggerToast }: { addLog: Function, triggerToast: Function }) {
  const [vaultLocked, setVaultLocked] = useState<boolean>(true);
  const [decryptedId, setDecryptedId] = useState<string | null>(null);

  const handleToggleVault = () => {
    const newState = !vaultLocked;
    setVaultLocked(newState);
    addLog('Self-Healing', `AES-256 Sourcing Document Cryptographic storage changed: ${newState ? 'LOCKED' : 'UNSECURED'}`);
    triggerToast(`Symmetric Vault ${newState ? 'Locked' : 'Unlocked'} successfully.`, 'info');
  };

  const handleDecryptFile = (id: string, name: string) => {
    if (vaultLocked) {
      triggerToast('Security protocol warning: unlock secure AES vault first!', 'warn');
      return;
    }
    setDecryptedId(id);
    addLog('Orchestrator', `Decrypted raw secure hash for node file: ${name}`);
    triggerToast(`Decrypted digital signature for ${name}`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/70 backdrop-blur-md flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="text-purple-400 w-5 h-5" /> Symmetric Cryptographic Vault
          </h3>
          <p className="text-xs text-slate-400">Audit your uploaded slides, financial forecast grids, and compiled legal SAFE documents.</p>
        </div>

        <button 
          onClick={handleToggleVault}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 border ${
            vaultLocked 
              ? 'bg-rose-950/20 border-rose-500/30 text-rose-300' 
              : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
          }`}
        >
          {vaultLocked ? <Lock className="w-4 h-4 text-rose-400" /> : <Unlock className="w-4 h-4 text-emerald-400" />}
          {vaultLocked ? 'SECURE VAULT: LOCKED' : 'VAULT: UNLOCKED'}
        </button>
      </div>

      <div className="space-y-3">
        {PRESET_DOCUMENTS.map(doc => {
          const isDecrypted = decryptedId === doc.id;
          return (
            <div key={doc.id} className="p-4 rounded-xl border border-slate-800 bg-[#0F172A]/40 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-slate-400" />
                <div>
                  <h4 className="text-xs font-bold text-white leading-relaxed">{doc.name}</h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{doc.type} • {doc.size}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  vaultLocked 
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                    : isDecrypted 
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20 animate-pulse' 
                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}>
                  {vaultLocked ? 'Encrypted (AES)' : isDecrypted ? 'Decrypted (Live)' : 'Decryption Ready'}
                </span>

                <button 
                  onClick={() => handleDecryptFile(doc.id, doc.name)}
                  className="p-1 px-3 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 text-[11px] font-bold"
                >
                  {vaultLocked ? 'Locked' : isDecrypted ? 'Download File' : 'Decrypt'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 5. FINANCIAL FORECASTING WITH HOLOGRAM SCALABILITY GRAPH
export function FinancialForecastingTab({ addLog }: { addLog: Function }) {
  const [revenues, setRevenues] = useState<number[]>([
    240000, 680000, 1800000, 4200000, 12000000
  ]);

  const handleSliderChange = (idx: number, newVal: number) => {
    setRevenues(prev => {
      const copy = [...prev];
      copy[idx] = newVal;
      return copy;
    });
    addLog('Orchestrator', `Simulating financial forecasting vector shifts. Year ${idx + 1} recalculated.`);
  };

  const yearsLabel = ["Year 1 (Seed)", "Year 2 (Series A)", "Year 3 (Series B)", "Year 4 (Growth)", "Year 5 (Liquidity)"];

  const maxVal = Math.max(...revenues, 1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/70 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <BarChart3 className="text-purple-400 w-5 h-5" /> Holographic Profit Vector Inputs
        </h3>
        <p className="text-xs text-slate-400">Manually slide sliders below to simulate exponential growth patterns for potential investors.</p>

        <div className="space-y-4 mt-4">
          {revenues.map((rev, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">{yearsLabel[idx]}</span>
                <span className="font-mono text-purple-400 font-bold">${rev.toLocaleString()}</span>
              </div>
              <input 
                type="range"
                min="50000"
                max="25000000"
                step="50000"
                value={rev}
                onChange={(e) => handleSliderChange(idx, Number(e.target.value))}
                className="w-full accent-purple-600 bg-slate-950 rounded-lg cursor-pointer h-1.5"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/70 flex flex-col justify-between">
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase text-indigo-400 block tracking-wider font-bold">Exponential Scalability Hologram</span>
          <h4 className="text-xs text-slate-400">SVG predicted curves dynamically updated based on slider weight inputs:</h4>

          {/* Render nice SVG hologram bars */}
          <div className="h-52 bg-slate-950/60 rounded-xl border border-slate-800/70 p-4 flex items-end justify-between gap-2.5 mt-4 relative">
            <div className="absolute inset-x-0 bottom-4 border-b border-dashed border-slate-800" />
            <div className="absolute inset-x-0 top-1/2 border-b border-slate-900" />
            {revenues.map((rev, idx) => {
              const pct = (rev / maxVal) * 80 + 10;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 z-10">
                  <span className="text-[8px] font-mono text-indigo-400">${Math.round(rev/1000)}k</span>
                  <div 
                    className="w-full rounded-t bg-gradient-to-t from-purple-900/60 via-purple-600 to-cyan-400 transition-all duration-300 relative group overflow-hidden"
                    style={{ height: `${pct}%` }}
                  >
                    {/* Glowing effect inside bar */}
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[8px] text-slate-500 font-mono">Y{idx + 1}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>SaaS Software Take Rate: 0.4%</span>
          <span className="text-green-400">Strong scale index</span>
        </div>
      </div>
    </div>
  );
}
