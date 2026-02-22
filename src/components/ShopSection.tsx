"use client";

import { motion } from "framer-motion";
import { ShoppingBag, ImageIcon } from "lucide-react";
import Image from "next/image";

interface Product {
    _id: string;
    name: string;
    price: string;
    description?: string;
    imageUrl?: string;
}

interface ShopSectionProps {
    products: Product[];
    onProductClick: (product: Product) => void;
}

export default function ShopSection({ products, onProductClick }: ShopSectionProps) {
    if (!products || products.length === 0) return null;

    return (
        <motion.div
            className="section-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="section-title">
                <ShoppingBag className="section-title-icon" />
                Shop With Me
            </h2>
            <div className="shop-grid">
                {products.map((product, index) => (
                    <motion.div
                        key={product._id}
                        className="product-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.08 }}
                        onClick={() => onProductClick(product)}
                    >
                        <div className="product-image-wrapper">
                            {product.imageUrl ? (
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    fill
                                    className="product-image"
                                    sizes="(max-width: 480px) 50vw, 200px"
                                />
                            ) : (
                                <div className="no-image-placeholder">
                                    <ImageIcon size={32} />
                                </div>
                            )}
                        </div>
                        <div className="product-info">
                            <h3 className="product-name">{product.name}</h3>
                            <p className="product-price">{product.price}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
