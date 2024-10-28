import React, { useState, useEffect } from "react";

const FinDelJuego = ({ grid1, grid2, puntajePj1, puntajePj2, onReiniciar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const verificarFinDelJuego = () => {
      const isGrid1Full = grid1.every((cell) => cell !== null);
      const isGrid2Full = grid2.every((cell) => cell !== null);

      if (isGrid1Full || isGrid2Full) {
        let ganador;
        if (puntajePj1 > puntajePj2) {
          ganador = "Jugador 1";
        } else if (puntajePj2 > puntajePj1) {
          ganador = "Jugador 2";
        } else {
          ganador = "Empate";
        }

        return { terminado: true, ganador };
      }

      return { terminado: false, ganador: null };
    };

    const { terminado, ganador } = verificarFinDelJuego();
    if (terminado) {
      setWinner(ganador);
      setIsOpen(true);
    }
  }, [grid1, grid2, puntajePj1, puntajePj2]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 transform transition-all">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Fin del juego</h2>
          <p className="text-lg text-gray-600 text-center">
            {winner === "Empate"
              ? "¡Vaya es un empate!"
              : `Felicidades el ganador es: ${winner}`}
          </p>
          <button
            onClick={() => {
              onReiniciar();
              setIsOpen(false);
              setWinner(null);
            }}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinDelJuego;
