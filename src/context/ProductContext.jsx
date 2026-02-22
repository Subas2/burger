import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from './ToastContext';

const ProductContext = createContext();

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([]);
    const { addToast } = useToast();

    // Fetch products from Supabase on mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .order('id', { ascending: true });

                if (error) throw error;

                if (data && data.length > 0) {
                    // Normalize the data (convert raw_reviews JSONB back to reviews array if needed)
                    const normalized = data.map(item => ({
                        ...item,
                        reviews: item.raw_reviews || []
                    }));
                    setProducts(normalized);
                }
            } catch (error) {
                console.error('Error fetching products from Supabase:', error);
                // Fallback to empty, but usually we would show an error toast here
            }
        };

        fetchProducts();
    }, []);

    const addProduct = async (product) => {
        const newProductData = {
            name: product.name,
            price: parseFloat(product.price) || 0,
            description: product.description || '',
            type: product.type || 'burger',
            color: product.color || '#ff9f1c',
            calories: parseInt(product.calories) || 0,
            rating: parseFloat(product.rating) || 0,
            quantity: parseInt(product.quantity) || 1,
            discount: parseInt(product.discount) || 0,
            image: product.image || '',
            raw_reviews: []
        };

        try {
            const { data, error } = await supabase
                .from('products')
                .insert([newProductData])
                .select();

            if (error) throw error;

            if (data && data[0]) {
                const savedProduct = { ...data[0], reviews: data[0].raw_reviews || [] };
                setProducts(prev => [...prev, savedProduct]);
                return savedProduct;
            }
        } catch (error) {
            console.error('Error adding product to Supabase:', error);
            addToast('Database Error: Could not save product', 'error');
        }
    };

    const updateProduct = async (updatedProduct) => {
        const updateData = {
            name: updatedProduct.name,
            price: parseFloat(updatedProduct.price) || 0,
            description: updatedProduct.description || '',
            type: updatedProduct.type,
            color: updatedProduct.color,
            calories: parseInt(updatedProduct.calories) || 0,
            rating: parseFloat(updatedProduct.rating) || 0,
            quantity: parseInt(updatedProduct.quantity) || 0,
            discount: parseInt(updatedProduct.discount) || 0,
            image: updatedProduct.image || '',
            raw_reviews: updatedProduct.reviews || [] // Sync reviews back
        };

        try {
            const { error } = await supabase
                .from('products')
                .update(updateData)
                .eq('id', updatedProduct.id);

            if (error) throw error;

            setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        } catch (error) {
            console.error('Error updating product in Supabase:', error);
            addToast('Database Error: Could not update product', 'error');
        }
    };

    const deleteProduct = async (id) => {
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setProducts(prev => prev.filter(p => p.id !== id));
            addToast('Product successfully deleted', 'success');
        } catch (error) {
            console.error('Error deleting product from Supabase:', error);
            addToast('Database Error: Could not delete product', 'error');
        }
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
