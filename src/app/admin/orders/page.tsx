import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderActions } from "./order-actions";

export const dynamic = 'force-dynamic';

const statusMap = {
  PENDING: { label: "รอตรวจสอบ", color: "bg-yellow-100 text-yellow-700" },
  APPROVED: { label: "อนุมัติแล้ว", color: "bg-green-100 text-green-700" },
  REJECTED: { label: "ปฏิเสธ", color: "bg-red-100 text-red-700" },
};

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { course: { select: { title: true } }, product: { select: { title: true } } } },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">จัดการคำสั่งซื้อ / ชำระเงิน</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center py-12">ยังไม่มีคำสั่งซื้อ</p>
      ) : (
        <div className="border rounded-lg bg-white overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>รหัส</TableHead>
                <TableHead>ลูกค้า</TableHead>
                <TableHead>รายการ</TableHead>
                <TableHead>ยอดรวม</TableHead>
                <TableHead>สลิป</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>วันที่</TableHead>
                <TableHead>จัดการ</TableHead>
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
                      <div>
                        <p className="font-medium">{order.user.name}</p>
                        <p className="text-xs text-gray-500">
                          {order.user.email}
                        </p>
                      </div>
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
                        <span className="text-gray-400 text-sm">
                          ยังไม่แนบ
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={status.color}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(order.createdAt).toLocaleDateString("th-TH")}
                    </TableCell>
                    <TableCell>
                      {order.status === "PENDING" && order.payment && (
                        <OrderActions orderId={order.id} />
                      )}
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
