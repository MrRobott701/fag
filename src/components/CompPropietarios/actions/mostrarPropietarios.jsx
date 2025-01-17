import axiosInstance from '../../../axiosConfig.js';
import { useState, useEffect } from 'react';
import CompCreatePropietarios from './crearPropietarios.jsx';
import CompEditPropietarios from './editarPropietarios.jsx';
import CompViewPropietario from './viewPropietario.jsx';
import EliminarPropietario from './eliminarPropietario.jsx';
import Encabezado from '../others/Encabezado.jsx';
import MostrarCarros from './mostrarCarros.jsx';
const URI = 'https://bag-st6b.onrender.com/propietarios';

const CompSowPropietarios = ({ isCollapsed }) => {
  const [propietarios, setPropietarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPropietarioId, setSelectedPropietarioId] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    getPropietarios();
  }, []);

  const getPropietarios = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(URI);
      setPropietarios(response.data);
    } catch (error) {
      console.error("Error fetching propietarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPropietarios = propietarios.filter(propietario =>
    propietario.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPropietarios.length / itemsPerPage);
  const currentPropietarios = filteredPropietarios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <p></p>;
  }

  return (
    <>
      {isCollapsed && <Encabezado isCollapsed={isCollapsed} />}
      {!isCollapsed && <div className='mr-96'><Encabezado /></div>}
      <div className= {`pt-24 mr-12 mb-12 transition-all duration-300 ${
    isCollapsed ? "ml-28" : "ml-28"
  }`}
  >
        
        <div className="flex justify-between items-center mb-4">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800 font-bold"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <i className="fa-solid fa-user-plus"></i> Crear Propietario
          </button>

          <div className="flex items-center space-x-4">
          <select
              onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
              value={itemsPerPage}
              className="rounded border-2 border-black p-2 font-bold"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value="All">Todos</option>
            </select>
          <div className="relative">
            
              <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              
              <input
                id='search'
                type="text"
                placeholder="Buscar Propietario..."
                className="rounded border-2 border-black pl-10 pr-10 py-2 font-bold focus:ring-4 focus:ring-blue-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-live="polite"
              />
            </div>
          </div>
        </div>

        <table className="shadow-2xl font-bold table-fixed w-full border-2 border-gray-300 rounded-lg overflow-hidden">
  <thead className="bg-gray-800 text-white text-lg rounded-t-lg">
    <tr>
      <th className="w-10 border-2 text-center">No</th>
      <th className="w-60 border-2">Nombre</th>
      <th className="w-64 border-2">Dirección</th>
      <th className="w-28 border-2 text-center">Teléfono</th>
      <th className="w-32 border-2 text-center">Documento</th>
      <th className="w-40 border-2 text-center">No Documento</th>
      <th className="w-32 border-2 text-center">Acciones</th>
    </tr>
  </thead>
  <tbody className="text-lg rounded-b-lg">
    {currentPropietarios.length === 0 ? (
      <tr>
        <td colSpan="7" className="text-center border-2 text-2xl">No Hay Registros</td>
      </tr>
    ) : (
      currentPropietarios.map((propietario, index) => (
        <tr
          key={propietario.id}
          className="hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            setSelectedPropietarioId(propietario.id);
            setIsViewModalOpen(true);
          }}
        >
          <td className="py-2 text-center border-2">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
          <td className="border-2 text-center truncate">{propietario.nombre}</td>
          <td className="border-2 text-center truncate">{propietario.direccion}</td>
          <td className="border-2 text-center truncate">{propietario.telefono}</td>
          <td className="border-2 text-center truncate">{propietario.nombreDocumento}</td>
          <td className="border-2 text-center truncate">{propietario.nroDocumento}</td>
          <td className="border-2 py-2 text-center" onClick={(e) => e.stopPropagation()}>
            <button
              className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-800 mr-2 font-bold text-lg"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPropietarioId(propietario.id);
                setIsEditModalOpen(true);
              }}
            >
              <i className="fa-solid fa-user-pen"></i>
            </button>
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-800 font-bold text-lg ml-1 mr-2"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPropietarioId(propietario.id);
                setIsViewModalOpen(true);
              }}
            >
              <i className="fa-solid fa-eye"></i>
            </button>
            <EliminarPropietario id={propietario.id} getPropietarios={getPropietarios} />
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>



        {/* Paginación con flechas */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => handlePageChange(1)}
            className="px-3 py-1 mx-1 rounded bg-white border-2 border-blue-600"
            disabled={currentPage === 1}
          >
            <i className="fa-solid fa-angles-left"></i>
          </button>
          <button
            onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
            className="px-3 py-1 mx-1 rounded bg-white border-2 border-blue-600"
            disabled={currentPage === 1}
          >
            <i className="fa-solid fa-angle-left"></i>
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 mx-1 rounded ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-white border-2 border-blue-600'}`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)}
            className="px-3 py-1 mx-1 rounded bg-white border-2 border-blue-600"
            disabled={currentPage === totalPages}
          >
            <i className="fa-solid fa-angle-right"></i>
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            className="px-3 py-1 mx-1 rounded bg-white border-2 border-blue-600"
            disabled={currentPage === totalPages}
          >
            <i className="fa-solid fa-angles-right"></i>
          </button>
        </div>
        <hr className="my-full border-gray-400 border-t-8 mt-4" />

        <MostrarCarros />

        {/* Modales */}
        {isEditModalOpen && (
          <CompEditPropietarios onClose={() => setIsEditModalOpen(false)} getPropietarios={getPropietarios} id={selectedPropietarioId} />
        )}
        {isCreateModalOpen && (
          <CompCreatePropietarios onClose={() => setIsCreateModalOpen(false)} getPropietarios={getPropietarios} />
        )}
{isViewModalOpen && (
  <CompViewPropietario 
    id={selectedPropietarioId} 
    onClose={() => {
      setIsViewModalOpen(false);  
      document.body.style.overflow = 'visible';
    }} 
  />
)}

      </div>
    </>
  );
};

export default CompSowPropietarios;
