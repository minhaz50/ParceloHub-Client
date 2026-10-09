import Link from "next/link";
import { PackageSearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-secondary">
        <PackageSearchIcon className="size-8 text-secondary-foreground" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight">404</h1>
      <p className="max-w-sm text-muted-foreground">
        This page seems to have taken a wrong turn at the hub. Let&apos;s get you back on route.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">Contact Support</Link>
        </Button>
      </div>
    </div>
  );
}
