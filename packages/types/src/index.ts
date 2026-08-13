export type CampaignStatus = 'DRAFT' | 'GENERATING' | 'READY' | 'PUBLISHED' | 'FAILED';

export type AssetType = 'COPYWRITING' | 'IMAGE' | 'VIDEO' | 'TV_BOARD' | 'SOCIAL_POST';

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  createdAt: Date;
  products?: Product[];
}

export interface Campaign {
  id: string;
  restaurantId: string;
  name: string;
  theme: string;
  status: CampaignStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Asset {
  id: string;
  campaignId: string;
  type: AssetType;
  url?: string;
  content?: string; // For copywriting text or template JSON string
  metadata?: Record<string, any>;
  createdAt: Date;
}

export type AgentName =
  | 'orchestrator'
  | 'copywriter'
  | 'food-photographer'
  | 'image-generator'
  | 'video-director'
  | 'tv-builder'
  | 'social-media'
  | 'publisher';

export type TaskStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface AgentTask {
  id: string;
  campaignId: string;
  agent: AgentName;
  status: TaskStatus;
  input?: Record<string, any>;
  output?: Record<string, any>;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductCategory =
  | 'Sanduiches'
  | 'Hot Dog'
  | 'Porções'
  | 'Pasteis'
  | 'Salgados'
  | 'Refrigerantes'
  | 'Sucos'
  | 'Bebidas Alcóolicas';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Sanduiches',
  'Hot Dog',
  'Porções',
  'Pasteis',
  'Salgados',
  'Refrigerantes',
  'Sucos',
  'Bebidas Alcóolicas'
];

export interface Product {
  id: string;
  nome: string;
  slug: string;
  categoria: ProductCategory | string;
  descrição?: string;
  ingredientes: string[];
  preço: number;
  peso?: string | number;
  imagem?: string;
  ativo: boolean;
  created_at: Date;
  restaurantId?: string;
  selo?: string;
  media?: Media[];
  promotions?: Promotion[];
}

export interface Promotion {
  id: string;
  title: string;
  discount: number;
  startDate: Date;
  endDate: Date;
  products?: Product[];
}

export type MediaType = 'imagem' | 'video' | 'post' | 'story' | 'tv';

export interface Media {
  id: string;
  produtoId: string;
  tipo: MediaType;
  caminho: string;
  createdAt: Date;
}

export type ImageAiProvider = 'gpt-image' | 'outro';
export type VideoAiProvider = 'veo' | 'kling' | 'runway';

export interface AiSettings {
  imageProvider: ImageAiProvider;
  customImageProviderName?: string;
  videoProvider: VideoAiProvider;
}

export interface ProductFileItem {
  filename: string;
  label: string;
  type: 'image' | 'video' | 'document';
  format: string;
  resolution: string;
  size: string;
  usage: string;
  url: string;
}

export interface ProductFileBank {
  productId: string;
  productName: string;
  slug: string;
  directory: string;
  files: ProductFileItem[];
}

export interface ClientProjectConfig {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  logoIcon?: string;
  tagline?: string;
  primaryColor: string;
  secondaryColor: string;
  themePreset: string;
  fontFamily: string;
  qrCodeUrl?: string;
  instagramHandle?: string;
  whatsappNumber?: string;
  createdAt: string;
}

export const STORAGE_PATHS = {
  root: 'storage',
  images: {
    root: 'storage/images',
    uploaded: 'storage/images/uploaded',
    generated: 'storage/images/generated',
    edited: 'storage/images/edited',
  },
  videos: {
    root: 'storage/videos',
    uploaded: 'storage/videos/uploaded',
    generated: 'storage/videos/generated',
    edited: 'storage/videos/edited',
  },
  logos: 'storage/logos',
  templates: 'storage/templates',
  backgrounds: 'storage/backgrounds',
  music: 'storage/music',
  icons: 'storage/icons',
  qr: 'storage/qr',
  exports: 'storage/exports',
} as const;

export type StorageCategory = keyof typeof STORAGE_PATHS;



