import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";

// called from Inngest as each node finishes executing
export const recordResponse = internalMutation({
  args: {
    executionId: v.id("executions"),
    nodeId: v.id("nodes"),
    output: v.any(),
    status: v.union(v.literal("success"), v.literal("failed")),
    error: v.optional(v.string()),
    startedAt: v.number(),
    finishedAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("responses", args);
  },
});

export const listResponsesByExecution = query({
  args: { executionId: v.id("executions") },
  handler: async (ctx, args) => {
    const execution = await ctx.db.get(args.executionId);
    if (!execution) throw new Error("Execution not found");

    const user = await getCurrentUserOrThrow(ctx);
    const workflow = await ctx.db.get(execution.workflowId);
    if (!workflow || workflow.userId !== user._id) {
      throw new Error("Not authorized");
    }

    return await ctx.db
      .query("responses")
      .withIndex("byExecutionId", (q) => q.eq("executionId", args.executionId))
      .collect();
  },
});

export const listResponsesByNode = query({
  args: { nodeId: v.id("nodes") },
  handler: async (ctx, args) => {
    const node = await ctx.db.get(args.nodeId);
    if (!node) throw new Error("Node not found");

    const user = await getCurrentUserOrThrow(ctx);
    const workflow = await ctx.db.get(node.workflowId);
    if (!workflow || workflow.userId !== user._id) {
      throw new Error("Not authorized");
    }

    return await ctx.db
      .query("responses")
      .withIndex("byNodeId", (q) => q.eq("nodeId", args.nodeId))
      .collect();
  },
});