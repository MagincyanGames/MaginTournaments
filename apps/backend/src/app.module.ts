import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WSGateway } from './websocket/ws.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'better-sqlite3',
    database: 'db.sqlite',
    entities: [__dirname+'/**/*.entity{.ts,.js}'],
    synchronize: true
  })],
  controllers: [AppController],
  providers: [AppService, WSGateway],
})
export class AppModule {}
