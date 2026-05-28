import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  Mic, 
  RotateCcw, 
  Volume2, 
  Check, 
  Copy, 
  Target, 
  FileText, 
  Download, 
  Maximize2, 
  Settings, 
  Play,
  VolumeX,
  MessageSquare,
  Globe2,
  ChevronRight
} from 'lucide-react';
import { SEOOptimizedSuite } from '../types';

// 1. AI CHAT ASSISTANT WIDGET
export function AIChatAssistantWidget({ addLog, triggerToast }: { addLog: Function, triggerToast: Function }) {
  const [messages, setMessages] = useState<Array<{ sender: 'AI' | 'User'; text: string }>>([
    { sender: 'AI', text: 'TD Venture OS sandbox ready. Ask on startup valuation, risk anomaly triggers, or vessel cargo delays.' }
  ]);
  const [chatInput, setChatInput] = useState<string>('');

  const preloadedPrompts = ["Should I invest?", "Analyze risk factors", "Compare target startups", "Predict Year 5 valuation"];

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg = { sender: 'User' as const, text };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    addLog('Orchestrator', `Querying AGI conversational model: "${text}"`);
    
    setTimeout(() => {
      let aiText = '';
      const t = text.toLowerCase();
      if (t.includes('invest')) {
        aiText = 'AGI PREDICTION: Long-term Buy Recommendation for Alpha Horizon Logistics. MoistPMF score calculated at 94/100. Audit shows high credibility indicators. BioGenic Spatial shows severe fake metrics patterns (Strong Pass).';
      } else if (t.includes('risk')) {
        aiText = 'AGI RISK ANALYSIS: Agronomix Spatial risk flags registered at 14% (Low component dependency). Shanghai container delay registers Category 3. BioGenic Spatial shows manipulated data multipliers (Severe High Risk).';
      } else if (t.includes('compare')) {
        aiText = 'EVALUATION COMPARATOR: QuantumSentry Networks (Series B cyber target, 96% profitability score) outperforms BioGenic Spatial Agriculture (Agtech seed candidate, severe metrics inconsistencies detected) in exit thresholds.';
      } else if (t.includes('valuation')) {
        aiText = 'FORECASTED SCALE: Exponential scalability hologram calculates Year 5 cumulative revenue target at $12.5M USD, driven by standard 0.4% transaction take rates on shipments and multi-channel SEO indexing.';
      } else {
        aiText = `TD Ventures AGI Engine confirms check logic completed. Verified zero-knowledge file hashes for target query parameters: "${text}". Recommend running Forensic Auditor check on AgTech spreadsheets.`;
      }

      setMessages(prev => [...prev, { sender: 'AI' as const, text: aiText }]);
      triggerToast('AI Assistant response generated!', 'success');
    }, 1200);
  };

  return (
    <div className="p-4 rounded-2xl border border-slate-800 bg-[#0F172A]/80 shadow-2xl space-y-3 font-sans">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <div className="w-5 h-5 rounded-md bg-[#D4FF00] flex items-center justify-center">
          <Sparkles className="w-3 h-3 text-black animate-pulse" />
        </div>
        <div>
          <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">AGI Chat Assistant</h4>
          <p className="text-[9px] text-slate-500 font-mono">Multimodel Context Active</p>
        </div>
      </div>

      {/* Message Area */}
      <div className="space-y-2.5 max-h-44 overflow-y-auto p-1 scrollbar-thin">
        {messages.map((m, idx) => (
          <div key={idx} className={`space-y-1 ${m.sender === 'User' ? 'text-right' : 'text-left'}`}>
            <span className="text-[8px] uppercase tracking-wider font-mono text-slate-500 block leading-none">
              {m.sender === 'User' ? 'You' : 'TD Ventures OS AI'}
            </span>
            <p className={`inline-block p-2.5 rounded-xl text-xs max-w-[85%] leading-relaxed ${
              m.sender === 'User' 
                ? 'bg-purple-600 text-white rounded-tr-none' 
                : 'bg-slate-900 border border-slate-850 text-slate-300 rounded-tl-none font-sans font-medium'
            }`}>
              {m.text}
            </p>
          </div>
        ))}
      </div>

      {/* Suggested prompts buttons */}
      <div className="flex gap-1.5 flex-wrap overflow-x-auto py-1">
        {preloadedPrompts.map((p, idx) => (
          <button 
            key={idx}
            onClick={() => handleSendMessage(p)}
            className="text-[9px] font-medium bg-slate-950 hover:bg-[#111122] border border-slate-800 hover:border-purple-500/40 text-slate-300 px-2.5 py-1 rounded-full transition-all whitespace-nowrap active:scale-[0.97]"
          >
            {p}
          </button>
        ))}
      </div>

      <div className="flex gap-1.5 pt-1">
        <input 
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask AGI: Should I invest?..."
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(chatInput)}
          className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-sans"
        />
        <button 
          onClick={() => handleSendMessage(chatInput)}
          className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white active:scale-95 transition-all text-xs font-bold"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// 2. AI VOICE COMMAND CONTROLLER
export function AIVoiceCommandWidget({ addLog, triggerToast }: { addLog: Function, triggerToast: Function }) {
  const [recording, setRecording] = useState<boolean>(false);
  const [caption, setCaption] = useState<string>('Voice interface offline. Tap mic to configure voice command routing.');
  const [isPlayingNarration, setIsPlayingNarration] = useState<boolean>(false);

  const startVoiceRecording = () => {
    if (recording) {
      setRecording(false);
      setCaption("Voice Command: Navigate to AGI deep intelligence...");
      addLog('Telemetry Sentinel', 'Decoded vocal command wave successfully. Switched navigation frame context.');
      triggerToast('Voice Navigated to Pitch Analyzer!', 'success');
      return;
    }
    setRecording(true);
    setCaption("Listening for active operator vocal parameters...");
    addLog('Orchestrator', 'Listening on browser microphone permission channel...');
    
    setTimeout(() => {
      setRecording(false);
      setCaption("Decoded: Compare target logistics platforms.");
      triggerToast('AI voice query: Comparing startups!', 'success');
      addLog('Self-Healing', 'Routed vocal task directly: comparing Sea-freight candidate nodes');
    }, 2800);
  };

  const playPitchNarration = () => {
    if (isPlayingNarration) {
      setIsPlayingNarration(false);
      triggerToast('Narration stopped', 'info');
      return;
    }
    setIsPlayingNarration(true);
    addLog('Orchestrator', 'Generating AI Pitch text-to-speech audio narration stream...');
    triggerToast('AI Pitch Narration active: Playing Original Founder Deck Audio...', 'success');
    setTimeout(() => {
      setIsPlayingNarration(false);
    }, 6000);
  };

  return (
    <div className="p-4 rounded-xl border border-slate-800 bg-[#0F172A]/80 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
          <Mic className="text-[#D4FF00] w-4 h-4" /> AI Voice Command Control
        </h4>
        <span className="text-[8px] bg-slate-900 px-2 py-0.5 rounded text-purple-400 font-mono">Neural Audio v5.0</span>
      </div>

      <div className="flex items-center gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
        <button 
  onClick={startVoiceRecording}
  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
    recording 
      ? 'bg-rose-600 animate-ping shadow-lg shadow-rose-600/30 text-white' 
      : 'bg-[#D4FF00] hover:bg-[#E6FF66] text-black active:scale-95'
  }`}
>
  <Mic className="w-5 h-5 text-black" />
</button>

        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-slate-400 font-mono italic truncate">{caption}</p>
          {recording && (
            <div className="flex gap-0.5 mt-1.5 h-3 items-end">
              <span className="w-1 bg-purple-500 h-2 rounded animate-bounce" style={{ animationDelay: '0.1s' }} />
              <span className="w-1 bg-cyan-400 h-3 rounded animate-bounce" style={{ animationDelay: '0.3s' }} />
              <span className="w-1 bg-purple-500 h-1 rounded animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="w-1 bg-pink-500 h-3.5 rounded animate-bounce" style={{ animationDelay: '0.4s' }} />
              <span className="w-1 bg-cyan-400 h-1.5 rounded animate-bounce" style={{ animationDelay: '0.6s', animationDuration: '0.8s' }} />
            </div>
          )}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-[11px]">
        <span className="text-slate-500">Autonomous Narration:</span>
        <button 
          onClick={playPitchNarration}
          className={`px-3 py-1 bg-slate-900 border border-slate-800 rounded hover:bg-slate-850 hover:text-white font-bold inline-flex items-center gap-1.5 ${
            isPlayingNarration ? 'text-green-400' : 'text-slate-300'
          }`}
        >
          {isPlayingNarration ? <Volume2 className="w-3.5 h-3.5 text-green-400 animate-bounce" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          {isPlayingNarration ? 'Playing Narration' : 'Narrate Pitch Deck'}
        </button>
      </div>
    </div>
  );
}

// 3. EDITABLE AD & SEO BANNERS CREATOR (PRESERVING THE ORIGINAL AD-BUILDER ENGINE COHESIVELY)
export function AdSeoCreatorPanel({ 
  adSuite, 
  setAdSuite, 
  handleGenerateAds, 
  selectedTheme, 
  setSelectedTheme, 
  generatingAds, 
  productName, 
  setProductName,
  productDesc, 
  setProductDesc,
  productUrl, 
  setProductUrl,
  targetAudienceInput, 
  setTargetAudienceInput,
  selectedAdSizeName, 
  setSelectedAdSizeName,
  editableHeadline, 
  updateActiveAdContent,
  editableSubheadline, 
  editableCtaText,
  zoomScale, 
  setZoomScale,
  PREMIUM_THEMES 
}: {
  adSuite: SEOOptimizedSuite;
  setAdSuite: Function;
  handleGenerateAds: any;
  selectedTheme: string;
  setSelectedTheme: Function;
  generatingAds: boolean;
  productName: string;
  setProductName: Function;
  productDesc: string;
  setProductDesc: Function;
  productUrl: string;
  setProductUrl: Function;
  targetAudienceInput: string;
  setTargetAudienceInput: Function;
  selectedAdSizeName: keyof typeof adSuite.bannerAdCampaigns;
  setSelectedAdSizeName: Function;
  editableHeadline: string;
  updateActiveAdContent: Function;
  editableSubheadline: string;
  editableCtaText: string;
  zoomScale: number;
  setZoomScale: Function;
  PREMIUM_THEMES: Array<any>;
}) {
  const activeAd = adSuite.bannerAdCampaigns[selectedAdSizeName];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Parameter inputs column */}
      <div className="xl:col-span-1 p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/70 space-y-6">
        <div className="space-y-1 border-b border-slate-800 pb-3">
          <h4 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Target className="text-purple-400 w-4.5 h-4.5" /> Ad & SEO Optimization inputs
          </h4>
          <p className="text-xs text-slate-400">Generate, customize, and audit campaign resources via multi-model OpenRouter calls.</p>
        </div>

        <form onSubmit={handleGenerateAds} className="space-y-4">
          <div>
            <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block">App/Product Name</label>
            <input 
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full bg-[#080d19] border border-slate-800 rounded-lg p-2 mt-1 text-xs text-white focus:outline-none focus:border-purple-500 font-sans"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Description of Value Sourcing</label>
            <textarea 
              value={productDesc}
              rows={3}
              onChange={(e) => setProductDesc(e.target.value)}
              className="w-full bg-[#080d19] border border-slate-800 rounded-lg p-2.5 mt-1 text-xs text-white focus:outline-none focus:border-purple-500 font-sans leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Product Landing url</label>
              <input 
                type="text"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                className="w-full bg-[#080d19] border border-slate-800 rounded-lg p-2 mt-1 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Aesthetic Preset</label>
              <select 
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="w-full bg-[#080d19] border border-slate-800 rounded-lg p-2 mt-1 text-xs text-white"
              >
                {PREMIUM_THEMES.map(theme => (
                  <option key={theme.id} value={theme.id}>{theme.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Target Audience Demographics</label>
            <input 
              type="text"
              value={targetAudienceInput}
              onChange={(e) => setTargetAudienceInput(e.target.value)}
              className="w-full bg-[#080d19] border border-slate-800 rounded-lg p-2 mt-1 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <button 
            type="submit"
            disabled={generatingAds}
            className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-indigo-500 hover:scale-[1.01] active:scale-[0.99] font-bold text-xs uppercase text-white rounded-xl transition-all shadow-lg"
          >
            {generatingAds ? 'Synthesizing Ad Suite...' : 'Generate New Campaign'}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 space-y-3">
          <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Fine-Tune Current Banner</label>
          <div className="space-y-2">
            <div>
              <span className="text-[9px] text-slate-500 font-mono">Headline:</span>
              <input 
                type="text"
                value={editableHeadline}
                onChange={(e) => updateActiveAdContent('headline', e.target.value)}
                className="w-full bg-[#080d19] border border-slate-800 rounded-lg p-2 text-xs text-white"
              />
            </div>
            <div>
              <span className="text-[9px] text-slate-500 font-mono">Sub-headline:</span>
              <input 
                type="text"
                value={editableSubheadline}
                onChange={(e) => updateActiveAdContent('subheadline', e.target.value)}
                className="w-full bg-[#080d19] border border-slate-800 rounded-lg p-2 text-xs text-white"
              />
            </div>
            <div>
              <span className="text-[9px] text-slate-500 font-mono">CTA Button:</span>
              <input 
                type="text"
                value={editableCtaText}
                onChange={(e) => updateActiveAdContent('ctaText', e.target.value)}
                className="w-full bg-[#080d19] border border-slate-800 rounded-lg p-2 text-xs text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preview canvas & code */}
      <div className="xl:col-span-2 space-y-6">
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#0c1222] space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Campaign Creative Preview Workspace</h4>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">Scale: {Math.round(zoomScale * 100)}% • Size: {activeAd?.size || 'Medium Rectangle'}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Template:</span>
              <select 
                value={selectedAdSizeName}
                onChange={(e) => setSelectedAdSizeName(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
              >
                {Object.keys(adSuite.bannerAdCampaigns).map(k => (
                  <option key={k} value={k}>{adSuite.bannerAdCampaigns[k as keyof typeof adSuite.bannerAdCampaigns].size}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Actual visual banner design with patterns */}
          <div className="p-12 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-center overflow-auto max-h-[500px]">
            {activeAd ? (
              <div 
                className="rounded-xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col justify-between p-6 transition-transform"
                style={{
                  width: `${activeAd.width}px`,
                  minHeight: `${activeAd.height}px`,
                  background: `linear-gradient(135deg, ${activeAd.gradientStart} 0%, ${activeAd.gradientEnd} 100%)`,
                  transform: `scale(${zoomScale})`
                }}
              >
                {/* Patterns overlay based on choice */}
                {activeAd.patternType === 'grid' && (
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                )}
                {activeAd.patternType === 'particles' && (
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-radial-gradient from-white/5 to-transparent pointer-events-none" />
                )}
                
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-1.5">
                    <Globe2 className="w-4 h-4 text-purple-400" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">TD Ventures OS</span>
                  </div>

                  <h3 className="text-base font-extrabold text-white tracking-tight leading-snug">{activeAd.headline}</h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{activeAd.subheadline}</p>
                </div>

                <div className="pt-4 flex items-center justify-between relative z-10">
                  <span className="text-[9px] text-slate-500 font-mono">{activeAd.size} format</span>
                  <button 
                    onClick={() => window.open(productUrl, '_blank')}
                    className="px-3.5 py-1.5 bg-white text-black text-[11px] font-extrabold rounded-md shadow-md hover:bg-slate-100 transition-colors"
                  >
                    {activeAd.ctaText}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Select template to preview.</p>
            )}
          </div>
        </div>

        {/* SEO recommendations list */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/70 space-y-4">
          <h4 className="text-xs font-mono uppercase text-slate-400 font-bold block tracking-wider">SEO Recommendations Suite</h4>
          <p className="text-xs text-slate-300">Meta Title suggestion: <strong className="text-white">"{adSuite.title}"</strong></p>
          <p className="text-xs text-slate-300">Meta Description: <span className="text-slate-400 font-sans">"{adSuite.metaDescription}"</span></p>

          <div className="flex gap-1.5 flex-wrap">
            {adSuite.focusKeywords.map((tag, idx) => (
              <span key={idx} className="text-[10px] font-mono bg-indigo-950/40 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-900/30">#{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
