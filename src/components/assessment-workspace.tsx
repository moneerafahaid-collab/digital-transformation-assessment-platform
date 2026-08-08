"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { AssessmentStatus } from "@prisma/client";
import type { ScoredDepartment } from "@/lib/scoring";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScoreBadge } from "@/components/score-badge";
import { STATUS_LABELS, statusColor } from "@/lib/utils";

export function AssessmentWorkspace({
  initial,
  canAssess,
}: {
  initial: ScoredDepartment[];
  canAssess: boolean;
}) {
  const [departments, setDepartments] = useState(initial);
  const [departmentId, setDepartmentId] = useState(initial[0]?.id || "");
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    setDepartments(initial);
  }, [initial]);

  const selected = useMemo(
    () => departments.find((d) => d.id === departmentId) || departments[0],
    [departments, departmentId]
  );

  function updateLocal(
    itemId: string,
    status: AssessmentStatus,
    notes: string | null,
    departmentScore: ScoredDepartment
  ) {
    setDepartments((prev) => prev.map((d) => (d.id === departmentScore.id ? departmentScore : d)));
  }

  function queueSave(itemId: string, status: AssessmentStatus, notes: string | null) {
    if (!canAssess) return;
    if (timers.current[itemId]) clearTimeout(timers.current[itemId]);

    timers.current[itemId] = setTimeout(async () => {
      const res = await fetch(`/api/assessment/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });

      if (!res.ok) {
        toast.error("فشل الحفظ التلقائي");
        return;
      }

      const data = await res.json();
      if (data.departmentScore) {
        updateLocal(itemId, status, notes, data.departmentScore);
      }
      toast.success("تم الحفظ تلقائياً", { duration: 1200 });
    }, 450);
  }

  if (!selected) {
    return <p className="text-muted-foreground">لا توجد إدارات للتقييم.</p>;
  }

  const indicator =
    statusColor(selected.score) === "green"
      ? "bg-emerald-500"
      : statusColor(selected.score) === "yellow"
        ? "bg-amber-500"
        : "bg-rose-500";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Select value={selected.id} onValueChange={setDepartmentId}>
          <SelectTrigger className="md:max-w-sm">
            <SelectValue placeholder="اختر الإدارة" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.nameAr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-3">
          <ScoreBadge score={selected.score} />
          <span className="text-sm text-muted-foreground">
            {selected.isFullyComplete ? "✅ مكتمل بالكامل" : selected.statusLabel}
          </span>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-3 pt-6">
          <div className="flex justify-between text-sm">
            <span>نسبة الإدارة الحالية</span>
            <span>{selected.score}%</span>
          </div>
          <Progress value={selected.score} indicatorClassName={indicator} />
        </CardContent>
      </Card>

      {selected.perspectives.map((perspective) => (
        <Card key={perspective.id} className="animate-fade-up">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{perspective.nameAr}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {perspective.isComplete ? "منظور مكتمل" : "يحتاج متابعة"}
              </p>
            </div>
            <ScoreBadge score={perspective.score} />
          </CardHeader>
          <CardContent className="space-y-4">
            {perspective.domains.map((domain) => (
              <div key={domain.id} className="rounded-xl border border-border/70 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="font-medium">{domain.nameAr}</h4>
                  <ScoreBadge score={domain.score} />
                </div>
                <div className="space-y-4">
                  {domain.items.map((item) => (
                    <div key={item.id} className="rounded-lg bg-muted/40 p-3">
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <p className="font-medium">
                          {item.code ? `${item.code} — ` : ""}
                          {item.titleAr}
                        </p>
                        <ScoreBadge score={item.score} status={item.status} />
                      </div>
                      <div className="grid gap-3 md:grid-cols-[220px_1fr]">
                        <Select
                          disabled={!canAssess}
                          value={item.status}
                          onValueChange={(value) =>
                            queueSave(item.id, value as AssessmentStatus, item.notes)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(Object.keys(STATUS_LABELS) as AssessmentStatus[]).map((status) => (
                              <SelectItem key={status} value={status}>
                                {STATUS_LABELS[status]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Textarea
                          disabled={!canAssess}
                          placeholder="ملاحظات (اختيارية)"
                          defaultValue={item.notes || ""}
                          onChange={(e) => queueSave(item.id, item.status, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
