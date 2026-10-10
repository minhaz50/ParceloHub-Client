"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { LayoutDashboardIcon, ScrollTextIcon, UsersIcon } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboardIcon },
  { href: "/admin/manage", label: "Manage Users", icon: UsersIcon },
  { href: "/admin/reports", label: "Audit Logs", icon: ScrollTextIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell navItems={NAV_ITEMS} allowedRoles={["ADMIN", "SUPER_ADMIN", "OPS_MANAGER", "HUB_MANAGER"]}>
      {children}
    </DashboardShell>
  );
}
