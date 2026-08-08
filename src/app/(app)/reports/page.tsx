import { prisma } from "@/lib/prisma";
import { ReportsPanel } from "@/components/reports-panel";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const departments = await prisma.department.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, nameAr: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">التقارير</h2>
        <p className="text-muted-foreground">
          تقارير الإدارات والمناظير والمحاور والفجوات والإنجاز
        </p>
      </div>
      <ReportsPanel departments={departments} />
    </div>
  );
}
