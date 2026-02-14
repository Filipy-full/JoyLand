import fs from 'fs';
const filePath = 'public/mapa/insert_trees.sql';
const outputPath = 'public/mapa/insert_trees_actualizado.sql';

const lines = fs.readFileSync(filePath, 'utf8').split('\n');
let count = 1;
const updated = lines.map(line => {
  return line.replace(/'(treeid\d{3})'/, `'tree${String(count).padStart(3, '0')}'`);
  count++;
});
fs.writeFileSync(outputPath, updated.join('\n'));
console.log('Archivo actualizado:', outputPath);
