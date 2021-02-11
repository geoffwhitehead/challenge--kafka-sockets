import {
  ComponentStatus,
  DataService,
  StarshipComponent,
} from './data.service';

describe('DataService', () => {
  let dataService: DataService;

  beforeEach(() => {
    dataService = new DataService();
  });

  describe('getStarship', () => {
    it('returns matching starship', () => {
      const ss = dataService.createStarship({
        name: 'test',
        model: 'testmodel',
      });

      expect(ss.name).toEqual('test');

      const actual = dataService.getStarship(ss.id);

      expect(actual.id).toBe(ss.id);
    });
  });

  describe('getStarships ', () => {
    it('returns an array of starships', () => {
      const ss1 = dataService.createStarship({
        name: 'test1',
        model: 'testmodel1',
      });

      const ss2 = dataService.createStarship({
        name: 'test2',
        model: 'testmodel2',
      });

      expect(ss1.name).toEqual('test1');
      expect(ss2.name).toEqual('test2');

      const actual = dataService.getStarships();

      expect(actual).toEqual(expect.arrayContaining([ss1, ss2]));
    });
  });

  describe('createStarship ', () => {
    it('creates a starship', () => {
      const actual = dataService.createStarship({
        name: 'test',
        model: 'testmodel',
      });

      expect(actual.model).toEqual('testmodel');
      expect(actual.name).toEqual('test');

      const findResult = dataService.getStarship(actual.id);

      expect(findResult.id).toEqual(actual.id);
    });
  });

  describe('updateStarship ', () => {
    it('updates a starship', () => {
      const createdStarship = dataService.createStarship({
        name: 'test',
        model: 'testmodel',
      });

      const component = StarshipComponent.engine;
      expect(createdStarship.components[component]).toEqual(
        ComponentStatus.pending,
      );

      const actual = dataService.updateComponent(
        createdStarship.id,
        component,
        ComponentStatus.complete,
      );

      expect(actual.components[component]).toEqual(ComponentStatus.complete);
    });
  });
});
