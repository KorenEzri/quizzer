import React from "react";
import lostTheGame from "./lostgame.jpg";

export default function LostTheGame() {
  return (
    <div>
      <img alt="lostgame" src={lostTheGame} className="lost_the_game" />
      <img alt="lostgame" src={lostTheGame} className="lost_the_game second" />
      <img alt="lostgame" src={lostTheGame} className="lost_the_game third" />
      <img alt="lostgame" src={lostTheGame} className="lost_the_game fourth" />
      <img alt="lostgame" src={lostTheGame} className="lost_the_game fifth" />
      <img alt="lostgame" src={lostTheGame} className="lost_the_game sixth" />
    </div>
  );
}
