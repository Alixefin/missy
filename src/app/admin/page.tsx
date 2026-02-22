"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AdminLoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const login = useAction(api.admin.login);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await login({ password });
            if (result.success && result.token) {
                localStorage.setItem("missy_admin_token", result.token);
                router.push("/admin/dashboard");
            } else {
                setError("Incorrect password. Please try again.");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <motion.div
                className="admin-login-card"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                    <Image
                        src="/logo.svg"
                        alt="Missy"
                        width={56}
                        height={56}
                        style={{ margin: "0 auto 16px" }}
                    />
                </div>
                <h1 className="admin-login-title">Admin Panel</h1>
                <p className="admin-login-subtitle">
                    Enter your password to manage your site
                </p>

                <form onSubmit={handleLogin}>
                    {error && <p className="admin-error">{error}</p>}
                    <div style={{ position: "relative" }}>
                        <Lock
                            size={18}
                            style={{
                                position: "absolute",
                                left: "16px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#9ca3af",
                            }}
                        />
                        <input
                            type={showPassword ? "text" : "password"}
                            className="admin-input"
                            style={{ paddingLeft: "44px", paddingRight: "44px" }}
                            placeholder="Enter admin password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: "absolute",
                                right: "16px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#9ca3af",
                                padding: 0,
                            }}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <button className="admin-btn" type="submit" disabled={loading || !password}>
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
