import React from "react";
import "./Searchbox.css";
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";
import TextField from "@material-ui/core/TextField";
let times;

const useStyles = makeStyles((theme) => ({
  searchBox: {
    "& > *": {
      margin: theme.spacing(1),
      width: "28vw",
      marginTop: "-22px",
      marginLeft: "12px",
      float: "right",
    },
  },
}));

export default function Searchbox({ setTicketList }) {
  const debounce = (func, time) => {
    clearTimeout(times);
    times = setTimeout(func, time);
  };
  const classes = useStyles();
  const [textInputValue, setTextInputValue] = useState("");

  return (
    <div className={classes.searchBox}>
      <TextField
        type="text"
        id="searchInput"
        value={textInputValue}
        autoComplete="off"
        variant="filled"
        label="Search by tags or title"
      />
    </div>
  );
}
