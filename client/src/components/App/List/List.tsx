import React from "react";
import { Starship } from "../App";

type ListProps = {
  availableStarships: Starship[];
};

export const AvailableStarshipsTable: React.FC<ListProps> = ({
  availableStarships,
}) => {
  return (
    <div>
      {availableStarships.map((starship) => {
        return <p>{starship.model}</p>;
      })}
    </div>
  );
};
