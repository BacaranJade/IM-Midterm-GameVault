<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGameRequest;
use App\Http\Requests\UpdateGameRequest;
use App\Models\Game;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class GameController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        // Scope queries exclusively to the authenticated user's games
        $query = $request->user()->games();

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
                'total' => $request->user()->games()->count(),
                'completed' => $request->user()->games()->where('status', 'completed')->count(),
                'playing' => $request->user()->games()->where('status', 'playing')->count(),
                'wishlist' => $request->user()->games()->where('status', 'wishlist')->count(),
                'backlog' => $request->user()->games()->where('status', 'backlog')->count(),
            ],
        ]);
    }

    public function store(StoreGameRequest $request): JsonResponse
    {
        $data = $request->validated();

        // 1. Direct File Upload (multipart/form-data)
        if ($request->hasFile('cover')) {
            $path = $request->file('cover')->store('games', 'public');
            $data['cover_url'] = asset('storage/' . $path);
        } 
        // 2. URL Link Fallback (JSON/URL download)
        elseif (!empty($data['cover_url'])) {
            $data['cover_url'] = $this->downloadCover(
                $data['cover_url'],
                $data['title']
            );
        }

        // Automatically associate the game with the authenticated user
        $game = $request->user()->games()->create($data);

        return response()->json($game, 201);
    }

    public function show(Request $request, Game $game): JsonResponse
    {
        // Ensure user can only view their own game
        if ($game->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($game);
    }

    public function update(
        UpdateGameRequest $request,
        Game $game
    ): JsonResponse {
        // Ensure user can only update their own game
        if ($game->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validated();
        $oldCover = $game->cover_url;

        // 1. Direct File Upload
        if ($request->hasFile('cover')) {
            $path = $request->file('cover')->store('games', 'public');
            $data['cover_url'] = asset('storage/' . $path);

            $this->deleteOldLocalCover($oldCover);
        } 
        // 2. URL Link Fallback
        elseif (!empty($data['cover_url'])) {
            $newCover = $this->downloadCover(
                $data['cover_url'],
                $data['title'] ?? $game->title
            );

            $data['cover_url'] = $newCover;

            if ($newCover !== $oldCover) {
                $this->deleteOldLocalCover($oldCover);
            }
        }

        $game->update($data);

        return response()->json($game);
    }

    public function destroy(Request $request, Game $game): JsonResponse
    {
        // Ensure user can only delete their own game
        if ($game->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $this->deleteOldLocalCover($game->cover_url);

        $game->delete();

        return response()->json(null, 204);
    }

    /**
     * Helper to safely remove an old image from local storage.
     */
    private function deleteOldLocalCover(?string $oldCover): void
    {
        if ($oldCover && Str::contains($oldCover, '/storage/games/')) {
            $oldPath = 'games/' . Str::after($oldCover, '/storage/games/');
            Storage::disk('public')->delete($oldPath);
        }
    }

    /**
     * Download an external cover image and save it locally.
     */
    private function downloadCover(
        string $imageUrl,
        string $title
    ): string {
        // Already a local image
        if (Str::contains($imageUrl, '/storage/games/')) {
            return $imageUrl;
        }

        if (!filter_var($imageUrl, FILTER_VALIDATE_URL)) {
            return $imageUrl;
        }

        try {
            $response = Http::timeout(30)
                ->withHeaders([
                    'User-Agent' => 'Mozilla/5.0',
                    'Accept' => 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                ])
                ->get($imageUrl);

            if (!$response->successful()) {
                Log::error('GameVault image download failed', [
                    'url' => $imageUrl,
                    'status' => $response->status(),
                ]);

                return $imageUrl;
            }

            $contentType = strtolower(
                explode(';', $response->header('Content-Type', ''))[0]
            );

            $extension = match ($contentType) {
                'image/jpeg', 'image/jpg' => 'jpg',
                'image/png' => 'png',
                'image/webp' => 'webp',
                'image/gif' => 'gif',
                'image/avif' => 'avif',
                default => null,
            };

            if (!$extension) {
                $urlPath = parse_url($imageUrl, PHP_URL_PATH);
                $urlExtension = strtolower(
                    pathinfo($urlPath ?? '', PATHINFO_EXTENSION)
                );

                $extension = match ($urlExtension) {
                    'jpg', 'jpeg' => 'jpg',
                    'png' => 'png',
                    'webp' => 'webp',
                    'gif' => 'gif',
                    'avif' => 'avif',
                    default => null,
                };
            }

            if (!$extension) {
                Log::error('GameVault could not determine image type', [
                    'url' => $imageUrl,
                    'content_type' => $contentType,
                ]);

                return $imageUrl;
            }

            $filename = Str::slug($title)
                . '-' . Str::random(8)
                . '.' . $extension;

            Storage::disk('public')->put(
                'games/' . $filename,
                $response->body()
            );

            Log::info('GameVault image downloaded', [
                'url' => $imageUrl,
                'file' => $filename,
            ]);

            return asset('storage/games/' . $filename);

        } catch (\Throwable $e) {
            Log::error('GameVault image download exception', [
                'url' => $imageUrl,
                'error' => $e->getMessage(),
            ]);

            return $imageUrl;
        }
    }
}