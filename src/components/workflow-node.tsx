"use client";

import { NodeToolbar, Position } from "@xyflow/react";
import { SettingsIcon, TrashIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./ui/button";

interface WorkflowNodeProps {
  children: ReactNode;
  showToolbar?: boolean;
  onDelete?: () => void;
  onSettings?: () => void;
  name?: string;
  description?: string;
}

export function WorkflowNode({
  children,
  showToolbar = true,
  onDelete,
  onSettings,
  name,
  description,
}: WorkflowNodeProps) {
  return (
    <div className="relative flex flex-col items-center justify-center gap-2">
      {showToolbar && (
        <NodeToolbar position={Position.Top} isVisible>
          <Button size="sm" variant="ghost" onClick={onSettings}>
            <SettingsIcon className="size-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={onDelete}>
            <TrashIcon className="size-4" />
          </Button>
        </NodeToolbar>
      )}

      <div className="flex items-center justify-center">{children}</div>

      {name && (
        <div className="text-center">
          <p className="text-xs font-medium">{name}</p>
          {description && (
            <p className="text-[10px] text-muted-foreground truncate">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
