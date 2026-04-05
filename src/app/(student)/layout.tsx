import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { StudentSidebar } from "@/components/layout/student-sidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />
      <div className="flex-1">
        <div className="flex items-center gap-3 px-4 py-3 border-b bg-white md:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-brand-dark transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            กลับหน้าหลัก
          </Link>
          <span className="ml-auto text-sm font-bold text-brand-dark">Student Panel</span>
        </div>
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
