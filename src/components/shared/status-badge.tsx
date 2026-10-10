import { Badge } from "@/components/ui/badge";
import { SHIPMENT_STATUS_LABEL, SHIPMENT_STATUS_VARIANT } from "@/lib/constants";

export function StatusBadge({ status }: { status: string }) {
  const variant = SHIPMENT_STATUS_VARIANT[status] ?? "secondary";
  const label = SHIPMENT_STATUS_LABEL[status] ?? status;
  return <Badge variant={variant}>{label}</Badge>;
}
