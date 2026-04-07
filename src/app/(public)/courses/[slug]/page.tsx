import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Clock, PlayCircle, Signal } from "lucide-react";
import { AddToCartButton } from "./add-to-cart-button";

const levelLabel: Record<string, string> = {
  BEGINNER: "เริ่มต้น",
  INTERMEDIATE: "ปานกลาง",
  ADVANCED: "ขั้นสูง",
};

const levelColor: Record<string, string> = {
  BEGINNER: "bg-green-100 text-green-700",
  INTERMEDIATE: "bg-yellow-100 text-yellow-700",
  ADVANCED: "bg-red-100 text-red-700",
};

export const dynamic = 'force-dynamic';

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const course = await db.course.findUnique({
    where: { slug, published: true },
    include: {
      lessons: { orderBy: { position: "asc" } },
      _count: { select: { enrollments: true } },
    },
  });

  if (!course) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Info */}
        <div className="lg:col-span-2">
          {/* Course Image Placeholder */}
          <div className="h-64 md:h-80 bg-gradient-to-br from-nude-light to-brand/10 rounded-lg flex items-center justify-center mb-8">
            <BookOpen className="h-24 w-24 text-brand-light" />
          </div>

          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>

          <div className="flex flex-wrap gap-3 mb-6">
            <Badge variant="secondary">
              <PlayCircle className="h-3 w-3 mr-1" />
              {course.lessons.length} บทเรียน
            </Badge>
            <Badge variant="secondary">
              <Users className="h-3 w-3 mr-1" />
              {course._count.enrollments} คนลงทะเบียน
            </Badge>
            <Badge className={levelColor[course.level]}>
              <Signal className="h-3 w-3 mr-1" />
              {levelLabel[course.level]}
            </Badge>
          </div>

          <p className="text-gray-600 leading-relaxed mb-8 whitespace-pre-line">
            {course.description}
          </p>

          <Separator className="my-8" />

          {/* Lessons List */}
          <h2 className="text-xl font-bold mb-4">เนื้อหาในคอร์ส</h2>
          <div className="space-y-3">
            {course.lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="flex items-center gap-4 p-4 rounded-lg border bg-gray-50"
              >
                <div className="w-8 h-8 rounded-full bg-brand/10 text-brand-dark flex items-center justify-center text-sm font-semibold shrink-0">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-medium">{lesson.title}</h3>
                  {lesson.description && (
                    <p className="text-sm text-gray-500">
                      {lesson.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar - Purchase Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 border rounded-lg p-6 bg-white shadow-sm">
            <div className="text-3xl font-bold text-brand-dark mb-2">
              {course.price.toLocaleString()} บาท
            </div>
            <p className="text-sm text-gray-500 mb-6">
              เข้าเรียนได้ตลอดชีพ ไม่มีหมดอายุ
            </p>

            <AddToCartButton courseId={course.id} />

            <div className="mt-6 space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <PlayCircle className="h-4 w-4" />
                <span>{course.lessons.length} บทเรียน</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>เรียนได้ตลอดชีพ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Users(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
