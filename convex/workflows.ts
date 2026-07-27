import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";

export const createWorkflow = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    return await ctx.db.insert("workflows", {
      userId: user._id,
      name: args.name,
      description: args.description,
      isActive: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const listMyWorkflows = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);

    return await ctx.db
      .query("workflows")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const getWorkflowById = query({
  args: { workflowId: v.id("workflows") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const workflow = await ctx.db.get(args.workflowId);

    if (!workflow || workflow.userId !== user._id) {
      throw new Error("Workflow not found");
    }

    return workflow;
  },
});

export const updateWorkflow = mutation({
  args: {
    workflowId: v.id("workflows"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const workflow = await ctx.db.get(args.workflowId);

    if (!workflow || workflow.userId !== user._id) {
      throw new Error("Workflow not found");
    }

    const { workflowId, ...updates } = args;
    await ctx.db.patch(workflowId, { ...updates, updatedAt: Date.now() });
  },
});

export const setWorkflowActive = mutation({
  args: {
    workflowId: v.id("workflows"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const workflow = await ctx.db.get(args.workflowId);

    if (!workflow || workflow.userId !== user._id) {
      throw new Error("Workflow not found");
    }

    await ctx.db.patch(args.workflowId, {
      isActive: args.isActive,
      updatedAt: Date.now(),
    });
  },
});

export const deleteWorkflow = mutation({
  args: { workflowId: v.id("workflows") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const workflow = await ctx.db.get(args.workflowId);

    if (!workflow || workflow.userId !== user._id) {
      throw new Error("Workflow not found");
    }

    // clean up dependent nodes + connections
    const nodes = await ctx.db
      .query("nodes")
      .withIndex("byWorkflowId", (q) => q.eq("workflowId", args.workflowId))
      .collect();
    for (const node of nodes) await ctx.db.delete(node._id);

    const connections = await ctx.db
      .query("connections")
      .withIndex("byWorkflowId", (q) => q.eq("workflowId", args.workflowId))
      .collect();
    for (const conn of connections) await ctx.db.delete(conn._id);

    await ctx.db.delete(args.workflowId);
  },
});
