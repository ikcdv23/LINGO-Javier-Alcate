<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Lingo') }}</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <style>
        /* ======================================= */
        /* 0. CONFIGURACIÓN GLOBAL Y RESET BÁSICO  */
        /* ======================================= */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: "Instrument Sans", sans-serif;
            background: linear-gradient(135deg, #e9f9fb 0%, #c0f1f6 100%);
            color: #1b1f22;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
        }

        /* ======================================= */
        /* 1. CABECERA (HEADER y NAV)              */
        /* ======================================= */
        header {
            width: 100%;
            max-width: 1200px;
            text-align: center;
            background: rgba(255, 255, 255, 0.8);
            padding: 15px 20px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            margin-bottom: 30px;
            backdrop-filter: blur(10px);
        }

        header div {
            display: flex;
            align-items: center;
            flex-direction: row;
            justify-content: space-between;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .logo h1 {
            font-size: 2.2rem;
            font-weight: 700;
            color: #138d97;
            letter-spacing: 1px;
            text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
        }

        .logo-icon {
            font-size: 2rem;
            color: #138d97;
        }

        nav {
            display: flex;
            justify-content: center;
            gap: 1rem;
        }

        .nav-btn {
            background: none;
            border: 2px solid #138d97;
            border-radius: 6px;
            padding: 0.5rem 1.2rem;
            color: #138d97;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            text-decoration: none;
            display: inline-block;
        }

        .nav-btn:hover {
            background: #138d97;
            color: white;
            transform: translateY(-2px);
        }

        /* ======================================= */
        /* 2. CONTENIDO PRINCIPAL                  */
        /* ======================================= */
        .hero {
            text-align: center;
            max-width: 800px;
            margin: 2rem auto;
            padding: 2rem;
        }

        .hero h1 {
            font-size: 3.5rem;
            font-weight: 700;
            color: #045b61;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .hero p {
            font-size: 1.3rem;
            color: #138d97;
            margin-bottom: 2rem;
            line-height: 1.6;
        }

        .cta-button {
            display: inline-block;
            background: #138d97;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 1rem 2.5rem;
            font-size: 1.2rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            box-shadow: 0 4px 15px rgba(19, 141, 151, 0.3);
        }

        .cta-button:hover {
            background: #045b61;
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(19, 141, 151, 0.4);
        }

        /* ======================================= */
        /* 3. DEMOSTRACIÓN DEL JUEGO               */
        /* ======================================= */
        .game-demo {
            background: white;
            border-radius: 16px;
            padding: 2rem;
            margin: 2rem auto;
            max-width: 500px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            border: 2px solid #c0f1f6;
        }

        .demo-title {
            text-align: center;
            color: #045b61;
            margin-bottom: 1.5rem;
            font-size: 1.5rem;
        }

        .demo-board {
            display: grid;
            grid-template-rows: repeat(3, 1fr);
            gap: 0.5rem;
            margin-bottom: 1.5rem;
        }

        .demo-row {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 0.5rem;
        }

        .demo-cell {
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            font-weight: 600;
            border: 2px solid #b8dce0;
            text-transform: uppercase;
            border-radius: 5px;
            background: white;
        }

        .demo-cell.correct {
            background-color: #2ecc71;
            color: white;
            border-color: #2ecc71;
        }

        .demo-cell.present {
            background-color: #f1c40f;
            color: white;
            border-color: #f1c40f;
        }

        .demo-cell.incorrect {
            background-color: #95a5a6;
            color: white;
            border-color: #95a5a6;
        }

        /* ======================================= */
        /* 4. CARACTERÍSTICAS                      */
        /* ======================================= */
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            max-width: 1000px;
            margin: 3rem auto;
            width: 100%;
        }

        .feature-card {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            border: 1px solid #c0f1f6;
            transition: transform 0.3s ease;
        }

        .feature-card:hover {
            transform: translateY(-5px);
        }

        .feature-icon {
            font-size: 2.5rem;
            color: #138d97;
            margin-bottom: 1rem;
        }

        .feature-card h3 {
            color: #045b61;
            margin-bottom: 0.5rem;
            font-size: 1.3rem;
        }

        .feature-card p {
            color: #5a7072;
            line-height: 1.5;
        }

        /* ======================================= */
        /* 5. FOOTER                               */
        /* ======================================= */
        footer {
            margin-top: auto;
            padding: 2rem;
            text-align: center;
            color: #5a7072;
            width: 100%;
        }

        /* ======================================= */
        /* 6. RESPONSIVE                           */
        /* ======================================= */
        @media (max-width: 768px) {
            header div {
                flex-direction: column;
                gap: 1rem;
            }
            
            .hero h1 {
                font-size: 2.5rem;
            }
            
            .hero p {
                font-size: 1.1rem;
            }
            
            .demo-cell {
                width: 40px;
                height: 40px;
                font-size: 1.2rem;
            }
            
            .features {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <header>
        <div>
            <div class="logo">
                <i class="fas fa-language logo-icon"></i>
                <h1>LINGO</h1>
            </div>
            @if (Route::has('login'))
                <nav>
                    @auth
                        <a href="{{ url('/dashboard') }}" class="nav-btn">
                            Dashboard
                        </a>
                    @else
                        <a href="{{ route('login') }}" class="nav-btn">
                            Iniciar Sesión
                        </a>
                        @if (Route::has('register'))
                            <a href="{{ route('register') }}" class="nav-btn">
                                Registrarse
                            </a>
                        @endif
                    @endauth
                </nav>
            @endif
        </div>
    </header>

    <main>
        <section class="hero">
            <h1>¡Bienvenido a LINGO!</h1>
            <p>El juego de palabras que desafía tu vocabulario y agilidad mental. <br>¿Podrás adivinar la palabra secreta en tiempo récord?</p>
            
            @auth
                <a href="{{ url('register') }}" class="cta-button">
                    <i class="fas fa-play"></i> Jugar Ahora
                </a>
            @else
                <a href="{{ route('register') }}" class="cta-button">
                    <i class="fas fa-user-plus"></i> Comenzar a Jugar
                </a>
            @endauth
        </section>

        <section class="game-demo">
            <h2 class="demo-title">Así se juega</h2>
            <div class="demo-board">
                <div class="demo-row">
                    <div class="demo-cell correct">L</div>
                    <div class="demo-cell">I</div>
                    <div class="demo-cell">N</div>
                    <div class="demo-cell">G</div>
                    <div class="demo-cell">O</div>
                </div>
                <div class="demo-row">
                    <div class="demo-cell">P</div>
                    <div class="demo-cell present">A</div>
                    <div class="demo-cell">L</div>
                    <div class="demo-cell">A</div>
                    <div class="demo-cell">B</div>
                </div>
                <div class="demo-row">
                    <div class="demo-cell">J</div>
                    <div class="demo-cell">U</div>
                    <div class="demo-cell incorrect">E</div>
                    <div class="demo-cell">G</div>
                    <div class="demo-cell">O</div>
                </div>
            </div>
            <div style="text-align: center; font-size: 0.9rem; color: #5a7072;">
                <p><span style="color: #2ecc71;">Verde</span>: Letra correcta en posición correcta</p>
                <p><span style="color: #f1c40f;">Amarillo</span>: Letra correcta en posición incorrecta</p>
                <p><span style="color: #95a5a6;">Gris</span>: Letra no está en la palabra</p>
            </div>
        </section>

        <section class="features">
            <div class="feature-card">
                <i class="fas fa-brain feature-icon"></i>
                <h3>Desafía tu Mente</h3>
                <p>Mejora tu vocabulario y agilidad mental con palabras desafiantes cada día.</p>
            </div>
            <div class="feature-card">
                <i class="fas fa-clock feature-icon"></i>
                <h3>Tiempo Limitado</h3>
                <p>60 segundos por intento para mantener la emoción y el desafío constante.</p>
            </div>
            <div class="feature-card">
                <i class="fas fa-chart-line feature-icon"></i>
                <h3>Sigue tu Progreso</h3>
                <p>Registra tus estadísticas, rachas y mejora tu rendimiento con el tiempo.</p>
            </div>
            <div class="feature-card">
                <i class="fas fa-trophy feature-icon"></i>
                <h3>Compite y Gana</h3>
                <p>Supera tus marcas personales y compite con amigos por la mejor puntuación.</p>
            </div>
        </section>
    </main>

</body>
</html>