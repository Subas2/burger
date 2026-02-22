import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const ShippingContext = createContext();

export function ShippingProvider({ children }) {
    const { addToast } = useToast();

    // Initialize from localStorage or default (Cost: $0, Threshold: null)
    const [shippingSettings, setShippingSettings] = useState(() => {
        try {
            const saved = localStorage.getItem('burger_bakery_shipping');
            return saved ? JSON.parse(saved) : { cost: 0, threshold: 0 };
        } catch (e) {
            console.error("Failed to parse shipping settings", e);
            return { cost: 0, threshold: 0 };
        }
    });

    useEffect(() => {
        localStorage.setItem('burger_bakery_shipping', JSON.stringify(shippingSettings));
    }, [shippingSettings]);

    const updateShippingSettings = (cost, threshold) => {
        setShippingSettings({
            cost: parseFloat(cost) || 0,
            threshold: parseFloat(threshold) || 0
        });
        addToast('Shipping settings updated', 'success');
    };

    const getShippingCost = (subtotal) => {
        // If threshold is set and subtotal > threshold, shipping is free
        if (shippingSettings.threshold > 0 && subtotal >= shippingSettings.threshold) {
            return 0;
        }
        return shippingSettings.cost;
    };

    return (
        <ShippingContext.Provider value={{ shippingSettings, updateShippingSettings, getShippingCost }}>
            {children}
        </ShippingContext.Provider>
    );
}

export function useShipping() {
    return useContext(ShippingContext);
}
