import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/server/rbac";
import { writeAuditLog } from "@/server/audit";

const schema = z.object({
  nameAr: z.string().min(2).optional(),
  nameEn: z.string().min(2).optional(),
  description: z.string().optional().nullable(),
  departmentId: z.string().min(1).optional(),
  sortOrder: z.number().int().optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireRole(["ADMIN"]);
  if (!authResult.ok) return authResult.error;

  const { id } = await params;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  }

  const perspective = await prisma.perspective.update({ where: { id }, data: parsed.data });
  await writeAuditLog({
    actorId: authResult.session.user.id,
    action: "UPDATE",
    entity: "Perspective",
    entityId: id,
    metadata: parsed.data,
  });
  return NextResponse.json(perspective);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireRole(["ADMIN"]);
  if (!authResult.ok) return authResult.error;

  const { id } = await params;
  await prisma.perspective.delete({ where: { id } });
  await writeAuditLog({
    actorId: authResult.session.user.id,
    action: "DELETE",
    entity: "Perspective",
    entityId: id,
  });
  return NextResponse.json({ ok: true });
}
