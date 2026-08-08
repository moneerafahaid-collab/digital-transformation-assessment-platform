import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { AssessmentStatus } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const STATUS_SCORE: Record<AssessmentStatus, number> = {
  NOT_APPLIED: 0,
  IN_PROGRESS: 50,
  COMPLETED: 100,
};

export const STATUS_LABELS: Record<AssessmentStatus, string> = {
  NOT_APPLIED: "غير مطبق",
  IN_PROGRESS: "قيد التنفيذ",
  COMPLETED: "مكتمل",
};

export function statusColor(score: number): "green" | "yellow" | "red" {
  if (score >= 100) return "green";
  if (score >= 50) return "yellow";
  return "red";
}

export function scoreFromStatus(status: AssessmentStatus): number {
  return STATUS_SCORE[status];
}

export function average(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function roundScore(value: number): number {
  return Math.round(value * 100) / 100;
}
