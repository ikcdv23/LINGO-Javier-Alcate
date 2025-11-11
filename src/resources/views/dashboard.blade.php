@section('title') -¡A jugar! @endsection
<x-app-layout>
  <header>
    <div>
      <h1>LINGO</h1>
      <nav>
        <button id="btn-estadisticas" class="nav-btn"><i class="fa-solid fa-chart-line"></i></button>
        <button id="btn-perfil" class="nav-btn"><i class="fa-solid fa-user"></i></button>
        <button id="btn-pausa" class="nav-btn"><i class="fa-solid fa-pause"></i></button>
      </nav>
    </div>
  </header>

  <section id="mainJuego">
    <section class="juego">
      <!-- TABLERO -->
      <div class="tablero" id="tablero">
        <div class="fila-palabra">
          <div id="celda_1_1" class="celda"></div>
          <div id="celda_1_2" class="celda"></div>
          <div id="celda_1_3" class="celda"></div>
          <div id="celda_1_4" class="celda"></div>
          <div id="celda_1_5" class="celda"></div>
        </div>
        <div class="fila-palabra">
          <div id="celda_2_1" class="celda"></div>
          <div id="celda_2_2" class="celda"></div>
          <div id="celda_2_3" class="celda"></div>
          <div id="celda_2_4" class="celda"></div>
          <div id="celda_2_5" class="celda"></div>
        </div>
        <div class="fila-palabra">
          <div id="celda_3_1" class="celda"></div>
          <div id="celda_3_2" class="celda"></div>
          <div id="celda_3_3" class="celda"></div>
          <div id="celda_3_4" class="celda"></div>
          <div id="celda_3_5" class="celda"></div>
        </div>
        <div class="fila-palabra">
          <div id="celda_4_1" class="celda"></div>
          <div id="celda_4_2" class="celda"></div>
          <div id="celda_4_3" class="celda"></div>
          <div id="celda_4_4" class="celda"></div>
          <div id="celda_4_5" class="celda"></div>
        </div>
        <div class="fila-palabra">
          <div id="celda_5_1" class="celda"></div>
          <div id="celda_5_2" class="celda"></div>
          <div id="celda_5_3" class="celda"></div>
          <div id="celda_5_4" class="celda"></div>
          <div id="celda_5_5" class="celda"></div>
        </div>
      </div>

      <div class="reloj">
        <h2>Tiempo restante: <span id="tiempoRestante">60</span></h2>
      </div>

      <!-- TECLADO -->
      <div class="teclado" id="teclado">
        <div class="fila">
          <button id="teclaQ">Q</button><button id="teclaW">W</button><button id="teclaE">E</button><button
            id="teclaR">R</button><button id="teclaT">T</button> <button id="teclaY">Y</button><button
            id="teclaU">U</button><button id="teclaI">I</button><button id="teclaO">O</button><button
            id="teclaP">P</button>
        </div>
        <div class="fila">
          <button id="teclaA">A</button><button id="teclaS">S</button><button id="teclaD">D</button><button
            id="teclaF">F</button><button id="teclaG">G</button> <button id="teclaH">H</button><button
            id="teclaJ">J</button><button id="teclaK">K</button><button id="teclaL">L</button>
        </div>
        <div class="fila">
          <button id="enter" class="accion">⏎</button>
          <button id="teclaZ">Z</button><button id="teclaX">X</button><button id="teclaC">C</button><button
            id="teclaV">V</button><button id="teclaB">B</button> <button id="teclaN">N</button><button
            id="teclaM">M</button>
          <button id="borrar" class="accion">⌫</button>
        </div>
      </div>

      <div id="mensaje" class="mensaje">

      </div>
    </section>
    </main>
    <dialog id="finPartida">
      <h1>Fin de la partida</h1>
      <h2 id="resultadoPartida">(resutlado)</h2>
      <p id="fraseResultado">idea de texto aleatorio en funcion de victoria o derrota</p>
      <div>
        <button id="btn-jugar-de-nuevo-modal" type="button">Jugar de nuevo</button>
        <button id="btn-estadisticas-modal" type="button">Estadisticas</button>
        <button id="btn-perfil-modal" type="button">Ver perfil</button>
      </div>
    </dialog>

    <dialog id="modalEstadisticas" class="estadisticas">

      <form method="dialog">

        <header>
          <h2>Estadísticas del Jugador</h2>
          <span id="stats-username">(nombre_usuario)</span>
        </header>

        <ul class="stats-list">

          <li>
            <span>Partidas Jugadas</span>
            <strong id="stats-jugadas">0</strong>
          </li>
          <li>
            <span>Victorias</span>
            <strong id="stats-victorias">0</strong>
          </li>
          <li>
            <span>Porcentaje de Victorias</span>
            <strong id="stats-porcentaje">0%</strong>
          </li>
          <li>
            <span>Racha Actual</span>
            <strong id="stats-racha">0</strong>
          </li>
          <li>
            <span>Mejor Racha</span>
            <strong id="stats-mejor-racha">0</strong>
          </li>
        </ul>

        <footer>

          <button type="submit" class="btn-cerrar-estadisticas">Cerrar</button>
        </footer>

      </form>
    </dialog>

    <dialog id="modalInicio">
      <div class="modal-contenido">
        <header>
          <h2>¡Bienvenido a LINGO!</h2>
          <p>Aprende a jugar antes de empezar.</p>
        </header>

        <section class="reglas">
          <h3>Objetivo</h3>
          <p>Adivina la <span style="font-weight: bolder;"> palabra oculta </span> de 5 letras en 5 intentos.<span
              style="font-weight: bolder;"> ¡Tienes 60 segundos por intento!</span></p>

          <h3>Reglas del Juego</h3>
          <ul>
            <li>Cada intento debe ser una palabra válida.</li>
            <li>Tras cada intento, el color de las letras cambiará para mostrar qué tan cerca estás de la solución.</li>
          </ul>

          <div class="ejemplos">
            <h4>Ejemplos:</h4>
            <div class="fila-ejemplo">
              <div class="celda correcta">C</div>
              <div class="celda">A</div>
              <div class="celda">S</div>
              <div class="celda">A</div>
              <div class="celda">R</div>
            </div>
            <p>La <span style="font-weight: bolder;">"C"</span> está en la palabra y en la posición <span
                style="font-weight: bolder;  color: #2ecc71;">correcta.</span></p>

            <div class="fila-ejemplo">
              <div class="celda">P</div>
              <div class="celda presente">A</div>
              <div class="celda">R</div>
              <div class="celda">E</div>
              <div class="celda">S</div>
            </div>
            <p>La "A" está en la palabra, pero en la posición <span
                style="font-weight: bolder; color: #f1c40f">incorrecta.</span>.</p>

            <div class="fila-ejemplo">
              <div class="celda">R</div>
              <div class="celda">I</div>
              <div class="celda incorrecta">O</div>
              <div class="celda">S</div>
              <div class="celda">A</div>
            </div>
            <p>La <span style="font-weight: bolder;"> "O" </span> no está en la palabra secreta en <span
                style="font-weight: bolder;">ninguna posición.</span></p>
          </div>
        </section>

        <footer>
          <button id="btn-empezar-juego" class="btn-empezar">¡Entendido, Empezar a Jugar!</button>
        </footer>
      </div>
    </dialog>

    <!-- MODAL DE PAUSA -->
    <dialog id="modalPausa" class="modalPausa">
      <header>LINGO</header>
      <main>
        <h2>Opciones</h2>
        <button type="button" id="btn-continuar-juego">Continuar Juego</button>
        <button type="button" id="btn-reiniciar-juego">Reiniciar Partida</button>
        <button type="button" id="confirmar-salida">Abandonar Partida</button>
      </main>
    </dialog>

    <!-- MODAL DE VISUALIZAZION DE PERFIL -->
    <dialog id="perfilModal" class="perfilModal">
      <form method="dialog" id="form-perfil">
        <h2>Mi Cuenta</h2>

        <a href="{{ route('profile.edit') }}">Perfil</a>

        <button id="btn-cerrar-perfil" type="button">Cerrar</button>
      </form>

      <form method="POST" action="{{ route('logout') }}" id="logout-form">
        @csrf
        <button type="submit" id="btn-cerrar-sesion">Cerrar sesión</button>
      </form>
    </dialog>


    <footer>
      <p>By Javier Alcate</p>
    </footer>

</x-app-layout>