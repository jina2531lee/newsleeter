import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbUrl = `file:${path.resolve(process.cwd(), "prisma/dev.db")}`;
const adapter = new PrismaBetterSqlite3({ url: dbUrl });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  // 기존 데이터 초기화
  await prisma.newsletter.deleteMany();

  await prisma.newsletter.create({
    data: {
      date: new Date("2026-03-21T07:00:00+09:00"),
      title: "로완의 AI 뉴스레터 — 2026년 3월 21일 (주간 호)",
      summary:
        "에이전트 AI는 이미 사무실에 들어왔고, 피지컬 AI는 공장 문을 두드리고 있다 — 이번 주는 그 두 물결이 동시에 정점을 찍은 순간이었다.",
      sections: {
        create: [
          {
            category: "SEARCH_AGENT",
            title: "검색·에이전트 AI",
            order: 1,
            items: {
              create: [
                {
                  order: 1,
                  title: "모델 전쟁의 결승전: GPT-5.4 vs Gemini 3.1 vs Claude Opus 4.6",
                  content:
                    "이번 주 가장 큰 축은 세 빅랩의 플래그십 충돌이다. 단순 성능 비교를 넘어, 각 모델이 서로 다른 '에이전트 시나리오'에서 승부를 가르기 시작했다.\n\nOpenAI GPT-5.4 'Thinking'은 실제 데스크톱 업무를 시뮬레이션하는 OSWorld-V 벤치마크에서 75% 달성(인간 기준선 72.4% 초과). 웹 검색 활성화 시 환각률이 GPT-4o 대비 45% 감소. 1M 토큰 컨텍스트 창. 3월 11일부로 GPT-5.1 계열은 ChatGPT에서 완전 종료됨.\n\nGoogle Gemini 3.1은 ARC-AGI-2에서 77.1% 기록, GPQA Diamond 94.3%로 Claude·GPT-5를 앞섰다. Flash-Lite는 입력 토큰당 $0.25로 스타트업 친화적 가격 책정.\n\nAnthropic Claude Opus 4.6은 GDPval-AA Elo 리더보드에서 Sonnet 4.6이 1,633점으로 1위. Microsoft PowerPoint·Excel 애드인으로 동시 배포. 메모리 기능 전면 롤아웃.\n\nDeepSeek V4는 1조 파라미터 오픈웨이트 모델로 KV 캐시를 GPU·CPU·디스크에 분산 저장하는 신규 아키텍처 도입, 메모리 사용량 40% 절감.",
                  tags: JSON.stringify(["GPT-5.4", "Gemini3.1", "Claude", "DeepSeek", "에이전트AI"]),
                  sources: {
                    create: [
                      { label: "AI Model Releases Week of March 14 (LabLa)", url: "https://www.labla.org/latest-ai-model-releases-past-24-hours/ai-model-releases-everything-that-dropped-this-week-march-14-2026/" },
                      { label: "BuildFastWithAI — 12+ AI Models in March 2026", url: "https://www.buildfastwithai.com/blogs/ai-models-march-2026-releases" },
                    ],
                  },
                },
                {
                  order: 2,
                  title: "검색 패러다임의 지각 변동: Google Core Update + 에이전트 커머스",
                  content:
                    "구글은 현재 19일 짜리 핵심 알고리즘 대규모 업데이트 진행 중이다. AI 비편집 대량 콘텐츠 사이트는 검색 노출이 35~60% 급락 중.\n\n동시에 구글은 웹사이트가 AI 검색 피처에 콘텐츠 사용을 거부(opt-out)할 수 있는 메커니즘 개발 중 — 영국 경쟁 규제당국 압박에 대한 대응.\n\nShopify는 AI가 소비자를 대신해 발견·비교·구매까지 수행하는 에이전트 커머스 전략을 본격화. Sidekick 에이전트 및 상인 데이터 연동 프로토콜 개발 중. 검색의 종말이 아니라 '에이전트가 검색을 내재화하는 구조'로의 전환이 핵심.",
                  tags: JSON.stringify(["Google", "검색SEO", "Shopify", "에이전트커머스"]),
                  sources: {
                    create: [
                      { label: "MarketingProfs — AI Update March 20, 2026", url: "https://www.marketingprofs.com/opinions/2026/54448/ai-update-march-20-2026-ai-news-and-views-from-the-past-week" },
                    ],
                  },
                },
              ],
            },
          },
          {
            category: "PHYSICAL_AI",
            title: "피지컬 AI",
            order: 2,
            items: {
              create: [
                {
                  order: 1,
                  title: "NVIDIA GTC 2026: 피지컬 AI 원년 선포",
                  content:
                    "젠슨 황은 GTC 키노트에서 '피지컬 AI가 도래했다 — 모든 산업 기업이 로봇 기업이 될 것'이라고 선언.\n\nCosmos 3: 합성 세계 생성·비전 추론·행동 시뮬레이션을 통합한 월드 파운데이션 모델.\n\nPhysical AI Data Factory Blueprint: Microsoft Azure 등 클라우드 파트너를 통해 대규모 로봇 훈련 데이터를 자동 생성·보강·평가하는 오픈 레퍼런스 아키텍처.\n\nDisney 협업: NVIDIA Newton 프레임워크로 올라프(Olaf) 로봇과 BDX 드로이드를 훈련, 3월 29일 디즈니랜드 파리 데뷔 예정.\n\n파트너사: ABB, FANUC, Figure, Agility, KUKA, Medtronic, Universal Robots 등 글로벌 로봇/의료 장비 기업 총집결.",
                  tags: JSON.stringify(["NVIDIA", "GTC2026", "피지컬AI", "로봇", "Cosmos"]),
                  sources: {
                    create: [
                      { label: "NVIDIA Newsroom — Physical AI to the Real World", url: "https://nvidianews.nvidia.com/news/nvidia-and-global-robotics-leaders-take-physical-ai-to-the-real-world" },
                      { label: "NVIDIA — Physical AI Data Factory Blueprint", url: "https://nvidianews.nvidia.com/news/nvidia-announces-open-physical-ai-data-factory-blueprint-to-accelerate-robotics-vision-ai-agents-and-autonomous-vehicle-development" },
                    ],
                  },
                },
                {
                  order: 2,
                  title: "FANUC × NVIDIA: 산업 로봇의 AI 전환",
                  content:
                    "세계 1위 산업 로봇 공급사 FANUC이 NVIDIA와 공식 파트너십 체결(3월 20일). NVIDIA Jetson 기반 AI 컴퓨팅으로 공장 디지털 트윈 구축 → 가상 훈련 → 실환경 배포 파이프라인 구축.\n\n자동차·물류·식품 가공 분야 적용 시작. 기존 FANUC 로봇의 한계인 '변동성 대응 불가' 문제를 AI로 해결하는 구조적 업그레이드.",
                  tags: JSON.stringify(["FANUC", "NVIDIA", "산업로봇", "디지털트윈"]),
                  sources: {
                    create: [
                      { label: "Robotics & Automation News — FANUC × NVIDIA", url: "https://roboticsandautomationnews.com/2026/03/20/fanuc-partners-with-nvidia-to-accelerate-physical-ai-in-industrial-robotics/99989/" },
                    ],
                  },
                },
                {
                  order: 3,
                  title: "얀 르쿤의 AMI Labs: 세계 모델(World Model)에 10억 달러",
                  content:
                    "튜링상 수상자이자 전 Meta 수석 AI 과학자 얀 르쿤이 창업한 Advanced Machine Intelligence(AMI) Labs가 3월 10일 유럽 역사상 최대 규모 시드 라운드인 10.3억 달러 유치(밸류에이션 35억 달러).\n\nNVIDIA, Bezos Expeditions, Temasek 등 참여. LLM의 대안 아키텍처인 '세계 모델(World Model)' — 물리적 세계의 작동 방식을 이해하는 방식으로 학습 — 을 로봇·헬스케어·제조에 적용 목표. 르쿤이 오랫동안 비판해온 LLM 패러다임에 대한 직접적 도전.",
                  tags: JSON.stringify(["얀르쿤", "AMILabs", "WorldModel", "시드투자"]),
                  sources: {
                    create: [
                      { label: "Deloitte — Physical AI Humanoid Robots Tech Trends", url: "https://www.deloitte.com/us/en/insights/topics/technology-management/tech-trends/2026/physical-ai-humanoid-robots.html" },
                    ],
                  },
                },
                {
                  order: 4,
                  title: "RoboForce $52M 조달: 산업 현장의 로보-노동력",
                  content:
                    "산업 현장 고위험 작업 전문 로봇 스타트업 RoboForce가 5,200만 달러 조달(YZi Labs 주도, 제리 양 참여). 태양광·데이터센터·채굴·해운·물류 현장 타겟.\n\n인력 부족과 위험 작업 기피 심화로 산업 로봇 수요가 구체적 비즈니스 모델을 가진 스타트업으로 집중.",
                  tags: JSON.stringify(["RoboForce", "산업로봇", "투자", "로보노동력"]),
                  sources: {
                    create: [
                      { label: "Robotics & Automation News — RoboForce $52M", url: "https://roboticsandautomationnews.com/2026/03/17/roboforce-raises-52-million-to-build-physical-ai-robots-for-industrial-work/99758/" },
                    ],
                  },
                },
              ],
            },
          },
          {
            category: "COMMUNITY",
            title: "커뮤니티 반응 (YouTube·팟캐스트·블로그·Reddit·X)",
            order: 3,
            items: {
              create: [
                {
                  order: 1,
                  title: "YouTube: AI 인용 1위 플랫폼으로 등극",
                  content:
                    "6.1백만 건의 AI 인용 분석 결과(Goodie AI), YouTube 인용 비중: 2025년 8월 18.9% → 2025년 12월 39.2%. Reddit 인용 비중: 44.2% → 20.3%.\n\n이번 주 YouTube에서 가장 뜨거운 AI 관련 토픽은 'GPT-5.4 vs Gemini 3.1 실전 비교', '에이전트 AI가 내 직업을 빼앗는가', 'NVIDIA GTC 2026 요약' 등. AI 유튜버들의 모델 비교 콘텐츠가 트래픽 폭증 중.",
                  tags: JSON.stringify(["YouTube", "AI인용", "콘텐츠트렌드"]),
                  sources: {
                    create: [
                      { label: "PikaSEO — YouTube Overtakes Reddit in AI Citations", url: "https://pikaseo.com/articles/youtube-overtakes-reddit-ai-citations" },
                    ],
                  },
                },
                {
                  order: 2,
                  title: "Reddit: 인간 콘텐츠의 마지막 보루",
                  content:
                    "r/artificial, r/MachineLearning, r/singularity 이번 주 핫 토픽:\n- DeepSeek V4 오픈웨이트 공개 — 'GPT-5.4 유료 쓸 이유가 있나?' 논쟁\n- ServiceNow CEO의 '대졸 실업률 30%' 발언 — 취업준비생 커뮤니티에서 공포 확산\n- Claude 메모리 기능 — '드디어 일상 비서로 쓸 수 있겠다' vs '데이터 프라이버시 우려'\n\nReddit DAU 1억 2,100만 명 돌파(전년비 +19%). AI 범람 시대에 역설적으로 '인간 진짜 후기'를 찾는 수요가 Reddit으로 집중.",
                  tags: JSON.stringify(["Reddit", "커뮤니티반응", "DeepSeek", "취업불안"]),
                  sources: {
                    create: [
                      { label: "AI METRIX — Reddit Human Content 2026", url: "https://aimetrix.org/reddit-human-content-2026/" },
                    ],
                  },
                },
                {
                  order: 3,
                  title: "X·팟캐스트·블로그 동향",
                  content:
                    "3월 18일 X 플랫폼이 전 세계적으로 일시 다운. AI 업계 인사들은 LinkedIn과 Bluesky로 이동해 글을 올리는 등 플랫폼 의존도 분산 움직임 포착.\n\nX 트렌딩 키워드: #GPT54, #GeminiUltra, #PhysicalAI, #RobotTakeover, #DeepSeekV4\n\nLex Fridman Podcast: 얀 르쿤 AMI Labs 발표 직후 르쿤 관련 과거 에피소드 재부상, 'LLM은 틀렸다' 논쟁 재점화.\n\n기술 블로그: Anthropic의 claude.ai/code 에이전트 코딩 경험기 및 'GPT-5.4로 SWE-Bench 재현 실험' 포스팅이 Hacker News 상위권 진입.",
                  tags: JSON.stringify(["X트위터", "팟캐스트", "HackerNews", "LexFridman"]),
                  sources: {
                    create: [
                      { label: "Tom's Guide — X Outage March 18", url: "https://www.tomsguide.com/news/live/twitter-x-outage-march-18-2026" },
                    ],
                  },
                },
              ],
            },
          },
          {
            category: "INDUSTRY",
            title: "산업·정책·투자 관점",
            order: 4,
            items: {
              create: [
                {
                  order: 1,
                  title: "투자 규모: 2026년은 'AI 인프라 슈퍼사이클'",
                  content:
                    "빅테크 AI 투자 총액 예상: 6,500억 달러(Bridgewater Associates)\n\nOpenAI 연간 매출 돌파: $250억 이상, IPO 준비 가시화\nAnthropic 연간 매출: $190억 접근\n모델 API 가격: 2024년 대비 60~80% 하락 — AI 민주화 가속\nNVIDIA 4분기 매출 YoY +73% 달성에도 주가 -5% — '잠재력 할인에서 증거 요구로' 시장 논리 전환",
                  tags: JSON.stringify(["투자", "OpenAI", "Anthropic", "NVIDIA", "IPO"]),
                  sources: {
                    create: [
                      { label: "AI Funding Tracker — Latest Deals 2026", url: "https://aifundingtracker.com/ai-startup-funding-news-today/" },
                      { label: "NVIDIA Blog — State of AI Report 2026", url: "https://blogs.nvidia.com/blog/state-of-ai-report-2026/" },
                    ],
                  },
                },
                {
                  order: 2,
                  title: "정책 동향: 미국·영국·EU 삼각 규제 지형",
                  content:
                    "미국: 규제 완화·민간 주도 혁신 모델 유지. 다만 중국이 산업 로봇 배포에서 앞서가는 것에 대한 의회 내 경쟁력 우려 확산.\n\n영국: AI 생성 콘텐츠 라벨링 의무화 법안 추진 + UKRI £16억 파운드 4개년 AI 연구 투자 계획 발표. 산하 기초 AI 연구소에 £4,000만 파운드 직접 지원.\n\nEU: AI법(AI Act) 협상에서 비동의 AI 딥페이크 금지 조항 통과 추진.\n\n고용 충격: ServiceNow CEO, '2년 내 대졸 실업률 30% 가능성' 경고. Block·Atlassian 등은 이미 AI 자동화를 이유로 인력 감축 단행.",
                  tags: JSON.stringify(["AI정책", "영국UKRI", "EU AI법", "고용충격"]),
                  sources: {
                    create: [
                      { label: "Open Access Government — UK £40M AI Research Lab", url: "https://www.openaccessgovernment.org/uk-launches-40-million-fundamental-ai-research-lab-for-the-next-wave-of-breakthroughs/" },
                      { label: "Crestwood Advisors — March 2026 Market Shifts", url: "https://www.crestwoodadvisors.com/march-2026-economic-update-the-markets-shifts-on-ai-expectations/" },
                    ],
                  },
                },
              ],
            },
          },
          {
            category: "ANALYSIS",
            title: "정리 및 배경/원인 분석",
            order: 5,
            items: {
              create: [
                {
                  order: 1,
                  title: "구조적 배경: 왜 지금인가?",
                  content:
                    "1. 컨텍스트 창 1M 토큰 시대 — GPT-5.4, Gemini 3.1, Claude Opus 4.6 모두 100만 토큰 이상 지원. 단일 프롬프트로 법인 계약서 전체, 코드베이스 전체를 처리할 수 있는 임계값 돌파. '에이전트가 실제 업무를 처리할 수 있다'는 기술적 조건 충족.\n\n2. 가격 붕괴 — 모델 API 가격이 전년 대비 60~80% 하락. 대규모 에이전트 배포의 경제성 실현.\n\n3. NVIDIA의 생태계 전략 — Cosmos + Isaac + GR00T N + Jetson + Agent Toolkit으로 피지컬 AI 풀스택 수직 통합 완성.\n\n4. 오픈소스 압력 — DeepSeek V4의 1조 파라미터 오픈웨이트 공개가 상용 모델 가격 인하를 강제. 얀 르쿤의 AMI Labs도 오픈 아키텍처 강조.\n\n5. 고용 시장 불안의 현실화 — '미래 위협'이었던 AI 에이전트의 일자리 대체가 현재 진행형 이슈로 전환.",
                  tags: JSON.stringify(["분석", "구조적배경", "에이전트AI", "오픈소스"]),
                  sources: { create: [] },
                },
                {
                  order: 2,
                  title: "이번 주 주목할 약신호 (Weak Signal)",
                  content:
                    "멀티모델 전략의 부상: 단일 AI 플랫폼 의존에서 목적별 모델 혼합 사용으로 기업 전략 전환 가시화. 곧 '모델 오케스트레이션 레이어' 수요의 폭발로 이어질 것.\n\nAI 사이버보안의 투자 카테고리화: 에이전트 AI 확대 → 새로운 공격 표면(attack surface) 생성. Kai의 $125M 라운드는 이 분야가 독립 투자 카테고리로 성숙했음을 보여줌.\n\nYouTube의 AI 인용 역전: 콘텐츠 생태계의 권력 이동이 검색 최적화(SEO) 전략을 근본적으로 재편 중.",
                  tags: JSON.stringify(["WeakSignal", "멀티모델", "AI보안", "YouTube인용"]),
                  sources: { create: [] },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ 시드 완료: 2026-03-21 뉴스레터 입력됨");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
