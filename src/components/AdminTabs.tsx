import React, { useState } from 'react';
import { 
  Users, 
  Cpu, 
  Settings, 
  Lock, 
  ShieldCheck, 
  ListFilter, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Plus, 
  Key,
  Database
} from 'lucide-react';
import { ROLE_PERMISSIONS_TABLE, SOC2_RULES } from '../data';

// 1. USER SEATS MANAGEMENT
export function UserManagementTab({ triggerToast, addLog }: { triggerToast: Function, addLog: Function }) {
  const [operators, setOperators] = useState([
    { id: '1', email: 'vx@tdventures.in', name: 'Venture X TD Ventures', access: 'Super-User', seats: 'Root Owner', state: 'Active' },
    { id: '2', email: 'invest@tdventures.in', name: 'Investor TD Ventures', access: 'Read/Write', seats: 'Invest TD Ventures Seat', state: 'Active' },
    { id: '3', email: 'pitch@tdventures.in', name: 'Pitch TD Ventures', access: 'Read Only', seats: 'Pitch TD Ventures Seat', state: 'Active' }
  ]);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');

  const handleAddSeat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newName) return;
    const item = {
      id: Date.now().toString(),
      email: newEmail,
      name: newName,
      access: 'Read/Write',
      seats: 'Standard Team Seat',
      state: 'Active'
    };
    setOperators(prev => [...prev, item]);
    addLog('Orchestrator', `Provisioned standard seat subscription permission for: ${newEmail}`);
    triggerToast(`Provisioned team seat for ${newName}!`, 'success');
    setNewEmail('');
    setNewName('');
  };

  const handleRevokeSeat = (id: string, name: string) => {
    if (id === '1') {
      triggerToast('Root Workspace privileges cannot be revoked!', 'warn');
      return;
    }
    setOperators(prev => prev.filter(x => x.id !== id));
    addLog('Orchestrator', `Revoked workspace access seat for developer ID ${id}`);
    triggerToast(`Revoked access privileges for ${name}`, 'info');
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/70 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="text-purple-400 w-5 h-5" /> Team Seat Allocator Registry
          </h3>
          <p className="text-xs text-slate-400">Add or revoke workspace permission flags for team compliance scouts and VC analysts.</p>
        </div>

        <form onSubmit={handleAddSeat} className="flex gap-2 text-xs flex-wrap">
          <input 
            type="text"
            required
            placeholder="Operator Name..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-purple-500"
          />
          <input 
            type="email"
            required
            placeholder="Operator email Address..."
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-purple-500"
          />
          <button 
           type="submit"
           style={{ backgroundColor: '#D4FF00', color: '#000000', fontWeight: 'bold' }}
           className="px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 hover:opacity-80"
          >
           <Plus className="w-3.5 h-3.5" /> Invite Analyst
          </button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs bg-[#0c1222]/80">
          <thead className="bg-[#0e1628] text-slate-400 uppercase font-mono text-[9px] border-b border-slate-800">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">License Type</th>
              <th className="p-4">Authorization Privilege</th>
              <th className="p-4">State</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {operators.map(item => (
              <tr key={item.id} className="hover:bg-slate-900/40">
                <td className="p-4 font-bold text-white">{item.name}</td>
                <td className="p-4 font-mono select-all text-slate-400">{item.email}</td>
                <td className="p-4">{item.seats}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    item.access === 'Super-User' ? 'bg-purple-500/15 text-purple-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.access}
                  </span>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 text-[10px] text-green-400">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> {item.state}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleRevokeSeat(item.id, item.name)}
                    className="text-rose-400 hover:text-rose-300 hover:underline font-mono text-[10px] uppercase font-bold"
                  >
                    Revoke privileges
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 2. AI MULTI-GATEWAY MONITORING
export function AIMonitoringTab({ selectedModel }: { selectedModel: string }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { name: 'Gateway Root (Owl)', model: 'openrouter/owl-alpha', tokenLimit: '1M tokens/min', isCurrent: selectedModel === 'owl' },
          { name: 'Unified Qwen Model', model: 'qwen/qwen-2.5-72b', tokenLimit: '800k tokens/min', isCurrent: selectedModel === 'qwen' },
          { name: 'GPT-4o Mini Interface', model: 'openai/gpt-4o-mini', tokenLimit: '1.2M tokens/min', isCurrent: selectedModel === 'openai' },
          { name: 'DeepSeek Chat System', model: 'deepseek/deepseek-chat', tokenLimit: '600k tokens/min', isCurrent: selectedModel === 'deepseek' }
        ].map((gate, idx) => (
          <div key={idx} className={`p-4 rounded-xl border ${
            gate.isCurrent ? 'border-purple-500 bg-purple-950/15' : 'border-slate-800 bg-[#0c1222]/80'
          } relative overflow-hidden`}>
            {gate.isCurrent && (
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-purple-600 text-white font-mono text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full animate-pulse">
                Active Router
              </div>
            )}
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{gate.name}</h4>
            <p className="text-[10px] text-slate-500 font-mono mt-1 select-all">{gate.model}</p>
            <div className="pt-4 border-t border-slate-800 mt-4 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Limit Quotient:</span>
              <span className="text-white font-bold">{gate.tokenLimit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/70 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-2">Live Token Consumption Wave</h3>
          <p className="text-xs text-slate-400">Total volume usage over past 24 hours (aggregated OpenRouter queries):</p>
          <div className="h-44 bg-slate-950 rounded-xl border border-slate-800 p-4 flex items-end justify-between gap-1.5 mt-4 relative">
            <div className="absolute inset-x-0 bottom-4 border-b border-dashed border-slate-850" />
            {[12, 18, 44, 28, 62, 89, 74].map((v, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 z-10">
                <div 
                  className="w-full rounded-t bg-gradient-to-t from-indigo-900 to-purple-600"
                  style={{ height: `${v}%` }}
                />
                <span className="text-[8px] text-slate-500 font-mono">H{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Active API Heartbeat</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[9px] text-slate-500 font-mono uppercase block font-bold">API latency</span>
              <span className="text-sm font-extrabold text-cyan-400 block font-mono mt-0.5">18 ms (Buffer OK)</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[9px] text-slate-500 font-mono uppercase block font-bold">Watchdog status</span>
              <span className="text-sm font-extrabold text-emerald-400 block font-mono mt-0.5">100% Online</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[9px] text-slate-500 font-mono uppercase block font-bold">Invocations Count</span>
              <span className="text-sm font-extrabold text-white block font-mono mt-0.5">4,892 Queries</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[9px] text-slate-500 font-mono uppercase block font-bold">Active JWT Keys</span>
              <span className="text-sm font-extrabold text-[#ffd700] block font-mono mt-0.5">9 Verified keys</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. SECURITY CENTER & SOC2 MONITORING
export function SecurityCenterTab() {
  const [mfaSimulated, setMfaSimulated] = useState<boolean>(true);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/70 space-y-4">
        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Enterprise SOC2 Rules Audit</h3>
        <p className="text-xs text-slate-400">TD Ventures OS sandbox complies with standardized SaaS end-to-end continuous monitoring rules audits.</p>

        <div className="space-y-3 mt-4">
          {SOC2_RULES.map(ruleObj => (
            <div key={ruleObj.id} className="p-4 rounded-xl border border-slate-800 bg-[#080d1a] flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  {ruleObj.rule}
                  <span className="text-[8px] font-mono text-emerald-400 px-1.5 py-0.2 rounded font-bold bg-emerald-500/10">PASSING_SAAS</span>
                </h4>
                <p className="text-[11px] text-slate-400 leading-normal mt-1">{ruleObj.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-slate-800 bg-[#0c1222] flex flex-col justify-between">
        <div className="space-y-4">
          <span className="text-[10px] font-mono uppercase text-purple-400 tracking-widest block font-bold">Active Security Status</span>
          
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">JWT Authentication Session:</span>
              <span className="text-emerald-400 font-mono font-bold">Active JWT SECURE</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Client Encrypted Uploads:</span>
              <span className="text-emerald-400 font-mono font-bold">AES-256 Symmetric</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Continuous MFA enforcement:</span>
              <button 
                onClick={() => setMfaSimulated(!mfaSimulated)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                  mfaSimulated ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'
                }`}
              >
                {mfaSimulated ? '✓ ENFORCED' : '🚫 DISABLED'}
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Authentication key pairs are managed via high-isolation sandboxes. No secrets are stored in plain, protecting against unauthorized data breach paths.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-850 space-y-2">
          <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold text-slate-500">Security Watchdog Directive:</span>
          <p className="text-xs text-slate-300 italic">“Secure zero-knowledge token synchronization confirmed. All audit log files are locked and verified by TD Ventures.”</p>
        </div>
      </div>
    </div>
  );
}

// 4. ROLE PERMISSIONS TABLE
export function RolePermissionsTab() {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-purple-950/15 rounded-xl border border-purple-500/20">
        <p className="text-xs text-purple-300">
          <strong>Access Authorization Matrix:</strong> Standardize permissions grids across the platform roles layout. Super-users can lock or modify these guidelines.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs bg-[#0c1222]/80">
          <thead className="bg-[#0e1628] text-slate-400 uppercase font-mono text-[9px] border-b border-slate-800">
            <tr>
              <th className="p-4">Platform User Role</th>
              <th className="p-4">Dashboard Context</th>
              <th className="p-4">AGI Pitch Analyzer</th>
              <th className="p-4">Global Trade Sourcing</th>
              <th className="p-4">Forensic AI module</th>
              <th className="p-4">Admin privileges</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {ROLE_PERMISSIONS_TABLE.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-900/40">
                <td className="p-4 font-bold text-white">{row.roleName}</td>
                <td className="p-4">{row.dashboard}</td>
                <td className="p-4">{row.pitchAnalyzer}</td>
                <td className="p-4">{row.supplyChain}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    row.forensicAI === 'Active Hub' || row.forensicAI === 'Full Access' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {row.forensicAI}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    row.adminControls === 'Super-User' ? 'bg-purple-500/15 text-purple-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {row.adminControls}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
