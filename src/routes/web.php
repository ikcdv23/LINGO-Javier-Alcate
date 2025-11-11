<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PalabraController;
use App\Http\Controllers\PartidaController; // <-- Asegúrate de importar PartidaController

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// --- RUTA DE INICIO ---
Route::get('/', function () {
    return view('lingo.welcome');
});

// --- RUTAS DEL DASHBOARD (De Breeze) ---
Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// --- RUTAS DE PROFILE (De Breeze) ---
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// --- RUTAS DE PRUEBA DE PALABRAS ---
Route::get('/palabras', [PalabraController::class, 'index'])->name('palabras.index');
Route::get('/palabrasRandom/{cantidad?}', [PalabraController::class, 'indexRandom'])->name('palabras.indexRandomw');

// --- RUTA API PARA VERIFICAR PALABRA ---
Route::get('/verificarPalabra/{palabra}', [PalabraController::class, 'verificarPalabra'])
    ->middleware(['auth', 'verified'])
    ->name('palabras.verificarPalabra');

// --- RUTA DEL RANKING GLOBAL ---
Route::get('/ranking', [PartidaController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('ranking.index');


// !! ----- RUTAS CORREGIDAS  ----- !!

// 1. Ruta para GUARDAR partida (Tu JS llama a '/partidas')
Route::post('/partidas', [PartidaController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('partidas.store');

// 2. Ruta para CARGAR estadísticas (Tu JS llama a '/api/user-stats')
Route::get('/api/user-stats', [PartidaController::class, 'getUserStats'])
    ->middleware(['auth', 'verified'])
    ->name('api.user-stats');

// !! ----------------------------------------------- !!


// --- RUTAS DE AUTENTICACIÓN (De Breeze) ---
require __DIR__.'/auth.php';