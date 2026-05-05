"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWSOB = useWSOB;
const react_1 = require("react");
const SocketComponent_1 = require("./SocketComponent");
function useWSOB(key) {
    const { socket, isConnected } = (0, SocketComponent_1.useSocket)();
    const [value, setValue] = (0, react_1.useState)();
    function handleEvent({ key: packetKey, type, payload }) {
        if (type === 'UPDATE' && packetKey === key)
            setValue(payload);
        else if (type === 'ERROR') {
            console.error(payload);
        }
    }
    (0, react_1.useEffect)(() => {
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
//# sourceMappingURL=useWSOB.js.map