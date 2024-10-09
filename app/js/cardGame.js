function getRandomPathImg() {
    let random = Math.floor(Math.random() * 20) + 1;
    if (random < 10) {
        return `./img/card/robot_0${random}.png`;
    }
    return `./img/card/robot_${random}.png`;
}

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

    init() {
        this.crearBaraja();
        this.repartirCartas();
        this.actualizarEstadisticas();
    }

    crearBaraja() {
        for (let i = 0; i < 6; i++) {
            this.baraja.push({ tipo: "Bomba" });
        }
        for (let i = 0; i < 6; i++) {
            this.baraja.push({ tipo: "Desactivacion" });
        }
        for (let i = 0; i < 10; i++) {
            this.baraja.push({ tipo: "Saltar turno" });
        }
        for (let i = 1; i <= 33; i++) {
            let valor = (i % 10) + 1; 
            this.baraja.push({ tipo: "Puntos", valor: valor });
        }
        this.baraja.sort(() => Math.random() - 0.5);
    }

    repartirCartas() {
        for (let jugador of this.jugadores) {
            jugador.numCartas = 5;
            jugador.cartas = [];
            for (let i = 0; i < 5; i++) {
                jugador.cartas.push(this.baraja.shift());
            }
        }
    }

     actualizarEstadisticas() {
        let jugadorActual = this.jugadores[this.turnoActual];
        document.getElementById(`J${jugadorActual.id}NumCartas`).innerHTML = `⚪️ Número de cartas: ${jugadorActual.numCartas}`;
        document.getElementById(`J${jugadorActual.id}Puntos`).innerHTML = `⚪️ Puntos totales: ${jugadorActual.puntos}`;
        document.getElementById(`J${jugadorActual.id}saltoTurno`).innerHTML = `⚪️ Cartas salto turno: ${jugadorActual.saltoTurno}`;
        document.getElementById(`J${jugadorActual.id}Desactivacion`).innerHTML = `⚪️ Cartas desactivación: ${jugadorActual.desactivacion}`;
    }
    eliminarJugador(indice) {
        let jugadorEliminado = this.jugadores[indice];
        
        // Mover todas las cartas del jugador eliminado a la pila de descarte
        for (let carta of jugadorEliminado.cartas) {
            this.descartarCarta(carta.tipo);
        }
        
        let h2JugadorEliminado = document.getElementById(`J${jugadorEliminado.id}Nombre`);
        if (h2JugadorEliminado) {
            h2JugadorEliminado.style.color = "red";
        }
        
        this.jugadores.splice(indice, 1);
        
        if (this.turnoActual >= this.jugadores.length) {
            this.turnoActual = 0; 
        }
        
        // Si queda un solo jugador, este gana y se finaliza el juego
        if (this.jugadores.length === 1) {
            alert(`¡El jugador ${this.jugadores[0].id} ha ganado la partida!`);
            this.mostrarBotonReiniciar(); // Llama a la función para cambiar los botones
        }
    }

    mostrarBotonReiniciar() {
        // Elimina el botón "Pasar Turno"
        let btnPasar = document.getElementById("btnPasar");
        if (btnPasar) {
            btnPasar.remove();
        }
        
        // Crea el botón "Reiniciar Juego"
        let contenedorAcciones = document.getElementById("contenedorAcciones");
        let btnReiniciar = document.createElement("button");
        btnReiniciar.id = "btnReiniciar";
        btnReiniciar.textContent = "Reiniciar Juego";
        btnReiniciar.classList.add("btnAccion");
        contenedorAcciones.appendChild(btnReiniciar);
        
        // Añade el evento de reinicio
        btnReiniciar.addEventListener("click", () => {
            this.reiniciarJuego();
        });
    }
    reiniciarJuego() {
        // Elimina el botón de "Reiniciar Juego"
        let btnReiniciar = document.getElementById("btnReiniciar");
        if (btnReiniciar) {
            btnReiniciar.remove();
        }
    
        // Reinicia el juego
        location.reload();
    }
    
    
    
    

    comprobarBomba() {
        let jugadorActual = this.jugadores[this.turnoActual];
    
        if (this.cartaActual.tipo === "Bomba") {
            if (jugadorActual.desactivacion > 0) {
                // Usar una carta de desactivación
                jugadorActual.desactivacion--;  
                alert(`¡Bomba desactivada! El jugador ${jugadorActual.id} ha usado una carta de desactivación.`);
                
                // Descartar la carta de bomba y la carta de desactivación
                this.descartarCarta('Bomba');
                this.descartarCarta('Desactivacion');
    
            } else {
                // El jugador no tiene desactivación, es eliminado
                alert(`¡Bomba! El jugador ${jugadorActual.id} ha explotado y ha sido eliminado.`);
                
                // Descartar la carta de bomba antes de eliminar al jugador
                this.descartarCarta('Bomba');
                this.eliminarJugador(this.turnoActual); 
            }
        }
    }
    
    descartarCarta(tipoCarta) {
        const listaDescarte = document.getElementById('listaDescarte');
        
        // Crear el elemento de carta descartada
        const nuevaCarta = document.createElement('li');
        nuevaCarta.textContent = `Carta ${tipoCarta}`;
        
        // Añadir la carta a la lista de descarte
        listaDescarte.appendChild(nuevaCarta);
    }
    
robarCarta() {
    if (this.baraja.length > 0) {
        this.cartaActual = this.baraja.shift();
        this.jugadores[this.turnoActual].cartas.push(this.cartaActual);
        this.jugadores[this.turnoActual].numCartas++;
        this.jugadores[this.turnoActual].cartaRobada = true; 

      
        if (this.cartaActual.tipo === "Puntos") {
            this.jugadores[this.turnoActual].puntos += this.cartaActual.valor;
        }
      
        if (this.cartaActual.tipo === "Saltar turno") {
            this.jugadores[this.turnoActual].saltoTurno++;
        }
       
        if (this.cartaActual.tipo === "Desactivacion") {
            this.jugadores[this.turnoActual].desactivacion++;
        }

        if (this.cartaActual.tipo === "Bomba") {
            this.comprobarBomba();
        }
        

       
        let imgCartaRobada = document.getElementById('imgCartaRobada');
        imgCartaRobada.src = `img/cartas/${this.cartaActual.tipo.toLowerCase()}.png`;
        imgCartaRobada.style.display = 'block'; 

        this.actualizarEstadisticas();

   
        this.pasarTurno();
    } else {
        alert("No hay más cartas en la baraja.");
    }
}


pasarTurno() {
    let jugadorActual = this.jugadores[this.turnoActual];

    if (this.baraja.length === 0) {
        alert("¡Se han acabado las cartas de la baraja!");
    }

    if (jugadorActual.saltoTurno > 0 && !jugadorActual.cartaRobada) {
        let usarCartaSalto = confirm("Tienes una carta de salto de turno. ¿Quieres usarla para pasar el turno sin robar?");
        if (usarCartaSalto) {
            jugadorActual.saltoTurno--;  
            this.turnoActual = (this.turnoActual + 1) % this.jugadores.length;
            this.resaltarTurnoJugador(); 
            this.jugadores[this.turnoActual].cartaRobada = false; 
            this.actualizarEstadisticas();  
            return; 
        }
    }

    if (!jugadorActual.cartaRobada) {
        alert("No puedes pasar el turno si no has robado una carta.");
        return; 
    }

    this.turnoActual = (this.turnoActual + 1) % this.jugadores.length;
    this.resaltarTurnoJugador(); 
    this.jugadores[this.turnoActual].cartaRobada = false; 
    this.actualizarEstadisticas();  
}

resaltarTurnoJugador() {
    for (let jugador of this.jugadores) {
        let h2Jugador = document.getElementById(`J${jugador.id}Nombre`);
        if (h2Jugador) {
            h2Jugador.style.color = "black"; 
        }
    }

    let h2JugadorActual = document.getElementById(`J${this.jugadores[this.turnoActual].id}Nombre`);
    if (h2JugadorActual) {
        h2JugadorActual.style.color = "yellow"; 
    }
}


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
    
        if (jugadorActual.saltoTurno > 0 && !jugadorActual.cartaRobada) {
            jugadorActual.saltoTurno--; 
            this.pasarTurno();  
        } else if (jugadorActual.cartaRobada) {
            alert("No puedes usar la carta de salto después de haber robado.");
        } else {
            alert("No tienes cartas de salto de turno.");
        }
    }
    

    getPuntos() {
        let puntosTotales = 0;
        for (let jugador of this.jugadores) {
            puntosTotales += jugador.puntos;
        }
        return puntosTotales;
    }

    comprobarFinJuego() {
        let puntosTotales = this.getPuntos();
        if (puntosTotales >= 100) {
            alert("El juego ha terminado. El jugador con más puntos ha ganado");
            return true;
        }
        return false;
    }
}

let juego = new CardGame();
juego.init();

document.getElementById("btnRobar").addEventListener("click", function() {
    juego.robarCarta(); 
    document.getElementById('imgCartaRobada').src = getRandomPathImg(); 
});


document.getElementById("btnPasar").addEventListener("click", function() {
    juego.pasarTurno();
});

document.getElementById("btnGastarDesactivar").addEventListener("click", function() {
    juego.gastarCartasDesactivar();
});

document.getElementById("btnGastarSaltarTurno").addEventListener("click", function() {
    juego.gastarCartasSaltarTurno();
});

document.getElementById("btnPasar").addEventListener("click", function() {
    puedePasarTurno();
});



setInterval(function() {
    if (juego.comprobarFinJuego()) {
        juego.init();
    }
}, 1000);