import Link from "next/link";
import type { Metadata } from "next";
import { XCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Payment Cancelled" };

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <XCircleIcon className="size-12 text-muted-foreground" />
          <div>
            <h1 className="text-xl font-semibold">Payment cancelled</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              You backed out of checkout before completing payment. Your shipment was still created
              and is saved as pending payment — you can retry whenever you&apos;re ready.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/payments">Retry Payment</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
