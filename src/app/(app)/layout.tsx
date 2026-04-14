/** @format */

import { AppNav } from "@/components/app-nav";
import { GenerationsSimulatorProvider } from "@/contexts/generations-simulator";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <GenerationsSimulatorProvider>
      <div className="flex min-h-screen flex-col">
        <AppNav />
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </GenerationsSimulatorProvider>
  );
}
