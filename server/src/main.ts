import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import { appConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [`${appConfig.KAFKA_HOST}:${appConfig.KAFKA_PORT}`],
      },
    },
  });

  app.startAllMicroservicesAsync();
  app.enableCors();
  app.listen(appConfig.PORT);
}

bootstrap();
