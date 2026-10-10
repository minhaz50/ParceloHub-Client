import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ShipmentWizard } from "@/components/shipment/shipment-wizard";

export const metadata: Metadata = { title: "New Shipment" };

export default function NewShipmentPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Book a Shipment" description="Four quick steps — sender, receiver, parcel, and payment." />
      <ShipmentWizard />
    </div>
  );
}
