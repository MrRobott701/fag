import Swal from 'sweetalert2';
import axiosInstance from '../../../axiosConfig.js';
import 'tailwindcss/tailwind.css'; // Importa los estilos de Tailwind

const URI = 'https://bag-st6b.onrender.com/propietarios';

const EliminarPropietario = ({ id, getPropietarios }) => {

    // Función para confirmar y eliminar propietario
    const deletePropietario = async () => {
        const swalWithTailwindButtons = Swal.mixin({
            customClass: {
                cancelButton: 'bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 focus:outline-none',
                confirmButton: 'bg-green-500 ml-4 text-white font-bold py-2 px-4 rounded hover:bg-green-700 focus:outline-none'
            },
            buttonsStyling: false // Desactiva el estilo predeterminado de SweetAlert2
        });

        swalWithTailwindButtons.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminarlo!',
            cancelButtonText: 'No, cancelar!',
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                // Eliminar el propietario
                await axiosInstance.delete(`${URI}/${id}`);
                getPropietarios(); // Refrescar la lista de propietarios
                swalWithTailwindButtons.fire(
                    '¡Eliminado!',
                    'El propietario ha sido eliminado.',
                    'success'
                );
            }
        });
    };

    return (
        <button
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-800 ml-2"
            onClick={deletePropietario}
            aria-label="Eliminar propietario"
        >
            <i className="fa-solid fa-trash"></i>
        </button>
    );
};

export default EliminarPropietario;
