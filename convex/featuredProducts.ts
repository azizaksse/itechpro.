import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getFeatured = query({
  args: {},
  handler: async (ctx) =>
    ctx.db.query("featuredProducts").order("asc").collect(),
});

export const getActiveFeatured = query({
  args: {},
  handler: async (ctx) =>
    ctx.db.query("featuredProducts")
      .filter(q => q.eq(q.field("isActive"), true))
      .order("asc").collect(),
});

export const addFeatured = mutation({
  args: {
    productId: v.string(),
    order: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Prevent duplicates
    const existing = await ctx.db.query("featuredProducts")
      .filter(q => q.eq(q.field("productId"), args.productId))
      .first();
    if (existing) return existing._id;
    return ctx.db.insert("featuredProducts", args);
  },
});

export const updateFeatured = mutation({
  args: {
    id: v.id("featuredProducts"),
    order: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, { id, ...args }) => ctx.db.patch(id, args),
});

export const removeFeatured = mutation({
  args: { id: v.id("featuredProducts") },
  handler: async (ctx, args) => ctx.db.delete(args.id),
});
