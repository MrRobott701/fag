import { logoBase64 } from "../../others/logoUBER.js";
import { FuenteRubik } from "../../others/FuenteRubik.js";

export const GenerarPortada = (doc) => {
         // Agregar la fuente Rubik en Base64
        doc.addFileToVFS("Rubik.ttf", FuenteRubik);
        doc.addFont("Rubik.ttf", "Rubik", "normal");
        doc.setFont("Rubik");
        doc.setFontSize(60);
        doc.text("CONTRATO UBER", 105, 50, { align: "center" });
        // Insertar imagen
        doc.addImage(logoBase64, "PNG", 50, 80, 100, 100); // Ajusta posición y tamaño: x=15, y=10, width=40, height=15
    };
export default GenerarPortada;