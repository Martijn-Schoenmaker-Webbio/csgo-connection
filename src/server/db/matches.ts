import { Connection } from "./index";

export const all = async () => {
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
  all
};

const mostRecentMatch = `SELECT * 
FROM matches
WHERE isValidMatch = 1
ORDER BY id DESC LIMIT 1`;
