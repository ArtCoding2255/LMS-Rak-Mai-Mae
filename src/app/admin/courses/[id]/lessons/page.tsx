import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { LessonsManager } from "./lessons-manager";

export const dynamic = 'force-dynamic';

export default async function AdminLessonsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const course = await db.course.findUnique({
    where: { id },
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

  if (!course) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">จัดการบทเรียน</h1>
      <p className="text-gray-500 mb-6">คอร์ส: {course.title}</p>
      <LessonsManager courseId={course.id} initialLessons={course.lessons} />
    </div>
  );
}
