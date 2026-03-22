import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
  if (!newsletter) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(newsletter);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.newsletter.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
