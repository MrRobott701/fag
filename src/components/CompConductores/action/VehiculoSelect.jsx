// VehiculoSelect.jsx
import React from 'react';
import Select from 'react-select';

const VehiculoSelect = ({ vehiculos, selectedVehiculo, onChange, isClearable = true }) => {
  const vehiculosOptions = [
    { value: 0, label: "Seleccionar Vehículo" },
    ...vehiculos.map((vehiculo) => ({
      value: vehiculo.id,
      label: `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.color} ${vehiculo.anio} Placas: ${vehiculo.placas}`,
    })),
  ];

  const selectedOption = vehiculosOptions.find(
    (option) => option.value === selectedVehiculo
  ) || null;

  const customStyles = {
    option: (provided) => ({
      ...provided,
      fontWeight: 'bold',
    }),
    singleValue: (provided) => ({
      ...provided,
      fontWeight: 'bold',
    }),
  };

  return (
    <Select
      className="shadow rounded border-2 border-gray-400 mt-2"
      value={selectedOption}
      onChange={(option) => onChange(option ? option.value : null)}
      options={vehiculosOptions}
      placeholder={selectedVehiculo && selectedVehiculo !== 0 ? selectedOption.label : "Seleccionar Vehículo"}
      isClearable={isClearable}
      styles={customStyles}
    />
  );
};

export default VehiculoSelect;
