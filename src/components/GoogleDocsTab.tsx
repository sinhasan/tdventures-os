import React, { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  PlusCircle,
  Search,
  LogOut,
  Send,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  Brain,
  History
} from "lucide-react";
import { googleSignIn, logout, getAccessToken, initAuth, User } from "../firebase";

interface DocHistoryItem {
  id: string;
  title: string;
  createdTime: string;
  viewUrl?: string;
}

export function GoogleDocsTab({
  addLog,
  triggerToast
}: {
  addLog: Function;
  triggerToast: Function;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Load/Read state
  const [targetDocId, setTargetDocId] = useState("");
  const [isFetchingDoc, setIsFetchingDoc] = useState(false);
  const [fetchedDocTitle, setFetchedDocTitle] = useState("");
  const [fetchedDocContent, setFetchedDocContent] = useState("");

  // Write/Draft state
  const [draftTitle, setDraftTitle] = useState("TD Ventures OS - Strategic Investment Memo");
  const [startupName, setStartupName] = useState("Aether Drone Robotics");
  const [startupSegment, setStartupSegment] = useState("Aviation & Defence Tech");
  const [fundingGoal, setFundingGoal] = useState("$2,500,000 (Series Seed)");
  const [milestonesText, setMilestonesText] = useState(
    "1. Prototype telemetry validation in open wind-tunnels.\n2. Pilot operations contract secured with deep sea transport terminals.\n3. Complete ISO-9001 quality audits."
  );
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);
  const [createdDocId, setCreatedDocId] = useState("");
  const [createdDocUrl, setCreatedDocUrl] = useState("");

  // Local storage history of created documents
  const [docHistory, setDocHistory] = useState<DocHistoryItem[]>([]);

  // Initialize Auth
  useEffect(() => {
    initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
        setNeedsAuth(false);
        addLog("Workspace Sentinel", `Google Docs API access handshake synchronized for: ${currentUser.email}`);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
      }
    );

    // Load custom documents sandbox history from localStorage
    try {
      const saved = localStorage.getItem("venture_ai_gdocs_history");
      if (saved) {
        setDocHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not deserialize gdocs history", e);
    }
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    addLog("Workspace Sentinel", "Triggering secure Google Identity popup oauth flow...");
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        setNeedsAuth(false);
        addLog("Workspace Sentinel", `Successfully logged in via Google. Session acquired for: ${result.user.email}`);
        triggerToast("Google Docs access granted!", "success");
      }
    } catch (err: any) {
      console.error("Google login failed", err);
      triggerToast("Failed to authenticate with Google workspace profile.", "error");
      addLog("Workspace Sentinel", `Authentication error: ${err.message || err}`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    const confirm = window.confirm("Are you sure you want to sign out of Google Workspace?");
    if (!confirm) return;

    try {
      await logout();
      setUser(null);
      setToken(null);
      setNeedsAuth(true);
      triggerToast("Google Workspace credentials flushed", "info");
      addLog("Workspace Sentinel", "User disconnected Google Workspace access token.");
    } catch (error) {
      console.error(error);
    }
  };

  // 1. READ GOOGLE DOC
  const fetchGoogleDoc = async (docIdToFetch: string) => {
    const activeId = docIdToFetch.trim();
    if (!activeId) {
      triggerToast("Please enter a valid Google Document ID", "warn");
      return;
    }

    setIsFetchingDoc(true);
    setFetchedDocTitle("");
    setFetchedDocContent("");
    addLog("Workspace Sentinel", `Requesting Document ID metadata from Google: ${activeId}`);

    try {
      const currentToken = token || (await getAccessToken());
      if (!currentToken) {
        setNeedsAuth(true);
        triggerToast("Authentication expired. Re-authenticate with Google.", "warn");
        setIsFetchingDoc(false);
        return;
      }

      const response = await fetch(`https://docs.googleapis.com/v1/documents/${activeId}`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
          "Content-Type": "application/json"
        }
      });

      if (response.status === 401) {
        setNeedsAuth(true);
        throw new Error("Google access token has expired or is unauthorized.");
      }

      if (!response.ok) {
        throw new Error(`Google API returned status ${response.status}: ${response.statusText}`);
      }

      const docObj = await response.json();
      setFetchedDocTitle(docObj.title || "Untitled Google Document");

      // Parse document structural element elements as per docs.md instruction
      let extractedText = "";
      if (docObj.body && docObj.body.content) {
        docObj.body.content.forEach((el: any) => {
          if (el.paragraph && el.paragraph.elements) {
            el.paragraph.elements.forEach((subEl: any) => {
              if (subEl.textRun && subEl.textRun.content) {
                extractedText += subEl.textRun.content;
              }
            });
          }
        });
      }

      setFetchedDocContent(extractedText || "(This Document appeared to contain no readable pure text strings.)");
      addLog("Workspace Sentinel", `Successfully pulled title "${docObj.title}" from Google Cloud workspace.`);
      triggerToast("Google Doc read complete!", "success");
    } catch (err: any) {
      console.error("Fetch Doc Error", err);
      triggerToast(err.message || "Failed to read target document.", "error");
      addLog("Workspace Sentinel", `Failed to read document metadata: ${err.message}`);
    } finally {
      setIsFetchingDoc(false);
    }
  };

  // 2. CREATE AND DRAFT GOOGLE DOC
  const createGoogleDoc = async () => {
    if (!startupName.trim()) {
      triggerToast("Startup name field cannot be empty.", "warn");
      return;
    }

    const confirmed = window.confirm(
      `Confirm Action: Initialize standard workspace handshake to generate and write a brand new Google Document titled "${draftTitle}"?`
    );
    if (!confirmed) return;

    setIsCreatingDoc(true);
    addLog("Workspace Sentinel", `Provisioning a new Google Document on Drive...`);

    try {
      const currentToken = token || (await getAccessToken());
      if (!currentToken) {
        setNeedsAuth(true);
        triggerToast("Google Token expired. Re-authenticate.", "warn");
        setIsCreatingDoc(false);
        return;
      }

      // 1. Create the blank document template
      const createResponse = await fetch("https://docs.googleapis.com/v1/documents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: draftTitle
        })
      });

      if (!createResponse.ok) {
        throw new Error(`Create call failed: Status ${createResponse.status}`);
      }

      const preDoc = await createResponse.json();
      const newDocId = preDoc.documentId;
      const docUrl = `https://docs.google.com/document/d/${newDocId}/edit`;

      addLog("Workspace Sentinel", `Blank Google Doc created with ID: ${newDocId}. Formulating strategic intelligence block text...`);

      // 2. Formulate Venture Investment analysis report body
      const timeStr = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      const writeText = 
`==================================================
        TD Ventures OS • AI PORTAL DOSSIER
==================================================
Date Generated : ${timeStr}
Prepared For   : Investment Syndicate Audit Gate
Subject        : Strategic Venture Brief - ${startupName.toUpperCase()}

1. EXECUTIVE SYNOPSIS & SEGMENT
- Startup Entity : ${startupName}
- Target Segment : ${startupSegment}
- Funding Ask    : ${fundingGoal}

2. CORE COMPETENCY SHIFT & DISPOSITION
Aether systems represents a critical scaling component mapped to deep sector optimization. By combining dynamic heuristics with decentralized execution grids, this business reduces structural friction points across high bandwidth operations.

3. STRATEGIC MILESTONES SECURED:
${milestonesText}

4. RISK ANALYSIS & CONGESTION THRESHOLD
- Regulatory channels lag risk: Medium High
- Multi-lane deployment delays: Managed via AGI Buffer curves
- Direct Capital deployment score: 94/100 (Exceptional Tier)

--------------------------------------------------
End of Document Brief. Mapped securely via cryptographic VentureAI Cloud.
==================================================
`;

      // 3. Populate text utilizing Google Docs batchUpdate action as documented in references/docs.md
      const updateResponse = await fetch(`https://docs.googleapis.com/v1/documents/${newDocId}:batchUpdate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          requests: [
            {
              insertText: {
                text: writeText,
                location: {
                  index: 1
                }
              }
            }
          ]
        })
      });

      if (!updateResponse.ok) {
        throw new Error(`Writing document contents failed: Status ${updateResponse.status}`);
      }

      setCreatedDocId(newDocId);
      setCreatedDocUrl(docUrl);

      // Save to locally synchronized history
      const historyItem: DocHistoryItem = {
        id: newDocId,
        title: draftTitle,
        createdTime: new Date().toLocaleDateString(),
        viewUrl: docUrl
      };

      const updatedHistory = [historyItem, ...docHistory].slice(0, 10);
      setDocHistory(updatedHistory);
      localStorage.setItem("venture_ai_gdocs_history", JSON.stringify(updatedHistory));

      addLog("Workspace Sentinel", `Successfully drafted financial memo in live Google Document: ${draftTitle}`);
      triggerToast("Google Document created & populated!", "success");

    } catch (err: any) {
      console.error(err);
      triggerToast(err.message || "Failed to create investment Google Doc.", "error");
      addLog("Workspace Sentinel", `Create/Edit document error: ${err.message}`);
    } finally {
      setIsCreatingDoc(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* INTRO HERO */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/75 relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-80 h-40 bg-blue-500/5 blur-[100px] pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse" />
              Google Docs Workspace Workspace Hub
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Write professional investment reports, pitch memos, or cap table summaries directly to your Google Workspace account, or extract text from existing files securely in real-time.
            </p>
          </div>

          {/* User Profile / Auth Toggle */}
          {!needsAuth && user ? (
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-2 px-3 self-start md:self-auto">
              <img
                src={user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80"}
                alt="user avatar"
                className="w-7 h-7 rounded-full border border-purple-500/50"
              />
              <div className="text-left leading-tight hidden sm:block">
                <span className="text-[10px] text-white font-extrabold max-w-[120px] truncate block">
                  {user.displayName || "Google User"}
                </span>
                <span className="text-[8px] text-slate-500 font-mono block truncate max-w-[120px]">
                  {user.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                title="Disconnect Google Profile"
                className="text-slate-400 hover:text-rose-400 p-1 hover:bg-slate-950 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span className="text-[9px] uppercase font-mono px-3 py-1 rounded-full border border-yellow-500/30 text-yellow-400 bg-yellow-950/20">
              DISCONNECTED
            </span>
          )}
        </div>
      </div>

      {/* RENDER AUTH BLOCK IF DISCONNECTED */}
      {needsAuth ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-[#0F172A]/40 space-y-4 max-w-2xl mx-auto">
          <ShieldCheck className="w-12 h-12 text-blue-500 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Secure Google Workspace Verification Needed
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              TD Ventures OS integrates direct client-side calls to the official Google Docs API. This protects your enterprise data by never exposing tokens to unauthorized remote server channels.
            </p>
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="gsi-material-button mx-auto"
            style={{
              background: "white",
              border: "1px solid #747775",
              borderRadius: "4px",
              boxSizing: "border-box",
              color: "#1f1f1f",
              cursor: "pointer",
              fontFamily: "'Roboto', arial, sans-serif",
              fontSize: "14px",
              height: "40px",
              letterSpacing: "0.25px",
              outline: "none",
              overflow: "hidden",
              padding: "0 12px",
              position: "relative",
              textAlign: "center",
              verticalAlign: "middle",
              width: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            <div className="gsi-material-button-icon" style={{ height: "20px", width: "20px" }}>
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                style={{ display: "block" }}
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                ></path>
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                ></path>
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                ></path>
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                ></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
            </div>
            <span
              className="gsi-material-button-contents"
              style={{ fontWeight: "500", fontFamily: "sans-serif" }}
            >
              {isLoggingIn ? "Syncing credentials..." : "Sign in with Google"}
            </span>
          </button>
        </div>
      ) : (
        /* CORE WORKSPACE FUNCTIONALITY */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* COLUMN 1 & 2: ACTION PANELS */}
          <div className="lg:col-span-2 space-y-6">
            {/* ACTION A: DRAFT AND EXPORT INTELLIGENCE REPORT */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-[#0c1222] space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <PlusCircle className="text-purple-400 w-4.5 h-4.5" /> AGI Google Doc Report Generator
              </h3>
              <p className="text-xs text-slate-400">
                Populate strategic investment memos or technical whitepapers. The engine generates formatted text, instantiates a cloud Document, and appends the structural files seamlessly.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">Document Title</span>
                  <input
                    type="text"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">Startup Name</span>
                  <input
                    type="text"
                    value={startupName}
                    onChange={(e) => setStartupName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">Business Segment</span>
                  <input
                    type="text"
                    value={startupSegment}
                    onChange={(e) => setStartupSegment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">Funding Target / Round</span>
                  <input
                    type="text"
                    value={fundingGoal}
                    onChange={(e) => setFundingGoal(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">Milestones & Growth Objectives</span>
                <textarea
                  rows={3}
                  value={milestonesText}
                  onChange={(e) => setMilestonesText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500 text-left font-serif leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                <div className="text-[10px] text-slate-500">
                  ⚡ Auto-saves output parameters live inside OAuth Client
                </div>
                <button
                  type="button"
                  disabled={isCreatingDoc}
                  onClick={createGoogleDoc}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  {isCreatingDoc ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Drafting document on Google GDrive...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Create & Export Google Doc
                    </>
                  )}
                </button>
              </div>

              {createdDocUrl && (
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/25 space-y-2 mt-2 animate-fade-in text-xs">
                  <div className="flex items-center gap-2 text-purple-300 font-extrabold">
                    <CheckCircle2 className="w-4.5 h-4.5 text-green-400" />
                    <span>Google Document Compiled Successfully!</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Document index recorded: <code className="text-white bg-slate-900 px-1 py-0.5 rounded font-mono select-all">{createdDocId}</code>
                  </p>
                  <a
                    href={createdDocUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 font-bold hover:underline py-1"
                  >
                    Open Document directly in Google Docs <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* ACTION B: READ EXISTING GOOGLE DOCS */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-[#0F172A]/70 space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Search className="text-blue-400 w-4.5 h-4.5" /> Pull & Sync Existing Google Document
              </h3>
              <p className="text-xs text-slate-400">
                Type the official URL or 44-character <strong>Google Doc ID</strong> key below to pull structured legal contracts or core pitches for dynamic local audit.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste Google Doc ID (e.g. 1Q4L93Fm_2C-S_hA78bW...)"
                  value={targetDocId}
                  onChange={(e) => {
                    // Extract ID if user pastes full URL
                    const raw = e.target.value;
                    const match = raw.match(/\/d\/([a-zA-Z0-9-_\\]+)/);
                    if (match && match[1]) {
                      setTargetDocId(match[1]);
                    } else {
                      setTargetDocId(raw);
                    }
                  }}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-blue-500 font-mono"
                />
                <button
                  type="button"
                  disabled={isFetchingDoc}
                  onClick={() => fetchGoogleDoc(targetDocId)}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl font-bold text-xs uppercase tracking-wider text-white flex items-center gap-1.5"
                >
                  {isFetchingDoc ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Search className="w-3.5 h-3.5" />
                  )}
                  Fetch
                </button>
              </div>

              {/* RENDER FETCHED DOCUMENT READOUT */}
              {fetchedDocTitle && (
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3 mt-4 text-xs animate-fade-in">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400 animate-pulse" />
                      <strong className="text-white text-xs block">{fetchedDocTitle}</strong>
                    </div>
                    <span className="text-[8px] font-mono text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-500/10">
                      SUCCESSFULLY SYNCED
                    </span>
                  </div>

                  <div className="max-h-60 overflow-y-auto p-3 bg-[#0F172A]/50 rounded-lg border border-slate-900/40 text-left font-serif text-[11px] leading-relaxed text-slate-350 whitespace-pre-line select-all scrollbar-thin">
                    {fetchedDocContent}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 3: HISTORIC DIRECTORIES & TEMPLATES */}
          <div className="space-y-6">
            <div className="p-5 rounded-2xl border border-slate-800 bg-[#0F172A]/70 space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <History className="text-purple-400 w-4.5 h-4.5" /> Workspace Document History (New docs only)
              </h3>
              <p className="text-[11px] text-slate-400">
                Track and instantly re-open recently authored pitch memos compiled in this workspace.
              </p>

              {docHistory.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-slate-800 rounded-xl text-xs text-slate-500 italic space-y-1">
                  <span>No documents compiled yet.</span>
                  <span className="block text-[9px]">Draft a Venture brief on the left!</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {docHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/40 space-y-1.5 hover:border-purple-500/30 transition-all text-xs"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <strong className="text-white truncate block max-w-[140px]" title={item.title}>
                          {item.title}
                        </strong>
                        <span className="text-[9px] font-mono text-slate-505">{item.createdTime}</span>
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        <button
                          onClick={() => {
                            setTargetDocId(item.id);
                            fetchGoogleDoc(item.id);
                          }}
                          className="text-[10px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-0.5"
                        >
                          Read here
                        </button>
                        {item.viewUrl && (
                          <a
                            href={item.viewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-purple-400 hover:text-purple-300 font-bold flex items-center gap-0.5"
                          >
                            Google Docs <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sandbox Quick Templates / Guide FAQ */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-[#0c1222] space-y-4 text-xs leading-relaxed">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="text-cyan-400 w-4.5 h-4.5" /> Sandbox Document Guide
              </h4>

              <div className="space-y-3 text-slate-400 text-[11px]">
                <div className="p-3 bg-slate-950 rounded-xl space-y-1">
                  <strong className="text-slate-200 block">How do I get a Document ID?</strong>
                  <p>In Google Docs, open any file. The URL is structured like:</p>
                  <code className="text-[10px] text-purple-400 bg-slate-900 p-1 rounded font-mono truncate block mt-1">
                    .../document/d/<b>[DOCUMENT_ID_HERE]</b>/edit
                  </code>
                  <p className="mt-1">You can copy-paste the whole URL directly into our reader field!</p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl space-y-1">
                  <strong className="text-slate-200 block">Least-Privilege Encryption</strong>
                  <p>Only the designated scopes authorized in the Workspace card are accessible. Unrelated GDrive files remain fully secured.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
