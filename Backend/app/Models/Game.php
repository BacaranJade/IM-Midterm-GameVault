<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Game extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'genre',
        'platform',
        'developer',
        'release_year',
        'rating',
        'status',
        'cover_url',
        'description',
        'user_id', // Added user_id so mass assignment works
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'release_year' => 'integer',
        'rating' => 'float',
    ];

    public const STATUSES = ['wishlist', 'playing', 'completed', 'backlog'];

    /**
     * Get the user that owns the game.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}