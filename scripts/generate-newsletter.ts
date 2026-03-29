import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const today = new Date();
const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
const dateStr = today.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });

async function generateNewsletter() {
  console.log("🔍 최신 AI 뉴스 검색 중...");

  const itemSchema = {
    type: "object",
    properties: {
      order: { type: "number" },
      title: { type: "string" },
      content: { type: "string", description: "마크다운 형식. **📌 무슨 일이 있었나** / **💡 왜 중요한가** / **🔍 더 생각해볼 포인트** 3단 구조, 각 섹션은 불릿 포인트로 작성" },
      tags: { type: "array", items: { type: "string" } },
      sources: {
        type: "array",
        items: {
          type: "object",
          properties: { label: { type: "string" }, url: { type: "string" } },
          required: ["label", "url"],
        },
      },
    },
    required: ["order", "title", "content", "tags", "sources"],
  };

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 12000,
    tools: [
      { type: "web_search_20250305" as "web_search_20250305", name: "web_search" },
      {
        name: "publish_newsletter",
        description: "조사한 AI 뉴스를 바탕으로 주간 뉴스레터를 발행합니다.",
        input_schema: {
          type: "object" as const,
          properties: {
            date: { type: "string", description: "오늘 날짜 KST 오전 7시 ISO8601" },
            title: { type: "string" },
            summary: { type: "string", description: "이번 주 핵심 동향 2~3문장 요약" },
            sections: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  category: { type: "string", enum: ["SEARCH_AGENT", "PHYSICAL_AI", "COMMUNITY", "INDUSTRY", "ANALYSIS"] },
                  title: { type: "string" },
                  order: { type: "number" },
                  items: { type: "array", items: itemSchema, minItems: 2 },
                },
                required: ["category", "title", "order", "items"],
              },
            },
          },
          required: ["date", "title", "summary", "sections"],
        },
      },
    ],
    messages: [
      {
        role: "user",
        content: `오늘은 ${dateStr}입니다. 지난 7일간의 AI 분야 주요 뉴스를 웹 검색으로 충분히 조사한 뒤, publish_newsletter 툴을 호출해 한국어 뉴스레터를 작성해주세요.

섹션 구성:
- SEARCH_AGENT: 검색·에이전트 AI
- PHYSICAL_AI: 피지컬 AI (로봇, 자율주행 등)
- COMMUNITY: 커뮤니티 반응 (Reddit, X, YouTube 등)
- INDUSTRY: 산업·정책·투자 관점
- ANALYSIS: 정리 및 배경/원인 분석

각 아이템의 content는 반드시 아래 3단 구조로 작성하세요:
**📌 무슨 일이 있었나**
- 핵심 사실 3~5개 불릿

**💡 왜 중요한가**
- 의미와 파급력 2~3개 불릿

**🔍 더 생각해볼 포인트**
- 시사점·질문·리스크 2~3개 불릿`,
      },
    ],
  });

  // tool_use 블록에서 newsletter 데이터 추출
  let newsletter: Record<string, unknown> | null = null;
  for (const block of response.content) {
    if (block.type === "tool_use" && block.name === "publish_newsletter") {
      newsletter = block.input as Record<string, unknown>;
      break;
    }
  }
  if (!newsletter) {
    const textBlock = response.content.find((b) => b.type === "text");
    throw new Error(`publish_newsletter 툴이 호출되지 않았습니다. 응답: ${textBlock ? (textBlock as { text: string }).text.slice(0, 300) : "없음"}`);
  }

  console.log("📝 생성된 뉴스레터:", newsletter.title);

  // API에 POST
  const apiUrl = process.env.NEWSLETTER_API_URL!;
  const secret = process.env.NEWSLETTER_API_SECRET!;

  const res = await fetch(`${apiUrl}/api/newsletters`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify(newsletter),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API 오류 ${res.status}: ${err}`);
  }

  const created = await res.json();
  console.log(`✅ 뉴스레터 발행 완료! ID: ${created.id}`);
}

generateNewsletter().catch((err) => {
  console.error("❌ 오류:", err);
  process.exit(1);
});
