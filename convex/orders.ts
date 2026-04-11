import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getOrders = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("orders").order("desc").collect();
  },
});

/** Spam / robot detection heuristics (server-side) */
function detectSpam(
  phone: string,
  firstName: string,
  lastName: string,
  recentPhoneCount: number,
  clientSuspiciousReason?: string,
): { isSuspicious: boolean; suspiciousReason: string } {
  const reasons: string[] = [];

  // 1. Client-side timing flag (form filled in < 4 seconds)
  if (clientSuspiciousReason) {
    reasons.push(clientSuspiciousReason);
  }

  // 2. Repeated phone number (more than 3 orders in last 10 min)
  if (recentPhoneCount >= 3) {
    reasons.push(`رقم الهاتف مكرر (${recentPhoneCount} طلبات)`);
  }

  // 3. Name contains digits or special chars — likely bot input
  const nameHasDigits = /\d/.test(firstName + lastName);
  if (nameHasDigits) {
    reasons.push("الاسم يحتوي على أرقام");
  }

  // 4. Name is repetitive characters (e.g. "aaaaaa", "xxxxxxx")
  const fullName = (firstName + lastName).toLowerCase().replace(/\s/g, "");
  if (fullName.length >= 3) {
    const allSame = fullName.split("").every((c) => c === fullName[0]);
    if (allSame) reasons.push("الاسم مكرر بشكل مشبوه");
  }

  // 5. Extremely short names (single character each)
  if (firstName.trim().length <= 1 || lastName.trim().length <= 1) {
    reasons.push("الاسم قصير جداً");
  }

  return {
    isSuspicious: reasons.length > 0,
    suspiciousReason: reasons.join(" | "),
  };
}

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
    clientSuspiciousReason: v.optional(v.string()),
    items: v.array(v.object({
      productId: v.string(),
      productName: v.string(),
      productImage: v.optional(v.string()),
      price: v.number(),
      quantity: v.number(),
    })),
  },
  handler: async (ctx, { items, clientSuspiciousReason, ...orderData }) => {
    // Count recent orders from same phone number (last 10 minutes)
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    const recentOrders = await ctx.db
      .query("orders")
      .withIndex("by_phone", (q) => q.eq("phone", orderData.phone))
      .order("desc")
      .take(10);
    const recentPhoneCount = recentOrders.filter(
      (o) => o._creationTime > tenMinutesAgo,
    ).length;

    const { isSuspicious, suspiciousReason } = detectSpam(
      orderData.phone,
      orderData.customerFirstName,
      orderData.customerLastName,
      recentPhoneCount,
      clientSuspiciousReason,
    );

    const orderId = await ctx.db.insert("orders", {
      ...orderData,
      isSuspicious,
      suspiciousReason: suspiciousReason || undefined,
    });

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

export const markOrderSafe = mutation({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isSuspicious: false, suspiciousReason: undefined });
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
