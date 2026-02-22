"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, MessageCircle, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Product {
    _id: string;
    name: string;
    price: string;
    description?: string;
    imageUrl?: string;
}

interface ProductModalProps {
    product: Product | null;
    whatsappNumber?: string;
    onClose: () => void;
}

export default function ProductModal({
    product,
    whatsappNumber,
    onClose,
}: ProductModalProps) {
    const [quantity, setQuantity] = useState(1);
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");

    if (!product) return null;

    const handleWhatsApp = () => {
        if (!customerName.trim()) return;

        const message = encodeURIComponent(
            `Hello! I'd like to order:\n\n` +
            `🛍️ Product: ${product.name}\n` +
            `💰 Price: ${product.price}\n` +
            `📦 Quantity: ${quantity}\n\n` +
            `My Details:\n` +
            `👤 Name: ${customerName}\n` +
            `📱 Phone: ${customerPhone || "N/A"}\n\n` +
            `Thank you! 🙏`
        );

        const phone = whatsappNumber?.replace(/\D/g, "") || "";
        const url = `https://wa.me/${phone}?text=${message}`;
        window.open(url, "_blank");
    };

    return (
        <AnimatePresence>
            <motion.div
                className="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="modal-content"
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="modal-image-wrapper">
                        {product.imageUrl ? (
                            <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="modal-image"
                                sizes="480px"
                            />
                        ) : (
                            <div className="no-image-placeholder">
                                <ImageIcon size={64} />
                            </div>
                        )}
                        <button className="modal-close" onClick={onClose}>
                            <X size={18} />
                        </button>
                    </div>

                    <div className="modal-body">
                        <h2 className="modal-product-name">{product.name}</h2>
                        <p className="modal-product-price">{product.price}</p>
                        {product.description && (
                            <p className="modal-product-desc">{product.description}</p>
                        )}

                        <div className="modal-form">
                            <div>
                                <label className="modal-form-label">Quantity</label>
                                <div className="modal-quantity">
                                    <button
                                        className="modal-qty-btn"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="modal-qty-value">{quantity}</span>
                                    <button
                                        className="modal-qty-btn"
                                        onClick={() => setQuantity(quantity + 1)}
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="modal-form-label">Your Name *</label>
                                <input
                                    type="text"
                                    className="modal-form-input"
                                    placeholder="Enter your name"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="modal-form-label">Phone Number</label>
                                <input
                                    type="tel"
                                    className="modal-form-input"
                                    placeholder="Enter your phone number"
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                />
                            </div>

                            <button
                                className="whatsapp-btn"
                                onClick={handleWhatsApp}
                                disabled={!customerName.trim()}
                            >
                                <MessageCircle size={20} />
                                Order via WhatsApp
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
