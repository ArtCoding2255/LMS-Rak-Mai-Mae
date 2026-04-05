import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// POST /api/progress - บันทึกความก้าวหน้าการเรียน
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const { lessonId, completed } = await req.json();

  if (!lessonId) {
    return NextResponse.json({ error: "ไม่พบรหัสบทเรียน" }, { status: 400 });
  }

  // ตรวจสอบว่า lesson มีอยู่จริงและ user ลงทะเบียนคอร์สนี้แล้ว
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: { course: true },
  });

  if (!lesson) {
    return NextResponse.json({ error: "ไม่พบบทเรียน" }, { status: 404 });
  }

  const enrollment = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: lesson.courseId,
      },
    },
  });

  if (!enrollment || enrollment.status !== "ACTIVE") {
    return NextResponse.json(
      { error: "คุณไม่ได้ลงทะเบียนคอร์สนี้" },
      { status: 403 }
    );
  }

  // อัปเดตหรือสร้างความก้าวหน้า
  await db.lessonProgress.upsert({
    where: {
      userId_lessonId: { userId: session.user.id, lessonId },
    },
    create: {
      userId: session.user.id,
      lessonId,
      completed: completed ?? true,
      completedAt: completed ? new Date() : null,
    },
    update: {
      completed: completed ?? true,
      completedAt: completed ? new Date() : null,
    },
  });

  return NextResponse.json({ message: "บันทึกความก้าวหน้าแล้ว" });
}
