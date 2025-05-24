import { io } from "socket.io-client";

const URL = "http://localhost:5000";

export const socket = io(URL, {
    autoConnect: false, // Don't auto-connect, we'll connect manually when authenticated
    auth: {
        token: localStorage.getItem("token")
    }
});

// Add connection event listeners for debugging
socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
});

socket.on('disconnect', () => {
    console.log('Socket disconnected');
});

socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
});

// Connect when user is authenticated
export const connectSocket = () => {
    const token = localStorage.getItem("token");
    if (token && !socket.connected) {
        console.log('Connecting socket with token...');
        socket.auth = { token };
        socket.connect();
    }
};

// Disconnect socket
export const disconnectSocket = () => {
    if (socket.connected) {
        console.log('Disconnecting socket...');
        socket.disconnect();
    }
};