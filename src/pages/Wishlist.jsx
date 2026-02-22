import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import PageTransition from '../components/layout/PageTransition';
import ProductCard from '../components/ui/ProductCard';
import ProductDetailModal from '../components/ui/ProductDetailModal';
import { Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { useState } from 'react';

export default function Wishlist() {
    const { favorites } = useFavorites();
    const { addToCart } = useCart();
    const { addToast } = useToast();
    const [selectedProduct, setSelectedProduct] = useState(null);

    return (
        <PageTransition>
            <div style={{ paddingTop: '100px', paddingBottom: '4rem', maxWidth: '1200px', margin: '0 auto', paddingLeft: '2rem', paddingRight: '2rem', minHeight: '80vh' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-main)' }}>My Wishlist</h1>
                    <span style={{
                        background: 'rgba(255,107,53,0.1)',
                        color: 'var(--color-primary)',
                        padding: '0.2rem 0.8rem',
                        borderRadius: '20px',
                        fontWeight: 'bold'
                    }}>
                        {favorites.length}
                    </span>
                </div>

                {favorites.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.6 }}>
                        <Heart size={64} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Your wishlist is empty</h2>
                        <p style={{ marginBottom: '2rem' }}>Save items you love to find them easily later.</p>
                        <Link href="/">
                            <a style={{
                                display: 'inline-block',
                                background: 'var(--color-primary)',
                                color: 'white',
                                padding: '0.8rem 2rem',
                                borderRadius: '30px',
                                textDecoration: 'none',
                                fontWeight: 'bold'
                            }}>
                                Explore Menu
                            </a>
                        </Link>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                        gap: '2rem'
                    }}>
                        {favorites.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onClick={() => setSelectedProduct(product)}
                                onAddToCart={() => {
                                    addToCart(product);
                                    addToast(`${product.name} added to cart`, 'success');
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Product Detail Modal */}
                {selectedProduct && (
                    <ProductDetailModal
                        product={selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                        onProductSelect={setSelectedProduct}
                    />
                )}
            </div>
        </PageTransition>
    );
}
