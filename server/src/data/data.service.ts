import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type Starship = {
  id: string;
  name: string;
  model: string;
  components?: Record<StarshipComponent, ComponentStatus>;
};

export enum StarshipComponent {
  engine = 'engine',
  hull = 'hull',
  weapons = 'weapons',
  navigation = 'navigation',
  interior = 'interior',
}

export enum ComponentStatus {
  'pending' = 'pending',
  'complete' = 'complete',
}

type Starships = Record<string, Starship>;
/**
 * Note: Using as a non persistant mock datastore for holding starship records
 */
@Injectable()
export class DataService {
  private starships: Starships = {};

  constructor() {}

  getStarships(): Starship[] {
    return Object.values(this.starships);
  }

  getStarship(id: string): Starship {
    return this.starships[id];
  }

  createStarship(starship: Pick<Starship, 'model' | 'name'>): Starship {
    const { model, name } = starship;
    const id = uuidv4() as string;
    const newStarship = {
      id,
      model,
      name,
      components: Object.keys(StarshipComponent).reduce(
        (acc, component) => ({ ...acc, [component]: ComponentStatus.pending }),
        {} as Starship['components'],
      ),
    };

    this.starships = {
      ...this.starships,
      [id]: newStarship,
    };

    return newStarship;
  }

  updateComponent(
    starshipId: string,
    component: StarshipComponent,
    status: ComponentStatus,
  ): Starship | null {
    const starship = this.starships[starshipId];

    if (starship) {
      this.starships[starship.id] = {
        ...starship,
        components: {
          ...starship.components,
          [component]: status,
        },
      };
      return this.starships[starship.id];
    }
  }

  removeStarship(id: string) {
    delete this.starships[id];
  }
}
