import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
    socket: Socket | null
    isConnected: boolean
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export function SocketProvider({ children }: { children: ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        console.log('connecting...')
        const newSocket = io('http://localhost:3000', {
            transports: ['websocket', 'polling']
        })

        setSocket(newSocket)

        newSocket.on('connect', () => {
            console.log('websocket connected')
            setIsConnected(true)
        })

        newSocket.on('disconnect', () => {
            console.log('websocket disconnected')
            setIsConnected(false)
        })

        newSocket.on('connect_error', (error) => {
            console.error('connection error:', error)
        })

        newSocket.on('error', (error) => {
            console.error('socket error:', error)
        })

        return () => {
            newSocket.close()
        }

    }, [])

    return (<SocketContext.Provider
        value={{
            socket,
            isConnected
        }}>
        {children}
    </SocketContext.Provider>)

}

export function useSocket() {
    const ctx = useContext(SocketContext)

    if (!ctx) throw new Error('no SocketProvider')

    return ctx
}