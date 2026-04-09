import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getMembers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("members").collect();
  },
});

export const addMember = mutation({
  args: {
    name: v.string(),
    phone: v.optional(v.string()),
    role: v.string(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("members", args);
  },
});

export const updateMember = mutation({
  args: {
    id: v.id("members"),
    name: v.string(),
    phone: v.optional(v.string()),
    role: v.string(),
    isActive: v.boolean(),
  },
  handler: async (ctx, { id, ...args }) => {
    await ctx.db.patch(id, args);
  },
});

export const deleteMember = mutation({
  args: { id: v.id("members") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
