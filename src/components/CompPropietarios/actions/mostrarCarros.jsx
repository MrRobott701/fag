import axiosInstance from '../../../axiosConfig.js';
import React, { useEffect, useState } from 'react';
import CompViewVehiculo from '../../CompVehiculos/actions/viewVehiculo.jsx';

export const MostrarCarros = () => {
    const URI_VEHICULOS = `https://bag-st6b.onrender.com/vehiculos/activos`;
    const URI_PROPIETARIOS = `https://bag-st6b.onrender.com/propietarios`;

    const [vehiculos, setVehiculos] = useState([]);
    const [propietarios, setPropietarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // State for vehicle search term
    const [selectedVehiculo, setSelectedVehiculo] = useState(null);

    useEffect(() => {
        const getCarros = async () => {
            try {
                const response = await axiosInstance.get(URI_VEHICULOS);
                setVehiculos(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const getPropietarios = async () => {
            try {
                const response = await axiosInstance.get(URI_PROPIETARIOS);
                setPropietarios(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        getCarros();
        getPropietarios();
    }, []);

    const handleRowClick = (id) => {
        setSelectedVehiculo(id);
    };

    const handleClose = () => {
        setSelectedVehiculo(null);
    };

    // Filter vehicles based on search term
    const filteredVehiculos = vehiculos.filter((vehiculo) =>
        vehiculo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehiculo.placas.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehiculo.anio.toString().includes(searchTerm)
    );

    return (
      
        <div className="max-w-full mx-auto p-4 font-bold">
      
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Lista de Carros</h2>
                
                {/* Search bar for vehicles */}
                <div className="relative w-1/4">
  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
    <i className="fas fa-search text-gray-400"></i>
  </div>
  <input
    type="text"
    placeholder="Buscar Vehículo..."
    className="w-full rounded border-2 border-black pl-10 pr-4 py-2 font-bold focus:ring-4 focus:ring-blue-600"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>

            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
  {propietarios.map((propietario) => (
    <div
      key={propietario.id}
      className="border border-gray-300 p-4 rounded-lg shadow hover:scale-105 transition-transform duration-150 flex flex-col"
    >
      <div className="flex items-center space-x-4 mb-4">
        {/* Icon */}
        <div className="flex justify-center items-center bg-gray-200 rounded-full w-10 h-10">
          <i className="fa-solid fa-user-shield text-gray-700"></i>
        </div>
        {/* Propietario's Name */}
        <h3 className="text-xl font-bold text-gray-800">{propietario.nombre}</h3>
      </div>


  <table className="font-bold text-lg w-full rounded-lg">
  <thead className="sticky top-16 bg-black text-white z-10">     
          <tr>
            <th className="px-4 py-2 border">Marca</th>
            <th className="px-4 py-2 border">Modelo</th>
            <th className="px-4 py-2 border">Placa</th>
            <th className="px-4 py-2 border">Año</th>
          </tr>
        </thead>
        <tbody>
          {filteredVehiculos
            .filter((vehiculo) => vehiculo.idPropietario === propietario.id)
            .map((vehiculo) => (
              <tr 
                key={vehiculo.id}
                onClick={() => handleRowClick(vehiculo.id)}
                className="text-lg cursor-pointer hover:bg-gray-200 font-bold text-center"
              >
                <td className="px-4 py-2 border">{vehiculo.marca}</td>
                <td className="px-4 py-2 border">{vehiculo.modelo}</td>
                <td className="px-4 py-2 border">{vehiculo.placas}</td>
                <td className="px-4 py-2 border">{vehiculo.anio}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  ))}
</div>


            {/* Render CompViewVehiculo if a vehicle is selected */}
            {selectedVehiculo && (
                <CompViewVehiculo id={selectedVehiculo} onClose={handleClose} />
            )}
        </div>
    );
};

export default MostrarCarros;
