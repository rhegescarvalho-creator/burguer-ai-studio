# 🗄️ Estrutura de Armazenamento (Storage) - BurgerAI Studio

Estrutura padronizada de diretórios para organização e persistência de arquivos, imagens, vídeos, trilhas sonoras e exportações.

```
storage/
├── images/
│   ├── uploaded/      # Imagens enviadas diretamente pelo usuário (JPG, PNG, WEBP, TIFF)
│   ├── generated/     # Imagens geradas via IA (GPT Image, DALL-E, etc.)
│   └── edited/        # Imagens aprimoradas pelo Editor Inteligente de Imagem (fundo removido, 4K, iluminação)
├── videos/
│   ├── uploaded/      # Vídeos enviados do computador (MP4, MOV, AVI, WEBM)
│   ├── generated/     # Vídeos gerados via IA (Veo, Kling, Runway)
│   └── edited/        # Vídeos pós-produzidos pelo Editor de Vídeo (cortes, legendas, overlays, slow motion)
├── logos/             # Logotipos e marcas vetorizadas das hamburguerias
├── templates/          # Templates de layouts, cardápios e artes promocionais
├── backgrounds/        # Texturas de fundo (Madeira rústica, estúdio dark, chapa, neon)
├── music/              # Trilhas sonoras gastronômicas e efeitos de áudio (Rock Sizzle, Lo-Fi, Lounge)
├── icons/              # Ícones e selos de qualidade (Artesanal, Angus, Smash, Hot)
├── qr/                 # QR Codes dinâmicos gerados para pedidos no WhatsApp e mesas
└── exports/            # Renderizações finais para TV Signage 4K, Feed Instagram, Stories e Banners
```
