import type { Metadata } from "next";
import { TrackContent } from "./track-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ trackingId: string }>;
}): Promise<Metadata> {
  const { trackingId } = await params;
  return {
    title: `Track ${trackingId}`,
    description: `Live tracking status for shipment ${trackingId}.`,
  };
}

export default async function TrackPage({ params }: { params: Promise<{ trackingId: string }> }) {
  const { trackingId } = await params;
  return <TrackContent trackingId={trackingId} />;
}
