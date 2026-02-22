import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ui/ProductCard';
import PageTransition from '../components/layout/PageTransition';

export default function Cakes() {
    const { getCakes } = useProducts();
    const cakes = getCakes();

    return (
        <PageTransition>
            <div style={{ paddingTop: '100px', paddingBottom: '4rem', paddingLeft: '2rem', paddingRight: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-main)', marginBottom: '0.5rem' }}>Delicious Cakes</h1>
                    <p style={{ opacity: 0.6 }}>Indulge in our premium layers of joy.</p>
                </header>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '2rem'
                }}>
                    {cakes.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {cakes.length === 0 && (
                    <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '2rem' }}>
                        No cakes available at the moment. Check back later!
                    </div>
                )}
            </div>
        </PageTransition>
    );
}
