"use client"

import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useSyncExternalStore, useState, useEffect } from "react"
import { useAuth, useUser, UserButton } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Plus,
  Workflow,
  FileText,
  ArrowLeft,
} from "lucide-react"
import { useRouter } from "next/navigation"

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
}

function Logo() {
  const { resolvedTheme } = useTheme()
  const isClient = useIsClient()

  if (!isClient) {
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

export default function DashboardPage() {
  const router = useRouter()
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const currentUser = useQuery(api.users.current)
  const workflows = useQuery(api.workflows.listMyWorkflows)
  const storeUser = useMutation(api.users.store)
  const createWorkflow = useMutation(api.workflows.createWorkflow)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isCreating, setIsCreating] = useState(false)

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

  if (isSignedIn === false) {
    router.push("/")
    return null
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    setIsCreating(true)
    try {
      await createWorkflow({
        name: name.trim(),
        description: description.trim() || undefined,
      })
      setName("")
      setDescription("")
      setDialogOpen(false)
    } catch {
      // error handled silently
    } finally {
      setIsCreating(false)
    }
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
            <UserButton />
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 space-y-6 p-6">
        {/* Title Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon-sm" asChild>
              <Link href="/">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div>
              <h1 className="font-heading text-2xl font-bold">My Workflows</h1>
              <p className="text-sm text-muted-foreground">
                Manage your automation workflows.
              </p>
            </div>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="size-4" />
                Create Workflow
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleCreate}>
                <DialogHeader>
                  <DialogTitle>Create Workflow</DialogTitle>
                  <DialogDescription>
                    Give your new workflow a name and optional description.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="wf-name">Name</Label>
                    <Input
                      id="wf-name"
                      placeholder="My Workflow"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="wf-desc">Description</Label>
                    <Input
                      id="wf-desc"
                      placeholder="Optional description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating || !name.trim()}>
                    {isCreating ? "Creating..." : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Workflow Table */}
        {workflows === undefined ? (
          <div className="space-y-3 rounded-xl border p-6">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>
        ) : workflows.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center">
            <Workflow className="mx-auto size-12 text-muted-foreground/50" />
            <p className="mt-4 font-heading text-lg font-medium">
              No workflows yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first workflow to get started with automations.
            </p>
            <Button
              className="mt-4"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="size-4" />
              Create Workflow
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workflows.map((wf) => (
                  <TableRow key={wf._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="size-4 text-muted-foreground" />
                        {wf.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {wf.description || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={wf.isActive ? "default" : "secondary"}>
                        {wf.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(wf.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  )
}
