// Script para transformar o GeoJSON de pontos para o novo formato solicitado
const fs = require('fs');
const crypto = require('crypto');
const inputPath = 'public/test/JoyLand_Arboles_limpio.geojson';
const outputPath = 'public/test/JoyLand_Arboles_limpio_formatado.json';

const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

const features = data.features.filter(f => f.geometry && f.geometry.type === 'Point').map(f => {
  const isOlive = f.properties.Species && f.properties.Species.toLowerCase().includes('olive');
  const species = isOlive ? 'Oliveira' : 'Almendras';
  const color = isOlive ? '388e3c' : '1976d2';
  const speciesLabel = isOlive ? 'Olive tree' : 'Almond tree';
  const name = f.properties.Name ? String(f.properties.Name) : '';
  const area = f.properties.Region ? String(f.properties.Region).replace(/<.*?>/g, '').trim() || 'North' : 'North';
  const year = 2024;
  const id = f.id || crypto.randomUUID();
  return {
    type: 'Feature',
    geometry: f.geometry,
    properties: {
      name,
      styleUrl: isOlive ? '#__managed_style_0C70DACDFA3D5B281636' : '#__managed_style_0019D07D063D3FCF246B',
      'fill-opacity': 0.25098039215686274,
      fill: '#ffffff',
      'stroke-opacity': 1,
      stroke: '#fbc02d',
      'stroke-width': 2.66667,
      'icon-scale': 0.75,
      'icon-offset': [64, 128],
      'icon-offset-units': ['pixels', 'insetPixels'],
      icon: `https://earth.google.com/earth/document/icon?color=${color}&id=2000&scale=4`,
      description: {
        '@type': 'html',
        value: `<p><b>Species:</b> ${speciesLabel}<br></p><div><b>Year:</b> xxx<br></div><div><b>Region:</b> ${area}<br></div>`
      },
      type: 'tree',
      species,
      year,
      area
    },
    id
  };
});

fs.writeFileSync(outputPath, JSON.stringify({ type: 'FeatureCollection', features }, null, 2));
console.log('Arquivo formatado salvo em', outputPath);
