// EditarContrato.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../axiosConfig.js';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale';
import { handleGenerarPdfContrato } from './GenerateContrato';

const URI_CONTRATOS = 'https://bag-st6b.onrender.com/contratos';
const URI_CONDUCTORES = 'https://bag-st6b.onrender.com/conductores';
const URI_VEHICULOS = 'https://bag-st6b.onrender.com/vehiculos';
const URI_PROPIETARIOS = 'https://bag-st6b.onrender.com/propietarios';

const EditarContrato = ({ contratoId, onClose, onEditSuccess }) => {
  const [idConductor, setIdConductor] = useState('');
  const [idVehiculo, setIdVehiculo] = useState('');
  const [idPropietario, setIdPropietario] = useState('');
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [fechaFirma, setFechaFirma] = useState(null);
  const [precioDeposito, setPrecioDeposito] = useState('');
  const [precioRenta, setPrecioRenta] = useState('');
  const [precioPagare, setPrecioPagare] = useState('');
  const [penalidad, setPenalidad] = useState('');
  const [duracionMeses, setDuracionMeses] = useState('');

  const [conductores, setConductores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [propietarios, setPropietarios] = useState([]);
  const [loading, setLoading] = useState(true);
  document.body.style.overflow = "hidden";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const contratoRes = await axiosInstance.get(`${URI_CONTRATOS}/${contratoId}`);
        const contrato = contratoRes.data;

        setIdConductor(contrato.idConductor);
        setIdVehiculo(contrato.idVehiculo);
        setIdPropietario(contrato.idPropietario);
        setFechaInicio(new Date(contrato.fechaInicio + 'T00:00:00'));
        setFechaFin(new Date(contrato.fechaFin + 'T00:00:00'));
        setFechaFirma(new Date(contrato.fechaFirma + 'T00:00:00'));
        setPrecioDeposito(contrato.precioDeposito.toString());
        setPrecioRenta(contrato.precioRenta.toString());
        setPrecioPagare(contrato.precioPagare.toString());
        setPenalidad(contrato.penalidad.toString());
        setDuracionMeses(contrato.duracionMeses.toString());

        const [conductoresRes, vehiculosRes, propietariosRes] = await Promise.all([
          axiosInstance.get(URI_CONDUCTORES),
          axiosInstance.get(URI_VEHICULOS),
          axiosInstance.get(URI_PROPIETARIOS),
        ]);
        setConductores(conductoresRes.data);
        setVehiculos(vehiculosRes.data);
        setPropietarios(propietariosRes.data);

        setLoading(false);
      } catch (error) {
        console.error('Error loading contract data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar contrato',
          text: 'No se pudo cargar el contrato. Intenta nuevamente.',
        });
        setLoading(false);
      }
    };

    fetchData();
  }, [contratoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const contratoActualizado = {
        idConductor: parseInt(idConductor),
        idVehiculo: parseInt(idVehiculo),
        idPropietario: parseInt(idPropietario),
        fechaInicio: fechaInicio.toISOString().split('T')[0],
        fechaFin: fechaFin.toISOString().split('T')[0],
        fechaFirma: fechaFirma.toISOString().split('T')[0],
        precioDeposito: parseInt(precioDeposito),
        precioRenta: parseInt(precioRenta),
        precioPagare: parseInt(precioPagare),
        penalidad: parseInt(penalidad),
        duracionMeses: parseInt(duracionMeses),
      };

      await axiosInstance.put(`${URI_CONTRATOS}/${contratoId}`, contratoActualizado);
      const response2 = await axiosInstance.get(`${URI_CONTRATOS}/${contratoId}`);
      const contrato = response2.data;
      console.log('Contrato actualizado:', contrato);

      // Generate PDF after successful update
      await handleGenerarPdfContrato(contrato);
      

      Swal.fire({
        icon: 'success',
        title: 'CONTRATO ACTUALIZADO',
        showConfirmButton: false,
        timer: 1500,
      });

      onEditSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating contract:', error);
      Swal.fire({
        icon: 'error',
        title: 'ERROR AL ACTUALIZAR',
        text: 'Intenta nuevamente.',
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center p-6">
        <i className="fa-solid fa-spinner fa-spin text-2xl text-gray-600"></i>
        <p className="mt-4 text-gray-600"></p>
      </div>
    );
  }

  return (
    <div className="font-bold fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50"
    onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 hover:text-red-800 text-3xl"
        >
          <i className="fa-solid fa-circle-xmark"></i>
        </button>
        <div className="flex items-center justify-center mb-4">
          <i className="text-4xl fa-solid fa-file-contract mr-2"></i>
          <h2 className="text-2xl font-bold">Editar Contrato</h2>
        </div>
        <hr className="mb-4 border-t-4 border-gray-800" />

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {/* Estructura del formulario con 3 columnas en pantallas XL */}
          
            {/* Campo Conductor */}
            <div>
              <label className="block text-gray-900 text-xl font-bold mb-2" htmlFor="conductor">
                Conductor
              </label>
              <select
                id="conductor"
                disabled
                className={`rounded border-2 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
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
    className={`shadow rounded border-2 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
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
    className={`rounded border-2 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
    value={idPropietario}
    onChange={(e) => setIdPropietario(e.target.value)} // Permite cambios manuales si es necesario
  >
    <option value="">Selecciona un propietario</option>
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
    className={`shadow w-full p-2 rounded border-2 border-gray-400 custom-datepicker text-center`}
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
    className={`shadow w-full p-2 rounded border-2 border-gray-400 custom-datepicker text-center`}
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
    className={`shadow w-full p-2 rounded border-2 border-gray-400 custom-datepicker text-center`}
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
    className={`shadow rounded border-2 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
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
    className={`shadow rounded border-2 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
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
    className={`shadow rounded border-2 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
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
    Penalidad (Diaria)
  </label>
  <input
  type="text"
  id="penalidad"
  className={`shadow rounded border-2 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
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
    className={`shadow rounded border-2 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
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

        </form>

        <div className="flex justify-end mt-8 space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditarContrato;
