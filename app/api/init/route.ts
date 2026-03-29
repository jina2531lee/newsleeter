import { NextResponse } from "next/server";
import { createClient } from "@libsql/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  if (!secret || secret !== process.env.INIT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  // 테이블 생성
  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS "Newsletter" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "date" DATETIME NOT NULL,
      "title" TEXT NOT NULL,
      "summary" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "Section" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "newsletterId" INTEGER NOT NULL,
      "category" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "order" INTEGER NOT NULL,
      FOREIGN KEY ("newsletterId") REFERENCES "Newsletter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
    CREATE TABLE IF NOT EXISTS "NewsItem" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "sectionId" INTEGER NOT NULL,
      "title" TEXT NOT NULL,
      "content" TEXT NOT NULL,
      "tags" TEXT NOT NULL DEFAULT '[]',
      "order" INTEGER NOT NULL,
      FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
    CREATE TABLE IF NOT EXISTS "Source" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "newsItemId" INTEGER NOT NULL,
      "label" TEXT NOT NULL,
      "url" TEXT NOT NULL,
      FOREIGN KEY ("newsItemId") REFERENCES "NewsItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);

  // 이미 데이터 있으면 스킵
  const existing = await client.execute('SELECT COUNT(*) as cnt FROM "Newsletter"');
  const count = Number(existing.rows[0].cnt);
  if (count > 0) {
    client.close();
    return NextResponse.json({ ok: true, message: `이미 ${count}개의 뉴스레터가 있습니다.` });
  }

  const now = new Date().toISOString();

  // Newsletter
  await client.execute({
    sql: `INSERT INTO "Newsletter" ("date","title","summary","createdAt","updatedAt") VALUES (?,?,?,?,?)`,
    args: [
      "2026-03-21T07:00:00.000Z",
      "로완의 AI 뉴스레터 — 2026년 3월 21일 (주간 호)",
      "에이전트 AI는 이미 사무실에 들어왔고, 피지컬 AI는 공장 문을 두드리고 있다 — 이번 주는 그 두 물결이 동시에 정점을 찍은 순간이었다.",
      now, now,
    ],
  });
  const nlId = Number((await client.execute("SELECT last_insert_rowid() as id")).rows[0].id);

  // 섹션 + 아이템 데이터
  const sections = [
    {
      category: "SEARCH_AGENT", title: "검색·에이전트 AI", order: 1,
      items: [
        {
          order: 1,
          title: "모델 전쟁의 결승전: GPT-5.4 vs Gemini 3.1 vs Claude Opus 4.6",
          content: "이번 주 가장 큰 축은 세 빅랩의 플래그십 충돌이다. OpenAI GPT-5.4는 OSWorld-V 벤치마크에서 75% 달성. Google Gemini 3.1은 ARC-AGI-2에서 77.1% 기록. Anthropic Claude Opus 4.6은 GDPval-AA Elo 리더보드 1위. DeepSeek V4는 1조 파라미터 오픈웨이트 모델로 KV 캐시를 GPU·CPU·디스크에 분산 저장하는 신규 아키텍처 도입.",
          tags: JSON.stringify(["GPT-5.4", "Gemini3.1", "Claude", "DeepSeek", "에이전트AI"]),
          sources: [{ label: "AI Model Releases Week of March 14 (LabLa)", url: "https://www.labla.org/latest-ai-model-releases-past-24-hours/ai-model-releases-everything-that-dropped-this-week-march-14-2026/" }],
        },
        {
          order: 2,
          title: "검색 패러다임의 지각 변동: Google Core Update + 에이전트 커머스",
          content: "구글은 현재 19일 짜리 핵심 알고리즘 대규모 업데이트 진행 중이다. AI 비편집 대량 콘텐츠 사이트는 검색 노출이 35~60% 급락 중. Shopify는 AI가 소비자를 대신해 발견·비교·구매까지 수행하는 에이전트 커머스 전략을 본격화.",
          tags: JSON.stringify(["Google", "검색SEO", "Shopify", "에이전트커머스"]),
          sources: [{ label: "MarketingProfs — AI Update March 20, 2026", url: "https://www.marketingprofs.com/opinions/2026/54448/ai-update-march-20-2026-ai-news-and-views-from-the-past-week" }],
        },
      ],
    },
    {
      category: "PHYSICAL_AI", title: "피지컬 AI", order: 2,
      items: [
        {
          order: 1,
          title: "NVIDIA GTC 2026: 피지컬 AI 원년 선포",
          content: "젠슨 황은 GTC 키노트에서 '피지컬 AI가 도래했다 — 모든 산업 기업이 로봇 기업이 될 것'이라고 선언. Cosmos 3, Physical AI Data Factory Blueprint 발표. Disney 협업으로 올라프 로봇과 BDX 드로이드 훈련, 3월 29일 디즈니랜드 파리 데뷔 예정.",
          tags: JSON.stringify(["NVIDIA", "GTC2026", "피지컬AI", "로봇", "Cosmos"]),
          sources: [{ label: "NVIDIA Newsroom — Physical AI to the Real World", url: "https://nvidianews.nvidia.com/news/nvidia-and-global-robotics-leaders-take-physical-ai-to-the-real-world" }],
        },
        {
          order: 2,
          title: "FANUC × NVIDIA: 산업 로봇의 AI 전환",
          content: "세계 1위 산업 로봇 공급사 FANUC이 NVIDIA와 공식 파트너십 체결(3월 20일). NVIDIA Jetson 기반 AI 컴퓨팅으로 공장 디지털 트윈 구축 → 가상 훈련 → 실환경 배포 파이프라인 구축.",
          tags: JSON.stringify(["FANUC", "NVIDIA", "산업로봇", "디지털트윈"]),
          sources: [{ label: "Robotics & Automation News — FANUC × NVIDIA", url: "https://roboticsandautomationnews.com/2026/03/20/fanuc-partners-with-nvidia-to-accelerate-physical-ai-in-industrial-robotics/99989/" }],
        },
        {
          order: 3,
          title: "얀 르쿤의 AMI Labs: 세계 모델(World Model)에 10억 달러",
          content: "얀 르쿤이 창업한 AMI Labs가 3월 10일 유럽 역사상 최대 규모 시드 라운드인 10.3억 달러 유치(밸류에이션 35억 달러). NVIDIA, Bezos Expeditions, Temasek 등 참여. LLM의 대안 아키텍처인 '세계 모델' 로봇·헬스케어·제조 적용 목표.",
          tags: JSON.stringify(["얀르쿤", "AMILabs", "WorldModel", "시드투자"]),
          sources: [{ label: "Deloitte — Physical AI Humanoid Robots Tech Trends", url: "https://www.deloitte.com/us/en/insights/topics/technology-management/tech-trends/2026/physical-ai-humanoid-robots.html" }],
        },
        {
          order: 4,
          title: "RoboForce $52M 조달: 산업 현장의 로보-노동력",
          content: "산업 현장 고위험 작업 전문 로봇 스타트업 RoboForce가 5,200만 달러 조달(YZi Labs 주도). 태양광·데이터센터·채굴·해운·물류 현장 타겟.",
          tags: JSON.stringify(["RoboForce", "산업로봇", "투자"]),
          sources: [{ label: "Robotics & Automation News — RoboForce $52M", url: "https://roboticsandautomationnews.com/2026/03/17/roboforce-raises-52-million-to-build-physical-ai-robots-for-industrial-work/99758/" }],
        },
      ],
    },
    {
      category: "COMMUNITY", title: "커뮤니티 반응", order: 3,
      items: [
        {
          order: 1,
          title: "YouTube: AI 인용 1위 플랫폼으로 등극",
          content: "6.1백만 건의 AI 인용 분석 결과(Goodie AI), YouTube 인용 비중: 2025년 8월 18.9% → 2025년 12월 39.2%. Reddit 인용 비중: 44.2% → 20.3%.",
          tags: JSON.stringify(["YouTube", "AI인용", "콘텐츠트렌드"]),
          sources: [{ label: "PikaSEO — YouTube Overtakes Reddit in AI Citations", url: "https://pikaseo.com/articles/youtube-overtakes-reddit-ai-citations" }],
        },
        {
          order: 2,
          title: "Reddit: 인간 콘텐츠의 마지막 보루",
          content: "r/artificial, r/MachineLearning 이번 주 핫 토픽: DeepSeek V4 오픈웨이트 공개, ServiceNow CEO의 '대졸 실업률 30%' 발언, Claude 메모리 기능 논쟁. Reddit DAU 1억 2,100만 명 돌파(전년비 +19%).",
          tags: JSON.stringify(["Reddit", "커뮤니티반응", "DeepSeek"]),
          sources: [{ label: "AI METRIX — Reddit Human Content 2026", url: "https://aimetrix.org/reddit-human-content-2026/" }],
        },
      ],
    },
    {
      category: "INDUSTRY", title: "산업·정책·투자 관점", order: 4,
      items: [
        {
          order: 1,
          title: "투자 규모: 2026년은 'AI 인프라 슈퍼사이클'",
          content: "빅테크 AI 투자 총액 예상: 6,500억 달러(Bridgewater Associates). OpenAI 연간 매출 $250억 이상. Anthropic $190억 접근. 모델 API 가격 2024년 대비 60~80% 하락.",
          tags: JSON.stringify(["투자", "OpenAI", "Anthropic", "NVIDIA"]),
          sources: [{ label: "AI Funding Tracker — Latest Deals 2026", url: "https://aifundingtracker.com/ai-startup-funding-news-today/" }],
        },
        {
          order: 2,
          title: "정책 동향: 미국·영국·EU 삼각 규제 지형",
          content: "미국: 규제 완화·민간 주도. 영국: AI 생성 콘텐츠 라벨링 의무화 법안 + UKRI £16억 파운드 AI 연구 투자. EU: 비동의 AI 딥페이크 금지 조항 추진. 고용 충격: ServiceNow CEO '2년 내 대졸 실업률 30%' 경고.",
          tags: JSON.stringify(["AI정책", "영국UKRI", "EU AI법", "고용충격"]),
          sources: [{ label: "Open Access Government — UK £40M AI Research Lab", url: "https://www.openaccessgovernment.org/uk-launches-40-million-fundamental-ai-research-lab-for-the-next-wave-of-breakthroughs/" }],
        },
      ],
    },
    {
      category: "ANALYSIS", title: "정리 및 배경/원인 분석", order: 5,
      items: [
        {
          order: 1,
          title: "구조적 배경: 왜 지금인가?",
          content: "1. 컨텍스트 창 1M 토큰 시대 — 단일 프롬프트로 코드베이스 전체 처리 가능. 2. 가격 붕괴 — API 가격 60~80% 하락. 3. NVIDIA 풀스택 수직 통합 완성. 4. 오픈소스 압력 — DeepSeek V4가 상용 가격 인하 강제. 5. 고용 시장 불안의 현실화.",
          tags: JSON.stringify(["분석", "구조적배경", "에이전트AI"]),
          sources: [],
        },
        {
          order: 2,
          title: "이번 주 주목할 약신호 (Weak Signal)",
          content: "멀티모델 전략의 부상: 단일 AI 플랫폼 의존에서 목적별 모델 혼합 사용으로 전환. AI 사이버보안 투자 카테고리화. YouTube의 AI 인용 역전이 SEO 전략을 근본적으로 재편 중.",
          tags: JSON.stringify(["WeakSignal", "멀티모델", "AI보안", "YouTube인용"]),
          sources: [],
        },
      ],
    },
  ];

  for (const section of sections) {
    await client.execute({
      sql: `INSERT INTO "Section" ("newsletterId","category","title","order") VALUES (?,?,?,?)`,
      args: [nlId, section.category, section.title, section.order],
    });
    const sId = Number((await client.execute("SELECT last_insert_rowid() as id")).rows[0].id);

    for (const item of section.items) {
      await client.execute({
        sql: `INSERT INTO "NewsItem" ("sectionId","title","content","tags","order") VALUES (?,?,?,?,?)`,
        args: [sId, item.title, item.content, item.tags, item.order],
      });
      const iId = Number((await client.execute("SELECT last_insert_rowid() as id")).rows[0].id);

      for (const src of item.sources) {
        await client.execute({
          sql: `INSERT INTO "Source" ("newsItemId","label","url") VALUES (?,?,?)`,
          args: [iId, src.label, src.url],
        });
      }
    }
  }

  client.close();
  return NextResponse.json({ ok: true, message: "테이블 생성 및 시드 데이터 입력 완료" });
}
