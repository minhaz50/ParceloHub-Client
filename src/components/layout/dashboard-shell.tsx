"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HomeIcon,
  Loader2Icon,
  LogOutIcon,
  MenuIcon,
  PackageIcon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { ROLE_LABEL } from "@/lib/constants";
import { cn, initials } from "@/lib/utils";
import type { Role } from "@/types";
import { useEffect } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function DashboardShell({
  children,
  navItems,
  allowedRoles,
}: {
  children: React.ReactNode;
  navItems: NavItem[];
  allowedRoles: Role[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isHydrated, isLoadingUser, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (isHydrated && !isLoadingUser) {
      if (!user) {
        router.replace(`/login?redirectTo=${pathname}`);
      } else if (!allowedRoles.includes(user.role)) {
        router.replace("/");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, isLoadingUser, user, pathname]);

  if (
    !isHydrated ||
    isLoadingUser ||
    !user ||
    !allowedRoles.includes(user.role)
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r bg-secondary/20 lg:flex lg:flex-col">
        <Link
          href="/"
          className="flex h-16 items-center gap-2 border-b px-6 font-semibold hover:bg-accent/50"
        >
          <span className="flex size-7 items-center justify-center rounded-lg bg-brand text-brand-foreground">
            <PackageIcon className="size-4" />
          </span>
          SwiftLine
        </Link>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t p-3">
          <div className="flex items-center gap-3 rounded-md px-3 py-2">
            <Avatar className="size-8">
              <AvatarFallback>{initials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {ROLE_LABEL[user.role]}
              </p>
            </div>
          </div>
          <ThemeToggle showLabel className="mt-1 w-full justify-start gap-2" />
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2"
          >
            <Link href="/">
              <HomeIcon className="size-4" />
              Back to website
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={signOut}
          >
            <LogOutIcon className="size-4" />
            Sign out
          </Button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex h-16 items-center justify-between border-b px-4 lg:hidden">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex size-7 items-center justify-center rounded-lg bg-brand text-brand-foreground">
              <PackageIcon className="size-4" />
            </span>
            SwiftLine
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              className="p-2"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <XIcon className="size-5" />
              ) : (
                <MenuIcon className="size-5" />
              )}
            </button>
          </div>
        </header>

        {mobileOpen && (
          <nav className="space-y-1 border-b p-3 lg:hidden">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"
            >
              <HomeIcon className="size-4" />
              Back to website
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={signOut}
            >
              <LogOutIcon className="size-4" />
              Sign out
            </Button>
          </nav>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
