import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketServer } from "@nestjs/websockets";
import type WSEntryTable from "./tables/entryTable";
import { Server } from "socket.io";
import type IWSOB from '@wsob/common/packets'
import { NotFoundException } from "@nestjs/common";

export class WSOBGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private table: Record<string, WSEntryTable> = {};

    @WebSocketServer() server!: Server

    afterInit(server: Server) {
        this.server = server
        console.log('WebSocket server initialized')
    }

    handleConnection(client: any, ...args: any[]) {
        console.log('new conection')
    }

    handleDisconnect(client: any) {
        console.log('client disconnected')
    }

    public SetWsob(key: string, payload: any) {
        this.table[key] = payload

        const res: IWSOB = {
            type: 'UPDATE',
            key: key,
            payload: payload
        }

        this.server?.emit(`@${key}`, res)
    }

    @SubscribeMessage('wsob')
    handleMessage(@MessageBody() data: IWSOB): IWSOB | void {
        try {
            console.log(data)
            if (data.type !== 'MAKE' && !(data.key in this.table))
                throw new NotFoundException(`key "${data.key}" is not in wsob table`)

            //TODO: No cualquiera debe poder crear
            if (data.type === 'MAKE') {
                if (data.key in this.table)
                    throw new Error()

                this.table[data.key] = {
                }

                return {
                    type: 'OK',
                    key: data.key
                }
            }

            //TODO: No cualquiera puede setear
            if (data.type === 'SET')
                this.SetWsob(data.key, data.payload)

            if (data.type === 'GET') {
                return {
                    type: 'OK',
                    key: data.key,
                    payload: this.table[data.key]
                }
            }

        }
        catch (e: unknown) {
            console.error(e)
            if (e instanceof NotFoundException)
                return {
                    key: data.key,
                    type: 'ERROR',
                    payload: {
                        code: 404,
                        msg: e.message
                    }
                }
            if (e instanceof Error)
                return {
                    key: data.key,
                    type: 'ERROR',
                    payload: {
                        code: 500,
                        msg: e.message
                    }
                }

            return {
                key: data.key,
                type: 'ERROR',
                payload: {
                    code: 500
                }
            }
        }
    }
}