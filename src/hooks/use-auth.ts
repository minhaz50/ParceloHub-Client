"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import { authApi } from "@/lib/api/auth";
import { ApiRequestError } from "@/lib/api/client";
import { ROLE_HOME } from "@/lib/constants";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, accessToken, refreshToken, isHydrated, setAuth, setUser, logout } = useAuthStore();

  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authApi.me(accessToken as string),
    enabled: isHydrated && !!accessToken,
    staleTime: 60 * 1000,
  });

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const result = await authApi.login({ email, password });
        setAuth(result);
        toast.success(`Welcome back, ${result.user.name.split(" ")[0]}!`);
        router.push(ROLE_HOME[result.user.role] ?? "/");
        return result;
      } catch (err) {
        const message = err instanceof ApiRequestError ? err.message : "Login failed. Please try again.";
        toast.error(message);
        throw err;
      }
    },
    [router, setAuth],
  );

  const register = useCallback(
    async (payload: { name: string; email: string; password: string; phone?: string; organizationSlug: string }) => {
      try {
        const result = await authApi.register(payload);
        setAuth(result);
        toast.success("Account created! Welcome to SwiftLine.");
        router.push(ROLE_HOME[result.user.role] ?? "/");
        return result;
      } catch (err) {
        const message = err instanceof ApiRequestError ? err.message : "Registration failed. Please try again.";
        toast.error(message);
        throw err;
      }
    },
    [router, setAuth],
  );

  const signOut = useCallback(() => {
    logout();
    queryClient.clear();
    toast.message("Signed out");
    router.push("/login");
  }, [logout, queryClient, router]);

  return {
    user: meQuery.data ?? user,
    accessToken,
    refreshToken,
    isHydrated,
    isLoadingUser: isHydrated && !!accessToken && meQuery.isLoading,
    login,
    register,
    signOut,
    setUser,
  };
}
