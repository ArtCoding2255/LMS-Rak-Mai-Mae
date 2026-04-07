import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "ข้อมูลไม่ครบถ้วน" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" },
        { status: 400 }
      );
    }

    // ค้นหา token ที่ยังไม่หมดอายุ
    const resetToken = await db.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "ลิงก์หมดอายุหรือไม่ถูกต้อง กรุณาขอรีเซ็ตรหัสผ่านใหม่" },
        { status: 400 }
      );
    }

    // อัพเดทรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.user.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword },
    });

    // ลบ token ที่ใช้แล้ว
    await db.passwordResetToken.delete({
      where: { id: resetToken.id },
    });

    return NextResponse.json({
      message: "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด กรุณาลองใหม่" },
      { status: 500 }
    );
  }
}
