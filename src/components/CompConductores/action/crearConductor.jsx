import axiosInstance from '../../../axiosConfig';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Upload from '../../Upload';
import Swal from 'sweetalert2';
import { sendUpload } from '../../sendUpload';
import VehiculoSelect from './VehiculoSelect';
import {
  validarVacio,
  validarNombreLongitud,
  validarNombreSoloLetras,
  validarDocumentoSoloLetras,
  validarSoloNumeros,
  validarDireccionLongitud,
  validarTelefonoLongitud,
} from '../../validations/validaciones';

const URI = 'https://bag-st6b.onrender.com/conductores';
const URI_VEHICULOS = 'https://bag-st6b.onrender.com/vehiculos';

const CompCreateConductores = ({ onClose, getConductores }) => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [avalNombre, setAvalNombre] = useState('');
  const [colonia, setColonia] = useState('');
  const [calle, setCalle] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [codigoPostalInput, setCodigoPostalInput] = useState(''); // Para mostrar 'CP-'
  const [ciudad, setCiudad] = useState('Ensenada Baja California'); // Valor por defecto
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [telefonoInput, setTelefonoInput] = useState(''); // Campo con formato
  const [avalTelefono, setAvalTelefono] = useState('');
  const [avalTelefonoInput, setAvalTelefonoInput] = useState(''); // Campo con formato
  const [nombreDocumento, setNombreDocumento] = useState('LICENCIA');
  const [nroDocumento, setNroDocumento] = useState('');
  const [selectedIneFile, setSelectedIneFile] = useState(null);
  const [selectedAvalDocFile, setSelectedAvalDocFile] = useState(null);
  const [selectedAvalLuzFile, setSelectedAvalLuzFile] = useState(null);
  const [selectedAvalAguaFile, setSelectedAvalAguaFile] = useState(null);
  const [selectedLicFile, setSelectedLicFile] = useState(null);
  const [selectedReciboLuzFile, setSelectedReciboLuzFile] = useState(null);
  const [selectedReciboAguaFile, setSelectedReciboAguaFile] = useState(null);
  const [nota, setNota] = useState('');
  const [activo] = useState(1);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  
  const formatFileName = (originalName, tipo) => {
    // Convierte el nombre a mayúsculas
    const nombreFormateado = originalName.toUpperCase();
    console.log('Nombre Formateado:', nombreFormateado);
  
    // Retorna el nombre formateado concatenado con el tipo
    return `${nombreFormateado}${tipo}`;
  };
  
    // Establecer los valores iniciales del formulario
    useEffect(() => {
      setInitialValues({
        nombre: '',
        telefono: '',
        calle: '',
        colonia: '',
        codigoPostal: '',
        nroDocumento: '',
        avalNombre: '',
        avalTelefono: '',
        nota: '',
       });
    }, []);
  
  // Función para comparar los valores actuales del formulario con los valores iniciales
  const checkForChanges = () => {
    const currentValues = {
      nombre,
      telefono,
      calle,
      colonia,
      codigoPostal,
      nroDocumento,
      avalNombre,
      avalTelefono,
      nota,
    };
    return JSON.stringify(currentValues) !== JSON.stringify(initialValues);
  };

    // useEffect para detectar cambios
    useEffect(() => {
      if (checkForChanges()) {
        setHasUnsavedChanges(true);
      } else {
        setHasUnsavedChanges(false);
      }
    }, [nombre, telefono, calle, colonia, codigoPostal, nroDocumento, avalNombre, avalTelefono, nota, initialValues]);
  
  
  
  // Errores en los campos
  const [erroresCampos, setErroresCampos] = useState({
    nombre: false,
    avalNombre: false,
    telefono: false,
    avalTelefono: false,
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
    notaDireccion: false,
    ineDoc: false,
    licenciaDoc: false,
    reciboLuz: false,
    reciboAgua: false,
    avalDoc: false,
    avalLuz: false,
    avalAgua: false,
  });
  // Estados para los campos opcionales
  const [numeroExterior, setNumeroExterior] = useState('');
  const [numeroInterior, setNumeroInterior] = useState('');
  const [manzana, setManzana] = useState('');
  const [lote, setLote] = useState('');
  const [notaDireccion, setNotaDireccion] = useState('');
  const [ineDoc, setIneDoc] = useState('');
  const [avalDoc, setAvalDoc] = useState('');
  const [avalLuz, setAvalLuz] = useState('');
  const [avalAgua, setAvalAgua] = useState('');
  const [licenciaDoc, setLicenciaDoc] = useState('');
  const [reciboLuz, setReciboLuz] = useState('');
  const [reciboAgua, setReciboAgua] = useState('');
  const [vehiculos, setVehiculos] = useState([]);
  const [idVehiculo, setIdVehiculo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const getVehiculos = async () => {
      try {
        const response = await axiosInstance.get(`${URI_VEHICULOS}/activos`);
        setVehiculos(response.data);
      } catch (error) {
        console.error('Error al obtener los vehiculos:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al Obtener Vehiculos',
          text: 'No se pudieron obtener los vehiculos, por favor intente nuevamente.',
        });
      }
    };

    getVehiculos();
  }, []);

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
        direccionCompleta += ` #${numeroExterior}`;
      }
      if (selectedFields.numeroInterior && numeroInterior) {
        direccionCompleta += ` INT-${numeroInterior}`;
      }
      if (selectedFields.manzana && manzana) {
        direccionCompleta += ` MZ-${manzana}`;
      }
      if (selectedFields.lote && lote) {
        direccionCompleta += ` LT-${lote}`;
      }
      if (selectedFields.notaDireccion && notaDireccion) {
        direccionCompleta += `, ${notaDireccion}`;
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
  }, [colonia, calle, codigoPostal, ciudad, selectedFields,numeroExterior, numeroInterior, manzana, lote, notaDireccion]);

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

    // Función para manejar el cambio en el campo de teléfono
    const handleAvalTelefonoChange = (e) => {
      let value = e.target.value;
      // Remover todos los caracteres que no sean dígitos
      value = value.replace(/\D/g, '');
      // Limitar a 10 dígitos
      if (value.length > 10) {
        value = value.slice(0, 10);
      }
      // Guardar el número sin formato en 'telefono'
      setAvalTelefono(value);
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
      setAvalTelefonoInput(formattedValue);
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

  const handleIneSelected = (file) => {
    const renamedFile = new File([file], formatFileName(nombre, '_INE'), { type: file.type });
    setSelectedIneFile(renamedFile);
  };

  const handleLicSelected = (file) => {
    const renamedFile = new File([file], formatFileName(nombre, '_LIC'), { type: file.type });
    setSelectedLicFile(renamedFile);
    };

    const handleReciboLuzSelected = (file) => {
      const renamedFile = new File([file], formatFileName(nombre, '_RECIBO_LUZ'), { type: file.type });
      setSelectedReciboLuzFile(renamedFile);
    };

    const handleReciboAguaSelected = (file) => {
      const renamedFile = new File([file], formatFileName(nombre, '_RECIBO_AGUA'), { type: file.type });
      setSelectedReciboAguaFile(renamedFile);
    };

    const handleAvalDocSelected = (file) => {
      const renamedFile = new File([file], formatFileName(nombre, '_AVAL_DOC'), { type: file.type });
      setSelectedAvalDocFile(renamedFile);
    };

    const handleAvalLuzSelected = (file) => {
      const renamedFile = new File([file], formatFileName(nombre, '_AVAL_LUZ'), { type: file.type });
      setSelectedAvalLuzFile(renamedFile);
    };

    const handleAvalAguaSelected = (file) => {
      const renamedFile = new File([file], formatFileName(nombre, '_AVAL_AGUA'), { type: file.type });
      setSelectedAvalAguaFile(renamedFile);
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
        case 'notaDireccion':
          setNotaDireccion('');
          break;

        case 'ineDoc':
          setIneDoc('');
          break;

        case 'licenciaDoc':
          setLicenciaDoc('');
          break;

        case 'reciboLuz':
          setReciboLuz('');
          break;

        case 'reciboAgua':
          setReciboAgua('');
          break;

        case 'avalDoc':
          setAvalDoc('');
          break;

        case 'avalLuz':
          setAvalLuz('');
          break;

        case 'avalAgua':
          setAvalAgua('');
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
    setNotaDireccion(e.target.value);
  };

  // Método para crear conductor
  const createConductor = async (e) => {
    e.preventDefault();

    let nuevosErroresCampos = {
      nombre: false,
      avalNombre: false,
      telefono: false,
      avalTelefono: false,
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
  
    
    try {
// Crear conductor
// Crear conductor
Swal.fire({
  title: "Cargando Archivos...",
  html: "Por favor, espere...",
  didOpen: () => {
    Swal.showLoading();
  },
  allowOutsideClick: false, // Desactiva clics fuera de la alerta
  allowEscapeKey: false,   // Desactiva la tecla Escape
});


      console.log('Creando conductor...');
      console.log(nombre, direccion,telefono, nombreDocumento, nroDocumento, ineDoc, licenciaDoc, reciboLuz, reciboAgua, avalNombre, avalTelefono, avalDoc, avalLuz, avalAgua, nota, activo);
      let ineDocUrl = '';
      let licenciaDocUrl = '';
      let reciboLuzUrl = '';
      let reciboAguaUrl = '';
      let avalDocUrl = '';
      let avalLuzUrl = '';
      let avalAguaUrl = '';

       // Crear promesas para cargar archivos
    const inePromise = selectedIneFile
    ? sendUpload({ target: { files: [selectedIneFile] } })
    : Promise.resolve(null);

  const licPromise = selectedLicFile
    ? sendUpload({ target: { files: [selectedLicFile] } })
    : Promise.resolve(null);

  const reciboLuzPromise = selectedReciboLuzFile
    ? sendUpload({ target: { files: [selectedReciboLuzFile] }})
    : Promise.resolve(null);

  const reciboAguaPromise = selectedReciboAguaFile
    ? sendUpload({ target: { files: [selectedReciboAguaFile] }})
    : Promise.resolve(null);

  const avalDocPromise = selectedAvalDocFile
    ? sendUpload({ target: { files: [selectedAvalDocFile] }})
    : Promise.resolve(null);

    const avalLuzPromise = selectedAvalLuzFile
    ? sendUpload({ target: { files: [selectedAvalLuzFile] }})
    : Promise.resolve(null);

    const avalAguaPromise = selectedAvalAguaFile
    ? sendUpload({ target: { files: [selectedAvalAguaFile] }})
    : Promise.resolve(null);






 // Esperar a que ambas promesas se resuelvan
 const [ineDocResult, licDocResult, reciboLuzResult, reciboAguaResult, avalDocResult, avalLuzResult, avalAguaResult] = await Promise.all([inePromise, licPromise, reciboLuzPromise, reciboAguaPromise, avalDocPromise, avalLuzPromise, avalAguaPromise]);

 // Asignar los valores de las URLs
 if (ineDocResult) {
   ineDocUrl = ineDocResult;
 }

 if (licDocResult) {
   licenciaDocUrl = licDocResult;
 }

 if (reciboLuzResult) {
    reciboLuzUrl = reciboLuzResult;
  }

  if(reciboAguaResult){
    reciboAguaUrl = reciboAguaResult;
  }

  if(avalDocResult){
    avalDocUrl = avalDocResult;
  }

  if(avalLuzResult){
    avalLuzUrl = avalLuzResult;
  }

  if(avalAguaResult){
    avalAguaUrl = avalAguaResult;
  }


    

 // Crear el conductor y asignar respuesta a una variable
 const respuestaConductor = await axiosInstance.post(URI, {
  nombre,
  direccion,
  telefono,
  nombreDocumento,
  nroDocumento,
  ineDoc: ineDocUrl,
  licenciaDoc: licenciaDocUrl,
  reciboLuz: reciboLuzUrl,
  reciboAgua: reciboAguaUrl,
  avalNombre,
  avalTelefono,
  avalDoc: avalDocUrl,
  avalLuz: avalLuzUrl,
  avalAgua: avalAguaUrl,
  nota,
  activo,
  idVehiculo,
});
console.log('ID DEL CONDUCTOR CREADO:', respuestaConductor.data.id);
Swal.close();
console.log('Conductor creado:', respuestaConductor.data);

const idConductor = respuestaConductor.data.conductor.id;
console.log('ID del conductor:', idConductor);
console.log('ID del vehículo:', idVehiculo);

if (idConductor !== null && idConductor !== 0 && idConductor != '' && idVehiculo !== null && idVehiculo !== 0 && idVehiculo !== '') {
  await updateVehiculo(idVehiculo, { idConductor });
}
/*
const newConductor = response.data.conductor;
console.log('Conductor creado:', newConductor);

if (!newConductor || !newConductor.id) {
  throw new Error('El vehículo no se creó correctamente.');
}

if (idVehiculo) {
  await updateVehiculo(idVehiculo, { idConductor: newConductor.id });
}
*/



/*
// Obtener el ID del nuevo conductor
const nuevoConductor = respuestaConductor.data;
const nuevoIdConductor = nuevoConductor.id;

// Asignar el vehículo si se seleccionó alguno
if (idVehiculo && idVehiculo !== 0) {
  // Primero, asignar el vehículo al conductor
  await axiosInstance.put(`${URI}/asignar/${nuevoIdConductor}`, {
    idVehiculo: idVehiculo,
  });

  // Luego, actualizar el vehículo para asignarle al conductor
  await axiosInstance.put(`${URI_VEHICULOS}/asignar/${idVehiculo}`, {
    idConductor: nuevoIdConductor,
  });

  showSuccessAlert('Vehículo Asignado', 'El vehículo se asignó correctamente.');

  }
*/    



      Swal.fire({        
        position: 'center',
        icon: 'success',
        title: 'Conductor registrado con éxito',
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        getConductores();
        navigate('/conductores');
        onClose();
      });
    } catch (error) {
      Swal.close(); // Asegurarse de cerrar cualquier Swal abierto
      if (error.response) {
        console.error('Error en la respuesta:', error.response.data);
        Swal.fire({
          icon: 'error',
          title: 'Error al crear el conductor',
          text: error.response.data.error || 'Verifique los datos y vuelva a intentarlo.',
        });
      } else if (error.request) {
        console.error('Error en la solicitud:', error.request);
        Swal.fire({
          icon: 'error',
          title: 'Error de red',
          text: 'No se pudo conectar con el servidor.',
        });
      } else {
        console.error('Error:', error.message);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error inesperado.',
        });
      }
    }
  };

  const handleChangeVehiculo = (selectedVehiculoId) => {
    setIdVehiculo(selectedVehiculoId);
  };

// Función para manejar el cierre del modal con alerta de cambios no guardados
const onCloseSinGuardar = () => {
  if (hasUnsavedChanges) {
    Swal.fire({
      title: 'HAY CAMBIOS SIN GUARDAR',
      text: 'Si cierras perderás los cambios no guardados',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: 'red',
      cancelButtonColor: 'green',
    }).then((result) => {
      if (result.isConfirmed) {
        onClose(); // Aquí se cierra el modal si el usuario confirma
      }
    });
  } else {
    onClose(); // Aquí se cierra el modal si no hay cambios
  }
};

  // Función para actualizar el vehiculo con el ID del conductor
  const updateVehiculo = async (id, data) => {
    try {
        const response = await axiosInstance.put(`${URI_VEHICULOS}/asignar/${id}`, data);
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


  return (

    <div
      className="font-bold fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-start z-50 max-h-screen overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onCloseSinGuardar()}
    >
      <div className="relative bg-white rounded-lg p-6 w-full max-w-4xl items-start mt-10 mb-8">

        {/* Encabezado */}
        <div className="flex items-center justify-between mb-6">
          <i className="fa-solid fa-person-circle-plus text-5xl text-gray-900"></i>
          <h2 className="text-4xl font-bold mb-4 text-center">Crear Conductor</h2>
                  {/* Botón de cerrar */}
        <button
          className="-mt-8 -mr-2 flex items-center justify-between mb-6 text-red-500 hover:text-red-800 text-4xl"
          onClick={onClose}
        >
          <i className="fa-solid fa-circle-xmark"></i>
        </button>
        </div>
        <hr className="my-0 border-gray-800 border-t-8" />
        <br />

        {/* Alerta de errores */}
        {Object.values(erroresCampos).some((error) => error) && (
          <div className="font-bold bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p>Error en los campos:</p>
            <ul>
              {erroresCampos.nombre && <li>Nombre</li>}
              {erroresCampos.telefono && <li>Teléfono</li>}
              {erroresCampos.colonia && <li>Colonia</li>}
              {erroresCampos.calle && <li>Calle</li>}
              {erroresCampos.ciudad && <li>Ciudad</li>}
              {erroresCampos.nombreDocumento && <li>Documento</li>}
              {erroresCampos.nroDocumento && <li>Nro Documento</li>}
              {erroresCampos.avalNombre && <li>Nombre del Aval</li>}
              {erroresCampos.avalTelefono && <li>Teléfono del Aval</li>}
            </ul>
          </div>
        )}
        <form onSubmit={createConductor}>
          {/* Campos del formulario */}
          {/* Campo Nombre */}
          <label id='nom' className="block text-gray-900 text-xl font-bold mb-2" htmlFor="nombre">
            Nombre Completo
          </label>
          <input
            type="text"
            id="nombre"
            className={`shadow rounded border-2 ${
              erroresCampos.nombre ? 'border-red-500' : ''
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            placeholder="Ingresa el nombre"
            value={nombre}
            maxLength={80}
            onChange={(e) => {
              const regex = /^[A-Za-z\s.áéíóúñÑ]*$/;
              const valor = e.target.value.toUpperCase();
              if (regex.test(valor)) {
                setNombre(valor);
              }
            }}            
          />
 
          {/* Campo Teléfono */}
          <label id='tel' className="block text-gray-900 text-xl font-bold mb-2 mt-4" htmlFor="telefono">
            Teléfono
          </label>
          <input
            type="text"
            id="telefono"
            className={`shadow rounded border-2 ${
              erroresCampos.telefono ? 'border-red-500' : ''
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            placeholder="Número de teléfono"
            value={telefonoInput}
            onChange={handleTelefonoChange}
          />

          {/* Campos de Dirección */}
          <label id='col' className="block text-gray-900 text-xl font-bold mb-2 mt-4" htmlFor="colonia">
            Dirección
            </label>
          <input
            type="text"
            id="colonia"
            className={`shadow rounded border-2 ${
              erroresCampos.colonia ? 'border-red-500' : ''
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2`}
            placeholder="Colonia"
            value={colonia}
            onChange={(e) => setColonia(e.target.value)}
          />
          
          <input
            type="text"
            id="calle"
            className={`shadow rounded border-2 ${
              erroresCampos.calle ? 'border-red-500' : ''
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2`}
            placeholder="Calle"
            value={calle}
            onChange={(e) => setCalle(e.target.value)}
          />

          {/* Contenedor para Número, Código Postal y Ciudad */}
          <div className="flex space-x-4">
            <input
              type="text"
              id="codigoPostal"
              className="shadow border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
              placeholder="Código Postal"
              value={codigoPostalInput}
              onChange={handleCodigoPostalChange}
            />
            <input
              type="text"
              id="ciudad"
              className={`shadow rounded border-2 ${
                erroresCampos.ciudad ? 'border-red-500' : ''
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2`}
              placeholder="Ciudad"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
            />
          </div>








          <hr className="my-0 border-gray-800 border-t-4 mb-4 mt-4" />
          {/* Checkboxes para Campos Opcionales */}
          <div className="mb-4 font-bold">
            <span className="block text-gray-900 text-xl font-bold mb-6 text-center">AGREGAR DETALLES DE DIRECCIÓN</span>
            <div className="flex flex-wrap space-x-4">
              <label id='checkNumExt' className="inline-flex items-center">
                <input 
                  type="checkbox"
                  name="numeroExterior"
                  checked={selectedFields.numeroExterior}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Número Exterior</span>
              </label>
              <label id='checkNumInt' className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="numeroInterior"
                  checked={selectedFields.numeroInterior}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Número Interior</span>
              </label>
              <label id='checkManzana'className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="manzana"
                  checked={selectedFields.manzana}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Manzana</span>
              </label>
              <label id='checkLote' className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="lote"
                  checked={selectedFields.lote}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Lote</span>
              </label>
              <label id='checkNota' className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="notaDireccion"
                  checked={selectedFields.notaDireccion}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Nota</span>
              </label>
            </div>
          </div>
          {/* Campos Opcionales Condicionales */}
          <div className="flex flex-wrap">
            {selectedFields.numeroExterior && (
              <div className="mb-4 w-1/4 px-2">
                <label id='NumExt' className="block text-gray-900 text-lg font-bold mb-2" htmlFor="numeroExterior">
                  Número Ext.
                </label>
                <input
                  type="text"
                  id="numeroExterior"
                  className="shadow border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="No Exterior"
                  value={numeroExterior}
                  onChange={handleNumeroExteriorChange}
                  maxLength={5}
                />
              </div>
            )}
            {selectedFields.numeroInterior && (
              <div className="mb-4 w-1/4 px-2">
                <label id='NumInt' className="block text-gray-900 text-lg font-bold mb-2" htmlFor="numeroInterior">
                  Número Int.
                </label>
                <input
                  type="text"
                  id="numeroInterior"
                  className="shadow border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="No Interior"
                  value={numeroInterior}
                  onChange={handleNumeroInteriorChange}
                  maxLength={5}
                />
              </div>
            )}
            {selectedFields.manzana && (
              <div className="mb-4 w-1/4 px-2">
                <label id='Manzana' className="block text-gray-900 text-lg font-bold mb-2" htmlFor="manzana">
                  Manzana
                </label>
                <input
                  type="text"
                  id="manzana"
                  className="shadow border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Manzana"
                  value={manzana}
                  onChange={handleManzanaChange}
                  maxLength={5}
                />
              </div>
            )}
{selectedFields.lote && (
              <div className="mb-4 w-1/4 px-2">
                <label id='Lote' className="block text-gray-900 text-lg font-bold mb-2" htmlFor="lote">
                  Lote
                </label>
                <input
                  type="text"
                  id="lote"
                  className="shadow border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Lote"
                  value={lote}
                  onChange={handleLoteChange}
                  maxLength={5}
                />
              </div>
            )}
          {/* Campo Nota */}
          {selectedFields.notaDireccion && (
              <div className="mb-4 w-full">
              <label id='Nota' className="block text-gray-900 text-lg font-bold mb-2" htmlFor="notaDireccion">
                Nota de Dirección
              </label>
              <input
                type="text"
                id="notaDireccion"
                className="shadow border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Agrega una nota a dirección"
                value={notaDireccion}
                onChange={handleNotaChange}
                maxLength={70}
              />
            </div>
          )}
</div>
          {/* Mostrar la dirección completa */}
          {colonia && calle && ciudad && (
            <div className="mt-4">
              <strong>Dirección Completa:</strong> {direccion}
            </div>
          )}
<br/>
{/* Campo Nombre del Documento y Nro Documento */}
<div className="flex flex-wrap -mx-2 mb-4 font-bold text-center">
  <div className=" w-60 px-2">
    <label id="DocumentoName" className="block text-gray-900 text-xl font-bold mb-2" htmlFor="nombreDocumento">
      Documento
    </label>
    <div className="relative">
      <select
        id="nombreDocumento"
        className={`block appearance-none w-full bg-white border border-gray-300 hover:border-gray-800 px-4 py-2 pr-8 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 leading-tight ${
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
              <label id='NroDoc' className="block text-gray-900 text-xl font-bold mb-2" htmlFor="nroDocumento">
                No Documento
              </label>
              <input
                type="text"
                id="nroDocumento"
                className={`shadow rounded border-2 ${
                  erroresCampos.nroDocumento ? 'border-red-500' : ''
                } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2`}
                placeholder="No de Documento"
                maxLength={30}
                value={nroDocumento}
                  onChange={(e) =>{
                    const regex = /^[a-zA-Z0-9\s.]*$/;
                    if (regex.test(e.target.value)) {
                     
                        setNroDocumento(e.target.value.toUpperCase()); // Convierte el valor a mayúsculas
                      }
                  }}
                  />
            </div>
          </div>
          <hr className="my-0 border-gray-800 border-t-4 mb-4 mt-4" />
          <label id='LBine' className="block text-gray-900 text-xl text-center font-bold mt-4 mb-6">
            DOCUMENTACIÓN DEL CHOFER
          </label>
          <div className="flex flex-wrap space-x-4">
          <label id='checkIne' className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="ineDoc"
                  checked={selectedFields.ineDoc}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">INE</span>
              </label>
              <label id='checkLic' className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="licenciaDoc"
                  checked={selectedFields.licenciaDoc}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">LICENCIA</span>
              </label>
              <label id='checkLu' className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="reciboLuz"
                  checked={selectedFields.reciboLuz}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">RECIBO DE LUZ</span>
              </label>
              <label id='checkAgua' className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="reciboAgua"
                  checked={selectedFields.reciboAgua}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">RECIBO DE AGUA</span>
              </label>
          </div>
           {/* Campos Opcionales Condicionales */}
 <div className="flex flex-wrap">
      {selectedFields.ineDoc && (
        <div className="mb-4 w-1/4 px-2">
          <br />
          {/* Asegúrate de pasar la función onFileSelected al componente Upload */}
          <h4>INE</h4>
          <Upload onFileSelected={handleIneSelected} />
        </div>
      )}
{selectedFields.licenciaDoc && (
        <div className="mb-4 w-1/4 px-2">
          <br />
          {/* Asegúrate de pasar la función onFileSelected al componente Upload */}
          <h4>LICENCIA</h4>
          <Upload onFileSelected={handleLicSelected} />
        </div>
      )}
{selectedFields.reciboLuz && (
        <div className="mb-4 w-1/4 px-2">
          <br />
          {/* Asegúrate de pasar la función onFileSelected al componente Upload */}
          <h4>RECIBO DE LUZ</h4>
          <Upload onFileSelected={handleReciboLuzSelected} />
        </div>
      )}
{selectedFields.reciboAgua && (
        <div className="mb-4 w-1/4 px-2">
          <br />
          {/* Asegúrate de pasar la función onFileSelected al componente Upload */}
          <h4>RECIBO DE AGUA</h4>
          <Upload onFileSelected={handleReciboAguaSelected} />
        </div>
      )}
</div>
<label id='LBine' className="block text-gray-900 text-xl text-center font-bold mb-2 mt-4">
            INFORMACIÓN DEL AVAL
          </label>
          <div className="text-center">
         {/*AQUI AGREGA EL CHECKBOX PARA EL AVAL*/}
          <label id='checkAval' className="text-xl inline-flex items-center">
                  <input
                    type="checkbox"
                    name="aval"
                    checked={selectedFields.aval}
                    onChange={handleCheckboxChange}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Aval</span>
                </label>
          </div>
                {selectedFields.aval && (
                  <div>
                    <br />
                    {/* AVAL NOMBRE*/}
                    <label id='avalNombre' className="block text-gray-900 text-xl font-bold mb-2" htmlFor="avalNombre">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      id="avalNombre"
                      className={`shadow rounded border-2 ${
                        erroresCampos.avalNombre ? 'border-red-500' : ''
                      } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                      placeholder="Nombre del Aval"
                      value={avalNombre}
                      maxLength={80}
                      onChange={(e) => {
                        const regex = /^[A-Za-z\s.áéíóúñÑ]*$/;
                        const value = e.target.value.toUpperCase();
                        if (regex.test(value)) {
                          setAvalNombre(value);
                        }
                      }}
                    />
                              {/* Campo Aval Teléfono */}
          <label id='tel' className="block text-gray-900 text-xl font-bold mb-2 mt-4" htmlFor="avalTelefono">
            Teléfono
          </label>
          <input
            type="text"
            id="avalTelefono"
            className={`shadow rounded border-2 ${
              erroresCampos.avalTelefono ? 'border-red-500' : ''
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            placeholder="Número de teléfono"
            value={avalTelefonoInput}
            onChange={handleAvalTelefonoChange}
          />
<label id='LBDocAval' className="block text-gray-900 text-xl text-center font-bold mb-2 mt-6" htmlFor='avalDoc'>
            DOCUMENTACIÓN DEL AVAL
          </label>
<div className="flex flex-wrap space-x-4">
          <label id='checkAvalDoc' className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="avalDoc"
                  checked={selectedFields.avalDoc}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">IDENTIFICACIÓN</span>
              </label>
              <div className="flex flex-wrap space-x-4">
              <label id='checkAvalLuz' className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="avalLuz"
                  checked={selectedFields.avalLuz}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">RECIBO DE LUZ</span>
              </label>
              <label id='checkAvalAgua' className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="avalAgua"
                  checked={selectedFields.avalAgua}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">RECIBO DE AGUA</span>
              </label>
              </div>
              </div>
               {/* Campos Opcionales Condicionales */}
 <div className="flex flex-wrap">
      {selectedFields.avalDoc && (
        <div className="mb-4 w-1/4 px-2">
          <br />
          {/* Asegúrate de pasar la función onFileSelected al componente Upload */}
          <h4>IDENTIFICACIÓN</h4>
          <Upload onFileSelected={handleAvalDocSelected} />
        </div>
      )}
{selectedFields.avalLuz && (
        <div className="mb-4 w-1/4 px-2">
          <br />
          {/* Asegúrate de pasar la función onFileSelected al componente Upload */}
          <h4>RECIBO DE LUZ</h4>
          <Upload onFileSelected={handleAvalLuzSelected} />
        </div>
      )}
{selectedFields.avalAgua && (
        <div className="mb-4 w-1/4 px-2">
          <br />
          {/* Asegúrate de pasar la función onFileSelected al componente Upload */}
          <h4>RECIBO DE AGUA</h4>
          <Upload onFileSelected={handleAvalAguaSelected} />
        </div>
      )}
      </div>
                    </div> 
                )}




                
<hr className="my-0 border-gray-800 border-t-4 mb-2 mt-2" />
<div className='mb-4'>
          <label className='text-xl'>Vehículo:</label>
          <VehiculoSelect
            vehiculos={vehiculos}
            selectedVehiculo={idVehiculo}
            onChange={handleChangeVehiculo}
            className='border-gray-950'
          />
        </div>


                                   {/* Campos Opcionales Condicionales */}
                                   <hr className="my-0 border-gray-800 border-t-4 mb-4 mt-4" />
 <div className="flex flex-wrap">
<label id='nota' className="block text-gray-900 text-xl font-bold mb-2" htmlFor="nota">
           Nota
         </label>
         <input
           type="text"
           id="nota"
           className={`shadow rounded border-2 ${
             erroresCampos.nota ? 'border-red-500' : ''
           } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
           placeholder="Ingresa una nota"
           value={nota}
           maxLength={80}
           onChange={(e) => {
               setNota(e.target.value);
           }}
         />
     </div>
          <div className="flex justify-center mt-10">
            <button
              type="button"
              className="mr-8 text-xl font-bold bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="ml-8 text-xl font-bold bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CompCreateConductores;