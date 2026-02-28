import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        const brands = await ctx.db.query("brands").collect();
        const activeBrands = brands.filter((b) => b.isActive).sort((a, b) => a.order - b.order);

        // Resolve storage IDs to URLs for logos
        return await Promise.all(
            activeBrands.map(async (brand) => {
                let resolvedLogoUrl = brand.logoUrl;
                if (brand.logoUrl && brand.logoUrl.startsWith("kg")) {
                    try {
                        resolvedLogoUrl = await ctx.storage.getUrl(brand.logoUrl as any) ?? undefined;
                    } catch { }
                }
                return { ...brand, logoUrl: resolvedLogoUrl };
            })
        );
    },
});

export const listAll = query({
    args: {},
    handler: async (ctx) => {
        const brands = await ctx.db.query("brands").collect();
        const sorted = brands.sort((a, b) => a.order - b.order);

        // Resolve storage IDs to URLs for logos
        return await Promise.all(
            sorted.map(async (brand) => {
                let resolvedLogoUrl = brand.logoUrl;
                if (brand.logoUrl && brand.logoUrl.startsWith("kg")) {
                    try {
                        resolvedLogoUrl = await ctx.storage.getUrl(brand.logoUrl as any) ?? undefined;
                    } catch { }
                }
                return { ...brand, logoUrl: resolvedLogoUrl };
            })
        );
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        logoUrl: v.optional(v.string()),
        order: v.number(),
        isActive: v.boolean(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("brands", args);
    },
});

export const update = mutation({
    args: {
        id: v.id("brands"),
        name: v.optional(v.string()),
        logoUrl: v.optional(v.string()),
        order: v.optional(v.number()),
        isActive: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { id, ...data } = args;
        await ctx.db.patch(id, data);
    },
});

export const remove = mutation({
    args: { id: v.id("brands") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
