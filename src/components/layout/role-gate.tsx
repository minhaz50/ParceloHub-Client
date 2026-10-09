"use client";

import { useAuth } from "@/hooks/use-auth";
import type { Role } from "@/types";

export function RoleGate({
  allow,
  children,
  fallback = null,
}: {
  allow: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { user } = useAuth();
  if (!user) return fallback;
  if (!allow.includes(user.role)) return fallback;
  return <>{children}</>;
}
