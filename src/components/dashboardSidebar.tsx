import Image from "next/image";
import Link from "next/link";
import { CreditCard, FolderOpen, History, KeyIcon, LogOut } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

const SIDEBAR_LINKS = [
  { href: "/dashboard/workflows", label: "Workflows", icon: FolderOpen },
  { href: "/dashboard/credentials", label: "Credentials", icon: KeyIcon },
  { href: "/dashboard/executions", label: "Executions", icon: History },
] as const;

export function DashboardSidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r bg-background p-4">
      {/* Brand / Logo */}
      <Link
        href="/dashboard"
        className="rounded-lg bg-zinc-50 p-2 transition-colors hover:bg-zinc-200 dark:bg-zinc-950 dark:hover:bg-zinc-800 px-3"
      >
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
      </Link>

      {/* Main Navigation */}
      <nav className="mt-4 flex flex-col gap-1">
        {SIDEBAR_LINKS.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="sidebar-link">
            <Icon className="size-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer / Utilities */}
      <div className="mt-auto flex flex-col gap-1">
        <Link href="/dashboard/support" className="sidebar-link">
          <CreditCard className="size-5" />
          <span>Support portal</span>
        </Link>

        <SignOutButton>
          <button type="button" className="sidebar-link w-full text-left">
            <LogOut className="size-5" />
            <span>Sign out</span>
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}
