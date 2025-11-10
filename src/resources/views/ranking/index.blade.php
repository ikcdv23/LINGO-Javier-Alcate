<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ranking de Jugadores</title>
    <style>
        body { font-family: sans-serif; padding: 20px; background-color: #f4f4f4; }
        h1 { text-align: center; }
        ol { max-width: 500px; margin: 20px auto; padding: 0; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        li { display: flex; justify-content: space-between; padding: 15px 20px; border-bottom: 1px solid #eee; }
        li:last-child { border-bottom: none; }
        li span { font-weight: bold; }
    </style>
</head>
<body>

    <h1>TOP 10 histórico</h1>

    <ol>
        @forelse ($ranking as $index => $jugador)
            <li>
                <span>#{{ $index + 1 }} - {{ $jugador->name }}</span>
                <span>{{ $jugador->max_streak }} victorias</span>
            </li>
        @empty
            <li>
                <span>Aún no hay nadie en el ranking. ¡Sé el primero!</span>
            </li>
        @endforelse
    </ol>

    <p style="text-align: center;">
        <a href="{{ route('dashboard') }}">Volver al juego</a>
    </p>

</body>
</html>