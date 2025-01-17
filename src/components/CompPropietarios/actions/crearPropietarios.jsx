// src/components/CompPropietarios/crearPropietarios.jsx
import axiosInstance from '../../../axiosConfig.js';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  validarVacio,
  validarNombreLongitud,
  validarNombreSoloLetras,
  validarDocumentoSoloLetras,
  validarSoloNumeros,
  validarDireccionLongitud,
  validarTelefonoLongitud,
} from '../../validations/validaciones'; // Importa las validaciones
import Swal from 'sweetalert2';

const URI = 'https://bag-st6b.onrender.com/propietarios';

const CompCreatePropietarios = ({ onClose, getPropietarios }) => {
  const navigate = useNavigate();

  // Estados de los campos individuales
  const [nombre, setNombre] = useState('');
  const [colonia, setColonia] = useState('');
  const [calle, setCalle] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [codigoPostalInput, setCodigoPostalInput] = useState(''); // Para mostrar 'CP-'
  const [ciudad, setCiudad] = useState(''); // Valor por defecto
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [telefonoInput, setTelefonoInput] = useState(''); // Campo con formato
  const [nombreDocumento, setNombreDocumento] = useState('LICENCIA');
  const [nroDocumento, setNroDocumento] = useState('');

  useEffect(() => {
    // Deshabilitar scroll al mostrar modal
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Errores en los campos
  const [erroresCampos, setErroresCampos] = useState({
    nombre: false,
    telefono: false,
    colonia: false,
    calle: false,
    ciudad: false,
    nombreDocumento: false,
    nroDocumento: false,
  });

  // Estados para los checkboxes de campos opcionales
  const [selectedFields, setSelectedFields] = useState({
    numeroExterior: false,
    numeroInterior: false,
    manzana: false,
    lote: false,
    nota: false,
  });

  // Estados para los campos opcionales
  const [numeroExterior, setNumeroExterior] = useState('');
  const [numeroInterior, setNumeroInterior] = useState('');
  const [manzana, setManzana] = useState('');
  const [lote, setLote] = useState('');
  const [nota, setNota] = useState('');

  useEffect(() => {
    // Deshabilitar scroll al mostrar modal
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Concatenar dirección cuando cambie algún campo
  useEffect(() => {
    if (colonia && calle && ciudad) {
      let direccionCompleta = `${colonia}, ${calle}`;

      if (selectedFields.numeroExterior && numeroExterior) {
        direccionCompleta += `, #${numeroExterior}`;
      }
      if (selectedFields.numeroInterior && numeroInterior) {
        direccionCompleta += `, INT-${numeroInterior}`;
      }
      if (selectedFields.manzana && manzana) {
        direccionCompleta += `, MZ-${manzana}`;
      }
      if (selectedFields.lote && lote) {
        direccionCompleta += `, LT-${lote}`;
      }
      if (selectedFields.nota && nota) {
        direccionCompleta += `, ${nota}`;
      }
      if (codigoPostal.trim() !== '') {
        direccionCompleta += `, CP-${codigoPostal}`;
      }
      direccionCompleta += `, ${ciudad}`;
      validarDireccionLongitud(direccionCompleta);
      setDireccion(direccionCompleta);
    } else {
      setDireccion('');
    }
  }, [colonia, calle, codigoPostal, ciudad, selectedFields, numeroExterior, numeroInterior, manzana, lote, nota]);

  // Función para manejar el cambio en el campo de teléfono
  const handleTelefonoChange = (e) => {
    let value = e.target.value;
    // Remover todos los caracteres que no sean dígitos
    value = value.replace(/\D/g, '');
    // Limitar a 10 dígitos
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    // Guardar el número sin formato en 'telefono'
    setTelefono(value);
    // Formatear el valor para mostrar en el input
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
    setTelefonoInput(formattedValue);
  };

  // Función para manejar el cambio en el campo de código postal con 'CP-'
  const handleCodigoPostalChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setCodigoPostal(value);
    setCodigoPostalInput(value ? `CP-${value}` : '');
  };

  // Función para manejar el cambio en el campo de número exterior
  const handleNumeroExteriorChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setNumeroExterior(value);
  };

  // Función para manejar el cambio en el campo número interior
  const handleNumeroInteriorChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setNumeroInterior(value);
  };

  // Función para manejar los cambios en los checkboxes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSelectedFields((prev) => ({ ...prev, [name]: checked }));
    if (!checked) {
      switch (name) {
        case 'numeroExterior':
          setNumeroExterior('');
          break;
        case 'numeroInterior':
          setNumeroInterior('');
          break;
        case 'manzana':
          setManzana('');
          break;
        case 'lote':
          setLote('');
          break;
        case 'nota':
          setNota('');
          break;
        default:
          break;
      }
    }
  };

  const handleManzanaChange = (e) => {
    setManzana(e.target.value.replace(/\D/g, '').slice(0, 5));
  };

  const handleLoteChange = (e) => {
    setLote(e.target.value.replace(/\D/g, '').slice(0, 5));
  };

  const handleNotaChange = (e) => {
    setNota(e.target.value);
  };

  // Método para crear propietario
  const createPropietario = async (e) => {
    e.preventDefault();

    let nuevosErroresCampos = {
      nombre: false,
      telefono: false,
      colonia: false,
      calle: false,
      ciudad: false,
      nombreDocumento: false,
      nroDocumento: false,
    };

    let errores = [];

    // Validaciones
    const validaciones = [
      { error: validarVacio(nombre, 'Nombre'), campo: 'nombre' },
      { error: validarNombreLongitud(nombre), campo: 'nombre' },
      { error: validarNombreSoloLetras(nombre), campo: 'nombre' },
      { error: validarVacio(colonia, 'Colonia'), campo: 'colonia' },
      { error: validarVacio(ciudad, 'Ciudad'), campo: 'ciudad' },
      { error: validarVacio(calle, 'Calle'), campo: 'calle' },
      { error: validarVacio(telefono, 'Teléfono'), campo: 'telefono' },
      { error: validarSoloNumeros(telefono), campo: 'telefono' },
      { error: validarTelefonoLongitud(telefono), campo: 'telefono' },
      { error: validarVacio(nombreDocumento, 'Documento'), campo: 'nombreDocumento' },
      { error: validarDocumentoSoloLetras(nombreDocumento), campo: 'nombreDocumento' },
      { error: validarVacio(nroDocumento, 'Nro Documento'), campo: 'nroDocumento' },
      { error: validarDireccionLongitud(direccion), campo: 'direccion' },
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

    // Crear propietario
    try {
      await axiosInstance.post(URI, {
        nombre,
        direccion,
        telefono,
        nombreDocumento,
        nroDocumento,
      });
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Propietario registrado con éxito',
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        getPropietarios();
        navigate('/propietarios');
        onClose();
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al crear el propietario',
        text: 'Verifique los datos y vuelva a intentarlo.',
      });
    }
  };

  return (
<>

    <div
      className="font-bold fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-start z-40 max-h-screen overflow-y-auto" onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative bg-white rounded-lg p-6 w-full max-w-2xl items-start mt-10 mb-8">
      <div className="flex items-center justify-between mb-6">
  {/* Ícono a la izquierda */}
  <i className="fa-solid fa-person-circle-plus text-5xl text-gray-900"></i>
  
  {/* Texto centrado */}
  <h2 className="text-2xl font-bold text-center flex-1">Crear Propietario</h2>
  
  {/* Botón a la derecha */}
  <button className="-mt-11 -mr-4 text-red-500 hover:text-red-800 text-4xl" onClick={onClose} aria-label="Cerrar modal">
    <i className="fa-solid fa-circle-xmark"></i>
  </button>
</div>

        <hr className="my-0 border-gray-800 border-t-4" />
        <br />

        {/* Alerta de errores generales */}
        {Object.values(erroresCampos).some((error) => error) && (
          <div className="font-bold bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>Error en los campos:</p>
            <ul className="list-disc list-inside">
              {erroresCampos.nombre && <li>Nombre</li>}
              {erroresCampos.telefono && <li>Teléfono</li>}
              {erroresCampos.colonia && <li>Colonia</li>}
              {erroresCampos.calle && <li>Calle</li>}
              {erroresCampos.ciudad && <li>Ciudad</li>}
              {erroresCampos.nombreDocumento && <li>Documento</li>}
              {erroresCampos.nroDocumento && <li>Nro Documento</li>}
            </ul>
          </div>
        )}

        <form onSubmit={createPropietario}>
          {/* Campos del formulario */}

          {/* Campo Nombre */}
          <div className="mb-4">
            <label className="block text-gray-900 text-lg font-bold mb-2" htmlFor="nombre">
              Nombre Completo
            </label>
            <input
              type="text"
              id="nombre"
              className={`shadow w-full p-2 rounded border-2 ${
                erroresCampos.nombre ? 'border-red-500' : 'border-gray-300'
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
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
          
          </div>

          {/* Campo Teléfono */}
          <div className="mb-4">
            <label className="block text-gray-900 text-lg font-bold mb-2" htmlFor="telefono">
              Teléfono
            </label>
            <input
              type="text"
              id="telefono"
              className={`shadow w-full p-2 rounded border-2 ${
                erroresCampos.telefono ? 'border-red-500' : 'border-gray-300'
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              placeholder="Número de teléfono"
              value={telefonoInput}
              onChange={handleTelefonoChange}
            />

          </div>

          {/* Campos de Dirección */}
          <div className="mb-4">
            <label className="block text-gray-900 text-lg font-bold mb-2">Dirección</label>
            <input
              type="text"
              id="colonia"
              className={`shadow w-full p-2 rounded border-2 ${
                erroresCampos.colonia ? 'border-red-500' : 'border-gray-300'
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2`}
              placeholder="Colonia"
              value={colonia}
              onChange={(e) => setColonia(e.target.value)}
            />

            <input
              type="text"
              id="calle"
              className={`shadow w-full p-2 rounded border-2 ${
                erroresCampos.calle ? 'border-red-500' : 'border-gray-300'
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2`}
              placeholder="Calle"
              value={calle}
              onChange={(e) => setCalle(e.target.value)}
            />

          </div>

          {/* Contenedor para Número, Código Postal y Ciudad */}
          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <input
                type="text"
                id="codigoPostal"
                className={`shadow w-full p-2 rounded border-2 ${
                  erroresCampos.direccion ? 'border-red-500' : 'border-gray-300'
                } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                placeholder="Código Postal"
                value={codigoPostalInput}
                onChange={handleCodigoPostalChange}
              />
            </div>
            <div className="w-1/2">
              <input
                type="text"
                id="ciudad"
                className={`shadow w-full p-2 rounded border-2 ${
                  erroresCampos.ciudad ? 'border-red-500' : 'border-gray-300'
                } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                placeholder="Ciudad"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
              />
            </div>
          </div>


          {/* Checkboxes para Campos Opcionales */}
          <div className="mb-4 font-bold">
            <span className="block text-gray-900 text-lg font-bold mb-2">Agregar Detalles de Dirección:</span>
            <div className="flex flex-wrap space-x-4">
              <label className="inline-flex items-center">
                <input 
                  type="checkbox"
                  name="numeroExterior"
                  checked={selectedFields.numeroExterior}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Número Exterior</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="numeroInterior"
                  checked={selectedFields.numeroInterior}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Número Interior</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="manzana"
                  checked={selectedFields.manzana}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Manzana</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="lote"
                  checked={selectedFields.lote}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Lote</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="nota"
                  checked={selectedFields.nota}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Nota</span>
              </label>
            </div>
          </div>

          {/* Campos Opcionales Condicionales */}
          <div className="flex flex-wrap mb-4">
            {selectedFields.numeroExterior && (
              <div className="mb-4 w-1/4 px-2">
                <label className="block text-gray-900 text-lg font-bold mb-2" htmlFor="numeroExterior">
                  Número Ext.
                </label>
                <input
                  type="text"
                  id="numeroExterior"
                  className={`shadow w-full p-2 rounded border-2 ${
                    erroresCampos.direccion ? 'border-red-500' : 'border-gray-300'
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                  placeholder="Nro Exterior"
                  value={numeroExterior}
                  onChange={handleNumeroExteriorChange}
                  maxLength={5}
                />
              </div>
            )}

            {selectedFields.numeroInterior && (
              <div className="mb-4 w-1/4 px-2">
                <label className="block text-gray-900 text-lg font-bold mb-2" htmlFor="numeroInterior">
                  Número Int.
                </label>
                <input
                  type="text"
                  id="numeroInterior"
                  className={`shadow w-full p-2 rounded border-2 ${
                    erroresCampos.direccion ? 'border-red-500' : 'border-gray-300'
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                  placeholder="Nro Interior"
                  value={numeroInterior}
                  onChange={handleNumeroInteriorChange}
                  maxLength={5}
                />
              </div>
            )}

            {selectedFields.manzana && (
              <div className="mb-4 w-1/4 px-2">
                <label className="block text-gray-900 text-lg font-bold mb-2" htmlFor="manzana">
                  Manzana
                </label>
                <input
                  type="text"
                  id="manzana"
                  className={`shadow w-full p-2 rounded border-2 ${
                    erroresCampos.direccion ? 'border-red-500' : 'border-gray-300'
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                  placeholder="Manzana"
                  value={manzana}
                  onChange={handleManzanaChange}
                  maxLength={5}
                />
              </div>
            )}

            {selectedFields.lote && (
              <div className="mb-4 w-1/4 px-2">
                <label className="block text-gray-900 text-lg font-bold mb-2" htmlFor="lote">
                  Lote
                </label>
                <input
                  type="text"
                  id="lote"
                  className={`shadow w-full p-2 rounded border-2 ${
                    erroresCampos.direccion ? 'border-red-500' : 'border-gray-300'
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                  placeholder="Lote"
                  value={lote}
                  onChange={handleLoteChange}
                  maxLength={5}
                />
              </div>
            )}
          </div>

          {/* Campo Nota */}
          {selectedFields.nota && (
            <div className="mb-4">
              <label className="block text-gray-900 text-lg font-bold mb-2" htmlFor="nota">
                Nota de Dirección
              </label>
              <input
                type="text"
                id="nota"
                className={`shadow w-full p-2 rounded border-2 ${
                  erroresCampos.direccion ? 'border-red-500' : 'border-gray-300'
                } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                placeholder="Agrega una nota a dirección"
                value={nota}
                onChange={handleNotaChange}
                maxLength={50}
              />

            </div>
          )}

          {/* Mostrar la dirección completa */}
          {colonia && calle && ciudad && (
            <div className="mt-4 mb-4">
              <strong>Dirección Completa:</strong> {direccion}
            </div>
          )}

          {/* Campo Nombre del Documento y Nro Documento */}
          <div className="flex flex-wrap -mx-2 mb-4">
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
              <label className="block text-gray-900 text-lg font-bold mb-2" htmlFor="nroDocumento">
                No Documento
              </label>
              <input
                type="text"
                id="nroDocumento"
                className={`shadow w-full p-2 rounded border-2 ${
                  erroresCampos.nroDocumento ? 'border-red-500' : 'border-gray-300'
                } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                placeholder="No de Documento"
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

          <div className="flex justify-between">
            <button
              type="button"
              className="font-bold bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="font-bold bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default CompCreatePropietarios;
