"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ROLE_HOME } from "@/lib/constants";

type ButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "asChild" | "onClick"
>;

export function BookShipmentButton({
  children,
  loggedInLabel,
  guestHref = "/register",
  ...props
}: ButtonProps & { loggedInLabel?: React.ReactNode; guestHref?: string }) {
  const { user, isHydrated } = useAuth();
  const activeUser = isHydrated ? user : null;

  let href = guestHref;
  let label = children;

  if (activeUser) {
    if (activeUser.role === "CUSTOMER") {
      href = "/dashboard/new";
      label = loggedInLabel ?? children;
    } else {
      href = ROLE_HOME[activeUser.role] ?? "/";
      label = "Go to Dashboard";
    }
  }

  return (
    <Button asChild {...props}>
      <Link href={href}>{label}</Link>
    </Button>
  );
}

export function GuestOnly({ children }: { children: React.ReactNode }) {
  const { user, isHydrated } = useAuth();
  if (isHydrated && user) return null;
  return <>{children}</>;
}
