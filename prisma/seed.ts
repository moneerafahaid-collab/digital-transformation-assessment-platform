import { PrismaClient, AssessmentStatus, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type SeedItem = {
  code: string;
  titleAr: string;
  titleEn: string;
  status: AssessmentStatus;
  notes?: string;
};

type SeedDomain = {
  nameAr: string;
  nameEn: string;
  items: SeedItem[];
};

type SeedPerspective = {
  nameAr: string;
  nameEn: string;
  domains: SeedDomain[];
};

type SeedDepartment = {
  nameAr: string;
  nameEn: string;
  description: string;
  perspectives: SeedPerspective[];
};

const departments: SeedDepartment[] = [
  {
    nameAr: "إدارة البنية التحتية",
    nameEn: "Infrastructure Department",
    description: "تقييم جاهزية البنية التحتية الرقمية ومراكز البيانات والحوسبة السحابية.",
    perspectives: [
      {
        nameAr: "المنظور التقني",
        nameEn: "Technical Perspective",
        domains: [
          {
            nameAr: "مراكز البيانات",
            nameEn: "Data Centers",
            items: [
              {
                code: "INF-DC-01",
                titleAr: "توثيق بنية مراكز البيانات",
                titleEn: "Data center architecture documentation",
                status: "COMPLETED",
              },
              {
                code: "INF-DC-02",
                titleAr: "خطة التعافي من الكوارث",
                titleEn: "Disaster recovery plan",
                status: "IN_PROGRESS",
              },
              {
                code: "INF-DC-03",
                titleAr: "مراقبة الطاقة والتبريد",
                titleEn: "Power and cooling monitoring",
                status: "NOT_APPLIED",
              },
            ],
          },
          {
            nameAr: "السحابة والحوسبة",
            nameEn: "Cloud & Compute",
            items: [
              {
                code: "INF-CL-01",
                titleAr: "سياسة اعتماد السحابة",
                titleEn: "Cloud adoption policy",
                status: "COMPLETED",
              },
              {
                code: "INF-CL-02",
                titleAr: "إدارة الموارد السحابية",
                titleEn: "Cloud resource management",
                status: "IN_PROGRESS",
              },
            ],
          },
        ],
      },
      {
        nameAr: "منظور الحوكمة",
        nameEn: "Governance Perspective",
        domains: [
          {
            nameAr: "السياسات والمعايير",
            nameEn: "Policies & Standards",
            items: [
              {
                code: "INF-GOV-01",
                titleAr: "معايير تسمية الأصول",
                titleEn: "Asset naming standards",
                status: "COMPLETED",
              },
              {
                code: "INF-GOV-02",
                titleAr: "سجل أصول البنية التحتية",
                titleEn: "Infrastructure asset register",
                status: "IN_PROGRESS",
              },
            ],
          },
          {
            nameAr: "الأمن التشغيلي",
            nameEn: "Operational Security",
            items: [
              {
                code: "INF-SEC-01",
                titleAr: "ضوابط الوصول للخوادم",
                titleEn: "Server access controls",
                status: "COMPLETED",
              },
              {
                code: "INF-SEC-02",
                titleAr: "نسخ احتياطي مشفر",
                titleEn: "Encrypted backups",
                status: "NOT_APPLIED",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    nameAr: "إدارة الشبكات",
    nameEn: "Networks Department",
    description: "تقييم جاهزية الشبكات والاتصال والأمن السيبراني الشبكي.",
    perspectives: [
      {
        nameAr: "منظور الاتصال",
        nameEn: "Connectivity Perspective",
        domains: [
          {
            nameAr: "الشبكة الأساسية",
            nameEn: "Core Network",
            items: [
              {
                code: "NET-CR-01",
                titleAr: "تصميم الشبكة الأساسية موثق",
                titleEn: "Documented core network design",
                status: "COMPLETED",
              },
              {
                code: "NET-CR-02",
                titleAr: "تكرار الروابط الحرجة",
                titleEn: "Critical link redundancy",
                status: "COMPLETED",
              },
              {
                code: "NET-CR-03",
                titleAr: "مراقبة الأداء الشبكي",
                titleEn: "Network performance monitoring",
                status: "IN_PROGRESS",
              },
            ],
          },
          {
            nameAr: "الشبكة اللاسلكية",
            nameEn: "Wireless Network",
            items: [
              {
                code: "NET-WL-01",
                titleAr: "تغطية Wi-Fi المؤسسية",
                titleEn: "Enterprise Wi-Fi coverage",
                status: "IN_PROGRESS",
              },
              {
                code: "NET-WL-02",
                titleAr: "مصادقة مركزية للشبكة اللاسلكية",
                titleEn: "Centralized wireless authentication",
                status: "NOT_APPLIED",
              },
            ],
          },
        ],
      },
      {
        nameAr: "منظور الأمن الشبكي",
        nameEn: "Network Security Perspective",
        domains: [
          {
            nameAr: "الجدران النارية",
            nameEn: "Firewalls",
            items: [
              {
                code: "NET-FW-01",
                titleAr: "سياسات الجدار الناري موثقة",
                titleEn: "Documented firewall policies",
                status: "COMPLETED",
              },
              {
                code: "NET-FW-02",
                titleAr: "مراجعة دورية للقواعد",
                titleEn: "Periodic rule reviews",
                status: "IN_PROGRESS",
              },
            ],
          },
          {
            nameAr: "كشف التهديدات",
            nameEn: "Threat Detection",
            items: [
              {
                code: "NET-TD-01",
                titleAr: "نظام كشف التسلل",
                titleEn: "Intrusion detection system",
                status: "IN_PROGRESS",
              },
              {
                code: "NET-TD-02",
                titleAr: "تكامل مع مركز العمليات الأمنية",
                titleEn: "SOC integration",
                status: "NOT_APPLIED",
              },
            ],
          },
        ],
      },
      {
        nameAr: "منظور التشغيل",
        nameEn: "Operations Perspective",
        domains: [
          {
            nameAr: "إدارة التغيير",
            nameEn: "Change Management",
            items: [
              {
                code: "NET-OPS-01",
                titleAr: "إجراءات تغيير الشبكة",
                titleEn: "Network change procedures",
                status: "COMPLETED",
              },
              {
                code: "NET-OPS-02",
                titleAr: "سجل حوادث الشبكة",
                titleEn: "Network incident log",
                status: "COMPLETED",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    nameAr: "إدارة التطبيقات والمشاريع",
    nameEn: "Applications & Projects Department",
    description: "تقييم جاهزية دورة حياة التطبيقات وإدارة المشاريع الرقمية.",
    perspectives: [
      {
        nameAr: "منظور دورة حياة التطبيق",
        nameEn: "Application Lifecycle Perspective",
        domains: [
          {
            nameAr: "التطوير والنشر",
            nameEn: "Development & Deployment",
            items: [
              {
                code: "APP-DL-01",
                titleAr: "خطوط CI/CD معتمدة",
                titleEn: "Approved CI/CD pipelines",
                status: "COMPLETED",
              },
              {
                code: "APP-DL-02",
                titleAr: "بيئات منفصلة (Dev/Test/Prod)",
                titleEn: "Separated environments",
                status: "COMPLETED",
              },
              {
                code: "APP-DL-03",
                titleAr: "اختبارات آلية للجودة",
                titleEn: "Automated quality tests",
                status: "IN_PROGRESS",
              },
            ],
          },
          {
            nameAr: "إدارة المنتجات",
            nameEn: "Product Management",
            items: [
              {
                code: "APP-PM-01",
                titleAr: "كتالوج التطبيقات المؤسسية",
                titleEn: "Enterprise application catalog",
                status: "COMPLETED",
              },
              {
                code: "APP-PM-02",
                titleAr: "مؤشرات أداء التطبيقات",
                titleEn: "Application KPIs",
                status: "IN_PROGRESS",
              },
            ],
          },
        ],
      },
      {
        nameAr: "منظور إدارة المشاريع",
        nameEn: "Project Management Perspective",
        domains: [
          {
            nameAr: "الحوكمة والتخطيط",
            nameEn: "Governance & Planning",
            items: [
              {
                code: "PRJ-GV-01",
                titleAr: "منهجية إدارة المشاريع معتمدة",
                titleEn: "Approved project methodology",
                status: "COMPLETED",
              },
              {
                code: "PRJ-GV-02",
                titleAr: "مكتب إدارة المشاريع (PMO)",
                titleEn: "Project management office",
                status: "COMPLETED",
              },
              {
                code: "PRJ-GV-03",
                titleAr: "لوحة متابعة المشاريع",
                titleEn: "Project tracking dashboard",
                status: "IN_PROGRESS",
              },
            ],
          },
          {
            nameAr: "إدارة المخاطر",
            nameEn: "Risk Management",
            items: [
              {
                code: "PRJ-RK-01",
                titleAr: "سجل مخاطر المشاريع",
                titleEn: "Project risk register",
                status: "IN_PROGRESS",
              },
              {
                code: "PRJ-RK-02",
                titleAr: "خطط التخفيف المعتمدة",
                titleEn: "Approved mitigation plans",
                status: "NOT_APPLIED",
              },
            ],
          },
        ],
      },
    ],
  },
];

const scoreMap: Record<AssessmentStatus, number> = {
  NOT_APPLIED: 0,
  IN_PROGRESS: 50,
  COMPLETED: 100,
};

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.assessmentResult.deleteMany();
  await prisma.assessmentItem.deleteMany();
  await prisma.domain.deleteMany();
  await prisma.perspective.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Admin@123", 10);
  const assessorHash = await bcrypt.hash("Assessor@123", 10);
  const viewerHash = await bcrypt.hash("Viewer@123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "مدير النظام",
      email: "admin@dtap.local",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  await prisma.user.create({
    data: {
      name: "مقيّم جاهزية",
      email: "assessor@dtap.local",
      passwordHash: assessorHash,
      role: Role.ASSESSOR,
    },
  });

  await prisma.user.create({
    data: {
      name: "مستعرض تقارير",
      email: "viewer@dtap.local",
      passwordHash: viewerHash,
      role: Role.VIEWER,
    },
  });

  for (const [dIndex, dept] of departments.entries()) {
    const createdDept = await prisma.department.create({
      data: {
        nameAr: dept.nameAr,
        nameEn: dept.nameEn,
        description: dept.description,
        sortOrder: dIndex + 1,
      },
    });

    for (const [pIndex, perspective] of dept.perspectives.entries()) {
      const createdPerspective = await prisma.perspective.create({
        data: {
          nameAr: perspective.nameAr,
          nameEn: perspective.nameEn,
          sortOrder: pIndex + 1,
          departmentId: createdDept.id,
        },
      });

      for (const [domIndex, domain] of perspective.domains.entries()) {
        const createdDomain = await prisma.domain.create({
          data: {
            nameAr: domain.nameAr,
            nameEn: domain.nameEn,
            sortOrder: domIndex + 1,
            perspectiveId: createdPerspective.id,
          },
        });

        for (const [itemIndex, item] of domain.items.entries()) {
          const createdItem = await prisma.assessmentItem.create({
            data: {
              code: item.code,
              titleAr: item.titleAr,
              titleEn: item.titleEn,
              sortOrder: itemIndex + 1,
              domainId: createdDomain.id,
            },
          });

          await prisma.assessmentResult.create({
            data: {
              itemId: createdItem.id,
              status: item.status,
              score: scoreMap[item.status],
              notes: item.notes ?? null,
              assessedBy: admin.id,
            },
          });
        }
      }
    }
  }

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "SEED",
      entity: "System",
      metadata: { message: "تم تهيئة بيانات النظام التجريبية" },
    },
  });

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
