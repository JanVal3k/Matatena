import React, { useEffect } from "react";
import { ImagenesDeDados } from "../clase/ArrayImagenes";

const ImagenRandom = React.memo(({ onImagenesGeneradas }) => {
  useEffect(() => {
    const numRandom = Math.floor(Math.random() * ImagenesDeDados.length);
    const ImagenTraida = ImagenesDeDados[numRandom] || {};
    onImagenesGeneradas(ImagenTraida);
  }, [onImagenesGeneradas]);

  return null;
});

export default ImagenRandom;
