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

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    include: {
      _count: { select: { enrollments: true, orders: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">จัดการผู้ใช้</h1>

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ชื่อ</TableHead>
              <TableHead>อีเมล</TableHead>
              <TableHead>บทบาท</TableHead>
              <TableHead>คอร์สที่ลงทะเบียน</TableHead>
              <TableHead>คำสั่งซื้อ</TableHead>
              <TableHead>วันที่สมัคร</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.role === "ADMIN" ? (
                    <Badge className="bg-brand/10 text-brand-dark">
                      Admin
                    </Badge>
                  ) : (
                    <Badge variant="secondary">นักเรียน</Badge>
                  )}
                </TableCell>
                <TableCell>{user._count.enrollments}</TableCell>
                <TableCell>{user._count.orders}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString("th-TH")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
