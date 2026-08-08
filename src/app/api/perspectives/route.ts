import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, requireSession } from "@/server/rbac";
import { writeAuditLog } from "@/server/audit";

const schema = z.object({
  nameAr: z.string().min(2),
  nameEn: z.string().min(2),
  description: z.string().optional(),
  departmentId: z.string().min(1),
  sortOrder: z.number().int().optional(),
});

export async function GET(request: Request) {
  const authResult = await requireSession();
  if (!authResult.ok) return authResult.error;

  const { searchParams } = new URL(request.url);
  const departmentId = searchParams.get("departmentId") || undefined;
  const q = searchParams.get("q")?.trim();

  const perspectives = await prisma.perspective.findMany({
    where: {
      departmentId,
      ...(q
        ? {
            OR: [
              { nameAr: { contains: q, mode: "insensitive" } },
              { nameEn: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ departmentId: "asc" }, { sortOrder: "asc" }],
    include: {
      department: true,
      _count: { select: { domains: true } },
    },
  });

  return NextResponse.json(perspectives);
}

export async function POST(request: Request) {
  const authResult = await requireRole(["ADMIN"]);
  if (!authResult.ok) return authResult.error;

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  }

  const perspective = await prisma.perspective.create({ data: parsed.data });
  await writeAuditLog({
    actorId: authResult.session.user.id,
    action: "CREATE",
    entity: "Perspective",
    entityId: perspective.id,
    metadata: parsed.data,
  });
  return NextResponse.json(perspective, { status: 201 });
}
