[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/uNTgnFHD)

# Exam #1: "Gioco della Sfortuna"

## Student: s347492 Mozzicato Riccardo

## React Client Application Routes

- Route `/` — Homepage
- Route `/new-game` — Nuova partita
  - Sub-route `/new-game/recap` — Riepilogo partita
- Route `/match-history` — Cronologia partite
  -Route \* - Pagine non trovate (404)

## API Server

- POST `/api/users` — Crea un nuovo utente
- GET `/api/users` — Lista tutti gli utenti

- GET `/api/cards` — Lista tutte le carte
- GET `/api/cards/:id` — Dettaglio carta

- GET `/api/start-game` — Avvia una nuova partita (ritorna carte iniziali e roundCards)
- GET `/api/games/:username` — Tutte le partite di un utente (autenticato)
- PATCH `/api/games/:gameId` — Aggiorna esito partita
- DELETE `/api/games/:gameId` — Elimina una partita

- POST `/api/initial-cards/` — Salva carte iniziali (solo loggati)

- POST `/api/rounds/` — Crea un round
- GET `/api/rounds/:gameId` — Tutti i round di una partita (autenticato)
- PATCH `/api/rounds/:roundId` — Aggiorna round con esito

- POST `/api/sessions` — Login utente
- GET `/api/sessions/current` — Info utente loggato
- DELETE `/api/sessions/current` — Logout

## API Server Endpoints

### USER

- **POST** `/api/users` — Crea un nuovo utente
  - Body: `{ username, password }`
  - Response: `{ id }`
- **GET** `/api/users` — Lista tutti gli utenti
  - Response: `[ ...users ]`

### SESSION (AUTH)

- **POST** `/api/sessions` — Login utente

  - Body: `{ username, password }`
  - Response: 201 Ok (login riuscito), 401 Not authorized (login fallito)

- **GET** `/api/sessions/current` — Info utente loggato

  - Response: 200 Ok, 401 Not authenticated
  - Response: `{ username, password }`

- **DELETE** `/api/sessions/current` — Logout
  - Response: 200 Ok

### CARDS

- **GET** `/api/cards` — Lista tutte le carte
  - Response: 200 Ok, 404 NotFound, 500 InternalServerError
  - Response: `[ { id, name, url, misfortune_index, theme }, ... ]`
- **GET** `/api/cards/:id` — Dettaglio carta
  - Response: 200 Ok, 404 NotFound, 500 InternalServerError
  - Response: `{ id, name, url, misfortune_index, theme }`

### GAME

- **GET** `/api/start-game` — Avvia una nuova partita (ritorna carte iniziali e roundCards)
  - Response: 201 Ok, 503 FailedToCreate
  - Response: `{ gameId, initialCards: [{id, ...}], roundCards: [{id, name, url, theme}] }`
- **GET** `/api/games/:username` — Tutte le partite di un utente (autenticato)
  - Response: 200 Ok, 404 NotFound, 503 FailedToRetrieve
  - Response: `[ { id, createdAt, totalCards, outcome, initialCards: [{name}], rounds: [{won, roundNumber, name}] }, ... ]`
- **PATCH** `/api/games/:gameId` — Aggiorna esito partita
  - Body: `{ outcome, totalCards }`
  - Response: 200 Ok, 503 FailedToUpdate
- **DELETE** `/api/games/:gameId` — Elimina una partita
  - Response: 204 Ok, 503 FailedToDelete

### INITIAL CARDS

- **POST** `/api/initial-cards/` — Salva carte iniziali (solo loggati)
  - Body: `{ gameId, cardIds }`
  - Response: 201 Ok, 422 InvalidInput, 503 FailedToCreate

### ROUNDS

- **POST** `/api/rounds/` — Crea un round
  - Body: `{ gameId, cardId, won, roundNumber }`
  - Response: `{ id }`
- **GET** `/api/rounds/:gameId` — Tutti i round di una partita (autenticato)
  - Response: 200 Ok, 422 InvalidInput, 503 FailedToCreate
  - Response: `[ ...rounds ]`
- **PATCH** `/api/rounds/:roundId` — Aggiorna round con esito
  - Body: `{ misfortuneLeft, misfortuneRight, cardId, timeStamp }`
  - Response: `{ misfortune_index, won }`

## Database Tables

- **User**

  - `id` (INTEGER, PRIMARY KEY)
  - `username` (TEXT, UNIQUE, NOT NULL)
  - `password` (TEXT, NOT NULL)
  - `salt` (TEXT, NOT NULL)

- **Card**

  - `id` (INTEGER, PRIMARY KEY)
  - `name` (TEXT, UNIQUE, NOT NULL)
  - `url` (TEXT, NOT NULL)
  - `misfortune_index` (NUMERIC, UNIQUE, NOT NULL)
  - `theme` (TEXT)

- **Game**

  - `id` (INTEGER, PRIMARY KEY)
  - `createdAt` (TEXT, NOT NULL)
  - `userId` (INTEGER, FOREIGN KEY User(id) ON DELETE CASCADE)
  - `totalCards` (INTEGER)
  - `outcome` (INTEGER)

- **InitialCards**

  - `id` (INTEGER, PRIMARY KEY)
  - `gameId` (INTEGER, FOREIGN KEY Game(id) ON DELETE CASCADE)
  - `cardId` (INTEGER, FOREIGN KEY Card(id) ON DELETE CASCADE)

- **Round**
  - `id` (INTEGER, PRIMARY KEY)
  - `gameId` (INTEGER, FOREIGN KEY Game(id))
  - `cardId` (INTEGER, FOREIGN KEY Card(id))
  - `won` (INTEGER, NOT NULL)
  - `roundNumber` (INTEGER, NOT NULL)
  - `timeStamp` (INTEGER, NOT NULL DEAFULT 0)

## Main React Components

- `Homepage` (in `Homepage.jsx`): mostra la pagina principale con regole, introduzione e pulsante per iniziare una nuova partita. Gestisce l’avvio e l’inizializzazione dello stato di gioco.
- `MatchHistory` (in `MatchHistory.jsx`): visualizza la cronologia delle partite dell’utente autenticato, con dettagli e modal per ogni partita.
- `NewGame` (in `GameComponents/NewGame.jsx`): gestisce la logica della partita in corso, mostra la carta in palio, il timer, lo stato del round, aggiorna la progressione e interagisce con l’API.
- `Recap` (in `GameComponents/Recap.jsx`): mostra il riepilogo della partita conclusa (vittoria/sconfitta, carte totali, round persi) e permette di iniziare una nuova partita.
- `CardList` (in `GameComponents/CardList.jsx`): visualizza le carte nella mano del giocatore e permette il confronto tra le carte nei round.
- `Cards` (in `GameComponents/Cards.jsx`): rappresenta graficamente una singola carta, con nome, immagine e misfortune index, e i pulsanti di confronto.
- `RoundState` (in `GameComponents/RoundState.jsx`): mostra il risultato del round e permette di passare al round successivo o terminare la partita.
- `Timer` (in `GameComponents/Timer.jsx`): visualizza il timer e la barra di avanzamento per ogni round, segnalando la fine del tempo.

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

alice123 - ciao - hash: d07941520e85885bfdba3834487f290f - salt : 96b3a500b8c798ff
alfio123 - ciao - hash: aff801282d11c38f24d043e959c7d357 - salt : 6fc80d436e6d6941
