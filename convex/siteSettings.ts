import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    args: {},
    handler: async (ctx) => {
        const settings = await ctx.db.query("siteSettings").first();
        if (!settings) {
            return null;
        }
        let profileImageUrl = settings.profileImage;
        if (settings.profileImage && settings.profileImage.startsWith("kg")) {
            try {
                profileImageUrl = await ctx.storage.getUrl(settings.profileImage as any) ?? undefined;
            } catch { }
        }

        let loadingImageUrl = settings.loadingImage;
        if (settings.loadingImage && settings.loadingImage.startsWith("kg")) {
            try {
                loadingImageUrl = await ctx.storage.getUrl(settings.loadingImage as any) ?? undefined;
            } catch { }
        }

        let homeLogoUrl = settings.homeLogo;
        if (settings.homeLogo && settings.homeLogo.startsWith("kg")) {
            try {
                homeLogoUrl = await ctx.storage.getUrl(settings.homeLogo as any) ?? undefined;
            } catch { }
        }

        return { ...settings, profileImageUrl, loadingImageUrl, homeLogoUrl };
    },
});

export const update = mutation({
    args: {
        profileImage: v.optional(v.string()),
        loadingImage: v.optional(v.string()),
        homeLogo: v.optional(v.string()),
        brandName: v.optional(v.string()),
        tagline: v.optional(v.string()),
        aboutText: v.optional(v.string()),
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
        maintenanceMode: v.optional(v.boolean()),
        footerText: v.optional(v.string()),
        phoneNumber: v.optional(v.string()),
        email: v.optional(v.string()),
        contactAddress: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.query("siteSettings").first();
        if (existing) {
            await ctx.db.patch(existing._id, args);
            return existing._id;
        } else {
            return await ctx.db.insert("siteSettings", {
                brandName: args.brandName || "Missy",
                maintenanceMode: args.maintenanceMode ?? false,
                ...args,
            });
        }
    },
});

export const initialize = mutation({
    args: {},
    handler: async (ctx) => {
        const existing = await ctx.db.query("siteSettings").first();
        if (!existing) {
            await ctx.db.insert("siteSettings", {
                brandName: "Missy",
                tagline: "Skincare Influencer & Beauty Expert",
                aboutText:
                    "Welcome to my world of skincare! I'm Missy, a passionate skincare enthusiast dedicated to helping you achieve your best skin ever. Through honest reviews, expert tips, and curated product recommendations, I'm here to guide you on your skincare journey.",
                rateCardTitle: "Collaboration Rates",
                rateCardItems: [
                    {
                        service: "Instagram Story",
                        price: "₦150",
                        description: "1-3 story frames with product mention",
                    },
                    {
                        service: "Instagram Reel",
                        price: "₦500",
                        description: "30-60sec dedicated reel",
                    },
                    {
                        service: "TikTok Video",
                        price: "₦400",
                        description: "15-60sec product feature",
                    },
                    {
                        service: "Full Campaign",
                        price: "₦1,200",
                        description: "Multi-platform content package",
                    },
                ],
                whatsappNumber: "1234567890",
                maintenanceMode: false,
                footerText: "© 2026 Missy. All rights reserved.",
            });
        }
    },
});
