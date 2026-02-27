'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logoSrc from '../Logo/logo.jpeg';
import Particles from '../components/Particles';
import SimpleCounter from '../components/SimpleCounter';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "CBD OIL 10%",
    price: 29.99,
    description: "Huile CBD premium 10% - 10ml",
    image: "/products/cbd-oil.jpg",
    category: "PHARMACIE 💊⚕️"
  },
  {
    id: 2,
    name: "CBD FLOWERS",
    price: 19.99,
    description: "Fleurs CBD Indoor - 5g",
    image: "/products/cbd-flower.jpg",
    category: "WEED 🍀"
  },
  {
    id: 3,
    name: "CBD HASH",
    price: 34.99,
    description: "Hash CBD artisanal - 3g",
    image: "/products/cbd-hash.jpg",
    category: "HASH 🍫"
  },
  {
    id: 4,
    name: "CBD VAPE PEN",
    price: 39.99,
    description: "Vape Pen jetable CBD 800 puffs",
    image: "/products/cbd-vape.jpg",
    category: "AUTRES 🪄"
  },
  {
    id: 5,
    name: "CBD CREAM",
    price: 34.99,
    description: "Crème CBD apaisante - 50ml",
    image: "/products/cbd-cream.jpg",
    category: "PHARMACIE 💊⚕️"
  },
  {
    id: 6,
    name: "CBD CAPSULES",
    price: 44.99,
    description: "Capsules CBD 25mg - 30 pcs",
    image: "/products/cbd-capsules.jpg",
    category: "PHARMACIE 💊⚕️"
  }
];

const categories = ["Tous", "WEED 🍀", "HASH 🍫", "PHARMACIE 💊⚕️", "AUTRES 🪄"];

export default function ShopPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeLeft, setTimeLeft] = useState(86400); // 24 heures en secondes

  const particleColors = useMemo(() => [
    '#ff00ff', '#cc44ff', '#ff44cc', '#dd00ff',
    '#ff66ff', '#bb33ff', '#ff33dd', '#ee44ff'
  ], []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "Tous" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Fond noir */}
      <div className="absolute inset-0 bg-black"></div>

      {/* Particules */}
      <div className="absolute inset-0">
        <Particles particleCount={200} particleColors={particleColors} particleBaseSize={180} />
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
                className="group flex items-center justify-center w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/30 hover:bg-pink-500/20 hover:border-pink-500/60 transition-all shadow-[0_0_10px_rgba(236,72,153,0.15)]"
                aria-label="Retour"
              >
                <svg className="w-4 h-4 text-pink-400 group-hover:text-pink-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-pink-500/50 shadow-[0_0_16px_rgba(236,72,153,0.5)]">
                <Image src={logoSrc} alt="Arai Farmers" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Timer + Déconnexion */}
            <div className="flex items-center gap-3 sm:gap-4">

              {/* Timer */}
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

              {/* Bouton Déconnexion avec glass effect */}
              <button
                onClick={() => router.push('/')}
                className="group relative flex flex-col items-center"
                aria-label="Déconnexion"
              >
                <div className="relative w-10 h-10 perspective-[200px]">
                  {/* Back panel */}
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-600 to-red-800 transition-transform duration-300 origin-bottom-right rotate-[15deg] group-hover:rotate-[25deg] group-hover:-translate-x-1 group-hover:-translate-y-1 shadow-[0.3em_-0.3em_0.5em_rgba(0,0,0,0.3)]"></span>
                  {/* Front panel */}
                  <span className="absolute inset-0 rounded-xl bg-white/15 border border-white/30 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 group-hover:translate-z-8">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </span>
                </div>
                <span className="text-white/60 text-[9px] uppercase tracking-wider mt-1 group-hover:text-red-400 transition-colors">Quitter</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Second Header */}
      <div className="fixed top-16 sm:top-20 left-0 right-0 z-40 bg-black/60 backdrop-blur-md border-b border-pink-500/30 overflow-hidden">
        <div className="flex items-center h-12 sm:h-14">
          <div className="animate-marquee whitespace-nowrap">
            <span className="text-pink-400 font-semibold text-sm sm:text-base mx-8">
              🚚 LIVRAISON PARTOUT EN ÎLE DE FRANCE OU REMISE EN MAIN PROPRE 🚚
            </span>
            <span className="text-pink-400 font-semibold text-sm sm:text-base mx-8">
              🚚 LIVRAISON PARTOUT EN ÎLE DE FRANCE OU REMISE EN MAIN PROPRE 🚚
            </span>
            <span className="text-pink-400 font-semibold text-sm sm:text-base mx-8">
              🚚 LIVRAISON PARTOUT EN ÎLE DE FRANCE OU REMISE EN MAIN PROPRE 🚚
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 20s linear infinite;
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
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-2 py-1.5 rounded-lg font-semibold text-[11px] sm:text-xs transition-all text-center truncate ${
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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-black/60 backdrop-blur-md border border-pink-500/50 sm:border-2 rounded-lg sm:rounded-xl p-2 sm:p-4 hover:border-pink-500/80 transition-all shadow-[0_0_30px_rgba(236,72,153,0.3),0_0_60px_rgba(236,72,153,0.2),inset_0_0_20px_rgba(236,72,153,0.1)] hover:shadow-[0_0_40px_rgba(236,72,153,0.4),0_0_80px_rgba(236,72,153,0.3),inset_0_0_30px_rgba(236,72,153,0.15)]"
              >
                {/* Image du produit */}
                <div className="aspect-square bg-black/40 rounded-md sm:rounded-lg mb-2 sm:mb-3 flex items-center justify-center border border-pink-500/30 sm:border-2">
                  <div className="text-pink-500/50 text-3xl sm:text-4xl">🌿</div>
                </div>

                {/* Informations du produit */}
                <div className="space-y-1 sm:space-y-2">
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

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-1.5 sm:pt-2 border-t border-pink-500/20 gap-1.5 sm:gap-0">
                    <span className="text-base sm:text-lg font-bold text-pink-400">
                      €{product.price.toFixed(2)}
                    </span>
                    <button className="w-full sm:w-auto px-2 sm:px-3 py-1 sm:py-1.5 bg-pink-500 hover:bg-pink-400 text-black font-semibold rounded-md sm:rounded-lg transition-all shadow-[0_0_15px_rgba(236,72,153,0.4)] hover:shadow-[0_0_25px_rgba(236,72,153,0.6)] text-[10px] sm:text-xs">
                      Voir détails
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
    </div>
  );
}
