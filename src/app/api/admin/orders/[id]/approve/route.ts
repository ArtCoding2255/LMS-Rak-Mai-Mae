import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// POST /api/admin/orders/[id]/approve - อนุมัติ Order + สร้าง Enrollment/ProductPurchase
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.role || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 403 });
  }

  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: "ไม่พบคำสั่งซื้อ" }, { status: 404 });
  }

  if (order.status !== "PENDING") {
    return NextResponse.json(
      { error: "คำสั่งซื้อนี้ได้รับการจัดการแล้ว" },
      { status: 400 }
    );
  }

  // อนุมัติ Order + สร้าง Enrollment/ProductPurchase
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await db.$transaction(async (tx: any) => {
    await tx.order.update({
      where: { id },
      data: { status: "APPROVED" },
    });

    for (const item of order.items) {
      // สร้าง Enrollment สำหรับคอร์ส
      if (item.courseId) {
        await tx.enrollment.upsert({
          where: {
            userId_courseId: {
              userId: order.userId,
              courseId: item.courseId,
            },
          },
          create: {
            userId: order.userId,
            courseId: item.courseId,
            status: "ACTIVE",
          },
          update: {
            status: "ACTIVE",
          },
        });
      }

      // สร้าง ProductPurchase สำหรับสินค้าดิจิทัล
      if (item.productId) {
        await tx.productPurchase.upsert({
          where: {
            userId_productId: {
              userId: order.userId,
              productId: item.productId,
            },
          },
          create: {
            userId: order.userId,
            productId: item.productId,
          },
          update: {},
        });
      }
    }
  });

  return NextResponse.json({ message: "อนุมัติคำสั่งซื้อสำเร็จ" });
}
