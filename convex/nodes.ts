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

export const addNode = mutation({
  args: {
    workflowId: v.id("workflows"),
    type: v.string(),
    name: v.string(),
    position: v.object({ x: v.number(), y: v.number() }),
    config: v.any(),
  },
  handler: async (ctx, args) => {
    await assertWorkflowOwnership(ctx, args.workflowId);

    return await ctx.db.insert("nodes", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const listNodesByWorkflow = query({
  args: { workflowId: v.id("workflows") },
  handler: async (ctx, args) => {
    await assertWorkflowOwnership(ctx, args.workflowId);

    return await ctx.db
      .query("nodes")
      .withIndex("byWorkflowId", (q) => q.eq("workflowId", args.workflowId))
      .collect();
  },
});

export const getNode = query({
  args: { id: v.id("nodes") },
  handler: async (ctx, args) => {
    const node = await ctx.db.get(args.id);
    if (!node) throw new Error("Node not found");
    await assertWorkflowOwnership(ctx, node.workflowId);
    return node;
  },
});

export const updateNode = mutation({
  args: {
    id: v.id("nodes"),
    name: v.optional(v.string()),
    position: v.optional(v.object({ x: v.number(), y: v.number() })),
    config: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const node = await ctx.db.get(args.id);
    if (!node) throw new Error("Node not found");
    await assertWorkflowOwnership(ctx, node.workflowId);

    const { id, ...updates } = args;
    await ctx.db.patch(id, { ...updates, updatedAt: Date.now() });
  },
});

export const deleteNode = mutation({
  args: { id: v.id("nodes") },
  handler: async (ctx, args) => {
    const node = await ctx.db.get(args.id);
    if (!node) throw new Error("Node not found");
    await assertWorkflowOwnership(ctx, node.workflowId);

    // clean up connections referencing this node
    const asSource = await ctx.db
      .query("connections")
      .withIndex("bySourceNodeId", (q) => q.eq("sourceNodeId", args.id))
      .collect();
    const asTarget = await ctx.db
      .query("connections")
      .withIndex("byTargetNodeId", (q) => q.eq("targetNodeId", args.id))
      .collect();

    for (const conn of [...asSource, ...asTarget]) {
      await ctx.db.delete(conn._id);
    }

    await ctx.db.delete(args.id);
  },
});