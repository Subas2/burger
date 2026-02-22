import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useOrders } from '../context/OrderContext';
import PageTransition from '../components/layout/PageTransition';
import { Search, Package, Truck, CheckCircle, Clock, MapPin, Phone, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TrackOrder() {
    const [location, setLocation] = useLocation();

    const pathParts = location.split('/');
    const initialOrderId = pathParts.length > 2 ? pathParts[pathParts.length - 1] : '';

    const [orderId, setOrderId] = useState(initialOrderId);
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const { orders } = useOrders();

    // Simulate Status Steps
    const steps = [
        { status: 'preparing', label: 'Preparing', icon: Package, color: '#ff9f1c' },
        { status: 'baked', label: 'Baked & Packed', icon: CheckCircle, color: '#2ec4b6' },
        { status: 'out_for_delivery', label: 'Out for Delivery', icon: Truck, color: '#ff6b6b' },
        { status: 'delivered', label: 'Delivered', icon: MapPin, color: '#4cc9f0' }
    ];

    const handleTrack = (e) => {
        if (e) e.preventDefault();
        if (!orderId) return;

        setLoading(true);
        setStatus(null);

        setTimeout(() => {
            setLoading(false);
            const realOrder = orders.find(o => o.id.toString() === orderId.toString());

            if (realOrder) {
                setStatus(realOrder.status);
            } else {
                // Fallback Simulation
                if (orderId) {
                    setStatus('preparing');
                    setTimeout(() => setStatus('baked'), 3000);
                    setTimeout(() => setStatus('out_for_delivery'), 6000);
                    setTimeout(() => setStatus('delivered'), 10000);
                }
            }
        }, 1000);
    };

    useEffect(() => {
        if (!orderId) return;
        const realOrder = orders.find(o => o.id.toString() === orderId.toString());
        if (realOrder) {
            setStatus(realOrder.status);
        }
    }, [orders, orderId]);

    useEffect(() => {
        if (initialOrderId) {
            handleTrack();
        }
    }, [initialOrderId]);

    const getStepIndex = (currentStatus) => {
        return steps.findIndex(s => s.status === currentStatus);
    };

    const currentStepIndex = getStepIndex(status);

    return (
        <PageTransition>
            <div className="track-order-page" style={{ position: 'relative', minHeight: '100vh', paddingTop: '100px', overflow: 'hidden' }}>

                {/* Simulated Map Background */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: '#242424',
                    zIndex: 0,
                    opacity: 0.3
                }}>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '30px 30px'
                    }} />
                    {/* Simulated Map Path/Pins could go here if we wanted to get fancy */}
                </div>

                <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto', padding: '0 2rem' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-main)', marginBottom: '2rem', textAlign: 'center', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>Track Your Order</h1>

                        <form onSubmit={handleTrack} style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem auto' }}>
                            <div className="input-wrapper" style={{ flex: 1, padding: '0 1rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center' }}>
                                <input
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    placeholder="Enter Order ID"
                                    style={{
                                        width: '100%',
                                        padding: '1rem 0',
                                        background: 'none',
                                        border: 'none',
                                        color: 'white',
                                        outline: 'none',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    padding: '0 2rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: 'var(--color-primary)',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    boxShadow: '0 4px 15px rgba(255,107,53,0.4)'
                                }}
                            >
                                {loading ? <Clock size={20} className="spin" /> : <Search size={20} />}
                                Track
                            </button>
                        </form>
                    </motion.div>

                    {status && (
                        <div className="tracking-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>

                            {/* Status Card */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                style={{
                                    background: 'rgba(0,0,0,0.6)',
                                    backdropFilter: 'blur(20px)',
                                    padding: '2rem',
                                    borderRadius: '24px',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <div>
                                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>Order #{orderId}</h2>
                                        <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Estimated Delivery: 30-45 mins</p>
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 600 }}>
                                        {new Date().toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="timeline-container" style={{ position: 'relative', padding: '1rem 0' }}>
                                    {/* Timeline Line */}
                                    <div className="timeline-line" />

                                    {/* Timeline progress line */}
                                    <div className="timeline-progress" style={{
                                        // Dynamic width/height calculation via JS logic usually, but here handled via CSS classes or inline logic
                                    }} />

                                    {steps.map((step, index) => {
                                        const isActive = index <= currentStepIndex;
                                        const isCurrent = index === currentStepIndex;
                                        return (
                                            <div key={step.status} className={`timeline-step ${isActive ? 'active' : ''}`} style={{ opacity: isActive ? 1 : 0.5 }}>
                                                <div className="step-icon" style={{
                                                    background: isActive ? step.color : '#2a2a2a',
                                                    boxShadow: isCurrent ? `0 0 20px ${step.color}60` : 'none',
                                                    border: isActive ? 'none' : '2px solid rgba(255,255,255,0.1)'
                                                }}>
                                                    <step.icon size={20} color={isActive ? 'white' : 'rgba(255,255,255,0.3)'} />
                                                </div>
                                                <div className="step-content">
                                                    <p style={{ fontWeight: isActive ? 700 : 400, fontSize: '1rem' }}>{step.label}</p>
                                                    {isCurrent && <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.2rem' }}>Happening now...</p>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>

                            {/* Driver / Info Card */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                            >
                                {status === 'out_for_delivery' || status === 'delivered' ? (
                                    <div style={{
                                        background: 'rgba(255,255,255,0.95)',
                                        color: '#1a1a1a',
                                        padding: '1.5rem',
                                        borderRadius: '24px',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
                                    }}>
                                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Your Driver</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                            <div style={{ width: '60px', height: '60px', background: '#eee', borderRadius: '50%', fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                👨‍🚀
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: 800, fontSize: '1.2rem' }}>Alex Rider</p>
                                                <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Electric Scooter • 4.9 <Star size={12} fill="gold" stroke="none" /></p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <button style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', border: 'none', background: '#1a1a1a', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                                <Phone size={18} /> Call
                                            </button>
                                            <button style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', border: '1px solid #ddd', background: 'white', color: '#1a1a1a', fontWeight: 600, cursor: 'pointer' }}>
                                                Message
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        backdropFilter: 'blur(10px)',
                                        padding: '2rem',
                                        borderRadius: '24px',
                                        border: '1px dotted rgba(255,255,255,0.2)',
                                        textAlign: 'center',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%'
                                    }}>
                                        <Clock size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                                        <p style={{ opacity: 0.6 }}>Driver details will appear once your order is out for delivery.</p>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    )}
                </div>

                <style>{`
                    @keyframes spin { 100% { transform: rotate(360deg); } }
                    .spin { animation: spin 1s linear infinite; }

                    .timeline-container {
                        display: flex;
                        justify-content: space-between;
                        margin-top: 2rem;
                    }
                    .timeline-line {
                        position: absolute;
                        top: 25px; /* Adjust based on icon size */
                        left: 0;
                        width: 100%;
                        height: 2px;
                        background: rgba(255,255,255,0.1);
                        z-index: 0;
                    }
                    .timeline-step {
                        position: relative;
                        z-index: 1;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 1rem;
                        flex: 1;
                        text-align: center;
                    }
                    .step-icon {
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.3s ease;
                    }

                    @media (max-width: 968px) {
                        .tracking-grid {
                            grid-template-columns: 1fr !important;
                        }
                    }

                    @media (max-width: 600px) {
                        div[style*="padding-top: 100px"] {
                             padding-top: 80px !important;
                        }
                        .timeline-container {
                            flex-direction: column;
                            gap: 2rem;
                            padding-left: 0;
                        }
                        .timeline-line {
                            width: 2px;
                            height: 100%;
                            left: 24px; /* Align with icon center (50px / 2 - 1px) */
                            top: 0;
                        }
                        .timeline-step {
                            flex-direction: row;
                            align-items: center;
                            text-align: left;
                            gap: 1.5rem;
                        }
                    }
                `}</style>
            </div>
        </PageTransition>
    );
}
