import ProductCard from './ProductCard';

export default function CategorySection({ title, items, onItemClick }) {
    if (!items || items.length === 0) return null;

    return (
        <div style={{ padding: '0 2rem 4rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
            <h2 style={{
                fontSize: '2.5rem',
                marginBottom: '1rem',
                marginTop: '0',
                fontFamily: 'var(--font-main)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                paddingBottom: '0.5rem',
                display: 'inline-block'
            }}>
                {title}
            </h2>

            <div className="product-grid">
                {items.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onClick={() => onItemClick && onItemClick(product)}
                    />
                ))}
            </div>
        </div>
    );
}
