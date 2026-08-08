import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ExportPage() {
  const departments = await prisma.department.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, nameAr: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">مركز التصدير</h2>
        <p className="text-muted-foreground">تصدير التقارير بصيغ PDF و Excel و CSV</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { format: "pdf", label: "PDF احترافي", desc: "تقرير منسق للطباعة والعرض" },
          { format: "excel", label: "Excel", desc: "ملف جداول شامل للتحليل" },
          { format: "csv", label: "CSV", desc: "تصدير نصي متوافق مع Excel" },
        ].map((item) => (
          <Card key={item.format} className="animate-fade-up">
            <CardHeader>
              <CardTitle>{item.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{item.desc}</p>
              <a href={`/api/export?format=${item.format}`}>
                <Button className="w-full">
                  <Download className="h-4 w-4" />
                  تصدير الكل
                </Button>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تصدير حسب الإدارة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="flex flex-col gap-3 rounded-xl border border-border/70 p-4 md:flex-row md:items-center md:justify-between"
            >
              <p className="font-medium">{dept.nameAr}</p>
              <div className="flex flex-wrap gap-2">
                {(["pdf", "excel", "csv"] as const).map((format) => (
                  <a key={format} href={`/api/export?format=${format}&departmentId=${dept.id}`}>
                    <Button variant="outline" size="sm">
                      {format.toUpperCase()}
                    </Button>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
