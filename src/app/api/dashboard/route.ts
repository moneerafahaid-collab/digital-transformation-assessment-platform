import { NextResponse } from "next/server";
import { requireSession } from "@/server/rbac";
import { getDashboardStats } from "@/server/services/scores";

export async function GET() {
  const authResult = await requireSession();
  if (!authResult.ok) return authResult.error;

  const stats = await getDashboardStats();
  return NextResponse.json(stats);
}
