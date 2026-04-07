import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "กรุณากรอกอีเมล" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    // ส่ง response เหมือนกันไม่ว่าจะเจอ user หรือไม่ (เพื่อความปลอดภัย)
    if (user) {
      // ลบ token เก่าของ email นี้
      await db.passwordResetToken.deleteMany({
        where: { email },
      });

      // สร้าง token ใหม่ หมดอายุใน 1 ชั่วโมง
      const token = randomBytes(32).toString("hex");
      await db.passwordResetToken.create({
        data: {
          email,
          token,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      });

      // ส่งอีเมล
      await sendPasswordResetEmail(email, token);
    }

    return NextResponse.json({
      message: "หากอีเมลนี้มีอยู่ในระบบ เราจะส่งลิงก์รีเซ็ตรหัสผ่านให้",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด กรุณาลองใหม่" },
      { status: 500 }
    );
  }
}
