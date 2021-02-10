import React from "react";
import { Column, useTable } from "react-table";
import styled from "styled-components";

export type TableProps<T extends {}> = {
  columns: Column<T>[];
  data: T[];
  onClickRow?: (params: T) => void;
  buttonText?: string;
};

export function Table<T extends {}>({
  columns,
  data,
  onClickRow,
  buttonText,
}: TableProps<T>): JSX.Element {
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
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
              <th>Action</th>
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
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
                {onClickRow && (
                  <td>
                    <button onClick={() => onClickRow(row.original)}>
                      {buttonText}
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Styles>
  );
}

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
