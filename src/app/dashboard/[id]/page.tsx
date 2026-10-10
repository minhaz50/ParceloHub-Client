"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2Icon, PackageIcon, XCircleIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { TrackingTimeline } from "@/components/shipment/tracking-timeline";
import { useAuth } from "@/hooks/use-auth";
import { shipmentsApi } from "@/lib/api/shipments";
import { ApiRequestError } from "@/lib/api/client";
import { formatCurrency, formatDate } from "@/lib/utils";

const CANCELLABLE = ["CREATED", "PICKUP_SCHEDULED", "COURIER_ASSIGNED", "PICKUP_FAILED"];

export default function ShipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { accessToken } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [cancelReason, setCancelReason] = useState("");
  const [cancelOpen, setCancelOpen] = useState(false);

  const { data: shipment, isLoading } = useQuery({
    queryKey: ["shipments", id],
    queryFn: () => shipmentsApi.getById(accessToken as string, id),
    enabled: !!accessToken,
  });

  const scheduleMutation = useMutation({
    mutationFn: () => shipmentsApi.schedulePickup(accessToken as string, id),
    onSuccess: () => {
      toast.success("Pickup scheduled!");
      queryClient.invalidateQueries({ queryKey: ["shipments", id] });
    },
    onError: (err) => toast.error(err instanceof ApiRequestError ? err.message : "Failed to schedule pickup."),
  });

  const cancelMutation = useMutation({
    mutationFn: () => shipmentsApi.cancel(accessToken as string, id, cancelReason || undefined),
    onSuccess: () => {
      toast.success("Shipment cancelled.");
      setCancelOpen(false);
      queryClient.invalidateQueries({ queryKey: ["shipments", id] });
      queryClient.invalidateQueries({ queryKey: ["shipments", "mine"] });
    },
    onError: (err) => toast.error(err instanceof ApiRequestError ? err.message : "Failed to cancel shipment."),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <PackageIcon className="size-8 text-muted-foreground" />
        <p className="font-medium">Shipment not found</p>
        <Button size="sm" onClick={() => router.push("/dashboard")}>
          Back to shipments
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={shipment.trackingId}
        description={`Created ${formatDate(shipment.createdAt)}`}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={shipment.status} />
            {shipment.status === "CREATED" && (
              <Button size="sm" onClick={() => scheduleMutation.mutate()} disabled={scheduleMutation.isPending}>
                {scheduleMutation.isPending && <Loader2Icon className="animate-spin" />}
                Schedule Pickup
              </Button>
            )}
            {CANCELLABLE.includes(shipment.status) && (
              <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <XCircleIcon /> Cancel
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancel this shipment?</DialogTitle>
                    <DialogDescription>This can&apos;t be undone once confirmed.</DialogDescription>
                  </DialogHeader>
                  <Textarea
                    placeholder="Reason (optional)"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                  />
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCancelOpen(false)}>
                      Keep shipment
                    </Button>
                    <Button variant="destructive" onClick={() => cancelMutation.mutate()} disabled={cancelMutation.isPending}>
                      {cancelMutation.isPending && <Loader2Icon className="animate-spin" />}
                      Confirm cancellation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Tracking Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <TrackingTimeline events={shipment.events ?? []} />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="From" value={`${shipment.senderAddress?.line1}, ${shipment.senderAddress?.city}`} />
              <Row label="To" value={`${shipment.receiverAddress?.line1}, ${shipment.receiverAddress?.city}`} />
              <Row label="Weight" value={`${shipment.weightKg} kg`} />
              <Row label="Service" value={shipment.serviceLevel} />
              <Row label="Price" value={formatCurrency(shipment.price)} />
              {shipment.codAmount > 0 && <Row label="COD Amount" value={formatCurrency(shipment.codAmount)} />}
            </CardContent>
          </Card>

          {shipment.payment && (
            <Card>
              <CardHeader><CardTitle className="text-base">Payment</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <Row label="Method" value={shipment.payment.method} />
                <Row
                  label="Status"
                  value={
                    <span className={shipment.payment.status === "PAID" ? "font-medium text-success" : ""}>
                      {shipment.payment.status}
                    </span>
                  }
                />
                {shipment.payment.paidAt && <Row label="Paid at" value={formatDate(shipment.payment.paidAt)} />}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
