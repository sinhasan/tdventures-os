export interface BannerAdDesign {
  id: string;
  size: string;
  width: number;
  height: number;
  headline: string;
  subheadline: string;
  ctaText: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
  gradientStart: string;
  gradientEnd: string;
  patternType: 'grid' | 'circuit' | 'particles' | 'glow' | 'geometric';
  targetAudience: string;
  seoKeywords: string[];
}

export interface SEOOptimizedSuite {
  title: string;
  metaDescription: string;
  focusKeywords: string[];
  bannerAdCampaigns: {
    medium_rectangle: BannerAdDesign;
    leaderboard: BannerAdDesign;
    wide_skyscraper: BannerAdDesign;
    large_rectangle: BannerAdDesign;
    half_page: BannerAdDesign;
    mobile_leaderboard: BannerAdDesign;
  };
  score: number;
  recommendations: string[];
}

export interface DueDiligenceReport {
  companyName: string;
  overallScore: number;
  confidenceLevel: number;
  valuationRange: string;
  fundingRecommendation: string;
  executiveSummary: string;
  marketAnalysis: {
    tam: string;
    description: string;
    competitorRisks: string[];
  };
  teamScore: number;
  financialScore: number;
  scalabilityScore: number;
  wordSemanticAnalysis: {
    word: string;
    sentiment: 'positive' | 'neutral' | 'conservative';
    explanation: string;
    credibility: number;
    importance: number;
  }[];
  paragraphStructure: {
    paragraph: string;
    sentiment: number;
    clarity: number;
    persuasive: number;
    support: number;
    insights: string[];
    recommendations: string[];
  }[];
  investmentThesis: string;
  riskFactors: string[];
  recommendedSteps: string[];
}

export interface DealFlowItem {
  id: string;
  companyName: string;
  stage: string;
  sector: string;
  valuation: string;
  askAmount: string;
  agiScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  status: 'Strong Buy' | 'Buy' | 'Hold' | 'Pass';
  lastUpdated: string;
}
