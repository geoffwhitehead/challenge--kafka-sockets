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

const components = Object.keys(StarshipComponent).reduce(
  (acc, component) => ({ ...acc, [component]: ComponentStatus.pending }),
  {} as Starship['components'],
);

/**
 * Mock datastore for holding starship records
 */
@Injectable()
export class DataService {
  private starships: Starships = {};
  private maxStarships = 25;

  constructor() {}

  getStarships(): Starship[] {
    return Object.values(this.starships);
  }

  getStarship(id: string): Starship | null {
    const starship = this.starships[id];
    if (!starship) {
      return null;
    }
    return starship;
  }

  createStarship(starship: Pick<Starship, 'model' | 'name'>): Starship | null {
    const { model, name } = starship;
    const id = uuidv4();

    if (Object.values(this.starships).length >= this.maxStarships) {
      return null;
    }

    const newStarship = {
      id,
      model,
      name,
      components,
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

    if (!starship) {
      return null;
    }

    this.starships[starship.id] = {
      ...starship,
      components: {
        ...starship.components,
        [component]: status,
      },
    };
    return this.starships[starship.id];
  }

  removeStarship(id: string) {
    delete this.starships[id];
  }
}
