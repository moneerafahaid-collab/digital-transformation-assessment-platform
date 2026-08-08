import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/server/rbac";

export async function GET(request: Request) {
  const authResult = await requireRole(["ADMIN"]);
  if (!authResult.ok) return authResult.error;

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  const logs = await prisma.auditLog.findMany({
    where: q
      ? {
          OR: [
            { action: { contains: q, mode: "insensitive" } },
            { entity: { contains: q, mode: "insensitive" } },
            { entityId: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      actor: { select: { name: true, email: true } },
    },
  });

  return NextResponse.json(logs);
}
