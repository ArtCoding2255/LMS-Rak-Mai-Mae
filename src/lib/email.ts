import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";

export async function sendPasswordResetEmail(
  email: string,
  token: string
) {
  const baseUrl = process.env.NEXTAUTH_URL
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  const { error: sendError } = await getResend().emails.send({
    from: `รักไหมแม่ Academy <${FROM_EMAIL}>`,
    to: email,
    subject: "รีเซ็ตรหัสผ่าน - รักไหมแม่ Academy",
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #b5838d; text-align: center;">รักไหมแม่ Academy</h2>
        <hr style="border: 1px solid #f0e6e6;" />
        <p>สวัสดีค่ะ,</p>
        <p>เราได้รับคำขอรีเซ็ตรหัสผ่านสำหรับบัญชีของคุณ กรุณากดปุ่มด้านล่างเพื่อตั้งรหัสผ่านใหม่:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #b5838d; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-size: 16px;">
            ตั้งรหัสผ่านใหม่
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">ลิงก์นี้จะหมดอายุใน 1 ชั่วโมง</p>
        <p style="color: #666; font-size: 14px;">หากคุณไม่ได้ขอรีเซ็ตรหัสผ่าน กรุณาเพิกเฉยอีเมลนี้</p>
        <hr style="border: 1px solid #f0e6e6;" />
        <p style="color: #999; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} รักไหมแม่ Academy</p>
      </div>
    `,
  });

  if (sendError) {
    console.error("Resend error:", sendError);
    throw new Error(sendError.message);
  }
}
