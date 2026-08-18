import { prisma } from './index';

async function seed() {
  console.log('Starting database seed...');

  try {
    // 1. Delete existing records to prevent duplicates on re-runs
    await prisma.media.deleteMany({});
    await prisma.agentTask.deleteMany({});
    await prisma.asset.deleteMany({});
    await prisma.campaign.deleteMany({});
    await prisma.promotion.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.restaurant.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.tvSettings.deleteMany({});
    await prisma.category.deleteMany({});

    console.log('Cleared existing database records.');

    // 2. Create default user
    const user = await prisma.user.create({
      data: {
        id: 'user-1',
        email: 'admin@burgerai.studio',
        name: 'Burger Admin',
      },
    });

    // 2b. Create default categories
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
      await prisma.category.create({
        data: cat
      });
    }
    console.log('Seeded categories.');

    // 2c. Create default TV settings
    await prisma.tvSettings.create({
      data: {
        id: 'default',
        activeTvId: 'tv-salao',
        activeMusic: 'Rock',
        activeTurno: 'almoco',
        adIntervalMinutes: 30,
        adPartnerName: 'Coca-Cola',
        adDurationSeconds: 10,
        playlists: {
          'tv-salao': [
            { id: 's-1', name: 'Xis Bacon', type: 'image', duration: 10, transition: 'fade', showPrice: true, showIngredients: true, showQr: true, themeColor: '#050508', fontFamily: 'Bebas Neue', mediaUrl: '/foto.png', price: 28.00 },
            { id: 's-2', name: 'Batata Volcano', type: 'image', duration: 7, transition: 'slide', showPrice: true, showIngredients: true, showQr: false, themeColor: '#121216', fontFamily: 'Outfit', mediaUrl: '/batata.png', price: 24.90 },
            { id: 's-3', name: 'Milk Shake', type: 'video', duration: 12, transition: 'fade', showPrice: true, showIngredients: false, showQr: false, themeColor: '#050508', fontFamily: 'Outfit', mediaUrl: '/video.mp4', price: 32.90 },
            { id: 's-4', name: 'Combo Terça Double Smash', type: 'image', duration: 8, transition: 'zoom', showPrice: true, showIngredients: false, showQr: true, themeColor: '#1C120C', fontFamily: 'Outfit', mediaUrl: '/foto.png', price: 32.90 }
          ]
        }
      }
    });
    console.log('Seeded TV settings.');
    console.log(`Created user: ${user.email}`);

    // 3. Create default restaurant
    const restaurant = await prisma.restaurant.create({
      data: {
        id: 'client-1',
        name: 'Smash & Co.',
        slug: 'smash-co',
        logoUrl: '/logo.png',
        primaryColor: '#FF5A1F',
        secondaryColor: '#FFB703',
      },
    });
    console.log(`Created restaurant: ${restaurant.name} (${restaurant.slug})`);

    // 4. Create products covering all 8 new categories
    const p0 = await prisma.product.create({
      data: {
        id: 'p0',
        nome: 'Smash Bacon Especial',
        slug: 'smash-bacon-especial',
        categoria: 'Sanduiches',
        descricao: 'Hambúrguer smash suculento com pão de brioche amanteigado tostado, queijo cheddar derretido e tiras crocantes de bacon.',
        ingredientes: JSON.stringify(['Pão Brioche', 'Cheddar', 'Bacon']),
        preco: 32.90,
        imagem: '/foto.png',
        ativo: true,
        restaurantId: restaurant.id,
      },
    });

    const p1 = await prisma.product.create({
      data: {
        id: 'p1',
        nome: 'Smash Burger Clássico',
        slug: 'smash-burger-classico',
        categoria: 'Sanduiches',
        descricao: 'Blend smash 90g, queijo cheddar derretido, picles artesanal, cebola picada e molho da casa no pão brioche.',
        ingredientes: JSON.stringify(['Blend 90g', 'Cheddar', 'Picles', 'Cebola', 'Molho Especial', 'Pão Brioche']),
        preco: 28.90,
        imagem: '/foto.png',
        ativo: true,
        restaurantId: restaurant.id,
      },
    });

    const p2 = await prisma.product.create({
      data: {
        id: 'p2',
        nome: 'Hot Dog Especial Prensado',
        slug: 'hot-dog-especial-prensado',
        categoria: 'Hot Dog',
        descricao: 'Pão de hot dog macio prensado na chapa com 2 salsichas, purê de batata artesanal, vinagrete, batata palha e maionese especial.',
        ingredientes: JSON.stringify(['Pão Especial', '2 Salsichas', 'Purê de Batata', 'Vinagrete', 'Batata Palha']),
        preco: 24.90,
        imagem: '/foto.png',
        ativo: true,
        restaurantId: restaurant.id,
      },
    });

    const p3 = await prisma.product.create({
      data: {
        id: 'p3',
        nome: 'Porção Batata Rústica Cheddar & Bacon',
        slug: 'porcao-batata-rustica-cheddar-bacon',
        categoria: 'Porções',
        descricao: '500g de batatas rústicas fritas temperadas com páprica, cobertas por generosa camada de cheddar cremoso e cubos de bacon crocante.',
        ingredientes: JSON.stringify(['Batatas Rústicas 500g', 'Cheddar Cremoso', 'Bacon em Cubos']),
        preco: 38.00,
        imagem: '/batata.png',
        ativo: true,
        restaurantId: restaurant.id,
      },
    });

    const p4 = await prisma.product.create({
      data: {
        id: 'p4',
        nome: 'Pastel de Carne com Queijo',
        slug: 'pastel-carne-com-queijo',
        categoria: 'Pasteis',
        descricao: 'Pastel artesanal frito na hora, massa crocante e sequinha, recheado com carne moída temperada e queijo mussarela derretido.',
        ingredientes: JSON.stringify(['Massa Artesanal', 'Carne Bovina Temperada', 'Mussarela']),
        preco: 16.00,
        imagem: '/foto.png',
        ativo: true,
        restaurantId: restaurant.id,
      },
    });

    const p5 = await prisma.product.create({
      data: {
        id: 'p5',
        nome: 'Coxinha Cremosa de Frango com Catupiry',
        slug: 'coxinha-cremosa-frango-catupiry',
        categoria: 'Salgados',
        descricao: 'Massa leve e dourada com casquinha crocante, recheio generoso de frango desfiado com Catupiry original.',
        ingredientes: JSON.stringify(['Massa de Batata', 'Frango Desfiado', 'Catupiry Original']),
        preco: 12.00,
        imagem: '/foto.png',
        ativo: true,
        restaurantId: restaurant.id,
      },
    });

    const p6 = await prisma.product.create({
      data: {
        id: 'p6',
        nome: 'Coca-Cola Gelada 350ml',
        slug: 'coca-cola-gelada-350ml',
        categoria: 'Refrigerantes',
        descricao: 'Refrigerante Coca-Cola em lata 350ml servido trincando de gelado com fatia de limão.',
        ingredientes: JSON.stringify(['Lata 350ml', 'Gelo', 'Limão']),
        preco: 7.50,
        imagem: '/foto.png',
        ativo: true,
        restaurantId: restaurant.id,
      },
    });

    const p7 = await prisma.product.create({
      data: {
        id: 'p7',
        nome: 'Suco Natural de Laranja 500ml',
        slug: 'suco-natural-laranja-500ml',
        categoria: 'Sucos',
        descricao: 'Suco de laranja natural feito na hora com laranjas frescas selecionadas, 100% puro.',
        ingredientes: JSON.stringify(['Laranja Fresca', 'Gelo']),
        preco: 11.90,
        imagem: '/foto.png',
        ativo: true,
        restaurantId: restaurant.id,
      },
    });

    const p8 = await prisma.product.create({
      data: {
        id: 'p8',
        nome: 'Chopp Artesanal IPA 500ml',
        slug: 'chopp-artesanal-ipa-500ml',
        categoria: 'Bebidas Alcóolicas',
        descricao: 'Chopp artesanal estilo IPA com aroma cítrico e amargor equilibrado, servido gelado.',
        ingredientes: JSON.stringify(['Chopp IPA 500ml', 'Malte & Lúpulo Selecionados']),
        preco: 18.90,
        imagem: '/foto.png',
        ativo: true,
        restaurantId: restaurant.id,
      },
    });

    console.log('Created products for all 8 categories.');

    // 5. Create promotions
    const pr1 = await prisma.promotion.create({
      data: {
        id: 'pr1',
        title: 'Combo Terça Double Smash',
        discount: 15.00,
        startDate: new Date('2026-08-01T00:00:00Z'),
        endDate: new Date('2026-08-31T23:59:59Z'),
        products: {
          connect: [{ id: 'p0' }, { id: 'p1' }],
        },
      },
    });

    const pr2 = await prisma.promotion.create({
      data: {
        id: 'pr2',
        title: 'Festival Pastel & Chopp',
        discount: 10.00,
        startDate: new Date('2026-08-07T00:00:00Z'),
        endDate: new Date('2026-08-15T23:59:59Z'),
        products: {
          connect: [{ id: 'p4' }, { id: 'p8' }],
        },
      },
    });

    console.log('Created promotions.');

    // 6. Create campaigns
    const campaign = await prisma.campaign.create({
      data: {
        id: 'c1',
        restaurantId: restaurant.id,
        name: 'Cheddar Bacon Madness',
        theme: 'Explosão de Cheddar e Bacon Defumado Crocante',
        status: 'READY',
      },
    });

    console.log(`Created campaign: ${campaign.name}`);

    // Create copywriting asset for the campaign
    await prisma.asset.create({
      data: {
        id: 'a1',
        campaignId: campaign.id,
        type: 'COPYWRITING',
        content: JSON.stringify({
          titulo: 'Smash Cheddar Volcano',
          headline: 'Uma erupção de sabor in cada mordida!',
          descricao: 'Dois blends smash de 90g grelhados na brasa, sob uma avalanche de cheddar cremoso derretido e tiras crocantes de bacon defumado em madeira de macieira.',
          cta: 'Garanta o seu com desconto exclusivo nas próximas 2 horas! Peça pelo app.',
          hashtags: ['BurgerLove', 'Foodie', 'Instafood', 'CheddarVolcano']
        }),
      },
    });

    // Create image asset for the campaign
    await prisma.asset.create({
      data: {
        id: 'a2',
        campaignId: campaign.id,
        type: 'IMAGE',
        url: '/foto.png',
        metadata: JSON.stringify({
          prompt: 'Professional gourmet burger photography, Black background, Steam, Melted cheddar, Advertising, Ultra realistic, Studio lighting, 8K, Shallow depth of field'
        }),
      },
    });

    console.log('Created campaign assets.');

    // Create agent tasks for simulation visualization
    const agents = [
      { name: 'orchestrator', status: 'COMPLETED' },
      { name: 'copywriter', status: 'COMPLETED' },
      { name: 'food-photographer', status: 'COMPLETED' },
      { name: 'image-generator', status: 'COMPLETED' },
      { name: 'video-director', status: 'COMPLETED' },
      { name: 'tv-builder', status: 'COMPLETED' },
      { name: 'social-media', status: 'COMPLETED' },
      { name: 'publisher', status: 'COMPLETED' }
    ];

    for (const agent of agents) {
      await prisma.agentTask.create({
        data: {
          campaignId: campaign.id,
          agent: agent.name,
          status: agent.status as any,
          input: JSON.stringify({}),
          output: JSON.stringify({ success: true }),
        },
      });
    }

    console.log('Created simulation agent tasks.');
    console.log('Database seeding finished successfully! 🎉');
  } catch (error) {
    console.error('Failed to seed database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
