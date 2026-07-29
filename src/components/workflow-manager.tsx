"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Copy,
  ExternalLink,
  Layers3,
  MoreHorizontal,
  Pencil,
  PlusCircle,
  Trash2,
  Workflow,
} from "lucide-react";

type WorkflowRow = {
  _id: string;
  name: string;
  description?: string;
  createdAt?: number;
  updatedAt?: number;
};

export function WorkflowManager() {
  const workflows = useQuery(api.workflows.listMyWorkflows) as
    WorkflowRow[] | undefined;
  const stats = useQuery(api.workflows.getDashboardStats) as
    | {
        workflowCount: number;
        nodeCount: number;
        connectionCount: number;
        activeWorkflowCount: number;
      }
    | undefined;
  const createWorkflow = useMutation(api.workflows.createWorkflow);
  const updateWorkflow = useMutation(api.workflows.updateWorkflow);
  const deleteWorkflow = useMutation(api.workflows.deleteWorkflow);
  const duplicateWorkflow = useMutation(api.workflows.duplicateWorkflow);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) return;

    setIsCreating(true);
    try {
      await createWorkflow({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      setName("");
      setDescription("");
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDelete(workflowId: string) {
    await deleteWorkflow({ workflowId: workflowId as never });
  }

  async function handleDuplicate(workflowId: string) {
    await duplicateWorkflow({ workflowId: workflowId as never });
  }

  function startEditing(workflow: WorkflowRow) {
    setEditingId(workflow._id);
    setEditingName(workflow.name);
    setEditingDescription(workflow.description ?? "");
  }

  async function handleRename(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingId || !editingName.trim()) return;

    setIsSaving(true);
    try {
      await updateWorkflow({
        workflowId: editingId as never,
        name: editingName.trim(),
        description: editingDescription.trim() || undefined,
      });
      setEditingId(null);
      setEditingName("");
      setEditingDescription("");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Workflows</h1>
          <p className="text-sm text-muted-foreground">
            Create and organize the automations that belong to your account.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Workflow className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Workflows</p>
              <p className="text-2xl font-semibold">
                {stats?.workflowCount ?? 0}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Layers3 className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Nodes</p>
              <p className="text-2xl font-semibold">{stats?.nodeCount ?? 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Copy className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Connections</p>
              <p className="text-2xl font-semibold">
                {stats?.connectionCount ?? 0}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <ExternalLink className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-semibold">
                {stats?.activeWorkflowCount ?? 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Create a new workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleCreate}
            className="flex flex-col gap-3 md:flex-row"
          >
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Workflow name"
              className="md:max-w-xs"
            />
            <Input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Optional description"
              className="md:max-w-sm"
            />
            <Button type="submit" disabled={isCreating} className="md:w-auto">
              <PlusCircle className="mr-2 size-4" />
              {isCreating ? "Creating..." : "Create workflow"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {workflows === undefined ? (
        <p className="text-sm text-muted-foreground">
          Loading your workflows...
        </p>
      ) : workflows.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            You have no workflows yet. Create one to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {workflows?.map((workflow) => (
            <div
              key={workflow._id}
              className="flex flex-col gap-3 rounded-xl border bg-background/70 p-4 shadow-sm transition-colors hover:bg-accent/40 md:flex-row md:items-center md:justify-between"
            >
              {editingId === workflow._id ? (
                <form
                  onSubmit={handleRename}
                  className="flex w-full flex-col gap-3 md:flex-row md:items-center"
                >
                  <Input
                    value={editingName}
                    onChange={(event) => setEditingName(event.target.value)}
                    placeholder="Workflow name"
                    className="md:max-w-xs"
                  />
                  <Textarea
                    value={editingDescription}
                    onChange={(event) =>
                      setEditingDescription(event.target.value)
                    }
                    placeholder="Optional description"
                    className="min-h-20 md:max-w-md"
                  />
                  <div className="flex gap-2">
                    <Button type="submit" disabled={isSaving} size="sm">
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-base font-semibold">
                        {workflow.name}
                      </h3>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {workflow.description ? "Configured" : "New"}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {workflow.description || "No description yet."}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>
                        Created{" "}
                        {workflow.createdAt
                          ? new Date(workflow.createdAt).toLocaleDateString()
                          : "recently"}
                      </span>
                      <span>
                        Updated{" "}
                        {workflow.updatedAt
                          ? new Date(workflow.updatedAt).toLocaleDateString()
                          : "recently"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button asChild size="sm">
                      <Link href={`/dashboard/workflows/${workflow._id}`}>
                        <ExternalLink className="mr-2 size-4" />
                        Open
                      </Link>
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          aria-label={`Actions for ${workflow.name}`}
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => startEditing(workflow)}
                        >
                          <Pencil className="mr-2 size-4" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDuplicate(workflow._id)}
                        >
                          <Copy className="mr-2 size-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDelete(workflow._id)}
                        >
                          <Trash2 className="mr-2 size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
