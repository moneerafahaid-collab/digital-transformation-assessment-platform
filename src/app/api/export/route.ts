import { NextResponse } from "next/server";
import { requireSession } from "@/server/rbac";
import { getAllDepartmentScores, getDepartmentScore } from "@/server/services/scores";
import { buildCsv, buildExcel, buildPdf } from "@/lib/export";
import { writeAuditLog } from "@/server/audit";

export async function GET(request: Request) {
  const authResult = await requireSession();
  if (!authResult.ok) return authResult.error;

  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "csv";
  const departmentId = searchParams.get("departmentId");

  const departments = departmentId
    ? ([await getDepartmentScore(departmentId)].filter(Boolean) as NonNullable<
        Awaited<ReturnType<typeof getDepartmentScore>>
      >[])
    : await getAllDepartmentScores();

  await writeAuditLog({
    actorId: authResult.session.user.id,
    action: "EXPORT",
    entity: "Report",
    metadata: { format, departmentId },
  });

  if (format === "excel") {
    const buffer = await buildExcel(departments);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="dtap-report.xlsx"',
      },
    });
  }

  if (format === "pdf") {
    const buffer = buildPdf(departments);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="dtap-report.pdf"',
      },
    });
  }

  const csv = buildCsv(departments);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="dtap-report.csv"',
    },
  });
}
