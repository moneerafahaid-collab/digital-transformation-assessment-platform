"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      toast.error("بيانات الدخول غير صحيحة");
      return;
    }

    toast.success("تم تسجيل الدخول بنجاح");
    router.push(searchParams.get("callbackUrl") || "/dashboard");
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div className="absolute start-4 top-4">
        <ThemeToggle />
      </div>

      <div className="animate-fade-up w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold tracking-[0.25em] text-teal-700 dark:text-teal-300">
            DIGITAL TRANSFORMATION
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold md:text-4xl">
            منصة تقييم التحول الرقمي
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            إدارة وتقييم جاهزية إدارات وكالة التحول الرقمي
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur"
        >
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue="admin@dtap.local"
              required
              dir="ltr"
              className="text-start"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              name="password"
              type="password"
              defaultValue="Admin@123"
              required
              dir="ltr"
              className="text-start"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "جاري الدخول..." : "تسجيل الدخول"}
          </Button>
          <div className="rounded-lg bg-muted/60 p-3 text-xs leading-6 text-muted-foreground">
            <p>حسابات تجريبية:</p>
            <p dir="ltr">admin@dtap.local / Admin@123</p>
            <p dir="ltr">assessor@dtap.local / Assessor@123</p>
            <p dir="ltr">viewer@dtap.local / Viewer@123</p>
          </div>
        </form>
      </div>
    </div>
  );
}
