import React, { useState, useEffect } from 'react';

const DateSelector = ({ onFechaChange, onSearchChange }) => { // Recibe onSearchChange como prop
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
    const [weekStart, setWeekStart] = useState("");
    const [weekEnd, setWeekEnd] = useState("");
    const [searchTerm, setSearchTerm] = useState(""); // Estado local para el término de búsqueda

    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const years = Array.from({ length: 5 }, (_, i) => selectedYear - 2 + i);

    useEffect(() => {
        updateWeekRange(currentDate);
    }, [currentDate]);

    const updateWeekRange = (date) => {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay() + 1);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        setWeekStart(startOfWeek.toLocaleDateString("es-ES", { day: "numeric", month: "long" }));
        setWeekEnd(endOfWeek.toLocaleDateString("es-ES", { day: "numeric", month: "long" }));
        setSelectedMonth(date.getMonth());
        setSelectedYear(date.getFullYear());

        // Pasar las fechas a HojaCobros
        if (onFechaChange) {
            const inicio = startOfWeek.toLocaleDateString("es-ES");
            const fin = endOfWeek.toLocaleDateString("es-ES");
            onFechaChange(inicio, fin);
        }
    };

    const handleMonthChange = (event) => {
        const newMonth = parseInt(event.target.value, 10);
        const newDate = new Date(selectedYear, newMonth, 1);
        setCurrentDate(newDate);
    };

    const handleYearChange = (event) => {
        const newYear = parseInt(event.target.value, 10);
        const newDate = new Date(newYear, selectedMonth, 1);
        setCurrentDate(newDate);
    };

    const changeWeek = (weeks) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + weeks * 7);
        setCurrentDate(newDate);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        // Pasa el término de búsqueda a HojaCobros
        if (onSearchChange) {
            onSearchChange(event.target.value);
        }
    };

    return (
        <div className="font-bold mb-3 grid grid-cols-12 gap-4 border p-3 rounded-lg shadow-xl bg-white">
            <div className="col-end-1">
            <i className="fa fa-calendar-days text-3xl"></i>
                {/* Year Selector */}
                </div>
                <div className="w-20">
                <select 
                    value={selectedYear} 
                    onChange={handleYearChange} 
                    className="border p-2 rounded-md w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
            <div className="col-span-2">
                {/* Month Selector */}
                <select 
                    value={selectedMonth} 
                    onChange={handleMonthChange} 
                    className="border p-2 rounded-md w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {months.map((month, index) => (
                        <option key={index} value={index}>
                            {month.toUpperCase()}
                        </option>
                    ))}
                </select>
            </div>
            <div className="col-span-5">
                {/* Week Navigation */}
                <div className="flex items-center justify-between">
                    <button onClick={() => changeWeek(-1)} className="p-2 bg-fuchsia-500 text-xl text-white rounded-md shadow hover:bg-fuchsia-700 transition">
                        &lt;
                    </button>
                    
                    <span className="text-xl font-bold text-black text-center w-full">
                        {weekStart} al {weekEnd}
                    </span>
                    
                    <button onClick={() => changeWeek(1)} className="p-2 text-xl bg-fuchsia-500 text-white rounded-md shadow hover:bg-fuchsia-700 transition">
                        &gt;
                    </button>
                </div>
            </div>
            <div className="col-span-4">
                {/* Driver Search */}
                <div className="relative">
                    <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-search text-gray-400"></i>
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar Conductor"
                        value={searchTerm}
                        onChange={handleSearchChange} // Se llama a la función pasada como prop
                        className="rounded border-2 pl-10 pr-10 py-2 w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
        </div>
    );
};

export default DateSelector;
