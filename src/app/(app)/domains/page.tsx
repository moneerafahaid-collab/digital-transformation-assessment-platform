import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DomainsManager } from "@/components/domains-manager";

export const dynamic = "force-dynamic";

export default async function DomainsPage() {
  const session = await auth();
  const [domains, perspectives] = await Promise.all([
    prisma.domain.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        perspective: { include: { department: true } },
        _count: { select: { items: true } },
      },
    }),
    prisma.perspective.findMany({
      orderBy: { sortOrder: "asc" },
      include: { department: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">المحاور</h2>
        <p className="text-muted-foreground">إدارة محاور التقييم وربطها بالمناظير</p>
      </div>
      <DomainsManager
        initial={domains}
        perspectives={perspectives}
        canManage={session?.user.role === "ADMIN"}
      />
    </div>
  );
}
