"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ClipboardListIcon, Loader2Icon, PackageCheckIcon, XCircleIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { useAuth } from "@/hooks/use-auth";
import { couriersApi } from "@/lib/api/couriers";
import { ApiRequestError } from "@/lib/api/client";
import { formatDate } from "@/lib/utils";
import type { CourierAssignment } from "@/types";

export default function ProviderTasksPage() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const [failTarget, setFailTarget] = useState<CourierAssignment | null>(null);
  const [failReason, setFailReason] = useState("");
  const [codCollected, setCodCollected] = useState(false);

  const { data: assignments, isLoading } = useQuery({
    queryKey: ["couriers", "me", "assignments"],
    queryFn: () => couriersApi.myAssignments(accessToken as string),
    enabled: !!accessToken,
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["couriers", "me", "assignments"] });
  }

  const acceptMutation = useMutation({
    mutationFn: (id: string) => couriersApi.acceptAssignment(accessToken as string, id),
    onSuccess: () => { toast.success("Assignment accepted."); invalidate(); },
    onError: (e) => toast.error(e instanceof ApiRequestError ? e.message : "Failed to accept."),
  });

  const pickupMutation = useMutation({
    mutationFn: (id: string) => couriersApi.completePickup(accessToken as string, id),
    onSuccess: () => { toast.success("Pickup marked complete."); invalidate(); },
    onError: (e) => toast.error(e instanceof ApiRequestError ? e.message : "Failed to complete pickup."),
  });

  const deliveryMutation = useMutation({
    mutationFn: ({ id, cod }: { id: string; cod: boolean }) =>
      couriersApi.completeDelivery(accessToken as string, id, cod),
    onSuccess: () => { toast.success("Delivery completed!"); invalidate(); },
    onError: (e) => toast.error(e instanceof ApiRequestError ? e.message : "Failed to complete delivery."),
  });

  const failMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      couriersApi.failLeg(accessToken as string, id, reason),
    onSuccess: () => {
      toast.success("Leg marked as failed.");
      setFailTarget(null);
      setFailReason("");
      invalidate();
    },
    onError: (e) => toast.error(e instanceof ApiRequestError ? e.message : "Failed to report issue."),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="My Tasks" description="Pickups and deliveries assigned to you." />

      {!assignments || assignments.length === 0 ? (
        <EmptyState
          icon={ClipboardListIcon}
          title="No assignments yet"
          description="New pickup or delivery tasks will show up here as ops assigns them to you."
        />
      ) : (
        <div className="space-y-3">
          {assignments.map((a) => (
            <Card key={a.id}>
              <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{a.shipment?.trackingId ?? a.shipmentId}</span>
                    <Badge variant="outline">{a.legType}</Badge>
                    <Badge variant={a.status === "COMPLETED" ? "success" : a.status === "FAILED" ? "destructive" : "secondary"}>
                      {a.status}
                    </Badge>
                  </div>
                  {a.shipment && <StatusBadge status={a.shipment.status} />}
                  <p className="text-xs text-muted-foreground">Assigned {formatDate(a.assignedAt)}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {a.status === "ASSIGNED" && (
                    <Button size="sm" onClick={() => acceptMutation.mutate(a.id)} disabled={acceptMutation.isPending}>
                      {acceptMutation.isPending && <Loader2Icon className="animate-spin" />}
                      Accept
                    </Button>
                  )}
                  {a.status === "ACCEPTED" && a.legType === "PICKUP" && (
                    <Button size="sm" onClick={() => pickupMutation.mutate(a.id)} disabled={pickupMutation.isPending}>
                      <PackageCheckIcon /> Mark Picked Up
                    </Button>
                  )}
                  {a.status === "ACCEPTED" && a.legType === "DELIVERY" && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <PackageCheckIcon /> Mark Delivered
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm delivery</DialogTitle>
                          <DialogDescription>Confirm the parcel was handed to the receiver.</DialogDescription>
                        </DialogHeader>
                        {a.shipment && a.shipment.codAmount > 0 && (
                          <div className="flex items-center gap-2">
                            <Checkbox id={`cod-${a.id}`} checked={codCollected} onCheckedChange={(v) => setCodCollected(!!v)} />
                            <Label htmlFor={`cod-${a.id}`}>Collected cash on delivery</Label>
                          </div>
                        )}
                        <DialogFooter>
                          <Button
                            onClick={() => deliveryMutation.mutate({ id: a.id, cod: codCollected })}
                            disabled={deliveryMutation.isPending}
                          >
                            {deliveryMutation.isPending && <Loader2Icon className="animate-spin" />}
                            Confirm Delivery
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                  {(a.status === "ASSIGNED" || a.status === "ACCEPTED") && (
                    <Dialog open={failTarget?.id === a.id} onOpenChange={(open) => !open && setFailTarget(null)}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => setFailTarget(a)}>
                          <XCircleIcon /> Report Issue
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Report a failed {a.legType.toLowerCase()}</DialogTitle>
                          <DialogDescription>Explain what happened so ops can reassign or follow up.</DialogDescription>
                        </DialogHeader>
                        <Textarea
                          placeholder="e.g. Receiver not available at address"
                          value={failReason}
                          onChange={(e) => setFailReason(e.target.value)}
                        />
                        <DialogFooter>
                          <Button
                            variant="destructive"
                            disabled={failReason.length < 3 || failMutation.isPending}
                            onClick={() => failMutation.mutate({ id: a.id, reason: failReason })}
                          >
                            {failMutation.isPending && <Loader2Icon className="animate-spin" />}
                            Submit
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
