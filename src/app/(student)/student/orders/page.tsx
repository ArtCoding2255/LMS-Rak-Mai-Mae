import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShoppingBag, Truck, MessageCircle } from "lucide-react";

export const dynamic = 'force-dynamic';

const statusMap = {
  PENDING: { label: "รอตรวจสอบ", color: "bg-yellow-100 text-yellow-700" },
  APPROVED: { label: "อนุมัติแล้ว", color: "bg-green-100 text-green-700" },
  REJECTED: { label: "ปฏิเสธ", color: "bg-red-100 text-red-700" },
};

export default async function StudentOrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: { include: { course: { select: { title: true } }, product: { select: { title: true } } } },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">ประวัติการสั่งซื้อ</h1>

      <div className="mb-6 flex items-start gap-3 p-4 rounded-lg border border-blue-200 bg-blue-50">
        <Truck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="flex-1 text-sm text-blue-800">
          <p className="font-medium mb-1">ติดตามสถานะการจัดส่งสินค้า</p>
          <p className="text-blue-600">
            สามารถติดตามสถานะการจัดส่งสินค้าได้โดยติดต่อแอดมินผ่าน Line OA
          </p>
        </div>
        <a
          href="https://lin.ee/oxHGACz"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition-colors shrink-0"
        >
          <MessageCircle className="h-4 w-4" />
          ติดต่อแอดมิน
        </a>
      </div>

      {orders.length === 0 ? (
        <Card className="p-8 text-center">
          <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">ยังไม่มีประวัติการสั่งซื้อ</p>
        </Card>
      ) : (
        <div className="border rounded-lg bg-white overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>รหัสคำสั่งซื้อ</TableHead>
                <TableHead>รายการ</TableHead>
                <TableHead>ยอดรวม</TableHead>
                <TableHead>สลิป</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>วันที่</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const status = statusMap[order.status];
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">
                      #{order.id.slice(-8).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {order.items.map((item) => (
                          <p key={item.id} className="text-sm">
                            {item.course?.title || item.product?.title}
                          </p>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {order.total.toLocaleString()} บาท
                    </TableCell>
                    <TableCell>
                      {order.payment ? (
                        <a
                          href={order.payment.slipUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-dark hover:underline text-sm"
                        >
                          ดูสลิป
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={status.color}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(order.createdAt).toLocaleDateString("th-TH")}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
