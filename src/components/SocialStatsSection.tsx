"use client";

import { motion } from "framer-motion";
import {
    BarChart3,
    Users,
    TrendingUp,
    Heart,
    MessageSquare,
    Instagram,
    Youtube,
    Music2,
    Twitter,
    Globe,
    Facebook,
    Linkedin,
} from "lucide-react";

interface CustomStat {
    label: string;
    value: string;
}

interface SocialStat {
    _id: string;
    platform: string;
    followers?: string;
    engagement?: string;
    avgLikes?: string;
    avgComments?: string;
    customStats?: CustomStat[];
}

interface SocialStatsSectionProps {
    stats: SocialStat[];
}

const platformIcons: Record<string, React.ReactNode> = {
    instagram: <Instagram size={22} />,
    youtube: <Youtube size={22} />,
    tiktok: <Music2 size={22} />,
    twitter: <Twitter size={22} />,
    x: <Twitter size={22} />,
    facebook: <Facebook size={22} />,
    linkedin: <Linkedin size={22} />,
    website: <Globe size={22} />,
};

const platformColors: Record<string, string> = {
    instagram: "linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)",
    youtube: "linear-gradient(135deg, #FF0000, #CC0000)",
    tiktok: "linear-gradient(135deg, #010101, #69C9D0)",
    twitter: "linear-gradient(135deg, #1DA1F2, #0D8BD9)",
    x: "linear-gradient(135deg, #000000, #333333)",
    facebook: "linear-gradient(135deg, #1877F2, #0D65D9)",
    linkedin: "linear-gradient(135deg, #0077B5, #005E93)",
};

export default function SocialStatsSection({ stats }: SocialStatsSectionProps) {
    if (!stats || stats.length === 0) return null;

    return (
        <motion.div
            className="section-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="section-title">
                <BarChart3 className="section-title-icon" />
                Social Media Demographics
            </h2>
            <div className="stats-platforms">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat._id}
                        className="stats-platform-card"
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.08 }}
                    >
                        <div className="stats-platform-header">
                            <div
                                className="stats-platform-icon"
                                style={{
                                    background:
                                        platformColors[stat.platform.toLowerCase()] ||
                                        "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
                                }}
                            >
                                {platformIcons[stat.platform.toLowerCase()] || <Globe size={22} />}
                            </div>
                            <h3 className="stats-platform-name">{stat.platform}</h3>
                        </div>

                        <div className="stats-grid">
                            {stat.followers && (
                                <div className="stat-item">
                                    <Users size={16} className="stat-icon" />
                                    <div className="stat-value">{stat.followers}</div>
                                    <div className="stat-label">Followers</div>
                                </div>
                            )}
                            {stat.engagement && (
                                <div className="stat-item">
                                    <TrendingUp size={16} className="stat-icon" />
                                    <div className="stat-value">{stat.engagement}</div>
                                    <div className="stat-label">Engagement</div>
                                </div>
                            )}
                            {stat.avgLikes && (
                                <div className="stat-item">
                                    <Heart size={16} className="stat-icon" />
                                    <div className="stat-value">{stat.avgLikes}</div>
                                    <div className="stat-label">Avg. Likes</div>
                                </div>
                            )}
                            {stat.avgComments && (
                                <div className="stat-item">
                                    <MessageSquare size={16} className="stat-icon" />
                                    <div className="stat-value">{stat.avgComments}</div>
                                    <div className="stat-label">Avg. Comments</div>
                                </div>
                            )}
                            {stat.customStats?.map((cs, i) => (
                                <div key={i} className="stat-item">
                                    <BarChart3 size={16} className="stat-icon" />
                                    <div className="stat-value">{cs.value}</div>
                                    <div className="stat-label">{cs.label}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
