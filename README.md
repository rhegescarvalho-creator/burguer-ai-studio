# Burger AI Studio 🍔🤖

A Multi-Agent AI Monorepo designed to automate the generation of promotional materials, copywriting, images, videos, and TV menu boards for burger shops.

## Monorepo Layout

- `apps/`
  - `dashboard/`: Next.js web application for configuring campaigns, reviewing assets, and visualizing results.
  - `api/`: Fastify REST API for backend logic, file handling, and agent triggers.
- `packages/`
  - `database/`: Prisma ORM client and migrations mapping tables for restaurant data, generated assets, campaigns, etc.
  - `ui/`: React shared component library using Vanilla CSS / CSS Modules design system.
  - `prompts/`: Standardized system/user prompts for OpenAI, Anthropic, and Gemini LLMs.
  - `types/`: Common TypeScript interfaces and models shared across all apps, packages, and agents.
- `agents/`: Independent TypeScript sub-packages orchestrating AI pipelines:
  - `orchestrator`: Co-ordinates execution flows and handles callbacks.
  - `copywriter`: Generates delicious product naming, descriptions, and taglines.
  - `food-photographer`: Craft prompts specifically tailored for high-quality food visuals.
  - `image-generator`: Interfaces with image models (Midjourney, DALL-E, Stable Diffusion).
  - `video-director`: Handles storyboarding and generates short promos using video generators (Sora, Luma, Runway).
  - `tv-builder`: Assembles media into templates for digital TV boards in burger shops.
  - `social-media`: Handles feed/story layouts and scheduling templates.
  - `publisher`: Post content or exports final production formats.
- `storage/`: Directory structure for images, videos, temporary conversions, and completed assets.
- `templates/`: Base visual templates (HTML/JSON/Canvas/Video blueprints) for TV boards, Instagram posts, and banner layouts.
- `workflows/n8n/`: Low-code automation metadata directory.

---

## Getting Started

### Prerequisites
- Node.js (v24 or later)
- Docker & Docker Compose

### Setup Instructions

1. **Clone & Configure Environment Variables**:
   Copy the example environment file and edit values if needed.
   ```bash
   cp .env.example .env
   ```

2. **Start Docker Infrastructure (PostgreSQL, n8n)**:
   ```bash
   docker-compose up -d
   ```

3. **Install Dependencies**:
   Install all dependencies across the workspaces using standard `npm`:
   ```bash
   npm install
   ```

4. **Initialize Database**:
   Generates the Prisma client and applies structural migrations.
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. **Start Dev Servers**:
   Launch both Next.js and Fastify concurrently:
   ```bash
   npm run dev
   ```
