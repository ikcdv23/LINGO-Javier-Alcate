<?php

namespace App\Http\Controllers;


use App\Models\Partida;
use App\Models\User; // Importante para poder actualizar el ranking
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Para saber qué usuario está jugando

class PartidaController extends Controller
{
    /**
     * Muestra la página de ranking.
     * Coge a todos los usuarios ordenados por su mejor racha.
     */
    public function index()
    {
        $ranking = User::orderBy('max_streak', 'desc') // Ordena por la racha más alta
            ->take(10) // Coge solo los 10 mejores
            ->get(['name', 'max_streak']); // Selecciona solo el nombre y la racha

        // Devolvemos una vista de ranking (que crearemos luego)
        // y le pasamos los datos del ranking
        return view('ranking.index', ['ranking' => $ranking]);
    }

    /**
     * Guarda el resultado de una nueva partida.
     * Esta es la lógica clave de tu ranking.
     */
    public function store(Request $request)
    {
        // 1. Validamos los datos que nos envía el juego (DWC)
        // Solo necesitamos saber si ha ganado (true/false)
        $request->validate([
            'ganada' => 'required|boolean',
            'palabra_secreta' => 'required|string', // La palabra que se jugó
        ]);

        // 2. Obtenemos al usuario que está logueado
        $user = Auth::user();

        // 3. Creamos la entrada en la tabla 'partidas'
        Partida::create([
            'user_id' => $user->id,
            'ganada' => $request->ganada,
            'palabra_secreta' => $request->palabra_secreta,
        ]);

        // 4. Actualizamos las rachas del usuario
        if ($request->ganada) {
            // El jugador ha ganado
            $user->current_streak += 1; // Aumentamos su racha actual

            // Comprobamos si su racha actual es ahora su nueva mejor racha
            if ($user->current_streak > $user->max_streak) {
                $user->max_streak = $user->current_streak;
            }
        } else {
            // El jugador ha perdido, reseteamos su racha actual
            $user->current_streak = 0;
        }

        // 5. Guardamos los cambios en la tabla 'users'
        $user->save();

        // 6. Devolvemos una respuesta JSON al juego
        return response()->json([
            'message' => 'Partida guardada con éxito',
            'current_streak' => $user->current_streak,
            'max_streak' => $user->max_streak,
        ]);
    }
    /**
     * Obtiene las estadísticas personales del usuario autenticado.
     * (Esta es la PARTE B de nuestro plan)
     */
    public function getUserStats()
    {
        $user = Auth::user(); // Obtenemos al usuario logueado

        // 1. Obtenemos las rachas (que ya están en la tabla 'users')
        $rachaActual = $user->current_streak;
        $mejorRacha = $user->max_streak;

        // 2. Contamos las partidas (gracias a la relación que acabamos de crear)
        $partidasJugadas = $user->partidas()->count();
        $victorias = $user->partidas()->where('ganada', true)->count();

        // 3. Calculamos el porcentaje
        $porcentajeVictorias = ($partidasJugadas > 0) ? round(($victorias / $partidasJugadas) * 100) : 0;

        // 4. Devolvemos todo como JSON
        return response()->json([
            'username' => $user->name,
            'partidas_jugadas' => $partidasJugadas,
            'victorias' => $victorias,
            'porcentaje_victorias' => $porcentajeVictorias,
            'racha_actual' => $rachaActual,
            'mejor_racha' => $mejorRacha,
        ]);
    }

    public function create()
    {
    }
    public function show(Partida $partida)
    {
    }
    public function edit(Partida $partida)
    {
    }
    public function update(Request $request, Partida $partida)
    {
    }
    public function destroy(Partida $partida)
    {
    }
}