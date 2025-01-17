const Encabezado = (isCollapsed) => {
    return (
        <header className="bg-gray-800 fixed w-full z-30">
{/* Barra superior */}
<section className="py-2 bg-800 text-white text-center flex justify-center items-center">
<i className="fa-solid fa-user-tie text-white text-5xl h-14 mr-6"></i>
<p className="text-4xl font-bold">PROPIETARIOS</p>
<i className="fa-solid fa-user-tie fa-flip-horizontal text-white text-5xl h-14 ml-6"></i>
</section>
</header>
    );
    }
    export default Encabezado;