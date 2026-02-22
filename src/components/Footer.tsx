"use client";

import { motion } from "framer-motion";

interface FooterProps {
    footerText?: string;
}

export default function Footer({ footerText }: FooterProps) {
    return (
        <motion.footer
            className="footer"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <p className="footer-text">
                {footerText || "© 2026 Missy. All rights reserved."}
            </p>
        </motion.footer>
    );
}
