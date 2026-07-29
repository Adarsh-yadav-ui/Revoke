"use client";

import { nodeTypes } from "@/config/nodeTypes";
import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";
import { useState, useCallback, useEffect, useRef } from "react";
import {
  ReactFlow,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  addEdge,
  type Edge,
  type Node,
  type NodeChange,
  type EdgeChange,
  type Connection,
  MiniMap,
} from "@xyflow/react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddNodeSheet, type NodeTypeDefinition } from "@/components/add-node-sheet";

interface EditorProps {
  workflowId: Id<"workflows">;
}

let tempEdgeCounter = 0;

export function Editor({ workflowId }: EditorProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dbNodes = useQuery(api.nodes.listNodesByWorkflow, { workflowId });
  const dbConnections = useQuery(api.connections.listConnectionsByWorkflow, { workflowId });

  const addNode = useMutation(api.nodes.addNode);
  const updateNode = useMutation(api.nodes.updateNode);
  const deleteNode = useMutation(api.nodes.deleteNode);
  const connectNodes = useMutation(api.connections.connectNodes);
  const deleteConnection = useMutation(api.connections.deleteConnection);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const initializedRef = useRef(false);
  const debounceTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const [isAddNodeSheetOpen, setIsAddNodeSheetOpen] = useState(false);

  useEffect(() => {
    if (
      !initializedRef.current &&
      dbNodes !== undefined &&
      dbConnections !== undefined
    ) {
      const xyflowNodes: Node[] = dbNodes.map((n) => ({
        id: n._id,
        type: n.type,
        position: n.position,
        data: { label: n.name, ...n.config },
      }));

      if (xyflowNodes.length === 0) {
        xyflowNodes.push({
          id: "initial",
          type: "initialNode",
          position: { x: 0, y: 0 },
          data: { label: "Initial Node" },
        });
      }

      const xyflowEdges: Edge[] = dbConnections.map((c) => ({
        id: c._id,
        source: c.sourceNodeId,
        target: c.targetNodeId,
      }));

      setNodes(xyflowNodes);
      setEdges(xyflowEdges);
      initializedRef.current = true;
    }
  }, [dbNodes, dbConnections]);

  useEffect(() => {
    return () => {
      for (const timer of debounceTimers.current.values()) {
        clearTimeout(timer);
      }
      debounceTimers.current.clear();
    };
  }, []);

  const debouncedUpdatePosition = useCallback(
    (nodeId: string, position: { x: number; y: number }) => {
      const existing = debounceTimers.current.get(nodeId);
      if (existing) {
        clearTimeout(existing);
      }
      const timer = setTimeout(() => {
        updateNode({ id: nodeId as Id<"nodes">, position });
        debounceTimers.current.delete(nodeId);
      }, 500);
      debounceTimers.current.set(nodeId, timer);
    },
    [updateNode],
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => {
        const updated = applyNodeChanges(changes, nds);

        for (const change of changes) {
          if (change.type === "position" && change.position && change.id !== "initial") {
            debouncedUpdatePosition(change.id, change.position);
          }
          if (change.type === "remove" && change.id !== "initial") {
            deleteNode({ id: change.id as Id<"nodes"> });
          }
        }

        return updated;
      });
    },
    [debouncedUpdatePosition, deleteNode],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => {
        const updated = applyEdgeChanges(changes, eds);

        for (const change of changes) {
          if (change.type === "remove" && !change.id.startsWith("temp-")) {
            deleteConnection({ id: change.id as Id<"connections"> });
          }
        }

        return updated;
      });
    },
    [deleteConnection],
  );

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target || params.source === "initial" || params.target === "initial") return;

      const tempId = `temp-${++tempEdgeCounter}`;

      setEdges((eds) =>
        addEdge({ ...params, id: tempId }, eds),
      );

      connectNodes({
        workflowId,
        sourceNodeId: params.source as Id<"nodes">,
        targetNodeId: params.target as Id<"nodes">,
      }).then((connectionId) => {
        setEdges((eds) =>
          eds.map((e) => (e.id === tempId ? { ...e, id: connectionId } : e)),
        );
      });
    },
    [workflowId, connectNodes],
  );

  const handleSelectNode = useCallback(
    async (nodeType: NodeTypeDefinition) => {
      const newNodeId = await addNode({
        workflowId,
        type: nodeType.type,
        name: nodeType.label,
        position: { x: 150, y: 150 },
        config: nodeType.defaultConfig,
      });

      setNodes((nds) => {
        const withoutPlaceholder = nds.filter((n) => n.id !== "initial");
        return [
          ...withoutPlaceholder,
          {
            id: newNodeId,
            type: nodeType.type,
            position: { x: 150, y: 150 },
            data: { label: nodeType.label, ...nodeType.defaultConfig },
          },
        ];
      });
    },
    [workflowId, addNode],
  );

  const isLoading = dbNodes === undefined || dbConnections === undefined;
  const colorMode = mounted ? (theme === "dark" ? "dark" : "light") : "light";

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50">
          <p className="text-sm text-muted-foreground">Loading workflow...</p>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        proOptions={{ hideAttribution: true }}
        colorMode={colorMode}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <Button
          onClick={() => setIsAddNodeSheetOpen(true)}
          size="sm"
          className="shadow-lg"
        >
          <Plus className="mr-1 size-4" />
          Add Node
        </Button>
      </div>

      <AddNodeSheet
        open={isAddNodeSheetOpen}
        onOpenChange={setIsAddNodeSheetOpen}
        onSelectNode={handleSelectNode}
      />
    </div>
  );
}
