import React, { useState, useEffect, useCallback, useRef } from "react";
import "../../styles/styles.css";
import style from "../../styles/background.module.css";
import DivPjs from "./DivPjUno";
import { compararYEliminarImagenes } from "../clase/CompararDados";
import ImagenRandom from "../clase/imagenRamdom";
import FinDelJuego from "../clase/FinDelJuego";
import PopOver from "./Popover";

//--------------------------
export default function App() {
  //-- Estados para las imagenes
  const [imagenPj1, setImagenPj1] = useState({});
  const [imagenPj2, setImagenPj2] = useState({});
  //-- Estados para los grid 3x3
  const [grid1, setGrid1] = useState(Array(9).fill(null)); // el punto .fill llena cada array con null
  const [grid2, setGrid2] = useState(Array(9).fill(null));
  // Estados de los div
  const [puntajePj1, setPuntajePj1] = useState(0);
  const [puntajePj2, setPuntajePj2] = useState(0);
  /*para controlar la generacion de imagenes */
  const [needsUpdatePj1, setNeedsUpdatePj1] = useState(false);
  const [needsUpdatePj2, setNeedsUpdatePj2] = useState(false);
  // Estados ref para for
  const iteracionesRef = useRef(0);
  const intervaloRef = useRef(null);
  const seleccionDePj = useRef(0);
  //Estados para popOver
  const [popOverProps, setPopOverProps] = useState({
    isOpen: false,
    tittle: "",
    message: "",
  });

  //funcion que randeriza las imagens o bueno actualiza el estado del cual depente que imagen se va a renderizar al primer renderizado
  // const handleImagenesRandomizadas = useCallback((img1, img2) => {
  //   setImagenPj1(img1);
  //   setImagenPj2(img2);
  // }, []);

  /*funciones para poder reutilziar el componente de genera imagenes aleatoriaz en cada uno de los div*/

  /*Objeto para poder reutilziar el componente de genera imagenes aleatoriaz en el div1*/
  // const { generarImagenes } = ImagenRandom({
  //   onImagenesGeneradas: (imagen) => setImagenPj1(imagen || {}),
  // });

  const generarImagenPj1 = useCallback(() => {
    setNeedsUpdatePj1(true);
  }, []);

  const generarImagenPj2 = useCallback(() => {
    setNeedsUpdatePj2(true);
  }, []);

  //Para calcular el puntaje
  const cacularPuntaje = (grid) => {
    return grid.reduce((sum, cell) => sum + (cell ? parseInt(cell.id) : 0), 0); // Tomamos el 'id' del grid (array de 3x3) donde se esta poniendo la imagen para comparar si tiene valor y si es asi lo vamos sumando para acumularlo
  };

  useEffect(() => {
    // utilizamos el useEffect para que se ejecute el calcularPuntaje cada que se actualice alguno de los arrays que acumulan los valores
    setPuntajePj1(cacularPuntaje(grid1));
    setPuntajePj2(cacularPuntaje(grid2));
    FinDelJuego(grid1, grid2, puntajePj1, puntajePj2);
    PopOver(grid1, grid2, puntajePj1, puntajePj2);
    const isGrid1Full = grid1.every((cell) => cell !== null);
    const isGrid2Full = grid2.every((cell) => cell !== null);

    if (isGrid1Full || isGrid2Full) {
      handleClick2();
    }
  }, [grid1, grid2]);

  //funcion para boton JUGAR
  /*-----------------------------------*/
  //--INCIO DE FUNCIONES DE RESPALDO--//
  /*----------------------------------*/

  // funcion para genera imagenes a uno o otro jugador
  // const generarImagenesConLimite = useCallback(() => {
  //   if (iteracionesRef.current < 6) {
  //     if (seleccionDePj.current === 0) {
  //       generarImagenPj1();
  //     } else {
  //       generarImagenPj2();
  //     }
  //     iteracionesRef.current++; // vamos sumando al valor para que el if con '< 6' funcione
  //   } else {
  //     clearInterval(intervaloRef.current);
  //   }
  // }, [generarImagenPj1, generarImagenPj2]);

  // Función para generar imágenes alternadamente
  // const generarImagenesAlternadas = () => {
  //   if (iteracionesRef.current < 6) {
  //     if (iteracionesRef.current % 2 === 0) {
  //       setNeedsUpdatePj1(true);
  //     } else {
  //       setNeedsUpdatePj2(true);
  //     }
  //     iteracionesRef.current++;
  //   } else {
  //     clearInterval(intervaloRef.current);
  //   }
  // };

  /*-----------------------------------*/
  //--FINAL DE FUNCIONES DE RESPALDO--//
  /*----------------------------------*/

  //--------------------
  const handleClick = useCallback(() => {
    // Limpiamos cualquier intervalo existente
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
    }
    seleccionDePj.current = Math.floor(Math.random() * 2);
    // Reiniciamos el contador de iteraciones
    iteracionesRef.current = 0;

    const generarImagenesConLimite = () => {
      if (iteracionesRef.current < 6) {
        if (seleccionDePj.current === 0) {
          generarImagenPj1();
        } else {
          generarImagenPj2();
        }
        iteracionesRef.current++; // vamos sumando al valor para que el if con '< 6' funcione
      } else {
        clearInterval(intervaloRef.current);
      }
    };

    // Iniciamos el intervalo
    intervaloRef.current = setInterval(generarImagenesConLimite, 100);
  }, []);
  // BOTON PARA JUEGO NUEVO
  const handleClick2 = useCallback(() => {
    setPopOverProps({
      isOpen: true,
      tittle: "Reiniciando juego...",
      message: "Si quiere iniciar de nuevo dale en 'jugar'",
    });
  }, []);
  const handleClosePopOver = useCallback(() => {
    setPopOverProps((prev) => ({ ...prev, isOpen: false }));
    // reiniciamos juego
    setImagenPj1({});
    setImagenPj2({});
    //----------------------------
    setGrid1(Array(9).fill(null));
    setGrid2(Array(9).fill(null));
    //----------------------------
    setPuntajePj1(0);
    setPuntajePj2(0);
    //----------------------------
    setNeedsUpdatePj1();
    setNeedsUpdatePj2();
    //---------------------------
    iteracionesRef.current = 0;
    intervaloRef.current = null;
    seleccionDePj.current = 0;
  }, []);
  /*FUNCIONES PARA MOVER LA IMAGENS*/
  // 1 se incia cuando el usuario empieza a arrastrar
  const handleDragStart = (e, imagen, sourceGrid) => {
    e.dataTransfer.setData("imagen", JSON.stringify(imagen)); // se almacenan la imagen convertida a string en el objeto dataTransfer
    e.dataTransfer.setData("sourceGrid", sourceGrid); // se almacenan la fuente de donde proviene es decir div1 en el objeto dataTransfer
  };
  //2 Se ejecuta cuando el elemento esta sobre el grid que lo puede almazanar
  const handleDragOver = (e) => {
    e.preventDefault(); // simplemente hace que se permita soltar el elemento en el div
  };
  //3 Se ejecuta cuando el usuario suela la imagen
  const handleDrop = (e, gridIndex, targetGrid) => {
    e.preventDefault();
    const imagen = JSON.parse(e.dataTransfer.getData("imagen")); // se recupera la informacion de la imagen
    const sourceGrid = e.dataTransfer.getData("sourceGrid"); // se recupera la informacion de la fuente o el div

    //Verificamos si el arrastre es válido
    if (
      ((sourceGrid === "div1" && targetGrid === 1) ||
        (sourceGrid === "div6" && targetGrid === 2)) &&
      (targetGrid === 1 ? grid1[gridIndex] === null : grid2[gridIndex] === null)
    ) {
      const columna = gridIndex % 3; // Calculamos la columna (0, 1, o 2)

      // Creamos copias de los grids para modificarlos
      let newGrid1 = [...grid1];
      let newGrid2 = [...grid2];

      if (targetGrid === 1) {
        newGrid1[gridIndex] = imagen; // Colocamos la nueva imagen en grid1
        // Comparamos y eliminamos imágenes coincidentes en grid2
        newGrid2 = compararYEliminarImagenes(newGrid1, newGrid2, columna);

        setGrid1(newGrid1); // actualiza los grids
        setGrid2(newGrid2);
        //------- Para finalizar el juego
        FinDelJuego(grid1, grid2, puntajePj1, puntajePj2);
        // Generar imágenes para el jugador 2 con límite y retraso
        iteracionesRef.current = 0;
        const interval = setInterval(() => {
          if (iteracionesRef.current < 6) {
            setImagenPj1({});
            generarImagenPj2();
            iteracionesRef.current++;
          } else {
            clearInterval(interval);
          }
        }, 100);
      } else {
        newGrid2[gridIndex] = imagen; // Colocamos la nueva imagen en grid2
        // Comparamos y eliminamos imágenes coincidentes en grid1
        newGrid1 = compararYEliminarImagenes(newGrid2, newGrid1, columna);

        setGrid1(newGrid1);
        setGrid2(newGrid2);
        //------- Para finalizar el juego
        FinDelJuego(grid1, grid2, puntajePj1, puntajePj2);
        // Generar imágenes para el jugador 2 con límite y retraso
        iteracionesRef.current = 0;
        const interval = setInterval(() => {
          if (iteracionesRef.current < 6) {
            setImagenPj2({});
            generarImagenPj1();
            iteracionesRef.current++;
          } else {
            clearInterval(interval);
          }
        }, 100);
      }
    }
  };
  //renderizar el grid
  const renderGrid = (grid, playerGrid) => {
    return grid.map((cell, index) => (
      <div
        key={index}
        className="flex justify-center shadow-xl rounded-2xl border-2 items-center w-full h-full"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, index, playerGrid)} //esto prepara el escuchador o LISTENER para cuando se ejecute el handleDrop al soltar la imagen en uno de los grid
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
  };

  /*FUNCIONES PARA MOVER LA IMAGENS*/

  return (
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

      <div className="flex justify-center items-center gap-1 p-1 col-start-3 row-start-4 col-span-3 row-span-2 rounded-2xl bg-sky-300">
        <button
          className="flex items-center justify-center w-[150px] h-[50px] rounded-3xl border-2 border-amber-400 text-black text-sm font-semibold      cursor-pointer transition-all duration-400 font-['Source_Sans_Pro'] bg-gradient-to-t from-amber-200 via-white to-amber-300 shadow-sm hover:shadow-custom active:shadow-custom-active focus:shadow-custom-active focus:outline-none"
          onClick={handleClick}
        >
          JUGAR
        </button>
        <button
          className="flex items-center justify-center w-[150px] h-[50px] rounded-3xl border-2 border-amber-400 text-black text-sm font-semibold      cursor-pointer transition-all duration-400 font-['Source_Sans_Pro'] bg-gradient-to-t from-amber-200 via-white to-amber-300 shadow-sm hover:shadow-custom active:shadow-custom-active focus:shadow-custom-active focus:outline-none"
          onClick={handleClick2}
        >
          REINICIAR JUEGO...
        </button>
      </div>

      <div className="flex flex-col justify-center items-center text-2xl text-center gap-1 p-1 col-start-6 row-start-4 col-span-2 row-span-2 rounded-lg bg-emerald-200 ">
        <span className="font-['Source_Sans_Pro']">JUGADOR 2</span>
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
      <PopOver
        isOpen={popOverProps.isOpen}
        onClose={() => setPopOverProps((prev) => ({ ...prev, isOpen: false }))}
        title={popOverProps.tittle}
        message={popOverProps.message}
        onNewGame={handleClosePopOver}
      />
    </div>
  );
}
