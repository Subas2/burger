import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);

// Configure Socket.io with CORS to allow connections from Vite dev server and production URLs
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allow all for easy production deployment across Netlify/Render
        methods: ["GET", "POST"]
    }
});

// Simple in-memory database
let orders = [];

io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Send the current list of orders immediately upon connection
    socket.emit('initialOrders', orders);

    // Listen for new orders from clients
    socket.on('newOrder', (orderData) => {
        console.log('Received new order:', orderData.id);
        orders = [orderData, ...orders];

        // Broadcast the new order to ALL other connected clients (like Admin panel)
        socket.broadcast.emit('orderAdded', orderData);
    });

    // Listen for order status updates
    socket.on('updateOrderStatus', ({ orderId, status }) => {
        console.log(`Updating order ${orderId} to status: ${status}`);
        orders = orders.map(order => order.id === orderId ? { ...order, status } : order);

        // Broadcast update
        socket.broadcast.emit('orderUpdated', { orderId, status });
    });

    // Listen for order deletions
    socket.on('deleteOrder', (orderId) => {
        console.log(`Deleting order ${orderId}`);
        orders = orders.filter(order => order.id !== orderId);

        // Broadcast deletion
        socket.broadcast.emit('orderDeleted', orderId);
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`🚀 Burger Bakery Real-Time Backend running on http://localhost:${PORT}`);
});
