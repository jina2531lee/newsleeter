import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const today = new Date();
const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
const dateStr = today.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });

async function generateNewsletter() {
  console.log("🔍 최신 AI 뉴스 검색 중...");

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8000,
    tools: [{ type: "web_search_20250305" as "web_search_20250305", name: "web_search" }],
    messages: [
      {
        role: "user",
        content: `오늘은 ${dateStr}입니다. 지난 7일간의 AI 분야 주요 뉴스를 조사하고, 아래 JSON 형식으로 한국어 뉴스레터를 작성해주세요.

반드시 웹 검색을 통해 실제 최신 뉴스를 기반으로 작성하세요.

출력 형식 (JSON만 출력, 다른 텍스트 없이):
{
  "date": "ISO8601 형식 날짜 (오늘 날짜 KST 오전 7시)",
  "title": "로완의 AI 뉴스레터 — ${dateStr} (주간 호)",
  "summary": "이번 주 핵심 동향을 2~3문장으로 요약",
  "sections": [
    {
      "category": "SEARCH_AGENT",
      "title": "검색·에이전트 AI",
      "order": 1,
      "items": [
        {
          "order": 1,
          "title": "뉴스 제목",
          "content": "상세 내용 (400~600자)",
          "tags": ["태그1", "태그2"],
          "sources": [{ "label": "출처명", "url": "https://..." }]
        }
      ]
    },
    {
      "category": "PHYSICAL_AI",
      "title": "피지컬 AI",
      "order": 2,
      "items": [...]
    },
    {
      "category": "COMMUNITY",
      "title": "커뮤니티 반응",
      "order": 3,
      "items": [...]
    },
    {
      "category": "INDUSTRY",
      "title": "산업·정책·투자 관점",
      "order": 4,
      "items": [...]
    },
    {
      "category": "ANALYSIS",
      "title": "정리 및 배경/원인 분석",
      "order": 5,
      "items": [...]
    }
  ]
}

각 섹션에 최소 2개 이상의 아이템을 포함하세요. 실제 출처 URL을 정확히 기입하세요.`,
      },
    ],
  });

  // 최종 텍스트 응답 추출
  let jsonText = "";
  for (const block of response.content) {
    if (block.type === "text") {
      jsonText = block.text;
      break;
    }
  }

  // JSON 파싱 (코드 블록 제거)
  jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const newsletter = JSON.parse(jsonText);

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
