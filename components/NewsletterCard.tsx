import Link from "next/link";
import { CATEGORY_META, CategoryKey } from "@/lib/types";

type Section = { category: string; title: string };
type Newsletter = {
  id: number;
  date: string;
  title: string;
  summary: string;
  sections: Section[];
};

export default function NewsletterCard({ n }: { n: Newsletter }) {
  const dateStr = new Date(n.date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  return (
    <Link href={`/newsletter/${n.id}`}>
      <article className="group rounded-xl border border-zinc-800 bg-zinc-900 hover:border-zinc-600 hover:bg-zinc-800/60 transition-all p-5 cursor-pointer">
        <div className="flex items-center justify-between mb-3">
          <time className="text-xs text-zinc-500">{dateStr}</time>
          <span className="text-xs text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded-full">
            {n.sections.length}개 섹션
          </span>
        </div>
        <h2 className="font-semibold text-zinc-100 group-hover:text-white text-base mb-2 leading-snug">
          {n.title}
        </h2>
        <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{n.summary}</p>
        <div className="flex flex-wrap gap-1.5">
          {n.sections.map((s, i) => {
            const meta = CATEGORY_META[s.category as CategoryKey];
            if (!meta) return null;
            return (
              <span
                key={i}
                className={`text-xs px-2 py-0.5 rounded-full border ${meta.color}`}
              >
                {meta.emoji} {meta.label}
              </span>
            );
          })}
        </div>
      </article>
    </Link>
  );
}
