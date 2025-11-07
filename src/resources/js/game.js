// ==========================
// === CONFIGURACIÓN GLOBAL
// ==========================
const ENDPOINT = "http://185.60.43.155:3000/api/word/1";
const TIEMPO_POR_INTENTO = 60;
const LONGITUD_PALABRA = 5;

// ==========================
// === VARIABLES DE ESTADO
// ==========================
let palabraSecreta = "";
let palabraUsuario = "";
let juegoActivo = false;
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
  "¡Conseguido! Tu léxico es impresionante."
];
const frasesDerrota = [
  "¡Oh! La palabra se ha resistido. ¡La próxima irá mejor!",
  "Casi... ¡Esa palabra era complicada!",
  "¡Buen intento! El diccionario tiene rincones oscuros.",
  "No te preocupes, ¡hasta el mejor escriba necesita un borrador!"
];

// ==========================
// === INICIO DEL JUEGO
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  timerElement = document.getElementById("tiempoRestante");
  document.getElementById("modalInicio").showModal();

  document.getElementById("btn-empezar-juego")
    .addEventListener("click", () => {
      document.getElementById("modalInicio").close();
      iniciarJuego();
    });

  // Teclado virtual (delegación de eventos)
  document.getElementById("teclado").addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON" || !juegoActivo) return;

    const tecla = e.target.id;
    if (tecla === "enter") verificarPalabra();
    else if (tecla === "borrar") borrarLetra();
    else if (tecla.startsWith("tecla")) escribirLetra(tecla.replace("tecla", ""));
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

    if (!palabraSecreta || palabraSecreta.length !== LONGITUD_PALABRA) {
      throw new Error("Palabra inválida recibida desde la API");
    }

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

function verificarPalabra() {
  if (!juegoActivo) return;

  if (palabraUsuario.length < LONGITUD_PALABRA) {
    mostrarMensaje("La palabra debe tener 5 letras");
    return;
  }

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

  document.getElementById("resultadoPartida").innerText = victoria ? "¡HAS GANADO!" : "¡HAS PERDIDO!";
  document.getElementById("fraseResultado").innerText = frase;
  setTimeout(() => document.getElementById("finPartida").showModal(), 500);
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
  document.querySelectorAll(".celda").forEach(celda => {
    celda.innerText = "";
    celda.classList.remove("correcta", "presente", "incorrecta");
  });
}

function jugarDeNuevo() {
  document.getElementById("finPartida").close();
  iniciarJuego();
}

function estadisticas() {
  document.getElementById("finPartida").close();
  document.getElementById("modalEstadisticas").showModal();
}
