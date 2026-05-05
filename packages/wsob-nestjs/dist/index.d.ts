import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from "@nestjs/websockets";
import { Server } from "socket.io";
import type IWSOB from '@wsob/common/packets';
export declare class WSOBGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private table;
    server: Server;
    afterInit(server: Server): void;
    handleConnection(client: any, ...args: any[]): void;
    handleDisconnect(client: any): void;
    sendWsobSet(key: string, payload: any): void;
    handleMessage(data: IWSOB): IWSOB | void;
}
