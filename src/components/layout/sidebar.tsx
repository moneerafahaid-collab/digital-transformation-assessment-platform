"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Layers3,
  Grid3x3,
  ClipboardCheck,
  FileBarChart2,
  Download,
  Users,
  ScrollText,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/dashboard", label: "لوحة المؤشرات", icon: LayoutDashboard },
  { href: "/departments", label: "الإدارات", icon: Building2 },
  { href: "/perspectives", label: "المناظير", icon: Layers3 },
  { href: "/domains", label: "المحاور", icon: Grid3x3 },
  { href: "/assessment", label: "التقييم", icon: ClipboardCheck },
  { href: "/reports", label: "التقارير", icon: FileBarChart2 },
  { href: "/export", label: "مركز التصدير", icon: Download },
];

const adminLinks = [
  { href: "/admin/users", label: "المستخدمون", icon: Users },
  { href: "/admin/audit", label: "سجل التدقيق", icon: ScrollText },
];

export function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const Nav = (
    <nav className="flex flex-1 flex-col gap-1 p-4">
      <div className="mb-6 px-2">
        <p className="text-xs font-semibold tracking-[0.2em] text-teal-700 dark:text-teal-300">
          DTAP
        </p>
        <h1 className="mt-1 font-display text-lg font-bold leading-tight text-foreground">
          منصة تقييم التحول الرقمي
        </h1>
      </div>

      {links.map((link) => {
        const Icon = link.icon;
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-teal-700 text-white shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}

      {role === "ADMIN" && (
        <>
          <div className="my-3 border-t border-border/70" />
          <p className="px-3 pb-2 text-xs text-muted-foreground">الإدارة</p>
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-teal-700 text-white shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </>
      )}
    </nav>
  );

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border/70 bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
        <span className="font-display font-semibold">DTAP</span>
        <Button variant="ghost" size="icon" onClick={() => setOpen((v) => !v)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur lg:hidden">
          {Nav}
        </div>
      )}

      <aside className="hidden w-72 shrink-0 border-e border-border/70 bg-sidebar lg:flex lg:flex-col">
        {Nav}
      </aside>
    </>
  );
}
