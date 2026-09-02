<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('genre');
            $table->string('platform');
            $table->string('developer')->nullable();
            $table->unsignedInteger('release_year')->nullable();
            $table->decimal('rating', 3, 1)->default(0);
            $table->enum('status', ['wishlist', 'playing', 'completed', 'backlog'])->default('wishlist');
            $table->string('cover_url')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};
