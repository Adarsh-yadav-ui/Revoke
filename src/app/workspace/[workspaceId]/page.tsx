"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type OnConnect,
  type OnNodesChange,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Play,
  Pause,
  Save,
  Loader2,
  Settings2,
  Workflow,
  Plus,
} from "lucide-react";

export default function WorkflowEditorPage() {
  const params = useParams();
  const workflowId = params.workspaceId as Id<"workflows">;

  const workflow = useQuery(api.workflows.getWorkflowById, { workflowId });
  const nodesData = useQuery(api.nodes.listNodesByWorkflow, { workflowId });
  const connectionsData = useQuery(api.connections.listConnectionsByWorkflow, {
    workflowId,
  });

  const updateWorkflow = useMutation(api.workflows.updateWorkflow);
  const setWorkflowActive = useMutation(api.workflows.setWorkflowActive);
  const addNode = useMutation(api.nodes.addNode);

  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [addNodeOpen, setAddNodeOpen] = useState(false);
  const [newNodeType, setNewNodeType] = useState("");
  const [newNodeName, setNewNodeName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (nodesData) {
      setNodes(
        nodesData.map((n) => ({
          id: n._id,
          type: "default",
          position: n.position,
          data: { label: n.name, type: n.type, config: n.config },
        })),
      );
    }
  }, [nodesData, setNodes]);

  useEffect(() => {
    if (connectionsData) {
      setEdges(
        connectionsData.map((c) => ({
          id: c._id,
          source: c.sourceNodeId,
          target: c.targetNodeId,
        })),
      );
    }
  }, [connectionsData, setEdges]);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      for (const change of changes) {
        if (change.type === "select" && change.selected) {
          setSelectedNodeId(change.id);
        }
        if (
          change.type === "select" &&
          !change.selected &&
          change.id === selectedNodeId
        ) {
          setSelectedNodeId(null);
        }
      }
    },
    [onNodesChange, selectedNodeId],
  );

  const selectedNode = useMemo(() => {
    if (!selectedNodeId || !nodesData) return null;
    return nodesData.find((n) => n._id === selectedNodeId) ?? null;
  }, [selectedNodeId, nodesData]);

  async function handleSave() {
    if (!workflow) return;
    setIsSaving(true);
    try {
      await updateWorkflow({
        workflowId: workflow._id,
        name: workflow.name,
      });
    } catch {
      // silently handled
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggleActive() {
    if (!workflow) return;
    await setWorkflowActive({
      workflowId: workflow._id,
      isActive: !workflow.isActive,
    });
  }

  async function handleAddNode() {
    if (!workflow || !newNodeType || !newNodeName.trim()) return;
    setIsAdding(true);
    try {
      await addNode({
        workflowId: workflow._id,
        type: newNodeType,
        name: newNodeName.trim(),
        position: { x: 250, y: 150 },
        config: {},
      });
      setNewNodeType("");
      setNewNodeName("");
      setAddNodeOpen(false);
    } catch {
      // silently handled
    } finally {
      setIsAdding(false);
    }
  }

  if (
    workflow === undefined ||
    nodesData === undefined ||
    connectionsData === undefined
  ) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (workflow === null) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
        <Workflow className="size-12 text-muted-foreground/50" />
        <p className="text-lg font-medium text-muted-foreground">
          Workflow not found
        </p>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-5" />
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-medium">{workflow.name}</h1>
            <Badge variant={workflow.isActive ? "default" : "secondary"}>
              {workflow.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={addNodeOpen} onOpenChange={setAddNodeOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="size-3.5" />
                Add Node
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Node</DialogTitle>
                <DialogDescription>
                  Choose a node type and give it a name.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="node-type">Type</Label>
                  <Select value={newNodeType} onValueChange={setNewNodeType}>
                    <SelectTrigger id="node-type">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="discord">Discord</SelectItem>
                      <SelectItem value="slack">Slack</SelectItem>
                      <SelectItem value="gemini">Gemini AI</SelectItem>
                      <SelectItem value="http">HTTP Request</SelectItem>
                      <SelectItem value="webhook">Webhook</SelectItem>
                      <SelectItem value="google_form">Google Form</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="node-name">Name</Label>
                  <input
                    id="node-name"
                    className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="My Node"
                    value={newNodeName}
                    onChange={(e) => setNewNodeName(e.target.value)}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        newNodeType &&
                        newNodeName.trim()
                      ) {
                        handleAddNode();
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddNodeOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddNode}
                  disabled={isAdding || !newNodeType || !newNodeName.trim()}
                >
                  {isAdding ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Plus className="size-3.5" />
                  )}
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Save className="size-3.5" />
            )}
            Save
          </Button>
          <Button
            size="sm"
            variant={workflow.isActive ? "destructive" : "default"}
            onClick={handleToggleActive}
          >
            {workflow.isActive ? (
              <>
                <Pause className="size-3.5" />
                Stop
              </>
            ) : (
              <>
                <Play className="size-3.5" />
                Run
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Body */}
      <ResizablePanelGroup className="flex-1">
        <ResizablePanel defaultSize={75} minSize={30}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            className="bg-background"
            proOptions={{ hideAttribution: true }}
          >
            <Background />
            <Controls />
            <MiniMap />
            <Panel position="top-right">
              <Badge variant="outline" className="text-xs">
                {nodes.length} node{nodes.length !== 1 && "s"} &middot;{" "}
                {edges.length} edge{edges.length !== 1 && "s"}
              </Badge>
            </Panel>
          </ReactFlow>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel
          defaultSize={25}
          minSize={20}
          collapsible
          collapsedSize={0}
        >
          <div className="flex h-full flex-col border-l bg-background">
            <div className="flex items-center gap-2 border-b px-4 py-3">
              <Settings2 className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">Properties</span>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {selectedNode ? (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Name
                    </label>
                    <p className="text-sm">{selectedNode.name}</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Type
                    </label>
                    <Badge variant="secondary">{selectedNode.type}</Badge>
                  </div>
                  <Separator />
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Configuration
                    </label>
                    <pre className="rounded-md bg-muted p-3 text-xs overflow-x-auto">
                      {JSON.stringify(selectedNode.config, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground text-center">
                    Select a node to view its properties
                  </p>
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
