"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";

interface AboutSectionProps {
    aboutText?: string;
}

export default function AboutSection({ aboutText }: AboutSectionProps) {
    if (!aboutText) return null;

    return (
        <motion.div
            className="section-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="section-title">
                <User className="section-title-icon" />
                About Me
            </h2>
            <p className="about-text">{aboutText}</p>
        </motion.div>
    );
}
