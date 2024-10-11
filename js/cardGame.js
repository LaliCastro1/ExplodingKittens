function getRandomPathImg(tipoCarta) {
    if (tipoCarta.toLowerCase() === "puntos") { 
        let random = Math.floor(Math.random() * 20) + 1;
        return random < 10 ? `./img/card/robot_0${random}.png` : `./img/card/robot_${random}.png`;
    }

    if (tipoCarta.toLowerCase() === "bomba") {
        return './img/bomba/bomba.png'; 
    }
    if (tipoCarta.toLowerCase() === "herramienta") {
        return './img/herramienta/herramienta.png'; 
    }
    if (tipoCarta.toLowerCase() === "pasarturno") { 
        return './img/pasarTurno/pasarTurno.png';
    }

    return null; 
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
            this.baraja.push({ tipo: "bomba" });
        }
    
        for (let i = 0; i < 6; i++) {
            this.baraja.push({ tipo: "herramienta" });
        }
    
        for (let i = 0; i < 10; i++) {
            this.baraja.push({ tipo: "pasarTurno" }); 
        }
    
        for (let i = 0; i < 33; i++) {
            let valor = Math.floor(Math.random() * 10) + 1; 
            this.baraja.push({ tipo: "puntos", valor: valor });
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
    
        for (let carta of jugadorEliminado.cartas) {
            this.descartarCarta(carta.tipo);
        }

    
        let h2JugadorEliminado = document.getElementById(`J${jugadorEliminado.id}Nombre`);
        if (h2JugadorEliminado) {
            h2JugadorEliminado.style.color = "red";
        }
    
        this.jugadores.splice(indice, 1);
        
        this.turnoActual = (this.turnoActual + 1) % this.jugadores.length;
    
        if (this.jugadores.length === 1) {
            alert(`¡El jugador ${this.jugadores[0].id} ha ganado la partida!`);
            this.mostrarBotonReiniciar(); 
        } else {
            if (!this.jugadores[this.turnoActual]) {
                this.turnoActual = (this.turnoActual + 1) % this.jugadores.length; 
            }
        }
    }

    descartarCarta(tipoCarta) {
        const listaDescarte = document.getElementById('listaDescarte');
        
        const nuevaCarta = document.createElement('li');
        nuevaCarta.textContent = `Carta ${tipoCarta}`;
        
        listaDescarte.appendChild(nuevaCarta);
    }
    

    mostrarBotonReiniciar() {
        let btnPasar = document.getElementById("btnPasar");
        if (btnPasar) {
            btnPasar.remove();
        }
        
        let contenedorAcciones = document.getElementById("contenedorAcciones");
        let btnReiniciar = document.createElement("button");
        btnReiniciar.id = "btnReiniciar";
        btnReiniciar.textContent = "Reiniciar Juego";
        btnReiniciar.classList.add("btnAccion");
        contenedorAcciones.appendChild(btnReiniciar);
        
        btnReiniciar.addEventListener("click", () => {
            this.reiniciarJuego();
        });
    }
    

    comprobarBomba() {
        let jugadorActual = this.jugadores[this.turnoActual];
    
        if (this.cartaActual.tipo === "bomba") {
            if (jugadorActual.desactivacion > 0) {
                jugadorActual.desactivacion--;  
                alert(`¡Bomba desactivada! El jugador ${jugadorActual.id} ha usado una carta de desactivación.`);
                
                this.descartarCarta('bomba');
                this.descartarCarta('herramienta');
    
            } else {
                alert(`¡Bomba! El jugador ${jugadorActual.id} ha explotado y ha sido eliminado.`);
                
                this.descartarCarta('bomba');
                this.eliminarJugador(this.turnoActual); 
            }
        }
    }
    
   
    
    robarCarta() {
        if (this.baraja.length > 0) {
            this.cartaActual = this.baraja.shift(); 
            this.jugadores[this.turnoActual].cartas.push(this.cartaActual);
            this.jugadores[this.turnoActual].numCartas++;
            this.jugadores[this.turnoActual].cartaRobada = true;
    
            switch (this.cartaActual.tipo) {
                case "puntos":
                    this.jugadores[this.turnoActual].puntos += this.cartaActual.valor;
                    break;
                case "pasarTurno":  
                    this.jugadores[this.turnoActual].saltoTurno++;
                    break;
                case "herramienta":
                    this.jugadores[this.turnoActual].desactivacion++;
                    break;
                case "bomba":
                    this.comprobarBomba();
                    break;
            }
    
            let imgCartaRobada = document.getElementById('imgCartaRobada');
            imgCartaRobada.src = getRandomPathImg(this.cartaActual.tipo);
            imgCartaRobada.style.display = 'block'; 
    
            this.actualizarEstadisticas();
            this.pasarTurno();
        } else {
            alert("No hay más cartas en la baraja.");
        }
    }
    


pasarTurno() {
    if (this.jugadores.length === 0) {
        alert("No hay jugadores en el juego.");
        return;
    }

    let jugadorActual = this.jugadores[this.turnoActual];

    if (this.baraja.length === 0) {
        alert("¡Se han acabado las cartas de la baraja!");
        this.declararGanador();
        return; 
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

    if (!jugadorActual.cartaRobada && !jugadorActual.eliminado) {
        alert("No puedes pasar el turno si no has robado una carta.");
        return; 
    }

    this.turnoActual = (this.turnoActual + 1) % this.jugadores.length;
    this.resaltarTurnoJugador(); 
    this.jugadores[this.turnoActual].cartaRobada = false; 
    this.actualizarEstadisticas();  
}


declararGanador() {
    if (this.jugadores.length > 1) {
        let maxPuntos = Math.max(...this.jugadores.map(j => j.puntos));
        let ganadores = this.jugadores.filter(j => j.puntos === maxPuntos);
        
        if (ganadores.length === 1) {
            alert(`¡El jugador ${ganadores[0].id} ha ganado la partida por tener más puntos!`);
        } 
    }
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

    reiniciarJuego() {
        let btnReiniciar = document.getElementById("btnReiniciar");
        if (btnReiniciar) {
            btnReiniciar.remove();
        }
    
        location.reload();
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