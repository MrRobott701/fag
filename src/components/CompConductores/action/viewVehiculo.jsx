// CompViewVehiculo.jsx

import axiosInstance from '../../../axiosConfig.js';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2'; // Asegúrate de tener SweetAlert2 instalado

const URI_VEHICULOS = 'https://bag-st6b.onrender.com/vehiculos';
const URI_CONDUCTORES = 'https://bag-st6b.onrender.com/conductores'; // Asegúrate de que este endpoint exista
const URI_PROPIETARIOS = 'https://bag-st6b.onrender.com/propietarios'; // Asegúrate de que este endpoint exista

const CompViewVehiculo = ({ id, onClose }) => {
  const [vehiculo, setVehiculo] = useState(null);
  const [conductor, setConductor] = useState(null);
  const [propietario, setPropietario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Función para obtener los datos del vehículo
  const fetchVehiculo = async (id) => {
    try {
      const response = await axiosInstance.get(`${URI_VEHICULOS}/${id}`);
      setVehiculo(response.data);
      document.body.style.overflow = 'hidden'; // Quita el scroll cuando se muestra el modal

      // Obtener datos del conductor si existe
      if (response.data.idConductor) {
        fetchConductor(response.data.idConductor);
      }

      // Obtener datos del propietario si existe
      if (response.data.idPropietario) {
        fetchPropietario(response.data.idPropietario);
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al obtener la información del vehículo.',
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  // Función para obtener los datos del conductor
  const fetchConductor = async (idConductor) => {
    try {
      const response = await axiosInstance.get(`${URI_CONDUCTORES}/${idConductor}`);
      setConductor(response.data);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al obtener la información del conductor.',
      });
    }
  };

  // Función para obtener los datos del propietario
  const fetchPropietario = async (idPropietario) => {
    try {
      const response = await axiosInstance.get(`${URI_PROPIETARIOS}/${idPropietario}`);
      setPropietario(response.data);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al obtener la información del propietario.',
      });
    }
  };

  const handleClose = () => {
    document.body.style.overflow = 'hidden'; // Restaura el scroll cuando se cierra el modal
    onClose();
  };

  useEffect(() => {
    fetchVehiculo(id);

    // Limpia el estilo del body cuando el componente se desmonte
    return () => {
      document.body.style.overflow = 'hidden';
    };
  }, [id]);

  // Función para extraer el FILE_ID de la URL de Google Drive
  const extractFileId = (url) => {
    if (!url) return null;
    const regex = /\/d\/(.*?)\//;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Función para formatear la fecha
  const formatFecha = (fecha) => {
    if (!fecha) return null;
    const date = new Date(fecha);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JS son 0-indexados
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg">
          <p></p>
        </div>
      </div>
    );
  }

  if (!vehiculo) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg">
          <p>No se encontró la información del vehículo.</p>
          <button onClick={handleClose} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  const fileId = extractFileId(vehiculo.fotoCarro);

  return (
    <div className='z-50'>
      <div
        className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-start z-40 max-h-screen overflow-y-auto"
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <div className="relative bg-white rounded-lg p-6 w-full max-w-2xl items-start mt-10 mb-8">
          <div className="flex items-center justify-between mb-6">
            <i className="fa-solid fa-eye text-5xl text-gray-900"></i>
            <h2 className="text-2xl font-bold mb-4 text-center">Información del Vehículo</h2>
            <button
              className="-mt-11 -mr-4 text-red-500 hover:text-red-800 text-4xl"
              onClick={handleClose}
              aria-label="Cerrar modal"
            >
              <i className="fa-solid fa-circle-xmark"></i>
            </button>
          </div>

          <hr className="my-0 border-gray-800 border-t-4 mb-2" />

          <div>
            <p><strong>Marca:</strong> {vehiculo.marca}</p>
            <p><strong>Modelo:</strong> {vehiculo.modelo}</p>
            <p><strong>Color:</strong> {vehiculo.color}</p>
            <p><strong>Año:</strong> {vehiculo.anio}</p>
            <p><strong>Placas:</strong> {vehiculo.placas}</p>
            <p><strong>Número de Serie:</strong> {vehiculo.numeroSerie}</p>

            <hr className="mt-4 my-0 border-gray-800 border-t-4" />

            {/* Información del Propietario */}
            <p className="text-center"><strong>PROPIETARIO</strong></p>
            {propietario ? (
              <p className="text-center">{propietario.nombre}</p> 
            ) : (
              <p className="text-center">No asignado</p>
            )}
            <br />
            {/* Información del Conductor */}
            <p className="text-center"><strong>CHOFER</strong></p>
            {conductor ? (
              <p className="text-center">{conductor.nombre}</p>
            ) : (
              <p className="text-center">No asignado</p>
            )}

            {/* Documentación */}
            {(vehiculo.placasDoc || vehiculo.imosPermiso || vehiculo.revisionMecanica || vehiculo.polizaSeguro || vehiculo.tarjetaCirculacion) && (
              <>
                <hr className="mt-4 my-0 border-gray-800 border-t-4" />
                <p className="text-center"><strong>DOCUMENTACIÓN</strong></p>
              </>
            )}

            <div className="flex flex-wrap space-x-4 mt-4 justify-center cursor-default">
              {/* Verificar si el enlace Placas existe */}
              {vehiculo.placasDoc ? (
                <div className="flex flex-col items-center">
                  <a href={vehiculo.placasDoc} target="_blank" rel="noopener noreferrer">
                    <button className="bg-slate-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded">
                      Placas
                    </button>
                  </a>
                  {/* Mostrar fecha de expiración si existe */}
                  {vehiculo.placasVencimiento && (
                      <>
                      <p className="font-bold text-sm text-gray-900">Expira:</p>
                      <span className="font-bold text-sm text-red-600">{formatFecha(vehiculo.placasVencimiento)}</span>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <p className="bg-red-100 text-red-600 font-bold px-3 py-1 rounded-lg border border-red-600 inline-block  cursor-default">Falta Placas</p>
                </div>
              )}

              {/* Verificar si el enlace IMOS existe */}
              {vehiculo.imosPermiso ? (
                <div className="flex flex-col items-center">
                  <a href={vehiculo.imosPermiso} target="_blank" rel="noopener noreferrer">
                    <button className="bg-slate-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded">
                      Permiso IMOS
                    </button>
                  </a>
                  {/* Mostrar fecha de expiración si existe */}
                  {vehiculo.imosVencimiento && (
                      <>
                      <p className="font-bold text-sm text-gray-900">Expira:</p>
                      <span className="font-bold text-sm text-red-600">{formatFecha(vehiculo.imosVencimiento)}</span>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <p className="bg-red-100 text-red-600 font-bold px-3 py-1 rounded-lg border border-red-600 inline-block">
                    Falta Permiso IMOS
                  </p>
                </div>
              )}

              {/* Verificar si el enlace Revisión Mecánica existe */}
              {vehiculo.revisionMecanica ? (
                <div className="flex flex-col items-center">
                  <a href={vehiculo.revisionMecanica} target="_blank" rel="noopener noreferrer">
                    <button className="bg-slate-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded">
                      Revisión Mecánica
                    </button>
                  </a>
                  {/* Mostrar fecha de expiración si existe */}
                  {vehiculo.revisionMecanicaVencimiento && (
                      <>
                      <p className="font-bold text-sm text-gray-900">Expira:</p>
                      <span className="font-bold text-sm text-red-600">{formatFecha(vehiculo.revisionMecanicaVencimiento)}</span>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <p className="bg-red-100 text-red-600 font-bold px-3 py-1 rounded-lg border border-red-600 inline-block ">Falta Revisión Mecánica</p>
                </div>
              )}

              {/* Verificar si el enlace Póliza de Seguro existe */}
              {vehiculo.polizaSeguro ? (
                <div className="flex flex-col items-center mt-2">
                  <a href={vehiculo.polizaSeguro} target="_blank" rel="noopener noreferrer">
                    <button className="bg-slate-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded ">
                      Póliza de Seguro
                    </button>
                  </a>
                  {/* Mostrar fecha de expiración si existe */}
                  {vehiculo.polizaSeguroVencimiento && (
                      <>
                      <p className="font-bold text-sm text-gray-900">Expira:</p>
                      <span className="font-bold text-sm text-red-600">{formatFecha(vehiculo.polizaSeguroVencimiento)}</span>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <p className="bg-red-100 text-red-600 font-bold px-3 py-1 rounded-lg border border-red-600 inline-block ">Falta Póliza de Seguro</p>
                </div>
              )}

              {/* Verificar si el enlace Tarjeta de Circulación existe */}
              {vehiculo.tarjetaCirculacion ? (
                <div className="flex flex-col items-center mt-2">
                  <a href={vehiculo.tarjetaCirculacion} target="_blank" rel="noopener noreferrer">
                    <button className="bg-slate-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded">
                      Tarjeta de Circulación
                    </button>
                  </a>
                  {/* Mostrar fecha de expiración si existe */}
                  {vehiculo.tarjetaCirculacionVencimiento && (
  <>
    <p className="font-bold text-sm text-gray-900">Expira:</p>
    <span className="font-bold text-sm text-red-600">{formatFecha(vehiculo.tarjetaCirculacionVencimiento)}</span>
  </>
)}

                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <p className="bg-red-100 text-red-600 font-bold px-3 py-1 rounded-lg border border-red-600 inline-block ">Falta Tarjeta de Circulación</p>
                </div>
              )}
            </div>

            {/* Foto del Vehículo */}
            <div className="border-2 border-gray-200 shadow-lg mt-4 w-full h-48 flex justify-center items-center relative overflow-hidden rounded-lg">
              {fileId ? (
                <iframe
                  src={`https://drive.google.com/file/d/${fileId}/preview?disablezoom=true`}
                  className="object-cover h-full w-full pointer-events-none"
                  title="Car Image"
                />
              ) : (
                <span>Sin imagen</span>
              )}
            </div>

            {/* Notas */}
            {vehiculo.nota && (
              <p className='mt-5 mb-10'><strong>Nota:</strong> {vehiculo.nota}</p>
            )}
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              className="font-bold bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={handleClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompViewVehiculo;
