import { apiFetch, apiFetchPaginated } from "./client";
import type {
  AuditLogEntry,
  CourierLeaderboardEntry,
  DashboardSummary,
  PaginationMeta,
  Role,
  User,
  UserStatus,
} from "@/types";

export const adminApi = {
  listUsers: (token: string, params: { page: number; limit: number; role?: Role; status?: UserStatus }) =>
    apiFetchPaginated<User[]>("/admin/users", { token, query: params }) as Promise<{
      data: User[];
      meta: PaginationMeta;
    }>,

  updateUserRole: (token: string, userId: string, role: Role) =>
    apiFetch<User>(`/admin/users/${userId}/role`, { method: "PATCH", token, body: JSON.stringify({ role }) }),

  dashboardStats: (token: string) => apiFetch<DashboardSummary>("/admin/dashboard-stats", { token }),

  auditLogs: (token: string, params: { page: number; limit: number }) =>
    apiFetchPaginated<AuditLogEntry[]>("/admin/audit-logs", { token, query: params }) as Promise<{
      data: AuditLogEntry[];
      meta: PaginationMeta;
    }>,
};

export const analyticsApi = {
  dashboard: (token: string) => apiFetch<DashboardSummary>("/analytics/dashboard", { token }),
  courierLeaderboard: (token: string) =>
    apiFetch<CourierLeaderboardEntry[]>("/analytics/courier-leaderboard", { token }),
};
