import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const OrderContext = createContext();

export function OrderProvider({ children }) {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select('*')
                    .order('date', { ascending: false });

                if (error) throw error;
                if (data) {
                    setOrders(data);
                }
            } catch (err) {
                console.error('Error fetching orders:', err);
            }
        };
        fetchOrders();
    }, []);

    const addOrder = async (order) => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .insert([order])
                .select();

            if (error) throw error;
            if (data && data[0]) {
                setOrders(prev => [data[0], ...prev]);
                return data[0];
            }
        } catch (err) {
            console.error('Error adding order:', err);
            throw err;
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status })
                .eq('id', orderId);

            if (error) throw error;

            setOrders(prev => prev.map(order =>
                order.id === orderId ? { ...order, status } : order
            ));
        } catch (err) {
            console.error('Error updating order:', err);
        }
    };

    const deleteOrder = async (orderId) => {
        try {
            const { error } = await supabase
                .from('orders')
                .delete()
                .eq('id', orderId);

            if (error) throw error;

            setOrders(prev => prev.filter(order => order.id !== orderId));
        } catch (err) {
            console.error('Error deleting order:', err);
        }
    };

    const hideOrder = async (orderId) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ hidden: true })
                .eq('id', orderId);

            if (error) throw error;

            setOrders(prev => prev.map(order =>
                order.id === orderId ? { ...order, hidden: true } : order
            ));
        } catch (err) {
            console.error('Error hiding order:', err);
        }
    };

    return (
        <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, deleteOrder, hideOrder }}>
            {children}
        </OrderContext.Provider>
    );
}

export function useOrders() {
    return useContext(OrderContext);
}
