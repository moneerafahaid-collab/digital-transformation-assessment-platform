import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { ScoredDepartment } from "@/lib/scoring";
import { STATUS_LABELS } from "@/lib/utils";

export function buildCsv(departments: ScoredDepartment[]): string {
  const rows = [
    ["الإدارة", "المنظور", "المحور", "رمز العنصر", "عنصر التقييم", "الحالة", "النسبة"],
  ];

  for (const dept of departments) {
    for (const perspective of dept.perspectives) {
      for (const domain of perspective.domains) {
        for (const item of domain.items) {
          rows.push([
            dept.nameAr,
            perspective.nameAr,
            domain.nameAr,
            item.code || "",
            item.titleAr,
            STATUS_LABELS[item.status],
            String(item.score),
          ]);
        }
      }
    }
  }

  const bom = "\uFEFF";
  return (
    bom +
    rows
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
      .join("\n")
  );
}

export async function buildExcel(departments: ScoredDepartment[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "DTAP";
  workbook.created = new Date();

  const summary = workbook.addWorksheet("ملخص الإدارات");
  summary.columns = [
    { header: "الإدارة", key: "name", width: 35 },
    { header: "النسبة", key: "score", width: 12 },
    { header: "الحالة", key: "status", width: 20 },
  ];
  departments.forEach((d) => {
    summary.addRow({
      name: d.nameAr,
      score: d.score,
      status: d.isFullyComplete ? "مكتمل بالكامل" : d.statusLabel,
    });
  });

  const details = workbook.addWorksheet("التفاصيل");
  details.columns = [
    { header: "الإدارة", key: "department", width: 28 },
    { header: "المنظور", key: "perspective", width: 28 },
    { header: "المحور", key: "domain", width: 24 },
    { header: "الرمز", key: "code", width: 14 },
    { header: "العنصر", key: "item", width: 40 },
    { header: "الحالة", key: "status", width: 16 },
    { header: "النسبة", key: "score", width: 10 },
  ];

  for (const dept of departments) {
    for (const perspective of dept.perspectives) {
      for (const domain of perspective.domains) {
        for (const item of domain.items) {
          details.addRow({
            department: dept.nameAr,
            perspective: perspective.nameAr,
            domain: domain.nameAr,
            code: item.code || "",
            item: item.titleAr,
            status: STATUS_LABELS[item.status],
            score: item.score,
          });
        }
      }
    }
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

export function buildPdf(departments: ScoredDepartment[]): Buffer {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

  doc.setFontSize(16);
  doc.text("Digital Transformation Assessment Platform", 40, 40);
  doc.setFontSize(11);
  doc.text(`Generated at: ${new Date().toISOString()}`, 40, 60);

  const body = departments.flatMap((dept) =>
    dept.perspectives.flatMap((p) =>
      p.domains.flatMap((d) =>
        d.items.map((item) => [
          dept.nameAr,
          p.nameAr,
          d.nameAr,
          item.code || "-",
          item.titleAr,
          STATUS_LABELS[item.status],
          `${item.score}%`,
        ])
      )
    )
  );

  autoTable(doc, {
    startY: 80,
    head: [["Department", "Perspective", "Domain", "Code", "Item", "Status", "Score"]],
    body,
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: [15, 106, 95] },
  });

  const summaryY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 24;
  doc.setFontSize(12);
  doc.text("Department Summary", 40, summaryY);

  autoTable(doc, {
    startY: summaryY + 10,
    head: [["Department", "Score", "Status"]],
    body: departments.map((d) => [
      d.nameEn,
      `${d.score}%`,
      d.isFullyComplete ? "Fully Completed" : d.statusLabel,
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [15, 106, 95] },
  });

  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}
