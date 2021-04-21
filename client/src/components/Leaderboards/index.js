import React, { useState, useEffect } from "react";
import Board from "./Board";
import network from "../../network";
const baseUrl = "http://localhost:3001/api/leaderboards/getscores/";
export default function Leaderboards() {
  const [scoreData, setScoreData] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await network.get(baseUrl);
      setScoreData(data);
    })();
  }, []);

  return <div>{scoreData && <Board scores={scoreData} />}</div>;
}
