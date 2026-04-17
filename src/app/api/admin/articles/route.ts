import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET - list all articles
export async function GET() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const articles = await db.article.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
      author: { select: { name: true } },
    },
  });

  return NextResponse.json(articles);
}

// POST - create article
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { title, slug, excerpt, content, coverImage, published, categoryId } =
    await req.json();

  if (!title || !slug || !content || !categoryId) {
    return NextResponse.json(
      { error: "กรุณากรอกข้อมูลให้ครบ" },
      { status: 400 }
    );
  }

  const existing = await db.article.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "slug นี้มีอยู่แล้ว" }, { status: 400 });
  }

  const article = await db.article.create({
    data: {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      coverImage: coverImage || null,
      published: published || false,
      categoryId,
      authorId: session.user!.id!,
    },
  });

  return NextResponse.json(article);
}
