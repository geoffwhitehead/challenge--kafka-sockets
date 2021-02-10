export enum ComponentStatus {
  "pending" = "pending",
  "complete" = "complete",
}
export enum StarshipComponent {
  engine = "engine",
  hull = "hull",
  weapons = "weapons",
  navigation = "navigation",
  interior = "interior",
}

export type Starship = {
  model: string;
  name: string;
  id: string;
  components: Record<StarshipComponent, ComponentStatus>;
};
