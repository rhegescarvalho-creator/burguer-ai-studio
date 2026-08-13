# BurgerAI Studio - Monorepo Architecture

Comprehensive technical blueprint of the unified multi-agent campaign orchestration platform.

## Directory Structure

```
burger-ai-studio/
│
├── apps/
│   ├── dashboard/                 # Next.js Dashboard web UI (Port 3000)
│   ├── api/                       # Fastify Backend API
│   └── player/                    # Next.js TV Menu Board Player (Port 3001)
│
├── packages/
│   ├── database/                  # Prisma schema configurations & client generator
│   ├── ui/                        # Reusable React components & CSS styling tokens
│   ├── prompts/                   # LLM copywriting & photo prompts generation rules
│   ├── types/                     # Shared TypeScript schemas & definitions
│   ├── auth/                      # Shared Mock authentication helpers (mock JWT)
│   └── logger/                    # Shared structured console logging utility
│
├── agents/
│   ├── orchestrator/              # Polling agent manager coordinating tasks
│   ├── copywriter/                # Promotional copywriting generator agent
│   ├── designer/                  # Photo prompts compiler and visual designer agent
│   ├── image/                     # Midjourney v6/Stable Diffusion image generator
│   ├── video/                     # Storyboard to promotion video director agent
│   ├── tv/                        # TV digital Menu builder agent
│   ├── social/                    # Instagram grid mockup publisher agent
│   └── publisher/                 # Campaign metadata exporter & social poster agent
│
├── workflows/                     # Automated workflows (n8n configurations)
├── storage/                       # Campaign outputs, images, and videos assets storage
├── templates/                     # Media templates (tv, stories, banners)
└── docs/                          # Project architecture & user guide documentation
```

## System Flowchart & Core Components

```
                     BurgerAI Studio

                    Painel Administrativo
                             │
 ┌───────────────────────────┼───────────────────────────┐
 │                           │                           │
 ▼                           ▼                           ▼

 Produtos                Promoções                 Configurações

 │                           │                           │

 ▼                           ▼                           ▼

 IA Copywriter         Scheduler                 Usuários

 │

 ▼

 Food Designer

 │

 ▼

 Image Generator

 │

 ▼

 Video Generator

 │

 ▼

 TV Builder

 │

 ▼

 Social Builder

 │

 ▼

 Publisher
```

## Shared Packages

### 1. Database (`packages/database`)
Utilizes Prisma ORM with PostgreSQL backend database. Registers tables `Product`, `Promotion`, and `Media`.

### 2. Prompts (`packages/prompts`)
Encapsulates copywriting and photo prompts generation templates. Instructs LLMs to return strict JSON arrays matching user specifications.

### 3. Authentication (`packages/auth`)
Provides mock session verification utilities (`generateMockToken` and `verifyMockToken`) to coordinate secure requests across apps and internal agents.

### 4. Logger (`packages/logger`)
Standard logger module wrapper ensuring clean console outputs containing timestamps, levels, and source service headers.

## Visualizer Apps

- **Dashboard App (`apps/dashboard`)**: Campaign control console. Tracks running agents, allows catalog CRUD, active promotions manager, and previewing generated assets.
- **TV Player App (`apps/player`)**: Dedicated digital signage display client hosted under local domain [http://tv.burgerai.local](http://tv.burgerai.local). Cycles automatically through:
  1. **Slide 1: Logo** - Restaurant brand logo presentation.
  2. **Slide 2: Promoção** - Live campaign discount banners.
  3. **Slide 3: Hambúrguer** - Showcase of the primary featured burger (e.g. Smash Bacon).
  4. **Slide 4: Preço** - General card menu pricing (displaying Name, Price, and Ingredients).
  5. **Slide 5: Ingredientes** - Dedicated showcase of selected and fresh ingredients.
  6. **Slide 6: QR Code** - Dynamic scan target to place orders via WhatsApp.
  7. **Slide 7: Instagram** - Social media channel follow CTA screen and feed preview.
