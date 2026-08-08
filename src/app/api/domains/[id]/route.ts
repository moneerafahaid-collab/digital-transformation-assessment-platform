import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/server/rbac";
import { writeAuditLog } from "@/server/audit";

const schema = z.object({
  nameAr: z.string().min(2).optional(),
  nameEn: z.string().min(2).optional(),
  description: z.string().optional().nullable(),
  perspectiveId: z.string().min(1).optional(),
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

  const domain = await prisma.domain.update({ where: { id }, data: parsed.data });
  await writeAuditLog({
    actorId: authResult.session.user.id,
    action: "UPDATE",
    entity: "Domain",
    entityId: id,
    metadata: parsed.data,
  });
  return NextResponse.json(domain);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireRole(["ADMIN"]);
  if (!authResult.ok) return authResult.error;

  const { id } = await params;
  await prisma.domain.delete({ where: { id } });
  await writeAuditLog({
    actorId: authResult.session.user.id,
    action: "DELETE",
    entity: "Domain",
    entityId: id,
  });
  return NextResponse.json({ ok: true });
}
