# Editor de Skins - GLA Wiki

Editor e simulador visual para criar e testar skins usando a predefinição `{{Skin}}` da GLA Wiki.

## Funcionalidades

- **Preview em Tempo Real**: Visualize como a skin ficará antes de usar na wiki
- **Importar Código**: Cole código da predefinição `{{Skin|...}}` e veja o preview
- **Exportar Código**: Gere o código formatado da predefinição
- **Configuração de Tile Isométrico**: Ajuste posição e deslocamento do piso isométrico

## Como Usar

1. Abra `index.html` no navegador
2. Preencha os campos da skin:
   - **Sprite**: Nome do arquivo da imagem do personagem
   - **Background**: Nome do arquivo do banner/fundo
   - **Nome**: Nome da skin
   - **Tooltip**: Descrição que aparece no hover
   - **YouTube**: ID ou URL do vídeo (opcional)
   - **Source**: Fonte da skin (opcional)
   - **Width/Height**: Dimensões do sprite (opcional)
3. Configure o tile isométrico:
   - **Tile**: Nome do arquivo da imagem do piso
   - **Posição X/Y**: Posição do tile em relação aos pés do personagem
   - **Deslocamento Horizontal**: Move sprite e tile juntos horizontalmente
4. Use o botão **"Gerar Código"** para obter o código da predefinição
5. Use o botão **"Importar"** para carregar código existente

## Parâmetros da Predefinição

A predefinição `{{Skin}}` aceita os seguintes parâmetros:

- `sprite` - Imagem do personagem (obrigatório)
- `background` - Imagem de fundo/banner
- `name` ou `nome` - Nome da skin
- `tooltip` - Descrição (suporta HTML básico)
- `youtube` - ID ou URL do YouTube
- `source` - Fonte da skin
- `w` ou `width` - Largura do sprite
- `h` ou `height` - Altura do sprite
- `tile` - Imagem do piso/tile isométrico
- `tile_x` - Posição X do tile (padrão: -25)
- `tile_y` - Posição Y do tile (padrão: -15)
- `offset_x` - Deslocamento horizontal (padrão: 0)

## Exemplo de Código

```
{{Skin|sprite=Zoro-sprite.png|name=Zoro - Padrão|tooltip=Skin padrão do Zoro|tile=testwiki2.png|tile_x=-25|tile_y=-15}}
```

## Notas

- As imagens devem estar no formato correto (PNG recomendado)
- O preview usa caminhos relativos - ajuste conforme necessário
- O tile isométrico tem inclinação fixa de 15 graus
- O sistema de hover usa detecção pixel-perfect (apenas pixels não-transparentes)

## Estrutura de Arquivos

```
skin-editor/
├── index.html      # Interface do editor
├── styles.css      # Estilos
├── script.js       # Lógica do editor
└── README.md       # Este arquivo
```

