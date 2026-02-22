import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";

export const metadata: Metadata = {
  title: "Missy | Skincare Influencer & Beauty Expert",
  description:
    "Welcome to Missy's world of skincare — honest reviews, expert tips, and curated product recommendations for your best skin ever.",
  keywords: ["skincare", "beauty", "influencer", "missy", "skincare tips", "beauty products"],
  openGraph: {
    title: "Missy | Skincare Influencer & Beauty Expert",
    description: "Honest reviews, expert tips, and curated product recommendations.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
