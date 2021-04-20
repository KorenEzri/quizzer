import React from "react";
import { useState, useMemo } from "react";
import Jdenticon from "react-jdenticon";
import { useTable, useFilters } from "react-table";
import SearchIcon from "@material-ui/icons/Search";
import "./Board.css";

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default function Board({ scores }) {
  const data = useMemo(
    () =>
      scores.map((user) => {
        const hs = user.highscore || 0;
        return {
          player: user.name,
          highscore: hs,
          joined: user.createdAt,
          at: user.highscore_date,
        };
      }),
    []
  );

  data.sort(function (a, b) {
    return b.highscore - a.highscore;
  });

  const [filterInput, setFilterInput] = useState("");

  const handleFilterChange = (e) => {
    const value = e.target.value || "";
    setFilter("player", value);
    setFilterInput(value);
  };

  const columns = useMemo(
    () => [
      {
        Header: "PLAYER",
        accessor: "player",
      },
      {
        Header: "SCORE",
        accessor: "highscore",
      },
      {
        Header: "JOINED",
        accessor: "joined",
      },
      {
        Header: "HIGHSCORE DATE",
        accessor: "at",
      },
    ],
    []
  );

  const tableInstance = useTable({ columns, data }, useFilters);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setFilter,
  } = tableInstance;

  return (
    <div className="table__container">
      <table {...getTableProps()} className="scoreboard">
        <thead>
          <div className="absloutely">
            <div className="scoreboard-search-container">
              <SearchIcon className="scoreboard__searchicon" />
              <input
                value={filterInput}
                onChange={handleFilterChange}
                placeholder={"Search players"}
                className="scoreboard-table__search"
              />
            </div>
          </div>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <div className="thead__container">
                  <th
                    {...column.getHeaderProps()}
                    className="scoreboard_table-header"
                  >
                    {column.render("Header")}
                  </th>
                </div>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row);
            return (
              <div key={`${index}tbody`} className="table-container-div">
                <div className="absloutely">
                  <div className="player_icon">
                    <Jdenticon size="42" value={`${row.original.player}`} />
                  </div>
                </div>
                <tr {...row.getRowProps()} className="table_row">
                  {row.cells.map((cell, index) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        className="scoreboard-table__data"
                        key={`${index}td`}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              </div>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
