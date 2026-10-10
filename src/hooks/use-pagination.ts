"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useUrlPagination(
  defaults: { page?: number; limit?: number } = {},
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? defaults.page ?? 1);
  const limit = Number(searchParams.get("limit") ?? defaults.limit ?? 10);
  const status = searchParams.get("status") ?? undefined;
  const q = searchParams.get("q") ?? undefined;

  const setParam = useCallback(
    (updates: Record<string, string | number | undefined | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const setPage = useCallback(
    (newPage: number) => setParam({ page: newPage }),
    [setParam],
  );
  const setStatus = useCallback(
    (newStatus: string | undefined) => setParam({ status: newStatus, page: 1 }),
    [setParam],
  );
  const setQuery = useCallback(
    (newQ: string | undefined) => setParam({ q: newQ, page: 1 }),
    [setParam],
  );

  return useMemo(
    () => ({ page, limit, status, q, setPage, setStatus, setQuery, setParam }),
    [page, limit, status, q, setPage, setStatus, setQuery, setParam],
  );
}
