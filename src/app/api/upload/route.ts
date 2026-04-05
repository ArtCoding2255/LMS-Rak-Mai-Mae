import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

// POST /api/upload - อัปโหลดไฟล์ (สลิปโอนเงิน, รูปคอร์ส)
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "กรุณาเลือกไฟล์" }, { status: 400 });
  }

  // ตรวจสอบประเภทไฟล์
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "รองรับเฉพาะไฟล์รูปภาพ (JPG, PNG, WebP, GIF)" },
      { status: 400 }
    );
  }

  // จำกัดขนาดไฟล์ 5MB
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { error: "ขนาดไฟล์ต้องไม่เกิน 5MB" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // สร้างชื่อไฟล์ที่ไม่ซ้ำกัน
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${crypto.randomUUID()}.${ext}`;

  // สร้างโฟลเดอร์ uploads ถ้ายังไม่มี
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  // บันทึกไฟล์
  const filepath = path.join(uploadDir, filename);
  await writeFile(filepath, buffer);

  const url = `/uploads/${filename}`;

  return NextResponse.json({ url });
}
