import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs/promises';

export interface CertificateFields {
  name: string;
  email: string;
  date: string;
  [key: string]: string;
}

export async function fillCertificatePDF(inputPath: string, outputPath: string, fields: CertificateFields) {
  // Leer el PDF existente
  const existingPdfBytes = await fs.readFile(inputPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Escribir en coordenadas fijas sobre el PDF (página 1)
  const page = pdfDoc.getPages()[0];
  // Usar los nombres de la tabla adoptions
  // Cargar fuente estándar oblique (cursiva)
  const font = await pdfDoc.embedFont('Times-Italic');
  // Sin inclinación, solo cursiva

  // Detectar color según el tipo de certificado
  let color;
  if (inputPath.toLowerCase().includes('olive')) {
    // Verde claro para olivas
    color = rgb(0.38, 0.62, 0.32); // #61a04f
  } else if (inputPath.toLowerCase().includes('almond')) {
    // Marrón neutro para almendras
    color = rgb(0.45, 0.32, 0.18); // #73522e
  } else {
    // Color por defecto
    color = rgb(0.4, 0.2, 0.05);
  }
  if (inputPath.toLowerCase().includes('almond')) {
    // Marrón claro para almond
      const almondColor = rgb(0.45, 0.28, 0.12); // #73481f marrom mais escuro
    page.drawText(fields['Chosen tree name'] || '', {
      x: 91,
      y: 153,
      size: 18,
      color: almondColor,
      font,
    });
    page.drawText(fields['Adopter'] || '', {
      x: 318,
      y: 153,
      size: 18,
      color: almondColor,
      font,
    });
    page.drawText(fields['year'] || '', {
      x: 245,
      y: 63,
      size: 18,
      color: almondColor,
      font,
    });
  } else if (inputPath.toLowerCase().includes('olive')) {
    page.drawText(fields['tree_name'] || '', {
      x: 91,
      y: 153,
      size: 18,
      color,
      font,
    });
    page.drawText(fields['user_name'] || '', {
      x: 318,
      y: 153,
      size: 18,
      color,
      font,
    });
    let year = '';
    if (fields['startDate']) {
      year = new Date(fields['startDate']).getFullYear().toString();
    } else if (fields['endDate']) {
      year = new Date(fields['endDate']).getFullYear().toString();
    } else if (fields['year']) {
      year = fields['year'];
    }
    page.drawText(year, {
      x: 230,
      y: 57,
      size: 18,
      color,
      font,
    });
  } else {
    // fallback padrão
    page.drawText(fields['tree_name'] || '', {
      x: 91,
      y: 153,
      size: 18,
      color,
      font,
    });
    page.drawText(fields['user_name'] || '', {
      x: 318,
      y: 153,
      size: 18,
      color,
      font,
    });
    let year = '';
    if (fields['startDate']) {
      year = new Date(fields['startDate']).getFullYear().toString();
    } else if (fields['endDate']) {
      year = new Date(fields['endDate']).getFullYear().toString();
    } else if (fields['year']) {
      year = fields['year'];
    }
    page.drawText(year, {
      x: 245,
      y: 63,
      size: 18,
      color,
      font,
    });
  }

  // Guardar el PDF resultante
  const pdfBytes = await pdfDoc.save();
  await fs.writeFile(outputPath, pdfBytes);
}

