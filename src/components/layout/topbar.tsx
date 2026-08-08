"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const roleLabels: Record<string, string> = {
  ADMIN: "مدير النظام",
  ASSESSOR: "مقيّم",
  VIEWER: "مستعرض",
};

export function Topbar({
  name,
  role,
}: {
  name?: string | null;
  role: string;
}) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-border/70 bg-background/80 px-4 py-3 backdrop-blur md:px-6">
      <div>
        <p className="text-sm text-muted-foreground">وكالة التحول الرقمي</p>
        <p className="font-medium">{name || "مستخدم"}</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="secondary">{roleLabels[role] || role}</Badge>
        <ThemeToggle />
        <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/login" })}>
          <LogOut className="h-4 w-4" />
          خروج
        </Button>
      </div>
    </header>
  );
}
