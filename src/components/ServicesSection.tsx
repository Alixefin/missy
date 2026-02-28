"use client";

import { motion } from "framer-motion";
import { Briefcase, CheckCircle } from "lucide-react";

interface Service {
    _id: string;
    name: string;
    description?: string;
    icon?: string;
}

interface ServicesSectionProps {
    services: Service[];
}

export default function ServicesSection({ services }: ServicesSectionProps) {
    if (!services || services.length === 0) return null;

    return (
        <motion.div
            className="section-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="section-title">
                <Briefcase className="section-title-icon" />
                Services
            </h2>
            <div className="services-grid">
                {services.map((service, index) => (
                    <motion.div
                        key={service._id}
                        className="service-card"
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.06 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                    >
                        <div className="service-icon-wrapper">
                            <CheckCircle size={20} />
                        </div>
                        <div className="service-content">
                            <h3 className="service-name">{service.name}</h3>
                            {service.description && (
                                <p className="service-description">{service.description}</p>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
