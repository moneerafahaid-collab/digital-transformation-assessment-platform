"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreBadge } from "@/components/score-badge";

type DepartmentRow = {
  id: string;
  nameAr: string;
  nameEn: string;
  description: string | null;
  score: number;
  isFullyComplete: boolean;
  statusLabel: string;
};

export function DepartmentsManager({
  initial,
  canManage,
}: {
  initial: DepartmentRow[];
  canManage: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({
    id: "",
    nameAr: "",
    nameEn: "",
    description: "",
  });

  const filtered = useMemo(
    () =>
      initial.filter(
        (d) =>
          d.nameAr.includes(query) ||
          d.nameEn.toLowerCase().includes(query.toLowerCase())
      ),
    [initial, query]
  );

  async function save() {
    const payload = {
      nameAr: form.nameAr,
      nameEn: form.nameEn,
      description: form.description || undefined,
    };

    const res = await fetch(form.id ? `/api/departments/${form.id}` : "/api/departments", {
      method: form.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      toast.error("تعذر حفظ الإدارة");
      return;
    }

    toast.success(form.id ? "تم تحديث الإدارة" : "تمت إضافة الإدارة");
    setForm({ id: "", nameAr: "", nameEn: "", description: "" });
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("هل تريد حذف الإدارة وجميع بياناتها المرتبطة؟")) return;
    const res = await fetch(`/api/departments/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("تعذر الحذف");
      return;
    }
    toast.success("تم الحذف");
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>قائمة الإدارات</CardTitle>
          <Input
            placeholder="بحث..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-xs"
          />
        </CardHeader>
        <CardContent className="space-y-3">
          {filtered.map((dept) => (
            <div
              key={dept.id}
              className="flex flex-col gap-3 rounded-xl border border-border/70 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <Link href={`/departments/${dept.id}`} className="font-semibold hover:text-teal-700">
                  {dept.nameAr}
                </Link>
                <p className="text-sm text-muted-foreground">{dept.nameEn}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {dept.isFullyComplete ? "✅ مكتمل بالكامل" : dept.statusLabel}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ScoreBadge score={dept.score} />
                {canManage && (
                  <>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        setForm({
                          id: dept.id,
                          nameAr: dept.nameAr,
                          nameEn: dept.nameEn,
                          description: dept.description || "",
                        })
                      }
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="destructive" onClick={() => remove(dept.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {canManage && (
        <Card>
          <CardHeader>
            <CardTitle>{form.id ? "تعديل إدارة" : "إضافة إدارة"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label>الاسم بالعربية</Label>
              <Input
                value={form.nameAr}
                onChange={(e) => setForm((f) => ({ ...f, nameAr: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>الاسم بالإنجليزية</Label>
              <Input
                value={form.nameEn}
                onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label>الوصف</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={save}>
                <Plus className="h-4 w-4" />
                حفظ
              </Button>
              {form.id && (
                <Button
                  variant="outline"
                  onClick={() => setForm({ id: "", nameAr: "", nameEn: "", description: "" })}
                >
                  إلغاء
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
