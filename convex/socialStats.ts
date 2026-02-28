import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        const stats = await ctx.db.query("socialStats").collect();
        return stats.filter((s) => s.isActive).sort((a, b) => a.order - b.order);
    },
});

export const listAll = query({
    args: {},
    handler: async (ctx) => {
        const stats = await ctx.db.query("socialStats").collect();
        return stats.sort((a, b) => a.order - b.order);
    },
});

export const create = mutation({
    args: {
        platform: v.string(),
        followers: v.optional(v.string()),
        engagement: v.optional(v.string()),
        avgLikes: v.optional(v.string()),
        avgComments: v.optional(v.string()),
        customStats: v.optional(
            v.array(
                v.object({
                    label: v.string(),
                    value: v.string(),
                })
            )
        ),
        order: v.number(),
        isActive: v.boolean(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("socialStats", args);
    },
});

export const update = mutation({
    args: {
        id: v.id("socialStats"),
        platform: v.optional(v.string()),
        followers: v.optional(v.string()),
        engagement: v.optional(v.string()),
        avgLikes: v.optional(v.string()),
        avgComments: v.optional(v.string()),
        customStats: v.optional(
            v.array(
                v.object({
                    label: v.string(),
                    value: v.string(),
                })
            )
        ),
        order: v.optional(v.number()),
        isActive: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { id, ...data } = args;
        await ctx.db.patch(id, data);
    },
});

export const remove = mutation({
    args: { id: v.id("socialStats") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
