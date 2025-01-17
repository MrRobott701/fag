// AsignarVehiculoAConductor.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../axiosConfig.js';;
import Swal from 'sweetalert2';
import VehiculoSelect from './VehiculoSelect'; // Asegúrate de la ruta correcta
import { showSuccessAlert, showErrorAlert } from '../../alerts.jsx';

const URI = 'https://bag-st6b.onrender.com/conductores';
const URI_VEHICULOS = 'https://bag-st6b.onrender.com/vehiculos';

const AsignarVehiculoAConductor = ({ idConductor, onAsignacionExitosa }) => {
  const [vehiculos, setVehiculos] = useState([]);
  const [idVehiculo, setIdVehiculo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [vehiculoAsignado, setVehiculoAsignado] = useState(null);

  useEffect(() => {
    const getConductorInfo = async () => {
      try {
        const response = await axiosInstance.get(`${URI}/${idConductor}`);
        const { idVehiculo } = response.data;
        setIdVehiculo(idVehiculo);
        if (idVehiculo && idVehiculo !== 0) {
          const vehiculo = await axiosInstance.get(`${URI_VEHICULOS}/${idVehiculo}`);
          setVehiculoAsignado(vehiculo.data.nombre);
        }
      } catch (error) {
        console.error('Error al obtener la información del conductor:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al obtener información del conductor',
          text: 'Hubo un problema al obtener la información del conductor.',
        });
      }
    };

    getConductorInfo();
  }, [idConductor]);

  useEffect(() => {
    const getVehiculos = async () => {
      try {
        const response = await axiosInstance.get(`${URI_VEHICULOS}/activos`);
        console.log('Respuesta de vehiculos:', response.data);
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

  const updateVehiculo = async (id, idConductor) => {
    try {
      const response = await axiosInstance.put(`${URI_VEHICULOS}/asignar/${id}`, {
        idConductor: idConductor,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al asignar vehículo:', error);
      showErrorAlert('Error al asignar vehículo', 'Hubo un problema al asignar el vehículo.');
    }
  };

  const asignarVehiculo = async (idVehiculo) => {
    try {
      const response = await axiosInstance.put(`${URI}/asignar/${idConductor}`, {
        idVehiculo: idVehiculo,
      });
      showSuccessAlert('Vehículo asignado', 'El vehículo se asignó correctamente');

      if (idVehiculo && idVehiculo !== 0) {
        await updateVehiculo(idVehiculo, idConductor);
      }
      onAsignacionExitosa();
    } catch (error) {
      setIsLoading(false);
      console.error('Error al asignar vehículo:', error);
      showErrorAlert('Error al asignar vehículo', 'Hubo un problema al asignar el vehículo.');
    }
  };

  const handleChangeVehiculo = (selectedVehiculoId) => {
    Swal.fire({
      title: 'Asignar vehículo',
      text: '¿Está seguro que desea asignar el vehículo?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIdVehiculo(selectedVehiculoId);
        await asignarVehiculo(selectedVehiculoId);
      }
    });
  };

  return (
    <div>
      <VehiculoSelect
        vehiculos={vehiculos}
        selectedVehiculo={idVehiculo}
        onChange={handleChangeVehiculo}
      />
    </div>
  );
};

export default AsignarVehiculoAConductor;
