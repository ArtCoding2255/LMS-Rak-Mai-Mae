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
        include: { course: true, product: true },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: "ตะกร้าว่างเปล่า" }, { status: 400 });
  }

  // ตรวจสอบว่ามีคอร์สที่ลงทะเบียนแล้วหรือไม่
  const courseIds = cart.items
    .filter((item) => item.courseId)
    .map((item) => item.courseId as string);

  if (courseIds.length > 0) {
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
  }

  // ตรวจสอบว่ามีสินค้าที่ซื้อแล้วหรือไม่
  const productIds = cart.items
    .filter((item) => item.productId)
    .map((item) => item.productId as string);

  if (productIds.length > 0) {
    const existingPurchases = await db.productPurchase.findMany({
      where: {
        userId: session.user.id,
        productId: { in: productIds },
      },
    });

    if (existingPurchases.length > 0) {
      return NextResponse.json(
        { error: "มีสินค้าที่ซื้อแล้วอยู่ในตะกร้า กรุณาลบออกก่อน" },
        { status: 400 }
      );
    }
  }

  // คำนวณยอดรวม
  const total = cart.items.reduce((sum, item) => {
    if (item.course) return sum + item.course.price;
    if (item.product) return sum + item.product.price;
    return sum;
  }, 0);

  // สร้าง Order + OrderItems ใน transaction
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const order = await db.$transaction(async (tx: any) => {
    const newOrder = await tx.order.create({
      data: {
        userId: session.user!.id!,
        total,
        items: {
          create: cart.items.map((item) => ({
            courseId: item.courseId || undefined,
            productId: item.productId || undefined,
            price: item.course?.price ?? item.product?.price ?? 0,
          })),
        },
      },
      include: {
        items: {
          include: {
            course: { select: { title: true } },
            product: { select: { title: true } },
          },
        },
      },
    });

    // ลบรายการในตะกร้า
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return newOrder;
  });

  return NextResponse.json({ order });
}
