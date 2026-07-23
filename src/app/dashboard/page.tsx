"use client"

import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useAuth, useUser, UserButton } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  CheckCircle2,
  XCircle,
  ArrowLeft,
  RefreshCw,
  Users,
  Database,
  KeyRound,
} from "lucide-react"
import { useRouter } from "next/navigation"

function Logo() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="h-8 w-24" />
  }

  return (
    <Image
      src={resolvedTheme === "dark" ? "/logo-dark.svg" : "/logo-light.svg"}
      alt="Revoke"
      width={120}
      height={32}
      priority
      className="h-8 w-auto"
    />
  )
}

function StatusBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <Badge variant={ok ? "default" : "destructive"} className="gap-1">
      {ok ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3" />}
      {label}
    </Badge>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const currentUser = useQuery(api.users.current)
  const allUsers = useQuery(api.users.getUsers)
  const storeUser = useMutation(api.users.store)
  const [now, setNow] = useState<string>("")

  useEffect(() => {
    setNow(new Date().toLocaleString())
  }, [])

  // Fallback: if signed in but user not in DB, sync from Clerk
  useEffect(() => {
    if (isSignedIn && user && currentUser !== undefined && currentUser === null) {
      storeUser({
        email: user.primaryEmailAddress?.emailAddress ?? "",
        firstName: user.firstName ?? undefined,
        lastName: user.lastName ?? undefined,
        username: user.username ?? undefined,
        imageUrl: user.imageUrl ?? undefined,
      }).catch(() => {})
    }
  }, [isSignedIn, user, currentUser, storeUser])

  const userInDb = currentUser !== undefined && currentUser !== null
  const isLoadingUser = currentUser === undefined
  if (isSignedIn == false) {
    router.push("/")
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>
            <Badge variant="secondary">Dashboard</Badge>
          </div>
          <div className="flex items-center gap-3">
            <UserButton  />
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 space-y-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold">
              Auth &amp; DB Test Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Verify Clerk authentication and Convex database integration.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="size-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <Separator />

        {/* Status Overview */}
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <KeyRound className="size-4" />
              Clerk Auth
            </div>
            <div className="mt-3">
              {isSignedIn === undefined ? (
                <Skeleton className="h-6 w-24" />
              ) : (
                <StatusBadge ok={isSignedIn} label={isSignedIn ? "Authenticated" : "Not Authenticated"} />
              )}
            </div>
            {user?.id && (
              <p className="mt-2 truncate font-mono text-xs text-muted-foreground">
                {user.id}
              </p>
            )}
          </div>

          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Database className="size-4" />
              User in Convex DB
            </div>
            <div className="mt-3">
              {isLoadingUser ? (
                <Skeleton className="h-6 w-24" />
              ) : (
                <StatusBadge ok={userInDb} label={userInDb ? "Found in DB" : "Not in DB"} />
              )}
            </div>
            {currentUser && (
              <p className="mt-2 text-xs text-muted-foreground">
                Last updated: {new Date(currentUser.updatedAt).toLocaleString()}
              </p>
            )}
          </div>

          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="size-4" />
              Total Users in DB
            </div>
            <div className="mt-3">
              {allUsers === undefined ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                <span className="font-heading text-2xl font-bold">{allUsers.length}</span>
              )}
            </div>
            {now && (
              <p className="mt-2 text-xs text-muted-foreground">
                Checked at {now}
              </p>
            )}
          </div>
        </section>

        <Separator />

        {/* Current User Detail */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-semibold">
              api.users.current Result
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="size-4" />
              Refresh
            </Button>
          </div>

          {isLoadingUser ? (
            <div className="space-y-3 rounded-xl border p-6">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-44" />
            </div>
          ) : currentUser === null ? (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <XCircle className="mx-auto size-10 text-muted-foreground/50" />
              <p className="mt-3 font-heading text-base font-medium">
                User not found in database
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                You&apos;re signed in via Clerk, but your user record hasn&apos;t been
                created in Convex yet. The webhook may still be processing, or
                you may need to check your webhook configuration.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-44">Field</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">_id</TableCell>
                    <TableCell className="font-mono text-xs">{currentUser._id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">clerkUserId</TableCell>
                    <TableCell className="font-mono text-xs">{currentUser.clerkUserId}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">email</TableCell>
                    <TableCell>{currentUser.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">firstName</TableCell>
                    <TableCell>{currentUser.firstName || "—"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">lastName</TableCell>
                    <TableCell>{currentUser.lastName || "—"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">username</TableCell>
                    <TableCell>{currentUser.username || "—"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">imageUrl</TableCell>
                    <TableCell>
                      {currentUser.imageUrl ? (
                        <div className="flex items-center gap-2">
                          <Image
                            src={currentUser.imageUrl}
                            alt="avatar"
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          <span className="truncate font-mono text-xs">
                            {currentUser.imageUrl}
                          </span>
                        </div>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">createdAt</TableCell>
                    <TableCell>
                      {new Date(currentUser.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">updatedAt</TableCell>
                    <TableCell>
                      {new Date(currentUser.updatedAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </section>

        <Separator />

        {/* All Users */}
        <section className="space-y-4 pb-12">
          <h2 className="font-heading text-xl font-semibold">
            All Users in Database (api.users.getUsers)
          </h2>

          {allUsers === undefined ? (
            <div className="space-y-3 rounded-xl border p-6">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
            </div>
          ) : allUsers.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <Database className="mx-auto size-10 text-muted-foreground/50" />
              <p className="mt-3 font-heading text-base font-medium">
                No users in database
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Sign up via Clerk and the webhook will create your user record.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Clerk ID</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allUsers?.map((user: any) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>
                        {[user.firstName, user.lastName].filter(Boolean).join(" ") || "—"}
                      </TableCell>
                      <TableCell>{user.username || "—"}</TableCell>
                      <TableCell className="max-w-32 truncate font-mono text-xs">
                        {user.clerkUserId}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(user.createdAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
