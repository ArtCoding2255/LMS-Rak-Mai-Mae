import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// POST /api/admin/orders/[id]/reject - ปฏิเสธ Order
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.role || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 403 });
  }

  const { id } = await params;

  const order = await db.order.findUnique({ where: { id } });

  if (!order) {
    return NextResponse.json({ error: "ไม่พบคำสั่งซื้อ" }, { status: 404 });
  }

  if (order.status !== "PENDING") {
    return NextResponse.json(
      { error: "คำสั่งซื้อนี้ได้รับการจัดการแล้ว" },
      { status: 400 }
    );
  }

  await db.order.update({
    where: { id },
    data: { status: "REJECTED" },
  });

  return NextResponse.json({ message: "ปฏิเสธคำสั่งซื้อแล้ว" });
}
