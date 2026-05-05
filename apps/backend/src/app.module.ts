import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WSGateway } from './websocket/ws.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, WSGateway],
})
export class AppModule {}
