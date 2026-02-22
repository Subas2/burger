import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const OrderContext = createContext();

// Connect to the new backend server (looks for env var, falls back to local)
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const socket = io(SOCKET_URL);

export function OrderProvider({ children }) {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Handle connection events
        socket.on('connect', () => {
            console.log('Connected to Real-Time Backend');
        });

        // Receive initial orders from DB
        socket.on('initialOrders', (data) => {
            setOrders(data);
        });

        // Listen for new orders (e.g., from other customers)
        socket.on('orderAdded', (newOrder) => {
            setOrders((prev) => [newOrder, ...prev]);
        });

        // Listen for order status updates (e.g., from Admin)
        socket.on('orderUpdated', ({ orderId, status }) => {
            setOrders((prev) => prev.map(order =>
                order.id === orderId ? { ...order, status } : order
            ));
        });

        // Listen for deletions
        socket.on('orderDeleted', (orderId) => {
            setOrders((prev) => prev.filter(order => order.id !== orderId));
        });

        return () => {
            socket.off('connect');
            socket.off('initialOrders');
            socket.off('orderAdded');
            socket.off('orderUpdated');
            socket.off('orderDeleted');
        };
    }, []);

    const addOrder = (order) => {
        // Optimistic UI update
        setOrders(prev => [order, ...prev]);
        // Send to backend
        socket.emit('newOrder', order);
    };

    const updateOrderStatus = (orderId, status) => {
        setOrders(prev => prev.map(order =>
            order.id === orderId ? { ...order, status } : order
        ));
        socket.emit('updateOrderStatus', { orderId, status });
    };

    const deleteOrder = (orderId) => {
        setOrders(prev => prev.filter(order => order.id !== orderId));
        socket.emit('deleteOrder', orderId);
    };

    const hideOrder = (orderId) => {
        setOrders(prev => prev.map(order =>
            order.id === orderId ? { ...order, hidden: true } : order
        ));
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
