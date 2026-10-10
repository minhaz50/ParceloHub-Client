"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import { REFRESH_COOKIE, ROLE_COOKIE, TOKEN_COOKIE } from "@/lib/constants";
import type { AuthResponse, User } from "@/types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isHydrated: boolean;
  setAuth: (auth: AuthResponse) => void;
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setHydrated: () => void;
}

/**
 * Why both Zustand (localStorage) AND cookies: client components need
 * the token in JS to attach `Authorization: Bearer ...` headers on fetch
 * calls — that's what Zustand/localStorage is for. `middleware.ts` runs
 * on the server/edge and has zero access to localStorage, so it needs a
 * readable cookie instead purely to decide "should this request even
 * reach the protected page, or bounce to /login first".
 *
 * This is explicitly a UX-level gate, not the real security boundary —
 * a cookie set by client JS can be tampered with. The actual enforcement
 * is the backend's `auth(...roles)` middleware on every endpoint, which
 * re-validates the JWT and current DB role on every request regardless
 * of what this frontend shows or hides.
 */
function syncCookies(auth: { accessToken: string; refreshToken: string; role: string } | null) {
  if (auth) {
    Cookies.set(TOKEN_COOKIE, auth.accessToken, { expires: 1, sameSite: "lax" });
    Cookies.set(REFRESH_COOKIE, auth.refreshToken, { expires: 30, sameSite: "lax" });
    Cookies.set(ROLE_COOKIE, auth.role, { expires: 30, sameSite: "lax" });
  } else {
    Cookies.remove(TOKEN_COOKIE);
    Cookies.remove(REFRESH_COOKIE);
    Cookies.remove(ROLE_COOKIE);
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isHydrated: false,

      setAuth: (auth) => {
        syncCookies({ accessToken: auth.accessToken, refreshToken: auth.refreshToken, role: auth.user.role });
        set({ user: auth.user, accessToken: auth.accessToken, refreshToken: auth.refreshToken });
      },

      setUser: (user) => {
        const state = get();
        if (state.accessToken && state.refreshToken) {
          syncCookies({ accessToken: state.accessToken, refreshToken: state.refreshToken, role: user.role });
        }
        set({ user });
      },

      setTokens: (accessToken, refreshToken) => {
        const role = get().user?.role;
        if (role) syncCookies({ accessToken, refreshToken, role });
        set({ accessToken, refreshToken });
      },

      logout: () => {
        syncCookies(null);
        set({ user: null, accessToken: null, refreshToken: null });
      },

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "clx-auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);
