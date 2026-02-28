"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface ProfileSectionProps {
    profileImageUrl?: string | null;
    homeLogoUrl?: string | null;
    brandName: string;
    tagline?: string;
}

export default function ProfileSection({
    profileImageUrl,
    homeLogoUrl,
    brandName,
    tagline,
}: ProfileSectionProps) {
    return (
        <motion.div
            className="profile-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
        >
            <div className="profile-image-wrapper">
                <div className="profile-image-ring" />
                {profileImageUrl ? (
                    <Image
                        src={profileImageUrl}
                        alt={brandName}
                        width={160}
                        height={160}
                        className="profile-image"
                        priority
                    />
                ) : (
                    <div
                        className="profile-image"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "linear-gradient(135deg, #E8707A, #D4565F)",
                            color: "white",
                            fontSize: "56px",
                            fontFamily: "var(--font-heading)",
                            fontWeight: 700,
                        }}
                    >
                        {brandName.charAt(0)}
                    </div>
                )}
            </div>
            {homeLogoUrl && (
                <div style={{ marginBottom: '12px' }}>
                    <Image
                        src={homeLogoUrl}
                        alt="Home Logo"
                        width={80}
                        height={40}
                        style={{ objectFit: 'contain', margin: '0 auto', maxWidth: '100%', height: 'auto', maxHeight: '60px' }}
                    />
                </div>
            )}
            <h1 className="brand-name">{brandName}</h1>
            {tagline && <p className="tagline">{tagline}</p>}
        </motion.div>
    );
}
