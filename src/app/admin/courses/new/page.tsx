import { CourseForm } from "@/components/admin/course-form";

export default function NewCoursePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">สร้างคอร์สใหม่</h1>
      <CourseForm />
    </div>
  );
}
