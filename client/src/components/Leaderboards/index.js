import React from "react";
import { useState, useMemo } from "react";
import { useTable, useFilters } from "react-table";
import SearchIcon from "@material-ui/icons/Search";
import network from "../../network";
const baseUrl = "http://localhost:3001/api/leaderboards/getscores";

export default function Leaderboards({ music, fetchSongAudio }) {
  const [filterInput, setFilterInput] = useState("");
  const handleFilterChange = (e) => {
    const value = e.target.value || "";
    setFilter("player", value);
    setFilterInput(value);
  };

  const data = useMemo(() => {
    network.get(baseUrl);
  }, []);

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
    <table {...getTableProps()} className="scoreboard">
      <thead>
        <div className="scoreboard-search-container">
          <SearchIcon className="scoreboard__searchicon" />
          <input
            value={filterInput}
            onChange={handleFilterChange}
            placeholder={"Filter"}
            className="scoreboard-table__search"
          />
        </div>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                className="scoreboard_table-header"
              >
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, index) => {
          prepareRow(row);
          return (
            <div key={`${index}tbody`} className="table-container-div">
              <tr {...row.getRowProps()}>
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
  );
}
