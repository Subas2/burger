import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { ChevronDown, ArrowRight, Star } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useUI } from '../context/UIContext';
import Navbar from '../components/layout/Navbar';
import CategorySection from '../components/ui/CategorySection';
import PageTransition from '../components/layout/PageTransition';
import ProductCard from '../components/ui/ProductCard';
import ProductDetailModal from '../components/ui/ProductDetailModal';
import Footer from '../components/layout/Footer.jsx';

// Import 2D Assets
import heroBurger from '../assets/hero-burger.png';
import heroCake from '../assets/hero-cake.png';

export default function Home() {
    console.log("Home.jsx: Rendering...");
    const { addToCart } = useCart();
    const { addToast } = useToast();
    const { getBurgers, getCakes, getBakeryItems, getBiscuits, getSweets } = useProducts();
    const { heroImage, contactInfo } = useUI();

    // Product Modal State
    const [selectedProduct, setSelectedProduct] = useState(null);

    const burgers = getBurgers();
    const cakes = getCakes();
    const bakeryItems = getBakeryItems();
    const biscuits = getBiscuits();
    const sweets = getSweets();

    const offers = [...burgers, ...cakes, ...bakeryItems, ...sweets].filter(p => p.discount);
    const isSingleOffer = offers.length === 1;

    const scrollToMenu = () => {
        const menuSection = document.getElementById('menu-section');
        if (menuSection) {
            menuSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (burgers.length === 0 && cakes.length === 0) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <h1>Loading fresh ingredients...</h1>
            </div>
        );
    }

    return (
        <>
            <div style={{ minHeight: '100vh', paddingBottom: '2rem' }}>

                {/* Hero Section */}
                <section style={{
                    height: '100vh',
                    width: '100%',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: '80px', // Add padding for Navbar
                    background: '#0a0a0a'
                }}>
                    {/* Video Background */}
                    {contactInfo?.heroVideo && (
                        <video
                            src={contactInfo.heroVideo}
                            autoPlay
                            loop
                            muted
                            playsInline
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                zIndex: 0,
                                opacity: 0.6
                            }}
                        />
                    )}

                    {/* Background Glow (Only if no video, or maybe overlay it?) - Keeping it for style but reducing opacity if video exists */}
                    <div style={{
                        position: 'absolute',
                        top: '40%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80vw',
                        height: '80vw',
                        background: 'radial-gradient(circle, rgba(255, 107, 53, 0.15) 0%, transparent 60%)',
                        filter: 'blur(120px)',
                        zIndex: 0,
                        display: contactInfo?.heroVideo ? 'none' : 'block'
                    }} />

                    {/* Gradient Overlay for texture */}
                    <div className="noise-overlay" style={{ opacity: 0.05 }} />

                    <div style={{
                        maxWidth: '1400px',
                        width: '100%',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        padding: '0 4rem',
                        alignItems: 'center',
                        zIndex: 1,
                        gap: '4rem'
                    }}>
                        {/* Text Content */}
                        <div style={{ position: 'relative', zIndex: 2 }}>
                            <motion.h1
                                initial={{ opacity: 1, y: 0 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1 }}
                                style={{
                                    fontSize: 'clamp(2.5rem, 8vw, 6.5rem)',
                                    fontWeight: 800,
                                    lineHeight: 0.95,
                                    marginBottom: '2rem',
                                    fontFamily: 'var(--font-main)',
                                    color: 'white',
                                    textShadow: '0 5px 15px rgba(0,0,0,0.5)'
                                }}
                            >
                                DIG IN.<br />
                                <motion.span
                                    style={{ color: 'var(--color-primary)', display: 'inline-block' }}
                                    animate={{
                                        textShadow: ['0 0 20px rgba(255,107,53,0.5)', '0 0 50px rgba(255,107,53,0.8)', '0 0 20px rgba(255,107,53,0.5)']
                                    }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    REAL.
                                </motion.span><br />
                                TASTY.
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 1 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8 }}
                                style={{
                                    fontSize: '1.25rem',
                                    opacity: 0.8,
                                    maxWidth: '500px',
                                    marginBottom: '3rem',
                                    lineHeight: 1.6,
                                    background: 'linear-gradient(90deg, #fff, rgba(255,255,255,0.5))',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}
                            >
                                Hand-crafted burgers, artisanal cakes, and sweet treats made with passion. Experience flavor in high definition.
                            </motion.p>

                            <motion.button
                                className="hero-btn"
                                initial={{ opacity: 1 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                onClick={scrollToMenu}
                                whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(255, 107, 53, 0.3)' }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    padding: '1.2rem 3rem',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    background: 'var(--color-primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50px',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.8rem',
                                    boxShadow: '0 5px 15px rgba(255, 107, 53, 0.2)',
                                    transition: 'background 0.3s'
                                }}
                            >
                                ORDER NOW <ArrowRight size={20} />
                            </motion.button>
                        </div>

                        {/* 2D Assets Animation Container */}
                        <div className="hero-images-container" style={{ position: 'relative', height: '600px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {/* Cake - Background Element */}
                            <motion.img
                                className="hero-cake-img"
                                src={heroCake}
                                alt="Yummy Cake"
                                initial={{ opacity: 0, scale: 0.5, x: 50 }}
                                // Floating Animation (Opposite phase)
                                animate={{
                                    opacity: 1,
                                    scale: 0.7,
                                    x: 0,
                                    y: [0, 30, 0],
                                    rotate: [0, -5, 0]
                                }}
                                transition={{
                                    duration: 7,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 0.5,
                                    opacity: { duration: 0.8, delay: 0.4 },
                                    scale: { duration: 0.8, delay: 0.4 },
                                    x: { duration: 0.8, delay: 0.4 }
                                }}
                            />

                            {/* Burger - Main Hero */}
                            <motion.img
                                className="hero-burger-img"
                                src={heroImage || heroBurger}
                                alt="Delicious Burger"
                                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                                // Floating Animation
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: [0, -25, 0],
                                    rotate: [0, 2, 0]
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    opacity: { duration: 0.8, delay: 0.2 },
                                    scale: { duration: 0.8, delay: 0.2 }
                                }}
                            />
                        </div>
                    </div>

                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            position: 'absolute',
                            bottom: '2rem',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            opacity: 0.5,
                            cursor: 'pointer'
                        }}
                        onClick={scrollToMenu}
                    >
                        <ChevronDown size={32} />
                    </motion.div>
                </section>

                {/* Offers & Trending Section */}
                <section id="menu-section" style={{
                    minHeight: '100vh',
                    background: 'var(--color-bg)',
                    position: 'relative',
                    marginTop: '0',
                    // scrollSnapAlign: 'start',
                    paddingBottom: '100px',
                    paddingTop: '6rem'
                }}>

                    {/* Special Offers Banner */}
                    <div style={{ maxWidth: '1400px', margin: '0 auto 0.6rem auto', padding: '0 var(--padding-page)' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ color: 'var(--color-secondary)' }}>🔥</span> Limited Time Offers
                        </h2>
                        <div className={isSingleOffer ? "" : "product-grid"} style={isSingleOffer ? { display: 'flex', justifyContent: 'center' } : {}}>
                            {/* Combine all, filter by discount */}
                            {offers.map(product => (
                                <div key={product.id} style={{
                                    position: 'relative',
                                    width: isSingleOffer ? '100%' : 'auto',
                                    maxWidth: isSingleOffer ? '500px' : 'none',
                                    minWidth: isSingleOffer ? '280px' : 'auto',
                                    margin: isSingleOffer ? '0 auto' : '0'
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '-10px',
                                        right: '-10px',
                                        background: 'var(--color-secondary)',
                                        color: 'black',
                                        fontWeight: 'bold',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '50px',
                                        zIndex: 10,
                                        boxShadow: '0 5px 15px rgba(255, 143, 171, 0.4)'
                                    }}>
                                        {product.discount}% OFF
                                    </div>
                                    <ProductCard
                                        product={product}
                                        imageHeight={isSingleOffer ? '400px' : '300px'}
                                        imageObjectFit="contain"
                                        isBanner={isSingleOffer}
                                        onClick={() => setSelectedProduct(product)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Best Sellers */}
                    <div style={{ maxWidth: '1400px', margin: '0 auto 0.4rem auto', padding: '0 var(--padding-page)' }}>
                        <h2 style={{ fontSize: '3rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Star fill="gold" stroke="none" /> Best Sellers
                        </h2>
                        <div className="product-grid">
                            {/* Best Sellers Logic */}
                            {[...burgers, ...cakes, ...bakeryItems, ...sweets, ...biscuits].filter(p => p.trending).slice(0, 4).map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onClick={() => setSelectedProduct(product)}
                                />
                            ))}
                        </div>
                    </div>



                    {/* Full Categorized Lists (Collapsed/Below) */}
                    <div>
                        <CategorySection title="Signature Burgers" items={burgers} onItemClick={setSelectedProduct} />
                        <CategorySection title="Delicious Cakes" items={cakes} onItemClick={setSelectedProduct} />
                        <CategorySection title="Pies & Pastries" items={bakeryItems} onItemClick={setSelectedProduct} />
                        <CategorySection title="Biscuits & Cookies" items={biscuits} onItemClick={setSelectedProduct} />
                        <CategorySection title="Sweets & Candy" items={sweets} onItemClick={setSelectedProduct} />
                    </div>
                </section>

                {/* Mobile adjustments */}
                <style>{`
                  @media (max-width: 968px) {
                    div[style*="gridTemplateColumns"] {
                        grid-template-columns: 1fr !important;
                        text-align: center;
                        padding: 0 1.5rem !important;
                        gap: 2rem !important;
                        margin-top: 60px;
                    }
                    /* Container swap for mobile: text below image */
                    div[style*="gridTemplateColumns"] > div:first-child {
                        order: 2;
                    }
                    div[style*="gridTemplateColumns"] > div:last-child {
                        order: 1;
                        height: auto !important;
                        margin-bottom: -2rem;
                    }
                    
                    h1 {
                        font-size: 3rem !important;
                    }
                    
                    .hero-btn {
                        padding: 1rem 2rem !important;
                        font-size: 1rem !important;
                        width: 100%;
                        justify-content: center;
                    }
                    
                    /* Mobile Responsive Images - Show both diagonally */
                    .hero-images-container {
                        height: 400px !important;
                        align-items: flex-end !important;
                        justify-content: flex-start !important;
                    }
                    
                    .hero-burger-img {
                        max-width: 65% !important;
                        margin-bottom: 2rem;
                        z-index: 2;
                    }
                    
                    .hero-cake-img {
                        max-width: 55% !important;
                        right: 0 !important;
                        top: 20% !important;
                        z-index: 1;
                        display: block !important;
                    }
                    
                     /* Button Center */
                    button {
                        margin: 0 auto;
                    }
                  }
                `}</style>

                <Footer />
            </div>

            {/* Product Detail Modal */}
            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onProductSelect={setSelectedProduct}
                />
            )}
        </>
    );
}


