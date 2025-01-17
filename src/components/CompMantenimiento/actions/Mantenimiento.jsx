import React, { useState, useEffect, useMemo } from 'react';
import Encabezado from '../others/Encabezado';
import axiosInstance from '../../../axiosConfig.js';
import CompViewVehiculo from '../../CompVehiculos/actions/viewVehiculo.jsx';
import CompEditVehiculo from '../../CompVehiculos/actions/editarVehiculo.jsx';

// Componente para la fila de cada vehículo
const VehiculoRow = ({
    vehiculo,
    mantenimiento,
    onView,
    onEdit,
    onUpdateMantenimiento,
    loading,
    errorMessages,
}) => {
    const [localMantenimiento, setLocalMantenimiento] = useState({
        UltCambio: mantenimiento?.UltCambio || '',
        ProxCambio: mantenimiento?.ProxCambio || '',
    });

    // Actualizar el estado local cuando el mantenimiento cambia
    useEffect(() => {
        setLocalMantenimiento({
            UltCambio: mantenimiento?.UltCambio || '',
            ProxCambio: mantenimiento?.ProxCambio || '',
        });
    }, [mantenimiento]);

    // Manejar cambios en los campos de entrada
    const handleChange = (field, value) => {
        setLocalMantenimiento(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    // Manejar el evento onBlur para guardar cambios
    const handleBlur = (field) => {
        const value = Number(localMantenimiento[field]);
        const currentValue = mantenimiento ? mantenimiento[field] : undefined;
        if (!isNaN(value) && value >= 0 && value !== currentValue) {
            onUpdateMantenimiento(vehiculo.id, field, value);
        }
    };

    return (
        <tr 
            className="border-b border-gray-500 hover:bg-gray-100 transition duration-150 cursor-pointer"
            onClick={() => onView(vehiculo.id)}
        >
            <td className="py-3 px-6">{vehiculo.marca}</td>
            <td className="py-3 px-6">{vehiculo.modelo}</td>
            <td className="py-3 px-6">{vehiculo.color}</td>
            <td className="py-3 px-6">{vehiculo.anio}</td>
            <td className="py-3 px-6">{vehiculo.placas}</td>
            
            {/* Campo Último Cambio */}
            <td className="py-3 px-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col">
                    <input
                        type="number"
                        value={localMantenimiento.UltCambio}
                        onChange={(e) => handleChange('UltCambio', e.target.value)}
                        onBlur={() => handleBlur('UltCambio')}
                        placeholder='Millas / Kilómetros'
                        className="text-center w-full border border-black rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                        aria-label={`Último Cambio para ${vehiculo.marca} ${vehiculo.modelo}`}
                    />
                    {errorMessages[`UltCambio-${vehiculo.id}`] && (
                        <span className="text-red-500 text-sm mt-1">
                            {errorMessages[`UltCambio-${vehiculo.id}`]}
                        </span>
                    )}
                </div>
            </td>
            
            {/* Campo Próximo Cambio */}
            <td className="py-3 px-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col">
                    <input
                        type="number"
                        value={localMantenimiento.ProxCambio}
                        onChange={(e) => handleChange('ProxCambio', e.target.value)}
                        onBlur={() => handleBlur('ProxCambio')}
                        placeholder='Millas / Kilómetros'
                        className="text-center w-full border border-black rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                        aria-label={`Próximo Cambio para ${vehiculo.marca} ${vehiculo.modelo}`}
                    />
                    {errorMessages[`ProxCambio-${vehiculo.id}`] && (
                        <span className="text-red-500 text-sm mt-1">
                            {errorMessages[`ProxCambio-${vehiculo.id}`]}
                        </span>
                    )}
                </div>
            </td>
            
            {/* Celda de Edición */}
            <td 
                className="py-3 px-2"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="text-grid-500 hover:text-green-500"
                    onClick={() => onEdit(vehiculo.id)}
                    aria-label={`Editar ${vehiculo.marca} ${vehiculo.modelo}`}
                >
                    <i className="fa-solid fa-pen text-2xl"></i>
                </button>
            </td>
        </tr>
    );
};

// Componente para la barra de búsqueda
const SearchBar = ({ filtro, setFiltro }) => (
    <div className="flex justify-end items-end mr-6 mb-6">
        <div className="relative w-full md:w-2/6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-black"></i>
            </div>
            <input
                id="search"
                type="text"
                placeholder="Buscar Vehículo..."
                className="w-full rounded-lg border border-black pl-10 pr-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                aria-label="Buscar Vehículo"
            />
        </div>
    </div>
);

const Mantenimiento = ({ isCollapsed }) => {
    const URI_VEHICULO = 'https://all-gates.onrender.com/vehiculos/activos';
    const URI_MECANICA = 'https://all-gates.onrender.com/mecanicas';

    // Estados para almacenar vehículos y mantenimientos
    const [vehiculos, setVehiculos] = useState([]);
    const [mantenimientos, setMantenimientos] = useState([]);
    const [filtro, setFiltro] = useState('');
    
    // Estado para manejar los modales: null, 'view', 'edit'
    const [modal, setModal] = useState({ type: null, vehiculoId: null });

    // Estados para manejo de cargas y errores
    const [loading, setLoading] = useState(false);
    const [maintenanceLoading, setMaintenanceLoading] = useState(false);
    const [errorMessages, setErrorMessages] = useState({});

    // Obtener datos al montar el componente
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [vehiculosRes, mantenimientosRes] = await Promise.all([
                axiosInstance.get(URI_VEHICULO),
                axiosInstance.get(URI_MECANICA),
            ]);
            setVehiculos(vehiculosRes.data);
            setMantenimientos(mantenimientosRes.data);
        } catch (error) {
            setErrorMessages(prev => ({
                ...prev,
                general: 'Error al obtener los datos. Por favor, intenta nuevamente más tarde.',
            }));
        } finally {
            setLoading(false);
        }
    };

    // Función para actualizar o crear mantenimiento
    const handleUpdateMantenimiento = async (idVehiculo, field, value) => {
        setMaintenanceLoading(true);
        setErrorMessages(prev => ({
            ...prev,
            [`${field}-${idVehiculo}`]: undefined,
        }));

        const mantenimientoItem = mantenimientos.find(m => m.idVehiculo === idVehiculo);

        try {
            if (mantenimientoItem) {
                const updatedData = { ...mantenimientoItem, [field]: value };
                await axiosInstance.put(`${URI_MECANICA}/${mantenimientoItem.id}`, updatedData);
                setMantenimientos(prev => prev.map(item => item.id === mantenimientoItem.id ? updatedData : item));
            } else {
                const newMantenimiento = {
                    idVehiculo: idVehiculo,
                    UltCambio: field === 'UltCambio' ? value : 0,
                    ProxCambio: field === 'ProxCambio' ? value : 0,
                };
                const res = await axiosInstance.post(URI_MECANICA, newMantenimiento);
                setMantenimientos(prev => [...prev, res.data]);
            }
        } catch (error) {
            setErrorMessages(prev => ({
                ...prev,
                [`${field}-${idVehiculo}`]: 'No se pudo actualizar o crear el mantenimiento.',
            }));
        } finally {
            setMaintenanceLoading(false);
        }
    };

    // Obtener información de mantenimiento
    const getMantenimientoInfo = (idVehiculo, field) => {
        const mantenimientoInfo = mantenimientos.find(m => m.idVehiculo === idVehiculo);
        return mantenimientoInfo ? mantenimientoInfo[field] : '';
    };

    // Filtrar vehículos según el término de búsqueda, memorizado para optimizar
    const vehiculosFiltrados = useMemo(() => {
        const lowerFiltro = filtro.toLowerCase();
        return vehiculos.filter(vehiculo => 
            vehiculo.marca.toLowerCase().includes(lowerFiltro) ||
            vehiculo.modelo.toLowerCase().includes(lowerFiltro) ||
            vehiculo.color.toLowerCase().includes(lowerFiltro) ||
            vehiculo.anio.toString().includes(lowerFiltro) ||
            vehiculo.placas.toLowerCase().includes(lowerFiltro)
        );
    }, [vehiculos, filtro]);

    // Funciones para manejar la apertura de modales
    const openViewModal = (vehiculoId) => {
        setModal({ type: 'view', vehiculoId });
    };

    const openEditModal = (vehiculoId) => {
        setModal({ type: 'edit', vehiculoId });
    };

    const closeModal = () => {
        setModal({ type: null, vehiculoId: null });
    };

    return (
        <div>
            <Encabezado />
            <div className={`font-bold pt-20 z-10 transition-all duration-300 ${isCollapsed ? 'ml-24' : 'ml-20'}`}>
                
                {/* Mostrar mensaje de error general si existe */}
                {errorMessages.general && (
                    <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">
                        {errorMessages.general}
                    </div>
                )}

                {/* Renderizar Buscador y Tabla solo si el modal de edición no está abierto */}
                {modal.type !== 'edit' && (
                    <>
                        {/* Buscador */}
                        <SearchBar filtro={filtro} setFiltro={setFiltro} />

                        {/* Tabla */}
                        <div className="overflow-y-auto max-h-[600px] shadow-xl rounded-lg">
                            <table className="min-w-full table-auto text-left bg-white shadow-md rounded-lg">
                                {/* Encabezado fijo */}
                                <thead className="bg-black text-white uppercase text-md sticky top-0 z-20">
                                    <tr className='text-center'>
                                        <th className="py-3 px-6">Marca</th>
                                        <th className="py-3 px-6">Modelo</th>
                                        <th className="py-3 px-6">Color</th>
                                        <th className="py-3 px-6">Año</th>
                                        <th className="py-3 px-6">Placas</th>
                                        <th className="py-3 px-6 text-center">Último Cambio</th>
                                        <th className="py-3 px-6 text-center">Próximo Cambio</th>
                                        <th className="py-3 px-2"><i className="fa-solid fa-pen-to-square text-2xl" aria-hidden="true"></i></th>
                                    </tr>
                                </thead>
                                <tbody className="text-center">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="8" className="py-4">
                                                Cargando vehículos...
                                            </td>
                                        </tr>
                                    ) : vehiculosFiltrados.length > 0 ? (
                                        vehiculosFiltrados.map(vehiculo => {
                                            const mantenimiento = mantenimientos.find(m => m.idVehiculo === vehiculo.id);
                                            return (
                                                <VehiculoRow
                                                    key={vehiculo.id}
                                                    vehiculo={vehiculo}
                                                    mantenimiento={mantenimiento}
                                                    onView={openViewModal}
                                                    onEdit={openEditModal}
                                                    onUpdateMantenimiento={handleUpdateMantenimiento}
                                                    loading={maintenanceLoading}
                                                    errorMessages={errorMessages}
                                                />
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="py-4">
                                                No se encontraron vehículos.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
                
                {/* Modal de Visualización */}
                {modal.type === 'view' && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">

                           
                            {modal.vehiculoId && (
                                <CompViewVehiculo 
                                    id={modal.vehiculoId} 
                                    onClose={closeModal} 
                                />
                            )}
                    </div>
                )}

                {/* Modal de Edición */}
                {modal.type === 'edit' && (
                    <div className="absolute h-full p-4 top-10 z-20">
                        <div>
                            <button
                                onClick={closeModal}
                                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl"
                                aria-label="Cerrar Modal"
                            >
                                &times;
                            </button>
                            {modal.vehiculoId && (
                                <CompEditVehiculo 
                                    vehiculoId={modal.vehiculoId} 
                                    onClose={() => {
                                        closeModal();
                                        fetchData();
                                    }} 
                                    getVehiculos={fetchData} 
                                />
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Mantenimiento;
