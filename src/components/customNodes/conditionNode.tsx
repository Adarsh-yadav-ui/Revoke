"use client";
import type { NodeProps } from "@xyflow/react";
import { GitBranch } from "lucide-react";
import { Handle, Position } from "@xyflow/react";
import { BaseNode, BaseNodeContent, BaseNodeHeader, BaseNodeHeaderTitle } from "@/components/base-node";
import { cn } from "@/lib/utils";

export function ConditionNode(props: NodeProps) {
  const { data } = props;
  return (
    <BaseNode
      className={cn(
        "min-w-[180px]",
        "border-purple-500/30",
        "in-[.selected]:border-purple-500",
      )}
    >
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <BaseNodeHeader className="bg-purple-500/10 rounded-t-md">
        <GitBranch className="size-4 text-purple-500" />
        <BaseNodeHeaderTitle className="text-xs">{String(data.label || "Condition")}</BaseNodeHeaderTitle>
      </BaseNodeHeader>
      <BaseNodeContent>
        <p className="text-[11px] text-muted-foreground">Branch based on a condition</p>
      </BaseNodeContent>
    </BaseNode>
  );
}
