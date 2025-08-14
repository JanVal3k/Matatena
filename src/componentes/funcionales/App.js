import React, { useState, useEffect, useCallback, useRef } from "react";
import "../../styles/styles.css";
import style from "../../styles/background.module.css";
import DivPjs from "./DivPjUno";
import { compararYEliminarImagenes } from "../clase/CompararDados";
import ImagenRandom from "../clase/imagenRamdom";
import FinDelJuego from "../clase/FinDelJuego";
import PopOver from "./Popover";
import { iaMover } from "../clase/IAnpc";

export default function App() {
  const [imagenPj1, setImagenPj1] = useState({});
  const [imagenPj2, setImagenPj2] = useState({});
  const [grid1, setGrid1] = useState(Array(9).fill(null));
  const [grid2, setGrid2] = useState(Array(9).fill(null));
  const [puntajePj1, setPuntajePj1] = useState(0);
  const [puntajePj2, setPuntajePj2] = useState(0);
  const [needsUpdatePj1, setNeedsUpdatePj1] = useState(false);
  const [needsUpdatePj2, setNeedsUpdatePj2] = useState(false);
  const iteracionesRef = useRef(0);
  const intervaloRef = useRef(null);
  const seleccionDePj = useRef(0);
  const [popOverProps, setPopOverProps] = useState({
    isOpen: false,
    tittle: "",
    message: "",
  });
  const [showFinDelJuego, setShowFinDelJuego] = useState(false);
  const [isIAInitialTurn, setIsIAInitialTurn] = useState(false);
  // ---- IA: settings + pending ref ----
  const [aiDifficulty, setAiDifficulty] = useState("facil");
  const iaPendingRef = useRef(false); // si true, cuando llegue imagenPj2 la IA jugará

  const generarImagenPj1 = useCallback(() => setNeedsUpdatePj1(true), []);
  const generarImagenPj2 = useCallback(() => setNeedsUpdatePj2(true), []);

  const cacularPuntaje = (grid) =>
    grid.reduce((sum, cell) => sum + (cell ? parseInt(cell.id) : 0), 0);

  useEffect(() => {
    setPuntajePj1(cacularPuntaje(grid1));
    setPuntajePj2(cacularPuntaje(grid2));
    const isGrid1Full = grid1.every((cell) => cell !== null);
    const isGrid2Full = grid2.every((cell) => cell !== null);
    if (isGrid1Full || isGrid2Full) {
      handleClick2();
      setShowFinDelJuego(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid1, grid2]);

  const handleClick = useCallback(() => {
    console.log("🎮 JUGAR clicked");
    if (intervaloRef.current) clearInterval(intervaloRef.current);
    seleccionDePj.current = Math.floor(Math.random() * 2);
    console.log(
      "🎲 Quien inicia:",
      seleccionDePj.current === 0 ? "Jugador" : "IA"
    );
    iteracionesRef.current = 0;

    const generarImagenesConLimite = () => {
      if (iteracionesRef.current < 6) {
        console.log(`🔄 Iteración ${iteracionesRef.current + 1}/6`);
        seleccionDePj.current === 0 ? generarImagenPj1() : generarImagenPj2();
        iteracionesRef.current++;
      } else {
        console.log("✅ Generación completada");
        clearInterval(intervaloRef.current);

        // Si la IA inició, marcar que es su turno inicial
        if (seleccionDePj.current === 1) {
          console.log("🤖 Marcando turno inicial de IA");
          setIsIAInitialTurn(true);
        }
      }
    };

    intervaloRef.current = setInterval(generarImagenesConLimite, 250);
  }, [generarImagenPj1, generarImagenPj2]);

  const handleClick2 = useCallback(() => {
    setPopOverProps({
      isOpen: true,
      tittle: "Reiniciando juego...",
      message: "Si quiere iniciar de nuevo dale en 'jugar'",
    });
  }, []);

  const handleClick3 = useCallback(() => {
    setPopOverProps({
      isOpen: true,
      tittle: "COMO JUGAR!",
      message:
        "1. Se suman puntos dependiendo del valor de cada cara del dado.\n" +
        "2. Se eliminan puntos del contrincante cuando: Se pone una cara de dado en la columna paralela y del mismo valor de esta.\n" +
        "3. El juego termina cuando se complete uno de los tableros.\n" +
        "4. El GANADOR será quien tenga mayor puntaje.",
    });
  }, []);

  const handleClosePopOver = useCallback(() => {
    setPopOverProps((prev) => ({ ...prev, isOpen: false }));
    setShowFinDelJuego(false);
    setImagenPj1({});
    setImagenPj2({});
    setGrid1(Array(9).fill(null));
    setGrid2(Array(9).fill(null));
    setPuntajePj1(0);
    setPuntajePj2(0);
    setNeedsUpdatePj1(false);
    setNeedsUpdatePj2(false);
    iteracionesRef.current = 0;
    intervaloRef.current = null;
    seleccionDePj.current = 0;
  }, []);

  const handleDragStart = (e, imagen, sourceGrid) => {
    e.dataTransfer.setData("imagen", JSON.stringify(imagen));
    e.dataTransfer.setData("sourceGrid", sourceGrid);
  };

  const handleDragOver = (e) => e.preventDefault();

  // ---------------------
  // Cuando imagenPj2 cambia y hay IA pendiente, la IA juega aquí.
  // Reemplaza tu useEffect actual con este:

  useEffect(() => {
    console.log("🔄 useEffect imagenPj2 disparado");
    console.log("  - iaPendingRef.current:", iaPendingRef.current);
    console.log("  - isIAInitialTurn:", isIAInitialTurn);
    console.log("  - imagenPj2:", imagenPj2);

    // Caso 1: IA pendiente (turnos normales) - CON DELAY
    if (iaPendingRef.current && imagenPj2?.DadoImg) {
      console.log("🤖 IA jugando turno normal (con delay para animación)");

      // Agregar delay para que se vea la animación
      setTimeout(() => {
        const iaIndex = iaMover(aiDifficulty, imagenPj2, grid2, grid1);
        if (iaIndex !== undefined && iaIndex !== null) {
          handleDropIA(imagenPj2, iaIndex);
        } else {
          generarImagenPj1();
        }
        iaPendingRef.current = false;
      }, 1000); // 1 segundo para ver la animación - ajusta este valor según necesites
    }

    // Caso 2: IA turno inicial (mantener sin delay o con menos delay)
    else if (isIAInitialTurn && imagenPj2?.DadoImg) {
      console.log("🤖 IA jugando turno inicial");

      // Pequeño delay también aquí si quieres (opcional)
      setTimeout(() => {
        const iaIndex = iaMover(aiDifficulty, imagenPj2, grid2, grid1);
        console.log("🎯 iaMover retornó índice:", iaIndex);

        if (iaIndex !== undefined && iaIndex !== null) {
          console.log("🚀 Ejecutando handleDropIA con índice:", iaIndex);
          handleDropIA(imagenPj2, iaIndex);
        } else {
          console.log(
            "❌ No hay movimiento válido, generando imagen para jugador"
          );
          generarImagenPj1();
        }

        // Resetear el estado
        setIsIAInitialTurn(false);
      }, 800); // Menos delay en el turno inicial si quieres
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagenPj2, isIAInitialTurn]);

  // ---------------------
  const handleDrop = (e, gridIndex, targetGrid) => {
    e.preventDefault();
    const imagen = JSON.parse(e.dataTransfer.getData("imagen"));
    const sourceGrid = e.dataTransfer.getData("sourceGrid");

    // Verificamos si el arrastre es válido
    if (
      ((sourceGrid === "div1" && targetGrid === 1) ||
        (sourceGrid === "div6" && targetGrid === 2)) &&
      (targetGrid === 1 ? grid1[gridIndex] === null : grid2[gridIndex] === null)
    ) {
      const columna = gridIndex % 3;
      let newGrid1 = [...grid1];
      let newGrid2 = [...grid2];

      if (targetGrid === 1) {
        // El jugador 1 coloca
        newGrid1[gridIndex] = imagen;
        newGrid2 = compararYEliminarImagenes(newGrid1, newGrid2, columna);

        setGrid1(newGrid1);
        setGrid2(newGrid2);

        // Verificar si el juego terminó
        const isGrid1Full = newGrid1.every((cell) => cell !== null);
        const isGrid2Full = newGrid2.every((cell) => cell !== null);

        if (!isGrid1Full && !isGrid2Full) {
          iaPendingRef.current = true;
          setTimeout(() => {
            generarImagenPj2();
          }, 500);
        }
      } else {
        newGrid2[gridIndex] = imagen;
        newGrid1 = compararYEliminarImagenes(newGrid2, newGrid1, columna);

        setGrid1(newGrid1);
        setGrid2(newGrid2);

        const isGrid1Full = newGrid1.every((cell) => cell !== null);
        const isGrid2Full = newGrid2.every((cell) => cell !== null);

        if (!isGrid1Full && !isGrid2Full) {
          generarImagenPj1();
        }
      }
    }
  };
  const handleDropIA = (imagen, gridIndex) => {
    if (!imagen?.DadoImg) return;
    const columna = gridIndex % 3;
    let newGrid2 = [...grid2];
    let newGrid1 = [...grid1];

    newGrid2[gridIndex] = imagen;
    newGrid1 = compararYEliminarImagenes(newGrid2, newGrid1, columna);
    setGrid1(newGrid1);
    setGrid2(newGrid2);

    setImagenPj2({});

    const isGrid1Full = newGrid1.every((cell) => cell !== null);
    const isGrid2Full = newGrid2.every((cell) => cell !== null);

    if (!isGrid1Full && !isGrid2Full) {
      console.log("🤖 IA generará nueva imagen para su próximo turno");
      setTimeout(() => {
        generarImagenPj1();
      }, 500);
    }
  };
  const handleDifficultyChange = useCallback((e) => {
    setAiDifficulty(e.target.value);
  }, []);
  //------------------------------------------
  const renderGrid = (grid, playerGrid) =>
    grid.map((cell, index) => (
      <div
        key={index}
        className="flex justify-center shadow-xl rounded-2xl border-2 items-center w-full h-full"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, index, playerGrid)}
      >
        {cell && (
          <img
            className="max-w-[90%] max-h-[90%] object-contain"
            src={cell.DadoImg}
            alt={`Imagen ${cell.id}`}
            draggable={false}
          />
        )}
      </div>
    ));

  return (
    <>
      <div
        className={`grid grid-cols-7 grid-rows-8 gap-2 p-2 border-solid border-4 border-gray-200 rounded-2xl shadow-2xl w-[95vmin] h-[95vmin] max-w-[1000px] max-h-[1000px] ${style.fondoEstrellas}`}
      >
        {needsUpdatePj1 && (
          <ImagenRandom
            onImagenesGeneradas={(img) => {
              setImagenPj1(img);
              setNeedsUpdatePj1(false);
            }}
          />
        )}
        {needsUpdatePj2 && (
          <ImagenRandom
            onImagenesGeneradas={(img) => {
              setImagenPj2(img);
              setNeedsUpdatePj2(false);
            }}
          />
        )}
        <div
          className="flex items-center justify-center col-start-1 row-start-7 col-span-2 row-span-2 bg-rose-300 rounded-lg h-full w-full"
          onDragStart={(e) => handleDragStart(e, imagenPj1, "div1")}
        >
          <div className="h-[55%] w-[50%] shadow-2xl rounded-3xl bg-rose-200">
            {imagenPj1?.DadoImg && (
              <DivPjs.DivPjUno Src={imagenPj1.DadoImg} Id={imagenPj1.id} />
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 grid-rows-3 gap-1 p-1 col-start-3 row-start-6 col-span-3 row-span-3 flex justify-center items-center rounded-lg bg-red-400 ">
          {renderGrid(grid1, 1)}
        </div>
        <div className="grid grid-cols-3 grid-rows-3 gap-1 p-1 col-start-3 row-start-1 col-span-3 row-span-3 flex justify-center items-center rounded-lg bg-emerald-400">
          {renderGrid(grid2, 2)}
        </div>

        <div className="flex flex-col justify-center items-center text-2xl text-center gap-1 p-1 col-start-1 row-start-4 col-span-2 row-span-2 rounded-lg bg-red-200">
          <span className="font-['Source_Sans_Pro']">JUGADOR 1</span>
          <br />
          <span className="font-['Source_Sans_Pro']">puntaje:{puntajePj1}</span>
        </div>

        <div className="flex flex-col justify-center items-center gap-3 p-3 col-start-3 row-start-4 col-span-3 row-span-2 rounded-2xl bg-sky-300">
          <div className="flex justify-center items-center gap-1">
            <button
              className="flex items-center justify-center w-[150px] h-[50px] rounded-3xl border-2 border-amber-400 text-black text-sm font-semibold cursor-pointer transition-all duration-400 font-['Source_Sans_Pro'] bg-gradient-to-t from-amber-200 via-white to-amber-300 shadow-sm hover:shadow-custom active:shadow-custom-active focus:shadow-custom-active focus:outline-none"
              onClick={handleClick}
            >
              JUGAR
            </button>
            <button
              className="flex items-center justify-center w-[150px] h-[50px] rounded-3xl border-2 border-amber-400 text-black text-sm font-semibold cursor-pointer transition-all duration-400 font-['Source_Sans_Pro'] bg-gradient-to-t from-amber-200 via-white to-amber-300 shadow-sm hover:shadow-custom active:shadow-custom-active focus:shadow-custom-active focus:outline-none"
              onClick={handleClick2}
            >
              REINICIAR JUEGO
            </button>
          </div>
          <div className="relative">
            <select
              className="flex items-center justify-center w-[150px] h-[50px] rounded-3xl border-2 border-amber-400 text-black text-sm font-semibold cursor-pointer transition-all duration-400 font-['Source_Sans_Pro'] bg-gradient-to-t from-amber-200 via-white to-amber-300 shadow-sm hover:shadow-custom active:shadow-custom-active focus:shadow-custom-active focus:outline-none appearance-none text-center pr-10"
              onChange={handleDifficultyChange}
              defaultValue="facil"
            >
              <option
                value="facil"
                className="bg-gradient-to-t from-amber-200 via-white to-amber-300 text-black font-semibold py-2"
              >
                FÁCIL
              </option>
              <option
                value="normal"
                className="bg-gradient-to-t from-amber-200 via-white to-amber-300 text-black font-semibold py-2"
              >
                NORMAL
              </option>
              <option
                value="dificil"
                className="bg-gradient-to-t from-amber-200 via-white to-amber-300 text-black font-semibold py-2"
              >
                DIFÍCIL
              </option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L6 6L11 1"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center text-2xl text-center gap-1 p-1 col-start-6 row-start-4 col-span-2 row-span-2 rounded-lg bg-emerald-200 ">
          <span className="font-['Source_Sans_Pro']">IA: {aiDifficulty}</span>
          <br />
          <span className="font-['Source_Sans_Pro']">puntaje:{puntajePj2}</span>
        </div>

        <div
          className="flex items-center justify-center col-start-6 row-start-1 col-span-2 row-span-2 bg-emerald-300 rounded-lg shadow-md h-full w-full "
          onDragStart={(e) => handleDragStart(e, imagenPj2, "div6")}
        >
          <div className="h-[55%] w-[50%] shadow-2xl rounded-3xl bg-emerald-200">
            {imagenPj2?.DadoImg && (
              <DivPjs.DivPjDos Src={imagenPj2?.DadoImg} Id={imagenPj2?.id} />
            )}
          </div>
        </div>
        <div className="justify-start">
          <button>reglas!</button>
        </div>
        {showFinDelJuego && (
          <FinDelJuego
            grid1={grid1}
            grid2={grid2}
            puntajePj1={puntajePj1}
            puntajePj2={puntajePj2}
            onReiniciar={handleClosePopOver}
          />
        )}
        {!showFinDelJuego && (
          <PopOver
            isOpen={popOverProps.isOpen}
            onClose={() =>
              setPopOverProps((prev) => ({ ...prev, isOpen: false }))
            }
            title={popOverProps.tittle}
            message={popOverProps.message.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
            onNewGame={handleClosePopOver}
          />
        )}
      </div>
      <div className="inset-y-[50vh] left-[10vw] absolute z-40">
        <div className="bg-gradient-to-b from-stone-300/40 to-transparent p-[4px] rounded-[16px]">
          <button
            onClick={handleClick3}
            className="group p-[4px] rounded-[12px] bg-gradient-to-b from-white to-stone-200/40 shadow-[0_1px_3px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995]"
          >
            <div className="bg-gradient-to-b from-stone-200/40 to-white/80 rounded-[8px] px-2 py-2">
              <div className="flex gap-2 items-center">
                <span className="font-semibold">Como jugar</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
