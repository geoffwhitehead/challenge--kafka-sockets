import React from "react";
import { Column, useTable } from "react-table";
import styled from "styled-components";
import { ComponentStatus, Starship } from "../types";

type TableProps = {
  data: Starship[];
  onRemove: (id: string) => void;
  maxStarships: number;
  columns: Column<Starship>[];
};

export const TableStarships: React.FC<TableProps> = ({
  maxStarships,
  data,
  onRemove,
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
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
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
                  const className =
                    cell.value === ComponentStatus.pending
                      ? "negative"
                      : cell.value === ComponentStatus.complete
                      ? "positive"
                      : "";

                  const renderCell =
                    cell.column?.parent?.Header !== "Build Progress";
                  return (
                    <td className={className} {...cell.getCellProps()}>
                      {renderCell && cell.render("Cell")}
                    </td>
                  );
                })}
                <td>
                  <button onClick={() => onRemove(row.original.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p>
        Starships: {data.length} / {maxStarships}
      </p>
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
    .positive {
      background-color: lightgreen;
    }

    .negative {
      background-color: lightcoral;
    }
  }
`;
