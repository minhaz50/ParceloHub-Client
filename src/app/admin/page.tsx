"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ClockIcon, DollarSignIcon, TruckIcon, WarehouseIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { useAuth } from "@/hooks/use-auth";
import { adminApi } from "@/lib/api/admin";
import { formatCurrency } from "@/lib/utils";
import { SHIPMENT_STATUS_LABEL } from "@/lib/constants";

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

export default function AdminOverviewPage() {
  const { accessToken } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "dashboard-stats"],
    queryFn: () => adminApi.dashboardStats(accessToken as string),
    enabled: !!accessToken,
  });

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-56" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  const statusChartData = Object.entries(data.shipmentsByStatus).map(([status, count]) => ({
    status: SHIPMENT_STATUS_LABEL[status] ?? status,
    count,
  }));

  const totalShipments = Object.values(data.shipmentsByStatus).reduce((a, b) => a + (b ?? 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Overview" description="Live metrics across your organization." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={formatCurrency(data.totalRevenue)} icon={DollarSignIcon} />
        <StatCard
          label="Active Couriers"
          value={`${data.couriers.active} / ${data.couriers.total}`}
          icon={TruckIcon}
        />
        <StatCard label="Active Hubs" value={data.activeHubs} icon={WarehouseIcon} />
        <StatCard
          label="Avg Delivery Time"
          value={data.avgDeliveryTimeHours ? `${data.avgDeliveryTimeHours}h` : "—"}
          icon={ClockIcon}
          trend={data.sampledDeliveredCount ? `from ${data.sampledDeliveredCount} deliveries` : undefined}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Shipments by Status</CardTitle></CardHeader>
          <CardContent className="h-80">
            {statusChartData.length === 0 ? (
              <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No shipments yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusChartData} layout="vertical" margin={{ left: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} fontSize={12} />
                  <YAxis type="category" dataKey="status" width={120} fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="count" fill="var(--color-chart-1)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Status Distribution</CardTitle></CardHeader>
          <CardContent className="h-80">
            {totalShipments === 0 ? (
              <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No shipments yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `${entry.name}`}
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={entry.status} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
