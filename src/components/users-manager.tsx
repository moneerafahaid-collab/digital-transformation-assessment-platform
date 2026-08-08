"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "ASSESSOR" | "VIEWER";
  createdAt: string | Date;
};

const roleLabels = {
  ADMIN: "مدير",
  ASSESSOR: "مقيّم",
  VIEWER: "مستعرض",
};

export function UsersManager({ initial }: { initial: UserRow[] }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "VIEWER" as UserRow["role"],
  });

  async function createUser() {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      toast.error("تعذر إنشاء المستخدم");
      return;
    }
    toast.success("تم إنشاء المستخدم");
    setForm({ name: "", email: "", password: "", role: "VIEWER" });
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <CardHeader>
          <CardTitle>المستخدمون</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {initial.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between rounded-xl border border-border/70 p-4"
            >
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground" dir="ltr">
                  {user.email}
                </p>
              </div>
              <Badge variant="secondary">{roleLabels[user.role]}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>إضافة مستخدم</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>الاسم</Label>
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>البريد</Label>
            <Input
              dir="ltr"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>كلمة المرور</Label>
            <Input
              type="password"
              dir="ltr"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>الدور</Label>
            <Select
              value={form.role}
              onValueChange={(value) => setForm((f) => ({ ...f, role: value as UserRow["role"] }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">مدير</SelectItem>
                <SelectItem value="ASSESSOR">مقيّم</SelectItem>
                <SelectItem value="VIEWER">مستعرض</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={createUser}>إنشاء</Button>
        </CardContent>
      </Card>
    </div>
  );
}
