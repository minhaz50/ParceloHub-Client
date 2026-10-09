import type { Metadata } from "next";
import Link from "next/link";
import { CalculatorIcon, MapIcon, PackageIcon, ZapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookShipmentButton, GuestOnly } from "@/components/shared/auth-aware";

export const metadata: Metadata = {
  title: "Pricing",
  description: "How SwiftLine calculates shipment pricing by zone-pair, weight, and service level.",
};

const STEPS = [
  {
    icon: MapIcon,
    title: "1. Zone pair",
    description:
      "Price starts from the origin and destination zone. A route between two hubs in the same tariff lookup gets its own base fee; otherwise your organization's default rate applies.",
  },
  {
    icon: PackageIcon,
    title: "2. Weight bracket",
    description:
      "Every rate includes a base weight allowance (typically the first 1kg). Each kilogram beyond that is charged at a flat per-kg rate on top of the base fee.",
  },
  {
    icon: ZapIcon,
    title: "3. Service level",
    description:
      "Standard, Express, and Same-Day each have their own tariff — faster service levels carry a higher base fee in exchange for priority courier assignment.",
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Pricing</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Every shipment is priced automatically before you confirm it — here&apos;s exactly how.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {STEPS.map((step) => (
          <Card key={step.title}>
            <CardHeader>
              <div className="flex size-10 items-center justify-center rounded-lg bg-brand/10">
                <step.icon className="size-5 text-brand" />
              </div>
              <CardTitle className="mt-3 text-base">{step.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-muted-foreground">{step.description}</CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-12">
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-secondary">
            <CalculatorIcon className="size-6" />
          </div>
          <div>
            <h2 className="font-semibold">Want an exact quote?</h2>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Pricing is calculated live against your organization&apos;s actual tariff table once
              you&apos;re signed in and have picked real pickup/delivery zones — sign in to see the
              precise price before you confirm a shipment.
            </p>
          </div>
          <div className="flex gap-3">
            <BookShipmentButton loggedInLabel="Book a shipment">Create an account</BookShipmentButton>
            <GuestOnly>
              <Button asChild variant="outline">
                <Link href="/login">Sign in</Link>
              </Button>
            </GuestOnly>
          </div>
        </CardContent>
      </Card>

      <div className="mt-12 rounded-lg border bg-secondary/30 p-6 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">A note on fairness</p>
        <p className="mt-1">
          If no specific tariff exists for your exact zone pair and service level, the platform
          falls back to your organization&apos;s default rate, and ultimately to a platform-wide
          default — you&apos;re never left without a price.
        </p>
      </div>
    </div>
  );
}
