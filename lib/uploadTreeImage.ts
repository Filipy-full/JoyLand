// Utilitário para upload de imagem única para Supabase Storage
import { supabase } from '@/lib/supabase';

export async function uploadTreeImage(file: File, treeId: string): Promise<string | null> {
  if (!file || !treeId) return null;
  const fileExt = file.name.split('.').pop();
  const filePath = `${treeId}.${fileExt}`;
  const { error } = await supabase.storage.from('galeria').upload(filePath, file, {
    upsert: true,
    contentType: file.type,
  });
  if (error) {
    // ...existing code...
    return null;
  }
  // URL pública
  const { data: publicUrl } = supabase.storage.from('galeria').getPublicUrl(filePath);
  return publicUrl?.publicUrl || null;
}
