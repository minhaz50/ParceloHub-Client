"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2Icon,
  LockIcon,
  ShieldIcon,
  TruckIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import {
  loginSchema,
  type LoginFormValues,
} from "@/lib/validations/auth.schema";
import { DEMO_ACCOUNTS } from "@/lib/constants";
import type { Role } from "@/types";

const DEMO_ICON: Record<Role, typeof ShieldIcon> = {
  ADMIN: ShieldIcon,
  SUPER_ADMIN: ShieldIcon,
  OPS_MANAGER: ShieldIcon,
  HUB_MANAGER: ShieldIcon,
  CUSTOMER: UserIcon,
  COURIER: TruckIcon,
};

export function LoginForm() {
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [demoLoading, setDemoLoading] = useState<Role | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    setSubmitting(true);
    try {
      await login(values.email, values.password);
    } catch {
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDemoLogin(role: Role, email: string, password: string) {
    setDemoLoading(role);
    try {
      await login(email, password);
    } catch {
    } finally {
      setDemoLoading(null);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome Back 👋</CardTitle>
        <CardDescription>Login to your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={submitting || !!demoLoading}
            >
              {submitting ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <LockIcon />
              )}
              Login
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <div>
          <p className="mb-3 text-center text-sm font-medium">
            🚀 Quick Demo Login
          </p>
          <div className="grid grid-cols-2 gap-3">
            {DEMO_ACCOUNTS.filter((a) => a.role !== "COURIER").map(
              (account) => {
                const Icon = DEMO_ICON[account.role];
                const isLoading = demoLoading === account.role;
                return (
                  <button
                    key={account.role}
                    type="button"
                    disabled={!!demoLoading || submitting}
                    onClick={() =>
                      handleDemoLogin(
                        account.role,
                        account.email,
                        account.password,
                      )
                    }
                    className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
                  >
                    <Icon className="size-5 text-brand" />
                    <span className="text-sm font-medium">{account.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {isLoading ? (
                        <Loader2Icon className="mx-auto size-3.5 animate-spin" />
                      ) : (
                        "Demo Login"
                      )}
                    </span>
                  </button>
                );
              },
            )}
          </div>
          <div className="mt-3">
            {DEMO_ACCOUNTS.filter((a) => a.role === "COURIER").map(
              (account) => {
                const Icon = DEMO_ICON[account.role];
                const isLoading = demoLoading === account.role;
                return (
                  <button
                    key={account.role}
                    type="button"
                    disabled={!!demoLoading || submitting}
                    onClick={() =>
                      handleDemoLogin(
                        account.role,
                        account.email,
                        account.password,
                      )
                    }
                    className="flex w-full flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
                  >
                    <Icon className="size-5 text-brand" />
                    <span className="text-sm font-medium">{account.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {isLoading ? (
                        <Loader2Icon className="mx-auto size-3.5 animate-spin" />
                      ) : (
                        "Demo Login"
                      )}
                    </span>
                  </button>
                );
              },
            )}
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-foreground underline underline-offset-2"
          >
            Register
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
