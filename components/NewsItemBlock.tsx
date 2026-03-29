"use client";
import ReactMarkdown from "react-markdown";

type Source = { id: number; label: string; url: string };
type Item = {
  id: number;
  title: string;
  content: string;
  tags: string;
  sources: Source[];
};

export default function NewsItemBlock({ item }: { item: Item }) {
  let tags: string[] = [];
  try {
    tags = JSON.parse(item.tags);
  } catch {}

  return (
    <div className="rounded-lg bg-zinc-800/50 border border-zinc-700/50 p-4">
      <h3 className="font-semibold text-zinc-100 mb-3 text-sm leading-snug">
        {item.title}
      </h3>
      <div className="news-content text-sm">
        <ReactMarkdown>{item.content}</ReactMarkdown>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {tags.map((t, i) => (
            <span
              key={i}
              className="text-xs text-zinc-400 bg-zinc-700/60 px-2 py-0.5 rounded-full"
            >
              #{t}
            </span>
          ))}
        </div>
      )}
      {item.sources.length > 0 && (
        <div className="mt-3 pt-3 border-t border-zinc-700/50">
          <p className="text-xs text-zinc-500 mb-1.5">출처</p>
          <ul className="flex flex-col gap-1">
            {item.sources.map((s) => (
              <li key={s.id}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 hover:underline truncate block"
                >
                  ↗ {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
