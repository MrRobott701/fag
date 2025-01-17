export const formatearFecha = (fechaISO) => {
  // Extraer año, mes y día del string fechaISO
  const [year, month, day] = fechaISO.split("T")[0].split("-");
  
  // Crear la fecha con los componentes año, mes, día
  const fecha = new Date(year, month - 1, day);
  
  return fecha.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).replace(/ de /g, "/");
};

export const formatearNumero = (numero) => {
  return new Intl.NumberFormat("en-US").format(numero);
};

