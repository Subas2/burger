import { createContext, useContext, useState, useEffect } from 'react';

const UIContext = createContext();

export const useUI = () => useContext(UIContext);

export const UIProvider = ({ children }) => {
    const [heroImage, setHeroImage] = useState(() => {
        try {
            const saved = localStorage.getItem('burger_bakery_hero_image');
            return saved || null;
        } catch (e) {
            console.error("Failed to load hero image:", e);
            return null;
        }
    });

    const updateHeroImage = (url) => {
        setHeroImage(url);
        localStorage.setItem('burger_bakery_hero_image', url);
    };

    const resetHeroImage = () => {
        setHeroImage(null);
        localStorage.removeItem('burger_bakery_hero_image');
    };

    const [contactInfo, setContactInfo] = useState(() => {
        try {
            const saved = localStorage.getItem('burger_bakery_contact_info');
            return saved ? JSON.parse(saved) : {
                address: '123 Burger Lane, Foodie City, FC 45678',
                phone: '+1 (555) 123-4567',
                email: 'hello@burgerbakery.com',
                facebook: 'https://facebook.com',
                instagram: 'https://instagram.com',
                twitter: 'https://twitter.com',
                youtube: 'https://youtube.com',
                heroVideo: '',
                saleEndDate: ''
            };
        } catch (e) {
            console.error("Failed to parse contact info from storage:", e);
            return {
                address: '123 Burger Lane, Foodie City, FC 45678',
                phone: '+1 (555) 123-4567',
                email: 'hello@burgerbakery.com',
                facebook: 'https://facebook.com',
                instagram: 'https://instagram.com',
                twitter: 'https://twitter.com',
                youtube: 'https://youtube.com',
                heroVideo: '',
                saleEndDate: ''
            };
        }
    });

    const updateContactInfo = (info) => {
        try {
            setContactInfo(info);
            localStorage.setItem('burger_bakery_contact_info', JSON.stringify(info));
            return true;
        } catch (error) {
            console.error("Failed to save contact info:", error);
            return false;
        }
    };

    return (
        <UIContext.Provider value={{ heroImage, updateHeroImage, resetHeroImage, contactInfo, updateContactInfo }}>
            {children}
        </UIContext.Provider>
    );
};
