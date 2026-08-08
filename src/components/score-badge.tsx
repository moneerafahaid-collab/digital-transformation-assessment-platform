import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS, statusColor } from "@/lib/utils";
import type { AssessmentStatus } from "@prisma/client";

export function ScoreBadge({ score, status }: { score: number; status?: AssessmentStatus }) {
  const color = statusColor(score);
  const variant = color === "green" ? "success" : color === "yellow" ? "warning" : "danger";

  return (
    <Badge variant={variant}>
      {status ? `${STATUS_LABELS[status]} · ` : ""}
      {Math.round(score)}%
    </Badge>
  );
}

export function StatusDot({ score }: { score: number }) {
  const color = statusColor(score);
  const className =
    color === "green" ? "bg-emerald-500" : color === "yellow" ? "bg-amber-500" : "bg-rose-500";
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${className}`} />;
}
