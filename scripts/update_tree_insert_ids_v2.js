const fs = require('fs');
const filePath = 'public/mapa/insert_trees.sql';
const outputPath = 'public/mapa/insert_trees_actualizado.sql';

const lines = fs.readFileSync(filePath, 'utf8').split('\n');
let count = 1;
const updated = lines.map(line => {
  // Substitui qualquer valor de id por treeXXX
  return line.replace(/VALUES \(([^,]+),/, `VALUES ('tree${String(count).padStart(3, '0')}',`);
  if (/VALUES \(/.test(line)) count++;
});
fs.writeFileSync(outputPath, updated.join('\n'));
console.log('Archivo actualizado:', outputPath);
