import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AuditPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { actor: { select: { name: true, email: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">سجل التدقيق</h2>
        <p className="text-muted-foreground">تتبع العمليات الحساسة داخل النظام</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>آخر 100 عملية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="rounded-xl border border-border/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge>{log.action}</Badge>
                  <span className="font-medium">{log.entity}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(log.createdAt).toLocaleString("ar-SA")}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                بواسطة: {log.actor?.name || "نظام"} {log.entityId ? `· ${log.entityId}` : ""}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
