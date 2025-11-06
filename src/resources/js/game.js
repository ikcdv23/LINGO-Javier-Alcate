// --- API PARA RECOGER PALABRA

const ENDPOINT = "http://185.60.43.155:3000/api/word/1";

// --- VARIABLES DE JUEGO ---
let palabra = "";
let intentos = 5;
let estadoPartida = false; // mientras sea false la partida no acaba
let PalUsuario = "";
let posicion = { fila: 0, columna: 0 }; // PARA ESCRIBIR LAS LETRAS EN SU CELDA CORRECTA

// --- VARIABLES DEL TEMPORIZADOR ---
let timerInterval; // Guarda la referencia al "tictac" para poder pararlo
let timeLeft = 60; // Segundos por intento
const timerElement = document.getElementById("tiempoRestante");

// --- FRASES INGENIOSAS (Ganar / Perder) ---

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

// --- FUINCIÓN ASINCRONA PARA CREAR UNA PALABRA ALEATORIA ---
async function iniciarJuego() {
    const celdaActual = document.getElementById(
        "celda_" + (posicion["fila"] + 1) + "_" + (posicion["columna"] + 1)
    );
    try {
        //
        const resp = await fetch(ENDPOINT);

        // 1. CONTROL DE ERRORES: Si la respuesta HTTP no es exitosa (404, 500, etc.)
        if (!resp.ok) {
            throw new Error(`Error HTTP: ${resp.status} - ${resp.statusText}`);
        }

        const data = await resp.json();

        // 2. Extracción y Normalización de la palabra (a minúsculas)
        // Asumimos que la API devuelve un objeto con la propiedad 'word'
        palabra = data.word.toLowerCase();

        // 3. ¡ÉXITO! Desbloquear el juego
        estadoPartida = false;
        document.getElementById("mensaje").innerText =
            "¡Juego listo! Adivina la palabra.";
        console.log("Palabra secreta cargada con éxito:", palabra);

        // inicia temporizador
        startTimer();
    } catch (error) {
        // 4. MANEJO DE ERRORES: Si falla la conexión o el formato de datos
        console.error("Error fatal al cargar la palabra secreta:", error);
        document.getElementById("mensaje").innerText =
            "ERROR: No se pudo conectar con el servidor.";
        // El juego se mantiene bloqueado (estadoPartida = true)
    }
}
// cuando todo este cargado llamamos a la funcion de iniciar juego
document.addEventListener("DOMContentLoaded", function () {
    // 1. Mostrar el modal de inicio
    document.getElementById("modalInicio").showModal();
    // 2. El juego sigue BLOQUEADO (estadoPartida = true)
    // 3. NO llamamos a iniciarJuego() todavía.
});

// NUEVA FUNCIÓN: Se activa al pulsar el botón "Empezar"
function cerrarInicioYEmpezar() {
    document.getElementById("modalInicio").close();
    // Llamar a la función que inicia la carga de la palabra y el temporizador
    iniciarJuego();
}

// un escuchador de eventos para el teclado, accionara la funcion correspondiente
// me ahorra tener que poner un onclick a cada boton seria una fumada
document.getElementById("teclado").addEventListener("click", function (event) {
    // event delegation
    // verifica si el elemento clicado es un botón
    if (event.target.tagName === "BUTTON") {
        const tecla = event.target.id;

        if (tecla === "enter") {
            verificar_palabra();
        } else if (tecla === "borrar") {
            borrar_letra();
        } else if (tecla.startsWith("tecla")) {
            // Extraer la letra del id
            const letra = tecla.replace("tecla", "");
            escribir_letra(letra);
        }
    }
});

// escribe la letra en la celda correspondiente.
function escribir_letra(letra) {
    // respeta el estado de la partida si es que la palabra no ha cargado.
    if (estadoPartida) return;

    // Comprobación por consola si la letra ha sido escrrita.
    console.log("Escribir letra:", letra);

    // No permitir escribir más de 5 letras por fila
    if (posicion["columna"] >= 5) {
        document.getElementById("mensaje").innerText =
            "No se pueden escribir más de 5 letras por fila";
        return; // Salir de la función inmediatamente.
    }

    // Actualizar la palabra del usuario.
    PalUsuario += letra;
    // LLAMAR CELDA ACTUAL;
    const celdaActual = document.getElementById(
        "celda_" + (posicion["fila"] + 1) + "_" + (posicion["columna"] + 1)
    );
    celdaActual.innerText = letra;

    // Mover a la siguiente columna
    posicion["columna"] += 1;
}

function borrar_letra() {
    if (posicion.columna > 0) {
        // retroceder primero
        posicion.columna--;

        const celdaABorrar = document.getElementById(
            `celda_${posicion.fila + 1}_${posicion.columna + 1}`
        );

        celdaABorrar.innerText = "";
        PalUsuario = PalUsuario.slice(0, -1);

        // Limpiar mensaje de error si existe
        document.getElementById("mensaje").innerText = "";
    }
}

function verificar_palabra() {
    // Bloqueo si el juego terminó
    if (estadoPartida) return;

    let contadorLetrasBien = 0;

    document.getElementById("mensaje").innerText =
        "enter pulsado: " + PalUsuario;

    // Verificar que la palabra tenga 5 letras
    if (PalUsuario.length < 5) {
        document.getElementById("mensaje").innerText =
            "La palabra debe tener 5 letras";
        return; // Salir de la función
    } // ---  PENDIENTE REFACTORIZAR ---

    // formattea la palabra a minusculas
    PalUsuario = PalUsuario.toLowerCase();
    console.log("Palabra del usuario a verificar:", PalUsuario);

    // recorre cada letra del usuario
    for (let i = 0; i < 5; i++) {
        // obtiene la letra del usuario y la letra de la palabra a adivinar
        const letraUsuario = PalUsuario[i];
        const letraPalabra = palabra[i];

        const celdaActual = document.getElementById(
            `celda_${posicion.fila + 1}_${i + 1}`
        );

        if (letraUsuario === letraPalabra) {
            // letra correcta
            celdaActual.classList.add("correcta");
            contadorLetrasBien++;
        } else if (palabra.includes(letraUsuario)) {
            // letra en la palabra pero en la posición incorrecta
            celdaActual.classList.add("presente");
        } else {
            // letra no está en la palabra
            celdaActual.classList.add("incorrecta");
        }
    }

    // comprueba si has ganado
    if (contadorLetrasBien === 5) {
        clearInterval(timerInterval);
        document.getElementById("mensaje").innerText =
            "La palabra correcta es " + palabra;
        finDePartida("¡HAS GANADO!");
        estadoPartida = true;
        return;
    }

    // comprueba si ha perdido la partida antes de pasar a la siguiente linea
    if (posicion["fila"] === 4) {
        finDePartida("¡HAS PERDIDO!");
        clearInterval(timerInterval);
        estadoPartida = true;
        return;
    }

    // avisa que la palabra no es correcta
    if (contadorLetrasBien < 5) {
        //
        contadorLetrasBien = 0;
        document.getElementById("mensaje").innerText =
            "Palabra incorrecta tete";

        // pasa a la siguiente fila
        posicion["fila"]++;
        posicion["columna"] = 0;
        // resetear la palabra del usuario
        PalUsuario = "";

        // inicia temporizador por cada intento
        startTimer();
        return;
    }
}

function startTimer() {
    // 1. Limpia cualquier temporizador anterior (evita tictacs duplicados)
    clearInterval(timerInterval);

    // 2. Resetea el tiempo y el HTML
    timeLeft = 60;
    timerElement.textContent = timeLeft;
    // timerElement.parentElement.classList.remove("warning"); // (Para estilos de aviso)

    // 3. Inicia el nuevo "tictac" (cada 1000ms = 1 segundo)
    timerInterval = setInterval(() => {
        timeLeft--; // Resta un segundo
        timerElement.textContent = timeLeft; // Actualiza el HTML

        // (Opcional: Añadir clase de aviso)
        if (timeLeft <= 10) {
            timerElement.parentElement.classList.add("warning");
        }

        // 4. Si el tiempo llega a 0
        if (timeLeft <= 0) {
            clearInterval(timerInterval); // Detiene el reloj

            // Lógica de derrota por tiempo (según rúbrica DWC)
            document.getElementById("mensaje").innerText =
                "¡Se acabó el tiempo!";
            finDePartida("¡HAS PERDIDO!"); // Llama al modal
            estadoPartida = true; // Bloquea el juego
        }
    }, 1000);
}

// Abrir pop up fin de partida
let popup = document.getElementById("finPartida");
let resultadoPartida = document.getElementById("resultadoPartida");

function finDePartida(resultado) {
    PalUsuario = "";
    resultadoPartida.innerText = resultado;

    // obtiene frase de partida
    const frase = obtenerFraseResultado(resultado);
    document.getElementById("fraseResultado").innerText = frase;

    setTimeout(() => {
        popup.showModal();
    }, 500);
}

function jugarDeNuevo() {
    estadoPartida = false;
    posicion["columna"] = 0;
    posicion["fila"] = 0;
    for (let i = 1; i <= 5; i++) {
        for (let x = 1; x <= 5; x++) {
            let celda = document.getElementById("celda_" + i + "_" + x);
            celda.innerText = "";
            celda.classList.remove("correcta", "presente", "incorrecta");
        }
    }

    iniciarJuego();
    startTimer();
    popup.close();
}
function obtenerFraseResultado(resultado) {
    let fraseAleatoria = "";

    if (resultado === "¡HAS GANADO!") {
        // Escoge una frase de victoria al azar
        const indice = Math.floor(Math.random() * frasesVictoria.length);
        fraseAleatoria = frasesVictoria[indice];
    } else {
        // Escoge una frase de derrota al azar
        const indice = Math.floor(Math.random() * frasesDerrota.length);
        fraseAleatoria = frasesDerrota[indice];
    }
    return fraseAleatoria;
}

function estadisticas() {
    popup.close();
    let modal = document.getElementById("modalEstadisticas");
    modal.showModal();
}
