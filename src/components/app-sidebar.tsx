/** @format */

"use client";

/** @format */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCardIcon,
  FlameIcon,
  ImagesIcon,
  LayoutDashboardIcon,
  SparklesIcon,
} from "lucide-react";

import { useCreditBalance } from "@/hooks/use-credit-balance";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    label: "Generate",
    href: "/generate",
    icon: SparklesIcon,
  },
  {
    label: "Generations",
    href: "/generations",
    icon: ImagesIcon,
  },
  {
    label: "Billing",
    href: "/billing",
    icon: CreditCardIcon,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { totalCredits, isLoading } = useCreditBalance();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <FlameIcon className="size-4" />
                </div>
                <span className="text-sm font-semibold tracking-tight">
                  Forge
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div
          className={cn(
            "mx-2 mb-1 flex items-center gap-2 rounded-md border border-border/50 bg-muted/40 px-2.5 py-2",
            "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0",
          )}
        >
          <CreditCardIcon className="size-3.5 shrink-0 text-muted-foreground group-data-[collapsible=icon]:size-4" />
          {isLoading ? (
            <Skeleton className="h-3.5 w-14 group-data-[collapsible=icon]:hidden" />
          ) : (
            <span className="text-xs font-medium tabular-nums text-foreground group-data-[collapsible=icon]:hidden">
              {totalCredits?.toLocaleString() ?? "—"} credits
            </span>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
