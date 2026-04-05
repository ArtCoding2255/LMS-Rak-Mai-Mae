import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// POST /api/payment - อัปโหลดสลิปการชำระเงิน
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const { orderId, slipUrl, amount } = await req.json();

  if (!orderId || !slipUrl) {
    return NextResponse.json(
      { error: "กรุณากรอกข้อมูลให้ครบ" },
      { status: 400 }
    );
  }

  // ตรวจสอบว่า order เป็นของ user นี้
  const order = await db.order.findFirst({
    where: { id: orderId, userId: session.user.id },
  });

  if (!order) {
    return NextResponse.json({ error: "ไม่พบคำสั่งซื้อ" }, { status: 404 });
  }

  if (order.status !== "PENDING") {
    return NextResponse.json(
      { error: "คำสั่งซื้อนี้ไม่อยู่ในสถานะรอชำระเงิน" },
      { status: 400 }
    );
  }

  // ตรวจสอบว่ามี payment อยู่แล้วหรือไม่
  const existingPayment = await db.payment.findUnique({
    where: { orderId },
  });

  if (existingPayment) {
    return NextResponse.json(
      { error: "คำสั่งซื้อนี้มีการแจ้งชำระเงินแล้ว" },
      { status: 400 }
    );
  }

  const payment = await db.payment.create({
    data: {
      orderId,
      slipUrl,
      amount: amount || order.total,
    },
  });

  return NextResponse.json({ payment });
}
