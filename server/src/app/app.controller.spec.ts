import { Test } from '@nestjs/testing';
import { DataModule } from '../data/data.module';
import { SocketsModule } from '../sockets/sockets.module';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AppController],
      imports: [DataModule, SocketsModule],
    }).compile();

    console.log('!!!!!!!!  moduleRef ', moduleRef);
    appController = moduleRef.get<AppController>(AppController);
  });

  describe('getStarships', () => {
    it('return an array of starships"', () => {
      expect(appController.getStarships()).toBe([]);
    });
  });
});
