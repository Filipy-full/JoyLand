// Utilitário para upload de imagem única para Supabase Storage
import { supabase } from '@/lib/supabase';

export async function uploadTreeImage(file: File, treeId: string): Promise<string | null> {
  if (!file || !treeId) return null;
  const fileExt = file.name.split('.').pop();
  const filePath = `trees/${treeId}.${fileExt}`;
  const { data, error } = await supabase.storage.from('tree-images').upload(filePath, file, {
    upsert: true,
    contentType: file.type,
  });
  if (error) return null;
  // URL pública
  const { data: publicUrl } = supabase.storage.from('tree-images').getPublicUrl(filePath);
  return publicUrl?.publicUrl || null;
}
