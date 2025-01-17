// CrearContrato.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axiosInstance from '../../../axiosConfig.js';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale';
import Upload2 from '../../Upload2';
import {handleGenerarPdfContrato} from './GenerateContrato'; 
import {
  validarVacio2,
  validarFecha,
  validarSoloNumeros,
  validarPrecio,
} from '../../validations/validaciones'; // Asegúrate de que las validaciones existen

const URI_CONTRATOS = 'https://bag-st6b.onrender.com/contratos';
const URI_CONDUCTORES = 'https://bag-st6b.onrender.com/conductores';
const URI_VEHICULOS = 'https://bag-st6b.onrender.com/vehiculos/activos';
const URI_PROPIETARIOS = 'https://bag-st6b.onrender.com/propietarios';

const CrearContrato = ({ onClose, onSubmitSuccess }) => {
  const navigate = useNavigate();

  // Obtener la fecha actual y dos meses después usando useMemo para evitar redefiniciones en cada render
  const today = useMemo(() => new Date(), []);
  const twoMonthsLater = useMemo(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 2);
    return date;
  }, []);

  const formatDate = (date) => {
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    return utcDate.toISOString().split('T')[0]; // Devuelve solo la fecha en formato 'yyyy-mm-dd'
  };

  const formatDateForSave = (date) => {
    // Asegúrate de que 'date' sea un objeto de tipo Date
    const validDate = date instanceof Date ? date : new Date(date);
  
    // Verifica si validDate es una fecha válida antes de proceder
    if (isNaN(validDate)) {
      throw new Error('La fecha proporcionada no es válida');
    }
  
    // Formatea la fecha
    const year = validDate.getFullYear();
    const month = String(validDate.getMonth() + 1).padStart(2, '0');
    const day = String(validDate.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };
  
  
  

  // Estados para los campos del contrato
  const [idConductor, setIdConductor] = useState('');
  const [idVehiculo, setIdVehiculo] = useState('');
  const [idPropietario, setIdPropietario] = useState('');
  const [fechaInicio, setFechaInicio] = useState(formatDate(today));
  const [fechaFin, setFechaFin] = useState(formatDate(twoMonthsLater));
    const [fechaFirma, setFechaFirma] = useState(formatDate(today));
  const [precioDeposito, setPrecioDeposito] = useState('3000');
  const [precioRenta, setPrecioRenta] = useState('3000');
  const [precioPagare, setPrecioPagare] = useState('10000');
  const [penalidad, setPenalidad] = useState('75');
  
  
  const [duracionMeses, setDuracionMeses] = useState(2);

  // Estados para los datos select
  const [conductores, setConductores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [propietarios, setPropietarios] = useState([]);

  // Estados para validaciones
  const [erroresCampos, setErroresCampos] = useState({
    idConductor: false,
    idVehiculo: false,
    idPropietario: false,
    fechaInicio: false,
    fechaFin: false,
    fechaFirma: false,
    precioDeposito: false,
    precioRenta: false,
    precioPagare: false,
    penalidad: false,
    duracionMeses: false,
  });

  // Estado para cambios no guardados
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialValues, setInitialValues] = useState({});

  // Fetch data for selects
  const fetchData = useCallback(async () => {
    try {
      const [conductoresRes, vehiculosRes, propietariosRes] = await Promise.all([
        axiosInstance.get(URI_CONDUCTORES),
        axiosInstance.get(URI_VEHICULOS),
        axiosInstance.get(URI_PROPIETARIOS),
      ]);
      setConductores(conductoresRes.data);
      setVehiculos(vehiculosRes.data);
      setPropietarios(propietariosRes.data);
    } catch (error) {
      console.error('Error fetching select data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al obtener datos',
        text: 'No se pudieron obtener los datos necesarios para el formulario.',
      });
    }
    document.body.style.overflow = 'hidden';
  }, []);

  useEffect(() => {
    fetchData();
    // Establecer valores iniciales
    setInitialValues({
      idConductor: '',
      idVehiculo: '',
      idPropietario: '',
      fechaInicio: formatDate(today),
      fechaFin: formatDate(twoMonthsLater),
      fechaFirma: formatDate(today),
      precioDeposito: '3000',
      precioRenta: '3000',
      precioPagare: '10000',
      penalidad: '75',
      duracionMeses: 2,
    });
  }, [fetchData, today, twoMonthsLater]);

  // Detectar cambios para alertar sobre cambios no guardados
  useEffect(() => {
    const currentValues = {
      idConductor,
      idVehiculo,
      idPropietario,
      fechaInicio,
      fechaFin,
        fechaFirma,
      precioDeposito,
      precioRenta,
      precioPagare,
      penalidad,
      duracionMeses,
    };
    setHasUnsavedChanges(JSON.stringify(currentValues) !== JSON.stringify(initialValues));
  }, [
    idConductor,
    idVehiculo,
    idPropietario,
    fechaInicio,
    fechaFin,
    fechaFirma,
    precioDeposito,
    precioRenta,
    precioPagare,
    penalidad,
    duracionMeses,
    initialValues,
  ]);

  // Función para manejar el cierre del modal con alerta de cambios no guardados
  const onCloseSinGuardar = useCallback(() => {
    if (hasUnsavedChanges) {
      Swal.fire({
        title: 'HAY CAMBIOS SIN GUARDAR',
        text: 'Si cierras perderás los cambios no guardados',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cerrar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
      }).then((result) => {
        if (result.isConfirmed) {
            document.body.style.overflow = 'visible';
          onClose(); // Cierra el modal si el usuario confirma
        }
      });
    } else {
        document.body.style.overflow = 'visible';
      onClose(); // Cierra el modal si no hay cambios
    }
  }, [hasUnsavedChanges, onClose]);

  // Validaciones del formulario
  const validarFormulario = useCallback(() => {
    let nuevosErroresCampos = {
      idConductor: false,
      idVehiculo: false,
      idPropietario: false,
      fechaInicio: false,
      fechaFin: false,
        fechaFirma: false,
      precioDeposito: false,
      precioRenta: false,
      precioPagare: false,
      penalidad: false,
      duracionMeses: false,
    };
    let errores = [];

    // Validaciones
    const validaciones = [
      { error: validarVacio2(idConductor, 'Conductor'), campo: 'idConductor' },
      { error: validarVacio2(idVehiculo, 'Vehículo'), campo: 'idVehiculo' },
      { error: validarVacio2(idPropietario, 'Propietario'), campo: 'idPropietario' },
      { error: validarVacio2(fechaInicio, 'Fecha de Inicio'), campo: 'fechaInicio' },
      { error: validarVacio2(fechaFin, 'Fecha de Fin'), campo: 'fechaFin' },
      { error: validarFecha(fechaInicio, fechaFin), campo: 'fechaFin' }, // Validar que fechaFin > fechaInicio
      { error: validarVacio2(fechaFirma, 'Fecha de Firma'), campo: 'fechaFirma' },      
      { error: validarPrecio(precioDeposito, 'Precio de Depósito'), campo: 'precioDeposito' },
      { error: validarVacio2(precioDeposito, 'Precio de Depósito'), campo: 'precioDeposito' },
      { error: validarPrecio(precioRenta, 'Precio de Renta'), campo: 'precioRenta' },
      { error: validarVacio2(precioRenta, 'Precio de Renta'), campo: 'precioRenta' },
      { error: validarPrecio(precioPagare, 'Precio de Pagaré'), campo: 'precioPagare' },
      { error: validarVacio2(precioPagare, 'Precio de Pagaré'), campo: 'precioPagare' },
      { error: validarPrecio(penalidad, 'Penalidad'), campo: 'penalidad' },
      { error: validarVacio2(penalidad, 'Penalidad'), campo: 'penalidad' },
      { error: validarSoloNumeros(duracionMeses, 'Duración en Meses'), campo: 'duracionMeses' },
      { error: validarVacio2(duracionMeses, 'Duración en Meses'), campo: 'duracionMeses' },
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
      return false;
    }

    setErroresCampos(nuevosErroresCampos);
    return true;
  }, [
    idConductor,
    idVehiculo,
    idPropietario,
    fechaInicio,
    fechaFin,
    fechaFirma,
    precioDeposito,
    precioRenta,
    precioPagare,
    penalidad,
    duracionMeses,
  ]);

  // Función para manejar el envío del formulario
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }
    console.log('Penalidad en submit:', penalidad);
    
    
    try {
      Swal.fire({
        title: 'Creando Contrato...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Crear el contrato
      const nuevoContrato = {
        precioDeposito: Number(precioDeposito.replace(/\D/g, '')), // Remover el signo de dólars
        precioRenta: Number(precioRenta.replace(/\D/g, '')), // Remover el signo de dólar
        precioPagare: Number(precioPagare.replace(/\D/g, '')), // Remover el signo de dólar
        penalidad: Number(penalidad.replace(/\D/g, '')), // Remover el signo de dólar
        duracionMeses: Number(duracionMeses),
        fechaInicio: formatDateForSave(fechaInicio),
        fechaFin: formatDateForSave(fechaFin),
        fechaFirma: formatDateForSave(fechaFirma),
        idConductor: parseInt(idConductor, 10),
        idVehiculo: parseInt(idVehiculo, 10),
        idPropietario: parseInt(idPropietario, 10),
        estado:1,
      };

      const response = await axiosInstance.post(URI_CONTRATOS, nuevoContrato);
  const contrato = response.data.contrato;
    console.log('Contrato creado:', contrato);
  Swal.close();

   // Llama a la función para generar el PDF con el contrato recién creado
   await handleGenerarPdfContrato(contrato);


      
      Swal.fire({
        icon: 'success',
        title: 'Contrato creado con éxito',
        showConfirmButton: false,
        timer: 1500,
      });

      onSubmitSuccess(); // Refrescar la lista de contratos
    } catch (error) {
      Swal.close();
      console.error('Error creando contrato:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al crear contrato',
        text: error.response?.data?.error || 'Verifique los datos y vuelva a intentarlo.',
      });
    }
  }, [
    validarFormulario,
    precioDeposito,
    precioRenta,
    precioPagare,
    penalidad,
    duracionMeses,
    fechaInicio,
    fechaFin,
    fechaFirma,
    idConductor,
    idVehiculo,
    idPropietario,
    URI_CONTRATOS,
    onSubmitSuccess,
  ]);

  return (
    <div
      className="fixed font-bold inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onCloseSinGuardar()}
    >
      <div className="relative bg-white rounded-lg p-6 w-full max-w-4xl">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-6">
        <i className="text-4xl fa-solid fa-file-contract"></i>
          <h2 className="text-3xl font-bold text-center">Crear Contrato</h2>
          {/* Botón de cerrar */}
          <button
            className="text-red-500 hover:text-red-800 text-4xl"
            onClick={onCloseSinGuardar}
            aria-label="Cerrar Modal"
          >
            <i className="fa-solid fa-circle-xmark"></i>
          </button>
        </div>
        <hr className="my-2 border-gray-800 border-t-2" />

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {/* Estructura del formulario con 3 columnas en pantallas XL */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Campo Conductor */}
            <div>
              <label className="block text-gray-900 text-xl font-bold mb-2" htmlFor="conductor">
                Conductor
              </label>
              <select
                id="conductor"
                className={`shadow rounded border-2 ${
                  erroresCampos.idConductor ? 'border-red-500' : ''
                } w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                value={idConductor}
                onChange={(e) => setIdConductor(e.target.value)}
              >
                <option value="">Selecciona un conductor</option>
                {conductores.map((conductor) => (
                  <option key={conductor.id} value={conductor.id}>
                    {conductor.nombre}
                  </option>
                ))}
              </select>
            </div>

{/* Campo Vehículo */}
<div>
  <label className="block text-gray-900 text-xl font-bold mb-2" htmlFor="vehiculo">
    Vehículo
  </label>
  <select
    id="vehiculo"
    className={`shadow rounded border-2 ${
      erroresCampos.idVehiculo ? 'border-red-500' : ''
    } w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
    value={idVehiculo}
    onChange={(e) => {
      const selectedVehiculoId = e.target.value;
      setIdVehiculo(selectedVehiculoId);

      // Buscar el vehículo seleccionado en la lista
      const selectedVehiculo = vehiculos.find(
        (vehiculo) => vehiculo.id === parseInt(selectedVehiculoId, 10)
      );

      // Si se encuentra el vehículo, actualiza el propietario asociado
      if (selectedVehiculo) {
        setIdPropietario(selectedVehiculo.idPropietario); // Cambia automáticamente el propietario
      } else {
        setIdPropietario(''); // Limpia el propietario si no hay vehículo seleccionado
      }
    }}
  >
    <option value="">Selecciona un vehículo</option>
    {vehiculos.map((vehiculo) => (
      <option key={vehiculo.id} value={vehiculo.id}>
        {`${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.placas})`}
      </option>
    ))}
  </select>
</div>

{/* Campo Propietario */}
<div>
  <label className="block text-gray-900 text-xl font-bold mb-2" htmlFor="propietario">
    Arrendador
  </label>
  <select
    id="propietario"
    disabled
    className={`rounded border-2 ${
      erroresCampos.idPropietario ? 'border-red-500' : ''
    } w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
    value={idPropietario}
    onChange={(e) => setIdPropietario(e.target.value)} // Permite cambiar manualmente si es necesario
  >
    <option value="">Selecciona un arrendador</option>
    {propietarios.map((propietario) => (
      <option key={propietario.id} value={propietario.id}>
        {propietario.nombre}
      </option>
    ))}
  </select>
</div>


{/* Campo Fecha de Inicio */}
<div>
  <label className="block text-gray-900 text-xl font-bold mb-2" htmlFor="fechaInicio">
    Fecha de Inicio
  </label>
  <DatePicker
    selected={fechaInicio}
    onChange={(date) => setFechaInicio(date)} // Guarda la fecha sin cambios de zona horaria
    dateFormat="dd/MM/yyyy"
    locale={es}
    className={`shadow w-full p-2 rounded border-2 ${
      erroresCampos.fechaInicio ? 'border-red-500' : 'border-gray-400'
    } custom-datepicker text-center`}
    placeholderText="Selecciona una fecha de inicio"
    showMonthDropdown
    showYearDropdown
    dropdownMode="select"
    minDate={new Date(new Date().getFullYear() - 9, 0, 1)} // 9 años antes de la fecha actual
    maxDate={new Date(new Date().getFullYear() + 4, 11, 31)} // 4 años después de la fecha actual
  />
</div>


{/* Campo Fecha de Fin */}
<div>
  <label className="block text-gray-900 text-xl font-bold mb-2" htmlFor="fechaFin">
    Fecha de Fin
  </label>
  <DatePicker
    selected={fechaFin}
    onChange={(date) => setFechaFin(date)}
    dateFormat="dd/MM/yyyy"
    locale={es}
    className={`shadow w-full p-2 rounded border-2 ${
      erroresCampos.fechaFin ? 'border-red-500' : 'border-gray-400'
    } custom-datepicker text-center`}
    placeholderText="Selecciona una fecha de fin"
    showMonthDropdown
    showYearDropdown
    dropdownMode="select"
    minDate={new Date(new Date().getFullYear() - 9, 0, 1)}
    maxDate={new Date(new Date().getFullYear() + 4, 11, 31)}
  />
</div>

{/* Campo Fecha Firma */}
<div>
  <label className="block text-gray-900 text-xl font-bold mb-2" htmlFor="fechaFirma">
    Fecha de Firma
  </label>
  <DatePicker
    selected={fechaFirma}
    onChange={(date) => setFechaFirma(date)}
    dateFormat="dd/MM/yyyy"
    locale={es}
    className={`shadow w-full p-2 rounded border-2 ${
      erroresCampos.fechaFirma ? 'border-red-500' : 'border-gray-400'
    } custom-datepicker text-center`}
    placeholderText="Selecciona una fecha de firma"
    showMonthDropdown
    showYearDropdown
    dropdownMode="select"
    minDate={new Date(new Date().getFullYear() - 9, 0, 1)}
    maxDate={new Date(new Date().getFullYear() + 4, 11, 31)}
  />
</div>

{/* Campo Precio de Depósito */}
<div>
  <label className="block text-gray-900 text-xl font-bold mb-2" htmlFor="precioDeposito">
    Precio de Depósito
  </label>
  <input
    type="text" // Cambia `type` a "text" para que `onChange` maneje la validación
    id="precioDeposito"
    className={`shadow rounded border-2 ${
      erroresCampos.precioDeposito ? 'border-red-500' : ''
    } w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
    value={precioDeposito ? `$${precioDeposito}` : ''}
    onChange={(e) => {
      // Remover cualquier caracter que no sea un número
      const value = e.target.value.replace(/\D/g, '');
      // Limitar a 6 caracteres
      if (value.length <= 6) {
        setPrecioDeposito(value);
      }
    }}
    placeholder="Máximo 6 dígitos"
  />
</div>

           {/* Campo Precio de Renta */}
<div>
  <label className="block text-gray-900 text-xl font-bold mb-2" htmlFor="precioRenta">
    Precio de Renta
  </label>
  <input
    type="text" // Cambiado a "text" para aplicar validación en onChange
    id="precioRenta"
    className={`shadow rounded border-2 ${
      erroresCampos.precioRenta ? 'border-red-500' : ''
    } w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
    value={precioRenta ? `$${precioRenta}` : ''}
    onChange={(e) => {
      const value = e.target.value.replace(/\D/g, ''); // Permitir solo números
      if (value.length <= 6) {
        setPrecioRenta(value); // Limitar a 6 caracteres
      }
    }}
    placeholder="Máximo 6 dígitos"
  />
</div>

{/* Campo Precio de Pagaré */}
<div>
  <label className="block text-gray-900 text-xl font-bold mb-2" htmlFor="precioPagare">
    Precio de Pagaré
  </label>
  <input
    type="text"
    id="precioPagare"
    className={`shadow rounded border-2 ${
      erroresCampos.precioPagare ? 'border-red-500' : ''
    } w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
    value={precioPagare ? `$${precioPagare}` : ''}
    onChange={(e) => {
      const value = e.target.value.replace(/\D/g, '');
      if (value.length <= 6) {
        setPrecioPagare(value);
      }
    }}
    placeholder="Máximo 6 dígitos"
  />
</div>

{/* Campo Penalidad */}
<div>
  <label className="block text-gray-900 text-xl font-bold mb-2" htmlFor="penalidad">
    Penalidad
  </label>
  <input
  type="text"
  id="penalidad"
  className={`shadow rounded border-2 ${
    erroresCampos.penalidad ? 'border-red-500' : ''
  } w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
  value={penalidad ? `$${penalidad}` : ''}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, ''); // Solo permite números
    setPenalidad(value || ''); // Guarda el valor como cadena vacía si no hay números
  }}
  placeholder="Precio de la penalidad"
  maxLength={8}
/>

</div>



{/* Campo Duración en Meses */}
<div>
  <label className="block text-gray-900 text-xl font-bold mb-2" htmlFor="duracionMeses">
    Duración (Meses)
  </label>
  <input
    type="text" // Cambiado a "text" para aplicar validación en onChange
    id="duracionMeses"
    className={`shadow rounded border-2 ${
      erroresCampos.duracionMeses ? 'border-red-500' : ''
    } w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
    value={duracionMeses}
    onChange={(e) => {
      const value = e.target.value.replace(/\D/g, ''); // Permitir solo números
      if (value.length <= 2) {
        setDuracionMeses(value); // Limitar a 2 caracteres
      }
    }}
    placeholder="Máximo 2 dígitos"
  />
</div>

          </div>

          {/* Botones de acción */}
          <div className="flex justify-end mt-8">
            <button
              type="button"
              className="mr-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 font-bold"
              onClick={onCloseSinGuardar}
              aria-label="Cancelar"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800 font-bold"
              aria-label="Guardar Contrato"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearContrato;
