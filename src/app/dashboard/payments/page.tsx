"use client";

import Link from "next/link";
import { useQueries, useQuery } from "@tanstack/react-query";
import { CreditCardIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { useAuth } from "@/hooks/use-auth";
import { useUrlPagination } from "@/hooks/use-pagination";
import { shipmentsApi } from "@/lib/api/shipments";
import { paymentsApi } from "@/lib/api/payments";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Payment } from "@/types";

/**
 * The backend doesn't expose a bulk "list my payments" endpoint — only
 * `GET /payments/:id` for a single record. Rather than fabricate data,
 * this page composes real data: fetch the customer's shipments (which
 * carries each one's paymentId), then fetch each payment individually.
 * Bounded by the page size, so it stays cheap even without a bulk route.
 */
export default function PaymentsPage() {
  const { accessToken } = useAuth();
  const { page, limit, setPage } = useUrlPagination({ limit: 10 });

  const shipmentsQuery = useQuery({
    queryKey: ["shipments", "mine-for-payments", { page, limit }],
    queryFn: () => shipmentsApi.list(accessToken as string, { page, limit }),
    enabled: !!accessToken,
  });

  const paymentIds = (shipmentsQuery.data?.data ?? [])
    .map((s) => s.paymentId)
    .filter((id): id is string => !!id);

  const paymentQueries = useQueries({
    queries: paymentIds.map((id) => ({
      queryKey: ["payments", id],
      queryFn: () => paymentsApi.getById(accessToken as string, id),
      enabled: !!accessToken,
    })),
  });

  const isLoading = shipmentsQuery.isLoading || paymentQueries.some((q) => q.isLoading);
  const payments = paymentQueries.map((q) => q.data).filter((p): p is Payment => !!p);

  const columns: DataTableColumn<Payment>[] = [
    {
      key: "trackingId",
      header: "Shipment",
      render: (p) =>
        p.shipment ? (
          <Link href={`/dashboard/${p.shipment.id}`} className="font-medium underline-offset-2 hover:underline">
            {p.shipment.trackingId}
          </Link>
        ) : (
          "—"
        ),
    },
    { key: "amount", header: "Amount", render: (p) => formatCurrency(p.amount) },
    { key: "method", header: "Method", render: (p) => p.method },
    {
      key: "status",
      header: "Status",
      render: (p) => (
        <Badge variant={p.status === "PAID" ? "success" : p.status === "FAILED" ? "destructive" : "secondary"}>
          {p.status}
        </Badge>
      ),
    },
    { key: "date", header: "Date", render: (p) => formatDate(p.paidAt ?? p.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Payments" description="Payment status for every shipment you've booked." />

      <DataTable
        columns={columns}
        rows={payments}
        isLoading={isLoading}
        emptyIcon={CreditCardIcon}
        emptyTitle="No payments yet"
        emptyDescription="Book a shipment to see its payment here."
      />

      <PaginationControls meta={shipmentsQuery.data?.meta} onPageChange={setPage} />
    </div>
  );
}
