import { auth } from "@/lib/auth";
import { getAllDepartmentScores } from "@/server/services/scores";
import { AssessmentWorkspace } from "@/components/assessment-workspace";

export const dynamic = "force-dynamic";

export default async function AssessmentPage() {
  const session = await auth();
  const departments = await getAllDepartmentScores();
  const canAssess = session?.user.role === "ADMIN" || session?.user.role === "ASSESSOR";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">التقييم</h2>
        <p className="text-muted-foreground">
          إدخال نتائج التقييم مع حفظ تلقائي وتحديث فوري للنسب
          {!canAssess ? " (وضع عرض فقط)" : ""}
        </p>
      </div>
      <AssessmentWorkspace initial={departments} canAssess={!!canAssess} />
    </div>
  );
}
