import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getMessages = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("contactMessages").order("desc").collect();
  },
});

export const sendMessage = mutation({
  args: {
    name: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contactMessages", args);
  },
});

export const deleteMessage = mutation({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
