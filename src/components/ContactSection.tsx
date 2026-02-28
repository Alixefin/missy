"use client";

import { motion } from "framer-motion";
import {
    Mail,
    Phone,
    MapPin,
    Instagram,
    Youtube,
    Music2,
    Twitter,
    Globe,
    Facebook,
    Linkedin,
    MessageCircle,
    Send,
} from "lucide-react";

interface SocialLink {
    _id: string;
    platform: string;
    url: string;
}

interface ContactSectionProps {
    phoneNumber?: string;
    email?: string;
    address?: string;
    whatsappNumber?: string;
    socialLinks: SocialLink[];
}

const platformIcons: Record<string, React.ReactNode> = {
    instagram: <Instagram size={18} />,
    youtube: <Youtube size={18} />,
    tiktok: <Music2 size={18} />,
    twitter: <Twitter size={18} />,
    x: <Twitter size={18} />,
    facebook: <Facebook size={18} />,
    linkedin: <Linkedin size={18} />,
    whatsapp: <MessageCircle size={18} />,
    website: <Globe size={18} />,
};

export default function ContactSection({
    phoneNumber,
    email,
    address,
    whatsappNumber,
    socialLinks,
}: ContactSectionProps) {
    const hasContact = phoneNumber || email || address || whatsappNumber;
    const hasSocials = socialLinks && socialLinks.length > 0;

    if (!hasContact && !hasSocials) return null;

    return (
        <motion.div
            className="section-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="section-title">
                <Send className="section-title-icon" />
                Get In Touch
            </h2>

            {/* Contact Info */}
            {hasContact && (
                <div className="contact-info-list">
                    {phoneNumber && (
                        <motion.a
                            href={`tel:${phoneNumber}`}
                            className="contact-info-item"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="contact-info-icon">
                                <Phone size={18} />
                            </div>
                            <div className="contact-info-text">
                                <span className="contact-info-label">Phone</span>
                                <span className="contact-info-value">{phoneNumber}</span>
                            </div>
                        </motion.a>
                    )}

                    {email && (
                        <motion.a
                            href={`mailto:${email}`}
                            className="contact-info-item"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="contact-info-icon">
                                <Mail size={18} />
                            </div>
                            <div className="contact-info-text">
                                <span className="contact-info-label">Email</span>
                                <span className="contact-info-value">{email}</span>
                            </div>
                        </motion.a>
                    )}

                    {whatsappNumber && (
                        <motion.a
                            href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-info-item whatsapp"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="contact-info-icon whatsapp">
                                <MessageCircle size={18} />
                            </div>
                            <div className="contact-info-text">
                                <span className="contact-info-label">WhatsApp</span>
                                <span className="contact-info-value">{whatsappNumber}</span>
                            </div>
                        </motion.a>
                    )}

                    {address && (
                        <div className="contact-info-item">
                            <div className="contact-info-icon">
                                <MapPin size={18} />
                            </div>
                            <div className="contact-info-text">
                                <span className="contact-info-label">Location</span>
                                <span className="contact-info-value">{address}</span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Social Links */}
            {hasSocials && (
                <div className="contact-socials">
                    <p className="contact-socials-label">Follow me on</p>
                    <div className="contact-socials-grid">
                        {socialLinks.map((link, index) => (
                            <motion.a
                                key={link._id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact-social-btn"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                title={link.platform}
                            >
                                {platformIcons[link.platform.toLowerCase()] || <Globe size={18} />}
                            </motion.a>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
