"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  CreditCard,
  FileText,
  ArrowLeft,
} from "lucide-react";

const menuItems = [
  { href: "/admin", label: "แดชบอร์ด", icon: LayoutDashboard },
  { href: "/admin/courses", label: "จัดการคอร์ส", icon: BookOpen },
  { href: "/admin/products", label: "โครเชต์แพทเทิร์น", icon: FileText },
  { href: "/admin/users", label: "จัดการผู้ใช้", icon: Users },
  { href: "/admin/enrollments", label: "การลงทะเบียน", icon: ClipboardList },
  { href: "/admin/orders", label: "คำสั่งซื้อ/ชำระเงิน", icon: CreditCard },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-white min-h-screen p-4 hidden md:block">
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-dark mb-4">
          <ArrowLeft className="h-4 w-4" />
          กลับหน้าเว็บ
        </Link>
        <h2 className="text-lg font-bold text-brand-dark">Admin Panel</h2>
        <p className="text-xs text-gray-500">รักไหมแม่ Academy</p>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

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
    </aside>
  );
}
