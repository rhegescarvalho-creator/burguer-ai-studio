'use client';

import React, { useState, useEffect } from 'react';
import type { Product, Promotion } from '@burger-ai/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Seed initial products (fallback)
const initialProducts: Product[] = [
  {
    id: 'p0',
    nome: 'Smash Bacon',
    slug: 'smash-bacon',
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
  }
];

const initialPromotions: Promotion[] = [
  {
    id: 'pr1',
    title: 'Combo Terça Double Smash',
    discount: 15.00,
    startDate: new Date('2026-08-01T00:00:00Z'),
    endDate: new Date('2026-08-31T23:59:59Z')
  },
  {
    id: 'pr2',
    title: 'Festival Cheddar Volcano',
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
  }
];

export default function PlayerPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [slide, setSlide] = useState(0);
  const [durationMode, setDurationMode] = useState<'5s' | '7s' | '10s' | 'smart'>('smart');
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const [showControls, setShowControls] = useState(false);

  // TV Studio specifications
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [activeTvId, setActiveTvId] = useState<string>('tv-salao');
  const [selectedMusic, setSelectedMusic] = useState<string>('Rock');
  const [adInterval, setAdInterval] = useState<number>(30);
  const [adPartner, setAdPartner] = useState<string>('Coca-Cola');
  const [adDuration, setAdDuration] = useState<number>(10);
  const [activeTurno, setActiveTurno] = useState<string>('almoco');
  const [tvPlaylists, setTvPlaylists] = useState<Record<string, any[]>>({});

  // Ads/Commercials active state
  const [adActive, setAdActive] = useState<boolean>(false);

  const playlist = tvPlaylists[activeTvId] || tvPlaylists['tv-salao'] || [];
  const currentItem = playlist[slide];

  // Get current slide duration in milliseconds
  const getCurrentSlideDuration = (slideIndex: number) => {
    if (adActive) return adDuration * 1000;
    const item = playlist[slideIndex];
    if (item) return item.duration * 1000;
    return 7000;
  };

  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [showSyncNotice, setShowSyncNotice] = useState(false);
  const [activeTheme, setActiveTheme] = useState('tv-01');
  const [clientConfig, setClientConfig] = useState({
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
  });

  // Sync loader function
  const refreshDataFromSource = () => {
    
    
    // Fetch Settings (Active client, active theme, TV Studio configurations)
    fetch(`${API_URL}/api/settings`)
      .then(res => res.json())
      .then(settings => {
        setIsLoaded(true);
        if (settings.activeTheme) {
          setActiveTheme(prev => prev !== settings.activeTheme ? settings.activeTheme : prev);
        }
        if (settings.activeTvId) {
          setActiveTvId(prev => prev !== settings.activeTvId ? settings.activeTvId : prev);
        }
        if (settings.activeMusic) {
          setSelectedMusic(prev => prev !== settings.activeMusic ? settings.activeMusic : prev);
        }
        if (settings.adIntervalMinutes) setAdInterval(settings.adIntervalMinutes);
        if (settings.adPartnerName) setAdPartner(settings.adPartnerName);
        if (settings.adDurationSeconds) setAdDuration(settings.adDurationSeconds);
        if (settings.activeTurno) {
          setActiveTurno(prev => prev !== settings.activeTurno ? settings.activeTurno : prev);
        }
        if (settings.playlists) {
          setTvPlaylists(prev => {
            if (JSON.stringify(prev) !== JSON.stringify(settings.playlists)) {
              return settings.playlists;
            }
            return prev;
          });
        }
        if (settings.activeClientConfig) {
          setClientConfig(prev => {
            if (JSON.stringify(prev) !== JSON.stringify(settings.activeClientConfig)) {
              return { ...prev, ...settings.activeClientConfig };
            }
            return prev;
          });
        }
      })
      .catch(() => {
        // Fallback: Supabase direct query
        try {
          const { createClient } = require('@supabase/supabase-js');
          const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qjhrlqpsfzaycoaekwqh.supabase.co';
          const sbKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_c0x3S20RA_xIVMed3cPpFQ_kO1XXul6';
          const sb = createClient(sbUrl, sbKey);
          sb.from('tv_settings').select('*').eq('id', 'default').single()
            .then(({ data }: any) => {
              setIsLoaded(true);
              if (data && data.playlists) {
                setTvPlaylists(prev => {
                  if (JSON.stringify(prev) !== JSON.stringify(data.playlists)) {
                    return data.playlists;
                  }
                  return prev;
                });
                if (data.active_tv_id) setActiveTvId(prev => prev !== data.active_tv_id ? data.active_tv_id : prev);
                if (data.active_music) setSelectedMusic(prev => prev !== data.active_music ? data.active_music : prev);
                if (data.active_turno) setActiveTurno(prev => prev !== data.active_turno ? data.active_turno : prev);
                if (data.ad_interval_minutes) setAdInterval(prev => prev !== data.ad_interval_minutes ? data.ad_interval_minutes : prev);
                if (data.ad_partner_name) setAdPartner(prev => prev !== data.ad_partner_name ? data.ad_partner_name : prev);
                if (data.ad_duration_seconds) setAdDuration(prev => prev !== data.ad_duration_seconds ? data.ad_duration_seconds : prev);
              }
            }).catch(() => {
              setIsLoaded(true);
            });
        } catch (e) {
          setIsLoaded(true);
        }
      });

    // Fetch Products
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(prods => {
        if (Array.isArray(prods) && prods.length > 0) {
          setProducts(prev => JSON.stringify(prev) !== JSON.stringify(prods) ? prods : prev);
        }
      })
      .catch(() => {
        // Fallback: Supabase products query
        try {
          const { createClient } = require('@supabase/supabase-js');
          const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qjhrlqpsfzaycoaekwqh.supabase.co';
          const sbKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_c0x3S20RA_xIVMed3cPpFQ_kO1XXul6';
          const sb = createClient(sbUrl, sbKey);
          sb.from('products').select('*')
            .then(({ data }: any) => {
              if (Array.isArray(data) && data.length > 0) {
                const formatted = data.map((p: any) => {
                  let parsedIngredients = p.ingredientes;
                  if (typeof p.ingredientes === 'string') {
                    try { parsedIngredients = JSON.parse(p.ingredientes); } catch (e) {}
                  }
                  return {
                    id: p.id,
                    nome: p.nome,
                    slug: p.slug,
                    categoria: p.categoria,
                    preço: parseFloat(p.preco),
                    descrição: p.descricao,
                    ingredientes: parsedIngredients,
                    imagem: p.imagem,
                    ativo: p.ativo,
                    created_at: new Date(p.created_at || Date.now())
                  };
                });
                setProducts(prev => JSON.stringify(prev) !== JSON.stringify(formatted) ? formatted : prev);
              }
            }).catch(() => {});
        } catch (e) {}
      });

    // Fetch Promotions
    fetch(`${API_URL}/api/promotions`)
      .then(res => res.json())
      .then(promos => {
        if (Array.isArray(promos) && promos.length > 0) {
          setPromotions(prev => JSON.stringify(prev) !== JSON.stringify(promos) ? promos : prev);
        }
      })
      .catch(() => {});

    setLastSyncTime(new Date().toLocaleTimeString());
  };

  // Hydrate and setup live synchronization listeners
  useEffect(() => {
    // 1. Instant hydration from client localStorage cache if available
    try {
      const cached = localStorage.getItem('burger_studio_tv_playlists');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
          setTvPlaylists(parsed);
          setIsLoaded(true);
        }
      }
    } catch (e) {}

    // 2. Fetch fresh authoritative state from API
    refreshDataFromSource();

    // BroadcastChannel for instant zero-latency updates from Dashboard
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('burger_tv_sync');
      channel.onmessage = (event) => {
        const data = event.data;
        if (data?.type === 'PLAYLIST_UPDATE' && data.playlists) {
          setTvPlaylists(data.playlists);
          if (data.activeTvId) setActiveTvId(data.activeTvId);
          setIsLoaded(true);
          setSlide(0);
          setProgressKey(k => k + 1);
          setLastSyncTime(new Date().toLocaleTimeString());
          setShowSyncNotice(true);
          setTimeout(() => setShowSyncNotice(false), 2500);
        } else if (data?.type === 'UPDATE_CATALOG' || data?.type === 'SYNC_ALL') {
          refreshDataFromSource();
        }
      };
    } catch (e) {}

    // 3. Supabase Realtime WebSocket listener (Global cloud sync across all TVs)
    let supabaseSub: any = null;
    try {
      const { createClient } = require('@supabase/supabase-js');
      const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qjhrlqpsfzaycoaekwqh.supabase.co';
      const sbKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_c0x3S20RA_xIVMed3cPpFQ_kO1XXul6';
      const sb = createClient(sbUrl, sbKey);
      
      supabaseSub = sb
        .channel('tv-realtime-sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tv_settings' }, (payload: any) => {
          if (payload.new && payload.new.playlists) {
            setTvPlaylists(payload.new.playlists);
            if (payload.new.active_tv_id) setActiveTvId(payload.new.active_tv_id);
            setIsLoaded(true);
            setSlide(0);
            setProgressKey((k: number) => k + 1);
            setLastSyncTime(new Date().toLocaleTimeString());
            setShowSyncNotice(true);
            setTimeout(() => setShowSyncNotice(false), 2500);
          }
        })
        .subscribe();
    } catch (e) {}

    // Periodic lightweight sync poll (every 5 seconds)
    const pollInterval = setInterval(() => {
      refreshDataFromSource();
    }, 5000);

    return () => {
      clearInterval(pollInterval);
      if (channel) channel.close();
      if (supabaseSub && typeof supabaseSub.unsubscribe === 'function') {
        supabaseSub.unsubscribe();
      }
    };
  }, []);

  // Audio Music loop stream mapped to royalty free Helix streams
  const getMusicTrackUrl = () => {
    switch (selectedMusic) {
      case 'Rock':
        return 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
      case 'Country':
        return 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3';
      case 'Lo-fi':
        return 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3';
      case 'Pop':
        return 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3';
      case 'Instrumental':
      default:
        return 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3';
    }
  };

  // Auto-player loop with custom/dynamic duration
  useEffect(() => {
    if (isPaused || playlist.length === 0 || adActive) return;

    const currentDuration = getCurrentSlideDuration(slide);
    const timer = setTimeout(() => {
      setSlide((prev) => (prev + 1) % playlist.length);
      setProgressKey((prev) => prev + 1);
    }, currentDuration);

    return () => clearTimeout(timer);
  }, [slide, durationMode, isPaused, playlist, adActive]);

  // Keyboard navigation & controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (playlist.length === 0) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setSlide((prev) => (prev + 1) % playlist.length);
        setProgressKey((prev) => prev + 1);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setSlide((prev) => (prev - 1 + playlist.length) % playlist.length);
        setProgressKey((prev) => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playlist]);

  // Sponsor Ad Commercial auto injector simulation
  useEffect(() => {
    if (!adInterval || !adDuration) return;
    const intervalMs = adInterval * 1000;
    const triggerAd = () => {
      setAdActive(true);
      const timer = setTimeout(() => {
        setAdActive(false);
        setProgressKey(prev => prev + 1);
      }, adDuration * 1000);
      return () => clearTimeout(timer);
    };
    const interval = setInterval(triggerAd, intervalMs);
    return () => clearInterval(interval);
  }, [adInterval, adDuration]);

  const getThemeStyles = () => {
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
          fontFamily: "'Outfit', sans-serif",
          glow: 'rgba(212, 175, 55, 0.4)'
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
          fontFamily: "'Outfit', sans-serif",
          glow: 'rgba(255, 90, 31, 0.4)'
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
          fontFamily: "'Outfit', sans-serif",
          glow: 'rgba(255, 90, 31, 0.4)'
        };
    }
  };

  const themeStyle = getThemeStyles();

  return (
    <main
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      style={{
        width: '100vw',
        height: '100vh',
        background: currentItem?.themeColor || themeStyle.background,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: themeStyle.textPrimary,
        fontFamily: currentItem?.fontFamily || themeStyle.fontFamily,
        userSelect: 'none',
        transition: 'all 0.5s ease'
      }}
    >
      <audio
        src={getMusicTrackUrl()}
        autoPlay
        loop
        controls={false}
        style={{ display: 'none' }}
      />

      <style jsx global>{`
        @keyframes slideProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes charmingFade {
          0% {
            opacity: 0;
            filter: blur(16px) brightness(1.25);
            transform: scale(0.96);
          }
          100% {
            opacity: 1;
            filter: blur(0px) brightness(1);
            transform: scale(1);
          }
        }
        @keyframes charmingSlide {
          0% {
            opacity: 0;
            transform: translateX(100px) scale(0.96);
            filter: blur(10px);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
            filter: blur(0px);
          }
        }
        @keyframes charmingZoom {
          0% {
            opacity: 0;
            transform: scale(1.15);
            filter: blur(14px);
          }
          100% {
            opacity: 1;
            transform: scale(1);
            filter: blur(0px);
          }
        }
        @keyframes charmingCurtain {
          0% {
            opacity: 0;
            clip-path: polygon(0 0, 0 0, 0 100%, 0% 100%);
            transform: scale(1.04);
          }
          100% {
            opacity: 1;
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
            transform: scale(1);
          }
        }
        @keyframes goldenSweep {
          0% {
            opacity: 0;
            transform: translateX(-120%) skewX(-25deg);
          }
          20% {
            opacity: 0.85;
          }
          80% {
            opacity: 0.6;
          }
          100% {
            opacity: 0;
            transform: translateX(220%) skewX(-25deg);
          }
        }
        @keyframes kenBurnsMedia {
          0% {
            transform: scale(1) translate(0, 0);
          }
          50% {
            transform: scale(1.08) translate(-1.5%, -1%);
          }
          100% {
            transform: scale(1.03) translate(1%, 0.5%);
          }
        }
        @keyframes textEntranceTitle {
          0% {
            opacity: 0;
            transform: translateX(-60px) scale(0.92);
            filter: blur(12px);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
            filter: blur(0);
          }
        }
        @keyframes textEntranceDesc {
          0% {
            opacity: 0;
            transform: translateY(35px);
            filter: blur(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
        @keyframes textEntrancePrice {
          0% {
            opacity: 0;
            transform: scale(0.65) translateY(30px);
            filter: blur(8px);
          }
          65% {
            opacity: 1;
            transform: scale(1.12) translateY(-6px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0);
          }
        }
        @keyframes textEntranceQr {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Cinematic Golden Light Flare Sweep when changing products */}
      {isLoaded && currentItem && (
        <div
          key={'flare-sweep-' + slide + '-' + currentItem.id}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(105deg, transparent 35%, rgba(255, 183, 3, 0.2) 48%, rgba(255, 90, 31, 0.35) 52%, rgba(255, 255, 255, 0.4) 54%, transparent 68%)',
            pointerEvents: 'none',
            zIndex: 85,
            animation: 'goldenSweep 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        />
      )}

      {!isPaused && isLoaded && currentItem && (
        <div
          key={progressKey}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${themeStyle.accent}, ${themeStyle.accentSecondary})`,
            zIndex: 100,
            width: '100%',
            animation: `slideProgress ${getCurrentSlideDuration(slide)}ms linear forwards`
          }}
        />
      )}

      {!isLoaded || !currentItem ? (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#050508', gap: '1.25rem' }}>
          <div style={{ width: '45px', height: '45px', border: '3px solid rgba(255, 90, 31, 0.2)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Carregando sua Timeline...
          </span>
        </div>
      ) : adActive ? (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle, #0F0505 0%, #000000 100%)', animation: 'fadeIn 0.5s ease-out', position: 'relative' }}>
          
          <div style={{ position: 'absolute', top: '2rem', right: '3rem', display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'rgba(230, 57, 70, 0.2)', border: '1px solid rgba(230, 57, 70, 0.4)', borderRadius: '30px', padding: '0.4rem 1rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--accent-error)' }}>📢 COMERCIAL PATROCINADO</span>
          </div>

          <span style={{ fontSize: '7rem', marginBottom: '1.5rem', animation: 'pulseGlow 2s infinite' }}>🥤</span>
          <h1 style={{ fontSize: '4.5rem', fontWeight: 900, color: '#E63946', letterSpacing: '-0.02em', margin: 0 }}>
            {adPartner}
          </h1>
          <p style={{ color: '#fff', fontSize: '1.6rem', marginTop: '0.5rem', fontWeight: 600 }}>
            Abra a Felicidade. Refresque seu dia!
          </p>
          <div style={{ position: 'absolute', bottom: '3rem', fontSize: '1rem', color: 'var(--text-secondary)' }}>
            Retornando ao cardápio em {adDuration} segundos...
          </div>
        </div>
      ) : (
        currentItem && (
          <div
            key={'slide-' + slide + '-' + currentItem.id}
            style={{
              width: '100%',
              height: '100%',
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              animation: (() => {
                const tr = currentItem.transition || 'fade';
                if (tr === 'slide') return 'charmingSlide 0.9s cubic-bezier(0.16, 1, 0.3, 1) both';
                if (tr === 'zoom') return 'charmingZoom 0.95s cubic-bezier(0.16, 1, 0.3, 1) both';
                if (tr === 'curtain' || tr === 'sweep') return 'charmingCurtain 0.85s cubic-bezier(0.16, 1, 0.3, 1) both';
                if (tr === 'instant') return 'none';
                return 'charmingFade 0.9s cubic-bezier(0.16, 1, 0.3, 1) both';
              })(),
              background: currentItem.themeColor
            }}
          >
            <div style={{ position: 'relative', overflow: 'hidden', background: '#000' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.55) 100%)', zIndex: 2, pointerEvents: 'none' }} />
              
              {currentItem.type === 'video' || (currentItem.mediaUrl && (currentItem.mediaUrl.endsWith('.mp4') || currentItem.mediaUrl.endsWith('.webm') || currentItem.mediaUrl.includes('video') || currentItem.mediaUrl.includes('mixkit') || currentItem.mediaUrl.startsWith('data:video') || currentItem.mediaUrl.startsWith('blob:'))) ? (
                <video
                  key={currentItem.mediaUrl || 'player-video'}
                  src={currentItem.mediaUrl && (currentItem.mediaUrl.endsWith('.mp4') || currentItem.mediaUrl.endsWith('.webm') || currentItem.mediaUrl.includes('video') || currentItem.mediaUrl.includes('mixkit') || currentItem.mediaUrl.startsWith('data:video') || currentItem.mediaUrl.startsWith('blob:')) ? currentItem.mediaUrl : '/video.mp4'}
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
                <img
                  src={currentItem.mediaUrl || '/foto.png'}
                  alt={currentItem.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', animation: 'kenBurnsMedia 12s ease-out infinite alternate' }}
                  onError={(e) => { (e.target as HTMLImageElement).src = '/foto.png'; }}
                />
              )}
            </div>

            <div style={{ padding: '5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2rem', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}>
              <h2 
                key={'title-' + slide + '-' + (currentItem.name || '')}
                style={{ 
                  fontSize: '3.5rem', 
                  fontWeight: 900, 
                  color: '#fff', 
                  lineHeight: 1.1, 
                  margin: 0,
                  animation: 'textEntranceTitle 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both'
                }}
              >
                {(currentItem.name || '').replace(/\s*-\s*V[ií]deo\s*\d+/gi, '').replace(/\s*V[ií]deo\s*\d+/gi, '').trim()}
              </h2>
              
              {currentItem.showIngredients && (
                <p 
                  key={'desc-' + slide + '-' + (currentItem.id || '')}
                  style={{ 
                    color: 'var(--text-secondary)', 
                    fontSize: '1.2rem', 
                    lineHeight: 1.6, 
                    margin: 0,
                    animation: 'textEntranceDesc 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both'
                  }}
                >
                  {currentItem.ingredients || (() => {
                    const clean = (currentItem.name || '').replace(/\s*-\s*V[ií]deo\s*\d+/gi, '').replace(/\s*V[ií]deo\s*\d+/gi, '').trim();
                    const matched = products.find(p => p.nome.toLowerCase() === clean.toLowerCase() || p.nome.toLowerCase() === currentItem.name.toLowerCase());
                    return matched ? (Array.isArray(matched.ingredientes) ? `Ingredientes: ${matched.ingredientes.join(', ')}` : matched.descrição) : 'Ingredientes selecionados e ingredientes frescos de alta qualidade.';
                  })()}
                </p>
              )}

              {currentItem.showPrice && (
                <div 
                  key={'price-' + slide + '-' + (currentItem.price || '')}
                  style={{ 
                    fontSize: '2.8rem', 
                    fontWeight: 900, 
                    color: themeStyle.accentSecondary,
                    textShadow: '0 4px 24px rgba(255, 183, 3, 0.35)',
                    animation: 'textEntrancePrice 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) 0.55s both'
                  }}
                >
                  R$ {(currentItem.price !== undefined ? Number(currentItem.price) : (() => {
                    const clean = (currentItem.name || '').replace(/\s*-\s*V[ií]deo\s*\d+/gi, '').replace(/\s*V[ií]deo\s*\d+/gi, '').trim();
                    const matched = products.find(p => p.nome.toLowerCase() === clean.toLowerCase() || p.nome.toLowerCase() === currentItem.name.toLowerCase());
                    return matched ? matched.preço : 32.90;
                  })()).toFixed(2).replace('.', ',')}
                </div>
              )}

              {currentItem.showQr && (
                <div 
                  key={'qr-' + slide}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem', 
                    marginTop: '1rem', 
                    background: 'rgba(255,255,255,0.05)', 
                    padding: '0.8rem 1.5rem', 
                    borderRadius: '12px', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    animation: 'textEntranceQr 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.75s both'
                  }}
                >
                  <span style={{ fontSize: '2.5rem' }}>📱</span>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 800 }}>PEÇA SEM FILAS NA MESA</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Escaneie para fazer seu pedido direto no WhatsApp</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      )}

      <div style={{
        position: 'absolute',
        top: '1.5rem',
        right: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        zIndex: 90
      }}>
        <button
          onClick={() => setIsPaused((prev) => !prev)}
          style={{
            background: isPaused ? 'rgba(255, 90, 31, 0.2)' : 'rgba(18, 18, 22, 0.85)',
            border: isPaused ? '1px solid #FF5A1F' : '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '30px',
            padding: '0.45rem 0.9rem',
            color: isPaused ? '#FF5A1F' : '#fff',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            backdropFilter: 'blur(16px)',
            transition: 'all 0.2s ease'
          }}
        >
          <span>{isPaused ? '▶' : '⏸'}</span>
          <span>{isPaused ? 'Pausado' : `${getCurrentSlideDuration(slide) / 1000}s`}</span>
        </button>

        <div style={{
          padding: '0.5rem 1rem',
          background: showSyncNotice ? 'rgba(46, 196, 182, 0.2)' : 'rgba(18, 18, 22, 0.85)',
          border: showSyncNotice ? '1px solid var(--accent-success)' : '1px solid rgba(255,255,255,0.12)',
          borderRadius: '30px',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: showSyncNotice ? 'var(--accent-success)' : 'var(--text-secondary)',
          letterSpacing: '0.05em',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backdropFilter: 'blur(16px)',
          transition: 'all 0.3s ease'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: showSyncNotice ? 'var(--accent-success)' : (isPaused ? 'var(--accent-secondary)' : 'var(--accent-success)'),
            display: 'inline-block'
          }} />
          {showSyncNotice ? '⚡ PROJETO TV ATUALIZADO!' : `${activeTvId.toUpperCase()} • SLIDE ${slide + 1}/${playlist.length || 1}`}
        </div>
      </div>
    </main>
  );
}
