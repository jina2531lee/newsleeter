export type CategoryKey =
  | "SEARCH_AGENT"
  | "PHYSICAL_AI"
  | "COMMUNITY"
  | "INDUSTRY"
  | "ANALYSIS";

export const CATEGORY_META: Record<
  CategoryKey,
  { label: string; emoji: string; color: string }
> = {
  SEARCH_AGENT: {
    label: "검색·에이전트 AI",
    emoji: "🔍",
    color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  PHYSICAL_AI: {
    label: "피지컬 AI",
    emoji: "🤖",
    color: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  },
  COMMUNITY: {
    label: "커뮤니티 반응",
    emoji: "💬",
    color: "bg-green-500/20 text-green-300 border-green-500/30",
  },
  INDUSTRY: {
    label: "산업·정책·투자",
    emoji: "📈",
    color: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  ANALYSIS: {
    label: "정리 및 분석",
    emoji: "🧠",
    color: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  },
};
