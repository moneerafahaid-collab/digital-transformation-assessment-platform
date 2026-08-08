import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, requireSession } from "@/server/rbac";
import { writeAuditLog } from "@/server/audit";
import { getAllDepartmentScores } from "@/server/services/scores";

const schema = z.object({
  nameAr: z.string().min(2),
  nameEn: z.string().min(2),
  description: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET(request: Request) {
  const authResult = await requireSession();
  if (!authResult.ok) return authResult.error;

  const { searchParams } = new URL(request.url);
  const withScores = searchParams.get("scores") === "1";
  const q = searchParams.get("q")?.trim();

  if (withScores) {
    let departments = await getAllDepartmentScores();
    if (q) {
      departments = departments.filter(
        (d) => d.nameAr.includes(q) || d.nameEn.toLowerCase().includes(q.toLowerCase())
      );
    }
    return NextResponse.json(departments);
  }

  const departments = await prisma.department.findMany({
    where: q
      ? {
          OR: [
            { nameAr: { contains: q, mode: "insensitive" } },
            { nameEn: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { perspectives: true } },
    },
  });

  return NextResponse.json(departments);
}

export async function POST(request: Request) {
  const authResult = await requireRole(["ADMIN"]);
  if (!authResult.ok) return authResult.error;

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "بيانات غير صالحة", details: parsed.error.flatten() }, { status: 400 });
  }

  const department = await prisma.department.create({ data: parsed.data });
  await writeAuditLog({
    actorId: authResult.session.user.id,
    action: "CREATE",
    entity: "Department",
    entityId: department.id,
    metadata: parsed.data,
  });

  return NextResponse.json(department, { status: 201 });
}
