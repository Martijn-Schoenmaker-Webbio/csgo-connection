import React, { useState, useEffect } from "react";

const App = (props: IAppProps) => {
  const [players, setPlayers] = useState([]);

  const fetchplayers = async () => {
    const r = await fetch("/api/players");
    const players = await r.json();
    setPlayers(players);
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
          return (
            <tr key={player.id}>
              <td>{index}</td>
              <td>{10}</td>
              <td>{player.name}</td>
              <td>{player.name}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export interface IAppProps {
  players: Array<any>;
}

export default App;
