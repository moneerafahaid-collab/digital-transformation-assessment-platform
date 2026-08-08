# Digital Transformation Assessment Platform (DTAP)

منصة ويب احترافية لإدارة وتقييم جاهزية إدارات وكالة التحول الرقمي.

## التقنيات

- Next.js 15 + TypeScript + Tailwind CSS
- Auth.js (Credentials) مع أدوار Admin / Assessor / Viewer
- Prisma ORM + PostgreSQL
- Recharts + ExcelJS + jsPDF

## التشغيل السريع

### خيار أ) Docker Compose

```bash
docker compose up -d
cp .env.example .env
npm install
npm run db:setup
npm run dev
```

### خيار ب) PostgreSQL محلي (Windows)

```bash
npm run db:start
npm install
npm run db:setup
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000)

## حسابات تجريبية

| الدور | البريد | كلمة المرور |
|------|--------|-------------|
| Admin | admin@dtap.local | Admin@123 |
| Assessor | assessor@dtap.local | Assessor@123 |
| Viewer | viewer@dtap.local | Viewer@123 |

## هيكل التقييم

```
الإدارة → المنظور → المحور → عناصر التقييم
```

حالات العنصر:

- غير مطبق = 0%
- قيد التنفيذ = 50%
- مكتمل = 100%

النسب تُحسب تلقائياً من الأسفل إلى الأعلى. إذا اكتملت كل مناظير الإدارة تظهر الحالة: **مكتمل بالكامل**.

## الصفحات

- `/dashboard` لوحة المؤشرات
- `/departments` الإدارات
- `/perspectives` المناظير
- `/domains` المحاور
- `/assessment` إدخال التقييم (حفظ تلقائي)
- `/reports` التقارير
- `/export` مركز التصدير (PDF / Excel / CSV)
- `/admin/users` و `/admin/audit` (Admin فقط)

## أوامر مفيدة

```bash
npm run db:migrate
npm run db:seed
npm run build
npm run start
```
