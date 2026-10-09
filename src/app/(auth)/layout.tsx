import Link from "next/link";
import { PackageIcon } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-secondary/30">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex items-center justify-center py-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand text-brand-foreground">
            <PackageIcon className="size-4.5" />
          </span>
          <span>SwiftLine</span>
        </Link>
      </div>
      <main className="flex flex-1 items-start justify-center px-4 pb-16">{children}</main>
    </div>
  );
}
