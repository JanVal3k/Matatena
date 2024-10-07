import React from "react";
import styles from "../../styles/styles.module.css";

function DivPjUno({ Src, Id }) {
  return (
    <>
      <img src={Src} alt={Id} className={styles.imagDomino} />
    </>
  );
}
function DivPjDos({ Src, Id }) {
  return (
    <>
      <img src={Src} alt={Id} className={styles.imagDomino} />
    </>
  );
}

export default { DivPjUno, DivPjDos };
