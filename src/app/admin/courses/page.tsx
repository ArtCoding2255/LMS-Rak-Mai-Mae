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
import { Plus, Pencil, BookOpen } from "lucide-react";
import { DeleteCourseButton } from "./delete-course-button";

export const dynamic = 'force-dynamic';

export default async function AdminCoursesPage() {
  const courses = await db.course.findMany({
    include: {
      _count: { select: { lessons: true, enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">จัดการคอร์ส</h1>
        <Button asChild>
          <Link href="/admin/courses/new">
            <Plus className="mr-2 h-4 w-4" />
            สร้างคอร์สใหม่
          </Link>
        </Button>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>ยังไม่มีคอร์ส กดปุ่ม &quot;สร้างคอร์สใหม่&quot; เพื่อเริ่มต้น</p>
        </div>
      ) : (
        <div className="border rounded-lg bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อคอร์ส</TableHead>
                <TableHead>ราคา</TableHead>
                <TableHead>บทเรียน</TableHead>
                <TableHead>นักเรียน</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium max-w-[250px] truncate">
                    {course.title}
                  </TableCell>
                  <TableCell>{course.price.toLocaleString()} บาท</TableCell>
                  <TableCell>{course._count.lessons}</TableCell>
                  <TableCell>{course._count.enrollments}</TableCell>
                  <TableCell>
                    {course.published ? (
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
                        <Link href={`/admin/courses/${course.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/courses/${course.id}/lessons`}>
                          <BookOpen className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteCourseButton
                        courseId={course.id}
                        courseTitle={course.title}
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
