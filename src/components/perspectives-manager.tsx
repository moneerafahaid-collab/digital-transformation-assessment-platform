"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Department = { id: string; nameAr: string };
type Perspective = {
  id: string;
  nameAr: string;
  nameEn: string;
  departmentId: string;
  department: Department;
  _count: { domains: number };
};

export function PerspectivesManager({
  initial,
  departments,
  canManage,
}: {
  initial: Perspective[];
  departments: Department[];
  canManage: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [form, setForm] = useState({
    id: "",
    nameAr: "",
    nameEn: "",
    departmentId: departments[0]?.id || "",
  });

  const filtered = useMemo(
    () =>
      initial.filter((p) => {
        const matchQuery =
          p.nameAr.includes(query) || p.nameEn.toLowerCase().includes(query.toLowerCase());
        const matchDept = departmentFilter === "all" || p.departmentId === departmentFilter;
        return matchQuery && matchDept;
      }),
    [initial, query, departmentFilter]
  );

  async function save() {
    const res = await fetch(form.id ? `/api/perspectives/${form.id}` : "/api/perspectives", {
      method: form.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nameAr: form.nameAr,
        nameEn: form.nameEn,
        departmentId: form.departmentId,
      }),
    });
    if (!res.ok) {
      toast.error("تعذر حفظ المنظور");
      return;
    }
    toast.success("تم الحفظ");
    setForm({ id: "", nameAr: "", nameEn: "", departmentId: departments[0]?.id || "" });
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("حذف المنظور؟")) return;
    const res = await fetch(`/api/perspectives/${id}`, { method: "DELETE" });
    if (!res.ok) return toast.error("تعذر الحذف");
    toast.success("تم الحذف");
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <CardHeader className="gap-3 space-y-3">
          <CardTitle>المناظير</CardTitle>
          <div className="flex flex-col gap-2 md:flex-row">
            <Input placeholder="بحث..." value={query} onChange={(e) => setQuery(e.target.value)} />
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="md:max-w-xs">
                <SelectValue placeholder="الإدارة" />
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
        </CardHeader>
        <CardContent className="space-y-3">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="flex flex-col gap-3 rounded-xl border border-border/70 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-semibold">{p.nameAr}</p>
                <p className="text-sm text-muted-foreground">{p.department.nameAr}</p>
                <p className="text-xs text-muted-foreground">{p._count.domains} محاور</p>
              </div>
              {canManage && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setForm({
                        id: p.id,
                        nameAr: p.nameAr,
                        nameEn: p.nameEn,
                        departmentId: p.departmentId,
                      })
                    }
                  >
                    تعديل
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => remove(p.id)}>
                    حذف
                  </Button>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {canManage && (
        <Card>
          <CardHeader>
            <CardTitle>{form.id ? "تعديل منظور" : "إضافة منظور"}</CardTitle>
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
                dir="ltr"
                value={form.nameEn}
                onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>ربط بالإدارة</Label>
              <Select
                value={form.departmentId}
                onValueChange={(value) => setForm((f) => ({ ...f, departmentId: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.nameAr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={save}>حفظ</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
