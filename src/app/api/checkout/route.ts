import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// POST /api/checkout - สร้าง Order จากตะกร้า
export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  // ดึงตะกร้าพร้อมรายการ
  const cart = await db.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { course: true },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: "ตะกร้าว่างเปล่า" }, { status: 400 });
  }

  // ตรวจสอบว่ามีคอร์สที่ลงทะเบียนแล้วหรือไม่
  const courseIds = cart.items.map((item: { courseId: string }) => item.courseId);
  const existingEnrollments = await db.enrollment.findMany({
    where: {
      userId: session.user.id,
      courseId: { in: courseIds },
    },
  });

  if (existingEnrollments.length > 0) {
    return NextResponse.json(
      { error: "มีคอร์สที่ลงทะเบียนแล้วอยู่ในตะกร้า กรุณาลบออกก่อน" },
      { status: 400 }
    );
  }

  // คำนวณยอดรวม
  const total = cart.items.reduce((sum: number, item: { course: { price: number } }) => sum + item.course.price, 0);

  // สร้าง Order + OrderItems ใน transaction
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const order = await db.$transaction(async (tx: any) => {
    const newOrder = await tx.order.create({
      data: {
        userId: session.user!.id!,
        total,
        items: {
          create: cart.items.map((item: { courseId: string; course: { price: number } }) => ({
            courseId: item.courseId,
            price: item.course.price,
          })),
        },
      },
      include: {
        items: { include: { course: { select: { title: true } } } },
      },
    });

    // ลบรายการในตะกร้า
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return newOrder;
  });

  return NextResponse.json({ order });
}
