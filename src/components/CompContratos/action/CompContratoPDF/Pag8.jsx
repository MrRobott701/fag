export const GenerarP8 = (doc) => {
    doc.addPage();
    doc.setFont("Helvetica", "bold");
    const pageWidth = 170; // Ancho disponible en mm para el contenido
    const lineSpacing = 5; // Espaciado entre líneas
    doc.setFontSize(10);

    // Décima Octava Cláusula
    let posY = 20;
    doc.text("DÉCIMA OCTAVA: USO DEL VEHÍCULO", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    const textoDecimaOctava = "LAS PARTES acuerdan que el Uso del VEHÍCULO por parte del CONDUCTOR, se limitará únicamente para el desempeño de LOS SERVICIOS relacionados con EL NEGOCIO, excluyendo así cualquier otro tipo de trabajos o labores personales para terceras personas, actos de comisión mercantil, consignación, intermediación, o de cualquier especie, aun cuando éstos no sean remunerados para sí o para personas distintas a EL SOCIO, ya que ese tiempo lo debe destinar al cumplimiento de LOS SERVICIOS relacionados con EL NEGOCIO.";
    const lineasDecimaOctava = doc.splitTextToSize(textoDecimaOctava, pageWidth);
    doc.text(lineasDecimaOctava, 10, posY + lineSpacing);
    posY += lineasDecimaOctava.length * lineSpacing + 5;

    const textoDecimaOctava2 = "EL CONDUCTOR se obliga a asumir las posibles sanciones que se deriven por el uso inadecuado del mismo. En caso de cualquier incumplimiento a esta Cláusula, será causa de terminación al Presente Contrato sin responsabilidad para el SOCIO, debiendo responder EL CONDUCTOR por los daños y perjuicios que esto llegare a ocasionar a EL SOCIO.";
    const lineasDecimaOctava2 = doc.splitTextToSize(textoDecimaOctava2, pageWidth);
    doc.text(lineasDecimaOctava2, 10, posY + lineSpacing);
    posY += lineasDecimaOctava2.length * lineSpacing + 10;

    // Décima Novena Cláusula
    doc.setFont("Helvetica", "bold");
    doc.text("DÉCIMA NOVENA: PROPIEDAD DEL VEHÍCULO", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    const textoDecimaNovena = "EL CONDUCTOR reconoce que EL SOCIO es el único y legítimo propietario de EL VEHÍCULO, instrumentos o herramientas que estén dentro del mismo, manuales de operación, instrumentos de trabajo, así como todos los documentos e información que se le proporcione con motivo de la Asociación en Participación objeto de este Contrato, por lo que se obliga a conservarlos en buen estado y no sustraerlos.";
    const lineasDecimaNovena = doc.splitTextToSize(textoDecimaNovena, pageWidth);
    doc.text(lineasDecimaNovena, 10, posY + lineSpacing);
    posY += lineasDecimaNovena.length * lineSpacing + 10;

    // Vigésima Cláusula
    doc.setFont("Helvetica", "bold");
    doc.text("VIGÉSIMA: VICIOS OCULTOS", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    const textoVigesima = "EL SOCIO se obliga a responder por los vicios o defectos ocultos en el VEHÍCULO, a pesar de que no supiere de ellos al momento de hacer la entrega a EL CONDUCTOR.";
    const lineasVigesima = doc.splitTextToSize(textoVigesima, pageWidth);
    doc.text(lineasVigesima, 10, posY + lineSpacing);
    posY += lineasVigesima.length * lineSpacing + 10;

    // Vigésima Primera Cláusula
    doc.setFont("Helvetica", "bold");
    doc.text("VIGÉSIMA PRIMERA: INSPECCIÓN", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    const textoVigesimaPrimera = "EL SOCIO tendrá el derecho de inspeccionar el estado del VEHÍCULO al menos una vez por semana durante la vigencia de este Contrato, con el único requisito de informar vía telefónica, electrónica, o por cualquier otro medio de comunicación que estime pertinente a EL CONDUCTOR.";
    const lineasVigesimaPrimera = doc.splitTextToSize(textoVigesimaPrimera, pageWidth);
    doc.text(lineasVigesimaPrimera, 10, posY + lineSpacing);
    posY += lineasVigesimaPrimera.length * lineSpacing + 10;

    // Vigésima Segunda Cláusula
    doc.setFont("Helvetica", "bold");
    doc.text("VIGÉSIMA SEGUNDA: DAÑOS AL VEHÍCULO POR CAUSAS IMPUTABLES AL CONDUCTOR", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    const textoVigesimaSegunda = "Si el VEHÍCULO destinado al NEGOCIO objeto de este Contrato sufriere un menoscabo por culpa o negligencia debidamente comprobada de EL CONDUCTOR, éste se obliga a cubrir el 100% de los gastos de reparación de los mismos; igualmente, en caso de manejar a exceso de velocidad, o bajo el efecto de alguna droga o alcohol, EL CONDUCTOR se obliga a cubrir el 100% de los daños ocasionados al VEHÍCULO; en los casos que aplique, será el 100% del deducible.";
    const lineasVigesimaSegunda = doc.splitTextToSize(textoVigesimaSegunda, pageWidth);
    doc.text(lineasVigesimaSegunda, 10, posY + lineSpacing);

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

export default GenerarP8;
