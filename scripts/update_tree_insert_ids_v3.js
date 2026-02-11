const fs = require('fs');
const filePath = 'public/mapa/insert_trees.sql';
const outputPath = 'public/mapa/insert_trees_actualizado.sql';

const lines = fs.readFileSync(filePath, 'utf8').split('\n');
let count = 1;
const updated = [];
for (let i = 0; i < lines.length; i++) {
  if (/INSERT INTO trees \(id, name, type, latitude, longitude, year, status, orientation\) VALUES \(/.test(lines[i])) {
    // Substitui o próximo valor de id
    updated.push(lines[i]);
    i++;
    updated.push(`      'tree${String(count).padStart(3, '0')}',`);
    count++;
  } else {
    updated.push(lines[i]);
  }
}
fs.writeFileSync(outputPath, updated.join('\n'));
console.log('Archivo actualizado:', outputPath);
