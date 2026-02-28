import { action, mutation, query, internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const login = action({
    args: { password: v.string() },
    handler: async (ctx, args) => {
        // Check DB password first
        try {
            const config = await ctx.runQuery(internal.admin.getAdminConfig);
            if (config && config.password) {
                if (args.password === config.password) {
                    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
                    return { success: true, token };
                }
                return { success: false, token: null };
            }
        } catch {
            // DB not ready or internal function not synced, fall through to env var
        }

        // Fallback to env var
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (!adminPassword) {
            throw new Error("Admin password not configured. Set ADMIN_PASSWORD in Convex environment variables.");
        }
        if (args.password === adminPassword) {
            // Seed the DB with the env password for future use
            try {
                await ctx.runMutation(internal.admin.initializePassword, { password: adminPassword });
            } catch {
                // Ignore if seeding fails
            }
            const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
            return { success: true, token };
        }
        return { success: false, token: null };
    },
});

export const getAdminConfig = internalQuery({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("adminConfig").first();
    },
});

// Get password for admin dashboard display
// Uses DB only — env var is only accessible in actions
export const getPassword = query({
    args: {},
    handler: async (ctx) => {
        const config = await ctx.db.query("adminConfig").first();
        if (config) {
            return { password: config.password };
        }
        // No DB password yet — show placeholder
        return { password: "(set via environment variable — login once to sync)" };
    },
});

export const initializePassword = internalMutation({
    args: { password: v.string() },
    handler: async (ctx, args) => {
        const existing = await ctx.db.query("adminConfig").first();
        if (!existing) {
            await ctx.db.insert("adminConfig", { password: args.password });
        }
    },
});

export const changePassword = mutation({
    args: {
        currentPassword: v.string(),
        newPassword: v.string(),
    },
    handler: async (ctx, args) => {
        const config = await ctx.db.query("adminConfig").first();

        if (config) {
            if (config.password !== args.currentPassword) {
                throw new Error("Current password is incorrect");
            }
            await ctx.db.patch(config._id, { password: args.newPassword });
        } else {
            // No DB record — user must login first to sync env var password
            throw new Error("Please login first to initialize password, then try changing it.");
        }

        return { success: true };
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
