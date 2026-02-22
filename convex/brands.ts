import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        const brands = await ctx.db.query("brands").collect();
        return brands.filter((b) => b.isActive).sort((a, b) => a.order - b.order);
    },
});

export const listAll = query({
    args: {},
    handler: async (ctx) => {
        const brands = await ctx.db.query("brands").collect();
        return brands.sort((a, b) => a.order - b.order);
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
