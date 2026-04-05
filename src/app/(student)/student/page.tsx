import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { BookOpen, CheckCircle, ShoppingBag, TrendingUp } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function StudentDashboard() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  // ดึงข้อมูลสถิติ
  const [enrollments, totalProgress, orders] = await Promise.all([
    db.enrollment.findMany({
      where: { userId, status: "ACTIVE" },
      include: {
        course: {
          include: {
            lessons: { select: { id: true } },
          },
        },
      },
    }),
    db.lessonProgress.findMany({
      where: { userId, completed: true },
    }),
    db.order.count({ where: { userId } }),
  ]);

  // คำนวณความก้าวหน้ารวม
  const totalLessons = enrollments.reduce(
    (sum: number, e: { course: { lessons: { id: string }[] } }) => sum + e.course.lessons.length,
    0
  );
  const completedLessons = totalProgress.length;
  const overallProgress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const stats = [
    {
      label: "คอร์สที่ลงทะเบียน",
      value: enrollments.length,
      icon: BookOpen,
      color: "text-brand-dark bg-brand/10",
    },
    {
      label: "บทเรียนที่เรียนจบ",
      value: completedLessons,
      icon: CheckCircle,
      color: "text-green-600 bg-green-100",
    },
    {
      label: "ความก้าวหน้ารวม",
      value: `${overallProgress}%`,
      icon: TrendingUp,
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "คำสั่งซื้อทั้งหมด",
      value: orders,
      icon: ShoppingBag,
      color: "text-orange-600 bg-orange-100",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">
        สวัสดี, {session.user.name}! 👋
      </h1>
      <p className="text-gray-500 mb-8">ยินดีต้อนรับสู่หน้าเรียนของคุณ</p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* คอร์สที่กำลังเรียน */}
      <h2 className="text-lg font-bold mb-4">คอร์สที่กำลังเรียน</h2>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrollments.map((enrollment) => {
            const courseProgress = totalProgress.filter((p) =>
              enrollment.course.lessons.some((l) => l.id === p.lessonId)
            ).length;
            const courseTotalLessons = enrollment.course.lessons.length;
            const percent =
              courseTotalLessons > 0
                ? Math.round((courseProgress / courseTotalLessons) * 100)
                : 0;

            return (
              <Link
                key={enrollment.id}
                href={`/student/courses/${enrollment.courseId}/learn`}
              >
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="h-32 bg-gradient-to-br from-nude-light to-brand/10 rounded-lg flex items-center justify-center mb-3">
                    <BookOpen className="h-10 w-10 text-brand-light" />
                  </div>
                  <h3 className="font-semibold line-clamp-1 mb-2">
                    {enrollment.course.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 shrink-0">
                      {percent}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {courseProgress}/{courseTotalLessons} บทเรียน
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
