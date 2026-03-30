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

  const existing = await client.execute(
    `SELECT id FROM "Newsletter" WHERE date = '2026-03-27T22:00:00.000Z'`
  );
  if (existing.rows.length > 0) {
    client.close();
    return NextResponse.json({ ok: true, message: "3/27 뉴스레터가 이미 존재합니다." });
  }

  const now = new Date().toISOString();

  await client.execute({
    sql: `INSERT INTO "Newsletter" ("date","title","summary","createdAt","updatedAt") VALUES (?,?,?,?,?)`,
    args: [
      "2026-03-27T22:00:00.000Z",
      "로완의 AI 뉴스레터 — 2026년 3월 27일 (주간 호)",
      "GPT-5 정식 출시와 오픈소스 LLaMA 4 공개가 맞붙은 한 주 — AI 모델 시장의 '무료 vs 유료' 경계가 다시 한번 흔들렸다.",
      now, now,
    ],
  });

  const nlRes = await client.execute("SELECT last_insert_rowid() as id");
  const nlId = Number(nlRes.rows[0].id);

  const sections = [
    {
      category: "SEARCH_AGENT", title: "검색·에이전트 AI", order: 1,
      items: [
        {
          order: 1,
          title: "GPT-5 공식 출시: '추론+멀티모달'의 완전체",
          content: `**📌 팩트 요약**
- OpenAI가 3월 25일 GPT-5를 ChatGPT Plus/Pro/Team 유저에게 정식 롤아웃
- o3 추론 모드 기본 탑재, 128K 컨텍스트, 실시간 이미지·파일·코드 처리 통합
- API 가격: 입력 $15/1M 토큰, 출력 $60/1M 토큰 (GPT-4o 대비 3배)
- MMLU 92.1%, HumanEval 97.3% 달성으로 공개 벤치마크 전 분야 1위

**💡 의미와 인사이트**
- '추론 모델'과 '일반 모델'의 경계가 사라짐 — 사용자가 모드를 선택할 필요 없는 통합 인터페이스로 진화
- API 가격 3배 인상은 OpenAI가 '최고 성능 = 프리미엄 마진' 전략으로 선회했음을 의미. Anthropic·Google과의 가격 경쟁에서 이탈해 독자 포지셔닝 시도
- 엔터프라이즈 계약 중심 수익 구조 본격화 — GPT-5는 소비자보다 B2B 잠금 효과를 노린 제품

**🤔 추가로 생각해볼 것**
- 가격 3배 인상에도 기업들이 GPT-5를 선택할 것인가, 아니면 Gemini Ultra나 Claude Opus로 이동할 것인가
- '통합 추론'이 실제 업무에서 체감 차이를 만드는지 — 벤치마크와 실사용 간 갭이 존재하는지 검증 필요
- OpenAI의 고가격 전략이 오픈소스 진영(LLaMA 4)의 성장을 오히려 가속할 가능성`,
          tags: JSON.stringify(["GPT-5", "OpenAI", "추론모델", "API가격"]),
          sources: [{ label: "OpenAI GPT-5 발표", url: "https://openai.com/blog/gpt-5" }],
        },
        {
          order: 2,
          title: "Meta LLaMA 4 Scout·Maverick 공개: 오픈소스의 역습",
          content: `**📌 팩트 요약**
- Meta가 3월 26일 LLaMA 4 Scout(17B MoE)와 Maverick(400B MoE) 가중치를 무료 공개
- Scout는 10M 토큰 컨텍스트 창 지원 — 현존 오픈소스 최대
- Maverick은 LMArena 리더보드에서 GPT-4o·Gemini 1.5 Pro를 제치고 1위 기록
- 상업적 이용 허용 (단, MAU 7억 이상 서비스는 별도 라이선스 필요)

**💡 의미와 인사이트**
- '오픈소스 = 성능 타협'이라는 공식이 깨짐 — Maverick이 상용 최상위 모델과 대등한 성능으로 AI 민주화 논의 재점화
- 10M 토큰 컨텍스트는 법률 문서 전체, 대형 코드베이스 전체를 단일 프롬프트로 처리 가능한 수준. 에이전트 AI 구현 비용이 사실상 0으로 수렴
- Meta의 전략은 명확 — AI 인프라를 공공재화해 상용 모델 진영을 압박, 자사 광고·메타버스 플랫폼의 AI 비용 절감

**🤔 추가로 생각해볼 것**
- LLaMA 4를 자사 서버에 올리는 비용(GPU, 운영) vs GPT-5 API 비용 — 실제 TCO 비교가 필요
- 오픈소스 모델의 보안·컴플라이언스 이슈 — 특히 금융·의료 분야에서 규제 대응 가능한지
- Meta가 '무료 제공'으로 생태계를 장악한 뒤 향후 라이선스 조건을 바꿀 리스크`,
          tags: JSON.stringify(["LLaMA4", "Meta", "오픈소스", "MoE"]),
          sources: [{ label: "Meta LLaMA 4 공식 발표", url: "https://ai.meta.com/blog/llama-4-multimodal-intelligence" }],
        },
      ],
    },
    {
      category: "PHYSICAL_AI", title: "피지컬 AI", order: 2,
      items: [
        {
          order: 1,
          title: "Figure 02 양산 돌입: 인간형 로봇 대중화의 기점",
          content: `**📌 팩트 요약**
- Figure AI가 3월 24일 Figure 02 양산 라인 가동 시작 발표 (앨라배마 공장)
- BMW 스파르탄버그 공장에 첫 100대 배치, 차체 부품 조립 업무 담당
- 가격: 대당 약 $16만 (Figure 01 대비 40% 하락)
- 자율 작업 성공률 94.3%, 인간 작업자 교체 비율 1:1.4 (로봇 1대 = 인간 1.4명 분량)

**💡 의미와 인사이트**
- '로봇이 공장에 들어온다'는 선언에서 '실제 양산 라인이 돌아간다'로 전환 — 피지컬 AI가 PoC를 넘어 상업화 임계점 도달
- $16만이라는 가격은 여전히 높지만, 3~5년 내 $5만 이하 예측이 현실화되면 중소 제조업의 자동화 도미노 가능성
- BMW의 선택은 단순 파일럿이 아닌 실 생산 라인 투입 — 로봇의 신뢰성이 산업 표준을 충족했다는 시장 신호

**🤔 추가로 생각해볼 것**
- 94.3% 자율 성공률이 '나머지 5.7% 실패'를 어떻게 처리하는지가 핵심 — 안전사고 프로토콜과 책임 소재 불명확
- 제조 노동자 1.4명 대체 효과는 단기 생산성이지만, 재교육·사회 안전망 비용 포함 시 실제 경제적 효과는?
- Figure 외 1X, Agility, Boston Dynamics와의 경쟁 — 플랫폼 표준 전쟁이 시작되는 시점`,
          tags: JSON.stringify(["Figure02", "인간형로봇", "피지컬AI", "BMW", "제조자동화"]),
          sources: [{ label: "Figure AI 양산 발표", url: "https://www.figure.ai/news/figure-02-production" }],
        },
      ],
    },
    {
      category: "COMMUNITY", title: "커뮤니티 반응", order: 3,
      items: [
        {
          order: 1,
          title: "LLaMA 4 공개 직후 Reddit·X 반응: '오픈소스가 드디어 이겼다'",
          content: `**📌 팩트 요약**
- r/MachineLearning, r/LocalLLaMA에서 LLaMA 4 관련 포스팅이 24시간 내 상위 10개 독점
- X에서 #LLaMA4, #OpenSourceAI 트렌딩 1~2위 (미국·한국·일본 동시)
- Hugging Face에서 Maverick 모델 다운로드 48시간 만에 50만 회 돌파
- 'GPT-5 대신 LLaMA 4로 갈아탄다' 스레드에 댓글 2,000개 이상

**💡 의미와 인사이트**
- 커뮤니티 반응은 단순 팬심이 아닌 실제 마이그레이션 의지 — 개발자 생태계가 오픈소스로 무게중심을 옮기는 전환점
- Hugging Face 다운로드 폭발은 '직접 운영하겠다'는 수요 급증을 의미. 클라우드 AI API 의존도 탈피 움직임
- GPT-5 고가격 정책이 역설적으로 오픈소스 진영의 결집을 촉진한 결과

**🤔 추가로 생각해볼 것**
- 커뮤니티의 열기가 실제 엔터프라이즈 채택으로 이어지는 데 통상 6~12개월 지연 존재 — 실제 시장 전환은 더 천천히 진행될 것
- '오픈소스가 이겼다'는 서사가 과장된 건 아닌지 — 지원, 보안, SLA 등 엔터프라이즈 요구사항은 여전히 상용 모델이 우위
- 한국 개발자 커뮤니티(OKKY, 카카오 오픈채팅)에서의 반응은 글로벌과 다소 온도차 존재`,
          tags: JSON.stringify(["LLaMA4", "Reddit", "오픈소스커뮤니티", "HuggingFace"]),
          sources: [{ label: "r/LocalLLaMA — LLaMA 4 megathread", url: "https://www.reddit.com/r/LocalLLaMA" }],
        },
      ],
    },
    {
      category: "INDUSTRY", title: "산업·정책·투자 관점", order: 4,
      items: [
        {
          order: 1,
          title: "xAI Grok-3 Ultra 유료화 및 $200 구독 티어 출시",
          content: `**📌 팩트 요약**
- xAI가 3월 26일 Grok-3 Ultra를 월 $200 'SuperGrok' 구독으로 출시
- 실시간 X(트위터) 데이터 + 딥리서치 + 무제한 추론 토큰 포함
- 출시 48시간 만에 구독자 10만 명 돌파 (xAI 발표 기준)
- 일론 머스크 "AGI 수준 추론 가능한 유일한 상용 모델" 주장

**💡 의미와 인사이트**
- $200 구독은 시장 최고가 — '프리미엄 AI 구독' 카테고리의 가격 상한선을 머스크가 먼저 설정하는 포지셔닝
- X 실시간 데이터 독점 접근은 경쟁사가 복제 불가한 차별점 — 금융·미디어·정치 분석 분야에서 틈새 시장 가능성
- 10만 구독자 × $200 = 월 $2,000만 수익. 아직 OpenAI·Anthropic 대비 작지만 수익화 속도가 빠름

**🤔 추가로 생각해볼 것**
- '일론 머스크의 주장'과 실제 벤치마크 검증 간 신뢰도 갭 — 독립적 평가 부재 시 마케팅에 불과할 수 있음
- X 플랫폼 이탈 추세와 Grok 구독 모델의 모순 — X 사용자 감소가 Grok의 데이터 차별화 약화로 이어질 위험
- $200 구독이 지속 가능한 사업 모델인지, 아니면 얼리어답터 수요 이후 이탈이 클지`,
          tags: JSON.stringify(["Grok3", "xAI", "일론머스크", "AI구독모델"]),
          sources: [{ label: "xAI SuperGrok 발표", url: "https://x.ai/blog/supergrok" }],
        },
        {
          order: 2,
          title: "EU AI법 핵심 조항 3월 시행: 고위험 AI 규제 본격화",
          content: `**📌 팩트 요약**
- EU AI법(AI Act) 고위험 AI 시스템 규제 조항이 3월 27일부로 공식 발효
- 채용·신용평가·의료·교육 분야 AI는 사전 적합성 평가 + 등록 의무화
- 위반 시 전 세계 연매출 3% 또는 €1,500만 중 높은 금액 제재
- 빅테크 6개사(Google, Meta, Microsoft, Apple, Amazon, ByteDance) 즉각 대응팀 구성 발표

**💡 의미와 인사이트**
- EU가 전 세계 AI 규제의 사실상 표준을 선점 — '브뤼셀 효과'로 한국·일본·미국 기업도 EU 기준 준수 압박
- 채용 AI 규제가 가장 즉각적 파급 — HR테크 스타트업들의 제품 재설계 비용과 시장 재편 불가피
- 규제 대응 컨설팅·감사·인증 시장이 새로운 B2B 기회로 부상 (EU AI법 컴플라이언스 산업 예상 규모 €50억)

**🤔 추가로 생각해볼 것**
- 한국 기업의 EU 시장 진출 시 AI법 적합성 평가 준비 상태 — 대부분의 중소 AI 스타트업은 미준비 상태일 가능성
- 규제가 혁신을 억제할 것이라는 우려 vs 신뢰 가능한 AI 시장을 만드는 기반이라는 반론 — 어느 쪽이 현실화될지
- 미국은 규제 완화 기조인데, EU와 미국 간 AI 규제 격차가 벌어질수록 기업들의 '규제 차익거래' 가능성`,
          tags: JSON.stringify(["EU AI법", "AI규제", "컴플라이언스", "브뤼셀효과"]),
          sources: [{ label: "EU AI Act 공식 시행 안내", url: "https://artificialintelligenceact.eu/high-level-summary/" }],
        },
      ],
    },
    {
      category: "ANALYSIS", title: "정리 및 배경/원인 분석", order: 5,
      items: [
        {
          order: 1,
          title: "이번 주 핵심 구조: '오픈소스 대 유료'의 지각 변동",
          content: `**📌 팩트 요약**
- GPT-5(고가 유료)와 LLaMA 4(무료 오픈소스)가 같은 주에 출시되며 정면충돌
- 성능 격차가 좁혀지는 반면 가격 격차는 벌어지는 역설적 상황
- Grok-3 Ultra $200, GPT-5 Pro 등 고가 구독 모델이 동시에 등장
- EU AI법 시행으로 '성능'이 아닌 '규제 대응'이 새로운 차별화 요소로 부상

**💡 의미와 인사이트**
- AI 시장이 '단일 승자' 구조에서 '계층화된 생태계'로 분화 중 — 고가 유료(GPT-5), 무료 오픈소스(LLaMA 4), 틈새 특화(Grok) 구조 정착 가능성
- 오픈소스의 성능 도달은 상용 모델의 수익 모델을 근본적으로 위협 — OpenAI의 고가격 전략은 이에 대한 대응이자 도박
- 규제 대응 역량이 기술 역량만큼 중요해지는 시대 진입 — 컴플라이언스를 내재화한 기업이 EU·글로벌 시장에서 우위

**🤔 추가로 생각해볼 것**
- 국내 AI 기업(카카오, 네이버, LG AI연구원)은 이 지각 변동에서 어떤 포지션을 취할 것인가
- 오픈소스 모델의 확산이 AI 안전성 연구에 미치는 영향 — 통제되지 않은 강력한 모델의 악용 리스크
- 3~5년 후 AI 모델 시장의 수익 구조는 어떻게 바뀔 것인가 — 인프라·데이터·서비스 레이어로 수익이 이동할 가능성`,
          tags: JSON.stringify(["오픈소스", "AI시장구조", "규제", "수익모델분석"]),
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
  return NextResponse.json({ ok: true, message: "3/27 뉴스레터 시드 완료" });
}
