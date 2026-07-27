import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DashboardSidebar } from "@/components/dashboardSidebar";
import { Button } from "@/components/ui/button";

type DashboardNavbarProps = {
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
};

export function DashboardNavbar({
  sidebarCollapsed = false,
  onToggleSidebar,
}: DashboardNavbarProps) {
  return (
    <div className="flex h-16 w-full items-center justify-between border-b bg-white p-4 dark:bg-black">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:inline-flex"
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="size-4" />
          ) : (
            <PanelLeftClose className="size-4" />
          )}
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <DashboardSidebar collapsed={false} />
          </SheetContent>
        </Sheet>

        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
    </div>
  );
}
