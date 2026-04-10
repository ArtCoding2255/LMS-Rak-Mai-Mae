import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/enrollments/unseen - จำนวนคอร์สใหม่ที่ยังไม่ได้ดู
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ count: 0 });
  }

  const count = await db.enrollment.count({
    where: {
      userId: session.user.id,
      seen: false,
      status: "ACTIVE",
    },
  });

  return NextResponse.json({ count });
}

// POST /api/enrollments/unseen - mark ทั้งหมดเป็น seen
export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await db.enrollment.updateMany({
    where: {
      userId: session.user.id,
      seen: false,
    },
    data: { seen: true },
  });

  return NextResponse.json({ message: "ok" });
}
