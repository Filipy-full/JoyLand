# 🧪 Guia de Testes - Mapa Interativo

## ✅ Checklist de Testes

### 1️⃣ Mapa Carrega Corretamente

- [ ] Página `/adopt/map` carrega sem erros
- [ ] Leaflet map renderiza
- [ ] OpenStreetMap tiles carregam
- [ ] Zoom controls aparecem (+-botões)
- [ ] Legenda é visível (canto inferior esquerdo)
- [ ] Contador de árvores exibe "Total: 90"

### 2️⃣ Marcadores aparecem

- [ ] 90 marcadores são renderizados
- [ ] Marcadores azuis aparecem (Oliveiras)
- [ ] Marcadores vermelhos aparecem (Almendras)
- [ ] Cada marcador mostra número
- [ ] Distribuição geográfica está correta

### 3️⃣ Interação com Marcadores

- [ ] Popup aparece ao passar mouse sobre marcador
- [ ] Popup mostra: número, espécie, ano, zona
- [ ] Click em marcador abre painel lateral
- [ ] Diferentes árvores mostram dados corretos
- [ ] Painel fecha ao clicar X

### 4️⃣ Painel Lateral

- [ ] Abre ao lado direito em desktop
- [ ] Mostra título "Árvore #XX"
- [ ] Mostra cor correta (gradient azul ou vermelho)
- [ ] Exibe status correto (Disponível/Adotada)
- [ ] Mostra informações:
  - [ ] Espécie
  - [ ] Ano de plantio
  - [ ] Zona
  - [ ] Coordenadas GPS

### 5️⃣ Botões de Ação

#### Disponível
- [ ] Botão "🌱 Adotar" aparece
- [ ] Botão leva para `/adopt/map/[id]`
- [ ] Badge verde "✨ Disponível" mostra

#### Adotada
- [ ] Botão "🌱 Adotar" não aparece
- [ ] Badge amarelo "⚠️ Adotada" mostra
- [ ] Mensagem "Esta árvore já foi adotada" aparece

### 6️⃣ Página de Detalhes (`/adopt/map/[id]`)

- [ ] Carrega corretamente
- [ ] Título mostra "Árvore #XX"
- [ ] Header tem gradient correto
- [ ] Informações completas aparecem
- [ ] Status diferenciado:
  - [ ] Verde para disponível
  - [ ] Amarelo para adotada
- [ ] Preço exibido (€120 para Oliveira, €100 para Almendras)
- [ ] Links funcionam:
  - [ ] "Voltar ao Mapa"
  - [ ] "🌱 Adotar Esta Árvore" (se disponível)
  - [ ] "Ver Outras" (voltar ao mapa)

### 7️⃣ Página de Checkout (`/adopt/map/[id]/checkout`)

- [ ] Carrega com dados da árvore
- [ ] Resumo lateral mostra:
  - [ ] Nome e espécie
  - [ ] Preço correto
  - [ ] Include list (certificado, etc)
- [ ] Formulário CheckoutForm renderiza
- [ ] Payment processing funciona

### 8️⃣ Responsividade

#### Desktop (1024px+)
- [ ] Mapa + Painel lado a lado
- [ ] Painel 384px de largura
- [ ] Sem scroll desnecessário

#### Tablet (768px)
- [ ] Layout ajusta bem
- [ ] Painel ainda visível ou modal
- [ ] Mapa redimensiona

#### Mobile (< 768px)
- [ ] Mapa full width
- [ ] Painel como modal overlay
- [ ] Botões acessíveis
- [ ] Sem horizontal scroll
- [ ] Touch-friendly markers

### 9️⃣ Performance

- [ ] Mapa carrega < 3 segundos
- [ ] 90 marcadores renderizam suave
- [ ] Sem lag ao arrastar
- [ ] Zoom suave
- [ ] Painel abre sem delay

### 🔟 Casos Especiais

- [ ] Clicar em árvore adotada mostra dados públicos
- [ ] Clicar em área vazia fecha painel
- [ ] URL direta `/adopt/map/[invalid-id]` trata erro
- [ ] Browser back button funciona
- [ ] Refresh página mantém estado do mapa

## 🐛 Testes de Bug

### Mapa
- [ ] Múltiplos cliques não duplicam painel
- [ ] Zoom muito próximo não quebra
- [ ] Zoom muito afastado mostra todas árvores
- [ ] Pan não sai do mapa infinitamente

### Marcadores
- [ ] Números aparecem corretamente
- [ ] Cores não se misturam
- [ ] Tamanho consistente
- [ ] Não sobrepõem com texto ilegível

### Painel
- [ ] Fecha completamente
- [ ] Scroll interno funciona (muitas infos)
- [ ] Botões responsivos em mobile
- [ ] Sem cortes de texto

### Navegação
- [ ] Forward/Back buttons funcionam
- [ ] URL barra atualiza
- [ ] Histórico do browser funciona
- [ ] Sem redirect loops

## 🎨 Testes Visuais

- [ ] Cores coincidem com design:
  - [ ] Azul Oliveira: #1976d2
  - [ ] Vermelho Almendras: #d32f2f
  - [ ] Verde Disponível: #10b981
  - [ ] Amarelo Adotada: #f59e0b
- [ ] Fonte legível em todas cores
- [ ] Contraste WCAG AA+
- [ ] Spacing consistente
- [ ] Borders e shadows suaves

## 🌐 Testes Cross-Browser

### Chrome/Chromium
- [ ] Funciona normalmente
- [ ] Performance ok
- [ ] DevTools mostra sem warnings

### Firefox
- [ ] Mapa renderiza
- [ ] Marcadores visíveis
- [ ] Painel funciona

### Safari
- [ ] iOS: touch events funcionam
- [ ] macOS: mouse events funcionam

### Edge
- [ ] Compatibilidade total
- [ ] Sem issues específicas

## 🔐 Testes de Segurança

- [ ] Sem XSS em dados do GeoJSON
- [ ] Sem SQL injection (backend)
- [ ] HTTPS em produção
- [ ] Dados sensíveis mascarados
- [ ] CSRF tokens presentes

## 📊 Testes de Dados

- [ ] Todos 90 árvores carregam
- [ ] Coordenadas válidas [lon, lat]
- [ ] Sem dados duplicados
- [ ] Propriedades corretas:
  - [ ] name: string
  - [ ] species: "Oliveira" ou "Almendras"
  - [ ] year: número (2018-2019)
  - [ ] area: "Norte" ou "Sul"
  - [ ] adopted: boolean
- [ ] Sem árvores fora do mapa (outliers)

## ✨ Testes de UX

- [ ] Primeira vez fácil de entender
- [ ] Legenda clara
- [ ] Nenhum button confuso
- [ ] Feedback visual ao interagir
- [ ] Loading states visíveis
- [ ] Error messages claros
- [ ] Sem pontos mortos (dead zones)

## 📱 Teste em Dispositivos Reais

### Android
- [ ] [ ] Chrome mobile
- [ ] [ ] Firefox mobile
- [ ] [ ] Samsung Internet

### iOS
- [ ] [ ] Safari
- [ ] [ ] Chrome iOS

## 🚀 Testes de Produção

Antes de fazer deploy:

- [ ] Build sem warnings: `npm run build`
- [ ] TypeScript clean: `npx tsc --noEmit`
- [ ] Sem console.errors
- [ ] Analytics funcionando
- [ ] Tracking pixels corretos
- [ ] Meta tags corretas

## 📋 Resultado Final

```
┌─────────────────────────────────────────┐
│ RESUMO DE TESTES                        │
├─────────────────────────────────────────┤
│ ✅ Funcionalidades: X/X                 │
│ ✅ Responsividade: OK                   │
│ ✅ Performance: OK                      │
│ ✅ Segurança: OK                        │
│ ✅ Compatibilidade: OK                  │
│ ✅ UX: OK                               │
│                                         │
│ Status: ✅ PRONTO PARA PRODUÇÃO         │
└─────────────────────────────────────────┘
```

---

**Última Atualização**: Fevereiro 2026
**Responsável**: Tim de Desenvolvimento
