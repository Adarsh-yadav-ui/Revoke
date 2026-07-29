"use client";
import type { NodeProps } from "@xyflow/react";
import { Timer } from "lucide-react";
import { Handle, Position } from "@xyflow/react";
import { BaseNode, BaseNodeContent, BaseNodeHeader, BaseNodeHeaderTitle } from "@/components/base-node";
import { cn } from "@/lib/utils";

export function DelayNode(props: NodeProps) {
  const { data } = props;
  return (
    <BaseNode
      className={cn(
        "min-w-[180px]",
        "border-orange-500/30",
        "in-[.selected]:border-orange-500",
      )}
    >
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <BaseNodeHeader className="bg-orange-500/10 rounded-t-md">
        <Timer className="size-4 text-orange-500" />
        <BaseNodeHeaderTitle className="text-xs">{String(data.label || "Delay")}</BaseNodeHeaderTitle>
      </BaseNodeHeader>
      <BaseNodeContent>
        <p className="text-[11px] text-muted-foreground">Wait before proceeding</p>
      </BaseNodeContent>
    </BaseNode>
  );
}
