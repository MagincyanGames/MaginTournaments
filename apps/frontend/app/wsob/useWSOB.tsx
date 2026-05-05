import { useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketComponent";
import type IWSOBPacket from "@wsob/common/packets";

export function useWSOB<T>(key: string) {
    const { socket, isConnected } = useSocket()

    const [value, setValue] = useState<T>()

    function handleEvent({ key: packetKey, type, payload }: IWSOBPacket) {
        if (type === 'UPDATE' && packetKey === key)
            setValue(payload)
        else if (type === 'ERROR') {
            console.error(payload)
        }

    }

    useEffect(() => {
        if (socket && isConnected) {
            socket.on(`@${key}`, handleEvent)

            const msg: IWSOBPacket = {
                key: `@${key}`,
                type: 'GET'
            }
            socket.emit('wsob', msg, handleEvent)

        }
    }, [socket, isConnected])

    return [value]
}