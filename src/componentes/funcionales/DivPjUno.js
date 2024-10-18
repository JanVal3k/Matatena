import React from "react";
import "../../styles/styles.css";

function DivPjUno({ Src, Id }) {
  return (
    <>
      <img
        src={Src}
        alt={Id}
        className="w-[100%] h-[100%] max-w-[100%] block m-auto cursor-pointer"
      />
    </>
  );
}
function DivPjDos({ Src, Id }) {
  return (
    <>
      <img
        src={Src}
        alt={Id}
        className="w-[100%] h-[100%] max-w-[100%] block m-auto cursor-pointer"
      />
    </>
  );
}

export default { DivPjUno, DivPjDos };
