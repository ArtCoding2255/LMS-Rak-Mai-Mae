import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET - list all categories
export async function GET() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const categories = await db.articleCategory.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { articles: true } } },
  });

  return NextResponse.json(categories);
}

// POST - create category
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { name, slug } = await req.json();

  if (!name || !slug) {
    return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 });
  }

  const existing = await db.articleCategory.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "slug นี้มีอยู่แล้ว" }, { status: 400 });
  }

  const category = await db.articleCategory.create({
    data: { name, slug },
  });

  return NextResponse.json(category);
}
