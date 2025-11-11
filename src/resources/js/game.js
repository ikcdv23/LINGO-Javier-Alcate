// ==========================
// === CONFIGURACIÓN GLOBAL
// ==========================
const ENDPOINT = "http://185.60.43.155:3000/api/word/1";
const CHECK_ENDPOINT = "http://185.60.43.155:3000/api/check/";
const TIEMPO_POR_INTENTO = 60;
const LONGITUD_PALABRA = 5;

// ==========================
// === VARIABLES DE ESTADO
// ==========================
let palabraSecreta = "";
let palabraUsuario = "";
let juegoActivo = false;
let juegoPausado = false;
let tiempoAlPausar = 0;
let fila = 0;
let columna = 0;

// ==========================
// === TEMPORIZADOR
// ==========================
let timerInterval;
let tiempoRestante = TIEMPO_POR_INTENTO;
let timerElement;

// ==========================
// === FRASES
// ==========================
const frasesVictoria = [
    "¡Increíble! ¿Acaso eres un diccionario con patas?",
    "¡Victoria magistral! Ni la RAE lo haría mejor.",
    "¡Perfecto! Has dominado la palabra.",
    "¡Conseguido! Tu léxico es impresionante.",
];
const frasesDerrota = [
    "¡Oh! La palabra se ha resistido. ¡La próxima irá mejor!",
    "Casi... ¡Esa palabra era complicada!",
    "¡Buen intento! El diccionario tiene rincones oscuros.",
    "No te preocupes, ¡hasta el mejor escriba necesita un borrador!",
];

// ==========================
// === INICIO DEL JUEGO
// ==========================
document.addEventListener("DOMContentLoaded", () => {
    timerElement = document.getElementById("tiempoRestante");
    document.getElementById("modalInicio").showModal();

    document
        .getElementById("btn-empezar-juego")
        .addEventListener("click", () => {
            document.getElementById("modalInicio").close();
            iniciarJuego();
        });

    // ********** CONEXIÓN MANUAL PARA CERRAR SESIÓN **********
    const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");
    const logoutForm = document.getElementById("logout-form");

    if (btnCerrarSesion && logoutForm) {
        btnCerrarSesion.addEventListener("click", function (event) {
            // Previene la acción por defecto del botón (si fuera submit)
            event.preventDefault();

            // Envía el formulario POST de logout
            logoutForm.submit();
        });
    }
    // **********************************************************

    // === ESCUCHADORES ===
    // Teclado virtual escucha el click y escribe la letra correspondiente
    document.getElementById("teclado").addEventListener("click", (e) => {
        if (e.target.tagName !== "BUTTON" || !juegoActivo) return;

        const tecla = e.target.id;
        if (tecla === "enter") verificarPalabra();
        else if (tecla === "borrar") borrarLetra();
        else if (tecla.startsWith("tecla"))
            escribirLetra(tecla.replace("tecla", ""));
    });

    // boton de estadisticas MAIN
    document
        .getElementById("btn-estadisticas")
        .addEventListener("click", () => {
            mostrarAdvertenciaPausa();
            pausarJuego();
            estadisticas();
        });

    // estadisticas MODAL
    document
        .getElementById("btn-estadisticas-modal")
        .addEventListener("click", () => {
            pausarJuego();
            estadisticas();
        });

    // cerrar estadisticas MODAL
    document
        .getElementById("btn-cerrar-estadisticas")
        .addEventListener("click", () => {
            document.getElementById("modalEstadisticas").close();
            reanudarJuego();
        });
    // boton de perfil MAIN
    document.getElementById("btn-perfil").addEventListener("click", () => {
        pausarJuego();
        verPerfil();
    });

    // perfil MODAL
    document
        .getElementById("btn-perfil-modal")
        .addEventListener("click", () => {
            pausarJuego();
            verPerfil();
        });

    // cerrar perfil MODAL
    document
        .getElementById("btn-cerrar-perfil")
        .addEventListener("click", () => {
            document.getElementById("perfilModal").close();
            reanudarJuego();
        });

    // jugar de nuevo MODAL
    document
        .getElementById("btn-jugar-de-nuevo-modal")
        .addEventListener("click", () => {
            jugarDeNuevo();
        });

    // Botón de Pausa (en el header)
    document.getElementById("btn-pausa").addEventListener("click", pausarJuego);

    // Botones *dentro* del Modal de Pausa
    document
        .getElementById("btn-reanudar-juego")
        .addEventListener("click", reanudarJuego);
    document
        .getElementById("btn-reiniciar-juego")
        .addEventListener("click", reiniciarJuego);

    // --- FIN DEL ARREGLO DE PAUSA ---

    // Botones de Estadísticas
    document
        .getElementById("btn-estadisticas")
        .addEventListener("click", estadisticas);
    document
        .getElementById("btn-estadisticas-modal")
        .addEventListener("click", estadisticas);

    // Botones de Perfil
    document.getElementById("btn-perfil").addEventListener("click", verPerfil);
    document
        .getElementById("btn-perfil-modal")
        .addEventListener("click", verPerfil);
    document
        .getElementById("btn-cerrar-perfil")
        .addEventListener("click", () => {
            document.getElementById("perfilModal").close();
            reanudarJuego(); // O quizá solo cerrar el modal sin reanudar
        });

    // Botón Jugar de Nuevo (Modal Fin Partida)
    document
        .getElementById("btn-jugar-de-nuevo-modal")
        .addEventListener("click", jugarDeNuevo);
});

// ==========================
// === LÓGICA DEL JUEGO
// ==========================
async function iniciarJuego() {
    try {
        const resp = await fetch(ENDPOINT);
        if (!resp.ok) throw new Error(`Error HTTP: ${resp.status}`);

        const data = await resp.json();
        palabraSecreta = (data.word || "").toLowerCase();

        // Validar la palabra recibida
        if (!palabraSecreta || palabraSecreta.length !== LONGITUD_PALABRA) {
            throw new Error("Palabra inválida recibida desde la API");
        }

        // prepara el tablero para a nuev ronda
        resetTablero();
        juegoActivo = true;
        mostrarMensaje("¡Juego listo! Adivina la palabra.");
        startTimer();
        console.log("Palabra secreta:", palabraSecreta);
    } catch (err) {
        mostrarMensaje("ERROR: No se pudo conectar con el servidor.");
        console.error(err);
        juegoActivo = false;
    }
}

function escribirLetra(letra) {
    if (!juegoActivo || columna >= LONGITUD_PALABRA) return;

    const celda = document.getElementById(`celda_${fila + 1}_${columna + 1}`);
    celda.innerText = letra;
    palabraUsuario += letra.toLowerCase();
    columna++;
}

function borrarLetra() {
    if (columna === 0) return;

    columna--;
    const celda = document.getElementById(`celda_${fila + 1}_${columna + 1}`);
    celda.innerText = "";
    palabraUsuario = palabraUsuario.slice(0, -1);
    mostrarMensaje("");
}

// ==========================
// === VERIFICACIÓN DE PALABRA EN DICCIONARIO
// ==========================
async function verificarPalabra() {
    if (!juegoActivo) return;

    if (palabraUsuario.length < LONGITUD_PALABRA) {
        mostrarMensaje("La palabra debe tener 5 letras");
        return;
    }

    // Verificar si la palabra existe en el diccionario
    mostrarMensaje("Verificando palabra...");

    try {
        const palabraParaVerificar = palabraUsuario.toLowerCase();
        const checkResp = await fetch(CHECK_ENDPOINT + palabraParaVerificar);

        if (!checkResp.ok) {
            throw new Error(`Error HTTP: ${checkResp.status}`);
        }

        const checkData = await checkResp.json();

        if (!checkData.exists) {
            mostrarMensaje("La palabra no existe en el diccionario");
            return;
        }

        // Si la palabra existe, proceder con la verificación normal
        procesarPalabraValida();
    } catch (err) {
        console.error("Error verificando palabra:", err);
        mostrarMensaje("⚠️ Error verificando palabra. Continuando...");
        // Si hay error en la verificación, permitimos continuar
        procesarPalabraValida();
    }
}

function procesarPalabraValida() {
    let aciertos = 0;

    for (let i = 0; i < LONGITUD_PALABRA; i++) {
        const letraUsuario = palabraUsuario[i];
        const celda = document.getElementById(`celda_${fila + 1}_${i + 1}`);

        if (letraUsuario === palabraSecreta[i]) {
            celda.classList.add("correcta");
            aciertos++;
        } else if (palabraSecreta.includes(letraUsuario)) {
            celda.classList.add("presente");
        } else {
            celda.classList.add("incorrecta");
        }
    }

    if (aciertos === LONGITUD_PALABRA) {
        finDePartida(true);
    } else if (fila === 4) {
        finDePartida(false);
    } else {
        fila++;
        columna = 0;
        palabraUsuario = "";
        mostrarMensaje("Palabra incorrecta, intenta otra.");
        startTimer();
    }
}

// ==========================
// === TEMPORIZADOR
// ==========================
function startTimer() {
    clearInterval(timerInterval);
    tiempoRestante = TIEMPO_POR_INTENTO;
    timerElement.textContent = tiempoRestante;

    timerInterval = setInterval(() => {
        tiempoRestante--;
        timerElement.textContent = tiempoRestante;

        if (tiempoRestante <= 0) {
            clearInterval(timerInterval);
            mostrarMensaje("¡Se acabó el tiempo!");
            finDePartida(false);
        }
    }, 1000);
}

// ==========================
// === FIN DE PARTIDA
// ==========================
function finDePartida(victoria) {
    // victoria es un booleano donde true es ganar y false es perder
    juegoActivo = false;
    clearInterval(timerInterval);
    mostrarMensaje(`La palabra correcta era: ${palabraSecreta}`);

    // Llama a la funcinon que guardara la victoriaa en las estadisticas
    guardarVictoria(victoria, palabraSecreta);

    const frase = victoria
        ? frasesVictoria[Math.floor(Math.random() * frasesVictoria.length)]
        : frasesDerrota[Math.floor(Math.random() * frasesDerrota.length)];

    document.getElementById("resultadoPartida").innerText = victoria
        ? "¡HAS GANADO!"
        : "¡HAS PERDIDO!";
    document.getElementById("fraseResultado").innerText = frase;
    setTimeout(() => document.getElementById("finPartida").showModal(), 500);
}

// ==========================
// === FUNCIÓN DE PAUSA
// ==========================

// Esta es la ÚNICA función que debe llamar el botón de pausa
function pausarJuego() {
    if (!juegoActivo || juegoPausado) return;

    juegoPausado = true;
    tiempoAlPausar = tiempoRestante; // Guarda el tiempo
    clearInterval(timerInterval); // Detiene el reloj

    mostrarMensaje(" Juego en pausa ");
    console.log("Juego pausado. Tiempo guardado:", tiempoAlPausar);

    // ¡LA LÍNEA CLAVE QUE FALTABA!
    // Abre el modal de pausa
    document.getElementById("modalPausa").showModal();
}

function reanudarJuego() {
    if (!juegoPausado) return;
    juegoPausado = false;

    mostrarMensaje(" Partida reanudada");

    // Cierra el modal de pausa (¡Faltaba esto!)
    document.getElementById("modalPausa").close();

    // Restaurar el temporizador con el tiempo guardado
    tiempoRestante = tiempoAlPausar;
    timerElement.textContent = tiempoRestante;

    // Reinicia el intervalo del reloj
    timerInterval = setInterval(() => {
        tiempoRestante--;
        timerElement.textContent = tiempoRestante;

        if (tiempoRestante <= 0) {
            clearInterval(timerInterval);
            mostrarMensaje("¡Se acabó el tiempo!");
            finDePartida(false); // Asegúrate de que finDePartida(false) existe
        }
    }, 1000);

    console.log("Juego reanudado. Tiempo restaurado:", tiempoRestante);
}

function reiniciarJuego() {
    // Cierra el modal de pausa
    document.getElementById("modalPausa").close();
    juegoPausado = false; // Asegúrate de resetear el estado de pausa
    // Reinicia la partida desde cero (tu función jugarDeNuevo hace esto)
    jugarDeNuevo();
}

// ==========================
// === GUARDADO DE ESTADÍSTICAS
// ==========================

// funcion que guarda la victoria o derrota en las estadisticas del usuario (lleva a la base de datos )
async function guardarVictoria(victoria, palabraSecreta) {
    // capturar captura el token CSRF
    const token = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content");

    // se guardan los datos de la partida: la palabra secreta y resultado de la partida
    const datosPartida = {
        ganada: victoria, // true o false
        palabra_secreta: palabraSecreta, // La palabra que se jugó
    };

    // confirma que funciona la conexion con el servidor
    console.log("Guardando resultado de la partida:", datosPartida);

    try {
        const response = await fetch("/guardar_estadisticas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": token, // el token se envia
            },
            body: JSON.stringify(datosPartida), // transforma los datos en JSON
        });

        if (!response.ok) {
            // en caso de error envia una excepcion
            throw new Error(`Error HTTP: ${response.status}`);
        }

        // si todo va bien continua
        const data = await response.json(); // lee la respuesta de laravel

        // para monitorizar que todo ha ido bien
        console.log("Estadísticas guardadas:", data);
    } catch (error) {
        // catch de errores
        console.error("Error al guardar las estadísticas:", error);
    }
}

// ==========================
// === UTILIDADES
// ==========================
function mostrarMensaje(texto) {
    document.getElementById("mensaje").innerText = texto;
}

function resetTablero() {
    palabraUsuario = "";
    fila = 0;
    columna = 0;
    document.querySelectorAll(".celda").forEach((celda) => {
        celda.innerText = "";
        celda.classList.remove("correcta", "presente", "incorrecta");
    });
}

function jugarDeNuevo() {
    // Cerrar el modal correctamente
    const modal = document.getElementById("finPartida");
    modal.close(); // Esto debería funcionar

    iniciarJuego();
}

async function estadisticas() {
    document.getElementById("finPartida").close();
    document.getElementById("modalEstadisticas").showModal();

    // hacer cosas en laravel para obtener datos tarda mucho asi q ue pongo datos de carga
    document.getElementById("finPartida").close();
    const modal = document.getElementById("modalEstadisticas");
    modal.showModal();

    document.getElementById("stats-username").innerText = "Cargando...";
    document.getElementById("stats-jugadas").innerText = "Cargando...";
    document.getElementById("stats-victorias").innerText = "Cargando...";
    document.getElementById("stats-porcentaje").innerText = "Cargando...";
    document.getElementById("stats-racha").innerText = "Cargando...";
    document.getElementById("stats-mejor-racha").innerText = "Cargando...";

    console.log("...");

    try {
        // en web defini la ruta /api/user-stats que devuelve las estadisticas del usuario
        const response = await fetch("/api/user-stats");

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const stats = await response.json();
        console.log("Estadísticas recibidas:", stats);

        // 3. Rellenamos el modal con la respuesta del "chef" (el JSON)
        document.getElementById("stats-username").innerText = stats.username;
        document.getElementById("stats-jugadas").innerText =
            stats.partidas_jugadas;
        document.getElementById("stats-victorias").innerText = stats.victorias;
        document.getElementById("stats-porcentaje").innerText =
            stats.porcentaje_victorias + "%";
        document.getElementById("stats-racha").innerText = stats.racha_actual;
        document.getElementById("stats-mejor-racha").innerText =
            stats.mejor_racha;
    } catch (error) {
        console.error("Error al obtener las estadísticas:", error);
        document.getElementById("stats-username").innerText = "Error al cargar";
    }
}

function verPerfil() {
    document.getElementById("finPartida").close();
    document.getElementById("perfilModal").showModal();
}
