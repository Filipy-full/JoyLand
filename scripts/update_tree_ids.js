const fs = require('fs');
const filePath = 'public/mapa/mapa-main.json';
const outputPath = 'public/mapa/mapa-main-atualizado.json';

const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
data.features.forEach((feature, idx) => {
  feature.id = `treeid${String(idx + 1).padStart(3, '0')}`;
});
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
console.log('Arquivo atualizado salvo em', outputPath);