import axiosInstance from '../../../axiosConfig.js';
import React, { useEffect, useState } from 'react';
import CompViewVehiculo from '../../CompVehiculos/actions/viewVehiculo.jsx';

export const MostrarCarros = () => {
    const URI_VEHICULOS = `https://bag-st6b.onrender.com/vehiculos/activos`;
    const URI_PROPIETARIOS = `https://bag-st6b.onrender.com/propietarios`;

    const [vehiculos, setVehiculos] = useState([]);
    const [propietarios, setPropietarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); 
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

    const filteredVehiculos = vehiculos.filter((vehiculo) =>
        vehiculo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehiculo.placas.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehiculo.anio.toString().includes(searchTerm)
    );

    return (
        <div className="font-bold">
            <div className="flex justify-between items-center mb-1 ml-1 mt-1">
                <i className="fa-solid fa-car-on text-4xl"></i>
                <h2 className="text-2xl font-bold">Lista de Carros</h2>
                
                <div className="relative w-1/2">
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
            
            <div className="grid grid-cols-1 xl:grid-cols-1 ml-2">
                {propietarios.map((propietario) => (
                    <div key={propietario.id} className="rounded p-3 border shadow-md mb-4">
                        <div className="flex items-center space-x-1 mb-1">
                            <div className="flex justify-center items-center bg-gray-200 rounded-full w-10 h-10">
                                <i className="fa-solid fa-user-shield text-gray-700"></i>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">{propietario.nombre}</h3>
                        </div>

                        <div className="overflow-y-auto max-h-[400px] rounded-lg"> {/* Set overflow-y-auto and max height */}
                            <table className="font-bold w-full">
                                <thead className="text-center text-xl bg-black text-white z-10 sticky top-0">
                                    <tr>
                                        <th className="border w-[20%]">Marca</th>
                                        <th className="border w-[20%]">Modelo</th>
                                        <th className="border w-[25%]">Color</th>
                                        <th className="border w-[30%]">Placa</th>
                                        <th className="border w-[5%]">Año</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredVehiculos
                                        .filter((vehiculo) => vehiculo.idPropietario === propietario.id)
                                        .map((vehiculo) => (
                                            <tr 
                                                key={vehiculo.id}
                                                onClick={() => handleRowClick(vehiculo.id)}
                                                className="text-base cursor-pointer hover:bg-gray-200 font-bold text-center"
                                            >
                                                <td className="border whitespace-normal">{vehiculo.marca}</td>
                                                <td className="border whitespace-normal">{vehiculo.modelo}</td>
                                                <td className="border whitespace-normal">{vehiculo.color}</td>
                                                <td className="border whitespace-normal">{vehiculo.placas}</td>
                                                <td className="border whitespace-normal">{vehiculo.anio}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>

            {selectedVehiculo && (
                <CompViewVehiculo id={selectedVehiculo} onClose={handleClose} />
            )}
        </div>
    );
};

export default MostrarCarros;
