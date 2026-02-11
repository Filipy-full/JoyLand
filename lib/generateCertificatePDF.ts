import jsPDF from 'jspdf';

export interface CertificateData {
  certificate_code: string;
  tree_id: string;
  tree_name: string;
  tree_type: string;
  latitude: number;
  longitude: number;
  user_name: string;
  user_email: string;
  start_date: string;
  end_date: string;
  photo_url?: string;
  adoption_type?: string;
}

export function generateCertificatePDF(data: CertificateData): jsPDF {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(18);
  doc.text('TREE ADOPTION CERTIFICATE', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text('🌳 JoyLand Sanctuary 🌳', 105, 30, { align: 'center' });

  // Certificate details
  doc.setFontSize(11);
  doc.text(`Certificate: ${data.certificate_code}`, 20, 45);
  doc.text(`Adopter Name: ${data.user_name}`, 20, 55);
  doc.text(`Email: ${data.user_email}`, 20, 65);

  // Tree information
  doc.setFontSize(12);
  doc.text('ADOPTED TREE', 20, 80);
  doc.setFontSize(11);
  doc.text(`• Species: ${data.tree_type}`, 25, 90);
  doc.text(`• ID: ${data.tree_id}`, 25, 100);
  doc.text(`• Assigned Name: ${data.tree_name}`, 25, 110);
  doc.text(`• Location (Lat, Long): ${data.latitude}, ${data.longitude}`, 25, 120);

  // Adoption period
  doc.setFontSize(12);
  doc.text('ADOPTION PERIOD', 20, 135);
  doc.setFontSize(11);
  doc.text(`• From: ${data.start_date}`, 25, 145);
  doc.text(`• To: ${data.end_date}`, 25, 155);

  if (data.adoption_type) {
    doc.text(`Adoption Type: ${data.adoption_type}`, 20, 170);
  }

  // Optional photo
  if (data.photo_url) {
    // Can add image if provided in base64 or DataURL
    // doc.addImage(data.photo_url, 'JPEG', 140, 45, 50, 50);
  }

  // Formal footer
  doc.setFontSize(10);
  doc.text(
    'This certificate formally acknowledges the adoption of the tree described above and reflects the adopter’s commitment to environmental conservation and care.',
    20,
    190,
    { maxWidth: 170 }
  );

  return doc;
}
