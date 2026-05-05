"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSOBGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
class WSOBGateway {
    table = {};
    server;
    afterInit(server) {
        this.server = server;
        console.log('WebSocket server initialized');
    }
    handleConnection(client, ...args) {
        console.log('new conection');
    }
    handleDisconnect(client) {
        console.log('client disconnected');
    }
    sendWsobSet(key, payload) {
        this.table[key] = payload;
        const res = {
            type: 'UPDATE',
            key: key,
            payload: payload
        };
        this.server?.emit(key, res);
    }
    handleMessage(data) {
        try {
            console.log(data);
            if (data.type !== 'MAKE' && !(data.key in this.table))
                throw new common_1.NotFoundException(`key "${data.key}" is not in wsob table`);
            if (data.type === 'MAKE') {
                if (data.key in this.table)
                    throw new Error();
                this.table[data.key] = {
                    status: 'X'
                };
                return {
                    type: 'OK',
                    key: data.key
                };
            }
            if (data.type === 'SET')
                this.sendWsobSet(data.key, data.payload);
            if (data.type === 'GET') {
                return {
                    type: 'OK',
                    key: data.key,
                    payload: this.table[data.key]
                };
            }
        }
        catch (e) {
            console.error(e);
            if (e instanceof common_1.NotFoundException)
                return {
                    key: data.key,
                    type: 'ERROR',
                    payload: {
                        code: 404,
                        msg: e.message
                    }
                };
            if (e instanceof Error)
                return {
                    key: data.key,
                    type: 'ERROR',
                    payload: {
                        code: 500,
                        msg: e.message
                    }
                };
            return {
                key: data.key,
                type: 'ERROR',
                payload: {
                    code: 500
                }
            };
        }
    }
}
exports.WSOBGateway = WSOBGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WSOBGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('wsob'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], WSOBGateway.prototype, "handleMessage", null);
//# sourceMappingURL=index.js.map