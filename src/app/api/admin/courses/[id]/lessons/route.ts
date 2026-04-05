import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "ไม่มีสิทธิ์" }, { status: 403 });
    }

    const { id } = await params;
    const lessons = await db.lesson.findMany({
      where: { courseId: id },
      orderBy: { position: "asc" },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error("Get lessons error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "ไม่มีสิทธิ์" }, { status: 403 });
    }

    const { id } = await params;
    const { title, description, youtubeUrl } = await request.json();

    if (!title || !youtubeUrl) {
      return NextResponse.json(
        { error: "กรุณากรอกชื่อบทเรียนและ YouTube URL" },
        { status: 400 }
      );
    }

    // หาลำดับถัดไป
    const lastLesson = await db.lesson.findFirst({
      where: { courseId: id },
      orderBy: { position: "desc" },
    });
    const nextPosition = (lastLesson?.position || 0) + 1;

    const lesson = await db.lesson.create({
      data: {
        title,
        description: description || null,
        youtubeUrl,
        position: nextPosition,
        courseId: id,
      },
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    console.error("Create lesson error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
