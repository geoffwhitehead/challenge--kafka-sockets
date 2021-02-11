import React from 'react';
import { Column, useTable } from 'react-table';
import styled from 'styled-components';
import { SwapiStarship } from '../../services/api';

export type TableProps = {
  data: SwapiStarship[];
  onCreate: (starship: SwapiStarship) => void;
  isCreateDisabled?: boolean;
  columns: Column<SwapiStarship>[];
};

export const TableAvailableStarships: React.FC<TableProps> = ({
  onCreate,
  data,
  isCreateDisabled,
  columns,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  return (
    <Styles>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
              <th></th>
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
                <td>
                  <button
                    onClick={() => !isCreateDisabled && onCreate(row.original)}
                  >
                    Create
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Styles>
  );
};

const Styles = styled.div`
  padding: 1rem;

  flex: 1 1 0px;
  table {
    width: 100%;
    border-spacing: 0;
    border: 1px solid lightgrey;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid lightgrey;
      border-right: 1px solid lightgrey;

      :last-child {
        border-right: 0;
      }
    }
  }
`;
