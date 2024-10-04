// Función que devuelve el path de una imagen de carta de manera aleatoria
function getRandomPathImg() {
    let random = Math.floor(Math.random() * 20) + 1;
    if (random < 10) {
        return `./img/card/robot_0${random}.png`;
    }
    return `./img/card/robot_${random}.png`;
}

// Clase Jugador
class Jugador {
    constructor(nombre) {
        this.nombre = nombre;
        this.eliminado = false;
        this.cartas = [];
    }

    // Gasta una carta de desactivación
    gastarCartaDesactivacion() {
        const index = this.cartas.findIndex(carta => carta.tipo === 'Desactivación');
        if (index !== -1) {
            this.cartas.splice(index, 1); // Elimina la carta de desactivación
        }
    }

    // Gasta una carta de saltar turno
    gastarCartaSaltarTurno() {
        const index = this.cartas.findIndex(carta => carta.tipo === 'Saltar turno');
        if (index !== -1) {
            this.cartas.splice(index, 1); // Elimina la carta de saltar turno
        }
    }

    // Calcula los puntos totales del jugador sumando las cartas de puntos
    getPuntosTotales() {
        return this.cartas
            .filter(carta => carta.tipo === 'Puntos')
            .reduce((total, carta) => total + carta.valor, 0);
    }
}

// Crear jugadores
const jugadores = [
    new Jugador("Jugador 1"),
    new Jugador("Jugador 2"),
    new Jugador("Jugador 3")
];

// Variables del juego
let mazo = [];
let turnoActual = 0;

// Función para iniciar el juego
function iniciarJuego() {
    mazo = generarMazo();
    mezclarMazo(mazo);
    actualizarInterfaz();
}

// Generar el mazo con las cartas especificadas
function generarMazo() {
    let mazo = [];
    
    // Añadir cartas Bomba
    for (let i = 0; i < 6; i++) {
        mazo.push({ tipo: 'Bomba' });
    }

    // Añadir cartas Desactivación
    for (let i = 0; i < 6; i++) {
        mazo.push({ tipo: 'Desactivación' });
    }

    // Añadir cartas Saltar Turno
    for (let i = 0; i < 10; i++) {
        mazo.push({ tipo: 'Saltar turno' });
    }

    // Añadir cartas Puntos con valores entre 1 y 10
    for (let i = 0; i < 33; i++) {
        let valor = Math.floor(Math.random() * 10) + 1;
        mazo.push({ tipo: 'Puntos', valor: valor });
    }

    return mazo;
}

// Función para mezclar el mazo con el algoritmo de Fisher-Yates
function mezclarMazo(mazo) {
    for (let i = mazo.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mazo[i], mazo[j]] = [mazo[j], mazo[i]];
    }
}

// Función para que un jugador robe una carta
function robarCarta() {
    if (jugadores[turnoActual].eliminado) return;

    if (mazo.length === 0) {
        alert("No hay cartas en el mazo.");
        verificarGanador();
        return;
    }

    const carta = mazo.pop();
    jugadores[turnoActual].cartas.push(carta);
    document.getElementById('imgCartaRobada').src = getRandomPathImg();

    // Si la carta es una bomba y no tiene desactivador, el jugador es eliminado
    if (carta.tipo === 'Bomba') {
        if (jugadores[turnoActual].cartas.some(carta => carta.tipo === 'Desactivación')) {
            jugadores[turnoActual].gastarCartaDesactivacion();
            descartarCarta('Bomba', 'Desactivación');
        } else {
            jugadores[turnoActual].eliminado = true;
            alert(`${jugadores[turnoActual].nombre} ha sido eliminado por una bomba.`);
        }
    }

    actualizarInterfaz();
    pasarTurno();
}

// Función para descartar cartas
function descartarCarta(cartaTipo1, cartaTipo2) {
    const listaDescarte = document.getElementById('listaDescarte');
    const nuevoElemento = document.createElement('li');
    nuevoElemento.textContent = `Carta ${cartaTipo1} y ${cartaTipo2} descartadas`;
    listaDescarte.appendChild(nuevoElemento);
}

// Función para pasar turno
function pasarTurno() {
    do {
        turnoActual = (turnoActual + 1) % jugadores.length;
    } while (jugadores[turnoActual].eliminado); // Saltar jugadores eliminados

    actualizarInterfaz();
}

// Función para verificar el ganador
function verificarGanador() {
    const jugadoresVivos = jugadores.filter(jugador => !jugador.eliminado);
    if (jugadoresVivos.length === 1) {
        alert(`${jugadoresVivos[0].nombre} es el ganador!`);
        mostrarBotonReiniciar();
    } else if (mazo.length === 0) {
        let ganador = jugadoresVivos.reduce((prev, curr) => prev.getPuntosTotales() > curr.getPuntosTotales() ? prev : curr);
        alert(`${ganador.nombre} ha ganado con ${ganador.getPuntosTotales()} puntos!`);
        mostrarBotonReiniciar();
    }
}

// Función para mostrar el botón de reinicio
function mostrarBotonReiniciar() {
    document.getElementById('btnRobar').style.display = 'none';
    const btnReiniciar = document.createElement('button');
    btnReiniciar.textContent = 'Jugar de nuevo';
    btnReiniciar.onclick = reiniciarJuego;
    document.body.appendChild(btnReiniciar);
}

// Función para reiniciar el juego
function reiniciarJuego() {
    mazo = [];
    turnoActual = 0;
    jugadores.forEach(jugador => {
        jugador.eliminado = false;
        jugador.cartas = [];
    });
    iniciarJuego();
}

// Función para actualizar la interfaz
function actualizarInterfaz() {
    for (let i = 0; i < jugadores.length; i++) {
        document.getElementById(`J${i + 1}NumCartas`).textContent = `⚪️ Número de cartas: ${jugadores[i].cartas.length}`;
        document.getElementById(`J${i + 1}Puntos`).textContent = `⚪️ Puntos totales: ${jugadores[i].getPuntosTotales()}`;
    }
}

// Event listeners para los botones
document.getElementById('btnRobar').addEventListener('click', robarCarta);

// Iniciar el juego al cargar la página
iniciarJuego();
