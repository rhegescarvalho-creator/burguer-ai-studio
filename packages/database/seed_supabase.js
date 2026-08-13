const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://qjhrlqpsfzaycoaekwqh.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_c0x3S20RA_xIVMed3cPpFQ_kO1XXul6';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('🚀 Iniciando sincronização e população do Supabase...');

  // 1. Categorias
  const categories = [
    { name: 'Sanduiches', icon: '🍔', desc: 'Sanduíches, smash e hambúrgueres artesanais' },
    { name: 'Hot Dog', icon: '🌭', desc: 'Hot dogs especiais, tradicionais e prensados' },
    { name: 'Porções', icon: '🍟', desc: 'Batatas fritas, anéis de cebola e petiscos' },
    { name: 'Pasteis', icon: '🥟', desc: 'Pastéis fritos crocantes doces e salgados' },
    { name: 'Salgados', icon: '🥐', desc: 'Coxinhas, kibes, empadas e salgados variados' },
    { name: 'Refrigerantes', icon: '🥤', desc: 'Refrigerantes em lata, garrafa e zero' },
    { name: 'Sucos', icon: '🧃', desc: 'Sucos naturais da fruta e polpas' },
    { name: 'Bebidas Alcóolicas', icon: '🍺', desc: 'Chopps artesanais, cervejas e drinks' }
  ];

  for (const cat of categories) {
    const { error } = await supabase.from('categories').upsert(cat, { onConflict: 'name' });
    if (error) console.error('Erro cat:', cat.name, error.message);
  }
  console.log('✅ 8 Categorias sincronizadas com sucesso!');

  // 2. Produtos
  const products = [
    {
      nome: 'Xis Bacon',
      slug: 'xis-bacon',
      categoria: 'Sanduiches',
      preco: 28.00,
      descricao: 'Se você é apaixonado por bacon, este é o hambúrguer ideal! Um suculento hambúrguer bovino de 200g servido no pão de 140g, com presunto, muita mussarela derretida, bacon crocante, molho especial exclusivo, alface e tomate fresquinhos.',
      ingredientes: JSON.stringify(['Blend 200g', 'Bacon Crocante', 'Presunto', 'Mussarela', 'Molho Especial', 'Salada']),
      imagem: '/foto.png',
      ativo: true
    },
    {
      nome: 'Smash Bacon',
      slug: 'smash-bacon',
      categoria: 'Sanduiches',
      preco: 32.90,
      descricao: 'Hambúrguer smash suculento com pão de brioche amanteigado tostado, queijo cheddar derretido e tiras crocantes de bacon.',
      ingredientes: JSON.stringify(['Pão Brioche', 'Cheddar', 'Bacon']),
      imagem: '/foto.png',
      ativo: true
    },
    {
      nome: 'Smash Burger Clássico',
      slug: 'smash-burger-classico',
      categoria: 'Sanduiches',
      preco: 28.90,
      descricao: 'Blend smash 90g, queijo cheddar derretido, picles artesanal, cebola picada e molho da casa no pão brioche.',
      ingredientes: JSON.stringify(['Blend 90g', 'Cheddar', 'Picles', 'Cebola', 'Molho Especial', 'Pão Brioche']),
      imagem: '/foto.png',
      ativo: true
    },
    {
      nome: 'Batata Volcano',
      slug: 'batata-volcano',
      categoria: 'Porções',
      preco: 24.90,
      descricao: 'Porção generosa de batatas rústicas douradas com cobertura vulcânica de cheddar cremoso e bacon crispy.',
      ingredientes: JSON.stringify(['Batata Rústica', 'Cheddar Cremoso', 'Bacon Crispy']),
      imagem: '/batata.png',
      ativo: true
    },
    {
      nome: 'Hot Dog Especial Prensado',
      slug: 'hot-dog-especial-prensado',
      categoria: 'Hot Dog',
      preco: 22.50,
      descricao: 'Duas salsichas especiais, molho de tomate caseiro, milho, ervilha, queijo ralado e batata palha prensado no capricho.',
      ingredientes: JSON.stringify(['2 Salsichas', 'Molho Artesanal', 'Milho', 'Ervilha', 'Queijo', 'Batata Palha']),
      imagem: '/foto.png',
      ativo: true
    },
    {
      nome: 'Pastel de Carne com Queijo',
      slug: 'pastel-de-carne-com-queijo',
      categoria: 'Pasteis',
      preco: 16.00,
      descricao: 'Pastel artesanal frito na hora com recheio abundante de carne moída temperada e queijo mussarela derretido.',
      ingredientes: JSON.stringify(['Massa Crocante', 'Carne Temperada', 'Mussarela']),
      imagem: '/foto.png',
      ativo: true
    },
    {
      nome: 'Coxinha de Frango com Catupiry',
      slug: 'coxinha-de-frango-com-catupiry',
      categoria: 'Salgados',
      preco: 12.00,
      descricao: 'Massa cremosa de batata dourada recheada com peito de frango desfiado e autêntico Catupiry.',
      ingredientes: JSON.stringify(['Massa de Batata', 'Frango Desfiado', 'Catupiry']),
      imagem: '/foto.png',
      ativo: true
    },
    {
      nome: 'Refrigerante Lata 350ml',
      slug: 'refrigerante-lata-350ml',
      categoria: 'Refrigerantes',
      preco: 7.00,
      descricao: 'Coca-Cola, Guaraná Antarctica, Fanta Laranja ou Sprite geladinhos.',
      ingredientes: JSON.stringify(['Lata 350ml', 'Super Gelado']),
      imagem: '/foto.png',
      ativo: true
    },
    {
      nome: 'Suco Natural de Laranja 500ml',
      slug: 'suco-natural-de-laranja-500ml',
      categoria: 'Sucos',
      preco: 11.00,
      descricao: 'Suco natural feito com laranjas frescas espremidas na hora sem conservantes.',
      ingredientes: JSON.stringify(['100% Fruta Natural', 'Gelo']),
      imagem: '/foto.png',
      ativo: true
    },
    {
      nome: 'Chopp Artesanal IPA 500ml',
      slug: 'chopp-artesanal-ipa-500ml',
      categoria: 'Bebidas Alcóolicas',
      preco: 18.00,
      descricao: 'Chopp artesanal estilo India Pale Ale com aroma cítrico marcante e colarinho cremoso.',
      ingredientes: JSON.stringify(['Malte Selecionado', 'Lúpulo Especial']),
      imagem: '/foto.png',
      ativo: true
    }
  ];

  for (const prod of products) {
    const { error } = await supabase.from('products').upsert(prod, { onConflict: 'slug' });
    if (error) console.error('Erro prod:', prod.nome, error.message);
  }
  console.log('✅ Produtos iniciais sincronizados com sucesso!');

  // 3. TV Settings
  const initialTvSettings = {
    id: 'default',
    active_tv_id: 'tv-salao',
    active_music: 'Rock',
    active_turno: 'almoco',
    ad_interval_minutes: 30,
    ad_partner_name: 'Coca-Cola',
    ad_duration_seconds: 10,
    playlists: {
      'tv-salao': [
        { id: 's-1', name: 'Xis Bacon', type: 'image', duration: 10, transition: 'fade', showPrice: true, showIngredients: true, showQr: true, themeColor: '#050508', fontFamily: 'Bebas Neue', mediaUrl: '/foto.png', price: 28.00 },
        { id: 's-2', name: 'Batata Volcano', type: 'image', duration: 7, transition: 'slide', showPrice: true, showIngredients: true, showQr: false, themeColor: '#121216', fontFamily: 'Outfit', mediaUrl: '/batata.png', price: 24.90 },
        { id: 's-3', name: 'Milk Shake', type: 'video', duration: 12, transition: 'fade', showPrice: true, showIngredients: false, showQr: false, themeColor: '#050508', fontFamily: 'Outfit', mediaUrl: '/video.mp4', price: 32.90 },
        { id: 's-4', name: 'Combo Terça Double Smash', type: 'image', duration: 8, transition: 'zoom', showPrice: true, showIngredients: false, showQr: true, themeColor: '#1C120C', fontFamily: 'Outfit', mediaUrl: '/foto.png', price: 32.90 }
      ]
    }
  };

  const { error: tvErr } = await supabase.from('tv_settings').upsert(initialTvSettings, { onConflict: 'id' });
  if (tvErr) {
    console.error('Erro TV settings:', tvErr.message);
  } else {
    console.log('✅ Configurações das TVs sincronizadas com sucesso no Supabase!');
  }

  console.log('🎉 Sincronização com Supabase concluída!');
}

seed().catch(console.error);
