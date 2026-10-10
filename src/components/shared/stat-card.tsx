import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  className,
  trend,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  className?: string;
  trend?: string;
}) {
  return (
    <Card className={cn(className)}>
      <CardContent className="flex items-start justify-between gap-4 py-2">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="text-2xl font-semibold tracking-tight">{value}</span>
          {trend && <span className="text-xs text-muted-foreground">{trend}</span>}
        </div>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
          <Icon className="size-5 text-secondary-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}
