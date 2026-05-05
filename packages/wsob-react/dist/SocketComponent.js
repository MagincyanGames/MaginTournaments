import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
const SocketContext = createContext(undefined);
export function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    useEffect(() => {
        console.log('connecting...');
        const newSocket = io('http://localhost:3000', {
            transports: ['websocket', 'polling']
        });
        setSocket(newSocket);
        newSocket.on('connect', () => {
            console.log('websocket connected');
            setIsConnected(true);
        });
        newSocket.on('disconnect', () => {
            console.log('websocket disconnected');
            setIsConnected(false);
        });
        newSocket.on('connect_error', (error) => {
            console.error('connection error:', error);
        });
        newSocket.on('error', (error) => {
            console.error('socket error:', error);
        });
        return () => {
            newSocket.close();
        };
    }, []);
    return (_jsx(SocketContext.Provider, { value: {
            socket,
            isConnected
        }, children: children }));
}
export function useSocket() {
    const ctx = useContext(SocketContext);
    if (!ctx)
        throw new Error('no SocketProvider');
    return ctx;
}
//# sourceMappingURL=SocketComponent.js.map