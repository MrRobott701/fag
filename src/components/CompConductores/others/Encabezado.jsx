import { useState } from "react";
const Encabezado = () => {
    
    return (
      <header className="bg-gray-800 fixed w-full z-30">
        {/* Barra superior */}
        <section className="py-2 bg-gray800 text-white text-center flex justify-center items-center">
        <i className="fa-solid fa-users-viewfinder text-white text-5xl h-14 mr-6"></i>
        <p className="text-4xl font-bold">CONDUCTORES</p>
      </section>
      </header>
    );
    
    }
    
    export default Encabezado;