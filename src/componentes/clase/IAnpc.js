import React from "react";

export function iaMover(
  dificultad = "normal",
  imagen,
  gridIA = [],
  gridOponente = []
) {
  if (dificultad === "facil") {
    const libres = [];
    for (let i = 0; i < gridIA.length; i++) {
      if (gridIA[i] === null) libres.push(i);
    }

    if (libres.length === 0) {
      return undefined;
    }

    const indiceAleatorio = Math.floor(Math.random() * libres.length);
    const resultado = libres[indiceAleatorio];

    return resultado;
  }

  if (dificultad === "normal") {
    const libres = [];
    for (let i = 0; i < gridIA.length; i++) {
      if (gridIA[i] === null) libres.push(i);
    }

    if (libres.length === 0) {
      return undefined;
    }

    const seguros = libres.filter((i) => {
      const col = i % 3;
      return !gridOponente.some(
        (cell, idx) => idx % 3 === col && cell?.id === imagen.id
      );
    });

    const elegirAleatorio = (arr) =>
      arr[Math.floor(Math.random() * arr.length)];

    const resultado = seguros.length
      ? elegirAleatorio(seguros)
      : elegirAleatorio(libres);

    return resultado;
  }

  if (dificultad === "dificil") {
    const libres = [];
    for (let i = 0; i < gridIA.length; i++) {
      if (gridIA[i] === null) libres.push(i);
    }

    if (libres.length === 0) {
      return undefined;
    }

    let mejorValor = -Infinity;
    let mejoresCasillas = [];

    for (let indice of libres) {
      const col = indice % 3;
      const puntos = puntosEliminablesEnColumna(imagen, col, gridOponente);

      if (puntos > mejorValor) {
        mejorValor = puntos;
        mejoresCasillas = [indice];
      } else if (puntos === mejorValor) {
        mejoresCasillas.push(indice);
      }
    }

    const indiceAleatorio = Math.floor(Math.random() * mejoresCasillas.length);
    const resultado = mejoresCasillas[indiceAleatorio];

    return resultado;
  }
}
function puntosEliminablesEnColumna(imagen, col = 0, gridOponente = []) {
  if (!imagen || imagen.id === undefined) return 0;
  let puntos = 0;

  for (let fila = 0; fila < 3; fila++) {
    const idx = col + fila * 3;
    const cell = gridOponente[idx];
    if (cell && cell.id !== undefined) {
      if (String(cell.id) === String(imagen.id)) {
        puntos += Number(cell.id) || 0;
      }
    }
  }
  return puntos;
}
