"use client";

import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";

interface RateItem {
    service: string;
    price: string;
    description?: string;
}

interface RateCardProps {
    title?: string;
    items?: RateItem[];
}

export default function RateCard({ title, items }: RateCardProps) {
    if (!items || items.length === 0) return null;

    return (
        <motion.div
            className="section-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="section-title">
                <CreditCard className="section-title-icon" />
                {title || "Rate Card"}
            </h2>
            <div className="rate-card-list">
                {items.map((item, index) => (
                    <motion.div
                        key={index}
                        className="rate-item"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.08 }}
                    >
                        <div className="rate-service">
                            <span className="rate-service-name">{item.service}</span>
                            {item.description && (
                                <span className="rate-service-desc">{item.description}</span>
                            )}
                        </div>
                        <span className="rate-price">{item.price}</span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
