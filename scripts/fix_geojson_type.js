// Script para adicionar "type": "tree" em cada properties do GeoJSON
const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, '../public/mapa/geojson-formatado.json')
const outputPath = path.join(__dirname, '../public/mapa/geojson-formatado-fixed.json')

const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))

data.features.forEach((feature) => {
  if (feature.properties && feature.properties.type !== 'tree') {
    feature.properties.type = 'tree'
  }
})

fs.writeFileSync(outputPath, JSON.stringify(data, null, 2))
console.log('Arquivo corrigido salvo em:', outputPath)
