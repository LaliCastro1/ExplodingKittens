// Clase para el juego de cartas
class CardGame {
    constructor() {
        this.jugadores = [
            { id: 1, numCartas: 0, puntos: 0, saltoTurno: 0, desactivacion: 0, cartas: [], cartaRobada: false },
            { id: 2, numCartas: 0, puntos: 0, saltoTurno: 0, desactivacion: 0, cartas: [], cartaRobada: false },
            { id: 3, numCartas: 0, puntos: 0, saltoTurno: 0, desactivacion: 0, cartas: [], cartaRobada: false }
        ];
        this.baraja = [];
        this.cartaActual = null;
        this.turnoActual = 0;
    }

    // Inicializar el juego
    init() {
        this.crearBaraja();
        this.repartirCartas();
        this.actualizarEstadisticas();
    }

    // Crear la baraja de cartas
    crearBaraja() {
        // Crear cartas de bomba
        for (let i = 0; i < 6; i++) {
            this.baraja.push({ tipo: "Bomba" });
        }
        // Crear cartas de desactivación
        for (let i = 0; i < 6; i++) {
            this.baraja.push({ tipo: "Desactivacion" });
        }
        // Crear cartas de saltar turno
        for (let i = 0; i < 10; i++) {
            this.baraja.push({ tipo: "Saltar turno" });
        }
        // Crear cartas de puntos con valores del 1 al 10
        for (let i = 1; i <= 33; i++) {
            let valor = (i % 10) + 1; // Crea un valor de 1 a 10 en bucle
            this.baraja.push({ tipo: "Puntos", valor: valor });
        }
        // Mezcla la baraja
        this.baraja.sort(() => Math.random() - 0.5);
    }

    // Repartir cartas a los jugadores
    repartirCartas() {
        for (let jugador of this.jugadores) {
            jugador.numCartas = 5;
            jugador.cartas = [];
            for (let i = 0; i < 5; i++) {
                jugador.cartas.push(this.baraja.shift());
            }
        }
    }

    // Actualizar estadísticas del jugador actual
    actualizarEstadisticas() {
        let jugadorActual = this.jugadores[this.turnoActual];
        document.getElementById(`J${jugadorActual.id}NumCartas`).innerHTML = `⚪️ Número de cartas: ${jugadorActual.numCartas}`;
        document.getElementById(`J${jugadorActual.id}Puntos`).innerHTML = `⚪️ Puntos totales: ${jugadorActual.puntos}`;
        document.getElementById(`J${jugadorActual.id}saltoTurno`).innerHTML = `⚪️ Cartas salto turno: ${jugadorActual.saltoTurno}`;
        document.getElementById(`J${jugadorActual.id}Desactivacion`).innerHTML = `⚪️ Cartas desactivación: ${jugadorActual.desactivacion}`;
    }

    // Robar carta
    robarCarta() {
        if (this.baraja.length > 0) {
            this.cartaActual = this.baraja.shift();
            this.jugadores[this.turnoActual].cartas.push(this.cartaActual);
            this.jugadores[this.turnoActual].numCartas++;
            this.jugadores[this.turnoActual].cartaRobada = true; // Marcar que se ha robado una carta
            // Actualizar puntos totales
            if (this.cartaActual.tipo === "Puntos") {
                this.jugadores[this.turnoActual].puntos += this.cartaActual.valor;
            }
            // Actualizar cartas salto turno
            if (this.cartaActual.tipo === "Saltar turno") {
                this.jugadores[this.turnoActual].saltoTurno++;
            }
            // Actualizar cartas desactivación
            if (this.cartaActual.tipo === "Desactivacion") {
                this.jugadores[this.turnoActual].desactivacion++;
            }
            this.actualizarEstadisticas();
        } else {
            alert("No hay más cartas en la baraja.");
        }
    }

    // Pasar turno
    pasarTurno() {
        // Antes de pasar el turno, verificamos si se ha robado una carta
        let jugadorActual = this.jugadores[this.turnoActual];
        if (!jugadorActual.cartaRobada) {
            alert("No puedes pasar el turno si no has robado una carta.");
            return; // Salir de la función si no se ha robado carta
        }

        this.turnoActual = (this.turnoActual + 1) % this.jugadores.length; // Cambia al siguiente jugador
        alert(`Es el turno del jugador ${this.jugadores[this.turnoActual].id}`); // Notifica qué jugador es el actual
        // Reiniciar cartaRobada para el siguiente jugador
        this.jugadores[this.turnoActual].cartaRobada = false; 
        this.actualizarEstadisticas(); // Actualiza las estadísticas del nuevo jugador
    }

    // Gastar cartas desactivar
    gastarCartasDesactivar() {
        let jugadorActual = this.jugadores[this.turnoActual];
        if (jugadorActual.desactivacion > 0) {
            jugadorActual.desactivacion--;
            jugadorActual.puntos += 10;
            this.actualizarEstadisticas();
            alert("Se ha gastado una carta de desactivación");
        } else {
            alert("No tienes cartas de desactivación para gastar");
        }
    }

    // Gastar cartas salto turno
    gastarCartasSaltarTurno() {
        let jugadorActual = this.jugadores[this.turnoActual];
        // Verificar si se ha robado una carta
        if (!jugadorActual.cartaRobada) {
            alert("No puedes saltar el turno si no has robado una carta.");
            return; // Salir de la función si no se ha robado carta
        }
        if (jugadorActual.saltoTurno > 0) {
            jugadorActual.saltoTurno--;
            jugadorActual.cartaRobada = false; // Resetear la carta robada al usar la carta de salto
            this.pasarTurno(); // Llamar a pasarTurno() después de gastar la carta
            this.actualizarEstadisticas();
            alert("Se ha gastado una carta de salto turno");
        } else {
            alert("No tienes cartas de salto turno para gastar");
        }
    }

    // Obtener puntos totales
    getPuntos() {
        let puntosTotales = 0;
        for (let jugador of this.jugadores) {
            puntosTotales += jugador.puntos;
        }
        return puntosTotales;
    }

    // Comprobar si el juego ha terminado
    comprobarFinJuego() {
        let puntosTotales = this.getPuntos();
        if (puntosTotales >= 100) {
            alert("El juego ha terminado. El jugador con más puntos ha ganado");
            return true;
        }
        return false;
    }
}

// Instanciar el juego
let juego = new CardGame();
juego.init();

// Agregar evento de click al botón de robar carta
document.getElementById("btnRobar").addEventListener("click", function() {
    juego.robarCarta();
});

// Agregar evento de click al botón de pasar turno
document.getElementById("btnPasar").addEventListener("click", function() {
    juego.pasarTurno();
});

// Agregar evento de click al botón de gastar cartas desactivar
document.getElementById("btnGastarDesactivar").addEventListener("click", function() {
    juego.gastarCartasDesactivar();
});

// Agregar evento de click al botón de gastar cartas salto turno
document.getElementById("btnGastarSaltarTurno").addEventListener("click", function() {
    juego.gastarCartasSaltarTurno();
});

// Comprobar si el juego ha terminado cada segundo
setInterval(function() {
    if (juego.comprobarFinJuego()) {
        // Reiniciar el juego
        juego.init();
    }
}, 1000);
