import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "กรุณากรอกอีเมล" },
        { status: 400 }
      );
    }

    // ตรวจสอบว่ามี user อยู่จริง
    const user = await db.user.findUnique({
      where: { email },
    });

    // ส่ง response เหมือนกันไม่ว่าจะเจอ user หรือไม่ (เพื่อความปลอดภัย)
    // ในอนาคตสามารถเพิ่มการส่งอีเมลจริงได้
    if (user) {
      // TODO: ส่งอีเมล reset password จริง
      // สามารถใช้ Resend, SendGrid หรือ Nodemailer ได้
      console.log(`Password reset requested for: ${email}`);
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
