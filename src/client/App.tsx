import React, { useState, useEffect } from "react";

const App = (props: IAppProps) => {
  const [players, setPlayers] = useState([]);
  const [lastMatch, setLastMatch] = useState([]);

  const MATCHES_FOR_RANK = 30;

  const fetchplayers = async () => {
    const r = await fetch("/api/players");
    const players = await r.json();
    const sortedPlayers = players.sort((a, b) => {
      return b.currentRank - a.currentRank;
    });
    setPlayers(sortedPlayers);
  };

  const fetchLastMatch = async () => {
    const r = await fetch("/api/matches");
    const match = await r.json();
    setLastMatch(match[0]);
  };

  useEffect(() => {
    fetchplayers();
    fetchLastMatch();
  }, []);

  return (
    <div className="container">
      <div className="table-container">
        Last match at: {timeConverter(lastMatch.startTime)}
        <table className="table table-dark table-striped">
          <thead>
            <tr key={1090}>
              <th className="position">#</th>
              <th className="current-rank">RP</th>
              <th className="name">Player</th>
              <th className="form">Form</th>
              <th className="forecast">Forecast</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => {
              return (
                <tr key={player.id}>
                  <td className="position">{index + 1}</td>
                  <td className="current-rank">
                    {player.currentRank}
                    <sup className="difference-in-rank">
                      {index !== 0 && `-${players[index - 1].currentRank - player.currentRank}`}
                    </sup>
                  </td>
                  <td className="name">{player.name}</td>
                  <td className="form">
                    {getPreviousRanks(player.previousRanks, 4, MATCHES_FOR_RANK)
                      .reverse()
                      .map((rank, index, arr) => {
                        if (index === 0) {
                          return;
                        }
                        return (
                          <span className="form-item">
                            {rank}
                            <span className="growth">{setGrowthIcon(rank - arr[index - 1])}</span>
                          </span>
                        );
                      })}
                  </td>
                  <td className="forecast">
                    {getForecast(player.previousRanks, 3, MATCHES_FOR_RANK).map(rank => {
                      return <span className="forecast-item">{rank}</span>;
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const setGrowthIcon = (number: number) => {
  const value = Math.sign(number);

  if (value === 1) {
    return <span className="positive">▾</span>;
  } else if (value === -1) {
    return <span className="negative">▾</span>;
  } else {
    return <span className="even">・</span>;
  }
};

const getForecast = (arr, amountOfRanks, amountOfMatches) => {
  const rankAmount = arr.length < amountOfRanks ? arr.length : amountOfRanks;
  const matchesAmount = arr.length < amountOfMatches - 1 ? arr.length - 1 : amountOfMatches - 1;
  let ranks = [];
  for (let i = matchesAmount; i > matchesAmount - rankAmount; i--) {
    ranks.push(arr[i].level);
  }

  return ranks;
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
  const rankArray = arr.slice(matchToStartFrom, endOfArray).reduce((acc, curr) => ({ level: acc.level + curr.level }))
    .level;

  return rankArray;
};

function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
  return time;
}

export interface IAppProps {
  players: Array<any>;
}

export default App;
