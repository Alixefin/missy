import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        const links = await ctx.db.query("socialLinks").collect();
        return links.filter((l) => l.isActive).sort((a, b) => a.order - b.order);
    },
});

export const listAll = query({
    args: {},
    handler: async (ctx) => {
        const links = await ctx.db.query("socialLinks").collect();
        return links.sort((a, b) => a.order - b.order);
    },
});

export const create = mutation({
    args: {
        platform: v.string(),
        url: v.string(),
        icon: v.optional(v.string()),
        order: v.number(),
        isActive: v.boolean(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("socialLinks", args);
    },
});

export const update = mutation({
    args: {
        id: v.id("socialLinks"),
        platform: v.optional(v.string()),
        url: v.optional(v.string()),
        icon: v.optional(v.string()),
        order: v.optional(v.number()),
        isActive: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { id, ...data } = args;
        await ctx.db.patch(id, data);
    },
});

export const remove = mutation({
    args: { id: v.id("socialLinks") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
