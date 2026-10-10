"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2Icon, Loader2Icon, XCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { paymentsApi } from "@/lib/api/payments";
import { formatCurrency } from "@/lib/utils";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const { accessToken, isHydrated } = useAuth();

  const { data: payment, isLoading } = useQuery({
    queryKey: ["payments", paymentId],
    queryFn: () =>
      paymentsApi.getById(accessToken as string, paymentId as string),
    enabled: isHydrated && !!accessToken && !!paymentId,
    refetchInterval: (query) =>
      query.state.data?.status === "PENDING" ? 2000 : false,
  });

  if (!paymentId) {
    return (
      <StatusCard
        icon={XCircleIcon}
        iconClass="text-destructive"
        title="Missing payment reference"
        description="This page expects a payment_id in the URL — it looks like you navigated here directly rather than via checkout."
      />
    );
  }

  if (!isHydrated || isLoading) {
    return (
      <StatusCard
        icon={Loader2Icon}
        iconClass="animate-spin text-muted-foreground"
        title="Confirming your payment..."
        description="This usually takes a couple of seconds."
      />
    );
  }

  if (payment?.status === "PAID") {
    return (
      <StatusCard
        icon={CheckCircle2Icon}
        iconClass="text-success"
        title="Payment successful!"
        description={`${formatCurrency(payment.amount)} has been confirmed via ${payment.provider ?? "your payment method"}.`}
        action={
          payment.shipment ? (
            <Button asChild>
              <Link href={`/dashboard/${payment.shipment.id}`}>
                View Shipment
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          )
        }
      />
    );
  }

  return (
    <StatusCard
      icon={Loader2Icon}
      iconClass="animate-spin text-muted-foreground"
      title="Still confirming..."
      description="Stripe hasn't notified us yet — this page will update automatically once it does. You can also check Payment History in your dashboard."
      action={
        <Button asChild variant="outline">
          <Link href="/dashboard/payments">Payment History</Link>
        </Button>
      }
    />
  );
}

function StatusCard({
  icon: Icon,
  iconClass,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  iconClass?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <Icon className={`size-12 ${iconClass ?? ""}`} />
          <div>
            <h1 className="text-xl font-semibold">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </div>
          {action}
        </CardContent>
      </Card>
    </div>
  );
}

export function PaymentSuccessContentWrapper() {
  return (
    <Suspense>
      <PaymentSuccessContent />
    </Suspense>
  );
}
