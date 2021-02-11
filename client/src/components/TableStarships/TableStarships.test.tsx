import { fireEvent } from '@testing-library/react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { ComponentStatus, Starship } from '../types';
import { TableStarships } from './TableStarships';

let container: Element | null = null;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  if (container) {
    unmountComponentAtNode(container);
    container.remove();
  }

  container = null;
});

const testData: Starship[] = [
  {
    id: '123',
    name: 'test name',
    model: 'test model',
    components: {
      engine: ComponentStatus.pending,
      navigation: ComponentStatus.pending,
      weapons: ComponentStatus.pending,
      hull: ComponentStatus.pending,
      interior: ComponentStatus.pending,
    },
  },
  {
    id: '456',
    name: 'test name 2',
    model: 'test model 2',
    components: {
      engine: ComponentStatus.pending,
      navigation: ComponentStatus.pending,
      weapons: ComponentStatus.pending,
      hull: ComponentStatus.pending,
      interior: ComponentStatus.pending,
    },
  },
];

const testColumns = [
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

it('renders all columns', () => {
  act(() => {
    render(
      <TableStarships
        data={testData}
        columns={testColumns}
        onRemove={() => {}}
      />,
      container,
    );
  });
  testColumns.map(({ Header, columns }) => {
    expect(container!.textContent).toContain(Header);
    columns.map((column) => {
      expect(container!.textContent).toContain(column.Header);
    });
  });
});

it('renders all test data', () => {
  act(() => {
    render(
      <TableStarships
        data={testData}
        columns={testColumns}
        onRemove={() => {}}
      />,
      container,
    );
  });
  testData.map((data) => {
    Object.entries(data).map(([key, cell]) => {
      if (key !== 'components' && key !== 'id') {
        expect(container!.textContent).toContain(cell);
      }
    });
  });
});

it('correctly renders number of starships', () => {
  act(() => {
    render(
      <TableStarships
        data={testData}
        columns={testColumns}
        onRemove={() => {}}
      />,
      container,
    );
  });

  expect(container!.textContent).toContain(`${testData.length} / 25`);
});

it('renders a button with remove text', () => {
  act(() => {
    render(
      <TableStarships
        data={testData}
        columns={testColumns}
        onRemove={() => {}}
      />,
      container,
    );
  });

  const button = container!.querySelector('button');
  expect(button).toBeTruthy();
  expect(button).toHaveTextContent('Remove');
});

it('correctly styles the component field table cells', () => {
  const [firstStarship] = testData;

  const tests = [
    {
      data: [
        {
          ...firstStarship,
          components: {
            engine: ComponentStatus.complete,
            navigation: ComponentStatus.complete,
            weapons: ComponentStatus.complete,
            hull: ComponentStatus.complete,
            interior: ComponentStatus.complete,
          },
        },
      ],
      expectedPositive: 5,
      expectedNegative: 0,
    },
    {
      data: [
        {
          ...firstStarship,
          components: {
            engine: ComponentStatus.pending,
            navigation: ComponentStatus.pending,
            weapons: ComponentStatus.pending,
            hull: ComponentStatus.pending,
            interior: ComponentStatus.pending,
          },
        },
      ],
      expectedPositive: 0,
      expectedNegative: 5,
    },
    {
      data: [
        {
          ...firstStarship,
          components: {
            engine: ComponentStatus.complete,
            navigation: ComponentStatus.pending,
            weapons: ComponentStatus.complete,
            hull: ComponentStatus.pending,
            interior: ComponentStatus.complete,
          },
        },
      ],
      expectedPositive: 3,
      expectedNegative: 2,
    },
  ];

  tests.map((test) => {
    act(() => {
      render(
        <TableStarships
          data={test.data}
          columns={testColumns}
          onRemove={() => {}}
        />,
        container,
      );
    });
    const negativeElements = container!.getElementsByClassName('negative');
    const positiveElements = container!.getElementsByClassName('positive');

    expect(negativeElements.length).toBe(test.expectedNegative);
    expect(positiveElements.length).toBe(test.expectedPositive);

    unmountComponentAtNode(container!);
    document.body.appendChild(container!);
  });
});

it('calls button handler when clicked and passes correct data', () => {
  const mockedOnClick = jest.fn();

  act(() => {
    render(
      <TableStarships
        data={testData}
        columns={testColumns}
        onRemove={mockedOnClick}
      />,
      container,
    );
  });

  const button = container!.querySelector('button')?.firstChild;
  expect(button).toBeTruthy();

  fireEvent(
    button!,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );

  expect(mockedOnClick).toHaveBeenNthCalledWith(1, testData[0].id);
});
