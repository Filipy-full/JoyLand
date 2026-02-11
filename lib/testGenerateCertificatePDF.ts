import { generateCertificatePDF, CertificateData } from './generateCertificatePDF';

const exampleData: CertificateData = {
  certificate_code: 'JOY-2026-3551',
  tree_id: 'tree_42',
  tree_name: 'Mi Oliva Especial',
  tree_type: 'Olivo',
  latitude: 41.789,
  longitude: 1.744,
  user_name: 'Juan García García',
  user_email: 'juan@example.com',
  start_date: '01/02/2026',
  end_date: '01/02/2027',
  photo_url: undefined, // Adicione uma URL base64 se quiser testar imagem
  adoption_type: 'Premium',
};

const doc = generateCertificatePDF(exampleData);
doc.save('certificado-joyland-ejemplo.pdf');
