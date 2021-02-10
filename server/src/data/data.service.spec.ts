import { v4 as uuidv4 } from 'uuid';
import {
  ComponentStatus,
  DataService,
  Starship,
  StarshipComponent,
} from './data.service';

const mockStarshipFactory = (name: string, model: string): Starship => {
  return {
    id: uuidv4(),
    name,
    model,
    components: Object.keys(StarshipComponent).reduce(
      (acc, component) => ({ ...acc, [component]: ComponentStatus.pending }),
      {} as Starship['components'],
    ),
  };
};

describe('DataService', () => {
  let dataService: DataService;

  beforeEach(async () => {
    dataService = new DataService();
  });

  describe('getStarship', () => {
    it('returns matching starship', () => {
      const ss1 = mockStarshipFactory('ss1', 'model1');
      jest.spyOn(dataService, 'getStarship').mockImplementation(() => ss1);
      expect(dataService.getStarship(ss1.id)).toBe(ss1);
    });
  });

  describe('getStarships ', () => {
    it('returns an array of starships', () => {
      const ss1 = mockStarshipFactory('ss1', 'model1');
      const ss2 = mockStarshipFactory('ss2', 'model2');
      const expected = [ss1, ss2];
      jest
        .spyOn(dataService, 'getStarships')
        .mockImplementation(() => expected);

      const actual = dataService.getStarships();

      expected.map((starship) => {
        expect(actual).toContainEqual(starship);
      });
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

  describe('createStarship ', () => {
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
