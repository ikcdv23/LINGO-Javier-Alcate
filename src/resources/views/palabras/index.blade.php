<!DOCTYPE html>
<html>

<head>
    <title>Lista de Palabras</title>
</head>
<style>
    body {
        font-family: sans-serif;
        padding: 20px;
        background-color: #f4f4f4;
    }

    h1 {
        text-align: center;
    }

    ol {
        max-width: 500px;
        margin: 20px auto;
        padding: 0;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    li {
        display: flex;
        justify-content: space-between;
        padding: 15px 20px;
        border-bottom: 1px solid #eee;
    }

    li:last-child {
        border-bottom: none;
    }

    li span {
        font-weight: bold;
    }
</style>

<body>
    <h1>Palabras del Diccionario</h1>
    <ul>
        @foreach ($palabras as $palabra)
            <li>{{ $palabra->palabra }}</li>
        @endforeach
    </ul>
</body>

</html>