import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "ไม่มีสิทธิ์" }, { status: 403 });
    }

    const { lessons } = await request.json();

    // lessons = [{ id: "xxx", position: 1 }, { id: "yyy", position: 2 }, ...]
    if (!lessons || !Array.isArray(lessons)) {
      return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    }

    // อัปเดตลำดับทั้งหมดพร้อมกัน
    await db.$transaction(
      lessons.map((lesson: { id: string; position: number }) =>
        db.lesson.update({
          where: { id: lesson.id },
          data: { position: lesson.position },
        })
      )
    );

    return NextResponse.json({ message: "จัดลำดับเรียบร้อย" });
  } catch (error) {
    console.error("Reorder lessons error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
