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

    public function store(StoreGameRequest $request): JsonResponse
    {
        $data = $request->validated();

        if (!empty($data['cover_url'])) {
            $data['cover_url'] = $this->downloadCover(
                $data['cover_url'],
                $data['title']
            );
        }

        $game = Game::create($data);

        return response()->json($game, 201);
    }

    public function show(Game $game): JsonResponse
    {
        return response()->json($game);
    }

    public function update(
        UpdateGameRequest $request,
        Game $game
    ): JsonResponse {
        $data = $request->validated();

        if (!empty($data['cover_url'])) {
            $oldCover = $game->cover_url;

            $newCover = $this->downloadCover(
                $data['cover_url'],
                $data['title'] ?? $game->title
            );

            $data['cover_url'] = $newCover;

            // Delete old local image after successful replacement
            if (
                $newCover !== $oldCover &&
                $oldCover &&
                Str::startsWith($oldCover, '/storage/games/')
            ) {
                $oldPath = Str::after($oldCover, '/storage/');
                Storage::disk('public')->delete($oldPath);
            }
        }

        $game->update($data);

        return response()->json($game);
    }

    public function destroy(Game $game): JsonResponse
    {
        if (
            $game->cover_url &&
            Str::startsWith($game->cover_url, '/storage/games/')
        ) {
            $path = Str::after($game->cover_url, '/storage/');
            Storage::disk('public')->delete($path);
        }

        $game->delete();

        return response()->json(null, 204);
    }

    /**
     * Download an external cover image and save it locally.
     */
    private function downloadCover(
        string $imageUrl,
        string $title
    ): string {
        // Already a local image
        if (Str::startsWith($imageUrl, '/storage/games/')) {
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

            /*
             * Some image servers don't return a proper Content-Type.
             * Try to determine the extension from the URL instead.
             */
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

            return '/storage/games/' . $filename;

        } catch (\Throwable $e) {
            Log::error('GameVault image download exception', [
                'url' => $imageUrl,
                'error' => $e->getMessage(),
            ]);

            return $imageUrl;
        }
    }
}