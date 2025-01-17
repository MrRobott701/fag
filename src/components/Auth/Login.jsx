import React, { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import axiosInstance from '../../axiosConfig';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ChikenKing from '../../images/ChikenKing.png';


function Login() {
  const [form, setForm] = useState({ correo: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { setAuthToken } = useContext(AuthContext);
  const navigate = useNavigate();

  // Configuración global del Toast
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validación del correo
    if (!/\S+@\S+\.\S+/.test(form.correo)) {
      Swal.fire({
        icon: 'error',
        title: 'Correo inválido',
        text: 'Por favor, introduce un correo electrónico válido.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }
  
    // Mostrar alerta de carga
    Swal.fire({
      title: "INICIANDO SESIÓN",
      html: "Esto puede tardar unos segundos",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    try {
      const response = await axiosInstance.post('/usuarios/login', form);
      const { token, user } = response.data;
  
      // Guardar token y datos del usuario
      setAuthToken(token);
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
  
      // Cerrar la alerta de carga
      Swal.close();
  
      // Mostrar notificación de éxito
      Toast.fire({
        icon: 'success',
        title: `Bienvenido ${user.nombre}`, // Corrección de interpolación
      });
  
      // Redirigir al usuario
      navigate('/');
    } catch (error) {
      // Cerrar la alerta de carga antes de mostrar el error
      Swal.close();
  
      // Mostrar alerta de error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error en el inicio de sesión',
        confirmButtonColor: '#d33',
      });
    }
  };
  
  const handleShowRegisterInfo = () => {
    Swal.fire({
      icon: 'info',
      title: 'Registrarse',
      html: `
      <div className="text-center font-semibold pointer-events-none">
        <p className="mb-2">El registro es exclusivo para administradores.</p>
        <p>Para registrarse, contacte al administrador a través de las siguientes opciones:</p>
        </div>
        <div style="display: flex; justify-content: center; gap: 20px; margin-top: 20px;">
          <!-- Correo Electrónico -->
          <a
            href="mailto:jorge.perez56@uabc.edu.mx"
            className="text-black hover:text-white text-3xl hover:scale-125"
            style="text-shadow: 0 0 10px white; text-decoration: none;"
          >
            <i className="fas fa-envelope" style="font-size: 30px;"></i>
          </a>
          <!-- WhatsApp -->
          <a
            href="https://api.whatsapp.com/send?phone=6461609694"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-white text-3xl hover:scale-125"
            style="text-shadow: 0 0 10px white; text-decoration: none;"
          >
            <i className="fa-brands fa-square-whatsapp" style="font-size: 30px;"></i>
          </a>
          <!-- Discord -->
          <a
            href="https://discord.gg/B9PCwpSM"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-white text-3xl hover:scale-125"
            style="text-shadow: 0 0 10px white; text-decoration: none;"
          >
            <i className="fab fa-discord" style="font-size: 30px;"></i>
          </a>
        </div>
        <div className="text-center font-semibold mt-4 pointer-events-none">
        <i className="fa-solid fa-paper-plane"></i>
                 <span>jorge.perez56@uabc.edu.mx</span>
                 </div>
                 <div className="text-center font-semibold pointer-events-none">
                 <i className="fa-solid fa-phone"></i>
          <span>646 160 9694</span>
        </div>
      `,
      confirmButtonColor: '#3085d6',
    });
  };
  

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-black to-violet-900">
<div className="flex flex-col h-full bg-gradient-to-br from-black to-violet-900">
  {/* Contenedor del Formulario de Login */}
  <div className="flex justify-center items-center flex-grow flex-col -mt-10">
    {/* Imagen de ChickenKing */}
    <div className="-mb-2 z-50">
      <img
        src={ChikenKing}
        alt="Chicken King Logo"
        className="w-60"
      />
    </div>

    {/* Formulario */}
    <div
      className="w-full max-w-md bg-white p-8 rounded-lg"
      style={{
        boxShadow: "0px 0px 5px 2px rgba(3, 244, 251, 0.8)",
      }}
    >
      <div className="flex justify-center items-stretch">
        <h2 className="ml-2 text-3xl font-bold text-center text-gray-800 mb-6 pointer-events-none">
          Inicio de Sesión
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campo para el correo */}
        <div>
          <label className="block text-lg font-bold text-gray-700">
            Correo Electrónico
          </label>
          <input
            type="email"
            name="correo"
            value={form.correo}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="example@example.com"
            required
          />
        </div>

        {/* Campo para la contraseña */}
        <div>
          <label className="block text-lg font-bold text-gray-700">
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-8 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingrese su contraseña"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 text-xl flex items-center text-gray-500 hover:text-gray-700"
            >
              <i
                className={`fa-regular ${
                  showPassword ? "fa-eye-slash" : "fa-eye"
                }`}
              ></i>
            </button>
          </div>
        </div>

        {/* Botón de inicio de sesión */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white text-lg py-2 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
        >
          Iniciar Sesión
        </button>
      </form>
      {/* Información de registro */}
      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm pointer-events-none">
          ¿No tienes cuenta?{" "}
          <button
            onClick={handleShowRegisterInfo}
            className="pointer-events-auto text-sm font-bold text-blue-600 underline hover:text-blue-800"
          >
            Regístrate
          </button>
        </p>
      </div>
    </div>
  </div>
</div>


      {/* Footer con Datos de Contacto */}
      <footer className="bg-gray-800 text-white py-2">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
          <div className=" md:mb-0">
<a className="text-lg font-semibold pointer-events-none">Contacto:</a>
            
            <a className="rounded-full border border-white/20 flex justify-center items-center gap-x-3 py-1 px-2 md:py-2 md:px-4 text-xs md:text-base bg-white/5 hover:scale-105 hover:bg-white/10 transition"
href="mailto:jorge.perez56@uabc.edu.mx"
>
            <i className="fa-solid fa-envelope-circle-check"></i>
              <p className="text-sm pointer-events-none"
              
              >jorge.perez56@uabc.edu.mx</p>
          </a>
          <a className="mt-2 rounded-full border border-white/20 flex justify-center items-center gap-x-3 py-1 px-2 md:py-2 md:px-4 text-xs md:text-base bg-white/5 hover:scale-105 hover:bg-white/10 transition"
href="https://api.whatsapp.com/send?phone=6461609694"
    target="_blank"
    rel="noopener noreferrer"
>  <i className="fa-solid fa-phone"></i>
              <p className="text-sm font-semibold pointer-events-none">
                +52 646-160-9694</p>
            </a>
         
            </div>

         
            
{/* Información Personal */}
<div className="text-center">
  <h3 className="text-xl font-semibold pointer-events-none">Jorge Ivan Pérez Hernández</h3>
 
  <p className="text-sm pointer-events-none">Web Developer desde México
    <i className="ml-2 fa-solid fa-briefcase my-1"></i>
    <a 
      href="https://staging.costaensenada.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="pointer-events-auto text-sm font-semibold ml-1 text-blue-700 underline hover:text-blue-800"
    >
      Portafolio
    </a>
    </p>
  <div className="text-sm text-gray-500 flex pointer-events-none">
    &copy; {new Date().getFullYear()} Jorge Ivan Pérez Hernández. Todos los
    derechos reservados.
  </div>
</div>


{/* Redes de Contacto */}
<div className="flex space-x-6">
  {/* Correo Electrónico */}
  <a
    href="mailto:jorge.perez56@uabc.edu.mx"
    className="text-black hover:text-white text-3xl hover:scale-110"
    style={{ textShadow: '0 0 10px white' }}
  >
    <i className="text-4xl fas fa-envelope"></i>
  </a>
  {/* WhatsApp */}
  {/* WhatsApp */}
  <a
    href="https://api.whatsapp.com/send?phone=6461609694"
    target="_blank"
    rel="noopener noreferrer"
    className="text-black hover:text-white text-3xl hover:scale-110 transition duration-300"
  style={{ textShadow: '0 0 10px white' }}
  >
<i className="text-4xl fa-brands fa-square-whatsapp"></i>
  </a>
  {/* Discord */}
  <a
    href="https://discord.gg/B9PCwpSM"
    target="_blank"
    rel="noopener noreferrer"
    className="text-black hover:text-white text-3xl hover:scale-110"
    style={{ textShadow: '0 0 10px white' }}
  >
    <i className="text-4xl fab fa-discord"></i>
  </a>
</div>


          </div>
        </div>
      </footer>
    </div>
  );
}

export default Login;
