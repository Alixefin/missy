"use client";

import { motion } from "framer-motion";
import { Wrench } from "lucide-react";

export default function MaintenancePage() {
    return (
        <motion.div
            className="maintenance-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
            >
                <Wrench className="maintenance-icon" />
            </motion.div>
            <motion.h1
                className="maintenance-title"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                We&apos;ll Be Right Back
            </motion.h1>
            <motion.p
                className="maintenance-text"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                We&apos;re currently making some improvements to give you a better experience.
                Please check back soon!
            </motion.p>
        </motion.div>
    );
}
