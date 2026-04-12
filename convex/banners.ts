import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getBanners = query({
  args: {},
  handler: async (ctx) =>
    ctx.db.query("banners").order("asc").collect(),
});

export const getActiveBanners = query({
  args: {},
  handler: async (ctx) =>
    ctx.db.query("banners")
      .filter(q => q.eq(q.field("isActive"), true))
      .order("asc").collect(),
});

export const addBanner = mutation({
  args: {
    title: v.string(),
    subtitle: v.optional(v.string()),
    imageId: v.string(),
    link: v.optional(v.string()),
    isActive: v.boolean(),
    order: v.number(),
  },
  handler: async (ctx, args) => ctx.db.insert("banners", args),
});

export const updateBanner = mutation({
  args: {
    id: v.id("banners"),
    title: v.string(),
    subtitle: v.optional(v.string()),
    imageId: v.string(),
    link: v.optional(v.string()),
    isActive: v.boolean(),
    order: v.number(),
  },
  handler: async (ctx, { id, ...args }) => ctx.db.patch(id, args),
});

export const deleteBanner = mutation({
  args: { id: v.id("banners") },
  handler: async (ctx, args) => ctx.db.delete(args.id),
});

export const generateUploadUrl = mutation(async (ctx) =>
  ctx.storage.generateUploadUrl()
);
