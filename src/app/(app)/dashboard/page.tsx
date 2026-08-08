import Link from "next/link";
import { Building2, Layers3, Percent, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScoreBadge, StatusDot } from "@/components/score-badge";
import { DepartmentBarChart, StatusPieChart } from "@/components/dashboard-charts";
import { getDashboardStats } from "@/server/services/scores";
import { STATUS_LABELS, statusColor } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const barData = stats.departments.map((d) => ({
    name: d.nameAr.replace("إدارة ", ""),
    score: d.score,
  }));

  const statusCounts = { COMPLETED: 0, IN_PROGRESS: 0, NOT_APPLIED: 0 };
  for (const dept of stats.departments) {
    for (const p of dept.perspectives) {
      for (const domain of p.domains) {
        for (const item of domain.items) {
          statusCounts[item.status] += 1;
        }
      }
    }
  }

  const pieData = [
    { name: "مكتمل", value: statusCounts.COMPLETED },
    { name: "قيد التنفيذ", value: statusCounts.IN_PROGRESS },
    { name: "غير مطبق", value: statusCounts.NOT_APPLIED },
  ];

  const progressColor =
    statusColor(stats.overallScore) === "green"
      ? "bg-emerald-500"
      : statusColor(stats.overallScore) === "yellow"
        ? "bg-amber-500"
        : "bg-rose-500";

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h2 className="font-display text-2xl font-bold md:text-3xl">لوحة المؤشرات</h2>
        <p className="mt-1 text-muted-foreground">
          نظرة شاملة على جاهزية إدارات وكالة التحول الرقمي
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "عدد الإدارات",
            value: stats.departmentsCount,
            icon: Building2,
          },
          {
            title: "عدد المناظير",
            value: stats.perspectivesCount,
            icon: Layers3,
          },
          {
            title: "نسبة الإنجاز العامة",
            value: `${stats.overallScore}%`,
            icon: Percent,
          },
          {
            title: "إدارات مكتملة بالكامل",
            value: stats.departments.filter((d) => d.isFullyComplete).length,
            icon: CheckCircle2,
          },
        ].map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title} className="animate-fade-up" style={{ animationDelay: `${index * 60}ms` }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-teal-700 dark:text-teal-300" />
              </CardHeader>
              <CardContent>
                <div className="font-display text-3xl font-bold">{kpi.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="animate-fade-up">
        <CardHeader>
          <CardTitle>الإنجاز العام</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>متوسط جاهزية الإدارات</span>
            <span className="font-semibold">{stats.overallScore}%</span>
          </div>
          <Progress value={stats.overallScore} indicatorClassName={progressColor} />
          <div className="flex flex-wrap gap-4 pt-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> مكتمل
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> قيد التنفيذ
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> غير مطبق
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>نسب الإدارات</CardTitle>
          </CardHeader>
          <CardContent>
            <DepartmentBarChart data={barData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>توزيع حالات عناصر التقييم</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusPieChart data={pieData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>جاهزية الإدارات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.departments.map((dept) => (
              <Link
                key={dept.id}
                href={`/departments/${dept.id}`}
                className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-3 transition hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <StatusDot score={dept.score} />
                  <div>
                    <p className="font-medium">{dept.nameAr}</p>
                    <p className="text-xs text-muted-foreground">
                      {dept.isFullyComplete ? "✅ مكتمل بالكامل" : dept.statusLabel}
                    </p>
                  </div>
                </div>
                <ScoreBadge score={dept.score} />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>آخر التقييمات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.recentResults.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-border/60 px-3 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{item.itemTitle}</p>
                  <Badge
                    variant={
                      item.status === "COMPLETED"
                        ? "success"
                        : item.status === "IN_PROGRESS"
                          ? "warning"
                          : "danger"
                    }
                  >
                    {STATUS_LABELS[item.status]}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.departmentName} · {item.perspectiveName} · {item.domainName}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  بواسطة {item.assessorName} · {new Date(item.updatedAt).toLocaleString("ar-SA")}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
