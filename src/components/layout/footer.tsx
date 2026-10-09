import Link from "next/link";
import { PackageIcon } from "lucide-react";
import { GuestOnly } from "@/components/shared/auth-aware";

export function Footer() {
  return (
    <footer className="border-t bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-semibold">
              <span className="flex size-7 items-center justify-center rounded-lg bg-brand text-brand-foreground">
                <PackageIcon className="size-4" />
              </span>
              <span>SwiftLine</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Reliable courier and logistics management across every hub in the network.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground">About</Link></li>
              <li><Link href="/services" className="hover:text-foreground">Services</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
            </ul>
          </div>
          <GuestOnly>
            <div>
              <h3 className="text-sm font-semibold">Account</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><Link href="/login" className="hover:text-foreground">Login</Link></li>
                <li><Link href="/register" className="hover:text-foreground">Register</Link></li>
              </ul>
            </div>
          </GuestOnly>
          <div>
            <h3 className="text-sm font-semibold">Track a parcel</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Have a tracking ID? Visit{" "}
              <Link href="/track/CRX-00000000" className="font-medium text-foreground underline underline-offset-2">
                /track/&lt;id&gt;
              </Link>{" "}
              to see live status.
            </p>
          </div>
        </div>
        <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} SwiftLine Couriers. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
