import { prisma } from "@/lib/db";
import NewsletterCard from "@/components/NewsletterCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const newsletters = await prisma.newsletter.findMany({
    orderBy: { date: "desc" },
    include: { sections: { select: { category: true, title: true } } },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">
          로완의 AI 뉴스레터 아카이브
        </h1>
        <p className="text-zinc-400 text-sm">
          매주 토요일 오전 7시 기준, 최근 1주일 AI 동향을 분석 중심으로 정리합니다.
        </p>
      </div>

      {newsletters.length === 0 ? (
        <div className="text-center py-24 text-zinc-600">
          <p className="text-4xl mb-4">📭</p>
          <p>아직 발행된 뉴스레터가 없습니다.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {newsletters.map((n) => (
            <NewsletterCard
              key={n.id}
              n={{ ...n, date: n.date.toISOString() }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
