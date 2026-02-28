"use client";

import { motion } from "framer-motion";
import { Star, MessageCircle } from "lucide-react";

interface Testimonial {
    _id: string;
    name: string;
    text: string;
    rating?: number;
}

interface TestimonialsSectionProps {
    testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
    if (!testimonials || testimonials.length === 0) return null;

    return (
        <motion.div
            className="section-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="section-title">
                <MessageCircle className="section-title-icon" />
                Testimonials
            </h2>
            <div className="testimonials-list">
                {testimonials.map((t, index) => (
                    <motion.div
                        key={t._id}
                        className="testimonial-card"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                        {t.rating && t.rating > 0 && (
                            <div className="testimonial-stars">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        size={14}
                                        className={i < t.rating! ? "star-filled" : "star-empty"}
                                    />
                                ))}
                            </div>
                        )}
                        <p className="testimonial-text">&ldquo;{t.text}&rdquo;</p>
                        <div className="testimonial-author">
                            <div className="testimonial-avatar">
                                {t.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="testimonial-name">{t.name}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
