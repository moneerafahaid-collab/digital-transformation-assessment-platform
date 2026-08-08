import { prisma } from "@/lib/prisma";
import { UsersManager } from "@/components/users-manager";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">إدارة المستخدمين</h2>
        <p className="text-muted-foreground">إنشاء المستخدمين وتعيين الأدوار</p>
      </div>
      <UsersManager initial={users} />
    </div>
  );
}
