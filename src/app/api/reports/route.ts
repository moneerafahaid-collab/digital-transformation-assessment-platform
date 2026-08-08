import { NextResponse } from "next/server";
import { requireSession } from "@/server/rbac";
import { getAllDepartmentScores, getDepartmentScore } from "@/server/services/scores";

export async function GET(request: Request) {
  const authResult = await requireSession();
  if (!authResult.ok) return authResult.error;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "overview";
  const departmentId = searchParams.get("departmentId");
  const perspectiveId = searchParams.get("perspectiveId");

  const departments = departmentId
    ? [await getDepartmentScore(departmentId)].filter(Boolean)
    : await getAllDepartmentScores();

  if (type === "department" && departmentId) {
    return NextResponse.json({ type, department: departments[0] ?? null });
  }

  if (type === "perspective" && perspectiveId) {
    for (const dept of departments) {
      if (!dept) continue;
      const perspective = dept.perspectives.find((p) => p.id === perspectiveId);
      if (perspective) {
        return NextResponse.json({
          type,
          department: { id: dept.id, nameAr: dept.nameAr },
          perspective,
        });
      }
    }
    return NextResponse.json({ error: "المنظور غير موجود" }, { status: 404 });
  }

  if (type === "domains") {
    const domains = departments.flatMap((d) =>
      (d?.perspectives || []).flatMap((p) =>
        p.domains.map((domain) => ({
          departmentName: d!.nameAr,
          perspectiveName: p.nameAr,
          ...domain,
        }))
      )
    );
    return NextResponse.json({ type, domains });
  }

  if (type === "gaps") {
    const gaps = departments.flatMap((d) =>
      (d?.perspectives || []).flatMap((p) =>
        p.domains.flatMap((domain) =>
          domain.items
            .filter((item) => item.status !== "COMPLETED")
            .map((item) => ({
              departmentName: d!.nameAr,
              perspectiveName: p.nameAr,
              domainName: domain.nameAr,
              itemTitle: item.titleAr,
              status: item.status,
              score: item.score,
              gap: 100 - item.score,
            }))
        )
      )
    );
    return NextResponse.json({ type, gaps });
  }

  if (type === "progress") {
    return NextResponse.json({
      type,
      progress: departments.map((d) => ({
        id: d!.id,
        nameAr: d!.nameAr,
        score: d!.score,
        isFullyComplete: d!.isFullyComplete,
        perspectives: d!.perspectives.map((p) => ({
          id: p.id,
          nameAr: p.nameAr,
          score: p.score,
          isComplete: p.isComplete,
        })),
      })),
    });
  }

  return NextResponse.json({ type: "overview", departments });
}
