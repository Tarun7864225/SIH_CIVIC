import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/app/lib/auth/auth";

export async function POST() {
  clearAuthCookie();
  return NextResponse.json({ success: true });
}
