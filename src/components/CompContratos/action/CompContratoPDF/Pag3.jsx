export const GenerarP3 = (doc) => {
    doc.addPage();
    doc.setFont("Helvetica", "bold");
    const pageWidth = 170; // Ancho disponible en mm para el contenido
    const lineSpacing = 5; // Espaciado entre líneas
    doc.setFontSize(10);

    // Definiciones continuadas
    let posY = 20;
    doc.setFont("Helvetica", "normal");
    posY = agregarDeclaracionConTab("4. PLATAFORMA UBER.- Es una plataforma de tecnología que permite a los usuarios de aplicaciones móviles de UBER o páginas web de éste; organizar y planear el transporte y/o servicios de logística con terceros proveedores independientes de dichos servicios, incluidos terceros transportistas independientes y terceros proveedores logísticos independientes, conforme a un acuerdo con UBER o algunos afiliados de UBER.", posY, doc);
    posY = agregarDeclaracionConTab("5. LGSM.- Se refiere a la Ley General de Sociedades Mercantiles.", posY + 5, doc);

    // Título "CLÁUSULAS"
    posY += 15;
    doc.setFont("Helvetica", "bold");
    doc.text("C L Á U S U L A S", 80, posY);

    // Primera Cláusula
    posY += 10;
    doc.setFont("Helvetica", "bold");
    doc.text("PRIMERA: OBJETO", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 3;
    const textoPrimera = "Por el presente contrato, LAS PARTES acuerdan participar en un negocio de manera conjunta descrito en la cláusula siguiente bajo la modalidad de Asociación en Participación de acuerdo al Capítulo XIII de la LGSM.";
    const lineasPrimera = doc.splitTextToSize(textoPrimera, pageWidth);
    doc.text(lineasPrimera, 10, posY + lineSpacing);
    posY += lineasPrimera.length * lineSpacing + 10;

    // Segunda Cláusula
    doc.setFont("Helvetica", "bold");
    doc.text("SEGUNDA: NEGOCIO", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 3;
    const textoSegunda = "El negocio a desarrollarse por la asociación en participación consiste en brindar SERVICIOS DE RENTA DE VEHÍCULO CON CONDUCTOR, a través de la PLATAFORMA UBER y sus condiciones de servicios, en lo sucesivo “EL NEGOCIO”.";
    const lineasSegunda = doc.splitTextToSize(textoSegunda, pageWidth);
    doc.text(lineasSegunda, 10, posY + lineSpacing);
    posY += lineasSegunda.length * lineSpacing + 10;

    // Tercera Cláusula
    doc.setFont("Helvetica", "bold");
    doc.text("TERCERA: APORTACIÓN DEL SOCIO", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 3;
    const textoTercera = "En virtud de la cláusula anterior SOCIO pone a disposición de EL NEGOCIO lo siguiente:";
    const lineasTercera = doc.splitTextToSize(textoTercera, pageWidth);
    doc.text(lineasTercera, 10, posY + lineSpacing);
    posY += lineasTercera.length * lineSpacing + 5;

    // Sub-apartado de la tercera cláusula
    posY = agregarDeclaracionConTab("1. EL VEHÍCULO, el cual será en todo momento propiedad de EL SOCIO, de acuerdo con el artículo 257 de la LGSM.", posY, doc);

    // Cuarta Cláusula
    posY += 10;
    doc.setFont("Helvetica", "bold");
    doc.text("CUARTA: OBLIGACIONES DEL SOCIO", 10, posY);
    doc.setFont("Helvetica", "normal");
    posY += 5;
    const textoCuarta = "EL SOCIO, en virtud del Objeto de este Contrato, se obliga a:";
    const lineasCuarta = doc.splitTextToSize(textoCuarta, pageWidth);
    doc.text(lineasCuarta, 10, posY + lineSpacing);
    posY += lineasCuarta.length * lineSpacing + 5;

    // Sub-apartados de la cuarta cláusula
    posY = agregarDeclaracionConTab("1. Suscribir EL VEHÍCULO a la PLATAFORMA UBER, asegurándose de que cumpla en todo momento con los requerimientos establecidos por UBER.", posY, doc);
    posY = agregarDeclaracionConTab("2. Facilitar a EL CONDUCTOR el acceso a toda la documentación de EL VEHÍCULO que sea requerida para su circulación, proporcionándole la Tarjeta de Circulación, placas, engomados, verificaciones y cualquier otro documento que sea requerido por las autoridades competentes, para el desarrollo de EL NEGOCIO.", posY + 5, doc);
    posY = agregarDeclaracionConTab("3. Tener toda la documentación de EL VEHÍCULO en regla de acuerdo al Reglamento de Tránsito aplicable, incluyendo el pago de tenencia, verificaciones y de cualquier otra normativa que sea aplicable, según determinen las autoridades competentes.", posY + 5, doc);
    posY = agregarDeclaracionConTab("4. Contratar un Seguro de cobertura Amplia, con cobertura de Servicio Privado de Transporte de Personas, cuya cobertura por responsabilidad civil sea al menos por $3’000,000.00 (Tres Millones de Pesos 00/100 MXN) y la cobertura por gastos médicos de ocupantes de $220 000.00 (Doscientos veinte mil Pesos 00/100 MXN) como mínimo.", posY + 5, doc);
    posY = agregarDeclaracionConTab("5. Cumplir con todas las obligaciones a su cargo de acuerdo con el presente instrumento.", posY + 5, doc);
    posY = agregarDeclaracionConTab("6. Cumplir con todas las obligaciones a su cargo como socio, de acuerdo a las políticas de UBER.", posY + 5, doc);

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

export default GenerarP3;
