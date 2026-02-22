import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import PageTransition from '../components/layout/PageTransition';
import { Package, Clock, CheckCircle, ArrowRight, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Orders() {
    const { orders, hideOrder } = useOrders();
    const { addToast } = useToast();
    const [, setLocation] = useLocation();
    const [activeTab, setActiveTab] = useState('undelivered');

    // Filter out hidden orders (deleted by customer)
    const visibleOrders = orders.filter(o => !o.hidden);

    const undeliveredOrders = visibleOrders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
    const deliveredOrders = visibleOrders.filter(o => o.status === 'delivered');
    const cancelledOrders = visibleOrders.filter(o => o.status === 'cancelled');

    const getOrdersToDisplay = () => {
        switch (activeTab) {
            case 'undelivered': return undeliveredOrders;
            case 'delivered': return deliveredOrders;
            case 'cancelled': return cancelledOrders;
            default: return undeliveredOrders;
        }
    };

    const displayOrders = getOrdersToDisplay();

    return (
        <PageTransition>
            <div style={{ paddingTop: '100px', paddingBottom: '4rem', maxWidth: '1000px', margin: '0 auto', paddingLeft: '2rem', paddingRight: '2rem', minHeight: '80vh' }}>
                <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-main)', marginBottom: '2rem' }}>My Orders</h1>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                    <TabButton
                        label="Active"
                        isActive={activeTab === 'undelivered'}
                        onClick={() => setActiveTab('undelivered')}
                        count={undeliveredOrders.length}
                    />
                    <TabButton
                        label="Delivered"
                        isActive={activeTab === 'delivered'}
                        onClick={() => setActiveTab('delivered')}
                        count={deliveredOrders.length}
                    />
                    <TabButton
                        label="Cancelled"
                        isActive={activeTab === 'cancelled'}
                        onClick={() => setActiveTab('cancelled')}
                        count={cancelledOrders.length}
                    />
                </div>

                {/* Orders List */}
                <section>
                    {displayOrders.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>
                            <Package size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <p>No orders in this category.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {displayOrders.map(order => (
                                <div key={order.id} style={{ ...orderCardStyle, opacity: order.status === 'delivered' || order.status === 'cancelled' ? 0.8 : 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Order #{order.id}</h3>
                                            <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>{new Date(order.date).toLocaleString()}</p>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                            <span style={{
                                                padding: '0.3rem 0.8rem',
                                                borderRadius: '20px',
                                                background: order.status === 'delivered' ? 'rgba(75, 181, 67, 0.1)' :
                                                    order.status === 'cancelled' ? 'rgba(231, 29, 54, 0.1)' :
                                                        'rgba(255, 107, 53, 0.1)',
                                                color: order.status === 'delivered' ? '#4bb543' :
                                                    order.status === 'cancelled' ? '#e71d36' :
                                                        'var(--color-primary)',
                                                fontSize: '0.9rem',
                                                fontWeight: 600,
                                                textTransform: 'capitalize'
                                            }}>
                                                {order.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '1rem' }}>
                                        {order.items.map(item => (
                                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '0.3rem' }}>
                                                <span>{item.quantity}x {item.name}</span>
                                                <span style={{ opacity: 0.7 }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Total: ₹{order.total.toFixed(2)}</span>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to remove this order from your history?')) {
                                                        hideOrder(order.id);
                                                        addToast("Order removed from history", "success");
                                                    }
                                                }}
                                                style={{
                                                    background: 'rgba(255,107,53,0.1)',
                                                    color: '#ff6b6b',
                                                    border: 'none',
                                                    padding: '0.5rem 0.8rem',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.4rem',
                                                    fontWeight: 600
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            {activeTab === 'undelivered' && (
                                                <button
                                                    onClick={() => setLocation(`/track-order/${order.id}`)}
                                                    style={{
                                                        background: 'var(--color-primary)',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '0.5rem 1rem',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    Track Status <ArrowRight size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div >
        </PageTransition >
    );
}

function TabButton({ label, isActive, onClick, count }) {
    return (
        <button
            onClick={onClick}
            style={{
                background: 'none',
                border: 'none',
                padding: '0.5rem 0',
                marginRight: '1rem',
                fontSize: '1rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--color-primary)' : 'rgba(255,255,255,0.6)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s'
            }}
        >
            {label}
            <span style={{
                marginLeft: '0.5rem',
                fontSize: '0.8rem',
                background: isActive ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                color: 'white',
                padding: '0.1rem 0.5rem',
                borderRadius: '10px',
                opacity: isActive ? 1 : 0.6
            }}>
                {count}
            </span>
            {isActive && (
                <motion.div
                    layoutId="activeTab"
                    style={{
                        position: 'absolute',
                        bottom: '-1px', // Align with border
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'var(--color-primary)'
                    }}
                />
            )}
        </button>
    );
}

const orderCardStyle = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '16px',
    padding: '1.5rem',
    transition: 'transform 0.2s',
    cursor: 'default'
};
