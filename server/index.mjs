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
  createCard,
  listCards,
  getCardById,
  createGame,
  getGameByUser,
  createInitialCards,
  listInitialCardsByGame,
  createRound,
  listRoundsByGame,
  listRoundsWonByGame,
} from "./dao.mjs";

// init express
const app = express();
const port = 3001;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessState: 200,
  credentials: true,
};
app.use(cors(corsOptions));

// Passport setup
passport.use(
  new LocalStrategy(async function verify(username, password, cb) {
    const user = await getUserByUsername(username);
    if (!user || user.password !== password)
      return cb(null, false, "Incorrect username or password.");
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

// USER ROUTES
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

app.post(
  "/api/cards/",
  isLoggedIn,
  [
    check("name").notEmpty(),
    check("url").notEmpty(),
    check("misfortune_index").isNumeric(),
    check("theme").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      const id = await createCard(req.body);
      res.status(201).json({ id });
    } catch (e) {
      res.status(503).json({ error: "Impossible to create the card." });
    }
  }
);

// GAME ROUTES
app.post(
  "/api/games/",
  isLoggedIn,
  [
    check("createdAt").notEmpty(),
    check("userId").isNumeric(),
    check("totalCards").isNumeric(),
    check("outcome").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      const id = await createGame(req.body);
      res.status(201).json({ id });
    } catch (e) {
      res.status(503).json({ error: "Impossible to create the game." });
    }
  }
);

app.get("/api/games/:username", isLoggedIn, async (req, res) => {
  try {
    const games = await getGameByUser(req.params.username);
    res.json(games);
  } catch {
    res.status(500).end();
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

app.get("/api/initial-cards/:gameId", isLoggedIn, async (req, res) => {
  try {
    const cards = await listInitialCardsByGame(req.params.gameId);
    res.json(cards);
  } catch {
    res.status(500).end();
  }
});

// ROUND ROUTES
app.post(
  "/api/rounds/",
  isLoggedIn,
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
    res.json(rounds);
  } catch {
    res.status(500).end();
  }
});

app.get("/api/rounds-won/:gameId", isLoggedIn, async (req, res) => {
  try {
    const rounds = await listRoundsWonByGame(req.params.gameId);
    res.json(rounds);
  } catch {
    res.status(500).end();
  }
});

// AUTH ROUTES
app.post("/api/sessions/", passport.authenticate("local"), function (req, res) {
  return res.status(201).json(req.user);
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
