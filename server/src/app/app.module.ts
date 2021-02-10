import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { appConfig } from '../config';
import { NAME_SERVICE_STARSHIP } from '../consts';
import { DataModule } from '../data/data.module';
import { SocketsModule } from '../sockets/sockets.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: NAME_SERVICE_STARSHIP,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'starship',
            brokers: [`${appConfig.KAFKA_HOST}:${appConfig.KAFKA_PORT}`],
          },
          consumer: {
            groupId: 'starship-consumer',
            allowAutoTopicCreation: true,
          },
        },
      },
    ]),
    DataModule,
    SocketsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
