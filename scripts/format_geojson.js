
// Script para atualizar propiedades de un GeoJSON usando una plantilla de estilos
// Compatible con Node.js y navegador

/**
 * Actualiza las propiedades de los features de un GeoJSON usando una plantilla de estilos.
 * @param {Object} geojsonOriginal - GeoJSON a modificar
 * @param {Object} geojsonPlantilla - GeoJSON plantilla con estilos por tipo de geometría
 * @returns {Object} Nuevo GeoJSON con propiedades actualizadas
 */
function actualizarGeoJSON(geojsonOriginal, geojsonPlantilla) {
  // Buscar estilos por tipo de geometría en la plantilla
  const estilos = {
    Point: null,
    LineString: null,
    Polygon: null
  };

  geojsonPlantilla.features.forEach(f => {
    const tipo = f.geometry.type;
    if (!estilos[tipo]) {
      estilos[tipo] = f.properties;
    }
  });

  function copiarPropertiesAntiguo(propsAntiguo, featureOriginal) {
    if (propsAntiguo) return JSON.parse(JSON.stringify(propsAntiguo));
    // Formato fijo según ejemplo, diferenciando olivas y almendras
    const isAlmendra = featureOriginal.geometry.type === 'Point';
    return {
      description: {
        '@type': 'html',
        value: isAlmendra
          ? '<p><b>Species:</b> Almond tree<br></p><div><b>Year:</b> 2024<br></div><div><b>Region:</b> North<br></div>'
          : '<p><b>Species:</b> Olive tree<br></p><div><b>Year:</b> 2024<br></div><div><b>Region:</b> North<br></div>'
      },
      styleUrl: '#__managed_style_0C70DACDFA3D5B281636',
      'fill-opacity': 0.25098039215686274,
      fill: '#ffffff',
      'stroke-opacity': 1,
      stroke: '#fbc02d',
      'stroke-width': 2.66667,
      'icon-scale': 0.75,
      'icon-offset': [64, 128],
      'icon-offset-units': ['pixels', 'insetPixels'],
      icon: isAlmendra
        ? 'https://earth.google.com/earth/document/icon?color=1976d2&id=2000&scale=4'
        : 'https://earth.google.com/earth/document/icon?color=388e3c&id=2000&scale=4',
      name: featureOriginal.properties && featureOriginal.properties.Name ? featureOriginal.properties.Name : null,
      type: 'tree',
      species: isAlmendra ? 'Almendras' : 'Oliveira',
      year: 2024,
      area: 'North'
    };
  }

  function copiarIdAntiguo(featureAntiguo, featureOriginal) {
    if (featureAntiguo && featureAntiguo.id) return featureAntiguo.id;
    // Si no hay id, generamos uno basado en tipo y coordenadas
    const coords = JSON.stringify(featureOriginal.geometry.coordinates);
    const tipo = featureOriginal.geometry.type;
    // Hash simple
    let hash = 0;
    for (let i = 0; i < coords.length; i++) {
      hash = ((hash << 5) - hash) + coords.charCodeAt(i);
      hash |= 0;
    }
    return (tipo + Math.abs(hash)).toUpperCase();
  }

  const nuevo = {
    ...geojsonOriginal,
    features: geojsonOriginal.features.map((f, idx) => {
      const plantillaFeature = geojsonPlantilla.features[idx];
      return {
        ...f,
        properties: copiarPropertiesAntiguo(plantillaFeature ? plantillaFeature.properties : null, f),
        id: copiarIdAntiguo(plantillaFeature, f)
      };
    })
  };
  return nuevo;
}

// Ejemplo de uso en Node.js:
// node format_geojson.js original.geojson plantilla.geojson actualizado.geojson
if (typeof require !== 'undefined' && require.main === module) {
  const fs = require('fs');
  const path = require('path');

  if (process.argv.length < 4) {
    console.log('Uso: node format_geojson.js <original.geojson> <plantilla.geojson> [salida.geojson]');
    process.exit(1);
  }

  const archivoOriginal = process.argv[2];
  const archivoPlantilla = process.argv[3];
  const archivoSalida = process.argv[4] || '/workspaces/JoyLand/public/mapa/geojson-formatado-fixed.json';

  const geojsonOriginal = JSON.parse(fs.readFileSync(archivoOriginal, 'utf8'));
  const geojsonPlantilla = JSON.parse(fs.readFileSync(archivoPlantilla, 'utf8'));

  const resultado = actualizarGeoJSON(geojsonOriginal, geojsonPlantilla);

  fs.writeFileSync(archivoSalida, JSON.stringify(resultado, null, 2));
  console.log(`GeoJSON actualizado guardado en: ${archivoSalida}`);
}

// Para uso en navegador:
// const resultado = actualizarGeoJSON(geojsonOriginal, geojsonPlantilla);
// console.log(JSON.stringify(resultado, null, 2));
