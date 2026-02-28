"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import {
    User,
    FileText,
    Share2,
    Award,
    CreditCard,
    ShoppingBag,
    Settings,
    LogOut,
    ExternalLink,
    Plus,
    Trash2,
    Edit3,
    Upload,
    Save,
    X,
    ImageIcon,
    MessageCircle,
    Key,
    Eye,
    EyeOff,
    Star,
    Send,
    Briefcase,
    BarChart3,
} from "lucide-react";
import Image from "next/image";

type Tab = "profile" | "about" | "social" | "brands" | "testimonials" | "ratecard" | "products" | "settings" | "contact" | "services" | "demographics";

interface RateItem {
    service: string;
    price: string;
    description?: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("profile");
    const [saveMessage, setSaveMessage] = useState("");

    // Auth check
    useEffect(() => {
        const token = localStorage.getItem("missy_admin_token");
        if (!token) {
            router.push("/admin");
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("missy_admin_token");
        router.push("/admin");
    };

    const showSaveMessage = (msg: string = "Changes saved!") => {
        setSaveMessage(msg);
        setTimeout(() => setSaveMessage(""), 3000);
    };

    const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
        { key: "profile", label: "Profile", icon: <User size={16} /> },
        { key: "about", label: "About", icon: <FileText size={16} /> },
        { key: "social", label: "Social", icon: <Share2 size={16} /> },
        { key: "services", label: "Services", icon: <Briefcase size={16} /> },
        { key: "demographics", label: "Stats", icon: <BarChart3 size={16} /> },
        { key: "brands", label: "Brands", icon: <Award size={16} /> },
        { key: "testimonials", label: "Testimonials", icon: <MessageCircle size={16} /> },
        { key: "ratecard", label: "Rates", icon: <CreditCard size={16} /> },
        { key: "products", label: "Products", icon: <ShoppingBag size={16} /> },
        { key: "contact", label: "Contact", icon: <Send size={16} /> },
        { key: "settings", label: "Settings", icon: <Settings size={16} /> },
    ];

    return (
        <div className="admin-container">
            {saveMessage && <div className="save-success">{saveMessage}</div>}

            <div className="admin-header">
                <h1 className="admin-header-title">Dashboard</h1>
                <div className="admin-header-actions">
                    <a href="/" target="_blank" className="admin-header-link">
                        <ExternalLink size={14} style={{ display: "inline", marginRight: 4 }} />
                        View Site
                    </a>
                    <button className="admin-logout-btn" onClick={handleLogout}>
                        <LogOut size={14} style={{ display: "inline", marginRight: 4 }} />
                        Logout
                    </button>
                </div>
            </div>

            <div className="admin-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        className={`admin-tab ${activeTab === tab.key ? "active" : ""}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.icon}
                        <span style={{ marginLeft: 6 }}>{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="admin-panel">
                {activeTab === "profile" && <ProfilePanel onSave={showSaveMessage} />}
                {activeTab === "about" && <AboutPanel onSave={showSaveMessage} />}
                {activeTab === "social" && <SocialPanel onSave={showSaveMessage} />}
                {activeTab === "services" && <ServicesPanel onSave={showSaveMessage} />}
                {activeTab === "demographics" && <DemographicsPanel onSave={showSaveMessage} />}
                {activeTab === "brands" && <BrandsPanel onSave={showSaveMessage} />}
                {activeTab === "testimonials" && <TestimonialsPanel onSave={showSaveMessage} />}
                {activeTab === "ratecard" && <RateCardPanel onSave={showSaveMessage} />}
                {activeTab === "products" && <ProductsPanel onSave={showSaveMessage} />}
                {activeTab === "contact" && <ContactPanel onSave={showSaveMessage} />}
                {activeTab === "settings" && <SettingsPanel onSave={showSaveMessage} />}
            </div>
        </div>
    );
}

// ===== PROFILE PANEL =====
function ProfilePanel({ onSave }: { onSave: (msg?: string) => void }) {
    const settings = useQuery(api.siteSettings.get);
    const updateSettings = useMutation(api.siteSettings.update);
    const generateUploadUrl = useMutation(api.admin.generateUploadUrl);
    const [brandName, setBrandName] = useState("");
    const [tagline, setTagline] = useState("");
    const [uploading, setUploading] = useState(false);
    const [uploadingHomeLogo, setUploadingHomeLogo] = useState(false);
    const [uploadingLoadingImage, setUploadingLoadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const homeLogoInputRef = useRef<HTMLInputElement>(null);
    const loadingImageInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (settings) {
            setBrandName(settings.brandName || "");
            setTagline(settings.tagline || "");
        }
    }, [settings]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const uploadUrl = await generateUploadUrl();
            const result = await fetch(uploadUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });
            const { storageId } = await result.json();
            await updateSettings({ profileImage: storageId });
            onSave("Profile image updated!");
        } catch (err) {
            console.error("Upload failed:", err);
        } finally {
            setUploading(false);
        }
    };

    const handleHomeLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingHomeLogo(true);
        try {
            const uploadUrl = await generateUploadUrl();
            const result = await fetch(uploadUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });
            const { storageId } = await result.json();
            await updateSettings({ homeLogo: storageId });
            onSave("Home logo updated!");
        } catch (err) {
            console.error("Upload failed:", err);
        } finally {
            setUploadingHomeLogo(false);
        }
    };

    const handleLoadingImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingLoadingImage(true);
        try {
            const uploadUrl = await generateUploadUrl();
            const result = await fetch(uploadUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });
            const { storageId } = await result.json();
            await updateSettings({ loadingImage: storageId });
            onSave("Loading image updated!");
        } catch (err) {
            console.error("Upload failed:", err);
        } finally {
            setUploadingLoadingImage(false);
        }
    };

    const handleSave = async () => {
        await updateSettings({ brandName, tagline });
        onSave();
    };

    return (
        <div>
            <h2 className="admin-panel-title">Profile Settings</h2>

            <div className="admin-field">
                <label>Profile Image</label>
                <div
                    className="image-upload-area"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {settings?.profileImageUrl ? (
                        <img
                            src={settings.profileImageUrl}
                            alt="Profile"
                            className="image-upload-preview"
                            style={{ borderRadius: "50%" }}
                        />
                    ) : (
                        <ImageIcon size={32} style={{ color: "var(--color-primary-light)", marginBottom: 8 }} />
                    )}
                    <p className="image-upload-text">
                        {uploading ? "Uploading..." : "Click to upload profile image"}
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: "none" }}
                    />
                </div>
            </div>

            <div className="admin-field">
                <label>Home Logo (under profile picture)</label>
                <div
                    className="image-upload-area"
                    onClick={() => homeLogoInputRef.current?.click()}
                >
                    {settings?.homeLogoUrl ? (
                        <img
                            src={settings.homeLogoUrl}
                            alt="Home Logo"
                            className="image-upload-preview"
                            style={{ objectFit: "contain", maxHeight: "100px" }}
                        />
                    ) : (
                        <ImageIcon size={32} style={{ color: "var(--color-primary-light)", marginBottom: 8 }} />
                    )}
                    <p className="image-upload-text">
                        {uploadingHomeLogo ? "Uploading..." : "Click to upload homepage logo"}
                    </p>
                    <input
                        ref={homeLogoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleHomeLogoUpload}
                        style={{ display: "none" }}
                    />
                </div>
            </div>

            <div className="admin-field">
                <label>Loading Screen Image</label>
                <div
                    className="image-upload-area"
                    onClick={() => loadingImageInputRef.current?.click()}
                >
                    {settings?.loadingImageUrl ? (
                        <img
                            src={settings.loadingImageUrl}
                            alt="Loading Image"
                            className="image-upload-preview"
                            style={{ objectFit: "contain", maxHeight: "100px" }}
                        />
                    ) : (
                        <ImageIcon size={32} style={{ color: "var(--color-primary-light)", marginBottom: 8 }} />
                    )}
                    <p className="image-upload-text">
                        {uploadingLoadingImage ? "Uploading..." : "Click to upload loading screen image"}
                    </p>
                    <input
                        ref={loadingImageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLoadingImageUpload}
                        style={{ display: "none" }}
                    />
                </div>
            </div>

            <div className="admin-field">
                <label>Brand Name</label>
                <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Enter brand name"
                />
            </div>

            <div className="admin-field">
                <label>Tagline</label>
                <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="Enter tagline"
                />
            </div>

            <button className="admin-save-btn" onClick={handleSave}>
                <Save size={16} style={{ display: "inline", marginRight: 6 }} />
                Save Changes
            </button>
        </div>
    );
}

// ===== ABOUT PANEL =====
function AboutPanel({ onSave }: { onSave: (msg?: string) => void }) {
    const settings = useQuery(api.siteSettings.get);
    const updateSettings = useMutation(api.siteSettings.update);
    const [aboutText, setAboutText] = useState("");

    useEffect(() => {
        if (settings) {
            setAboutText(settings.aboutText || "");
        }
    }, [settings]);

    const handleSave = async () => {
        await updateSettings({ aboutText });
        onSave();
    };

    return (
        <div>
            <h2 className="admin-panel-title">About Section</h2>
            <div className="admin-field">
                <label>About Text</label>
                <textarea
                    rows={6}
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    placeholder="Write about yourself..."
                />
            </div>
            <button className="admin-save-btn" onClick={handleSave}>
                <Save size={16} style={{ display: "inline", marginRight: 6 }} />
                Save Changes
            </button>
        </div>
    );
}

// ===== SOCIAL LINKS PANEL =====
function SocialPanel({ onSave }: { onSave: (msg?: string) => void }) {
    const links = useQuery(api.socialLinks.listAll);
    const createLink = useMutation(api.socialLinks.create);
    const updateLink = useMutation(api.socialLinks.update);
    const removeLink = useMutation(api.socialLinks.remove);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [platform, setPlatform] = useState("");
    const [url, setUrl] = useState("");

    const platforms = ["Instagram", "TikTok", "YouTube", "Twitter", "Facebook", "LinkedIn", "WhatsApp", "Website"];

    const resetForm = () => {
        setPlatform("");
        setUrl("");
        setEditId(null);
        setShowForm(false);
    };

    const handleSave = async () => {
        if (editId) {
            await updateLink({ id: editId as any, platform, url });
        } else {
            await createLink({
                platform,
                url,
                order: (links?.length || 0) + 1,
                isActive: true,
            });
        }
        resetForm();
        onSave();
    };

    const handleEdit = (link: any) => {
        setPlatform(link.platform);
        setUrl(link.url);
        setEditId(link._id);
        setShowForm(true);
    };

    const handleDelete = async (id: any) => {
        await removeLink({ id });
        onSave("Link deleted!");
    };

    return (
        <div>
            <h2 className="admin-panel-title">Social Links</h2>

            {links?.map((link) => (
                <div key={link._id} className="admin-list-item">
                    <div className="admin-list-item-info">
                        <div className="admin-list-item-text">
                            <div className="admin-list-item-title">{link.platform}</div>
                            <div className="admin-list-item-subtitle">{link.url}</div>
                        </div>
                    </div>
                    <div className="admin-list-item-actions">
                        <button className="admin-icon-btn" onClick={() => handleEdit(link)}>
                            <Edit3 size={14} />
                        </button>
                        <button
                            className="admin-icon-btn danger"
                            onClick={() => handleDelete(link._id)}
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            ))}

            {showForm && (
                <div className="admin-modal-overlay" onClick={resetForm}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="admin-modal-title">
                            {editId ? "Edit Link" : "Add Social Link"}
                        </h3>
                        <div className="admin-field">
                            <label>Platform</label>
                            <select
                                value={platform}
                                onChange={(e) => setPlatform(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "2px solid #e5e7eb",
                                    borderRadius: "12px",
                                    fontSize: "14px",
                                    outline: "none",
                                }}
                            >
                                <option value="">Select platform</option>
                                {platforms.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                        <div className="admin-field">
                            <label>URL</label>
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://..."
                            />
                        </div>
                        <div className="admin-modal-actions">
                            <button className="admin-cancel-btn" onClick={resetForm}>Cancel</button>
                            <button
                                className="admin-save-btn"
                                onClick={handleSave}
                                disabled={!platform || !url}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button className="admin-add-btn" onClick={() => setShowForm(true)}>
                <Plus size={16} /> Add Social Link
            </button>
        </div>
    );
}

// ===== BRANDS PANEL =====
function BrandsPanel({ onSave }: { onSave: (msg?: string) => void }) {
    const brands = useQuery(api.brands.listAll);
    const createBrand = useMutation(api.brands.create);
    const updateBrand = useMutation(api.brands.update);
    const removeBrand = useMutation(api.brands.remove);
    const generateUploadUrl = useMutation(api.admin.generateUploadUrl);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [logoUrl, setLogoUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetForm = () => {
        setName("");
        setLogoUrl("");
        setEditId(null);
        setShowForm(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const uploadUrl = await generateUploadUrl();
            const result = await fetch(uploadUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });
            const { storageId } = await result.json();
            setLogoUrl(storageId);
        } catch (err) {
            console.error("Upload failed:", err);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (editId) {
            await updateBrand({ id: editId as any, name, logoUrl });
        } else {
            await createBrand({
                name,
                logoUrl,
                order: (brands?.length || 0) + 1,
                isActive: true,
            });
        }
        resetForm();
        onSave();
    };

    const handleEdit = (brand: any) => {
        setName(brand.name);
        setLogoUrl(brand.logoUrl || "");
        setEditId(brand._id);
        setShowForm(true);
    };

    const handleDelete = async (id: any) => {
        await removeBrand({ id });
        onSave("Brand deleted!");
    };

    return (
        <div>
            <h2 className="admin-panel-title">Brands Worked With</h2>

            {brands?.map((brand) => (
                <div key={brand._id} className="admin-list-item">
                    <div className="admin-list-item-info">
                        <div
                            className="admin-list-item-image"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "linear-gradient(135deg, #E8707A, #F2A5AB)",
                                color: "white",
                                fontWeight: 700,
                            }}
                        >
                            {brand.name.charAt(0)}
                        </div>
                        <div className="admin-list-item-text">
                            <div className="admin-list-item-title">{brand.name}</div>
                        </div>
                    </div>
                    <div className="admin-list-item-actions">
                        <button className="admin-icon-btn" onClick={() => handleEdit(brand)}>
                            <Edit3 size={14} />
                        </button>
                        <button
                            className="admin-icon-btn danger"
                            onClick={() => handleDelete(brand._id)}
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            ))}

            {showForm && (
                <div className="admin-modal-overlay" onClick={resetForm}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="admin-modal-title">
                            {editId ? "Edit Brand" : "Add Brand"}
                        </h3>
                        <div className="admin-field">
                            <label>Brand Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter brand name"
                            />
                        </div>
                        <div className="admin-field">
                            <label>Logo</label>
                            <div
                                className="image-upload-area"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload size={24} style={{ color: "var(--color-primary-light)", marginBottom: 8 }} />
                                <p className="image-upload-text">
                                    {uploading ? "Uploading..." : "Click to upload logo"}
                                </p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: "none" }}
                                />
                            </div>
                        </div>
                        <div className="admin-modal-actions">
                            <button className="admin-cancel-btn" onClick={resetForm}>Cancel</button>
                            <button
                                className="admin-save-btn"
                                onClick={handleSave}
                                disabled={!name}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button className="admin-add-btn" onClick={() => setShowForm(true)}>
                <Plus size={16} /> Add Brand
            </button>
        </div>
    );
}

// ===== RATE CARD PANEL =====
function RateCardPanel({ onSave }: { onSave: (msg?: string) => void }) {
    const settings = useQuery(api.siteSettings.get);
    const updateSettings = useMutation(api.siteSettings.update);
    const [title, setTitle] = useState("");
    const [items, setItems] = useState<RateItem[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [service, setService] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (settings) {
            setTitle(settings.rateCardTitle || "");
            setItems(settings.rateCardItems || []);
        }
    }, [settings]);

    const resetForm = () => {
        setService("");
        setPrice("");
        setDescription("");
        setEditIndex(null);
        setShowForm(false);
    };

    const handleSaveItem = () => {
        const newItems = [...items];
        const item: RateItem = { service, price, description };
        if (editIndex !== null) {
            newItems[editIndex] = item;
        } else {
            newItems.push(item);
        }
        setItems(newItems);
        resetForm();
    };

    const handleEditItem = (index: number) => {
        const item = items[index];
        setService(item.service);
        setPrice(item.price);
        setDescription(item.description || "");
        setEditIndex(index);
        setShowForm(true);
    };

    const handleDeleteItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSaveAll = async () => {
        await updateSettings({ rateCardTitle: title, rateCardItems: items });
        onSave();
    };

    return (
        <div>
            <h2 className="admin-panel-title">Rate Card</h2>

            <div className="admin-field">
                <label>Section Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Collaboration Rates"
                />
            </div>

            {items.map((item, index) => (
                <div key={index} className="admin-list-item">
                    <div className="admin-list-item-info">
                        <div className="admin-list-item-text">
                            <div className="admin-list-item-title">{item.service}</div>
                            <div className="admin-list-item-subtitle">{item.price}</div>
                        </div>
                    </div>
                    <div className="admin-list-item-actions">
                        <button className="admin-icon-btn" onClick={() => handleEditItem(index)}>
                            <Edit3 size={14} />
                        </button>
                        <button
                            className="admin-icon-btn danger"
                            onClick={() => handleDeleteItem(index)}
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            ))}

            {showForm && (
                <div className="admin-modal-overlay" onClick={resetForm}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="admin-modal-title">
                            {editIndex !== null ? "Edit Rate" : "Add Rate"}
                        </h3>
                        <div className="admin-field">
                            <label>Service Name</label>
                            <input
                                type="text"
                                value={service}
                                onChange={(e) => setService(e.target.value)}
                                placeholder="e.g. Instagram Reel"
                            />
                        </div>
                        <div className="admin-field">
                            <label>Price</label>
                            <input
                                type="text"
                                value={price}
                                onChange={(e) => {
                                    let v = e.target.value;
                                    if (v && !v.startsWith("₦")) {
                                        v = "₦" + v.replace(/^[₦$£€]/, "").trim();
                                    }
                                    setPrice(v);
                                }}
                                onFocus={() => {
                                    if (!price) setPrice("₦");
                                }}
                                onBlur={() => {
                                    if (price === "₦") setPrice("");
                                }}
                                placeholder="e.g. ₦500"
                            />
                        </div>
                        <div className="admin-field">
                            <label>Description (optional)</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Brief description"
                            />
                        </div>
                        <div className="admin-modal-actions">
                            <button className="admin-cancel-btn" onClick={resetForm}>Cancel</button>
                            <button
                                className="admin-save-btn"
                                onClick={handleSaveItem}
                                disabled={!service || !price}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button className="admin-add-btn" onClick={() => setShowForm(true)}>
                <Plus size={16} /> Add Rate
            </button>

            <div style={{ marginTop: 20 }}>
                <button className="admin-save-btn" onClick={handleSaveAll}>
                    <Save size={16} style={{ display: "inline", marginRight: 6 }} />
                    Save All Changes
                </button>
            </div>
        </div>
    );
}

// ===== PRODUCTS PANEL =====
function ProductsPanel({ onSave }: { onSave: (msg?: string) => void }) {
    const products = useQuery(api.products.listAll);
    const createProduct = useMutation(api.products.create);
    const updateProduct = useMutation(api.products.update);
    const removeProduct = useMutation(api.products.remove);
    const generateUploadUrl = useMutation(api.admin.generateUploadUrl);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetForm = () => {
        setName("");
        setPrice("");
        setDescription("");
        setImageUrl("");
        setEditId(null);
        setShowForm(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const uploadUrl = await generateUploadUrl();
            const result = await fetch(uploadUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });
            const { storageId } = await result.json();
            setImageUrl(storageId);
        } catch (err) {
            console.error("Upload failed:", err);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (editId) {
            await updateProduct({ id: editId as any, name, price, description, imageUrl });
        } else {
            await createProduct({
                name,
                price,
                description,
                imageUrl,
                order: (products?.length || 0) + 1,
                isActive: true,
            });
        }
        resetForm();
        onSave();
    };

    const handleEdit = (product: any) => {
        setName(product.name);
        setPrice(product.price);
        setDescription(product.description || "");
        setImageUrl(product.imageUrl || "");
        setEditId(product._id);
        setShowForm(true);
    };

    const handleDelete = async (id: any) => {
        await removeProduct({ id });
        onSave("Product deleted!");
    };

    const toggleActive = async (product: any) => {
        await updateProduct({ id: product._id, isActive: !product.isActive });
        onSave(product.isActive ? "Product hidden" : "Product visible");
    };

    return (
        <div>
            <h2 className="admin-panel-title">Products</h2>

            {products?.map((product) => (
                <div
                    key={product._id}
                    className="admin-list-item"
                    style={{ opacity: product.isActive ? 1 : 0.5 }}
                >
                    <div className="admin-list-item-info">
                        <div
                            className="admin-list-item-image"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "var(--color-gradient-start)",
                            }}
                        >
                            <ShoppingBag size={18} style={{ color: "var(--color-primary)" }} />
                        </div>
                        <div className="admin-list-item-text">
                            <div className="admin-list-item-title">{product.name}</div>
                            <div className="admin-list-item-subtitle">{product.price}</div>
                        </div>
                    </div>
                    <div className="admin-list-item-actions">
                        <button
                            className="admin-icon-btn"
                            onClick={() => toggleActive(product)}
                            title={product.isActive ? "Hide" : "Show"}
                        >
                            {product.isActive ? <X size={14} /> : <Plus size={14} />}
                        </button>
                        <button className="admin-icon-btn" onClick={() => handleEdit(product)}>
                            <Edit3 size={14} />
                        </button>
                        <button
                            className="admin-icon-btn danger"
                            onClick={() => handleDelete(product._id)}
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            ))}

            {showForm && (
                <div className="admin-modal-overlay" onClick={resetForm}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="admin-modal-title">
                            {editId ? "Edit Product" : "Add Product"}
                        </h3>
                        <div className="admin-field">
                            <label>Product Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter product name"
                            />
                        </div>
                        <div className="admin-field">
                            <label>Price</label>
                            <input
                                type="text"
                                value={price}
                                onChange={(e) => {
                                    let v = e.target.value;
                                    if (v && !v.startsWith("₦")) {
                                        v = "₦" + v.replace(/^[₦$£€]/, "").trim();
                                    }
                                    setPrice(v);
                                }}
                                onFocus={() => {
                                    if (!price) setPrice("₦");
                                }}
                                onBlur={() => {
                                    if (price === "₦") setPrice("");
                                }}
                                placeholder="e.g. ₦29.99"
                            />
                        </div>
                        <div className="admin-field">
                            <label>Description</label>
                            <textarea
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Product description"
                            />
                        </div>
                        <div className="admin-field">
                            <label>Product Image</label>
                            <div
                                className="image-upload-area"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload size={24} style={{ color: "var(--color-primary-light)", marginBottom: 8 }} />
                                <p className="image-upload-text">
                                    {uploading ? "Uploading..." : "Click to upload image"}
                                </p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: "none" }}
                                />
                            </div>
                        </div>
                        <div className="admin-modal-actions">
                            <button className="admin-cancel-btn" onClick={resetForm}>Cancel</button>
                            <button
                                className="admin-save-btn"
                                onClick={handleSave}
                                disabled={!name || !price}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button className="admin-add-btn" onClick={() => setShowForm(true)}>
                <Plus size={16} /> Add Product
            </button>
        </div>
    );
}

// ===== TESTIMONIALS PANEL =====
function TestimonialsPanel({ onSave }: { onSave: (msg?: string) => void }) {
    const testimonials = useQuery(api.testimonials.listAll);
    const createTestimonial = useMutation(api.testimonials.create);
    const updateTestimonial = useMutation(api.testimonials.update);
    const removeTestimonial = useMutation(api.testimonials.remove);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [text, setText] = useState("");
    const [rating, setRating] = useState(5);

    const resetForm = () => {
        setName("");
        setText("");
        setRating(5);
        setEditId(null);
        setShowForm(false);
    };

    const handleSave = async () => {
        if (editId) {
            await updateTestimonial({ id: editId as any, name, text, rating });
        } else {
            await createTestimonial({
                name,
                text,
                rating,
                order: (testimonials?.length || 0) + 1,
                isActive: true,
            });
        }
        resetForm();
        onSave();
    };

    const handleEdit = (t: any) => {
        setName(t.name);
        setText(t.text);
        setRating(t.rating || 5);
        setEditId(t._id);
        setShowForm(true);
    };

    const handleDelete = async (id: any) => {
        await removeTestimonial({ id });
        onSave("Testimonial deleted!");
    };

    return (
        <div>
            <h2 className="admin-panel-title">Testimonials</h2>

            {testimonials?.map((t) => (
                <div key={t._id} className="admin-list-item">
                    <div className="admin-list-item-info">
                        <div
                            className="admin-list-item-image"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "linear-gradient(135deg, #E8707A, #F2A5AB)",
                                color: "white",
                                fontWeight: 700,
                                borderRadius: "50%",
                            }}
                        >
                            {t.name.charAt(0)}
                        </div>
                        <div className="admin-list-item-text">
                            <div className="admin-list-item-title">{t.name}</div>
                            <div className="admin-list-item-subtitle" style={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {t.text}
                            </div>
                        </div>
                    </div>
                    <div className="admin-list-item-actions">
                        <button className="admin-icon-btn" onClick={() => handleEdit(t)}>
                            <Edit3 size={14} />
                        </button>
                        <button
                            className="admin-icon-btn danger"
                            onClick={() => handleDelete(t._id)}
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            ))}

            {showForm && (
                <div className="admin-modal-overlay" onClick={resetForm}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="admin-modal-title">
                            {editId ? "Edit Testimonial" : "Add Testimonial"}
                        </h3>
                        <div className="admin-field">
                            <label>Customer Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter customer name"
                            />
                        </div>
                        <div className="admin-field">
                            <label>Testimonial Text</label>
                            <textarea
                                rows={4}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="What did they say?"
                            />
                        </div>
                        <div className="admin-field">
                            <label>Rating (1-5 stars)</label>
                            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            padding: 2,
                                        }}
                                    >
                                        <Star
                                            size={24}
                                            fill={star <= rating ? "#F59E0B" : "none"}
                                            color={star <= rating ? "#F59E0B" : "#d1d5db"}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="admin-modal-actions">
                            <button className="admin-cancel-btn" onClick={resetForm}>Cancel</button>
                            <button
                                className="admin-save-btn"
                                onClick={handleSave}
                                disabled={!name || !text}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button className="admin-add-btn" onClick={() => setShowForm(true)}>
                <Plus size={16} /> Add Testimonial
            </button>
        </div>
    );
}

// ===== SETTINGS PANEL =====
function SettingsPanel({ onSave }: { onSave: (msg?: string) => void }) {
    const settings = useQuery(api.siteSettings.get);
    const updateSettings = useMutation(api.siteSettings.update);
    const adminPassword = useQuery(api.admin.getPassword);
    const changePassword = useMutation(api.admin.changePassword);
    const [whatsappNumber, setWhatsappNumber] = useState("");
    const [footerText, setFooterText] = useState("");
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [currentPasswordInput, setCurrentPasswordInput] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);

    useEffect(() => {
        if (settings) {
            setWhatsappNumber(settings.whatsappNumber || "");
            setFooterText(settings.footerText || "");
            setMaintenanceMode(settings.maintenanceMode || false);
        }
    }, [settings]);

    const handleSave = async () => {
        await updateSettings({ whatsappNumber, footerText, maintenanceMode });
        onSave();
    };

    const toggleMaintenance = async () => {
        const newVal = !maintenanceMode;
        setMaintenanceMode(newVal);
        await updateSettings({ maintenanceMode: newVal });
        onSave(newVal ? "Maintenance mode ON" : "Maintenance mode OFF");
    };

    const handleChangePassword = async () => {
        setPasswordError("");
        if (newPassword.length < 4) {
            setPasswordError("New password must be at least 4 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }
        setChangingPassword(true);
        try {
            await changePassword({
                currentPassword: currentPasswordInput,
                newPassword: newPassword,
            });
            setCurrentPasswordInput("");
            setNewPassword("");
            setConfirmPassword("");
            onSave("Password changed successfully!");
        } catch (err: any) {
            setPasswordError(err?.message || "Failed to change password.");
        } finally {
            setChangingPassword(false);
        }
    };

    return (
        <div>
            <h2 className="admin-panel-title">Site Settings</h2>

            <div style={{ marginBottom: 24 }}>
                <div className="toggle-wrapper">
                    <div>
                        <div className="toggle-label">Maintenance Mode</div>
                        <div className="toggle-desc">
                            When enabled, visitors will see a maintenance page
                        </div>
                    </div>
                    <button
                        className={`toggle-switch ${maintenanceMode ? "active" : ""}`}
                        onClick={toggleMaintenance}
                    />
                </div>
            </div>

            <div className="admin-field">
                <label>WhatsApp Number</label>
                <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="e.g. 2341234567890"
                />
            </div>

            <div className="admin-field">
                <label>Footer Text</label>
                <input
                    type="text"
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                    placeholder="Footer copyright text"
                />
            </div>

            <button className="admin-save-btn" onClick={handleSave}>
                <Save size={16} style={{ display: "inline", marginRight: 6 }} />
                Save Settings
            </button>

            {/* Password Section */}
            <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid #e5e7eb" }}>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                    <Key size={18} />
                    Password Management
                </h3>

                {/* Current Password Display */}
                <div className="admin-field">
                    <label>Current Password</label>
                    <div style={{ position: "relative" }}>
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={adminPassword?.password || ""}
                            readOnly
                            style={{
                                width: "100%",
                                padding: "12px 44px 12px 16px",
                                border: "2px solid #e5e7eb",
                                borderRadius: 12,
                                fontFamily: "var(--font-body)",
                                fontSize: 14,
                                background: "#f9fafb",
                                color: "var(--color-text)",
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            style={{
                                position: "absolute",
                                right: 12,
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#9ca3af",
                                padding: 0,
                            }}
                        >
                            {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {/* Change Password Form */}
                <div style={{ marginTop: 16, padding: 16, background: "#f9fafb", borderRadius: 14, border: "1px solid #e5e7eb" }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Change Password</div>
                    {passwordError && (
                        <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 12 }}>{passwordError}</p>
                    )}
                    <div className="admin-field">
                        <label>Current Password</label>
                        <input
                            type="password"
                            value={currentPasswordInput}
                            onChange={(e) => setCurrentPasswordInput(e.target.value)}
                            placeholder="Enter current password"
                        />
                    </div>
                    <div className="admin-field">
                        <label>New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                        />
                    </div>
                    <div className="admin-field">
                        <label>Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                        />
                    </div>
                    <button
                        className="admin-save-btn"
                        onClick={handleChangePassword}
                        disabled={changingPassword || !currentPasswordInput || !newPassword || !confirmPassword}
                    >
                        <Key size={16} style={{ display: "inline", marginRight: 6 }} />
                        {changingPassword ? "Changing..." : "Change Password"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ===== CONTACT PANEL =====
function ContactPanel({ onSave }: { onSave: (msg?: string) => void }) {
    const settings = useQuery(api.siteSettings.get);
    const updateSettings = useMutation(api.siteSettings.update);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [contactAddress, setContactAddress] = useState("");

    useEffect(() => {
        if (settings) {
            setPhoneNumber(settings.phoneNumber || "");
            setEmail(settings.email || "");
            setContactAddress(settings.contactAddress || "");
        }
    }, [settings]);

    const handleSave = async () => {
        await updateSettings({ phoneNumber, email, contactAddress });
        onSave();
    };

    return (
        <div>
            <h2 className="admin-panel-title">Contact Information</h2>
            <p style={{ fontSize: 13, color: "var(--color-text-light)", marginBottom: 20 }}>
                This info will appear in the &quot;Get In Touch&quot; section on your homepage.
            </p>

            <div className="admin-field">
                <label>Phone Number</label>
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. +234 812 345 6789"
                />
            </div>

            <div className="admin-field">
                <label>Email Address</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. hello@missy.com"
                />
            </div>

            <div className="admin-field">
                <label>Location / Address</label>
                <input
                    type="text"
                    value={contactAddress}
                    onChange={(e) => setContactAddress(e.target.value)}
                    placeholder="e.g. Lagos, Nigeria"
                />
            </div>

            <button className="admin-save-btn" onClick={handleSave}>
                <Save size={16} style={{ display: "inline", marginRight: 6 }} />
                Save Contact Info
            </button>
        </div>
    );
}

// ===== SERVICES PANEL =====
function ServicesPanel({ onSave }: { onSave: (msg?: string) => void }) {
    const services = useQuery(api.services.listAll);
    const createService = useMutation(api.services.create);
    const updateService = useMutation(api.services.update);
    const removeService = useMutation(api.services.remove);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const resetForm = () => {
        setName("");
        setDescription("");
        setEditId(null);
        setShowForm(false);
    };

    const handleSave = async () => {
        if (editId) {
            await updateService({ id: editId as any, name, description });
        } else {
            await createService({
                name,
                description,
                order: (services?.length || 0) + 1,
                isActive: true,
            });
        }
        resetForm();
        onSave();
    };

    const handleEdit = (service: any) => {
        setName(service.name);
        setDescription(service.description || "");
        setEditId(service._id);
        setShowForm(true);
    };

    const handleDelete = async (id: any) => {
        await removeService({ id });
        onSave("Service deleted!");
    };

    return (
        <div>
            <h2 className="admin-panel-title">Services</h2>

            {services?.map((service) => (
                <div key={service._id} className="admin-list-item">
                    <div className="admin-list-item-info">
                        <div
                            className="admin-list-item-image"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "linear-gradient(135deg, #E8707A, #F2A5AB)",
                                color: "white",
                                fontWeight: 700,
                                borderRadius: 10,
                            }}
                        >
                            <Briefcase size={18} />
                        </div>
                        <div className="admin-list-item-text">
                            <div className="admin-list-item-title">{service.name}</div>
                            {service.description && (
                                <div className="admin-list-item-subtitle">{service.description}</div>
                            )}
                        </div>
                    </div>
                    <div className="admin-list-item-actions">
                        <button className="admin-icon-btn" onClick={() => handleEdit(service)}>
                            <Edit3 size={14} />
                        </button>
                        <button
                            className="admin-icon-btn danger"
                            onClick={() => handleDelete(service._id)}
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            ))}

            {showForm && (
                <div className="admin-modal-overlay" onClick={resetForm}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="admin-modal-title">
                            {editId ? "Edit Service" : "Add Service"}
                        </h3>
                        <div className="admin-field">
                            <label>Service Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Content Creation"
                            />
                        </div>
                        <div className="admin-field">
                            <label>Description (optional)</label>
                            <textarea
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Brief description of the service"
                            />
                        </div>
                        <div className="admin-modal-actions">
                            <button className="admin-cancel-btn" onClick={resetForm}>Cancel</button>
                            <button
                                className="admin-save-btn"
                                onClick={handleSave}
                                disabled={!name}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button className="admin-add-btn" onClick={() => setShowForm(true)}>
                <Plus size={16} /> Add Service
            </button>
        </div>
    );
}

// ===== DEMOGRAPHICS PANEL =====
function DemographicsPanel({ onSave }: { onSave: (msg?: string) => void }) {
    const stats = useQuery(api.socialStats.listAll);
    const createStat = useMutation(api.socialStats.create);
    const updateStat = useMutation(api.socialStats.update);
    const removeStat = useMutation(api.socialStats.remove);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [platform, setPlatform] = useState("");
    const [followers, setFollowers] = useState("");
    const [engagement, setEngagement] = useState("");
    const [avgLikes, setAvgLikes] = useState("");
    const [avgComments, setAvgComments] = useState("");
    const [customStats, setCustomStats] = useState<{ label: string; value: string }[]>([]);

    const platforms = ["Instagram", "TikTok", "YouTube", "Twitter", "Facebook", "LinkedIn"];

    const resetForm = () => {
        setPlatform("");
        setFollowers("");
        setEngagement("");
        setAvgLikes("");
        setAvgComments("");
        setCustomStats([]);
        setEditId(null);
        setShowForm(false);
    };

    const handleSave = async () => {
        const filteredCustomStats = customStats.filter((s) => s.label && s.value);
        if (editId) {
            await updateStat({
                id: editId as any,
                platform,
                followers,
                engagement,
                avgLikes,
                avgComments,
                customStats: filteredCustomStats.length > 0 ? filteredCustomStats : undefined,
            });
        } else {
            await createStat({
                platform,
                followers,
                engagement,
                avgLikes,
                avgComments,
                customStats: filteredCustomStats.length > 0 ? filteredCustomStats : undefined,
                order: (stats?.length || 0) + 1,
                isActive: true,
            });
        }
        resetForm();
        onSave();
    };

    const handleEdit = (stat: any) => {
        setPlatform(stat.platform);
        setFollowers(stat.followers || "");
        setEngagement(stat.engagement || "");
        setAvgLikes(stat.avgLikes || "");
        setAvgComments(stat.avgComments || "");
        setCustomStats(stat.customStats || []);
        setEditId(stat._id);
        setShowForm(true);
    };

    const handleDelete = async (id: any) => {
        await removeStat({ id });
        onSave("Stat deleted!");
    };

    const addCustomStat = () => {
        setCustomStats([...customStats, { label: "", value: "" }]);
    };

    const updateCustomStat = (index: number, field: "label" | "value", val: string) => {
        const updated = [...customStats];
        updated[index][field] = val;
        setCustomStats(updated);
    };

    const removeCustomStat = (index: number) => {
        setCustomStats(customStats.filter((_, i) => i !== index));
    };

    return (
        <div>
            <h2 className="admin-panel-title">Social Media Demographics</h2>

            {stats?.map((stat) => (
                <div key={stat._id} className="admin-list-item">
                    <div className="admin-list-item-info">
                        <div
                            className="admin-list-item-image"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "linear-gradient(135deg, #E8707A, #F2A5AB)",
                                color: "white",
                                fontWeight: 700,
                                borderRadius: 10,
                            }}
                        >
                            <BarChart3 size={18} />
                        </div>
                        <div className="admin-list-item-text">
                            <div className="admin-list-item-title">{stat.platform}</div>
                            <div className="admin-list-item-subtitle">
                                {stat.followers ? `${stat.followers} followers` : "No data yet"}
                                {stat.engagement ? ` · ${stat.engagement} engagement` : ""}
                            </div>
                        </div>
                    </div>
                    <div className="admin-list-item-actions">
                        <button className="admin-icon-btn" onClick={() => handleEdit(stat)}>
                            <Edit3 size={14} />
                        </button>
                        <button
                            className="admin-icon-btn danger"
                            onClick={() => handleDelete(stat._id)}
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            ))}

            {showForm && (
                <div className="admin-modal-overlay" onClick={resetForm}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="admin-modal-title">
                            {editId ? "Edit Demographics" : "Add Platform Stats"}
                        </h3>
                        <div className="admin-field">
                            <label>Platform</label>
                            <select
                                value={platform}
                                onChange={(e) => setPlatform(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "2px solid #e5e7eb",
                                    borderRadius: "12px",
                                    fontSize: "14px",
                                    outline: "none",
                                }}
                            >
                                <option value="">Select platform</option>
                                {platforms.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                        <div className="admin-field">
                            <label>Followers</label>
                            <input
                                type="text"
                                value={followers}
                                onChange={(e) => setFollowers(e.target.value)}
                                placeholder="e.g. 15.2K"
                            />
                        </div>
                        <div className="admin-field">
                            <label>Engagement Rate</label>
                            <input
                                type="text"
                                value={engagement}
                                onChange={(e) => setEngagement(e.target.value)}
                                placeholder="e.g. 4.8%"
                            />
                        </div>
                        <div className="admin-field">
                            <label>Average Likes</label>
                            <input
                                type="text"
                                value={avgLikes}
                                onChange={(e) => setAvgLikes(e.target.value)}
                                placeholder="e.g. 520"
                            />
                        </div>
                        <div className="admin-field">
                            <label>Average Comments</label>
                            <input
                                type="text"
                                value={avgComments}
                                onChange={(e) => setAvgComments(e.target.value)}
                                placeholder="e.g. 45"
                            />
                        </div>

                        {/* Custom Stats */}
                        <div style={{ marginTop: 8, marginBottom: 16 }}>
                            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                                Custom Stats
                            </label>
                            {customStats.map((cs, i) => (
                                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                                    <input
                                        type="text"
                                        value={cs.label}
                                        onChange={(e) => updateCustomStat(i, "label", e.target.value)}
                                        placeholder="Label (e.g. Reach)"
                                        style={{
                                            flex: 1,
                                            padding: "10px 12px",
                                            border: "2px solid #e5e7eb",
                                            borderRadius: 10,
                                            fontSize: 13,
                                            outline: "none",
                                        }}
                                    />
                                    <input
                                        type="text"
                                        value={cs.value}
                                        onChange={(e) => updateCustomStat(i, "value", e.target.value)}
                                        placeholder="Value (e.g. 50K)"
                                        style={{
                                            flex: 1,
                                            padding: "10px 12px",
                                            border: "2px solid #e5e7eb",
                                            borderRadius: 10,
                                            fontSize: 13,
                                            outline: "none",
                                        }}
                                    />
                                    <button
                                        onClick={() => removeCustomStat(i)}
                                        style={{
                                            background: "none",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: 8,
                                            cursor: "pointer",
                                            padding: "0 8px",
                                            color: "#ef4444",
                                        }}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addCustomStat}
                                style={{
                                    background: "var(--color-gradient-start)",
                                    border: "2px dashed var(--color-border)",
                                    borderRadius: 10,
                                    padding: "8px 14px",
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: "var(--color-primary)",
                                    cursor: "pointer",
                                }}
                            >
                                <Plus size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
                                Add Custom Stat
                            </button>
                        </div>

                        <div className="admin-modal-actions">
                            <button className="admin-cancel-btn" onClick={resetForm}>Cancel</button>
                            <button
                                className="admin-save-btn"
                                onClick={handleSave}
                                disabled={!platform}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button className="admin-add-btn" onClick={() => setShowForm(true)}>
                <Plus size={16} /> Add Platform Stats
            </button>
        </div>
    );
}
