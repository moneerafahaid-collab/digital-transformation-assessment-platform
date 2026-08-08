import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PerspectivesManager } from "@/components/perspectives-manager";

export const dynamic = "force-dynamic";

export default async function PerspectivesPage() {
  const session = await auth();
  const [perspectives, departments] = await Promise.all([
    prisma.perspective.findMany({
      orderBy: [{ departmentId: "asc" }, { sortOrder: "asc" }],
      include: {
        department: true,
        _count: { select: { domains: true } },
      },
    }),
    prisma.department.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, nameAr: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">المناظير</h2>
        <p className="text-muted-foreground">إضافة وتعديل وربط المناظير بالإدارات</p>
      </div>
      <PerspectivesManager
        initial={perspectives}
        departments={departments}
        canManage={session?.user.role === "ADMIN"}
      />
    </div>
  );
}
