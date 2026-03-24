import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import CategoryBadge from "@/components/CategoryBadge";
import NewsItemBlock from "@/components/NewsItemBlock";
import { CATEGORY_META, CategoryKey } from "@/lib/types";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NewsletterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const newsletter = await prisma.newsletter.findUnique({
    where: { id: Number(id) },
    include: {
      sections: {
        orderBy: { order: "asc" },
        include: {
          items: {
            orderBy: { order: "asc" },
            include: { sources: true },
          },
        },
      },
    },
  });

  if (!newsletter) notFound();

  const dateStr = new Date(newsletter.date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <article>
      {/* 헤더 */}
      <div className="mb-8 pb-6 border-b border-zinc-800">
        <Link
          href="/"
          className="text-xs text-zinc-500 hover:text-zinc-300 mb-4 inline-flex items-center gap-1 transition-colors"
        >
          ← 목록으로
        </Link>
        <time className="block text-sm text-zinc-500 mb-2">{dateStr}</time>
        <h1 className="text-2xl font-bold text-zinc-100 mb-3 leading-snug">
          {newsletter.title}
        </h1>
        <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-lg p-4">
          <p className="text-xs text-zinc-500 mb-1">핵심 흐름 한 줄 요약</p>
          <p className="text-sm text-zinc-200 font-medium leading-relaxed">
            &ldquo;{newsletter.summary}&rdquo;
          </p>
        </div>
      </div>

      {/* 섹션 목차 */}
      <nav className="mb-8 flex flex-wrap gap-2">
        {newsletter.sections.map((s: (typeof newsletter.sections)[number]) => (
          <a
            key={s.id}
            href={`#section-${s.id}`}
            className="flex items-center"
          >
            <CategoryBadge category={s.category} />
          </a>
        ))}
      </nav>

      {/* 섹션 본문 */}
      <div className="space-y-12">
        {newsletter.sections.map((section: (typeof newsletter.sections)[number]) => {
          const meta = CATEGORY_META[section.category as CategoryKey];
          return (
            <section key={section.id} id={`section-${section.id}`}>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-zinc-800">
                <span className="text-xl">{meta?.emoji}</span>
                <div>
                  <p className="text-xs text-zinc-500">{meta?.label}</p>
                  <h2 className="font-bold text-zinc-100 text-base">
                    {section.title}
                  </h2>
                </div>
              </div>
              <div className="space-y-4">
                {section.items.map((item: (typeof section.items)[number]) => (
                  <NewsItemBlock key={item.id} item={item} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </article>
  );
}
