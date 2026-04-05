import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "ไม่มีสิทธิ์" }, { status: 403 });
    }

    const { title, slug, description, price, published } = await request.json();

    if (!title || !slug || !description || price === undefined) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 });
    }

    const existing = await db.course.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug นี้ถูกใช้แล้ว" }, { status: 400 });
    }

    const course = await db.course.create({
      data: { title, slug, description, price, published: published || false },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("Create course error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
