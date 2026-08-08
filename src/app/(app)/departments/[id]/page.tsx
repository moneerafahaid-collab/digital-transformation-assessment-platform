import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScoreBadge, StatusDot } from "@/components/score-badge";
import { getDepartmentScore } from "@/server/services/scores";
import { statusColor } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DepartmentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const department = await getDepartmentScore(id);
  if (!department) notFound();

  const indicator =
    statusColor(department.score) === "green"
      ? "bg-emerald-500"
      : statusColor(department.score) === "yellow"
        ? "bg-amber-500"
        : "bg-rose-500";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/departments" className="text-sm text-teal-700 hover:underline">
            العودة للإدارات
          </Link>
          <h2 className="mt-2 font-display text-2xl font-bold">{department.nameAr}</h2>
          <p className="text-muted-foreground">{department.description}</p>
        </div>
        <div className="text-end">
          <ScoreBadge score={department.score} />
          <p className="mt-2 text-sm">
            {department.isFullyComplete ? "✅ مكتمل بالكامل" : department.statusLabel}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-3 pt-6">
          <div className="flex justify-between text-sm">
            <span>نسبة الإدارة</span>
            <span>{department.score}%</span>
          </div>
          <Progress value={department.score} indicatorClassName={indicator} />
        </CardContent>
      </Card>

      <div className="space-y-4">
        {department.perspectives.map((perspective) => (
          <Card key={perspective.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{perspective.nameAr}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {perspective.isComplete ? "منظور مكتمل 100%" : "منظور قيد المتابعة"}
                </p>
              </div>
              <ScoreBadge score={perspective.score} />
            </CardHeader>
            <CardContent className="space-y-4">
              {perspective.domains.map((domain) => (
                <div key={domain.id} className="rounded-lg border border-border/60 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StatusDot score={domain.score} />
                      <h4 className="font-medium">{domain.nameAr}</h4>
                    </div>
                    <ScoreBadge score={domain.score} />
                  </div>
                  <div className="space-y-2">
                    {domain.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-muted/40 px-3 py-2 text-sm"
                      >
                        <span>
                          {item.code ? `${item.code} — ` : ""}
                          {item.titleAr}
                        </span>
                        <ScoreBadge score={item.score} status={item.status} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
