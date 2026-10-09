import { apiFetch } from "./client";
import type { AuthResponse, User } from "@/types";

export const authApi = {
  login: (payload: { email: string; password: string }) =>
    apiFetch<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(payload) }),

  register: (payload: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    organizationSlug: string;
  }) => apiFetch<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(payload) }),

  refresh: (refreshToken: string) =>
    apiFetch<{ accessToken: string; refreshToken: string }>("/auth/refresh-token", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }),

  me: (token: string) => apiFetch<User>("/auth/me", { token }),
};
