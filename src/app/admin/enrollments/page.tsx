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

export default async function AdminEnrollmentsPage() {
  const enrollments = await db.enrollment.findMany({
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const statusMap = {
    ACTIVE: { label: "ใช้งาน", color: "bg-green-100 text-green-700" },
    EXPIRED: { label: "หมดอายุ", color: "bg-gray-100 text-gray-700" },
    CANCELLED: { label: "ยกเลิก", color: "bg-red-100 text-red-700" },
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">การลงทะเบียน</h1>

      {enrollments.length === 0 ? (
        <p className="text-gray-500 text-center py-12">ยังไม่มีการลงทะเบียน</p>
      ) : (
        <div className="border rounded-lg bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>นักเรียน</TableHead>
                <TableHead>อีเมล</TableHead>
                <TableHead>คอร์ส</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>วันที่ลงทะเบียน</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.map((enrollment) => {
                const status = statusMap[enrollment.status];
                return (
                  <TableRow key={enrollment.id}>
                    <TableCell className="font-medium">
                      {enrollment.user.name}
                    </TableCell>
                    <TableCell>{enrollment.user.email}</TableCell>
                    <TableCell>{enrollment.course.title}</TableCell>
                    <TableCell>
                      <Badge className={status.color}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(enrollment.createdAt).toLocaleDateString(
                        "th-TH"
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
