import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, PlayCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function MyCoursesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Mark unseen enrollments as seen
  await db.enrollment.updateMany({
    where: { userId: session.user.id, seen: false },
    data: { seen: true },
  });

  const enrollments = await db.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          lessons: {
            select: { id: true, youtubeUrl: true, parentId: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // ดึงความก้าวหน้า
  const progress = await db.lessonProgress.findMany({
    where: { userId: session.user.id, completed: true },
  });

  const completedLessonIds = new Set(progress.map((p) => p.lessonId));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">คอร์สของฉัน</h1>

      {enrollments.length === 0 ? (
        <Card className="p-8 text-center">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">คุณยังไม่มีคอร์สที่ลงทะเบียน</p>
          <Link
            href="/courses"
            className="text-brand-dark hover:underline font-medium"
          >
            ดูคอร์สทั้งหมด →
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => {
            // นับเฉพาะบทเรียนที่มีวิดีโอ (บทย่อยหรือบทเดี่ยวที่มี video)
            const playableLessons = enrollment.course.lessons.filter((l) => l.youtubeUrl);
            const totalLessons = playableLessons.length;
            const completedCount = playableLessons.filter((l) =>
              completedLessonIds.has(l.id)
            ).length;
            const percent =
              totalLessons > 0
                ? Math.round((completedCount / totalLessons) * 100)
                : 0;
            const isCompleted = percent === 100;

            return (
              <Link
                key={enrollment.id}
                href={`/student/courses/${enrollment.courseId}/learn`}
              >
                <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  <div className="h-40 bg-gradient-to-br from-nude-light to-brand/10 flex items-center justify-center overflow-hidden">
                    {enrollment.course.imageUrl ? (
                      <img src={enrollment.course.imageUrl} alt={enrollment.course.title} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen className="h-12 w-12 text-brand-light" />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold line-clamp-2">
                        {enrollment.course.title}
                      </h3>
                      {isCompleted && (
                        <Badge className="bg-green-100 text-green-700 shrink-0">
                          เรียนจบแล้ว
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <PlayCircle className="h-4 w-4" />
                      <span>
                        {completedCount}/{totalLessons} บทเรียน
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isCompleted ? "bg-green-500" : "bg-brand"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1 text-right">
                      {percent}%
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
