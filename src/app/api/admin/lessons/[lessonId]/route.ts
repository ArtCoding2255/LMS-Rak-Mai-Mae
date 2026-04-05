import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "ไม่มีสิทธิ์" }, { status: 403 });
    }

    const { lessonId } = await params;
    const { title, description, youtubeUrl } = await request.json();

    const lesson = await db.lesson.update({
      where: { id: lessonId },
      data: { title, description, youtubeUrl },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Update lesson error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "ไม่มีสิทธิ์" }, { status: 403 });
    }

    const { lessonId } = await params;
    await db.lesson.delete({ where: { id: lessonId } });

    return NextResponse.json({ message: "ลบบทเรียนเรียบร้อย" });
  } catch (error) {
    console.error("Delete lesson error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
