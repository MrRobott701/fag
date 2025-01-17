import axiosInstance from '../../../axiosConfig.js';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'flatpickr/dist/flatpickr.min.css';
import Select from 'react-select';
import DocumentSection from './DocumentSection.jsx';
import { sendUpload } from '../../sendUpload';

import {
  validarVacio,
  validarNombreLongitud,
  validarSoloNumeros,
} from '../../validations/validaciones.js';

const URI = 'https://all-gates.onrender.com/vehiculos';
const URI_CONDUCTOR = 'https://all-gates.onrender.com/conductores';

const CompCreateVehiculos = ({ onClose, getVehiculos }) => {
  const [propietarios, setPropietarios] = useState([]);
  const [conductores, setConductores] = useState([]);

  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [color, setColor] = useState('');
  const [anio, setAnio] = useState('');
  const [placas, setPlacas] = useState('');

  const [placasDoc, setPlacasDoc] = useState('');
  const fechaInicial = new Date();
fechaInicial.setFullYear(fechaInicial.getFullYear() + 1);

const [placasVencimiento, setPlacasVencimiento] = useState(fechaInicial);


  const [numeroSerie, setnumeroSerie] = useState('');

  const [imosPermiso, setImosPermiso] = useState('');
  const [imosVencimiento, setImosVencimiento] = useState(fechaInicial);

  const [revisionMecanica, setRevisionMecanica] = useState('');
  const [revisionMecanicaVencimiento, setRevisionMecanicaVencimiento] = useState(fechaInicial);

  const [polizaSeguro, setPolizaSeguro] = useState('');
  const [polizaSeguroVencimiento, setPolizaSeguroVencimiento] = useState(fechaInicial);

  const [tarjetaCirculacion, setTarjetaCirculacion] = useState('');
  const [tarjetaCirculacionVencimiento, setTarjetaCirculacionVencimiento] = useState(fechaInicial);

  const [precioRenta, setPrecioRenta] = useState('');

  const [placasDocFile, setPlacasDocFile] = useState(null);
  const [imosDocFile, setImosDocFile] = useState(null);
  const [revisionMecanicaDocFile, setRevisionMecanicaDocFile] = useState(null);
  const [polizaDocFile, setPolizaDocFile] = useState(null);
  const [tarjetaCirculacionDocFile, setTarjetaCirculacionDocFile] = useState(null);
  const [fotoCarroDocFile, setFotoCarroDocFile] = useState(null);

  const [fotoCarro, setFotoCarro] = useState('');
  const [idPropietario, setIdPropietario] = useState('');
  const [idConductor, setIdConductor] = useState('0');
  const [activo, setActivo] = useState('1');

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
        const response = await axiosInstance.get('https://all-gates.onrender.com/propietarios');
        setPropietarios(response.data);
      } catch (error) {
        console.error('Error al obtener los propietarios:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al Obtener Propietarios',
          text: 'No se pudieron obtener los propietarios.',
        });
      }
    };

    const getConductores = async () => {
      try {
        const response = await axiosInstance.get('https://all-gates.onrender.com/conductores/activo');
        setConductores(response.data);
      } catch (error) {
        console.error('Error al obtener los conductores:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al Obtener Conductores',
          text: 'No se pudieron obtener los conductores.',
        });
      }
    };

    getConductores();
    getPropietarios();
  }, []);

  const conductoresOptions = conductores.map(conductor => ({
    value: conductor.id,
    label: conductor.nombre
  }));

  const propietariosOptions = propietarios.map(propietario => ({
    value: propietario.id,
    label: propietario.nombre
  }));

  const selectedOptionConductor = conductoresOptions.find(
    option => option.value === idConductor
  ) || null;

  const selectedOptionPropietario = propietariosOptions.find(
    option => option.value === idPropietario
  ) || null;

  const handleChangeConductor = selectedOption => {
    setIdConductor(selectedOption ? selectedOption.value : null);
  };

  const handleChangePropietario = selectedOption => {
    setIdPropietario(selectedOption ? selectedOption.value : null);
  };

  const transformGoogleDriveURL = (url) => {
    const fileIdMatch = url ? url.match(/\/d\/(.*?)\//) : null;
    if (fileIdMatch) {
      const fileId = fileIdMatch[1];
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
    return url;
  };

  const getFileType = (url) => {
    if(!url) return '';
    const extension = url.split('?')[0].split('.').pop().toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    if (imageExtensions.includes(extension)) {
      return 'image';
    } else if (extension === 'pdf') {
      return 'pdf';
    } else {
      return 'other';
    }
  };

  const extractFileId = (url) => {
    if(!url) return null;
    const match = url.match(/\/d\/([^/]+)\//);
    return match ? match[1] : null;
  };

  const deleteFile = async (fileId) => {
    // Implementa aquí la lógica de eliminación en tu API o Drive
    console.log(`Archivo con ID ${fileId} eliminado (simulado)`);
    return 'Archivo eliminado correctamente';
  };

  const handleDeleteFiles = async (docUrl, setDocUrl, docType) => {
    const urlId = extractFileId(docUrl);
    if (!urlId) {
      console.error('ID del archivo no válido, no se puede eliminar.');
      Swal.fire({
        icon: 'error',
        title: 'ID Inválido',
        text: 'No se pudo obtener el ID del archivo para eliminar.',
      });
      return;
    }

    try {
      await deleteFile(urlId);
      setDocUrl('');
    } catch (error) {
      console.error('Error al eliminar el archivo de Google Drive:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al Eliminar Archivo',
        text: 'No se pudo eliminar el archivo de Google Drive.',
      });
    }
  };

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

  const formatFileName = (tipo) => {
    const sanitizedMarca = marca.replace(/\s+/g, '_');
    const sanitizedModelo = modelo.replace(/\s+/g, '_');
    const sanitizedColor = color.replace(/\s+/g, '_');
    const sanitizedPlacas = placas.replace(/\s+/g, '_');
    const sanitizedAnio = anio.replace(/\s+/g, '_');

    return `${sanitizedModelo}_${sanitizedMarca}_${sanitizedAnio}_${sanitizedColor}_${sanitizedPlacas}_${tipo}`.toUpperCase();
  };

  const handlePlacasDocSelected = (file) => {
    if(file){
      const renamedFile = new File([file], formatFileName('PLACAS') + '.' + file.name.split('.').pop(), { type: file.type });
      setPlacasDocFile(renamedFile);
    } else {
      setPlacasDocFile(null);
    }
  };

  const handleImosDocSelected = (file) => {
    if(file){
      const renamedFile = new File([file], formatFileName('IMOS') + '.' + file.name.split('.').pop(), { type: file.type });
      setImosDocFile(renamedFile);
    } else {
      setImosDocFile(null);
    }
  };

  const handleRevisionMecanicaDocSelected = (file) => {
    if(file){
      const renamedFile = new File([file], formatFileName('REVISION_MECANICA') + '.' + file.name.split('.').pop(), { type: file.type });
      setRevisionMecanicaDocFile(renamedFile);
    } else {
      setRevisionMecanicaDocFile(null);
    }
  };

  const handlePolizaDocSelected = (file) => {
    if(file){
      const renamedFile = new File([file], formatFileName('POLIZA') + '.' + file.name.split('.').pop(), { type: file.type });
      setPolizaDocFile(renamedFile);
    } else {
      setPolizaDocFile(null);
    }
  };

  const handleTarjetaCirculacionDocSelected = (file) => {
    if(file){
      const renamedFile = new File([file], formatFileName('TARJETA_CIRCULACION') + '.' + file.name.split('.').pop(), { type: file.type });
      setTarjetaCirculacionDocFile(renamedFile);
    } else {
      setTarjetaCirculacionDocFile(null);
    }
  };

  const handleFotoCarroDocSelected = (file) => {
    if(file){
      const renamedFile = new File([file], formatFileName('FOTO_CARRO') + '.' + file.name.split('.').pop(), { type: file.type });
      setFotoCarroDocFile(renamedFile);
    } else {
      setFotoCarroDocFile(null);
    }
  };

  const updateConductor = async (id, data) => {
    try {
      const response = await axiosInstance.put(`${URI_CONDUCTOR}/asignar/${id}`, {
        idVehiculo: data.idVehiculo,
      }, {
        headers : {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar el conductor:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar conductor',
        text: error.response?.data?.error || 'Error desconocido',
      });
    }
  };

  const validateForm = () => {
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

    const validaciones = [
      { error: validarVacio(marca, 'Marca') || validarNombreLongitud(marca), campo: 'marca' },
      { error: validarVacio(modelo, 'Modelo') || validarNombreLongitud(modelo), campo: 'modelo' },
      { error: validarVacio(color, 'Color'), campo: 'color' },
      { error: validarVacio(anio, 'Año') || validarSoloNumeros(anio), campo: 'anio' },
      { error: validarVacio(placas, 'Placas') || validarNombreLongitud(placas), campo: 'placas' },
      { error: validarVacio(numeroSerie, 'Número de Serie'), campo: 'numeroSerie' },
      { error: validarVacio(precioRenta, 'Precio de Renta') || validarSoloNumeros(precioRenta), campo: 'renta' },
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

  const formatFecha = (fecha) => {
    if (!fecha || !(fecha instanceof Date)) return null;
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${anio}-${mes}-${dia}`;
  };

  const storeVehiculo = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    let placasDocUrl = '';
    let imosDocUrl = '';
    let revisionMecanicaDocUrl = '';
    let polizaDocUrl = '';
    let tarjetaCirculacionDocUrl = '';
    let fotoCarroDocUrl = '';

    try {
      Swal.fire({
        title: "Cargando Documentos...",
        html: "Por favor, espere...",
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      const placasPromise = placasDocFile ? sendUpload({ target: { files: [placasDocFile] } }) : Promise.resolve(null);
      const imosPromise = imosDocFile ? sendUpload({ target: { files: [imosDocFile] } }) : Promise.resolve(null);
      const revisionMecanicaPromise = revisionMecanicaDocFile ? sendUpload({ target: { files: [revisionMecanicaDocFile] } }) : Promise.resolve(null);
      const polizaPromise = polizaDocFile ? sendUpload({ target: { files: [polizaDocFile] } }) : Promise.resolve(null);
      const tarjetaCirculacionPromise = tarjetaCirculacionDocFile ? sendUpload({ target: { files: [tarjetaCirculacionDocFile] } }) : Promise.resolve(null);
      const fotoCarroPromise = fotoCarroDocFile ? sendUpload({ target: { files: [fotoCarroDocFile] } }) : Promise.resolve(null);

      const [
        placasDocResult,
        imosDocResult,
        revisionMecanicaDocResult,
        polizaDocResult,
        tarjetaCirculacionDocResult,
        fotoCarroResult
      ] = await Promise.all([
        placasPromise,
        imosPromise,
        revisionMecanicaPromise,
        polizaPromise,
        tarjetaCirculacionPromise,
        fotoCarroPromise
      ]);

      if (placasDocResult) placasDocUrl = placasDocResult;
      if (imosDocResult) imosDocUrl = imosDocResult;
      if (revisionMecanicaDocResult) revisionMecanicaDocUrl = revisionMecanicaDocResult;
      if (polizaDocResult) polizaDocUrl = polizaDocResult;
      if (tarjetaCirculacionDocResult) tarjetaCirculacionDocUrl = tarjetaCirculacionDocResult;
      if (fotoCarroResult) fotoCarroDocUrl = fotoCarroResult;

      Swal.close();

      const placasVencimientoFormatted = formatFecha(placasVencimiento);
      const imosVencimientoFormatted = formatFecha(imosVencimiento);
      const revisionMecanicaVencimientoFormatted = formatFecha(revisionMecanicaVencimiento);
      const polizaSeguroVencimientoFormatted = formatFecha(polizaSeguroVencimiento);
      const tarjetaCirculacionVencimientoFormatted = formatFecha(tarjetaCirculacionVencimiento);

      const response = await axiosInstance.post(URI, {
        marca,
        modelo,
        color,
        anio: `20${anio}`,
        placas,
        numeroSerie,
        precioRenta: parseInt(precioRenta, 10),
        placasDoc: placasDocUrl,
        placasVencimiento: placasVencimientoFormatted,
        imosPermiso: imosDocUrl,
        imosVencimiento: imosVencimientoFormatted,
        revisionMecanica: revisionMecanicaDocUrl,
        revisionMecanicaVencimiento: revisionMecanicaVencimientoFormatted,
        polizaSeguro: polizaDocUrl,
        polizaSeguroVencimiento: polizaSeguroVencimientoFormatted,
        tarjetaCirculacion: tarjetaCirculacionDocUrl,
        tarjetaCirculacionVencimiento: tarjetaCirculacionVencimientoFormatted,
        idPropietario,
        idConductor: idConductor || null,
        fotoCarro: fotoCarroDocUrl,
        activo:1,
      });

      const newVehiculo = response.data.vehiculo;

      if (!newVehiculo || !newVehiculo.id) {
        throw new Error('El vehículo no se creó correctamente.');
      }

      if (idConductor) {
        await updateConductor(idConductor, { idVehiculo: newVehiculo.id });
      }

      Swal.close();

      Swal.fire({
        icon: 'success',
        title: 'Vehículo creado con éxito',
        showConfirmButton: false,
        timer: 1500,
      });

      onClose();
      getVehiculos();
      navigate('/vehiculos');
    } catch (error) {
      Swal.close();
      console.error('Error creando vehículo:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al Crear Vehículo',
        text: 'No se pudo guardar el vehículo, por favor intente nuevamente.',
      });
    }
  };

  return (
    <>
      <div className="p-6 bg-white rounded-lg shadow-xl w-full text-xl font-bold mb-8">
        <button
          className="absolute mr-12 top-20 right-2 text-red-500 hover:text-red-800 text-4xl"
          onClick={onClose}
        >
          <i className="fa-solid fa-circle-xmark"></i>
        </button>

        <h2 className="text-3xl text-center font-bold mb-4">Crear Vehículo</h2>
        <div className="h-1 w-full bg-gray-500 mb-4"></div>
        {Object.values(erroresCampos).some((error) => error) && (
          <p className="text-red-500 mb-4">Por favor corrige los errores en el formulario.</p>
        )}
        <form onSubmit={storeVehiculo}>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="mb-4">
              <label className="block font-bold mb-2">Marca:</label>
              <input
                type="text"
                className={`shadow w-full p-2 rounded border-2 ${erroresCampos.marca ? 'border-red-500' : 'border-gray-400'}`}
                value={marca}
                maxLength="40"
                onChange={(e) =>{
                  const regex = /^[a-zA-Z\s]*$/;
                  if (regex.test(e.target.value)) {
                    setMarca(e.target.value)
                  }
                }}
                placeholder="Marca del vehículo"
              />
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-2">Modelo:</label>
              <input
                type="text"
                className={`shadow w-full p-2 rounded border-2 ${erroresCampos.modelo ? 'border-red-500' : 'border-gray-400'}`}
                value={modelo}
                maxLength="40"
                onChange={(e) =>{
                  const regex = /^[a-zA-Z\s]*$/;
                  if (regex.test(e.target.value)) {
                    setModelo(e.target.value)
                  }
                }}
                placeholder="Modelo del vehículo"
              />
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-2">Color:</label>
              <input
                type="text"
                className={`shadow w-full p-2 rounded border-2 ${erroresCampos.color ? 'border-red-500' : 'border-gray-400'}`}
                value={color}
                maxLength="30"
                onChange={(e) =>{
                  const regex = /^[a-zA-Z\s]*$/;
                  if (regex.test(e.target.value)) {
                    setColor(e.target.value)
                  }
                }}
                placeholder="Color del vehículo"
              />
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-2">Año:</label>
              <input
                type="text"
                className={`shadow w-full p-2 rounded border-2 ${erroresCampos.anio ? 'border-red-500' : 'border-gray-400'}`}
                value={`20${anio}`}
                maxLength="4"
                onChange={(e) => {
                  const inputValue = e.target.value.slice(2);
                  const regex = /^[0-9]{0,2}$/;
                  if (regex.test(inputValue)) {
                    setAnio(inputValue);
                  }
                }}
                placeholder="Año del vehículo"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="mb-4">
              <label className="block font-bold mb-2">Placas:</label>
              <input
                type="text"
                className={`shadow w-full p-2 rounded border-2 ${erroresCampos.placas ? 'border-red-500' : 'border-gray-400'}`}
                value={placas}
                maxLength="10"
                onChange={(e) => {
                  const regex = /^[a-zA-Z0-9\s]*$/;
                  if (regex.test(e.target.value)) {
                    setPlacas(e.target.value.toUpperCase());
                  }
                }}
                placeholder="Placas del vehículo"
              />
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-2">Número de Serie:</label>
              <input
                type="text"
                className={`shadow w-full p-2 rounded border-2 ${erroresCampos.numeroSerie ? 'border-red-500' : 'border-gray-400'}`}
                value={numeroSerie}
                maxLength="50"
                onChange={(e) =>{
                  const regex = /^[a-zA-Z0-9\s]*$/;
                  if (regex.test(e.target.value)) {
                    setnumeroSerie(e.target.value.toUpperCase());
                  }
                }}
                placeholder="Número de serie del vehículo"
              />
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-2">Precio de Renta:</label>
              <div className="relative">
                <input
                  type="text"
                  className={`shadow pl-8 pr-10 p-2 rounded border-2 ${erroresCampos.renta ? 'border-red-500' : 'border-gray-400'}`}
                  value={precioRenta ? `$${Number(precioRenta).toLocaleString('en-US')}` : ''}
                  maxLength="5"
                  onChange={(e) => {
                    const inputValue = e.target.value.replace(/[^0-9]/g, '');
                    setPrecioRenta(inputValue);
                  }}
                  placeholder="$ 0,000"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-2 gap-6">
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
                isClearable
              />
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-2">Conductor:</label>
              <Select
                className="shadow rounded border-2"
                value={selectedOptionConductor}
                onChange={handleChangeConductor}
                options={conductoresOptions}
                placeholder="Nombre del Conductor"
                isClearable
              />
            </div>
          </div>
          <div className="h-1 w-full bg-gray-400 mb-4"></div>
          <h2 className="text-2xl text-center font-bold mt-6 mb-14">Documentación del Vehículo</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            <h1 className="text-2xl text-center font-bold mb-8">Placas</h1>
            <h1 className="text-2xl text-center font-bold mb-8">IMOS</h1>
            <h1 className="text-2xl text-center font-bold mb-8">Revisión Mecánica</h1>
          </div>

          <div className="text-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            
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

            <DocumentSection
              title="IMOS"
              docUrl={imosPermiso}
              setDocUrl={setImosPermiso}
              vencimiento={imosVencimiento}
              setVencimiento={setImosVencimiento}
              onFileSelected={handleImosDocSelected}
              renderPreview={renderPreview}
              handleDeleteFiles={handleDeleteFiles}
              docType="IMOS"
              isDatePicker
            />

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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-8">
            <h1 className="text-2xl text-center font-bold mb-8">Seguro</h1>
            <h1 className="text-2xl text-center font-bold mb-8">Tarjeta de Circulación</h1>
            <h1 className="text-2xl text-center font-bold mb-8">Foto del Vehículo</h1>
          </div>

          <div className="text-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
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

            <DocumentSection
              title="Foto del Vehículo"
              docUrl={fotoCarro}
              setDocUrl={setFotoCarro}
              vencimiento={null}
              setVencimiento={() => {}}
              onFileSelected={handleFotoCarroDocSelected}
              renderPreview={renderPreview}
              handleDeleteFiles={handleDeleteFiles}
              docType="Foto del Vehículo"
              isDatePicker={false}
            />
          </div>

          <div className="flex justify-center items-center mt-4">
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 mr-16 rounded hover:bg-red-700 font-bold"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 ml-16 rounded hover:bg-green-800 font-bold"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CompCreateVehiculos;
