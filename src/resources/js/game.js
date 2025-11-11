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
// === INICIO Y ESCUCHADORES (Listeners)
// ==========================
document.addEventListener("DOMContentLoaded", () => {
    // Elementos principales
    timerElement = document.getElementById("tiempoRestante");

    // Modal de Inicio
    document.getElementById("modalInicio").showModal();
    document
        .getElementById("btn-empezar-juego")
        .addEventListener("click", () => {
            document.getElementById("modalInicio").close();
            iniciarJuego();
        });

    // --- Logout (Cerrar Sesión) ---
    const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");
    const logoutForm = document.getElementById("logout-form");
    if (btnCerrarSesion && logoutForm) {
        btnCerrarSesion.addEventListener("click", (event) => {
            event.preventDefault();
            logoutForm.submit();
        });
    }

    // --- Teclado ---
    document.getElementById("teclado").addEventListener("click", (e) => {
        if (e.target.tagName !== "BUTTON" || !juegoActivo) return;
        const tecla = e.target.id;
        if (tecla === "enter") verificarPalabra();
        else if (tecla === "borrar") borrarLetra();
        else if (tecla.startsWith("tecla"))
            escribirLetra(tecla.replace("tecla", ""));
    });

    // --- Botones del Header (Estadísticas, Perfil, Pausa) ---
    document
        .getElementById("btn-estadisticas")
        .addEventListener("click", () => {
            pausarJuego();
            estadisticas();
        });
    document.getElementById("btn-perfil").addEventListener("click", () => {
        pausarJuego();
        verPerfil();
    });
    document.getElementById("btn-pausa").addEventListener("click", pausarJuego);

    // --- Botones del Modal de Pausa  ---
    document
        .getElementById("btn-continuar-juego")
        .addEventListener("click", reanudarJuego);
    document
        .getElementById("btn-reiniciar-juego")
        .addEventListener("click", reiniciarJuego);
    document
        .getElementById("confirmar-salida")
        .addEventListener("click", abandonarJuego);

    // --- Botones del Modal Fin Partida ---
    document
        .getElementById("btn-jugar-de-nuevo-modal")
        .addEventListener("click", jugarDeNuevo);
    document
        .getElementById("btn-estadisticas-modal")
        .addEventListener("click", estadisticas);
    document
        .getElementById("btn-perfil-modal")
        .addEventListener("click", verPerfil);

    // --- Botones del Modal Perfil ---
    document
        .getElementById("btn-cerrar-perfil")
        .addEventListener("click", () => {
            document.getElementById("perfilModal").close();
            reanudarJuego();
        });

    // --- Botón Cerrar Estadísticas ---
    // (Asegúrate de que tu botón "Cerrar" en el modal de estadísticas tiene este ID)
    const btnCerrarStats = document.querySelector(
        "#modalEstadisticas .btn-cerrar"
    );
    if (btnCerrarStats) {
        btnCerrarStats.addEventListener("click", () => {
            document.getElementById("modalEstadisticas").close();
            reanudarJuego();
        });
    }
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

        if (!palabraSecreta || palabraSecreta.length !== LONGITUD_PALABRA) {
            throw new Error("Palabra inválida recibida desde la API");
        }

        resetTablero();
        juegoActivo = true;
        juegoPausado = false;
        mostrarMensaje("¡Juego listo! Adivina la palabra.");
        startTimer();
        console.log("Palabra secreta:", palabraSecreta);
    } catch (err) {
        mostrarMensaje("No se pudo conectar con el servidor.");
        console.error(err);
        juegoActivo = false;
    }
}

function escribirLetra(letra) {
    if (!juegoActivo || juegoPausado || columna >= LONGITUD_PALABRA) return;
    const celda = document.getElementById(`celda_${fila + 1}_${columna + 1}`);
    celda.innerText = letra;
    palabraUsuario += letra.toLowerCase();
    columna++;
}

function borrarLetra() {
    if (!juegoActivo || juegoPausado || columna === 0) return;
    columna--;
    const celda = document.getElementById(`celda_${fila + 1}_${columna + 1}`);
    celda.innerText = "";
    palabraUsuario = palabraUsuario.slice(0, -1);
    mostrarMensaje("");
}

// ==========================
// === VERIFICACIÓN
// ==========================
async function verificarPalabra() {
    if (!juegoActivo || juegoPausado) return;
    if (palabraUsuario.length < LONGITUD_PALABRA) {
        mostrarMensaje("La palabra debe tener 5 letras");
        return;
    }

    mostrarMensaje("Verificando palabra...");

    try {
        const palabraParaVerificar = palabraUsuario.toLowerCase();
        const checkResp = await fetch(CHECK_ENDPOINT + palabraParaVerificar);

        if (!checkResp.ok) throw new Error(`Error HTTP: ${checkResp.status}`);
        const checkData = await checkResp.json();

        if (!checkData.exists) {
            mostrarMensaje("La palabra no existe en el diccionario");
            return;
        }

        procesarPalabraValida();
    } catch (err) {
        console.error("Error verificando palabra:", err);
        mostrarMensaje("Error verificando palabra. Continuando...");
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

    if (aciertos === LONGITUD_PALABRA) finDePartida(true);
    else if (fila === 4) finDePartida(false);
    else {
        fila++;
        columna = 0;
        palabraUsuario = "";
        mostrarMensaje("Palabra incorrecta, intenta otra.");
        startTimer(); // Inicia el timer para la nueva fila/intento
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
        if (juegoPausado) return; // No descontar tiempo si está en pausa

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
    juegoActivo = false;
    clearInterval(timerInterval);
    mostrarMensaje(`La palabra correcta era: ${palabraSecreta}`);

    // Llama a la función que guarda la partida en el backend
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
// === FUNCIÓN DE PAUSA (Limpio)
// ==========================
function pausarJuego() {
    if (!juegoActivo || juegoPausado) return;
    juegoPausado = true;
    tiempoAlPausar = tiempoRestante;
    clearInterval(timerInterval);
    mostrarMensaje(" Juego en pausa ");
    console.log("Juego pausado. Tiempo guardado:", tiempoAlPausar);
    document.getElementById("modalPausa").showModal();
}

function reanudarJuego() {
    if (!juegoPausado) return;
    juegoPausado = false;
    mostrarMensaje(" Partida reanudada");
    document.getElementById("modalPausa").close(); // Asegurarse de cerrar el modal

    // Restaurar el temporizador
    tiempoRestante = tiempoAlPausar;
    timerElement.textContent = tiempoRestante;
    startTimer(); // Llama a startTimer que ya maneja el intervalo

    console.log("Juego reanuda. Tiempo restaurado:", tiempoRestante);
}

function reiniciarJuego() {
    document.getElementById("modalPausa").close();
    juegoPausado = false;
    jugarDeNuevo(); // jugarDeNuevo ya resetea e inicia el juego
}

function abandonarJuego() {
    juegoActivo = false;
    juegoPausado = false;
    clearInterval(timerInterval);
    mostrarMensaje("Juego abandonado.");
    document.getElementById("modalPausa").close();

    // abandonar cuenta como derrota
    finDePartida(false);
}

// ==========================
// === GUARDADO DE ESTADÍSTICAS
// ==========================
async function guardarVictoria(victoria, palabraSecreta) {
    // 1. Obtenemos el Token CSRF
    const token = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content");

    // 2. Preparamos los datos
    const datosPartida = {
        ganada: victoria,
        palabra_secreta: palabraSecreta,
    };

    console.log("Guardando resultado de la partida:", datosPartida);

    try {
        // 3. ¡ARREGLADO! Llamamos a /partidas (la ruta que SÍ existe)
        const response = await fetch("/partidas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": token,
            },
            body: JSON.stringify(datosPartida),
        });

        if (!response.ok) {
            throw new Error(
                `Error HTTP: ${response.status} - ${response.statusText}`
            );
        }

        const data = await response.json();
        console.log("Estadísticas guardadas:", data);
    } catch (error) {
        console.error("Error al guardar las estadísticas:", error);
    }
}

// ==========================
// === CARGA DE ESTADÍSTICAS
// ==========================
async function estadisticas() {
    // Cerramos otros modales
    try {
        document.getElementById("finPartida").close();
    } catch (e) {} // Ignora el error si ya estaba cerrado

    const modal = document.getElementById("modalEstadisticas");
    modal.showModal();

    // Ponemos estado de "Cargando..."
    document.getElementById("stats-username").innerText = "Cargando...";
    document.getElementById("stats-jugadas").innerText = "Cargando...";
    document.getElementById("stats-victorias").innerText = "Cargando...";
    document.getElementById("stats-porcentaje").innerText = "Cargando...";
    document.getElementById("stats-racha").innerText = "Cargando...";
    document.getElementById("stats-mejor-racha").innerText = "Cargando...";

    try {
        // Llamamos a la ruta API que creamos en web.php
        const response = await fetch("/api/user-stats");

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const stats = await response.json();
        console.log("Estadísticas recibidas:", stats);

        // Rellenamos el modal con los datos
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
    const modal = document.getElementById("finPartida");
    modal.close();
    iniciarJuego();
}

function verPerfil() {
    try {
        document.getElementById("finPartida").close();
    } catch (e) {}
    document.getElementById("perfilModal").showModal();
}
