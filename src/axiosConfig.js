// src/axiosConfig.js
import axios from 'axios';

// Define la URL base de tu API
const API_URL = 'https://all-gates.onrender.com';

// Crear una instancia de Axios con configuración predeterminada
const axiosInstance = axios.create({
  baseURL: API_URL, // URL base para todas las solicitudes
  headers: {
    'Content-Type': 'application/json', // Tipo de contenido predeterminado
  },
});

// Interceptor para añadir el token a las cabeceras de cada solicitud
axiosInstance.interceptors.request.use(
  (config) => {
    // Obtener el token desde localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Añadir el token al encabezado Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Manejar errores en la solicitud
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas, por ejemplo, para renovar tokens o manejar errores globales
axiosInstance.interceptors.response.use(
  (response) => response, // Pasar la respuesta directamente si es exitosa
  (error) => {
    if (error.response) {
      // Manejar errores específicos según el código de estado
      if (error.response.status === 401) {
        // Token inválido o expirado
        console.error('Token inválido o expirado. Redirigiendo al login...');
        // Opcional: Implementar lógica de cierre de sesión automática
        // localStorage.removeItem('token');
        // window.location.href = '/login';
      }
      // Puedes agregar más condiciones para otros códigos de estado
    }
    return Promise.reject(error); // Rechazar la promesa para manejar el error en el componente
  }
);

export default axiosInstance;
