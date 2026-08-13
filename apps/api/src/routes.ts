import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '@burger-ai/database';
import { CampaignStatus } from '@burger-ai/types';

let activeSettings = {
  activeClientId: 'client-1',
  activeTheme: 'tv-01',
  slideDuration: '7s',
  activeClientConfig: {
    name: 'Smash & Co.',
    tagline: 'Hambúrgueres Artesanais Grelhados na Brasa',
    logoIcon: '🍔',
    logoUrl: '',
    primaryColor: '#FF5A1F',
    secondaryColor: '#FFB703',
    fontFamily: "'Outfit', sans-serif",
    instagramHandle: '@smash_co',
    whatsappNumber: '(11) 99999-8888',
    qrCodeUrl: 'https://wa.me/5511999998888'
  },
  // TV Studio specifications
  activeTvId: 'tv-salao',
  activeMusic: 'Rock',
  adIntervalMinutes: 30,
  adPartnerName: 'Coca-Cola',
  adDurationSeconds: 30,
  activeTurno: 'almoco',
  playlists: {
    'tv-caixa': [
      { id: 'c-1', name: 'Smash Bacon', type: 'video', duration: 10, transition: 'fade', showPrice: true, showIngredients: true, showQr: true, themeColor: '#050508', fontFamily: 'Bebas Neue', mediaUrl: '/video.mp4' },
      { id: 'c-2', name: 'Combo Terça Double Smash', type: 'image', duration: 8, transition: 'fade', showPrice: true, showIngredients: false, showQr: true, themeColor: '#1C120C', fontFamily: 'Outfit', mediaUrl: '/foto.png' }
    ],
    'tv-salao': [
      { id: 's-1', name: 'Smash Bacon', type: 'video', duration: 10, transition: 'fade', showPrice: true, showIngredients: true, showQr: true, themeColor: '#050508', fontFamily: 'Bebas Neue', mediaUrl: '/video.mp4' },
      { id: 's-2', name: 'Batata Volcano', type: 'image', duration: 7, transition: 'slide', showPrice: true, showIngredients: true, showQr: false, themeColor: '#121216', fontFamily: 'Outfit', mediaUrl: '/batata.png' },
      { id: 's-3', name: 'Milk Shake', type: 'video', duration: 12, transition: 'fade', showPrice: true, showIngredients: false, showQr: false, themeColor: '#050508', fontFamily: 'Outfit', mediaUrl: '/video.mp4' },
      { id: 's-4', name: 'Combo Terça Double Smash', type: 'image', duration: 8, transition: 'fade', showPrice: true, showIngredients: false, showQr: true, themeColor: '#1C120C', fontFamily: 'Outfit', mediaUrl: '/foto.png' }
    ],
    'tv-delivery': [
      { id: 'd-1', name: 'Batata Volcano', type: 'image', duration: 7, transition: 'slide', showPrice: true, showIngredients: true, showQr: true, themeColor: '#121216', fontFamily: 'Outfit', mediaUrl: '/batata.png' }
    ],
    'tv-drive': [
      { id: 'dr-1', name: 'Smash Bacon', type: 'video', duration: 10, transition: 'fade', showPrice: true, showIngredients: true, showQr: true, themeColor: '#050508', fontFamily: 'Bebas Neue', mediaUrl: '/video.mp4' }
    ],
    'tv-outdoor': [
      { id: 'o-1', name: 'Combo Terça Double Smash', type: 'image', duration: 8, transition: 'fade', showPrice: true, showIngredients: false, showQr: true, themeColor: '#1C120C', fontFamily: 'Outfit', mediaUrl: '/foto.png' }
    ]
  },
  turnos: {
    cafe: { start: '08:00', playlistRef: 'tv-delivery' },
    almoco: { start: '11:00', playlistRef: 'tv-salao' },
    happyhour: { start: '18:00', playlistRef: 'tv-caixa' },
    delivery: { start: '22:00', playlistRef: 'tv-drive' }
  }
};

import { supabase } from '@burger-ai/database';

export async function registerRoutes(fastify: FastifyInstance) {
  // SETTINGS ENDPOINTS FOR TV/DASHBOARD CROSS-PORT SYNC & SUPABASE CLOUD
  fastify.get('/api/settings', async () => {
    try {
      const { data } = await supabase.from('tv_settings').select('*').eq('id', 'default').single();
      if (data && data.playlists) {
        activeSettings = {
          ...activeSettings,
          playlists: data.playlists,
          activeTvId: data.active_tv_id || activeSettings.activeTvId,
          activeMusic: data.active_music || activeSettings.activeMusic,
          activeTurno: data.active_turno || activeSettings.activeTurno,
          adIntervalMinutes: data.ad_interval_minutes || activeSettings.adIntervalMinutes,
          adPartnerName: data.ad_partner_name || activeSettings.adPartnerName,
          adDurationSeconds: data.ad_duration_seconds || activeSettings.adDurationSeconds
        };
      }
    } catch (e) {}
    return activeSettings;
  });

  fastify.post('/api/settings', async (request: FastifyRequest) => {
    const data = request.body as any;
    activeSettings = {
      ...activeSettings,
      ...data
    };
    try {
      await supabase.from('tv_settings').upsert({
        id: 'default',
        playlists: activeSettings.playlists,
        active_tv_id: activeSettings.activeTvId,
        active_music: activeSettings.activeMusic,
        active_turno: activeSettings.activeTurno,
        ad_interval_minutes: activeSettings.adIntervalMinutes,
        ad_partner_name: activeSettings.adPartnerName,
        ad_duration_seconds: activeSettings.adDurationSeconds,
        updated_at: new Date().toISOString()
      });
    } catch (e) {}
    return activeSettings;
  });
  // Healthcheck endpoint
  fastify.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Basic DB connection test
      await prisma.$queryRaw`SELECT 1`;
      return { status: 'ok', database: 'connected', timestamp: new Date() };
    } catch (error: any) {
      return reply.status(500).send({
        status: 'error',
        database: 'disconnected',
        error: error.message,
        timestamp: new Date(),
      });
    }
  });

  // RESTAURANTS
  fastify.get('/api/restaurants', async () => {
    return prisma.restaurant.findMany({
      orderBy: { createdAt: 'desc' },
    });
  });

  fastify.post('/api/restaurants', async (request: FastifyRequest, reply: FastifyReply) => {
    const { name, slug, logoUrl, primaryColor, secondaryColor } = request.body as {
      name: string;
      slug: string;
      logoUrl?: string;
      primaryColor?: string;
      secondaryColor?: string;
    };

    if (!name || !slug) {
      return reply.status(400).send({ error: 'Name and slug are required' });
    }

    try {
      const restaurant = await prisma.restaurant.create({
        data: { name, slug, logoUrl, primaryColor, secondaryColor },
      });
      return restaurant;
    } catch (error: any) {
      return reply.status(400).send({ error: 'Failed to create restaurant. Slug might already exist.' });
    }
  });

  // CAMPAIGNS
  fastify.get('/api/campaigns', async () => {
    return prisma.campaign.findMany({
      include: { restaurant: true, assets: true, tasks: true },
      orderBy: { createdAt: 'desc' },
    });
  });

  fastify.post('/api/campaigns', async (request: FastifyRequest, reply: FastifyReply) => {
    const { restaurantId, name, theme } = request.body as {
      restaurantId: string;
      name: string;
      theme: string;
    };

    if (!restaurantId || !name || !theme) {
      return reply.status(400).send({ error: 'restaurantId, name, and theme are required' });
    }

    try {
      const campaign = await prisma.campaign.create({
        data: {
          restaurantId,
          name,
          theme,
          status: 'DRAFT' as CampaignStatus,
        },
      });

      // Initialize the Orchestrator task
      await prisma.agentTask.create({
        data: {
          campaignId: campaign.id,
          agent: 'orchestrator',
          status: 'PENDING',
          input: JSON.stringify({ theme, campaignName: name }),
        },
      });

      return campaign;
    } catch (error: any) {
      return reply.status(500).send({ error: `Failed to create campaign: ${error.message}` });
    }
  });

  // PRODUCTS
  fastify.get('/api/products', async () => {
    try {
      const products = await prisma.product.findMany({
        include: { media: true, promotions: true },
        orderBy: { created_at: 'desc' },
      });
      return products.map(p => {
        let parsedIngredients: any = p.ingredientes;
        if (typeof p.ingredientes === 'string') {
          try {
            parsedIngredients = JSON.parse(p.ingredientes);
          } catch (e) {
            parsedIngredients = p.ingredientes.split(',').map(s => s.trim());
          }
        }
        return {
          ...p,
          preço: p.preco,
          descrição: p.descricao,
          ingredientes: parsedIngredients as any
        };
      });
    } catch (e: any) {
      return [];
    }
  });

  fastify.post('/api/products', async (request: FastifyRequest, reply: FastifyReply) => {
    const data = request.body as any;
    try {
      const product = await prisma.product.create({
        data: {
          nome: data.nome,
          slug: data.slug || data.nome.toLowerCase().replace(/\s+/g, '-'),
          categoria: data.categoria || 'Geral',
          preco: data.preço || data.preco || 0,
          descricao: data.descrição || data.descricao || '',
          ingredientes: JSON.stringify(data.ingredientes || []),
          ativo: data.ativo !== false,
          imagem: data.imagem || '/foto.png',
        },
      });
      return {
        ...product,
        ingredientes: typeof product.ingredientes === 'string' ? JSON.parse(product.ingredientes) : product.ingredientes
      };
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });

  fastify.put('/api/products/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const data = request.body as any;
    try {
      const product = await prisma.product.update({
        where: { id },
        data: {
          nome: data.nome,
          categoria: data.categoria,
          preco: data.preço || data.preco,
          descricao: data.descrição || data.descricao,
          ingredientes: data.ingredientes ? JSON.stringify(data.ingredientes) : undefined,
          ativo: data.ativo,
          imagem: data.imagem,
        },
      });
      return {
        ...product,
        ingredientes: typeof product.ingredientes === 'string' ? JSON.parse(product.ingredientes) : product.ingredientes
      };
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });

  fastify.delete('/api/products/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    try {
      await prisma.product.delete({ where: { id } });
      return { success: true };
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // PROMOTIONS
  fastify.get('/api/promotions', async () => {
    try {
      const promotions = await prisma.promotion.findMany({
        orderBy: { startDate: 'desc' },
      });
      return promotions;
    } catch (e: any) {
      return [];
    }
  });

  // TV SYNC HEALTH & BROADCAST
  fastify.get('/api/tv/sync', async () => {
    return {
      status: 'active',
      channel: 'burger_tv_stream',
      timestamp: new Date().toISOString(),
      resolution: '1080p',
    };
  });
}
// Trigger compiler restart
