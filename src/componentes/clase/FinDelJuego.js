import React from "react";

export default function FinDelJuego(grid1, grid2, puntajePj1, puntajePj2) {
  const isGrid1Full = grid1.every((cell) => cell !== null);
  const isGrid2Full = grid2.every((cell) => cell !== null);

  if (isGrid1Full || isGrid2Full) {
    let winner;
    if (puntajePj1 > puntajePj2) {
      winner = "Jugador 1";
    } else if (puntajePj2 > puntajePj1) {
      winner = "Jugador 2";
    } else {
      winner = "Empate";
    }

    // Usamos setTimeout para evitar múltiples alertas
    setTimeout(() => {
      alert(
        `¡Juego terminado! ${
          winner === "Empate" ? "Es un empate!" : `El ganador es: ${winner}`
        }`
      );
    }, 100);

    return true; // Indicamos que el juego ha terminado
  }

  return false; // El juego no ha terminado
}
