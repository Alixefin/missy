import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        const testimonials = await ctx.db
            .query("testimonials")
            .collect();
        return testimonials
            .filter((t) => t.isActive)
            .sort((a, b) => a.order - b.order);
    },
});

export const listAll = query({
    args: {},
    handler: async (ctx) => {
        const testimonials = await ctx.db
            .query("testimonials")
            .collect();
        return testimonials.sort((a, b) => a.order - b.order);
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        text: v.string(),
        rating: v.optional(v.number()),
        order: v.number(),
        isActive: v.boolean(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("testimonials", args);
    },
});

export const update = mutation({
    args: {
        id: v.id("testimonials"),
        name: v.optional(v.string()),
        text: v.optional(v.string()),
        rating: v.optional(v.number()),
        isActive: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        await ctx.db.patch(id, updates);
    },
});

export const remove = mutation({
    args: { id: v.id("testimonials") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
