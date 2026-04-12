import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const getActiveProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const getProductById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const addProduct = mutation({
  args: {
    name: v.string(),
    nameAr: v.string(),
    description: v.optional(v.string()),
    descriptionAr: v.optional(v.string()),
    price: v.number(),
    oldPrice: v.optional(v.number()),
    category: v.string(),
    brand: v.string(),
    image: v.string(),
    images: v.array(v.string()),
    inStock: v.boolean(),
    stockQuantity: v.number(),
    isActive: v.boolean(),
    isNew: v.boolean(),
    isPromo: v.boolean(),
    specs: v.optional(v.any()),
    colors: v.optional(
      v.array(
        v.object({
          hex: v.string(),
          label: v.string(),
          imageId: v.optional(v.string()),
        })
      )
    ),
    sizes: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", args);
  },
});

export const updateProduct = mutation({
  args: {
    id: v.id("products"),
    name: v.string(),
    nameAr: v.string(),
    description: v.optional(v.string()),
    descriptionAr: v.optional(v.string()),
    price: v.number(),
    oldPrice: v.optional(v.number()),
    category: v.string(),
    brand: v.string(),
    image: v.string(),
    images: v.array(v.string()),
    inStock: v.boolean(),
    stockQuantity: v.number(),
    isActive: v.boolean(),
    isNew: v.boolean(),
    isPromo: v.boolean(),
    specs: v.optional(v.any()),
    colors: v.optional(
      v.array(
        v.object({
          hex: v.string(),
          label: v.string(),
          imageId: v.optional(v.string()),
        })
      )
    ),
    sizes: v.optional(v.array(v.string())),
  },
  handler: async (ctx, { id, ...args }) => {
    await ctx.db.patch(id, args);
  },
});

export const deleteProduct = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const seedProducts = mutation({
  args: { products: v.array(v.any()) },
  handler: async (ctx, args) => {
    for (const p of args.products) {
      const { id, _id, ...rest } = p;
      await ctx.db.insert("products", {
        ...rest,
        name: rest.name || rest.nameAr,
        description: rest.description || "",
        descriptionAr: rest.descriptionAr || "",
        isActive: rest.isActive ?? true,
        isNew: rest.isNew ?? false,
        isPromo: rest.isPromo ?? false,
        stockQuantity: rest.stockQuantity ?? 10,
        inStock: rest.inStock ?? true,
        images: rest.images || [rest.image],
        specs: rest.specs || {},
      });
    }
  },
});
export const deleteAllProducts = mutation({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    for (const p of products) {
      await ctx.db.delete(p._id);
    }
    return products.length;
  },
});

export const cleanupBrokenProducts = mutation({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    let deletedCount = 0;
    for (const p of products) {
      if (p.image?.startsWith("blob:")) {
        await ctx.db.delete(p._id);
        deletedCount++;
      }
    }
    return deletedCount;
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});
export const getImageUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
