import type { AssessmentStatus } from "@prisma/client";
import { average, roundScore, STATUS_SCORE } from "@/lib/utils";

export type ScoredItem = {
  id: string;
  titleAr: string;
  titleEn: string;
  code: string | null;
  status: AssessmentStatus;
  score: number;
  notes: string | null;
  updatedAt: Date | null;
};

export type ScoredDomain = {
  id: string;
  nameAr: string;
  nameEn: string;
  score: number;
  items: ScoredItem[];
};

export type ScoredPerspective = {
  id: string;
  nameAr: string;
  nameEn: string;
  score: number;
  isComplete: boolean;
  domains: ScoredDomain[];
};

export type ScoredDepartment = {
  id: string;
  nameAr: string;
  nameEn: string;
  description: string | null;
  score: number;
  isFullyComplete: boolean;
  statusLabel: string;
  perspectives: ScoredPerspective[];
};

type ItemInput = {
  id: string;
  titleAr: string;
  titleEn: string;
  code: string | null;
  result?: {
    status: AssessmentStatus;
    score: number;
    notes: string | null;
    updatedAt: Date;
  } | null;
};

type DomainInput = {
  id: string;
  nameAr: string;
  nameEn: string;
  items: ItemInput[];
};

type PerspectiveInput = {
  id: string;
  nameAr: string;
  nameEn: string;
  domains: DomainInput[];
};

type DepartmentInput = {
  id: string;
  nameAr: string;
  nameEn: string;
  description: string | null;
  perspectives: PerspectiveInput[];
};

export function scoreItem(item: ItemInput): ScoredItem {
  const status = item.result?.status ?? "NOT_APPLIED";
  const score = item.result?.score ?? STATUS_SCORE[status];
  return {
    id: item.id,
    titleAr: item.titleAr,
    titleEn: item.titleEn,
    code: item.code,
    status,
    score,
    notes: item.result?.notes ?? null,
    updatedAt: item.result?.updatedAt ?? null,
  };
}

export function scoreDomain(domain: DomainInput): ScoredDomain {
  const items = domain.items.map(scoreItem);
  return {
    id: domain.id,
    nameAr: domain.nameAr,
    nameEn: domain.nameEn,
    score: roundScore(average(items.map((i) => i.score))),
    items,
  };
}

export function scorePerspective(perspective: PerspectiveInput): ScoredPerspective {
  const domains = perspective.domains.map(scoreDomain);
  const score = roundScore(average(domains.map((d) => d.score)));
  const isComplete = domains.length > 0 && domains.every((d) => d.score === 100);
  return {
    id: perspective.id,
    nameAr: perspective.nameAr,
    nameEn: perspective.nameEn,
    score: isComplete ? 100 : score,
    isComplete,
    domains,
  };
}

export function scoreDepartment(department: DepartmentInput): ScoredDepartment {
  const perspectives = department.perspectives.map(scorePerspective);
  const score = roundScore(average(perspectives.map((p) => p.score)));
  const isFullyComplete =
    perspectives.length > 0 && perspectives.every((p) => p.isComplete || p.score === 100);

  return {
    id: department.id,
    nameAr: department.nameAr,
    nameEn: department.nameEn,
    description: department.description,
    score: isFullyComplete ? 100 : score,
    isFullyComplete,
    statusLabel: isFullyComplete ? "مكتمل بالكامل" : score >= 50 ? "قيد التنفيذ" : "غير مكتمل",
    perspectives,
  };
}
