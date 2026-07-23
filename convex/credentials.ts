import { v } from "convex/values";
import { internalQuery, mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";

export const addCredential = mutation({
  args: {
    service: v.string(),
    name: v.string(),
    data: v.any(), // encrypt before calling this, if secrets are sensitive
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    return await ctx.db.insert("credentials", {
      userId: user._id,
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const listMyCredentials = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);

    return await ctx.db
      .query("credentials")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const listMyCredentialsByService = query({
  args: { service: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    return await ctx.db
      .query("credentials")
      .withIndex("byUserIdAndService", (q) =>
        q.eq("userId", user._id).eq("service", args.service),
      )
      .collect();
  },
});

export const updateCredential = mutation({
  args: {
    id: v.id("credentials"),
    name: v.optional(v.string()),
    data: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const credential = await ctx.db.get(args.id);

    if (!credential || credential.userId !== user._id) {
      throw new Error("Credential not found");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, { ...updates, updatedAt: Date.now() });
  },
});

export const deleteCredential = mutation({
  args: { id: v.id("credentials") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const credential = await ctx.db.get(args.id);

    if (!credential || credential.userId !== user._id) {
      throw new Error("Credential not found");
    }

    await ctx.db.delete(args.id);
  },
});

// used internally by Inngest execution logic — bypasses client-facing auth
// since the execution engine runs server-side, not as the requesting user
export const getCredentialInternal = internalQuery({
  args: { id: v.id("credentials") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});