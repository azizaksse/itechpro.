import { mutation } from "./_generated/server";

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
