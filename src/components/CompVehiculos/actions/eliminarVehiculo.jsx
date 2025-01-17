import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axiosInstance from '../../../axiosConfig.js';; // Asegúrate de importar axios si no está ya en tu proyecto.

const EliminarVehiculo = ({ id, idConductor, getVehiculos }) => {
    const URI = 'https://bag-st6b.onrender.com/vehiculos';
    const URI_CONDUCTORES = 'https://bag-st6b.onrender.com/conductores';
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

// Función para eliminar el vehículo
const handleDelete = async () => {
    try {
        // Primera confirmación
        const result = await Swal.fire({
            icon: "warning",
            html: `
                <div>
                    
                    <strong><h1>Eliminar vehículo</h1></strong>
                    <p>¿Estás seguro? ¡No podrás revertir esta acción!</p>
                </div>
            `,
            showCancelButton: true,
            confirmButtonColor: "green",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "Cancelar",
             // No usar icon predeterminado porque estamos usando HTML personalizado
        });

        // Si el usuario confirma la primera alerta, mostrar la segunda confirmación
        if (result.isConfirmed) {
            // Segunda confirmación
            const result2 = await Swal.fire({
                html: `
                    <div>
                        <i className="fa-solid fa-exclamation-triangle" style="font-size: 86px; color: red;"></i>
                        <strong><h1>ÚLTIMA ALERTA</h1></strong>
                        <p>¿ESTÁS SEGURO DE ELIMINAR EL VEHÍCULO?<br/>¡No podrás revertir esta acción!</p>
                    </div>
                `,
                showCancelButton: true,
                confirmButtonColor: "green",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
                icon: undefined  // No usar icon predeterminado porque estamos usando HTML personalizado
            });

            // Si el usuario confirma la segunda alerta, proceder con la eliminación
            if (result2.isConfirmed) {
                const response = await axiosInstance.put(`${URI}/delete/${id}`);
                console.log(response);
                const responseConductores = await axiosInstance.put(`${URI_CONDUCTORES}/quitVehiculo/${idConductor}`);
                console.log(responseConductores);
                // Mostrar mensaje de éxito
                Swal.fire({
                    title: "Eliminado",
                    text: "El vehículo ha sido eliminado exitosamente.",
                    icon: "success",
                    confirmButtonColor: "green"
                });
                // Cerrar el modal o realizar otra acción
                handleClose();
                // Actualizar la lista de vehículos
                getVehiculos();

            }
        }
    } catch (error) {
        // Manejar el error
        console.error(error);
        Swal.fire({
            title: "Error",
            text: "Hubo un problema al intentar eliminar el vehículo.",
            icon: "error",
            confirmButtonColor: "#d33"
        });
    }
};



    return (
        <>
            {/* Botón para iniciar la eliminación */}
            <button 
                className="absolute right-2 text-red-500 hover:text-red-800 text-3xl "
                style = {{ transform: 'translateY(-60%)'}}
                onClick={handleDelete}  // Llama a handleDelete para iniciar el proceso
            >
                <i className="fa-solid fa-circle-xmark"></i>
            </button>
        </>
    );
};

export default EliminarVehiculo;
