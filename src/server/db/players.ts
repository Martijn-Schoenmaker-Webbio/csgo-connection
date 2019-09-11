import { Connection } from "./index";

export const all = async () => {
  return promiseQuery(allPlayersQuery);
};

export const allPlayerStats = async () => {
  return promiseQuery(allPlayerStatsQuery);
};

export const allPlayerRankingStats = async () => {
  let players = await all();
  if (players) {
    const mappedPlayers: Promise<any>[] = players.map(player => {
      return addLevelsToPlayer(player);
    });
    return await Promise.all(mappedPlayers);
  }
};

const addLevelsToPlayer = player => {
  return new Promise((resolve, reject) => {
    Connection.query(selectLastRanks(player.steamId), (err, results) => {
      if (err) {
        return reject(err);
      }

      const levels = results.map(row => {
        return row.level;
      });

      const currentRank = levels.slice(0, 30).reduce((acc, curr) => acc + curr);
      // const test = await getPlayerAvatar(player.steamId64);

      const newPlayer = { ...player, currentRank: currentRank, previousRanks: levels };

      return resolve(newPlayer);
    });
  });
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

const getPlayerAvatar = async (steamId: string): Promise<string> => {
  try {
    const resultLol = await fetch(
      `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=79B6EEE9AE83FC81458CA2C392B5BB37&steamids=${steamId}`,
      {
        method: "get"
      }
    );

    const text: string = await resultLol.text();
    let trimmedtext = text.split("[")[1];
    trimmedtext = trimmedtext.split("]")[0];

    const player = JSON.parse(trimmedtext);

    return player.avatarfull;
  } catch (error) {
    return "";
  }
};

const allPlayersQuery = `SELECT * from players where isFakeClient = 0`;

const selectLastRanks = (playerSteamId, amountOfMatches = 33) => {
  return `SELECT level
FROM (matchStatistics a
INNER JOIN matches b ON a.matchId = b.id)
WHERE a.playerSteamId = '${playerSteamId}' AND b.isValidMatch = 1
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
