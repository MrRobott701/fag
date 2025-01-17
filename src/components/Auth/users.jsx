import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import Register from './Register';
import EditUser from './EditUser';
import Swal from 'sweetalert2';
import Encabezado from './Encabezado.jsx';

function UserManagement({ isCollapsed }) {
  const [usuarios, setUsuarios] = useState([]);
  const [showRegister, setShowRegister] = useState(false); // Estado para mostrar el modal
  const [showEdit, setShowEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Obtener la lista de usuarios
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await axiosInstance.get('/usuarios');
      setUsuarios(res.data);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    }
  };

  // Eliminar usuario
  const handleDelete = async (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/usuarios/${id}`);
          fetchUsuarios(); // Actualizar la lista después de eliminar
          Swal.fire(
            '¡Eliminado!',
            'El usuario ha sido eliminado exitosamente.',
            'success'
          );
        } catch (error) {
          Swal.fire(
            'Error',
            'Hubo un problema al eliminar el usuario.',
            'error'
          );
        }
      }
    });
  };

  return (
    <>
    <Encabezado />
    <div className={`font-bold pt-20 z-10 transition-all duration-300 ${isCollapsed ? 'ml-24' : 'ml-20'}`}>
      <div className="container mx-auto p-5">
        <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>
        
        <button
          className="mb-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300 transform hover:scale-105"
          onClick={() => setShowRegister(true)}
        >
          Crear Usuario
        </button>

        <table className="table-auto w-full border-collapse border border-gray-400 shadow-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 px-4 py-2">Nombre</th>
              <th className="border border-gray-400 px-4 py-2">Correo</th>
              <th className="border border-gray-400 px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="hover:bg-gray-100 transition duration-200">
                 <td className="border border-gray-400 px-4 py-2">{usuario.nombre}</td>
                <td className="border border-gray-400 px-4 py-2">{usuario.correo}</td>
                <td className="border border-gray-400 px-4 py-2 flex justify-center gap-2">
                  <button
                    className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                    onClick={() => {
                      setSelectedUser(usuario); // Selecciona el usuario a editar
                      setShowEdit(true); // Muestra el modal
                    }}
                  >
                    Editar
                    <i className="ml-2 -mr-1 fa-solid fa-pen"></i>
                  </button>

                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-300 transform hover:scale-105"
                    onClick={() => handleDelete(usuario.id)}
                  >
                    Eliminar
                    <i className="ml-2 -mr-1 fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal para crear usuario */}
        {showRegister && (
          <div className="z-50 fixed inset-0 bg-gray-900 bg-opacity-85 mx-auto ">
            <div>
              <Register setShowRegister={setShowRegister} fetchUsuarios={fetchUsuarios} />
            </div>
          </div>
        )}

        {/* Modal para editar usuario */}
        {showEdit && (
          <div className="z-50 fixed inset-0 bg-gray-900 bg-opacity-85 mx-auto ">
            <EditUser
              setShowEdit={setShowEdit}
              fetchUsuarios={fetchUsuarios}
              selectedUser={selectedUser}
            />
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default UserManagement;
