'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@burger-ai/ui';
import { Product, Promotion, Media, ClientProjectConfig } from '@burger-ai/types';

const PLAYER_URL = process.env.NEXT_PUBLIC_PLAYER_URL || 'http://localhost:3002';

// Mock initial client profiles (Multi-Tenant)
const initialClients: ClientProjectConfig[] = [
  {
    id: 'client-1',
    name: 'Smash & Co.',
    slug: 'smash-co',
    tagline: 'Hambúrgueres Artesanais Grelhados na Brasa',
    logoIcon: '🍔',
    logoUrl: '',
    primaryColor: '#FF5A1F',
    secondaryColor: '#FFB703',
    themePreset: 'tv-01',
    fontFamily: "'Outfit', sans-serif",
    instagramHandle: '@smash_co_whatsapp',
    whatsappNumber: '(11) 99999-8888',
    qrCodeUrl: 'https://wa.me/5511999998888',
    createdAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'client-2',
    name: 'Cabana Burger',
    slug: 'cabana',
    tagline: 'Sabor 100% natural e suculento',
    logoIcon: '🏡',
    logoUrl: '',
    primaryColor: '#FFB703',
    secondaryColor: '#2EC4B6',
    themePreset: 'tv-premium',
    fontFamily: "'Playfair Display', serif",
    instagramHandle: '@cabanaburger',
    whatsappNumber: '(11) 97777-6666',
    qrCodeUrl: 'https://wa.me/5511977776666',
    createdAt: '2026-08-05T14:30:00Z'
  }
];

const initialRestaurants = [
  { id: '1', name: 'Smash & Co.', slug: 'smash-co', primaryColor: '#FF5A1F' },
  { id: '2', name: 'Cabana Burger', slug: 'cabana', primaryColor: '#FFB703' }
];


const initialCampaigns = [
  {
    id: 'c1',
    name: 'Cheddar Bacon Madness',
    theme: 'Explosão de Cheddar e Bacon Defumado Crocante',
    status: 'READY',
    createdAt: '2026-08-06T10:00:00Z',
    restaurant: 'Smash & Co.'
  },
  {
    id: 'c2',
    name: 'Monstrous Truffled Smash',
    theme: 'Hambúrguer com maionese trufada e cogumelos salteados',
    status: 'GENERATING',
    createdAt: '2026-08-07T08:30:00Z',
    restaurant: 'Cabana Burger'
  }
];

const mockAssets = [
  {
    id: 'a1',
    type: 'COPYWRITING',
    campaignId: 'c1',
    content: JSON.stringify({
      titulo: 'Smash Cheddar Volcano',
      headline: 'Uma erupção de sabor em cada mordida!',
      descricao: 'Dois blends smash de 90g grelhados na brasa, sob uma avalanche de cheddar cremoso derretido e tiras crocantes de bacon defumado em madeira de macieira.',
      cta: 'Garanta o seu com desconto exclusivo nas próximas 2 horas! Peça pelo app.',
      hashtags: ['BurgerLove', 'Foodie', 'Instafood', 'CheddarVolcano']
    }),
    createdAt: '2026-08-06T10:05:00Z'
  },
  {
    id: 'a2',
    type: 'IMAGE',
    campaignId: 'c1',
    url: '/foto.png',
    metadata: { prompt: 'Professional gourmet burger photography, Black background, Steam, Melted cheddar, Advertising, Ultra realistic, Studio lighting, 8K, Shallow depth of field' },
    createdAt: '2026-08-06T10:10:00Z'
  }
];

const mockTasks = [
  { agent: 'orchestrator', status: 'COMPLETED', time: '10:00 AM' },
  { agent: 'copywriter', status: 'COMPLETED', time: '10:01 AM' },
  { agent: 'food-photographer', status: 'COMPLETED', time: '10:02 AM' },
  { agent: 'image-generator', status: 'COMPLETED', time: '10:03 AM' },
  { agent: 'video-director', status: 'RUNNING', time: '10:04 AM' },
  { agent: 'tv-builder', status: 'PENDING', time: '-' },
  { agent: 'social-media', status: 'PENDING', time: '-' },
  { agent: 'publisher', status: 'PENDING', time: '-' }
];

// Seed initial products
const initialProducts: Product[] = [
  {
    id: 'p0',
    nome: 'Smash Bacon Especial',
    slug: 'smash-bacon-especial',
    categoria: 'Sanduiches',
    descrição: 'Hambúrguer smash suculento com pão de brioche amanteigado tostado, queijo cheddar derretido e tiras crocantes de bacon.',
    ingredientes: ['Pão Brioche', 'Cheddar', 'Bacon'],
    preço: 32.90,
    imagem: '/foto.png',
    ativo: true,
    created_at: new Date('2026-08-07T12:00:00Z')
  },
  {
    id: 'p1',
    nome: 'Smash Burger Clássico',
    slug: 'smash-burger-classico',
    categoria: 'Sanduiches',
    descrição: 'Blend smash 90g, queijo cheddar derretido, picles artesanal, cebola picada e molho da casa no pão brioche.',
    ingredientes: ['Blend 90g', 'Cheddar', 'Picles', 'Cebola', 'Molho Especial', 'Pão Brioche'],
    preço: 28.90,
    imagem: '/foto.png',
    ativo: true,
    created_at: new Date('2026-08-01T12:00:00Z')
  },
  {
    id: 'p2',
    nome: 'Hot Dog Especial Prensado',
    slug: 'hot-dog-especial-prensado',
    categoria: 'Hot Dog',
    descrição: 'Pão de hot dog macio prensado na chapa com 2 salsichas, purê de batata artesanal, vinagrete, batata palha e maionese especial.',
    ingredientes: ['Pão Especial', '2 Salsichas', 'Purê de Batata', 'Vinagrete', 'Batata Palha'],
    preço: 24.90,
    imagem: '/foto.png',
    ativo: true,
    created_at: new Date('2026-08-02T12:00:00Z')
  },
  {
    id: 'p3',
    nome: 'Porção Batata Rústica Cheddar & Bacon',
    slug: 'porcao-batata-rustica-cheddar-bacon',
    categoria: 'Porções',
    descrição: '500g de batatas rústicas fritas temperadas com páprica, cobertas por generosa camada de cheddar cremoso e cubos de bacon crocante.',
    ingredientes: ['Batatas Rústicas 500g', 'Cheddar Cremoso', 'Bacon em Cubos'],
    preço: 38.00,
    imagem: '/batata.png',
    ativo: true,
    created_at: new Date('2026-08-03T12:00:00Z')
  },
  {
    id: 'p4',
    nome: 'Pastel de Carne com Queijo',
    slug: 'pastel-carne-com-queijo',
    categoria: 'Pasteis',
    descrição: 'Pastel artesanal frito na hora, massa crocante e sequinha, recheado com carne moída temperada e queijo mussarela derretido.',
    ingredientes: ['Massa Artesanal', 'Carne Bovina Temperada', 'Mussarela'],
    preço: 16.00,
    imagem: '/foto.png',
    ativo: true,
    created_at: new Date('2026-08-04T12:00:00Z')
  },
  {
    id: 'p5',
    nome: 'Coxinha Cremosa de Frango com Catupiry',
    slug: 'coxinha-cremosa-frango-catupiry',
    categoria: 'Salgados',
    descrição: 'Massa leve e dourada com casquinha crocante, recheio generoso de frango desfiado com Catupiry original.',
    ingredientes: ['Massa de Batata', 'Frango Desfiado', 'Catupiry Original'],
    preço: 12.00,
    imagem: '/foto.png',
    ativo: true,
    created_at: new Date('2026-08-05T12:00:00Z')
  },
  {
    id: 'p6',
    nome: 'Coca-Cola Gelada 350ml',
    slug: 'coca-cola-gelada-350ml',
    categoria: 'Refrigerantes',
    descrição: 'Refrigerante Coca-Cola em lata 350ml servido trincando de gelado com fatia de limão.',
    ingredientes: ['Lata 350ml', 'Gelo', 'Limão'],
    preço: 7.50,
    imagem: '/foto.png',
    ativo: true,
    created_at: new Date('2026-08-06T12:00:00Z')
  },
  {
    id: 'p7',
    nome: 'Suco Natural de Laranja 500ml',
    slug: 'suco-natural-laranja-500ml',
    categoria: 'Sucos',
    descrição: 'Suco de laranja natural feito na hora com laranjas frescas selecionadas, 100% puro.',
    ingredientes: ['Laranja Fresca', 'Gelo'],
    preço: 11.90,
    imagem: '/foto.png',
    ativo: true,
    created_at: new Date('2026-08-07T12:00:00Z')
  },
  {
    id: 'p8',
    nome: 'Chopp Artesanal IPA 500ml',
    slug: 'chopp-artesanal-ipa-500ml',
    categoria: 'Bebidas Alcóolicas',
    descrição: 'Chopp artesanal estilo IPA com aroma cítrico e amargor equilibrado, servido gelado.',
    ingredientes: ['Chopp IPA 500ml', 'Malte & Lúpulo Selecionados'],
    preço: 18.90,
    imagem: '/foto.png',
    ativo: true,
    created_at: new Date('2026-08-07T12:00:00Z')
  }
];

const initialPromotions: Promotion[] = [
  {
    id: 'pr1',
    title: 'Combo Terça Double Smash',
    discount: 15.00, // R$15 de desconto
    startDate: new Date('2026-08-01T00:00:00Z'),
    endDate: new Date('2026-08-31T23:59:59Z')
  },
  {
    id: 'pr2',
    title: 'Festival Pastel & Chopp',
    discount: 10.00,
    startDate: new Date('2026-08-07T00:00:00Z'),
    endDate: new Date('2026-08-15T23:59:59Z')
  },
  {
    id: 'pr3',
    title: 'Happy Hour (Toda sexta - 18h às 22h)',
    discount: 20.00,
    startDate: new Date('2026-08-07T18:00:00Z'),
    endDate: new Date('2026-08-07T22:00:00Z')
  },
  {
    id: 'pr4',
    title: 'Combo Família (Sábado e Domingo)',
    discount: 30.00,
    startDate: new Date('2026-08-08T00:00:00Z'),
    endDate: new Date('2026-08-09T23:59:59Z')
  }
];

export interface LibraryMediaItem {
  id: string;
  name: string;
  category: 'sanduiches' | 'hot-dog' | 'porcoes' | 'pasteis' | 'salgados' | 'refrigerantes' | 'sucos' | 'bebidas-alcoolicas' | 'logos' | 'videos' | 'fundos' | 'icones';
  type: 'image' | 'video' | 'vector';
  format: 'JPG' | 'PNG' | 'WEBP' | 'TIFF' | 'MP4' | 'MOV' | 'AVI' | 'WEBM' | 'SVG';
  url: string;
  resolution: string;
  size: string;
  tags: string[];
  createdAt: string;
}

const initialLibraryCategories = [
  { id: 'sanduiches', name: 'Sanduiches', icon: '🍔', desc: 'Fotos e cortes de sanduíches, hambúrgueres e lanches' },
  { id: 'hot-dog', name: 'Hot Dog', icon: '🌭', desc: 'Hot dogs especiais, prensados e tradicionais' },
  { id: 'porcoes', name: 'Porções', icon: '🍟', desc: 'Batatas, anéis de cebola, petiscos e porções variadas' },
  { id: 'pasteis', name: 'Pasteis', icon: '🥟', desc: 'Pastéis fritos crocantes recheados na hora' },
  { id: 'salgados', name: 'Salgados', icon: '🥐', desc: 'Coxinhas, empadas, esfihas e salgados fritos e assados' },
  { id: 'refrigerantes', name: 'Refrigerantes', icon: '🥤', desc: 'Refrigerantes em lata, garrafa e opções zero açúcar' },
  { id: 'sucos', name: 'Sucos', icon: '🧃', desc: 'Sucos naturais da fruta, polpas e refrescos' },
  { id: 'bebidas-alcoolicas', name: 'Bebidas Alcóolicas', icon: '🍺', desc: 'Cervejas, chopps artesanais, drinks e destilados' },
  { id: 'logos', name: 'Logos', icon: '🏷️', desc: 'Logotipos vetoriais, marcas d’água e assinaturas visuais' },
  { id: 'videos', name: 'Vídeos', icon: '🎥', desc: 'Takes de chapa, preparo, vídeos para TV e reels' },
  { id: 'fundos', name: 'Fundos', icon: '🌄', desc: 'Texturas de madeira rústica, brasa, estúdio dark e neon' },
  { id: 'icones', name: 'Ícones', icon: '⚡', desc: 'Ícones de ingredientes, selos de qualidade e selos promocionais' },
];

const initialLibraryItems: LibraryMediaItem[] = [
  // Sanduiches
  {
    id: 'lib-hb-1',
    name: 'Smash Bacon Crocante Duplo Cheddar',
    category: 'sanduiches',
    type: 'image',
    format: 'WEBP',
    url: '/foto.png',
    resolution: '2048 x 2048',
    size: '1.2 MB',
    tags: ['smash', 'bacon', 'cheddar', 'queijo', 'crocante', 'artesanal', 'sanduiches'],
    createdAt: '2026-08-08'
  },
  {
    id: 'lib-hb-2',
    name: 'Smash Melt Cheddar Supremo com Cebola',
    category: 'sanduiches',
    type: 'image',
    format: 'WEBP',
    url: '/foto.png',
    resolution: '2048 x 2048',
    size: '1.4 MB',
    tags: ['smash', 'cheddar', 'melt', 'queijo', 'cremoso', 'cebola', 'sanduiches'],
    createdAt: '2026-08-08'
  },
  {
    id: 'lib-hb-3',
    name: 'Smash Clássico Pão Brioche 100g',
    category: 'sanduiches',
    type: 'image',
    format: 'WEBP',
    url: '/foto.png',
    resolution: '1920 x 1920',
    size: '1.1 MB',
    tags: ['smash', 'clássico', 'blend', 'pão brioche', 'artesanal', 'sanduiches'],
    createdAt: '2026-08-07'
  },
  {
    id: 'lib-hb-4',
    name: 'Smash Triplo Monster Carnudo 300g',
    category: 'sanduiches',
    type: 'image',
    format: 'JPG',
    url: '/foto.png',
    resolution: '2400 x 1800',
    size: '2.3 MB',
    tags: ['smash', 'triplo', 'monster', 'carne', 'suculento', 'sanduiches'],
    createdAt: '2026-08-07'
  },
  // Hot Dog
  {
    id: 'lib-hd-1',
    name: 'Hot Dog Especial Prensado Completo',
    category: 'hot-dog',
    type: 'image',
    format: 'WEBP',
    url: '/foto.png',
    resolution: '1920 x 1080',
    size: '1.5 MB',
    tags: ['hot dog', 'prensado', 'purê', 'lanche', 'completo'],
    createdAt: '2026-08-08'
  },
  {
    id: 'lib-hd-2',
    name: 'Hot Dog Bacon & Cheddar Gratinado',
    category: 'hot-dog',
    type: 'image',
    format: 'WEBP',
    url: '/foto.png',
    resolution: '2560 x 1440',
    size: '2.2 MB',
    tags: ['hot dog', 'bacon', 'cheddar', 'gratinado', 'especial'],
    createdAt: '2026-08-08'
  },
  // Porções
  {
    id: 'lib-bt-1',
    name: 'Porção Batata Rústica Cheddar & Bacon Crocante',
    category: 'porcoes',
    type: 'image',
    format: 'WEBP',
    url: '/batata.png',
    resolution: '1920 x 1920',
    size: '1.1 MB',
    tags: ['batata', 'cheddar', 'bacon', 'porção', 'rústica', 'queijo', 'porcoes'],
    createdAt: '2026-08-08'
  },
  {
    id: 'lib-bt-2',
    name: 'Porção Onion Rings Anéis de Cebola Crocantes',
    category: 'porcoes',
    type: 'image',
    format: 'JPG',
    url: '/batata.png',
    resolution: '1800 x 1800',
    size: '980 KB',
    tags: ['onion rings', 'cebola', 'empanada', 'crocante', 'aperitivo', 'porcoes'],
    createdAt: '2026-08-04'
  },
  // Pasteis
  {
    id: 'lib-pt-1',
    name: 'Pastel Especial de Carne com Queijo',
    category: 'pasteis',
    type: 'image',
    format: 'PNG',
    url: '/foto.png',
    resolution: '1080 x 1920',
    size: '1.7 MB',
    tags: ['pastel', 'carne', 'queijo', 'crocante', 'frito', 'pasteis'],
    createdAt: '2026-08-08'
  },
  {
    id: 'lib-pt-2',
    name: 'Pastel Gourmet de Palmito com Catupiry',
    category: 'pasteis',
    type: 'image',
    format: 'WEBP',
    url: '/foto.png',
    resolution: '1080 x 1920',
    size: '1.3 MB',
    tags: ['pastel', 'palmito', 'catupiry', 'vegetariano', 'pasteis'],
    createdAt: '2026-08-06'
  },
  // Salgados
  {
    id: 'lib-sg-1',
    name: 'Coxinha Dourada de Frango com Catupiry',
    category: 'salgados',
    type: 'image',
    format: 'WEBP',
    url: '/foto.png',
    resolution: '1080 x 1920',
    size: '1.6 MB',
    tags: ['coxinha', 'frango', 'catupiry', 'salgados', 'frito'],
    createdAt: '2026-08-05'
  },
  {
    id: 'lib-sg-2',
    name: 'Kibe Artesanal Recheado com Queijo',
    category: 'salgados',
    type: 'image',
    format: 'JPG',
    url: '/foto.png',
    resolution: '1080 x 1920',
    size: '1.5 MB',
    tags: ['kibe', 'carne', 'recheado', 'salgados'],
    createdAt: '2026-08-04'
  },
  // Refrigerantes
  {
    id: 'lib-rf-1',
    name: 'Coca-Cola em Lata 350ml Trincando',
    category: 'refrigerantes',
    type: 'image',
    format: 'JPG',
    url: '/foto.png',
    resolution: '1920 x 1080',
    size: '1.4 MB',
    tags: ['coca-cola', 'refrigerante', 'lata', 'gelado', 'refrigerantes'],
    createdAt: '2026-08-08'
  },
  {
    id: 'lib-rf-2',
    name: 'Guaraná Antarctica Gelado com Gelo e Limão',
    category: 'refrigerantes',
    type: 'image',
    format: 'WEBP',
    url: '/foto.png',
    resolution: '1080 x 1080',
    size: '890 KB',
    tags: ['guaraná', 'refrigerante', 'gelo', 'limão', 'refrigerantes'],
    createdAt: '2026-08-07'
  },
  // Sucos
  {
    id: 'lib-sc-1',
    name: 'Suco Natural de Laranja da Fruta 500ml',
    category: 'sucos',
    type: 'image',
    format: 'JPG',
    url: '/foto.png',
    resolution: '2000 x 2000',
    size: '1.6 MB',
    tags: ['suco', 'laranja', 'natural', 'fruta', 'sucos'],
    createdAt: '2026-08-08'
  },
  {
    id: 'lib-sc-2',
    name: 'Suco de Maracujá Cremoso e Refrescante',
    category: 'sucos',
    type: 'image',
    format: 'WEBP',
    url: '/foto.png',
    resolution: '1920 x 1080',
    size: '1.2 MB',
    tags: ['suco', 'maracujá', 'refrescante', 'sucos'],
    createdAt: '2026-08-05'
  },
  // Bebidas Alcóolicas
  {
    id: 'lib-ba-1',
    name: 'Chopp Artesanal IPA em Tulipa Caldereta',
    category: 'bebidas-alcoolicas',
    type: 'image',
    format: 'JPG',
    url: '/foto.png',
    resolution: '1920 x 1080',
    size: '1.4 MB',
    tags: ['chopp', 'cerveja', 'ipa', 'artesanal', 'bar', 'bebidas alcóolicas'],
    createdAt: '2026-08-08'
  },
  // Logos
  {
    id: 'lib-lg-1',
    name: 'Logo Smash & Co. Vetorial Principal',
    category: 'logos',
    type: 'vector',
    format: 'PNG',
    url: '/foto.png',
    resolution: '3000 x 1200',
    size: '450 KB',
    tags: ['logo', 'oficial', 'transparente', 'marca'],
    createdAt: '2026-08-08'
  },
  {
    id: 'lib-lg-2',
    name: 'Badge Selo Vintage Artesanal',
    category: 'logos',
    type: 'vector',
    format: 'PNG',
    url: '/foto.png',
    resolution: '1500 x 1500',
    size: '320 KB',
    tags: ['selo', 'vintage', 'badge', 'estilo'],
    createdAt: '2026-08-06'
  },
  // Vídeos
  {
    id: 'lib-vd-1',
    name: 'Take 4K - Smash na Chapa com Crosta',
    category: 'videos',
    type: 'video',
    format: 'MP4',
    url: '/video.mp4',
    resolution: '3840 x 2160 (4K)',
    size: '18.4 MB',
    tags: ['chapa', 'fogo', 'preparo', 'slow motion'],
    createdAt: '2026-08-08'
  },
  {
    id: 'lib-vd-2',
    name: 'Vídeo Vertical Reels - Cheddar Derretido',
    category: 'videos',
    type: 'video',
    format: 'MP4',
    url: '/video.mp4',
    resolution: '1080 x 1920 (9:16)',
    size: '12.8 MB',
    tags: ['reels', 'queijo', 'stories', 'vertical'],
    createdAt: '2026-08-07'
  },
  // Fundos
  {
    id: 'lib-fd-1',
    name: 'Textura Madeira Rústica Escura',
    category: 'fundos',
    type: 'image',
    format: 'JPG',
    url: '/foto.png',
    resolution: '3840 x 2160 (4K)',
    size: '3.2 MB',
    tags: ['background', 'madeira', 'dark', 'rústico'],
    createdAt: '2026-08-08'
  },
  {
    id: 'lib-fd-2',
    name: 'Estúdio Dark Smoke & Fire Glow',
    category: 'fundos',
    type: 'image',
    format: 'WEBP',
    url: '/foto.png',
    resolution: '2560 x 1440',
    size: '2.1 MB',
    tags: ['fumaça', 'brasa', 'iluminação', 'fotografia'],
    createdAt: '2026-08-06'
  },
  // Ícones
  {
    id: 'lib-ic-1',
    name: 'Ícone Pimenta Jalapeño Hot (Transparente)',
    category: 'icones',
    type: 'vector',
    format: 'PNG',
    url: '/foto.png',
    resolution: '512 x 512',
    size: '85 KB',
    tags: ['pimenta', 'picante', 'ingrediente', 'png'],
    createdAt: '2026-08-08'
  },
  {
    id: 'lib-ic-2',
    name: 'Selo 100% Carne Angus Certificada',
    category: 'icones',
    type: 'vector',
    format: 'PNG',
    url: '/foto.png',
    resolution: '800 x 800',
    size: '140 KB',
    tags: ['angus', 'qualidade', 'selo', 'garantia'],
    createdAt: '2026-08-07'
  }
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'produtos' | 'categorias' | 'promocoes' | 'tv' | 'ia' | 'arquivos' | 'biblioteca' | 'configuracoes'>('dashboard');
  const [tvSlide, setTvSlide] = useState(0);
  const [activeTheme, setActiveTheme] = useState('tv-01');

  // TV Studio Advanced States
  const [activeTvId, setActiveTvId] = useState<string>('tv-salao');
  const [activeTurno, setActiveTurno] = useState<string>('almoco');
  const [libSubTab, setLibSubTab] = useState<string>('sanduiches');
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState<number | null>(0);
  const [selectedMusic, setSelectedMusic] = useState<string>('Rock');
  const [adInterval, setAdInterval] = useState<number>(30);
  const [adPartner, setAdPartner] = useState<string>('Coca-Cola');
  const [adDuration, setAdDuration] = useState<number>(30);
  const [tvCampaignLoop, setTvCampaignLoop] = useState<boolean>(false);
  const [tvPlaylists, setTvPlaylists] = useState<Record<string, any[]>>({
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
  });

  // AI Area Provider States
  const [imageAiProvider, setImageAiProvider] = useState<'gpt-image' | 'outro'>('gpt-image');
  const [customImageProvider, setCustomImageProvider] = useState('');
  const [videoAiProvider, setVideoAiProvider] = useState<'veo' | 'kling' | 'runway'>('veo');
  const [aiSavedNotice, setAiSavedNotice] = useState(false);

  // File Bank States
  const [selectedFileProduct, setSelectedFileProduct] = useState<string>('smash-bacon');
  const [fileFilter, setFileFilter] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [copiedFileName, setCopiedFileName] = useState<string | null>(null);
  const [previewFileModal, setPreviewFileModal] = useState<{
    name: string;
    label: string;
    type: 'image' | 'video' | 'document';
    url: string;
    resolution: string;
    size: string;
    usage: string;
  } | null>(null);

  // Biblioteca de Mídias States
  const [libraryItems, setLibraryItems] = useState<LibraryMediaItem[]>(initialLibraryItems);
  const [selectedLibCat, setSelectedLibCat] = useState<string>('sanduiches');
  const [libSearchTerm, setLibSearchTerm] = useState<string>('');
  const [libSearchScope, setLibSearchScope] = useState<'global' | 'folder'>('global');
  const [libTypeFilter, setLibTypeFilter] = useState<'all' | 'image' | 'video' | 'vector'>('all');
  const [isUploadLibModalOpen, setIsUploadLibModalOpen] = useState(false);
  const [uploadLibName, setUploadLibName] = useState('');
  const [uploadLibCat, setUploadLibCat] = useState('sanduiches');
  const [uploadLibType, setUploadLibType] = useState<'image' | 'video' | 'vector'>('image');
  const [uploadLibFormat, setUploadLibFormat] = useState<'JPG' | 'PNG' | 'WEBP' | 'TIFF' | 'MP4' | 'MOV' | 'AVI' | 'WEBM' | 'SVG'>('WEBP');
  const [uploadLibUrl, setUploadLibUrl] = useState('');
  const [uploadLibTags, setUploadLibTags] = useState('');
  const [isDraggingLib, setIsDraggingLib] = useState(false);

  // Multi-Tenant Client States
  const [clients, setClients] = useState<ClientProjectConfig[]>(initialClients);
  const [activeClientId, setActiveClientId] = useState<string>('client-1');
  const [isClientGeneratorOpen, setIsClientGeneratorOpen] = useState(false);
  const [clientGenNotice, setClientGenNotice] = useState<string | null>(null);

  // Form fields for Generator Wizard
  const [formClientName, setFormClientName] = useState('');
  const [formClientTagline, setFormClientTagline] = useState('');
  const [formClientLogoIcon, setFormClientLogoIcon] = useState('🍔');
  const [formClientLogoUrl, setFormClientLogoUrl] = useState('');
  const [formClientPrimaryColor, setFormClientPrimaryColor] = useState('#FF5A1F');
  const [formClientSecondaryColor, setFormClientSecondaryColor] = useState('#FFB703');
  const [formClientThemePreset, setFormClientThemePreset] = useState('tv-01');
  const [formClientFontFamily, setFormClientFontFamily] = useState("'Outfit', sans-serif");
  const [formClientInstagram, setFormClientInstagram] = useState('');
  const [formClientWhatsApp, setFormClientWhatsApp] = useState('');
  const [formClientQrUrl, setFormClientQrUrl] = useState('');

  useEffect(() => {
    // Sincroniza configurações e playlists do TV Studio da API com fallback do Supabase
    fetch('http://localhost:3001/api/settings')
      .then(res => res.json())
      .then(settings => {
        if (settings.activeTheme) setActiveTheme(settings.activeTheme);
        if (settings.activeTvId) setActiveTvId(settings.activeTvId);
        if (settings.activeMusic) setSelectedMusic(settings.activeMusic);
        if (settings.adIntervalMinutes) setAdInterval(settings.adIntervalMinutes);
        if (settings.adPartnerName) setAdPartner(settings.adPartnerName);
        if (settings.adDurationSeconds) setAdDuration(settings.adDurationSeconds);
        if (settings.activeTurno) setActiveTurno(settings.activeTurno);
        if (settings.playlists) setTvPlaylists(settings.playlists);
      })
      .catch(() => {
        // Fallback: Query Supabase directly
        try {
          const { createClient } = require('@supabase/supabase-js');
          const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qjhrlqpsfzaycoaekwqh.supabase.co';
          const sbKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_c0x3S20RA_xIVMed3cPpFQ_kO1XXul6';
          const sb = createClient(sbUrl, sbKey);
          sb.from('tv_settings').select('*').eq('id', 'default').single()
            .then(({ data }: any) => {
              if (data && data.playlists) {
                setTvPlaylists(data.playlists);
                if (data.active_tv_id) setActiveTvId(data.active_tv_id);
                if (data.active_music) setSelectedMusic(data.active_music);
                if (data.active_turno) setActiveTurno(data.active_turno);
                if (data.ad_interval_minutes) setAdInterval(data.ad_interval_minutes);
                if (data.ad_partner_name) setAdPartner(data.ad_partner_name);
                if (data.ad_duration_seconds) setAdDuration(data.ad_duration_seconds);
              }
            }).catch(() => {});
        } catch (e) {}
      });

    const cachedTheme = localStorage.getItem('burger_studio_active_theme');
    if (cachedTheme) {
      setActiveTheme(cachedTheme);
    }

    const cachedClients = localStorage.getItem('burger_studio_clients_list');
    if (cachedClients) {
      try {
        const parsed = JSON.parse(cachedClients);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setClients(parsed);
        }
      } catch (e) {}
    }

    const cachedActiveClientId = localStorage.getItem('burger_studio_active_client_id');
    if (cachedActiveClientId) {
      setActiveClientId(cachedActiveClientId);
    }

    const cachedImageProvider = localStorage.getItem('burger_studio_ai_image_provider');
    const cachedCustomImage = localStorage.getItem('burger_studio_ai_custom_image_provider');
    const cachedVideoProvider = localStorage.getItem('burger_studio_ai_video_provider');

    if (cachedImageProvider === 'gpt-image' || cachedImageProvider === 'outro') {
      setImageAiProvider(cachedImageProvider as 'gpt-image' | 'outro');
    }
    if (cachedCustomImage) {
      setCustomImageProvider(cachedCustomImage);
    }
    if (cachedVideoProvider === 'veo' || cachedVideoProvider === 'kling' || cachedVideoProvider === 'runway') {
      setVideoAiProvider(cachedVideoProvider as 'veo' | 'kling' | 'runway');
    }

    const cachedLibrary = localStorage.getItem('burger_studio_library_items');
    if (cachedLibrary) {
      try {
        const parsed = JSON.parse(cachedLibrary);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLibraryItems(parsed);
        }
      } catch (e) {}
    }
  }, []);

  const handleSaveLibraryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadLibName || !uploadLibUrl) return;

    const newItem: LibraryMediaItem = {
      id: 'lib-' + Date.now(),
      name: uploadLibName,
      category: uploadLibCat as any,
      type: uploadLibType,
      format: uploadLibFormat,
      url: uploadLibUrl,
      resolution: uploadLibType === 'video' ? '1920 x 1080 (HD)' : uploadLibType === 'vector' ? '3000 x 3000 (Vetor)' : '2048 x 2048 (HQ)',
      size: uploadLibType === 'video' ? '14.2 MB' : '1.5 MB',
      tags: uploadLibTags ? uploadLibTags.split(',').map(t => t.trim().toLowerCase()) : [uploadLibCat],
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updated = [newItem, ...libraryItems];
    setLibraryItems(updated);
    safeSetLocalStorage('burger_studio_library_items', JSON.stringify(updated));

    // Reset and close
    setUploadLibName('');
    setUploadLibUrl('');
    setUploadLibTags('');
    setIsUploadLibModalOpen(false);
  };

  const handleDeleteLibraryItem = (id: string) => {
    const updated = libraryItems.filter(item => item.id !== id);
    setLibraryItems(updated);
    safeSetLocalStorage('burger_studio_library_items', JSON.stringify(updated));
  };

  const safeSetLocalStorage = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`[BurgerAI Studio] LocalStorage quota exceeded for key "${key}". Stored in memory instead.`, e);
    }
  };

  const activeClient = clients.find(c => c.id === activeClientId) || clients[0] || initialClients[0];

  const handleSelectClient = (clientId: string) => {
    setActiveClientId(clientId);
    const target = clients.find(c => c.id === clientId);
    if (target) {
      safeSetLocalStorage('burger_studio_active_client_id', clientId);
      safeSetLocalStorage('burger_studio_active_client_config', JSON.stringify(target));
      if (target.themePreset) {
        changeActiveTheme(target.themePreset);
      }
      notifyTvUpdate();
      
      // Sincroniza com a API Global para atualização do TV Player
      fetch('http://localhost:3001/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activeClientId: clientId,
          activeTheme: target.themePreset || 'tv-01',
          activeClientConfig: target
        })
      }).catch(() => {});

      setClientGenNotice(`Hamburgueria ativa alterada para "${target.name}"!`);
      setTimeout(() => setClientGenNotice(null), 3000);
    }
  };

  const handleGenerateClientProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formClientName.trim()) return;

    const slug = formClientName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const newClient: ClientProjectConfig = {
      id: 'client-' + Date.now(),
      name: formClientName.trim(),
      slug: slug || 'nova-hamburgueria',
      tagline: formClientTagline.trim() || 'Hambúrgueres Artesanais & Especiais',
      logoIcon: formClientLogoIcon || '🍔',
      logoUrl: formClientLogoUrl.trim(),
      primaryColor: formClientPrimaryColor || '#FF5A1F',
      secondaryColor: formClientSecondaryColor || '#FFB703',
      themePreset: formClientThemePreset || 'tv-01',
      fontFamily: formClientFontFamily || "'Outfit', sans-serif",
      instagramHandle: formClientInstagram.trim() || `@${slug}`,
      whatsappNumber: formClientWhatsApp.trim() || '(11) 99999-9999',
      qrCodeUrl: formClientQrUrl.trim() || `https://wa.me/5511999999999`,
      createdAt: new Date().toISOString()
    };

    const updated = [newClient, ...clients];
    setClients(updated);
    safeSetLocalStorage('burger_studio_clients_list', JSON.stringify(updated));
    handleSelectClient(newClient.id);
    setIsClientGeneratorOpen(false);

    // Reset Form
    setFormClientName('');
    setFormClientTagline('');
    setFormClientLogoUrl('');
    setFormClientInstagram('');
    setFormClientWhatsApp('');
    setFormClientQrUrl('');

    setClientGenNotice(`🚀 Projeto de "${newClient.name}" gerado com sucesso em menos de 1 minuto!`);
    setTimeout(() => setClientGenNotice(null), 4000);
  };


  const handleSelectImageProvider = (provider: 'gpt-image' | 'outro') => {
    setImageAiProvider(provider);
    safeSetLocalStorage('burger_studio_ai_image_provider', provider);
    setAiSavedNotice(true);
    setTimeout(() => setAiSavedNotice(false), 2500);
  };

  const handleCustomImageNameChange = (name: string) => {
    setCustomImageProvider(name);
    safeSetLocalStorage('burger_studio_ai_custom_image_provider', name);
    setAiSavedNotice(true);
    setTimeout(() => setAiSavedNotice(false), 2500);
  };

  const handleSelectVideoProvider = (provider: 'veo' | 'kling' | 'runway') => {
    setVideoAiProvider(provider);
    safeSetLocalStorage('burger_studio_ai_video_provider', provider);
    setAiSavedNotice(true);
    setTimeout(() => setAiSavedNotice(false), 2500);
  };

  const changeActiveTheme = (themeId: string) => {
    setActiveTheme(themeId);
    safeSetLocalStorage('burger_studio_active_theme', themeId);
    notifyTvUpdate();

    // Sincroniza o template com a API Global para atualização do TV Player
    fetch('http://localhost:3001/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activeTheme: themeId })
    }).catch(() => {});
  };

  const getVirtualTvThemeStyles = () => {
    switch (activeTheme) {
      case 'insta-01':
        return {
          background: 'linear-gradient(135deg, #09090b 0%, #18181b 100%)',
          radialBg: 'radial-gradient(circle, #27272a 0%, #09090b 100%)',
          accent: '#D4AF37',
          accentSecondary: '#F3E5AB',
          textPrimary: '#FFFFFF',
          textSecondary: '#E4E4E7',
          cardBg: '#18181b',
          fontFamily: "'Outfit', sans-serif"
        };
      case 'insta-02':
        return {
          background: 'linear-gradient(135deg, #7F1D1D 0%, #FF5A1F 100%)',
          radialBg: 'radial-gradient(circle, #B91C1C 0%, #450A0A 100%)',
          accent: '#FFB703',
          accentSecondary: '#FFD166',
          textPrimary: '#FFFFFF',
          textSecondary: '#FECACA',
          cardBg: '#450A0A',
          fontFamily: "'Outfit', sans-serif"
        };
      case 'tv-premium':
        return {
          background: 'linear-gradient(135deg, #111115 0%, #1F1F27 100%)',
          radialBg: 'radial-gradient(circle, #2d2d38 0%, #111115 100%)',
          accent: '#DFB15B',
          accentSecondary: '#F4D068',
          textPrimary: '#FFFFFF',
          textSecondary: '#C5C5D2',
          cardBg: '#1b1b24',
          fontFamily: "'Playfair Display', serif"
        };
      case 'story-dark':
        return {
          background: 'linear-gradient(135deg, #1C120C 0%, #3E2723 100%)',
          radialBg: 'radial-gradient(circle, #3E2723 0%, #1C120C 100%)',
          accent: '#FF8A65',
          accentSecondary: '#FFAB91',
          textPrimary: '#FFE0B2',
          textSecondary: '#FFE0B2',
          cardBg: '#2E1C16',
          fontFamily: "'Outfit', sans-serif"
        };
      case 'story-light':
        return {
          background: 'linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%)',
          radialBg: 'radial-gradient(circle, #FFFFFF 0%, #E9ECEF 100%)',
          accent: '#FF5A1F',
          accentSecondary: '#FF8C00',
          textPrimary: '#1E293B',
          textSecondary: '#475569',
          cardBg: '#FFFFFF',
          fontFamily: "'Outfit', sans-serif"
        };
      case 'banner':
        return {
          background: 'linear-gradient(135deg, #7F0000 0%, #E63946 100%)',
          radialBg: 'radial-gradient(circle, #9B1C1C 0%, #4C0519 100%)',
          accent: '#FFD166',
          accentSecondary: '#06D6A0',
          textPrimary: '#FFFFFF',
          textSecondary: '#F1FAEE',
          cardBg: '#1D3557',
          fontFamily: "'Outfit', sans-serif"
        };
      case 'tv-01':
      default:
        return {
          background: 'linear-gradient(135deg, #050508 0%, #0B0B12 100%)',
          radialBg: 'radial-gradient(circle, #1E1E2F 0%, #050508 100%)',
          accent: '#FF5A1F',
          accentSecondary: '#FFB703',
          textPrimary: '#FFFFFF',
          textSecondary: '#94A3B8',
          cardBg: '#121216',
          fontFamily: "'Outfit', sans-serif"
        };
    }
  };

  // Auto-player loop for TV Menu Board Slideshow (6 slides total)
  useEffect(() => {
    const tvTimer = setInterval(() => {
      setTvSlide((prev) => (prev + 1) % 6);
    }, 4000);
    return () => clearInterval(tvTimer);
  }, []);
  
  // Products, campaigns, promotions lists with localstorage hydration
  const [products, setProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  
  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Sanduiches');
  const [prodPrice, setProdPrice] = useState('');
  const [prodWeight, setProdWeight] = useState('250g');
  const [prodDescription, setProdDescription] = useState('');
  const [prodIngredients, setProdIngredients] = useState('');
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodActive, setProdActive] = useState(true);

  // Aba 2 — Arquivos States
  const [prodGallery, setProdGallery] = useState<string[]>(['', '', '', '']);
  const [prodVideos, setProdVideos] = useState<string[]>(['', '', '']);
  const [prodLogo, setProdLogo] = useState('');
  const [prodSelo, setProdSelo] = useState('');
  const [prodIcones, setProdIcones] = useState('');
  const [isDraggingMain, setIsDraggingMain] = useState(false);

  // Origem da Imagem & Origem do Vídeo States
  const [imageSourceOrigin, setImageSourceOrigin] = useState<'ai' | 'upload' | 'library'>('ai');
  const [videoSourceOrigin, setVideoSourceOrigin] = useState<'ai' | 'upload' | 'images_to_video'>('ai');
  const [isGeneratingAiImage, setIsGeneratingAiImage] = useState(false);
  const [isGeneratingAiVideo, setIsGeneratingAiVideo] = useState(false);
  const [isGeneratingImagesToVideo, setIsGeneratingImagesToVideo] = useState(false);
  const [aiImageStyle, setAiImageStyle] = useState('Studio Dark Food Photography');
  const [libraryPickerCat, setLibraryPickerCat] = useState('sanduiches');

  // Motion Video Engine States (Criar vídeo usando imagens)
  const [motionPhoto1, setMotionPhoto1] = useState('/foto.png');
  const [motionPhoto2, setMotionPhoto2] = useState('/feed.png');
  const [motionPhoto3, setMotionPhoto3] = useState('/story.png');
  const [motionEffectZoom, setMotionEffectZoom] = useState(true);
  const [motionEffectMovement, setMotionEffectMovement] = useState(true);
  const [motionEffectSmoke, setMotionEffectSmoke] = useState(true);
  const [motionEffectParticles, setMotionEffectParticles] = useState(true);
  const [motionEffectTransitions, setMotionEffectTransitions] = useState(true);
  const [motionEffectMusic, setMotionEffectMusic] = useState('rock_sizzle');
  const [motionEffectLogo, setMotionEffectLogo] = useState(true);
  const [motionFormat, setMotionFormat] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [motionSlideIndex, setMotionSlideIndex] = useState(0);
  const [isMotionPlaying, setIsMotionPlaying] = useState(true);
  const [isMotionPreviewPlaying, setIsMotionPreviewPlaying] = useState(true);
  const [motionCurrentScene, setMotionCurrentScene] = useState(1);

  // Fluxo Inteligente States
  const [isSmartFlowOpen, setIsSmartFlowOpen] = useState(false);
  const [smartFlowStep, setSmartFlowStep] = useState<number>(1);
  const [smartFlowProcessing, setSmartFlowProcessing] = useState(false);
  const [smartFlowCompletedNotice, setSmartFlowCompletedNotice] = useState<string | null>(null);

  // Smart Flow Draft Data
  const [flowProdName, setFlowProdName] = useState('Smash Monster Trufado');
  const [flowProdCat, setFlowProdCat] = useState('Sanduiches');
  const [flowProdPrice, setFlowProdPrice] = useState('38.90');
  const [flowProdDesc, setFlowProdDesc] = useState('Pão brioche tostado na manteiga, duplo blend smash de 100g, cheddar inglês derretido, maionese trufada e farofa de bacon crocante.');
  const [flowProdIngreds, setFlowProdIngreds] = useState('Pão Brioche, 2x Smash 100g, Cheddar Inglês, Maionese Trufada, Bacon');
  const [flowProdWeight, setFlowProdWeight] = useState('280g');
  const [flowProdPhoto, setFlowProdPhoto] = useState('/foto.png');
  const [flowProdVideo, setFlowProdVideo] = useState('https://assets.mixkit.co/videos/preview/mixkit-cooking-in-a-professional-kitchen-41624-large.mp4');
  const [flowImageEnhanced, setFlowImageEnhanced] = useState(true);
  const [flowVideoEnhanced, setFlowVideoEnhanced] = useState(true);

  // Motion Video Engine auto-rotator
  useEffect(() => {
    if (!isMotionPlaying) return;
    const interval = setInterval(() => {
      setMotionSlideIndex((prev) => (prev + 1) % 3);
    }, 2800);
    return () => clearInterval(interval);
  }, [isMotionPlaying]);

  // Editor Inteligente de Imagem States
  const [isAiEditorOpen, setIsAiEditorOpen] = useState(false);
  const [aiEditorSourceImage, setAiEditorSourceImage] = useState('/foto.png');
  const [aiEditorTargetField, setAiEditorTargetField] = useState<'main' | 'gallery_0' | 'gallery_1' | 'gallery_2' | 'gallery_3'>('main');
  const [aiEditorProcessingAction, setAiEditorProcessingAction] = useState<string | null>(null);
  const [aiEditorActiveEffects, setAiEditorActiveEffects] = useState({
    removeBg: false,
    customBg: 'none', // 'none' | 'wood' | 'dark_studio' | 'neon' | 'grill'
    upscale: true,
    lighting: true,
    enhanceCheese: true,
    brightness: 12,
    removeObjects: false,
    addSmoke: true,
    addSteam: true,
    addReflections: true
  });
  const [aiEditorCompareSlider, setAiEditorCompareSlider] = useState(50);
  const [aiEditorSuccessNotice, setAiEditorSuccessNotice] = useState<string | null>(null);

  const openAiEditorForImage = (imageUrl: string, targetField: 'main' | 'gallery_0' | 'gallery_1' | 'gallery_2' | 'gallery_3' = 'main') => {
    setAiEditorSourceImage(imageUrl || '/foto.png');
    setAiEditorTargetField(targetField);
    setIsAiEditorOpen(true);
  };

  const applySingleAiEffect = (effectName: string, updateFn: () => void) => {
    setAiEditorProcessingAction(`Aplicando: ${effectName}...`);
    setTimeout(() => {
      updateFn();
      setAiEditorProcessingAction(null);
      setAiEditorSuccessNotice(`✓ Efeito "${effectName}" aplicado com sucesso pela IA!`);
      setTimeout(() => setAiEditorSuccessNotice(null), 2500);
    }, 700);
  };

  // Editor Inteligente de Vídeo States
  const [isAiVideoEditorOpen, setIsAiVideoEditorOpen] = useState(false);
  const [aiVideoEditorSourceUrl, setAiVideoEditorSourceUrl] = useState('');
  const [aiVideoEditorSpeed, setAiVideoEditorSpeed] = useState<number>(1.0);
  const [aiVideoEditorTrimStart, setAiVideoEditorTrimStart] = useState<number>(0);
  const [aiVideoEditorTrimEnd, setAiVideoEditorTrimEnd] = useState<number>(15);
  const [aiVideoEditorOverlays, setAiVideoEditorOverlays] = useState({
    addLogo: true,
    addPrice: true,
    addIngredients: true,
    addMusic: true,
    musicTrack: 'rock_sizzle',
    addCaptions: true,
    captionText: 'O Smash Burger mais suculento e crocante da cidade! 🔥🧀',
    addQrCode: true,
    addWhatsApp: true
  });
  const [aiVideoProcessingNotice, setAiVideoProcessingNotice] = useState<string | null>(null);
  const [aiVideoSuccessNotice, setAiVideoSuccessNotice] = useState<string | null>(null);

  const openAiVideoEditor = (videoUrl: string) => {
    setAiVideoEditorSourceUrl(videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-cooking-in-a-professional-kitchen-41624-large.mp4');
    setIsAiVideoEditorOpen(true);
  };

  // New campaign state
  const [selectedRest, setSelectedRest] = useState('1');
  const [campaignName, setCampaignName] = useState('');
  const [campaignTheme, setCampaignTheme] = useState('');
  const [campaignIngreds, setCampaignIngreds] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodVideoUrl, setProdVideoUrl] = useState('');
  const [prodFiles, setProdFiles] = useState('');
  const [modalSubTab, setModalSubTab] = useState<'info' | 'media' | 'promocao' | 'historico'>('info');

  const handleFileUpload = (file: File, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        callback(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const API_URL = 'http://localhost:3001';

  // Hydrate lists
  useEffect(() => {
    const normalizeProduct = (p: any): Product => ({
      id: String(p.id || 'p-' + Date.now()),
      nome: p.nome || p.name || 'Produto',
      slug: p.slug || '',
      categoria: p.categoria || p.category || 'Sanduiches',
      descrição: p.descrição || p.descricao || p.description || '',
      ingredientes: Array.isArray(p.ingredientes) ? p.ingredientes : (typeof p.ingredientes === 'string' ? p.ingredientes.split(',').map((s: string) => s.trim()) : []),
      preço: Number(p.preço !== undefined ? p.preço : (p.preco !== undefined ? p.preco : (p.price !== undefined ? p.price : 0))),
      imagem: p.imagem || p.image || '/foto.png',
      ativo: p.ativo !== undefined ? p.ativo : (p.active !== undefined ? p.active : true),
      media: p.media || [],
      created_at: p.created_at ? new Date(p.created_at) : new Date()
    });

    const cachedProducts = localStorage.getItem('burger_studio_products');
    const cachedPromotions = localStorage.getItem('burger_studio_promotions');
    
    if (cachedProducts) {
      try {
        const parsed = JSON.parse(cachedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed.map(normalizeProduct));
        } else {
          setProducts(initialProducts);
        }
      } catch (err) {
        setProducts(initialProducts);
      }
    } else {
      setProducts(initialProducts);
      safeSetLocalStorage('burger_studio_products', JSON.stringify(initialProducts));
    }

    if (cachedPromotions) {
      try { setPromotions(JSON.parse(cachedPromotions)); } catch (e) { setPromotions(initialPromotions); }
    } else {
      setPromotions(initialPromotions);
      safeSetLocalStorage('burger_studio_promotions', JSON.stringify(initialPromotions));
    }

    // Connect database sync: Fetch products from fastify server
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const normalized = data.map(normalizeProduct);
          setProducts(normalized);
          safeSetLocalStorage('burger_studio_products', JSON.stringify(normalized));
          notifyTvUpdate();
        }
      })
      .catch(() => console.log('Fastify API offline, using localStorage fallback'));
  }, []);

  const notifyTvUpdate = () => {
    try {
      const channel = new BroadcastChannel('burger_tv_sync');
      channel.postMessage({ type: 'UPDATE_CATALOG', timestamp: Date.now() });
      channel.close();
    } catch (e) {
      // Fallback
    }
  };

  const saveProductsToStorage = async (updatedList: Product[], singleProductAction?: { type: 'create' | 'update' | 'delete', product: Product }) => {
    setProducts(updatedList);
    safeSetLocalStorage('burger_studio_products', JSON.stringify(updatedList));
    notifyTvUpdate();

    if (singleProductAction) {
      try {
        const { type, product } = singleProductAction;
        if (type === 'create') {
          await fetch(`${API_URL}/api/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
          });
        } else if (type === 'update') {
          await fetch(`${API_URL}/api/products/${product.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
          });
        } else if (type === 'delete') {
          await fetch(`${API_URL}/api/products/${product.id}`, {
            method: 'DELETE'
          });
        }
      } catch (err) {
        console.warn('API Sync failed, stored locally only:', err);
      }
    }
  };

  const savePromotionsToStorage = (updatedPromos: Promotion[]) => {
    setPromotions(updatedPromos);
    localStorage.setItem('burger_studio_promotions', JSON.stringify(updatedPromos));
    notifyTvUpdate();
  };

  const syncProductFilesToLibrary = () => {
    let updatedLib = [...libraryItems];
    let hasChanges = false;

    const categoryMapping = (cat: string): any => {
      const c = cat.toLowerCase();
      if (c.includes('hamburguer') || c.includes('smash')) return 'hamburgueres';
      if (c.includes('combo')) return 'combos';
      if (c.includes('bebida') || c.includes('suco') || c.includes('refrigerante')) return 'bebidas';
      if (c.includes('sobremesa') || c.includes('doce') || c.includes('shake')) return 'sobremesas';
      return 'imagens';
    };

    const productLibCat = categoryMapping(prodCategory);

    // Main image
    if (prodImageUrl && prodImageUrl.trim()) {
      const exists = updatedLib.some(item => item.url === prodImageUrl);
      if (!exists) {
        updatedLib.push({
          id: 'lib-prod-main-' + Date.now(),
          name: `${prodName} - Foto Principal`,
          category: productLibCat,
          type: 'image',
          format: 'WEBP',
          url: prodImageUrl.trim(),
          resolution: '2048 x 2048 px',
          size: '480 KB',
          tags: [prodName.toLowerCase(), prodCategory.toLowerCase(), 'principal'],
          createdAt: new Date().toISOString().split('T')[0]
        });
        hasChanges = true;
      }
    }

    // Gallery images
    prodGallery.forEach((url, idx) => {
      if (url && url.trim()) {
        const exists = updatedLib.some(item => item.url === url);
        if (!exists) {
          updatedLib.push({
            id: `lib-prod-gal-${idx}-` + Date.now(),
            name: `${prodName} - Foto Galeria ${idx + 1}`,
            category: productLibCat,
            type: 'image',
            format: 'WEBP',
            url: url.trim(),
            resolution: '1080 x 1080 px',
            size: '350 KB',
            tags: [prodName.toLowerCase(), prodCategory.toLowerCase(), 'galeria'],
            createdAt: new Date().toISOString().split('T')[0]
          });
          hasChanges = true;
        }
      }
    });

    // Videos
    prodVideos.forEach((url, idx) => {
      if (url && url.trim()) {
        const exists = updatedLib.some(item => item.url === url);
        if (!exists) {
          updatedLib.push({
            id: `lib-prod-vid-${idx}-` + Date.now(),
            name: `${prodName} - Vídeo ${idx + 1}`,
            category: 'videos',
            type: 'video',
            format: 'MP4',
            url: url.trim(),
            resolution: '1080 x 1920 px',
            size: '12.4 MB',
            tags: [prodName.toLowerCase(), prodCategory.toLowerCase(), 'vídeo'],
            createdAt: new Date().toISOString().split('T')[0]
          });
          hasChanges = true;
        }
      }
    });

    if (prodVideoUrl && prodVideoUrl.trim()) {
      const exists = updatedLib.some(item => item.url === prodVideoUrl);
      if (!exists) {
        updatedLib.push({
          id: 'lib-prod-vid-main-' + Date.now(),
          name: `${prodName} - Vídeo Principal`,
          category: 'videos',
          type: 'video',
          format: 'MP4',
          url: prodVideoUrl.trim(),
          resolution: '1080 x 1920 px',
          size: '12.4 MB',
          tags: [prodName.toLowerCase(), prodCategory.toLowerCase(), 'vídeo'],
          createdAt: new Date().toISOString().split('T')[0]
        });
        hasChanges = true;
      }
    }

    // Branding / Logos / Seals
    if (prodLogo && prodLogo.trim()) {
      const exists = updatedLib.some(item => item.url === prodLogo);
      if (!exists) {
        updatedLib.push({
          id: 'lib-prod-logo-' + Date.now(),
          name: `${prodName} - Logo`,
          category: 'logos',
          type: 'image',
          format: 'PNG',
          url: prodLogo.trim(),
          resolution: '512 x 512 px',
          size: '150 KB',
          tags: [prodName.toLowerCase(), 'logo'],
          createdAt: new Date().toISOString().split('T')[0]
        });
        hasChanges = true;
      }
    }

    if (prodSelo && prodSelo.trim()) {
      const exists = updatedLib.some(item => item.url === prodSelo);
      if (!exists) {
        updatedLib.push({
          id: 'lib-prod-selo-' + Date.now(),
          name: `${prodName} - Selo`,
          category: 'logos',
          type: 'image',
          format: 'PNG',
          url: prodSelo.trim(),
          resolution: '512 x 512 px',
          size: '80 KB',
          tags: [prodName.toLowerCase(), 'selo'],
          createdAt: new Date().toISOString().split('T')[0]
        });
        hasChanges = true;
      }
    }

    if (hasChanges) {
      setLibraryItems(updatedLib);
      safeSetLocalStorage('burger_studio_library_items', JSON.stringify(updatedLib));
    }
  };

  // Add/Edit Product handler
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice) return;

    // Build media array based on fields
    const mediaList: Media[] = [];
    if (prodImageUrl) {
      mediaList.push({
        id: 'm_img_main_' + Date.now(),
        produtoId: editingProductId || 'temp_pid',
        tipo: 'imagem',
        caminho: prodImageUrl,
        createdAt: new Date()
      });
    }

    // Gallery images
    prodGallery.forEach((img, idx) => {
      if (img.trim()) {
        mediaList.push({
          id: `m_gallery_${idx}_` + Date.now(),
          produtoId: editingProductId || 'temp_pid',
          tipo: 'imagem',
          caminho: img.trim(),
          createdAt: new Date()
        });
      }
    });

    // Videos
    prodVideos.forEach((vid, idx) => {
      if (vid.trim()) {
        mediaList.push({
          id: `m_vid_${idx}_` + Date.now(),
          produtoId: editingProductId || 'temp_pid',
          tipo: 'video',
          caminho: vid.trim(),
          createdAt: new Date()
        });
      }
    });

    if (prodVideoUrl && !prodVideos[0]) {
      mediaList.push({
        id: 'm_vid_main_' + Date.now(),
        produtoId: editingProductId || 'temp_pid',
        tipo: 'video',
        caminho: prodVideoUrl,
        createdAt: new Date()
      });
    }

    // Branding elements
    if (prodLogo) {
      mediaList.push({
        id: 'm_brand_logo_' + Date.now(),
        produtoId: editingProductId || 'temp_pid',
        tipo: 'tv',
        caminho: prodLogo,
        createdAt: new Date()
      });
    }

    if (prodFiles) {
      prodFiles.split(',').forEach((file, index) => {
        const trimmed = file.trim();
        if (trimmed) {
          mediaList.push({
            id: 'm_file_' + index + '_' + Date.now(),
            produtoId: editingProductId || 'temp_pid',
            tipo: 'tv',
            caminho: trimmed,
            createdAt: new Date()
          });
        }
      });
    }

    if (editingProductId) {
      let updatedProduct: Product | null = null;
      const updated = products.map(p => {
        if (p.id === editingProductId) {
          updatedProduct = {
            ...p,
            nome: prodName,
            categoria: prodCategory,
            preço: parseFloat(prodPrice),
            peso: prodWeight || '250g',
            descrição: prodDescription,
            ingredientes: prodIngredients ? prodIngredients.split(',').map(s => s.trim()) : [],
            imagem: prodImageUrl || '/foto.png',
            ativo: prodActive,
            selo: prodSelo,
            media: mediaList
          };
          return updatedProduct;
        }
        return p;
      });
      if (updatedProduct) {
        saveProductsToStorage(updated, { type: 'update', product: updatedProduct });
      } else {
        saveProductsToStorage(updated);
      }
      setEditingProductId(null);
    } else {
      const newPid = 'p' + (products.length + 1);
      mediaList.forEach(m => m.produtoId = newPid);

      const newProduct: Product = {
        id: newPid,
        nome: prodName,
        slug: prodName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        categoria: prodCategory,
        preço: parseFloat(prodPrice),
        peso: prodWeight || '250g',
        descrição: prodDescription,
        ingredientes: prodIngredients ? prodIngredients.split(',').map(s => s.trim()) : [],
        imagem: prodImageUrl || '/foto.png',
        ativo: prodActive,
        created_at: new Date(),
        selo: prodSelo,
        media: mediaList
      };
      const newList = [newProduct, ...products];
      saveProductsToStorage(newList, { type: 'create', product: newProduct });
    }

    syncProductFilesToLibrary();
    setIsModalOpen(false);

    // Reset fields
    setProdName('');
    setProdCategory('Hambúrguer');
    setProdPrice('');
    setProdWeight('250g');
    setProdDescription('');
    setProdIngredients('');
    setProdImageUrl('');
    setProdGallery(['', '', '', '']);
    setProdVideos(['', '', '']);
    setProdLogo('');
    setProdSelo('');
    setProdIcones('');
    setProdVideoUrl('');
    setProdFiles('');
    setProdActive(true);
  };

  const handleDeleteProduct = (id: string) => {
    const pDelete = products.find(p => p.id === id);
    const updated = products.filter(p => p.id !== id);
    saveProductsToStorage(updated, pDelete ? { type: 'delete', product: pDelete } : undefined);
  };

  const handleDuplicateProduct = (p: Product) => {
    const duplicated: Product = {
      ...p,
      id: 'p' + (products.length + 1) + '_dup',
      nome: p.nome + ' (Cópia)',
      slug: p.slug + '-copia',
      created_at: new Date()
    };
    const updated = [duplicated, ...products];
    saveProductsToStorage(updated, { type: 'create', product: duplicated });
  };

  const handleEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProdName(p.nome);
    setProdCategory(p.categoria);
    setProdPrice(p.preço.toString());
    setProdWeight((p as any).peso?.toString() || '250g');
    setProdDescription(p.descrição || '');
    setProdIngredients(p.ingredientes.join(', '));
    setProdImageUrl(p.imagem || '');
    setProdActive(p.ativo);
    setProdSelo(p.selo || '');
    
    // Populate gallery if available
    const imgMedias = p.media?.filter(m => m.tipo === 'imagem' && m.caminho !== p.imagem) || [];
    const gallerySlots = ['', '', '', ''];
    imgMedias.slice(0, 4).forEach((m, idx) => {
      gallerySlots[idx] = m.caminho;
    });
    setProdGallery(gallerySlots);

    // Populate videos
    const vidMedias = p.media?.filter(m => m.tipo === 'video') || [];
    const vidSlots = ['', '', ''];
    vidMedias.slice(0, 3).forEach((m, idx) => {
      vidSlots[idx] = m.caminho;
    });
    setProdVideos(vidSlots);
    setProdVideoUrl(vidSlots[0] || 'https://assets.mixkit.co/videos/preview/mixkit-cooking-in-a-professional-kitchen-41624-large.mp4');
    
    const fileMedia = p.media?.filter(m => m.tipo === 'tv') || [];
    setProdFiles(fileMedia.map(m => m.caminho).join(', ') || `${p.slug}-cardapio.pdf, ${p.slug}-banner-signage.png`);
    
    setModalSubTab('info');
    setIsModalOpen(true);
  };

  const handleOpenNewProductModal = () => {
    setEditingProductId(null);
    setProdName('');
    setProdCategory('Hambúrguer');
    setProdPrice('');
    setProdWeight('250g');
    setProdDescription('');
    setProdIngredients('');
    setProdImageUrl('');
    setProdGallery(['', '', '', '']);
    setProdVideos(['', '', '']);
    setProdLogo('');
    setProdSelo('');
    setProdIcones('');
    setProdVideoUrl('');
    setProdFiles('');
    setProdActive(true);
    setModalSubTab('info');
    setIsModalOpen(true);
  };

  const handleGenerateContent = (p: Product) => {
    setCampaignName(p.nome + ' Promo');
    setCampaignTheme(p.descrição || `Campanha do hambúrguer ${p.nome} com ingredientes premium.`);
    setCampaignIngreds(p.ingredientes.join(', '));
    setActiveTab('dashboard');
  };

  // Add Campaign handler
  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName || !campaignTheme) return;

    const clientMatch = clients.find(c => c.id === selectedRest) || clients.find(c => c.id === activeClientId);
    const newId = 'c_' + Date.now();
    const newCampaign = {
      id: newId,
      name: campaignName,
      theme: `${campaignTheme} (Ingredientes: ${campaignIngreds})`,
      status: 'GENERATING' as const,
      createdAt: new Date().toISOString(),
      restaurant: clientMatch ? clientMatch.name : (activeClient ? activeClient.name : 'Smash & Co.')
    };

    setCampaigns([newCampaign, ...campaigns]);
    setCampaignName('');
    setCampaignTheme('');
    setCampaignIngreds('');

    // Simula a orquestração de IA finalizando com sucesso após 5 segundos
    setTimeout(() => {
      setCampaigns(prev => prev.map(c => c.id === newId ? { ...c, status: 'READY' } : c));
    }, 5000);
  };

  return (
    <div className="burger-ui-layout">
      {/* 1. Sidebar Navigation */}
      <aside className="burger-ui-sidebar">
        <div className="burger-ui-sidebar-brand">
          <span style={{ fontSize: '1.8rem' }}>🍔</span>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, background: 'linear-gradient(90deg, #FF5A1F, #FFB703)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
              BurgerAI Studio
            </h2>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Painel v1.0</span>
          </div>
        </div>

        {/* Quick Action */}
        <Button 
          onClick={handleOpenNewProductModal} 
          style={{ width: '100%', marginBottom: '1.5rem', padding: '0.6rem' }}
        >
          ➕ Novo Produto
        </Button>

        <ul className="burger-ui-sidebar-menu">
          <li>
            <a 
              className={`burger-ui-sidebar-item ${activeTab === 'dashboard' ? 'burger-ui-sidebar-item-active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <span>📊</span> Dashboard
            </a>
          </li>
          <li>
            <a 
              className="burger-ui-sidebar-item"
              onClick={() => {
                setSmartFlowStep(1);
                setIsSmartFlowOpen(true);
              }}
              style={{
                background: 'linear-gradient(135deg, rgba(255, 183, 3, 0.15), rgba(255, 90, 31, 0.15))',
                border: '1px solid rgba(255, 183, 3, 0.4)',
                color: '#FFB703',
                fontWeight: 800
              }}
            >
              <span>⚡</span> Fluxo Inteligente
            </a>
          </li>
          <li>
            <a 
              className={`burger-ui-sidebar-item ${activeTab === 'produtos' ? 'burger-ui-sidebar-item-active' : ''}`}
              onClick={() => setActiveTab('produtos')}
            >
              <span>🍔</span> Produtos
            </a>
          </li>
          <li>
            <a 
              className={`burger-ui-sidebar-item ${activeTab === 'categorias' ? 'burger-ui-sidebar-item-active' : ''}`}
              onClick={() => setActiveTab('categorias')}
            >
              <span>📁</span> Categorias
            </a>
          </li>
          <li>
            <a 
              className={`burger-ui-sidebar-item ${activeTab === 'promocoes' ? 'burger-ui-sidebar-item-active' : ''}`}
              onClick={() => setActiveTab('promocoes')}
            >
              <span>🏷️</span> Promoções
            </a>
          </li>
          <li>
            <a 
              className={`burger-ui-sidebar-item ${activeTab === 'tv' ? 'burger-ui-sidebar-item-active' : ''}`}
              onClick={() => setActiveTab('tv')}
            >
              <span>📺</span> TV Signage
            </a>
          </li>
          <li>
            <a 
              className={`burger-ui-sidebar-item ${activeTab === 'ia' ? 'burger-ui-sidebar-item-active' : ''}`}
              onClick={() => setActiveTab('ia')}
            >
              <span>🤖</span> Área de IA
            </a>
          </li>
          <li>
            <a 
              className={`burger-ui-sidebar-item ${activeTab === 'arquivos' ? 'burger-ui-sidebar-item-active' : ''}`}
              onClick={() => setActiveTab('arquivos')}
            >
              <span>📁</span> Banco de Arquivos
            </a>
          </li>
          <li>
            <a 
              className={`burger-ui-sidebar-item ${activeTab === 'biblioteca' ? 'burger-ui-sidebar-item-active' : ''}`}
              onClick={() => setActiveTab('biblioteca')}
            >
              <span>📚</span> Biblioteca de Mídias
            </a>
          </li>
          <li>
            <a 
              className={`burger-ui-sidebar-item ${activeTab === 'configuracoes' ? 'burger-ui-sidebar-item-active' : ''}`}
              onClick={() => setActiveTab('configuracoes')}
            >
              <span>⚙️</span> Configurações
            </a>
          </li>
        </ul>

        {/* Sidebar Metrics Block */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 700, fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Hoje</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Produtos Ativos</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-primary)', backgroundColor: 'rgba(255, 90, 31, 0.1)', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>47</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Promoções Ativas</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-secondary)', backgroundColor: 'rgba(255, 183, 3, 0.1)', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>3</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Vídeos Criados</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-success)', backgroundColor: 'rgba(46, 196, 182, 0.1)', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>152</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Posts Criados</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>893</span>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Container */}
      <div className="burger-ui-main-content">
        
        {/* Top Header info */}
        <header style={{
          padding: '1.25rem 2.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(10, 10, 12, 0.4)',
          backdropFilter: 'blur(12px)',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, textTransform: 'capitalize' }}>
              {(() => {
                switch (activeTab) {
                  case 'dashboard': return 'Dashboard';
                  case 'produtos': return 'Produtos';
                  case 'categorias': return 'Categorias';
                  case 'promocoes': return 'Promoções';
                  case 'tv': return 'TV Signage';
                  case 'ia': return 'Área de IA';
                  case 'arquivos': return 'Banco de Arquivos';
                  case 'biblioteca': return 'Biblioteca de Mídias';
                  case 'configuracoes': return 'Configurações';
                  default: return activeTab;
                }
              })()}
            </h2>

            {/* Active Client Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 90, 31, 0.1)',
              border: '1px solid rgba(255, 90, 31, 0.3)',
              borderRadius: '20px',
              padding: '0.25rem 0.75rem',
              fontSize: '0.8rem',
              color: '#fff',
              fontWeight: 700
            }}>
              <span>{activeClient.logoIcon || '🍔'}</span>
              <span>{activeClient.name}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Multi-Tenant Client Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Cliente Ativo:</span>
              <select
                value={activeClientId}
                onChange={(e) => handleSelectClient(e.target.value)}
                className="burger-ui-input"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', fontWeight: 700, borderColor: 'rgba(255, 90, 31, 0.4)', background: 'rgba(18, 18, 22, 0.9)' }}
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.logoIcon || '🍔'} {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Generator Button */}
            <Button
              onClick={() => setIsClientGeneratorOpen(true)}
              style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg, #FF5A1F, #FF8C00)' }}
            >
              <span>⚡</span> Novo Cliente (Gerador)
            </Button>

            <span className="burger-ui-card" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid rgba(46, 196, 182, 0.2)', color: 'var(--accent-success)' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--accent-success)', borderRadius: '50%', display: 'inline-block' }}></span>
              Engine Online
            </span>
          </div>
        </header>

        {/* Global Client Generator Toast Notice */}
        {clientGenNotice && (
          <div style={{
            margin: '1rem 2.5rem 0 2.5rem',
            padding: '0.85rem 1.5rem',
            background: 'rgba(46, 196, 182, 0.15)',
            border: '1px solid var(--accent-success)',
            borderRadius: '12px',
            color: 'var(--accent-success)',
            fontSize: '0.9rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <span>✨</span> {clientGenNotice}
          </div>
        )}


        {/* Views Router Wrapper */}
        <div style={{ padding: '2.5rem', flex: 1 }}>

          {/* VIEW: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Top Hero: Fluxo Inteligente Action Card */}
              <div className="burger-ui-card" style={{
                background: 'linear-gradient(135deg, rgba(255, 90, 31, 0.15) 0%, rgba(255, 183, 3, 0.12) 50%, rgba(46, 196, 182, 0.08) 100%)',
                border: '2px solid rgba(255, 183, 3, 0.4)',
                padding: '2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.5rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxWidth: '720px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '2rem' }}>⚡</span>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 900, color: '#fff', margin: 0 }}>
                      Fluxo Inteligente de Publicação
                    </h2>
                    <span style={{ background: 'linear-gradient(135deg, #FF5A1F, #FFB703)', color: '#000', fontSize: '0.75rem', fontWeight: 900, padding: '0.25rem 0.75rem', borderRadius: '20px' }}>
                      11 Passos Guiados
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
                    Cadastrar Produto → Enviar Foto → Enviar Vídeo → IA Melhora → Gerar Feed → Gerar Story → Gerar Banner → Gerar TV → Gerar Cardápio → Salvar Biblioteca.
                  </p>
                </div>

                <Button
                  onClick={() => {
                    setSmartFlowStep(1);
                    setIsSmartFlowOpen(true);
                  }}
                  style={{
                    padding: '0.85rem 1.75rem',
                    fontSize: '1rem',
                    fontWeight: 900,
                    background: 'linear-gradient(135deg, #FFB703, #FF5A1F)',
                    color: '#000',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(255, 183, 3, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem'
                  }}
                >
                  <span>⚡</span> Iniciar Fluxo Inteligente Agora
                </Button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                {/* Creator Form */}
                <div className="burger-ui-card" style={{ border: '1px solid rgba(255, 90, 31, 0.1)' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>✨</span> Criar Campanha de Marketing
                  </h3>
                  <form onSubmit={handleCreateCampaign} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div className="burger-ui-form-group">
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Hamburgueria / Cliente</label>
                      <select 
                        value={selectedRest || activeClientId} 
                        onChange={(e) => {
                          setSelectedRest(e.target.value);
                          handleSelectClient(e.target.value);
                        }}
                        className="burger-ui-input"
                      >
                        {clients.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.logoIcon || '🍔'} {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="burger-ui-form-group">
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Nome da Campanha</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Bacon Supreme" 
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        className="burger-ui-input"
                        required
                      />
                    </div>
                    <div style={{ gridColumn: 'span 2' }} className="burger-ui-form-group">
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Tema Criativo / Conceito</label>
                      <textarea 
                        placeholder="Ex: Cheddar derretido com tiras crocantes de bacon na brasa."
                        rows={2}
                        value={campaignTheme}
                        onChange={(e) => setCampaignTheme(e.target.value)}
                        className="burger-ui-input"
                        style={{ fontFamily: 'inherit' }}
                        required
                      />
                    </div>
                    <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end' }}>
                      <Button type="submit" style={{ width: '220px' }}>
                        Orquestrar Campanha ✨
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Campaigns List */}
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1.25rem' }}>Campanhas</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {campaigns.map((camp) => (
                      <div key={camp.id} className="burger-ui-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>{camp.restaurant}</span>
                          <h4 style={{ fontSize: '1.1rem', margin: '0.2rem 0' }}>{camp.name}</h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{camp.theme}</p>
                        </div>
                        <span style={{
                          padding: '0.4rem 0.8rem',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: camp.status === 'READY' ? 'rgba(46, 196, 182, 0.15)' : 'rgba(255, 183, 3, 0.15)',
                          color: camp.status === 'READY' ? 'var(--accent-success)' : 'var(--accent-secondary)'
                        }}>
                          {camp.status === 'READY' ? 'PRONTO' : 'ORQUESTRANDO... ⚙'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Generated assets preview */}
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1.25rem' }}>Assets Gerados</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }}>
                    {/* Copywriting results */}
                    <div className="burger-ui-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '0.25rem' }}>COPYWRITER AGENT</span>
                      {(() => {
                        const copy = JSON.parse(mockAssets[0].content || '{}');
                        return (
                          <>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>TÍTULO</span>
                              <h4 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 700 }}>{copy.titulo || copy.name}</h4>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>HEADLINE</span>
                              <p style={{ fontSize: '0.95rem', fontStyle: 'italic', color: 'var(--accent-secondary)' }}>"{copy.headline || copy.tagline}"</p>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>DESCRIÇÃO</span>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>{copy.descricao || copy.description}</p>
                            </div>
                            
                            {(copy.cta || copy.callToAction) && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>CTA</span>
                                <p style={{ fontSize: '0.85rem', color: 'var(--accent-success)', fontWeight: 600 }}>{copy.cta || copy.callToAction}</p>
                              </div>
                            )}

                            {copy.instagramCaption && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>LEGENDA INSTAGRAM</span>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>{copy.instagramCaption}</p>
                              </div>
                            )}

                            {copy.hashtags && copy.hashtags.length > 0 && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>HASHTAGS</span>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                  {copy.hashtags.map((tag: string, i: number) => (
                                    <span key={i} style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                    {/* Image result */}
                    <div className="burger-ui-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ padding: '1.25rem 1.25rem 0.5rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>IMAGE AGENT</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Midjourney v6</span>
                      </div>
                      <div style={{ height: '220px', position: 'relative' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={mockAssets[1].url} alt="Burger" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>PROMPT PROFISSIONAL</span>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.4 }}>
                            {mockAssets[1].metadata?.prompt || 'Professional gourmet burger photography, Black background, Steam, Melted cheddar, Advertising, Ultra realistic, Studio lighting, 8K, Shallow depth of field'}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '0.5rem' }}>
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>PROMPT NEGATIVO</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>deformed, blurry, extra ingredients</span>
                          </div>
                          <div style={{ width: '80px', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>PROPORÇÃO</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>16:9</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Últimos Produtos */}
                <div style={{ marginTop: '2.5rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1.25rem' }}>Últimos Produtos</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
                    {products.slice(0, 3).map((p) => (
                      <div key={p.id} className="burger-ui-card" style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ height: '100px', borderRadius: '8px', overflow: 'hidden', background: '#222' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.imagem} alt={p.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <h4 style={{ fontSize: '0.95rem', margin: '0.1rem 0', fontWeight: 700 }}>{p.nome}</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.categoria}</span>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>R$ {p.preço.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Próximas Promoções */}
                <div style={{ marginTop: '2.5rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1.25rem' }}>Próximas Promoções</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {promotions.map((p) => (
                      <div key={p.id} className="burger-ui-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                        <div>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{p.title}</h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            Início: {new Date(p.startDate).toLocaleDateString()}
                          </span>
                        </div>
                        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>R$ {p.discount.toFixed(2)} OFF</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Side Status Bar */}
              <aside className="burger-ui-card" style={{ alignSelf: 'start', position: 'sticky', top: '100px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1.25rem' }}>Status dos Agentes</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {mockTasks.map((t, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: idx < mockTasks.length - 1 ? '1px solid rgba(255, 255, 255, 0.03)' : 'none', paddingBottom: '0.75rem' }}>
                      <div style={{
                        width: '24px', height: '24px', borderRadius: '50%',
                        backgroundColor: t.status === 'COMPLETED' ? 'rgba(46, 196, 182, 0.1)' : t.status === 'RUNNING' ? 'rgba(255, 90, 31, 0.1)' : 'var(--bg-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem',
                        border: '1px solid',
                        borderColor: t.status === 'COMPLETED' ? 'var(--accent-success)' : t.status === 'RUNNING' ? 'var(--accent-primary)' : 'var(--border-subtle)'
                      }}>
                        {t.status === 'COMPLETED' ? '✓' : t.status === 'RUNNING' ? '⚙' : '•'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h5 style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}>{t.agent.replace('-', ' ')}</h5>
                        <span style={{ fontSize: '0.65rem', color: t.status === 'COMPLETED' ? 'var(--accent-success)' : t.status === 'RUNNING' ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                          {t.status === 'COMPLETED' ? 'COMPLETO' : t.status === 'RUNNING' ? 'ATIVO' : 'AGUARDANDO'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Flowchart Visualizer */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginTop: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
                  <h4 style={{ alignSelf: 'flex-start', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>Fluxo da Campanha</h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                    
                    {/* Step 1: Salvar */}
                    <div style={{ width: '100%', padding: '0.45rem 0.6rem', borderRadius: '8px', background: 'rgba(46, 196, 182, 0.04)', border: '1px solid rgba(46, 196, 182, 0.15)', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.9rem', display: 'block', fontWeight: 600 }}>💾 Salvar</span>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Escrita e exportação de Assets</span>
                    </div>
                    
                    <div style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 'bold', lineHeight: 1 }}>↓</div>
                    
                    {/* Step 2: Banco */}
                    <div style={{ width: '100%', padding: '0.45rem 0.6rem', borderRadius: '8px', background: 'rgba(255, 183, 3, 0.04)', border: '1px solid rgba(255, 183, 3, 0.15)', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.9rem', display: 'block', fontWeight: 600 }}>🗄️ Banco de Dados</span>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Prisma Schema / PostgreSQL</span>
                    </div>
                    
                    <div style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 'bold', lineHeight: 1 }}>↓</div>
                    
                    {/* Step 3: Orchestrator */}
                    <div style={{ width: '100%', padding: '0.45rem 0.6rem', borderRadius: '8px', background: 'rgba(255, 90, 31, 0.04)', border: '1px solid rgba(255, 90, 31, 0.15)', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.9rem', display: 'block', fontWeight: 600 }}>🤖 Orchestrator</span>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Orquestrador do Processo</span>
                    </div>
                    
                    <div style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 'bold', lineHeight: 1 }}>↓</div>
                    
                    {/* Step 4: Copywriter */}
                    <div style={{ width: '100%', padding: '0.45rem 0.6rem', borderRadius: '8px', background: 'rgba(72, 202, 228, 0.04)', border: '1px solid rgba(72, 202, 228, 0.15)', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.9rem', display: 'block', fontWeight: 600 }}>✍️ Copywriter</span>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Geração de Copys de Sucesso</span>
                    </div>
                    
                    <div style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 'bold', lineHeight: 1 }}>↓</div>
                    
                    {/* Step 5: Food Designer */}
                    <div style={{ width: '100%', padding: '0.45rem 0.6rem', borderRadius: '8px', background: 'rgba(114, 9, 183, 0.04)', border: '1px solid rgba(114, 9, 183, 0.15)', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.9rem', display: 'block', fontWeight: 600 }}>🎨 Food Designer</span>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Identidade Visual & Design</span>
                    </div>
                    
                    <div style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 'bold', lineHeight: 1 }}>↓</div>
                    
                    {/* Step 6: Image Prompt */}
                    <div style={{ width: '100%', padding: '0.45rem 0.6rem', borderRadius: '8px', background: 'rgba(0, 150, 199, 0.04)', border: '1px solid rgba(0, 150, 199, 0.15)', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.9rem', display: 'block', fontWeight: 600 }}>📸 Image Prompt</span>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Prompts de Imagens Premium</span>
                    </div>
                    
                    <div style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 'bold', lineHeight: 1 }}>↓</div>
                    
                    {/* Step 7: Video Prompt */}
                    <div style={{ width: '100%', padding: '0.45rem 0.6rem', borderRadius: '8px', background: 'rgba(247, 37, 133, 0.04)', border: '1px solid rgba(247, 37, 133, 0.15)', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.9rem', display: 'block', fontWeight: 600 }}>🎬 Video Prompt</span>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Roteiros e Prompts de Vídeo</span>
                    </div>
                    
                    <div style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 'bold', lineHeight: 1 }}>↓</div>
                    
                    {/* Step 8: TV */}
                    <div style={{ width: '100%', padding: '0.45rem 0.6rem', borderRadius: '8px', background: 'rgba(230, 57, 70, 0.04)', border: '1px solid rgba(230, 57, 70, 0.15)', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.9rem', display: 'block', fontWeight: 600 }}>📺 TV Signage</span>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Menus e Slides de Sinalização</span>
                    </div>
                    
                    <div style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 'bold', lineHeight: 1 }}>↓</div>
                    
                    {/* Step 9: Instagram */}
                    <div style={{ width: '100%', padding: '0.45rem 0.6rem', borderRadius: '8px', background: 'rgba(67, 97, 238, 0.04)', border: '1px solid rgba(67, 97, 238, 0.15)', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.9rem', display: 'block', fontWeight: 600 }}>📸 Instagram Feed</span>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Posts e Pré-visualização</span>
                    </div>
                    
                    <div style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 'bold', lineHeight: 1 }}>↓</div>
                    
                    {/* Step 10: Stories */}
                    <div style={{ width: '100%', padding: '0.45rem 0.6rem', borderRadius: '8px', background: 'rgba(251, 133, 0, 0.04)', border: '1px solid rgba(251, 133, 0, 0.15)', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.9rem', display: 'block', fontWeight: 600 }}>📱 Stories</span>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Formato Vertical 9:16</span>
                    </div>
                    
                    <div style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 'bold', lineHeight: 1 }}>↓</div>
                    
                    {/* Step 11: Reels */}
                    <div style={{ width: '100%', padding: '0.45rem 0.6rem', borderRadius: '8px', background: 'rgba(181, 23, 158, 0.04)', border: '1px solid rgba(181, 23, 158, 0.15)', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.9rem', display: 'block', fontWeight: 600 }}>🎥 Reels</span>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Vídeos Curtos Animados</span>
                    </div>
                    
                    <div style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 'bold', lineHeight: 1 }}>↓</div>
                    
                    {/* Step 12: Arquivos */}
                    <div style={{ width: '100%', padding: '0.45rem 0.6rem', borderRadius: '8px', background: 'rgba(46, 196, 182, 0.08)', border: '1px solid var(--accent-success)', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.9rem', display: 'block', color: 'var(--accent-success)', fontWeight: 700 }}>📁 Arquivos</span>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Gerenciador de Mídias</span>
                    </div>
                    
                  </div>
                </div>
              </aside>
            </div>
            </div>
          )}

          {/* VIEW: PRODUTOS */}
          {activeTab === 'produtos' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem' }}>Catálogo de Hambúrgueres e Itens</h3>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    placeholder="Pesquisar..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="burger-ui-input"
                    style={{ width: '220px', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                  />
                  <Button
                    onClick={() => {
                      setSmartFlowStep(1);
                      setIsSmartFlowOpen(true);
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #FFB703, #FF5A1F)',
                      color: '#000',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      boxShadow: '0 4px 14px rgba(255, 183, 3, 0.3)'
                    }}
                  >
                    <span>⚡</span> Iniciar Fluxo Inteligente
                  </Button>
                  <Button onClick={handleOpenNewProductModal}>
                    ➕ Novo Produto
                  </Button>
                </div>
              </div>

              {/* Products list grid */}
              <div className="burger-ui-product-grid">
                {products
                  .filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || p.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((p) => (
                    <div key={p.id} className="burger-ui-card burger-ui-product-card">
                      <div style={{ height: '180px', position: 'relative', background: '#222' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.imagem} alt={p.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: p.ativo ? 'rgba(46, 196, 182, 0.85)' : 'rgba(230, 57, 70, 0.85)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>
                          {p.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                      <div className="burger-ui-product-card-body">
                        <span className="burger-ui-product-tag">{p.categoria}</span>
                        <h4 style={{ fontSize: '1.1rem', margin: '0.25rem 0' }}>{p.nome}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{p.descrição}</p>
                        
                        {p.ingredientes && p.ingredientes.length > 0 && (
                          <div style={{ margin: '0.5rem 0', display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                            {p.ingredientes.map((ing, i) => (
                              <span key={i} style={{ fontSize: '0.65rem', backgroundColor: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', padding: '0.1rem 0.3rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                                {ing}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="burger-ui-product-price" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Preço</span>
                          <span style={{ fontWeight: 800, color: 'var(--accent-secondary)' }}>R$ {p.preço.toFixed(2)}</span>
                        </div>

                        {/* Card Actions */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                          <button onClick={() => handleEditProduct(p)} style={{ flex: 1, padding: '0.35rem 0.5rem', fontSize: '0.75rem', fontWeight: 600, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                            ✏️ Editar
                          </button>
                          <button onClick={() => handleDuplicateProduct(p)} style={{ flex: 1, padding: '0.35rem 0.5rem', fontSize: '0.75rem', fontWeight: 600, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                            📋 Duplicar
                          </button>
                          <button onClick={() => handleDeleteProduct(p.id)} style={{ flex: 1, padding: '0.35rem 0.5rem', fontSize: '0.75rem', fontWeight: 600, background: 'rgba(230, 57, 70, 0.05)', border: '1px solid rgba(230, 57, 70, 0.2)', borderRadius: '6px', color: 'var(--accent-error)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                            🗑️ Excluir
                          </button>
                          <button onClick={() => handleGenerateContent(p)} style={{ width: '100%', padding: '0.4rem 0.5rem', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(255, 90, 31, 0.1)', border: '1px solid rgba(255, 90, 31, 0.2)', borderRadius: '6px', color: 'var(--accent-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                            ✨ Gerar Conteúdo
                          </button>
                        </div>

                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* VIEW: PROMOÇÕES */}
          {activeTab === 'promocoes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem' }}>Ofertas e Descontos Ativos</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {promotions.map((p) => (
                  <div key={p.id} className="burger-ui-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>{p.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        Válido de: {new Date(p.startDate).toLocaleDateString()} até {new Date(p.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>
                        R$ {p.discount.toFixed(2)} OFF
                      </span>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>Desconto Aplicado</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: TV (TV Studio Advanced Visual Editor) */}
          {activeTab === 'tv' && (() => {
            const playlist = tvPlaylists[activeTvId] || [];
            const selectedItem = selectedTimelineIndex !== null ? playlist[selectedTimelineIndex] : null;

            // Calcula tempos acumulados para exibição estilo Timecode
            let accumulatedTime = 0;
            const timecodes = playlist.map((item) => {
              const current = accumulatedTime;
              accumulatedTime += item.duration;
              const mins = Math.floor(current / 60).toString().padStart(2, '0');
              const secs = (current % 60).toString().padStart(2, '0');
              return `${mins}:${secs}`;
            });

            // Biblioteca de Mídias agrupadas
            const getLibraryItemsBySubTab = () => {
              switch (libSubTab) {
                case 'sanduiches':
                  return products.filter(p => p.categoria.toLowerCase().includes('sanduiche') || p.categoria.toLowerCase().includes('smash') || p.categoria.toLowerCase().includes('burger') || p.categoria.toLowerCase().includes('hamburguer')).map(p => ({ 
                    name: p.nome, 
                    type: 'image', 
                    price: p.preço,
                    ingredients: Array.isArray(p.ingredientes) ? p.ingredientes.join(', ') : p.descrição,
                    mediaUrl: p.imagem || '/foto.png', 
                    icon: '🍔', 
                    desc: p.descrição 
                  }));
                case 'hot-dog':
                  return products.filter(p => p.categoria.toLowerCase().includes('hot dog') || p.categoria.toLowerCase().includes('dog')).map(p => ({ 
                    name: p.nome, 
                    type: 'image', 
                    price: p.preço,
                    ingredients: Array.isArray(p.ingredientes) ? p.ingredientes.join(', ') : p.descrição,
                    mediaUrl: p.imagem || '/foto.png', 
                    icon: '🌭', 
                    desc: p.descrição 
                  }));
                case 'porcoes':
                  return products.filter(p => p.categoria.toLowerCase().includes('porç') || p.categoria.toLowerCase().includes('porco') || p.categoria.toLowerCase().includes('batata')).map(p => ({ 
                    name: p.nome, 
                    type: 'image', 
                    price: p.preço,
                    ingredients: Array.isArray(p.ingredientes) ? p.ingredientes.join(', ') : p.descrição,
                    mediaUrl: p.imagem || '/batata.png', 
                    icon: '🍟', 
                    desc: p.descrição 
                  }));
                case 'pasteis':
                  return products.filter(p => p.categoria.toLowerCase().includes('pastel') || p.categoria.toLowerCase().includes('pasteis')).map(p => ({ 
                    name: p.nome, 
                    type: 'image', 
                    price: p.preço,
                    ingredients: Array.isArray(p.ingredientes) ? p.ingredientes.join(', ') : p.descrição,
                    mediaUrl: p.imagem || '/foto.png', 
                    icon: '🥟', 
                    desc: p.descrição 
                  }));
                case 'salgados':
                  return products.filter(p => p.categoria.toLowerCase().includes('salgado') || p.categoria.toLowerCase().includes('coxinha') || p.categoria.toLowerCase().includes('kibe')).map(p => ({ 
                    name: p.nome, 
                    type: 'image', 
                    price: p.preço,
                    ingredients: Array.isArray(p.ingredientes) ? p.ingredientes.join(', ') : p.descrição,
                    mediaUrl: p.imagem || '/foto.png', 
                    icon: '🥐', 
                    desc: p.descrição 
                  }));
                case 'refrigerantes':
                  return products.filter(p => p.categoria.toLowerCase().includes('refrigerante') || p.categoria.toLowerCase().includes('coca') || p.categoria.toLowerCase().includes('guarana')).map(p => ({ 
                    name: p.nome, 
                    type: 'image', 
                    price: p.preço,
                    ingredients: Array.isArray(p.ingredientes) ? p.ingredientes.join(', ') : p.descrição,
                    mediaUrl: p.imagem || '/foto.png', 
                    icon: '🥤', 
                    desc: p.descrição 
                  }));
                case 'sucos':
                  return products.filter(p => p.categoria.toLowerCase().includes('suco')).map(p => ({ 
                    name: p.nome, 
                    type: 'image', 
                    price: p.preço,
                    ingredients: Array.isArray(p.ingredientes) ? p.ingredientes.join(', ') : p.descrição,
                    mediaUrl: p.imagem || '/foto.png', 
                    icon: '🧃', 
                    desc: p.descrição 
                  }));
                case 'bebidas-alcoolicas':
                  return products.filter(p => p.categoria.toLowerCase().includes('alc') || p.categoria.toLowerCase().includes('cerveja') || p.categoria.toLowerCase().includes('chopp')).map(p => ({ 
                    name: p.nome, 
                    type: 'image', 
                    price: p.preço,
                    ingredients: Array.isArray(p.ingredientes) ? p.ingredientes.join(', ') : p.descrição,
                    mediaUrl: p.imagem || '/foto.png', 
                    icon: '🍺', 
                    desc: p.descrição 
                  }));
                case 'promocoes':
                  return promotions.map(p => ({ 
                    name: p.title, 
                    type: 'image', 
                    price: 29.90,
                    ingredients: `Promoção Especial com R$ ${p.discount.toFixed(2)} OFF`,
                    mediaUrl: '/foto.png', 
                    icon: '🎁', 
                    desc: `Desconto R$ ${p.discount.toFixed(2)}` 
                  }));
                case 'videos':
                  return libraryItems.filter(l => l.type === 'video').map(l => {
                    const clean = l.name.replace(/\s*-\s*V[ií]deo\s*\d+/gi, '').replace(/\s*V[ií]deo\s*\d+/gi, '').trim();
                    const matched = products.find(p => p.nome.toLowerCase() === clean.toLowerCase() || clean.toLowerCase().includes(p.nome.toLowerCase()));
                    return {
                      name: clean || l.name,
                      type: 'video',
                      price: matched ? matched.preço : 32.90,
                      ingredients: matched ? (Array.isArray(matched.ingredientes) ? matched.ingredientes.join(', ') : matched.descrição) : 'Ingredientes artesanais e selecionados.',
                      mediaUrl: l.url || '/video.mp4',
                      icon: '📹',
                      desc: `${l.format} • ${l.size}`
                    };
                  });
                case 'imagens':
                  return libraryItems.filter(l => l.type === 'image').map(l => {
                    const clean = l.name.replace(/\s*-\s*V[ií]deo\s*\d+/gi, '').replace(/\s*V[ií]deo\s*\d+/gi, '').trim();
                    const matched = products.find(p => p.nome.toLowerCase() === clean.toLowerCase() || clean.toLowerCase().includes(p.nome.toLowerCase()));
                    return {
                      name: clean || l.name,
                      type: 'image',
                      price: matched ? matched.preço : 32.90,
                      ingredients: matched ? (Array.isArray(matched.ingredientes) ? matched.ingredientes.join(', ') : matched.descrição) : 'Ingredientes artesanais e selecionados.',
                      mediaUrl: l.url || '/foto.png',
                      icon: '🖼',
                      desc: `${l.format} • ${l.resolution}`
                    };
                  });
                case 'musicas':
                  return [
                    { name: 'Rock Grelhado Loop', type: 'audio', icon: '🎵', desc: 'Clássico enérgico instrumental' },
                    { name: 'Country Smoke Road', type: 'audio', icon: '🎵', desc: 'Banjo e acústico rústico' },
                    { name: 'Lo-fi Burger Chill', type: 'audio', icon: '🎵', desc: 'Batidas relaxantes e jazz' },
                    { name: 'Pop Smash Beats', type: 'audio', icon: '🎵', desc: 'Ritmo moderno e comercial' },
                    { name: 'Instrumental Lounge', type: 'audio', icon: '🎵', desc: 'Sofisticado e calmo' }
                  ];
                case 'sons':
                  return [
                    { name: 'Som de Chapa Quente', type: 'audio', icon: '🔊', desc: 'Efeito sonoro hambúrguer' },
                    { name: 'Fritura de Batata Crocante', type: 'audio', icon: '🔊', desc: 'Efeito sonoro fritadeira' },
                    { name: 'Gongo de Pedido Pronto', type: 'audio', icon: '🔊', desc: 'Chamariz sonoro para clientes' }
                  ];
                case 'qrcodes':
                  return [{ name: 'WhatsApp Fazer Pedido QR', type: 'image', mediaUrl: activeClient?.qrCodeUrl || '/foto.png', icon: '📱', desc: 'Escaneie para iniciar WhatsApp' }];
                case 'logos':
                  return [{ name: activeClient?.name || 'Smash Logo', type: 'image', mediaUrl: activeClient?.logoUrl || '/foto.png', icon: '🏷', desc: 'Logotipo Identidade Visual' }];
                default:
                  return [];
              }
            };

            const handleAddToTimeline = (item: any) => {
              const isVid = item.type === 'video' || (item.mediaUrl && (item.mediaUrl.endsWith('.mp4') || item.mediaUrl.endsWith('.webm') || item.mediaUrl.includes('video') || item.mediaUrl.includes('mixkit') || item.mediaUrl.startsWith('data:video') || item.mediaUrl.startsWith('blob:')));
              const resolvedMediaUrl = isVid 
                ? (item.mediaUrl && (item.mediaUrl.endsWith('.mp4') || item.mediaUrl.endsWith('.webm') || item.mediaUrl.includes('video') || item.mediaUrl.includes('mixkit') || item.mediaUrl.startsWith('data:video') || item.mediaUrl.startsWith('blob:')) ? item.mediaUrl : '/video.mp4')
                : (item.mediaUrl || '/foto.png');

              const cleanName = (item.name || '').replace(/\s*-\s*V[ií]deo\s*\d+/gi, '').replace(/\s*V[ií]deo\s*\d+/gi, '').trim();
              const matchedProd = products.find(p => p.nome.toLowerCase() === cleanName.toLowerCase() || p.nome.toLowerCase() === item.name.toLowerCase());
              const itemPrice = item.price !== undefined ? Number(item.price) : (matchedProd ? matchedProd.preço : 32.90);
              const itemIngredients = item.ingredients || (matchedProd ? (Array.isArray(matchedProd.ingredientes) ? matchedProd.ingredientes.join(', ') : matchedProd.descrição) : 'Pão artesanal, blend selecionado e ingredientes frescos.');

              const newItem = {
                id: 'item-' + Date.now(),
                name: cleanName || item.name,
                type: isVid ? 'video' : (item.type === 'audio' ? 'image' : (item.type || 'image')),
                duration: isVid ? 12 : 10,
                transition: 'fade',
                price: itemPrice,
                ingredients: itemIngredients,
                showPrice: true,
                showIngredients: true,
                showQr: true,
                themeColor: activeClient?.primaryColor || '#050508',
                fontFamily: 'Outfit',
                mediaUrl: resolvedMediaUrl
              };
              const updated = {
                ...tvPlaylists,
                [activeTvId]: [...playlist, newItem]
              };
              setTvPlaylists(updated);
              setSelectedTimelineIndex(playlist.length);
              saveTvStudioState(updated);
            };

            const handleUpdateItemProperty = (index: number, key: string, value: any) => {
              const updatedList = [...playlist];
              updatedList[index] = {
                ...updatedList[index],
                [key]: value
              };
              const updated = {
                ...tvPlaylists,
                [activeTvId]: updatedList
              };
              setTvPlaylists(updated);
              saveTvStudioState(updated);
            };

            const handleMoveItem = (index: number, direction: 'left' | 'right') => {
              if (direction === 'left' && index === 0) return;
              if (direction === 'right' && index === playlist.length - 1) return;
              const targetIndex = direction === 'left' ? index - 1 : index + 1;
              const updatedList = [...playlist];
              const temp = updatedList[index];
              updatedList[index] = updatedList[targetIndex];
              updatedList[targetIndex] = temp;
              
              const updated = {
                ...tvPlaylists,
                [activeTvId]: updatedList
              };
              setTvPlaylists(updated);
              setSelectedTimelineIndex(targetIndex);
              saveTvStudioState(updated);
            };

            const handleDeleteTimelineItem = (index: number) => {
              const updatedList = playlist.filter((_, i) => i !== index);
              const updated = {
                ...tvPlaylists,
                [activeTvId]: updatedList
              };
              setTvPlaylists(updated);
              setSelectedTimelineIndex(updatedList.length > 0 ? Math.max(0, index - 1) : null);
              saveTvStudioState(updated);
            };

            const notifyTvPlaylistUpdate = (updatedPlaylists?: Record<string, any[]>) => {
              try {
                const channel = new BroadcastChannel('burger_tv_sync');
                channel.postMessage({
                  type: 'PLAYLIST_UPDATE',
                  playlists: updatedPlaylists || tvPlaylists,
                  activeTvId,
                  timestamp: Date.now()
                });
                channel.close();
              } catch (e) {}
              fetch('http://localhost:3001/api/tv/sync').catch(() => {});
            };

            const saveTvStudioState = (updatedPlaylists: Record<string, any[]>) => {
              safeSetLocalStorage('burger_studio_tv_playlists', JSON.stringify(updatedPlaylists));
              fetch('http://localhost:3001/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  playlists: updatedPlaylists,
                  activeTvId,
                  activeMusic: selectedMusic,
                  adIntervalMinutes: adInterval,
                  adPartnerName: adPartner,
                  adDurationSeconds: adDuration,
                  activeTurno
                })
              }).catch(() => {});

              // Cloud Sync to Supabase Realtime
              try {
                const { createClient } = require('@supabase/supabase-js');
                const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qjhrlqpsfzaycoaekwqh.supabase.co';
                const sbKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_c0x3S20RA_xIVMed3cPpFQ_kO1XXul6';
                const sb = createClient(sbUrl, sbKey);
                sb.from('tv_settings').upsert({
                  id: 'default',
                  playlists: updatedPlaylists,
                  active_tv_id: activeTvId,
                  active_music: selectedMusic,
                  active_turno: activeTurno,
                  ad_interval_minutes: adInterval,
                  ad_partner_name: adPartner,
                  ad_duration_seconds: adDuration,
                  updated_at: new Date().toISOString()
                }).then(() => {}).catch(() => {});
              } catch (e) {}

              notifyTvPlaylistUpdate(updatedPlaylists);
            };

            const handlePublishTV = () => {
              saveTvStudioState(tvPlaylists);
              notifyTvPlaylistUpdate(tvPlaylists);
              alert('Playlist e configurações publicadas para as TVs com sucesso! 📺⚡');
            };

            const handleApplyToAllTvs = () => {
              const currentTimeline = [...playlist];
              const allTvsPlaylists: Record<string, any[]> = {
                'tv-salao': JSON.parse(JSON.stringify(currentTimeline)),
                'tv-caixa': JSON.parse(JSON.stringify(currentTimeline)),
                'tv-delivery': JSON.parse(JSON.stringify(currentTimeline)),
                'tv-drive': JSON.parse(JSON.stringify(currentTimeline)),
                'tv-outdoor': JSON.parse(JSON.stringify(currentTimeline))
              };
              setTvPlaylists(allTvsPlaylists);
              saveTvStudioState(allTvsPlaylists);
              notifyTvPlaylistUpdate(allTvsPlaylists);
              alert('Esta Timeline foi aplicada com sucesso para TODAS as 5 TVs (Salão, Caixa, Delivery, Drive-Thru e Outdoor)! 📺⚡');
            };

            const handleDuplicateTvPlaylist = () => {
              const targetTv = prompt('Digite o ID do canal destino para duplicar (ex: tv-caixa, tv-salao, tv-delivery, tv-drive, tv-outdoor):', 'tv-caixa');
              if (targetTv && tvPlaylists[targetTv] !== undefined) {
                const updated = {
                  ...tvPlaylists,
                  [targetTv]: [...playlist]
                };
                setTvPlaylists(updated);
                saveTvStudioState(updated);
                alert(`Playlist duplicada para a ${targetTv} com sucesso!`);
              }
            };

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* TOP HEADER CONTROLS */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', background: 'rgba(255, 90, 31, 0.04)', border: '1px solid rgba(255, 90, 31, 0.12)', padding: '1.5rem', borderRadius: '16px' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>📺</span> TV STUDIO <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--accent-primary)', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>EDITOR PROFISSIONAL</span>
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', margin: 0 }}>
                      Gerencie a programação das TVs em tempo real com agendamento inteligente.
                    </p>
                    <button
                      onClick={() => window.open(PLAYER_URL, '_blank')}
                      style={{
                        marginTop: '0.6rem',
                        padding: '0.4rem 0.9rem',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        borderRadius: '8px',
                        border: '1px solid var(--accent-primary)',
                        backgroundColor: 'rgba(255, 90, 31, 0.15)',
                        color: 'var(--accent-primary)',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <span>📺</span> Abrir TV Player (Tela Cheia) ↗
                    </button>
                  </div>

                  {/* SELECT MULTI-TVS */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800 }}>SELECIONE O CANAL DE TV:</span>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {[
                        { id: 'tv-salao', label: 'TV Salão 🛋️' },
                        { id: 'tv-caixa', label: 'TV Caixa 💳' },
                        { id: 'tv-delivery', label: 'TV Delivery 🛵' },
                        { id: 'tv-drive', label: 'TV Drive-Thru 🚗' },
                        { id: 'tv-outdoor', label: 'TV Outdoor 🏙️' }
                      ].map((tv) => (
                        <button
                          key={tv.id}
                          onClick={() => {
                            setActiveTvId(tv.id);
                            setSelectedTimelineIndex(playlist.length > 0 ? 0 : null);
                          }}
                          style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            borderRadius: '8px',
                            border: '1px solid',
                            cursor: 'pointer',
                            transition: 'var(--transition-fast)',
                            backgroundColor: activeTvId === tv.id ? 'var(--accent-primary)' : 'rgba(255,255,255,0.03)',
                            borderColor: activeTvId === tv.id ? 'var(--accent-primary)' : 'var(--border-subtle)',
                            color: activeTvId === tv.id ? '#fff' : 'var(--text-primary)'
                          }}
                        >
                          {tv.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SELECT TURNOS */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800 }}>AGENDAMENTO DE TURNOS:</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {[
                        { id: 'cafe', label: '☕ Café (08h)' },
                        { id: 'almoco', label: '🍔 Almoço (11h)' },
                        { id: 'happyhour', label: '🍻 Happy Hour (18h)' },
                        { id: 'delivery', label: '🛵 Delivery (22h)' }
                      ].map((turno) => (
                        <button
                          key={turno.id}
                          onClick={() => {
                            setActiveTurno(turno.id);
                            alert(`Turno "${turno.label}" selecionado para testes de automação!`);
                          }}
                          style={{
                            padding: '0.4rem 0.8rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            borderRadius: '20px',
                            border: '1px solid',
                            cursor: 'pointer',
                            backgroundColor: activeTurno === turno.id ? 'var(--accent-success)' : 'rgba(255,255,255,0.02)',
                            borderColor: activeTurno === turno.id ? 'var(--accent-success)' : 'var(--border-subtle)',
                            color: activeTurno === turno.id ? '#000' : 'var(--text-secondary)'
                          }}
                        >
                          {turno.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3 COLUMNS STUDIO LAYOUT */}
                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 320px', gap: '1.5rem', minHeight: '480px' }}>
                  
                  {/* COLUMN 1: BIBLIOTECA INTELIGENTE */}
                  <div className="burger-ui-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', overflow: 'hidden' }}>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', margin: 0, paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                      📚 Biblioteca Inteligente
                    </h4>

                    {/* Sub-tab selection vertical grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.25rem' }}>
                      {[
                        { id: 'sanduiches', label: '🍔 Sanduba' },
                        { id: 'hot-dog', label: '🌭 Hot Dog' },
                        { id: 'porcoes', label: '🍟 Porção' },
                        { id: 'pasteis', label: '🥟 Pastel' },
                        { id: 'salgados', label: '🥐 Salgado' },
                        { id: 'refrigerantes', label: '🥤 Refrig.' },
                        { id: 'sucos', label: '🧃 Suco' },
                        { id: 'bebidas-alcoolicas', label: '🍺 Álcool' },
                        { id: 'promocoes', label: '🎁 Promo' },
                        { id: 'videos', label: '📹 Vídeo' },
                        { id: 'imagens', label: '🖼 Foto' },
                        { id: 'musicas', label: '🎵 Som' },
                        { id: 'qrcodes', label: '📱 QR' },
                        { id: 'logos', label: '🏷 Logo' }
                      ].map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => setLibSubTab(sub.id)}
                          style={{
                            padding: '0.35rem 0.2rem',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            borderRadius: '6px',
                            border: '1px solid var(--border-subtle)',
                            cursor: 'pointer',
                            backgroundColor: libSubTab === sub.id ? 'var(--accent-primary)' : 'transparent',
                            color: libSubTab === sub.id ? '#fff' : 'var(--text-secondary)',
                            textAlign: 'center'
                          }}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>

                    {/* Scrollable list of items */}
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '0.25rem', maxHeight: '350px' }}>
                      {getLibraryItemsBySubTab().map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '8px',
                            padding: '0.5rem',
                            gap: '0.5rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                            <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                            <div style={{ overflow: 'hidden' }}>
                              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.desc}</div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleAddToTimeline(item)}
                            title="Adicionar à Timeline"
                            style={{
                              backgroundColor: 'rgba(255, 90, 31, 0.1)',
                              border: '1px solid rgba(255, 90, 31, 0.2)',
                              color: 'var(--accent-primary)',
                              borderRadius: '4px',
                              padding: '0.2rem 0.4rem',
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                          >
                            + Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* COLUMN 2: TV PREVIEW FRAME */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{
                      width: '100%',
                      aspectRatio: '16/9',
                      backgroundColor: selectedItem?.themeColor || '#050508',
                      borderRadius: '20px',
                      border: '10px solid #1E1E24',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.8), var(--shadow-glow)',
                      overflow: 'hidden',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: selectedItem?.fontFamily || "'Outfit', sans-serif"
                    }}>
                      {selectedItem ? (
                        <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', color: '#fff' }}>
                          
                          {/* Top badge */}
                          <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center', zIndex: 10 }}>
                            <span style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '0.25rem 0.6rem', borderRadius: '4px' }}>
                              {selectedItem.duration}s • Transição: {selectedItem.transition}
                            </span>
                          </div>

                          {/* Slide presentation body */}
                          <div
                            key={'prev-slide-' + selectedItem.id}
                            style={{
                              width: '100%',
                              height: '100%',
                              display: 'grid',
                              gridTemplateColumns: '1.2fr 1fr',
                              animation: (() => {
                                const tr = selectedItem.transition || 'fade';
                                if (tr === 'slide') return 'charmingSlide 0.85s cubic-bezier(0.16, 1, 0.3, 1) both';
                                if (tr === 'zoom') return 'charmingZoom 0.9s cubic-bezier(0.16, 1, 0.3, 1) both';
                                if (tr === 'curtain' || tr === 'sweep') return 'charmingCurtain 0.8s cubic-bezier(0.16, 1, 0.3, 1) both';
                                if (tr === 'instant') return 'none';
                                return 'charmingFade 0.85s cubic-bezier(0.16, 1, 0.3, 1) both';
                              })()
                            }}
                          >
                            <div style={{ position: 'relative', overflow: 'hidden', background: '#000' }}>
                              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.55) 100%)', zIndex: 2, pointerEvents: 'none' }} />
                              
                              {selectedItem.type === 'video' || (selectedItem.mediaUrl && (selectedItem.mediaUrl.endsWith('.mp4') || selectedItem.mediaUrl.endsWith('.webm') || selectedItem.mediaUrl.includes('video') || selectedItem.mediaUrl.includes('mixkit') || selectedItem.mediaUrl.startsWith('data:video') || selectedItem.mediaUrl.startsWith('blob:'))) ? (
                                <video
                                  key={selectedItem.mediaUrl || 'dashboard-tv-video'}
                                  src={selectedItem.mediaUrl && (selectedItem.mediaUrl.endsWith('.mp4') || selectedItem.mediaUrl.endsWith('.webm') || selectedItem.mediaUrl.includes('video') || selectedItem.mediaUrl.includes('mixkit') || selectedItem.mediaUrl.startsWith('data:video') || selectedItem.mediaUrl.startsWith('blob:')) ? selectedItem.mediaUrl : '/video.mp4'}
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                  controls={false}
                                  onError={(e) => {
                                    const v = e.currentTarget;
                                    if (v.src && !v.src.endsWith('/video.mp4')) {
                                      v.src = '/video.mp4';
                                      v.load();
                                      v.play().catch(() => {});
                                    }
                                  }}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              ) : (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={selectedItem.mediaUrl || '/foto.png'}
                                  alt={selectedItem.name}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover', animation: 'kenBurnsMedia 12s ease-out infinite alternate' }}
                                  onError={(e) => { (e.target as any).src = '/foto.png'; }}
                                />
                              )}
                            </div>
                            
                            <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem', background: 'rgba(0,0,0,0.85)' }}>
                              <h2 
                                key={'prev-title-' + selectedItem.id + '-' + (selectedItem.name || '')}
                                style={{ 
                                  fontSize: '2.2rem', 
                                  fontWeight: 900, 
                                  color: '#fff', 
                                  fontFamily: selectedItem.fontFamily, 
                                  margin: 0,
                                  animation: 'textEntranceTitle 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both'
                                }}
                              >
                                {(selectedItem.name || '').replace(/\s*-\s*V[ií]deo\s*\d+/gi, '').replace(/\s*V[ií]deo\s*\d+/gi, '').trim()}
                              </h2>
                              
                              {selectedItem.showIngredients && (
                                <p 
                                  key={'prev-desc-' + selectedItem.id}
                                  style={{ 
                                    color: 'var(--text-secondary)', 
                                    fontSize: '0.85rem', 
                                    lineHeight: 1.4, 
                                    margin: 0,
                                    animation: 'textEntranceDesc 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both'
                                  }}
                                >
                                  {selectedItem.ingredients || (() => {
                                    const clean = (selectedItem.name || '').replace(/\s*-\s*V[ií]deo\s*\d+/gi, '').replace(/\s*V[ií]deo\s*\d+/gi, '').trim();
                                    const matched = products.find(p => p.nome.toLowerCase() === clean.toLowerCase() || p.nome.toLowerCase() === selectedItem.name.toLowerCase());
                                    return matched ? (Array.isArray(matched.ingredientes) ? `Ingredientes: ${matched.ingredientes.join(', ')}` : matched.descrição) : 'Ingredientes selecionados e ingredientes frescos de alta qualidade.';
                                  })()}
                                </p>
                              )}

                              {selectedItem.showPrice && (
                                <div 
                                  key={'prev-price-' + selectedItem.id + '-' + selectedItem.price}
                                  style={{ 
                                    fontSize: '2rem', 
                                    fontWeight: 900, 
                                    color: 'var(--accent-secondary)',
                                    textShadow: '0 4px 20px rgba(255, 183, 3, 0.3)',
                                    animation: 'textEntrancePrice 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) 0.55s both'
                                  }}
                                >
                                  R$ {(selectedItem.price !== undefined ? Number(selectedItem.price) : (() => {
                                    const clean = (selectedItem.name || '').replace(/\s*-\s*V[ií]deo\s*\d+/gi, '').replace(/\s*V[ií]deo\s*\d+/gi, '').trim();
                                    const matched = products.find(p => p.nome.toLowerCase() === clean.toLowerCase() || p.nome.toLowerCase() === selectedItem.name.toLowerCase());
                                    return matched ? matched.preço : 32.90;
                                  })()).toFixed(2).replace('.', ',')}
                                </div>
                              )}

                              {selectedItem.showQr && (
                                <div 
                                  key={'prev-qr-' + selectedItem.id}
                                  style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '0.5rem', 
                                    marginTop: '0.5rem', 
                                    background: 'rgba(255,255,255,0.05)', 
                                    padding: '0.4rem 0.8rem', 
                                    borderRadius: '8px', 
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    animation: 'textEntranceQr 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.75s both'
                                  }}
                                >
                                  <span style={{ fontSize: '1.2rem' }}>📱</span>
                                  <div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 700 }}>PEÇA SEM FILAS</div>
                                    <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>Escaneie para pedir via WhatsApp</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                        </div>
                      ) : (
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>
                          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📺</span>
                          Nenhum slide selecionado na Timeline.<br />Adicione ou selecione um item para ver o preview.
                        </div>
                      )}
                    </div>

                    {/* Connection Status and Address info */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(46, 196, 182, 0.05)', border: '1px solid rgba(46, 196, 182, 0.15)', borderRadius: '10px', padding: '0.5rem 1rem', fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--accent-success)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-success)', display: 'inline-block' }} />
                        SINAL DO CANAL ATIVO: {PLAYER_URL}
                      </span>
                      <a href={PLAYER_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 700 }}>Abrir TV Player Fullscreen</a>
                    </div>
                  </div>

                  {/* COLUMN 3: PROPERTIES PANEL */}
                  <div className="burger-ui-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', margin: 0, paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                      ⚙️ Propriedades do Item
                    </h4>

                    {selectedItem ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.8rem' }}>
                        <div>
                          <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 700 }}>NOME:</label>
                          <input
                            type="text"
                            value={selectedItem.name}
                            onChange={(e) => handleUpdateItemProperty(selectedTimelineIndex!, 'name', e.target.value)}
                            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '0.4rem', color: '#fff' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 700 }}>PREÇO (R$):</label>
                          <input
                            type="number"
                            step="0.01"
                            value={selectedItem.price !== undefined ? selectedItem.price : (() => {
                              const clean = (selectedItem.name || '').replace(/\s*-\s*V[ií]deo\s*\d+/gi, '').replace(/\s*V[ií]deo\s*\d+/gi, '').trim();
                              const matched = products.find(p => p.nome.toLowerCase() === clean.toLowerCase() || p.nome.toLowerCase() === selectedItem.name.toLowerCase());
                              return matched ? matched.preço : 32.90;
                            })()}
                            onChange={(e) => handleUpdateItemProperty(selectedTimelineIndex!, 'price', Number(e.target.value))}
                            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '0.4rem', color: '#fff' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 700 }}>INGREDIENTES / DESCRIÇÃO:</label>
                          <textarea
                            rows={2}
                            value={selectedItem.ingredients !== undefined ? selectedItem.ingredients : (() => {
                              const clean = (selectedItem.name || '').replace(/\s*-\s*V[ií]deo\s*\d+/gi, '').replace(/\s*V[ií]deo\s*\d+/gi, '').trim();
                              const matched = products.find(p => p.nome.toLowerCase() === clean.toLowerCase() || p.nome.toLowerCase() === selectedItem.name.toLowerCase());
                              return matched ? (Array.isArray(matched.ingredientes) ? matched.ingredientes.join(', ') : matched.descrição) : '';
                            })()}
                            onChange={(e) => handleUpdateItemProperty(selectedTimelineIndex!, 'ingredients', e.target.value)}
                            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '0.4rem', color: '#fff', fontSize: '0.75rem', resize: 'vertical' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 700 }}>TIPO:</label>
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <button
                              onClick={() => handleUpdateItemProperty(selectedTimelineIndex!, 'type', 'video')}
                              style={{
                                flex: 1,
                                padding: '0.35rem',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                backgroundColor: selectedItem.type === 'video' ? 'var(--accent-primary)' : 'transparent',
                                color: selectedItem.type === 'video' ? '#fff' : 'var(--text-secondary)'
                              }}
                            >
                              Vídeo
                            </button>
                            <button
                              onClick={() => handleUpdateItemProperty(selectedTimelineIndex!, 'type', 'image')}
                              style={{
                                flex: 1,
                                padding: '0.35rem',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                backgroundColor: selectedItem.type === 'image' ? 'var(--accent-primary)' : 'transparent',
                                color: selectedItem.type === 'image' ? '#fff' : 'var(--text-secondary)'
                              }}
                            >
                              Imagem
                            </button>
                          </div>
                        </div>

                        <div>
                          <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 700 }}>DURAÇÃO (SEGUNDOS): {selectedItem.duration}s</label>
                          <input
                            type="range"
                            min="3"
                            max="30"
                            value={selectedItem.duration}
                            onChange={(e) => handleUpdateItemProperty(selectedTimelineIndex!, 'duration', Number(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 700 }}>TRANSIÇÃO:</label>
                          <select
                            value={selectedItem.transition}
                            onChange={(e) => handleUpdateItemProperty(selectedTimelineIndex!, 'transition', e.target.value)}
                            style={{ width: '100%', background: '#121216', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '0.4rem', color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}
                          >
                            <option value="fade">✨ Dissolver Suave (Fade & Glow)</option>
                            <option value="slide">💫 Deslize Elegante (Smooth Glide)</option>
                            <option value="zoom">🎬 Zoom Cinemático (Depth Pop)</option>
                            <option value="sweep">🌟 Faixa de Luz Dourada (Golden Flare Sweep)</option>
                            <option value="curtain">🎭 Revelação Gourmet (Curtain Wipe)</option>
                            <option value="instant">⚡ Corte Direto (Instant)</option>
                          </select>
                        </div>

                        {/* Visibilidades */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.25rem' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={selectedItem.showPrice}
                              onChange={(e) => handleUpdateItemProperty(selectedTimelineIndex!, 'showPrice', e.target.checked)}
                            />
                            <span>Mostrar Preço</span>
                          </label>

                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={selectedItem.showIngredients}
                              onChange={(e) => handleUpdateItemProperty(selectedTimelineIndex!, 'showIngredients', e.target.checked)}
                            />
                            <span>Mostrar Ingredientes</span>
                          </label>

                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={selectedItem.showQr}
                              onChange={(e) => handleUpdateItemProperty(selectedTimelineIndex!, 'showQr', e.target.checked)}
                            />
                            <span>Mostrar QR Code</span>
                          </label>
                        </div>

                        {/* Styling customization */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '0.5rem', marginTop: '0.25rem' }}>
                          <div>
                            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.25rem', fontSize: '0.65rem', fontWeight: 800 }}>FONTE:</label>
                            <select
                              value={selectedItem.fontFamily}
                              onChange={(e) => handleUpdateItemProperty(selectedTimelineIndex!, 'fontFamily', e.target.value)}
                              style={{ width: '100%', background: '#121216', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '0.25rem', color: '#fff', fontSize: '0.7rem' }}
                            >
                              <option value="Outfit">Outfit</option>
                              <option value="Bebas Neue">Bebas Neue</option>
                              <option value="'Playfair Display', serif">Playfair</option>
                            </select>
                          </div>
                          <div>
                            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.25rem', fontSize: '0.65rem', fontWeight: 800 }}>COR DE FUNDO:</label>
                            <input
                              type="color"
                              value={selectedItem.themeColor}
                              onChange={(e) => handleUpdateItemProperty(selectedTimelineIndex!, 'themeColor', e.target.value)}
                              style={{ width: '100%', height: '24px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }}
                            />
                          </div>
                        </div>

                        <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
                          <button
                            onClick={() => {
                              const newUrl = prompt('Insira o endereço (URL) da nova imagem ou vídeo da biblioteca de mídias:', selectedItem.mediaUrl);
                              if (newUrl) handleUpdateItemProperty(selectedTimelineIndex!, 'mediaUrl', newUrl);
                            }}
                            style={{
                              width: '100%',
                              padding: '0.4rem',
                              backgroundColor: 'rgba(255,255,255,0.03)',
                              border: '1px solid var(--border-subtle)',
                              color: '#fff',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: 700,
                              fontSize: '0.75rem'
                            }}
                          >
                            🖼️ Trocar Imagem/Vídeo
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.75rem', padding: '2rem 0' }}>
                        Selecione um bloco da Timeline abaixo para ver e editar suas propriedades aqui.
                      </div>
                    )}
                  </div>
                </div>

                {/* TIMELINE (PREMIERE STYLE MULTITRACK CONTROLLER) */}
                <div className="burger-ui-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>🎞️</span>
                      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', margin: 0 }}>Timeline Principal do Canal</h4>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Looping automático</span>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-success)', display: 'inline-block' }} />
                    </div>
                  </div>

                  {/* Horizontal Scroll Timeline Tracks Container */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', backgroundColor: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '0.75rem', overflowX: 'auto' }}>
                    
                    {/* Timecode markers */}
                    <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.25rem' }}>
                      <div style={{ width: '100px', flexShrink: 0, fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>TIMECODE</div>
                      <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
                        {timecodes.map((tc, index) => (
                          <div key={index} style={{ width: '160px', flexShrink: 0, fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                            {tc} ({playlist[index]?.duration}s)
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Track 1: Media Slides */}
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ width: '100px', flexShrink: 0, fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span>🖼️</span> Mídia
                      </div>

                      <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
                        {playlist.map((item, index) => (
                          <div
                            key={item.id}
                            onClick={() => setSelectedTimelineIndex(index)}
                            style={{
                              width: '160px',
                              flexShrink: 0,
                              background: selectedTimelineIndex === index ? 'linear-gradient(135deg, rgba(255, 90, 31, 0.25), rgba(255, 183, 3, 0.15))' : 'rgba(255,255,255,0.02)',
                              border: selectedTimelineIndex === index ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                              borderRadius: '8px',
                              padding: '0.5rem',
                              cursor: 'pointer',
                              position: 'relative',
                              transition: 'var(--transition-fast)'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <span style={{ fontSize: '1rem' }}>{item.type === 'video' ? '📹' : '🖼️'}</span>
                              <div style={{ fontSize: '0.7rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#fff' }}>{item.name}</div>
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '0.25rem' }}>
                              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{item.duration}s • {item.transition}</span>
                              <div style={{ display: 'flex', gap: '0.2rem' }}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMoveItem(index, 'left');
                                  }}
                                  disabled={index === 0}
                                  title="Mover para esquerda"
                                  style={{ border: 'none', background: 'transparent', color: index === 0 ? 'var(--text-muted)' : '#fff', cursor: 'pointer', fontSize: '0.65rem' }}
                                >
                                  ◀
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMoveItem(index, 'right');
                                  }}
                                  disabled={index === playlist.length - 1}
                                  title="Mover para direita"
                                  style={{ border: 'none', background: 'transparent', color: index === playlist.length - 1 ? 'var(--text-muted)' : '#fff', cursor: 'pointer', fontSize: '0.65rem' }}
                                >
                                  ▶
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteTimelineItem(index);
                                  }}
                                  title="Remover"
                                  style={{ border: 'none', background: 'transparent', color: 'var(--accent-error)', cursor: 'pointer', fontSize: '0.65rem', marginLeft: '0.2rem' }}
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Quick append block */}
                        <div
                          onClick={() => handleAddToTimeline({ name: 'Novo Hambúrguer', type: 'image', mediaUrl: '/foto.png' })}
                          style={{
                            width: '160px',
                            flexShrink: 0,
                            border: '1px dashed var(--border-subtle)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.5rem',
                            height: '56px'
                          }}
                        >
                          + Novo Slide
                        </div>
                      </div>
                    </div>

                    {/* Track 2: Background Music (BGM) */}
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '0.5rem' }}>
                      <div style={{ width: '100px', flexShrink: 0, fontSize: '0.75rem', fontWeight: 800, color: '#B5179E', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span>🎵</span> Áudio
                      </div>
                      
                      <div style={{ flex: 1, background: 'rgba(181, 23, 158, 0.08)', border: '1px solid rgba(181, 23, 158, 0.25)', borderRadius: '8px', padding: '0.4rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: '#fff', fontWeight: 700 }}>
                          Trilha Sonora ativa: <span style={{ color: 'var(--accent-secondary)' }}>{selectedMusic} Loop</span>
                        </span>
                        
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          {['Rock', 'Country', 'Lo-fi', 'Pop', 'Instrumental'].map((track) => (
                            <button
                              key={track}
                              onClick={() => {
                                setSelectedMusic(track);
                              }}
                              style={{
                                padding: '0.2rem 0.5rem',
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                borderRadius: '4px',
                                border: '1px solid rgba(181, 23, 158, 0.3)',
                                cursor: 'pointer',
                                backgroundColor: selectedMusic === track ? '#B5179E' : 'transparent',
                                color: '#fff'
                              }}
                            >
                              {track}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Track 3: Ads & Sponsored Injections */}
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '0.5rem' }}>
                      <div style={{ width: '100px', flexShrink: 0, fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span>📢</span> Anúncios
                      </div>

                      <div style={{ flex: 1, background: 'rgba(46, 196, 182, 0.05)', border: '1px solid rgba(46, 196, 182, 0.25)', borderRadius: '8px', padding: '0.5rem 1rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '0.75rem', color: '#fff', fontWeight: 700 }}>
                          Comerciais Patrocinados: <span style={{ color: 'var(--accent-success)' }}>Injetar {adPartner} por {adDuration}s a cada {adInterval} minutos</span>
                        </span>

                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <div>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginRight: '0.25rem' }}>Parceiro:</span>
                            <input
                              type="text"
                              value={adPartner}
                              onChange={(e) => {
                                setAdPartner(e.target.value);
                              }}
                              style={{ width: '80px', background: '#121216', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff', fontSize: '0.65rem', padding: '0.15rem' }}
                            />
                          </div>

                          <div>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginRight: '0.25rem' }}>Minutos:</span>
                            <input
                              type="number"
                              value={adInterval}
                              onChange={(e) => {
                                setAdInterval(Number(e.target.value));
                              }}
                              style={{ width: '40px', background: '#121216', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff', fontSize: '0.65rem', padding: '0.15rem' }}
                            />
                          </div>

                          <div>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginRight: '0.25rem' }}>Duração (s):</span>
                            <input
                              type="number"
                              value={adDuration}
                              onChange={(e) => {
                                setAdDuration(Number(e.target.value));
                              }}
                              style={{ width: '40px', background: '#121216', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#fff', fontSize: '0.65rem', padding: '0.15rem' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* BOTTOM STUDIO CONTROL PANEL */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
                  <button onClick={() => {
                    saveTvStudioState(tvPlaylists);
                    alert('Playlists salvas no servidor local com sucesso! 💾');
                  }} style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>
                    Salvar Projeto
                  </button>

                  <button onClick={handleDuplicateTvPlaylist} style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>
                    Duplicar Canal
                  </button>

                  <button onClick={handlePublishTV} style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem', fontWeight: 900, background: 'linear-gradient(135deg, #FF5A1F, #FF8C00)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', boxShadow: '0 4px 14px rgba(255, 90, 31, 0.4)' }}>
                    Publicar nas TVs ⚡
                  </button>

                  <button onClick={() => {
                    alert('Simulando renderização de grade horária... Playlist sincronizada com sucesso!');
                  }} style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, background: 'rgba(46, 196, 182, 0.1)', border: '1px solid rgba(46, 196, 182, 0.25)', borderRadius: '8px', color: 'var(--accent-success)', cursor: 'pointer' }}>
                    Simular Grade
                  </button>

                  <button onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tvPlaylists, null, 2));
                    const downloadAnchor = document.createElement('a');
                    downloadAnchor.setAttribute("href",     dataStr);
                    downloadAnchor.setAttribute("download", `tv_studio_playlist_${activeTvId}.json`);
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    downloadAnchor.remove();
                  }} style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>
                    Exportar JSON
                  </button>

                  <button onClick={handleApplyToAllTvs} style={{ marginLeft: 'auto', padding: '0.6rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, background: 'rgba(46, 196, 182, 0.15)', border: '1px solid var(--accent-success)', borderRadius: '8px', color: 'var(--accent-success)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>📡</span> Aplicar Playlist em Todas as TVs (Sincronizar)
                  </button>
                </div>

              </div>
            );
          })()}





          {/* VIEW: CONFIGURAÇÕES */}
          {activeTab === 'configuracoes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '720px' }}>
              <div className="burger-ui-card">
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1.5rem' }}>Parâmetros dos Modelos de Inteligência Artificial</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="burger-ui-form-group">
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Modelo de Linguagem (Copywriting)</label>
                    <select className="burger-ui-input" defaultValue="gemini-3.5-flash">
                      <option value="gemini-3.5-flash">Gemini 3.5 Flash (Recommended)</option>
                      <option value="gpt-4o">GPT-4o</option>
                      <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                    </select>
                  </div>

                  <div className="burger-ui-form-group">
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Gerador de Imagens (Midjourney API / Stable Diffusion)</label>
                    <select className="burger-ui-input" defaultValue="midjourney-v6">
                      <option value="midjourney-v6">Midjourney v6 (Prompts otimizados)</option>
                      <option value="flux-1-dev">Flux.1 Dev</option>
                      <option value="stable-diffusion-3">Stable Diffusion 3.0</option>
                    </select>
                  </div>

                  <div className="burger-ui-form-group">
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Temperatura do Modelo</label>
                    <input type="range" min="0" max="1" step="0.1" defaultValue="0.7" style={{ accentColor: 'var(--accent-primary)' }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Valores mais altos geram descrições mais criativas e adjetivadas.</span>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button>Salvar Configurações</Button>
                  </div>
                </div>
              </div>

              {/* Template system section */}
              <div className="burger-ui-card" style={{ marginTop: '2rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🎨</span> Sistema de Templates & Identidade Visual
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Selecione o modelo visual para sincronizar instantaneamente toda a identidade visual de campanhas, TVs e posts da hamburgueria.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  {[
                    { id: 'insta-01', label: 'Template Instagram 01', type: 'Instagram', desc: 'Preto minimalista (Sleek Dark) com brilho dourado premium.' },
                    { id: 'insta-02', label: 'Template Instagram 02', type: 'Instagram', desc: 'Laranja e amarelo vibrante de alta conversão (Vibrant Fire).' },
                    { id: 'tv-01', label: 'Template TV 01 (Cyber Neon)', type: 'TV Signage', desc: 'Modo Cyber Neon com ciano e laranja contrastantes.' },
                    { id: 'tv-premium', label: 'Template TV Premium (Gold & Wood)', type: 'TV Signage', desc: 'Premium dourado marmorizado com tipografia clássica.' },
                    { id: 'story-dark', label: 'Template Story Escuro', type: 'Stories', desc: 'Fundo escuro aquecido ideal para promoções noturnas.' },
                    { id: 'story-light', label: 'Template Story Claro', type: 'Stories', desc: 'Branco fresco e minimalista ideal para combos diurnos.' },
                    { id: 'banner', label: 'Template Banner (Crimson)', type: 'Banners', desc: 'Vermelho e azul contrastantes de alto impacto promocional.' }
                  ].map((theme) => {
                    const active = activeTheme === theme.id;
                    return (
                      <div
                        key={theme.id}
                        onClick={() => changeActiveTheme(theme.id)}
                        style={{
                          border: active ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                          borderRadius: '12px',
                          padding: '1.25rem',
                          background: active ? 'rgba(255, 90, 31, 0.04)' : 'rgba(255, 255, 255, 0.01)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.4rem',
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: active ? 'var(--accent-primary)' : '#fff' }}>
                            {theme.label}
                          </span>
                          <span style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            background: active ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                            color: active ? '#fff' : 'var(--text-secondary)'
                          }}>
                            {theme.type}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                          {theme.desc}
                        </p>
                        {active && (
                          <span style={{
                            position: 'absolute',
                            bottom: '0.5rem',
                            right: '0.5rem',
                            fontSize: '1rem',
                            color: 'var(--accent-primary)'
                          }}>
                            ✓
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: CATEGORIAS */}
          {activeTab === 'categorias' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem' }}>Categorias de Produtos</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Estrutura oficial de categorias do cardápio e estúdio.
                  </p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
                {[
                  { name: 'Sanduiches', icon: '🍔', desc: 'Sanduíches, smash e hambúrgueres artesanais' },
                  { name: 'Hot Dog', icon: '🌭', desc: 'Hot dogs especiais, tradicionais e prensados' },
                  { name: 'Porções', icon: '🍟', desc: 'Batatas fritas, anéis de cebola e petiscos' },
                  { name: 'Pasteis', icon: '🥟', desc: 'Pastéis fritos crocantes doces e salgados' },
                  { name: 'Salgados', icon: '🥐', desc: 'Coxinhas, kibes, empadas e salgados variados' },
                  { name: 'Refrigerantes', icon: '🥤', desc: 'Refrigerantes em lata, garrafa e zero' },
                  { name: 'Sucos', icon: '🧃', desc: 'Sucos naturais da fruta e polpas' },
                  { name: 'Bebidas Alcóolicas', icon: '🍺', desc: 'Chopps artesanais, cervejas e drinks' }
                ].map((cat, i) => {
                  const itemCount = products.filter(p => p.categoria.toLowerCase() === cat.name.toLowerCase()).length;
                  return (
                    <div key={i} className="burger-ui-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', transition: 'all 0.2s ease', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '2.2rem' }}>{cat.icon}</span>
                        <div>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{cat.name}</h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.15rem' }}>{cat.desc}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: 600, display: 'block', marginTop: '0.35rem' }}>
                            {itemCount} {itemCount === 1 ? 'item cadastrado' : 'itens cadastrados'}
                          </span>
                        </div>
                      </div>
                      <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-primary)' }}>➔</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}



          {/* VIEW: ÁREA DE IA & CONFIGURAÇÕES */}
          {(activeTab === 'ia' || activeTab === 'configuracoes') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Header Banner */}
              <div className="burger-ui-card" style={{
                background: 'linear-gradient(135deg, rgba(255, 90, 31, 0.08) 0%, rgba(255, 183, 3, 0.05) 100%)',
                border: '1px solid rgba(255, 90, 31, 0.25)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.5rem',
                padding: '2rem'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '2rem' }}>🤖</span>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800 }}>
                      Área de IA
                    </h3>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '680px', lineHeight: 1.5 }}>
                    Escolha os provedores de inteligência artificial responsáveis pela geração de <strong>imagens gastronômicas</strong> e <strong>vídeos promocionais</strong> para as campanhas da hamburgueria.
                  </p>
                </div>

                {/* Active Providers Status Badges */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', alignItems: 'flex-start' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    background: 'rgba(18, 18, 22, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    padding: '0.4rem 0.9rem',
                    fontSize: '0.85rem'
                  }}>
                    <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>🖼️ Imagem:</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>
                      {imageAiProvider === 'gpt-image' ? 'GPT Image' : (customImageProvider.trim() || 'Outro provedor')}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    background: 'rgba(18, 18, 22, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    padding: '0.4rem 0.9rem',
                    fontSize: '0.85rem'
                  }}>
                    <span style={{ color: 'var(--accent-secondary)', fontWeight: 700 }}>🎬 Vídeo:</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>
                      {videoAiProvider === 'veo' ? 'Veo' : videoAiProvider === 'kling' ? 'Kling' : 'Runway'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Toast Notification */}
              {aiSavedNotice && (
                <div style={{
                  padding: '0.85rem 1.5rem',
                  background: 'rgba(46, 196, 182, 0.15)',
                  border: '1px solid var(--accent-success)',
                  borderRadius: '12px',
                  color: 'var(--accent-success)',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  animation: 'fadeIn 0.3s ease-out'
                }}>
                  <span>⚡</span> Configuração de IA atualizada e salva com sucesso! O restante do sistema opera normalmente.
                </div>
              )}

              {/* IA Híbrida: O Maior Diferencial do BurgerAI Studio */}
              <div className="burger-ui-card" style={{
                background: 'linear-gradient(135deg, rgba(255, 90, 31, 0.12) 0%, rgba(255, 183, 3, 0.08) 50%, rgba(46, 196, 182, 0.06) 100%)',
                border: '1px solid rgba(255, 183, 3, 0.3)',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '2rem' }}>⚡</span>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900, color: '#fff', margin: 0 }}>
                        IA Híbrida — O Maior Diferencial
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
                        Para cada material (TV Signage, Feed, Stories, Reels e Cadastro de Produto), você escolhe a origem ideal. <strong>Assim você nunca fica preso a uma única forma de criação.</strong>
                      </p>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '0.75rem',
                    background: 'linear-gradient(135deg, #FF5A1F, #FFB703)',
                    color: '#000',
                    fontWeight: 900,
                    padding: '0.35rem 0.85rem',
                    borderRadius: '20px',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}>
                    Arquitetura 3 em 1
                  </span>
                </div>

                {/* 2 Pillars Grid: Imagem & Vídeo */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                  
                  {/* Imagem Híbrida */}
                  <div style={{
                    background: 'rgba(0,0,0,0.35)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    border: '1px solid rgba(255, 90, 31, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>🖼️</span>
                      <strong style={{ color: '#fff', fontSize: '1rem' }}>Imagem</strong>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.75rem', background: 'rgba(255, 90, 31, 0.15)', borderRadius: '8px', border: '1px solid var(--accent-primary)' }}>
                        <span style={{ color: 'var(--accent-primary)', fontWeight: 900, fontSize: '1.1rem' }}>☑</span>
                        <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.85rem' }}>IA</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: 'auto' }}>GPT Image / DALL-E</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 900, fontSize: '1.1rem' }}>☐</span>
                        <span style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.85rem' }}>Biblioteca</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: 'auto' }}>500+ fotos indexadas</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 900, fontSize: '1.1rem' }}>☐</span>
                        <span style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.85rem' }}>Upload</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: 'auto' }}>JPG, PNG, WEBP, TIFF</span>
                      </div>
                    </div>
                  </div>

                  {/* Vídeo Híbrido */}
                  <div style={{
                    background: 'rgba(0,0,0,0.35)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    border: '1px solid rgba(255, 183, 3, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>🎬</span>
                      <strong style={{ color: '#fff', fontSize: '1rem' }}>Vídeo</strong>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.75rem', background: 'rgba(255, 183, 3, 0.15)', borderRadius: '8px', border: '1px solid var(--accent-secondary)' }}>
                        <span style={{ color: 'var(--accent-secondary)', fontWeight: 900, fontSize: '1.1rem' }}>☑</span>
                        <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.85rem' }}>IA</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: 'auto' }}>Veo / Kling / Runway</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 900, fontSize: '1.1rem' }}>☐</span>
                        <span style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.85rem' }}>Biblioteca</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: 'auto' }}>Vídeos do restaurante</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 900, fontSize: '1.1rem' }}>☐</span>
                        <span style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.85rem' }}>Upload</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: 'auto' }}>MP4, MOV ou Fotos com Motion</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Two Column Grid: Imagem & Vídeo */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '2rem' }}>
                
                {/* 1. SEÇÃO IMAGEM */}
                <div className="burger-ui-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '1.4rem' }}>🖼️</span>
                      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800 }}>Imagem</h4>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Selecione 1 Provedor
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    
                    {/* Option 1: GPT Image */}
                    <div
                      onClick={() => handleSelectImageProvider('gpt-image')}
                      style={{
                        padding: '1.25rem',
                        borderRadius: '12px',
                        background: imageAiProvider === 'gpt-image' ? 'rgba(255, 90, 31, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        border: imageAiProvider === 'gpt-image' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: imageAiProvider === 'gpt-image' ? '0 4px 20px rgba(255, 90, 31, 0.2)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{
                            fontSize: '1.3rem',
                            color: imageAiProvider === 'gpt-image' ? 'var(--accent-primary)' : 'var(--text-muted)',
                            fontWeight: 900
                          }}>
                            {imageAiProvider === 'gpt-image' ? '☑' : '☐'}
                          </span>
                          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: imageAiProvider === 'gpt-image' ? '#fff' : 'var(--text-primary)' }}>
                            GPT Image
                          </span>
                        </div>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          backgroundColor: imageAiProvider === 'gpt-image' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.08)',
                          color: '#fff',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '20px',
                          textTransform: 'uppercase'
                        }}>
                          {imageAiProvider === 'gpt-image' ? 'Ativo' : 'Disponível'}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0.5rem 0 0.75rem 2.2rem' }}>
                        Modelos de imagem OpenAI GPT / DALL-E otimizados para fotografia gastronômica hiper-realista, iluminação de estúdio e texturas crocantes de carne e pães.
                      </p>
                      <div style={{ display: 'flex', gap: '0.4rem', marginLeft: '2.2rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>4K Studio</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>Food Lighting</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>HDR Texture</span>
                      </div>
                    </div>

                    {/* Option 2: Outro provedor */}
                    <div
                      onClick={() => handleSelectImageProvider('outro')}
                      style={{
                        padding: '1.25rem',
                        borderRadius: '12px',
                        background: imageAiProvider === 'outro' ? 'rgba(255, 90, 31, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        border: imageAiProvider === 'outro' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: imageAiProvider === 'outro' ? '0 4px 20px rgba(255, 90, 31, 0.2)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{
                            fontSize: '1.3rem',
                            color: imageAiProvider === 'outro' ? 'var(--accent-primary)' : 'var(--text-muted)',
                            fontWeight: 900
                          }}>
                            {imageAiProvider === 'outro' ? '☑' : '☐'}
                          </span>
                          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: imageAiProvider === 'outro' ? '#fff' : 'var(--text-primary)' }}>
                            Outro provedor
                          </span>
                        </div>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          backgroundColor: imageAiProvider === 'outro' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.08)',
                          color: '#fff',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '20px',
                          textTransform: 'uppercase'
                        }}>
                          {imageAiProvider === 'outro' ? 'Ativo' : 'Customizável'}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0.5rem 0 0.75rem 2.2rem' }}>
                        Utilize outro provedor ou modelo personalizado de geração de imagens (ex: Midjourney v6, Stable Diffusion XL, Flux.1, Recraft).
                      </p>

                      {imageAiProvider === 'outro' && (
                        <div 
                          onClick={(e) => e.stopPropagation()} 
                          style={{ marginLeft: '2.2rem', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}
                        >
                          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                            Nome / Endpoint do Provedor:
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: Midjourney v6, Stable Diffusion XL, Flux.1 Schnell"
                            value={customImageProvider}
                            onChange={(e) => handleCustomImageNameChange(e.target.value)}
                            className="burger-ui-input"
                            style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                          />
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                {/* 2. SEÇÃO VÍDEO */}
                <div className="burger-ui-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '1.4rem' }}>🎬</span>
                      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800 }}>Vídeo</h4>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Selecione 1 Provedor
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    
                    {/* Option 1: Veo */}
                    <div
                      onClick={() => handleSelectVideoProvider('veo')}
                      style={{
                        padding: '1.25rem',
                        borderRadius: '12px',
                        background: videoAiProvider === 'veo' ? 'rgba(255, 183, 3, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        border: videoAiProvider === 'veo' ? '2px solid var(--accent-secondary)' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: videoAiProvider === 'veo' ? '0 4px 20px rgba(255, 183, 3, 0.2)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{
                            fontSize: '1.3rem',
                            color: videoAiProvider === 'veo' ? 'var(--accent-secondary)' : 'var(--text-muted)',
                            fontWeight: 900
                          }}>
                            {videoAiProvider === 'veo' ? '☑' : '☐'}
                          </span>
                          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: videoAiProvider === 'veo' ? '#fff' : 'var(--text-primary)' }}>
                            Veo
                          </span>
                        </div>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          backgroundColor: videoAiProvider === 'veo' ? 'var(--accent-secondary)' : 'rgba(255,255,255,0.08)',
                          color: videoAiProvider === 'veo' ? '#000' : '#fff',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '20px',
                          textTransform: 'uppercase'
                        }}>
                          {videoAiProvider === 'veo' ? 'Ativo' : 'Disponível'}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0.5rem 0 0.75rem 2.2rem' }}>
                        Google DeepMind Veo: Produção de vídeos em 1080p/4K com controle cinematográfico, fumaça realista e movimentos de câmera de alta fidelidade.
                      </p>
                      <div style={{ display: 'flex', gap: '0.4rem', marginLeft: '2.2rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>Google DeepMind</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>1080p/4K</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>Cinematic</span>
                      </div>
                    </div>

                    {/* Option 2: Kling */}
                    <div
                      onClick={() => handleSelectVideoProvider('kling')}
                      style={{
                        padding: '1.25rem',
                        borderRadius: '12px',
                        background: videoAiProvider === 'kling' ? 'rgba(255, 183, 3, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        border: videoAiProvider === 'kling' ? '2px solid var(--accent-secondary)' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: videoAiProvider === 'kling' ? '0 4px 20px rgba(255, 183, 3, 0.2)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{
                            fontSize: '1.3rem',
                            color: videoAiProvider === 'kling' ? 'var(--accent-secondary)' : 'var(--text-muted)',
                            fontWeight: 900
                          }}>
                            {videoAiProvider === 'kling' ? '☑' : '☐'}
                          </span>
                          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: videoAiProvider === 'kling' ? '#fff' : 'var(--text-primary)' }}>
                            Kling
                          </span>
                        </div>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          backgroundColor: videoAiProvider === 'kling' ? 'var(--accent-secondary)' : 'rgba(255,255,255,0.08)',
                          color: videoAiProvider === 'kling' ? '#000' : '#fff',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '20px',
                          textTransform: 'uppercase'
                        }}>
                          {videoAiProvider === 'kling' ? 'Ativo' : 'Disponível'}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0.5rem 0 0.75rem 2.2rem' }}>
                        Kling AI: Simulação física avançada de líquidos, molhos, queijo derretendo e queima de hambúrguer na brasa em alta taxa de quadros.
                      </p>
                      <div style={{ display: 'flex', gap: '0.4rem', marginLeft: '2.2rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>Fluid Motion</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>Culinary Physics</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>High FPS</span>
                      </div>
                    </div>

                    {/* Option 3: Runway */}
                    <div
                      onClick={() => handleSelectVideoProvider('runway')}
                      style={{
                        padding: '1.25rem',
                        borderRadius: '12px',
                        background: videoAiProvider === 'runway' ? 'rgba(255, 183, 3, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        border: videoAiProvider === 'runway' ? '2px solid var(--accent-secondary)' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: videoAiProvider === 'runway' ? '0 4px 20px rgba(255, 183, 3, 0.2)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{
                            fontSize: '1.3rem',
                            color: videoAiProvider === 'runway' ? 'var(--accent-secondary)' : 'var(--text-muted)',
                            fontWeight: 900
                          }}>
                            {videoAiProvider === 'runway' ? '☑' : '☐'}
                          </span>
                          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: videoAiProvider === 'runway' ? '#fff' : 'var(--text-primary)' }}>
                            Runway
                          </span>
                        </div>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          backgroundColor: videoAiProvider === 'runway' ? 'var(--accent-secondary)' : 'rgba(255,255,255,0.08)',
                          color: videoAiProvider === 'runway' ? '#000' : '#fff',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '20px',
                          textTransform: 'uppercase'
                        }}>
                          {videoAiProvider === 'runway' ? 'Ativo' : 'Disponível'}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0.5rem 0 0.75rem 2.2rem' }}>
                        Runway Gen-3 Alpha: Storyboards precisos, transições de câmera e renderização rápida de reels publicitários.
                      </p>
                      <div style={{ display: 'flex', gap: '0.4rem', marginLeft: '2.2rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>Gen-3 Alpha</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>Motion Control</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>Fast Render</span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* System Compatibility Note */}
              <div className="burger-ui-card" style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.25rem 1.5rem'
              }}>
                <span style={{ fontSize: '1.5rem' }}>🛡️</span>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  <strong style={{ color: '#fff' }}>Garantia de Integridade:</strong> A seleção dos provedores de IA opera de forma modular e independente. Todos os fluxos de catálogo, promoções, templates de cardápio digital TV Signage, posts de Instagram, Stories e Reels permanecem 100% íntegros e compatíveis.
                </div>
              </div>
            </div>
          )}

          {/* VIEW: BANCO DE ARQUIVOS */}
          {activeTab === 'arquivos' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Top Banner */}
              <div className="burger-ui-card" style={{
                background: 'linear-gradient(135deg, rgba(255, 90, 31, 0.08) 0%, rgba(46, 196, 182, 0.06) 100%)',
                border: '1px solid rgba(255, 90, 31, 0.25)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.5rem',
                padding: '2rem'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '2rem' }}>📁</span>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800 }}>
                      Banco de Arquivos
                    </h3>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '680px', lineHeight: 1.5 }}>
                    Central de arquivos e ativos publicitários de cada produto, com estrutura limpa e padronizada para <strong>Fotos</strong>, <strong>Redes Sociais (Feed/Stories)</strong>, <strong>TV Signage</strong>, <strong>Vídeos</strong> e <strong>Banners</strong>.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(18, 18, 22, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-success)' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>Estrutura Padronizada:</span>
                    <strong style={{ color: '#fff' }}>6 Arquivos / Produto</strong>
                  </div>
                </div>
              </div>

              {/* Toast for copied link */}
              {copiedFileName && (
                <div style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(46, 196, 182, 0.15)',
                  border: '1px solid var(--accent-success)',
                  borderRadius: '12px',
                  color: 'var(--accent-success)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  animation: 'fadeIn 0.3s ease-out'
                }}>
                  <span>📋</span> Caminho de <strong>{copiedFileName}</strong> copiado para a área de transferência!
                </div>
              )}

              {/* Main Content: Folder Explorer & File Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem' }}>
                
                {/* 1. Left Sidebar: Pastas dos Produtos */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="burger-ui-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        📂 Pastas de Produtos
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700 }}>{products.length} Pastas</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.25rem' }}>
                      {products.map((p) => {
                        const folderId = p.slug || p.id;
                        const folderIcon = p.categoria.toLowerCase().includes('bebida') ? '🥤' : p.categoria.toLowerCase().includes('sobremesa') ? '🍦' : p.categoria.toLowerCase().includes('batata') ? '🍟' : '🍔';
                        const filesCount = 1 + (p.media?.length || 0);
                        const isSelected = selectedFileProduct === folderId;
                        return (
                          <div
                            key={p.id}
                            onClick={() => setSelectedFileProduct(folderId)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.75rem 1rem',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              background: isSelected ? 'rgba(255, 90, 31, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                              border: isSelected ? '1px solid var(--accent-primary)' : '1px solid transparent',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <span style={{ fontSize: '1.2rem' }}>{folderIcon}</span>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: isSelected ? 800 : 600, color: isSelected ? '#fff' : 'var(--text-primary)' }}>
                                  {p.nome}
                                </span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                  {filesCount} arquivos
                                </span>
                              </div>
                            </div>
                            <span style={{ fontSize: '0.65rem', backgroundColor: isSelected ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)', color: '#fff', padding: '0.15rem 0.4rem', borderRadius: '4px', textTransform: 'capitalize' }}>
                              {p.categoria}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Storage Specs Widget */}
                  <div className="burger-ui-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(18, 18, 22, 0.6)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      💾 Espaço em Disco
                    </span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Usado no Monorepo</span>
                      <strong style={{ color: '#fff' }}>14.8 MB / 500 MB</strong>
                    </div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: '3%', height: '100%', backgroundColor: 'var(--accent-primary)', borderRadius: '3px' }} />
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-success)' }}>
                      ✓ Formatos otimizados (WebP, MP4 H.264, PDF Vetorial)
                    </span>
                  </div>
                </div>

                {/* 2. Right Column: Arquivos Organizados do Produto */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  {/* Folder Directory Header Bar */}
                  <div className="burger-ui-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <span>📁</span>
                        <span>storage</span>
                        <span>/</span>
                        <span>outputs</span>
                        <span>/</span>
                        <strong style={{ color: 'var(--accent-primary)' }}>
                          {selectedFileProduct === 'smash-bacon' ? 'smash-bacon' : selectedFileProduct}
                        </strong>
                      </div>
                      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800 }}>
                        {products.find(p => p.slug === selectedFileProduct || p.id === selectedFileProduct)?.nome || (selectedFileProduct === 'smash-bacon' ? 'Smash Bacon' : 'Arquivos do Produto')}
                      </h4>
                    </div>

                    {/* Filter Type Pills */}
                    <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(255,255,255,0.03)', padding: '0.25rem', borderRadius: '20px', border: '1px solid var(--border-subtle)' }}>
                      {[
                        { id: 'all', label: 'Todos (6)' },
                        { id: 'image', label: 'Imagens (4)' },
                        { id: 'video', label: 'Vídeo (1)' },
                        { id: 'document', label: 'Banner / PDF (1)' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setFileFilter(tab.id as any)}
                          style={{
                            background: fileFilter === tab.id ? 'var(--accent-primary)' : 'transparent',
                            color: fileFilter === tab.id ? '#fff' : 'var(--text-secondary)',
                            border: 'none',
                            borderRadius: '15px',
                            padding: '0.3rem 0.75rem',
                            fontSize: '0.75rem',
                            fontWeight: fileFilter === tab.id ? 700 : 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Organized Files Grid based on current selected product */}
                  {(() => {
                    const selectedProd = products.find(p => p.slug === selectedFileProduct || p.id === selectedFileProduct) || products[0];
                    if (!selectedProd) return <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '2rem' }}>Nenhum produto selecionado ou encontrado.</div>;

                    const dynamicFiles: any[] = [];

                    // 1. Main product image
                    if (selectedProd.imagem) {
                      dynamicFiles.push({
                        name: 'foto.webp',
                        label: 'Foto Principal do Produto',
                        type: 'image' as const,
                        format: 'WebP (Lossless)',
                        resolution: '2048 x 2048 (4K)',
                        size: '480 KB',
                        usage: 'Hero Display & Cardápio Digital',
                        url: selectedProd.imagem,
                        badge: 'Foto Oficial',
                        icon: '📸'
                      });
                    }

                    // 2. Sealed badge image
                    if (selectedProd.selo) {
                      dynamicFiles.push({
                        name: 'selo_promocional.png',
                        label: 'Selo / Badge de Destaque',
                        type: 'image' as const,
                        format: 'PNG (Transparent)',
                        resolution: '512 x 512 px',
                        size: '120 KB',
                        usage: 'Medalha Visual de Oferta',
                        url: selectedProd.selo,
                        badge: 'Selo Oficial',
                        icon: '🏷️'
                      });
                    }

                    // 3. Videos and gallery images from Aba 2
                    if (selectedProd.media && selectedProd.media.length > 0) {
                      selectedProd.media.forEach((m, index) => {
                        const isVideo = m.tipo === 'video';
                        const isBrand = m.tipo === 'tv';
                        dynamicFiles.push({
                          name: isVideo ? `video_${index + 1}.mp4` : isBrand ? `logo_${index + 1}.png` : `gallery_${index + 1}.webp`,
                          label: isVideo ? 'Vídeo Promocional HD' : isBrand ? 'Identidade Visual / Logo' : `Foto Galeria #${index + 1}`,
                          type: isVideo ? ('video' as const) : ('image' as const),
                          format: isVideo ? 'MP4 (H.264)' : 'WebP (HQ)',
                          resolution: isVideo ? '1080 x 1920 px (9:16)' : '1080 x 1080 px (1:1)',
                          size: isVideo ? '12.4 MB' : '350 KB',
                          usage: isVideo ? 'Reels, TikTok & TV Digital' : 'Feed, Stories & Biblioteca',
                          url: m.caminho,
                          badge: isVideo ? 'Vídeo' : isBrand ? 'Logo' : 'Galeria',
                          icon: isVideo ? '🎥' : isBrand ? '🏷' : '🖼'
                        });
                      });
                    }

                    // Standard template files for aesthetic completion if product lacks some files
                    const hasFeed = dynamicFiles.some(f => f.name.includes('gallery_1') || f.name.includes('feed'));
                    const hasStory = dynamicFiles.some(f => f.name.includes('gallery_2') || f.name.includes('story'));
                    const hasTvSlide = dynamicFiles.some(f => f.name.includes('gallery_3') || f.name.includes('tv_slide'));
                    const hasVideo = dynamicFiles.some(f => f.type === 'video');

                    if (!hasFeed) {
                      dynamicFiles.push({
                        name: 'feed.jpg',
                        label: 'Post Feed Instagram (1:1)',
                        type: 'image' as const,
                        format: 'JPEG (95% Quality)',
                        resolution: '1080 x 1080 px',
                        size: '320 KB',
                        usage: 'Grid do Instagram & Anúncios Meta',
                        url: selectedProd.imagem || '/foto.png',
                        badge: 'Feed 1:1',
                        icon: '📱'
                      });
                    }

                    if (!hasStory) {
                      dynamicFiles.push({
                        name: 'story.jpg',
                        label: 'Instagram Stories (9:16)',
                        type: 'image' as const,
                        format: 'JPEG (Vertical)',
                        resolution: '1080 x 1920 px',
                        size: '512 KB',
                        usage: 'Stories, Reels Capa & WhatsApp',
                        url: selectedProd.imagem || '/foto.png',
                        badge: 'Story 9:16',
                        icon: '📱'
                      });
                    }

                    if (!hasTvSlide) {
                      dynamicFiles.push({
                        name: 'tv_slide.webp',
                        label: 'Slide TV Menu Board (16:9)',
                        type: 'image' as const,
                        format: 'WebP (Panorâmico)',
                        resolution: '1920 x 1080 px',
                        size: '640 KB',
                        usage: 'Telas & TV Signage da Loja',
                        url: selectedProd.imagem || '/foto.png',
                        badge: 'TV 16:9',
                        icon: '📺'
                      });
                    }

                    if (!hasVideo) {
                      dynamicFiles.push({
                        name: 'video.mp4',
                        label: 'Vídeo Promocional HD',
                        type: 'video' as const,
                        format: 'MP4 (H.264)',
                        resolution: '1080 x 1920 px',
                        size: '12.4 MB',
                        usage: 'Reels, TikTok & TV Digital Dinâmica',
                        url: '/video.mp4',
                        badge: 'Vídeo HD',
                        icon: '🎥'
                      });
                    }

                    // Always add a print PDF layout file
                    dynamicFiles.push({
                      name: 'banner.pdf',
                      label: 'Banner Impresso & Cardápio',
                      type: 'document' as const,
                      format: 'PDF/X-1a (Vetorial CMYK)',
                      resolution: '300 DPI (Gráfica)',
                      size: '1.2 MB',
                      usage: 'Impressão de Banners, Totens e Flyers',
                      url: '/smash-bacon/banner.pdf',
                      badge: 'PDF Vetorial',
                      icon: '📄'
                    });

                    const filtered = dynamicFiles.filter(f => fileFilter === 'all' || f.type === fileFilter);

                    return (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                        {filtered.map((file, idx) => (
                          <div
                            key={idx}
                            className="burger-ui-card"
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '1rem',
                              padding: '1.25rem',
                              border: '1px solid var(--border-subtle)',
                              position: 'relative',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {/* File Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <span style={{ fontSize: '1.6rem' }}>{file.icon}</span>
                                <div>
                                  <h5 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
                                    {file.name}
                                  </h5>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {file.label}
                                  </span>
                                </div>
                              </div>
                              <span style={{ fontSize: '0.65rem', backgroundColor: 'rgba(255, 90, 31, 0.15)', color: 'var(--accent-primary)', border: '1px solid rgba(255, 90, 31, 0.3)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                                {file.badge}
                              </span>
                            </div>

                            {/* Thumbnail / Media Preview Box */}
                            <div 
                              onClick={() => setPreviewFileModal(file)}
                              style={{
                                height: '140px',
                                backgroundColor: '#0a0a0e',
                                borderRadius: '8px',
                                border: '1px solid var(--border-subtle)',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                position: 'relative'
                              }}
                            >
                              {file.type === 'image' && (
                                file.url && (file.url.startsWith('/') || file.url.startsWith('http') || file.url.startsWith('data:')) ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={file.url} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as any).src = '/foto.png'; }} />
                                ) : (
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'radial-gradient(circle, rgba(255, 90, 31, 0.25) 0%, rgba(0,0,0,0.8) 100%)', width: '100%', height: '100%' }}>
                                    <span style={{ fontSize: '2.5rem' }}>{file.icon || '🏷️'}</span>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>{file.url || file.label}</span>
                                  </div>
                                )
                              )}
                              {file.type === 'video' && (
                                <video src={file.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted loop playsInline autoPlay />
                              )}
                              {file.type === 'document' && (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                  <span style={{ fontSize: '2.5rem' }}>📄</span>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>PDF Vetorial (300 DPI)</span>
                                </div>
                              )}
                            </div>

                            {/* File Details Specs */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem', background: 'rgba(255,255,255,0.02)', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
                              <div>
                                <span style={{ color: 'var(--text-muted)' }}>Resolução:</span>
                                <div style={{ color: '#fff', fontWeight: 600 }}>{file.resolution}</div>
                              </div>
                              <div>
                                <span style={{ color: 'var(--text-muted)' }}>Tamanho:</span>
                                <div style={{ color: '#fff', fontWeight: 600 }}>{file.size}</div>
                              </div>
                              <div style={{ gridColumn: 'span 2', marginTop: '0.2rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Finalidade:</span>
                                <div style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>{file.usage}</div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                              <Button
                                variant="secondary"
                                onClick={() => setPreviewFileModal(file)}
                                style={{ flex: 1, padding: '0.45rem', fontSize: '0.75rem' }}
                              >
                                👁️ Visualizar
                              </Button>
                              <a
                                href={file.url}
                                download={file.name}
                                style={{
                                  flex: 1,
                                  textDecoration: 'none',
                                  textAlign: 'center',
                                  padding: '0.45rem',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  background: 'linear-gradient(135deg, #FF5A1F, #FF8C00)',
                                  color: '#fff',
                                  borderRadius: '8px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.3rem'
                                }}
                              >
                                ⬇️ Baixar
                              </a>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(file.url);
                                  setCopiedFileName(file.name);
                                  setTimeout(() => setCopiedFileName(null), 2500);
                                }}
                                title="Copiar Caminho"
                                style={{
                                  background: 'rgba(255,255,255,0.06)',
                                  border: '1px solid var(--border-subtle)',
                                  color: 'var(--text-secondary)',
                                  borderRadius: '8px',
                                  padding: '0.45rem 0.65rem',
                                  cursor: 'pointer'
                                }}
                              >
                                📋
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

              </div>

              {/* Bottom Summary Bar */}
              <div className="burger-ui-card" style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.25rem 1.5rem'
              }}>
                <span style={{ fontSize: '1.5rem' }}>✨</span>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  <strong style={{ color: '#fff' }}>Organização Impecável:</strong> Cada hambúrguer do cardápio possui seu conjunto completo e padronizado de 6 arquivos essenciais (<code>foto.webp</code>, <code>feed.jpg</code>, <code>story.jpg</code>, <code>tv_slide.webp</code>, <code>video.mp4</code>, <code>banner.pdf</code>), prontos para publicação em redes sociais, exibição na TV e impressão gráfica.
                </div>
              </div>

            </div>
          )}

          {/* ──────────────────────────────────────────────────────────── */}
          {/* TAB 11: BIBLIOTECA DE MÍDIAS (10 PASTAS / CATEGORIAS)        */}
          {/* ──────────────────────────────────────────────────────────── */}
          {activeTab === 'biblioteca' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Header & Metrics Banner */}
              <div className="burger-ui-card" style={{
                background: 'linear-gradient(135deg, rgba(255, 90, 31, 0.1) 0%, rgba(255, 183, 3, 0.05) 50%, rgba(18, 18, 22, 0.9) 100%)',
                border: '1px solid rgba(255, 90, 31, 0.3)',
                padding: '1.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.5rem'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '2rem' }}>📚</span>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
                      Biblioteca de Mídias
                    </h3>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(255, 90, 31, 0.2)', color: 'var(--accent-primary)', padding: '0.2rem 0.6rem', borderRadius: '20px', fontWeight: 800 }}>
                      MÓDULO CENTRAL
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '620px' }}>
                    Organização profissional em 10 categorias essenciais. Gerencie fotos em alta resolução, vídeos de preparo, combos, sobremesas, logos e elementos visuais da hamburgueria.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setUploadLibCat(selectedLibCat);
                      setIsUploadLibModalOpen(true);
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', fontSize: '0.9rem', fontWeight: 800 }}
                  >
                    <span>📤</span> Enviar Novo Arquivo
                  </Button>
                </div>
              </div>

              {/* 4 Stats Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="burger-ui-card" style={{ padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total de Arquivos</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '0.25rem' }}>
                    {libraryItems.length} mídias
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Sincronizadas e prontas</span>
                </div>

                <div className="burger-ui-card" style={{ padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pastas Organizadas</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-secondary)', marginTop: '0.25rem' }}>
                    10 Categorias
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Estrutura padronizada</span>
                </div>

                <div className="burger-ui-card" style={{ padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Formatos Aceitos</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-success)', marginTop: '0.35rem' }}>
                    JPG • PNG • WEBP • TIFF
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>MP4 • MOV • AVI • WEBM</span>
                </div>

                <div className="burger-ui-card" style={{ padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Armazenamento Otimizado</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginTop: '0.25rem' }}>
                    68.5 MB
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Compressão sem perda visual</span>
                </div>
              </div>

              {/* Main 2-Column Explorer */}
              <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'start' }}>
                
                {/* LEFT COLUMN: 10 Pastas / Categorias */}
                <div className="burger-ui-card" style={{ padding: '1.25rem', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                    📁 Pastas da Biblioteca
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {initialLibraryCategories.map((cat) => {
                      const count = libraryItems.filter(item => item.category === cat.id).length;
                      const isSelected = selectedLibCat === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedLibCat(cat.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.75rem 1rem',
                            borderRadius: '10px',
                            border: isSelected ? '1px solid rgba(255, 90, 31, 0.4)' : '1px solid transparent',
                            background: isSelected ? 'rgba(255, 90, 31, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                            color: isSelected ? '#fff' : 'var(--text-secondary)',
                            fontWeight: isSelected ? 800 : 600,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <span style={{ fontSize: '1.15rem' }}>{cat.icon}</span>
                            <span>{cat.name}</span>
                          </div>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.5rem',
                            borderRadius: '12px',
                            background: isSelected ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.06)',
                            color: isSelected ? '#fff' : 'var(--text-muted)'
                          }}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    ✨ 10 Pastas padronizadas ativas
                  </div>
                </div>

                {/* RIGHT COLUMN: Media Files Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  {/* Active Folder Header & Filters */}
                  <div className="burger-ui-card" style={{
                    padding: '1.25rem',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.75rem' }}>
                          {libSearchScope === 'global' && libSearchTerm ? '🔍' : initialLibraryCategories.find(c => c.id === selectedLibCat)?.icon || '📁'}
                        </span>
                        <div>
                          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                            {libSearchScope === 'global' && libSearchTerm ? `Busca Global: "${libSearchTerm}"` : initialLibraryCategories.find(c => c.id === selectedLibCat)?.name || 'Pasta'}
                          </h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {libSearchScope === 'global' && libSearchTerm ? 'Indexação automática em 500+ fotos e vídeos' : initialLibraryCategories.find(c => c.id === selectedLibCat)?.desc}
                          </span>
                        </div>
                      </div>

                      {/* Search & Type Filter */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        
                        {/* Scope Toggle */}
                        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', padding: '0.2rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                          <button
                            type="button"
                            onClick={() => setLibSearchScope('global')}
                            style={{
                              padding: '0.35rem 0.65rem',
                              fontSize: '0.75rem',
                              fontWeight: libSearchScope === 'global' ? 800 : 500,
                              background: libSearchScope === 'global' ? 'var(--accent-primary)' : 'transparent',
                              color: libSearchScope === 'global' ? '#fff' : 'var(--text-secondary)',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer'
                            }}
                          >
                            🌐 Todo o Acervo
                          </button>
                          <button
                            type="button"
                            onClick={() => setLibSearchScope('folder')}
                            style={{
                              padding: '0.35rem 0.65rem',
                              fontSize: '0.75rem',
                              fontWeight: libSearchScope === 'folder' ? 800 : 500,
                              background: libSearchScope === 'folder' ? 'var(--accent-primary)' : 'transparent',
                              color: libSearchScope === 'folder' ? '#fff' : 'var(--text-secondary)',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer'
                            }}
                          >
                            📁 Pasta Atual
                          </button>
                        </div>

                        {/* Search Input */}
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            placeholder="🔍 Buscar Bacon, Cheddar, Smash..."
                            value={libSearchTerm}
                            onChange={(e) => {
                              setLibSearchTerm(e.target.value);
                              if (e.target.value) setLibSearchScope('global');
                            }}
                            className="burger-ui-input"
                            style={{ width: '250px', padding: '0.45rem 2rem 0.45rem 0.75rem', fontSize: '0.8rem' }}
                          />
                          {libSearchTerm && (
                            <button
                              type="button"
                              onClick={() => setLibSearchTerm('')}
                              style={{
                                position: 'absolute',
                                right: '8px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                fontSize: '0.8rem'
                              }}
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        {/* Media Type Tabs */}
                        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', padding: '0.2rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                          {[
                            { id: 'all', label: 'Todas' },
                            { id: 'image', label: '🖼️ Fotos' },
                            { id: 'video', label: '🎥 Vídeos' },
                            { id: 'vector', label: '⚡ Vetores' }
                          ].map((tab) => (
                            <button
                              key={tab.id}
                              onClick={() => setLibTypeFilter(tab.id as any)}
                              style={{
                                padding: '0.35rem 0.7rem',
                                fontSize: '0.75rem',
                                fontWeight: libTypeFilter === tab.id ? 700 : 500,
                                background: libTypeFilter === tab.id ? 'var(--accent-primary)' : 'transparent',
                                color: libTypeFilter === tab.id ? '#fff' : 'var(--text-secondary)',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer'
                              }}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Quick Smart Search Tag Pills */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                        🏷️ Busca Rápida:
                      </span>
                      {[
                        { label: 'Bacon', icon: '🥓', tag: 'bacon' },
                        { label: 'Cheddar', icon: '🧀', tag: 'cheddar' },
                        { label: 'Milk Shake', icon: '🥤', tag: 'milk shake' },
                        { label: 'Batata', icon: '🍟', tag: 'batata' },
                        { label: 'Smash', icon: '🍔', tag: 'smash' },
                        { label: 'Combo', icon: '🎁', tag: 'combo' },
                        { label: 'Duplo', icon: '🥩', tag: 'duplo' },
                        { label: 'Sobremesa', icon: '🍫', tag: 'sobremesa' }
                      ].map((chip) => {
                        const isChipActive = libSearchTerm.toLowerCase() === chip.tag.toLowerCase();
                        return (
                          <button
                            key={chip.tag}
                            type="button"
                            onClick={() => {
                              if (isChipActive) {
                                setLibSearchTerm('');
                              } else {
                                setLibSearchTerm(chip.tag);
                                setLibSearchScope('global');
                              }
                            }}
                            style={{
                              padding: '0.25rem 0.65rem',
                              fontSize: '0.75rem',
                              fontWeight: isChipActive ? 800 : 600,
                              background: isChipActive ? 'linear-gradient(135deg, #FF5A1F, #FFB703)' : 'rgba(255, 255, 255, 0.05)',
                              color: isChipActive ? '#000' : 'var(--text-secondary)',
                              border: isChipActive ? 'none' : '1px solid var(--border-subtle)',
                              borderRadius: '20px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <span>{chip.icon}</span>
                            <span>{chip.label}</span>
                          </button>
                        );
                      })}

                      {libSearchTerm && (
                        <button
                          type="button"
                          onClick={() => setLibSearchTerm('')}
                          style={{
                            padding: '0.25rem 0.65rem',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            background: 'rgba(255, 90, 31, 0.15)',
                            color: 'var(--accent-primary)',
                            border: '1px solid var(--accent-primary)',
                            borderRadius: '20px',
                            cursor: 'pointer'
                          }}
                        >
                          ✕ Limpar Busca
                        </button>
                      )}
                    </div>

                  </div>

                  {/* Media Grid Cards */}
                  {(() => {
                    const filtered = libraryItems.filter(item => {
                      const matchCat = libSearchScope === 'global' || item.category === selectedLibCat;
                      const term = libSearchTerm.toLowerCase().trim();
                      const matchSearch = term === '' ||
                        item.name.toLowerCase().includes(term) ||
                        item.category.toLowerCase().includes(term) ||
                        item.tags.some(t => t.toLowerCase().includes(term));
                      const matchType = libTypeFilter === 'all' || item.type === libTypeFilter;
                      return matchCat && matchSearch && matchType;
                    });

                    if (filtered.length === 0) {
                      return (
                        <div className="burger-ui-card" style={{
                          padding: '3rem 2rem',
                          textAlign: 'center',
                          border: '1px dashed var(--border-subtle)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '1rem'
                        }}>
                          <span style={{ fontSize: '3rem' }}>📂</span>
                          <div>
                            <h4 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700 }}>Nenhuma mídia encontrada nesta pasta</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                              Envie arquivos do computador (JPG, PNG, WEBP, TIFF, MP4, MOV, AVI, WEBM) para esta categoria.
                            </p>
                          </div>
                          <Button
                            variant="primary"
                            onClick={() => {
                              setUploadLibCat(selectedLibCat);
                              setIsUploadLibModalOpen(true);
                            }}
                            style={{ fontSize: '0.85rem', padding: '0.55rem 1.25rem' }}
                          >
                            [+] Enviar Mídia Agora
                          </Button>
                        </div>
                      );
                    }

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {libSearchTerm && (
                          <div style={{
                            padding: '0.65rem 1rem',
                            background: 'linear-gradient(135deg, rgba(255, 183, 3, 0.12), rgba(255, 90, 31, 0.08))',
                            border: '1px solid rgba(255, 183, 3, 0.3)',
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.85rem',
                            color: '#fff'
                          }}>
                            <div>
                              <span>⚡ <strong>{filtered.length}</strong> {filtered.length === 1 ? 'mídia encontrada' : 'mídias encontradas'} para a busca </span>
                              <span style={{ color: 'var(--accent-secondary)', fontWeight: 800 }}>"{libSearchTerm}"</span>
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: '0.4rem' }}>
                                (indexação inteligente em 500+ fotos e vídeos)
                              </span>
                            </div>
                            <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.6rem', borderRadius: '12px', color: 'var(--text-secondary)' }}>
                              Instant AI Match
                            </span>
                          </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
                          {filtered.map((item) => (
                            <div
                              key={item.id}
                              className="burger-ui-card"
                              style={{
                                padding: '1rem',
                                border: '1px solid var(--border-subtle)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.85rem',
                                background: 'rgba(18, 18, 22, 0.7)'
                              }}
                            >
                              {/* Media Preview Box */}
                              <div style={{
                                width: '100%',
                                height: '160px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                backgroundColor: '#050508',
                                border: '1px solid rgba(255,255,255,0.05)',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                {item.type === 'video' ? (
                                  <video src={item.url} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={item.url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                )}

                                {/* Folder Badge if global search */}
                                {libSearchScope === 'global' && libSearchTerm && (
                                  <div style={{
                                    position: 'absolute',
                                    top: '8px',
                                    left: '8px',
                                    background: 'rgba(0,0,0,0.75)',
                                    color: '#fff',
                                    fontWeight: 700,
                                    fontSize: '0.65rem',
                                    padding: '0.15rem 0.45rem',
                                    borderRadius: '4px',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    backdropFilter: 'blur(4px)'
                                  }}>
                                    📁 {item.category}
                                  </div>
                                )}

                                {/* Format Badge */}
                                <div style={{
                                  position: 'absolute',
                                  top: '8px',
                                  right: '8px',
                                  background: item.type === 'video' ? 'rgba(255, 183, 3, 0.9)' : 'rgba(255, 90, 31, 0.9)',
                                  color: '#000',
                                  fontWeight: 800,
                                  fontSize: '0.7rem',
                                  padding: '0.15rem 0.45rem',
                                  borderRadius: '4px',
                                  letterSpacing: '0.05em'
                                }}>
                                  {item.format}
                                </div>
                              </div>

                            {/* Info */}
                            <div>
                              <h5 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.35rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.name}>
                                {item.name}
                              </h5>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                <span>{item.resolution}</span>
                                <span>{item.size}</span>
                              </div>
                            </div>

                            {/* Tags */}
                            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                              {item.tags.map((t, idx) => (
                                <span key={idx} style={{
                                  fontSize: '0.65rem',
                                  background: 'rgba(255,255,255,0.04)',
                                  border: '1px solid rgba(255,255,255,0.06)',
                                  color: 'var(--text-secondary)',
                                  padding: '0.15rem 0.4rem',
                                  borderRadius: '4px'
                                }}>
                                  #{t}
                                </span>
                              ))}
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '0.4rem', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                              {item.type === 'image' && (
                                <button
                                  type="button"
                                  onClick={() => openAiEditorForImage(item.url, 'main')}
                                  title="Melhorar com Editor Inteligente IA"
                                  style={{
                                    background: 'linear-gradient(135deg, #FFB703, #FF5A1F)',
                                    border: 'none',
                                    color: '#000',
                                    borderRadius: '6px',
                                    padding: '0.4rem 0.6rem',
                                    cursor: 'pointer',
                                    fontWeight: 800,
                                    fontSize: '0.75rem'
                                  }}
                                >
                                  ✨
                                </button>
                              )}

                              {item.type === 'video' && (
                                <button
                                  type="button"
                                  onClick={() => openAiVideoEditor(item.url)}
                                  title="Editar com Editor Inteligente de Vídeo"
                                  style={{
                                    background: 'linear-gradient(135deg, #FF5A1F, #FFB703)',
                                    border: 'none',
                                    color: '#000',
                                    borderRadius: '6px',
                                    padding: '0.4rem 0.6rem',
                                    cursor: 'pointer',
                                    fontWeight: 800,
                                    fontSize: '0.75rem'
                                  }}
                                >
                                  🎬
                                </button>
                              )}

                              <Button
                                variant="secondary"
                                onClick={() => setPreviewFileModal({
                                  name: item.name,
                                  label: item.category.toUpperCase(),
                                  type: item.type === 'video' ? 'video' : 'image',
                                  url: item.url,
                                  resolution: item.resolution,
                                  size: item.size,
                                  usage: `Categoria: ${item.category}`
                                })}
                                style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem' }}
                              >
                                👁️ Ver
                              </Button>

                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(item.url);
                                  setCopiedFileName(item.name);
                                  setTimeout(() => setCopiedFileName(null), 2500);
                                }}
                                title="Copiar Link"
                                style={{
                                  background: 'rgba(255,255,255,0.06)',
                                  border: '1px solid var(--border-subtle)',
                                  color: 'var(--text-secondary)',
                                  borderRadius: '6px',
                                  padding: '0.4rem 0.6rem',
                                  cursor: 'pointer'
                                }}
                              >
                                📋
                              </button>

                              <a
                                href={item.url}
                                download={item.name}
                                style={{
                                  textDecoration: 'none',
                                  padding: '0.4rem 0.6rem',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  background: 'rgba(255,255,255,0.06)',
                                  border: '1px solid var(--border-subtle)',
                                  color: '#fff',
                                  borderRadius: '6px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                ⬇️
                              </a>

                              <button
                                onClick={() => handleDeleteLibraryItem(item.id)}
                                title="Excluir da Biblioteca"
                                style={{
                                  background: 'rgba(255, 90, 31, 0.1)',
                                  border: '1px solid rgba(255, 90, 31, 0.3)',
                                  color: 'var(--accent-primary)',
                                  borderRadius: '6px',
                                  padding: '0.4rem 0.6rem',
                                  cursor: 'pointer'
                                }}
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                </div>

              </div>

            </div>
          )}

          {/* Modal de Upload para Biblioteca de Mídias */}
          {isUploadLibModalOpen && (
            <div className="burger-ui-modal-overlay" onClick={() => setIsUploadLibModalOpen(false)}>
              <div className="burger-ui-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>📤</span>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                      Enviar Mídia para a Biblioteca
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsUploadLibModalOpen(false)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveLibraryItem} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  {/* Pasta / Categoria */}
                  <div className="burger-ui-form-group">
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      Pasta / Categoria de Destino
                    </label>
                    <select
                      value={uploadLibCat}
                      onChange={(e) => {
                        setUploadLibCat(e.target.value);
                        if (e.target.value === 'videos') {
                          setUploadLibType('video');
                          setUploadLibFormat('MP4');
                        } else if (e.target.value === 'logos' || e.target.value === 'icones') {
                          setUploadLibType('vector');
                          setUploadLibFormat('PNG');
                        } else {
                          setUploadLibType('image');
                          setUploadLibFormat('WEBP');
                        }
                      }}
                      className="burger-ui-input"
                    >
                      {initialLibraryCategories.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.icon} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Nome da Mídia */}
                  <div className="burger-ui-form-group">
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      Nome do Arquivo / Título
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Smash Bacon Especial Top Angle"
                      value={uploadLibName}
                      onChange={(e) => setUploadLibName(e.target.value)}
                      className="burger-ui-input"
                      required
                    />
                  </div>

                  {/* Drag & Drop Upload Zone */}
                  <div className="burger-ui-form-group">
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      Arquivo do Computador
                    </label>
                    
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDraggingLib(true); }}
                      onDragLeave={() => setIsDraggingLib(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDraggingLib(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          const file = e.dataTransfer.files[0];
                          if (!uploadLibName) {
                            setUploadLibName(file.name.replace(/\.[^/.]+$/, ''));
                          }
                          handleFileUpload(file, (url) => setUploadLibUrl(url));
                        }
                      }}
                      style={{
                        border: isDraggingLib ? '2px dashed var(--accent-primary)' : '2px dashed var(--border-subtle)',
                        borderRadius: '10px',
                        padding: '1.5rem',
                        backgroundColor: isDraggingLib ? 'rgba(255, 90, 31, 0.05)' : 'rgba(255, 255, 255, 0.01)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.6rem',
                        textAlign: 'center'
                      }}
                    >
                      {uploadLibUrl ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                          {uploadLibType === 'video' ? (
                            <video src={uploadLibUrl} controls style={{ maxHeight: '120px', maxWidth: '100%', borderRadius: '6px' }} />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={uploadLibUrl} alt="Preview" style={{ maxHeight: '120px', maxWidth: '100%', objectFit: 'contain', borderRadius: '6px' }} />
                          )}
                          <span style={{ fontSize: '0.75rem', color: 'var(--accent-success)', fontWeight: 700 }}>
                            ✓ Arquivo Carregado com Sucesso
                          </span>
                        </div>
                      ) : (
                        <>
                          <span style={{ fontSize: '2rem' }}>📁</span>
                          <label style={{
                            padding: '0.5rem 1.25rem',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #FF5A1F, #FF8C00)',
                            color: '#fff',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(255, 90, 31, 0.3)',
                            display: 'inline-block'
                          }}>
                            [Selecionar Arquivo]
                            <input
                              type="file"
                              accept=".jpg,.jpeg,.png,.webp,.tif,.tiff,.mp4,.mov,.avi,.webm,image/*,video/*"
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const file = e.target.files[0];
                                  if (!uploadLibName) {
                                    setUploadLibName(file.name.replace(/\.[^/.]+$/, ''));
                                  }
                                  handleFileUpload(file, (url) => setUploadLibUrl(url));
                                }
                              }}
                            />
                          </label>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ou arraste aqui</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                            Formatos: JPG, PNG, WEBP, TIFF, MP4, MOV, AVI, WEBM
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="burger-ui-form-group">
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      Tags / Palavras-chave (separadas por vírgula)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: smash, duplo, artesanal, promoção"
                      value={uploadLibTags}
                      onChange={(e) => setUploadLibTags(e.target.value)}
                      className="burger-ui-input"
                    />
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <Button variant="secondary" onClick={() => setIsUploadLibModalOpen(false)}>
                      Cancelar
                    </Button>
                    <Button variant="primary" type="submit" disabled={!uploadLibName || !uploadLibUrl}>
                      💾 Salvar na Biblioteca
                    </Button>
                  </div>

                </form>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* File Preview Modal */}
      {previewFileModal && (
        <div className="burger-ui-modal-overlay" onClick={() => setPreviewFileModal(null)}>
          <div className="burger-ui-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
                  {previewFileModal.name}
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {previewFileModal.label} • {previewFileModal.resolution}
                </span>
              </div>
              <button
                onClick={() => setPreviewFileModal(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ minHeight: '280px', maxHeight: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#050508', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
              {previewFileModal.type === 'image' && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewFileModal.url} alt={previewFileModal.name} style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }} />
              )}
              {previewFileModal.type === 'video' && (
                <video src={previewFileModal.url} controls autoPlay loop style={{ maxWidth: '100%', maxHeight: '400px' }} />
              )}
              {previewFileModal.type === 'document' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem' }}>
                  <span style={{ fontSize: '4rem' }}>📄</span>
                  <div style={{ textAlign: 'center' }}>
                    <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Documento PDF Vetorial</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Pronto para impressão em alta definição (300 DPI / CMYK).</p>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>
                {previewFileModal.usage}
              </span>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Button variant="secondary" onClick={() => setPreviewFileModal(null)}>
                  Fechar
                </Button>
                <a
                  href={previewFileModal.url}
                  download={previewFileModal.name}
                  style={{
                    textDecoration: 'none',
                    padding: '0.6rem 1.25rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #FF5A1F, #FF8C00)',
                    color: '#fff',
                    borderRadius: '8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  ⬇️ Baixar Arquivo
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="burger-ui-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div 
            className="burger-ui-modal-content" 
            onClick={(e) => e.stopPropagation()} 
            style={{ maxWidth: '800px', width: '96%', maxHeight: '92vh', display: 'flex', flexDirection: 'column', padding: '1.5rem', overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexShrink: 0 }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                🍔 {editingProductId ? 'Editar Produto' : 'Novo Produto'}
              </h3>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.25rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* 4 Tabs Navigation */}
            <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.5rem', overflowX: 'auto' }}>
              <button 
                type="button" 
                onClick={() => setModalSubTab('info')} 
                style={{ 
                  padding: '0.6rem 1rem', 
                  background: 'none', 
                  border: 'none', 
                  borderBottom: modalSubTab === 'info' ? '2px solid var(--accent-primary)' : '2px solid transparent', 
                  color: modalSubTab === 'info' ? '#fff' : 'var(--text-secondary)', 
                  cursor: 'pointer', 
                  fontWeight: modalSubTab === 'info' ? 700 : 500, 
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>📋</span> Aba 1 — Informações
              </button>

              <button 
                type="button" 
                onClick={() => setModalSubTab('media')} 
                style={{ 
                  padding: '0.6rem 1rem', 
                  background: 'none', 
                  border: 'none', 
                  borderBottom: modalSubTab === 'media' ? '2px solid var(--accent-primary)' : '2px solid transparent', 
                  color: modalSubTab === 'media' ? '#fff' : 'var(--text-secondary)', 
                  cursor: 'pointer', 
                  fontWeight: modalSubTab === 'media' ? 700 : 500, 
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>📁</span> Aba 2 — Arquivos
              </button>

              <button 
                type="button" 
                onClick={() => setModalSubTab('promocao')} 
                style={{ 
                  padding: '0.6rem 1rem', 
                  background: 'none', 
                  border: 'none', 
                  borderBottom: modalSubTab === 'promocao' ? '2px solid var(--accent-primary)' : '2px solid transparent', 
                  color: modalSubTab === 'promocao' ? '#fff' : 'var(--text-secondary)', 
                  cursor: 'pointer', 
                  fontWeight: modalSubTab === 'promocao' ? 700 : 500, 
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>🔥</span> Aba 3 — Promoções & TV
              </button>

              <button 
                type="button" 
                onClick={() => setModalSubTab('historico')} 
                style={{ 
                  padding: '0.6rem 1rem', 
                  background: 'none', 
                  border: 'none', 
                  borderBottom: modalSubTab === 'historico' ? '2px solid var(--accent-primary)' : '2px solid transparent', 
                  color: modalSubTab === 'historico' ? '#fff' : 'var(--text-secondary)', 
                  cursor: 'pointer', 
                  fontWeight: modalSubTab === 'historico' ? 700 : 500, 
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>📜</span> Aba 4 — Histórico
              </button>
            </div>
            
            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', paddingBottom: '1rem' }}>
              {/* ABA 1 — INFORMAÇÕES */}
              {modalSubTab === 'info' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  
                  {/* Nome */}
                  <div className="burger-ui-form-group">
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Nome do Produto</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Smash Bacon Especial" 
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      className="burger-ui-input"
                      required
                    />
                  </div>

                    {/* Categoria */}
                    <div className="burger-ui-form-group">
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Categoria</label>
                      <select 
                        value={prodCategory}
                        onChange={(e) => setProdCategory(e.target.value)}
                        className="burger-ui-input"
                      >
                        <option value="Sanduiches">Sanduiches</option>
                        <option value="Hot Dog">Hot Dog</option>
                        <option value="Porções">Porções</option>
                        <option value="Pasteis">Pasteis</option>
                        <option value="Salgados">Salgados</option>
                        <option value="Refrigerantes">Refrigerantes</option>
                        <option value="Sucos">Sucos</option>
                        <option value="Bebidas Alcóolicas">Bebidas Alcóolicas</option>
                      </select>
                    </div>

                  {/* Preço */}
                  <div className="burger-ui-form-group">
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Preço (R$)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      placeholder="Ex: 35.00" 
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      className="burger-ui-input"
                      required
                    />
                  </div>

                  {/* Peso */}
                  <div className="burger-ui-form-group">
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Peso / Porção</label>
                    <input 
                      type="text" 
                      placeholder="Ex: 280g ou 350g" 
                      value={prodWeight}
                      onChange={(e) => setProdWeight(e.target.value)}
                      className="burger-ui-input"
                    />
                  </div>

                  {/* Descrição */}
                  <div className="burger-ui-form-group" style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Descrição</label>
                    <textarea 
                      placeholder="Ex: Dois blends smash de 90g grelhados na brasa, queijo cheddar derretido e tiras crocantes de bacon defumado." 
                      value={prodDescription}
                      onChange={(e) => setProdDescription(e.target.value)}
                      className="burger-ui-input"
                      rows={2}
                      style={{ fontFamily: 'inherit' }}
                    />
                  </div>

                  {/* Ingredientes */}
                  <div className="burger-ui-form-group" style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Ingredientes (separados por vírgula)</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Pão Brioche Amanteigado, Blend 120g, Queijo Cheddar Inglês, Bacon Crocante, Maionese da Casa" 
                      value={prodIngredients}
                      onChange={(e) => setProdIngredients(e.target.value)}
                      className="burger-ui-input"
                    />
                  </div>

                  {/* Disponível */}
                  <div className="burger-ui-form-group" style={{ gridColumn: 'span 2' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1.25rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '10px'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 700 }}>Disponibilidade no Cardápio</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {prodActive ? '✓ Produto ativo e visível no cardápio online e TV Signage' : '✗ Produto pausado / indisponível para pedidos'}
                        </div>
                      </div>
                      <label className="burger-ui-switch-label" style={{ margin: 0 }}>
                        <input 
                          type="checkbox" 
                          checked={prodActive}
                          onChange={(e) => setProdActive(e.target.checked)}
                          style={{ accentColor: 'var(--accent-primary)', width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: prodActive ? 'var(--accent-success)' : 'var(--text-muted)' }}>
                          {prodActive ? 'Disponível' : 'Indisponível'}
                        </span>
                      </label>
                    </div>
                  </div>

                </div>
              )}

              {/* ABA 2 — ARQUIVOS & SELETOR DE ORIGEM */}
              {modalSubTab === 'media' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                  
                  {/* Top Notice */}
                  <div style={{
                    padding: '1rem 1.25rem',
                    background: 'linear-gradient(135deg, rgba(255, 90, 31, 0.12), rgba(255, 183, 3, 0.06))',
                    border: '1px solid rgba(255, 90, 31, 0.3)',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '1.4rem' }}>✨</span>
                      <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 800 }}>
                        O Diferencial: Escolha a Origem das Mídias do Produto
                      </div>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                      Você tem liberdade total para gerar imagens e vídeos com inteligência artificial, enviar seus próprios arquivos do computador ou selecionar mídias prontas da sua biblioteca.
                    </p>
                  </div>

                  {/* ──────────────────────────────────────────────────────────── */}
                  {/* 1. SEÇÃO: ORIGEM DA IMAGEM                                   */}
                  {/* ──────────────────────────────────────────────────────────── */}
                  <div className="burger-ui-card" style={{ padding: '1.5rem', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        📸 Origem da Imagem
                      </div>
                      {prodImageUrl && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-success)', fontWeight: 700, background: 'rgba(46, 196, 182, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                          ✓ Imagem Definida
                        </span>
                      )}
                    </div>

                    {/* 3 Radio Options */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem' }}>
                      
                      {/* Option 1: Gerar com IA */}
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.85rem 1rem',
                        borderRadius: '10px',
                        border: imageSourceOrigin === 'ai' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        background: imageSourceOrigin === 'ai' ? 'rgba(255, 90, 31, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}>
                        <input
                          type="radio"
                          name="image_origin_choice"
                          checked={imageSourceOrigin === 'ai'}
                          onChange={() => setImageSourceOrigin('ai')}
                          style={{ accentColor: 'var(--accent-primary)', width: '18px', height: '18px' }}
                        />
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: imageSourceOrigin === 'ai' ? '#fff' : 'var(--text-secondary)' }}>
                            🤖 Gerar com IA
                          </div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Foto profissional gerada</span>
                        </div>
                      </label>

                      {/* Option 2: Usar imagem enviada */}
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.85rem 1rem',
                        borderRadius: '10px',
                        border: imageSourceOrigin === 'upload' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        background: imageSourceOrigin === 'upload' ? 'rgba(255, 90, 31, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}>
                        <input
                          type="radio"
                          name="image_origin_choice"
                          checked={imageSourceOrigin === 'upload'}
                          onChange={() => setImageSourceOrigin('upload')}
                          style={{ accentColor: 'var(--accent-primary)', width: '18px', height: '18px' }}
                        />
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: imageSourceOrigin === 'upload' ? '#fff' : 'var(--text-secondary)' }}>
                            📤 Usar imagem enviada
                          </div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Upload do computador</span>
                        </div>
                      </label>

                      {/* Option 3: Usar imagem da biblioteca */}
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.85rem 1rem',
                        borderRadius: '10px',
                        border: imageSourceOrigin === 'library' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        background: imageSourceOrigin === 'library' ? 'rgba(255, 90, 31, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}>
                        <input
                          type="radio"
                          name="image_origin_choice"
                          checked={imageSourceOrigin === 'library'}
                          onChange={() => setImageSourceOrigin('library')}
                          style={{ accentColor: 'var(--accent-primary)', width: '18px', height: '18px' }}
                        />
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: imageSourceOrigin === 'library' ? '#fff' : 'var(--text-secondary)' }}>
                            📚 Usar da biblioteca
                          </div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Selecionar das 10 pastas</span>
                        </div>
                      </label>

                    </div>

                    {/* Sub-painel dinâmico da Origem da Imagem */}
                    <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                      
                      {/* Caso 1: Gerar com IA */}
                      {imageSourceOrigin === 'ai' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              Motor de Geração: <strong style={{ color: 'var(--accent-primary)' }}>{imageAiProvider === 'gpt-image' ? 'GPT Image Studio' : customImageProvider || 'Provedor Customizado'}</strong>
                            </span>
                            <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#fff' }}>
                              Prompt Otimizado Automaticamente
                            </span>
                          </div>

                          <div style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Prompt Base:</span> &quot;Fotografia publicitária em 8K de {prodName || 'Hambúrguer Smash Artesanal'}, categoria {prodCategory}, com {prodIngredients || 'ingredientes selecionados, queijo derretido e pão brioche dourado'}, iluminação de estúdio gastronômico premium.&quot;
                          </div>

                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <Button
                              type="button"
                              variant="primary"
                              disabled={isGeneratingAiImage}
                              onClick={() => {
                                setIsGeneratingAiImage(true);
                                setTimeout(() => {
                                  setProdImageUrl('/foto.png');
                                  setIsGeneratingAiImage(false);
                                }, 1200);
                              }}
                              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}
                            >
                              {isGeneratingAiImage ? '⏳ Renderizando Imagem IA...' : '⚡ Gerar Imagem com IA'}
                            </Button>

                            {prodImageUrl && (
                              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--accent-success)', fontWeight: 700 }}>
                                  ✓ Imagem gerada com sucesso!
                                </span>
                                <button
                                  type="button"
                                  onClick={() => openAiEditorForImage(prodImageUrl, 'main')}
                                  style={{
                                    padding: '0.35rem 0.75rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                    background: 'linear-gradient(135deg, #FFB703, #FF5A1F)',
                                    color: '#000',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    boxShadow: '0 2px 8px rgba(255, 183, 3, 0.3)'
                                  }}
                                >
                                  ✨ Melhorar Imagem
                                </button>
                              </div>
                            )}
                          </div>

                          {prodImageUrl && (
                            <div style={{ marginTop: '0.5rem', width: '160px', height: '120px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-subtle)', position: 'relative' }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={prodImageUrl} alt="Imagem IA Gerada" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Caso 2: Usar imagem enviada */}
                      {imageSourceOrigin === 'upload' && (
                        <div
                          onDragOver={(e) => { e.preventDefault(); setIsDraggingMain(true); }}
                          onDragLeave={() => setIsDraggingMain(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDraggingMain(false);
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              handleFileUpload(e.dataTransfer.files[0], (url) => setProdImageUrl(url));
                            }
                          }}
                          style={{
                            border: isDraggingMain ? '2px dashed var(--accent-primary)' : '2px dashed var(--border-subtle)',
                            borderRadius: '10px',
                            padding: '1.5rem',
                            backgroundColor: isDraggingMain ? 'rgba(255, 90, 31, 0.05)' : 'rgba(255, 255, 255, 0.01)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            textAlign: 'center'
                          }}
                        >
                          {prodImageUrl ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
                              <div style={{ width: '160px', height: '120px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={prodImageUrl} alt="Imagem Enviada" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                                <label style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(255,255,255,0.08)', borderRadius: '6px', cursor: 'pointer', color: '#fff' }}>
                                  Trocar
                                  <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.webp,.tif,.tiff,image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        handleFileUpload(e.target.files[0], (url) => setProdImageUrl(url));
                                      }
                                    }}
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => openAiEditorForImage(prodImageUrl, 'main')}
                                  style={{
                                    padding: '0.35rem 0.8rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                    background: 'linear-gradient(135deg, #FFB703, #FF5A1F)',
                                    color: '#000',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.3rem'
                                  }}
                                >
                                  ✨ Melhorar Imagem
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setProdImageUrl('')}
                                  style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem', background: 'rgba(255,90,31,0.15)', border: '1px solid rgba(255,90,31,0.3)', color: 'var(--accent-primary)', borderRadius: '6px', cursor: 'pointer' }}
                                >
                                  Remover
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <span style={{ fontSize: '2rem' }}>🖼️</span>
                              <label style={{
                                padding: '0.5rem 1.25rem',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #FF5A1F, #FF8C00)',
                                color: '#fff',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'inline-block'
                              }}>
                                [Selecionar Arquivo]
                                <input
                                  type="file"
                                  accept=".jpg,.jpeg,.png,.webp,.tif,.tiff,image/*"
                                  style={{ display: 'none' }}
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      handleFileUpload(e.target.files[0], (url) => setProdImageUrl(url));
                                    }
                                  }}
                                />
                              </label>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ou arraste aqui • Formatos: JPG, PNG, WEBP, TIFF</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', maxWidth: '380px', marginTop: '0.4rem' }}>
                                <input
                                  type="text"
                                  placeholder="Ou cole a URL / caminho da imagem (/foto.png)"
                                  value={prodImageUrl}
                                  onChange={(e) => setProdImageUrl(e.target.value)}
                                  className="burger-ui-input"
                                  style={{ flex: 1, fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* Caso 3: Usar imagem da biblioteca */}
                      {imageSourceOrigin === 'library' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                              Selecione uma imagem da sua biblioteca:
                            </span>
                            <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', maxWidth: '100%' }}>
                              {['sanduiches', 'hot-dog', 'porcoes', 'pasteis', 'salgados', 'refrigerantes', 'sucos', 'bebidas-alcoolicas'].map((catId) => (
                                <button
                                  key={catId}
                                  type="button"
                                  onClick={() => setLibraryPickerCat(catId)}
                                  style={{
                                    padding: '0.25rem 0.55rem',
                                    fontSize: '0.7rem',
                                    fontWeight: libraryPickerCat === catId ? 700 : 500,
                                    background: libraryPickerCat === catId ? 'var(--accent-primary)' : 'rgba(255,255,255,0.04)',
                                    color: libraryPickerCat === catId ? '#fff' : 'var(--text-secondary)',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    textTransform: 'capitalize',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {catId}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.65rem', maxHeight: '180px', overflowY: 'auto', padding: '0.25rem' }}>
                            {libraryItems
                              .filter(item => item.category === libraryPickerCat && item.type === 'image')
                              .map(item => {
                                const isSelected = prodImageUrl === item.url;
                                return (
                                  <div
                                    key={item.id}
                                    onClick={() => setProdImageUrl(item.url)}
                                    style={{
                                      border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                                      borderRadius: '8px',
                                      overflow: 'hidden',
                                      cursor: 'pointer',
                                      background: 'rgba(0,0,0,0.5)',
                                      position: 'relative',
                                      height: '85px'
                                    }}
                                  >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={item.url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    {isSelected && (
                                      <div style={{ position: 'absolute', bottom: '4px', right: '4px', background: 'var(--accent-primary)', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '0.1rem 0.3rem', borderRadius: '3px' }}>
                                        ✓ Ativa
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      )}

                    </div>

                  </div>

                  {/* ──────────────────────────────────────────────────────────── */}
                  {/* 2. SEÇÃO: ORIGEM DO VÍDEO                                    */}
                  {/* ──────────────────────────────────────────────────────────── */}
                  <div className="burger-ui-card" style={{ padding: '1.5rem', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        🎥 Origem do Vídeo
                      </div>
                      {(prodVideoUrl || prodVideos[0]) && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-success)', fontWeight: 700, background: 'rgba(46, 196, 182, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                          ✓ Vídeo Configurado
                        </span>
                      )}
                    </div>

                    {/* 3 Radio Options */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem' }}>
                      
                      {/* Option 1: Gerar vídeo IA */}
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.85rem 1rem',
                        borderRadius: '10px',
                        border: videoSourceOrigin === 'ai' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        background: videoSourceOrigin === 'ai' ? 'rgba(255, 90, 31, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}>
                        <input
                          type="radio"
                          name="video_origin_choice"
                          checked={videoSourceOrigin === 'ai'}
                          onChange={() => setVideoSourceOrigin('ai')}
                          style={{ accentColor: 'var(--accent-primary)', width: '18px', height: '18px' }}
                        />
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: videoSourceOrigin === 'ai' ? '#fff' : 'var(--text-secondary)' }}>
                            🎬 Gerar vídeo IA
                          </div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Veo, Kling ou Runway</span>
                        </div>
                      </label>

                      {/* Option 2: Usar vídeo enviado */}
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.85rem 1rem',
                        borderRadius: '10px',
                        border: videoSourceOrigin === 'upload' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        background: videoSourceOrigin === 'upload' ? 'rgba(255, 90, 31, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}>
                        <input
                          type="radio"
                          name="video_origin_choice"
                          checked={videoSourceOrigin === 'upload'}
                          onChange={() => setVideoSourceOrigin('upload')}
                          style={{ accentColor: 'var(--accent-primary)', width: '18px', height: '18px' }}
                        />
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: videoSourceOrigin === 'upload' ? '#fff' : 'var(--text-secondary)' }}>
                            📤 Usar vídeo enviado
                          </div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>MP4, MOV, AVI, WEBM</span>
                        </div>
                      </label>

                      {/* Option 3: Criar vídeo usando minhas imagens */}
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.85rem 1rem',
                        borderRadius: '10px',
                        border: videoSourceOrigin === 'images_to_video' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        background: videoSourceOrigin === 'images_to_video' ? 'rgba(255, 90, 31, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}>
                        <input
                          type="radio"
                          name="video_origin_choice"
                          checked={videoSourceOrigin === 'images_to_video'}
                          onChange={() => setVideoSourceOrigin('images_to_video')}
                          style={{ accentColor: 'var(--accent-primary)', width: '18px', height: '18px' }}
                        />
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: videoSourceOrigin === 'images_to_video' ? '#fff' : 'var(--text-secondary)' }}>
                            🎞️ Criar com minhas imagens
                          </div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Montagem dinâmica animada</span>
                        </div>
                      </label>

                    </div>

                    {/* Sub-painel dinâmico da Origem do Vídeo */}
                    <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                      
                      {/* Caso 1: Gerar vídeo IA */}
                      {videoSourceOrigin === 'ai' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              Motor Ativo de Vídeo: <strong style={{ color: 'var(--accent-secondary)', textTransform: 'uppercase' }}>{videoAiProvider}</strong>
                            </span>
                            <span style={{ fontSize: '0.75rem', background: 'rgba(255, 183, 3, 0.15)', color: 'var(--accent-secondary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                              Resolução: 4K Ultra HD Signage
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <Button
                              type="button"
                              variant="primary"
                              disabled={isGeneratingAiVideo}
                              onClick={() => {
                                setIsGeneratingAiVideo(true);
                                setTimeout(() => {
                                  const defaultVid = 'https://assets.mixkit.co/videos/preview/mixkit-cooking-in-a-professional-kitchen-41624-large.mp4';
                                  setProdVideoUrl(defaultVid);
                                  const copy = [...prodVideos];
                                  copy[0] = defaultVid;
                                  setProdVideos(copy);
                                  setIsGeneratingAiVideo(false);
                                }, 1500);
                              }}
                              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}
                            >
                              {isGeneratingAiVideo ? '⏳ Renderizando Vídeo com IA...' : `🎬 Gerar Vídeo com ${videoAiProvider.toUpperCase()}`}
                            </Button>

                            {prodVideoUrl && (
                              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--accent-success)', fontWeight: 700 }}>
                                  ✓ Vídeo pronto!
                                </span>
                                <button
                                  type="button"
                                  onClick={() => openAiVideoEditor(prodVideoUrl)}
                                  style={{
                                    padding: '0.35rem 0.75rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                    background: 'linear-gradient(135deg, #FF5A1F, #FFB703)',
                                    color: '#000',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.35rem'
                                  }}
                                >
                                  🎬 Editar Vídeo
                                </button>
                              </div>
                            )}
                          </div>

                          {prodVideoUrl && (
                            <div style={{ marginTop: '0.5rem', width: '220px', height: '130px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-subtle)', backgroundColor: '#000', position: 'relative' }}>
                              <video src={prodVideoUrl} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Caso 2: Usar vídeo enviado */}
                      {videoSourceOrigin === 'upload' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <label style={{
                              padding: '0.5rem 1.25rem',
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              background: 'linear-gradient(135deg, #FF5A1F, #FF8C00)',
                              color: '#fff',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              display: 'inline-block'
                            }}>
                              [Selecionar Arquivo de Vídeo]
                              <input
                                type="file"
                                accept=".mp4,.mov,.avi,.webm,video/*"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleFileUpload(e.target.files[0], (url) => {
                                      setProdVideoUrl(url);
                                      const copy = [...prodVideos];
                                      copy[0] = url;
                                      setProdVideos(copy);
                                    });
                                  }
                                }}
                              />
                            </label>
                            {prodVideoUrl && (
                              <button
                                type="button"
                                onClick={() => openAiVideoEditor(prodVideoUrl)}
                                style={{
                                  padding: '0.5rem 1rem',
                                  fontSize: '0.85rem',
                                  fontWeight: 800,
                                  background: 'linear-gradient(135deg, #FF5A1F, #FFB703)',
                                  color: '#000',
                                  border: 'none',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.4rem'
                                }}
                              >
                                🎬 Editar Vídeo com IA
                              </button>
                            )}
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              Formatos aceitos: MP4, MOV, AVI, WEBM
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', maxWidth: '440px', marginTop: '0.25rem' }}>
                              <input
                                type="text"
                                placeholder="Ou cole a URL / link do vídeo (.mp4)"
                                value={prodVideoUrl}
                                onChange={(e) => {
                                  setProdVideoUrl(e.target.value);
                                  const copy = [...prodVideos];
                                  copy[0] = e.target.value;
                                  setProdVideos(copy);
                                }}
                                className="burger-ui-input"
                                style={{ flex: 1, fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}
                              />
                            </div>
                          </div>

                          {prodVideoUrl && (
                            <div style={{ width: '220px', height: '130px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-subtle)', backgroundColor: '#000' }}>
                              <video src={prodVideoUrl} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Caso 3: Criar vídeo usando minhas imagens */}
                      {videoSourceOrigin === 'images_to_video' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                          
                          {/* Header Explicativo */}
                          <div style={{
                            padding: '0.85rem 1rem',
                            background: 'linear-gradient(135deg, rgba(255, 183, 3, 0.1), rgba(255, 90, 31, 0.06))',
                            border: '1px solid rgba(255, 183, 3, 0.3)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                          }}>
                            <span style={{ fontSize: '1.5rem' }}>🎞️</span>
                            <div>
                              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>
                                Motor de Vídeo Dinâmico por Imagens (Motion Video Engine)
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                Envie 3 fotos e o sistema monta automaticamente: <strong>zoom cinematográfico, movimento 3D, fumaça, partículas, transições, música e logo</strong> — sem precisar gerar um vídeo novo por IA!
                              </div>
                            </div>
                          </div>

                          {/* 1. SELEÇÃO DAS 3 FOTOS */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              📸 1. Suas 3 Imagens para a Montagem
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem' }}>
                              
                              {/* Foto 1 */}
                              <div style={{
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '10px',
                                padding: '0.75rem',
                                background: 'rgba(255,255,255,0.02)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem',
                                textAlign: 'center'
                              }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>foto1.jpg (Ângulo Principal)</span>
                                <div style={{ width: '100%', height: '80px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-subtle)', position: 'relative' }}>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={motionPhoto1 || prodImageUrl || '/foto.png'} alt="Foto 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <label style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', fontWeight: 700, background: 'rgba(255,255,255,0.06)', borderRadius: '4px', cursor: 'pointer', color: '#fff', width: '100%' }}>
                                  Trocar Foto 1
                                  <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.webp,.tif,.tiff,image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        handleFileUpload(e.target.files[0], (url) => setMotionPhoto1(url));
                                      }
                                    }}
                                  />
                                </label>
                              </div>

                              {/* Foto 2 */}
                              <div style={{
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '10px',
                                padding: '0.75rem',
                                background: 'rgba(255,255,255,0.02)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem',
                                textAlign: 'center'
                              }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>foto2.jpg (Close-up / Queijo)</span>
                                <div style={{ width: '100%', height: '80px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-subtle)', position: 'relative' }}>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={motionPhoto2 || prodGallery[0] || '/feed.png'} alt="Foto 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <label style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', fontWeight: 700, background: 'rgba(255,255,255,0.06)', borderRadius: '4px', cursor: 'pointer', color: '#fff', width: '100%' }}>
                                  Trocar Foto 2
                                  <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.webp,.tif,.tiff,image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        handleFileUpload(e.target.files[0], (url) => setMotionPhoto2(url));
                                      }
                                    }}
                                  />
                                </label>
                              </div>

                              {/* Foto 3 */}
                              <div style={{
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '10px',
                                padding: '0.75rem',
                                background: 'rgba(255,255,255,0.02)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem',
                                textAlign: 'center'
                              }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>foto3.jpg (Corte / Suculência)</span>
                                <div style={{ width: '100%', height: '80px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-subtle)', position: 'relative' }}>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={motionPhoto3 || prodGallery[1] || '/story.png'} alt="Foto 3" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <label style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', fontWeight: 700, background: 'rgba(255,255,255,0.06)', borderRadius: '4px', cursor: 'pointer', color: '#fff', width: '100%' }}>
                                  Trocar Foto 3
                                  <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.webp,.tif,.tiff,image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        handleFileUpload(e.target.files[0], (url) => setMotionPhoto3(url));
                                      }
                                    }}
                                  />
                                </label>
                              </div>

                            </div>
                          </div>

                          {/* 2. EFEITOS CINEMATOGRÁFICOS AUTOMÁTICOS */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              ⚡ 2. Efeitos Aplicados Automaticamente
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem' }}>
                              
                              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', cursor: 'pointer', fontSize: '0.8rem', color: '#fff' }}>
                                <input
                                  type="checkbox"
                                  checked={motionEffectZoom}
                                  onChange={(e) => setMotionEffectZoom(e.target.checked)}
                                  style={{ accentColor: 'var(--accent-primary)' }}
                                />
                                <span>🔍 Zoom Cinematográfico</span>
                              </label>

                              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', cursor: 'pointer', fontSize: '0.8rem', color: '#fff' }}>
                                <input
                                  type="checkbox"
                                  checked={motionEffectMovement}
                                  onChange={(e) => setMotionEffectMovement(e.target.checked)}
                                  style={{ accentColor: 'var(--accent-primary)' }}
                                />
                                <span>🏃 Movimento de Câmera 3D</span>
                              </label>

                              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', cursor: 'pointer', fontSize: '0.8rem', color: '#fff' }}>
                                <input
                                  type="checkbox"
                                  checked={motionEffectSmoke}
                                  onChange={(e) => setMotionEffectSmoke(e.target.checked)}
                                  style={{ accentColor: 'var(--accent-primary)' }}
                                />
                                <span>💨 Fumaça e Vapor Gourmet</span>
                              </label>

                              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', cursor: 'pointer', fontSize: '0.8rem', color: '#fff' }}>
                                <input
                                  type="checkbox"
                                  checked={motionEffectParticles}
                                  onChange={(e) => setMotionEffectParticles(e.target.checked)}
                                  style={{ accentColor: 'var(--accent-primary)' }}
                                />
                                <span>✨ Partículas e Faíscas</span>
                              </label>

                              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', cursor: 'pointer', fontSize: '0.8rem', color: '#fff' }}>
                                <input
                                  type="checkbox"
                                  checked={motionEffectTransitions}
                                  onChange={(e) => setMotionEffectTransitions(e.target.checked)}
                                  style={{ accentColor: 'var(--accent-primary)' }}
                                />
                                <span>⚡ Transições Suaves</span>
                              </label>

                              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', cursor: 'pointer', fontSize: '0.8rem', color: '#fff' }}>
                                <input
                                  type="checkbox"
                                  checked={motionEffectLogo}
                                  onChange={(e) => setMotionEffectLogo(e.target.checked)}
                                  style={{ accentColor: 'var(--accent-primary)' }}
                                />
                                <span>🏷️ Logo com Glow</span>
                              </label>

                            </div>

                            {/* Seletor de Trilha Sonora */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0,0,0,0.3)', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                🎵 Trilha Sonora:
                              </span>
                              <select
                                value={motionEffectMusic}
                                onChange={(e) => setMotionEffectMusic(e.target.value)}
                                className="burger-ui-input"
                                style={{ flex: 1, padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                              >
                                <option value="rock_sizzle">🎸 Rock Sizzle & Chapa Quente (Enérgico)</option>
                                <option value="lofi_burger">☕ Lo-Fi Gastronômico (Moderno & Relax)</option>
                                <option value="epic_cinematic">🎬 Trailer Cinemático Gastrô (Impactante)</option>
                                <option value="chill_lounge">🍸 Lounge Artesanal & Beats (Elegante)</option>
                              </select>

                              {/* Equalizer Waveform Indicator */}
                              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '18px' }}>
                                {[1, 2, 3, 4, 5].map((bar) => (
                                  <div
                                    key={bar}
                                    style={{
                                      width: '3px',
                                      background: 'var(--accent-primary)',
                                      borderRadius: '1px',
                                      animation: `eqBarAnim 0.8s ease-in-out infinite alternate ${bar * 0.15}s`
                                    }}
                                  />
                                ))}
                              </div>
                            </div>

                          </div>

                          {/* 3. SIMULADOR / LIVE MOTION CANVAS */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                📺 3. Simulador em Tempo Real (Live Motion)
                              </div>

                              {/* Format Switcher */}
                              <div style={{ display: 'flex', gap: '0.35rem' }}>
                                {(['16:9', '9:16', '1:1'] as const).map((fmt) => (
                                  <button
                                    key={fmt}
                                    type="button"
                                    onClick={() => setMotionFormat(fmt)}
                                    style={{
                                      padding: '0.2rem 0.5rem',
                                      fontSize: '0.7rem',
                                      fontWeight: motionFormat === fmt ? 700 : 500,
                                      background: motionFormat === fmt ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                                      color: motionFormat === fmt ? '#fff' : 'var(--text-secondary)',
                                      border: 'none',
                                      borderRadius: '4px',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    {fmt === '16:9' ? '📺 TV 16:9' : fmt === '9:16' ? '📱 Reels 9:16' : '⬛ Feed 1:1'}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Canvas Stage */}
                            <div style={{
                              width: '100%',
                              height: motionFormat === '16:9' ? '240px' : motionFormat === '9:16' ? '300px' : '260px',
                              maxWidth: motionFormat === '9:16' ? '200px' : '100%',
                              margin: '0 auto',
                              backgroundColor: '#050508',
                              borderRadius: '12px',
                              overflow: 'hidden',
                              border: '1px solid rgba(255, 90, 31, 0.4)',
                              position: 'relative',
                              boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              
                              {/* Slide 1 Image */}
                              <div style={{
                                position: 'absolute',
                                inset: 0,
                                opacity: motionSlideIndex === 0 ? 1 : 0,
                                transition: motionEffectTransitions ? 'opacity 0.8s ease-in-out' : 'none',
                                overflow: 'hidden'
                              }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={motionPhoto1 || prodImageUrl || '/foto.png'}
                                  alt="Slide 1"
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    animation: motionEffectZoom ? 'motionZoom1 5s ease-in-out infinite alternate' : 'none'
                                  }}
                                />
                              </div>

                              {/* Slide 2 Image */}
                              <div style={{
                                position: 'absolute',
                                inset: 0,
                                opacity: motionSlideIndex === 1 ? 1 : 0,
                                transition: motionEffectTransitions ? 'opacity 0.8s ease-in-out' : 'none',
                                overflow: 'hidden'
                              }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={motionPhoto2 || prodGallery[0] || '/feed.png'}
                                  alt="Slide 2"
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    animation: motionEffectZoom ? 'motionZoom2 5s ease-in-out infinite alternate' : 'none'
                                  }}
                                />
                              </div>

                              {/* Slide 3 Image */}
                              <div style={{
                                position: 'absolute',
                                inset: 0,
                                opacity: motionSlideIndex === 2 ? 1 : 0,
                                transition: motionEffectTransitions ? 'opacity 0.8s ease-in-out' : 'none',
                                overflow: 'hidden'
                              }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={motionPhoto3 || prodGallery[1] || '/story.png'}
                                  alt="Slide 3"
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    animation: motionEffectZoom ? 'motionZoom3 5s ease-in-out infinite alternate' : 'none'
                                  }}
                                />
                              </div>

                              {/* Overlay: Fumaça Animada */}
                              {motionEffectSmoke && (
                                <div style={{
                                  position: 'absolute',
                                  inset: 0,
                                  pointerEvents: 'none',
                                  background: 'radial-gradient(ellipse at bottom, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 50%, transparent 80%)',
                                  animation: 'smokeDrift 4s ease-in-out infinite alternate',
                                  mixBlendMode: 'screen'
                                }} />
                              )}

                              {/* Overlay: Partículas e Faíscas */}
                              {motionEffectParticles && (
                                <div style={{
                                  position: 'absolute',
                                  inset: 0,
                                  pointerEvents: 'none',
                                  background: 'radial-gradient(circle, rgba(255,183,3,0.3) 1px, transparent 1px)',
                                  backgroundSize: '24px 24px',
                                  animation: 'sparksRise 3.5s linear infinite',
                                  mixBlendMode: 'screen'
                                }} />
                              )}

                              {/* Overlay: Logo com Glow */}
                              {motionEffectLogo && (
                                <div style={{
                                  position: 'absolute',
                                  top: '12px',
                                  left: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.4rem',
                                  background: 'rgba(0,0,0,0.65)',
                                  padding: '0.3rem 0.6rem',
                                  borderRadius: '20px',
                                  border: '1px solid rgba(255, 90, 31, 0.4)',
                                  backdropFilter: 'blur(4px)',
                                  animation: 'logoPulseGlow 3s ease-in-out infinite'
                                }}>
                                  <span style={{ fontSize: '0.9rem' }}>🍔</span>
                                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fff' }}>
                                    {activeClient ? activeClient.name : 'Burger Studio'}
                                  </span>
                                </div>
                              )}

                              {/* Overlay: Bottom Badge com Nome & Preço */}
                              <div style={{
                                position: 'absolute',
                                bottom: '10px',
                                left: '12px',
                                right: '12px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
                                padding: '0.4rem 0.6rem',
                                borderRadius: '6px'
                              }}>
                                <div>
                                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                                    {prodName || 'Smash Bacon Especial'}
                                  </div>
                                  <div style={{ fontSize: '0.65rem', color: 'var(--accent-secondary)' }}>
                                    Cena {motionSlideIndex + 1} de 3 • {motionSlideIndex === 0 ? 'Ângulo Geral' : motionSlideIndex === 1 ? 'Detalhe do Blend' : 'Suculência & Chapa'}
                                  </div>
                                </div>

                                <div style={{
                                  background: 'linear-gradient(135deg, #FF5A1F, #FF8C00)',
                                  padding: '0.2rem 0.5rem',
                                  borderRadius: '4px',
                                  fontWeight: 800,
                                  fontSize: '0.75rem',
                                  color: '#fff'
                                }}>
                                  R$ {prodPrice ? Number(prodPrice).toFixed(2) : '34.90'}
                                </div>
                              </div>

                              {/* Controls Bar */}
                              <div style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                display: 'flex',
                                gap: '0.35rem'
                              }}>
                                <button
                                  type="button"
                                  onClick={() => setIsMotionPlaying(!isMotionPlaying)}
                                  style={{
                                    background: 'rgba(0,0,0,0.7)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    color: '#fff',
                                    borderRadius: '50%',
                                    width: '26px',
                                    height: '26px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer'
                                  }}
                                  title={isMotionPlaying ? 'Pausar Animação' : 'Reproduzir Animação'}
                                >
                                  {isMotionPlaying ? '⏸️' : '▶️'}
                                </button>
                              </div>

                            </div>
                          </div>

                          {/* 4. BOTÃO DE RENDERIZAÇÃO DO VÍDEO */}
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.25rem' }}>
                            <Button
                              type="button"
                              variant="primary"
                              disabled={isGeneratingImagesToVideo}
                              onClick={() => {
                                setIsGeneratingImagesToVideo(true);
                                setTimeout(() => {
                                  const generatedClip = 'https://assets.mixkit.co/videos/preview/mixkit-cooking-in-a-professional-kitchen-41624-large.mp4';
                                  setProdVideoUrl(generatedClip);
                                  const copy = [...prodVideos];
                                  copy[0] = generatedClip;
                                  setProdVideos(copy);
                                  setIsGeneratingImagesToVideo(false);
                                }, 1300);
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, #FFB703, #FF5A1F)',
                                color: '#000'
                              }}
                            >
                              {isGeneratingImagesToVideo ? '⏳ Renderizando Vídeo com Efeitos...' : '🎞️ Renderizar Vídeo com Minhas Imagens'}
                            </Button>

                            {prodVideoUrl && (
                              <span style={{ fontSize: '0.8rem', color: 'var(--accent-success)', fontWeight: 700 }}>
                                ✓ Vídeo Dinâmico gerado com efeitos cinematográficos!
                              </span>
                            )}
                          </div>

                        </div>
                      )}

                    </div>

                  </div>

                  {/* ──────────────────────────────────────────────────────────── */}
                  {/* 3. SEÇÃO: GALERIA COMPLEMENTAR (4 Slots)                      */}
                  {/* ──────────────────────────────────────────────────────────── */}
                  <div className="burger-ui-card" style={{ padding: '1.25rem', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        🖼️ Galeria Complementar
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Formatos aceitos: JPG, PNG, WEBP, TIFF
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                      {['Imagem 1', 'Imagem 2', 'Imagem 3', 'Imagem 4'].map((label, index) => {
                        const currentImg = prodGallery[index] || '';
                        return (
                          <div
                            key={index}
                            style={{
                              border: '1px solid var(--border-subtle)',
                              borderRadius: '10px',
                              padding: '0.85rem',
                              background: 'rgba(255,255,255,0.02)',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '0.6rem',
                              textAlign: 'center'
                            }}
                          >
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>{label}</span>
                            
                            {currentImg ? (
                              <div style={{ width: '100%', height: '85px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-subtle)', position: 'relative' }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={currentImg} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                            ) : (
                              <div style={{
                                width: '100%',
                                height: '85px',
                                borderRadius: '6px',
                                border: '1px dashed var(--border-subtle)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                color: 'var(--text-muted)'
                              }}>
                                ➕
                              </div>
                            )}

                            <div style={{ display: 'flex', gap: '0.35rem', width: '100%', justifyContent: 'center' }}>
                              <label style={{
                                padding: '0.3rem 0.5rem',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                color: '#fff',
                                flex: 1
                              }}>
                                {currentImg ? 'Trocar' : 'Upload'}
                                <input
                                  type="file"
                                  accept=".jpg,.jpeg,.png,.webp,.tif,.tiff,image/jpeg,image/png,image/webp,image/tiff"
                                  style={{ display: 'none' }}
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      handleFileUpload(e.target.files[0], (url) => {
                                        const copy = [...prodGallery];
                                        copy[index] = url;
                                        setProdGallery(copy);
                                      });
                                    }
                                  }}
                                />
                              </label>

                              {currentImg && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const copy = [...prodGallery];
                                    copy[index] = '';
                                    setProdGallery(copy);
                                  }}
                                  style={{
                                    padding: '0.3rem 0.5rem',
                                    fontSize: '0.7rem',
                                    background: 'rgba(255, 90, 31, 0.1)',
                                    border: '1px solid rgba(255, 90, 31, 0.3)',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    color: 'var(--accent-primary)'
                                  }}
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ──────────────────────────────────────────────────────────── */}
                  {/* 4. SEÇÃO: ELEMENTOS GRÁFICOS (Logo, Selo, Ícones)            */}
                  {/* ──────────────────────────────────────────────────────────── */}
                  <div className="burger-ui-card" style={{ padding: '1.25rem', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        🎨 Identidade & Elementos Gráficos
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Formatos: PNG, SVG, WEBP, JPG
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                      
                      {/* Slot: Logo */}
                      <div style={{
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '10px',
                        padding: '0.85rem',
                        background: 'rgba(255,255,255,0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.6rem',
                        textAlign: 'center'
                      }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>Logo</span>
                        {prodLogo ? (
                          <div style={{ width: '100%', height: '70px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={prodLogo} alt="Logo" style={{ maxHeight: '60px', maxWidth: '100%', objectFit: 'contain' }} />
                          </div>
                        ) : (
                          <div style={{ width: '100%', height: '70px', borderRadius: '6px', border: '1px dashed var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                            🏷️
                          </div>
                        )}
                        <label style={{
                          padding: '0.3rem 0.6rem',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          color: '#fff',
                          width: '100%'
                        }}>
                          {prodLogo ? 'Trocar Logo' : 'Upload Logo'}
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,.tif,.tiff,image/jpeg,image/png,image/webp,image/tiff"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFileUpload(e.target.files[0], (url) => setProdLogo(url));
                              }
                            }}
                          />
                        </label>
                      </div>

                      {/* Slot: Selo */}
                      <div style={{
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '10px',
                        padding: '0.85rem',
                        background: 'rgba(255,255,255,0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.6rem',
                        textAlign: 'center'
                      }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>Selo</span>
                        {prodSelo ? (
                          <div style={{ width: '100%', height: '70px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={prodSelo} alt="Selo" style={{ maxHeight: '60px', maxWidth: '100%', objectFit: 'contain' }} />
                          </div>
                        ) : (
                          <div style={{ width: '100%', height: '70px', borderRadius: '6px', border: '1px dashed var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                            ⭐
                          </div>
                        )}
                        <label style={{
                          padding: '0.3rem 0.6rem',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          color: '#fff',
                          width: '100%'
                        }}>
                          {prodSelo ? 'Trocar Selo' : 'Upload Selo'}
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,.tif,.tiff,image/jpeg,image/png,image/webp,image/tiff"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFileUpload(e.target.files[0], (url) => setProdSelo(url));
                              }
                            }}
                          />
                        </label>
                      </div>

                      {/* Slot: Ícones */}
                      <div style={{
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '10px',
                        padding: '0.85rem',
                        background: 'rgba(255,255,255,0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.6rem',
                        textAlign: 'center'
                      }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>Ícones</span>
                        {prodIcones ? (
                          <div style={{ width: '100%', height: '70px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={prodIcones} alt="Ícones" style={{ maxHeight: '60px', maxWidth: '100%', objectFit: 'contain' }} />
                          </div>
                        ) : (
                          <div style={{ width: '100%', height: '70px', borderRadius: '6px', border: '1px dashed var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                            ⚡
                          </div>
                        )}
                        <label style={{
                          padding: '0.3rem 0.6rem',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          color: '#fff',
                          width: '100%'
                        }}>
                          {prodIcones ? 'Trocar Ícone' : 'Upload Ícone'}
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,.tif,.tiff,image/jpeg,image/png,image/webp,image/tiff"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFileUpload(e.target.files[0], (url) => setProdIcones(url));
                              }
                            }}
                          />
                        </label>
                      </div>

                    </div>
                  </div>

                </div>
              )}

              {/* ABA 3 — PROMOÇÕES & TV */}
              {modalSubTab === 'promocao' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="burger-ui-card" style={{ padding: '1.25rem', border: '1px solid var(--border-subtle)', background: 'rgba(255, 183, 3, 0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-secondary)', marginBottom: '0.5rem' }}>
                      <span>🔥</span> Exibição e Destaque na TV Signage
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      Ao marcar como produto em destaque, o slide da TV Signage dará prioridade a este item com efeitos visuais e selo promocional.
                    </p>
                  </div>

                  <div className="burger-ui-form-group">
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Selo / Badge Promocional</label>
                    <select 
                      value={prodSelo} 
                      onChange={(e) => setProdSelo(e.target.value)} 
                      className="burger-ui-input"
                    >
                      <option value="">Nenhum Selo</option>
                      <option value="🔥 Mais Vendido">🔥 Mais Vendido</option>
                      <option value="⭐ Destaque do Chef">⭐ Destaque do Chef</option>
                      <option value="⚡ Oferta Relâmpago">⚡ Oferta Relâmpago</option>
                      <option value="🆕 Novo no Cardápio">🆕 Novo no Cardápio</option>
                    </select>
                  </div>
                </div>
              )}

              {/* ABA 4 — HISTÓRICO */}
              {modalSubTab === 'historico' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
                  <div style={{ borderLeft: '2px solid var(--accent-primary)', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {editingProductId ? 'Sincronizado na TV e Redes' : 'Criando novo rascunho de item'}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>Registro Inicial do Produto</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Hoje, {new Date().toLocaleTimeString()}</span>
                  </div>
                  <div style={{ borderLeft: '2px solid var(--border-subtle)', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Alteração de Status</span>
                    <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>Status do Produto definido como Disponível</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Hoje, {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              )}

              </div>

              <div style={{ display: 'flex', justifySelf: 'flex-end', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', flexShrink: 0 }}>
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  Salvar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Client Project Generator Modal Overlay */}
      {isClientGeneratorOpen && (
        <div className="burger-ui-modal-overlay" onClick={() => setIsClientGeneratorOpen(false)}>
          <div 
            className="burger-ui-modal-content" 
            onClick={(e) => e.stopPropagation()} 
            style={{ maxWidth: '980px', width: '92vw', maxHeight: '90vh', overflowY: 'auto' }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1.8rem' }}>🚀</span>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
                    Gerador de Projetos de Clientes
                  </h3>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Gere instantaneamente uma versão completa do sistema para uma nova hamburgueria em menos de um minuto.
                </p>
              </div>
              <button
                onClick={() => setIsClientGeneratorOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* 2-Column Wizard Layout: Form vs Live Preview */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'start' }}>
              
              {/* Left Column: Form Fields */}
              <form onSubmit={handleGenerateClientProject} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* 1. Nome da Hamburgueria & Slogan */}
                <div className="burger-ui-card" style={{ padding: '1.25rem', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    <span>🏷️</span> 1. Identificação da Hamburgueria
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
                    <div className="burger-ui-form-group">
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Nome do Cliente / Loja</label>
                      <input
                        type="text"
                        placeholder="Ex: Bullguer Smash"
                        value={formClientName}
                        onChange={(e) => setFormClientName(e.target.value)}
                        className="burger-ui-input"
                        required
                      />
                    </div>
                    <div className="burger-ui-form-group">
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Slogan / Tagline</label>
                      <input
                        type="text"
                        placeholder="Ex: Grelhados na Brasa"
                        value={formClientTagline}
                        onChange={(e) => setFormClientTagline(e.target.value)}
                        className="burger-ui-input"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Logotipo & Ícone */}
                <div className="burger-ui-card" style={{ padding: '1.25rem', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                      <span>🍔</span> 2. Logotipo & Símbolo
                    </div>
                    {formClientLogoUrl && (
                      <button
                        type="button"
                        onClick={() => setFormClientLogoUrl('')}
                        style={{ background: 'none', border: 'none', color: 'var(--accent-error)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700 }}
                      >
                        ✕ Remover Imagem
                      </button>
                    )}
                  </div>

                  {/* Upload do Computador */}
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
                      Carregar Arquivo do Computador (PNG, SVG, WEBP, JPG):
                    </label>
                    <label style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '1.25rem',
                      borderRadius: '10px',
                      background: 'rgba(255, 90, 31, 0.04)',
                      border: '2px dashed rgba(255, 90, 31, 0.4)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      gap: '0.5rem',
                      textAlign: 'center'
                    }}>
                      <span style={{ fontSize: '1.8rem' }}>📁</span>
                      <div>
                        <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700 }}>
                          Clique para Selecionar o Arquivo do Computador
                        </span>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          Recomendado: PNG com fundo transparente ou SVG
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/png,image/svg+xml,image/jpeg,image/webp,image/gif"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setFormClientLogoUrl(event.target.result as string);
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                  </div>

                  {/* Preview do Logo Carregado */}
                  {formClientLogoUrl && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.75rem 1rem',
                      background: 'rgba(0,0,0,0.4)',
                      borderRadius: '8px',
                      border: '1px solid var(--accent-success)'
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '6px',
                        background: 'radial-gradient(circle, #333 10%, #111 90%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        padding: '4px'
                      }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={formClientLogoUrl} alt="Logo Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-success)' }}>
                          ✓ Logotipo Carregado com Sucesso!
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          Será aplicado em todos os cardápios de TV e artes promocionais.
                        </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Ou Escolha um Ícone de Marca:</label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {['🍔', '🥩', '🔥', '🍟', '👑', '⚡', '🥓', '🌭'].map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setFormClientLogoIcon(icon)}
                          style={{
                            fontSize: '1.4rem',
                            padding: '0.35rem 0.65rem',
                            borderRadius: '8px',
                            background: formClientLogoIcon === icon ? 'rgba(255, 90, 31, 0.25)' : 'rgba(255,255,255,0.04)',
                            border: formClientLogoIcon === icon ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="burger-ui-form-group">
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Ou URL do Logotipo (Link Web)</label>
                    <input
                      type="text"
                      placeholder="Ex: https://meusite.com/logo.png"
                      value={formClientLogoUrl}
                      onChange={(e) => setFormClientLogoUrl(e.target.value)}
                      className="burger-ui-input"
                    />
                  </div>
                </div>

                {/* 3. Cores & Paleta */}
                <div className="burger-ui-card" style={{ padding: '1.25rem', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    <span>🎨</span> 3. Paleta de Cores da Marca
                  </div>
                  
                  {/* Presets */}
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Presets de Cores Rápidos:</label>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {[
                        { name: 'Fire Smash', p: '#FF5A1F', s: '#FFB703', theme: 'tv-01' },
                        { name: 'Golden Luxury', p: '#DFB15B', s: '#F4D068', theme: 'tv-premium' },
                        { name: 'Cyber Neon', p: '#06D6A0', s: '#FFD166', theme: 'tv-01' },
                        { name: 'Crimson Red', p: '#E63946', s: '#FFB703', theme: 'banner' },
                        { name: 'Dark Smoke', p: '#FF8A65', s: '#FFAB91', theme: 'story-dark' }
                      ].map((preset, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setFormClientPrimaryColor(preset.p);
                            setFormClientSecondaryColor(preset.s);
                            setFormClientThemePreset(preset.theme);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.35rem 0.6rem',
                            borderRadius: '6px',
                            background: 'rgba(255,255,255,0.05)',
                            border: formClientPrimaryColor === preset.p ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            color: '#fff'
                          }}
                        >
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: preset.p }} />
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hex Pickers */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="burger-ui-form-group">
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Cor Primária</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="color"
                          value={formClientPrimaryColor}
                          onChange={(e) => setFormClientPrimaryColor(e.target.value)}
                          style={{ width: '38px', height: '38px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: 'none' }}
                        />
                        <input
                          type="text"
                          value={formClientPrimaryColor}
                          onChange={(e) => setFormClientPrimaryColor(e.target.value)}
                          className="burger-ui-input"
                          style={{ textTransform: 'uppercase' }}
                        />
                      </div>
                    </div>

                    <div className="burger-ui-form-group">
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Cor de Destaque (Accent)</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="color"
                          value={formClientSecondaryColor}
                          onChange={(e) => setFormClientSecondaryColor(e.target.value)}
                          style={{ width: '38px', height: '38px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: 'none' }}
                        />
                        <input
                          type="text"
                          value={formClientSecondaryColor}
                          onChange={(e) => setFormClientSecondaryColor(e.target.value)}
                          className="burger-ui-input"
                          style={{ textTransform: 'uppercase' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Tipografia & Fonte */}
                <div className="burger-ui-card" style={{ padding: '1.25rem', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    <span>✍️</span> 4. Tipografia / Fonte
                  </div>
                  <div className="burger-ui-form-group">
                    <select
                      value={formClientFontFamily}
                      onChange={(e) => setFormClientFontFamily(e.target.value)}
                      className="burger-ui-input"
                    >
                      <option value="'Outfit', sans-serif">Outfit (Moderna & Impactante - Padrão)</option>
                      <option value="'Inter', sans-serif">Inter (Clean & Minimalista)</option>
                      <option value="'Playfair Display', serif">Playfair Display (Gourmet & Sofisticada)</option>
                      <option value="'Montserrat', sans-serif">Montserrat (Geométrica & Arrojada)</option>
                      <option value="'Poppins', sans-serif">Poppins (Amigável & Suave)</option>
                    </select>
                  </div>
                </div>

                {/* 5. QR Code, Instagram & WhatsApp */}
                <div className="burger-ui-card" style={{ padding: '1.25rem', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    <span>📱</span> 5. Canais de Atendimento & QR Code
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="burger-ui-form-group">
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Instagram</label>
                      <input
                        type="text"
                        placeholder="Ex: @bullguer_oficial"
                        value={formClientInstagram}
                        onChange={(e) => setFormClientInstagram(e.target.value)}
                        className="burger-ui-input"
                      />
                    </div>
                    <div className="burger-ui-form-group">
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>WhatsApp Comercial</label>
                      <input
                        type="text"
                        placeholder="Ex: (11) 98888-7777"
                        value={formClientWhatsApp}
                        onChange={(e) => setFormClientWhatsApp(e.target.value)}
                        className="burger-ui-input"
                      />
                    </div>
                    <div className="burger-ui-form-group" style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Link de Destino do QR Code</label>
                      <input
                        type="text"
                        placeholder="Ex: https://wa.me/5511988887777 ou cardapio.digital/bullguer"
                        value={formClientQrUrl}
                        onChange={(e) => setFormClientQrUrl(e.target.value)}
                        className="burger-ui-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
                  <Button type="button" variant="secondary" onClick={() => setIsClientGeneratorOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" style={{ padding: '0.75rem 2rem', fontSize: '0.95rem', fontWeight: 800, background: 'linear-gradient(135deg, #FF5A1F, #FF8C00)', boxShadow: '0 4px 20px rgba(255, 90, 31, 0.4)' }}>
                    🚀 Gerar Sistema Personalizado (1-Click)
                  </Button>
                </div>
              </form>

              {/* Right Column: Live Mockup Preview */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'sticky', top: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    📺 Pré-visualização ao Vivo do Cliente
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-success)', fontWeight: 700 }}>
                    ● Sincronismo em Tempo Real
                  </span>
                </div>

                {/* Simulated 16:9 TV Screen Display with Form Values */}
                <div style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  backgroundColor: '#07070a',
                  borderRadius: '16px',
                  border: `3px solid ${formClientPrimaryColor || '#FF5A1F'}`,
                  boxShadow: `0 12px 40px rgba(0,0,0,0.7), 0 0 20px ${formClientPrimaryColor}33`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2rem',
                  position: 'relative',
                  overflow: 'hidden',
                  fontFamily: formClientFontFamily
                }}>
                  {/* Decorative background radial glow */}
                  <div style={{
                    position: 'absolute',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    backgroundColor: formClientPrimaryColor,
                    filter: 'blur(80px)',
                    opacity: 0.25,
                    zIndex: 0
                  }} />

                  <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <span style={{ fontSize: '3.5rem', marginBottom: '0.75rem', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))' }}>
                      {formClientLogoIcon || '🍔'}
                    </span>
                    <h3 style={{
                      fontSize: '1.8rem',
                      fontWeight: 900,
                      background: `linear-gradient(90deg, ${formClientPrimaryColor || '#FF5A1F'}, ${formClientSecondaryColor || '#FFB703'})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      lineHeight: 1.1
                    }}>
                      {formClientName.trim() || 'Nome da Hamburgueria'}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem', fontWeight: 500, letterSpacing: '0.05em' }}>
                      {formClientTagline.trim() || 'Hambúrgueres Artesanais Grelhados na Brasa'}
                    </p>
                  </div>

                  {/* Bottom Footer Info on TV */}
                  <div style={{
                    position: 'absolute',
                    bottom: '0.85rem',
                    left: '1rem',
                    right: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.65rem',
                    color: 'var(--text-muted)',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    paddingTop: '0.5rem',
                    zIndex: 1
                  }}>
                    <span style={{ color: formClientSecondaryColor || '#FFB703', fontWeight: 700 }}>
                      📱 {formClientInstagram.trim() || '@instagram'}
                    </span>
                    <span>
                      💬 WhatsApp: {formClientWhatsApp.trim() || '(11) 99999-9999'}
                    </span>
                  </div>
                </div>

                {/* Instant Generator Features Checklist */}
                <div className="burger-ui-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(18, 18, 22, 0.7)' }}>
                  <span style={{ fontSize: '0.75rem', color: '#fff', fontWeight: 700, textTransform: 'uppercase' }}>
                    ⚡ Ao clicar em "Gerar Sistema":
                  </span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <span>✓ Perfil multi-tenant gerado e ativado no painel</span>
                    <span>✓ TV Signage Player conectado com logo, cores e QR code da marca</span>
                    <span>✓ Pastas de arquivos e campanhas provisionadas</span>
                    <span>✓ Totalmente isolado e sem conflito com outros clientes</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. MODAL DO EDITOR INTELIGENTE DE IMAGEM (IA)                */}
      {/* ──────────────────────────────────────────────────────────── */}
      {isAiEditorOpen && (
        <div className="burger-ui-modal-overlay" onClick={() => setIsAiEditorOpen(false)}>
          <div
            className="burger-ui-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '1080px', width: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', padding: '1.75rem' }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.8rem' }}>✨</span>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900, color: '#fff', margin: 0 }}>
                    Editor Inteligente de Imagem
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Melhore fotos gastronômicas automaticamente com recursos profissionais de IA.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.75rem', background: 'rgba(255, 183, 3, 0.15)', color: 'var(--accent-secondary)', padding: '0.3rem 0.65rem', borderRadius: '20px', fontWeight: 700, border: '1px solid rgba(255, 183, 3, 0.3)' }}>
                  🤖 GPT Image Enhancer 8K
                </span>
                <button
                  type="button"
                  onClick={() => setIsAiEditorOpen(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Notification Bar */}
            {aiEditorProcessingAction && (
              <div style={{
                padding: '0.75rem 1rem',
                background: 'rgba(255, 90, 31, 0.15)',
                border: '1px solid var(--accent-primary)',
                borderRadius: '8px',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 700
              }}>
                <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
                <span>{aiEditorProcessingAction}</span>
              </div>
            )}

            {aiEditorSuccessNotice && (
              <div style={{
                padding: '0.75rem 1rem',
                background: 'rgba(46, 196, 182, 0.15)',
                border: '1px solid var(--accent-success)',
                borderRadius: '8px',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 700
              }}>
                <span>✓</span>
                <span>{aiEditorSuccessNotice}</span>
              </div>
            )}

            {/* Modal Body - 2 Columns Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', overflowY: 'auto', flex: 1, paddingRight: '0.25rem' }}>
              
              {/* Left Column: Interactive Before / After Canvas */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    🖼️ Comparador Antes / Depois
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setAiEditorCompareSlider(0)}
                      style={{ padding: '0.2rem 0.55rem', fontSize: '0.7rem', background: aiEditorCompareSlider === 0 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Original
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiEditorCompareSlider(50)}
                      style={{ padding: '0.2rem 0.55rem', fontSize: '0.7rem', background: aiEditorCompareSlider === 50 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Divisão 50%
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiEditorCompareSlider(100)}
                      style={{ padding: '0.2rem 0.55rem', fontSize: '0.7rem', background: aiEditorCompareSlider === 100 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Aprimorada (100%)
                    </button>
                  </div>
                </div>

                {/* Stage Canvas */}
                <div style={{
                  width: '100%',
                  height: '360px',
                  backgroundColor: aiEditorActiveEffects.customBg === 'dark_studio' ? '#0a0a0f' : aiEditorActiveEffects.customBg === 'wood' ? '#2a1a12' : '#050508',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>

                  {/* Background Swap Layer */}
                  {aiEditorActiveEffects.customBg === 'wood' && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: 'radial-gradient(circle at center, #3d2314 0%, #150a05 100%)',
                      zIndex: 1
                    }} />
                  )}
                  {aiEditorActiveEffects.customBg === 'neon' && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255, 90, 31, 0.4) 0%, transparent 60%), radial-gradient(circle at 80% 70%, rgba(0, 150, 255, 0.3) 0%, transparent 60%)',
                      backgroundColor: '#0a0a14',
                      zIndex: 1
                    }} />
                  )}
                  {aiEditorActiveEffects.customBg === 'grill' && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: 'radial-gradient(circle at bottom, rgba(255, 90, 31, 0.5) 0%, rgba(50, 10, 0, 0.9) 70%, #000 100%)',
                      zIndex: 1
                    }} />
                  )}

                  {/* Main Image Base with AI CSS Enhancements */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={aiEditorSourceImage || '/foto.png'}
                    alt="Aprimoramento IA"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      position: 'relative',
                      zIndex: 2,
                      filter: `
                        brightness(${100 + (aiEditorActiveEffects.brightness || 0)}%)
                        contrast(${aiEditorActiveEffects.lighting ? 115 : 100}%)
                        saturate(${aiEditorActiveEffects.enhanceCheese ? 125 : 100}%)
                        ${aiEditorActiveEffects.upscale ? 'drop-shadow(0 0 2px rgba(255,255,255,0.2))' : ''}
                      `,
                      transition: 'all 0.3s ease'
                    }}
                  />

                  {/* Layer: Cheese Glow Realce */}
                  {aiEditorActiveEffects.enhanceCheese && (
                    <div style={{
                      position: 'absolute',
                      inset: '25%',
                      pointerEvents: 'none',
                      background: 'radial-gradient(ellipse, rgba(255, 183, 3, 0.35) 0%, transparent 70%)',
                      mixBlendMode: 'color-dodge',
                      zIndex: 3,
                      filter: 'blur(8px)'
                    }} />
                  )}

                  {/* Layer: Fumaça Gastronômica */}
                  {aiEditorActiveEffects.addSmoke && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      pointerEvents: 'none',
                      background: 'radial-gradient(ellipse at bottom, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.06) 40%, transparent 75%)',
                      animation: 'smokeDrift 4s ease-in-out infinite alternate',
                      mixBlendMode: 'screen',
                      zIndex: 4
                    }} />
                  )}

                  {/* Layer: Vapor Sutil */}
                  {aiEditorActiveEffects.addSteam && (
                    <div style={{
                      position: 'absolute',
                      top: '15%',
                      left: '30%',
                      right: '30%',
                      height: '40%',
                      pointerEvents: 'none',
                      background: 'radial-gradient(ellipse, rgba(255,255,255,0.3) 0%, transparent 65%)',
                      animation: 'smokeDrift 3s ease-in-out infinite alternate 1s',
                      filter: 'blur(6px)',
                      mixBlendMode: 'screen',
                      zIndex: 4
                    }} />
                  )}

                  {/* Layer: Reflexos & Sizzle */}
                  {aiEditorActiveEffects.addReflections && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      pointerEvents: 'none',
                      background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
                      mixBlendMode: 'overlay',
                      zIndex: 5
                    }} />
                  )}

                  {/* Split Line Indicator */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(0,0,0,0.7)',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    color: '#fff',
                    fontWeight: 700,
                    zIndex: 6,
                    border: '1px solid rgba(255,255,255,0.15)'
                  }}>
                    ✨ IA Ativa: Resolução 4K • Iluminação Pro
                  </div>

                  {/* Badge de resolução */}
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    background: 'rgba(46, 196, 182, 0.2)',
                    color: 'var(--accent-success)',
                    border: '1px solid var(--accent-success)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    zIndex: 6
                  }}>
                    {aiEditorActiveEffects.upscale ? '4K UHD (3840x2160)' : 'HD Standard'}
                  </div>

                </div>

                {/* Slider Manual de Comparação */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.02)', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Antes (0%)</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={aiEditorCompareSlider}
                    onChange={(e) => setAiEditorCompareSlider(Number(e.target.value))}
                    style={{ flex: 1, accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700 }}>Depois ({aiEditorCompareSlider}%)</span>
                </div>

              </div>

              {/* Right Column: 10 IA Operations & Tools */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  ⚡ Ações e Melhorias da IA
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  
                  {/* 1. Remover Fundo */}
                  <button
                    type="button"
                    onClick={() => applySingleAiEffect('Remover Fundo', () => {
                      setAiEditorActiveEffects(prev => ({ ...prev, removeBg: !prev.removeBg, customBg: 'none' }));
                    })}
                    style={{
                      padding: '0.65rem 0.75rem',
                      background: aiEditorActiveEffects.removeBg ? 'rgba(255, 90, 31, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: aiEditorActiveEffects.removeBg ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textAlign: 'left'
                    }}
                  >
                    <span>✂️</span>
                    <span>Remover Fundo</span>
                  </button>

                  {/* 2. Aumentar Resolução (Upscale 4K) */}
                  <button
                    type="button"
                    onClick={() => applySingleAiEffect('Aumentar Resolução 4K', () => {
                      setAiEditorActiveEffects(prev => ({ ...prev, upscale: !prev.upscale }));
                    })}
                    style={{
                      padding: '0.65rem 0.75rem',
                      background: aiEditorActiveEffects.upscale ? 'rgba(255, 90, 31, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: aiEditorActiveEffects.upscale ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textAlign: 'left'
                    }}
                  >
                    <span>🔍</span>
                    <span>Aumentar Resolução</span>
                  </button>

                  {/* 3. Melhorar Iluminação */}
                  <button
                    type="button"
                    onClick={() => applySingleAiEffect('Iluminação de Estúdio', () => {
                      setAiEditorActiveEffects(prev => ({ ...prev, lighting: !prev.lighting }));
                    })}
                    style={{
                      padding: '0.65rem 0.75rem',
                      background: aiEditorActiveEffects.lighting ? 'rgba(255, 90, 31, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: aiEditorActiveEffects.lighting ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textAlign: 'left'
                    }}
                  >
                    <span>💡</span>
                    <span>Melhorar Iluminação</span>
                  </button>

                  {/* 4. Realçar Queijo */}
                  <button
                    type="button"
                    onClick={() => applySingleAiEffect('Realçar Queijo Cremoso', () => {
                      setAiEditorActiveEffects(prev => ({ ...prev, enhanceCheese: !prev.enhanceCheese }));
                    })}
                    style={{
                      padding: '0.65rem 0.75rem',
                      background: aiEditorActiveEffects.enhanceCheese ? 'rgba(255, 183, 3, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                      border: aiEditorActiveEffects.enhanceCheese ? '1px solid var(--accent-secondary)' : '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textAlign: 'left'
                    }}
                  >
                    <span>🧀</span>
                    <span>Realçar Queijo</span>
                  </button>

                  {/* 5. Aumentar Brilho */}
                  <button
                    type="button"
                    onClick={() => applySingleAiEffect('Aumentar Brilho', () => {
                      setAiEditorActiveEffects(prev => ({ ...prev, brightness: prev.brightness === 20 ? 0 : 20 }));
                    })}
                    style={{
                      padding: '0.65rem 0.75rem',
                      background: aiEditorActiveEffects.brightness > 0 ? 'rgba(255, 90, 31, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: aiEditorActiveEffects.brightness > 0 ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textAlign: 'left'
                    }}
                  >
                    <span>☀️</span>
                    <span>Aumentar Brilho</span>
                  </button>

                  {/* 6. Remover Objetos / Migalhas */}
                  <button
                    type="button"
                    onClick={() => applySingleAiEffect('Remover Objetos & Migalhas', () => {
                      setAiEditorActiveEffects(prev => ({ ...prev, removeObjects: !prev.removeObjects }));
                    })}
                    style={{
                      padding: '0.65rem 0.75rem',
                      background: aiEditorActiveEffects.removeObjects ? 'rgba(255, 90, 31, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: aiEditorActiveEffects.removeObjects ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textAlign: 'left'
                    }}
                  >
                    <span>🧹</span>
                    <span>Remover Objetos</span>
                  </button>

                  {/* 7. Adicionar Fumaça */}
                  <button
                    type="button"
                    onClick={() => applySingleAiEffect('Adicionar Fumaça Gourmet', () => {
                      setAiEditorActiveEffects(prev => ({ ...prev, addSmoke: !prev.addSmoke }));
                    })}
                    style={{
                      padding: '0.65rem 0.75rem',
                      background: aiEditorActiveEffects.addSmoke ? 'rgba(255, 90, 31, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: aiEditorActiveEffects.addSmoke ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textAlign: 'left'
                    }}
                  >
                    <span>💨</span>
                    <span>Adicionar Fumaça</span>
                  </button>

                  {/* 8. Adicionar Vapor */}
                  <button
                    type="button"
                    onClick={() => applySingleAiEffect('Adicionar Vapor Apetitoso', () => {
                      setAiEditorActiveEffects(prev => ({ ...prev, addSteam: !prev.addSteam }));
                    })}
                    style={{
                      padding: '0.65rem 0.75rem',
                      background: aiEditorActiveEffects.addSteam ? 'rgba(255, 90, 31, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: aiEditorActiveEffects.addSteam ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textAlign: 'left'
                    }}
                  >
                    <span>♨️</span>
                    <span>Adicionar Vapor</span>
                  </button>

                  {/* 9. Adicionar Reflexos */}
                  <button
                    type="button"
                    onClick={() => applySingleAiEffect('Adicionar Reflexos & Sizzle', () => {
                      setAiEditorActiveEffects(prev => ({ ...prev, addReflections: !prev.addReflections }));
                    })}
                    style={{
                      padding: '0.65rem 0.75rem',
                      background: aiEditorActiveEffects.addReflections ? 'rgba(255, 90, 31, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: aiEditorActiveEffects.addReflections ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textAlign: 'left',
                      gridColumn: 'span 2'
                    }}
                  >
                    <span>✨</span>
                    <span>Adicionar Reflexos de Brasa & Suculência</span>
                  </button>

                </div>

                {/* 10. Trocar Fundo com Cenários Pré-definidos */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    🌄 Trocar Fundo (Cenários de IA)
                  </span>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
                    {[
                      { id: 'none', label: 'Original / Transparente' },
                      { id: 'wood', label: 'Madeira Rústica' },
                      { id: 'dark_studio', label: 'Estúdio Dark' },
                      { id: 'neon', label: 'Hamburgueria Neon' },
                      { id: 'grill', label: 'Chapa & Brasa' },
                      { id: 'clean', label: 'Clean Minimalista' }
                    ].map(bg => (
                      <button
                        key={bg.id}
                        type="button"
                        onClick={() => applySingleAiEffect(`Fundo ${bg.label}`, () => {
                          setAiEditorActiveEffects(prev => ({ ...prev, customBg: bg.id }));
                        })}
                        style={{
                          padding: '0.4rem 0.5rem',
                          fontSize: '0.7rem',
                          fontWeight: aiEditorActiveEffects.customBg === bg.id ? 700 : 500,
                          background: aiEditorActiveEffects.customBg === bg.id ? 'var(--accent-primary)' : 'rgba(255,255,255,0.04)',
                          color: aiEditorActiveEffects.customBg === bg.id ? '#fff' : 'var(--text-secondary)',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        {bg.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => {
                      if (aiEditorTargetField === 'main') {
                        setProdImageUrl(aiEditorSourceImage);
                      } else if (aiEditorTargetField === 'gallery_0') {
                        const copy = [...prodGallery];
                        copy[0] = aiEditorSourceImage;
                        setProdGallery(copy);
                      }
                      setIsAiEditorOpen(false);
                    }}
                    style={{ fontWeight: 800, padding: '0.75rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    💾 Aplicar Imagem Aprimorada no Produto
                  </Button>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        const newLibItem: LibraryMediaItem = {
                          id: 'lib-' + Date.now(),
                          name: `${prodName || 'Sanduíche'} (Aprimorado IA 8K)`,
                          category: 'sanduiches',
                          type: 'image',
                          format: 'WEBP',
                          size: '1.4 MB',
                          resolution: '3840 x 2160',
                          url: aiEditorSourceImage,
                          tags: ['ia', 'aprimorado', '8k', 'suculento', 'sanduiches'],
                          createdAt: new Date().toISOString().split('T')[0]
                        };
                        const updated = [newLibItem, ...libraryItems];
                        setLibraryItems(updated);
                        localStorage.setItem('burger_studio_library_items', JSON.stringify(updated));
                        setIsAiEditorOpen(false);
                      }}
                      style={{ flex: 1, fontSize: '0.75rem' }}
                    >
                      📚 Salvar na Biblioteca
                    </Button>

                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsAiEditorOpen(false)}
                      style={{ fontSize: '0.75rem' }}
                    >
                      Fechar
                    </Button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 5. MODAL DO EDITOR INTELIGENTE DE VÍDEO (PÓS-PRODUÇÃO IA)   */}
      {/* ──────────────────────────────────────────────────────────── */}
      {isAiVideoEditorOpen && (
        <div className="burger-ui-modal-overlay" onClick={() => setIsAiVideoEditorOpen(false)}>
          <div
            className="burger-ui-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '1100px', width: '95%', maxHeight: '92vh', display: 'flex', flexDirection: 'column', padding: '1.75rem' }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.8rem' }}>🎬</span>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900, color: '#fff', margin: 0 }}>
                    Editor Inteligente de Vídeo
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Pós-produção automática: cortar, acelerar, slow motion, logo, preço, ingredientes, música, legenda, QR code e WhatsApp.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setAiVideoProcessingNotice('Aplicando todos os 10 efeitos e overlays automaticamente...');
                    setTimeout(() => {
                      setAiVideoEditorOverlays({
                        addLogo: true,
                        addPrice: true,
                        addIngredients: true,
                        addMusic: true,
                        musicTrack: 'rock_sizzle',
                        addCaptions: true,
                        captionText: `${prodName || 'Smash Especial'} — O Mais Suculento! 🔥🧀`,
                        addQrCode: true,
                        addWhatsApp: true
                      });
                      setAiVideoProcessingNotice(null);
                      setAiVideoSuccessNotice('✓ Todos os elementos foram aplicados automaticamente no vídeo!');
                      setTimeout(() => setAiVideoSuccessNotice(null), 3000);
                    }, 800);
                  }}
                  style={{
                    padding: '0.45rem 0.9rem',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #FFB703, #FF5A1F)',
                    color: '#000',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 4px 14px rgba(255, 183, 3, 0.3)'
                  }}
                >
                  ⚡ Aplicar Tudo Automaticamente
                </button>

                <button
                  type="button"
                  onClick={() => setIsAiVideoEditorOpen(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Notification Bar */}
            {aiVideoProcessingNotice && (
              <div style={{
                padding: '0.75rem 1rem',
                background: 'rgba(255, 90, 31, 0.15)',
                border: '1px solid var(--accent-primary)',
                borderRadius: '8px',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 700
              }}>
                <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
                <span>{aiVideoProcessingNotice}</span>
              </div>
            )}

            {aiVideoSuccessNotice && (
              <div style={{
                padding: '0.75rem 1rem',
                background: 'rgba(46, 196, 182, 0.15)',
                border: '1px solid var(--accent-success)',
                borderRadius: '8px',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 700
              }}>
                <span>✓</span>
                <span>{aiVideoSuccessNotice}</span>
              </div>
            )}

            {/* Modal Body - 2 Columns Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', overflowY: 'auto', flex: 1, paddingRight: '0.25rem' }}>
              
              {/* Left Column: Live Video Canvas & Timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    📺 Player de Vídeo em Tempo Real
                  </span>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    {([0.5, 1.0, 1.5, 2.0]).map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => setAiVideoEditorSpeed(spd)}
                        style={{
                          padding: '0.2rem 0.5rem',
                          fontSize: '0.7rem',
                          fontWeight: aiVideoEditorSpeed === spd ? 800 : 500,
                          background: aiVideoEditorSpeed === spd ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                          color: aiVideoEditorSpeed === spd ? '#fff' : 'var(--text-secondary)',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        {spd === 0.5 ? '🐢 Slow 0.5x' : spd === 1.0 ? '1.0x Normal' : `${spd}x`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Video Canvas Stage with Overlays */}
                <div style={{
                  width: '100%',
                  height: '340px',
                  backgroundColor: '#000',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1px solid rgba(255, 90, 31, 0.4)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  
                  {/* Video Playback Engine */}
                  <video
                    ref={(el) => { if (el) el.playbackRate = aiVideoEditorSpeed; }}
                    src={aiVideoEditorSourceUrl || 'https://assets.mixkit.co/videos/preview/mixkit-cooking-in-a-professional-kitchen-41624-large.mp4'}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />

                  {/* 1. Overlay: Logo do Restaurante */}
                  {aiVideoEditorOverlays.addLogo && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: 'rgba(0,0,0,0.7)',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '20px',
                      border: '1px solid rgba(255, 90, 31, 0.5)',
                      backdropFilter: 'blur(6px)',
                      animation: 'logoPulseGlow 3s ease-in-out infinite',
                      zIndex: 3
                    }}>
                      <span style={{ fontSize: '1rem' }}>🍔</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fff' }}>
                        {activeClient ? activeClient.name : 'Burger Studio'}
                      </span>
                    </div>
                  )}

                  {/* 2. Overlay: Preço em Destaque */}
                  {aiVideoEditorOverlays.addPrice && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'linear-gradient(135deg, #FF5A1F, #FF8C00)',
                      padding: '0.35rem 0.8rem',
                      borderRadius: '8px',
                      fontWeight: 900,
                      fontSize: '0.9rem',
                      color: '#fff',
                      boxShadow: '0 4px 12px rgba(255, 90, 31, 0.4)',
                      zIndex: 3
                    }}>
                      R$ {prodPrice ? Number(prodPrice).toFixed(2) : '34.90'}
                    </div>
                  )}

                  {/* 3. Overlay: Legenda Animada estilo TikTok / Reels */}
                  {aiVideoEditorOverlays.addCaptions && (
                    <div style={{
                      position: 'absolute',
                      bottom: '75px',
                      left: '20px',
                      right: '20px',
                      textAlign: 'center',
                      background: 'rgba(0,0,0,0.65)',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '8px',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      zIndex: 3
                    }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFB703', textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}>
                        {aiVideoEditorOverlays.captionText}
                      </span>
                    </div>
                  )}

                  {/* 4. Overlay: Ingredientes */}
                  {aiVideoEditorOverlays.addIngredients && (
                    <div style={{
                      position: 'absolute',
                      bottom: '38px',
                      left: '12px',
                      right: '12px',
                      display: 'flex',
                      gap: '0.35rem',
                      overflowX: 'auto',
                      zIndex: 3
                    }}>
                      {(prodIngredients ? prodIngredients.split(',') : ['Pão Brioche', 'Blend 180g', 'Queijo Cheddar', 'Bacon Crocante']).slice(0, 4).map((ing, i) => (
                        <span
                          key={i}
                          style={{
                            background: 'rgba(0,0,0,0.7)',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px',
                            fontSize: '0.65rem',
                            color: '#fff',
                            fontWeight: 600,
                            border: '1px solid rgba(255,255,255,0.1)',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          ✓ {ing.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 5. Overlay: WhatsApp & QR Code Bar */}
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '12px',
                    right: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    zIndex: 3
                  }}>
                    {/* WhatsApp */}
                    {aiVideoEditorOverlays.addWhatsApp && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: 'rgba(37, 211, 102, 0.25)',
                        border: '1px solid #25D366',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.65rem',
                        color: '#fff',
                        fontWeight: 700
                      }}>
                        <span>💬</span>
                        <span>{activeClient?.whatsappNumber || '(11) 99999-9999'}</span>
                      </div>
                    )}

                    {/* QR Code */}
                    {aiVideoEditorOverlays.addQrCode && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: '#fff',
                        padding: '0.15rem 0.4rem',
                        borderRadius: '4px',
                        fontSize: '0.65rem',
                        color: '#000',
                        fontWeight: 800
                      }}>
                        <span>📱</span>
                        <span>QR CODE PEDIDOS</span>
                      </div>
                    )}
                  </div>

                  {/* 6. Equalizer Indicator for Music */}
                  {aiVideoEditorOverlays.addMusic && (
                    <div style={{
                      position: 'absolute',
                      top: '52px',
                      left: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: 'rgba(0,0,0,0.65)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '12px',
                      zIndex: 3
                    }}>
                      <span style={{ fontSize: '0.7rem' }}>🎵</span>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '12px' }}>
                        {[1, 2, 3, 4].map(b => (
                          <div
                            key={b}
                            style={{
                              width: '2px',
                              background: 'var(--accent-primary)',
                              borderRadius: '1px',
                              animation: `eqBarAnim 0.7s ease-in-out infinite alternate ${b * 0.15}s`
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* Timeline / Trim Slider */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      ✂️ Recorte de Trecho (Smart Trim Timeline)
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 800 }}>
                      00:0{aiVideoEditorTrimStart}s — 00:{aiVideoEditorTrimEnd < 10 ? '0' : ''}{aiVideoEditorTrimEnd}s (Duração: {aiVideoEditorTrimEnd - aiVideoEditorTrimStart}s)
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Início:</span>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={aiVideoEditorTrimStart}
                      onChange={(e) => setAiVideoEditorTrimStart(Number(e.target.value))}
                      style={{ flex: 1, accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Fim:</span>
                    <input
                      type="range"
                      min="11"
                      max="30"
                      value={aiVideoEditorTrimEnd}
                      onChange={(e) => setAiVideoEditorTrimEnd(Number(e.target.value))}
                      style={{ flex: 1, accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                    />
                  </div>
                </div>

              </div>

              {/* Right Column: 10 IA Operations & Customizers */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  ⚡ Recursos Automáticos de Pós-Produção
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  
                  {/* 1. Cortar / Trim */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', cursor: 'pointer', fontSize: '0.8rem', color: '#fff', fontWeight: 700 }}>
                    <input
                      type="checkbox"
                      checked={true}
                      readOnly
                      style={{ accentColor: 'var(--accent-primary)' }}
                    />
                    <span>✂️ Cortar (Smart Trim)</span>
                  </label>

                  {/* 2. Acelerar */}
                  <button
                    type="button"
                    onClick={() => setAiVideoEditorSpeed(prev => prev === 2.0 ? 1.0 : 2.0)}
                    style={{
                      padding: '0.6rem 0.75rem',
                      background: aiVideoEditorSpeed > 1.0 ? 'rgba(255, 90, 31, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: aiVideoEditorSpeed > 1.0 ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textAlign: 'left'
                    }}
                  >
                    <span>⚡</span>
                    <span>Acelerar (2x Prep)</span>
                  </button>

                  {/* 3. Slow Motion */}
                  <button
                    type="button"
                    onClick={() => setAiVideoEditorSpeed(prev => prev === 0.5 ? 1.0 : 0.5)}
                    style={{
                      padding: '0.6rem 0.75rem',
                      background: aiVideoEditorSpeed === 0.5 ? 'rgba(255, 90, 31, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: aiVideoEditorSpeed === 0.5 ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textAlign: 'left'
                    }}
                  >
                    <span>🐢</span>
                    <span>Slow Motion (0.5x)</span>
                  </button>

                  {/* 4. Adicionar Logo */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', cursor: 'pointer', fontSize: '0.8rem', color: '#fff', fontWeight: 700 }}>
                    <input
                      type="checkbox"
                      checked={aiVideoEditorOverlays.addLogo}
                      onChange={(e) => setAiVideoEditorOverlays(prev => ({ ...prev, addLogo: e.target.checked }))}
                      style={{ accentColor: 'var(--accent-primary)' }}
                    />
                    <span>🏷️ Adicionar Logo</span>
                  </label>

                  {/* 5. Colocar Preço */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', cursor: 'pointer', fontSize: '0.8rem', color: '#fff', fontWeight: 700 }}>
                    <input
                      type="checkbox"
                      checked={aiVideoEditorOverlays.addPrice}
                      onChange={(e) => setAiVideoEditorOverlays(prev => ({ ...prev, addPrice: e.target.checked }))}
                      style={{ accentColor: 'var(--accent-primary)' }}
                    />
                    <span>💰 Colocar Preço</span>
                  </label>

                  {/* 6. Colocar Ingredientes */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', cursor: 'pointer', fontSize: '0.8rem', color: '#fff', fontWeight: 700 }}>
                    <input
                      type="checkbox"
                      checked={aiVideoEditorOverlays.addIngredients}
                      onChange={(e) => setAiVideoEditorOverlays(prev => ({ ...prev, addIngredients: e.target.checked }))}
                      style={{ accentColor: 'var(--accent-primary)' }}
                    />
                    <span>🥬 Ingredientes</span>
                  </label>

                  {/* 7. Colocar Música */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', cursor: 'pointer', fontSize: '0.8rem', color: '#fff', fontWeight: 700 }}>
                    <input
                      type="checkbox"
                      checked={aiVideoEditorOverlays.addMusic}
                      onChange={(e) => setAiVideoEditorOverlays(prev => ({ ...prev, addMusic: e.target.checked }))}
                      style={{ accentColor: 'var(--accent-primary)' }}
                    />
                    <span>🎵 Colocar Música</span>
                  </label>

                  {/* 8. Colocar Legenda */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', cursor: 'pointer', fontSize: '0.8rem', color: '#fff', fontWeight: 700 }}>
                    <input
                      type="checkbox"
                      checked={aiVideoEditorOverlays.addCaptions}
                      onChange={(e) => setAiVideoEditorOverlays(prev => ({ ...prev, addCaptions: e.target.checked }))}
                      style={{ accentColor: 'var(--accent-primary)' }}
                    />
                    <span>📝 Legenda Reels</span>
                  </label>

                  {/* 9. Colocar QR Code */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', cursor: 'pointer', fontSize: '0.8rem', color: '#fff', fontWeight: 700 }}>
                    <input
                      type="checkbox"
                      checked={aiVideoEditorOverlays.addQrCode}
                      onChange={(e) => setAiVideoEditorOverlays(prev => ({ ...prev, addQrCode: e.target.checked }))}
                      style={{ accentColor: 'var(--accent-primary)' }}
                    />
                    <span>📱 Colocar QR Code</span>
                  </label>

                  {/* 10. Colocar WhatsApp */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', cursor: 'pointer', fontSize: '0.8rem', color: '#fff', fontWeight: 700 }}>
                    <input
                      type="checkbox"
                      checked={aiVideoEditorOverlays.addWhatsApp}
                      onChange={(e) => setAiVideoEditorOverlays(prev => ({ ...prev, addWhatsApp: e.target.checked }))}
                      style={{ accentColor: 'var(--accent-primary)' }}
                    />
                    <span>💬 Colocar WhatsApp</span>
                  </label>

                </div>

                {/* Texto da Legenda Customizável */}
                {aiVideoEditorOverlays.addCaptions && (
                  <div className="burger-ui-form-group">
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      Texto da Legenda / Chamada:
                    </label>
                    <input
                      type="text"
                      value={aiVideoEditorOverlays.captionText}
                      onChange={(e) => setAiVideoEditorOverlays(prev => ({ ...prev, captionText: e.target.value }))}
                      className="burger-ui-input"
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
                    />
                  </div>
                )}

                {/* Bottom Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => {
                      setProdVideoUrl(aiVideoEditorSourceUrl);
                      const copy = [...prodVideos];
                      copy[0] = aiVideoEditorSourceUrl;
                      setProdVideos(copy);
                      setIsAiVideoEditorOpen(false);
                    }}
                    style={{ fontWeight: 800, padding: '0.75rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    💾 Salvar Vídeo Editado no Produto
                  </Button>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        const newLibItem: LibraryMediaItem = {
                          id: 'lib-' + Date.now(),
                          name: `${prodName || 'Hambúrguer'} (Vídeo Editado 4K)`,
                          category: 'videos',
                          type: 'video',
                          format: 'MP4',
                          size: '8.2 MB',
                          resolution: '3840 x 2160',
                          url: aiVideoEditorSourceUrl,
                          tags: ['video', 'editado', 'reels', 'tv', 'whatsapp'],
                          createdAt: new Date().toISOString().split('T')[0]
                        };
                        const updated = [newLibItem, ...libraryItems];
                        setLibraryItems(updated);
                        localStorage.setItem('burger_studio_library_items', JSON.stringify(updated));
                        setIsAiVideoEditorOpen(false);
                      }}
                      style={{ flex: 1, fontSize: '0.75rem' }}
                    >
                      📚 Salvar na Biblioteca
                    </Button>

                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsAiVideoEditorOpen(false)}
                      style={{ fontSize: '0.75rem' }}
                    >
                      Fechar
                    </Button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 6. MODAL DO FLUXO INTELIGENTE (PIPELINE AUTOMÁTICO COMPLETO) */}
      {/* ──────────────────────────────────────────────────────────── */}
      {isSmartFlowOpen && (
        <div className="burger-ui-modal-overlay" onClick={() => setIsSmartFlowOpen(false)}>
          <div
            className="burger-ui-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '1180px', width: '96%', maxHeight: '94vh', display: 'flex', flexDirection: 'column', padding: '1.75rem' }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.8rem' }}>⚡</span>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900, color: '#fff', margin: 0 }}>
                    Fluxo Inteligente de Publicação
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Esteira completa: Cadastrar Produto → Foto → Vídeo → IA Melhora → Feed → Story → Banner → TV → Cardápio → Salvar Biblioteca.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setSmartFlowProcessing(true);
                    let current = 1;
                    const interval = setInterval(() => {
                      current += 1;
                      if (current <= 11) {
                        setSmartFlowStep(current);
                      } else {
                        clearInterval(interval);
                        setSmartFlowProcessing(false);
                        setSmartFlowCompletedNotice(`✓ Fluxo executado com sucesso! "${flowProdName}" e todos os 5 materiais publicitários foram gerados e salvos.`);
                        setTimeout(() => setSmartFlowCompletedNotice(null), 5000);
                      }
                    }, 400);
                  }}
                  disabled={smartFlowProcessing}
                  style={{
                    padding: '0.45rem 1rem',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #FFB703, #FF5A1F)',
                    color: '#000',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 4px 14px rgba(255, 183, 3, 0.3)'
                  }}
                >
                  {smartFlowProcessing ? '⏳ Executando Esteira...' : '🚀 Executar Todo o Fluxo (1-Clique)'}
                </button>

                <button
                  type="button"
                  onClick={() => setIsSmartFlowOpen(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Stepper Bar (11 Steps) */}
            <div style={{
              display: 'flex',
              gap: '0.35rem',
              overflowX: 'auto',
              paddingBottom: '0.75rem',
              marginBottom: '1rem',
              borderBottom: '1px solid rgba(255,255,255,0.06)'
            }}>
              {[
                { s: 1, label: '1. Cadastrar', icon: '📦' },
                { s: 2, label: '2. Foto', icon: '📸' },
                { s: 3, label: '3. Vídeo', icon: '🎬' },
                { s: 4, label: '4. IA Foto', icon: '✨' },
                { s: 5, label: '5. IA Vídeo', icon: '⚡' },
                { s: 6, label: '6. Feed', icon: '📱' },
                { s: 7, label: '7. Story', icon: '📲' },
                { s: 8, label: '8. Banner', icon: '🎨' },
                { s: 9, label: '9. TV', icon: '📺' },
                { s: 10, label: '10. Cardápio', icon: '📋' },
                { s: 11, label: '11. Salvar', icon: '📚' }
              ].map((item) => {
                const isActive = smartFlowStep === item.s;
                const isPassed = smartFlowStep > item.s;
                return (
                  <button
                    key={item.s}
                    type="button"
                    onClick={() => setSmartFlowStep(item.s)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.35rem 0.65rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: isActive ? 800 : isPassed ? 700 : 500,
                      background: isActive ? 'linear-gradient(135deg, #FF5A1F, #FFB703)' : isPassed ? 'rgba(46, 196, 182, 0.15)' : 'rgba(255,255,255,0.03)',
                      color: isActive ? '#000' : isPassed ? 'var(--accent-success)' : 'var(--text-secondary)',
                      border: isActive ? 'none' : isPassed ? '1px solid var(--accent-success)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{isPassed ? '✓' : item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Notification Toast */}
            {smartFlowCompletedNotice && (
              <div style={{
                padding: '0.75rem 1rem',
                background: 'rgba(46, 196, 182, 0.15)',
                border: '1px solid var(--accent-success)',
                borderRadius: '8px',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 700
              }}>
                <span>✓</span>
                <span>{smartFlowCompletedNotice}</span>
              </div>
            )}

            {/* Step Body Content */}
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* STEP 1: Cadastrar Produto */}
              {smartFlowStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>📦</span>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                      Passo 1 — Informações do Produto
                    </h4>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    <div className="burger-ui-form-group">
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Nome do Hambúrguer</label>
                      <input
                        type="text"
                        value={flowProdName}
                        onChange={(e) => setFlowProdName(e.target.value)}
                        className="burger-ui-input"
                        placeholder="Ex: Smash Monster Trufado"
                      />
                    </div>

                    <div className="burger-ui-form-group">
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Categoria</label>
                      <select
                        value={flowProdCat}
                        onChange={(e) => setFlowProdCat(e.target.value)}
                        className="burger-ui-input"
                      >
                        <option value="Sanduiches">Sanduiches</option>
                        <option value="Hot Dog">Hot Dog</option>
                        <option value="Porções">Porções</option>
                        <option value="Pasteis">Pasteis</option>
                        <option value="Salgados">Salgados</option>
                        <option value="Refrigerantes">Refrigerantes</option>
                        <option value="Sucos">Sucos</option>
                        <option value="Bebidas Alcóolicas">Bebidas Alcóolicas</option>
                      </select>
                    </div>

                    <div className="burger-ui-form-group">
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Preço (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={flowProdPrice}
                        onChange={(e) => setFlowProdPrice(e.target.value)}
                        className="burger-ui-input"
                        placeholder="38.90"
                      />
                    </div>

                    <div className="burger-ui-form-group">
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Peso Aproximado</label>
                      <input
                        type="text"
                        value={flowProdWeight}
                        onChange={(e) => setFlowProdWeight(e.target.value)}
                        className="burger-ui-input"
                        placeholder="Ex: 280g"
                      />
                    </div>
                  </div>

                  <div className="burger-ui-form-group">
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Ingredientes</label>
                    <input
                      type="text"
                      value={flowProdIngreds}
                      onChange={(e) => setFlowProdIngreds(e.target.value)}
                      className="burger-ui-input"
                      placeholder="Pão Brioche, 2x Smash 100g, Cheddar Inglês, Maionese Trufada, Bacon"
                    />
                  </div>

                  <div className="burger-ui-form-group">
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Descrição Promocional</label>
                    <textarea
                      rows={3}
                      value={flowProdDesc}
                      onChange={(e) => setFlowProdDesc(e.target.value)}
                      className="burger-ui-input"
                      placeholder="Descrição detalhada e apetitosa do produto..."
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Enviar Foto */}
              {smartFlowStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>📸</span>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                      Passo 2 — Selecionar / Enviar Foto Principal
                    </h4>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{
                      height: '240px',
                      backgroundColor: '#000',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid var(--accent-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={flowProdPhoto} alt="Foto Produto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
                        4K Ultra HD
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                        Escolha como definir a imagem:
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => setFlowProdPhoto('/foto.png')}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            background: 'rgba(255, 90, 31, 0.12)',
                            border: '1px solid var(--accent-primary)',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                        >
                          <span>🤖</span>
                          <div>
                            <div>Gerar Imagem Hiper-Realista por IA (GPT Image)</div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Foto profissional de estúdio gastronômico</span>
                          </div>
                        </button>

                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.75rem 1rem',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--border-subtle)',
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer'
                        }}>
                          <span>📤</span>
                          <div>
                            <div>Enviar Foto do Computador</div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>JPG, PNG, WEBP, TIFF</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFileUpload(e.target.files[0], (url) => setFlowProdPhoto(url));
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Enviar Vídeo */}
              {smartFlowStep === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>🎬</span>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                      Passo 3 — Definir Vídeo do Produto
                    </h4>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{
                      height: '240px',
                      backgroundColor: '#000',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid var(--accent-secondary)',
                      position: 'relative'
                    }}>
                      <video src={flowProdVideo} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                        Escolha a origem do vídeo:
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => setFlowProdVideo('https://assets.mixkit.co/videos/preview/mixkit-cooking-in-a-professional-kitchen-41624-large.mp4')}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            background: 'rgba(255, 183, 3, 0.12)',
                            border: '1px solid var(--accent-secondary)',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                        >
                          <span>🎬</span>
                          <div>
                            <div>Gerar Vídeo Cinematográfico por IA (Veo / Kling)</div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Câmera 4K com brasa e queijo derretendo</span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setFlowProdVideo('https://assets.mixkit.co/videos/preview/mixkit-cooking-in-a-professional-kitchen-41624-large.mp4')}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid var(--border-subtle)',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                        >
                          <span>🎞️</span>
                          <div>
                            <div>Criar Vídeo usando Minhas Imagens (Motion Engine)</div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Zoom cinematográfico, fumaça, transições e música</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: IA Melhora Imagem (Opcional) */}
              {smartFlowStep === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.4rem' }}>✨</span>
                      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                        Passo 4 — Editor Inteligente de Imagem (Opcional)
                      </h4>
                    </div>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(46, 196, 182, 0.2)', color: 'var(--accent-success)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 700 }}>
                      Auto-Enhance Ativo
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{
                      height: '240px',
                      backgroundColor: '#000',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid var(--accent-primary)',
                      position: 'relative'
                    }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={flowProdPhoto} alt="Aprimoramento" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: flowImageEnhanced ? 'contrast(1.1) brightness(1.08) saturate(1.15)' : 'none' }} />
                      <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.75)', color: '#FFB703', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
                        {flowImageEnhanced ? '✨ IA 8K UHD • Queijo Realçado • Fumaça' : 'Original'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                        Efeitos automáticos aplicados:
                      </span>
                      {[
                        '✂️ Remoção e troca de fundo inteligente',
                        '🔍 Upscale para resolução 8K Ultra HD',
                        '💡 Iluminação gastronômica de estúdio 3 pontos',
                        '🧀 Realce dourado de queijo derretido',
                        '💨 Efeito sutil de vapor e brasa quente'
                      ].map((ef, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#fff', background: 'rgba(255,255,255,0.03)', padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                          <span style={{ color: 'var(--accent-success)' }}>✓</span>
                          <span>{ef}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: IA Melhora Vídeo (Opcional) */}
              {smartFlowStep === 5 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.4rem' }}>⚡</span>
                      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                        Passo 5 — Editor Inteligente de Vídeo (Pós-Produção)
                      </h4>
                    </div>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(255, 183, 3, 0.2)', color: 'var(--accent-secondary)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 700 }}>
                      Auto-Post-Production 60 FPS
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{
                      height: '240px',
                      backgroundColor: '#000',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid var(--accent-secondary)',
                      position: 'relative'
                    }}>
                      <video src={flowProdVideo} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--accent-primary)', color: '#fff', fontWeight: 900, fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        R$ {Number(flowProdPrice).toFixed(2)}
                      </div>
                      <div style={{ position: 'absolute', bottom: '10px', left: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: '#FFB703', fontWeight: 800, fontSize: '0.75rem', textAlign: 'center', padding: '0.25rem', borderRadius: '4px' }}>
                        {flowProdName} — O Mais Suculento! 🔥
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                        Tratamentos automáticos de vídeo:
                      </span>
                      {[
                        '✂️ Smart Trim com seleção dos melhores momentos',
                        '🐢 Slow Motion (0.5x) no derretimento do queijo',
                        '🏷️ Logo da hamburgueria com glow pulsante',
                        '💰 Badge de preço promocional destacado',
                        '🎵 Trilha sonora sincronizada com beat sync',
                        '📝 Legendas automáticas estilo Reels / TikTok'
                      ].map((vop, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#fff', background: 'rgba(255,255,255,0.03)', padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                          <span style={{ color: 'var(--accent-success)' }}>✓</span>
                          <span>{vop}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: Gerar Feed */}
              {smartFlowStep === 6 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>📱</span>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                      Passo 6 — Feed do Instagram (1:1 / 4:5)
                    </h4>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'start' }}>
                    {/* Mockup Feed */}
                    <div style={{
                      width: '320px',
                      height: '320px',
                      backgroundColor: '#121216',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      position: 'relative',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.6)'
                    }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={flowProdPhoto} alt="Feed Arte" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)', padding: '1rem' }}>
                        <span style={{ color: 'var(--accent-secondary)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>{activeClient.name}</span>
                        <h4 style={{ color: '#fff', fontSize: '1.1rem', margin: '0.15rem 0', fontWeight: 900 }}>{flowProdName}</h4>
                        <div style={{ color: 'var(--accent-primary)', fontSize: '1rem', fontWeight: 900 }}>R$ {Number(flowProdPrice).toFixed(2)}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Copywriting Gerado para o Feed:</div>
                      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.85rem', color: '#fff', lineHeight: 1.5 }}>
                        🔥 Já provou o novo <strong>{flowProdName}</strong>? Blend artesanal grelhado na brasa, queijo derretido e a crocância perfeita que você ama! 🍔🥓<br /><br />
                        📍 Peça agora pelo link da bio ou WhatsApp {activeClient.whatsappNumber || '(11) 99999-9999'}.<br /><br />
                        <span style={{ color: 'var(--accent-secondary)' }}>#{flowProdName.toLowerCase().replace(/\s+/g, '')} #smashburger #hamburguerartesanal #burgerlovers #delivery</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: Gerar Story */}
              {smartFlowStep === 7 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>📲</span>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                      Passo 7 — Story do Instagram (9:16 Vertical)
                    </h4>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{
                      width: '220px',
                      height: '380px',
                      backgroundColor: '#0a0a0e',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      position: 'relative',
                      border: '2px solid var(--accent-primary)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: '1rem'
                    }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={flowProdPhoto} alt="Story Arte" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }} />
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 40%, rgba(0,0,0,0.85) 100%)', zIndex: 2 }} />

                      <div style={{ position: 'relative', zIndex: 3, textAlign: 'center' }}>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 800 }}>🍔 DESTAQUE DO DIA</span>
                      </div>

                      <div style={{ position: 'relative', zIndex: 3, textAlign: 'center' }}>
                        <h4 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 900, textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>{flowProdName}</h4>
                        <div style={{ color: '#FFB703', fontSize: '1.4rem', fontWeight: 900, margin: '0.25rem 0' }}>R$ {Number(flowProdPrice).toFixed(2)}</div>
                        <div style={{ background: '#25D366', color: '#fff', fontSize: '0.75rem', fontWeight: 800, padding: '0.35rem 0.75rem', borderRadius: '20px', display: 'inline-block', marginTop: '0.4rem' }}>
                          💬 PEÇA NO WHATSAPP
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Recursos do Story 9:16:</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: '#fff' }}>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                          ✓ Template vertical de alto engajamento
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                          ✓ Sticker de preço dinâmico e chamada para ação (CTA)
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                          ✓ Pronto para compartilhamento direto no Instagram Stories
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 8: Gerar Banner */}
              {smartFlowStep === 8 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>🎨</span>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                      Passo 8 — Banner Promocional (16:9 / Impresso & Digital)
                    </h4>
                  </div>

                  <div style={{
                    width: '100%',
                    height: '240px',
                    backgroundColor: '#0a0a0e',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    position: 'relative',
                    border: '1px solid var(--border-subtle)',
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr'
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={flowProdPhoto} alt="Banner Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ background: 'linear-gradient(135deg, #1A1A24, #0A0A0C)', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.75rem' }}>
                      <span style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>{activeClient.name} • Especial da Semana</span>
                      <h3 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 900, lineHeight: 1.1, margin: 0 }}>{flowProdName}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>{flowProdDesc}</p>
                      <div style={{ color: 'var(--accent-secondary)', fontSize: '1.4rem', fontWeight: 900 }}>R$ {Number(flowProdPrice).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 9: Gerar TV */}
              {smartFlowStep === 9 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>📺</span>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                      Passo 9 — TV Digital Signage (Slide 16:9 4K)
                    </h4>
                  </div>

                  <div style={{
                    width: '100%',
                    height: '240px',
                    backgroundColor: '#000',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    position: 'relative',
                    border: '3px solid #1E1E24',
                    display: 'grid',
                    gridTemplateColumns: '1.3fr 1fr'
                  }}>
                    <video src={flowProdVideo} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ background: '#121216', padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.6rem' }}>
                      <span style={{ background: 'var(--accent-primary)', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px', alignSelf: 'flex-start' }}>
                        NOVIDADE NA TV
                      </span>
                      <h3 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 900, margin: 0 }}>{flowProdName}</h3>
                      <div style={{ color: 'var(--accent-secondary)', fontSize: '1.5rem', fontWeight: 900 }}>
                        R$ {Number(flowProdPrice).toFixed(2)}
                      </div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Sincronizado automaticamente com o TV Player</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 10: Gerar Cardápio */}
              {smartFlowStep === 10 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>📋</span>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                      Passo 10 — Ficha do Cardápio Digital
                    </h4>
                  </div>

                  <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    display: 'flex',
                    gap: '1.5rem',
                    alignItems: 'center'
                  }}>
                    <div style={{ width: '140px', height: '140px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#000', flexShrink: 0 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={flowProdPhoto} alt="Cardápio" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 900, margin: 0 }}>{flowProdName}</h4>
                        <span style={{ color: 'var(--accent-secondary)', fontSize: '1.25rem', fontWeight: 900 }}>R$ {Number(flowProdPrice).toFixed(2)}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700 }}>{flowProdCat} • Peso: {flowProdWeight}</span>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.25rem 0' }}>{flowProdDesc}</p>
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        {flowProdIngreds.split(',').map((ing, idx) => (
                          <span key={idx} style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.06)', padding: '0.15rem 0.4rem', borderRadius: '4px', color: '#fff' }}>
                            ✓ {ing.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 11: Salvar Biblioteca & Finalizar */}
              {smartFlowStep === 11 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>📚</span>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                      Passo 11 — Salvar Tudo na Biblioteca & Catálogo
                    </h4>
                  </div>

                  <div style={{
                    background: 'linear-gradient(135deg, rgba(46, 196, 182, 0.1), rgba(255, 90, 31, 0.08))',
                    border: '1px solid var(--accent-success)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    <h5 style={{ color: '#fff', fontSize: '1rem', fontWeight: 800, margin: 0 }}>
                      🎉 Tudo pronto! Os seguintes materiais serão gerados e persistidos:
                    </h5>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                      {[
                        { label: '📦 Cadastro do Produto', path: 'Catálogo de Produtos' },
                        { label: '📸 Foto 8K Aprimorada', path: 'storage/images/generated/' },
                        { label: '🎬 Vídeo Pós-Produzido', path: 'storage/videos/edited/' },
                        { label: '📱 Post Feed Instagram', path: 'storage/exports/feed.jpg' },
                        { label: '📲 Story 9:16 Vertical', path: 'storage/exports/story.jpg' },
                        { label: '🎨 Banner Promocional', path: 'storage/exports/banner.jpg' },
                        { label: '📺 Slide TV Signage 4K', path: 'storage/exports/tv_slide.webp' },
                        { label: '📋 Ficha Cardápio Digital', path: 'storage/exports/cardapio.json' }
                      ].map((mat, i) => (
                        <div key={i} style={{ background: 'rgba(0,0,0,0.35)', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.8rem' }}>{mat.label}</div>
                          <span style={{ color: 'var(--accent-secondary)', fontSize: '0.65rem', fontFamily: 'monospace' }}>{mat.path}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => setSmartFlowStep(prev => Math.max(1, prev - 1))}
                disabled={smartFlowStep === 1}
                style={{
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border-subtle)',
                  color: smartFlowStep === 1 ? 'var(--text-muted)' : '#fff',
                  borderRadius: '8px',
                  cursor: smartFlowStep === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                ← Passo Anterior
              </button>

              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                Passo {smartFlowStep} de 11
              </span>

              {smartFlowStep < 11 ? (
                <button
                  type="button"
                  onClick={() => setSmartFlowStep(prev => Math.min(11, prev + 1))}
                  style={{
                    padding: '0.5rem 1.25rem',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #FF5A1F, #FF8C00)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Avançar Passo →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const newProd: Product = {
                      id: 'prod-' + Date.now(),
                      nome: flowProdName,
                      slug: flowProdName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
                      categoria: flowProdCat,
                      preço: Number(flowProdPrice) || 38.90,
                      descrição: flowProdDesc,
                      ingredientes: flowProdIngreds.split(',').map(i => i.trim()),
                      peso: flowProdWeight,
                      imagem: flowProdPhoto,
                      ativo: true,
                      created_at: new Date()
                    };
                    const updatedProds = [newProd, ...products];
                    setProducts(updatedProds);
                    safeSetLocalStorage('burger_studio_products', JSON.stringify(updatedProds));

                    const newLibPhoto: LibraryMediaItem = {
                      id: 'lib-' + Date.now(),
                      name: `${flowProdName} (Foto 8K)`,
                      category: 'sanduiches',
                      type: 'image',
                      format: 'WEBP',
                      resolution: '3840 x 2160',
                      size: '1.6 MB',
                      url: flowProdPhoto,
                      tags: ['foto', '8k', 'fluxo-inteligente', 'sanduiches'],
                      createdAt: new Date().toISOString().split('T')[0]
                    };
                    const updatedLib = [newLibPhoto, ...libraryItems];
                    setLibraryItems(updatedLib);
                    safeSetLocalStorage('burger_studio_library_items', JSON.stringify(updatedLib));

                    setIsSmartFlowOpen(false);
                    setActiveTab('produtos');
                  }}
                  style={{
                    padding: '0.5rem 1.5rem',
                    fontSize: '0.85rem',
                    fontWeight: 900,
                    background: 'linear-gradient(135deg, #2EC4B6, #20A496)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(46, 196, 182, 0.4)'
                  }}
                >
                  💾 Salvar Tudo no Catálogo & Biblioteca
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}




