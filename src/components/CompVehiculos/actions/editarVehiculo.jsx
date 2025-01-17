// CompEditVehiculo.jsx

import axiosInstance from '../../../axiosConfig.js';;
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { sendUpload } from '../../sendUpload';
import { deleteFile } from '../../deleteFile';
import Select from 'react-select';
import AsignarChofer from './asignarChofer.jsx';
import DocumentSection from './DocumentSection.jsx';

import {
  validarVacio,
  validarNombreLongitud,
  validarSoloNumeros,
  validarIndividuo,
} from '../../validations/validaciones.js';

// Importa las funciones necesarias de date-fns
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// Importa React DatePicker y sus estilos
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import esLocale from 'date-fns/locale/es';

// Registra el locale español para DatePicker
registerLocale('es', esLocale);

const URI = 'https://all-gates.onrender.com/vehiculos';
const URI_CONDUCTOR = 'https://all-gates.onrender.com/conductores';
const URI_PROPPIETARIOS = 'https://all-gates.onrender.com/propietarios';

const CompEditVehiculo = ({ onClose, getVehiculos, vehiculoId }) => {
  // Definición de estados
  const [propietarios, setPropietarios] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [color, setColor] = useState('');
  const [anio, setAnio] = useState('');
  const [placas, setPlacas] = useState('');
  const [placasDoc, setPlacasDoc] = useState('');
  const [placasVencimiento, setPlacasVencimiento] = useState(new Date());
  const [numeroSerie, setNumeroSerie] = useState('');
  const [imosPermiso, setImosPermiso] = useState('');
  const [imosVencimiento, setImosVencimiento] = useState(new Date());
  const [revisionMecanica, setRevisionMecanica] = useState('');
  const [revisionMecanicaVencimiento, setRevisionMecanicaVencimiento] = useState(new Date());
  const [polizaSeguro, setPolizaSeguro] = useState('');
  const [polizaSeguroVencimiento, setPolizaSeguroVencimiento] = useState(new Date());
  const [tarjetaCirculacion, setTarjetaCirculacion] = useState('');
  const [tarjetaCirculacionVencimiento, setTarjetaCirculacionVencimiento] = useState(new Date());
  const [precioRenta, setPrecioRenta] = useState('');
  const [placasDocFile, setPlacasDocFile] = useState(null);
  const [imosDocFile, setImosDocFile] = useState(null);
  const [revisionMecanicaDocFile, setRevisionMecanicaDocFile] = useState(null);
  const [polizaDocFile, setPolizaDocFile] = useState(null);
  const [fotoCarro, setFotoCarro] = useState(null);
  const [fotoCarroDocFile, setFotoCarroDocFile] = useState(null);
  const [tarjetaCirculacionDocFile, setTarjetaCirculacionDocFile] = useState(null);
  const [idPropietario, setIdPropietario] = useState('');
  const [idConductor, setIdConductor] = useState('');
  const [erroresCampos, setErroresCampos] = useState({
    marca: false,
    modelo: false,
    color: false,
    anio: false,
    placas: false,
    numeroSerie: false,
    renta: false,
    idPropietario: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const getPropietarios = async () => {
      try {
        const response = await axiosInstance.get(`${URI_PROPPIETARIOS}`);
        setPropietarios(response.data);
      } catch (error) {
        console.error('Error al obtener los propietarios:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al Obtener Propietarios',
          text: 'No se pudieron obtener los propietarios, por favor intente nuevamente.',
        });
      }
    };

    const getConductores = async () => {
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
      }
    };

    const getVehiculo = async () => {
      try {
        const response = await axiosInstance.get(`${URI}/${vehiculoId}`);
        const vehiculo = response.data;

        // Asigna los valores al estado, asegurando que sean cadenas y en el formato correcto
        setMarca(vehiculo.marca || '');
        setModelo(vehiculo.modelo || '');
        setColor(vehiculo.color || '');
        setAnio(vehiculo.anio ? String(vehiculo.anio).slice(-2) : '');
        setPlacas(vehiculo.placas || '');
        setNumeroSerie(vehiculo.numeroSerie || '');
        setPrecioRenta(vehiculo.precioRenta || 0);
        setPlacasVencimiento(vehiculo.placasVencimiento ? parseISO(vehiculo.placasVencimiento) : new Date());
        setImosPermiso(vehiculo.imosPermiso || '');
        setImosVencimiento(vehiculo.imosVencimiento ? parseISO(vehiculo.imosVencimiento) : new Date());
        setRevisionMecanica(vehiculo.revisionMecanica || '');
        setRevisionMecanicaVencimiento(vehiculo.revisionMecanicaVencimiento ? parseISO(vehiculo.revisionMecanicaVencimiento) : new Date());
        setPolizaSeguro(vehiculo.polizaSeguro || '');
        setPolizaSeguroVencimiento(vehiculo.polizaSeguroVencimiento ? parseISO(vehiculo.polizaSeguroVencimiento) : new Date());
        setTarjetaCirculacion(vehiculo.tarjetaCirculacion || '');
        setTarjetaCirculacionVencimiento(vehiculo.tarjetaCirculacionVencimiento ? parseISO(vehiculo.tarjetaCirculacionVencimiento) : new Date());
        setIdPropietario(vehiculo.idPropietario || '');
        setIdConductor(vehiculo.idConductor || '');
        setFotoCarro(vehiculo.fotoCarro || '');
        setPlacasDoc(vehiculo.placasDoc || '');
      } catch (error) {
        console.error('Error al obtener el vehículo:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al Obtener Vehículo',
          text: 'No se pudo obtener la información del vehículo, por favor intente nuevamente.',
        });
        onClose();
      }
    };

    getPropietarios();
    getConductores();
    getVehiculo();
  }, [vehiculoId, URI, URI_CONDUCTOR, URI_PROPPIETARIOS, onClose]);

  // Memorización de las opciones para optimizar el rendimiento
  const conductoresOptions = useMemo(
    () =>
      conductores.map((conductor) => ({
        value: conductor.id,
        label: conductor.nombre,
      })),
    [conductores]
  );

  const propietariosOptions = useMemo(
    () =>
      propietarios.map((propietario) => ({
        value: propietario.id,
        label: propietario.nombre,
      })),
    [propietarios]
  );

  // Opción seleccionada para conductor
  const selectedOptionConductor = conductoresOptions.find(
    (option) => option.value === idConductor
  ) || null;

  // Opción seleccionada para propietario
  const selectedOptionPropietario = propietariosOptions.find(
    (option) => option.value === idPropietario
  ) || null;

  // Manejadores de cambio para Select
  const handleChangeConductor = (selectedOption) => {
    setIdConductor(selectedOption ? selectedOption.value : '');
  };

  const handleChangePropietario = (selectedOption) => {
    setIdPropietario(selectedOption ? selectedOption.value : '');
  };

  // Función para transformar la URL de Google Drive para vista previa
  const transformGoogleDriveURL = (url) => {
    if (!url) return null;
    // Reemplaza '/view' por '/preview' para permitir la vista previa en iframe
    return url.replace('/view', '/preview');
  };

  // Función para determinar el tipo de archivo
  const getFileType = (url) => {
    if (!url) return null;
    const extension = url.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension)) {
      return 'image';
    }
    if (['pdf'].includes(extension)) {
      return 'pdf';
    }
    return 'other';
  };

  // Función para renderizar la vista previa del documento en iframe y agregar "Ver Documento"
  const renderPreview = (url, tipo) => {
    if (!url) return null;

    const transformedURL = transformGoogleDriveURL(url);
    const fileType = getFileType(url);

    return (
      <div className="mt-2">
        {fileType === 'image' ? (
          <img
            src={transformedURL}
            alt={`${tipo} Preview`}
            className="w-full h-48 object-contain rounded shadow"
          />
        ) : (
          <iframe
            src={`${transformedURL}&embedded=true`}
            title={`${tipo} Preview`}
            className="w-full h-48 rounded shadow"
            frameBorder="0"
            allow="autoplay"
          />
        )}
      </div>
    );
  };

  // Función para formatear el nombre del archivo
  const formatFileName = (tipo) => {
    const sanitizedMarca = marca.replace(/\s+/g, '_');
    const sanitizedModelo = modelo.replace(/\s+/g, '_');
    const sanitizedColor = color.replace(/\s+/g, '_');
    const sanitizedPlacas = placas.replace(/\s+/g, '_');
    const sanitizedAnio = anio.replace(/\s+/g, '_');

    return `${sanitizedModelo}_${sanitizedMarca}_${sanitizedAnio}_${sanitizedColor}_${sanitizedPlacas}_${tipo}`.toUpperCase();
  };

  // Manejadores de selección de archivos con renombrado
  const handlePlacasDocSelected = (file) => {
    const renamedFile = new File(
      [file],
      `${formatFileName('PLACAS')}.${file.name.split('.').pop()}`,
      { type: file.type }
    );
    setPlacasDocFile(renamedFile);
  };

  const handleFotoCarroDocSelected = (file) => {
    const renamedFile = new File(
      [file],
      `${formatFileName('FOTO_CARRO')}.${file.name.split('.').pop()}`,
      { type: file.type }
    );
    setFotoCarroDocFile(renamedFile);
  };

  const handleImosDocSelected = (file) => {
    const renamedFile = new File(
      [file],
      `${formatFileName('IMOS')}.${file.name.split('.').pop()}`,
      { type: file.type }
    );
    setImosDocFile(renamedFile);
  };

  const handleRevisionMecanicaDocSelected = (file) => {
    const renamedFile = new File(
      [file],
      `${formatFileName('REVISION_MECANICA')}.${file.name.split('.').pop()}`,
      { type: file.type }
    );
    setRevisionMecanicaDocFile(renamedFile);
  };

  const handlePolizaDocSelected = (file) => {
    const renamedFile = new File(
      [file],
      `${formatFileName('POLIZA')}.${file.name.split('.').pop()}`,
      { type: file.type }
    );
    setPolizaDocFile(renamedFile);
  };

  const handleTarjetaCirculacionDocSelected = (file) => {
    const renamedFile = new File(
      [file],
      `${formatFileName('TARJETA_CIRCULACION')}.${file.name.split('.').pop()}`,
      { type: file.type }
    );
    setTarjetaCirculacionDocFile(renamedFile);
  };

  // Función para actualizar el conductor con el ID del vehículo
  const updateConductor = async (id, data) => {
    try {
      const response = await axiosInstance.put(`${URI_CONDUCTOR}/asignar/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar el conductor:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al Actualizar Conductor',
        text: error.response?.data?.error || 'Error desconocido',
      });
    }
  };

  const handleAsignacionExitosa = () => {
    // Aquí puedes actualizar el estado de los vehículos o hacer una recarga de datos
    Swal.fire({
      icon: 'success',
      title: 'Asignación completada',
      text: 'El chofer ha sido asignado correctamente al vehículo.',
    });
  };

  console.log('ID Conductor:', idConductor);
  console.log('ID Propietario:', idPropietario);

  // Función de validación del formulario
  const validateForm = () => {
    console.log('Validando formulario con los siguientes valores:', {
      marca,
      modelo,
      color,
      anio,
      placas,
      numeroSerie,
      precioRenta,
      idPropietario,
    });

    let nuevosErroresCampos = {
      marca: false,
      modelo: false,
      color: false,
      anio: false,
      placas: false,
      numeroSerie: false,
      renta: false,
      idPropietario: false,
    };

    let errores = [];

    // Validaciones
    const validaciones = [
      { error: validarVacio(marca, 'Marca') || validarNombreLongitud(marca), campo: 'marca' },
      { error: validarVacio(modelo, 'Modelo') || validarNombreLongitud(modelo), campo: 'modelo' },
      { error: validarVacio(color, 'Color'), campo: 'color' },
      { error: validarVacio(anio, 'Año') || validarSoloNumeros(anio), campo: 'anio' },
      { error: validarVacio(placas, 'Placas') || validarNombreLongitud(placas), campo: 'placas' },
      { error: validarVacio(numeroSerie, 'Número de Serie'), campo: 'numeroSerie' },
      { error: validarVacio(precioRenta, 'Precio de Renta') || validarSoloNumeros(precioRenta), campo: 'renta' },
      { error: validarIndividuo(idPropietario, 'Propietario'), campo: 'idPropietario' },
    ];

    validaciones.forEach(({ error, campo }) => {
      if (error) {
        errores.push(error);
        nuevosErroresCampos[campo] = true;
      }
    });

    setErroresCampos(nuevosErroresCampos);

    if (errores.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Errores de validación',
        html: `<ul>${errores.map((err) => `<li>${err}</li>`).join('')}</ul>`,
      });
      return false;
    }

    return true;
  };

  // Función para formatear la fecha a 'yyyy-MM-dd'
  const formatFecha = (fecha) => {
    if (!fecha) return '';

    try {
      return format(fecha, 'yyyy-MM-dd');
    } catch (error) {
      console.error('Error formateando la fecha:', error);
      return '';
    }
  };

  // Función para extraer el FILE_ID de la URL de Google Drive
  const extractFileId = (url) => {
    console.log('URL:', url);
    if (!url) return null;
    const regex = /\/d\/([a-zA-Z0-9_-]{25,})\//; // Asegura que el ID tenga al menos 25 caracteres
    const match = url.match(regex);
    console.log('Match:', match);
    return match ? match[1] : null;
  };

  // Función para manejar la eliminación de archivos (Generalizada)
  const handleDeleteFiles = async (docUrl, setDocUrl, docType) => {
    try {
      const urlId = extractFileId(docUrl); // Obtener el ID del archivo
      if (!urlId) {
        console.error('ID del archivo no válido, no se puede eliminar.');
        Swal.fire({
          icon: 'error',
          title: 'ID Inválido',
          text: 'No se pudo obtener el ID del archivo para eliminar.',
        });
        return;
      }

      console.log(`Eliminando archivo de Google Drive (${docType}) con ID:`, urlId);

      // Eliminar el archivo usando la función deleteFile
      const mensaje = await deleteFile(urlId); // Esperar a que se elimine el archivo

      console.log('Archivo eliminado exitosamente:', mensaje);

      // Vaciar el estado del documento correspondiente
      setDocUrl('');

      // Mostrar alerta de éxito (opcional)
      // Swal.fire({
      //   icon: 'success',
      //   title: 'Archivo Eliminado',
      //   text: `El archivo de ${docType} ha sido eliminado correctamente.`,
      // });

    } catch (error) {
      console.error('Error al eliminar el archivo de Google Drive:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al Eliminar Archivo',
        text: 'No se pudo eliminar el archivo de Google Drive, por favor intente nuevamente.',
      });
    }
  };

  // Función para manejar la actualización del vehículo
  const updateVehiculo = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      Swal.fire({
        title: "Cargando Documentos...",
        html: "Por favor, espere...",
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false, // Desactiva clics fuera de la alerta
        allowEscapeKey: false,   // Desactiva la tecla Escape
      });
      

      // Función para eliminar y luego subir archivos si se ha seleccionado uno nuevo
      const handleDeleteAndUpload = async (docUrl, setDocUrl, docFile, docType) => {
        if (docFile) {
          if (docUrl) {
            // Primero eliminar el archivo antiguo
            await handleDeleteFiles(docUrl, setDocUrl, docType);
          }
          // Luego subir el nuevo archivo
          const uploadedUrl = await sendUpload({ target: { files: [docFile] } });
          return uploadedUrl || '';
        } else {
          // Si no hay un nuevo archivo, mantener la URL existente
          return docUrl || '';
        }
      };

      // Manejar cada documento secuencialmente
      const placasDocUrl = await handleDeleteAndUpload(placasDoc, setPlacasDoc, placasDocFile, 'Placas');
      const imosDocUrl = await handleDeleteAndUpload(imosPermiso, setImosPermiso, imosDocFile, 'Permiso IMOS');
      const revisionMecanicaDocUrl = await handleDeleteAndUpload(revisionMecanica, setRevisionMecanica, revisionMecanicaDocFile, 'Revisión Mecánica');
      const polizaDocUrl = await handleDeleteAndUpload(polizaSeguro, setPolizaSeguro, polizaDocFile, 'Póliza de Seguro');
      const tarjetaCirculacionDocUrl = await handleDeleteAndUpload(tarjetaCirculacion, setTarjetaCirculacion, tarjetaCirculacionDocFile, 'Tarjeta de Circulación');
      const fotoCarroDocUrl = await handleDeleteAndUpload(fotoCarro, setFotoCarro, fotoCarroDocFile, 'Foto del Vehículo');

      Swal.close();

      console.log('Actualizando vehículo...');
      // ... (resto de los logs)

      try {
        Swal.fire({
          title: "Cargando Documentos...",
          html: "Por favor, espere...",
          didOpen: () => {
            Swal.showLoading();
          },
          allowOutsideClick: false, // Desactiva clics fuera de la alerta
          allowEscapeKey: false,   // Desactiva la tecla Escape
        });
        

        const datosVehiculo = {
          marca,
          modelo,
          color,
          anio: parseInt(`20${anio}`, 10),
          placas,
          numeroSerie,
          precioRenta: parseInt(precioRenta, 10),
          placasDoc: placasDocUrl,
          placasVencimiento: formatFecha(placasVencimiento),
          imosPermiso: imosDocUrl,
          imosVencimiento: formatFecha(imosVencimiento),
          revisionMecanica: revisionMecanicaDocUrl,
          revisionMecanicaVencimiento: formatFecha(revisionMecanicaVencimiento),
          polizaSeguro: polizaDocUrl,
          polizaSeguroVencimiento: formatFecha(polizaSeguroVencimiento),
          tarjetaCirculacion: tarjetaCirculacionDocUrl,
          tarjetaCirculacionVencimiento: formatFecha(tarjetaCirculacionVencimiento),
          idPropietario: parseInt(idPropietario, 10),
          fotoCarro: fotoCarroDocUrl,
        };


        console.log('Datos del Vehículo:', datosVehiculo, 'ID:', vehiculoId);
        const response = await axiosInstance.put(`${URI}/${vehiculoId}`, datosVehiculo);

        console.log('Respuesta de la actualización del vehículo:', response.data);

        //Si se especifica un conductor, actualizar el conductor con el ID del vehículo recién actualizado
        if (idConductor) {
          await updateConductor(idConductor, { idVehiculo: vehiculoId });
        }

        Swal.close();

        Swal.fire({
          icon: 'success',
          title: 'Vehículo actualizado con éxito',
          showConfirmButton: false,
          timer: 1500,
        });

        onClose();
        getVehiculos();
        navigate('/vehiculos');
      } catch (error) {
        Swal.close();
        console.error('Error actualizando vehículo:', error);
        onClose();
      }
    } catch (error) {
      Swal.close();
      console.error('Error al Subir Archivos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al Subir Archivos',
        text: 'No se pudieron guardar los archivos en Drive, por favor intente nuevamente.',
      });
    }
  };

  return (
    <>
      <div className="p-6 bg-white rounded-lg shadow-xl w-full text-xl font-bold mb-8 relative">
        {/* Botón de cerrar */}
        <button
          className="absolute right-2 text-red-500 hover:text-red-800 text-4xl"
          onClick={onClose}
        >
          <i className="fa-solid fa-circle-xmark"></i>
        </button>

        <h2 className="text-3xl text-center font-bold mb-4">Editar Vehículo</h2>
        {/* Línea Negra Gruesa */}
        <div className="h-1 w-full bg-gray-500 mb-4"></div>
        {Object.values(erroresCampos).some((error) => error) && (
          <p className="text-red-500 mb-4">Por favor corrige los errores en el formulario.</p>
        )}
        <form onSubmit={updateVehiculo}>
          {/* Campos del Formulario */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
            {/* Marca */}
            <div className="mb-4">
              <label htmlFor="marca" className="block font-bold mb-2">Marca:</label>
              <input
                id="marca"
                type="text"
                className={`shadow w-full p-2 rounded border-2 ${erroresCampos.marca ? 'border-red-500' : 'border-gray-400'}`}
                value={marca}
                maxLength="40"
                onChange={(e) => {
                  const regex = /^[a-zA-Z\s]*$/;
                  if (regex.test(e.target.value)) {
                    setMarca(e.target.value);
                  }
                }}
                placeholder="Marca del vehículo"
              />
            </div>

            {/* Modelo */}
            <div className="mb-4">
              <label htmlFor="modelo" className="block font-bold mb-2">Modelo:</label>
              <input
                id="modelo"
                type="text"
                className={`shadow w-full p-2 rounded border-2 ${erroresCampos.modelo ? 'border-red-500' : 'border-gray-400'}`}
                value={modelo}
                maxLength="40"
                onChange={(e) => {
                  const regex = /^[a-zA-Z\s]*$/;
                  if (regex.test(e.target.value)) {
                    setModelo(e.target.value);
                  }
                }}
                placeholder="Modelo del vehículo"
              />
            </div>

            {/* Color */}
            <div className="mb-4">
              <label htmlFor="color" className="block font-bold mb-2">Color:</label>
              <input
                id="color"
                type="text"
                className={`shadow w-full p-2 rounded border-2 ${erroresCampos.color ? 'border-red-500' : 'border-gray-400'}`}
                value={color}
                maxLength="30"
                onChange={(e) => {
                  const regex = /^[a-zA-Z\s]*$/;
                  if (regex.test(e.target.value)) {
                    setColor(e.target.value);
                  }
                }}
                placeholder="Color del vehículo"
              />
            </div>

            {/* Año */}
            <div className="mb-4">
              <label htmlFor="anio" className="block font-bold mb-2">Año:</label>
              <input
                id="anio"
                type="text"
                className={`shadow w-full p-2 rounded border-2 ${erroresCampos.anio ? 'border-red-500' : 'border-gray-400'}`}
                value={`20${anio}`} // Prefijo "20" permanente
                maxLength="4"
                onChange={(e) => {
                  const inputValue = e.target.value.slice(2); // Solo permitir modificar los últimos dos dígitos
                  const regex = /^[0-9]{0,2}$/; // Aceptar solo dos dígitos numéricos
                  if (regex.test(inputValue)) {
                    setAnio(inputValue); // Guardar solo los dos últimos dígitos en el estado
                  }
                }}
                placeholder="Año del vehículo"
              />
            </div>
          </div>

          {/* Segundo Grupo de Campos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
            {/* Placas */}
            <div className="mb-4">
              <label htmlFor="placas" className="block font-bold mb-2">Placas:</label>
              <input
                id="placas"
                type="text"
                className={`shadow w-full p-2 rounded border-2 ${erroresCampos.placas ? 'border-red-500' : 'border-gray-400'}`}
                value={placas}
                maxLength="10"
                onChange={(e) => {
                  const regex = /^[a-zA-Z0-9\s]*$/;
                  if (regex.test(e.target.value)) {
                    setPlacas(e.target.value.toUpperCase()); // Convierte el valor a mayúsculas
                  }
                }}
                placeholder="Placas del vehículo"
              />
            </div>

            {/* Número de Serie */}
            <div className="mb-4">
              <label htmlFor="numeroSerie" className="block font-bold mb-2">Número de Serie:</label>
              <input
                id="numeroSerie"
                type="text"
                className={`shadow w-full p-2 rounded border-2 ${erroresCampos.numeroSerie ? 'border-red-500' : 'border-gray-400'}`}
                value={numeroSerie}
                maxLength="50"
                onChange={(e) => {
                  const regex = /^[a-zA-Z0-9\s]*$/;
                  if (regex.test(e.target.value)) {
                    setNumeroSerie(e.target.value.toUpperCase()); // Convierte el valor a mayúsculas
                  }
                }}
                placeholder="Número de serie del vehículo"
              />
            </div>

            {/* Precio de Renta */}
            <div className="mb-4">
              <label htmlFor="precioRenta" className="block font-bold mb-2">Precio de Renta:</label>
              <div className="relative">
                <input
                  id="precioRenta"
                  type="text"
                  className={`shadow pl-8 pr-10 p-2 rounded border-2 ${erroresCampos.renta ? 'border-red-500' : 'border-gray-400'}`}
                  value={precioRenta != null ? `$${Number(precioRenta).toLocaleString('es-ES')}` : ''} // Mostrar el valor formateado
                  maxLength="5"
                  onChange={(e) => {
                    const inputValue = e.target.value.replace(/[^0-9]/g, ''); // Eliminar todo lo que no sea dígito
                    setPrecioRenta(inputValue); // Almacenar solo el número sin formato
                  }}
                  placeholder="$ 0,000"
                />
              </div>
            </div>
          </div>

          {/* Selección de Propietario y Conductor */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 justify-center">
            {/* Propietario */}
            <div className="mb-4">
              <label className="block font-bold mb-2">Propietario:</label>
              <Select
                className={`shadow rounded border-2 ${
                  erroresCampos.idPropietario ? 'border-red-500' : 'border-gray-400'
                }`}
                value={selectedOptionPropietario}
                onChange={handleChangePropietario}
                options={propietariosOptions}
                placeholder="Nombre del Propietario"
                isClearable // Permite limpiar la selección
              />
            </div>
            {/* Conductor */}
            <div className="mb-4">
              <label className="block font-bold mb-2">Conductor:</label>
              <AsignarChofer 
                idVehiculo={vehiculoId}
                onAsignacionExitosa={handleAsignacionExitosa}  
              />
            </div>
          </div>

          {/* Documentos del Vehículo */}
          <div>
            {/* Separador */}
            <div className="h-1 w-full bg-gray-400 mb-4"></div>
            <h2 className="text-2xl text-center font-bold mt-6 mb-14">Documentación del Vehículo</h2>

            {/* Secciones de Documentación */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              <h1 className="text-2xl text-center font-bold mb-2">Placas</h1>
              <h1 className="text-2xl text-center font-bold mb-2">Permiso IMOS</h1>
              <h1 className="text-2xl text-center font-bold mb-2">Revisión Mecánica</h1>
            </div>

            <div className="text-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {/* Placas */}
              
              {console.log('Placas Vencimiento:', placasVencimiento)}
              <DocumentSection
                title="Placas"
                docUrl={placasDoc}
                setDocUrl={setPlacasDoc}
                vencimiento={placasVencimiento}
                setVencimiento={setPlacasVencimiento}
                onFileSelected={handlePlacasDocSelected}
                renderPreview={renderPreview}
                handleDeleteFiles={handleDeleteFiles}
                docType="Placas"
                isDatePicker
              />

              {/* Permiso IMOS */}
              <DocumentSection
                title="Permiso IMOS"
                docUrl={imosPermiso}
                setDocUrl={setImosPermiso}
                vencimiento={imosVencimiento}
                setVencimiento={setImosVencimiento}
                onFileSelected={handleImosDocSelected}
                renderPreview={renderPreview}
                handleDeleteFiles={handleDeleteFiles}
                docType="Permiso IMOS"
                isDatePicker
              />

              {/* Revisión Mecánica */}
              <DocumentSection
                title="Revisión Mecánica"
                docUrl={revisionMecanica}
                setDocUrl={setRevisionMecanica}
                vencimiento={revisionMecanicaVencimiento}
                setVencimiento={setRevisionMecanicaVencimiento}
                onFileSelected={handleRevisionMecanicaDocSelected}
                renderPreview={renderPreview}
                handleDeleteFiles={handleDeleteFiles}
                docType="Revisión Mecánica"
                isDatePicker
              />
            </div>

            {/* Más Secciones de Documentación */}
            <div className="mt-5 text-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              <h1 className="text-2xl font-bold mb-2">Seguro</h1>
              <h1 className="text-2xl font-bold mb-2">Tarjeta de Circulación</h1>
              <h1 className="text-2xl font-bold mb-2">Foto del Vehículo</h1>
            </div>

            <div className="text-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {/* Póliza de Seguro */}
              <DocumentSection
                title="Póliza de Seguro"
                docUrl={polizaSeguro}
                setDocUrl={setPolizaSeguro}
                vencimiento={polizaSeguroVencimiento}
                setVencimiento={setPolizaSeguroVencimiento}
                onFileSelected={handlePolizaDocSelected}
                renderPreview={renderPreview}
                handleDeleteFiles={handleDeleteFiles}
                docType="Póliza de Seguro"
                isDatePicker
              />

              {/* Tarjeta de Circulación */}
              <DocumentSection
                title="Tarjeta de Circulación"
                docUrl={tarjetaCirculacion}
                setDocUrl={setTarjetaCirculacion}
                vencimiento={tarjetaCirculacionVencimiento}
                setVencimiento={setTarjetaCirculacionVencimiento}
                onFileSelected={handleTarjetaCirculacionDocSelected}
                renderPreview={renderPreview}
                handleDeleteFiles={handleDeleteFiles}
                docType="Tarjeta de Circulación"
                isDatePicker
              />

              {/* Foto del Vehículo */}
              <DocumentSection
                title="Foto del Vehículo"
                docUrl={fotoCarro}
                setDocUrl={setFotoCarro}
                vencimiento={null} // No aplica
                setVencimiento={null} // No aplica
                onFileSelected={handleFotoCarroDocSelected}
                renderPreview={renderPreview}
                handleDeleteFiles={handleDeleteFiles}
                docType="Foto del Vehículo"
                isDatePicker={false}
              />
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-center items-center mt-4">
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 mr-4 rounded hover:bg-red-700 font-bold"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 ml-4 rounded hover:bg-green-800 font-bold"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CompEditVehiculo;
