'use client';

import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import Image from 'next/image';
import logoSrc from './Logo/logo.jpeg';
import Aurora from "./components/Aurora";
import Button from "./components/Button";

export default function Home() {
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleEnter = async () => {
    const btn = buttonRef.current;
    if (!btn) {
      router.push('/home');
      return;
    }

    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const supportsVT = 'startViewTransition' in document;

    if (!supportsVT || prefersReduce) {
      router.push('/home');
      return;
    }

    const { top, left, width, height } = btn.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    );

    // @ts-ignore - startViewTransition est supporté dans les navigateurs modernes
    await document.startViewTransition(() => {
      router.push('/home');
    }).ready;

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`
        ]
      },
      {
        duration: 600,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)'
      }
    );
  };
  return (
    <div className="relative min-h-screen w-full bg-black">
      {/* Fond noir */}
      <div className="absolute inset-0 bg-black"></div>

      {/* Voile violet transparent */}
      <div className="absolute inset-0 bg-purple-500/10"></div>

      {/* Aurora en arrière-plan */}
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={["#ec4899", "#d946ef", "#7c3aed"]}
          blend={0.5}
          amplitude={1.0}
          speed={1}
        />
      </div>

      {/* Contenu au premier plan */}
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="text-center max-w-3xl">
          {/* Logo animé */}
          <div className="mb-4 sm:mb-6 flex justify-center">
            <div className="relative" style={{ animation: 'logoFloat 3s ease-in-out infinite' }}>
              {/* Anneau de glow externe */}
              <div
                className="absolute -inset-3 rounded-2xl sm:rounded-3xl"
                style={{ animation: 'logoPulse 2.5s ease-in-out infinite', background: 'radial-gradient(ellipse at center, rgba(236,72,153,0.35) 0%, transparent 70%)' }}
              />
              {/* Anneau de bordure animé */}
              <div
                className="absolute -inset-1 rounded-xl sm:rounded-2xl"
                style={{ animation: 'logoBorder 2.5s ease-in-out infinite', border: '2px solid rgba(236,72,153,0.6)', boxShadow: '0 0 20px rgba(236,72,153,0.4), inset 0 0 20px rgba(217,70,239,0.1)' }}
              />
              {/* Logo */}
              <div
                className="relative w-52 h-52 sm:w-48 sm:h-48 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-pink-500/40"
                style={{ animation: 'logoEntrance 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards', opacity: 0 }}
              >
                <Image src={logoSrc} alt="Arai Farmers" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <style>{`
            @keyframes logoEntrance {
              0%   { opacity: 0; transform: scale(0.5) translateY(20px); }
              100% { opacity: 1; transform: scale(1) translateY(0); }
            }
            @keyframes logoFloat {
              0%, 100% { transform: translateY(0px); }
              50%       { transform: translateY(-10px); }
            }
            @keyframes logoPulse {
              0%, 100% { opacity: 0.6; transform: scale(1); }
              50%       { opacity: 1;   transform: scale(1.08); }
            }
            @keyframes logoBorder {
              0%, 100% { box-shadow: 0 0 15px rgba(236,72,153,0.3), inset 0 0 15px rgba(217,70,239,0.05); }
              50%       { box-shadow: 0 0 35px rgba(236,72,153,0.7), inset 0 0 25px rgba(217,70,239,0.2); }
            }
          `}</style>

          <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 font-[family-name:var(--font-farisea)]">
            Bienvenue chez Arai Farmers
          </h1>

          <div className="text-white/90 leading-relaxed mb-4 sm:mb-6 space-y-3 sm:space-y-4">
            {/* Slogan */}
            <p className="text-sm sm:text-lg text-pink-400 max-w-2xl mx-auto font-bold">
              La qualité, la quantité, le meilleur prix
            </p>

            {/* Introduction */}
            <p className="text-sm sm:text-base text-white/95 max-w-2xl mx-auto font-bold">
              Depuis 6 ans nous proposons une large gamme de produits en provenance des 4 coins du globe 🇪🇸🇺🇸🇲🇦🇳🇱🇨🇴
            </p>

            {/* Séparateur */}
            <div className="w-16 sm:w-20 h-px bg-pink-500/50 mx-auto"></div>

            {/* Services */}
            <div className="bg-black/30 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-pink-500/20 max-w-md mx-auto text-left">
              {/* Service 31 */}
              <div className="mb-3">
                <p className="text-sm sm:text-base font-bold text-pink-300 mb-1.5">Service pour le 31 📍</p>
                <div className="ml-3 space-y-1 text-sm sm:text-sm text-white/90 font-bold">
                  <p>• Livraison</p>
                  <p>• Meet-up</p>
                </div>
              </div>

              {/* Séparateur */}
              <div className="w-full h-px bg-green-500/20 my-2"></div>

              {/* Service International */}
              <div>
                <p className="text-sm sm:text-base font-bold text-pink-300 mb-1.5">Service International 🌍</p>
                <div className="ml-3 text-sm sm:text-sm text-white/90 font-bold">
                  <p>• Envoi postal</p>
                </div>
              </div>
            </div>

            {/* Séparateur */}
            <div className="w-16 sm:w-20 h-px bg-pink-500/50 mx-auto"></div>

            {/* Conclusion */}
            <p className="text-sm sm:text-base text-white/95 max-w-2xl mx-auto font-bold italic">
              Solide, structuré, efficace. Arai Farmers garantit un service premium, une expérience inoubliable.
            </p>

            {/* Signature */}
            <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto font-bold">
              La direction ✍️
            </p>
          </div>

          {/* Bouton avec effet de lumière */}
          <Button ref={buttonRef} onClick={handleEnter}>
            ENTRER
          </Button>
        </div>
      </main>
    </div>
  );
}
