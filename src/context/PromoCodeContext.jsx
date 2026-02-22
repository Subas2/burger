import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const PromoCodeContext = createContext();

export function PromoCodeProvider({ children }) {
    const { addToast } = useToast();
    const [promoCodes, setPromoCodes] = useState(() => {
        try {
            const saved = localStorage.getItem('burger_bakery_promos');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Failed to parse promos", e);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('burger_bakery_promos', JSON.stringify(promoCodes));
        } catch (e) {
            console.error("Failed to save promos:", e);
        }
    }, [promoCodes]);

    const createPromoCode = (code, type, value, conditions = {}) => {
        const cleanCode = code.trim().toUpperCase();
        if (!cleanCode) return false;

        if (promoCodes.some(p => p.code === cleanCode)) {
            addToast(`Code ${cleanCode} already exists`, 'error');
            return false;
        }
        const newPromo = {
            id: Date.now(),
            code: cleanCode,
            type, // 'percent' or 'fixed'
            value: parseFloat(value),
            active: true,
            minOrderValue: parseFloat(conditions.minOrderValue) || 0,
            firstOrderOnly: conditions.firstOrderOnly || false,
            usageLimit: parseInt(conditions.usageLimit) || 0,
            usedCount: 0
        };
        setPromoCodes(prev => [...prev, newPromo]);
        addToast(`Promo code ${cleanCode} created!`, 'success');
        return true;
    };

    const deletePromoCode = (id) => {
        setPromoCodes(prev => prev.filter(p => p.id !== id));
        addToast('Promo code deleted', 'success');
    };

    const validatePromoCode = (code, contextData = {}) => {
        const cleanCode = code.trim().toUpperCase();
        const promo = promoCodes.find(p => p.code === cleanCode && p.active);

        if (!promo) {
            return { valid: false, message: 'Promo code not found' };
        }

        // Check Minimum Order Value
        if (promo.minOrderValue > 0 && (contextData.cartTotal || 0) < promo.minOrderValue) {
            return { valid: false, message: `Minimum order value of ₹${promo.minOrderValue} required` };
        }

        // Check First Order Only
        if (promo.firstOrderOnly && !contextData.isFirstOrder) {
            return { valid: false, message: 'This code is valid for first-time orders only' };
        }

        // Check Usage Limit
        if (promo.usageLimit > 0 && (promo.usedCount || 0) >= promo.usageLimit) {
            return { valid: false, message: 'This promo code has reached its usage limit' };
        }

        return { valid: true, message: 'Promo code applied!', promo };
    };

    const incrementPromoUsage = (code) => {
        setPromoCodes(prev => prev.map(p => {
            if (p.code === code) {
                return { ...p, usedCount: (p.usedCount || 0) + 1 };
            }
            return p;
        }));
    };

    return (
        <PromoCodeContext.Provider value={{ promoCodes, createPromoCode, deletePromoCode, validatePromoCode, incrementPromoUsage }}>
            {children}
        </PromoCodeContext.Provider>
    );
}

export function usePromoCode() {
    return useContext(PromoCodeContext);
}
