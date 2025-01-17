import axiosInstance from '../../../axiosConfig.js';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

// Importar las validaciones
import { 
  validarVacio, 
  validarNombreLongitud, 
  validarNombreSoloLetras, 
  validarDocumentoSoloLetras, 
  validarSoloNumeros, 
  validarTelefonoLongitud, 
  validarDireccionLongitud 
} from '../../validations/validaciones'; // Ajusta la ruta según tu estructura de proyecto

const URI = 'https://bag-st6b.onrender.com/propietarios';

const CompEditPropietarios = ({ id, onClose, getPropietarios }) => {
  const navigate = useNavigate();
  const [telefonoInput, setTelefonoInput] = useState(''); // Campo con formato
  

  const fetchPropietario = async (id) => {
    try {
      const response = await axiosInstance.get(`${URI}/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const updatePropietarios = async (id, data) => {
    try {
      const response = await axiosInstance.put(`${URI}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  
  
// Función para formatear el número de teléfono
const formatTelefono = (telefono) => {
  let value = telefono.replace(/\D/g, ''); // Remueve todo lo que no sea un número
  let formattedValue = '';
  if (value.length > 0) {
    formattedValue += value.substring(0, 3);
  }
  if (value.length >= 4) {
    formattedValue += '-' + value.substring(3, 6);
  }
  if (value.length >= 7) {
    formattedValue += '-' + value.substring(6, 8);
  }
  if (value.length >= 9) {
    formattedValue += '-' + value.substring(8, 10);
  }
  return formattedValue;
};

  const onSubmit = async (data) => {
    try {
      await updatePropietarios(id, data);
      Swal.fire({
        icon: 'success',
        title: 'Registro actualizado',
        showConfirmButton: false,
        timer: 1500,
      });
      getPropietarios(); 
      onClose();
      navigate('/propietarios');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: error.response?.data?.error || 'Error desconocido',
      });
    }
  };

  // Cambiar el estado para que se mantenga los datos del propietario
  const [propietario, setPropietario] = useState(null);
  const [nombre, setNombre] = useState('');
  const [colonia, setColonia] = useState('');
  const [calle, setCalle] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [nombreDocumento, setNombreDocumento] = useState('');
  const [nroDocumento, setNroDocumento] = useState('');

  // Función para manejar el cambio en el campo de teléfono
const handleTelefonoChange = (e) => {
  let value = e.target.value.replace(/\D/g, ''); // Remover todos los caracteres que no sean dígitos
  if (value.length > 10) {
    value = value.slice(0, 10); // Limitar a 10 dígitos
  }
  setTelefono(value); // Guardar el número sin formato
  setTelefonoInput(formatTelefono(value)); // Formatear y mostrar el valor en el input
};

  useEffect(() => {
    const loadPropietario = async () => {
      const data = await fetchPropietario(id);
      setPropietario(data);
      setNombre(data.nombre);
      setColonia(data.colonia);
      setCalle(data.calle);
      setDireccion(data.direccion);
      setTelefono(data.telefono);
      setTelefonoInput(formatTelefono(data.telefono));
      setNombreDocumento(data.nombreDocumento);
      setNroDocumento(data.nroDocumento);
    };
    loadPropietario();
  }, [id]);

  const [erroresCampos, setErroresCampos] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errores = [];
    let nuevosErroresCampos = {};


    // Validaciones
    const validaciones = [
      { error: validarVacio(nombre, 'Nombre'), campo: 'nombre' },
      { error: validarNombreLongitud(nombre), campo: 'nombre' },
      { error: validarNombreSoloLetras(nombre), campo: 'nombre' },

      { error: validarVacio(direccion, 'Direccion'), campo: 'direccion' },
      { error: validarDireccionLongitud(direccion), campo: 'direccion' },
      
      { error: validarVacio(telefono, 'Teléfono'), campo: 'telefono' },
      { error: validarSoloNumeros(telefono), campo: 'telefono' },
      { error: validarTelefonoLongitud(telefono), campo: 'telefono' },
      
      { error: validarVacio(nombreDocumento, 'Documento'), campo: 'nombreDocumento' },
      { error: validarNombreSoloLetras('Documento'), campo: 'documento' },
      
      { error: validarDocumentoSoloLetras(nombreDocumento), campo: 'nombreDocumento' },
      { error: validarVacio(nroDocumento, 'Nro Documento'), campo: 'nroDocumento' },
    ];

    validaciones.forEach(({ error, campo }) => {
      if (error) {
        errores.push(error);
        nuevosErroresCampos[campo] = true;
      }
    });

    if (errores.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Errores de validación',
        html: `<ul>${errores.map((err) => `<li>${err}</li>`).join('')}</ul>`,
      });
      setErroresCampos(nuevosErroresCampos);
      return;
    }

    // Si no hay errores, continuar con la lógica de envío
    onSubmit({
      nombre,
      direccion,
      telefono,
      nombreDocumento,
      nroDocumento,
    });
  };

  if (!propietario) {
    return <div></div>; // Puedes mostrar un spinner de carga
  }

  return (
<>


<div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-start z-40 max-h-screen overflow-y-auto" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="relative bg-white rounded-lg p-6 w-full max-w-2xl items-start mt-10 mb-8">

      <div className="flex items-center justify-between mb-6">
       
        <i className="fa-solid fa-person-circle-exclamation text-5xl text-gray-900"></i>
        <h2 className="text-2xl font-bold mb-4 text-center">Editar Propietario</h2>
    

        <button className="-mt-11 -mr-4 text-red-500 hover:text-red-800 text-4xl" onClick={onClose} aria-label="Cerrar modal">
    <i className="fa-solid fa-circle-xmark"></i>
  </button>

        </div>

        <hr className="my-0 border-gray-800 border-t-4" />
        <br />

        {Object.values(erroresCampos).some((error) => error) && (
          <div className="font-bold bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p>Error en los campos:</p>
            <ul>
              {erroresCampos.nombre && <li>Nombre</li>}
              {erroresCampos.telefono && <li>Teléfono</li>}
              {erroresCampos.direccion && <li>Dirección</li>}
              {erroresCampos.nombreDocumento && <li>Documento</li>}
              {erroresCampos.nroDocumento && <li>Nro Documento</li>}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            {/* Campo Nombre */}
            <label className="block text-gray-900 text-lg font-bold mb-2" htmlFor="nombre">Nombre Completo</label>
            <strong>
              <input
                type="text"
                id="nombre"
                className={`shadow appearance-none border ${erroresCampos.nombre ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                placeholder="Ingresa el nombre"
                value={nombre}
                maxLength={80}
                onChange={(e) => {
                  const regex = /^[A-Za-z\s]*$/;
                  if (regex.test(e.target.value)) {
                    setNombre(e.target.value);
                  }
                }}
              />
            </strong>

            {/* Campo Teléfono */}
            <label className="block text-gray-900 text-lg font-bold mb-2 mt-4" htmlFor="telefono">Teléfono</label>

            <strong>
              <input
                type="text"
                id="telefono"
                className={`shadow appearance-none border ${erroresCampos.telefono ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                placeholder="Número de teléfono"
                value={telefonoInput}
                onChange={handleTelefonoChange}
              />
            </strong>

            {/* Campo Dirección */}
            <label className="block text-gray-900 text-lg font-bold mb-2 mt-4">Dirección</label>
            <strong>
              <input
                type="text"
                id="direccion"
                className={`shadow appearance-none border ${erroresCampos.direccion ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                placeholder="Dirección"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
            </strong>
            
            {/* Campo Documento */}
            <div className="flex flex-wrap -mx-2 mb-4 font-bold">
            <div className=" w-60 px-2">
    <label id="DocumentoName" className="block text-gray-900 text-xl font-bold mb-2" htmlFor="nombreDocumento">
      Documento
    </label>
    <div className="relative">
      <select
        id="nombreDocumento"
        className={`block appearance-none w-full bg-white border border-gray-300 hover:border-gray-800 px-4 py-2 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 leading-tight ${
          erroresCampos.nombreDocumento ? 'border-red-500' : ''
        }`}
        value={nombreDocumento}
        onChange={(e) => setNombreDocumento(e.target.value)}
      >
       <option value="LICENCIA">LICENCIA</option>
        <option value="INE">INE</option>
        <option value="CURP">CURP</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-8 w-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.5 7l4.5 4.5L14.5 7z"/></svg>
      </div>
    </div>
  </div>

              <div className="flex-1 px-2">
                <label className="block text-gray-900 text-lg font-bold mb-2" htmlFor="nroDocumento">Nro Documento</label>
                <input
                  type="text"
                  id="nroDocumento"
                  className={`shadow appearance-none border ${erroresCampos.nroDocumento ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2`}
                  placeholder="Nro de Documento"
                  maxLength={30}
                  value={nroDocumento}
                  onChange={(e) =>{
                    const regex = /^[a-zA-Z0-9\s]*$/;
                    if (regex.test(e.target.value)) {
                     
                        setNroDocumento(e.target.value.toUpperCase()); // Convierte el valor a mayúsculas
                      }
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button type="button" className="font-bold bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="font-bold bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default CompEditPropietarios;
