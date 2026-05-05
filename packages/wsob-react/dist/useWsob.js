import { useEffect, useState } from "react";
import { useSocket } from "./SocketComponent";
export function useWsob(key) {
    const { socket, isConnected } = useSocket();
    const [value, setValue] = useState();
    function handleEvent({ key: packetKey, type, payload }) {
        console.log(`Got ${type} ${packetKey}: ${JSON.stringify(payload)} `);
        if (type === 'UPDATE' && packetKey === key)
            setValue(payload);
        else if (type === 'ERROR') {
            console.error(payload);
        }
    }
    useEffect(() => {
        if (socket && isConnected) {
            socket.on(`@${key}`, handleEvent);
            const msg = {
                key: `@${key}`,
                type: 'GET'
            };
            socket.emit('wsob', msg, handleEvent);
        }
    }, [socket, isConnected]);
    return [value];
}
//# sourceMappingURL=useWsob.js.map