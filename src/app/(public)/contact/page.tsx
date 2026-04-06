"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // TODO: เชื่อมต่อกับ API สำหรับส่งข้อความจริง
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("ส่งข้อความเรียบร้อยแล้ว! เราจะติดต่อกลับโดยเร็วค่ะ");
    (e.target as HTMLFormElement).reset();
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">ติดต่อเรา</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          มีคำถามหรืออยากสอบถามเพิ่มเติม? ติดต่อเราได้เลยค่ะ
          ยินดีให้บริการทุกช่องทาง
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Contact Info */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold mb-4">ช่องทางติดต่อ</h2>

          <a href="https://lin.ee/oxHGACz" target="_blank" rel="noopener noreferrer">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center gap-4 py-4">
                <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                  <MessageCircle className="h-5 w-5 text-brand-dark" />
                </div>
                <div>
                  <p className="font-medium">Line Official</p>
                  <p className="text-sm text-gray-600">ติดต่อเรา</p>
                </div>
              </CardContent>
            </Card>
          </a>

          <a href="https://www.facebook.com/Yarn.by.kuikui/" target="_blank" rel="noopener noreferrer" className="mt-4 block">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center gap-4 py-4">
                <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                  <svg className="h-5 w-5 text-brand-dark" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </div>
                <div>
                  <p className="font-medium">Facebook</p>
                  <p className="text-sm text-gray-600">ไหมพรมราคาถูก รักไหมแม่ Yarn by Kuikui</p>
                </div>
              </CardContent>
            </Card>
          </a>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-xl font-bold mb-4">ส่งข้อความถึงเรา</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">ชื่อ</Label>
              <Input id="name" placeholder="กรอกชื่อของคุณ" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">อีเมล</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">ข้อความ</Label>
              <Textarea
                id="message"
                placeholder="พิมพ์ข้อความของคุณที่นี่..."
                rows={5}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "กำลังส่ง..." : "ส่งข้อความ"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
