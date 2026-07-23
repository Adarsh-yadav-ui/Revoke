import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";

async function assertWorkflowOwnership(ctx: any, workflowId: any) {
  const user = await getCurrentUserOrThrow(ctx);
  const workflow = await ctx.db.get(workflowId);
  if (!workflow || workflow.userId !== user._id) {
    throw new Error("Workflow not found");
  }
  return workflow;
}

export const connectNodes = mutation({
  args: {
    workflowId: v.id("workflows"),
    sourceNodeId: v.id("nodes"),
    targetNodeId: v.id("nodes"),
  },
  handler: async (ctx, args) => {
    await assertWorkflowOwnership(ctx, args.workflowId);

    return await ctx.db.insert("connections", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const listConnectionsByWorkflow = query({
  args: { workflowId: v.id("workflows") },
  handler: async (ctx, args) => {
    await assertWorkflowOwnership(ctx, args.workflowId);

    return await ctx.db
      .query("connections")
      .withIndex("byWorkflowId", (q) => q.eq("workflowId", args.workflowId))
      .collect();
  },
});

export const deleteConnection = mutation({
  args: { id: v.id("connections") },
  handler: async (ctx, args) => {
    const connection = await ctx.db.get(args.id);
    if (!connection) throw new Error("Connection not found");
    await assertWorkflowOwnership(ctx, connection.workflowId);

    await ctx.db.delete(args.id);
  },
});