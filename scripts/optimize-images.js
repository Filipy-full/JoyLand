// Script para otimizar imagens JPEG/PNG de uma pasta usando sharp
// Uso: node scripts/optimize-images.js

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';


const inputDir = path.join(__dirname, '../public');
const outputDir = path.join(__dirname, '../public-otimizado');

function optimizeImagesRecursively(currentInputDir, currentOutputDir) {
  if (!fs.existsSync(currentOutputDir)) fs.mkdirSync(currentOutputDir, { recursive: true });
  fs.readdirSync(currentInputDir).forEach(file => {
    const inputPath = path.join(currentInputDir, file);
    const outputPath = path.join(currentOutputDir, file);
    if (fs.statSync(inputPath).isDirectory()) {
      optimizeImagesRecursively(inputPath, outputPath);
    } else if (/\.(jpe?g)$/i.test(file)) {
      sharp(inputPath)
        .resize({ width: 1920, withoutEnlargement: true })
        .jpeg({ quality: 88, mozjpeg: true })
        .toFile(outputPath)
        .then(() => {})
        .catch(() => {})
    } else if (/\.(png)$/i.test(file)) {
      sharp(inputPath)
        .resize({ width: 1920, withoutEnlargement: true })
        .png({ compressionLevel: 9 })
        .toFile(outputPath)
        .then(() => {})
        .catch(() => {})
    }
  });
}

optimizeImagesRecursively(inputDir, outputDir);

// ...existing code...
