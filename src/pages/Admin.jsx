import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';
import { usePromoCode } from '../context/PromoCodeContext';
import { useShipping } from '../context/ShippingContext';
import { useUI } from '../context/UIContext';
import { useOrders } from '../context/OrderContext';
import PageTransition from '../components/layout/PageTransition';
import { Trash2, Plus, Box, DollarSign, Type, Palette, Tag, Truck, Image, ShoppingBag, Clock, CheckCircle, XCircle, Home as HomeIcon, Settings, Mail, Phone, MapPin, Facebook, Instagram, Twitter, PlayCircle, BarChart2, TrendingUp, Users, Activity } from 'lucide-react';

function DashboardHome({ setActiveView }) {
    const { orders } = useOrders();
    const { products } = useProducts();

    // Calculate Stats
    const totalRevenue = orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, order) => sum + order.total, 0);

    const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;
    const totalOrders = orders.length;
    const totalCustomers = new Set(orders.map(o => o.shippingDetails?.email || o.id)).size;

    // Simulated Sales Data (Last 7 days)
    const salesData = [450, 720, 580, 910, 840, 690, 1100];
    const maxSale = Math.max(...salesData);

    return (
        <div className="dashboard-home">
            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Activity size={32} color="var(--color-primary)" /> Dashboard Overview
            </h2>

            {/* KPI Cards */}
            <div className="admin-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '2rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ opacity: 0.6, fontSize: '0.9rem' }}>Total Revenue</span>
                        <div style={{ padding: '0.5rem', background: 'rgba(46, 196, 182, 0.1)', borderRadius: '8px', color: '#2ec4b6' }}><DollarSign size={20} /></div>
                    </div>
                    <span style={{ fontSize: '1.8rem', fontWeight: 700 }}>₹{totalRevenue.toLocaleString()}</span>
                    <span style={{ fontSize: '0.8rem', color: '#2ec4b6', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><TrendingUp size={12} /> +12% from last week</span>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ opacity: 0.6, fontSize: '0.9rem' }}>Active Orders</span>
                        <div style={{ padding: '0.5rem', background: 'rgba(255, 159, 28, 0.1)', borderRadius: '8px', color: '#ff9f1c' }}><ShoppingBag size={20} /></div>
                    </div>
                    <span style={{ fontSize: '1.8rem', fontWeight: 700 }}>{activeOrders}</span>
                    <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>Needs attention</span>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ opacity: 0.6, fontSize: '0.9rem' }}>Total Customers</span>
                        <div style={{ padding: '0.5rem', background: 'rgba(255, 107, 107, 0.1)', borderRadius: '8px', color: '#ff6b6b' }}><Users size={20} /></div>
                    </div>
                    <span style={{ fontSize: '1.8rem', fontWeight: 700 }}>{totalCustomers}</span>
                    <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>Global reach</span>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ opacity: 0.6, fontSize: '0.9rem' }}>Total Products</span>
                        <div style={{ padding: '0.5rem', background: 'rgba(120, 86, 255, 0.1)', borderRadius: '8px', color: '#7856ff' }}><Box size={20} /></div>
                    </div>
                    <span style={{ fontSize: '1.8rem', fontWeight: 700 }}>{products.length}</span>
                    <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>In inventory</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                {/* Sales Chart */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BarChart2 size={18} /> Weekly Sales</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        {salesData.map((val, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '0.5rem', height: '100%' }}>
                                <div style={{
                                    height: `${(val / maxSale) * 100}%`,
                                    background: i === 6 ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                                    borderRadius: '4px 4px 0 0',
                                    transition: 'height 0.5s ease',
                                    position: 'relative'
                                }} />
                                <span style={{ fontSize: '0.7rem', textAlign: 'center', opacity: 0.5 }}>Day {i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={18} /> Recent Orders</h3>
                        <button onClick={() => setActiveView('orders')} style={{ fontSize: '0.8rem', color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer' }}>View All</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {orders.slice(0, 5).map(order => (
                            <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                <div>
                                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Order #{order.id}</p>
                                    <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>{new Date(order.date).toLocaleDateString()}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontWeight: 600, color: 'var(--color-primary)' }}>₹{order.total.toFixed(0)}</p>
                                    <p style={{ fontSize: '0.7rem', opacity: 0.7, textTransform: 'capitalize' }}>{order.status}</p>
                                </div>
                            </div>
                        ))}
                        {orders.length === 0 && <p style={{ opacity: 0.5, textAlign: 'center', padding: '1rem' }}>No recent activity.</p>}
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 900px) {
                    .dashboard-home > div:last-child {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}

function ShippingManager() {
    const { shippingSettings, updateShippingSettings } = useShipping();
    const [cost, setCost] = useState(shippingSettings.cost);
    const [threshold, setThreshold] = useState(shippingSettings.threshold);
    const { addToast } = useToast();

    const handleUpdate = (e) => {
        e.preventDefault();
        updateShippingSettings(cost, threshold);
        addToast("Shipping settings updated successfully", "success");
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.5rem', background: 'rgba(255,107,53,0.1)', borderRadius: '8px', display: 'flex' }}>
                    <Truck size={24} color="var(--color-primary)" />
                </div>
                Shipping Settings
            </h2>
            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8, fontSize: '0.9rem' }}>Base Shipping Cost (₹)</label>
                        <input
                            type="number"
                            step="0.01"
                            className="admin-input"
                            value={cost}
                            onChange={e => setCost(e.target.value)}
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8, fontSize: '0.9rem' }}>Free Shipping Threshold (₹)</label>
                        <input
                            type="number"
                            step="0.01"
                            className="admin-input"
                            value={threshold}
                            onChange={e => setThreshold(e.target.value)}
                            placeholder="50.00"
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <button type="submit" className="admin-btn btn-primary">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

function PromoCodeManager() {
    const { promoCodes, createPromoCode, deletePromoCode } = usePromoCode();
    const [code, setCode] = useState('');
    const [type, setType] = useState('percent');
    const [value, setValue] = useState('');
    const [minOrderValue, setMinOrderValue] = useState('');
    const [usageLimit, setUsageLimit] = useState('');
    const [firstOrderOnly, setFirstOrderOnly] = useState(false);
    const { addToast } = useToast();

    const handleCreate = (e) => {
        e.preventDefault();
        if (!code || !value) return;
        const success = createPromoCode(code, type, value, { minOrderValue, usageLimit, firstOrderOnly });
        if (success) {
            setCode('');
            setValue('');
            setMinOrderValue('');
            setUsageLimit('');
            setFirstOrderOnly(false);
        }
    };

    return (
        <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.5rem', background: 'rgba(255,143,171,0.1)', borderRadius: '8px', display: 'flex' }}>
                    <Tag size={24} color="var(--color-secondary)" />
                </div>
                Manage Promo Codes
            </h2>

            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', opacity: 0.9 }}>Create New Code</h3>
                <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="admin-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8, fontSize: '0.9rem' }}>Code Name</label>
                            <input
                                className="admin-input"
                                value={code}
                                onChange={e => setCode(e.target.value.toUpperCase())}
                                placeholder="e.g. SAVE10"
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8, fontSize: '0.9rem' }}>Type</label>
                            <select className="admin-input" value={type} onChange={e => setType(e.target.value)}>
                                <option value="percent">Percentage (%)</option>
                                <option value="fixed">Fixed Amount (₹)</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8, fontSize: '0.9rem' }}>Value</label>
                            <input
                                type="number"
                                step="0.01"
                                className="admin-input"
                                value={value}
                                onChange={e => setValue(e.target.value)}
                                placeholder="10"
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8, fontSize: '0.9rem' }}>Min Order Value (₹)</label>
                            <input
                                type="number"
                                step="0.01"
                                className="admin-input"
                                value={minOrderValue}
                                onChange={e => setMinOrderValue(e.target.value)}
                                placeholder="0.00 (Optional)"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8, fontSize: '0.9rem' }}>Usage Limit</label>
                            <input
                                type="number"
                                className="admin-input"
                                value={usageLimit}
                                onChange={e => setUsageLimit(e.target.value)}
                                placeholder="Unlimited (Optional)"
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', height: '50px', marginTop: '1.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>
                                <input type="checkbox" checked={firstOrderOnly} onChange={e => setFirstOrderOnly(e.target.checked)} style={{ width: '20px', height: '20px' }} />
                                First Order Only
                            </label>
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="admin-btn btn-primary">
                            <Plus size={18} /> Create Code
                        </button>
                    </div>
                </form>
            </div>

            <div className="admin-grid">
                <AnimatePresence>
                    {promoCodes.map(promo => (
                        <motion.div
                            key={promo.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="glass-panel"
                            style={{
                                padding: '1.5rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderLeft: '4px solid var(--color-secondary)'
                            }}
                        >
                            <div>
                                <h4 style={{ fontWeight: 700, letterSpacing: '1px', fontSize: '1.2rem', marginBottom: '0.2rem' }}>{promo.code}</h4>
                                <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>
                                    {promo.type === 'percent' ? `${promo.value}% OFF` : `₹${promo.value} OFF`}
                                </p>
                            </div>
                            <button
                                onClick={() => deletePromoCode(promo.id)}
                                className="admin-btn btn-danger"
                                style={{ padding: '0.6rem', borderRadius: '50%' }}
                            >
                                <Trash2 size={18} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

function UIManager() {
    const { heroImage, updateHeroImage } = useUI();
    const [url, setUrl] = useState(heroImage || '');
    const { addToast } = useToast();

    const handleUpdate = (e) => {
        e.preventDefault();
        updateHeroImage(url);
        addToast('Hero image updated successfully', 'success');
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.5rem', background: 'rgba(0, 245, 212, 0.1)', borderRadius: '8px', display: 'flex' }}>
                    <Image size={24} color="var(--color-accent)" />
                </div>
                Hero Image Settings
            </h2>
            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8, fontSize: '0.9rem' }}>Image URL</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input
                            className="admin-input"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            placeholder="https://example.com/burger.png"
                            style={{ flex: 1 }}
                        />
                        <button type="submit" className="admin-btn btn-primary">
                            Update
                        </button>
                    </div>
                    <p style={{ fontSize: '0.85rem', opacity: 0.5, marginTop: '0.5rem' }}>
                        Leave empty to use the default hero image.
                    </p>
                </div>

                {url && (
                    <div style={{
                        marginTop: '1rem',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'black',
                        maxHeight: '400px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <img src={url} alt="Preview" style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }} />
                    </div>
                )}
            </form>
        </div>
    );
}

function ImageGallery() {
    const [images, setImages] = useState(() => {
        const saved = localStorage.getItem('adminGallery');
        return saved ? JSON.parse(saved) : [];
    });
    const [newImage, setNewImage] = useState('');
    const { addToast } = useToast();

    useEffect(() => {
        localStorage.setItem('adminGallery', JSON.stringify(images));
    }, [images]);

    const handleAddImage = (e) => {
        e.preventDefault();
        if (!newImage) return;
        setImages([...images, newImage]);
        setNewImage('');
        addToast('Image added to gallery', 'success');
    };

    const handleDeleteImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
        addToast('Image removed', 'success');
    };

    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url);
        addToast('URL copied to clipboard! 📋', 'success');
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages([...images, reader.result]);
                addToast('Image uploaded to gallery', 'success');
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex' }}>
                    <Image size={24} color="white" />
                </div>
                Image Gallery
            </h2>

            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8, fontSize: '0.9rem' }}>Add New Image URL</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <input
                                className="admin-input"
                                value={newImage}
                                onChange={e => setNewImage(e.target.value)}
                                placeholder="Paste URL here..."
                            />
                            <button onClick={handleAddImage} className="admin-btn btn-primary">Add</button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '0.8rem', opacity: 0.5 }}>OR</div>

                    <label className="admin-btn btn-secondary" style={{ cursor: 'pointer', minWidth: '180px' }}>
                        <Box size={18} /> Upload from Device
                        <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                    </label>
                </div>
            </div>

            <div className="admin-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
                <AnimatePresence>
                    {images.map((img, index) => (
                        <motion.div
                            key={index}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ y: -5 }}
                            style={{
                                position: 'relative',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                aspectRatio: '1/1',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'black',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                            }}
                        >
                            <img src={img} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div className="overlay" style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(0,0,0,0.7)',
                                opacity: 0,
                                transition: 'opacity 0.2s',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.8rem',
                                padding: '1rem'
                            }}
                                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                                onMouseLeave={e => e.currentTarget.style.opacity = 0}
                            >
                                <button onClick={() => copyToClipboard(img)} className="admin-btn btn-secondary" style={{ width: '100%', fontSize: '0.8rem' }}>
                                    Copy URL
                                </button>
                                <button onClick={() => handleDeleteImage(index)} className="admin-btn btn-danger" style={{ width: '100%', fontSize: '0.8rem' }}>
                                    <Trash2 size={16} /> Remove
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

function OrderManager() {
    const { orders, updateOrderStatus, deleteOrder } = useOrders();
    const [activeTab, setActiveTab] = useState('active');

    const getStatusColor = (status) => {
        switch (status) {
            case 'preparing': return '#ff9f1c';
            case 'baked': return '#2ec4b6';
            case 'out_for_delivery': return '#ff6b6b';
            case 'delivered': return '#4cc9f0';
            case 'cancelled': return '#e71d36';
            default: return 'white';
        }
    };

    const filteredOrders = orders.filter(order => {
        if (activeTab === 'active') return order.status !== 'delivered' && order.status !== 'cancelled';
        if (activeTab === 'delivered') return order.status === 'delivered';
        if (activeTab === 'cancelled') return order.status === 'cancelled';
        return true;
    });

    const TabButton = ({ id, label, icon: Icon, color }) => (
        <button
            onClick={() => setActiveTab(id)}
            style={{
                background: activeTab === id ? 'rgba(255,107,53,0.1)' : 'transparent',
                color: activeTab === id ? 'var(--color-primary)' : 'rgba(255,255,255,0.6)',
                border: activeTab === id ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.1)',
                padding: '0.6rem 1.2rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: activeTab === id ? 600 : 400,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
            }}
        >
            {Icon && <Icon size={16} color={activeTab === id ? 'var(--color-primary)' : 'currentColor'} />}
            {label}
            <span style={{
                background: activeTab === id ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                color: activeTab === id ? 'white' : 'inherit',
                padding: '0.1rem 0.5rem',
                borderRadius: '10px',
                fontSize: '0.8rem',
                marginLeft: '0.5rem'
            }}>
                {orders.filter(o => {
                    if (id === 'active') return o.status !== 'delivered' && o.status !== 'cancelled';
                    if (id === 'delivered') return o.status === 'delivered';
                    if (id === 'cancelled') return o.status === 'cancelled';
                    return false;
                }).length}
            </span>
        </button>
    );

    return (
        <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.5rem', background: 'rgba(255,107,53,0.1)', borderRadius: '8px', display: 'flex' }}>
                    <ShoppingBag size={24} color="var(--color-primary)" />
                </div>
                Customer Orders
            </h2>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <TabButton id="active" label="Active Orders" icon={Clock} />
                <TabButton id="delivered" label="Delivered" icon={CheckCircle} />
                <TabButton id="cancelled" label="Cancelled" icon={XCircle} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {filteredOrders.length === 0 ? (
                    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', opacity: 0.7 }}>
                        <ShoppingBag size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                        <p>No {activeTab} orders found.</p>
                    </div>
                ) : (
                    filteredOrders.map(order => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-panel"
                            style={{
                                padding: '1.5rem',
                                borderLeft: `4px solid ${getStatusColor(order.status)}`,
                                position: 'relative'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        Order #{order.id}
                                        <span style={{ fontSize: '0.8rem', fontWeight: 400, opacity: 0.6, background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                                            {order.items.reduce((acc, item) => acc + parseInt(item.quantity), 0)} items
                                        </span>
                                    </h3>
                                    <p style={{ opacity: 0.6, fontSize: '0.9rem', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Clock size={14} /> {new Date(order.date).toLocaleString()}
                                    </p>
                                    <p style={{ opacity: 0.8, fontSize: '0.95rem', marginTop: '0.3rem', fontWeight: 500 }}>
                                        {order.shippingDetails?.name} <span style={{ opacity: 0.4 }}>|</span> {order.shippingDetails?.address}, {order.shippingDetails?.city}
                                    </p>
                                    <p style={{ opacity: 0.8, fontSize: '0.95rem', marginTop: '0.3rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Phone size={14} /> {order.shippingDetails?.phone || 'N/A'}
                                    </p>
                                    {order.location && (
                                        <a
                                            href={`https://www.google.com/maps?q=${order.location.lat},${order.location.lng}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ opacity: 0.8, fontSize: '0.95rem', marginTop: '0.3rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4cc9f0', textDecoration: 'none' }}
                                        >
                                            <MapPin size={14} /> View Location on Map
                                        </a>
                                    )}
                                </div>
                                <span className="status-badge" style={{
                                    background: `${getStatusColor(order.status)}20`,
                                    color: getStatusColor(order.status),
                                    border: `1px solid ${getStatusColor(order.status)}40`
                                }}>
                                    {order.status === 'delivered' && <CheckCircle size={14} />}
                                    {order.status === 'cancelled' && <XCircle size={14} />}
                                    {order.status === 'out_for_delivery' && <Truck size={14} />}
                                    {order.status === 'preparing' && <Clock size={14} />}
                                    {order.status.replace('_', ' ')}
                                </span>
                            </div>

                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    {order.items.map(item => (
                                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                <span style={{ background: 'rgba(255,255,255,0.1)', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                    {item.quantity}
                                                </span>
                                                <span style={{ opacity: 0.9 }}>{item.name}</span>
                                            </div>
                                            <span style={{ opacity: 0.7 }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: '1.1rem' }}>
                                    <span>Total</span>
                                    <span style={{ color: 'var(--color-primary)' }}>₹{order.total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                                {order.status !== 'cancelled' && order.status !== 'delivered' && (
                                    <>
                                        <button
                                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                                            className="admin-btn btn-secondary"
                                            style={{ opacity: order.status === 'preparing' ? 0.5 : 1, padding: '0.6rem 1rem', fontSize: '0.9rem' }}
                                            disabled={order.status === 'preparing'}
                                        >
                                            preparing
                                        </button>
                                        <button
                                            onClick={() => updateOrderStatus(order.id, 'baked')}
                                            className="admin-btn btn-secondary"
                                            style={{ opacity: order.status === 'baked' ? 0.5 : 1, padding: '0.6rem 1rem', fontSize: '0.9rem' }}
                                            disabled={order.status === 'baked'}
                                        >
                                            Baked
                                        </button>
                                        <button
                                            onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                                            className="admin-btn btn-secondary"
                                            style={{ opacity: order.status === 'out_for_delivery' ? 0.5 : 1, padding: '0.6rem 1rem', fontSize: '0.9rem' }}
                                            disabled={order.status === 'out_for_delivery'}
                                        >
                                            Out for Delivery
                                        </button>
                                        <button
                                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                                            className="admin-btn btn-primary"
                                            style={{ background: 'var(--color-accent)', color: 'black', marginLeft: 'auto' }}
                                        >
                                            <CheckCircle size={16} /> Mark Delivered
                                        </button>
                                        <button
                                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                            className="admin-btn btn-danger"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                                {/* Restore options for cancelled/Delivered if needed, or keep minimal */}
                                {(order.status === 'cancelled' || order.status === 'delivered') && (
                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                                        <button
                                            onClick={() => {
                                                if (confirm("Permanently delete this order?")) {
                                                    deleteOrder(order.id);
                                                }
                                            }}
                                            className="admin-btn btn-danger"
                                            style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                                        >
                                            <Trash2 size={14} /> Delete Permanently
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}



function OffersManager() {
    const { products, updateProduct } = useProducts();
    const { addToast } = useToast();
    const [selectedId, setSelectedId] = useState('');
    const [discountValue, setDiscountValue] = useState('');

    const activeOffers = products.filter(p => p.discount > 0);
    const potentialOffers = products.filter(p => !p.discount || p.discount == 0);

    const handleAddOffer = (e) => {
        e.preventDefault();
        if (!selectedId || !discountValue) return;
        const product = products.find(p => p.id === parseInt(selectedId));
        if (product) {
            updateProduct({ ...product, discount: parseInt(discountValue) });
            addToast(`Offer applied to ${product.name}`, 'success');
            setSelectedId('');
            setDiscountValue('');
        }
    };

    const handleRemoveOffer = (product) => {
        updateProduct({ ...product, discount: 0 });
        addToast(`Offer removed from ${product.name}`, 'info');
    };

    return (
        <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.5rem', background: 'rgba(255, 107, 107, 0.1)', borderRadius: '8px', display: 'flex' }}>
                    <Tag size={24} color="#ff6b6b" />
                </div>
                Manage Offers
            </h2>

            {/* Add New Offer Form */}
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', opacity: 0.9 }}>Add New Offer</h3>
                <form onSubmit={handleAddOffer} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8, fontSize: '0.9rem' }}>Select Product</label>
                        <select
                            className="admin-input"
                            value={selectedId}
                            onChange={e => setSelectedId(e.target.value)}
                            required
                        >
                            <option value="">-- Choose a product --</option>
                            {potentialOffers.map(p => (
                                <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ width: '150px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8, fontSize: '0.9rem' }}>Discount (%)</label>
                        <input
                            type="number"
                            min="1"
                            max="99"
                            className="admin-input"
                            value={discountValue}
                            onChange={e => setDiscountValue(e.target.value)}
                            placeholder="e.g. 20"
                            required
                        />
                    </div>
                    <button type="submit" className="admin-btn btn-primary" style={{ background: 'var(--color-secondary)', color: 'black' }}>
                        <Plus size={18} /> Apply Offer
                    </button>
                </form>
            </div>

            {/* Active Offers List */}
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', opacity: 0.9 }}>Active Offers ({activeOffers.length})</h3>
            <div className="admin-grid">
                <AnimatePresence>
                    {activeOffers.length === 0 ? (
                        <p style={{ gridColumn: '1/-1', opacity: 0.5, fontStyle: 'italic' }}>No active offers running.</p>
                    ) : (
                        activeOffers.map(product => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="glass-panel"
                                style={{
                                    padding: '0',
                                    borderLeft: `4px solid ${product.color}`,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    background: 'rgba(255,255,255,0.02)'
                                }}
                            >
                                <div style={{ width: '100px', position: 'relative' }}>
                                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{ position: 'absolute', top: 0, left: 0, background: 'var(--color-secondary)', color: 'black', fontWeight: 'bold', fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderBottomRightRadius: '8px' }}>
                                        {product.discount}% OFF
                                    </div>
                                </div>
                                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.2rem' }}>{product.name}</h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                        <span style={{ textDecoration: 'line-through', opacity: 0.5 }}>₹{product.price}</span>
                                        <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                                            ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveOffer(product)}
                                        className="admin-btn btn-danger"
                                        style={{ alignSelf: 'flex-start', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                    >
                                        <Trash2 size={14} /> Remove Offer
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function SettingsManager() {
    const { contactInfo, updateContactInfo } = useUI();
    const [formData, setFormData] = useState(contactInfo || {
        address: '',
        phone: '',
        email: '',
        facebook: '',
        instagram: '',
        twitter: ''
    });
    const { addToast } = useToast();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = updateContactInfo(formData);
        if (success) {
            addToast('Contact settings updated successfully', 'success');
        } else {
            addToast('Failed to save! Video might be too large for storage.', 'error');
        }
    };

    // Update form when context changes (e.g. initial load)
    useEffect(() => {
        if (contactInfo) setFormData(contactInfo);
    }, [contactInfo]);

    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 8000000) { // 8MB limit
            addToast('Video file too large (Max 8MB).', 'error');
            return;
        }

        setUploading(true);
        setProgress(0);

        const reader = new FileReader();

        reader.onprogress = (data) => {
            if (data.lengthComputable) {
                const progressEvent = Math.round((data.loaded / data.total) * 100);
                setProgress(progressEvent);
            }
        };

        reader.onloadend = () => {
            setFormData({ ...formData, heroVideo: reader.result });
            setUploading(false);
            setProgress(100);
            addToast('Video processed! CLICK "SAVE SETTINGS" NOW to apply.', 'success');
        };

        reader.readAsDataURL(file);
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex' }}>
                    <Settings size={24} color="white" />
                </div>
                General Settings
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', opacity: 0.8, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Contact Information</h3>
                <div className="admin-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8, fontSize: '0.9rem' }}><MapPin size={14} /> Address</label>
                        <input
                            className="admin-input"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="123 Burger Lane..."
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8, fontSize: '0.9rem' }}><Phone size={14} /> Phone</label>
                        <input
                            className="admin-input"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 234 567 890"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8, fontSize: '0.9rem' }}><Mail size={14} /> Email</label>
                        <input
                            className="admin-input"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="hello@example.com"
                        />
                    </div>
                </div>

                <h3 style={{ fontSize: '1.1rem', opacity: 0.8, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginTop: '1rem' }}>Social Media Links</h3>
                <div className="admin-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8, fontSize: '0.9rem' }}><Facebook size={14} /> Facebook URL</label>
                        <input
                            className="admin-input"
                            name="facebook"
                            value={formData.facebook}
                            onChange={handleChange}
                            placeholder="https://facebook.com/..."
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8, fontSize: '0.9rem' }}><Instagram size={14} /> Instagram URL</label>
                        <input
                            className="admin-input"
                            name="instagram"
                            value={formData.instagram}
                            onChange={handleChange}
                            placeholder="https://instagram.com/..."
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8, fontSize: '0.9rem' }}><Twitter size={14} /> Twitter URL</label>
                        <input
                            className="admin-input"
                            name="twitter"
                            value={formData.twitter}
                            onChange={handleChange}
                            placeholder="https://twitter.com/..."
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8, fontSize: '0.9rem' }}><PlayCircle size={14} /> YouTube URL</label>
                        <input
                            className="admin-input"
                            name="youtube"
                            value={formData.youtube}
                            onChange={handleChange}
                            placeholder="https://youtube.com/..."
                        />
                    </div>
                </div>

                <h3 style={{ fontSize: '1.1rem', opacity: 0.8, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginTop: '1rem' }}>Landing Page Media</h3>
                <div className="admin-grid" style={{ gridTemplateColumns: '1fr' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8, fontSize: '0.9rem' }}><PlayCircle size={14} /> Hero Background Video URL (MP4/WebM)</label>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <input
                                className="admin-input"
                                name="heroVideo"
                                value={formData.heroVideo || ''}
                                onChange={handleChange}
                                placeholder="https://example.com/video.mp4"
                                style={{ flex: 1, minWidth: '200px' }}
                            />
                            <div style={{ opacity: 0.5, fontSize: '0.9rem' }}>OR</div>
                            <label className="admin-btn btn-secondary" style={{ cursor: uploading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', opacity: uploading ? 0.7 : 1 }}>
                                {uploading ? (
                                    <>Processing {progress}%...</>
                                ) : (
                                    <><Box size={16} /> Upload Video</>
                                )}
                                <input
                                    type="file"
                                    accept="video/*"
                                    disabled={uploading}
                                    onChange={handleVideoUpload}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>

                        {/* Progress Bar */}
                        {uploading && (
                            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '0.5rem', overflow: 'hidden' }}>
                                <div style={{ width: `${progress}%`, height: '100%', background: 'var(--color-primary)', transition: 'width 0.2s' }} />
                            </div>
                        )}

                        {/* Video Preview */}
                        {formData.heroVideo && (
                            <div style={{ marginTop: '1rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: 'black', maxWidth: '300px' }}>
                                <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', fontSize: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Preview</div>
                                <video src={formData.heroVideo} controls style={{ width: '100%', display: 'block' }} />
                            </div>
                        )}

                        <p style={{ fontSize: '0.8rem', opacity: 0.5, marginTop: '0.5rem' }}>
                            If provided, this video will play in the background of the Home Hero section.
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <button type="submit" className="admin-btn btn-primary" style={{ minWidth: '150px' }}>
                        Save Settings
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function Admin() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const { products, addProduct, updateProduct, deleteProduct } = useProducts();
    const { addToast } = useToast();

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Simple Form State
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        description: '',
        type: 'burger',
        color: '#ff9f1c',
        calories: '',
        rating: '',
        quantity: '1',
        discount: '',
        image: ''
    });

    const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
    const [activeView, setActiveView] = useState('dashboard');
    const [, setLocation] = useLocation();

    // Category Filter State
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Get unique categories
    const categories = ['all', ...new Set(products.map(p => p.type))];

    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(p => p.type === selectedCategory);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    // Handle Resize
    useState(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'admin') {
            setIsAuthenticated(true);
            addToast('Welcome back, Admin!', 'success');
        } else {
            addToast('Invalid password', 'error');
        }
    };

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newProduct.name || !newProduct.price) return;

        if (isEditing) {
            updateProduct({
                ...newProduct,
                id: editingId,
                price: parseFloat(newProduct.price)
            });
            addToast(`Updated ${newProduct.name}`, 'success');
            setIsEditing(false);
            setEditingId(null);
        } else {
            addProduct({
                ...newProduct,
                price: parseFloat(newProduct.price)
            });
            addToast(`Added ${newProduct.name} to inventory`, 'success');
        }

        setNewProduct({
            name: '',
            price: '',
            description: '',
            type: 'burger',
            color: '#ff9f1c',
            calories: '',
            rating: '',
            quantity: '1',
            discount: '',
            image: ''
        });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewProduct(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    if (!isAuthenticated) {
        return (
            <PageTransition>
                <div style={{ paddingTop: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', justifyContent: 'center' }}>
                    <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
                        <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>Admin Access</h1>
                        <p style={{ opacity: 0.6, marginTop: '-1.5rem' }}>Please enter your credentials.</p>
                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
                            <input
                                type="password"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="admin-input"
                                style={{ textAlign: 'center', fontSize: '1.2rem', padding: '1rem' }}
                            />
                            <button type="submit" className="admin-btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            </PageTransition>
        );
    }

    const MenuItem = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => { setActiveView(id); if (window.innerWidth < 768) setSidebarOpen(false); }}
            className={`sidebar-link ${activeView === id ? 'active' : ''}`}
            title={!isSidebarOpen ? label : ''}
        >
            <Icon size={20} />
            {/* Show label if sidebar is open OR if on mobile (since sidebar overlays on mobile, text should be visible) */}
            {isSidebarOpen && <span>{label}</span>}
        </button>
    );

    const handleEditClick = (product) => {
        setNewProduct({
            name: product.name,
            price: product.price,
            description: product.description || '',
            type: product.type,
            color: product.color,
            calories: product.calories || '',
            rating: product.rating || '',
            quantity: product.quantity || '1',
            discount: product.discount || '',
            image: product.image || ''
        });
        setIsEditing(true);
        setEditingId(product.id);
        setActiveView('add_item');
        addToast(`Editing ${product.name}`, 'info');
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditingId(null);
        setNewProduct({
            name: '',
            price: '',
            description: '',
            type: 'burger',
            color: '#ff9f1c',
            calories: '',
            rating: '',
            quantity: '1',
            discount: '',
            image: ''
        });
    };

    const isMobile = window.innerWidth < 768;

    return (
        <PageTransition>
            <div style={{ display: 'flex', minHeight: '100vh', paddingTop: '80px', position: 'relative' }}>

                {/* Mobile Overlay */}
                <AnimatePresence>
                    {isSidebarOpen && isMobile && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                background: 'rgba(0,0,0,0.5)',
                                backdropFilter: 'blur(5px)',
                                zIndex: 9
                            }}
                        />
                    )}
                </AnimatePresence>

                {/* Sidebar */}
                <motion.div
                    initial={false}
                    animate={{
                        width: isSidebarOpen ? '280px' : (isMobile ? '0px' : '80px'),
                        x: isMobile && !isSidebarOpen ? -280 : 0
                    }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                    style={{
                        background: 'rgba(20, 20, 20, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRight: '1px solid rgba(255,255,255,0.05)',
                        padding: isSidebarOpen ? '1.5rem' : (isMobile ? 0 : '1.5rem 0.5rem'),
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        position: 'fixed',
                        top: '80px',
                        bottom: 0,
                        zIndex: 10,
                        overflowX: 'hidden',
                        whiteSpace: 'nowrap'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                        <button onClick={toggleSidebar} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.5, padding: '0.5rem' }}>
                            {isSidebarOpen ? isMobile ? <XCircle size={24} /> : '<<' : '>>'}
                        </button>
                    </div>

                    <button
                        onClick={() => setLocation('/')}
                        className="admin-btn btn-secondary"
                        style={{
                            width: '100%',
                            justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                            marginBottom: '2rem',
                            padding: isSidebarOpen ? '0.8rem 1.2rem' : '0.8rem'
                        }}
                        title="Back to Home"
                    >
                        <HomeIcon size={20} />
                        {isSidebarOpen && <span>Back to Home</span>}
                    </button>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, overflowY: 'auto' }}>
                        <MenuItem id="dashboard" label="Dashboard" icon={Activity} />
                        <MenuItem id="inventory" label="Inventory" icon={Box} />
                        <MenuItem id="orders" label="Orders" icon={ShoppingBag} />
                        <MenuItem id="add_item" label="Add New Item" icon={Plus} />
                        <MenuItem id="offers" label="Offers" icon={Tag} />
                        <MenuItem id="promo" label="Promo Codes" icon={Tag} />
                        <MenuItem id="shipping" label="Shipping" icon={Truck} />
                        <MenuItem id="hero" label="Hero Image" icon={Image} />
                        <MenuItem id="gallery" label="Image Gallery" icon={Image} />
                        <MenuItem id="settings" label="Settings" icon={Settings} />
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <button onClick={() => setIsAuthenticated(false)} className="sidebar-link" style={{ color: '#ff6b6b' }} title="Logout">
                            <Trash2 size={20} /> {/* Using Trash icon as signout placeholder */}
                            {isSidebarOpen && <span>Logout</span>}
                        </button>
                    </div>
                </motion.div>

                {/* Main Content */}
                <div style={{
                    flex: 1,
                    padding: isMobile ? '1rem' : '2rem',
                    marginLeft: isMobile ? 0 : (isSidebarOpen ? '280px' : '80px'),
                    width: '100%',
                    transition: 'margin-left 0.3s ease, padding 0.3s ease'
                }}>
                    {/* Mobile Menu Toggle */}
                    {isMobile && !isSidebarOpen && (
                        <button
                            onClick={() => setSidebarOpen(true)}
                            style={{
                                position: 'fixed',
                                bottom: '20px',
                                right: '20px',
                                background: 'var(--color-primary)',
                                color: 'white',
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                                zIndex: 100
                            }}
                        >
                            <Settings size={24} />
                        </button>
                    )}
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        {activeView === 'dashboard' && <DashboardHome setActiveView={setActiveView} />}

                        {activeView === 'inventory' && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                                    <h2 style={{ fontSize: '2rem' }}>Inventory <span style={{ fontSize: '1rem', opacity: 0.5, verticalAlign: 'middle' }}>({filteredProducts.length} items)</span></h2>

                                    {/* Category Filter Tabs */}
                                    <div className="glass-panel" style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem', borderRadius: '12px' }}>
                                        {categories.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setSelectedCategory(cat)}
                                                style={{
                                                    padding: '0.5rem 1.2rem',
                                                    borderRadius: '8px',
                                                    background: selectedCategory === cat ? 'var(--color-primary)' : 'transparent',
                                                    color: 'white',
                                                    fontWeight: selectedCategory === cat ? 600 : 400,
                                                    opacity: selectedCategory === cat ? 1 : 0.7,
                                                    textTransform: 'capitalize',
                                                    fontSize: '0.9rem',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="admin-grid">
                                    <AnimatePresence>
                                        {filteredProducts.map(product => (
                                            <motion.div
                                                key={product.id}
                                                layout
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="glass-panel"
                                                style={{
                                                    padding: '0',
                                                    borderLeft: `4px solid ${product.color}`,
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                    display: 'flex',
                                                    flexDirection: 'column'
                                                }}
                                            >
                                                {product.image && (
                                                    <div style={{ height: '120px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                                                        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="product-img" />
                                                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
                                                        <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', right: '0.75rem' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                                                <div>
                                                                    <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', opacity: 0.9, letterSpacing: '0.5px', background: product.color, padding: '0.1rem 0.3rem', borderRadius: '4px', color: 'black', fontWeight: 'bold' }}>{product.type}</span>
                                                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.2rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)', lineHeight: 1.2 }}>{product.name}</h3>
                                                                </div>
                                                                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>₹{product.price}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {!product.image && (
                                                    <div style={{ padding: '0.75rem', background: `linear-gradient(135deg, ${product.color}20, transparent)` }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                            <div>
                                                                <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', opacity: 0.6, letterSpacing: '0.5px', color: product.color }}>{product.type}</span>
                                                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.2rem', lineHeight: 1.2 }}>{product.name}</h3>
                                                            </div>
                                                            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)', marginRight: '2rem' }}>₹{product.price}</span>
                                                        </div>
                                                    </div>
                                                )}

                                                <div style={{ padding: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                    {product.description && (
                                                        <p style={{ fontSize: '0.8rem', opacity: 0.7, lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.description}</p>
                                                    )}
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', opacity: 0.6, borderTop: product.description ? '1px solid rgba(255,255,255,0.1)' : 'none', paddingTop: product.description ? '0.5rem' : '0' }}>
                                                        <div style={{ display: 'flex', gap: '0.6rem' }}>
                                                            <span>🔥 {product.calories}</span>
                                                            <span>⭐ {product.rating}</span>
                                                        </div>

                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                                            <span style={{ color: 'white', fontWeight: 600 }}>Qty: {product.quantity || 0}</span>
                                                            <div style={{ display: 'flex', gap: '0.3rem' }}>
                                                                <button onClick={() => handleEditClick(product)} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '0.25rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Edit Item">
                                                                    <div style={{ transform: 'rotate(45deg)', width: '12px', height: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                                                                        ✏️
                                                                    </div>
                                                                </button>
                                                                <button onClick={() => deleteProduct(product.id)} style={{ background: 'rgba(255,107,107,0.1)', color: '#ff6b6b', border: 'none', padding: '0.25rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Delete Item">
                                                                    <Trash2 size={12} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>


                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        )}

                        {activeView === 'add_item' && (
                            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <h2 style={{ fontSize: '2rem' }}>{isEditing ? 'Edit Item' : 'Add New Item'}</h2>
                                    {isEditing && (
                                        <button onClick={cancelEdit} className="admin-btn" style={{ background: 'rgba(255,255,255,0.1)' }}>
                                            Cancel Edit
                                        </button>
                                    )}
                                </div>
                                <form onSubmit={handleAdd} className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8 }}>Name</label>
                                            <div style={{ position: 'relative' }}>
                                                <Box size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                                                <input className="admin-input" style={{ paddingLeft: '3rem' }} value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="e.g. Mega Burger" required />
                                            </div>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8 }}>Price (₹)</label>
                                            <div style={{ position: 'relative' }}>
                                                <DollarSign size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                                                <input type="number" step="0.01" className="admin-input" style={{ paddingLeft: '3rem' }} value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} placeholder="0.00" required />
                                            </div>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8 }}>Discount (%)</label>
                                            <div style={{ position: 'relative' }}>
                                                <Tag size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                                                <input type="number" min="0" max="100" className="admin-input" style={{ paddingLeft: '3rem' }} value={newProduct.discount} onChange={e => setNewProduct({ ...newProduct, discount: e.target.value })} placeholder="0" />
                                            </div>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8 }}>Type</label>
                                            <div style={{ position: 'relative' }}>
                                                <Type size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                                                <select className="admin-input" style={{ paddingLeft: '3rem' }} value={newProduct.type} onChange={e => setNewProduct({ ...newProduct, type: e.target.value })}>
                                                    <option value="burger">Burger</option>
                                                    <option value="cake">Cake</option>
                                                    <option value="biscuit">Biscuit</option>
                                                    <option value="sweet">Sweet</option>
                                                    <option value="bakery">Bakery Item</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8 }}>Quantity (Stock)</label>
                                            <div style={{ position: 'relative' }}>
                                                <Box size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                                                <input type="number" min="0" className="admin-input" style={{ paddingLeft: '3rem' }} value={newProduct.quantity} onChange={e => setNewProduct({ ...newProduct, quantity: e.target.value })} placeholder="1" />
                                            </div>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8 }}>Calories</label>
                                            <input type="number" className="admin-input" value={newProduct.calories} onChange={e => setNewProduct({ ...newProduct, calories: e.target.value })} placeholder="500" />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8 }}>Rating</label>
                                            <input type="number" step="0.1" max="5" className="admin-input" value={newProduct.rating} onChange={e => setNewProduct({ ...newProduct, rating: e.target.value })} placeholder="4.5" />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8 }}>Theme Color</label>
                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '12px' }}>
                                                <input type="color" value={newProduct.color} onChange={e => setNewProduct({ ...newProduct, color: e.target.value })} style={{ width: '40px', height: '40px', border: 'none', background: 'none', cursor: 'pointer' }} />
                                                <span style={{ opacity: 0.7, fontFamily: 'monospace' }}>{newProduct.color}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8 }}>Description</label>
                                        <textarea className="admin-input" style={{ minHeight: '100px', resize: 'vertical' }} value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} placeholder="Delicious details..." />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8 }}>Image</label>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                <input
                                                    className="admin-input"
                                                    value={newProduct.image}
                                                    onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                                                    placeholder="Paste Image URL..."
                                                />
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.7, fontSize: '0.9rem' }}>
                                                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', flex: 1 }}></div>
                                                OR
                                                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', flex: 1 }}></div>
                                            </div>
                                            <label className="admin-btn btn-secondary" style={{ cursor: 'pointer', justifyContent: 'center' }}>
                                                <Image size={18} /> Upload from Device
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    style={{ display: 'none' }}
                                                />
                                            </label>
                                        </div>
                                        {newProduct.image && (
                                            <div style={{ marginTop: '1rem', borderRadius: '12px', overflow: 'hidden', height: '150px', width: '200px', border: '1px solid rgba(255,255,255,0.2)', position: 'relative' }}>
                                                <img src={newProduct.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                                        <button type="submit" className="admin-btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
                                            {isEditing ? 'Update Product' : 'Add Product'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeView === 'offers' && <OffersManager />}

                        {activeView === 'shipping' && <ShippingManager />}

                        {activeView === 'hero' && <UIManager />}

                        {activeView === 'gallery' && <ImageGallery />}

                        {activeView === 'promo' && <PromoCodeManager />}

                        {activeView === 'orders' && <OrderManager />}

                        {activeView === 'settings' && <SettingsManager />}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
