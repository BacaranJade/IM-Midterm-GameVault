# GameVault

A full-stack game collection manager built with **React (Vite)** frontend, **Laravel** REST API backend, and **MySQL** run via **Docker Compose**.

```
┌─────────────────────────┐
│       React.js          │
│       Frontend          │  → Dashboard, Game Library, Add/Edit Game,
└────────────┬────────────┘    Game Details
             │
          REST API
             │
             ▼
┌─────────────────────────┐
│       Laravel           │  → Routes, Controllers, Models, Validation
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│        MySQL (Docker)   │
└─────────────────────────┘
```

## Requirements

- Docker + Docker Compose
- (Optional, for local dev) Node 18+, PHP 8.1+, Composer

## Quick start (Docker)

```bash
docker-compose up --build
```

Then:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api

Run migrations + seed sample data:

```bash
docker exec -it gamevault_backend php artisan migrate --seed
```

Seed again to restore the sample dataset:

```bash
docker exec -it gamevault_backend php artisan db:seed
```

## Run locally (no Docker)

Backend:

```bash
cd Backend
composer install
copy .env.example .env   # or: cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Frontend (in a separate terminal):

```bash
cd Frontend
npm install
npm run dev
```

> Requires a MySQL database named `gamevault` (user/pass `gamevault`/`gamevault`),
> or edit `Backend/.env` to match your local MySQL. Alternatively set
> `DB_CONNECTION=sqlite` and create `Backend/database/database.sqlite` for a
> zero-setup run.

## API reference

| Method | Endpoint            | Description                  |
| ------ | ------------------- | ---------------------------- |
| GET    | `/api/games`        | List games (search/filter)   |
| GET    | `/api/games/{id}`   | Show one game                |
| POST   | `/api/games`        | Create a game                |
| PUT    | `/api/games/{id}`   | Update a game                |
| DELETE | `/api/games/{id}`   | Delete a game                |

`GET /api/games` supports query params: `search`, `genre`, `platform`, `status`, `sort` (`rating` or `title`).

### Example game payload

```json
{
  "title": "Elden Ring",
  "genre": "RPG",
  "platform": "PC",
  "developer": "FromSoftware",
  "release_year": 2022,
  "rating": 4.9,
  "status": "completed",
  "cover_url": "https://example.com/cover.jpg",
  "description": "A sprawling dark fantasy action RPG."
}
```

### Valid values

- `genre`: any string (UI suggests: Action, RPG, FPS, Racing, Simulation, …)
- `platform`: any string (UI suggests: PC, PlayStation 5, Xbox Series X, …)
- `status`: `wishlist | playing | completed | backlog`
- `rating`: 0.0 – 5.0
- `release_year`: 1950 – 2100

## CRUD flow

- **Create** → React form → `POST /api/games` → Laravel → MySQL
- **Read** → `GET /api/games` → Laravel → MySQL → Game Cards
- **Update** → Edit form → `PUT /api/games/{id}`
- **Delete** → Confirmation modal → `DELETE /api/games/{id}`

## Project structure

```
gamevault/
├── Backend/                  # Laravel 10 API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/GameController.php
│   │   │   └── Requests/StoreGameRequest.php, UpdateGameRequest.php
│   │   ├── Models/Game.php
│   │   └── Providers/
│   ├── config/
│   ├── database/
│   │   ├── migrations/2026_09_02_000001_create_games_table.php
│   │   └── seeders/DatabaseSeeder.php
│   ├── routes/
│   │   ├── api.php
│   │   └── web.php
│   └── Dockerfile
│
├── Frontend/                 # React (Vite) SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── GameCard.jsx
│   │   │   ├── GameForm.jsx
│   │   │   └── DeleteModal.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Games.jsx
│   │   │   ├── AddGame.jsx
│   │   │   ├── EditGame.jsx
│   │   │   └── GameDetails.jsx
│   │   ├── services/gameApi.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── Dockerfile
│
├── docker-compose.yml        # MySQL + Backend + Frontend
└── README.md
```