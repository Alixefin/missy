import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        const products = await ctx.db.query("products").collect();
        const activeProducts = products
            .filter((p) => p.isActive)
            .sort((a, b) => a.order - b.order);

        // Resolve storage IDs to URLs for product images
        return await Promise.all(
            activeProducts.map(async (product) => {
                let resolvedImageUrl = product.imageUrl;
                if (product.imageUrl && product.imageUrl.startsWith("kg")) {
                    try {
                        resolvedImageUrl = await ctx.storage.getUrl(product.imageUrl as any) ?? undefined;
                    } catch { }
                }
                return { ...product, imageUrl: resolvedImageUrl };
            })
        );
    },
});

export const listAll = query({
    args: {},
    handler: async (ctx) => {
        const products = await ctx.db.query("products").collect();
        const sorted = products.sort((a, b) => a.order - b.order);

        // Resolve storage IDs to URLs for product images
        return await Promise.all(
            sorted.map(async (product) => {
                let resolvedImageUrl = product.imageUrl;
                if (product.imageUrl && product.imageUrl.startsWith("kg")) {
                    try {
                        resolvedImageUrl = await ctx.storage.getUrl(product.imageUrl as any) ?? undefined;
                    } catch { }
                }
                return { ...product, imageUrl: resolvedImageUrl };
            })
        );
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        price: v.string(),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        order: v.number(),
        isActive: v.boolean(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("products", args);
    },
});

export const update = mutation({
    args: {
        id: v.id("products"),
        name: v.optional(v.string()),
        price: v.optional(v.string()),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        order: v.optional(v.number()),
        isActive: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { id, ...data } = args;
        await ctx.db.patch(id, data);
    },
});

export const remove = mutation({
    args: { id: v.id("products") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
