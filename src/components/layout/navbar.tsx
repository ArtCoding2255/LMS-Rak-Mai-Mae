"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  ShoppingCart,
  User,
  Menu,
  LogOut,
  LayoutDashboard,
  BookOpen,
} from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";

const navLinks = [
  { href: "/", label: "หน้าแรก" },
  { href: "/courses", label: "คอร์สทั้งหมด" },
  { href: "/products", label: "โครเชต์แพทเทิร์น" },
  { href: "/about", label: "เกี่ยวกับเรา" },
  { href: "/contact", label: "ติดต่อเรา" },
];

export function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count: cartCount } = useCart();

  const dashboardLink =
    session?.user?.role === "ADMIN" ? "/admin" : "/student";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-brand-dark">
            รักไหมแม่ Academy
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 hover:text-brand-dark transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <>
              <Link
                href="/cart"
                className="relative inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 min-w-5 px-1 rounded-full bg-red-500 text-white text-xs font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <User className="h-5 w-5" />
                </button>
                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black/5 p-1">
                      <div className="px-3 py-2">
                        <p className="text-sm font-medium">
                          {session.user?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {session.user?.email}
                        </p>
                      </div>
                      <div className="h-px bg-gray-200 my-1" />
                      <Link
                        href={dashboardLink}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        แดชบอร์ด
                      </Link>
                      {session.user?.role !== "ADMIN" && (
                        <Link
                          href="/student/courses"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                        >
                          <BookOpen className="h-4 w-4" />
                          คอร์สเรียนของฉัน
                        </Link>
                      )}
                      <div className="h-px bg-gray-200 my-1" />
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        ออกจากระบบ
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">เข้าสู่ระบบ</Link>
              </Button>
              <Button asChild>
                <Link href="/register">สมัครสมาชิก</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="flex flex-col gap-4 mt-8 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium text-gray-700 hover:text-brand-dark"
                >
                  {link.label}
                </Link>
              ))}
              <hr />
              {session ? (
                <>
                  <Link
                    href="/cart"
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium text-gray-700 hover:text-brand-dark flex items-center gap-2"
                  >
                    ตะกร้าสินค้า
                    {cartCount > 0 && (
                      <span className="flex items-center justify-center h-5 min-w-5 px-1 rounded-full bg-red-500 text-white text-xs font-bold">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    href={dashboardLink}
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium text-gray-700 hover:text-brand-dark"
                  >
                    แดชบอร์ด
                  </Link>
                  {session.user?.role !== "ADMIN" && (
                    <Link
                      href="/student/courses"
                      onClick={() => setOpen(false)}
                      className="text-lg font-medium text-gray-700 hover:text-brand-dark"
                    >
                      คอร์สเรียนของฉัน
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="text-lg font-medium text-red-600 text-left"
                  >
                    ออกจากระบบ
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium text-gray-700 hover:text-brand-dark"
                  >
                    เข้าสู่ระบบ
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium text-brand-dark"
                  >
                    สมัครสมาชิก
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
