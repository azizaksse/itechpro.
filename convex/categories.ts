import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getCategories = query({
  args: {},
  handler: async (ctx) =>
    ctx.db.query("categories").order("asc").collect(),
});

export const getActiveCategories = query({
  args: {},
  handler: async (ctx) =>
    ctx.db.query("categories")
      .filter(q => q.eq(q.field("isActive"), true))
      .order("asc").collect(),
});

export const addCategory = mutation({
  args: {
    slug: v.string(),
    nameAr: v.string(),
    nameEn: v.optional(v.string()),
    imageId: v.optional(v.string()),
    isActive: v.boolean(),
    order: v.number(),
  },
  handler: async (ctx, args) => ctx.db.insert("categories", args),
});

export const updateCategory = mutation({
  args: {
    id: v.id("categories"),
    slug: v.string(),
    nameAr: v.string(),
    nameEn: v.optional(v.string()),
    imageId: v.optional(v.string()),
    isActive: v.boolean(),
    order: v.number(),
  },
  handler: async (ctx, { id, ...args }) => ctx.db.patch(id, args),
});

export const deleteCategory = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => ctx.db.delete(args.id),
});

export const generateUploadUrl = mutation(async (ctx) =>
  ctx.storage.generateUploadUrl()
);
