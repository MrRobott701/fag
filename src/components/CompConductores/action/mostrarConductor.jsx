import axiosInstance from '../../../axiosConfig.js';;
import { useState, useEffect } from 'react';
import CompCreateConductores from './crearConductor.jsx';
import CompEditConductores from './editarConductor.jsx';
import CompViewConductor from './viewConductor.jsx';
import EliminarConductor from './eliminarConductor.jsx';
import Encabezado from '../others/Encabezado.jsx';
import Switch from '../others/Switch.jsx';
const URI = 'https://bag-st6b.onrender.com/conductores';
const CompSowConductores = ({ isCollapsed }) => {
  const [Conductores, setConductores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedConductorId, setSelectedConductorId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  useEffect(() => {
    getConductores();
  }, []);
  const getConductores = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(URI);
      setConductores(response.data);
    } catch (error) {
      console.error("Error fetching Conductores:", error);
    } finally {
      setLoading(false);
    }
  };
  const filteredConductores = Conductores.filter(conductor =>
    conductor.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = itemsPerPage === 'All' ? 1 : Math.ceil(filteredConductores.length / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleItemsPerPageChange = (e) => {
    const value = e.target.value;
    setItemsPerPage(value === 'All' ? 'All' : parseInt(value));
    setCurrentPage(1);
  };
  const currentConductores = itemsPerPage === 'All'
    ? filteredConductores
    : filteredConductores.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  if (loading) {
    return <p></p>;
  }
  const actualizarActivo = async (id, nuevoValor) => {
    try {
      await axiosInstance.put(`${URI}/${id}`, { activo: nuevoValor });
      console.log(`Conductor ${id} actualizado a activo: ${nuevoValor}`);
    } catch (error) {
      console.error('Error actualizando el valor de activo:', error);
    }
  };
  const toggleActivo = (conductor) => {
    const nuevoValor = conductor.activo === 1 ? 0 : 1;
    setConductores((prevConductores) =>
      prevConductores.map((c) =>
        c.id === conductor.id ? { ...c, activo: nuevoValor } : c
      )
    );
    actualizarActivo(conductor.id, nuevoValor);
  };
  return (
    <>
      <Encabezado />
      <div className={`pt-24 mr-12 mb-12 transition-all duration-300 ${isCollapsed ? "ml-28" : "ml-28"
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800 inline-block font-bold"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <i className="fa-solid fa-user-plus"></i> Crear Conductor
          </button>
          <div className="flex items-center space-x-4">
            <select
              className="rounded text-center border-2 border-black py-2 font-bold focus:ring-4 focus:ring-blue-600"
              onChange={handleItemsPerPageChange}
              value={itemsPerPage}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value="All">Todos</option>
            </select>
            <div className="relative">
              <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <input
                id='search'
                type="text"
                placeholder="Buscar"
                className="rounded border-2 border-black pl-10 pr-10 py-2 font-bold focus:ring-4 focus:ring-blue-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-live="polite"
              />
            </div>
          </div>
        </div>
        <table className="font-bold shadow-2xl rounded-lg table-fixed w-full border-2 mb-2 overflow-hidden">
          <thead className="bg-gray-800 text-white text-lg">
            <tr>
              <th className="w-10 border-2 text-center">No</th>
              <th className="w-48 border-2">Nombre</th>
              <th className="w-60 border-2">Dirección</th>
              <th className="w-28 border-2 text-center">Teléfono</th>
              <th className="w-10 border-2 text-center">Activo</th>
              <th className="w-32 border-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className='text-lg'>
            {currentConductores.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center border-2 text-2xl">No Hay Registros</td>
              </tr>
            ) : (
              currentConductores.map((conductor, index) => (
                <tr
                  key={conductor.id}
                  className="hover:bg-gray-100 cursor-pointer">
                  <td key={`${conductor.id}-index`} className="py-2 text-center border-2"
                    onClick={() => {
                      setSelectedConductorId(conductor.id);
                      setIsViewModalOpen(true);
                    }}
                  >
                    {itemsPerPage === 'All' ? index + 1 : (currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td
                    key={`${conductor.id}-nombre`}
                    className="border-2 text-center truncate"
                    onClick={() => {
                      setSelectedConductorId(conductor.id);
                      setIsViewModalOpen(true);
                    }}
                  >
                    {conductor.nombre}
                  </td>
                  <td
                    key={`${conductor.id}-direccion`}
                    className="border-2 text-center truncate"
                    onClick={() => {
                      setSelectedConductorId(conductor.id);
                      setIsViewModalOpen(true);
                    }}
                  >
                    {conductor.direccion}
                  </td>
                  <td key={`${conductor.id}-telefono`} className="border-2 text-center truncate"
                    onClick={() => {
                      setSelectedConductorId(conductor.id);
                      setIsViewModalOpen(true);
                    }}
                  >
                    {conductor.telefono}
                  </td>
                  <td key={`${conductor.id}-switch`} className="border-2 text-center truncate">
                    <Switch
                      isActive={conductor.activo === 1}
                      onToggle={() => toggleActivo(conductor)}
                    />
                  </td>
                  <td className="border-2 py-2 text-center">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-800 text-lg ml-1 mr-1 font-bold"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedConductorId(conductor.id);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <i className="fa-solid fa-user-pen"></i>
                    </button>
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-800 font-bold text-lg ml-1 mr-2"
                      onClick={() => {
                        setSelectedConductorId(conductor.id);
                        setIsViewModalOpen(true);
                      }}
                    >
                      <i className="fa-solid fa-eye"></i>
                    </button>
                    <EliminarConductor
                      id={conductor.id}
                      idVehiculo={conductor.idVehiculo}
                      getConductores={getConductores}
                    />
                    {console.log('idVehiculo:', conductor.idVehiculo)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex justify-center font-bold mb-4 mt-4">
          {/* Flecha doble hacia la izquierda - ir a la primera página */}
          <button
            onClick={() => handlePageChange(1)}
            className="px-3 py-1 mx-1 rounded bg-white border-2 border-blue-600"
            disabled={currentPage === 1}
          >
            <i className="fa-solid fa-less-than"></i>
            <i className="fa-solid fa-less-than"></i>
          </button>
          {/* Flecha simple hacia la izquierda - ir a la página anterior */}
          <button
            onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
            className="px-3 py-1 mx-1 rounded bg-white border-2 border-blue-600"
            disabled={currentPage === 1}
          >
            <i className="fa-solid fa-less-than"></i>
          </button>
          {/* Botones de número de página */}
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 mx-1 rounded ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-white border-2 border-blue-600'}`}
            >
              {index + 1}
            </button>
          ))}
          {/* Flecha simple hacia la derecha - ir a la página siguiente */}
          <button
            onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)}
            className="px-3 py-1 mx-1 rounded bg-white border-2 border-blue-600"
            disabled={currentPage === totalPages}
          >
            <i className="fa-solid fa-greater-than"></i>
          </button>
          {/* Flecha doble hacia la derecha - ir a la última página */}
          <button
            onClick={() => handlePageChange(totalPages)}
            className="px-3 py-1 mx-1 rounded bg-white border-2 border-blue-600"
            disabled={currentPage === totalPages}
          >
            <i className="fa-solid fa-greater-than"></i>
            <i className="fa-solid fa-greater-than"></i>
          </button>
        </div>
        {/* Modales */}
        {isViewModalOpen && (
          <CompViewConductor
            id={selectedConductorId}
            onClose={() => setIsViewModalOpen(false)}
          />
        )}
        {isEditModalOpen && (
          <CompEditConductores
            onClose={() => setIsEditModalOpen(false)}
            getConductores={getConductores}
            id={selectedConductorId}
          />
        )}
        {isCreateModalOpen && (
          <CompCreateConductores
            onClose={() => setIsCreateModalOpen(false)}
            getConductores={getConductores}
          />
        )}
      </div>
    </>
  );
};
export default CompSowConductores;
