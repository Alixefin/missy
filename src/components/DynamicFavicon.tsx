"use client";

import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function DynamicFavicon() {
    const settings = useQuery(api.siteSettings.get);

    useEffect(() => {
        const logoUrl = settings?.homeLogoUrl || settings?.profileImageUrl;
        if (!logoUrl) return;

        // Update existing favicon link or create a new one
        let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
        if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
        }
        link.href = logoUrl;
        link.type = "image/x-icon";

        // Also update apple-touch-icon
        let appleLink = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement | null;
        if (!appleLink) {
            appleLink = document.createElement("link");
            appleLink.rel = "apple-touch-icon";
            document.head.appendChild(appleLink);
        }
        appleLink.href = logoUrl;
    }, [settings?.homeLogoUrl, settings?.profileImageUrl]);

    return null;
}
