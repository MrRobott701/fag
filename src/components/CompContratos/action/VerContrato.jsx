import React, { useState } from "react";
import CompViewConductor from "../../CompConductores/action/viewConductor";
import CompViewVehiculo from "../../CompVehiculos/actions/viewVehiculo";

const VerContrato = ({ contrato, onClose }) => {
  document.body.style.overflow = "hidden";
  const [showConductorModal, setShowConductorModal] = useState(false);
  const [showVehiculoModal, setShowVehiculoModal] = useState(false);

  if (!contrato) return null;
  const extractId = (url) => {
    const start = url.indexOf("/d/") + 3;
    const end = url.indexOf("/view");
    return url.substring(start, end);
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="mt-auto mb-4 bg-white rounded-lg p-6 w-full max-w-6xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-600 hover:text-red-800"
          aria-label="Cerrar"
        >
          <i className="fa-solid fa-circle-xmark text-3xl"></i>
        </button>

        <div className="flex items-center justify-center space-x-4 mb-4">
          <i className="fa-solid fa-file-waveform text-4xl text-gray-700"></i>
          <h2 className="text-4xl font-bold text-center">Detalles del Contrato</h2>
        </div>

        <hr className="mb-4 border-t-4 border-gray-800" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                    {/* Información del Contrato */}
                    <div className="text-lg">
            <div className="flex">
          <i className="text-4xl fa-solid fa-file-contract mr-2"></i>
            <h3 className="text-2xl font-bold text-red-600 mb-2"
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}>Contrato</h3>
            </div>
            <p><strong>Renta:</strong> ${contrato.precioRenta}.00</p>
            <p><strong>Depósito:</strong> ${contrato.precioDeposito}.00</p>
            <p><strong>Pagaré:</strong> ${contrato.precioPagare}.00</p>
            <p><strong>Fecha Inicio:</strong><br/> {contrato.fechaInicio}</p>
            <p><strong>Fecha Fin:</strong><br/> {contrato.fechaFin}</p>
          
          </div>
          
          
          {/* Información del Conductor */}
          <div className="text-lg">
            <div className="flex">
          <i className="text-4xl fa-solid fa-person-circle-question"></i>
            <h3 className="text-2xl font-bold text-red-600 mb-2"
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}>Conductor</h3>
            </div>
            <p><strong>Nombre:</strong> {contrato.conductor.nombre}</p>
            <p><strong>Dirección:</strong> {contrato.conductor.direccion}</p>
            <p><strong>Teléfono:</strong> {contrato.conductor.telefono}</p>
            
          </div>

          {/* Información del Vehículo */}
          <div className="text-lg">
            <div className="flex">
          <i className="text-4xl fa-solid fa-car-on"></i>
            <h3 className="text-2xl font-bold text-red-600 mb-2"
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}>Vehículo</h3>
            </div>
            <p><strong>Marca:</strong> {contrato.vehiculo.marca}</p>
            <p><strong>Modelo:</strong> {contrato.vehiculo.modelo}</p>
            <p><strong>Color:</strong> {contrato.vehiculo.color}</p>
            <p><strong>Año:</strong> {contrato.vehiculo.anio}</p>
            <p><strong>Placas:</strong> {contrato.vehiculo.placas}</p>
            <p><strong>Número de Serie:</strong> {contrato.vehiculo.numeroSerie}</p>
          </div>

          {/* Información del Arrendador */}
          <div className="text-lg">
            <div className="flex">
            <i className="text-4xl fa-solid fa-user-tie mr-2"></i>
            <h3 className="text-2xl font-bold text-red-600 mb-2"
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}>Arrendador</h3>
            </div>
            <p><strong>Nombre:</strong> {contrato.propietario.nombre}</p>
            {/* AVAL */}
            {contrato.conductor.avalNombre && (
              <>
                 <div className="flex mt-4">
                 <i className="text-4xl fa-solid fa-people-roof mr-2"></i>
            
            <h3 className="text-2xl font-bold text-red-600 mb-2"
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}>Aval</h3>
            </div>
           
                <p><strong>Nombre:</strong> {contrato.conductor.avalNombre}</p>
                <p><strong>Teléfono:</strong> {contrato.conductor.avalTelefono}</p>
                
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                      {/* Información del Contrato */}
                      <div className="text-lg text-center">
              </div>
          {/* Información del Conductor */}
          <div className="text-lg text-center">
          <button
            onClick={() => setShowConductorModal(true)}
            className="bg-yellow-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded"
          >
            <i className="fa-solid fa-eye mr-2"></i> Ver Conductor
          </button>
        </div>
        {/* Información del Vehículo */}
          <div className="text-lg text-center">
          <button
              onClick={() => setShowVehiculoModal(true)}
              className="bg-yellow-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded"
            >
              <i className="fa-solid fa-eye mr-2"></i> Ver Vehículo
            </button>
            </div>

              {/* Información del Arrendador/Aval */}
        <div className="text-lg text-center">
        {contrato.conductor.avalNombre && (
          <button
              onClick={() => setShowConductorModal(true)}
              className="bg-yellow-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded"
            >
              <i className="fa-solid fa-eye mr-2"></i> Ver Aval
            </button>
        )}
    
          </div>
</div>
        <hr className="my-4 border-t-4 border-gray-800" />

        {/* Botones y vistas previas en dos columnas */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Columna para el contrato */}
          <div className="w-full">
            <button className="bg-blue-600 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded w-full">
              <a
                href={contrato.contratoDoc}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center"
              >
                <i className="fa-solid fa-file-pdf mr-2"></i> Ver Contrato
              </a>
            </button>
            <iframe
              src={`https://drive.google.com/file/d/${extractId(contrato.contratoDoc)}/preview`}
              title="Vista previa del contrato"
              className="w-full h-64 mt-2 rounded shadow"
              allow="fullscreen"
            />
          </div>

          {/* Columna para el depósito */}
          <div className="w-full">
            <button className="bg-blue-600 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded w-full">
              <a
                href={contrato.depositoDoc}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center"
              >
                <i className="fa-solid fa-file-pdf mr-2"></i> Ver Depósito
              </a>
            </button>
            <iframe
              src={`https://drive.google.com/file/d/${extractId(contrato.depositoDoc)}/preview`}
              title="Vista previa del depósito"
              className="w-full h-64 mt-2 rounded shadow overflow-y-auto"
              allow="fullscreen"
            />
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 font-bold"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>

        {showConductorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <CompViewConductor id={contrato.conductor.id} onClose={() => setShowConductorModal(false)} />
          </div>
        )}
        {showVehiculoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <CompViewVehiculo id={contrato.idVehiculo} onClose={() => setShowVehiculoModal(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default VerContrato;
