import { Connection } from "./index";

export const all = async () => {
  return new Promise((resolve, reject) => {
    Connection.query(mostRecentMatchDetailed(3), (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

export const all2 = async () => {
  return new Promise((resolve, reject) => {
    Connection.query(mostRecentMatch, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

export default {
  all,
  all2
};

const mostRecentMatch = `SELECT * 
FROM matches
WHERE isValidMatch = 1
ORDER BY id DESC LIMIT 1`;

const mostRecentMatchDetailed = amountOfMatches => `SELECT * 
FROM allValidMatches 
WHERE
(matchId >= 
  (SELECT id
  FROM
  matches c
  WHERE
  c.isValidMatch = 1
  ORDER BY id DESC
  LIMIT ${amountOfMatches - 1}, 1))`;
