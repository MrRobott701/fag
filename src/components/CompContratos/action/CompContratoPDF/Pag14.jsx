import { formatearFecha } from "./Funciones";

export const GenerarP14 = (doc, contrato, propietario, conductor) => {
    doc.addPage();
    const pageWidth = 180; // Ancho disponible en mm para el contenido
    const lineSpacing = 5; // Espaciado entre líneas
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(12);

    // Fecha de firma en la esquina superior derecha, en negrita
    doc.setFont("Helvetica", "bold");
    doc.text(`${formatearFecha(contrato.fechaFirma)}.`, pageWidth, 20, { align: "right" });

    // "EL SOCIO" y "EL CONDUCTOR" en el centro de la página
    doc.setFontSize(14);
    doc.text("\"EL SOCIO\"", 75, 80, { align: "center" });
    doc.text("\"EL CONDUCTOR\"", 145, 80, { align: "center" });
    doc.setFontSize(12);

    // Líneas para firma y nombres centrados
    doc.setLineWidth(0.5);

    // Definir las posiciones de las columnas
    const columnaPropietarioX = 75;
    const columnaConductorX = 145;
    const columnaWidth = 50; // Ancho máximo de cada columna en mm

    // Nombres de "ARRENDADOR" (propietario) y "CHOFER" (conductor)
    //const propietarioNombre = propietario.nombre.toUpperCase();
    const propietarioNombre = propietario.nombre.toUpperCase() ? propietario.nombre.toUpperCase() : "{NOMBREPROPIETARIO}";
    const conductorNombre = conductor.nombre.toUpperCase();

    // Dividir los nombres en múltiples líneas si exceden el ancho de la columna
    const propietarioLineas = doc.splitTextToSize(propietarioNombre, columnaWidth);
    const conductorLineas = doc.splitTextToSize(conductorNombre, columnaWidth);

    // Obtener el ancho exacto de cada nombre (en la primera línea si es multilineal)
    const propietarioNombreWidth = doc.getTextWidth(propietarioLineas[0]) + 20;
    const conductorNombreWidth = doc.getTextWidth(conductorLineas[0]) + 20;

    // Dibujar las líneas de firma para el propietario y el conductor ajustadas al ancho del nombre
    // Línea para el propietario
    doc.line(
        columnaPropietarioX - propietarioNombreWidth / 2,
        130,
        columnaPropietarioX + propietarioNombreWidth / 2,
        130
    );

    // Línea para el conductor
    doc.line(
        columnaConductorX - conductorNombreWidth / 2,
        130,
        columnaConductorX + conductorNombreWidth / 2,
        130
    );

    // Posiciones iniciales para los nombres
    const propietarioYStart = 140;
    const conductorYStart = 140;

    // Dibujar el nombre del propietario
    propietarioLineas.forEach((linea, index) => {
        doc.text(linea, columnaPropietarioX, propietarioYStart + (index * lineSpacing), { align: "center" });
    });

    // Dibujar el nombre del conductor
    conductorLineas.forEach((linea, index) => {
        doc.text(linea, columnaConductorX, conductorYStart + (index * lineSpacing), { align: "center" });
    });

    // AVAL en el centro inferior, solo si existe el nombre del aval
    if (conductor.avalNombre) {
        doc.setFontSize(14);
        doc.text("AVAL", 105, 180, { align: "center" });
        doc.setFontSize(12);

        // Línea para firma de AVAL, con ajuste dinámico para el nombre de aval
        const avalNombre = conductor.avalNombre.toUpperCase();
        const avalNombreWidth = doc.getTextWidth(avalNombre);
        const avalXStart = 105 - avalNombreWidth / 2; // Centra el nombre
        const avalLineStart = avalXStart - 17.5; // Ajusta la línea según el nombre
        const avalLineEnd = avalXStart + avalNombreWidth + 17.5;
        doc.line(avalLineStart, 220, avalLineEnd, 220); // Línea para "AVAL"
        doc.text(avalNombre, 105, 230, { align: "center" }); // Centrado sobre la línea de firma
    }

    // Número de página en el pie de página
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Página ${pageCount - 1}`, 200, 279, { align: "right" });
};

export default GenerarP14;
