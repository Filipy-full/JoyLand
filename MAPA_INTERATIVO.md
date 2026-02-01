# 🗺️ Mapa Interativo de Árvores - Documentação

## Visão Geral

Implementamos um sistema completo de mapa interativo com GeoJSON que permite aos usuários:

- 🌍 Visualizar todas as árvores no mapa
- 🎯 Selecionar árvores individuais
- 💙 Diferenciar entre árvores (Oliveiras em azul, Almendras em vermelho)
- 📍 Ver detalhes específicos de cada árvore
- 🛒 Adotar árvores disponíveis

## Estrutura de Arquivos

### Componentes Criados/Modificados

1. **`/components/InteractiveGeoJsonMap.tsx`**
   - Componente principal do mapa
   - Usa Leaflet para renderização
   - Carrega dados do GeoJSON
   - Exibe painel lateral com detalhes da árvore selecionada

2. **`/components/map-styles.css`**
   - Estilos customizados para o mapa
   - Animações e hover effects
   - Layout responsivo

3. **`/public/geojson-map.json`**
   - Arquivo GeoJSON com todas as árvores
   - Contém coordenadas, espécie, ano, zona
   - Suporta diferentes tipos de geometria (Point, Polygon, LineString)

### Páginas Criadas

1. **`/app/adopt/map/page.tsx`**
   - Página principal do mapa interativo
   - Renderização dinâmica com suspense
   - Carregamento assíncrono

2. **`/app/adopt/map/[id]/page.tsx`**
   - Página de detalhes da árvore
   - Mostra informações completas
   - Diferencia entre árvores adotadas e disponíveis
   - Links para adoção

3. **`/app/adopt/map/[id]/checkout/page.tsx`**
   - Página de finalização de adoção
   - Resumo da árvore e preço
   - Integração com formulário de pagamento
   - Segurança com Stripe

## Cores e Identificação

- **Azul (#1976d2)**: Oliveiras (Zona Norte, 2019)
- **Vermelho (#d32f2f)**: Almendras (Zona Sul, 2018)

## Funcionalidades

### Mapa Interativo
```
┌─────────────────────────────────────────┐
│        MAPA COM LEAFLET                 │ Painel
│  - Zoom/Pan                             │ Lateral
│  - Marcadores coloridos                 │ (Detalhes)
│  - Popups ao hover                      │
│  - Controles de zoom                    │
└─────────────────────────────────────────┘
```

### Fluxo de Adoção

```
Mapa → Clica em Árvore → Detalhes → Adotar → Checkout → Pagamento
                            ↓
                    (Se já adotada)
                    Dados públicos
```

### Dados Exibidos

- ID da árvore
- Espécie (Oliveira/Almendras)
- Ano de plantio
- Zona (Norte/Sul)
- Coordenadas GPS
- Status de adoção
- Preço (Oliveira: €120, Almendras: €100)

## Dependências

```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^5.0.0",
  "@types/leaflet": "^1.9.21"
}
```

## Como Usar

### Visualizar o Mapa
```bash
npm run dev
# Acesse /adopt/map
```

### Adicionar/Modificar Árvores

Edite `/public/geojson-map.json`:

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [longitude, latitude]
  },
  "properties": {
    "name": "número",
    "type": "tree",
    "species": "Oliveira ou Almendras",
    "year": 2019,
    "area": "Norte ou Sul",
    "adopted": false
  }
}
```

## Exemplo de Árvore Adoptada

Para marcar uma árvore como adotada, adicione `"adopted": true` nas propriedades:

```json
"properties": {
  "name": "14",
  "type": "tree",
  "species": "Almendras",
  "year": 2018,
  "area": "Sul",
  "adopted": true  // ← Marca como adotada
}
```

## Responsividade

O mapa e painel lateral são totalmente responsivos:
- Desktop: Mapa + Painel lateral
- Tablet/Mobile: Stack vertical (com breakpoints)

## Performance

- Carregamento lazy dos componentes
- Suspense para transições suaves
- GeoJSON otimizado com apenas dados necessários
- Marcadores lightweight com divIcon customizado

## Segurança

- Dados públicos para árvores adotadas
- Página de checkout com Stripe
- Validação de dados no cliente e servidor
- CSRF protection automática do Next.js

## Próximos Passos

1. ✅ Conectar com banco de dados para estado de adoção
2. ✅ Adicionar busca/filtro de árvores
3. ✅ Implementar histórico de adoções
4. ✅ Gerar certificados em PDF
5. ✅ Notificações por email

## Solução de Problemas

### Mapa não carrega
- Verifique se `/public/geojson-map.json` existe
- Abra console do navegador para erros
- Certifique-se que as coordenadas são válidas [lon, lat]

### Marcadores não aparecem
- Verifique as coordenadas no GeoJSON
- Zoom adequado (sugerido 14-18)
- Verifique a cor no CSS

### Painel lateral cortado em mobile
- Verifi CSS media queries
- Teste com DevTools do navegador
