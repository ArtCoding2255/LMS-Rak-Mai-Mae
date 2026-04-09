import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { LearningPlayer } from "./learning-player";

export const dynamic = 'force-dynamic';

export default async function LearnPage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ lesson?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { courseId } = await params;
  const { lesson: lessonId } = await searchParams;

  // ตรวจสอบว่าลงทะเบียนคอร์สนี้แล้ว
  const enrollment = await db.enrollment.findUnique({
    where: {
      userId_courseId: { userId: session.user.id, courseId },
    },
  });

  if (!enrollment || enrollment.status !== "ACTIVE") {
    redirect("/student/courses");
  }

  // ดึงข้อมูลคอร์สพร้อมบทเรียน (บทหลัก + บทย่อย)
  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: {
        where: { parentId: null },
        orderBy: { position: "asc" },
        include: {
          children: { orderBy: { position: "asc" } },
        },
      },
    },
  });

  if (!course || course.lessons.length === 0) {
    notFound();
  }

  // สร้าง flat list ของบทเรียนที่มีวิดีโอ (สำหรับ navigation)
  const playableLessons = course.lessons.flatMap((lesson) => {
    if (lesson.children.length > 0) {
      return lesson.children.filter((c) => c.youtubeUrl);
    }
    return lesson.youtubeUrl ? [lesson] : [];
  });

  // ดึงความก้าวหน้าของนักเรียน
  const progress = await db.lessonProgress.findMany({
    where: { userId: session.user.id },
  });

  const progressMap: Record<string, boolean> = {};
  progress.forEach((p) => {
    progressMap[p.lessonId] = p.completed;
  });

  // เลือกบทเรียนปัจจุบัน
  const currentLesson = lessonId
    ? playableLessons.find((l) => l.id === lessonId) || playableLessons[0]
    : playableLessons[0];

  if (!currentLesson) {
    notFound();
  }

  return (
    <div className="-m-6 md:-m-8">
      <LearningPlayer
        course={course}
        lessons={course.lessons}
        playableLessons={playableLessons}
        currentLesson={currentLesson}
        progressMap={progressMap}
      />
    </div>
  );
}
