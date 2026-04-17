import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// PUT - update category
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { name, slug } = await req.json();

  if (!name || !slug) {
    return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 });
  }

  const existing = await db.articleCategory.findFirst({
    where: { slug, NOT: { id } },
  });
  if (existing) {
    return NextResponse.json({ error: "slug นี้มีอยู่แล้ว" }, { status: 400 });
  }

  const category = await db.articleCategory.update({
    where: { id },
    data: { name, slug },
  });

  return NextResponse.json(category);
}

// DELETE - delete category
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const articleCount = await db.article.count({ where: { categoryId: id } });
  if (articleCount > 0) {
    return NextResponse.json(
      { error: "ไม่สามารถลบหมวดหมู่ที่มีบทความอยู่ได้" },
      { status: 400 }
    );
  }

  await db.articleCategory.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
