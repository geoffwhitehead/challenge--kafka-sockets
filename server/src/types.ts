import { StarshipComponent } from 'src/data/data.service';

type Event = {
  id: string;
};

export type eventStarshipRequested = Event & {
  url: string;
};

export type eventStarshipComponentBuilt = Event & {
  component: StarshipComponent;
};

export type eventStarshipComplete = Event & {};

export type IncomingMessage<T> = {
  topic: string;
  partition: number;
  timestamp: string;
  size: number;
  attributes: number;
  offset: string;
  key: any;
  value: T;
  headers: Record<string, any>;
};
