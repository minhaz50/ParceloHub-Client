import { apiFetch } from "./client";
import type { Hub, Zone } from "@/types";

export const zonesApi = {
  list: (token: string) => apiFetch<Zone[]>("/zones", { token }),
};

export const hubsApi = {
  list: (token: string) => apiFetch<Hub[]>("/hubs", { token }),
  getById: (token: string, id: string) => apiFetch<Hub>(`/hubs/${id}`, { token }),
};
