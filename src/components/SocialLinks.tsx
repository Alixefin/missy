"use client";

import { motion } from "framer-motion";
import { Share2, Instagram, Youtube, Music2, Twitter, Globe, Facebook, Linkedin, MessageCircle } from "lucide-react";

interface SocialLink {
    _id: string;
    platform: string;
    url: string;
    icon?: string;
}

interface SocialLinksProps {
    links: SocialLink[];
}

const platformIcons: Record<string, React.ReactNode> = {
    instagram: <Instagram />,
    youtube: <Youtube />,
    tiktok: <Music2 />,
    twitter: <Twitter />,
    x: <Twitter />,
    facebook: <Facebook />,
    linkedin: <Linkedin />,
    whatsapp: <MessageCircle />,
    website: <Globe />,
};

export default function SocialLinks({ links }: SocialLinksProps) {
    if (!links || links.length === 0) return null;

    return (
        <motion.div
            className="section-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            <h2 className="section-title">
                <Share2 className="section-title-icon" />
                Connect With Me
            </h2>
            <div className="social-links-grid">
                {links.map((link, index) => (
                    <motion.a
                        key={link._id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link-btn"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {platformIcons[link.platform.toLowerCase()] || <Globe />}
                        {link.platform}
                    </motion.a>
                ))}
            </div>
        </motion.div>
    );
}
