import { apiFetch } from "./client";
import type { User } from "@/types";

export const usersApi = {
  me: (token: string) => apiFetch<User>("/users/me", { token }),

  updateProfile: (token: string, payload: { name?: string; phone?: string }) =>
    apiFetch<User>("/users/me", { method: "PATCH", token, body: JSON.stringify(payload) }),

  changePassword: (token: string, payload: { currentPassword: string; newPassword: string }) =>
    apiFetch<{ message: string }>("/users/me/change-password", {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    }),
};
