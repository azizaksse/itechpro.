import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all dynamic rates configured in the DB
export const getRates = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("deliveryRates").collect();
  },
});

// Seed or update multiple delivery rates (used from the admin dashboard)
export const updateRates = mutation({
  args: {
    rates: v.array(
      v.object({
        wilayaCode: v.string(),
        deliveryHome: v.number(),
        deliveryOffice: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // For each provided rate, check if we already have it in DB, otherwise insert/update
    for (const rate of args.rates) {
      const existing = await ctx.db
        .query("deliveryRates")
        .withIndex("by_code", (q) => q.eq("wilayaCode", rate.wilayaCode))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          deliveryHome: rate.deliveryHome,
          deliveryOffice: rate.deliveryOffice,
        });
      } else {
        await ctx.db.insert("deliveryRates", {
          wilayaCode: rate.wilayaCode,
          deliveryHome: rate.deliveryHome,
          deliveryOffice: rate.deliveryOffice,
        });
      }
    }
    return { success: true, count: args.rates.length };
  },
});
