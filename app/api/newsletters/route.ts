import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const newsletters = await prisma.newsletter.findMany({
    orderBy: { date: "desc" },
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
  return NextResponse.json(newsletters);
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth || auth !== `Bearer ${process.env.NEWSLETTER_API_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const newsletter = await prisma.newsletter.create({
    data: {
      date: new Date(body.date),
      title: body.title,
      summary: body.summary,
      sections: {
        create: body.sections.map(
          (
            s: {
              category: string;
              title: string;
              order: number;
              items: {
                title: string;
                content: string;
                tags: string[];
                order: number;
                sources: { label: string; url: string }[];
              }[];
            },
            si: number
          ) => ({
            category: s.category,
            title: s.title,
            order: s.order ?? si,
            items: {
              create: s.items.map(
                (
                  item: {
                    title: string;
                    content: string;
                    tags: string[];
                    order: number;
                    sources: { label: string; url: string }[];
                  },
                  ii: number
                ) => ({
                  title: item.title,
                  content: item.content,
                  tags: JSON.stringify(item.tags ?? []),
                  order: item.order ?? ii,
                  sources: {
                    create: (item.sources ?? []).map(
                      (src: { label: string; url: string }) => ({
                        label: src.label,
                        url: src.url,
                      })
                    ),
                  },
                })
              ),
            },
          })
        ),
      },
    },
    include: {
      sections: { include: { items: { include: { sources: true } } } },
    },
  });
  return NextResponse.json(newsletter, { status: 201 });
}
