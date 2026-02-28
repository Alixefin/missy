"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import LoadingScreen from "@/components/LoadingScreen";
import ProfileSection from "@/components/ProfileSection";
import AboutSection from "@/components/AboutSection";
import SocialLinks from "@/components/SocialLinks";
import BrandsSection from "@/components/BrandsSection";
import RateCard from "@/components/RateCard";
import ShopSection from "@/components/ShopSection";
import ProductModal from "@/components/ProductModal";
import Footer from "@/components/Footer";
import TestimonialsSection from "@/components/TestimonialsSection";
import MaintenancePage from "@/components/MaintenancePage";

interface Product {
  _id: string;
  name: string;
  price: string;
  description?: string;
  imageUrl?: string;
}

export default function HomePage() {
  const [showLoading, setShowLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const settings = useQuery(api.siteSettings.get);
  const products = useQuery(api.products.list);
  const socialLinks = useQuery(api.socialLinks.list);
  const brands = useQuery(api.brands.list);
  const testimonials = useQuery(api.testimonials.list);
  const initSettings = useMutation(api.siteSettings.initialize);

  const handleLoadingComplete = useCallback(() => {
    setShowLoading(false);
    // Initialize default settings if none exist
    if (settings === null) {
      initSettings();
    }
  }, [settings, initSettings]);

  // If data is still loading from Convex
  if (settings === undefined) {
    return <LoadingScreen onComplete={() => { }} isLoadingSettings={true} />;
  }

  // Show loading screen
  if (showLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} loadingImageUrl={settings?.loadingImageUrl} isLoadingSettings={false} />;
  }

  // Check maintenance mode
  if (settings?.maintenanceMode) {
    return <MaintenancePage />;
  }

  return (
    <>
      <main className="main-container">
        <ProfileSection
          profileImageUrl={settings?.profileImageUrl}
          homeLogoUrl={settings?.homeLogoUrl}
          brandName={settings?.brandName || "Missy"}
          tagline={settings?.tagline}
        />

        <AboutSection aboutText={settings?.aboutText} />

        <SocialLinks links={socialLinks || []} />

        <BrandsSection brands={brands || []} />

        <TestimonialsSection testimonials={testimonials || []} />

        <RateCard
          title={settings?.rateCardTitle}
          items={settings?.rateCardItems}
        />

        <ShopSection
          products={products || []}
          onProductClick={setSelectedProduct}
        />

        <Footer footerText={settings?.footerText} />
      </main>

      <ProductModal
        product={selectedProduct}
        whatsappNumber={settings?.whatsappNumber}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
