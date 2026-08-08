import { prisma } from "@/lib/prisma";
import { scoreDepartment, type ScoredDepartment } from "@/lib/scoring";

const departmentInclude = {
  perspectives: {
    orderBy: { sortOrder: "asc" as const },
    include: {
      domains: {
        orderBy: { sortOrder: "asc" as const },
        include: {
          items: {
            orderBy: { sortOrder: "asc" as const },
            include: { result: true },
          },
        },
      },
    },
  },
};

export async function getDepartmentScore(id: string): Promise<ScoredDepartment | null> {
  const department = await prisma.department.findUnique({
    where: { id },
    include: departmentInclude,
  });
  if (!department) return null;
  return scoreDepartment(department);
}

export async function getAllDepartmentScores(): Promise<ScoredDepartment[]> {
  const departments = await prisma.department.findMany({
    where: { status: "ACTIVE" },
    orderBy: { sortOrder: "asc" },
    include: departmentInclude,
  });
  return departments.map(scoreDepartment);
}

export async function getDashboardStats() {
  const [departments, perspectivesCount, recentResults, usersCount] = await Promise.all([
    getAllDepartmentScores(),
    prisma.perspective.count(),
    prisma.assessmentResult.findMany({
      take: 8,
      orderBy: { updatedAt: "desc" },
      include: {
        item: {
          include: {
            domain: {
              include: {
                perspective: {
                  include: { department: true },
                },
              },
            },
          },
        },
        assessor: { select: { name: true } },
      },
    }),
    prisma.user.count(),
  ]);

  const overallScore =
    departments.length > 0
      ? Math.round(
          (departments.reduce((sum, d) => sum + d.score, 0) / departments.length) * 100
        ) / 100
      : 0;

  return {
    departmentsCount: departments.length,
    perspectivesCount,
    usersCount,
    overallScore,
    departments,
    recentResults: recentResults.map((r) => ({
      id: r.id,
      status: r.status,
      score: r.score,
      updatedAt: r.updatedAt,
      itemTitle: r.item.titleAr,
      domainName: r.item.domain.nameAr,
      perspectiveName: r.item.domain.perspective.nameAr,
      departmentName: r.item.domain.perspective.department.nameAr,
      assessorName: r.assessor?.name ?? "—",
    })),
  };
}
