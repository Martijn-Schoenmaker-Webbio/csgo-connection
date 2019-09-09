import * as express from "express";
import DB from "./db";

const router = express.Router();

router.get("/api/hello", (req, res, next) => {
  res.json("World");
});

router.get("/api/matches", async (req, res) => {
  try {
    let matches = await DB.Matches.all();
    res.json(matches);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.get("/api/players", async (req, res) => {
  try {
    let players = await DB.Players.allPlayerRankingStats();
    res.json(players);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

export default router;
