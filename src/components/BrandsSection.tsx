"use client";

import { motion } from "framer-motion";
import { Award } from "lucide-react";
import Image from "next/image";

interface Brand {
    _id: string;
    name: string;
    logoUrl?: string;
}

interface BrandsSectionProps {
    brands: Brand[];
}

export default function BrandsSection({ brands }: BrandsSectionProps) {
    if (!brands || brands.length === 0) return null;

    return (
        <motion.div
            className="section-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="section-title">
                <Award className="section-title-icon" />
                Brands I&apos;ve Worked With
            </h2>
            <div className="brands-grid">
                {brands.map((brand, index) => (
                    <motion.div
                        key={brand._id}
                        className="brand-item"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ scale: 1.08 }}
                    >
                        {brand.logoUrl ? (
                            <Image
                                src={brand.logoUrl}
                                alt={brand.name}
                                width={50}
                                height={50}
                                className="brand-logo"
                            />
                        ) : (
                            <div
                                className="brand-logo"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "linear-gradient(135deg, #E8707A, #F2A5AB)",
                                    color: "white",
                                    fontSize: "18px",
                                    fontWeight: 700,
                                    fontFamily: "var(--font-heading)",
                                }}
                            >
                                {brand.name.charAt(0)}
                            </div>
                        )}
                        <span className="brand-name-text">{brand.name}</span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
