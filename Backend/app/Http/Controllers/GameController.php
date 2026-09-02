<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGameRequest;
use App\Http\Requests\UpdateGameRequest;
use App\Models\Game;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GameController extends Controller
{
    /**
     * Display a listing of the games, with optional filtering.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Game::query();

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('developer', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($genre = $request->query('genre')) {
            $query->where('genre', $genre);
        }

        if ($platform = $request->query('platform')) {
            $query->where('platform', $platform);
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($request->query('sort') === 'rating') {
            $query->orderByDesc('rating');
        } else {
            $query->orderBy('title');
        }

        $games = $query->get();

        return response()->json([
            'data' => $games,
            'counts' => [
                'total' => Game::count(),
                'completed' => Game::where('status', 'completed')->count(),
                'playing' => Game::where('status', 'playing')->count(),
                'wishlist' => Game::where('status', 'wishlist')->count(),
                'backlog' => Game::where('status', 'backlog')->count(),
            ],
        ]);
    }

    /**
     * Store a newly created game.
     */
    public function store(StoreGameRequest $request): JsonResponse
    {
        $game = Game::create($request->validated());

        return response()->json($game, 201);
    }

    /**
     * Display the specified game.
     */
    public function show(Game $game): JsonResponse
    {
        return response()->json($game);
    }

    /**
     * Update the specified game.
     */
    public function update(UpdateGameRequest $request, Game $game): JsonResponse
    {
        $game->update($request->validated());

        return response()->json($game);
    }

    /**
     * Remove the specified game from storage.
     */
    public function destroy(Game $game): JsonResponse
    {
        $game->delete();

        return response()->json(null, 204);
    }
}