"use client";

import { useState } from "react";
import { DashboardNavbar } from "@/components/dashboardNavbar";
import { DashboardSidebar } from "@/components/dashboardSidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex">
        <DashboardSidebar collapsed={collapsed} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardNavbar
          sidebarCollapsed={collapsed}
          onToggleSidebar={() => setCollapsed((value) => !value)}
        />
        <main className="flex-1 bg-zinc-100 p-6 dark:bg-[#101010]">
          {children}
        </main>
      </div>
    </div>
  );
}
