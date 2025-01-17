import cocheIco from "../others/coche.png";
const Encabezado = () => {
    
    return (
      <header className="bg-gray-800 fixed w-full z-40">
      {/* Barra superior */}
      <section className="py-2 text-white text-center flex justify-center items-center">
     <img src={cocheIco} alt="Cam Icon" className="h-14 w-30 mr-6"/>
        <p className="text-4xl font-bold">VEHÍCULOS</p>
        <i className="fa-solid fa-file-invoice text-white text-5xl ml-6"></i>
      </section>
      </header>
    );
    
    }
    
    export default Encabezado;