// Middleware ถูกปิดไว้เพราะ Prisma ไม่รองรับ Edge Runtime
// การตรวจสอบ auth จะทำใน server component แทน
// export { auth as default } from "@/lib/auth";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
