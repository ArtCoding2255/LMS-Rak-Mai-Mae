import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
  const courses = await db.course.findMany({
    where: { published: true },
    include: {
      _count: { select: { lessons: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">คอร์สทั้งหมด</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          เลือกคอร์สที่คุณสนใจ แล้วเริ่มเรียนรู้การถักโครเชต์ได้เลย
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>ยังไม่มีคอร์สในขณะนี้</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Course Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-nude-light to-brand/10 flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-brand-light" />
              </div>
              <CardContent className="pt-4">
                <h2 className="font-semibold text-lg mb-2 line-clamp-2">
                  {course.title}
                </h2>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {course._count.lessons} บทเรียน
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <span className="text-xl font-bold text-brand-dark">
                  {course.price.toLocaleString()} บาท
                </span>
                <Button asChild>
                  <Link href={`/courses/${course.slug}`}>ดูรายละเอียด</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
