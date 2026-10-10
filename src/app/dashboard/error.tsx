"use client";

import { useEffect } from "react";
import { AlertTriangleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[dashboard error]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
      <AlertTriangleIcon className="size-8 text-destructive" />
      <p className="font-medium">Couldn&apos;t load this page</p>
      <p className="max-w-sm text-sm text-muted-foreground">{error.message || "Something went wrong talking to the API."}</p>
      <Button size="sm" onClick={reset}>Try again</Button>
    </div>
  );
}
