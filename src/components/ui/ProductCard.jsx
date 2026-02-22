import { useState } from 'react';
import { Plus, Minus, Star, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useFavorites } from '../../context/FavoritesContext';
import { motion } from 'framer-motion';

export default function ProductCard({ product, type, imageHeight = '100px', imageObjectFit = 'cover', isBanner = false, onClick }) {
    console.log("ProductCard.jsx: Rendering", product?.name);
    const isBurger = type === 'burger';
    const accentColor = isBurger ? 'var(--color-primary)' : 'var(--color-secondary)';
    const { addToCart } = useCart();
    const { addToast } = useToast();
    const { isFavorite, toggleFavorite } = useFavorites();
    const [quantity, setQuantity] = useState(1);

    const favoriteStatus = isFavorite(product.id);

    // Styling helpers
    const originalPrice = parseFloat(product.price);
    const discount = parseInt(product.discount) || 0;
    const hasDiscount = discount > 0;
    const discountedPrice = hasDiscount ? (originalPrice - (originalPrice * discount / 100)) : originalPrice;

    const handleQuantityChange = (e, change) => {
        e.stopPropagation();
        const newQuantity = quantity + change;
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };

    return (
        <motion.div
            className="product-card"
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(0,0,0,0.2))',
                backdropFilter: 'blur(16px)',
                borderRadius: '20px',
                padding: isBanner ? '2rem' : '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: isBanner ? '1.5rem' : '0.3rem',
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.05)',
                position: 'relative',
                overflow: 'hidden',
            }}
            onClick={onClick}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(0,0,0,0.2))';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.boxShadow = 'none';
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = `linear-gradient(145deg, rgba(255,255,255,0.05), ${product.color}10)`;
                e.currentTarget.style.borderColor = `${product.color}50`;
                e.currentTarget.style.boxShadow = `0 20px 50px -10px ${product.color}30`;
            }}
        >
            {/* Glare Effect Optional (Removed the dynamic light for simpler smooth animation) */}
            {/* Discount Badge */}
            {hasDiscount && (
                <div className="product-badge" style={{
                    position: 'absolute',
                    top: isBanner ? '1.5rem' : '0.8rem',
                    left: isBanner ? '1.5rem' : '0.8rem',
                    background: 'var(--color-secondary)',
                    color: 'black',
                    fontWeight: '800',
                    fontSize: isBanner ? '1rem' : '0.7rem',
                    padding: isBanner ? '0.4rem 1rem' : '0.2rem 0.6rem',
                    borderRadius: '50px',
                    zIndex: 10,
                    boxShadow: '0 4px 12px rgba(255,143,171,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                }}>
                    <span style={{ fontSize: isBanner ? '1.2rem' : '0.8rem' }}>🔥</span> {discount}% OFF
                </div>
            )}

            {/* Favorite Toggle */}
            <button
                className="product-fav-btn"
                onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product);
                }}
                style={{
                    position: 'absolute',
                    top: isBanner ? '1.5rem' : '0.8rem',
                    right: isBanner ? '1.5rem' : '0.8rem',
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(5px)',
                    border: 'none',
                    borderRadius: '50%',
                    width: isBanner ? '40px' : '32px',
                    height: isBanner ? '40px' : '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10,
                    transition: 'all 0.2s'
                }}
            >
                <Heart
                    size={isBanner ? 24 : 18}
                    fill={favoriteStatus ? '#ff4d4d' : 'none'}
                    color={favoriteStatus ? '#ff4d4d' : 'white'}
                />
            </button>

            <div className="product-img-container" style={{
                height: imageHeight,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                marginTop: isBanner ? '1rem' : '0.5rem'
            }}>
                {/* Glow behind image */}
                <div style={{
                    position: 'absolute',
                    width: '60%',
                    height: '60%',
                    background: product.color,
                    filter: 'blur(40px)',
                    opacity: 0.2,
                    borderRadius: '50%',
                    zIndex: 0
                }} />

                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: imageObjectFit, zIndex: 1, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
                    />
                ) : (
                    <span className="product-img-fallback" style={{ fontSize: isBanner ? '8rem' : '4rem', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))', zIndex: 1 }}>
                        {isBurger ? '🍔' : '🍩'}
                    </span>
                )}
            </div>

            {/* Product Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: isBanner ? '0.5rem' : '0.2rem', overflow: 'hidden' }}>
                <h3 className="product-title" style={{ margin: 0, fontFamily: 'var(--font-main)', fontSize: isBanner ? '2.5rem' : '1.2rem', lineHeight: 1.1, textAlign: isBanner ? 'center' : 'left' }}>{product.name}</h3>

                {/* Stats */}
                <div className="product-stats" style={{ display: 'flex', gap: '0.8rem', fontSize: '0.75rem', opacity: 0.7, justifyContent: isBanner ? 'center' : 'flex-start' }}>
                    {product.calories && <span>🔥 {product.calories}</span>}

                    <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={isBanner ? 20 : 14}
                                fill={i < Math.floor(product.rating || 0) ? "#FFD700" : "none"}
                                color={i < Math.floor(product.rating || 0) ? "#FFD700" : "rgba(255,255,255,0.3)"}
                            />
                        ))}
                        <span style={{ marginLeft: '4px', fontSize: isBanner ? '1rem' : '0.8rem', opacity: 0.8 }}>
                            {product.rating || 'N/A'}
                        </span>
                    </div>
                </div>

                <p className="product-desc" style={{ fontSize: isBanner ? '1rem' : '0.8rem', opacity: 0.6, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: isBanner ? 3 : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0, textAlign: isBanner ? 'center' : 'left' }}>
                    {product.description}
                </p>
            </div>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '0.2rem 0' }} />

            {/* Price & Action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
                <div>
                    {hasDiscount && (
                        <div className="product-price-original" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: 0.6, fontSize: isBanner ? '1rem' : '0.8rem', marginBottom: '0.1rem' }}>
                            <span style={{ textDecoration: 'line-through' }}>₹{originalPrice.toFixed(0)}</span>
                            <span style={{ color: 'var(--color-secondary)' }}>Save ₹{(originalPrice - discountedPrice).toFixed(0)}</span>
                        </div>
                    )}
                    <div className="product-price-container" style={{ fontSize: isBanner ? '2.5rem' : '1.4rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>
                        ₹{discountedPrice.toFixed(0)}
                        <span style={{ fontSize: '0.9em', opacity: 0.5, fontWeight: 400 }}>.99</span>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div className="product-quantity-controls" style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '16px',
                        padding: '0.1rem',
                    }} onClick={e => e.stopPropagation()}>
                        <button onClick={(e) => handleQuantityChange(e, -1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={12} /></button>
                        <span style={{ fontWeight: 600, minWidth: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{quantity}</span>
                        <button onClick={(e) => handleQuantityChange(e, 1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={12} /></button>
                    </div>

                    <button
                        className="product-add-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product, quantity);
                            addToast(`Added ${quantity} x ${product.name} to bag`);
                            setQuantity(1);
                        }}
                        style={{
                            background: accentColor,
                            color: isBurger ? 'white' : 'black',
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: `0 4px 12px ${product.color} 30`,
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
