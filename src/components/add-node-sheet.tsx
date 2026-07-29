"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Webhook, Globe, Timer, GitBranch, Plus } from "lucide-react";

export interface NodeTypeDefinition {
  type: string;
  label: string;
  icon: typeof Webhook;
  description: string;
  color: string;
  defaultConfig: Record<string, unknown>;
}

export const NODE_TYPES: NodeTypeDefinition[] = [
  {
    type: "trigger",
    label: "Webhook Trigger",
    icon: Webhook,
    description: "Starts workflow on incoming webhook",
    color: "text-emerald-500",
    defaultConfig: {},
  },
  {
    type: "http",
    label: "HTTP Request",
    icon: Globe,
    description: "Make an HTTP API call",
    color: "text-blue-500",
    defaultConfig: { method: "GET", url: "" },
  },
  {
    type: "delay",
    label: "Delay",
    icon: Timer,
    description: "Wait before proceeding to next step",
    color: "text-orange-500",
    defaultConfig: { duration: 1000 },
  },
  {
    type: "condition",
    label: "Condition",
    icon: GitBranch,
    description: "Branch workflow based on a condition",
    color: "text-purple-500",
    defaultConfig: { expression: "" },
  },
];

interface AddNodeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectNode: (nodeType: NodeTypeDefinition) => void;
}

export function AddNodeSheet({
  open,
  onOpenChange,
  onSelectNode,
}: AddNodeSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-80 sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Add Node</SheetTitle>
          <SheetDescription>
            Choose a node type to add to your workflow.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-2 px-4">
          {NODE_TYPES.map((nodeType) => {
            const Icon = nodeType.icon;
            return (
              <Button
                key={nodeType.type}
                variant="outline"
                className="flex h-auto items-center gap-3 p-3 justify-start"
                onClick={() => {
                  onSelectNode(nodeType);
                  onOpenChange(false);
                }}
              >
                <div className="flex size-8 items-center justify-center rounded-md bg-muted">
                  <Icon className={`size-4 ${nodeType.color}`} />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-medium">{nodeType.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {nodeType.description}
                  </span>
                </div>
                <Plus className="ml-auto size-4 text-muted-foreground" />
              </Button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
