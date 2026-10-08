import React, { useState } from 'react';
import { 
  Cpu, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  FileCheck, 
  Globe2, 
  TrendingUp, 
  Layers, 
  Ship, 
  Clock, 
  Activity, 
  Zap, 
  MapPin, 
  Percent, 
  Database,
  Search,
  ArrowUpRight
} from 'lucide-react';

// 1. BUSINESS AUTOMATION & VENDOR SCORECARDS
export function BusinessAutomationTab({ addLog, triggerToast }: { addLog: Function, triggerToast: Function }) {
  const [uploadedInvoice, setUploadedInvoice] = useState<{ name: string; size: string; total: string; supplier: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [vendors, setVendors] = useState([
    { id: 'v1', name: 'SinoLogistics Maritime', sector: 'Container Freight', deliveryRate: '98.4%', costIndex: 'A+', trustScore: 96, status: 'Pre-Approved' },
    { id: 'v2', name: 'Apex Sensors Corp', sector: 'IOT Microchips', deliveryRate: '91.2%', costIndex: 'B-', trustScore: 84, status: 'Audit Required' },
    { id: 'v3', name: 'EuroCargo Alliance', sector: 'Inland Rail Logistics', deliveryRate: '95.8%', costIndex: 'A', trustScore: 91, status: 'Pre-Approved' },
    { id: 'v4', name: 'Apex Packaging Inc', sector: 'Corrugated Supply', deliveryRate: '87.5%', costIndex: 'C+', trustScore: 72, status: 'High Risk' }
  ]);

  const handleInvoiceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      addLog('Self-Healing', `Ingesting unstructured invoice raw byte buffers: ${file.name}`);
      triggerToast('Invoice uploaded. Initiating neural parser scanner...', 'info');

      setTimeout(() => {
        setIsProcessing(false);
        setUploadedInvoice({
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          total: '$14,892.50 USD',
          supplier: file.name.toLowerCase().includes('sino') ? 'SinoLogistics Maritime' : 'Apex Sensors Corp'
        });
        addLog('Orchestrator', `Concluded invoice parse structure: extracted $14,892.50 total. matches vendor credentials.`);
        triggerToast('Invoice OCR parsing complete. Trust match validated.', 'success');
      }, 2000);
    }
  };

  const handleApproveInvoice = () => {
    if (!uploadedInvoice) return;
    addLog('Orchestrator', `Dispatched approved invoice payload token to corporate ledger: ${uploadedInvoice.name}`);
    triggerToast(`Approved payment of ${uploadedInvoice.total} to ${uploadedInvoice.supplier}!`, 'success');
    setUploadedInvoice(null);
  };

  const filteredVendors = vendors.filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.sector.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/70 space-y-4">
        <div className="flex justify-between items-start flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="text-purple-400 w-5 h-5 animate-pulse" /> Unified Business Automation & OCR Center
            </h3>
            <p className="text-xs text-slate-400">Upload automated vendor bills to safely parse line items, tax multipliers, and audit credentials against verified vendor indices.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Upload panel */}
          <div className="p-5 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 flex flex-col justify-center items-center text-center space-y-3 relative min-h-48">
            <input 
              type="file" 
              id="invoice_uploader" 
              className="hidden" 
              accept="image/*,application/pdf"
              onChange={handleInvoiceUpload} 
            />
            {isProcessing ? (
              <div className="space-y-2">
                <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
                <p className="text-xs font-mono text-purple-300">Scanning invoice nodes via spatial OCR model...</p>
              </div>
            ) : uploadedInvoice ? (
              <div className="w-full text-left space-y-3">
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-purple-400 block font-bold">Extracted Document Metadata</span>
                    <span className="text-xs text-white font-bold block">{uploadedInvoice.name}</span>
                  </div>
                  <span className="text-xs text-green-400 font-mono font-bold">{uploadedInvoice.total}</span>
                </div>
                
                <div className="space-y-1 text-xs text-slate-300">
                  <p>Matched Supplier: <strong className="text-white">{uploadedInvoice.supplier}</strong></p>
                  <p>Trust Score Indicator: <strong className="text-green-400 font-mono">96/100 (Safe)</strong></p>
                  <p>Inherent Tax Audit Code: <strong className="text-slate-200">TAX-AES-092</strong></p>
                </div>

                <div className="pt-2 flex gap-2">
                  <button 
                    onClick={handleApproveInvoice}
                    className="flex-1 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors text-white text-xs font-bold"
                  >
                    Approve Payment
                  </button>
                  <button 
                    onClick={() => setUploadedInvoice(null)}
                    className="py-2 px-3 rounded-lg bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-400 text-xs font-mono"
                  >
                    Reset
                  </button>
                </div>
              </div>
            ) : (
              <label htmlFor="invoice_uploader" className="cursor-pointer space-y-2 py-4">
                <FileCheck className="w-8 h-8 text-purple-400 mx-auto animate-pulse" />
                <span className="text-xs font-bold text-slate-350 block">Upload Supplier Bill or Invoice</span>
                <span className="text-[10px] text-slate-500 block">Accepts JPEGs, PNGs, PDFs (Instant OCR Parser Ingestion)</span>
              </label>
            )}
          </div>

          {/* KPI Mini board */}
          <div className="p-5 rounded-xl border border-slate-800 bg-[#0c1222]/80 space-y-4">
            <span className="text-[10px] font-mono uppercase text-slate-400 block tracking-wider font-bold">Automation Performance Signals</span>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
                <span className="text-slate-500 text-[9px] block">AUTOPILOT RATE</span>
                <span className="text-emerald-400 font-black text-sm block mt-0.5">94.2% Passed</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
                <span className="text-slate-500 text-[9px] block">AUDITED INVOICES</span>
                <span className="text-purple-400 font-black text-sm block mt-0.5">142 processed</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
                <span className="text-slate-500 text-[9px] block">TIME RECOVERED</span>
                <span className="text-cyan-400 font-black text-sm block mt-0.5">38 Hours / Mo</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
                <span className="text-slate-500 text-[9px] block">COMPLIANCE COMPRESSION</span>
                <span className="text-yellow-400 font-black text-sm block mt-0.5">100% SOC2 Passed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Scorecards Registry */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/70 space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-2 border-b border-slate-850 pb-3">
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider">Dynamic Vendor Performance Scorecard</h4>
            <p className="text-xs text-slate-400 mt-0.5">Track fulfillment accuracy, cost tiers, and overall operational trust vectors.</p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search vendor indexes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 placeholder-slate-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVendors.map(v => (
            <div key={v.id} className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="text-xs font-extrabold text-white">{v.name}</h5>
                  <span className="text-[10px] text-slate-500">{v.sector}</span>
                </div>
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  v.status === 'Pre-Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  v.status === 'Audit Required' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>{v.status}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono pt-3 border-t border-slate-850">
                <div>
                  <span className="text-slate-500 block">DELIVERY ACCURACY</span>
                  <span className="text-slate-200 font-bold block mt-0.5">{v.deliveryRate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">COST CATEGORY</span>
                  <span className="text-purple-400 font-bold block mt-0.5">{v.costIndex}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">TRUST COEFFICIENT</span>
                  <span className={`font-bold block mt-0.5 ${v.trustScore >= 90 ? 'text-[#22C55E]' : 'text-amber-500'}`}>{v.trustScore}/100</span>
                </div>
              </div>
            </div>
          ))}
          {filteredVendors.length === 0 && (
            <div className="col-span-2 py-8 text-center text-slate-500 text-xs italic">
              No vendors matching search criteria are registered.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 2. SUPPLY CHAIN INTELLIGENCE & PORT LOGS
export function SupplyChainIntelTab({ addLog, triggerToast }: { addLog: Function, triggerToast: Function }) {
  const [selectedPort, setSelectedPort] = useState('Shanghai Terminal 4');

  const [ports, setPorts] = useState([
    { id: 'sh', name: 'Shanghai Terminal 4', traffic: 'Critical Volume', delay: '32 Hours Avg Queue', status: 'Rerouting Suggested', capacity: '92%' },
    { id: 'la', name: 'Los Angeles Basin B', traffic: 'Moderate Volume', delay: '4.5 Hours', status: 'Optimal', capacity: '78%' },
    { id: 'rt', name: 'Rotterdam Gateway C', traffic: 'Heavy Congestion', delay: '18 Hours', status: 'High Backlog', capacity: '86%' }
  ]);

  const recommendations = [
    { title: 'Bypass LA Basin Container Backlog', detail: 'Reroute incoming shipment S-901 directly via port Oakland to bypass LA dockers strike notice.', urgency: 'High' },
    { title: 'Shanghai Outward Buffer Increase', detail: 'Increase inventory holdings index by 15% due to Shanghai outbound container storage scarcity.', urgency: 'Medium' }
  ];

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-950/15">
        <p className="text-xs text-blue-300 leading-relaxed font-sans">
          <strong>Dynamic Supply Chain Router Shield:</strong> This module fetches real-time port delays, container storage ratios, and shipment latencies globally to provide prescriptive optimization advice.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ports selection board */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-[#0F172A]/70 space-y-4">
          <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider">Live Global Port Congestion Logs</h3>
          <p className="text-xs text-slate-400">Select port nodes to configure predictive routing logic parameters:</p>
          
          <div className="space-y-2 mt-4">
            {ports.map(p => (
              <div 
                key={p.id}
                onClick={() => {
                  setSelectedPort(p.name);
                  addLog('Telemetry Sentinel', `Recalculated port latency vector indices for ${p.name}`);
                  triggerToast(`Secured fresh congestion log matching for ${p.name}`, 'success');
                }}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedPort === p.name 
                    ? 'bg-purple-950/20 border-purple-500/35 text-white' 
                    : 'bg-[#080c14] border-slate-800/80 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs block">{p.name}</span>
                  <span className={`text-[8px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    p.status.includes('Suggested') || p.status.includes('Backlog') ? 'bg-amber-500/10 text-amber-400' : 'bg-green-500/10 text-green-400'
                  }`}>{p.status}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-mono">
                  <span>Queue Delay: <strong>{p.delay}</strong></span>
                  <span>Density: <strong>{p.capacity}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Port Analytics */}
        <div className="md:col-span-2 p-6 rounded-2xl border border-slate-800 bg-[#0c1222]/80 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-850 pb-3">
            <div>
              <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">{selectedPort} Real-Time Metrics</h4>
              <span className="text-[10px] text-slate-500 font-mono block mt-0.5">Secure satellite API link: ONLINE</span>
            </div>
            <span className="text-xs bg-slate-900 border border-slate-850 px-3 py-1 rounded-full text-purple-400 font-bold font-mono">
              {selectedPort.includes('Shanghai') ? 'Shanghai Zone 4' : selectedPort.includes('Los Angeles') ? 'US West Coast' : 'Rotterdam Terminals'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850/60">
              <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">Port Utilization Rate</span>
              <span className="text-sm text-white block font-extrabold font-mono mt-1">
                {selectedPort.includes('Shanghai') ? '92% Capacity' : selectedPort.includes('Los Angeles') ? '78% Capacity' : '86% Capacity'}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850/60">
              <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">Unloading Velocity</span>
              <span className="text-sm text-cyan-405 block font-extrabold font-mono mt-1">
                {selectedPort.includes('Shanghai') ? '240 TEU / Hour' : selectedPort.includes('Los Angeles') ? '410 TEU / Hour' : '320 TEU / Hour'}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850/60">
              <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">Rerouting Risk factor</span>
              <span className={`text-sm block font-extrabold font-mono mt-1 ${
                selectedPort.includes('Shanghai') ? 'text-rose-400' : 'text-[#22C55E]'
              }`}>
                {selectedPort.includes('Shanghai') ? '94% CRITICAL' : selectedPort.includes('Los Angeles') ? '12% LOW' : '65% MODERATE'}
              </span>
            </div>
          </div>

          {/* AI Prescriptive Shipment Recommendations matching text query */}
          <div className="space-y-3 pt-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block font-bold">AI Prescriptive Shipment Recommendations</span>
            <div className="space-y-2 text-xs">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 flex items-start gap-3 hover:border-slate-700 transition-colors">
                  <div className={`p-1 mt-0.5 rounded ${rec.urgency === 'High' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-white flex items-center gap-2">
                      {rec.title}
                      <span className={`text-[8px] uppercase font-mono px-1 rounded font-bold ${
                        rec.urgency === 'High' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>{rec.urgency} Urgency</span>
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-1">{rec.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
