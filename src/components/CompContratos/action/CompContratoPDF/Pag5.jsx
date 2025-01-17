import { numeroALetras, formatearFecha, formatearTextoConNegrita } from "./Funciones";

export const GenerarP5 = (doc, contrato) => {
    doc.addPage();
    doc.setFont("Helvetica", "bold");
    const pageWidth = 170; // Ancho disponible en mm para el contenido
    const lineSpacing = 5; // Espaciado entre líneas
    const indent = 10; // Sangría para cada línea
    doc.setFontSize(10);

    // Función para imprimir una declaración en una sola línea, con negrita solo en las variables
    const agregarDeclaracionEnLinea = (texto, posY) => {
        const partesTexto = formatearTextoConNegrita(texto); // Divide el texto en partes según {bold}...{/bold}
        let actualX = 10 + indent; // Posición X inicial
        let actualY = posY;

        partesTexto.forEach((parte) => {
            doc.setFont("Helvetica", parte.negrita ? "bold" : "normal");

            // Divide el texto en palabras para evitar que se corte a mitad de palabra
            const palabras = parte.texto.split(' ');

            palabras.forEach((palabra, index) => {
                // Calcula el ancho de la palabra y añade un espacio si no es la última palabra del fragmento
                const anchoPalabra = doc.getTextWidth(palabra + (index < palabras.length - 1 ? ' ' : ''));

                // Verificar si la palabra cabe en el espacio disponible en la línea actual
                if (actualX + anchoPalabra > pageWidth + 10) {
                    // Salto de línea si la palabra no cabe
                    actualY += lineSpacing;
                    actualX = 10 + indent; // Reiniciar posición X al margen izquierdo
                }

                // Imprimir la palabra en la posición actual
                doc.text(palabra, actualX, actualY);
                actualX += anchoPalabra; // Mover X al final de la palabra actual
            });

            // Añadir espacio entre fragmentos en la misma línea si es necesario
            actualX += 2; // Espacio para separar las partes de texto
        });

        return actualY + lineSpacing; // Retorna la posición Y al final de la declaración
    };

    // Séptima Cláusula
    let posY = 20;
    doc.text("SÉPTIMA: FORMA DE PAGO", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    posY = agregarDeclaracionEnLinea(
        "LAS PARTES acuerdan que la RENTA será pagada a EL SOCIO{bold}semanalmente los días lunes de cada semana, mediante efectivo, en el domicilio señalado por el SOCIO{/bold}.",
        posY
    );

    // Sub-apartados de la séptima cláusula
    posY = agregarDeclaracionEnLinea(
        `Por la cantidad de:{bold}$${contrato.precioRenta}.00 Pesos (${numeroALetras(contrato.precioRenta)} pesos mxn){/bold}.`,
        posY + 5
    );
    posY = agregarDeclaracionEnLinea(
        `Se aplicará una penalidad de pago tardío, esta será por{bold}$${contrato.penalidad}.00 Pesos (${numeroALetras(contrato.penalidad)} pesos mxn){/bold}por día.`,
        posY + 5
    );
    posY = agregarDeclaracionEnLinea(
        `Y un depósito de{bold}$${contrato.precioDeposito}.00 Pesos(${numeroALetras(contrato.precioDeposito)} pesos mxn){/bold}. Que serán reembolsables.`,
        posY + 5
    );
    posY = agregarDeclaracionEnLinea(
        "En dado caso de ser requerida la cancelación del presente contrato antes del tiempo establecido, dicho depósito no podrá ser reembolsable.",
        posY + 5
    );

    // Octava Cláusula
    posY += 10;
    doc.setFont("Helvetica", "bold");
    doc.text("OCTAVA: VIGENCIA", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    posY = agregarDeclaracionEnLinea(
        `El presente contrato de asociación en participación es de duración determinada. En ese sentido, el período de duración del presente contrato es de{bold}${contrato.duracionMeses}(${numeroALetras(contrato.duracionMeses)}){/bold}meses contados a partir de la fecha de firma del presente, por lo que vence el día{bold}${formatearFecha(contrato.fechaFin)}{/bold}. Una vez concluida la vigencia del presente instrumento, el Contrato se renovará de manera automática e indefinida, a excepción de que cualquiera de LAS PARTES notifique lo contrario a la otra con 20 (veinte) días de anticipación.`,
        posY
    );

    posY = agregarDeclaracionEnLinea(
        "Además, ambas partes acuerdan que EL SOCIO participante tendrá derecho a poseer la unidad un día al mes, con el fin de realizar labores de mantenimiento del vehículo. Este día será acordado previamente entre las partes y se llevará a cabo de manera que no afecte significativamente las operaciones del negocio.",
        posY + 5
    );

    // Novena Cláusula
    doc.setFont("Helvetica", "bold");
    posY += 10;
    doc.text("NOVENA: PERSONALIDAD JURÍDICA", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    posY = agregarDeclaracionEnLinea(
        "En armonía con lo establecido por los artículos 253 y 256 de la Ley General de Sociedades Mercantiles, LAS PARTES dejan constancia de que el presente contrato de asociación en participación no genera la creación de una persona jurídica y tampoco tiene razón social ni denominación alguna.",
        posY
    );
    posY = agregarDeclaracionEnLinea(
        "En consecuencia, EL SOCIO actuará en nombre propio en las relaciones comerciales que se originen a propósito del presente contrato.",
        posY + 5
    );

    // Décima Cláusula
    doc.setFont("Helvetica", "bold");
    posY += 10;
    doc.text("DÉCIMA: CONTROL ADMINISTRATIVO", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    posY = agregarDeclaracionEnLinea(
        "El control administrativo será responsabilidad de EL SOCIO, con base en su experiencia tramitará y atenderá las necesidades concretas de EL NEGOCIO, incluyendo impuestos, comisión de UBER, y aquellos que LAS PARTES llegasen a acordar.",
        posY
    );

    // Décima Primera Cláusula
    doc.setFont("Helvetica", "bold");
    posY += 10;
    doc.text("DÉCIMA PRIMERA: RELACIÓN JURÍDICA CON TERCEROS", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    posY = agregarDeclaracionEnLinea(
        "LAS PARTES declaran expresamente que corresponderá a EL SOCIO cualquier vinculación económica que en el desarrollo del NEGOCIO se acuerde con terceros, para lo cual EL SOCIO actuará en nombre propio al celebrar contratos, al asumir obligaciones o al adquirir créditos.",
        posY
    );

    // Número de página en el pie de página
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(10);
    doc.text(`Página ${pageCount - 1}`, 200, 279, { align: "right" });
};

export default GenerarP5;
