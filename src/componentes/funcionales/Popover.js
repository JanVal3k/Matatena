import React from "react";

const PopOver = ({ isOpen, onClose, title, message, onNewGame }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 transform transition-all">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="text-lg text-gray-600 text-center">{message}</p>
          <button
            onClick={() => {
              onNewGame();
              onClose();
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

export default PopOver;
