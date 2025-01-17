import axiosInstance from '../../../axiosConfig.js';
import { useEffect, useState } from 'react';
import CompViewVehiculo from './viewVehiculo';

const URI = 'https://all-gates.onrender.com/conductores';
const URI_VEHICULOS = 'https://all-gates.onrender.com/vehiculos';
const URI_CONTRATOS = 'https://all-gates.onrender.com/contratos';

const CompViewConductor = ({ id, onClose }) => {
  console.log("Desde el modal:" + id);
  const [conductor, setConductor] = useState(null);
  const [vehiculo, setVehiculo] = useState(null);
  const [showVehiculo, setShowVehiculo] = useState(false);
  const [contrato, setContrato] = useState(null);
  const [deposito, setDeposito] = useState(null);

  const handleViewVehiculo = () => {
    setShowVehiculo(true);
  };

  const handleCloseVehiculo = () => {
    document.body.style.overflow = 'auto'; 
    setShowVehiculo(false);
  };

  const fetchConductor = async (id) => {
    try {
      const response = await axiosInstance.get(`${URI}/${id}`);
      setConductor(response.data);
      document.body.style.overflow = 'hidden';
    } catch (error) {
      console.error(error);
    }
  };

  const fetchVehiculo = async (id) => {
    try {
      const response = await axiosInstance.get(`${URI_VEHICULOS}/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchContrato = async (id) => {
    try {
      const response = await axiosInstance.get(`${URI_CONTRATOS}/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchConductor(id);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [id]);

  useEffect(() => {
    if (conductor?.idVehiculo) {
      const getVehiculo = async () => {
        const data = await fetchVehiculo(conductor.idVehiculo);
        setVehiculo(data);
      };
      getVehiculo();
    }
  }, [conductor]);

  useEffect(() => {
    if (conductor?.idContrato) {
      const getContrato = async () => {
        const data = await fetchContrato(conductor.idContrato);
        setContrato(data);
      };
      getContrato();
    }
  }, [conductor]);

  if (!conductor) {
    return <div></div>;
  }

  return (
    <div
      className="fixed text-xl inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-start z-50 max-h-screen overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
          document.body.style.overflow = 'auto';
        }
      }}
    >
      <div className="relative bg-white rounded-lg p-6 w-full max-w-4xl items-start mt-10 mb-8">
        <div className="flex items-center justify-between mb-6">
          <i className="fa-solid fa-eye text-5xl text-gray-900"></i>
          <h2 className="text-4xl font-bold mb-4 text-center">Información del Conductor</h2>
          <button
            className="-mt-11 -mr-4 text-red-500 hover:text-red-800 text-4xl"
            onClick={() => {
              onClose();
              document.body.style.overflow = 'auto';
            }}
            aria-label="Cerrar modal"
          >
            <i className="fa-solid fa-circle-xmark"></i>
          </button>
        </div>

        <hr className="my-0 border-gray-800 border-t-4 mb-2" />
        <div>
          <p><strong>Nombre:</strong> {conductor.nombre}</p>
          <p><strong>Dirección:</strong> {conductor.direccion}</p>
          <p><strong>Teléfono:</strong> {conductor.telefono}</p>
          <p><strong>Documento:</strong> {conductor.nombreDocumento}</p>
          <p><strong>Número de Documento:</strong> {conductor.nroDocumento}</p> 
          <br/>     
            <p>
              <strong>Vehículo Asignado: </strong>
              {vehiculo ? `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.color} ${vehiculo.anio}` : 'Sin Vehículo Asignado'}
            </p>
            {vehiculo && (
              <>
                <p>
                
                  <strong>Placas: </strong>{vehiculo ? vehiculo.placas : ''}
                </p>
                <button
                  className="bg-slate-600 hover:bg-blue-700 text-white font-bold px-2 py-2 rounded ml-3 flex items-center"
                  onClick={handleViewVehiculo}
                >
                  <i className="fa-solid fa-eye mr-2"></i> Información del Vehículo
                </button>
              </>
            )}
         

          {conductor.ineDoc || conductor.licenciaDoc || conductor.reciboLuz || conductor.reciboAgua ? (
            <>
              <hr className="mt-4 my-0 border-gray-800 border-t-4" />
              <p className="text-center"><strong>DOCUMENTACIÓN</strong></p>
            </>
          ) : null}

          <div className="flex flex-wrap space-x-4 mt-4 justify-center">
            {conductor.ineDoc && (
              <a href={conductor.ineDoc} target="_blank" rel="noopener noreferrer">
                <button className="bg-slate-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded flex items-center">
                  <i className="fa-solid fa-eye mr-2"></i> INE
                </button>
              </a>
            )}
            {conductor.licenciaDoc && (
              <a href={conductor.licenciaDoc} target="_blank" rel="noopener noreferrer">
                <button className="bg-slate-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded flex items-center">
                  <i className="fa-solid fa-eye mr-2"></i> Licencia
                </button>
              </a>
            )}
            {conductor.reciboLuz && (
              <a href={conductor.reciboLuz} target="_blank" rel="noopener noreferrer">
                <button className="bg-slate-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded flex items-center">
                  <i className="fa-solid fa-eye mr-2"></i> Recibo de Luz
                </button>
              </a>
            )}
            {conductor.reciboAgua && (
              <a href={conductor.reciboAgua} target="_blank" rel="noopener noreferrer">
                <button className="bg-slate-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded flex items-center">
                  <i className="fa-solid fa-eye mr-2"></i> Recibo de Agua
                </button>
              </a>
            )}
          </div>

          {conductor.idContrato ? (
  <>
    <hr className="mt-4 my-0 border-gray-800 border-t-4" />
    <div className="flex flex-col lg:flex-row mt-4 justify-center space-y-4 lg:space-y-0 lg:space-x-12 text-center">
      {/* Columna para el Contrato */}
      <div className="w-full lg:w-60">
        <p><strong>CONTRATO</strong></p>
        <div className="flex justify-center mt-2">
          <a href={contrato?.contratoDoc} target="_blank" rel="noopener noreferrer">
            <button className="bg-blue-600 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded flex items-center">
              <i className="fa-solid fa-eye mr-2"></i> Ver Contrato
            </button>
          </a>
        </div>
      </div>

      {/* Columna para el Depósito */}
      <div className="w-full lg:w-60">
        <p><strong>DEPÓSITO</strong></p>
        <div className="flex justify-center mt-2">
          <a href={contrato?.depositoDoc} target="_blank" rel="noopener noreferrer">
            <button className="bg-blue-600 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded flex items-center">
              <i className="fa-solid fa-eye mr-2"></i> Ver Depósito
            </button>
          </a>
        </div>
      </div>
    </div>
  </>
) : null}




  {/* Verificar si el Aval existe */}
  {conductor.avalNombre || conductor.avalDoc || conductor.avalReciboLuz || conductor.avalReciboAgua ? (
    <>
    <hr className="mt-4 my-0 border-gray-800 border-t-4" />
    <p className='text-center'><strong>AVAL</strong></p>
    </>
  ) : (
    <p></p>
  )}

{conductor.avalNombre ? (
    <p><strong>Nombre :</strong> {conductor.avalNombre}</p>
  ) : (
    <p></p>
  )}

  {conductor.avalTelefono ? (
    <p><strong>Teléfono :</strong> {conductor.avalTelefono}</p>
  ): (
    <p></p>
  )}
{/* Verificar si existen enlaces para el aval */}
{conductor.avalDoc || conductor.avalLuz || conductor.avalAgua ? (
  <>
    <p className="text-center"><strong>DOCUMENTACIÓN</strong></p>
  </>
) : (
  <p></p>
)}

{/* Nombre del Aval */}
{/* Contenedor para los botones de los documentos del aval */}
<div className="flex flex-wrap space-x-4 mt-4 justify-center">
  {/* Verificar si el enlace Documento del Aval existe */}
  {conductor.avalDoc && (
    <a href={conductor.avalDoc} target="_blank" rel="noopener noreferrer">
      <button className="bg-slate-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded">
      <i className="fa-solid fa-eye mr-2"></i>Identificación
      </button>
    </a>
  )}

  {/* Verificar si el enlace Recibo de Luz del Aval existe */}
  {conductor.avalLuz && (
    <a href={conductor.avalLuz} target="_blank" rel="noopener noreferrer">
      <button className="bg-slate-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded">
        <i className="fa-solid fa-eye mr-2"></i>Recibo de Luz
      </button>
    </a>
  )}

  {/* Verificar si el enlace Recibo de Agua del Aval existe */}
  {conductor.avalAgua && (
    <a href={conductor.avalAgua} target="_blank" rel="noopener noreferrer">
      <button className="bg-slate-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded">
        <i className="fa-solid fa-eye mr-2"></i>Recibo de Agua
      </button>
    </a>
  )}
</div>

          <hr className="mt-4 my-0 border-gray-800 border-t-4" />
          {conductor.nota && (
            <p className='mt-5 mb-10'><strong>Nota:</strong> {conductor.nota}</p>
          )}
        </div>

        <div className="flex justify-between mt-4">
          <button type="button" className="font-bold bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>

      {showVehiculo && (
        <CompViewVehiculo id={conductor?.idVehiculo} onClose={handleCloseVehiculo} />
      )}
    </div>
  );
};

export default CompViewConductor;
