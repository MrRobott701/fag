export function formatearTextoConNegrita(texto) {
    const partes = [];
    const regex = /\{bold\}(.*?)\{\/bold\}/g;
    let ultimaPos = 0;
    
    let match;
    while ((match = regex.exec(texto)) !== null) {
        // Parte de texto antes del marcador {bold}
        if (match.index > ultimaPos) {
            partes.push({ texto: texto.substring(ultimaPos, match.index), negrita: false });
        }
        
        // Parte en negrita dentro de {bold}...{/bold}
        partes.push({ texto: match[1], negrita: true });
        
        ultimaPos = regex.lastIndex;
    }
    
    // Parte restante del texto después del último marcador
    if (ultimaPos < texto.length) {
        partes.push({ texto: texto.substring(ultimaPos), negrita: false });
    }

    return partes;
}






export const numeroALetras = (numero) => {
    const unidades = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
    const decenas = ["", "diez", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
    const centenas = ["", "cien", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

    if (numero === 0) return "Cero";
    
    let letras = "";

    if (numero >= 1000000) {
        letras += numeroALetras(Math.floor(numero / 1000000)) + " millón ";
        numero %= 1000000;
    }
    if (numero >= 1000) {
        letras += numero >= 2000 ? numeroALetras(Math.floor(numero / 1000)) + " mil " : "mil ";
        numero %= 1000;
    }
    if (numero >= 100) {
        letras += centenas[Math.floor(numero / 100)] + " ";
        numero %= 100;
    }
    if (numero >= 20) {
        letras += decenas[Math.floor(numero / 10)] + (numero % 10 !== 0 ? " y " : "");
        numero %= 10;
    } else if (numero >= 10) {
        // Manejo especial para números del 10 al 19
        const especiales = ["diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"];
        letras += especiales[numero - 10];
        numero = 0;
    }

    if (numero > 0) {
        letras += unidades[numero];
    }

    return letras.trim().charAt(0).toUpperCase() + letras.slice(1).trim();
};


// Función para formatear la fecha en "28 de Diciembre del 2024" sin ajustar por zona horaria
export const formatearFecha = (fechaISO) => {
    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    // Dividir la fecha para trabajar con los componentes sin zona horaria
    const [anio, mes, dia] = fechaISO.split("T")[0].split("-");

    // Convertir los valores a la representación en español
    return `${parseInt(dia)} de ${meses[parseInt(mes) - 1]} del ${anio}`;
};