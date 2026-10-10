"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PackageIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { SearchInput } from "@/components/shared/search-input";
import { StatusBadge } from "@/components/shared/status-badge";
import { useAuth } from "@/hooks/use-auth";
import { useUrlPagination } from "@/hooks/use-pagination";
import { shipmentsApi } from "@/lib/api/shipments";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { SHIPMENT_STATUS_LABEL } from "@/lib/constants";
import type { Shipment } from "@/types";

// Client Component: this page needs live filter/pagination state synced
// to the URL (useSearchParams) and an authenticated, cached data fetch
// (TanStack Query) — both are inherently interactive, so Server
// Components aren't an option here.
export default function MyShipmentsPage() {
  const { accessToken } = useAuth();
  const { page, limit, status, q, setPage, setStatus, setQuery } = useUrlPagination();

  const listQuery = useQuery({
    queryKey: ["shipments", "mine", { page, limit, status, q }],
    queryFn: () =>
      q
        ? shipmentsApi.search(accessToken as string, { q, page, limit })
        : shipmentsApi.list(accessToken as string, { page, limit, status }),
    enabled: !!accessToken,
  });

  const columns: DataTableColumn<Shipment>[] = [
    {
      key: "trackingId",
      header: "Tracking ID",
      render: (s) => (
        <Link href={`/dashboard/${s.id}`} className="font-medium underline-offset-2 hover:underline">
          {s.trackingId}
        </Link>
      ),
    },
    {
      key: "route",
      header: "Route",
      render: (s) => (
        <span className="text-muted-foreground">
          {s.senderAddress?.city ?? "—"} → {s.receiverAddress?.city ?? "—"}
        </span>
      ),
    },
    { key: "status", header: "Status", render: (s) => <StatusBadge status={s.status} /> },
    { key: "price", header: "Price", render: (s) => formatCurrency(s.price) },
    { key: "created", header: "Created", render: (s) => formatDateShort(s.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Shipments"
        description="Every parcel you've booked, with live status."
        actions={
          <Button asChild>
            <Link href="/dashboard/new">
              <PlusIcon /> New Shipment
            </Link>
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput placeholder="Search by tracking ID or contact..." defaultValue={q} onSearch={setQuery} />
        <Select value={status ?? "ALL"} onValueChange={(v) => setStatus(v === "ALL" ? undefined : v)}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            {Object.entries(SHIPMENT_STATUS_LABEL).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        rows={listQuery.data?.data}
        isLoading={listQuery.isLoading}
        emptyIcon={PackageIcon}
        emptyTitle="No shipments found"
        emptyDescription={
          q || status ? "Try adjusting your search or filter." : "Book your first shipment to see it here."
        }
      />

      <PaginationControls meta={listQuery.data?.meta} onPageChange={setPage} />
    </div>
  );
}
