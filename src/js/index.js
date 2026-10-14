// Importar Bootstrap y los estilos CSS
require("bootstrap/dist/css/bootstrap.min.css");
require("../css/styles.css");

// Tabla de equivalencias del código Morse
const codigoMorse = {
    A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".",
    F: "..-.", G: "--.", H: "....", I: "..", J: ".---",
    K: "-.-", L: ".-..", M: "--", N: "-.", O: "---",
    P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-",
    U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--",
    Z: "--..",

    0: "-----", 1: ".----", 2: "..---", 3: "...--",
    4: "....-", 5: ".....", 6: "-....", 7: "--...",
    8: "---..", 9: "----.",

    ".": ".-.-.-",
    ",": "--..--",
    "?": "..--..",
    "!": "-.-.--"
};

// Crear la tabla inversa para traducir Morse a texto
const morseTexto = Object.fromEntries(
    Object.entries(codigoMorse).map(([letra, morse]) => [
        morse,
        letra
    ])
);

// Obtener los elementos HTML
const tipoConversion = document.getElementById("tipoConversion");
const entrada = document.getElementById("entrada");
const etiquetaEntrada = document.getElementById("etiquetaEntrada");
const contador = document.getElementById("contador");

const btnConvertir = document.getElementById("btnConvertir");
const btnLimpiar = document.getElementById("btnLimpiar");
const btnCopiar = document.getElementById("btnCopiar");

const salida = document.getElementById("salida");
const mensaje = document.getElementById("mensaje");

// Mostrar mensajes
function mostrarMensaje(texto, tipo = "danger") {
    mensaje.textContent = texto;
    mensaje.className = `alert alert-${tipo}`;
}

// Ocultar mensajes
function ocultarMensaje() {
    mensaje.textContent = "";
    mensaje.className = "alert d-none";
}

// Actualizar el contador
function actualizarContador() {
    contador.textContent = `${entrada.value.length} / 2000`;
}

// Actualizar la interfaz según la conversión elegida
function actualizarInterfaz() {
    ocultarMensaje();

    if (tipoConversion.value === "texto-morse") {
        etiquetaEntrada.textContent = "Escribe tu mensaje";
        entrada.placeholder = "Ejemplo: HOLA MUNDO";
    } else {
        etiquetaEntrada.textContent = "Escribe el código Morse";
        entrada.placeholder = "Ejemplo: .... --- .-.. .- / -- ..- -. -.. ---";
    }
}

// Convertir texto a código Morse
function convertirTextoAMorse(texto) {
    const textoNormalizado = texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();

    return textoNormalizado.trim().split(/\s+/).map(palabra => {
        return [...palabra].map(caracter => {
            if (!codigoMorse[caracter]) {
                throw new Error(`El carácter "${caracter}" no está admitido.`);
            }

            return codigoMorse[caracter];
        }).join(" ");
    }).join(" / ");
}

// Convertir código Morse a texto
function convertirMorseATexto(texto) {
    if (!/^[.\-/\s]+$/.test(texto)) {
        throw new Error(
            "Utiliza solamente puntos, rayas, espacios y diagonales."
        );
    }

    return texto.trim().split(/\s*\/\s*/).map(palabra => {
        if (!palabra.trim()) {
            throw new Error("La separación entre palabras es incorrecta.");
        }

        return palabra.trim().split(/\s+/).map(simbolo => {
            if (!morseTexto[simbolo]) {
                throw new Error(`El símbolo Morse "${simbolo}" no es válido.`);
            }

            return morseTexto[simbolo];
        }).join("");
    }).join(" ");
}

// Ejecutar la conversión seleccionada
function convertir() {
    ocultarMensaje();

    const texto = entrada.value.trim();

    if (!texto) {
        mostrarMensaje("Escribe un texto o código Morse antes de convertir.");
        entrada.focus();
        return;
    }

    try {
        let resultado;

        if (tipoConversion.value === "texto-morse") {
            resultado = convertirTextoAMorse(texto);
        } else {
            resultado = convertirMorseATexto(texto);
        }

        salida.textContent = resultado;

        mostrarMensaje("¡Conversión realizada correctamente!", "success");

    } catch (error) {
        salida.textContent = "No se pudo realizar la conversión.";
        mostrarMensaje(error.message);
    }
}

// Limpiar los campos
function limpiar() {
    entrada.value = "";
    salida.textContent = "Tu resultado aparecerá aquí.";

    ocultarMensaje();
    actualizarContador();

    entrada.focus();
}

// Copiar el resultado
async function copiarResultado() {
    const resultado = salida.textContent;

    if (
        !resultado ||
        resultado === "Tu resultado aparecerá aquí." ||
        resultado === "No se pudo realizar la conversión."
    ) {
        mostrarMensaje("Primero realiza una conversión.");
        return;
    }

    try {
        await navigator.clipboard.writeText(resultado);

        mostrarMensaje("Resultado copiado correctamente.", "success");

    } catch (error) {
        mostrarMensaje("No se pudo copiar. Selecciona el resultado manualmente.");
    }
}

// Registrar los eventos de los botones
btnConvertir.addEventListener("click", convertir);
btnLimpiar.addEventListener("click", limpiar);
btnCopiar.addEventListener("click", copiarResultado);

tipoConversion.addEventListener("change", actualizarInterfaz);
entrada.addEventListener("input", actualizarContador);

// Inicializar la página
actualizarInterfaz();
actualizarContador();