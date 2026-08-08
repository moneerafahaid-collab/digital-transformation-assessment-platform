import { auth } from "@/lib/auth";
import { getAllDepartmentScores } from "@/server/services/scores";
import { DepartmentsManager } from "@/components/departments-manager";

export const dynamic = "force-dynamic";

export default async function DepartmentsPage() {
  const session = await auth();
  const departments = await getAllDepartmentScores();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">الإدارات</h2>
        <p className="text-muted-foreground">إدارة الإدارات وعرض نسب الجاهزية</p>
      </div>
      <DepartmentsManager
        initial={departments}
        canManage={session?.user.role === "ADMIN"}
      />
    </div>
  );
}
