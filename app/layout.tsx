import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "로완의 AI 뉴스레터",
  description: "큐레이터 로완이 골라주는 주간 AI 동향 뉴스레터 아카이브",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ko"
      className="h-full antialiased"
    >
      <body className="min-h-full bg-zinc-950 text-zinc-100 flex flex-col">
        <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 group">
              <span className="text-xl">📰</span>
              <div>
                <p className="font-semibold text-zinc-100 group-hover:text-white leading-tight">
                  로완의 AI 뉴스레터
                </p>
                <p className="text-xs text-zinc-500">Weekly AI Digest</p>
              </div>
            </a>
            <a
              href="/search"
              className="text-sm text-zinc-400 hover:text-zinc-100 flex items-center gap-1 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
              검색
            </a>
          </div>
        </header>
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-zinc-800 py-6 text-center text-xs text-zinc-600">
          © {new Date().getFullYear()} 로완의 AI 뉴스레터 — 매주 목요일 오전 7시
        </footer>
      </body>
    </html>
  );
}
