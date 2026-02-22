import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useState(() => {
        try {
            const saved = localStorage.getItem('burger_bakery_favorites');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Failed to load favorites", e);
            return [];
        }
    });

    const { addToast } = useToast();

    useEffect(() => {
        try {
            localStorage.setItem('burger_bakery_favorites', JSON.stringify(favorites));
        } catch (e) {
            console.error("Failed to save favorites", e);
        }
    }, [favorites]);

    const toggleFavorite = (product) => {
        setFavorites(prev => {
            const isFav = prev.some(p => p.id === product.id);
            if (isFav) {
                addToast(`${product.name} removed from favorites`, 'info');
                return prev.filter(p => p.id !== product.id);
            } else {
                addToast(`${product.name} added to favorites! ❤️`, 'success');
                return [...prev, product];
            }
        });
    };

    const isFavorite = (productId) => {
        return favorites.some(p => p.id === productId);
    };

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    return useContext(FavoritesContext);
}
