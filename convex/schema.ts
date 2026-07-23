// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    clerkUserId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    username: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("byClerkUserId", ["clerkUserId"])
    .index("byEmail", ["email"])
    .index("byUsername", ["username"]),

  workflows: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("byUserId", ["userId"]),

  nodes: defineTable({
    workflowId: v.id("workflows"),
    type: v.string(),               // "discord", "slack", "gemini", "trigger:google_form", etc.
    name: v.string(),
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
    config: v.any(),                // node-specific fields; may contain {{nodeId.path}} references
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("byWorkflowId", ["workflowId"]),

  connections: defineTable({
    workflowId: v.id("workflows"),
    sourceNodeId: v.id("nodes"),
    targetNodeId: v.id("nodes"),
    createdAt: v.number(),
  })
    .index("byWorkflowId", ["workflowId"])
    .index("bySourceNodeId", ["sourceNodeId"])
    .index("byTargetNodeId", ["targetNodeId"]),

  executions: defineTable({
    workflowId: v.id("workflows"),
    status: v.union(
      v.literal("running"),
      v.literal("success"),
      v.literal("failed"),
    ),
    triggerPayload: v.any(),        // raw data that kicked this run off
    startedAt: v.number(),
    finishedAt: v.optional(v.number()),
  })
    .index("byWorkflowId", ["workflowId"])
    .index("byStatus", ["status"]),

  responses: defineTable({
    executionId: v.id("executions"),
    nodeId: v.id("nodes"),
    output: v.any(),
    status: v.union(
      v.literal("success"),
      v.literal("failed"),
    ),
    error: v.optional(v.string()),
    startedAt: v.number(),
    finishedAt: v.number(),
  })
    .index("byExecutionId", ["executionId"])
    .index("byNodeId", ["nodeId"]),

  credentials: defineTable({
    userId: v.id("users"),
    service: v.string(),            // "discord", "slack", "stripe", "gemini", etc.
    name: v.string(),                // user-facing label, e.g. "My Discord Webhook"
    data: v.any(),                   // encrypted/stored secret payload (webhook URL, token, etc.)
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("byUserId", ["userId"])
    .index("byUserIdAndService", ["userId", "service"]),
});