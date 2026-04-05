import type { NextAuthConfig } from "next-auth";

// Edge-compatible auth config (no database imports)
export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [], // จะเพิ่ม providers ใน auth.ts
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = auth?.user?.role;
      const pathname = nextUrl.pathname;

      // หน้า Admin - ต้อง login + เป็น ADMIN
      if (pathname.startsWith("/admin")) {
        if (!isLoggedIn) return false;
        if (userRole !== "ADMIN") {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      // หน้า Student Dashboard - ต้อง login
      if (pathname.startsWith("/student")) {
        return isLoggedIn;
      }

      // หน้า Cart / Checkout - ต้อง login
      if (pathname.startsWith("/cart") || pathname.startsWith("/checkout")) {
        return isLoggedIn;
      }

      // หน้า Login/Register - ถ้า login แล้วให้ redirect
      if (pathname === "/login" || pathname === "/register") {
        if (isLoggedIn) {
          if (userRole === "ADMIN") {
            return Response.redirect(new URL("/admin", nextUrl));
          }
          return Response.redirect(new URL("/student", nextUrl));
        }
      }

      return true;
    },
  },
};
