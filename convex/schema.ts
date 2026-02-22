import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  siteSettings: defineTable({
    profileImage: v.optional(v.string()),
    brandName: v.string(),
    tagline: v.optional(v.string()),
    aboutText: v.optional(v.string()),
    loadingImage: v.optional(v.string()),
    homeLogo: v.optional(v.string()),
    rateCardTitle: v.optional(v.string()),
    rateCardItems: v.optional(
      v.array(
        v.object({
          service: v.string(),
          price: v.string(),
          description: v.optional(v.string()),
        })
      )
    ),
    whatsappNumber: v.optional(v.string()),
    maintenanceMode: v.boolean(),
    footerText: v.optional(v.string()),
  }),

  products: defineTable({
    name: v.string(),
    price: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    order: v.number(),
    isActive: v.boolean(),
  }),

  socialLinks: defineTable({
    platform: v.string(),
    url: v.string(),
    icon: v.optional(v.string()),
    order: v.number(),
    isActive: v.boolean(),
  }),

  brands: defineTable({
    name: v.string(),
    logoUrl: v.optional(v.string()),
    order: v.number(),
    isActive: v.boolean(),
  }),
});
