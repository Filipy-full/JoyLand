// Script para migrar imagens de public/galeria para Supabase Storage e registrar na tabela gallery
// Requisitos: node, npm install @supabase/supabase-js dotenv, variáveis de ambiente SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = 'galeria'; // ajuste se o nome do bucket for diferente
const GALLERY_TABLE = 'gallery';
const LOCAL_DIR = path.join(__dirname, '..', 'public', 'galeria');

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env ou no ambiente');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function migrate() {
  // Checar se o bucket existe
  console.log(`Verificando existência do bucket '${BUCKET}'...`);
  const bucketsResponse = await supabase.storage.listBuckets();
  console.log('Resposta bruta de listBuckets:', JSON.stringify(bucketsResponse, null, 2));
  const { data: buckets, error: bucketError } = bucketsResponse;
  if (bucketError) {
    console.error('Erro ao listar buckets:', bucketError.message);
    process.exit(1);
  }
  if (!buckets || !Array.isArray(buckets) || buckets.length === 0) {
    console.error('Nenhum bucket encontrado no Supabase Storage!');
    process.exit(1);
  }
  const bucketExists = buckets.some(b => b.name === BUCKET);
  if (!bucketExists) {
    console.error(`Bucket '${BUCKET}' não existe! Crie o bucket no painel do Supabase antes de rodar o script.`);
    process.exit(1);
  }

  const files = fs.readdirSync(LOCAL_DIR).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
  if (files.length === 0) {
    console.log('Nenhum arquivo de imagem encontrado para migrar.');
    return;
  }
  console.log(`Encontrados ${files.length} arquivos para migrar.`);

  for (let i = 0; i < files.length; i++) {
    const filename = files[i];
    const filepath = path.join(LOCAL_DIR, filename);
    console.log(`[${i+1}/${files.length}] Processando: ${filename}`);
    let fileBuffer;
    try {
      fileBuffer = fs.readFileSync(filepath);
    } catch (err) {
      console.error(`Erro ao ler o arquivo ${filename}:`, err.message);
      continue;
    }
    const storagePath = filename; // pode customizar se quiser subpastas

    // 1. Upload para o Storage
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(storagePath, fileBuffer, {
      upsert: true,
      contentType: 'image/jpeg', // ajuste se necessário
    });
    if (uploadError) {
      console.error(`Erro ao subir ${filename}:`, uploadError.message);
      continue;
    }
    console.log(`Upload de ${filename} concluído.`);

    // 2. Montar URL pública
    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
    if (!publicUrl) {
      console.error(`Erro ao obter URL pública de ${filename}`);
      continue;
    }

    // 3. Inserir registro na tabela gallery
    const { error: insertError } = await supabase.from(GALLERY_TABLE).insert({
      url: publicUrl,
      order: i + 1,
      created_at: new Date().toISOString(),
    });
    if (insertError) {
      console.error(`Erro ao inserir registro de ${filename}:`, insertError.message);
      continue;
    }
    console.log(`Registro de ${filename} inserido na tabela gallery.`);
  }
  console.log('Migração concluída.');
}

migrate();

