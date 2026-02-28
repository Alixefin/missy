"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function LoadingScreen({
    onComplete,
    loadingImageUrl,
    isLoadingSettings = false
}: {
    onComplete: () => void,
    loadingImageUrl?: string,
    isLoadingSettings?: boolean
}) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Only start the 3-second timer once settings have finished loading
        if (isLoadingSettings) return;

        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 500); // Wait for exit animation
        }, 3000);
        return () => clearTimeout(timer);
    }, [onComplete, isLoadingSettings]);

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
                        {!isLoadingSettings && (
                            <motion.div
                                animate={{ scale: [1, 1.15, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
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
                            </motion.div>
                        )}
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
