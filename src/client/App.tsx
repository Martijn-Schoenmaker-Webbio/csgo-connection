import React, { useState, useEffect } from "react";

const App = (props: IAppProps) => {
  const [players, setPlayers] = useState([]);

  const fetchplayers = async () => {
    const r = await fetch("/api/players");
    const players = await r.json();
    const sortedPlayers = players.sort((a, b) => {
      return b.currentRank - a.currentRank;
    });
    setPlayers(sortedPlayers);
  };

  useEffect(() => {
    fetchplayers();
  }, []);

  return (
    <table>
      <tbody>
        <tr>
          <th>#</th>
          <th>RP</th>
          <th>Player</th>
          <th>Form</th>
          <th>Forecast</th>
        </tr>

        {players.map((player, index) => {
          const rankOne = getRankFromMatches(player.previousRanks, 0, 30);
          const rankTwo = getRankFromMatches(player.previousRanks, 1, 30);
          const rankThree = getRankFromMatches(player.previousRanks, 2, 30);
          return (
            <tr key={player.id}>
              <td>{index}</td>
              <td>{player.currentRank}</td>
              <td>{`${rankOne} - ${rankTwo} - ${rankThree}`}</td>
              <td>{player.name}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const getRankFromMatches = (arr, matchToStartFrom: number, amountOfMatches: number) => {
  if (arr.length - 1 < matchToStartFrom) {
    return arr;
  }
  const endOfArray = matchToStartFrom + amountOfMatches;
  return arr.slice(matchToStartFrom, endOfArray).reduce((acc, curr) => acc + curr);
};

export interface IAppProps {
  players: Array<any>;
}

export default App;
