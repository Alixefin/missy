"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function LoadingScreen({ onComplete, loadingImageUrl }: { onComplete: () => void, loadingImageUrl?: string }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 500); // Wait for exit animation
        }, 3000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="loading-screen"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        className="loading-logo-container"
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', height: 'auto', width: 'auto' }}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <Image
                            src={loadingImageUrl || "/logo.svg"}
                            alt="Missy Logo"
                            width={120}
                            height={120}
                            className="loading-logo"
                            priority
                            style={{ objectFit: 'contain', width: 'auto', height: '120px', borderRadius: 0, zIndex: 1 }}
                        />
                        <div style={{ position: 'relative', width: '40px', height: '40px' }}>
                            <div className="loading-spinner" />
                            <div className="loading-spinner-inner" style={{ inset: '6px' }} />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
