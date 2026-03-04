-- ============================================
-- TABLES POUR ARAI FARMERS
-- Exécuter dans Supabase > SQL Editor
-- ============================================

-- Table des produits
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  media_url TEXT,
  media_type TEXT CHECK (media_type IN ('image', 'video')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des mots de passe d'accès
CREATE TABLE passwords (
  id BIGSERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insérer les produits par défaut
INSERT INTO products (name, price, description, category, stock) VALUES
  ('CBD OIL 10%', 29.99, 'Huile CBD premium 10% - 10ml', 'PHARMACIE 💊⚕️', 42),
  ('CBD FLOWERS', 19.99, 'Fleurs CBD Indoor - 5g', 'WEED 🍀', 78),
  ('CBD HASH', 34.99, 'Hash CBD artisanal - 3g', 'HASH 🍫', 35),
  ('CBD VAPE PEN', 39.99, 'Vape Pen jetable CBD 800 puffs', 'AUTRES 🪄', 20),
  ('CBD CREAM', 34.99, 'Crème CBD apaisante - 50ml', 'PHARMACIE 💊⚕️', 55),
  ('CBD CAPSULES', 44.99, 'Capsules CBD 25mg - 30 pcs', 'PHARMACIE 💊⚕️', 30);

-- Activer RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE passwords ENABLE ROW LEVEL SECURITY;

-- Policies : tout le monde peut lire (anon), tout le monde peut écrire (pour l'admin)
CREATE POLICY "Lecture publique produits" ON products FOR SELECT USING (true);
CREATE POLICY "Écriture publique produits" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Modification publique produits" ON products FOR UPDATE USING (true);
CREATE POLICY "Suppression publique produits" ON products FOR DELETE USING (true);

CREATE POLICY "Lecture publique passwords" ON passwords FOR SELECT USING (true);
CREATE POLICY "Écriture publique passwords" ON passwords FOR INSERT WITH CHECK (true);
CREATE POLICY "Suppression publique passwords" ON passwords FOR DELETE USING (true);

-- Créer un bucket storage pour les médias
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

-- Policy pour upload public dans le bucket media
CREATE POLICY "Upload public media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media');
CREATE POLICY "Lecture publique media" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Suppression publique media" ON storage.objects FOR DELETE USING (bucket_id = 'media');
