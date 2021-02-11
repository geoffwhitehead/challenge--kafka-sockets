import { findIndex } from 'lodash';
import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import styled from 'styled-components';
import { appConfig } from '../../config';
import { api, SwapiStarship } from '../../services/api';
import { TableAvailableStarships } from '../TableAvailableStarships/TableAvailableStarships';
import { TableStarships } from '../TableStarships/TableStarships';
import { Title } from '../Title/Title';
import { Starship } from '../types';

const MAX_STARSHIPS = 25;

export const App: React.FC<{}> = ({}) => {
  const [availableStarships, setAvailableStarships] = useState<SwapiStarship[]>(
    [],
  );
  const [starships, setStarships] = useState<Starship[]>([]);

  useEffect((): any => {
    const socket = socketIOClient(
      `http://${appConfig.serverHost}:${appConfig.socketPort}`,
    );

    socket.on('onCreate', (starship: Starship) =>
      setStarships([...starships, starship]),
    );
    socket.on('onRemove', (starshipId: string) =>
      setStarships(starships.filter((starship) => starship.id !== starshipId)),
    );
    socket.on('onComponentCreated', (starship: Starship) => {
      const index = findIndex(starships, { id: starship.id });

      if (index) {
        const temp = [...starships];
        temp.splice(index, 1, starship);
        setStarships([...temp]);
      }
    });
    return () => socket?.disconnect();
  }, [starships]);

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

  const columnsAvailableStarships = [
    {
      Header: 'Starship',
      columns: [
        {
          Header: 'Name',
          accessor: 'name',
        },
        {
          Header: 'Model',
          accessor: 'model',
        },
      ],
    },
    {
      Header: 'Details',
      columns: [
        {
          Header: 'Cost',
          accessor: 'cost_in_credits',
        },
        {
          Header: 'Crew',
          accessor: 'crew',
        },
        {
          Header: 'Passengers',
          accessor: 'passengers',
        },
        {
          Header: 'Class',
          accessor: 'starship_class',
        },
      ],
    },
  ];

  const columnsStarship = [
    {
      Header: 'Starship',
      columns: [
        {
          Header: 'Name',
          accessor: 'name',
        },
        {
          Header: 'Model',
          accessor: 'model',
        },
      ],
    },
    {
      Header: 'Build Progress',
      columns: [
        {
          Header: 'Engine',
          accessor: 'components.engine',
        },
        {
          Header: 'Hull',
          accessor: 'components.hull',
        },
        {
          Header: 'Navigation',
          accessor: 'components.navigation',
        },
        {
          Header: 'Weapons',
          accessor: 'components.weapons',
        },
        {
          Header: 'Interior',
          accessor: 'components.interior',
        },
      ],
    },
  ];

  return (
    <Styles>
      <Title
        title="Starship Builder"
        description="Build starships from the list of available starships. Building a starship takes some time. A websocket remains open to update the UI as the starship is being built."
      />
      <Flex>
        <TableAvailableStarships
          data={availableStarships}
          columns={columnsAvailableStarships}
          onCreate={({ name, model }) => handleCreate({ name, model })}
          isCreateDisabled={starships.length >= MAX_STARSHIPS}
        />
        <TableStarships
          columns={columnsStarship}
          maxStarships={MAX_STARSHIPS}
          data={starships}
          onRemove={(id) => handleRemove(id)}
        />
      </Flex>
    </Styles>
  );
};

const Flex = styled.div`
  display: flex;
  flex-direction: row;
`;

const Styles = styled.div`
  padding: 1rem;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
`;
