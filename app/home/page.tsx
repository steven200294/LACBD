'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FaInstagram, FaTiktok, FaTelegram, FaEye, FaEyeSlash } from 'react-icons/fa';
import { SiSignal } from 'react-icons/si';
import { GiPotato } from 'react-icons/gi';
import Button from '../components/Button';
import SimpleCounter from '../components/SimpleCounter';
import Particles from '../components/Particles';

export default function HomePage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [timeLeft, setTimeLeft] = useState(86400); // 24 heures en secondes

  const particleColors = useMemo(() => [
    '#00ff00', '#10b981', '#22c55e', '#34d399',
    '#4ade80', '#86efac', '#00ff00', '#10b981'
  ], []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

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

      {/* Contenu au premier plan */}
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div className="text-center w-full max-w-4xl">
          {/* Box horizontale - Contact réseaux sociaux */}
          <div className="inline-block w-full">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 font-[family-name:var(--font-farisea)]">Retrouvez-nous Sur</h2>
            <div className="flex flex-wrap gap-6 sm:gap-10 md:gap-14 items-center justify-center bg-black/40 backdrop-blur-sm border-2 border-green-500/50 rounded-2xl px-6 sm:px-12 md:px-24 py-6 sm:py-8 md:py-10 shadow-[0_0_30px_rgba(34,197,94,0.3),0_0_60px_rgba(34,197,94,0.2),inset_0_0_20px_rgba(34,197,94,0.1)]">
              <a href="#" className="flex flex-col items-center gap-2 sm:gap-3 text-white hover:text-green-400 transition-colors">
                <FaInstagram className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                <span className="text-xs sm:text-sm font-semibold">Instagram</span>
              </a>
              <a href="#" className="flex flex-col items-center gap-2 sm:gap-3 text-white hover:text-green-400 transition-colors">
                <FaTiktok className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                <span className="text-xs sm:text-sm font-semibold">TikTok</span>
              </a>
              <a href="#" className="flex flex-col items-center gap-2 sm:gap-3 text-white hover:text-green-400 transition-colors">
                <FaTelegram className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                <span className="text-xs sm:text-sm font-semibold">Telegram</span>
              </a>
              <a href="#" className="flex flex-col items-center gap-2 sm:gap-3 text-white hover:text-green-400 transition-colors">
                <GiPotato className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                <span className="text-xs sm:text-sm font-semibold">Potato</span>
              </a>
            </div>

            {/* Séparateur "OU" avec ligne verte */}
            <div className="mt-6 sm:mt-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-green-500/50"></div>
              <span className="text-green-400 font-bold text-sm">OU</span>
              <div className="flex-1 h-px bg-green-500/50"></div>
            </div>

            {/* Box de connexion */}
            <div className="mt-6 sm:mt-8 bg-black/60 backdrop-blur-md border-2 border-green-500/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 w-full shadow-[0_0_30px_rgba(34,197,94,0.3),0_0_60px_rgba(34,197,94,0.2),inset_0_0_20px_rgba(34,197,94,0.1)]">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-4 text-center leading-relaxed uppercase">
                  Veuillez contacter le support pour vous générer un code.<br className="hidden sm:inline" />
                  <span className="sm:hidden"> </span>Sans celui-ci, il vous est impossible de vous connecter.
                </h3>

                {/* Message et Compteur */}
                <div className="mb-6 sm:mb-8 text-center">
                  <p className="text-white/80 text-xs sm:text-sm mb-3 sm:mb-4">Votre code est valable que pendant</p>
                  <div className="flex justify-center items-center gap-1 sm:gap-2 scale-75 sm:scale-90 md:scale-100">
                    <SimpleCounter
                      value={hours}
                      fontSize={40}
                      textColor="#22c55e"
                      fontWeight={900}
                    />
                    <span className="text-2xl sm:text-3xl text-green-500 font-bold">:</span>
                    <SimpleCounter
                      value={minutes}
                      fontSize={40}
                      textColor="#22c55e"
                      fontWeight={900}
                    />
                    <span className="text-2xl sm:text-3xl text-green-500 font-bold">:</span>
                    <SimpleCounter
                      value={seconds}
                      fontSize={40}
                      textColor="#22c55e"
                      fontWeight={900}
                    />
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label htmlFor="password" className="block text-sm sm:text-base md:text-lg font-semibold text-white/90 mb-2 sm:mb-3">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 pr-12 sm:pr-14 text-sm sm:text-base md:text-lg bg-black/40 border-2 border-green-500/30 rounded-xl text-white focus:outline-none focus:border-green-500/50 transition-colors"
                        placeholder="Entrez votre mot de passe"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-green-400 transition-colors focus:outline-none"
                        aria-label={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                      >
                        {showPassword ? (
                          <FaEyeSlash className="w-5 h-5 sm:w-6 sm:h-6" />
                        ) : (
                          <FaEye className="w-5 h-5 sm:w-6 sm:h-6" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 sm:mt-8 flex justify-center">
                    <div className="scale-90 sm:scale-95 md:scale-100">
                      <Button
                        onClick={() => {
                          router.push('/shop');
                        }}
                      >
                        SE CONNECTER
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </main>

      {/* Contact direct - Signal en bas à droite */}
      <div className="absolute bottom-8 right-8 z-20">
        <div className="text-right">
          <h3 className="text-sm font-semibold text-white mb-2">Contact direct :</h3>
          <a href="#" className="inline-block bg-black/40 backdrop-blur-sm border-2 border-green-500/50 rounded-xl p-4 text-white hover:text-green-400 hover:border-green-500/50 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3),0_0_40px_rgba(34,197,94,0.2),inset_0_0_15px_rgba(34,197,94,0.1)]">
            <SiSignal size={32} />
          </a>
        </div>
      </div>
    </div>
  );
}
