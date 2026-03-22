import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!q) return NextResponse.json([]);

  const items = await prisma.newsItem.findMany({
    where: {
      OR: [
        { title: { contains: q } },
        { content: { contains: q } },
        { tags: { contains: q } },
      ],
    },
    include: {
      sources: true,
      section: {
        include: {
          newsletter: { select: { id: true, date: true, title: true } },
        },
      },
    },
    orderBy: { section: { newsletter: { date: "desc" } } },
    take: 30,
  });

  return NextResponse.json(items);
}
