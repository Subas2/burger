import { Link, useLocation } from 'wouter';
import { ShoppingBag, Menu, X, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import CartSidebar from './CartSidebar';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [location] = useLocation();
    const { cartCount } = useCart();
    const { favorites } = useFavorites();

    const links = [
        { href: '/', label: 'Home' },
        { href: '/burgers', label: 'Burgers' },
        { href: '/bakery', label: 'Bakery' },
        { href: '/orders', label: 'My Orders' },
    ];

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            padding: '1.5rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 100,
            background: 'rgba(10, 10, 10, 0.6)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
            <Link href="/">
                <a style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-main)' }}>
                    <span style={{ color: 'var(--color-primary)' }}>BURGER</span> &
                    <span style={{ color: 'var(--color-secondary)' }}>BAKERY</span>
                </a>
            </Link>

            {/* Desktop Links */}
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="desktop-menu">
                <Link href="/">
                    <a style={{
                        color: location === '/' ? 'var(--color-primary)' : 'rgba(255,255,255,0.7)',
                        fontWeight: 500,
                        transition: 'color 0.3s'
                    }}>
                        Home
                    </a>
                </Link>
                <Link href="/burgers">
                    <a style={{
                        color: location === '/burgers' ? 'var(--color-primary)' : 'rgba(255,255,255,0.7)',
                        fontWeight: 500,
                        transition: 'color 0.3s'
                    }}>
                        Burgers
                    </a>
                </Link>
                <Link href="/cakes">
                    <a style={{
                        color: location === '/cakes' ? 'var(--color-primary)' : 'rgba(255,255,255,0.7)',
                        fontWeight: 500,
                        transition: 'color 0.3s'
                    }}>
                        Cakes
                    </a>
                </Link>
                <Link href="/biscuits">
                    <a style={{
                        color: location === '/biscuits' ? 'var(--color-primary)' : 'rgba(255,255,255,0.7)',
                        fontWeight: 500,
                        transition: 'color 0.3s'
                    }}>
                        Biscuits
                    </a>
                </Link>
                <Link href="/sweets">
                    <a style={{
                        color: location === '/sweets' ? 'var(--color-primary)' : 'rgba(255,255,255,0.7)',
                        fontWeight: 500,
                        transition: 'color 0.3s'
                    }}>
                        Sweets
                    </a>
                </Link>
                <Link href="/bakery">
                    <a style={{
                        color: location === '/bakery' ? 'var(--color-primary)' : 'rgba(255,255,255,0.7)',
                        fontWeight: 500,
                        transition: 'color 0.3s'
                    }}>
                        Bakery
                    </a>
                </Link>
                <Link href="/orders">
                    <a style={{
                        color: location === '/orders' ? 'var(--color-primary)' : 'rgba(255,255,255,0.7)',
                        fontWeight: 500,
                        transition: 'color 0.3s'
                    }}>
                        My Orders
                    </a>
                </Link>
                <Link href="/wishlist">
                    <a style={{
                        color: location === '/wishlist' ? 'var(--color-primary)' : 'rgba(255,255,255,0.7)',
                        fontWeight: 500,
                        transition: 'color 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        position: 'relative'
                    }}>
                        <Heart size={20} fill={location === '/wishlist' ? 'currentColor' : 'none'} />
                        {favorites.length > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: -8,
                                right: -8,
                                background: 'var(--color-primary)',
                                color: 'white',
                                borderRadius: '50%',
                                width: '16px',
                                height: '16px',
                                fontSize: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold'
                            }}>{favorites.length}</span>
                        )}
                    </a>
                </Link>
                <motion.button
                    style={{ color: 'white', position: 'relative' }}
                    key={cartCount}
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setIsCartOpen(true)}
                >
                    <ShoppingBag size={24} />
                    <span style={{
                        position: 'absolute',
                        top: -5,
                        right: -5,
                        background: 'var(--color-accent)',
                        color: 'black',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        fontSize: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                    }}>{cartCount}</span>
                </motion.button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
                className="mobile-toggle"
                onClick={() => setIsOpen(!isOpen)}
                style={{ color: 'white', display: 'none' }} // Hidden by default, shown via CSS
            >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            <style>{`
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>

            {/* Mobile Menu Overlay */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                background: 'rgba(10,10,10,0.95)',
                backdropFilter: 'blur(15px)',
                zIndex: 99,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2rem',
                transition: 'transform 0.3s ease-in-out',
                transform: isOpen ? 'translateY(0)' : 'translateY(-100%)',
                pointerEvents: isOpen ? 'all' : 'none'
            }}>
                <Link href="/" className="mobile-link" onClick={() => setIsOpen(false)}>
                    <a style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: location === '/' ? 'var(--color-primary)' : 'white',
                        fontFamily: 'var(--font-main)'
                    }}>
                        Home
                    </a>
                </Link>
                <Link href="/burgers" className="mobile-link" onClick={() => setIsOpen(false)}>
                    <a style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: location === '/burgers' ? 'var(--color-primary)' : 'white',
                        fontFamily: 'var(--font-main)'
                    }}>
                        Burgers
                    </a>
                </Link>
                <Link href="/cakes" className="mobile-link" onClick={() => setIsOpen(false)}>
                    <a style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: location === '/cakes' ? 'var(--color-primary)' : 'white',
                        fontFamily: 'var(--font-main)'
                    }}>
                        Cakes
                    </a>
                </Link>
                <Link href="/biscuits" className="mobile-link" onClick={() => setIsOpen(false)}>
                    <a style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: location === '/biscuits' ? 'var(--color-primary)' : 'white',
                        fontFamily: 'var(--font-main)'
                    }}>
                        Biscuits
                    </a>
                </Link>
                <Link href="/sweets" className="mobile-link" onClick={() => setIsOpen(false)}>
                    <a style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: location === '/sweets' ? 'var(--color-primary)' : 'white',
                        fontFamily: 'var(--font-main)'
                    }}>
                        Sweets
                    </a>
                </Link>
                <Link href="/bakery" className="mobile-link" onClick={() => setIsOpen(false)}>
                    <a style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: location === '/bakery' ? 'var(--color-primary)' : 'white',
                        fontFamily: 'var(--font-main)'
                    }}>
                        Bakery
                    </a>
                </Link>
                <Link href="/track-order" className="mobile-link" onClick={() => setIsOpen(false)}>
                    <a style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: location === '/track-order' ? 'var(--color-primary)' : 'white',
                        fontFamily: 'var(--font-main)'
                    }}>
                        Track Order
                    </a>
                </Link>
                <Link href="/wishlist" className="mobile-link" onClick={() => setIsOpen(false)}>
                    <a style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: location === '/wishlist' ? 'var(--color-primary)' : 'white',
                        fontFamily: 'var(--font-main)'
                    }}>
                        Wishlist
                    </a>
                </Link>
                <Link href="/checkout" className="mobile-link" onClick={() => setIsOpen(false)}>
                    <a style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: location === '/checkout' ? 'var(--color-primary)' : 'white',
                        fontFamily: 'var(--font-main)'
                    }}>
                        Checkout
                    </a>
                </Link>
                <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1rem 0' }} />

            </div>

            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            {/* Scroll Progress Indicator */}
            <motion.div
                style={{
                    scaleX: useSpring(useScroll().scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 }),
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
                    transformOrigin: '0%',
                    zIndex: 101
                }}
            />
        </nav>
    );
}
