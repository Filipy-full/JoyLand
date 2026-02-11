import { NextRequest, NextResponse } from 'next/server';
import { generateCertificatePDF } from '@/lib/generateCertificatePDF';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Gera PDF do certificado para um adoption_id
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const adoptionId = searchParams.get('adoption_id');
  if (!adoptionId) {
    return NextResponse.json({ error: 'Missing adoption_id' }, { status: 400 });
  }


  // Busca dados da adoção e árvore
  let adoption, error;
  try {
    const result = await supabaseAdmin
      .from('adoptions')
      .select(`*, tree:trees(*)`)
      .eq('id', adoptionId)
      .single();
    adoption = result.data;
    error = result.error;
    if (!adoption) {
      console.error('Adoption not found:', adoptionId, result);
    }
    if (error) {
      console.error('Supabase error:', error.message, error.details, error.hint);
    }
  } catch (err) {
    console.error('Exception querying adoption:', err);
    return NextResponse.json({ error: 'Exception querying adoption: ' + String(err) }, { status: 500 });
  }

  if (error || !adoption) {
    return NextResponse.json({ error: error?.message || 'Adoption not found' }, { status: 404 });
  }

  // Monta dados para o PDF
  const certData = {
    certificate_code: adoption.certificate_code,
    tree_id: adoption.tree_id,
    tree_name: adoption.tree_name || adoption.tree?.name || '',
    tree_type: adoption.tree?.type || '',
    latitude: adoption.tree?.latitude || 0,
    longitude: adoption.tree?.longitude || 0,
    user_name: adoption.user_name || '',
    user_email: adoption.user_email || '',
    start_date: adoption.start_date,
    end_date: adoption.end_date,
    photo_url: adoption.tree?.images?.[0] || undefined,
    adoption_type: adoption.type || undefined,
  };

  const doc = generateCertificatePDF(certData);
  const pdf = doc.output('arraybuffer');

  return new NextResponse(Buffer.from(pdf), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="certificate-${adoption.certificate_code}.pdf"`,
    },
  });
}
