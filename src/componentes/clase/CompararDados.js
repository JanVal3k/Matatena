import React from "react";

export const compararYEliminarImagenes = (gridOrigen, gridDestino, columna) => {
  // Calculamos los índices de la columna seleccionada (0, 1 o 2)
  const indicesColumna = [columna, columna + 3, columna + 6];

  // Para las las imágenes no nulas de la columna en el grid de origen
  const imagenesOrigen = indicesColumna
    .map((index) => gridOrigen[index]) // Obtenemos los elementos segun los indices
    .filter((img) => img !== null); // Filtramos los elementos no nulos

  // Creamos una copia del grid de destino para no modificar el original
  const nuevoGridDestino = [...gridDestino];

  // Recorremos los índices de la columna en el grid de destino
  indicesColumna.forEach((index) => {
    const imagenDestino = nuevoGridDestino[index];
    // Verificamos si hay una imagen en esta posición y si coincide con alguna del origen
    if (
      imagenDestino &&
      imagenesOrigen.some((img) => img.id === imagenDestino.id)
    ) {
      // Si hay coincidencia, eliminamos la imagen (la reemplazamos por null)
      nuevoGridDestino[index] = null;
    }
  });

  // Devolvemos el grid de destino modificado
  return nuevoGridDestino;
};
