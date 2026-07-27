import Image from "next/image";
import Link from "next/link";
import {
  CreditCard,
  FolderOpen,
  History,
  KeyIcon,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SIDEBAR_LINKS = [
  { href: "/dashboard/workflows", label: "Workflows", icon: FolderOpen },
  { href: "/dashboard/credentials", label: "Credentials", icon: KeyIcon },
  { href: "/dashboard/executions", label: "Executions", icon: History },
] as const;

type DashboardSidebarProps = {
  collapsed?: boolean;
  onToggleSidebar?: () => void;
};

export function DashboardSidebar({
  collapsed = false,
  onToggleSidebar,
}: DashboardSidebarProps) {
  const linkClassName = collapsed
    ? "sidebar-link justify-center"
    : "sidebar-link";

  return (
    <aside
      className={`sticky top-0 flex h-screen shrink-0 flex-col border-r bg-background p-4 transition-all duration-300 ease-out ${collapsed ? "w-20" : "w-64"}`}
    >
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center justify-center rounded-lg bg-zinc-50 px-3 py-2 transition-all duration-300 hover:bg-zinc-200 dark:bg-zinc-950 dark:hover:bg-zinc-800"
        >
          {collapsed ? (
            <Image src="/logo.svg" alt="Logo" width={28} height={28} />
          ) : (
            <>
              <Image
                src="/logo-light.svg"
                alt="Logo"
                width={160}
                height={160}
                className="dark:hidden"
              />
              <Image
                src="/logo-dark.svg"
                alt="Logo"
                width={160}
                height={160}
                className="hidden dark:block"
              />
            </>
          )}
        </Link>

        {!collapsed && onToggleSidebar ? (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-zinc-200 hover:text-foreground dark:hover:bg-zinc-800"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="size-4" />
          </button>
        ) : null}
      </div>

      <TooltipProvider delayDuration={200}>
        <nav className="mt-4 flex flex-col gap-1">
          {SIDEBAR_LINKS.map(({ href, label, icon: Icon }) => (
            <Tooltip key={href}>
              <TooltipTrigger asChild>
                <Link href={href} className={linkClassName}>
                  <Icon className="size-5" />
                  {!collapsed ? <span>{label}</span> : null}
                </Link>
              </TooltipTrigger>
              {collapsed ? (
                <TooltipContent side="right">{label}</TooltipContent>
              ) : null}
            </Tooltip>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/dashboard/support" className={linkClassName}>
                <CreditCard className="size-5" />
                {!collapsed ? <span>Support portal</span> : null}
              </Link>
            </TooltipTrigger>
            {collapsed ? (
              <TooltipContent side="right">Support portal</TooltipContent>
            ) : null}
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <SignOutButton>
                <button
                  type="button"
                  className={`${linkClassName} w-full text-left`}
                >
                  <LogOut className="size-5" />
                  {!collapsed ? <span>Sign out</span> : null}
                </button>
              </SignOutButton>
            </TooltipTrigger>
            {collapsed ? (
              <TooltipContent side="right">Sign out</TooltipContent>
            ) : null}
          </Tooltip>
        </div>
      </TooltipProvider>
    </aside>
  );
}
