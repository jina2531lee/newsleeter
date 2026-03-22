"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import CategoryBadge from "@/components/CategoryBadge";

type Source = { id: number; label: string; url: string };
type SearchResult = {
  id: number;
  title: string;
  content: string;
  tags: string;
  sources: Source[];
  section: {
    category: string;
    title: string;
    newsletter: { id: number; date: string; title: string };
  };
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-zinc-100 mb-4">뉴스레터 검색</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            search(query);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="키워드로 검색 (예: GPT-5, 피지컬 AI, NVIDIA...)"
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-zinc-100 text-zinc-900 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-white disabled:opacity-40 transition-colors"
          >
            {loading ? "검색 중…" : "검색"}
          </button>
        </form>
      </div>

      {loading && (
        <div className="text-center py-12 text-zinc-500 text-sm">검색 중...</div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="text-center py-12 text-zinc-600">
          <p className="text-3xl mb-3">🔍</p>
          <p className="text-sm">&ldquo;{query}&rdquo;에 대한 결과가 없습니다.</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div>
          <p className="text-xs text-zinc-500 mb-4">
            &ldquo;{query}&rdquo; — {results.length}개 결과
          </p>
          <div className="space-y-3">
            {results.map((r) => {
              const dateStr = new Date(r.section.newsletter.date).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
              let tags: string[] = [];
              try { tags = JSON.parse(r.tags); } catch {}

              return (
                <Link
                  key={r.id}
                  href={`/newsletter/${r.section.newsletter.id}#section-${r.section.newsletter.id}`}
                >
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900 hover:border-zinc-600 p-4 transition-all cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <CategoryBadge category={r.section.category} />
                      <time className="text-xs text-zinc-600">{dateStr}</time>
                    </div>
                    <h3 className="font-medium text-zinc-100 text-sm mb-1">{r.title}</h3>
                    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                      {r.content.replace(/\n/g, " ")}
                    </p>
                    {tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {tags.slice(0, 4).map((t, i) => (
                          <span key={i} className="text-xs text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
