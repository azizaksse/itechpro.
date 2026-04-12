import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
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
    rating: v.optional(v.number()),
    reviews: v.optional(v.number()),
    specs: v.optional(v.any()), // Can be Record<string, string>
    colors: v.optional(
      v.array(
        v.object({
          hex: v.string(),
          label: v.string(),
          imageId: v.optional(v.string()), // For linking image to color
        })
      )
    ),
    sizes: v.optional(v.array(v.string())),  // e.g. ["35cm", "40cm"]
  }),
  orders: defineTable({
    customerFirstName: v.string(),
    customerLastName: v.string(),
    phone: v.string(),
    wilaya: v.string(),
    commune: v.string(),
    address: v.string(),
    deliveryMethod: v.string(), // "home" | "office"
    officeName: v.optional(v.string()), // Used if deliveryMethod is "office"
    status: v.string(), // "معلق" | "تم التأكيد" | "قيد التحضير" | "تم الشحن" | "تم التوصيل" | "ملغى"
    subtotal: v.number(),
    deliveryFee: v.number(),
    total: v.number(),
    isSuspicious: v.optional(v.boolean()),
    suspiciousReason: v.optional(v.string()),
  }).index("by_phone", ["phone"]),
  deliveryRates: defineTable({
    wilayaCode: v.string(), // e.g. "16"
    deliveryHome: v.number(),
    deliveryOffice: v.number(),
  }).index("by_code", ["wilayaCode"]),
  orderItems: defineTable({
    orderId: v.id("orders"),
    productId: v.string(), // Static ID or Convex ID string
    productName: v.string(),
    productImage: v.optional(v.string()),
    price: v.number(),
    quantity: v.number(),
  }),
  members: defineTable({
    name: v.string(),
    phone: v.optional(v.string()),
    role: v.string(),
    isActive: v.boolean(),
  }),
  contactMessages: defineTable({
    name: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    message: v.string(),
  }),
});
