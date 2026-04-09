import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getOrders = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("orders").order("desc").collect();
  },
});

export const createOrder = mutation({
  args: {
    customerFirstName: v.string(),
    customerLastName: v.string(),
    phone: v.string(),
    wilaya: v.string(),
    commune: v.string(),
    address: v.string(),
    deliveryMethod: v.string(),
    officeName: v.optional(v.string()),
    status: v.string(),
    subtotal: v.number(),
    deliveryFee: v.number(),
    total: v.number(),
    items: v.array(v.object({
      productId: v.string(),
      productName: v.string(),
      productImage: v.optional(v.string()),
      price: v.number(),
      quantity: v.number(),
    })),
  },
  handler: async (ctx, { items, ...orderData }) => {
    const orderId = await ctx.db.insert("orders", orderData);
    for (const item of items) {
      await ctx.db.insert("orderItems", {
        orderId,
        ...item,
      });
    }
    return orderId;
  },
});

export const updateOrderStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const getOrderItems = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orderItems")
      .filter((q) => q.eq(q.field("orderId"), args.orderId))
      .collect();
  },
});

export const deleteOrder = mutation({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    // Delete items first
    const items = await ctx.db
      .query("orderItems")
      .filter((q) => q.eq(q.field("orderId"), args.id))
      .collect();
    for (const item of items) {
      await ctx.db.delete(item._id);
    }
    await ctx.db.delete(args.id);
  },
});
