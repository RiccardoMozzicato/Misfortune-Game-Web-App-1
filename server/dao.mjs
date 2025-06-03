import sqlite from "sqlite3";
import { Card, Game, initialCards, Round, User } from "./models.mjs";
import crypto from "crypto";

// open the database
const db = new sqlite.Database("SQLite.sqlite", (err) => {
  if (err) throw err;
});

/** USER DAO **/

export const createUser = (user) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO User(username, password) VALUES (?, ?)";
    db.run(sql, [user.username, user.password], function (err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
};

export const listUsers = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM User";
    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else
        resolve(
          rows.map((row) => new User(row.id, row.username, row.password))
        );
    });
  });
};

export const getUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM User WHERE username = ?";
    db.get(sql, [username], (err, row) => {
      if (err) reject(err);
      else
        resolve(row ? new User(row.id, row.username, row.password) : undefined);
    });
  });
};

/** CARD DAO **/

export const createCard = (card) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO Card(name, url, misfortune_index, theme) VALUES (?, ?, ?, ?)";
    db.run(
      sql,
      [card.name, card.url, card.misfortune_index, card.theme],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
};

export const listCards = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Card";
    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else
        resolve(
          rows.map(
            (row) =>
              new Card(
                row.id,
                row.name,
                row.url,
                row.misfortune_index,
                row.theme
              )
          )
        );
    });
  });
};

export const getCardById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Card WHERE id = ?";
    db.get(sql, [id], (err, row) => {
      if (err) reject(err);
      else
        resolve(
          row
            ? new Card(
                row.id,
                row.name,
                row.url,
                row.misfortune_index,
                row.theme
              )
            : undefined
        );
    });
  });
};

/** GAME DAO **/

export const createGame = (game) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO Game(createdAt, userId, totalCards, outcome) VALUES (?, ?, ?, ?)";
    db.run(
      sql,
      [game.createdAt, game.userId, game.totalCards, game.outcome],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
};

//to fix: espandere le info per la cronologia (initial cards, per ogni round, card.name ) farla diventare 'cronologia'
export const userHistory = (username) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT g.*
      FROM Game g
      JOIN User u ON g.userId = u.id
      JOIN InitialCards ic ON g.id = ic.gameId
      JOIN Card c ON ic.cardId = c.id
      JOIN Round r ON g.id = r.gameId AND r.cardId = c.id
      WHERE u.username = ?
    `;
    db.all(sql, [username], (err, rows) => {
      if (err) {
        console.log(err);
        reject(err);
      } else
        resolve(
          rows.map(
            (row) =>
              new Game(
                row.id,
                row.createdAt,
                row.userId,
                row.totalCards,
                row.outcome
              )
          )
        );
    });
  });
};

/** INITIAL CARDS DAO **/

export const createInitialCards = (gameId, cardIds) => {
  //gli passiamo il gameId e 3 cardIds
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO InitialCards(gameId, cardId) VALUES (?, ?)";
    let completed = 0;
    for (const cardId of cardIds) {
      db.run(sql, [gameId, cardId], function (err) {
        if (err) reject(err);
        completed++;
        if (completed === cardIds.length) resolve(true);
      });
    }
  });
};

export const listInitialCardsByGame = (gameId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT c.* FROM InitialCards ic
      JOIN Card c ON ic.cardId = c.id
      WHERE ic.gameId = ?
    `;
    db.all(sql, [gameId], (err, rows) => {
      if (err) reject(err);
      else
        resolve(
          rows.map(
            (row) =>
              new Card(
                row.id,
                row.name,
                row.url,
                row.misfortune_index,
                row.theme
              )
          )
        );
    });
  });
};

/** ROUND DAO **/

export const createRound = (round) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO Round(gameId, cardId, won, roundNumber) VALUES (?, ?, ?, ?)";
    db.run(
      sql,
      [round.gameId, round.cardId, round.won, round.roundNumber],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
};

export const listRoundsByGame = (gameId) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT  gameId, roundNumber, won, c.name FROM Round r JOIN Card c ON c.id=r.cardId WHERE gameId = ?";
    db.all(sql, [gameId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const listRoundsWonByGame = (gameId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Round WHERE gameId = ? AND won = 1";
    db.all(sql, [gameId], (err, rows) => {
      if (err) reject(err);
      else
        resolve(
          rows.map(
            (row) =>
              new Round(
                row.id,
                row.gameId,
                row.cardId,
                row.won,
                row.roundNumber
              )
          )
        );
    });
  });
};
