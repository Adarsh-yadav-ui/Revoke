"use client";
import type { NodeProps } from "@xyflow/react";
import { Webhook } from "lucide-react";
import { Handle, Position } from "@xyflow/react";
import { BaseNode, BaseNodeContent, BaseNodeHeader, BaseNodeHeaderTitle } from "@/components/base-node";
import { cn } from "@/lib/utils";

export function TriggerNode(props: NodeProps) {
  const { data } = props;
  return (
    <BaseNode
      className={cn(
        "min-w-[180px]",
        "border-emerald-500/30",
        "in-[.selected]:border-emerald-500",
      )}
    >
      <Handle type="source" position={Position.Bottom} />
      <BaseNodeHeader className="bg-emerald-500/10 rounded-t-md">
        <Webhook className="size-4 text-emerald-500" />
        <BaseNodeHeaderTitle className="text-xs">{String(data.label || "Webhook Trigger")}</BaseNodeHeaderTitle>
      </BaseNodeHeader>
      <BaseNodeContent>
        <p className="text-[11px] text-muted-foreground">Starts workflow on incoming webhook</p>
      </BaseNodeContent>
    </BaseNode>
  );
}
