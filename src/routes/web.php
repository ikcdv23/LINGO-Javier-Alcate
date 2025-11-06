<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PalabraController;
use App\Http\Controllers\PartidaController; // <-- ¡Importa el nuevo controlador!

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

// --- RUTAS DE PALABRAS ---
Route::get('/palabras', [PalabraController::class, 'index'])->name('palabras.index');
Route::get('/palabrasStyled', [PalabraController::class, 'indexStyled'])->name('palabras.indexStyled');
Route::get('/palabrasBlade', [PalabraController::class, 'indexBlade'])->name('palabras.indexBlade');
Route::get('/palabrasRandom/{cantidad?}', [PalabraController::class, 'indexRandom'])->name('palabras.indexRandomw');

// --- RUTA API PARA VERIFICAR PALABRA ---
Route::get('/verificarPalabra/{palabra}', [PalabraController::class, 'verificarPalabra'])
    ->middleware(['auth', 'verified'])
    ->name('palabras.verificarPalabra');

// --- RUTAS DEL RANKING Y PARTIDAS ---
Route::get('/ranking', [PartidaController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('ranking.index');

Route::post('/partidas', [PartidaController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('partidas.store');

// --- RUTAS DE AUTENTICACIÓN (De Breeze) ---
require __DIR__.'/auth.php';