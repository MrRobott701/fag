import Swal from 'sweetalert2';
import axiosInstance from '../../../axiosConfig.js';
import 'tailwindcss/tailwind.css';

const URI = 'https://bag-st6b.onrender.com/Conductores';
const URI_VEHICULOS = 'https://bag-st6b.onrender.com/Vehiculos';

const EliminarConductor = ({ id, idVehiculo, getConductores }) => {

    const deleteConductor = async () => {
        const swalWithTailwindButtons = Swal.mixin({
            customClass: {
                cancelButton: 'bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 focus:outline-none',
                confirmButton: 'bg-green-500 ml-4 text-white font-bold py-2 px-4 rounded hover:bg-green-700 focus:outline-none',
            },
            buttonsStyling: false,
        });

        swalWithTailwindButtons.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminarlo!',
            cancelButtonText: 'No, cancelar!',
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    Swal.fire({
                        title: "Eliminando Conductor",
                        html: "Por favor, espere...",
                        didOpen: () => {
                          Swal.showLoading();
                        },
                        allowOutsideClick: false, // Desactiva clics fuera de la alerta
                        allowEscapeKey: false,   // Desactiva la tecla Escape
                      });
                    console.log('Eliminando conductor:', id);
                    console.log('Desasignando vehículo:', idVehiculo);
                    // Eliminar el conductor
                    const result2 = await axiosInstance.put(`${URI_VEHICULOS}/quitConductor/${idVehiculo}`);
                    console.log(result2);
                    const result = await axiosInstance.delete(`${URI}/${id}`);
                    console.log(result);
                    getConductores(); // Refrescar la lista
                    Swal.close();
                    swalWithTailwindButtons.fire(
                        '¡Eliminado!',
                        'El conductor ha sido eliminado.',
                        'success'
                    );
                } catch (error) {
                    console.error('Error eliminando conductor:', error);
                    swalWithTailwindButtons.fire(
                        'Error',
                        'No se pudo eliminar el conductor.',
                        'error'
                    );
                }
            }
        });
    };

    return (
        <button
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-800 text-lg ml-1 mr-1 font-bold"
            onClick={deleteConductor}
            aria-label="Eliminar conductor"
        >
            <i className="fa-solid fa-trash"></i>
        </button>
    );
};

export default EliminarConductor;
