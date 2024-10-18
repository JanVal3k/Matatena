import React from "react";
import ReactDOM from "react-dom/client";
import App from "./componentes/funcionales/App";
import reportWebVitals from "./componentes/ClasesIniciales/reportWebVitals";
import "./styles/styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals(); // para mirar las metricas
