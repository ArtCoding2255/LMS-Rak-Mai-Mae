import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Separator } from "@/components/ui/separator";
import { FileText, Download, ShieldCheck } from "lucide-react";
import { AddProductToCartButton } from "./add-to-cart-button";

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug, published: true },
    include: {
      _count: { select: { purchases: true } },
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Info */}
        <div className="lg:col-span-2">
          {product.imageUrl ? (
            <div className="h-64 md:h-80 rounded-lg overflow-hidden mb-8">
              <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="h-64 md:h-80 bg-gradient-to-br from-purple-50 to-brand/10 rounded-lg flex items-center justify-center mb-8">
              <FileText className="h-24 w-24 text-purple-400" />
            </div>
          )}

          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

          <p className="text-gray-800 leading-relaxed mb-8">
            {product.description}
          </p>

          <Separator className="my-8" />

          <h2 className="text-xl font-bold mb-4">สิ่งที่คุณจะได้รับ</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 rounded-lg border bg-gray-50">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <Download className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium">ไฟล์ PDF ดาวน์โหลดได้ทันที</h3>
                <p className="text-sm text-gray-500">หลังชำระเงินและได้รับการอนุมัติ</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg border bg-gray-50">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium">เข้าถึงได้ตลอด</h3>
                <p className="text-sm text-gray-500">ดาวน์โหลดกี่ครั้งก็ได้ ไม่มีหมดอายุ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Purchase Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 border rounded-lg p-6 bg-white shadow-sm">
            <div className="text-3xl font-bold text-brand-dark mb-2">
              {product.price.toLocaleString()} บาท
            </div>
            <p className="text-sm text-gray-500 mb-6">
              ไฟล์ดิจิทัล PDF — ดาวน์โหลดได้ทันที
            </p>

            <AddProductToCartButton productId={product.id} />

            <div className="mt-6 space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>ไฟล์ PDF</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>ดาวน์โหลดได้ทันทีหลังอนุมัติ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
