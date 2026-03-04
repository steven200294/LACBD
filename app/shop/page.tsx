'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logoSrc from '../Logo/logo.jpeg';
import Aurora from '../components/Aurora';
import SimpleCounter from '../components/SimpleCounter';
import { FaTelegram } from 'react-icons/fa';
import { supabase } from '../lib/supabase';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  media_url?: string;
  media_type?: 'image' | 'video';
}

interface ProductMedia {
  id: number;
  product_id: number;
  media_url: string;
  media_type: 'image' | 'video';
  position: number;
}

interface ProductVariation {
  id: number;
  product_id: number;
  title: string;
  price: number;
  position: number;
}

const categories = ["Tous", "WEED 🍀", "HASH 🍫", "PHARMACIE 💊⚕️", "AUTRES 🪄"];

export default function ShopPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [singleCol, setSingleCol] = useState(false);
  const [allMedia, setAllMedia] = useState<Record<number, ProductMedia[]>>({});
  const [allVariations, setAllVariations] = useState<Record<number, ProductVariation[]>>({});
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [sessionValid, setSessionValid] = useState(false);

  // Auto-slide galerie toutes les 3 secondes
  useEffect(() => {
    if (!detailProduct) return;
    const gallery = getGalleryItems(detailProduct);
    if (gallery.length <= 1) return;
    const interval = setInterval(() => {
      setGalleryIndex(prev => (prev + 1) % gallery.length);
    }, 3000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailProduct, allMedia]);

  const fetchProducts = useCallback(async () => {
    const { data } = await supabase.from('products').select('*').order('id');
    if (data) setProducts(data);
  }, []);

  const fetchMedia = useCallback(async () => {
    const { data } = await supabase.from('product_media').select('*').order('position');
    if (data) {
      const grouped: Record<number, ProductMedia[]> = {};
      data.forEach((m: ProductMedia) => {
        if (!grouped[m.product_id]) grouped[m.product_id] = [];
        grouped[m.product_id].push(m);
      });
      setAllMedia(grouped);
    }
  }, []);

  const fetchVariations = useCallback(async () => {
    const { data } = await supabase.from('product_variations').select('*').order('position');
    if (data) {
      const grouped: Record<number, ProductVariation[]> = {};
      data.forEach((v: ProductVariation) => {
        if (!grouped[v.product_id]) grouped[v.product_id] = [];
        grouped[v.product_id].push(v);
      });
      setAllVariations(grouped);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchMedia();
    fetchVariations();
  }, [fetchProducts, fetchMedia, fetchVariations]);

  // Vérification de session côté Supabase
  useEffect(() => {
    async function verifySession() {
      const code = sessionStorage.getItem('session_code');
      const expiresAt = sessionStorage.getItem('session_expires_at');

      if (!code || !expiresAt) {
        router.push('/home');
        return;
      }

      // Vérifier que le code existe encore en base
      const { data } = await supabase
        .from('passwords')
        .select('id, created_at')
        .eq('code', code)
        .limit(1);

      if (!data || data.length === 0) {
        // Code supprimé ou inexistant
        sessionStorage.removeItem('session_code');
        sessionStorage.removeItem('session_expires_at');
        router.push('/home');
        return;
      }

      // Vérifier expiration réelle depuis la DB
      const createdAt = new Date(data[0].created_at).getTime();
      const realExpiresAt = createdAt + 24 * 60 * 60 * 1000;
      if (Date.now() >= realExpiresAt) {
        sessionStorage.removeItem('session_code');
        sessionStorage.removeItem('session_expires_at');
        router.push('/home');
        return;
      }

      // Mettre à jour l'expiration réelle
      sessionStorage.setItem('session_expires_at', realExpiresAt.toString());
      setSessionValid(true);
    }

    verifySession();
  }, [router]);

  // Timer countdown
  useEffect(() => {
    if (!sessionValid) return;
    const expiresAt = sessionStorage.getItem('session_expires_at');
    if (!expiresAt) return;

    const calcTimeLeft = () => {
      const remaining = Math.max(0, Math.floor((parseInt(expiresAt) - Date.now()) / 1000));
      return remaining;
    };

    setTimeLeft(calcTimeLeft());

    const timer = setInterval(() => {
      const remaining = calcTimeLeft();
      setTimeLeft(remaining);
      if (remaining <= 0) {
        sessionStorage.removeItem('session_code');
        sessionStorage.removeItem('session_expires_at');
        router.push('/home');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [router, sessionValid]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "Tous" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  function openDetail(product: Product) {
    setDetailProduct(product);
    setGalleryIndex(0);
  }

  // Build gallery items for a product: cover + product_media
  function getGalleryItems(product: Product): { url: string; type: 'image' | 'video' }[] {
    const items: { url: string; type: 'image' | 'video' }[] = [];
    if (product.media_url) {
      items.push({ url: product.media_url, type: product.media_type || 'image' });
    }
    const extra = allMedia[product.id] || [];
    extra.forEach(m => {
      // Avoid duplicate with cover
      if (m.media_url !== product.media_url) {
        items.push({ url: m.media_url, type: m.media_type });
      }
    });
    return items;
  }

  // Écran noir pendant la vérification (empêche de voir le contenu)
  if (!sessionValid) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full">
      {/* Fond noir */}
      <div className="absolute inset-0 bg-black"></div>

      {/* Aurora background */}
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={["#ec4899", "#d946ef", "#7c3aed"]}
          blend={0.5}
          amplitude={1.0}
          speed={1}
        />
      </div>

      {/* Voile violet transparent */}
      <div className="absolute inset-0 bg-purple-500/10"></div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b-2 border-pink-500/50 shadow-[0_4px_30px_rgba(236,72,153,0.25)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-24">

            {/* Logo / Brand */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/home')}
                className="group flex items-center justify-center w-14 h-14 rounded-xl bg-pink-500/10 border border-pink-500/30 hover:bg-pink-500/20 hover:border-pink-500/60 transition-all shadow-[0_0_10px_rgba(236,72,153,0.15)]"
                aria-label="Retour"
              >
                <svg className="w-7 h-7 text-pink-400 group-hover:text-pink-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-pink-500/50 shadow-[0_0_16px_rgba(236,72,153,0.5)]">
                <Image src={logoSrc} alt="Arai Farmers" className="w-full h-full object-cover" />
              </div>
              <a
                href="https://t.me/wolfdrop31"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-14 h-14 rounded-xl bg-pink-500/10 border border-pink-500/30 hover:bg-pink-500/20 hover:border-pink-500/60 transition-all shadow-[0_0_10px_rgba(236,72,153,0.15)]"
                aria-label="Telegram"
              >
                <FaTelegram className="w-9 h-9 text-pink-400" />
              </a>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 bg-black/50 border border-pink-500/30 rounded-xl px-3 py-1.5 shadow-[0_0_15px_rgba(236,72,153,0.15)]">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse"></div>
                <span className="text-white/50 text-[10px] uppercase tracking-wider hidden sm:block">Session</span>
                <div className="flex items-center gap-1">
                  <SimpleCounter
                    value={Math.floor(timeLeft / 3600)}
                    fontSize={18}
                    textColor="#ec4899"
                    fontWeight={900}
                  />
                  <span className="text-pink-500 font-bold text-sm">:</span>
                  <SimpleCounter
                    value={Math.floor((timeLeft % 3600) / 60)}
                    fontSize={18}
                    textColor="#ec4899"
                    fontWeight={900}
                  />
                  <span className="text-pink-500 font-bold text-sm">:</span>
                  <SimpleCounter
                    value={timeLeft % 60}
                    fontSize={18}
                    textColor="#ec4899"
                    fontWeight={900}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Second Header - Marquee */}
      <div className="fixed top-16 sm:top-20 left-0 right-0 z-40 bg-black/60 backdrop-blur-md border-b border-pink-500/30 overflow-hidden">
        <div className="flex items-center h-16 sm:h-20 overflow-hidden">
          <div className="animate-marquee flex whitespace-nowrap">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="text-pink-400 font-semibold text-sm sm:text-base mx-10 shrink-0">
                🚚 LIVRAISON PARTOUT EN HAUTE-GARONNE 🚚
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 40s linear infinite;
        }
      `}</style>

      {/* Contenu au premier plan */}
      <main className="relative z-10 min-h-screen px-4 pt-36 sm:pt-40 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Filtres et recherche */}
          <div className="mb-8">
            <div className="bg-black/60 backdrop-blur-md border border-pink-500/30 rounded-2xl p-4 sm:p-5 shadow-[0_0_30px_rgba(236,72,153,0.2),inset_0_0_20px_rgba(236,72,153,0.05)]">
              {/* Barre de recherche */}
              <div className="relative mb-4">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-black/50 border border-pink-500/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-pink-500/60 transition-colors"
                />
              </div>

              {/* Séparateur */}
              <div className="h-px bg-pink-500/10 mb-4" />

              {/* Catégories */}
              <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2">
                <button
                  onClick={() => setSingleCol(!singleCol)}
                  className="sm:hidden flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-black/40 border border-pink-500/20 hover:border-pink-500/50 transition-all text-pink-400 font-semibold text-sm"
                  aria-label="Changer l'affichage"
                >
                  {singleCol ? (
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="5" rx="1"/><rect x="3" y="10" width="18" height="5" rx="1"/><rect x="3" y="17" width="18" height="5" rx="1"/>
                    </svg>
                  )}
                  {singleCol ? '2 col' : '1 col'}
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all text-center ${
                      selectedCategory === category
                        ? 'bg-pink-500 text-black shadow-[0_0_15px_rgba(236,72,153,0.5)]'
                        : 'bg-black/40 text-white/70 border border-pink-500/20 hover:border-pink-500/50 hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grille de produits */}
          <div className={`grid gap-2 sm:gap-4 ${singleCol ? 'grid-cols-1' : 'grid-cols-2'} sm:grid-cols-2 lg:grid-cols-4`}>
            {filteredProducts.map((product) => {
              const variations = allVariations[product.id] || [];
              const mediaCount = (allMedia[product.id]?.length || 0) + (product.media_url ? 1 : 0);

              return (
                <div
                  key={product.id}
                  className="bg-black/60 backdrop-blur-md border border-pink-500/50 sm:border-2 rounded-lg sm:rounded-xl p-2 sm:p-4 hover:border-pink-500/80 transition-all shadow-[0_0_30px_rgba(236,72,153,0.3),0_0_60px_rgba(236,72,153,0.2),inset_0_0_20px_rgba(236,72,153,0.1)] hover:shadow-[0_0_40px_rgba(236,72,153,0.4),0_0_80px_rgba(236,72,153,0.3),inset_0_0_30px_rgba(236,72,153,0.15)] flex flex-col"
                >
                  {/* Image du produit */}
                  <div className="aspect-square bg-black/40 rounded-md sm:rounded-lg mb-2 sm:mb-3 overflow-hidden border border-pink-500/30 sm:border-2 relative">
                    {product.media_url ? (
                      product.media_type === 'video' ? (
                        <video src={product.media_url} className="w-full h-full object-cover" muted autoPlay loop playsInline />
                      ) : (
                        <img src={product.media_url} alt={product.name} className="w-full h-full object-cover" />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-pink-500/50 text-3xl sm:text-4xl">🌿</div>
                      </div>
                    )}
                    {/* Badge nombre de médias */}
                    {mediaCount > 1 && (
                      <div className="absolute top-1.5 right-1.5 bg-black/70 border border-pink-500/30 rounded-full px-1.5 py-0.5 flex items-center gap-1">
                        <svg className="w-2.5 h-2.5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-[9px] text-pink-400 font-bold">{mediaCount}</span>
                      </div>
                    )}
                  </div>

                  {/* Informations du produit */}
                  <div className="space-y-1 sm:space-y-2 flex-1 flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2">
                      <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-2">
                        {product.name}
                      </h3>
                      <span className="px-1.5 sm:px-2 py-0.5 bg-pink-500/20 border border-pink-500/40 rounded text-pink-400 text-[9px] sm:text-[10px] font-semibold whitespace-nowrap self-start">
                        {product.category}
                      </span>
                    </div>

                    <p className="text-white/70 text-[10px] sm:text-xs line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex-1" />

                    <div className="pt-1.5 sm:pt-2 border-t border-pink-500/20">
                      {variations.length > 0 ? (
                        <span className="text-sm sm:text-base font-bold text-pink-400">
                          À partir de {Math.min(...variations.map(v => v.price)).toFixed(2)}€
                        </span>
                      ) : (
                        <span className="text-base sm:text-lg font-bold text-pink-400">
                          €{product.price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Bouton Voir plus */}
                    <button
                      onClick={() => openDetail(product)}
                      className="w-full py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-pink-500/15 border border-pink-500/30 text-pink-400 font-bold text-xs sm:text-sm hover:bg-pink-500/25 hover:border-pink-500/50 transition-all"
                    >
                      Voir plus
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message si aucun produit */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/60 text-lg">
                Aucun produit trouvé
              </p>
            </div>
          )}
        </div>
      </main>

      {/* ── Modal Détail Produit ── */}
      {detailProduct && (() => {
        const gallery = getGalleryItems(detailProduct);
        const variations = allVariations[detailProduct.id] || [];

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setDetailProduct(null)}>
            <div
              className="relative w-full max-w-sm mx-4 bg-black border-2 border-pink-500/50 rounded-2xl overflow-hidden max-h-[85vh] overflow-y-auto shadow-[0_0_60px_rgba(236,72,153,0.3)]"
              style={{ animation: 'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Galerie */}
              {gallery.length > 0 ? (
                <div className="relative w-full aspect-4/3 bg-black">
                  {gallery[galleryIndex].type === 'video' ? (
                    <video
                      key={gallery[galleryIndex].url}
                      src={gallery[galleryIndex].url}
                      className="w-full h-full object-cover"
                      muted autoPlay loop playsInline
                    />
                  ) : (
                    <img
                      src={gallery[galleryIndex].url}
                      alt={detailProduct.name}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Navigation galerie */}
                  {gallery.length > 1 && (
                    <>
                      <button
                        onClick={() => setGalleryIndex(prev => prev > 0 ? prev - 1 : gallery.length - 1)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setGalleryIndex(prev => prev < gallery.length - 1 ? prev + 1 : 0)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      {/* Dots */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {gallery.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setGalleryIndex(i)}
                            className={`w-2 h-2 rounded-full transition-all ${i === galleryIndex ? 'bg-pink-400 w-4' : 'bg-white/30'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Bouton fermer */}
                  <button
                    onClick={() => setDetailProduct(null)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="w-full aspect-video bg-black/40 flex items-center justify-center">
                  <span className="text-5xl">🌿</span>
                </div>
              )}

              {/* Contenu */}
              <div className="p-4">
                {/* Catégorie */}
                <span className="inline-block px-2 py-0.5 bg-pink-500/20 border border-pink-500/40 rounded text-pink-400 text-[10px] font-semibold mb-2">
                  {detailProduct.category}
                </span>

                {/* Nom */}
                <h2 className="text-base font-black text-white mb-1">{detailProduct.name}</h2>

                {/* Description */}
                <p className="text-white/70 text-xs mb-3 leading-relaxed">{detailProduct.description}</p>

                {/* Séparateur */}
                <div className="h-px bg-pink-500/20 mb-3" />

                {/* Variations de prix */}
                {variations.length > 0 ? (
                  <div className="mb-4">
                    <h3 className="text-[10px] text-pink-400/70 uppercase tracking-wide font-bold mb-2">Prix & Variations</h3>
                    <div className="space-y-1.5">
                      {variations.map(v => (
                        <div key={v.id} className="flex items-center justify-between bg-white/5 border border-pink-500/20 rounded-lg px-3 py-2">
                          <span className="text-white font-semibold text-xs">{v.title}</span>
                          <span className="text-pink-400 font-black text-sm">{v.price.toFixed(2)}€</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mb-3">
                    <span className="text-xl font-black text-pink-400">€{detailProduct.price.toFixed(2)}</span>
                  </div>
                )}

                {/* Bouton Commander via Telegram */}
                <a
                  href="https://t.me/wolfdrop31"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-linear-to-r from-pink-500 to-fuchsia-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all"
                >
                  <FaTelegram className="w-5 h-5" />
                  Commander sur Telegram
                </a>

                {/* Bouton Fermer */}
                <button
                  onClick={() => setDetailProduct(null)}
                  className="w-full py-2 mt-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 text-sm transition-all"
                >
                  Fermer
                </button>
              </div>
            </div>

            <style>{`
              @keyframes slideUp {
                0%   { opacity: 0; transform: translateY(40px) scale(0.97); }
                100% { opacity: 1; transform: translateY(0) scale(1); }
              }
            `}</style>
          </div>
        );
      })()}
    </div>
  );
}
