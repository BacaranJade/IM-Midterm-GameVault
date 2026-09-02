<?php

namespace Database\Seeders;

use App\Models\Game;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with sample games.
     */
    public function run(): void
    {
        Game::query()->delete();

        $games = [
            [
                'title' => 'Grand Theft Auto V',
                'genre' => 'Action',
                'platform' => 'PC',
                'developer' => 'Rockstar North',
                'release_year' => 2013,
                'rating' => 4.7,
                'status' => 'playing',
                'description' => 'An open-world action adventure set in the fictional state of San Andreas.',
            ],
            [
                'title' => 'Elden Ring',
                'genre' => 'RPG',
                'platform' => 'PC',
                'developer' => 'FromSoftware',
                'release_year' => 2022,
                'rating' => 4.9,
                'status' => 'completed',
                'description' => 'A sprawling dark fantasy action RPG in the Lands Between.',
            ],
            [
                'title' => 'Valorant',
                'genre' => 'FPS',
                'platform' => 'PC',
                'developer' => 'Riot Games',
                'release_year' => 2020,
                'rating' => 4.2,
                'status' => 'playing',
                'description' => 'A tactical 5v5 hero shooter where precise aim and team play matter.',
            ],
            [
                'title' => 'The Witcher 3: Wild Hunt',
                'genre' => 'RPG',
                'platform' => 'PlayStation 5',
                'developer' => 'CD Projekt Red',
                'release_year' => 2015,
                'rating' => 4.9,
                'status' => 'completed',
                'description' => 'An epic story-driven RPG following monster hunter Geralt of Rivia.',
            ],
            [
                'title' => 'Hollow Knight',
                'genre' => 'Metroidvania',
                'platform' => 'PC',
                'developer' => 'Team Cherry',
                'release_year' => 2017,
                'rating' => 4.6,
                'status' => 'completed',
                'description' => 'A hand-drawn action adventure through a haunted insect kingdom.',
            ],
            [
                'title' => 'Cyberpunk 2077',
                'genre' => 'RPG',
                'platform' => 'PC',
                'developer' => 'CD Projekt Red',
                'release_year' => 2020,
                'rating' => 4.0,
                'status' => 'backlog',
                'description' => 'An open-world RPG in the neon-lit metropolis of Night City.',
            ],
            [
                'title' => 'Hades II',
                'genre' => 'Roguelike',
                'platform' => 'PC',
                'developer' => 'Supergiant Games',
                'release_year' => 2026,
                'rating' => 4.8,
                'status' => 'wishlist',
                'description' => 'The sequel to the acclaimed roguelike myth of the underworld.',
            ],
            [
                'title' => 'Ghost of Tsushima',
                'genre' => 'Action',
                'platform' => 'PlayStation 5',
                'developer' => 'Sucker Punch Productions',
                'release_year' => 2020,
                'rating' => 4.7,
                'status' => 'wishlist',
                'description' => 'An open-world samurai epic set on feudal Tsushima island.',
            ],
            [
                'title' => 'Mario Kart 8 Deluxe',
                'genre' => 'Racing',
                'platform' => 'Nintendo Switch',
                'developer' => 'Nintendo',
                'release_year' => 2017,
                'rating' => 4.5,
                'status' => 'completed',
                'description' => 'The definitive kart racing party game.',
            ],
            [
                'title' => 'Baldur\'s Gate 3',
                'genre' => 'RPG',
                'platform' => 'PC',
                'developer' => 'Larian Studios',
                'release_year' => 2023,
                'rating' => 5.0,
                'status' => 'backlog',
                'description' => 'A deep D&D-based turn-based RPG with boundless choices.',
            ],
            [
                'title' => 'DOOM Eternal',
                'genre' => 'FPS',
                'platform' => 'PC',
                'developer' => 'id Software',
                'release_year' => 2020,
                'rating' => 4.4,
                'status' => 'completed',
                'description' => 'A relentless, fast-paced shooter against hell\'s armies.',
            ],
            [
                'title' => 'Stardew Valley 2',
                'genre' => 'Simulation',
                'platform' => 'PC',
                'developer' => 'ConcernedApe',
                'release_year' => 2026,
                'rating' => 0,
                'status' => 'wishlist',
                'description' => 'The eagerly awaited sequel to the beloved farming sim.',
            ],
        ];

        foreach ($games as $game) {
            Game::create($game);
        }
    }
}