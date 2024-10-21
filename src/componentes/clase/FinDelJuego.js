import React, { useState, useEffect } from "react";

const FinDelJuego = ({ grid1, grid2, puntajePj1, puntajePj2, onReiniciar }) => {
  const [isOpen, setIsOpen] = useState(false);

  const verificarFinDelJuego = () => {
    const isGrid1Full = grid1.every((cell) => cell !== null);
    const isGrid2Full = grid2.every((cell) => cell !== null);

    if (isGrid1Full || isGrid2Full) {
      console.log("a ver depuramos inicial");
      let winner;
      if (puntajePj1 > puntajePj2) {
        winner = "Jugador 1";
        console.log("a ver depuramos jugador 1 gano");
      } else if (puntajePj2 > puntajePj1) {
        console.log("a ver depuramos jugador 2 gano");
        winner = "Jugador 2";
      } else {
        console.log("a ver depuramos empate");
        winner = "Empate";
      }

      return { terminado: true, winner };
    }

    return { terminado: false, winner: null };
  };

  useEffect(() => {
    const { terminado } = verificarFinDelJuego();
    if (terminado) {
      setIsOpen(true);
      console.log("Depuracion del useEffect terminado = a true");
    }
  }, [grid1, grid2, puntajePj1, puntajePj2]);

  const { winner } = verificarFinDelJuego();

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
