import axios from 'axios';
import { get, post, remove } from './base';

export type SwapiStarship = {
  name: string;
  model: string;
  cost_in_credits: string;
  crew: string;
  passengers: string;
  starship_class: string;
};

export const api = {
  list: () => get('/starships'),
  remove: (id: string) => remove(`/starships/${id}`),
  create: (params: { name: string; model: string }) =>
    post('/starships', params),
  listAvailable: () =>
    axios.get<{ results: SwapiStarship[] }>('https://swapi.dev/api/starships'),
};
