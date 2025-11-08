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

    // boton de jugar de nuevo MAIN
    document
        .getElementById("btn-jugar-de-nuevo")
        .addEventListener("click", () => {
            document.getElementById("finPartida").close();
            iniciarJuego();
        });

    // jugar de nuevo MODAL
    document
        .getElementById("btn-jugar-de-nuevo-modal")
        .addEventListener("click", () => {
            jugarDeNuevo();
        });
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
            mostrarMensaje("❌ La palabra no existe en el diccionario");
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
    juegoActivo = false;
    clearInterval(timerInterval);
    mostrarMensaje(`La palabra correcta era: ${palabraSecreta}`);

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

function pausarJuego() {
    if (!juegoActivo || juegoPausado) return;

    juegoPausado = true;
    tiempoAlPausar = tiempoRestante;
    clearInterval(timerInterval);

    mostrarMensaje("⚠️ Juego en pausa - Al regresar se reiniciará la partida");
    console.log("Juego pausado. Tiempo guardado:", tiempoAlPausar);
}

function reanudarJuego() {
    if (!juegoPausado) return;

    juegoPausado = false;

    mostrarMensaje("🔄 Partida reiniciada - ¡Nuevo intento!");
    iniciarJuego(); // Esto reinicia completamente la partida
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

function estadisticas() {
    document.getElementById("finPartida").close();
    document.getElementById("modalEstadisticas").showModal();
}

function verPerfil() {
    document.getElementById("finPartida").close();
    document.getElementById("perfilModal").showModal();
}
