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
import Countdown from '../components/ui/Countdown';
export default function Home() {
    console.log("Home.jsx: Rendering...");
    const { addToCart } = useCart();
    const { addToast } = useToast();
    const { getBurgers, getCakes, getBakeryItems, getBiscuits, getSweets } = useProducts();
    const { contactInfo } = useUI();

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
                <section className="hero-section" style={{
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
                            className="hero-video"
                            src={contactInfo.heroVideo}
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                    )}

                    {/* Gradient Overlay for texture */}
                    <div className="noise-overlay" style={{ opacity: 0.05 }} />

                    <div className="hero-grid" style={{
                        maxWidth: '1400px',
                        width: '100%',
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        padding: '6rem 4rem 4rem 4rem',
                        alignItems: 'center',
                        justifyItems: 'center',
                        textAlign: 'center',
                        zIndex: 1,
                        gap: '2rem',
                        minHeight: '600px'
                    }}>
                        {/* Text Content */}
                        <div className="hero-text" style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                </section >

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
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                            <h2 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                                <span style={{ color: 'var(--color-secondary)' }}>🔥</span> Limited Time Offers
                            </h2>
                            {contactInfo?.saleEndDate && (
                                <Countdown endDate={contactInfo.saleEndDate} />
                            )}
                        </div>
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
                    </div >

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
                    </div >



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
                  .hero-section {
                      height: 100vh;
                  }

                  .hero-video {
                      position: absolute;
                      top: 0;
                      left: 0;
                      width: 100%;
                      height: 100%;
                      object-fit: cover;
                      z-index: 0;
                      opacity: 0.6;
                  }

                  @media (max-width: 968px) {
                    .hero-section {
                        height: 65vh !important;
                        min-height: 450px !important;
                    }

                    .hero-video {
                        object-fit: contain !important;
                    }

                    .hero-grid {
                        padding: 4rem 1.5rem !important;
                        margin-top: 60px;
                        minHeight: 'auto' !important;
                    }
                    
                    h1 {
                        font-size: 2.5rem !important;
                        line-height: 1.1 !important;
                        margin-bottom: 1rem !important;
                    }

                    .hero-text p {
                        font-size: 1rem !important;
                        line-height: 1.4 !important;
                        margin-bottom: 1.5rem !important;
                        padding: 0 1rem;
                    }
                    
                    .hero-btn {
                        padding: 1rem 2rem !important;
                        font-size: 1rem !important;
                        width: 100%;
                        justify-content: center;
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
            )
            }
        </>
    );
}


