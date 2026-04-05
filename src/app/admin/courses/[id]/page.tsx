import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CourseForm } from "@/components/admin/course-form";

export const dynamic = 'force-dynamic';

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const course = await db.course.findUnique({ where: { id } });

  if (!course) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">แก้ไขคอร์ส</h1>
      <CourseForm initialData={course} />
    </div>
  );
}
