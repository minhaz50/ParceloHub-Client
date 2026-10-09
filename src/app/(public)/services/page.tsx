import type { Metadata } from "next";
import { CheckIcon, ClockIcon, RotateCcwIcon, TruckIcon, ZapIcon } from "lucide-react";
import { BookShipmentButton } from "@/components/shared/auth-aware";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Services",
  description: "Standard, Express, and Same-Day delivery service levels, plus hub transfers and return handling.",
};

const SERVICE_LEVELS = [
  {
    icon: TruckIcon,
    name: "Standard",
    tagline: "Everyday deliveries, hub-routed",
    features: ["Zone-to-zone hub routing", "Full tracking timeline", "COD or online payment"],
  },
  {
    icon: ZapIcon,
    name: "Express",
    tagline: "Priority handling across the network",
    features: ["Priority courier assignment", "Faster hub transfer manifests", "Full tracking timeline"],
    highlight: true,
  },
  {
    icon: ClockIcon,
    name: "Same-Day",
    tagline: "For urgent, time-sensitive parcels",
    features: ["Fastest courier matching", "Ideal for intra-zone delivery", "Full tracking timeline"],
  },
];

const CAPABILITIES = [
  {
    icon: TruckIcon,
    title: "Pickup & Delivery",
    description: "A courier is matched automatically to collect from the sender and hand off at the destination.",
  },
  {
    icon: ClockIcon,
    title: "Hub-to-Hub Transfer",
    description: "Parcels consolidate into manifests and move between hubs on scheduled routes.",
  },
  {
    icon: RotateCcwIcon,
    title: "Return to Sender",
    description: "A failed delivery automatically opens a structured return workflow back to the origin.",
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Services</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Three service levels, each priced by zone-pair and weight, with the same end-to-end tracking.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {SERVICE_LEVELS.map((level) => (
          <Card key={level.name} className={level.highlight ? "border-brand shadow-md" : ""}>
            <CardHeader>
              {level.highlight && <Badge variant="brand" className="mb-2 w-fit">Most popular</Badge>}
              <div className="flex size-10 items-center justify-center rounded-lg bg-brand/10">
                <level.icon className="size-5 text-brand" />
              </div>
              <CardTitle className="mt-3">{level.name}</CardTitle>
              <CardDescription>{level.tagline}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {level.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckIcon className="size-4 shrink-0 text-success" />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-20">
        <h2 className="text-center text-2xl font-semibold tracking-tight">How a parcel moves</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {CAPABILITIES.map((cap) => (
            <div key={cap.title} className="rounded-lg border p-6">
              <div className="flex size-10 items-center justify-center rounded-lg bg-secondary">
                <cap.icon className="size-5" />
              </div>
              <h3 className="mt-3 font-semibold">{cap.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{cap.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 text-center">
        <BookShipmentButton size="lg" loggedInLabel="Book a Shipment">
          Book Your First Shipment
        </BookShipmentButton>
      </div>
    </div>
  );
}
