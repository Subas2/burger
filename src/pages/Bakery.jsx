import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ui/ProductCard';
import PageTransition from '../components/layout/PageTransition';

export default function Bakery() {
    const { getBakeryItems } = useProducts();
    const bakeryItems = getBakeryItems();

    return (
        <PageTransition>
            <div style={{ paddingTop: '100px', paddingBottom: '4rem', paddingLeft: '2rem', paddingRight: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{
                    fontSize: '3rem',
                    marginBottom: '2rem',
                    color: 'var(--color-secondary)',
                    textAlign: 'center'
                }}>Sweet Bakery</h1>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '2rem'
                }}>
                    {bakeryItems.map(item => (
                        <ProductCard key={item.id} product={item} type="bakery" />
                    ))}
                </div>
            </div>
        </PageTransition>
    );
}
