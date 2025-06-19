import express from "express";
import morgan from "morgan";
import { check, validationResult } from "express-validator";
import cors from "cors";
import passport from "passport";
import LocalStrategy from "passport-local";
import session from "express-session";
import {
  createUser,
  listUsers,
  getUserByUsername,
  listCards,
  getCardById,
  createGame,
  getGameByUser,
  updateGame,
  deleteGame,
  createInitialCards,
  getRoundById,
  createRound,
  listRoundsByGame,
  updateRound,
  listInitialCardsByGame,
} from "./dao.mjs";
import dayjs from "dayjs";
import path from "path";
// init express
const app = express();
const port = 3001;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/images", express.static("public/images"));

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessState: 200,
  credentials: true,
};
app.use(cors(corsOptions));

// Passport setup
passport.use(
  new LocalStrategy(async function verify(username, password, cb) {
    const user = await getUserByUsername(username, password);
    if (!user) return cb(null, false, "Incorrect username or password.");
    return cb(null, user);
  })
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Not authorized" });
};

app.use(
  session({
    secret: "shhhhh... it's a secret!",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);
app.use(passport.authenticate("session"));

/* ROUTES */

// USER ROUTE -- CREATA MA NON UTILIZZATA PERCHE' UTENTE INSERITO MANUALMENTE NEL DB CON CRYPTAZIONE
app.post(
  "/api/users",
  [check("username").notEmpty(), check("password").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      const id = await createUser(req.body);
      res.status(201).json({ id });
    } catch (e) {
      res.status(503).json({ error: "Impossible to create the user." });
    }
  }
);

// GET ALL USERS -- INUTILIZZATA
app.get("/api/users", async (req, res) => {
  try {
    const users = await listUsers();
    res.json(users);
  } catch {
    res.status(500).end();
  }
});

// CARD ROUTES
app.get("/api/cards", async (req, res) => {
  try {
    const cards = await listCards();
    res.json(cards);
  } catch {
    res.status(500).end();
  }
});

app.get("/api/cards/:id", async (req, res) => {
  try {
    const card = await getCardById(req.params.id);
    if (!card) res.status(404).json({ error: "Card not found" });
    else res.json(card);
  } catch {
    res.status(500).end();
  }
});

// GAME ROUTES

// CREATE A NEW GAME

app.get("/api/start-game", async (req, res) => {
  try {
    const gameId = await createGame({
      createdAt: new dayjs().toISOString(),
      userId: req.user?.id || null, // Assuming a user ID of 1 for testing purposes
    });

    const allCards = await listCards();
    const shuffled = allCards.sort(() => Math.random() - 0.5);

    const initialCards = shuffled.slice(0, 3);

    await createInitialCards(
      gameId,
      initialCards.map((card) => card.id)
    );

    const allCardsWithoutInitial = allCards.filter(
      (card) => !initialCards.includes(card)
    );

    const roundCards = allCardsWithoutInitial.slice(0, 5);

    res.status(201).json({
      gameId,
      initialCards,
      roundCards: roundCards.map((card) => ({
        id: card.id,
        name: card.name,
        url: card.url,
        theme: card.theme,
      })),
    });
  } catch (e) {
    console.error("Error starting game:", e);
    res.status(503).json({ error: "Impossible to start the game." });
    return;
  }
});

// getMatchHistory
app.get("/api/games/:username", isLoggedIn, async (req, res) => {
  let games, initCards, rounds;
  try {
    games = await getGameByUser(req.params.username);
  } catch {
    return res.status(500).json({ error: "Impossible to create the user." });
  }

  const gamesJson = [];
  for (const game of games) {
    // INSERIRE TRY CATCH PER ERRORI
    try {
      initCards = await listInitialCardsByGame(game.id);
    } catch (e) {
      return res.status(500).json({ error: "Error fetching initial cards." });
    }
    const json = {
      id: game.id,
      createdAt: game.createdAt,
      totalCards: game.totalCards,
      outcome: game.outcome,
      initialCards: initCards.map((card) => ({
        name: card.name,
      })),
      rounds: [],
    };

    try {
      rounds = await listRoundsByGame(game.id);
    } catch (e) {
      return res.status(500).json({ error: "Error fetching rounds." });
    }

    for (const round of rounds) {
      json.rounds.push({
        won: round.won,
        roundNumber: round.roundNumber,
        name: round.name,
      });
    }
    gamesJson.push(json);
  }
  res.json(gamesJson);
});

app.patch(
  "/api/games/:gameId",
  //isLoggedIn,
  [check("gameId").isNumeric(), check("totalCards").isNumeric()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      const id = req.params.gameId;
      const { totalCards, outcome } = req.body;
      await updateGame(id, totalCards, outcome);
      res.status(200).end();
    } catch (e) {
      res.status(503).json({ error: "Impossible to update the game." });
    }
  }
);

app.delete("/api/games/:gameId", async (req, res) => {
  try {
    const id = req.params.gameId;
    await deleteGame(id);
    res.status(204).end();
  } catch (e) {
    res.status(503).json({ error: "Impossible to delete the game." });
  }
});

// INITIAL CARDS ROUTES
app.post(
  "/api/initial-cards/",
  isLoggedIn,
  [check("gameId").isNumeric(), check("cardIds").isArray()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      await createInitialCards(req.body.gameId, req.body.cardIds);
      res.status(201).end();
    } catch (e) {
      res.status(503).json({ error: "Impossible to create initial cards." });
    }
  }
);

// ROUND ROUTES
app.post(
  "/api/rounds/",
  [
    check("gameId").isNumeric(),
    check("cardId").isNumeric(),
    check("won").isBoolean(),
    check("roundNumber").isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      const id = await createRound(req.body);
      res.status(201).json({ id });
    } catch (e) {
      res.status(503).json({ error: "Impossible to create the round." });
    }
  }
);

app.get("/api/rounds/:gameId", isLoggedIn, async (req, res) => {
  try {
    const rounds = await listRoundsByGame(req.params.gameId);
    res.status(201).json(rounds);
  } catch {
    res.status(500).end();
  }
});

app.patch(
  "/api/rounds/:roundId",
  //isLoggedIn,
  async (req, res) => {
    const { misfortuneLeft, misfortuneRight, cardId, timeStamp } = req.body;
    const roundId = req.params.roundId;
    let won = false;
    let result;
    try {
      result = await getCardById(cardId);
    } catch {
      res.status(404).json({ error: "Card not found" });
    }

    const misfortune_index = result.misfortune_index;

    try {
      result = await getRoundById(roundId);
    } catch {
      res.status(404).json({ error: "Round not found" });
    }

    const oldTimeStamp = dayjs(result.timeStamp);
    const newTimeStamp = dayjs(timeStamp);

    const createdAt = newTimeStamp.diff(oldTimeStamp, "seconds");

    if (
      misfortuneLeft < misfortune_index &&
      misfortune_index < misfortuneRight
    ) {
      if (createdAt < 30) {
        won = true;
      }
    }

    try {
      result = await updateRound(roundId, won);
      const Result = {
        misfortune_index,
        won,
      };
      res.status(200).json(Result);
    } catch {
      res.status(503).json({ error: "Error updating round" });
    }
  }
);

// AUTH ROUTES
app.post("/api/sessions", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
    if (!user) {
      return res.status(401).json({ error: info.message || "Unauthorized" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }
      return res.status(201).json(req.user);
    });
  })(req, res, next);
});

app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else res.status(401).json({ error: "Not authenticated" });
});

app.delete("/api/sessions/current", (req, res) => {
  req.logout(() => {
    res.end();
  });
});

// start server
app.listen(port, () => {
  console.log(`API server started at http://localhost:${port}`);
});
