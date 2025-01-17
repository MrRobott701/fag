export const GenerarP11 = (doc) => {
    doc.addPage();
    doc.setFont("Helvetica", "bold");
    const pageWidth = 170; // Ancho disponible en mm para el contenido
    const lineSpacing = 5; // Espaciado entre líneas
    doc.setFontSize(10);

    // Vigésima Novena Cláusula
    let posY = 20;
    doc.text("VIGÉSIMA NOVENA: DE LOS SERVICIOS", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    const textoVigesimaNovena = "LAS PARTES convienen que EL CONDUCTOR, en virtud del negocio que tiene con EL SOCIO, brindará LOS SERVICIOS a los USUARIOS con apego a lo establecido en los Anexos I y II, que firmados por LAS PARTES, forman parte del presente Contrato.";
    const lineasVigesimaNovena = doc.splitTextToSize(textoVigesimaNovena, pageWidth);
    doc.text(lineasVigesimaNovena, 10, posY + lineSpacing);
    posY += lineasVigesimaNovena.length * lineSpacing + 10;

    // Trigésima Cláusula
    doc.setFont("Helvetica", "bold");
    doc.text("TRIGÉSIMA: CONTROL DE LOS SERVICIOS", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    const textoTrigesima = "EL CONDUCTOR, acuerda conducir el VEHÍCULO de acuerdo a lo previsto en el Reglamento de Tránsito. En caso de que EL VEHÍCULO no cumpla con las condiciones y nivel de servicio, independientemente de la situación y que ésta sea imputable a EL CONDUCTOR se entenderá como un incumplimiento de contrato, por lo que se procederá conforme a lo establecido en el presente documento.";
    const lineasTrigesima = doc.splitTextToSize(textoTrigesima, pageWidth);
    doc.text(lineasTrigesima, 10, posY + lineSpacing);
    posY += lineasTrigesima.length * lineSpacing + 10;

    // Trigésima Primera Cláusula
    doc.setFont("Helvetica", "bold");
    doc.text("TRIGÉSIMA PRIMERA: INFRACCIONES", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    const textoTrigesimaPrimera = "Las infracciones de tránsito, accidentes y choques que correspondan al VEHÍCULO realizadas por EL CONDUCTOR, serán de responsabilidad de este mismo y deberá comunicárselo a EL SOCIO. Así mismo, EL CONDUCTOR se obliga a no conducir habiendo ingerido bebidas alcohólicas ni conducir bajo el efecto de drogas.";
    const lineasTrigesimaPrimera = doc.splitTextToSize(textoTrigesimaPrimera, pageWidth);
    doc.text(lineasTrigesimaPrimera, 10, posY + lineSpacing);
    posY += lineasTrigesimaPrimera.length * lineSpacing + 5;

    const textoTrigesimaPrimera2 = "El incumplimiento de alguna de estas cláusulas será causal de rescisión para EL SOCIO, pudiendo este cobrar a EL CONDUCTOR el pagaré firmado como garantía sin lugar a reclamo alguno, independientemente de las demás obligaciones a que se haya hecho acreedor en virtud de este Contrato.";
    const lineasTrigesimaPrimera2 = doc.splitTextToSize(textoTrigesimaPrimera2, pageWidth);
    doc.text(lineasTrigesimaPrimera2, 10, posY + lineSpacing);
    posY += lineasTrigesimaPrimera2.length * lineSpacing + 15;

    // Sección Generales
    doc.setFont("Helvetica", "bold");
    doc.text("G E N E R A L E S", 85, posY);
    posY += 10;

    // Trigésima Segunda Cláusula
    doc.text("TRIGÉSIMA SEGUNDA: CASO FORTUITO", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    const textoTrigesimaSegunda = "En caso de que EL VEHÍCULO o EL CONDUCTOR se encuentre imposibilitado para prestar el servicio, ya sea por caso fortuito o por causas de fuerza mayor, no se incurrirá en incumplimiento, por lo que no habrá pena convencional.";
    const lineasTrigesimaSegunda = doc.splitTextToSize(textoTrigesimaSegunda, pageWidth);
    doc.text(lineasTrigesimaSegunda, 10, posY + lineSpacing);
    posY += lineasTrigesimaSegunda.length * lineSpacing + 10;

    // Trigésima Tercera Cláusula
    doc.setFont("Helvetica", "bold");
    doc.text("TRIGÉSIMA TERCERA: RELACIÓN ENTRE LAS PARTES", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    const textoTrigesimaTercera = "LAS PARTES establecen que en virtud de tratarse de una Asociación en Participación, el presente contrato no crea ni genera relación jurídica laboral alguna entre EL SOCIO y EL CONDUCTOR y por tanto ninguna otra contraprestación adicional a las mencionadas en el presente contrato. Por lo que EL SOCIO no asume ninguna responsabilidad laboral.";
    const lineasTrigesimaTercera = doc.splitTextToSize(textoTrigesimaTercera, pageWidth);
    doc.text(lineasTrigesimaTercera, 10, posY + lineSpacing);

    // Número de página en el pie de página
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(10);
    doc.text(`Página ${pageCount - 1}`, 200, 279, { align: "right" });
};

// Función para agregar texto con sangría en todas las líneas
const agregarDeclaracionConTab = (texto, posY, doc) => {
    const pageWidth = 170; // Ancho de página disponible para el contenido
    const indent = 10; // Sangría para cada línea
    const lineSpacing = 5; // Espaciado entre líneas
    const lineas = doc.splitTextToSize(texto, pageWidth);
    lineas.forEach((linea, index) => {
        doc.text(linea, 10 + indent, posY + (index * lineSpacing));
    });
    return posY + (lineas.length * lineSpacing);
};

export default GenerarP11;
