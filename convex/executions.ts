import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";

async function assertWorkflowOwnership(ctx: any, workflowId: any) {
  const user = await getCurrentUserOrThrow(ctx);
  const workflow = await ctx.db.get(workflowId);
  if (!workflow || workflow.userId !== user._id) {
    throw new Error("Workflow not found");
  }
  return workflow;
}

// called from Inngest / backend, not directly from the client
export const startExecution = internalMutation({
  args: {
    workflowId: v.id("workflows"),
    triggerPayload: v.any(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("executions", {
      ...args,
      status: "running",
      startedAt: Date.now(),
    });
  },
});

export const finishExecution = internalMutation({
  args: {
    id: v.id("executions"),
    status: v.union(v.literal("success"), v.literal("failed")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      finishedAt: Date.now(),
    });
  },
});

export const listExecutionsByWorkflow = query({
  args: { workflowId: v.id("workflows") },
  handler: async (ctx, args) => {
    await assertWorkflowOwnership(ctx, args.workflowId);

    return await ctx.db
      .query("executions")
      .withIndex("byWorkflowId", (q) => q.eq("workflowId", args.workflowId))
      .order("desc")
      .collect();
  },
});

export const getExecution = query({
  args: { id: v.id("executions") },
  handler: async (ctx, args) => {
    const execution = await ctx.db.get(args.id);
    if (!execution) throw new Error("Execution not found");
    await assertWorkflowOwnership(ctx, execution.workflowId);
    return execution;
  },
});