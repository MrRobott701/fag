// NotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import img404 from '../images/404.png';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Página no encontrada</h1>
        <img src={img404} alt="404" height={96} className=" mb-4" />
      <button
        onClick={() => navigate('/')}
        className="shadow-2xl transform hover:scale-105 transition-transform duration-200 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"

      >
        Volver al inicio
      </button>
    </div>
  );
};

export default NotFound;
