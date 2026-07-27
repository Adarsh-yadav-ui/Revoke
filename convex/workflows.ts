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

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    const workflows = await ctx.db
      .query("workflows")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .collect();

    let nodeCount = 0;
    let connectionCount = 0;
    let activeWorkflowCount = 0;

    for (const workflow of workflows) {
      if (workflow.isActive) {
        activeWorkflowCount += 1;
      }

      const nodes = await ctx.db
        .query("nodes")
        .withIndex("byWorkflowId", (q) => q.eq("workflowId", workflow._id))
        .collect();
      nodeCount += nodes.length;

      const connections = await ctx.db
        .query("connections")
        .withIndex("byWorkflowId", (q) => q.eq("workflowId", workflow._id))
        .collect();
      connectionCount += connections.length;
    }

    return {
      workflowCount: workflows.length,
      nodeCount,
      connectionCount,
      activeWorkflowCount,
    };
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

export const duplicateWorkflow = mutation({
  args: { workflowId: v.id("workflows") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const workflow = await ctx.db.get(args.workflowId);

    if (!workflow || workflow.userId !== user._id) {
      throw new Error("Workflow not found");
    }

    const duplicatedName = workflow.name.endsWith(" Copy")
      ? workflow.name
      : `${workflow.name} Copy`;

    const duplicatedWorkflowId = await ctx.db.insert("workflows", {
      userId: user._id,
      name: duplicatedName,
      description: workflow.description,
      isActive: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    const sourceNodes = await ctx.db
      .query("nodes")
      .withIndex("byWorkflowId", (q) => q.eq("workflowId", args.workflowId))
      .collect();

    const nodeIdMap = new Map<string, string>();

    for (const node of sourceNodes) {
      const duplicatedNodeId = await ctx.db.insert("nodes", {
        workflowId: duplicatedWorkflowId,
        type: node.type,
        name: node.name,
        position: node.position,
        config: node.config,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      nodeIdMap.set(node._id, duplicatedNodeId);
    }

    const sourceConnections = await ctx.db
      .query("connections")
      .withIndex("byWorkflowId", (q) => q.eq("workflowId", args.workflowId))
      .collect();

    for (const connection of sourceConnections) {
      const sourceNodeId = nodeIdMap.get(connection.sourceNodeId);
      const targetNodeId = nodeIdMap.get(connection.targetNodeId);

      if (sourceNodeId && targetNodeId) {
        await ctx.db.insert("connections", {
          workflowId: duplicatedWorkflowId,
          sourceNodeId,
          targetNodeId,
          createdAt: Date.now(),
        });
      }
    }

    return duplicatedWorkflowId;
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
