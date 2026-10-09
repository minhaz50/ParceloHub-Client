import { apiFetch } from "./client";
import type { Payment } from "@/types";

export const paymentsApi = {
  getById: (token: string, id: string) => apiFetch<Payment>(`/payments/${id}`, { token }),

  initiate: (token: string, payload: { shipmentId: string; method?: "CARD" | "MOBILE_BANKING" }) =>
    apiFetch<{ payment: Payment; redirectUrl?: string }>("/payments/initiate", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }),
};
