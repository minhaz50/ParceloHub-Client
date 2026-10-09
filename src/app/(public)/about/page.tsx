import type { Metadata } from "next";
import { ShieldCheckIcon, UsersIcon, WarehouseIcon, ZapIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About",
  description: "Learn how SwiftLine coordinates customers, couriers, and hubs on one logistics platform.",
};

const VALUES = [
  {
    icon: ZapIcon,
    title: "Built on a real state machine",
    description:
      "Every shipment moves through an explicit, enforced sequence of statuses — no step can be skipped, and no two actions can silently overwrite each other.",
  },
  {
    icon: WarehouseIcon,
    title: "Hub-first architecture",
    description:
      "Parcels consolidate at hubs and travel between them in manifested batches, the same way regional carriers actually route freight.",
  },
  {
    icon: UsersIcon,
    title: "Three roles, one platform",
    description:
      "Customers book and track. Providers accept and complete legs. Admins oversee the whole network — each with permissions enforced at both the API and UI layer.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Payments handled properly",
    description:
      "Online payments run through Stripe's hosted checkout with signature-verified webhooks — never a client-side 'mark as paid' shortcut.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">About SwiftLine</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          SwiftLine is a courier and logistics management platform that coordinates the full
          lifecycle of a parcel — from the moment a customer books a pickup to the moment it&apos;s
          signed for at the destination.
        </p>
        <p className="mt-4 text-muted-foreground">
          Rather than treating &quot;delivery status&quot; as a single free-text field, every
          shipment here moves through a defined set of states — scheduled, assigned, picked up, at
          a hub, in transit, out for delivery, delivered (or, when something goes wrong, failed and
          returned). Each transition is logged, timestamped, and attributed to whoever triggered it,
          so the full history of a parcel is always reconstructable.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {VALUES.map((value) => (
          <Card key={value.title}>
            <CardContent className="flex gap-4 py-2">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand/10">
                <value.icon className="size-5 text-brand" />
              </div>
              <div>
                <h3 className="font-semibold">{value.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{value.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
