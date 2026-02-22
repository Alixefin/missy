import { mutation } from "./_generated/server";

export const migrate = mutation({
    args: {},
    handler: async (ctx) => {
        // 1. Migrate Products
        const products = await ctx.db.query("products").collect();
        for (const product of products) {
            if (product.price.includes("$")) {
                const newPrice = product.price.replace(/\$/g, "₦");
                await ctx.db.patch(product._id, { price: newPrice });
            }
        }

        // 2. Migrate Rate Cards in siteSettings
        const settings = await ctx.db.query("siteSettings").first();
        if (settings && settings.rateCardItems) {
            let changed = false;
            const updatedItems = settings.rateCardItems.map((item) => {
                if (item.price.includes("$")) {
                    changed = true;
                    return { ...item, price: item.price.replace(/\$/g, "₦") };
                }
                return item;
            });

            if (changed) {
                await ctx.db.patch(settings._id, { rateCardItems: updatedItems });
            }
        }
    },
});
