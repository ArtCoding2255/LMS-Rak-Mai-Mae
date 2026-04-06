import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "ไม่มีสิทธิ์" }, { status: 403 });
    }

    const { id } = await params;
    const { title, slug, description, price, imageUrl, pdfUrl, published } = await request.json();

    const existing = await db.product.findFirst({
      where: { slug, NOT: { id } },
    });
    if (existing) {
      return NextResponse.json({ error: "Slug นี้ถูกใช้แล้ว" }, { status: 400 });
    }

    const product = await db.product.update({
      where: { id },
      data: { title, slug, description, price, imageUrl, pdfUrl, published },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "ไม่มีสิทธิ์" }, { status: 403 });
    }

    const { id } = await params;
    await db.product.delete({ where: { id } });

    return NextResponse.json({ message: "ลบสินค้าเรียบร้อย" });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
