"use client";

import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { WalletIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { couriersApi } from "@/lib/api/couriers";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { CourierEarning } from "@/types";

export default function EarningsPage() {
  const { accessToken } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["couriers", "me", "earnings"],
    queryFn: () => couriersApi.myEarnings(accessToken as string),
    enabled: !!accessToken,
  });

  const totalsByStatus = Object.fromEntries(
    (data?.summary ?? []).map((s) => [s.status, s._sum.amount ?? 0]),
  );
  const totalEarned = Object.values(totalsByStatus).reduce((a, b) => a + b, 0);

  const chartData = (data?.summary ?? []).map((s) => ({ status: s.status, amount: s._sum.amount ?? 0 }));

  const columns: DataTableColumn<CourierEarning>[] = [
    { key: "shipment", header: "Shipment", render: (e) => e.shipment?.trackingId ?? e.shipmentId },
    { key: "amount", header: "Amount", render: (e) => formatCurrency(e.amount) },
    {
      key: "status",
      header: "Status",
      render: (e) => (
        <Badge variant={e.status === "PAID" ? "success" : e.status === "REVERSED" ? "destructive" : "secondary"}>
          {e.status}
        </Badge>
      ),
    },
    { key: "date", header: "Date", render: (e) => formatDate(e.createdAt) },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Earnings" description="Your payout history across completed legs." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Earned" value={formatCurrency(totalEarned)} icon={WalletIcon} />
        <StatCard label="Pending" value={formatCurrency(totalsByStatus.PENDING ?? 0)} icon={WalletIcon} />
        <StatCard label="Paid Out" value={formatCurrency(totalsByStatus.PAID ?? 0)} icon={WalletIcon} />
      </div>

      {chartData.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Earnings by Status</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="status" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(value) => formatCurrency(Number(value) || 0)} />
                <Bar dataKey="amount" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">All Earnings</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            rows={data?.earnings}
            emptyIcon={WalletIcon}
            emptyTitle="No earnings yet"
            emptyDescription="Complete a pickup or delivery leg to earn your first payout."
          />
        </CardContent>
      </Card>
    </div>
  );
}
