"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  ShoppingBag,
  ArrowLeft,
  MessageCircle,
  Headphones,
} from "lucide-react";

const menuItems = [
  { href: "/student", label: "แดชบอร์ด", icon: LayoutDashboard },
  { href: "/student/courses", label: "คอร์สของฉัน", icon: BookOpen },
  { href: "/student/products", label: "โครเชต์แพทเทิร์นของฉัน", icon: FileText },
  { href: "/student/orders", label: "ประวัติการสั่งซื้อ", icon: ShoppingBag },
];

export function StudentSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-white min-h-screen p-4 hidden md:block">
      <div className="mb-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-dark mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          กลับหน้าเว็บ
        </Link>
        <h2 className="text-lg font-bold text-brand-dark">Student Panel</h2>
        <p className="text-xs text-gray-500">รักไหมแม่ Academy</p>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/student" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand/10 text-brand-dark"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 px-1 space-y-2">
        <a
          href="https://lin.ee/oxHGACz"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          ปรึกษาคุณครู
        </a>
        <a
          href="https://lin.ee/oxHGACz"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
        >
          <Headphones className="h-4 w-4" />
          ติดต่อแอดมิน
        </a>
      </div>
    </aside>
  );
}
