import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, requireSession } from "@/server/rbac";
import { writeAuditLog } from "@/server/audit";

const schema = z.object({
  titleAr: z.string().min(2),
  titleEn: z.string().min(2),
  code: z.string().optional(),
  description: z.string().optional(),
  domainId: z.string().min(1),
  sortOrder: z.number().int().optional(),
});

export async function GET(request: Request) {
  const authResult = await requireSession();
  if (!authResult.ok) return authResult.error;

  const { searchParams } = new URL(request.url);
  const domainId = searchParams.get("domainId") || undefined;

  const items = await prisma.assessmentItem.findMany({
    where: { domainId },
    orderBy: { sortOrder: "asc" },
    include: { result: true, domain: true },
  });

  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const authResult = await requireRole(["ADMIN"]);
  if (!authResult.ok) return authResult.error;

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  }

  const item = await prisma.assessmentItem.create({
    data: {
      ...parsed.data,
      result: {
        create: {
          status: "NOT_APPLIED",
          score: 0,
        },
      },
    },
    include: { result: true },
  });

  await writeAuditLog({
    actorId: authResult.session.user.id,
    action: "CREATE",
    entity: "AssessmentItem",
    entityId: item.id,
    metadata: parsed.data,
  });

  return NextResponse.json(item, { status: 201 });
}
