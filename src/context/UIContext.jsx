import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from './ToastContext';

const UIContext = createContext();

export const useUI = () => useContext(UIContext);

export const UIProvider = ({ children }) => {
    const { addToast } = useToast();
    const [settingsId, setSettingsId] = useState(null);
    const [heroImage, setHeroImage] = useState(null);
    const [contactInfo, setContactInfo] = useState({
        address: '123 Burger Lane, Foodie City, FC 45678',
        phone: '+1 (555) 123-4567',
        email: 'hello@burgerbakery.com',
        facebook: 'https://facebook.com',
        instagram: 'https://instagram.com',
        twitter: 'https://twitter.com',
        youtube: 'https://youtube.com',
        heroVideo: '',
        saleEndDate: ''
    });

    // Fetch settings from Supabase on mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data, error } = await supabase
                    .from('settings')
                    .select('*')
                    .limit(1)
                    .single();

                if (error) {
                    if (error.code !== 'PGRST116') { // PGRST116 means zero rows found, which is fine if table is new
                        console.error('Error fetching settings:', error.message);
                    }
                    return;
                }

                if (data) {
                    setSettingsId(data.id);
                    setHeroImage(data.hero_image);
                    if (data.contact_info) {
                        setContactInfo({ ...contactInfo, ...data.contact_info });
                    }
                }
            } catch (err) {
                console.error("Failed to fetch settings from Supabase:", err);
            }
        };

        fetchSettings();
    }, []);

    const updateHeroImage = async (url) => {
        try {
            setHeroImage(url);

            if (settingsId) {
                const { error } = await supabase
                    .from('settings')
                    .update({ hero_image: url, updated_at: new Date().toISOString() })
                    .eq('id', settingsId);

                if (error) throw error;
            } else {
                // If no settings exist yet, create the row
                const { data, error } = await supabase
                    .from('settings')
                    .insert([{ hero_image: url }])
                    .select()
                    .single();

                if (error) throw error;
                if (data) setSettingsId(data.id);
            }
            return true;
        } catch (error) {
            console.error('Error saving hero image:', error);
            addToast('Database Error: Failed to save hero image globally', 'error');
            return false;
        }
    };

    const resetHeroImage = async () => {
        await updateHeroImage(null);
    };

    const updateContactInfo = async (info) => {
        try {
            setContactInfo(info);

            if (settingsId) {
                const { error } = await supabase
                    .from('settings')
                    .update({ contact_info: info, updated_at: new Date().toISOString() })
                    .eq('id', settingsId);

                if (error) throw error;
            } else {
                // If no settings exist yet, create the row
                const { data, error } = await supabase
                    .from('settings')
                    .insert([{ contact_info: info }])
                    .select()
                    .single();

                if (error) throw error;
                if (data) setSettingsId(data.id);
            }
            return true;
        } catch (error) {
            console.error('Error saving contact info:', error);
            return false;
        }
    };

    return (
        <UIContext.Provider value={{ heroImage, updateHeroImage, resetHeroImage, contactInfo, updateContactInfo }}>
            {children}
        </UIContext.Provider>
    );
};
