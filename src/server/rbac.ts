import { NextResponse } from "next/server";
import type { Role } from "@prisma/client";
import { auth } from "@/lib/auth";
import type { Session } from "next-auth";

type AuthSuccess = { ok: true; session: Session };
type AuthFailure = { ok: false; error: NextResponse };
type AuthResult = AuthSuccess | AuthFailure;

export async function requireSession(): Promise<AuthResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: NextResponse.json({ error: "غير مصرح" }, { status: 401 }) };
  }
  return { ok: true, session };
}

export async function requireRole(roles: Role[]): Promise<AuthResult> {
  const result = await requireSession();
  if (!result.ok) return result;

  if (!roles.includes(result.session.user.role)) {
    return { ok: false, error: NextResponse.json({ error: "ليس لديك صلاحية" }, { status: 403 }) };
  }
  return result;
}

export function canManageStructure(role: Role) {
  return role === "ADMIN";
}

export function canAssess(role: Role) {
  return role === "ADMIN" || role === "ASSESSOR";
}

export function canView(role: Role) {
  return role === "ADMIN" || role === "ASSESSOR" || role === "VIEWER";
}
