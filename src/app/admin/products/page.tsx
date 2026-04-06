import Link from "next/link";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, FileText } from "lucide-react";
import { DeleteProductButton } from "./delete-product-button";

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    include: {
      _count: { select: { purchases: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">จัดการโครเชต์แพทเทิร์น</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            เพิ่มสินค้าใหม่
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>ยังไม่มีสินค้า กดปุ่ม &quot;เพิ่มสินค้าใหม่&quot; เพื่อเริ่มต้น</p>
        </div>
      ) : (
        <div className="border rounded-lg bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อสินค้า</TableHead>
                <TableHead>ราคา</TableHead>
                <TableHead>ยอดขาย</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="text-right">จัดกา���</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium max-w-[250px] truncate">
                    {product.title}
                  </TableCell>
                  <TableCell>{product.price.toLocaleString()} บาท</TableCell>
                  <TableCell>{product._count.purchases}</TableCell>
                  <TableCell>
                    {product.published ? (
                      <Badge className="bg-green-100 text-green-700">
                        เผยแพร่แล้ว
                      </Badge>
                    ) : (
                      <Badge variant="secondary">ฉบับร่าง</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/products/${product.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteProductButton
                        productId={product.id}
                        productTitle={product.title}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
