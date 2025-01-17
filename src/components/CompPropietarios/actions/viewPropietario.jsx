import axiosInstance from '../../../axiosConfig.js';
import { useEffect, useState } from 'react';

const URI = 'https://bag-st6b.onrender.com/propietarios';

const CompViewPropietario = ({ id, onClose }) => {
  const [propietario, setPropietario] = useState(null);

  const fetchPropietario = async (id) => {
    
    try {
      const response = await axiosInstance.get(`${URI}/${id}`);
      setPropietario(response.data);
      document.body.style.overflow = 'hidden';
      
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPropietario(id);
  }, [id]);

  if (!propietario) {
    return <div></div>; 
  }

  return (
    <>


<div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-start z-40 max-h-screen overflow-y-auto" onClick={(e) => e.target === e.currentTarget && onClose()}>
                
      <div className="relative bg-white rounded-lg p-6 w-full max-w-2xl items-start mt-10 mb-8">

        <div className="flex items-center justify-between mb-6">
          <i className="fa-solid fa-eye text-5xl text-gray-900"></i>
          <h2 className="text-2xl font-bold mb-4 text-center pl-13">Información del Propietario</h2>
          <button className="-mt-11 -mr-4 text-red-500 hover:text-red-800 text-4xl " onClick={onClose} aria-label="Cerrar modal">
          <i className="fa-solid fa-circle-xmark"></i>
        </button>
        </div>

        <hr className="my-0 border-gray-800 border-t-4 mb-2" />
        <div>
          <p><strong>Nombre:</strong> {propietario.nombre}</p>
          <p><strong>Dirección:</strong> {propietario.direccion}</p>
          <p><strong>Teléfono:</strong> {propietario.telefono}</p>
          <p><strong>Documento:</strong> {propietario.nombreDocumento}</p>
          <p><strong>Número de Documento:</strong> {propietario.nroDocumento}</p>

          {propietario.ineDoc || propietario.licenciaDoc || propietario.reciboLuz || propietario.reciboAgua ? (
            <>
              <hr className="mt-4 my-0 border-gray-800 border-t-4" />
              <p className="text-center"><strong>DOCUMENTACIÓN</strong></p>
            </>
          ) : (
            <p></p>
          )}

          {/* Contenedor para botones en una misma línea */}
          <div className="flex flex-wrap space-x-4 mt-4 justify-center">
            {propietario.ineDoc && (
              <a href={propietario.ineDoc} target="_blank" rel="noopener noreferrer">
                <button className="bg-slate-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded">
                  INE
                </button>
              </a>
            )}
            {propietario.licenciaDoc && (
              <a href={propietario.licenciaDoc} target="_blank" rel="noopener noreferrer">
                <button className="bg-slate-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded">
                  Licencia
                </button>
              </a>
            )}
            {propietario.reciboLuz && (
              <a href={propietario.reciboLuz} target="_blank" rel="noopener noreferrer">
                <button className="bg-slate-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded">
                  Recibo de Luz
                </button>
              </a>
            )}
            {propietario.reciboAgua && (
              <a href={propietario.reciboAgua} target="_blank" rel="noopener noreferrer">
                <button className="bg-slate-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded">
                  Recibo de Agua
                </button>
              </a>
            )}
          </div>

          <hr className="mt-4 my-0 border-gray-800 border-t-4" />
          {propietario.nota ? (
            <p className='mt-5 mb-10'><strong>Nota:</strong> {propietario.nota}</p>
          ) : (
            <p></p>
          )}
        </div>

        <div className="flex justify-between mt-4">
          <button type="button" className="font-bold bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default CompViewPropietario;
