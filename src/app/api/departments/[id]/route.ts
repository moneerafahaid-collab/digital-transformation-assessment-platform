import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, requireSession } from "@/server/rbac";
import { writeAuditLog } from "@/server/audit";
import { getDepartmentScore } from "@/server/services/scores";

const schema = z.object({
  nameAr: z.string().min(2).optional(),
  nameEn: z.string().min(2).optional(),
  description: z.string().optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireSession();
  if (!authResult.ok) return authResult.error;

  const { id } = await params;
  const scored = await getDepartmentScore(id);
  if (!scored) return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  return NextResponse.json(scored);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireRole(["ADMIN"]);
  if (!authResult.ok) return authResult.error;

  const { id } = await params;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  }

  const department = await prisma.department.update({ where: { id }, data: parsed.data });
  await writeAuditLog({
    actorId: authResult.session.user.id,
    action: "UPDATE",
    entity: "Department",
    entityId: id,
    metadata: parsed.data,
  });
  return NextResponse.json(department);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireRole(["ADMIN"]);
  if (!authResult.ok) return authResult.error;

  const { id } = await params;
  await prisma.department.delete({ where: { id } });
  await writeAuditLog({
    actorId: authResult.session.user.id,
    action: "DELETE",
    entity: "Department",
    entityId: id,
  });
  return NextResponse.json({ ok: true });
}
