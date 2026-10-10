"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PackageIcon, CreditCardIcon, UserIcon, PlusCircleIcon } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "My Shipments", icon: PackageIcon },
  { href: "/dashboard/new", label: "New Shipment", icon: PlusCircleIcon },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCardIcon },
  { href: "/dashboard/profile", label: "Profile", icon: UserIcon },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell navItems={NAV_ITEMS} allowedRoles={["CUSTOMER"]}>
      {children}
    </DashboardShell>
  );
}
