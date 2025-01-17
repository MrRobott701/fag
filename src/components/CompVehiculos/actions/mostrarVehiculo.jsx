// mostrarVehiculo.jsx

import React, { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../../../axiosConfig.js';
import Swal from 'sweetalert2';
import Select from 'react-select';
import 'sweetalert2/dist/sweetalert2.min.css';
import CompCreateVehiculos from './crearVehiculo.jsx'; // Componente del formulario
import Encabezado from '../others/Encabezado.jsx';
import CompViewVehiculo from './viewVehiculo.jsx'; // Asegúrate de que la ruta sea correcta
import CompEditVehiculo from './editarVehiculo.jsx'; // Asegúrate de que la ruta sea correcta
import EliminarVehiculo from './eliminarVehiculo.jsx';
import { showSuccessAlert, showErrorAlert } from './../../alerts.jsx'; // Asegúrate de que esta ruta sea correcta

const URI = 'https://all-gates.onrender.com/vehiculos/activos';
const URI_CONDUCTOR = 'https://all-gates.onrender.com/conductores';
const URI_PROPIETARIO = 'https://all-gates.onrender.com/propietarios';
const CompSowVehiculos = ({ isCollapsed }) => {
  const [Vehiculos, setVehiculos] = useState([]);
  const [propietarios, setPropietarios] = useState([]); // Estado para almacenar propietarios
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para el propietario seleccionado en el filtro
  const [selectedPropietarioFilter, setSelectedPropietarioFilter] = useState(null);

  // Estados para manejar los modales
  const [showViewModalver, setShowViewModalver] = useState(false);
  const [modalType, setModalType] = useState(null); // null, 'create', 'edit', 'view'
  const [selectedVehiculoId, setSelectedVehiculoId] = useState(null);

  // Estados para manejar conductores
  const [conductores, setConductores] = useState([]);
  const [conductoresLoading, setConductoresLoading] = useState(false);

  // Estados para asignación de conductores por vehículo
  const [asignaciones, setAsignaciones] = useState({}); // { [vehiculoId]: { idConductor, conductorAsignado } }

  // Función para abrir el modal de creación
  const openCreateModal = () => {
    setModalType('create');
    setSelectedVehiculoId(null); // Asegura que no haya vehículo seleccionado para edición
  };

  // Función para abrir el modal de edición
  const openEditModal = (id) => {
    setSelectedVehiculoId(id);
    setModalType('edit');
  };

  // Función para manejar cuando se hace clic en "Ver"
  const handleViewVehiculo = (id) => {
    setSelectedVehiculoId(id);
    setShowViewModalver(true);
  };

  const handleViewModalClose = () => {
    setShowViewModalver(false);
  };

  // Función para cerrar cualquier modal
  const closeModal = () => {
    setModalType(null);
    setSelectedVehiculoId(null);
  };

  useEffect(() => {
    getVehiculos();
    getConductores();
    getPropietarios();
  }, []);

  // Función para obtener vehículos
  const getVehiculos = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(URI);
      setVehiculos(response.data);

      // Inicializar asignaciones para cada vehículo
      const asignacionesIniciales = {};
      response.data.forEach((vehiculo) => {
        asignacionesIniciales[vehiculo.id] = {
          idConductor: vehiculo.idConductor || 0,
          conductorAsignado: vehiculo.idConductor ? '' : null,
        };
      });
      setAsignaciones(asignacionesIniciales);

      // Obtener nombres de conductores asignados
      response.data.forEach(async (vehiculo) => {
        if (vehiculo.idConductor && vehiculo.idConductor !== 0) {
          try {
            const conductorResponse = await axiosInstance.get(`${URI_CONDUCTOR}/${vehiculo.idConductor}`);
            setAsignaciones((prev) => ({
              ...prev,
              [vehiculo.id]: {
                ...prev[vehiculo.id],
                conductorAsignado: conductorResponse.data.nombre,
              },
            }));
          } catch (error) {
            console.error('Error al obtener conductor asignado:', error);
          }
        }
      });
    } catch (error) {
      console.error("Error fetching Vehiculos:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error al Obtener Vehículos',
        text: 'No se pudieron obtener los vehículos, por favor intenta nuevamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener conductores
  const getConductores = async () => {
    setConductoresLoading(true);
    try {
      const response = await axiosInstance.get(`${URI_CONDUCTOR}/activo`);
      setConductores(response.data);
    } catch (error) {
      console.error('Error al obtener los conductores:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al Obtener Conductores',
        text: 'No se pudieron obtener los conductores, por favor intente nuevamente.',
      });
    } finally {
      setConductoresLoading(false);
    }
  };

  // Función para obtener propietarios
  const getPropietarios = async () => {
    try {
      const response = await axiosInstance.get(URI_PROPIETARIO);
      setPropietarios(response.data);
    } catch (error) {
      console.error('Error al obtener propietarios:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al Obtener Propietarios',
        text: 'No se pudieron obtener los propietarios, por favor intente nuevamente.',
      });
    }
  };

  // Función para manejar asignación exitosa
  const handleAsignacionExitosa = () => {
    Swal.fire({
      icon: 'success',
      title: 'Asignación completada',
      text: 'El chofer ha sido asignado correctamente al vehículo.',
    });
    getVehiculos(); // Refresca la lista de vehículos
  };

  // Crear las opciones para el select de propietarios
  const propietariosOptions = propietarios.map(propietario => ({
    value: propietario.id,
    label: propietario.nombre
  }));

  // Filtrado de vehículos
  const filteredVehiculos = useMemo(() => {
    let filtrados = Vehiculos.filter((vehiculo) =>
      (vehiculo.marca && vehiculo.marca.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vehiculo.modelo && vehiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vehiculo.placas && vehiculo.placas.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vehiculo.color && vehiculo.color.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vehiculo.anio && vehiculo.anio.toString().includes(searchTerm))
    );

    // Si hay un propietario seleccionado, filtrar también por ese propietario
    if (selectedPropietarioFilter) {
      filtrados = filtrados.filter(v => v.idPropietario === selectedPropietarioFilter.value);
    }

    return filtrados;
  }, [Vehiculos, searchTerm, selectedPropietarioFilter]);

  // Función para extraer el FILE_ID de la URL de Google Drive
  const extractFileId = (url) => {
    if (!url) return null;
    const regex = /\/d\/(.*?)\//;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Función para actualizar el conductor en la API
  const updateConductor = async (id, idVehiculo) => {
    try {
      const response = await axiosInstance.put(`${URI_CONDUCTOR}/asignar/${id}`, {
        idVehiculo: idVehiculo,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.log('Error al actualizar el conductor:', error);
      showErrorAlert('ERROR AL ACTUALIZAR CONDUCTOR');
    }
  };

  // Función para asignar conductor
  const asignarConductor = async (idVehiculo, idConductor) => {
    try {
      await axiosInstance.put(`${URI}/asignar/${idVehiculo}`, {
        idConductor: idConductor,
      });
      if (idConductor && idConductor !== 0) {
        await updateConductor(idConductor, idVehiculo);
      }
      handleAsignacionExitosa();
    } catch (error) {
      console.error('Error al asignar el conductor:', error);
      showErrorAlert('ERROR AL ASIGNAR CONDUCTOR');
    }
  };

  // Manejar cambio de conductor
  const handleChangeConductor = (vehiculoId, selectedOption) => {
    const selectedConductorId = selectedOption ? selectedOption.value : 0;

    Swal.fire({
      title: '¿Estás seguro?',
      html: `
        <p>Está a punto de cambiar el conductor asignado.</p>
        <p>¿Desea continuar?</p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cambiar conductor',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Actualizar estado local
        setAsignaciones((prev) => ({
          ...prev,
          [vehiculoId]: {
            ...prev[vehiculoId],
            idConductor: selectedConductorId,
            conductorAsignado: selectedConductorId === 0 ? null : selectedOption.label,
          },
        }));

        // Asignar conductor en la API
        await asignarConductor(vehiculoId, selectedConductorId);
      }
    });
  };

  if (loading || conductoresLoading) {
    return <p className="text-center text-xl mt-10">Cargando...</p>;
  }

  return (
    <>
      {/* Encabezado Fijo */}
      <Encabezado />

      {/* Contenedor Principal */}
      <div className={`pt-24 mr-12 mb-12 z-10 transition-all duration-300 ${isCollapsed ? "ml-28" : "ml-28"}`}>
        {!modalType ? (
          <>
            {/* Sección de creación y filtros */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800 font-bold"
                onClick={openCreateModal}
              >
                <i className="fa-solid fa-user-plus"></i> Crear Vehículo
              </button>
              
              <div className="flex flex-col w-full md:w-auto md:flex-row md:items-center gap-4 z-30">
                {/* SELECT PARA FILTRAR POR PROPIETARIOS */}
                <Select
                  className="shadow rounded border-2 border-black w-full md:w-80 font-bold"
                  value={selectedPropietarioFilter}
                  onChange={(option) => setSelectedPropietarioFilter(option)}
                  options={propietariosOptions}
                  placeholder="Filtrar por Propietario"
                  isClearable
                />
                
                <div className="relative w-full md:w-96">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-search text-gray-400"></i>
                  </div>
                  <input
                    id='search'
                    type="text"
                    placeholder="MARCA / MODELO / PLACAS / COLOR / AÑO"
                    className="w-full rounded border-2 border-black pl-10 pr-4 py-2 font-bold focus:ring-4 focus:ring-blue-600"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-live="polite"
                  />
                </div>
              </div>
            </div>

            {/* Lista de vehículos */}
            {filteredVehiculos.length === 0 ? (
              <p className="text-center text-2xl mt-10">No Hay Registros</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-14">
                {filteredVehiculos.map((vehiculo) => {
                  const fileId = extractFileId(vehiculo.fotoCarro);
                  const asignacion = asignaciones[vehiculo.id] || { idConductor: 0, conductorAsignado: null };
                  const selectedOptionConductor = [
                    { value: 0, label: "Sin conductor" },
                    ...conductores.map((conductor) => ({
                      value: conductor.id,
                      label: conductor.nombre,
                    }))
                  ].find(option => option.value === asignacion.idConductor) || { value: 0, label: "Sin conductor" };

                  return (
                    <div key={vehiculo.id} className="text-lg bg-white p-6 rounded-lg border mt-4 transform hover:scale-105 transition-all duration-300 relative z-20"
                      style={{ boxShadow: "0px 0px 15px rgba(39, 235, 245, 0.8)" }}>
                      
                      {/* Botón para eliminar vehículo */}
                      <EliminarVehiculo id={vehiculo.id} idConductor={vehiculo.idConductor} getVehiculos={getVehiculos} />

                      {/* Información del vehículo */}
                      <div className="text-3xl font-bold flex justify-center items-center space-x-2">
                        <i className="fa-solid fa-taxi"></i>
                        <div>{vehiculo.marca}</div>
                      </div>

                      <div className="border-2 border-gray-200 mt-2 mb-2 w-full h-48 flex justify-center items-center relative overflow-hidden rounded-lg">
                        {fileId ? (
                          <iframe
                            src={`https://drive.google.com/file/d/${fileId}/preview?disablezoom=true`}
                            className="object-cover h-full w-full pointer-events-none"
                            title="Car Image"
                            loading="lazy"
                          />
                        ) : (
                          <span>Sin imagen</span>
                        )}
                      </div>

                      <p><strong>Modelo:</strong> {vehiculo.modelo}</p>
                      <p><strong>Color:</strong> {vehiculo.color}</p>
                      <p><strong>Año:</strong> {vehiculo.anio}</p>
                      <p><strong>Placas:</strong> {vehiculo.placas}</p>

                      {/* Sección de Asignación de Conductor */}
                      <div className="relative mt-2">
                        <div className="flex items-center mb-2">
                          <button
                            onClick={() =>
                              Swal.fire({
                                title: "Asignación de Conductores",
                                html: `
                                  <p>Seleccione un <strong>conductor</strong> para asignar al vehículo.</p>
                                  <p>Solo se puede asignar <strong>un conductor</strong> a la vez.</p>
                                  <p>Si selecciona un <strong>conductor</strong> con un vehículo, el vehículo anterior quedará sin conductor.</p>
                                  <p>Si selecciona <strong>'Sin Conductor'</strong>, se <strong>desasignará</strong> el conductor actual.</p>
                                `,
                                icon: "info",
                                confirmButtonText: "Entendido",
                                width: '800px',
                                padding: '1.5rem',
                                backdrop: true,
                              })
                            }
                            className="fa-solid fa-info-circle text-2xl mr-2 hover:scale-125 hover:shadow-xl"
                            style={{ color: "#0000ff" }}
                          ></button>

                          <label className="block font-bold pt-0.5">Conductor Asignado</label>
                        </div>
                        <div className="relative">
                          <Select
                            className="shadow rounded border-2 border-gray-400 mt-2"
                            value={selectedOptionConductor}
                            onChange={(option) => handleChangeConductor(vehiculo.id, option)}
                            options={[
                              { value: 0, label: "Sin conductor" },
                              ...conductores.map((conductor) => ({
                                value: conductor.id,
                                label: conductor.nombre,
                              }))
                            ]}
                            placeholder={asignacion.idConductor && asignacion.idConductor !== 0 ? asignacion.conductorAsignado : "Seleccionar Conductor"}
                            isClearable
                            menuPortalTarget={document.body} // Renderiza el menú en el body
                            styles={{
                              menuPortal: base => ({ ...base, zIndex: 9999 }),
                            }}
                          />
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="mt-4 flex justify-between">
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 font-bold"
                          onClick={() => handleViewVehiculo(vehiculo.id)} 
                        >
                          <i className="fa-solid fa-eye"></i> Ver
                        </button>
                        <button
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-700 font-bold"
                          onClick={() => openEditModal(vehiculo.id)}
                        >
                          <i className="fa-solid fa-user-pen"></i> Editar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : null}

        {/* Renderizar el Modal correspondiente basado en modalType */}
        {modalType === 'create' && (
          <CompCreateVehiculos
            onClose={closeModal}
            getVehiculos={getVehiculos}
          />
        )}

        {modalType === 'edit' && selectedVehiculoId && (
          <CompEditVehiculo
            onClose={closeModal}
            getVehiculos={getVehiculos}
            vehiculoId={selectedVehiculoId}
          />
        )}

        {showViewModalver === true && selectedVehiculoId && (
          <CompViewVehiculo 
            id={selectedVehiculoId} 
            onClose={handleViewModalClose} 
          />
        )}
      </div>
    </>
  );
};

export default CompSowVehiculos;
