"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

function isValidConvexUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return parsed.protocol === "https:";
    } catch {
        return false;
    }
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    const convex = useMemo(() => {
        const url = process.env.NEXT_PUBLIC_CONVEX_URL;
        if (!url || !isValidConvexUrl(url)) {
            // During SSR/prerender or if URL is malformed, use placeholder
            console.warn(
                "NEXT_PUBLIC_CONVEX_URL is missing or invalid:",
                url ? "(invalid URL)" : "(not set)"
            );
            return new ConvexReactClient("https://placeholder.convex.cloud");
        }
        return new ConvexReactClient(url);
    }, []);

    return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
