import { Test, TestingModule } from '@nestjs/testing';
import { DataService } from './data.service';

describe('DataService', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [DataService],
      exports: [DataService],
    }).compile();
  });

  describe('getStarship', () => {
    it('returns matching starship', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('getStarships ', () => {});
});
