import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/cart - ดึงรายการในตะกร้า
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const cart = await db.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              price: true,
              imageUrl: true,
            },
          },
          product: {
            select: {
              id: true,
              title: true,
              slug: true,
              price: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json({ cart });
}

// POST /api/cart - เพิ่มคอร์สหรือสินค้าลงตะกร้า
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const { courseId, productId } = await req.json();

  if (!courseId && !productId) {
    return NextResponse.json({ error: "ไม่พบรหัสสินค้า" }, { status: 400 });
  }

  // สร้างตะกร้าถ้ายังไม่มี
  const cart = await db.cart.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id },
    update: {},
  });

  if (courseId) {
    // ตรวจสอบว่าคอร์สมีอยู่จริง
    const course = await db.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: "ไม่พบคอร์สนี้" }, { status: 404 });
    }

    // ตรวจสอบว่าลงทะเบียนคอร์สนี้แล้วหรือยัง
    const existingEnrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: { userId: session.user.id, courseId },
      },
    });
    if (existingEnrollment) {
      return NextResponse.json(
        { error: "คุณลงทะเบียนคอร์สนี้แล้ว" },
        { status: 400 }
      );
    }

    // ตรวจสอบว่าคอร์สอยู่ในตะกร้าแล้วหรือยัง
    const existingItem = await db.cartItem.findUnique({
      where: { cartId_courseId: { cartId: cart.id, courseId } },
    });
    if (existingItem) {
      return NextResponse.json(
        { error: "คอร์สนี้อยู่ในตะกร้าแล้ว" },
        { status: 400 }
      );
    }

    await db.cartItem.create({
      data: { cartId: cart.id, courseId },
    });
  }

  if (productId) {
    // ตรวจสอบว่าสินค้ามีอยู่จริง
    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: "ไม่พบสินค้านี้" }, { status: 404 });
    }

    // ตรวจสอบว่าซื้อสินค้านี้แล้วหรือยัง
    const existingPurchase = await db.productPurchase.findUnique({
      where: {
        userId_productId: { userId: session.user.id, productId },
      },
    });
    if (existingPurchase) {
      return NextResponse.json(
        { error: "คุณซื้อสินค้านี้แล้ว" },
        { status: 400 }
      );
    }

    // ตรวจสอบว่าสินค้าอยู่ในตะกร้าแล้วหรือยัง
    const existingItem = await db.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });
    if (existingItem) {
      return NextResponse.json(
        { error: "สินค้านี้อยู่ในตะกร้าแล้ว" },
        { status: 400 }
      );
    }

    await db.cartItem.create({
      data: { cartId: cart.id, productId },
    });
  }

  return NextResponse.json({ message: "เพิ่มลงตะกร้าแล้ว" });
}

// DELETE /api/cart - ลบรายการออกจากตะกร้า
export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const { courseId, productId } = await req.json();

  const cart = await db.cart.findUnique({
    where: { userId: session.user.id },
  });

  if (!cart) {
    return NextResponse.json({ error: "ไม่พบตะกร้า" }, { status: 404 });
  }

  if (courseId) {
    await db.cartItem.deleteMany({
      where: { cartId: cart.id, courseId },
    });
  }

  if (productId) {
    await db.cartItem.deleteMany({
      where: { cartId: cart.id, productId },
    });
  }

  return NextResponse.json({ message: "ลบออกจากตะกร้าแล้ว" });
}
