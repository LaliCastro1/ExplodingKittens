function getRandomPathImg() {
    let random = Math.floor(Math.random() * 20) + 1;
    if (random < 10) {
        return `./img/card/robot_0${random}.png`;
    }
    return `./img/card/robot_${random}.png`;
}

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

// Eliminar jugador y enviar sus cartas a la pila de descarte
eliminarJugador(idJugador) {
    let index = this.jugadores.findIndex(jugador => jugador.id === idJugador);
    
    if (index !== -1) {
        let jugadorEliminado = this.jugadores.splice(index, 1)[0]; // Eliminar el jugador
        
        // Mover todas sus cartas a la pila de descartes
        this.pilaDescartes.push(...jugadorEliminado.cartas);
        
        alert(`El jugador ${jugadorEliminado.id} ha sido eliminado. Sus cartas fueron descartadas.`);
    }
}


    comprobarBomba() {
        let jugadorActual = this.jugadores[this.turnoActual];
        
        if (this.cartaActual.tipo === "Bomba") {
            // Comprobar si el jugador tiene cartas de desactivación
            if (jugadorActual.desactivacion > 0) {
                // El jugador desactiva la bomba
                jugadorActual.desactivacion--; // Usar una carta de desactivación
                this.pilaDescartes.push(this.cartaActual); // Agregar bomba a la pila de descarte
                alert(`¡Bomba! El jugador ${jugadorActual.id} ha explotado, pero se ha salvado gracias a la carta de desactivación.`);
            } else {
                // Si no tiene desactivación, el jugador queda eliminado
                alert(`¡Bomba! El jugador ${jugadorActual.id} ha explotado y ha sido eliminado.`);
                this.eliminarJugador(jugadorActual.id);
            }
        }
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

        // Asignar la imagen de la carta robada al elemento imgCartaRobada
        let imgCartaRobada = document.getElementById('imgCartaRobada');
        imgCartaRobada.src = `img/cartas/${this.cartaActual.tipo.toLowerCase()}.png`;
        imgCartaRobada.style.display = 'block'; // Asegúrate de mostrar la imagen

        this.actualizarEstadisticas();

        // Pasar el turno automáticamente después de robar
        this.pasarTurno();
    } else {
        alert("No hay más cartas en la baraja.");
    }
}

pasarTurno() {
    let jugadorActual = this.jugadores[this.turnoActual];

    // Verificar si el jugador tiene cartas de salto de turno y aún no ha robado
    if (jugadorActual.saltoTurno > 0 && !jugadorActual.cartaRobada) {
        let usarCartaSalto = confirm("Tienes una carta de salto de turno. ¿Quieres usarla para pasar el turno sin robar?");
        if (usarCartaSalto) {
            // Gasta la carta de salto inmediatamente después de confirmar
            jugadorActual.saltoTurno--;  // Restar una carta de salto de turno
            // Cambiar al siguiente jugador
            this.turnoActual = (this.turnoActual + 1) % this.jugadores.length;
            this.resaltarTurnoJugador(); // Resaltar el turno del nuevo jugador
            this.jugadores[this.turnoActual].cartaRobada = false;  // Reiniciar cartaRobada para el siguiente jugador
            this.actualizarEstadisticas();  // Actualiza las estadísticas del nuevo jugador
            return; // Salir de la función
        }
    }

    // Verificar si el jugador ya robó una carta
    if (!jugadorActual.cartaRobada) {
        alert("No puedes pasar el turno si no has robado una carta.");
        return; // Salir de la función si no ha robado
    }

    // Si el jugador ha robado, simplemente pasa el turno
    this.turnoActual = (this.turnoActual + 1) % this.jugadores.length;
    this.resaltarTurnoJugador(); // Resaltar el turno del nuevo jugador
    this.jugadores[this.turnoActual].cartaRobada = false; // Reiniciar cartaRobada para el siguiente jugador
    this.actualizarEstadisticas();  // Actualizar las estadísticas del nuevo jugador
}

// Nueva función para resaltar el h2 del jugador actual
resaltarTurnoJugador() {
    // Reiniciar el color del h2 de todos los jugadores
    for (let jugador of this.jugadores) {
        let h2Jugador = document.getElementById(`J${jugador.id}Nombre`);
        if (h2Jugador) {
            h2Jugador.style.color = "black"; // Reiniciar a negro
        }
    }

    // Resaltar el h2 del jugador actual
    let h2JugadorActual = document.getElementById(`J${this.jugadores[this.turnoActual].id}Nombre`);
    if (h2JugadorActual) {
        h2JugadorActual.style.color = "yellow"; // Resaltar a amarillo
    }
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

    gastarCartasSaltarTurno() {
        let jugadorActual = this.jugadores[this.turnoActual];
    
        // Verificar si el jugador tiene cartas de salto y si no ha robado
        if (jugadorActual.saltoTurno > 0 && !jugadorActual.cartaRobada) {
            jugadorActual.saltoTurno--;  // Restar una carta de salto de turno inmediatamente
            this.pasarTurno();  // Pasar el turno al siguiente jugador
        } else if (jugadorActual.cartaRobada) {
            alert("No puedes usar la carta de salto después de haber robado.");
        } else {
            alert("No tienes cartas de salto de turno.");
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
    juego.robarCarta(); // Llama a la función robarCarta del juego
    document.getElementById('imgCartaRobada').src = getRandomPathImg(); // Cambia la imagen de la carta robada
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

document.getElementById("btnPasar").addEventListener("click", function() {
    puedePasarTurno();
});



// Comprobar si el juego ha terminado cada segundo
setInterval(function() {
    if (juego.comprobarFinJuego()) {
        // Reiniciar el juego
        juego.init();
    }
}, 1000);