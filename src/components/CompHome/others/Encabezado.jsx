import Ico from "../../../images/balance.png";
const Encabezado = () => {
    return (
<header className="bg-gray-800 fixed w-full z-30">
{/* Barra superior */}
<section className="py-2 bg-800 text-white text-center flex justify-center items-center">
<img src={Ico} alt="Logo" className="w-10 h-10 mr-2"/>
<p className="text-4xl font-bold py-2">ALL GATES</p>
<img src={Ico} alt="Logo" className="w-10 h-10 ml-2"/>
</section>
</header>
    );
    }
export default Encabezado;