import { Connection } from "./index";

export const all = async () => {
  return promiseQuery(allPlayersQuery);
};

export const allPlayerStats = async () => {
  return promiseQuery(allPlayerStatsQuery);
};

export const allPlayerRankingStats = async () => {
  let newPlayerArray = [];
  let players = await all();

  if (players) {
    return players.map(player => {
      return new Promise((resolve, reject) => {
        Connection.query(selectLastRanks(player.id), (err, results) => {
          if (err) {
            return reject(err);
          }
          console.log(results);
          return resolve(results);
        });
        return resolve(player);
      });
    });
  }
  // .then((results: {}[]) => results.map(player => {
  //       return new Promise((resolve, reject) => {
  //         Connection.query(selectLastRanks(player.id), (err, results) => {
  //           if (err) {
  //             return reject(err);
  //           }
  //           console.log(results);
  //           resolve(results);
  //         });
  //       });
  //     })
};

export default {
  all,
  allPlayerStats,
  allPlayerRankingStats
};

const promiseQuery = query => {
  return new Promise((resolve, reject) => {
    Connection.query(query, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

const allPlayersQuery = `SELECT * from players where isFakeClient = 0`;

const selectLastRanks = (playerSteamId, amountOfMatches = 33) => {
  return `SELECT level
FROM (matchStatistics a
INNER JOIN matches b ON a.matchId = b.id)
WHERE a.playerSteamId = ${playerSteamId} AND b.isValidMatch = 1
ORDER BY a.matchId
DESC LIMIT ${amountOfMatches}`;
};

const allPlayerStatsQuery = `SELECT
b.steamId AS 'id', 
b.name AS 'name',
COUNT(a.playerSteamId) AS 'Plays',
SUM(a.isWinner) AS 'Wins',
(SUM(a.isWinner) / COUNT(b.name)) AS 'WinPlayRatio',
SUM(a.isLoser) AS 'Loses',
SUM(a.score) AS 'Score',
SUM(a.kills) AS 'Kills',
SUM(a.deaths) AS 'Deaths',
(SUM(a.kills) / SUM(a.deaths)) AS 'KD',
SUM(a.assists) AS 'Assists',
SUM(a.headshots) AS 'Headshots',
SUM(a.headshotsPenetrated) AS 'HeadshotsPenetrated',
SUM(a.penetrated) AS 'Penetrated',
MAX(a.maxKillStreak) AS 'MaxKillStreak',
MAX(a.maxDeathStreak) AS 'MaxDeathStreak',
SUM(a.knifeKills) AS 'KnifeKills',
SUM(a.knifeDeaths) AS 'KnifeDeaths'
FROM
((matchStatistics a
LEFT JOIN players b ON ((a.playerSteamId = b.steamId)))
LEFT JOIN matches c ON ((a.matchId = c.id)))
WHERE
((c.isValidMatch = 1)
    AND (b.isFakeClient = 0))
GROUP BY a.playerSteamId
ORDER BY Wins DESC , WinPlayRatio DESC , Score DESC , KD DESC`;
