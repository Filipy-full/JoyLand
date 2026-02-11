import { NextRequest, NextResponse } from 'next/server';
import { generateCertificatePDF } from '@/lib/generateCertificatePDF';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendConfirmationEmail } from '@/lib/sendConfirmationEmail';
import { sendConfirmationEmailResend } from '@/lib/sendConfirmationEmailResend';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { adoptionId } = await req.json();
  if (!adoptionId) {
    return NextResponse.json({ error: 'Missing adoptionId' }, { status: 400 });
  }

  // Busca dados da adoção (apenas os campos da própria tabela)
  const { data: adoption, error } = await supabaseAdmin
    .from('adoptions')
    .select('*')
    .eq('id', adoptionId)
    .single();

  if (error || !adoption) {
    return NextResponse.json({ error: error?.message || 'Adoption not found' }, { status: 404 });
  }

  // Monta dados para o PDF usando apenas os campos locais
  const certData = {
    certificate_code: adoption.certificate_code,
    tree_id: adoption.tree_id,
    tree_name: adoption.tree_name || '',
    tree_type: adoption.tree_type || '',
    latitude: adoption.latitude || 0,
    longitude: adoption.longitude || 0,
    user_name: adoption.user_name || '',
    user_email: adoption.user_email || '',
    start_date: adoption.start_date,
    end_date: adoption.end_date,
    photo_url: adoption.photo_url || undefined,
    adoption_type: adoption.type || undefined,
  };

  // Gerar PDF
  const doc = generateCertificatePDF(certData);
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  const fileName = `certificates/${adoption.certificate_code}.pdf`;

  // Salvar no Supabase Storage
  const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
    .from('certificates')
    .upload(fileName, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  // Obter URL pública
  const { data: publicUrlData } = supabaseAdmin.storage.from('certificates').getPublicUrl(fileName);
  const publicUrl = publicUrlData?.publicUrl;

  // Atualizar registro da adoção
  await supabaseAdmin
    .from('adoptions')
    .update({ certificate_url: publicUrl })
    .eq('id', adoptionId);


  // Decide qual serviço de email usar
  let emailSent = false;
  if (process.env.RESEND_API_KEY) {
    emailSent = await sendConfirmationEmailResend({
      to: certData.user_email,
      userName: certData.user_name,
      treeName: certData.tree_name,
      startDate: certData.start_date,
      endDate: certData.end_date,
      attachmentUrl: publicUrl,
    });
  } else {
    emailSent = await sendConfirmationEmail({
      to: certData.user_email,
      userName: certData.user_name,
      treeName: certData.tree_name,
      startDate: certData.start_date,
      endDate: certData.end_date,
      attachmentUrl: publicUrl,
    });
  }

  return NextResponse.json({ success: true, url: publicUrl });
}
