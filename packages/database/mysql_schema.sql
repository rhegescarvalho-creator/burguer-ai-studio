-- ==========================================
-- BURGER AI STUDIO - SCHEMA MYSQL / MARIADB
-- Compatível com phpMyAdmin, cPanel, Hostinger
-- ==========================================

-- 1. Tabela de Categorias
CREATE TABLE IF NOT EXISTS `categories` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `icon` VARCHAR(50) NOT NULL DEFAULT '🍔',
  `desc` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabela de Produtos
CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(36) NOT NULL,
  `nome` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `categoria` VARCHAR(100) NOT NULL,
  `preco` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `descricao` TEXT NULL,
  `ingredientes` LONGTEXT NULL,
  `ativo` TINYINT(1) DEFAULT 1,
  `imagem` VARCHAR(500) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabela de Configurações das TVs (Playlists, Grade e Turnos)
CREATE TABLE IF NOT EXISTS `tv_settings` (
  `id` VARCHAR(50) NOT NULL DEFAULT 'default',
  `playlists` LONGTEXT NOT NULL,
  `active_tv_id` VARCHAR(50) NOT NULL DEFAULT 'tv-salao',
  `active_music` VARCHAR(50) NOT NULL DEFAULT 'Rock',
  `active_turno` VARCHAR(50) NOT NULL DEFAULT 'almoco',
  `ad_interval_minutes` INT NOT NULL DEFAULT 30,
  `ad_partner_name` VARCHAR(100) NOT NULL DEFAULT 'Coca-Cola',
  `ad_duration_seconds` INT NOT NULL DEFAULT 10,
  `active_client_config` LONGTEXT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabela de Promoções
CREATE TABLE IF NOT EXISTS `promotions` (
  `id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `discount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `start_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `end_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- DADOS INICIAIS (CATEGORIAS E PRODUTOS)
-- ==========================================

INSERT INTO `categories` (`id`, `name`, `icon`, `desc`) VALUES
('cat-1', 'Sanduiches', '🍔', 'Sanduíches, smash e hambúrgueres artesanais'),
('cat-2', 'Hot Dog', '🌭', 'Hot dogs especiais, tradicionais e prensados'),
('cat-3', 'Porções', '🍟', 'Batatas fritas, anéis de cebola e petiscos'),
('cat-4', 'Pasteis', '🥟', 'Pastéis fritos crocantes doces e salgados'),
('cat-5', 'Salgados', '🥐', 'Coxinhas, kibes, empadas e salgados variados'),
('cat-6', 'Refrigerantes', '🥤', 'Refrigerantes em lata, garrafa e zero'),
('cat-7', 'Sucos', '🧃', 'Sucos naturais da fruta e polpas'),
('cat-8', 'Bebidas Alcóolicas', '🍺', 'Chopps artesanais, cervejas e drinks')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

INSERT INTO `products` (`id`, `nome`, `slug`, `categoria`, `preco`, `descricao`, `ingredientes`, `ativo`, `imagem`) VALUES
('prod-1', 'Xis Bacon', 'xis-bacon', 'Sanduiches', 28.00, 'Um suculento hambúrguer bovino de 200g servido no pão de 140g, com presunto, muita mussarela derretida, bacon crocante, molho especial exclusivo, alface e tomate.', '["Blend 200g","Bacon Crocante","Presunto","Mussarela","Molho Especial","Salada"]', 1, '/foto.png'),
('prod-2', 'Smash Bacon', 'smash-bacon', 'Sanduiches', 32.90, 'Hambúrguer smash suculento com pão de brioche amanteigado tostado, queijo cheddar derretido e tiras crocantes de bacon.', '["Pão Brioche","Cheddar","Bacon"]', 1, '/foto.png'),
('prod-3', 'Smash Burger Clássico', 'smash-burger-classico', 'Sanduiches', 28.90, 'Blend smash 90g, queijo cheddar derretido, picles artesanal, cebola picada e molho da casa no pão brioche.', '["Blend 90g","Cheddar","Picles","Cebola","Molho Especial","Pão Brioche"]', 1, '/foto.png'),
('prod-4', 'Batata Volcano', 'batata-volcano', 'Porções', 24.90, 'Porção generosa de batatas rústicas douradas com cobertura vulcânica de cheddar cremoso e bacon crispy.', '["Batata Rústica","Cheddar Cremoso","Bacon Crispy"]', 1, '/batata.png'),
('prod-5', 'Hot Dog Especial Prensado', 'hot-dog-especial-prensado', 'Hot Dog', 22.50, 'Duas salsichas especiais, molho de tomate caseiro, milho, ervilha, queijo ralado e batata palha prensado no capricho.', '["2 Salsichas","Molho Artesanal","Milho","Ervilha","Queijo","Batata Palha"]', 1, '/foto.png'),
('prod-6', 'Pastel de Carne com Queijo', 'pastel-de-carne-com-queijo', 'Pasteis', 16.00, 'Pastel artesanal frito na hora com recheio abundante de carne moída temperada e queijo mussarela derretido.', '["Massa Crocante","Carne Temperada","Mussarela"]', 1, '/foto.png'),
('prod-7', 'Coxinha de Frango com Catupiry', 'coxinha-de-frango-com-catupiry', 'Salgados', 12.00, 'Massa cremosa de batata dourada recheada com peito de frango desfiado e autêntico Catupiry.', '["Massa de Batata","Frango Desfiado","Catupiry"]', 1, '/foto.png'),
('prod-8', 'Refrigerante Lata 350ml', 'refrigerante-lata-350ml', 'Refrigerantes', 7.00, 'Coca-Cola, Guaraná Antarctica, Fanta Laranja ou Sprite geladinhos.', '["Lata 350ml","Super Gelado"]', 1, '/foto.png'),
('prod-9', 'Suco Natural de Laranja 500ml', 'suco-natural-de-laranja-500ml', 'Sucos', 11.00, 'Suco natural feito com laranjas frescas espremidas na hora sem conservantes.', '["100% Fruta Natural","Gelo"]', 1, '/foto.png'),
('prod-10', 'Chopp Artesanal IPA 500ml', 'chopp-artesanal-ipa-500ml', 'Bebidas Alcóolicas', 18.00, 'Chopp artesanal estilo India Pale Ale com aroma cítrico marcante e colarinho cremoso.', '["Malte Selecionado","Lúpulo Especial"]', 1, '/foto.png')
ON DUPLICATE KEY UPDATE `nome` = VALUES(`nome`), `preco` = VALUES(`preco`);

INSERT INTO `tv_settings` (`id`, `playlists`, `active_tv_id`, `active_music`, `active_turno`, `ad_interval_minutes`, `ad_partner_name`, `ad_duration_seconds`) VALUES
('default', '{"tv-salao":[{"id":"s-1","name":"Xis Bacon","type":"image","duration":10,"transition":"fade","showPrice":true,"showIngredients":true,"showQr":true,"themeColor":"#050508","fontFamily":"Bebas Neue","mediaUrl":"/foto.png","price":28.00},{"id":"s-2","name":"Batata Volcano","type":"image","duration":7,"transition":"slide","showPrice":true,"showIngredients":true,"showQr":false,"themeColor":"#121216","fontFamily":"Outfit","mediaUrl":"/batata.png","price":24.90},{"id":"s-3","name":"Milk Shake","type":"video","duration":12,"transition":"fade","showPrice":true,"showIngredients":false,"showQr":false,"themeColor":"#050508","fontFamily":"Outfit","mediaUrl":"/video.mp4","price":32.90},{"id":"s-4","name":"Combo Terça Double Smash","type":"image","duration":8,"transition":"zoom","showPrice":true,"showIngredients":false,"showQr":true,"themeColor":"#1C120C","fontFamily":"Outfit","mediaUrl":"/foto.png","price":32.90}]}', 'tv-salao', 'Rock', 'almoco', 30, 'Coca-Cola', 10)
ON DUPLICATE KEY UPDATE `active_tv_id` = VALUES(`active_tv_id`);
