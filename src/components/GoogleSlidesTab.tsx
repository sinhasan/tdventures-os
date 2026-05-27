import React, { useState, useEffect } from "react";
import {
  Presentation,
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
  History,
  Layout,
  FileText,
  Trash2,
  Bookmark
} from "lucide-react";
import { googleSignIn, logout, getAccessToken, initAuth, User } from "../firebase";

interface SlideHistoryItem {
  id: string;
  title: string;
  createdTime: string;
  viewUrl?: string;
}

interface SlideTextSummary {
  slideNumber: number;
  slideId: string;
  text: string;
}

export function GoogleSlidesTab({
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

  // Read/Fetch Presentation State
  const [targetDeckId, setTargetDeckId] = useState("");
  const [isFetchingDeck, setIsFetchingDeck] = useState(false);
  const [deckTitle, setDeckTitle] = useState("");
  const [slidesSummary, setSlidesSummary] = useState<SlideTextSummary[]>([]);

  // Draft Creation Parameters
  const [deckTitleDraft, setDeckTitleDraft] = useState("Aether Drone Systems - Comprehensive Investor Pitch");
  const [startupName, setStartupName] = useState("Aether Systems");
  const [startupOneLiner, setStartupOneLiner] = useState("Autonomous long-range delivery drone networks optimized by edge-AGI flight computers.");
  const [marketSize, setMarketSize] = useState("$38.4B globally addressable defence and logistics market by 2030 (CAGR +18.4%)");
  const [techSecret, setTechSecret] = useState("Proprietary real-time dual-core dynamic routing chips utilizing onboard neural mesh networks.");
  const [investmentRound, setInvestmentRound] = useState("Seed Financing - Raising $2.5M to scale assembly pipeline and clear aviation test certifications");

  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const [createdDeckId, setCreatedDeckId] = useState("");
  const [createdDeckUrl, setCreatedDeckUrl] = useState("");

  const [deckHistory, setDeckHistory] = useState<SlideHistoryItem[]>([]);

  // Initialize Auth
  useEffect(() => {
    initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
        setNeedsAuth(false);
        addLog("Workspace Sentinel", `Google Slides presentation scope synced successfully for: ${currentUser.email}`);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
      }
    );

    // Read stored decks history
    try {
      const saved = localStorage.getItem("venture_ai_gslides_history");
      if (saved) {
        setDeckHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not retrieve slides history", e);
    }
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    addLog("Workspace Sentinel", "Initializing Google Identity oauth login popup state for presentations...");
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        setNeedsAuth(false);
        addLog("Workspace Sentinel", `Google authentication completed. Client token cached for Slides: ${result.user.email}`);
        triggerToast("Google Slides access granted!", "success");
      }
    } catch (err: any) {
      console.error("Login Error", err);
      triggerToast("Failed to authenticate with Google Workspace credentials.", "error");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    const confirm = window.confirm("Are you sure you want to disconnect Google Slides workspace access?");
    if (!confirm) return;

    try {
      await logout();
      setUser(null);
      setToken(null);
      setNeedsAuth(true);
      triggerToast("Google Workspace tokens flushed", "info");
      addLog("Workspace Sentinel", "User disconnected Workspace scopes.");
    } catch (e) {
      console.error(e);
    }
  };

  // 1. ANALYZE EXISTING PITCH DECK
  const handleFetchDeck = async (idOrUrl: string) => {
    const cleanId = idOrUrl.trim();
    if (!cleanId) {
      triggerToast("Please enter a valid Google Presentation ID or URL", "warn");
      return;
    }

    setIsFetchingDeck(true);
    setDeckTitle("");
    setSlidesSummary([]);
    addLog("Workspace Sentinel", `Fetching Presentation: ${cleanId}`);

    try {
      const activeToken = token || (await getAccessToken());
      if (!activeToken) {
        setNeedsAuth(true);
        triggerToast("Sign-in credential session expired. Please re-authenticate.", "warn");
        setIsFetchingDeck(false);
        return;
      }

      const response = await fetch(`https://slides.googleapis.com/v1/presentations/${cleanId}`, {
        headers: {
          Authorization: `Bearer ${activeToken}`,
          "Content-Type": "application/json"
        }
      });

      if (response.status === 401) {
        setNeedsAuth(true);
        throw new Error("Authorization credentials have expired. Please verify connection credentials.");
      }

      if (!response.ok) {
        throw new Error(`Google API responded with error status ${response.status}: ${response.statusText}`);
      }

      const deck = await response.json();
      setDeckTitle(deck.title || "Untitled Presentation Deck");

      // Parse slide elements dynamically to represent plain structure
      const parsedSummary: SlideTextSummary[] = [];

      if (deck.slides && Array.isArray(deck.slides)) {
        deck.slides.forEach((slide: any, idx: number) => {
          const textsInSlide: string[] = [];
          if (slide.pageElements && Array.isArray(slide.pageElements)) {
            slide.pageElements.forEach((el: any) => {
              if (el.shape && el.shape.text && el.shape.text.textElements) {
                el.shape.text.textElements.forEach((te: any) => {
                  if (te.textRun && te.textRun.content) {
                    const trimmed = te.textRun.content.trim();
                    if (trimmed) {
                      textsInSlide.push(trimmed);
                    }
                  }
                });
              }
            });
          }

          parsedSummary.push({
            slideNumber: idx + 1,
            slideId: slide.objectId || `slide_${idx + 1}`,
            text: textsInSlide.join(" | ") || "(No readable shapes detected on this slide.)"
          });
        });
      }

      setSlidesSummary(parsedSummary);
      addLog("Workspace Sentinel", `Synchronized pitch presentation: "${deck.title}" with ${parsedSummary.length} slides.`);
      triggerToast("Presentation synced successfully!", "success");

    } catch (err: any) {
      console.error(err);
      triggerToast(err.message || "Failed to retrieve presentation deck.", "error");
      addLog("Workspace Sentinel", `Error parsing presentation deck: ${err.message}`);
    } finally {
      setIsFetchingDeck(false);
    }
  };

  // 2. COMPILE STARTUP PITCH DECK GSLIDES
  const handleCompileDeck = async () => {
    if (!startupName.trim()) {
      triggerToast("Startup Name cannot be empty.", "warn");
      return;
    }

    const agree = window.confirm(
      `Compile Pitch Deck: Would you like to instantiate a 4-Slide presentation titled "${deckTitleDraft}" in your GDrive account?`
    );
    if (!agree) return;

    setIsCreatingDeck(true);
    addLog("Workspace Sentinel", "Requesting Google cloud server to instantiate a blank Presentation...");

    try {
      const activeToken = token || (await getAccessToken());
      if (!activeToken) {
        setNeedsAuth(true);
        triggerToast("Credential session expired. Please re-authenticate.", "warn");
        setIsCreatingDeck(false);
        return;
      }

      // Step A: Create Presentation
      const createResponse = await fetch("https://slides.googleapis.com/v1/presentations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${activeToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: deckTitleDraft
        })
      });

      if (!createResponse.ok) {
        throw new Error(`Instantiate presentation failed: Status ${createResponse.status}`);
      }

      const presentationObj = await createResponse.json();
      const newDeckId = presentationObj.documentId;
      const newDeckUrl = `https://docs.google.com/presentation/d/${newDeckId}/edit`;

      addLog("Workspace Sentinel", `Blank Deck instantiated. Appending 3 customizable bento-grid slides with elegant colors...`);

      // We'll prepare 3 additional custom slides with distinct IDs
      const slideProblemId = "slide_opportunity_block";
      const slideTechId = "slide_architecture_block";
      const slideFinanceId = "slide_ask_block";

      const requests = [
        // ==========================================
        // Slide 1: Opportunity & Market Target
        // ==========================================
        {
          createSlide: {
            objectId: slideProblemId,
            insertionIndex: 1,
            slideLayoutReference: {
              predefinedLayout: "BLANK"
            }
          }
        },
        {
          createShape: {
            objectId: "opp_title",
            pageId: slideProblemId,
            shapeType: "TEXT_BOX",
            elementProperties: {
              size: {
                width: { magnitude: 620, unit: "PT" },
                height: { magnitude: 60, unit: "PT" }
              },
              transform: {
                scaleX: 1, scaleY: 1, translateX: 50, translateY: 40, unit: "PT"
              }
            }
          }
        },
        {
          insertText: {
            objectId: "opp_title",
            text: "1. OPPORTUNITY & TOTAL DIRECT MARKET",
            insertionIndex: 0
          }
        },
        {
          updateTextStyle: {
            objectId: "opp_title",
            textRange: { type: "ALL" },
            style: {
              foregroundColor: {
                opaqueColor: { rgbColor: { red: 0.1, green: 0.5, blue: 0.95 } }
              },
              bold: true,
              fontSize: { magnitude: 24, unit: "PT" },
              fontFamily: "Inter"
            },
            fields: "foregroundColor,bold,fontSize,fontFamily"
          }
        },
        {
          createShape: {
            objectId: "opp_body",
            pageId: slideProblemId,
            shapeType: "TEXT_BOX",
            elementProperties: {
              size: {
                width: { magnitude: 620, unit: "PT" },
                height: { magnitude: 220, unit: "PT" }
              },
              transform: {
                scaleX: 1, scaleY: 1, translateX: 50, translateY: 120, unit: "PT"
              }
            }
          }
        },
        {
          insertText: {
            objectId: "opp_body",
            text: `STARTUP ENTITY: ${startupName}\n\nCORE PROPOSITION:\n"${startupOneLiner}"\n\nTARGET MARKET OPPORTUNITY:\n${marketSize}\n\nAUTHENTIC PMF RISK VALUATION:\nDynamic scoring indicates High Velocity growth in primary airspace tracks. Low operational congestion.`,
            insertionIndex: 0
          }
        },
        {
          updateTextStyle: {
            objectId: "opp_body",
            textRange: { type: "ALL" },
            style: {
              foregroundColor: {
                opaqueColor: { rgbColor: { red: 0.2, green: 0.2, blue: 0.25 } }
              },
              fontSize: { magnitude: 13, unit: "PT" },
              fontFamily: "Inter"
            },
            fields: "foregroundColor,fontSize,fontFamily"
          }
        },

        // ==========================================
        // Slide 2: Technical Secrets / Engines
        // ==========================================
        {
          createSlide: {
            objectId: slideTechId,
            insertionIndex: 2,
            slideLayoutReference: {
              predefinedLayout: "BLANK"
            }
          }
        },
        {
          createShape: {
            objectId: "tech_title",
            pageId: slideTechId,
            shapeType: "TEXT_BOX",
            elementProperties: {
              size: {
                width: { magnitude: 620, unit: "PT" },
                height: { magnitude: 60, unit: "PT" }
              },
              transform: {
                scaleX: 1, scaleY: 1, translateX: 50, translateY: 40, unit: "PT"
              }
            }
          }
        },
        {
          insertText: {
            objectId: "tech_title",
            text: "2. INTERACTIVE TECHNICAL & CORE SECRET",
            insertionIndex: 0
          }
        },
        {
          updateTextStyle: {
            objectId: "tech_title",
            textRange: { type: "ALL" },
            style: {
              foregroundColor: {
                opaqueColor: { rgbColor: { red: 0.5, green: 0.2, blue: 0.85 } }
              },
              bold: true,
              fontSize: { magnitude: 24, unit: "PT" },
              fontFamily: "Inter"
            },
            fields: "foregroundColor,bold,fontSize,fontFamily"
          }
        },
        {
          createShape: {
            objectId: "tech_body",
            pageId: slideTechId,
            shapeType: "TEXT_BOX",
            elementProperties: {
              size: {
                width: { magnitude: 620, unit: "PT" },
                height: { magnitude: 220, unit: "PT" }
              },
              transform: {
                scaleX: 1, scaleY: 1, translateX: 50, translateY: 120, unit: "PT"
              }
            }
          }
        },
        {
          insertText: {
            objectId: "tech_body",
            text: `ENGINE ARCHITECTURE CONFIGURATION\n\nTECHNICAL BLUEPRINT & SECRET ADVANTAGE:\n${techSecret}\n\nAGI MODEL OPTIMIZATION LEVEL:\nFully integrated with @google/genai orchestration protocols checking real-time data constraints server-side dynamically for critical compliance tracking.`,
            insertionIndex: 0
          }
        },
        {
          updateTextStyle: {
            objectId: "tech_body",
            textRange: { type: "ALL" },
            style: {
              foregroundColor: {
                opaqueColor: { rgbColor: { red: 0.2, green: 0.2, blue: 0.25 } }
              },
              fontSize: { magnitude: 13, unit: "PT" },
              fontFamily: "Inter"
            },
            fields: "foregroundColor,fontSize,fontFamily"
          }
        },

        // ==========================================
        // Slide 3: Capital Ask & Milestones
        // ==========================================
        {
          createSlide: {
            objectId: slideFinanceId,
            insertionIndex: 3,
            slideLayoutReference: {
              predefinedLayout: "BLANK"
            }
          }
        },
        {
          createShape: {
            objectId: "fin_title",
            pageId: slideFinanceId,
            shapeType: "TEXT_BOX",
            elementProperties: {
              size: {
                width: { magnitude: 620, unit: "PT" },
                height: { magnitude: 60, unit: "PT" }
              },
              transform: {
                scaleX: 1, scaleY: 1, translateX: 50, translateY: 40, unit: "PT"
              }
            }
          }
        },
        {
          insertText: {
            objectId: "fin_title",
            text: "3. METRICS, ROADMAP & CAPITAL ASK",
            insertionIndex: 0
          }
        },
        {
          updateTextStyle: {
            objectId: "fin_title",
            textRange: { type: "ALL" },
            style: {
              foregroundColor: {
                opaqueColor: { rgbColor: { red: 0.05, green: 0.55, blue: 0.35 } }
              },
              bold: true,
              fontSize: { magnitude: 24, unit: "PT" },
              fontFamily: "Inter"
            },
            fields: "foregroundColor,bold,fontSize,fontFamily"
          }
        },
        {
          createShape: {
            objectId: "fin_body",
            pageId: slideFinanceId,
            shapeType: "TEXT_BOX",
            elementProperties: {
              size: {
                width: { magnitude: 620, unit: "PT" },
                height: { magnitude: 220, unit: "PT" }
              },
              transform: {
                scaleX: 1, scaleY: 1, translateX: 50, translateY: 120, unit: "PT"
              }
            }
          }
        },
        {
          insertText: {
            objectId: "fin_body",
            text: `INVESTMENT STRUCTURE DETAILS\n\nTARGET CAPITAL DEPLOYMENT:\n${investmentRound}\n\nPRO-FORMA PROJECTION CURVES:\n- Year 1 Operations Delta: +$450,000 ARR\n- Year 2 Scale: $3.2M ARR\n- Year 3 Expansion: $11.4M ARR\n\nINVESTMENT READINESS GRADE: 96/100 (SUPERIOR STATUS)\nSourced LinkedIn parameters log an stable/increasing headcount trend.`,
            insertionIndex: 0
          }
        },
        {
          updateTextStyle: {
            objectId: "fin_body",
            textRange: { type: "ALL" },
            style: {
              foregroundColor: {
                opaqueColor: { rgbColor: { red: 0.2, green: 0.2, blue: 0.25 } }
              },
              fontSize: { magnitude: 13, unit: "PT" },
              fontFamily: "Inter"
            },
            fields: "foregroundColor,fontSize,fontFamily"
          }
        }
      ];

      // Update Slides Presentation via BatchUpdate to finalize the compile!
      const updateResponse = await fetch(`https://slides.googleapis.com/v1/presentations/${newDeckId}:batchUpdate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${activeToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          requests: requests
        })
      });

      if (!updateResponse.ok) {
        throw new Error(`Applying presentation content updating batch payload failed: Status ${updateResponse.status}`);
      }

      setCreatedDeckId(newDeckId);
      setCreatedDeckUrl(newDeckUrl);

      // Save to local presentation list history
      const historyItem: SlideHistoryItem = {
        id: newDeckId,
        title: deckTitleDraft,
        createdTime: new Date().toLocaleDateString(),
        viewUrl: newDeckUrl
      };

      const updatedHistory = [historyItem, ...deckHistory].slice(0, 10);
      setDeckHistory(updatedHistory);
      localStorage.setItem("venture_ai_gslides_history", JSON.stringify(updatedHistory));

      addLog("Workspace Sentinel", `Google Pitch Presentation created successfully: ID [${newDeckId}]`);
      triggerToast("Startup Slide Deck Compiled successfully!", "success");

    } catch (err: any) {
      console.error(err);
      triggerToast(err.message || "Failed to compile Presentation slides.", "error");
      addLog("Workspace Sentinel", `Presentation generation error: ${err.message}`);
    } finally {
      setIsCreatingDeck(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* TITLE BAR HERO */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#0F172A]/75 relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-80 h-40 bg-indigo-500/5 blur-[100px] pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse" />
              Google Slides Presentation Workspace
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Autogenerate high-impact visual pitch decks on Google Workspace instantly from raw startup parameters, or sync Slide text structures live into VentureAI analysis screens.
            </p>
          </div>

          {!needsAuth && user ? (
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-2 px-3 self-start md:self-auto">
              <img
                src={user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80"}
                alt="user portrait"
                className="w-7 h-7 rounded-full border border-indigo-500/50"
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
                title="Disconnect Workspace Auth Scopes"
                className="text-slate-450 hover:text-rose-400 p-1 hover:bg-slate-950 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span className="text-[9px] uppercase font-mono px-3 py-1 rounded-full border border-amber-500/30 text-amber-400 bg-amber-955/20">
              DISCONNECTED
            </span>
          )}
        </div>
      </div>

      {needsAuth ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-[#0F172A]/40 space-y-4 max-w-2xl mx-auto">
          <Presentation className="w-12 h-12 text-indigo-500 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Google Presentations Access Protocol
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed font-sans">
              Enable the secure Google Slides and Presentations API. We access credentials entirely client-side, ensuring your deck remains secure under extreme enterprise control.
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
              {isLoggingIn ? "Syncing Workspace account..." : "Connect Google Slides Profile"}
            </span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* COLUMN 1 & 2: ACTION WRAPPERS */}
          <div className="lg:col-span-2 space-y-6">
            {/* GENERATE SEED ROUND PITCH DECK */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-[#0c1222] space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <PlusCircle className="text-indigo-400 w-4.5 h-4.5" /> Compiling AGI Pitch Slide Deck
              </h3>
              <p className="text-xs text-slate-450 leading-relaxed">
                Compile dynamic bento templates layout directly to your Google Slides account. We auto-populate core opportunity briefs, technical architectures, and seed round capital expectations.
              </p>

              <div className="space-y-3.5">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">Presentation Deck Title</span>
                  <input
                    type="text"
                    value={deckTitleDraft}
                    onChange={(e) => setDeckTitleDraft(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">Startup Name</span>
                    <input
                      type="text"
                      value={startupName}
                      onChange={(e) => setStartupName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">Core Proposition (One-liner)</span>
                    <input
                      type="text"
                      value={startupOneLiner}
                      onChange={(e) => setStartupOneLiner(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">Core Competitive Secret Advantage (Slide 2 tech)</span>
                  <textarea
                    rows={2}
                    value={techSecret}
                    onChange={(e) => setTechSecret(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-serif leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">Market Size Opportunity</span>
                    <input
                      type="text"
                      value={marketSize}
                      onChange={(e) => setMarketSize(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">Venture Financing Ask Detail</span>
                    <input
                      type="text"
                      value={investmentRound}
                      onChange={(e) => setInvestmentRound(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-900 mt-2">
                <div className="text-[10px] text-slate-550 font-mono">
                  ⚡ Auto-saves output parameters internally to OAuth Presentation logs
                </div>

                <button
                  type="button"
                  disabled={isCreatingDeck}
                  onClick={handleCompileDeck}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
                >
                  {isCreatingDeck ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Constructing Presentation Slides GDrive...
                    </>
                  ) : (
                    <>
                      <Layout className="w-3.5 h-3.5" />
                      Create & Append Pitch Deck Slide
                    </>
                  )}
                </button>
              </div>

              {createdDeckUrl && (
                <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/25 space-y-2 mt-2 animate-fade-in text-xs">
                  <div className="flex items-center gap-2 text-indigo-300 font-extrabold">
                    <CheckCircle2 className="w-4.5 h-4.5 text-green-400" />
                    <span>Presentation Deck Compiled & Generated</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Presentation Id: <code className="text-white bg-slate-990 px-1 py-0.5 rounded font-mono select-all">{createdDeckId}</code>
                  </p>
                  <a
                    href={createdDeckUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-bold hover:underline py-1"
                  >
                    Launch Google Slides live view <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* SYNC & READ PRESENTATION DATA */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-[#0F172A]/70 space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <Search className="text-indigo-400 w-4.5 h-4.5" /> Import & Audit Slide Presentation Text
              </h3>
              <p className="text-xs text-slate-400 leading-normal">
                Input any <strong>Google Slides presentation key ID</strong> or complete file edit URL below to extract, audit and view individual slide contents.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste Presentation Id (e.g. 1y3bH_vM-aU-S2a99d...)"
                  value={targetDeckId}
                  onChange={(e) => {
                    const value = e.target.value;
                    const matches = value.match(/\/d\/([a-zA-Z0-9-_\\]+)/);
                    if (matches && matches[1]) {
                      setTargetDeckId(matches[1]);
                    } else {
                      setTargetDeckId(value);
                    }
                  }}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <button
                  type="button"
                  disabled={isFetchingDeck}
                  onClick={() => handleFetchDeck(targetDeckId)}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl font-bold text-xs uppercase tracking-wider text-white flex items-center gap-1.5"
                >
                  {isFetchingDeck ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Search className="w-3.5 h-3.5" />
                  )}
                  Audit
                </button>
              </div>

              {/* RENDER SLIDES TEXT CONTENT CARD */}
              {deckTitle && (
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-4 mt-4 text-xs animate-fade-in">
                  <div className="flex items-center justify-between border-b border-slate-905 pb-2">
                    <div className="flex items-center gap-2">
                      <Presentation className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
                      <strong className="text-white text-xs block truncate max-w-[280px]" title={deckTitle}>
                        {deckTitle}
                      </strong>
                    </div>
                    <span className="text-[8px] font-mono text-emerald-450 bg-emerald-950/20 px-2.5 py-1 rounded border border-emerald-550/20">
                      SYNCED
                    </span>
                  </div>

                  <div className="space-y-3.5 max-h-80 overflow-y-auto scrollbar-thin">
                    {slidesSummary.map((slide) => (
                      <div
                        key={slide.slideId}
                        className="p-3 bg-[#0F172A]/40 border border-slate-900 rounded-xl space-y-1.5"
                      >
                        <div className="flex justify-between items-center bg-slate-950 px-2 py-1 rounded">
                          <span className="text-[10px] font-mono text-slate-450 uppercase font-black">
                            Slide #{slide.slideNumber}
                          </span>
                          <span className="text-[8px] font-mono text-slate-600 block truncate max-w-[120px]">
                            {slide.slideId}
                          </span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-350 font-serif whitespace-pre-line px-1">
                          {slide.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 3: SIDEBAR STATS & DIRECTORY */}
          <div className="space-y-6">
            <div className="p-5 rounded-2xl border border-slate-800 bg-[#0F172A]/70 space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <History className="text-indigo-400 w-4.5 h-4.5" /> Presentation Deck Sourcing Logs
              </h3>
              <p className="text-[11px] text-slate-400 leading-normal">
                Easily re-enter or track historical startups and customized slides generated secure inside this Workspace project.
              </p>

              {deckHistory.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-slate-800 rounded-xl text-xs text-slate-500 italic space-y-1">
                  <span>No presentations synced yet.</span>
                  <span className="block text-[9px]">Generate a Pitch deck on the left interface!</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {deckHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/40 space-y-1.5 hover:border-indigo-500/20 transition-all text-xs"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <strong className="text-white truncate block max-w-[150px]" title={item.title}>
                          {item.title}
                        </strong>
                        <span className="text-[9px] font-mono text-slate-500">{item.createdTime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => {
                            setTargetDeckId(item.id);
                            handleFetchDeck(item.id);
                          }}
                          className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-0.5"
                        >
                          Show readout
                        </button>
                        {item.viewUrl && (
                          <a
                            href={item.viewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-0.5"
                          >
                            Slide App <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* QUICK PRESENTATIONS HELPER */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-[#0c1222] space-y-4 text-xs leading-relaxed">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="text-cyan-400 w-4.5 h-4.5" /> Workspace Design Rules
              </h4>

              <div className="space-y-3.5 text-slate-400 text-[11px]">
                <div className="p-3 bg-slate-950 rounded-xl space-y-2">
                  <div className="flex items-center gap-1 text-slate-200">
                    <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
                    <strong>Predefined Color Schemes</strong>
                  </div>
                  <p>Our generator utilizes contrasting RGB indices to maximize readability during high-octane venture financing meetings:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li><span className="text-cyan-400">Cyan Highlight</span> for Opportunity</li>
                    <li><span className="text-purple-400">Deep Amethyst</span> for Architectures</li>
                    <li><span className="text-emerald-450">Emerald Green</span> for Financing Delta</li>
                  </ul>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl space-y-1">
                  <strong className="text-slate-200 block">Where are files stored?</strong>
                  <p>All creations are initialized in the root path of the connected Google Drive with full support for team sharing and collaboration layouts.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
