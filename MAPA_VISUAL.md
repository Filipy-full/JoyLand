# 🗺️ Guia Visual - Mapa Interativo de Árvores

## 📱 Interface do Mapa

### Layout Desktop

```
┌───────────────────────────────────────────────────────────────────┐
│                    MAPA INTERATIVO DE ÁRVORES                     │
└───────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────┬────────────────────┐
│                                             │                    │
│          🗺️ LEAFLET MAP                     │  📋 PAINEL LATERAL │
│                                             │                    │
│  - Zoom Controls                            │  ┌────────────────┐│
│  - Pan/Drag                                 │  │ Árvore #14     ││
│  - Markers (Blue/Red)                       │  │ Almendras      ││
│  - OpenStreetMap Base                       │  └────────────────┘│
│  - Popups on Hover                          │                    │
│                                             │  Status: Disponível│
│  ┌─────────────────┐                        │                    │
│  │ Legenda         │                        │  Espécie: Almendras│
│  │ 🔵 Oliveira     │                        │  Ano: 2018         │
│  │ 🔴 Almendras    │                        │  Zona: Sul         │
│  │ Total: 90       │                        │                    │
│  └─────────────────┘                        │  [🌱 Adotar]       │
│                                             │  [Fechar]          │
└─────────────────────────────────────────────┴────────────────────┘
```

### Layout Mobile

```
┌─────────────────────────┐
│  MAPA INTERATIVO        │
├─────────────────────────┤
│                         │
│    🗺️ LEAFLET MAP      │
│                         │
│    (Full width)         │
│                         │
│  ┌─────────────────┐    │
│  │ Legenda:        │    │
│  │ 🔵🔴 Total: 90 │    │
│  └─────────────────┘    │
│                         │
│ [Mapa abaixo ou lateral]│
└─────────────────────────┘
   ↓ (ao clicar em árvore)
┌─────────────────────────┐
│ PAINEL - Árvore #45     │
├─────────────────────────┤
│ Oliveira                │
│ ─────────────────────   │
│ Ano: 2019      Zona: N  │
│ Lat: 41.789... 🗺️     │
│                         │
│ Status: ✅ Disponível   │
│                         │
│ [🌱 Adotar][Fechar]     │
└─────────────────────────┘
```

## 🎨 Cores e Simbologia

### Marcadores no Mapa

```
Oliveira                    Almendras
┌─────────────┐             ┌─────────────┐
│             │             │             │
│  ●●●●●●●●   │             │  ●●●●●●●●   │
│  ●●#NUM●●   │             │  ●●#NUM●●   │
│  ●●●●●●●●   │             │  ●●●●●●●●   │
│  ◔◔◔◔◔◔◔◔   │             │  ◔◔◔◔◔◔◔◔   │
│    (Azul)    │             │   (Vermelho)│
└─────────────┘             └─────────────┘
      #1976d2                    #d32f2f
   Zona Norte                 Zona Sul
```

### Status de Adoção

```
DISPONÍVEL                  ADOTADA
┌──────────────────┐        ┌──────────────────┐
│ ✨ Disponível    │        │ ⚠️ Já foi        │
│ para Adoção      │        │ Adotada          │
│                  │        │                  │
│ [🌱 Adotar]      │        │ Dados Públicos   │
└──────────────────┘        │                  │
      ✅ Verde              │ [Ver Detalhes]   │
                            └──────────────────┘
                                 ⚠️ Amarelo
```

## 🔄 Fluxo de Navegação

```
                    SITE PRINCIPAL
                          ↓
                    /adopt/map
                          ↓
                  ┌─────────────┐
                  │ Mapa Visual │ ← Seleciona árvore
                  │ com 90 Pts  │
                  └──────┬──────┘
                         ↓
        ┌────────────────────────────────┐
        │   Painel Lateral Aparece       │
        │ com Detalhes da Árvore         │
        └────────────────────────────────┘
                         ↓
            ┌────────────┴────────────┐
            ↓                         ↓
      [Disponível]              [Adotada]
            ↓                         ↓
    /adopt/map/[id]         Dados Públicos
            ↓                    (Leitura)
   Ver Detalhes Completos
            ↓
    [🌱 Adotar Esta Árvore]
            ↓
  /adopt/map/[id]/checkout
            ↓
    Preencher Formulário
            ↓
    Pagamento Stripe
            ↓
    ✅ Adoção Confirmada!
```

## 📊 Dados Exibidos em Cada Ponto

### Popup (Hover)

```
┌─────────────────────────┐
│ Árvore #23              │
│ Espécie: Oliveira       │
│ Ano: 2019               │
│ Zona: Norte             │
└─────────────────────────┘
```

### Painel Lateral

```
┌────────────────────────────┐
│ HEADER (Gradient)          │
│ ──────────────────────     │
│ 🔵 Árvore #45              │
│    Oliveira                │
├────────────────────────────┤
│ STATUS                     │
│ ✨ Disponível              │
├────────────────────────────┤
│ INFORMAÇÕES                │
│ Espécie: Oliveira          │
│ Ano: 2019                  │
│ Zona: Norte                │
│ Coord: 41.7892, 1.7446    │
├────────────────────────────┤
│ [🌱 Adotar] [Fechar]       │
└────────────────────────────┘
```

### Página de Detalhes

```
┌────────────────────────────────────┐
│ ← Voltar ao Mapa                   │
├────────────────────────────────────┤
│  HEADER                            │
│  Árvore #45                        │
│  Oliveira                          │
├────────────────────────────────────┤
│ ✨ Disponível para Adoção          │
│                                    │
│ INFORMAÇÕES GERAIS                 │
│ ─────────────────                  │
│ Espécie: Oliveira                  │
│ Ano: 2019                          │
│ Zona: Norte                        │
│ Status: ✅ Disponível              │
│                                    │
│ LOCALIZAÇÃO                        │
│ ─────────────────                  │
│ Coordenadas: 41.7892N, 1.7446E    │
│ Preço: €120                        │
│                                    │
│ SOBRE ESTA ÁRVORE                  │
│ ─────────────────                  │
│ Esta oliveira foi plantada em 2019 │
│ na zona Norte... [descrição]       │
│                                    │
│ [🌱 Adotar] [Ver Outras]           │
└────────────────────────────────────┘
```

## 🎯 Elementos Interativos

### Mapa
- **Zoom**: Mouse wheel ou botões +/−
- **Mover**: Click + Drag
- **Selecionar Árvore**: Click em marker
- **Ver Info**: Hover over marker (popup)
- **Fechar Panel**: Click X ou área vazia

### Painel Lateral
- **Status Badge**: Dinamicamente colorido
- **Botão Adotar**: Link para detalhes
- **Botão Fechar**: Fecha o painel
- **Link de Árvore**: Navegação fluida

## 📐 Dimensões

| Elemento | Desktop | Mobile |
|----------|---------|--------|
| Painel Lateral | 384px | Full width |
| Header Height | 128px | 96px |
| Marker Size | 24px | 20px |
| Font Size | 14px-16px | 12px-14px |

## 🎭 Estados Visuais

### Normal (Não Selecionado)
```
● Marker pequeno, opaco
```

### Hover
```
● Marker aumenta, tooltip aparece
```

### Selected (Clicado)
```
● Marker permanece destaca
● Painel lateral abre
```

### Adotada
```
🔴 Vermelho ou marca special
⚠️ Badge "Adotada"
```

## ♿ Acessibilidade

- ✅ Markers com labels
- ✅ Contraste de cores WCAG AA+
- ✅ Navegação por keyboard
- ✅ ARIA labels em botões
- ✅ Texto alternativo em imagens

## 🚀 Performance

| Métrica | Valor |
|---------|-------|
| FCP | < 2s |
| LCP | < 3s |
| CLS | < 0.1 |
| TTI | < 4s |
| Bundle Size | ~50KB |

---

**Versão**: 1.0.0
**Último Update**: Fevereiro 2026
