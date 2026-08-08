# Digital Transformation Assessment Platform (DTAP)

منصة ويب احترافية لإدارة وتقييم **جاهزية الإدارات** التابعة لوكالة التحول الرقمي.

> مشروع جاهز للعرض والمراجعة — مناسب للجنة التقييم.

![لوحة مؤشرات DTAP](docs/dashboard.png)

---

## هدف المشروع

إنشاء منصة تمكّن من:

- إدارة هيكل التقييم المؤسسي
- إدخال نتائج التقييم ومتابعتها
- احتساب نسب الجاهزية تلقائياً
- إصدار تقارير وتصدير النتائج بشكل احترافي

## الإدارات المشمولة

1. إدارة البنية التحتية  
2. إدارة الشبكات  
3. إدارة التطبيقات والمشاريع  

## هيكل التقييم

```text
الإدارة
 └─ المنظور (Perspective)
     └─ المحور (Domain)
         └─ عناصر التقييم (Assessment Items)
```

## قواعد التقييم والاحتساب

| الحالة | النسبة |
|--------|--------|
| غير مطبق | 0% |
| قيد التنفيذ | 50% |
| مكتمل | 100% |

- نسبة المحور = متوسط عناصره  
- نسبة المنظور = متوسط محاوره  
- نسبة الإدارة = متوسط مناظيرها  
- إذا اكتملت جميع المناظير بنسبة 100% تظهر حالة: **مكتمل بالكامل**

## ما يوفّره النظام

- لوحة مؤشرات تفاعلية (KPI + رسوم بيانية)
- إدارة الإدارات والمناظير والمحاور
- صفحة تقييم مع حفظ تلقائي وتحديث فوري للنسب
- تقارير: إنجاز / فجوات / محاور / إدارات
- مركز تصدير: PDF / Excel / CSV
- صلاحيات: Admin / Assessor / Viewer
- سجل تدقيق (Audit Logs)
- واجهة عربية RTL + Dark/Light Mode + تصميم متجاوب

## التقنيات المستخدمة

| الطبقة | التقنية |
|--------|---------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Shadcn UI, Recharts |
| Backend | Next.js API Routes, Auth.js |
| Database | PostgreSQL + Prisma ORM |

## صفحات النظام

| المسار | الوصف |
|--------|--------|
| `/login` | تسجيل الدخول |
| `/dashboard` | لوحة المؤشرات |
| `/departments` | الإدارات |
| `/perspectives` | المناظير |
| `/domains` | المحاور |
| `/assessment` | إدخال التقييم |
| `/reports` | التقارير |
| `/export` | مركز التصدير |
| `/admin/users` | المستخدمون |
| `/admin/audit` | سجل التدقيق |

## تشغيل المشروع للمراجعة المحلية

```bash
# 1) تشغيل قاعدة البيانات
docker compose up -d
# أو على Windows: npm run db:start

# 2) إعداد البيئة
cp .env.example .env

# 3) التثبيت وتهيئة البيانات
npm install
npm run db:setup

# 4) التشغيل
npm run dev
```

ثم افتح: [http://localhost:3000](http://localhost:3000)

### حسابات تجريبية

| الدور | البريد | كلمة المرور |
|------|--------|-------------|
| Admin | `admin@dtap.local` | `Admin@123` |
| Assessor | `assessor@dtap.local` | `Assessor@123` |
| Viewer | `viewer@dtap.local` | `Viewer@123` |

## هيكل المستودع

```text
dtap/
├── prisma/          # قاعدة البيانات + Seed
├── src/app/         # الصفحات وواجهات API
├── src/components/  # مكونات الواجهة
├── src/lib/         # المنطق المشترك (scoring, auth, export)
├── src/server/      # خدمات الخادم والصلاحيات
├── docs/            # صور العرض
└── docker-compose.yml
```

---

**DTAP** — Digital Transformation Assessment Platform  
منصة تقييم التحول الرقمي
