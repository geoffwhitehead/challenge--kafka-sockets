import { INestApplication } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import * as WebSocket from 'ws';
import { AppModule } from '../src/app/app.module';
import { SocketsModule } from '../src/sockets/sockets.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule, SocketsModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.connectMicroservice({
      transport: Transport.KAFKA,
    });

    await app.startAllMicroservicesAsync();

    app.useWebSocketAdapter(new WebSocket(app));
    await app.init();
  });

  it('/starships/123 (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200);
  });

  it('/starships (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200);
  });

  // it('should connect successfully', (done) => {
  //   const address = app.getHttpServer().listen().address();
  //   const baseAddress = `http://[${address.address}]:${address.port}`;

  //   const socket = new WebSocket(baseAddress);

  //   socket.on('open', () => {
  //     console.log('Connected');
  //     done();
  //   });

  //   socket.on('close', (code, reason) => {
  //     done({ code, reason });
  //   });

  //   socket.on('error', (error) => {
  //     done(error);
  //   });
  // });
});
