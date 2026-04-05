import type { Metadata } from "next";
import { Prompt, Noto_Sans_Thai } from "next/font/google";
import { SessionProvider } from "@/components/providers/session-provider";
import { CartProvider } from "@/components/providers/cart-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const prompt = Prompt({
  variable: "--font-heading",
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-sans",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "รักไหมแม่ Academy | เรียนถักโครเชต์ออนไลน์",
  description:
    "เรียนรู้การถักโครเชต์ออนไลน์กับ รักไหมแม่ Academy ตั้งแต่เบื้องต้นจนถึงขั้นสูง",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${prompt.variable} ${notoSansThai.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <SessionProvider>
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
