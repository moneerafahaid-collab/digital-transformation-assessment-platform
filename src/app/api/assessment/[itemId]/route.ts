import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/server/rbac";
import { writeAuditLog } from "@/server/audit";
import { STATUS_SCORE } from "@/lib/utils";
import { getDepartmentScore } from "@/server/services/scores";

const schema = z.object({
  status: z.enum(["NOT_APPLIED", "IN_PROGRESS", "COMPLETED"]),
  notes: z.string().optional().nullable(),
});

export async function PUT(request: Request, { params }: { params: Promise<{ itemId: string }> }) {
  const authResult = await requireRole(["ADMIN", "ASSESSOR"]);
  if (!authResult.ok) return authResult.error;

  const { itemId } = await params;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  }

  const item = await prisma.assessmentItem.findUnique({
    where: { id: itemId },
    include: {
      domain: {
        include: {
          perspective: true,
        },
      },
    },
  });

  if (!item) return NextResponse.json({ error: "العنصر غير موجود" }, { status: 404 });

  const score = STATUS_SCORE[parsed.data.status];
  const result = await prisma.assessmentResult.upsert({
    where: { itemId },
    create: {
      itemId,
      status: parsed.data.status,
      score,
      notes: parsed.data.notes ?? null,
      assessedBy: authResult.session.user.id,
    },
    update: {
      status: parsed.data.status,
      score,
      notes: parsed.data.notes ?? null,
      assessedBy: authResult.session.user.id,
    },
  });

  await writeAuditLog({
    actorId: authResult.session.user.id,
    action: "ASSESS",
    entity: "AssessmentResult",
    entityId: result.id,
    metadata: {
      itemId,
      status: parsed.data.status,
      score,
    },
  });

  const departmentScore = await getDepartmentScore(item.domain.perspective.departmentId);

  return NextResponse.json({
    result,
    departmentScore,
    perspectiveId: item.domain.perspectiveId,
    domainId: item.domainId,
  });
}
