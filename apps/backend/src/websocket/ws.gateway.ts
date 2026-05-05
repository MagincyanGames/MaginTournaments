import { WebSocketGateway } from "@nestjs/websockets";
import { WSOBGateway } from "@wsob/nestjs";

@WebSocketGateway({
    cors: {
        origin: '*'
    }
})
export class WSGateway extends WSOBGateway {
    constructor() {
        super()
        this.SetWsob("@man", "HUEVOS")
    }
}