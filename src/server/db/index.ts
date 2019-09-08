import * as mysql from "mysql";
import config from "../config";

import Matches from "./matches";

export const Connection = mysql.createConnection(config.mysql);

Connection.connect(err => {
  err && console.log(err);
});

export default {
  Matches
};
