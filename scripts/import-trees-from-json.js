// Script to import trees from public/mapa/mapa-main.json into the database using Prisma

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const jsonPath = path.join(__dirname, '../public/mapa/mapa-main.json');
  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const data = JSON.parse(raw);
  const features = data.features || [];

  for (const feature of features) {
    const id = feature.id;
    const props = feature.properties || {};
    const coords = feature.geometry?.coordinates || [];
    // Map JSON fields to DB fields
    const tree = {
      id: id,
      name: props.name ? String(props.name) : null,
      type: (props.species || props.type || '').toLowerCase(),
      status: 'available',
      description: typeof props.description === 'string' ? props.description : (props.description?.value || null),
      latitude: coords[1],
      longitude: coords[0],
      year: props.year || null,
      area: props.area || null,
    };
    // Upsert to avoid duplicates
    await prisma.tree.upsert({
      where: { id: tree.id },
      update: tree,
      create: tree,
    });
    console.log('Upserted tree:', tree.id);
  }
  console.log('✅ Import completed!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
