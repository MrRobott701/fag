import React, { useState } from 'react';
import axiosInstance from '../../axiosConfig'; // Importa la instancia personalizada
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importa SweetAlert2

function Register({ setShowRegister, fetchUsuarios }) { // Recibe fetchUsuarios como prop para refrescar la lista
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    password: '',
    permisos: {
      inicio: 1,
      propietarios: 1,
      conductores: 1,
      vehiculos: 1,
      contratos: 1,
      cobros: 1,
      mecanica: 1,
      usuarios: 1,
    },
  });

  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const navigate = useNavigate();
  const URI_API = 'https://bag-st6b.onrender.com/usuarios/register'; // Ruta API

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm({
        ...form,
        permisos: { ...form.permisos, [name]: checked ? 1 : 0 },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { permisos, ...rest } = form; // Separa permisos del resto de los campos
    const payload = { ...rest, ...permisos }; // Combina todo en un solo objeto plano

    try {
      // Mostrar alerta de carga
      Swal.fire({
        title: 'Creando usuario...',
        text: 'Por favor espera.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Enviar datos al servidor
      await axiosInstance.post(URI_API, payload);

      // Mostrar alerta de éxito
      Swal.fire({
        icon: 'success',
        title: 'Usuario creado',
        text: 'El usuario se registró exitosamente.',
        timer: 2000,
        showConfirmButton: false,
      });

      // Refrescar la lista de usuarios
      fetchUsuarios();

      // Cerrar el modal
      setShowRegister(false);

    } catch (error) {
      // Mostrar alerta de error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error en el registro',
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
        <h2 className="text-center text-2xl font-bold mb-4">Registro</h2>
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

          {/* Campo Contraseña con ícono */}
          <div className="mb-4">
            <label className="form-label font-semibold">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="form-control border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                <i
                  className={`fa-solid ${
                    showPassword ? 'fa-eye-slash' : 'fa-eye'
                  }`}
                ></i>
              </button>
            </div>
          </div>

          {/* Permisos con checkbox personalizados */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Permisos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.keys(form.permisos).map((permiso) => (
                <div key={permiso} className="flex items-center">
                  <label className="flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id={permiso}
                      name={permiso}
                      checked={form.permisos[permiso] === 1}
                      onChange={handleChange}
                      className="form-checkbox h-5 w-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-400"
                    />
                    <span className="ml-2 capitalize">{permiso}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-4 font-bold">
            <button
              type="button"
              onClick={() => setShowRegister(false)}
              className=" bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className=" bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
