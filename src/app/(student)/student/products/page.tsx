import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function StudentProductsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const purchases = await db.productPurchase.findMany({
    where: { userId: session.user.id },
    include: {
      product: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">โครเชต์แพทเทิร์นของฉัน</h1>

      {purchases.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-500 mb-2">
            ยังไม่มีโครเชต์แพทเทิร์น
          </h2>
          <p className="text-gray-400 mb-6">
            เลือกซื้อแพทเทิร์นและไฟล์ PDF ได้ที่หน้าสินค้า
          </p>
          <Button asChild>
            <Link href="/products">ดูสินค้าทั้งหมด</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {purchases.map((purchase) => (
            <Card key={purchase.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-50 to-brand/10 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="h-8 w-8 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold line-clamp-1">
                      {purchase.product.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {purchase.product.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      ซื้อเมื่อ {new Date(purchase.createdAt).toLocaleDateString("th-TH")}
                    </p>
                  </div>
                  <Button size="sm" asChild>
                    <a href={purchase.product.pdfUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-1" />
                      ดาวน์โหลด
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
