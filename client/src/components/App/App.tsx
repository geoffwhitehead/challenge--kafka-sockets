import { findIndex } from "lodash";
import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import styled from "styled-components";
import { appConfig } from "../../config";
import { api, SwapiStarship } from "../../services/api";
import { Table } from "./Table/Table";

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

const App: React.FC = () => {
  const [availableStarships, setAvailableStarships] = useState<SwapiStarship[]>(
    []
  );

  console.log("appConfig ", appConfig);
  const [starships, setStarships] = useState<Starship[]>([]);

  useEffect((): any => {
    const socket = socketIOClient(
      `http://${appConfig.serverHost}:${appConfig.socketPort}`
    );
    socket.on("onCreate", (starship: Starship) => {
      setStarships([...starships, starship]);
    });
    socket.on("onRemove", (starshipId: string) => {
      setStarships(starships.filter((starship) => starship.id !== starshipId));
    });
    socket.on("onComponentCreated", (starship: Starship) => {
      const index = findIndex(starships, { id: starship.id });

      if (index) {
        let starshipsMutated = [...starships];
        starshipsMutated.splice(index, 1, starship);
        setStarships([...starshipsMutated]);
      }
    });
    return () => socket.disconnect();
  }, [starships, setStarships]);

  useEffect(() => {
    (async () => {
      const response = await api.listAvailable();
      setAvailableStarships(response.data.results);
    })();
  }, [setAvailableStarships]);

  useEffect(() => {
    (async () => {
      const response = await api.list();
      setStarships(response.data);
    })();
  }, [setStarships]);

  const handleCreate = (params: { model: string; name: string }) =>
    api.create(params);

  const handleRemove = (id: string) => api.remove(id);

  const columnsAvailableStarships = React.useMemo(
    () => [
      {
        Header: "Starship",
        columns: [
          {
            Header: "Name",
            accessor: "name",
          },
          {
            Header: "Model",
            accessor: "model",
          },
        ],
      },
      {
        Header: "Details",
        columns: [
          {
            Header: "Cost",
            accessor: "cost_in_credits",
          },
          {
            Header: "Crew",
            accessor: "crew",
          },
          {
            Header: "Passengers",
            accessor: "passengers",
          },
          {
            Header: "Class",
            accessor: "starship_class",
          },
        ],
      },
    ],
    []
  );

  const columnsStarships = React.useMemo(
    () => [
      {
        Header: "Starship",
        columns: [
          {
            Header: "Name",
            accessor: "name",
          },
          {
            Header: "Model",
            accessor: "model",
          },
        ],
      },
      {
        Header: "Build Progress",
        columns: [
          {
            Header: "Engine",
            accessor: "components.engine",
          },
          {
            Header: "Hull",
            accessor: "components.hull",
          },
          {
            Header: "Navigation",
            accessor: "components.navigation",
          },
          {
            Header: "Weapons",
            accessor: "components.weapons",
          },
          {
            Header: "Interior",
            accessor: "components.interior",
          },
        ],
      },
    ],
    []
  );

  return (
    <StyledDiv>
      <Table<SwapiStarship>
        columns={columnsAvailableStarships}
        data={availableStarships}
        onClickRow={({ name, model }) => handleCreate({ name, model })}
        buttonText="Create"
      />
      <Table<Starship>
        columns={columnsStarships}
        data={starships}
        onClickRow={({ id }) => handleRemove(id)}
        buttonText="Remove"
      />
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
`;

export default App;
