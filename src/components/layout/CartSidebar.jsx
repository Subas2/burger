import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus } from 'lucide-react';
import { useLocation } from 'wouter';
import { createPortal } from 'react-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export default function CartSidebar({ isOpen, onClose }) {
    const { items, addToCart, removeFromCart, cartCount, totalPrice } = useCart();
    const { addToast } = useToast();
    const [, setLocation] = useLocation();

    const handleCheckout = () => {
        if (items.length === 0) return;
        onClose();
        setLocation('/checkout');
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'rgba(0,0,0,0.6)',
                            zIndex: 9998,
                            backdropFilter: 'blur(4px)'
                        }}
                    />

                    {/* Sidebar */}
                    <motion.div
                        className="cart-sidebar"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            width: '100%',
                            maxWidth: '400px',
                            height: '100%',
                            background: '#141414', // Solid dark background
                            zIndex: 9999,
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '-10px 0 40px rgba(0,0,0,0.8)',
                            borderLeft: '1px solid rgba(255,255,255,0.1)'
                        }}
                    >
                        <style>{`
                            @media (max-width: 600px) {
                                .cart-sidebar {
                                    padding: 1.2rem !important;
                                }
                                .cart-sidebar h2 {
                                    font-size: 1.4rem !important;
                                }
                                .cart-item-card {
                                    padding: 0.8rem !important;
                                    gap: 0.5rem !important;
                                }
                                .cart-item-card h4 {
                                    font-size: 0.95rem !important;
                                }
                                .cart-item-card button {
                                    padding: 0.2rem !important;
                                }
                            }
                        `}</style>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-main)', fontWeight: 700 }}>Your Bag ({cartCount})</h2>
                            <button onClick={onClose} style={{ color: 'white', padding: '0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
                            {items.length === 0 ? (
                                <div style={{ margin: 'auto', textAlign: 'center', opacity: 0.5 }}>
                                    <p>Your bag is empty.</p>
                                    <p style={{ fontSize: '3rem', marginTop: '1rem' }}>🍔</p>
                                </div>
                            ) : (
                                items.map(item => (
                                    <div key={item.id} className="cart-item-card" style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        border: '1px solid rgba(255,255,255,0.05)'
                                    }}>
                                        <div style={{
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '8px',
                                            background: `${item.color}20`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.5rem'
                                        }}>
                                            {item.type === 'burger' ? '🍔' : '🍩'}
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ fontWeight: 600, fontSize: '1.1rem' }}>{item.name}</h4>
                                            <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>₹{item.price}</p>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '0.2rem' }}>
                                                <button onClick={() => removeFromCart(item.id)} style={{ padding: '0.3rem', color: '#ff6b6b', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={14} /></button>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                                <button onClick={() => addToCart(item)} style={{ padding: '0.3rem', color: '#2ec4b6', background: 'none', border: 'none', cursor: 'pointer' }}><Plus size={14} /></button>
                                            </div>
                                            <p style={{ fontWeight: 700 }}>₹{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', marginTop: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 700 }}>
                                <span>Total</span>
                                <span style={{ color: 'var(--color-primary)' }}>₹{totalPrice?.toFixed(2) || '0.00'}</span>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={items.length === 0}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: items.length === 0 ? 'rgba(255,255,255,0.1)' : 'var(--color-primary)',
                                    color: items.length === 0 ? 'rgba(255,255,255,0.3)' : 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '1.1rem',
                                    fontWeight: 700,
                                    cursor: items.length === 0 ? 'not-allowed' : 'pointer',
                                    boxShadow: items.length > 0 ? '0 10px 20px rgba(255,107,53,0.3)' : 'none'
                                }}>
                                Checkout
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
