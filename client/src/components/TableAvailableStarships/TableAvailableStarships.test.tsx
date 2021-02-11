import { fireEvent } from '@testing-library/react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { TableAvailableStarships } from './TableAvailableStarships';

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

const testData = [
  {
    name: 'test name',
    model: 'test model',
    cost_in_credits: '100',
    crew: '300',
    passengers: '400',
    starship_class: 'test class',
  },
  {
    name: 'test name 2',
    model: 'test model 2',
    cost_in_credits: '1000',
    crew: '3000',
    passengers: '4000',
    starship_class: 'test class 2',
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
it('renders all columns', () => {
  act(() => {
    render(
      <TableAvailableStarships
        data={testData}
        columns={testColumns}
        onCreate={() => {}}
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
      <TableAvailableStarships
        data={testData}
        columns={testColumns}
        onCreate={() => {}}
      />,
      container,
    );
  });
  testData.map((data) => {
    Object.values(data).map((cell) => {
      expect(container!.textContent).toContain(cell);
    });
  });
});

it('renders a button with create text', () => {
  act(() => {
    render(
      <TableAvailableStarships
        data={testData}
        columns={testColumns}
        onCreate={() => {}}
      />,
      container,
    );
  });

  const button = container!.querySelector('button');
  expect(button).toBeTruthy();
  expect(button).toHaveTextContent('Create');
});

it('calls button handler when clicked and passes correct data', () => {
  const mockedOnClick = jest.fn();

  act(() => {
    render(
      <TableAvailableStarships
        data={testData}
        columns={testColumns}
        onCreate={mockedOnClick}
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

  expect(mockedOnClick).toHaveBeenNthCalledWith(1, testData[0]);
});
