<?php

use App\Http\Controllers\Api\ActualiteController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\InscriptionController;
use App\Http\Controllers\Api\JeuController;
use App\Http\Controllers\Api\JoueurController;
use App\Http\Controllers\Api\LieuController;
use App\Http\Controllers\Api\RecompenseController;
use App\Http\Controllers\Api\TournoiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Z Geek Arena
|--------------------------------------------------------------------------
*/

// ═══════════════════════════════════════════
// ROUTES PUBLIQUES (pas besoin de token)
// ═══════════════════════════════════════════
Route::post('auth/login', [AuthController::class, 'login']);

// Lecture seule — accessibles par le frontoffice
Route::get('events', [EventController::class, 'index']);
Route::get('events/{slug}', [EventController::class, 'show']);
Route::get('jeux', [JeuController::class, 'index']);
Route::get('jeux/{jeu}', [JeuController::class, 'show']);
Route::get('tournois', [TournoiController::class, 'index']);
Route::get('tournois/{tournoi}', [TournoiController::class, 'show']);
Route::get('actualites', [ActualiteController::class, 'index']);
Route::get('actualites/{slug}', [ActualiteController::class, 'show']);
Route::get('lieux', [LieuController::class, 'index']);
Route::get('recompenses', [RecompenseController::class, 'index']);
Route::get('recompenses/{categorie}', [RecompenseController::class, 'show']);

// Inscription joueur depuis le frontoffice (publique)
Route::post('joueurs', [JoueurController::class, 'store']);
Route::post('inscriptions', [InscriptionController::class, 'store']);
Route::post('recompenses/vote', [RecompenseController::class, 'vote']);


// ═══════════════════════════════════════════
// ROUTES PROTÉGÉES (token Sanctum requis)
// ═══════════════════════════════════════════
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::get('auth/me', [AuthController::class, 'me']);
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::post('auth/register', [AuthController::class, 'register']);

    // CRUD complet — Events
    Route::post('events', [EventController::class, 'store']);
    Route::put('events/{event}', [EventController::class, 'update']);
    Route::delete('events/{event}', [EventController::class, 'destroy']);

    // CRUD complet — Jeux (avec upload image)
    Route::post('jeux', [JeuController::class, 'store']);
    Route::post('jeux/{jeu}', [JeuController::class, 'update']); // POST pour multipart/form-data
    Route::delete('jeux/{jeu}', [JeuController::class, 'destroy']);

    // CRUD complet — Tournois
    Route::post('tournois', [TournoiController::class, 'store']);
    Route::put('tournois/{tournoi}', [TournoiController::class, 'update']);
    Route::delete('tournois/{tournoi}', [TournoiController::class, 'destroy']);

    // CRUD complet — Actualités
    Route::post('actualites', [ActualiteController::class, 'store']);
    Route::put('actualites/{actualite}', [ActualiteController::class, 'update']);
    Route::delete('actualites/{actualite}', [ActualiteController::class, 'destroy']);

    // CRUD complet — Lieux
    Route::post('lieux', [LieuController::class, 'store']);
    Route::put('lieux/{lieu}', [LieuController::class, 'update']);
    Route::delete('lieux/{lieu}', [LieuController::class, 'destroy']);

    // CRUD — Joueurs (admin)
    Route::get('joueurs', [JoueurController::class, 'index']);
    Route::get('joueurs/{joueur}', [JoueurController::class, 'show']);
    Route::put('joueurs/{joueur}', [JoueurController::class, 'update']);
    Route::delete('joueurs/{joueur}', [JoueurController::class, 'destroy']);

    // Inscriptions (admin)
    Route::get('inscriptions', [InscriptionController::class, 'index']);
    Route::put('inscriptions/{inscription}', [InscriptionController::class, 'update']);
    Route::delete('inscriptions/{inscription}', [InscriptionController::class, 'destroy']);
});
