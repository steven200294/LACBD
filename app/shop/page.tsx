'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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
    '#00ff00', '#10b981', '#22c55e', '#34d399',
    '#4ade80', '#86efac', '#00ff00', '#10b981'
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

      {/* Voile vert transparent */}
      <div className="absolute inset-0 bg-green-500/10"></div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b-2 border-green-500/50 shadow-[0_4px_20px_rgba(34,197,94,0.2)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo / Brand */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/home')}
                className="text-white hover:text-green-400 transition-colors"
                aria-label="Retour"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white font-[family-name:var(--font-farisea)]">
                CBD SERVICE
              </h1>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-4 sm:gap-6">
              {/* Compteur de déconnexion */}
              <div className="flex items-center gap-3">
                <span className="text-white/80 text-xs sm:text-sm font-semibold hidden md:block">
                  Il vous reste
                </span>
                <div className="flex items-center gap-1 scale-75 sm:scale-90 md:scale-100">
                  <SimpleCounter
                    value={Math.floor(timeLeft / 3600)}
                    fontSize={24}
                    textColor="#22c55e"
                    fontWeight={900}
                  />
                  <span className="text-lg text-green-500 font-bold">:</span>
                  <SimpleCounter
                    value={Math.floor((timeLeft % 3600) / 60)}
                    fontSize={24}
                    textColor="#22c55e"
                    fontWeight={900}
                  />
                  <span className="text-lg text-green-500 font-bold">:</span>
                  <SimpleCounter
                    value={timeLeft % 60}
                    fontSize={24}
                    textColor="#22c55e"
                    fontWeight={900}
                  />
                </div>
                <span className="text-white/80 text-xs sm:text-sm font-semibold hidden md:block">
                  avant d'être déconnecté
                </span>
              </div>

              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 hover:text-green-300 border border-green-500/50 rounded-lg transition-all font-semibold text-sm sm:text-base shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] uppercase"
              >
                Déconnexion
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Second Header */}
      <div className="fixed top-16 sm:top-20 left-0 right-0 z-40 bg-black/60 backdrop-blur-md border-b border-green-500/30 overflow-hidden">
        <div className="flex items-center h-12 sm:h-14">
          <div className="animate-marquee whitespace-nowrap">
            <span className="text-green-400 font-semibold text-sm sm:text-base mx-8">
              🚚 LIVRAISON PARTOUT EN ÎLE DE FRANCE OU REMISE EN MAIN PROPRE 🚚
            </span>
            <span className="text-green-400 font-semibold text-sm sm:text-base mx-8">
              🚚 LIVRAISON PARTOUT EN ÎLE DE FRANCE OU REMISE EN MAIN PROPRE 🚚
            </span>
            <span className="text-green-400 font-semibold text-sm sm:text-base mx-8">
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
      <main className="relative z-10 min-h-screen px-4 pt-32 sm:pt-36 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Filtres et recherche */}
          <div className="mb-8">
            <div className="bg-black/60 backdrop-blur-md border-2 border-green-500/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[0_0_30px_rgba(34,197,94,0.3),0_0_60px_rgba(34,197,94,0.2),inset_0_0_20px_rgba(34,197,94,0.1)]">
              <div className="flex flex-wrap gap-3 sm:gap-4 items-center justify-center">
                {/* Barre de recherche */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <svg
                    className="w-6 h-6 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 sm:min-w-[240px] px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base bg-black/40 backdrop-blur-sm border-2 border-green-500/50 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-green-500/80 transition-colors shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                  />
                </div>

                {/* Catégories */}
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm transition-all ${
                      selectedCategory === category
                        ? 'bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.5)]'
                        : 'bg-black/40 backdrop-blur-sm text-white border-2 border-green-500/30 hover:border-green-500/50'
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
                className="bg-black/60 backdrop-blur-md border border-green-500/50 sm:border-2 rounded-lg sm:rounded-xl p-2 sm:p-4 hover:border-green-500/80 transition-all shadow-[0_0_30px_rgba(34,197,94,0.3),0_0_60px_rgba(34,197,94,0.2),inset_0_0_20px_rgba(34,197,94,0.1)] hover:shadow-[0_0_40px_rgba(34,197,94,0.4),0_0_80px_rgba(34,197,94,0.3),inset_0_0_30px_rgba(34,197,94,0.15)]"
              >
                {/* Image du produit */}
                <div className="aspect-square bg-black/40 rounded-md sm:rounded-lg mb-2 sm:mb-3 flex items-center justify-center border border-green-500/30 sm:border-2">
                  <div className="text-green-500/50 text-3xl sm:text-4xl">🌿</div>
                </div>

                {/* Informations du produit */}
                <div className="space-y-1 sm:space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-2">
                      {product.name}
                    </h3>
                    <span className="px-1.5 sm:px-2 py-0.5 bg-green-500/20 border border-green-500/40 rounded text-green-400 text-[9px] sm:text-[10px] font-semibold whitespace-nowrap self-start">
                      {product.category}
                    </span>
                  </div>

                  <p className="text-white/70 text-[10px] sm:text-xs line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-1.5 sm:pt-2 border-t border-green-500/20 gap-1.5 sm:gap-0">
                    <span className="text-base sm:text-lg font-bold text-green-400">
                      €{product.price.toFixed(2)}
                    </span>
                    <button className="w-full sm:w-auto px-2 sm:px-3 py-1 sm:py-1.5 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-md sm:rounded-lg transition-all shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_25px_rgba(34,197,94,0.6)] text-[10px] sm:text-xs">
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
