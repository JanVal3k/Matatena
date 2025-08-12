import React from "react";

export function iaMover(
  dificultad = "normal",
  imagen,
  gridIA = [],
  gridOponente = []
) {
  console.log("🤖 iaMover llamado con:");
  console.log("  - dificultad:", dificultad);
  console.log("  - imagen:", imagen);
  console.log("  - gridIA:", gridIA);
  console.log("  - gridOponente:", gridOponente);

  if (dificultad === "facil") {
    console.log("🟢 Modo FÁCIL");
    const libres = [];
    for (let i = 0; i < gridIA.length; i++) {
      if (gridIA[i] === null) libres.push(i);
    }
    console.log("📋 Casillas libres:", libres);

    if (libres.length === 0) {
      console.log("❌ No hay casillas libres");
      return undefined;
    }

    const indiceAleatorio = Math.floor(Math.random() * libres.length);
    const resultado = libres[indiceAleatorio];
    console.log("🎯 IA elige casilla:", resultado);
    return resultado;
  }

  if (dificultad === "normal") {
    console.log("🟡 Modo NORMAL");
    const libres = [];
    for (let i = 0; i < gridIA.length; i++) {
      if (gridIA[i] === null) libres.push(i);
    }
    console.log("📋 Casillas libres:", libres);

    if (libres.length === 0) {
      console.log("❌ No hay casillas libres");
      return undefined;
    }

    const seguros = libres.filter((i) => {
      const col = i % 3;
      return !gridOponente.some(
        (cell, idx) => idx % 3 === col && cell?.id === imagen.id
      );
    });
    console.log("🛡️ Casillas seguras:", seguros);

    const elegirAleatorio = (arr) =>
      arr[Math.floor(Math.random() * arr.length)];

    const resultado = seguros.length
      ? elegirAleatorio(seguros)
      : elegirAleatorio(libres);
    console.log("🎯 IA elige casilla:", resultado);
    return resultado;
  }

  if (dificultad === "dificil") {
    console.log("🔴 Modo DIFÍCIL");
    const libres = [];
    for (let i = 0; i < gridIA.length; i++) {
      if (gridIA[i] === null) libres.push(i);
    }
    console.log("📋 Casillas libres:", libres);

    if (libres.length === 0) {
      console.log("❌ No hay casillas libres");
      return undefined;
    }

    let mejorValor = -Infinity;
    let mejoresCasillas = [];

    for (let indice of libres) {
      const col = indice % 3;
      const puntos = puntosEliminablesEnColumna(imagen, col, gridOponente);
      console.log(
        `  Casilla ${indice} (col ${col}): ${puntos} puntos eliminables`
      );

      if (puntos > mejorValor) {
        mejorValor = puntos;
        mejoresCasillas = [indice];
      } else if (puntos === mejorValor) {
        mejoresCasillas.push(indice);
      }
    }
    console.log(
      "🏆 Mejores casillas:",
      mejoresCasillas,
      "con",
      mejorValor,
      "puntos"
    );

    const indiceAleatorio = Math.floor(Math.random() * mejoresCasillas.length);
    const resultado = mejoresCasillas[indiceAleatorio];
    console.log("🎯 IA elige casilla:", resultado);
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
