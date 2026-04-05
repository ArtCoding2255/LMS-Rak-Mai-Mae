"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Upload,
  CheckCircle,
  Loader2,
  ArrowLeft,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface OrderItem {
  id: string;
  price: number;
  course: { title: string };
}

interface Order {
  id: string;
  total: number;
  items: OrderItem[];
}

export default function CheckoutPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<"creating" | "payment" | "done">(
    "creating"
  );
  const [order, setOrder] = useState<Order | null>(null);
  const [uploading, setUploading] = useState(false);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [slipFile, setSlipFile] = useState<File | null>(null);

  // สร้าง Order จากตะกร้า
  useEffect(() => {
    const createOrder = async () => {
      try {
        const res = await fetch("/api/checkout", { method: "POST" });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || "เกิดข้อผิดพลาด");
          router.push("/cart");
          return;
        }
        setOrder(data.order);
        setStep("payment");
      } catch {
        toast.error("เกิดข้อผิดพลาด");
        router.push("/cart");
      }
    };
    createOrder();
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("ขนาดไฟล์ต้องไม่เกิน 5MB");
      return;
    }

    setSlipFile(file);
    const reader = new FileReader();
    reader.onload = () => setSlipPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmitPayment = async () => {
    if (!slipFile || !order) return;

    setUploading(true);
    try {
      // อัปโหลดสลิป
      const formData = new FormData();
      formData.append("file", slipFile);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        toast.error(uploadData.error || "อัปโหลดสลิปไม่สำเร็จ");
        return;
      }

      // แจ้งชำระเงิน
      const paymentRes = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          slipUrl: uploadData.url,
          amount: order.total,
        }),
      });

      const paymentData = await paymentRes.json();

      if (!paymentRes.ok) {
        toast.error(paymentData.error || "แจ้งชำระเงินไม่สำเร็จ");
        return;
      }

      setStep("done");
      toast.success("แจ้งชำระเงินสำเร็จ!");
    } catch {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("คัดลอกแล้ว");
  };

  // กำลังสร้าง Order
  if (step === "creating") {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-brand-dark mb-4" />
          <p className="text-gray-500">กำลังสร้างคำสั่งซื้อ...</p>
        </div>
      </div>
    );
  }

  // ชำระเงินสำเร็จ
  if (step === "done") {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-2">แจ้งชำระเงินสำเร็จ!</h1>
          <p className="text-gray-500 mb-2">
            คำสั่งซื้อ #{order?.id.slice(-8).toUpperCase()}
          </p>
          <p className="text-gray-500 mb-8">
            กรุณารอ Admin ตรวจสอบและอนุมัติการชำระเงิน
            เมื่ออนุมัติแล้วคุณจะสามารถเข้าเรียนได้ทันที
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link href="/courses">ดูคอร์สเพิ่มเติม</Link>
            </Button>
            <Button asChild>
              <Link href="/student/orders">ดูประวัติการสั่งซื้อ</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // หน้าชำระเงิน
  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/cart">
          <ArrowLeft className="mr-2 h-4 w-4" />
          กลับไปตะกร้า
        </Link>
      </Button>

      <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <CreditCard className="h-6 w-6" />
        ชำระเงิน
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ข้อมูลการโอนเงิน */}
        <div>
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">
              ข้อมูลการโอนเงิน (PromptPay)
            </h2>

            <div className="bg-nude-light rounded-lg p-6 text-center mb-6">
              <p className="text-sm text-gray-500 mb-1">ยอดที่ต้องชำระ</p>
              <p className="text-3xl font-bold text-brand-dark">
                {order?.total.toLocaleString()} บาท
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">ธนาคาร</p>
                  <p className="font-medium">กสิกรไทย (KBank)</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">ชื่อบัญชี</p>
                  <p className="font-medium">Grandma Crochet Studio</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">เลขบัญชี</p>
                  <p className="font-medium font-mono">xxx-x-xxxxx-x</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard("xxx-x-xxxxx-x")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator className="my-6" />

            {/* รายการสินค้า */}
            <h3 className="font-semibold mb-3">รายการสินค้า</h3>
            <div className="space-y-2 text-sm">
              {order?.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-gray-600">{item.course.title}</span>
                  <span>{item.price.toLocaleString()} บาท</span>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>รวมทั้งหมด</span>
                <span className="text-brand-dark">
                  {order?.total.toLocaleString()} บาท
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* อัปโหลดสลิป */}
        <div>
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">
              อัปโหลดสลิปการโอนเงิน
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              หลังโอนเงินแล้ว กรุณาอัปโหลดสลิปเพื่อยืนยันการชำระเงิน
            </p>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {slipPreview ? (
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={slipPreview}
                    alt="สลิปโอนเงิน"
                    className="w-full max-h-80 object-contain bg-gray-50"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    เปลี่ยนรูป
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleSubmitPayment}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        กำลังส่ง...
                      </>
                    ) : (
                      "ยืนยันการชำระเงิน"
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-brand-light hover:bg-nude-light transition-colors"
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">
                  คลิกเพื่ออัปโหลดสลิป
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  รองรับ JPG, PNG, WebP (ไม่เกิน 5MB)
                </p>
              </button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
