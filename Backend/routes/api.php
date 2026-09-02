<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and assigned to the "api"
| middleware group. Enjoy building your API!
|
*/

Route::get('/games', [\App\Http\Controllers\GameController::class, 'index']);
Route::get('/games/{game}', [\App\Http\Controllers\GameController::class, 'show']);
Route::post('/games', [\App\Http\Controllers\GameController::class, 'store']);
Route::put('/games/{game}', [\App\Http\Controllers\GameController::class, 'update']);
Route::delete('/games/{game}', [\App\Http\Controllers\GameController::class, 'destroy']);