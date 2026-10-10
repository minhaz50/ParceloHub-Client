"use client";

 
import { useQuery } from "@tanstack/react-query";
import { PackageSearchIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { TrackingTimeline } from "@/components/shipment/tracking-timeline";
import { shipmentsApi } from "@/lib/api/shipments";
import { formatDateShort } from "@/lib/utils";

export function TrackContent({ trackingId }: { trackingId: string }) {
  // trackingId passed as a plain prop from the server page wrapper

  const { data: shipment, isLoading, isError } = useQuery({
    queryKey: ["track", trackingId],
    queryFn: () => shipmentsApi.track(trackingId),
    retry: false,
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Track Your Parcel</h1>
        <p className="mt-2 text-muted-foreground">Tracking ID: {trackingId}</p>
      </div>

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      )}

      {isError && !isLoading && (
        <EmptyState
          icon={PackageSearchIcon}
          title="No shipment found"
          description="Double-check the tracking ID — it should look like CRX-XXXXXXXX."
        />
      )}

      {shipment && (
        <div className="space-y-6">
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
              <StatusBadge status={shipment.status} />
              <p className="text-sm text-muted-foreground">
                {shipment.serviceLevel} service · Booked {formatDateShort(shipment.createdAt)}
              </p>
              {shipment.currentHub && (
                <p className="text-sm">Currently at: <span className="font-medium">{shipment.currentHub.name}</span></p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Tracking Timeline</CardTitle></CardHeader>
            <CardContent>
              <TrackingTimeline events={shipment.events} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
