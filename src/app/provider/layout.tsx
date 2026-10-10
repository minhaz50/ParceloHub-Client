"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ClipboardListIcon, UserIcon, WalletIcon } from "lucide-react";

const NAV_ITEMS = [
  { href: "/provider", label: "My Tasks", icon: ClipboardListIcon },
  { href: "/provider/earnings", label: "Earnings", icon: WalletIcon },
  { href: "/provider/profile", label: "Profile & Availability", icon: UserIcon },
];

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell navItems={NAV_ITEMS} allowedRoles={["COURIER"]}>
      {children}
    </DashboardShell>
  );
}
