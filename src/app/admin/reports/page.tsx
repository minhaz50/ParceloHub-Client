"use client";

import { useQuery } from "@tanstack/react-query";
import { ScrollTextIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { useAuth } from "@/hooks/use-auth";
import { useUrlPagination } from "@/hooks/use-pagination";
import { adminApi } from "@/lib/api/admin";
import { SHIPMENT_STATUS_LABEL } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { AuditLogEntry } from "@/types";

export default function AuditLogsPage() {
  const { accessToken } = useAuth();
  const { page, limit, setPage } = useUrlPagination({ limit: 15 });

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "audit-logs", { page, limit }],
    queryFn: () => adminApi.auditLogs(accessToken as string, { page, limit }),
    enabled: !!accessToken,
  });

  const columns: DataTableColumn<AuditLogEntry>[] = [
    { key: "tracking", header: "Shipment", render: (e) => e.shipment.trackingId },
    {
      key: "status",
      header: "Event",
      render: (e) => <Badge variant="outline">{SHIPMENT_STATUS_LABEL[e.status] ?? e.status}</Badge>,
    },
    { key: "note", header: "Note", render: (e) => e.note ?? "—" },
    { key: "actor", header: "By", render: (e) => (e.actor ? `${e.actor.name} (${e.actor.role})` : "System") },
    { key: "when", header: "When", render: (e) => formatDate(e.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Every shipment status transition, with who triggered it and when."
      />

      <div className="rounded-lg border bg-secondary/30 p-3 text-xs text-muted-foreground">
        This covers shipment lifecycle events specifically — not a full system-wide audit of every
        entity change (e.g. pricing rule edits, hub updates).
      </div>

      <DataTable
        columns={columns}
        rows={data?.data}
        isLoading={isLoading}
        emptyIcon={ScrollTextIcon}
        emptyTitle="No events yet"
        emptyDescription="Shipment status changes will appear here as they happen."
      />

      <PaginationControls meta={data?.meta} onPageChange={setPage} />
    </div>
  );
}
