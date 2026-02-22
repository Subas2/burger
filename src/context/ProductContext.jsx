import { createContext, useContext, useState, useEffect } from 'react';
import { burgers as initialBurgers, bakeryItems as initialBakery, cakes as initialCakes, biscuits as initialBiscuits, sweets as initialSweets } from '../data';

const ProductContext = createContext();

export function ProductProvider({ children }) {
    // Initialize from localStorage or use default data
    const [products, setProducts] = useState(() => {
        try {
            const saved = localStorage.getItem('burger_bakery_products');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            }
        } catch (e) {
            console.error("Failed to parse products from localStorage", e);
            // Fallback to default
        }

        // Normalize data to a single array with type and default extended fields
        const normalizedBurgers = (initialBurgers || []).map((b, index) => ({
            ...b,
            type: 'burger',
            calories: 850,
            rating: index === 0 ? 4.9 : 4.8,
            reviews: index === 0 ? [
                { id: 111, userId: 'u1', userName: 'Alice Freeman', rating: 5, comment: 'Best burger I have ever had! The buns are so soft 🍔', date: '2023-10-20T10:00:00Z' },
                { id: 112, userId: 'u2', userName: 'Bob Smith', rating: 5, comment: 'Absolutely delicious. Highly recommend the extra cheese.', date: '2023-10-22T14:30:00Z' },
                { id: 113, userId: 'u3', userName: 'Charlie', rating: 4, comment: 'Great flavor but delivery was a slightly late.', date: '2023-10-25T09:15:00Z' }
            ] : []
        }));
        const normalizedBakery = (initialBakery || []).map(b => ({
            ...b,
            type: 'bakery',
            calories: 320,
            rating: 4.5,
            reviews: []
        }));
        const normalizedCakes = (initialCakes || []).map(b => ({
            ...b,
            type: 'cake',
            calories: 540,
            rating: 4.9,
            reviews: []
        }));
        const normalizedBiscuits = (initialBiscuits || []).map(b => ({
            ...b,
            type: 'biscuit',
            calories: 200,
            rating: 4.7,
            reviews: []
        }));
        const normalizedSweets = (initialSweets || []).map(b => ({
            ...b,
            type: 'sweet',
            calories: 150,
            rating: 4.6,
            reviews: []
        }));
        return [...normalizedBurgers, ...normalizedBakery, ...normalizedCakes, ...normalizedBiscuits, ...normalizedSweets];
    });

    useEffect(() => {
        try {
            localStorage.setItem('burger_bakery_products', JSON.stringify(products));
        } catch (e) {
            console.error("Failed to save products:", e);
        }
    }, [products]);

    const addProduct = (product) => {
        const newProduct = {
            ...product,
            id: Date.now(),
            // Ensure numeric types
            calories: parseInt(product.calories) || 0,
            rating: parseFloat(product.rating) || 0,
            quantity: parseInt(product.quantity) || 1,
            discount: parseInt(product.discount) || 0,
            reviews: []
        };
        setProducts(prev => [...prev, newProduct]);
        return newProduct;
    };

    const updateProduct = (updatedProduct) => {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };

    const deleteProduct = (id) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const getBurgers = () => products.filter(p => p.type === 'burger');
    const getCakes = () => products.filter(p => p.type === 'cake');
    const getBakeryItems = () => products.filter(p => p.type === 'bakery');
    const getBiscuits = () => products.filter(p => p.type === 'biscuit');
    const getSweets = () => products.filter(p => p.type === 'sweet');

    const recalculateRating = (product) => {
        if (!product.reviews || product.reviews.length === 0) return product.rating;
        const total = product.reviews.reduce((acc, r) => acc + r.rating, 0);
        return parseFloat((total / product.reviews.length).toFixed(1));
    };

    const addReview = (productId, review) => {
        setProducts(prev => prev.map(p => {
            if (p.id === productId) {
                const newReviews = [...(p.reviews || []), { ...review, id: Date.now(), date: new Date().toISOString() }];
                const newRating = (newReviews.reduce((acc, r) => acc + r.rating, 0) / newReviews.length).toFixed(1);

                return {
                    ...p,
                    reviews: newReviews,
                    rating: parseFloat(newRating),
                    ratingCount: newReviews.length
                };
            }
            return p;
        }));
    };

    const updateReview = (productId, reviewId, newComment, newRating) => {
        setProducts(prev => prev.map(p => {
            if (p.id === productId) {
                const newReviews = p.reviews.map(r =>
                    r.id === reviewId ? { ...r, comment: newComment, rating: newRating, date: new Date().toISOString() } : r
                );
                const newAvgRating = (newReviews.reduce((acc, r) => acc + r.rating, 0) / newReviews.length).toFixed(1);

                return {
                    ...p,
                    reviews: newReviews,
                    rating: parseFloat(newAvgRating)
                };
            }
            return p;
        }));
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, addReview, updateReview, getBurgers, getCakes, getBakeryItems, getBiscuits, getSweets }}>
            {children}
        </ProductContext.Provider>
    );
}

export function useProducts() {
    return useContext(ProductContext);
}
