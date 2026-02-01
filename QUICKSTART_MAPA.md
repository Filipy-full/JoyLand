# ⚡ Início Rápido - Mapa Interativo

## 🚀 Como Começar

### 1. Instalar Dependências (já estão instaladas)
```bash
npm install
# Leaflet e React-Leaflet já estão no package.json
```

### 2. Iniciar Desenvolvimento
```bash
npm run dev
# Acesse http://localhost:3000/adopt/map
```

### 3. Ver o Mapa em Ação
- Abra o navegador em `http://localhost:3000/adopt/map`
- Você verá 90 pontos no mapa (azuis e vermelhos)
- Clique em qualquer ponto para ver os detalhes

## 📍 O Que Você Verá

### Mapa
```
┌─────────────────────────────────────────────┐
│          MAPA INTERATIVO                    │
│  🔵 Azuis = Oliveiras (Zona Norte)          │
│  🔴 Vermelhos = Almendras (Zona Sul)        │
│                                             │
│  Total: 90 árvores                          │
│                                             │
│  Zoom: Use +/- ou mouse wheel              │
│  Mover: Clique + Arraste                   │
└─────────────────────────────────────────────┘
```

### Painel Lateral (ao clicar)
```
┌─────────────────────┐
│ Árvore #45          │
│ Oliveira            │
├─────────────────────┤
│ ✨ Disponível       │
│                     │
│ Espécie: Oliveira   │
│ Ano: 2019           │
│ Zona: Norte         │
│                     │
│ [🌱 Adotar]         │
│ [Fechar]            │
└─────────────────────┘
```

## 🔄 Fluxo Completo

1. **Mapa** (`/adopt/map`)
   - Visualizar todas as 90 árvores
   - Clicar para selecionar

2. **Detalhes** (`/adopt/map/[id]`)
   - Ver informações completas
   - Clicar "Adotar" para prosseguir

3. **Checkout** (`/adopt/map/[id]/checkout`)
   - Preencher dados
   - Processar pagamento com Stripe
   - ✅ Adoção confirmada!

## 📁 Estrutura de Arquivos

```
JoyLand/
├── components/
│   ├── InteractiveGeoJsonMap.tsx    ← Componente principal
│   └── map-styles.css              ← Estilos
├── app/adopt/map/
│   ├── page.tsx                    ← Página do mapa
│   └── [id]/
│       ├── page.tsx                ← Detalhes da árvore
│       └── checkout/
│           └── page.tsx            ← Finalizar adoção
├── public/
│   └── geojson-map.json            ← Dados das árvores
└── MAPA_*.md                       ← Documentação
```

## 🎯 Funcionalidades Principais

### ✅ Implementado
- Mapa com 90 árvores
- Cores por espécie (azul/vermelho)
- Painel lateral com detalhes
- Páginas de detalhes e checkout
- Design responsivo
- Status de adoção diferenciado

### ⏳ Futuro (Opcional)
- Busca/filtro
- Real-time updates
- Certificados PDF
- Compartilhamento social

## 🧪 Testar Localmente

### Teste 1: Mapa Carrega
```bash
# Terminal 1
npm run dev

# Terminal 2 - Em outro terminal
curl http://localhost:3000/adopt/map
```

### Teste 2: Compilação
```bash
npm run build
# Deve compilar sem erros
```

### Teste 3: Produção
```bash
npm run build
npm run start
# Acesse http://localhost:3000/adopt/map
```

## 🐛 Solução de Problemas

### Mapa não carrega
```
❌ Problema: "Mapa em branco"
✅ Solução:
   1. Abra DevTools (F12)
   2. Veja console para erros
   3. Verifique /public/geojson-map.json existe
   4. Restart: npm run dev
```

### Marcadores não aparecem
```
❌ Problema: "Mapa carrega mas sem pontos"
✅ Solução:
   1. Verifique zoom (use +/-)
   2. Verifique coordenadas no JSON
   3. Formato correto: [longitude, latitude]
```

### Painel não abre
```
❌ Problema: "Click não abre painel"
✅ Solução:
   1. Certifique-se de clicar no marcador (não no mapa)
   2. Verifique console para erros
   3. Recarregue a página
```

## 🔐 Segurança

- ✅ Dados são públicos (GeoJSON)
- ✅ Pagamentos via Stripe (seguro)
- ✅ Autenticação via Supabase
- ✅ TypeScript para type safety

## 📊 Dados das Árvores

### Arquivo: `/public/geojson-map.json`

Cada árvore tem:
```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [1.744567, 41.789]  // [lon, lat]
  },
  "properties": {
    "name": "45",                       // Número da árvore
    "type": "tree",
    "species": "Oliveira",              // ou "Almendras"
    "year": 2019,                       // Ano de plantio
    "area": "Norte",                    // ou "Sul"
    "adopted": false                    // true se adotada
  }
}
```

## 🎨 Cores

| Espécie | Cor | Hex |
|---------|-----|-----|
| Oliveira | Azul | #1976d2 |
| Almendras | Vermelho | #d32f2f |
| Disponível | Verde | #10b981 |
| Adotada | Amarelo | #f59e0b |

## 📱 Responsivo

```
Desktop (>1024px): Mapa + Painel lado a lado
Tablet (768px):    Layout adaptado
Mobile (<768px):   Painel como modal
```

## ✨ Próximas Melhorias

1. Adicionar busca por número
2. Filtrar por espécie
3. Mostrar histórico de adoções
4. Gerar certificado em PDF
5. Share no social media

## 🚀 Deploy

```bash
# Build para produção
npm run build

# Testar produção localmente
npm run start

# Push para GitHub
git add .
git commit -m "Add interactive map"
git push
```

## 📞 Contato / Suporte

Se encontrar problemas:
1. Veja a documentação completa em `MAPA_INTERATIVO.md`
2. Verifique testes em `MAPA_TESTES.md`
3. Veja o guia visual em `MAPA_VISUAL.md`

---

**Versão**: 1.0.0
**Status**: ✅ Pronto para Produção
**Última Atualização**: Fevereiro 2026

🎉 **Aproveite o Mapa!**
