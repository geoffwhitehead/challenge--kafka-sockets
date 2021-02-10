import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { appConfig } from 'config';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { NAME_SERVICE_STARSHIP } from './consts';
import { DataModule } from './data/data.module';
import { KafkaModule } from './events/events.module';

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
    KafkaModule,
  ],
  controllers: [AppController],
  providers: [AppGateway],
})
export class AppModule {}
