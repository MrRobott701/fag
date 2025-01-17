// src/components/Nav.jsx
import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import camIcon from "../images/ico-cam.png";
import camIcon2 from "../images/ico-cam2.png";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";

const Nav = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { authToken, logout } = useContext(AuthContext);
  const user = JSON.parse(localStorage.getItem('user'));
  console.log(user);


  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const cerrarSession = () => {
    Swal.fire({
      title: "¿Estás seguro de cerrar sesión?",
      imageUrl: "   https://cdn-icons-png.flaticon.com/512/564/564619.png ", // URL de un ícono triangular rojo
      imageWidth: 120,
      imageHeight: 120,
      showCancelButton: true,
      confirmButtonText: "Si, Cerrar Sesión",
      cancelButtonText: "No, Cancelar",
      reverseButtons: true,
      customClass: {
        confirmButton: "bg-red-600 text-white font-bold hover:bg-red-700 transform hover:scale-105 focus:outline-none px-4 py-2 rounded",
        cancelButton: "bg-green-600 text-white font-bold hover:bg-green-700 transform hover:scale-105 focus:outline-none px-4 py-2 rounded",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        logout(); // Función del contexto para cerrar sesión
        navigate("/login"); // Redirigir al usuario a la página de login
      }
    });
  };
  

  // Si el usuario no está autenticado, no renderizar nada
  if (!authToken) {
    return null;
  }

  return (
    <>
      {/* Navbar horizontal */}
      <header className="h-[10%] w-1 z-50 fixed bg-gray-800">
        <nav className="relative h-full flex items-center px-4">
          <button
            onClick={handleCollapse}
            className="text-white text-2xl focus:outline-none transition-all duration-300"
          >
            <i className="fa fa-bars" aria-hidden="true"></i>
          </button>
          {/* Puedes agregar más elementos al navbar horizontal si lo deseas */}
        </nav>
      </header>
      <div className="z-50 fixed right-2 top-3 text-xl flex items-center w-90 mr-24">
  <span className={`text-white font-semibold text-end ml-1`}>
    {user?.nombre || "Usuario"}
  </span>
  <i className="fa-solid fa-user-circle text-white text-4xl ml-2"></i>
</div>

<div className="z-50 fixed right-2 text-xl flex top-0">
<button
                onClick={cerrarSession}
                className={`flex items-center p-1 border rounded-md border-black text-white bg-gray-800
                          hover: transform hover:scale-105 transition-all duration-300
                           focus:outline-none mt-3`}
                style={{
                  boxShadow: "0px 0px 5px 2px rgba(101, 101, 101, 0.8)",
                }}
              >
                <i
                  className={"fa-solid fa-right-from-bracket text-2xl ml-1"}
                ></i>
                <span
                  className="text-lg font-semibold ml-2"
                >
                  Salir
                </span>
              </button>
</div>



      {/* Sidebar vertical con transición */}
      <div
        className={`fixed left-0 h-full bg-gray-800 z-20 transition-all duration-200 ease-in-out ${
          isCollapsed ? "w-20" : "w-48"
        }`}
      >
        <div className="px-3 py-3 mt-16">
          {isCollapsed && <div className=""></div>}

          <ul className="space-y-6 text-xl font-bold">
            {/* Ruta Inicio */}
                        {user.inicio === 1 && (
            <li className="relative group">
              <Link
                to="/"
                className={`flex items-center p-2 border rounded ${
                  location.pathname === "/"
                    ? "border-white text-gray-800 bg-white"
                    : "border-black text-white bg-gray-700"
                } hover:bg-black transform hover:scale-105 transition-all duration-300 focus:outline-none`}
                style={{
                  boxShadow:
                    location.pathname === "/"
                      ? "0px 0px 5px 2px rgba(3, 244, 251, 0.8)"
                      : "0px 0px 5px 2px rgba(101, 101, 101, 0.8)",
                }}
              >
                <i
                  className={`fa-solid fa-house text-2xl  mr-2 ${
                    location.pathname === "/" ? "text-gray-800" : "text-white"
                  } ${isCollapsed ? "ml-0.5" : ""}`}
                ></i>
                <span
                  className={`transition-opacity duration-300 ${
                    isCollapsed ? "opacity-0" : "opacity-100"
                  }`}
                >
                  Inicio
                </span>
              </Link>

              {/* Tooltip personalizado */}
              <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs text-white bg-black rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
                Inicio
              </span>
            </li>
            )}

            {/* Ruta Propietarios */}
                        {user.propietarios === 1 && (
            <li>
              <Link
                to="/propietarios"
                className={`flex items-center p-2 border rounded ${
                  location.pathname === "/propietarios"
                    ? "border-white text-gray-800 bg-white"
                    : "border-black text-white bg-gray-700"
                } hover:bg-black transform hover:scale-105 transition-all duration-300 focus:outline-none`}
                title="Propietarios"
                style={{
                  boxShadow:
                    location.pathname === "/propietarios"
                      ? "0px 0px 5px 2px rgba(3, 244, 251, 0.8)"
                      : "0px 0px 5px 2px rgba(101, 101, 101, 0.8)",
                }}
              >
                <i
                  className={`fa-solid fa-user-tie text-2xl mr-2 ${
                    location.pathname === "/propietarios"
                      ? "text-gray-800"
                      : "text-white"
                  } ${isCollapsed ? "mx-1" : ""}`}
                ></i>
                <span
                  className={`transition-opacity duration-300 ${
                    isCollapsed ? "opacity-0" : "opacity-100"
                  }`}
                >
                  Propietarios
                </span>
              </Link>
            </li>
            )}

                        {/* Ruta CONDUCTORES */}
                        {user.conductores === 1 && (
            <li>
              <Link
                to="/conductores"
                className={`flex items-center p-2 border rounded ${
                  location.pathname === "/conductores"
                    ? "border-white text-black bg-white"
                    : "border-black text-white bg-gray-700"
                } hover:bg-black transform hover:scale-105 transition-all duration-300 focus:outline-none`}
                title="Conductores"
                style={{
                  boxShadow:
                    location.pathname === "/conductores"
                      ? "0px 0px 5px 2px rgba(3, 244, 251, 0.8)"
                      : "0px 0px 5px 2px rgba(101, 101, 101, 0.8)",
                }}
              >
                <i
                  className={`fa-solid fa-users-between-lines text-xl mr-1 ${
                    location.pathname === "/conductores"
                      ? "text-gray-800"
                      : "text-white"
                  } ${isCollapsed ? "mx-0.5" : ""}`}
                ></i>
                <span
                  className={`transition-opacity duration-300 ${
                    isCollapsed ? "opacity-0" : "opacity-100"
                  }`}
                >
                  Conductores
                </span>
              </Link>
            </li>
            )}
            

            {/* Ruta Vehículos */}
                        {user.vehiculos === 1 && (
            <li>
              <Link
                to="/vehiculos"
                className={`flex items-center p-2 border rounded ${
                  location.pathname === "/vehiculos"
                    ? "border-white text-gray-800 bg-white"
                    : "border-black text-white bg-gray-700"
                } hover:bg-black transform hover:scale-105 transition-all duration-300 focus:outline-none`}
                title="Vehículos"
                style={{
                  boxShadow:
                    location.pathname === "/vehiculos"
                      ? "0px 0px 5px 2px rgba(3, 244, 251, 0.8)"
                      : "0px 0px 5px 2px rgba(101, 101, 101, 0.8)",
                }}
              >
                <i
                  className={`fa-solid fa-car-rear text-2xl mr-2 ${
                    location.pathname === "/vehiculos"
                      ? "text-gray-800"
                      : "text-white"
                  } ${isCollapsed ? "mx-0.5" : ""}`}
                ></i>
                <span
                  className={`transition-opacity duration-300 ${
                    isCollapsed ? "opacity-0" : "opacity-100"
                  }`}
                >
                  Vehículos
                </span>
              </Link>
            </li>
            )}

            {/* Ruta Contratos */}
                        {user.contratos === 1 && (
            <li>
              <Link
                to="/contratos"
                className={`flex items-center p-2 border rounded ${
                  location.pathname === "/contratos"
                    ? "border-white text-gray-800 bg-white"
                    : "border-black text-white bg-gray-700"
                } hover:bg-black transform hover:scale-105 transition-all duration-300 focus:outline-none`}
                title="Contratos"
                style={{
                  boxShadow:
                    location.pathname === "/contratos"
                      ? "0px 0px 5px 2px rgba(3, 244, 251, 0.8)"
                      : "0px 0px 5px 2px rgba(101, 101, 101, 0.8)",
                }}
              >
                <i
                  className={`fa-solid fa-file-shield text-2xl mr-2 ${
                    location.pathname === "/contratos"
                      ? "text-gray-800"
                      : "text-white"
                  } ${isCollapsed ? "mx-0.5" : ""}`}
                ></i>
                <span
                  className={`transition-opacity duration-300 ${
                    isCollapsed ? "opacity-0" : "opacity-100"
                  }`}
                >
                  Contratos
                </span>
              </Link>
            </li>
            )}

            {/* Ruta Cobros */}
            {user.cobros === 1 && (
            <li>
              <Link
                to="/cobros"
                className={`flex items-center p-2 border rounded ${
                  location.pathname === "/cobros"
                    ? "border-white text-gray-800 bg-white"
                    : "border-black text-white bg-gray-700"
                } hover:bg-black transform hover:scale-105 transition-all duration-300 focus:outline-none`}
                title="Cobros"
                style={{
                  boxShadow:
                    location.pathname === "/cobros"
                      ? "0px 0px 5px 2px rgba(3, 244, 251, 0.8)"
                      : "0px 0px 5px 2px rgba(101, 101, 101, 0.8)",
                }}
              >
                <i
                  className={`fa-solid fa-sack-dollar text-2xl mr-2 ${
                    location.pathname === "/cobros"
                      ? "text-gray-800"
                      : "text-white"
                  } ${isCollapsed ? "mx-0.5" : ""}`}
                ></i>
                <span
                  className={`transition-opacity duration-300 ${
                    isCollapsed ? "opacity-0" : "opacity-100"
                  }`}
                >
                  Cobros
                </span>
              </Link>
            </li>
            )}

            {/* Ruta Mantenimiento */}
            {user.mecanica === 1 && (
            <li>
              <Link
                to="/mantenimiento"
                className={`flex items-center p-2 border rounded ${
                  location.pathname === "/mantenimiento"
                    ? "border-white text-gray-800 bg-white"
                    : "border-black text-white bg-gray-700"
                } hover:bg-black transform hover:scale-105 transition-all duration-300 focus:outline-none`}
                title="Mantenimiento"
                style={{
                  boxShadow:
                    location.pathname === "/mantenimiento"
                      ? "0px 0px 5px 2px rgba(3, 244, 251, 0.8)"
                      : "0px 0px 5px 2px rgba(101, 101, 101, 0.8)",
                }}
              >
                <i
                  className={`fa-solid fa-tools text-2xl mr-2 ${
                    location.pathname === "/mantenimiento"
                      ? "text-gray-800"
                      : "text-white"
                  } ${isCollapsed ? "mx-0.5" : ""}`}
                ></i>
                <span
                  className={`transition-opacity duration-300 ${
                    isCollapsed ? "opacity-0" : "opacity-100"
                  }`}
                >
                  Mecánica
                </span>
              </Link>
            </li>
            )}

            {/* Ruta Usuarios */}
            {user.usuarios === 1 && (
            <li>
              <Link
                to="/users"
                className={`flex items-center p-2 border rounded ${
                  location.pathname === "/users"
                    ? "border-white text-gray-800 bg-white"
                    : "border-black text-white bg-gray-700"
                } hover:bg-black transform hover:scale-105 transition-all duration-300 focus:outline-none`}

                title="Usuarios"
                style={{
                  boxShadow:
                    location.pathname === "/users"
                      ? "0px 0px 5px 2px rgba(3, 244, 251, 0.8)"
                      : "0px 0px 5px 2px rgba(101, 101, 101, 0.8)",
                }}
              >
                <i
                  className={`fa-solid fa-users-gear text-2xl mr-2 ${
                    location.pathname === "/users"
                      ? "text-gray-800"
                      : "text-white"
                  } ${isCollapsed ? "mx-0.5" : ""}`}
                ></i>
                <span
                  className={`transition-opacity duration-300 ${
                    isCollapsed ? "opacity-0" : "opacity-100"
                  }`}
                >
                  Usuarios
                </span>
              </Link>
            </li>
            )}


            {/* Cerrar Sesión 
            <li>
              <button
                onClick={cerrarSession}
                className={`flex items-center p-1 border rounded-md border-black text-white bg-gray-700
                           hover:border-blue-500 hover:bg-black transform hover:scale-105 transition-all duration-300
                           focus:outline-none w-full mt-24`}
                style={{
                  boxShadow: "0px 0px 5px 2px rgba(101, 101, 101, 0.8)",
                }}
              >
                <i
                  className={`fa-solid fa-right-from-bracket text-2xl ml-1 ${
                    location.pathname === "/login" ? "text-gray-800" : "text-white"
                  } ${isCollapsed ? "ml-2" : "ml-1"}`}
                ></i>
                <span
                  className={`text-lg ml-2 transition-opacity duration-300 ${
                    isCollapsed ? "opacity-0" : "opacity-100"
                  }`}
                >
                  Cerrar Sesión
                </span>
              </button>
            </li>
            */}
          </ul>
        </div>
{/* Footer en el sidebar */}
<div className="absolute bottom-0 w-full py-1 bg-gray-800">
  {/* Contenedor de las imágenes */}
  <div className="relative flex items-center justify-center h-14 w-30">
    {/* Icono para el estado expandido */}
    <a
      href="https://staging.costaensenada.com/"
      target="_blank"
      rel="noopener noreferrer"
      className={`absolute transition-opacity duration-300 ${
        isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
    >
      <img
        src={camIcon}
        alt="Cam Icon"
        className="h-12 w-30 hover:scale-110 transition-transform duration-300"
      />
    </a>

    {/* Icono para el estado colapsado */}
    <a
      href="https://staging.costaensenada.com/"
      target="_blank"
      rel="noopener noreferrer"
      className={`absolute transition-opacity duration-300 ${
        isCollapsed ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <img
        src={camIcon2}
        alt="Cam Icon"
        className="h-12 w-30 hover:scale-110 transition-transform duration-300"
      />
    </a>
  </div>

  {/* Texto para el estado expandido */}
  <p
    className={`text-center text-white text-xs mt-2 transition-all duration-300 ${
      isCollapsed ? 'opacity-0 translate-y-5 pointer-events-none' : 'opacity-100 translate-y-0'
    }`}
  >
    &copy; 2024 Todos los derechos reservados
  </p>
</div>




      </div>
    </>
  );
};

export default Nav;
