import { apiFetch } from "./client";
import type { CourierAssignment, CourierEarning } from "@/types";

export const couriersApi = {
  myAssignments: (token: string) =>
    apiFetch<CourierAssignment[]>("/couriers/me/assignments", { token }),

  myEarnings: (token: string) =>
    apiFetch<{
      earnings: CourierEarning[];
      summary: { status: string; _sum: { amount: number | null } }[];
    }>("/couriers/me/earnings", { token }),

  setAvailability: (token: string, payload: { isAvailable: boolean; currentZoneId?: string }) =>
    apiFetch<{ id: string; isAvailable: boolean }>("/couriers/me/availability", {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    }),

  acceptAssignment: (token: string, assignmentId: string) =>
    apiFetch<CourierAssignment>(`/couriers/assignments/${assignmentId}/accept`, { method: "POST", token }),

  completePickup: (token: string, assignmentId: string) =>
    apiFetch<unknown>(`/couriers/assignments/${assignmentId}/complete-pickup`, { method: "POST", token }),

  completeDelivery: (token: string, assignmentId: string, codCollected: boolean) =>
    apiFetch<unknown>(`/couriers/assignments/${assignmentId}/complete-delivery`, {
      method: "POST",
      token,
      body: JSON.stringify({ codCollected }),
    }),

  failLeg: (token: string, assignmentId: string, reason: string) =>
    apiFetch<unknown>(`/couriers/assignments/${assignmentId}/fail`, {
      method: "POST",
      token,
      body: JSON.stringify({ reason }),
    }),
};
