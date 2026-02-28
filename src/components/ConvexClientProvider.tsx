"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    const convex = useMemo(() => {
        const url = process.env.NEXT_PUBLIC_CONVEX_URL;
        if (!url) {
            // During SSR/prerender on Vercel, env var might not be available
            // Return a dummy client that won't make real requests
            return new ConvexReactClient("https://placeholder.convex.cloud");
        }
        return new ConvexReactClient(url);
    }, []);

    return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
