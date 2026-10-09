import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRightIcon,
  ClockIcon,
  MapPinIcon,
  PackageIcon,
  ShieldCheckIcon,
  TruckIcon,
  WarehouseIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookShipmentButton } from "@/components/shared/auth-aware";

export const metadata: Metadata = {
  title: "Home",
  description:
    "SwiftLine moves parcels between customers, couriers, and hubs with live tracking, transparent pricing, and real payment processing.",
};

const FEATURES = [
  {
    icon: MapPinIcon,
    title: "Live Parcel Tracking",
    description:
      "Every shipment has a full status timeline — from pickup scheduling through hub transfers to final delivery — visible to the customer in real time.",
  },
  {
    icon: TruckIcon,
    title: "Smart Courier Assignment",
    description:
      "Couriers are matched to pickups and deliveries automatically based on zone and current workload, so parcels move without manual dispatching.",
  },
  {
    icon: WarehouseIcon,
    title: "Hub-to-Hub Transfers",
    description:
      "Parcels move between hubs in batched manifests, mirroring how real logistics networks consolidate shipments onto a single route.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Secure Payments",
    description:
      "Card and mobile banking payments are processed through Stripe's secure checkout, with cash-on-delivery available for local drop-offs.",
  },
  {
    icon: ClockIcon,
    title: "Transparent Pricing",
    description:
      "Pricing is calculated per zone-pair and weight bracket before you book — no surprise charges once your parcel is already moving.",
  },
  {
    icon: PackageIcon,
    title: "Return Handling",
    description:
      "Failed deliveries automatically route into a structured return-to-sender workflow instead of leaving a parcel in limbo.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-secondary/50 to-background">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              Now processing live payments in test mode
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Courier logistics that actually tracks every step
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              From pickup scheduling to hub transfers to final delivery, SwiftLine coordinates
              customers, couriers, and hub staff on one platform — with a status for every parcel,
              every time.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <BookShipmentButton size="lg">
                Book a Shipment <ArrowRightIcon className="ml-1" />
              </BookShipmentButton>
              <Button asChild size="lg" variant="outline">
                <Link href="/track/CRX-00000000">Track a Parcel</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Built for real logistics operations</h2>
          <p className="mt-3 text-muted-foreground">
            Every feature below is backed by a real workflow on the platform — not a mockup.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <div className="flex size-10 items-center justify-center rounded-lg bg-brand/10">
                  <feature.icon className="size-5 text-brand" />
                </div>
                <CardTitle className="mt-3">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 text-center sm:grid-cols-3">
            <div>
              <p className="text-4xl font-bold tracking-tight">15+</p>
              <p className="mt-1 text-sm text-muted-foreground">Shipment states tracked</p>
            </div>
            <div>
              <p className="text-4xl font-bold tracking-tight">2</p>
              <p className="mt-1 text-sm text-muted-foreground">Active hub zones</p>
            </div>
            <div>
              <p className="text-4xl font-bold tracking-tight">3</p>
              <p className="mt-1 text-sm text-muted-foreground">Service levels: Standard, Express, Same-Day</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight">Ready to ship something?</h2>
        <p className="mt-3 text-muted-foreground">
          Create an account and book your first shipment in under two minutes.
        </p>
        <div className="mt-6">
          <BookShipmentButton
            size="lg"
            loggedInLabel={
              <>
                Book a Shipment <ArrowRightIcon className="ml-1" />
              </>
            }
          >
            Get Started <ArrowRightIcon className="ml-1" />
          </BookShipmentButton>
        </div>
      </section>
    </div>
  );
}
