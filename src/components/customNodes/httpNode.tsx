"use client";
import type { NodeProps } from "@xyflow/react";
import { Globe } from "lucide-react";
import { Handle, Position } from "@xyflow/react";
import { BaseNode, BaseNodeContent, BaseNodeHeader, BaseNodeHeaderTitle } from "@/components/base-node";
import { cn } from "@/lib/utils";

export function HttpNode(props: NodeProps) {
  const { data } = props;
  return (
    <BaseNode
      className={cn(
        "min-w-[180px]",
        "border-blue-500/30",
        "in-[.selected]:border-blue-500",
      )}
    >
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <BaseNodeHeader className="bg-blue-500/10 rounded-t-md">
        <Globe className="size-4 text-blue-500" />
        <BaseNodeHeaderTitle className="text-xs">{String(data.label || "HTTP Request")}</BaseNodeHeaderTitle>
      </BaseNodeHeader>
      <BaseNodeContent>
        <p className="text-[11px] text-muted-foreground">Make an HTTP API call</p>
      </BaseNodeContent>
    </BaseNode>
  );
}
