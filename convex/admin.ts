import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const login = action({
    args: { password: v.string() },
    handler: async (ctx, args) => {
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (!adminPassword) {
            throw new Error("Admin password not configured");
        }
        if (args.password === adminPassword) {
            // Generate a simple session token
            const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
            return { success: true, token };
        }
        return { success: false, token: null };
    },
});

export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
        return await ctx.storage.generateUploadUrl();
    },
});

export const getImageUrl = query({
    args: { storageId: v.string() },
    handler: async (ctx, args) => {
        try {
            return await ctx.storage.getUrl(args.storageId as any);
        } catch {
            return null;
        }
    },
});
