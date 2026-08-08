"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScoreBadge } from "@/components/score-badge";
import { STATUS_LABELS } from "@/lib/utils";

type DepartmentOption = { id: string; nameAr: string };

export function ReportsPanel({ departments }: { departments: DepartmentOption[] }) {
  const [type, setType] = useState("progress");
  const [departmentId, setDepartmentId] = useState("all");
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams({ type });
    if (departmentId !== "all") params.set("departmentId", departmentId);
    const res = await fetch(`/api/reports?${params.toString()}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-col gap-3 pt-6 md:flex-row md:items-end">
          <div className="flex-1 space-y-2">
            <p className="text-sm text-muted-foreground">نوع التقرير</p>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="progress">تقرير الإنجاز</SelectItem>
                <SelectItem value="department">تقرير الإدارة</SelectItem>
                <SelectItem value="domains">تقرير تفصيلي للمحاور</SelectItem>
                <SelectItem value="gaps">تقرير الفجوات</SelectItem>
                <SelectItem value="overview">نظرة عامة</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 space-y-2">
            <p className="text-sm text-muted-foreground">الإدارة</p>
            <Select value={departmentId} onValueChange={setDepartmentId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الإدارات</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.nameAr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={load} disabled={loading}>
            {loading ? "جاري التحميل..." : "تحديث التقرير"}
          </Button>
        </CardContent>
      </Card>

      <ReportView data={data} />
    </div>
  );
}

function ReportView({ data }: { data: unknown }) {
  if (!data || typeof data !== "object") {
    return <p className="text-muted-foreground">لا توجد بيانات.</p>;
  }

  const report = data as Record<string, unknown>;

  if (report.type === "gaps" && Array.isArray(report.gaps)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>تقرير الفجوات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(report.gaps as Array<Record<string, unknown>>).map((gap, index) => (
            <div key={index} className="rounded-lg border border-border/70 p-3 text-sm">
              <p className="font-medium">{String(gap.itemTitle)}</p>
              <p className="text-muted-foreground">
                {String(gap.departmentName)} · {String(gap.perspectiveName)} · {String(gap.domainName)}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <ScoreBadge
                  score={Number(gap.score)}
                  status={gap.status as keyof typeof STATUS_LABELS}
                />
                <span className="text-xs text-rose-600">فجوة: {String(gap.gap)}%</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (report.type === "domains" && Array.isArray(report.domains)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>تقرير المحاور</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(report.domains as Array<Record<string, unknown>>).map((domain) => (
            <div key={String(domain.id)} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">{String(domain.nameAr)}</p>
                <p className="text-xs text-muted-foreground">
                  {String(domain.departmentName)} · {String(domain.perspectiveName)}
                </p>
              </div>
              <ScoreBadge score={Number(domain.score)} />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (report.type === "progress" && Array.isArray(report.progress)) {
    return (
      <div className="space-y-3">
        {(report.progress as Array<Record<string, unknown>>).map((dept) => (
          <Card key={String(dept.id)}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{String(dept.nameAr)}</CardTitle>
              <ScoreBadge score={Number(dept.score)} />
            </CardHeader>
            <CardContent className="space-y-2">
              {(dept.perspectives as Array<Record<string, unknown>>).map((p) => (
                <div key={String(p.id)} className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2">
                  <span>{String(p.nameAr)}</span>
                  <ScoreBadge score={Number(p.score)} />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (report.type === "department" && report.department) {
    const dept = report.department as Record<string, unknown>;
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{String(dept.nameAr)}</CardTitle>
          <ScoreBadge score={Number(dept.score)} />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {dept.isFullyComplete ? "✅ مكتمل بالكامل" : String(dept.statusLabel)}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>نتائج التقرير</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="overflow-auto rounded-lg bg-muted/50 p-3 text-xs" dir="ltr">
          {JSON.stringify(report, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}
