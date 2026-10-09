import { apiFetch, apiFetchPaginated } from "./client";
import type { PaginationMeta, PricingQuote, Shipment } from "@/types";

export interface CreateShipmentPayload {
  senderAddress: {
    line1: string;
    city: string;
    zoneId: string;
    contactName: string;
    contactPhone: string;
  };
  receiverAddress: {
    line1: string;
    city: string;
    zoneId: string;
    contactName: string;
    contactPhone: string;
  };
  weightKg: number;
  declaredValue?: number;
  codAmount?: number;
  serviceLevel: "STANDARD" | "EXPRESS" | "SAME_DAY";
  description?: string;
  paymentMethod: "COD" | "CARD" | "MOBILE_BANKING";
}

export interface CreateShipmentResult {
  shipment: Shipment;
  payment: { id: string; status: string };
  redirectUrl?: string;
  quote: PricingQuote;
}

export const shipmentsApi = {
  list: (token: string, params: { page: number; limit: number; status?: string }) =>
    apiFetchPaginated<Shipment[]>("/shipments", { token, query: params }) as Promise<{
      data: Shipment[];
      meta: PaginationMeta;
    }>,

  search: (token: string, params: { q: string; page: number; limit: number }) =>
    apiFetchPaginated<Shipment[]>("/shipments/search", { token, query: params }) as Promise<{
      data: Shipment[];
      meta: PaginationMeta;
    }>,

  getById: (token: string, id: string) => apiFetch<Shipment>(`/shipments/${id}`, { token }),

  track: (trackingId: string) =>
    apiFetch<{
      trackingId: string;
      status: string;
      serviceLevel: string;
      createdAt: string;
      deliveredAt: string | null;
      originHub: { name: string; address: string } | null;
      destinationHub: { name: string; address: string } | null;
      currentHub: { name: string } | null;
      events: { status: string; note: string | null; location: string | null; createdAt: string }[];
    }>(`/shipments/track/${trackingId}`),

  create: (token: string, payload: CreateShipmentPayload) =>
    apiFetch<CreateShipmentResult>("/shipments", { method: "POST", token, body: JSON.stringify(payload) }),

  schedulePickup: (token: string, id: string) =>
    apiFetch<Shipment>(`/shipments/${id}/schedule-pickup`, { method: "PATCH", token, body: JSON.stringify({}) }),

  cancel: (token: string, id: string, reason?: string) =>
    apiFetch<Shipment>(`/shipments/${id}/cancel`, {
      method: "PATCH",
      token,
      body: JSON.stringify({ reason }),
    }),

  update: (
    token: string,
    id: string,
    payload: { description?: string; declaredValue?: number; codAmount?: number },
  ) => apiFetch<Shipment>(`/shipments/${id}`, { method: "PATCH", token, body: JSON.stringify(payload) }),

  remove: (token: string, id: string) => apiFetch<Shipment>(`/shipments/${id}`, { method: "DELETE", token }),
};
