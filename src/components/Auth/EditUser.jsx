import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig'; // Configuración personalizada de Axios
import Swal from 'sweetalert2'; // Alertas con SweetAlert2

function EditUser({ setShowEdit, fetchUsuarios, selectedUser }) {
  // Estado del formulario
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    password: '', // Nueva contraseña
  });

  // Variables individuales para permisos
  const [inicio, setInicio] = useState(0);
  const [propietarios, setPropietarios] = useState(0);
  const [conductores, setConductores] = useState(0);
  const [vehiculos, setVehiculos] = useState(0);
  const [contratos, setContratos] = useState(0);
  const [cobros, setCobros] = useState(0);
  const [mecanica, setMecanica] = useState(0);
  const [usuarios, setUsuarios] = useState(0);

  const [showPassword, setShowPassword] = useState(false); // Mostrar/ocultar contraseña

  // Cargar datos del usuario seleccionado
  useEffect(() => {
    if (selectedUser) {
      setForm({
        nombre: selectedUser.nombre,
        correo: selectedUser.correo,
        password: '', // Campo vacío inicialmente
      });

      // Cargar permisos individuales
      setInicio(selectedUser.inicio || 0);
      setPropietarios(selectedUser.propietarios || 0);
      setConductores(selectedUser.conductores || 0);
      setVehiculos(selectedUser.vehiculos || 0);
      setContratos(selectedUser.contratos || 0);
      setCobros(selectedUser.cobros || 0);
      setMecanica(selectedUser.mecanica || 0);
      setUsuarios(selectedUser.usuarios || 0);
    }
  }, [selectedUser]);

  // Manejar cambios en los campos de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Manejar cambios en los checkboxes
  const handleCheckboxChange = (setter) => (e) => {
    setter(e.target.checked ? 1 : 0); // Actualiza el estado como 1 o 0
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crear el payload con permisos
    const payload = {
      ...form,
      inicio,
      propietarios,
      conductores,
      vehiculos,
      contratos,
      cobros,
      mecanica,
      usuarios,
    };

    // Eliminar el campo de contraseña si está vacío
    if (!form.password) {
      delete payload.password;
    }

    try {
      // Mostrar alerta de carga
      Swal.fire({
        title: 'Guardando cambios...',
        text: 'Por favor espera.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Enviar datos al servidor
      console.log('Payload:', payload);
      const response = await axiosInstance.put(`/usuarios/${selectedUser.id}`, payload);
      console.log(response.data);

      // Mostrar alerta de éxito
      Swal.fire({
        icon: 'success',
        title: 'Usuario actualizado',
        text: 'Los datos del usuario fueron actualizados correctamente.',
        timer: 2000,
        showConfirmButton: false,
      });

      // Actualizar la lista
      fetchUsuarios();

      // Cerrar el modal
      setShowEdit(false);
    } catch (error) {
      // Mostrar alerta de error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al actualizar el usuario.',
      });
    }
  };

  // Alternar visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <div className="container w-3/4 mt-5 p-4 bg-white shadow-lg rounded-lg max-h-screen overflow-y-auto">
        <h2 className="text-center text-2xl font-bold mb-4">Editar Usuario</h2>
        <form onSubmit={handleSubmit}>
          {/* Campo Nombre */}
          <div className="mb-4">
            <label className="form-label font-semibold">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="form-control border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Campo Correo */}
          <div className="mb-4">
            <label className="form-label font-semibold">Correo</label>
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              className="form-control border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Campo Contraseña */}
          <div className="mb-4">
            <label className="form-label font-semibold">Nueva Contraseña</label>
            <div className="flex">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="form-control border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="ml-2 px-4 py-2 bg-gray-300 rounded"
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>

          {/* Permisos */}
          <div className="mb-4">
            <h3 className="font-bold mb-4 mt-4 text-xl text-center">Permisos de Módulos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Inicio', state: inicio, setter: setInicio },
                { label: 'Propietarios', state: propietarios, setter: setPropietarios },
                { label: 'Conductores', state: conductores, setter: setConductores },
                { label: 'Vehículos', state: vehiculos, setter: setVehiculos },
                { label: 'Contratos', state: contratos, setter: setContratos },
                { label: 'Cobros', state: cobros, setter: setCobros },
                { label: 'Mecánica', state: mecanica, setter: setMecanica },
                { label: 'Usuarios', state: usuarios, setter: setUsuarios },
              ].map((permiso) => (
                <label key={permiso.label} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={permiso.state === 1}
                    onChange={handleCheckboxChange(permiso.setter)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span>{permiso.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-center gap-4 font-bold">
            <button
              type="button"
              onClick={() => setShowEdit(false)}
              className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUser;