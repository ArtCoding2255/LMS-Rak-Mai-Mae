import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, ClipboardList, CreditCard, FileText } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [totalCourses, totalStudents, totalEnrollments, pendingPayments, totalProducts] =
    await Promise.all([
      db.course.count(),
      db.user.count({ where: { role: "STUDENT" } }),
      db.enrollment.count(),
      db.order.count({ where: { status: "PENDING" } }),
      db.product.count(),
    ]);

  const stats = [
    {
      title: "คอร์สทั้งหมด",
      value: totalCourses,
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "โครเชต์แพทเทิร์น",
      value: totalProducts,
      icon: FileText,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "นักเรียนทั้งหมด",
      value: totalStudents,
      icon: Users,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "การลงทะเบียน",
      value: totalEnrollments,
      icon: ClipboardList,
      color: "text-brand-dark",
      bg: "bg-brand/10",
    },
    {
      title: "รอตรวจสอบชำระเงิน",
      value: pendingPayments,
      icon: CreditCard,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  // ดึง orders ล่าสุด
  const recentOrders = await db.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">แดชบอร์ด</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div
                className={`w-12 h-12 rounded-full ${stat.bg} flex items-center justify-center`}
              >
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>คำสั่งซื้อล่าสุด</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-sm">ยังไม่มีคำสั่งซื้อ</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div>
                    <p className="font-medium">{order.user.name}</p>
                    <p className="text-sm text-gray-500">{order.user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {order.total.toLocaleString()} บาท
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.status === "PENDING"
                        ? "รอตรวจสอบ"
                        : order.status === "APPROVED"
                        ? "อนุมัติแล้ว"
                        : "ปฏิเสธ"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
