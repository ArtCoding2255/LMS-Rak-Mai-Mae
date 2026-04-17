import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET - get single article
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const article = await db.article.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!article) {
    return NextResponse.json({ error: "ไม่พบบทความ" }, { status: 404 });
  }

  return NextResponse.json(article);
}

// PUT - update article
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { title, slug, excerpt, content, coverImage, published, categoryId } =
    await req.json();

  if (!title || !slug || !content || !categoryId) {
    return NextResponse.json(
      { error: "กรุณากรอกข้อมูลให้ครบ" },
      { status: 400 }
    );
  }

  const existing = await db.article.findFirst({
    where: { slug, NOT: { id } },
  });
  if (existing) {
    return NextResponse.json({ error: "slug นี้มีอยู่แล้ว" }, { status: 400 });
  }

  const article = await db.article.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      coverImage: coverImage || null,
      published: published ?? false,
      categoryId,
    },
  });

  return NextResponse.json(article);
}

// DELETE - delete article
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  await db.article.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
