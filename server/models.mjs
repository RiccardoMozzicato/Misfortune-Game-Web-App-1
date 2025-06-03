//defining models
import dayjs from "dayjs";

function Card(id, name, url, misfortune_index, theme) {
  this.id = id;
  this.name = name;
  this.url = url;
  this.misfortune_index = misfortune_index;
  this.theme = theme;
}

function Game(id, createdAt, userId, totalCards, outcome) {
  this.id = id;
  this.createdAt = dayjs(createdAt);
  this.userId = userId;
  this.totalCards = totalCards;
  this.outcome = outcome;
}

function initialCards(id, gameId, cardId) {
  this.id = id;
  this.gameId = gameId;
  this.cardId = cardId;
}

function Round(id, gameId, cardId, won, roundNumber) {
  this.id = id;
  this.gameId = gameId;
  this.cardId = cardId;
  this.won = won;
  this.roundNumber = roundNumber;
}

function User(id, username, password) {
  this.id = id;
  this.username = username;
  this.password = password;
}

export { Card, Game, initialCards, Round, User };
