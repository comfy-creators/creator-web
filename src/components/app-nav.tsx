/** @format */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCardIcon, FlameIcon } from "lucide-react";
import { useAuth, UserButton } from "@clerk/nextjs";

import { useCreditBalance } from "@/hooks/use-credit-balance";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "./ui/button";

const navLinks = [
  { label: "Discover", href: "/discover" },
  { label: "Generations", href: "/generations" },
  { label: "Billing", href: "/billing" },
];

export function AppNav() {
  const pathname = usePathname();
  const { totalCredits, isLoading } = useCreditBalance();
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-6">
        {/* Logo */}
        <Link href="/discover" className="flex shrink-0 items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <FlameIcon className="size-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Forge</span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                pathname.startsWith(link.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
          {isLoaded && isSignedIn ? (
            <>
              <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3 py-1">
                <CreditCardIcon className="size-3 text-muted-foreground" />
                {isLoading ? (
                  <Skeleton className="h-3 w-12" />
                ) : (
                  <span className="text-xs font-medium tabular-nums">
                    {totalCredits?.toLocaleString() ?? "—"}
                  </span>
                )}
              </div>
              <UserButton />
            </>
          ) : (
            <Button size="sm" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
