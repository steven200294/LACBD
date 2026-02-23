'use client';

import { useRouter } from 'next/navigation';
import { useRef, useMemo } from 'react';
import Particles from "./components/Particles";
import Button from "./components/Button";

export default function Home() {
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const particleColors = useMemo(() => [
    "#00ff00", // Vert vif
    "#32cd32", // Vert citron
    "#00cc66", // Vert émeraude
    "#00ff7f", // Vert printemps
    "#7fff00", // Chartreuse
    "#90ee90", // Vert clair
    "#228b22", // Vert forêt
    "#00fa9a"  // Vert menthe
  ], []);

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
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Fond noir */}
      <div className="absolute inset-0 bg-black"></div>

      {/* Voile vert transparent - très léger */}
      <div className="absolute inset-0 bg-green-500/5"></div>

      {/* Particules en arrière-plan */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={particleColors}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={180}
          moveParticlesOnHover
          alphaParticles={false}
          disableRotation={false}
          pixelRatio={1}
        />
      </div>

      {/* Contenu au premier plan */}
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="text-center max-w-3xl">
          {/* Espace pour le logo */}
          <div className="mb-4 sm:mb-6 flex justify-center">
            <div className="w-32 h-32 sm:w-48 sm:h-48 bg-black/40 backdrop-blur-sm border-2 border-green-500/30 rounded-xl sm:rounded-2xl flex items-center justify-center">
              <span className="text-green-400/50 text-xs sm:text-base">LOGO</span>
            </div>
          </div>

          <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 font-[family-name:var(--font-farisea)]">
            BIENVENUE CHEZ CBD SERVICE
          </h1>

          <div className="text-white/90 leading-relaxed mb-4 sm:mb-6 space-y-2 sm:space-y-4">
            {/* Introduction */}
            <p className="text-xs sm:text-base text-white/95 max-w-2xl mx-auto font-semibold">
              Créé en 2017, CBD SERVICE est spécialisée dans la vente de produits de haute qualité,
              avec des prix défiant toute concurrence et une fiabilité du service irréprochable.
            </p>

            {/* Séparateur */}
            <div className="w-16 sm:w-20 h-px bg-green-500/50 mx-auto"></div>

            {/* Services */}
            <div className="bg-black/30 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-4 border border-green-500/20 max-w-md mx-auto">
              <h2 className="text-xs sm:text-base font-bold text-green-300 mb-1.5 sm:mb-2 text-center">
                Nous disposons de 3 services
              </h2>

              <div className="space-y-1 sm:space-y-2 text-left text-white/90 text-[10px] sm:text-xs">
                {/* Service 1 & 2 */}
                <div className="space-y-0.5">
                  <p className="font-semibold flex items-start">
                    <span className="text-green-400 mr-1.5 text-xs sm:text-sm">•</span>
                    <span>2 services Meet-Up & Livraison</span>
                  </p>
                  <div className="ml-3 sm:ml-4 space-y-0 text-white/70 text-[10px] sm:text-[11px]">
                    <p>→ 1 basé dans le 31</p>
                    <p>→ 1 basé dans le 94</p>
                  </div>
                </div>

                {/* Séparateur entre services */}
                <div className="text-center">
                  <span className="text-green-400/60 font-bold text-[10px] sm:text-xs">&</span>
                </div>

                {/* Service 3 */}
                <div>
                  <p className="font-semibold flex items-start">
                    <span className="text-green-400 mr-1.5 text-xs sm:text-sm">•</span>
                    <span>1 service d'envoi postal international</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Séparateur */}
            <div className="w-16 sm:w-20 h-px bg-green-500/50 mx-auto"></div>

            {/* Conclusion */}
            <p className="text-xs sm:text-base text-white/95 max-w-2xl mx-auto font-semibold">
              Reconnue pour notre travail de longue date, CBD SERVICE s'appuie sur une logistique
              infaillible et une organisation rigoureuse afin de garantir une expérience sérieuse,
              rapide et efficace pour chaque client.
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
