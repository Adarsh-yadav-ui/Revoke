"use client";

import { nodeTypes } from "@/config/nodeTypes";
import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";
import { useState, useCallback, useEffect } from "react";
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

export function Editor() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const initialNodes: Node[] = [
    {
      id: "n1",
      position: { x: 0, y: 0 },
      data: { label: "Node 1" },

      type: "initialNode",
    },
  ];

  const initialEdges: Edge[] = [];
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  const colorMode = mounted ? (theme === "dark" ? "dark" : "light") : "light";

  return (
    <div style={{ height: "100%", width: "100%" }}>
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
    </div>
  );
}
