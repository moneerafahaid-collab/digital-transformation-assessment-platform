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

type Perspective = {
  id: string;
  nameAr: string;
  department: { nameAr: string };
};

type Domain = {
  id: string;
  nameAr: string;
  nameEn: string;
  perspectiveId: string;
  perspective: Perspective;
  _count: { items: number };
};

export function DomainsManager({
  initial,
  perspectives,
  canManage,
}: {
  initial: Domain[];
  perspectives: Perspective[];
  canManage: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({
    id: "",
    nameAr: "",
    nameEn: "",
    perspectiveId: perspectives[0]?.id || "",
  });

  const filtered = useMemo(
    () =>
      initial.filter(
        (d) =>
          d.nameAr.includes(query) || d.nameEn.toLowerCase().includes(query.toLowerCase())
      ),
    [initial, query]
  );

  async function save() {
    const res = await fetch(form.id ? `/api/domains/${form.id}` : "/api/domains", {
      method: form.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nameAr: form.nameAr,
        nameEn: form.nameEn,
        perspectiveId: form.perspectiveId,
      }),
    });
    if (!res.ok) return toast.error("تعذر الحفظ");
    toast.success("تم الحفظ");
    setForm({ id: "", nameAr: "", nameEn: "", perspectiveId: perspectives[0]?.id || "" });
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("حذف المحور؟")) return;
    const res = await fetch(`/api/domains/${id}`, { method: "DELETE" });
    if (!res.ok) return toast.error("تعذر الحذف");
    toast.success("تم الحذف");
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>المحاور</CardTitle>
          <Input
            className="max-w-xs"
            placeholder="بحث..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </CardHeader>
        <CardContent className="space-y-3">
          {filtered.map((domain) => (
            <div
              key={domain.id}
              className="flex flex-col gap-3 rounded-xl border border-border/70 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-semibold">{domain.nameAr}</p>
                <p className="text-sm text-muted-foreground">
                  {domain.perspective.department.nameAr} · {domain.perspective.nameAr}
                </p>
                <p className="text-xs text-muted-foreground">{domain._count.items} عناصر تقييم</p>
              </div>
              {canManage && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setForm({
                        id: domain.id,
                        nameAr: domain.nameAr,
                        nameEn: domain.nameEn,
                        perspectiveId: domain.perspectiveId,
                      })
                    }
                  >
                    تعديل
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(domain.id)}>
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
            <CardTitle>{form.id ? "تعديل محور" : "إضافة محور"}</CardTitle>
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
              <Label>ربط بالمنظور</Label>
              <Select
                value={form.perspectiveId}
                onValueChange={(value) => setForm((f) => ({ ...f, perspectiveId: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {perspectives.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.department.nameAr} — {p.nameAr}
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
