// Script para subir imágenes locales al bucket 'galeria' de Supabase y registrar en la tabla 'gallery'.
// Requisitos: node-fetch, @supabase/supabase-js, fs, path, dotenv
// Instala dependencias: npm install @supabase/supabase-js node-fetch dotenv

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const BUCKET = 'galeria';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Faltan variables SUPABASE_URL o SUPABASE_KEY en .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Carpeta local donde están las imágenes
const LOCAL_FOLDER = path.join(__dirname, '../public/galeria');

// Orden de las imágenes (ajusta según tu gallery-order.json)
const orderArray = ['img2.jpeg', 'img.jpeg', 'img3.jpeg', 'img4.jpeg'];

async function uploadAndRegister() {
  for (let i = 0; i < orderArray.length; i++) {
    const fileName = orderArray[i];
    const filePath = path.join(LOCAL_FOLDER, fileName);
    const fileBuffer = fs.readFileSync(filePath);
    // Sube la imagen al bucket
    const { error } = await supabase.storage.from(BUCKET).upload(fileName, fileBuffer, {
      contentType: 'image/jpeg',
      upsert: true,
    });
    if (error) {
      console.error(`Error subiendo ${fileName}:`, error.message);
      continue;
    }
    // Obtiene la URL pública
    const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
    // Inserta en la tabla gallery
    const { error: dbError } = await supabase.from('gallery').insert({
      url: publicUrlData.publicUrl,
      order: i + 1,
      created_at: new Date().toISOString(),
    });
    if (dbError) {
      console.error(`Error insertando en gallery para ${fileName}:`, dbError.message);
    } else {
      console.log(`Imagen ${fileName} subida y registrada correctamente.`);
    }
  }
}

uploadAndRegister();
