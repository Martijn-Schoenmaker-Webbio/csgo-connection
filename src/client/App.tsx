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
    <div className="container">
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>RP</th>
            <th>Player</th>
            <th>Form</th>
            <th>Forecast</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => {
            return (
              <tr key={player.id}>
                <td>{index + 1}</td>
                <td>{player.currentRank}</td>
                <td>{player.name}</td>
                <td>
                  {getPreviousRanks(player.previousRanks, 4, 30).map(rank => {
                    return `${rank} - `;
                  })}
                </td>
                <td>{player.name}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const getPreviousRanks = (arr, amountOfRanks, amountOfMatches) => {
  const rankAmount = arr.length < amountOfRanks ? arr.length : amountOfRanks;
  const matchesAmount = arr.length < amountOfMatches ? arr.length : amountOfMatches;
  let ranks = [];
  for (let i = 0; i < rankAmount; i++) {
    ranks.push(getRankFromMatches(arr, i, matchesAmount));
  }
  return ranks;
};

const getRankFromMatches = (arr, matchToStartFrom: number, amountOfMatches: number) => {
  const endOfArray = matchToStartFrom + amountOfMatches;
  const rankArray = arr.slice(matchToStartFrom, endOfArray).reduce((acc, curr) => acc + curr);
  return rankArray;
};

export interface IAppProps {
  players: Array<any>;
}

export default App;
