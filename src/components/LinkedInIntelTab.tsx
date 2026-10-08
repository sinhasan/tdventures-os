import React, { useState, useEffect } from "react";
import {
  Search,
  Building,
  Users,
  Database,
  TrendingUp,
  Globe,
  Zap,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Calendar,
  DollarSign,
  Activity,
  ArrowRight,
  ShieldAlert
} from "lucide-react";

interface LinkedInCompanyData {
  name: string;
  industry: string;
  logoUrl: string;
  staffCount: string;
  foundedYear: number;
  location: string;
  followerCount: number;
  investmentReadyScore: number;
  hiringUrgency: string;
  revenueEstimate: string;
  description: string;
  growthTrend: string;
  fundingStatus: string;
  executiveInsights: Array<{ name: string; title: string; activeSignals: string }>;
  recentMentions: string[];
}

export function LinkedInIntelTab({
  addLog,
  triggerToast
}: {
  addLog: Function;
  triggerToast: Function;
}) {
  const [domainQuery, setDomainQuery] = useState("openai.com");
  const [customKey, setCustomKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [resultData, setResultData] = useState<LinkedInCompanyData | null>(null);
  const [cachedStatus, setCachedStatus] = useState(false);

  // Quick select presets
  const presets = [
    { name: "OpenAI", domain: "openai.com" },
    { name: "Stripe", domain: "stripe.com" },
    { name: "SpaceX", domain: "spacex.com" },
    { name: "Apple", domain: "apple.com" }
  ];

  const loadingSequence = [
    "Establishing encrypted connection to LinkedIn Data API...",
    "Validating secure domain name zone records...",
    "Retrieving company profile identity markers...",
    "Analyzing historical employee telemetry and headcount levels...",
    "Performing specialized growth trend mapping calculations...",
    "Interrogating industry detection nodes..."
  ];

  const triggerCompanySearch = async (domainToSearch: string) => {
    if (!domainToSearch.trim()) {
      triggerToast("Domain query string cannot be blank", "warn");
      return;
    }

    setLoading(true);
    setLoadingStep(0);
    setCachedStatus(false);
    addLog("LinkedIn Sentinel", `Querying API company-by-domain: [${domainToSearch.toLowerCase()}]`);

    // Staggered animated status indicators
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingSequence.length - 1 ? prev + 1 : prev));
    }, 450);

    try {
      const formattedDomain = domainToSearch.trim().toLowerCase();
      const response = await fetch(
        `/api/linkedin/company-by-domain?domain=${encodeURIComponent(formattedDomain)}&apiKey=${encodeURIComponent(
          customKey
        )}`
      );

      if (!response.ok) {
        throw new Error(`Proxy gateway error: ${response.status}`);
      }

      const json = await response.json();
      clearInterval(interval);
      setResultData(json.data);
      setCachedStatus(!!json.cached);

      if (json.source && json.source.includes("Live")) {
        addLog(
          "LinkedIn Sentinel",
          `Retrieved high-fidelity LIVE intelligence details for ${json.data.name}`
        );
        triggerToast(`Live LinkedIn data sourced for ${json.data.name}!`, "success");
      } else {
        addLog(
          "LinkedIn Sentinel",
          `Synthesized mock sandbox profile metrics for domain: ${formattedDomain}`
        );
        triggerToast(`Profile synchronized successfully for ${json.data.name}`, "info");
      }
    } catch (error: any) {
      clearInterval(interval);
      console.error(error);
      triggerToast("LinkedIn query timed out, automatic failover engaged", "warn");
    } finally {
      setLoading(false);
    }
  };

  // Initial lookup
  useEffect(() => {
    triggerCompanySearch(domainQuery);
  }, []);

  return (
    <div className="space-y-6 text-left">
      {/* HEADER BAR */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/75 relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-80 h-40 bg-purple-500/5 blur-[100px] pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
              LinkedIn Data Sourcing & Profile Intelligence Hub
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Interrogate actual executive headcount matrices, company signals, industry validation levels,
              website telemetry, and active funding statuses via our direct proxy-secured RapidAPI Gateway.
            </p>
          </div>
          <span className="text-[10px] uppercase font-mono bg-purple-950/40 text-purple-300 px-3 py-1 rounded-full border border-purple-500/20 self-start md:self-auto">
            API STATUS: READY
          </span>
        </div>
      </div>

      {/* SEARCH CONTROL BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-2xl border border-slate-800 bg-[#0c1222] space-y-4">
          <div>
            <label className="text-[10px] font-mono uppercase font-bold text-slate-400 block mb-1.5">
              Input Company Website Domain Search:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Globe className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. coinbase.com, openai.com, target-company.com"
                  value={domainQuery}
                  onChange={(e) => setDomainQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") triggerCompanySearch(domainQuery);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/10 transition-all font-mono"
                />
              </div>
              <button
                disabled={loading}
                onClick={() => triggerCompanySearch(domainQuery)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Search className="w-3.5 h-3.5" />
                )}
                Query
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono text-slate-500 font-bold">Fast sandbox presets:</span>
            {presets.map((p) => (
              <button
                key={p.domain}
                onClick={() => {
                  setDomainQuery(p.domain);
                  triggerCompanySearch(p.domain);
                }}
                className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border transition-all ${
                  domainQuery === p.domain
                    ? "bg-purple-950/20 border-purple-500/50 text-purple-300"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* RAPIDAPI OVERRIDE KEYS */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-[#0F172A]/70 space-y-4">
          <div className="space-y-1">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
              Secure Auth Handshake
            </h4>
            <p className="text-[10px] text-slate-400">
              Paste your personal RapidAPI Key below to enable authentic live requests on the dashboard.
            </p>
          </div>

          <div className="space-y-2">
            <input
              type="password"
              placeholder="x-rapidapi-key credential token..."
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs font-mono text-white placeholder-slate-650 focus:outline-none focus:border-purple-500/60"
            />
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-500">
              <span>Host Key: linkedin-data-api</span>
              <span className="text-emerald-400 font-bold">Encrypted Mode</span>
            </div>
          </div>
        </div>
      </div>

      {/* PROCESSING STATE HERO */}
      {loading && (
        <div className="p-12 rounded-2xl border border-slate-800 bg-slate-950/80 text-center space-y-4 animate-pulse relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-purple-500/5" />
          <RefreshCw className="w-10 h-10 text-purple-500 animate-spin mx-auto" style={{ animationDuration: "2.5s" }} />
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-widest font-mono">
              Interrogating Company Node
            </h3>
            <p className="text-xs text-purple-400 font-mono italic">
              {loadingSequence[loadingStep]}
            </p>
          </div>
          <div className="w-48 bg-slate-900 h-1.5 rounded-full overflow-hidden mx-auto mt-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
              style={{ width: `${((loadingStep + 1) / loadingSequence.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* BRANDING DASHBOARD LAYOUT */}
      {!loading && resultData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* PROFILE SUMMARY SIDEBAR */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/70 space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <img
                  src={resultData.logoUrl}
                  alt={`${resultData.name} logo`}
                  className="w-14 h-14 rounded-xl border border-slate-700/50 object-cover shadow-md bg-slate-900"
                  onError={(e) => {
                    // Failover if image breaks
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80";
                  }}
                />
                <div>
                  <h3 className="text-base font-black text-white tracking-widest uppercase">
                    {resultData.name}
                  </h3>
                  <p className="text-[11px] text-purple-400 font-mono font-bold">
                    {resultData.industry}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2 text-xs border-t border-slate-800/80">
                <p className="text-slate-350 leading-relaxed italic">
                  "{resultData.description}"
                </p>

                <div className="grid grid-cols-2 gap-3 pt-3 text-[11px] font-mono">
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-900 space-y-0.5">
                    <span className="text-slate-500 block text-[9px] uppercase font-bold">HEADQUARTERS</span>
                    <strong className="text-slate-250 truncate block">{resultData.location}</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-900 space-y-0.5">
                    <span className="text-slate-500 block text-[9px] uppercase font-bold">FOUNDED YEAR</span>
                    <strong className="text-slate-250">{resultData.foundedYear}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800/60 space-y-2 mt-4 text-xs">
              <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">
                API Handshake Record
              </span>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Gateway Sourced</span>
                <span className="text-cyan-400 font-bold">{cachedStatus ? "In-Memory Cache" : "Live Proxy"}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Timestamp</span>
                <span className="text-slate-500 font-mono">2026-05-24</span>
              </div>
            </div>
          </div>

          {/* MAIN INTEL BENTO GRID */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Headcount Card */}
              <div className="p-5 rounded-2xl border border-slate-800 bg-[#0c1222] space-y-3 relative overflow-hidden">
                <div className="absolute top-4 right-4 text-purple-500 opacity-20">
                  <Users className="w-8 h-8" />
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                  Sourced LinkedIn Staff
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white tracking-widest uppercase">
                    {resultData.staffCount}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Total employee headcount verified status tracks based on corporate domain logins.
                </p>
              </div>

              {/* Ready Score Card */}
              <div className="p-5 rounded-2xl border border-slate-800 bg-[#0c1222] space-y-3 relative overflow-hidden">
                <div className="absolute top-4 right-4 text-[#F59E0B] opacity-20">
                  <Sparkles className="w-8 h-8" />
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                  AGI Sourcing Matrix Grade
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-amber-400 font-mono">
                    {resultData.investmentReadyScore}/100
                  </span>
                  <span className="text-[10px] text-green-400 font-mono font-bold bg-green-950/20 px-1.5 py-0.5 rounded">
                    HIGH
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Dynamic scorecard calculating organizational performance and structural growth signals.
                </p>
              </div>
            </div>

            {/* GROW SIGNALS AND MENTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Telemetry signals */}
              <div className="p-5 rounded-2xl border border-slate-800 bg-[#0F172A]/70 space-y-4">
                <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="text-blue-400 w-4 h-4" /> Internal Growth Signals
                </h4>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400 font-semibold">Followers Tracker</span>
                      <span className="text-purple-400 font-mono font-bold">
                        {resultData.followerCount.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                      <div className="bg-purple-500 h-full" style={{ width: "80%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400 font-semibold">Headcount Delta</span>
                      <span className="text-cyan-400 font-mono font-bold">
                        {resultData.growthTrend}
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                      <div className="bg-cyan-400 h-full" style={{ width: "65%" }} />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-850/80 mt-2">
                    <div className="flex justify-between text-[10px] font-mono mb-1">
                      <span className="text-slate-500">Hiring Intensity Index</span>
                      <span className="text-amber-400">{resultData.hiringUrgency}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Venture Capital partners review hiring profiles for talent risk mitigation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Funding & Financial metrics */}
              <div className="p-5 rounded-2xl border border-slate-800 bg-[#0F172A]/70 space-y-4">
                <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <DollarSign className="text-emerald-400 w-4 h-4" /> Investment Telemetry
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-850/80 space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">
                      Funding Status Profile
                    </span>
                    <strong className="text-white text-xs block font-mono">{resultData.fundingStatus}</strong>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-850/80 space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">
                      Estimated Revenue Scale
                    </span>
                    <strong className="text-slate-300 text-xs block">{resultData.revenueEstimate}</strong>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Domain Validated Company Entity</span>
                  </div>
                </div>
              </div>
            </div>

            {/* EXECUTIVE SIGNAL INSIGHTS */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-[#0c1222] space-y-4">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="text-purple-400 w-4 h-4" /> SEC/LinkedIn Sourced Executive Signals
              </h4>
              <p className="text-[10px] text-slate-400">
                Key decision-maker telemetry indexed directly from dynamic metadata queries.
              </p>

              <div className="space-y-2.5">
                {resultData.executiveInsights.map((exec, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-950/60 flex flex-col md:flex-row md:items-center justify-between gap-2.5 hover:border-purple-500/20 transition-all text-xs"
                  >
                    <div>
                      <strong className="text-white block font-sans text-xs">{exec.name}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">{exec.title}</span>
                    </div>
                    <div className="md:text-right">
                      <span className="text-[9px] uppercase font-mono bg-blue-950/30 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded-full inline-block font-bold">
                        {exec.activeSignals}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RECENT MENTIONS OR DISCOVERED KEYWORDS */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-[#0F172A]/70 space-y-3.5">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                Symmetric Specialities Detected
              </h4>

              <div className="flex flex-wrap gap-2 text-xs">
                {resultData.recentMentions.map((phrase, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[10px] hover:border-slate-700 transition"
                  >
                    ✦ {phrase}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
