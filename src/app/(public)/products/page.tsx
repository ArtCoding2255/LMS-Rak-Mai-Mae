import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await db.product.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">โครเชต์แพทเทิร์น</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          แพทเทิร์นและไฟล์ PDF สำหรับงานโครเชต์ ดาวน์โหลดได้ทันทีหลังชำระเงิน
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>ยังไม่มีสินค้าในขณะนี้</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {product.imageUrl ? (
                <div className="h-48 overflow-hidden">
                  <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-purple-50 to-brand/10 flex items-center justify-center">
                  <FileText className="h-16 w-16 text-purple-400" />
                </div>
              )}
              <CardContent className="pt-4">
                <h2 className="font-semibold text-lg mb-2 line-clamp-2">
                  {product.title}
                </h2>
                <p className="text-sm text-gray-800 mb-3 line-clamp-2">
                  {product.description}
                </p>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <span className="text-xl font-bold text-brand-dark">
                  {product.price.toLocaleString()} บาท
                </span>
                <Button asChild>
                  <Link href={`/products/${product.slug}`}>ดูรายละเอียด</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
