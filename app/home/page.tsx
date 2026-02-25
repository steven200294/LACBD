'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FaInstagram, FaTiktok, FaTelegram, FaEye, FaEyeSlash } from 'react-icons/fa';
import { SiSignal } from 'react-icons/si';
import { GiPotato } from 'react-icons/gi';
import Button from '../components/Button';
import SimpleCounter from '../components/SimpleCounter';
import Particles from '../components/Particles';
import GlassIcons from '../components/GlassIcons';

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
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 font-[family-name:var(--font-farisea)]">Retrouvez-nous Sur</h2>
            <div className="bg-black/40 backdrop-blur-sm border-2 border-green-500/50 rounded-2xl px-6 sm:px-10 md:px-14 py-4 sm:py-6 md:py-8 shadow-[0_0_30px_rgba(34,197,94,0.3),0_0_60px_rgba(34,197,94,0.2),inset_0_0_20px_rgba(34,197,94,0.1)]">
              {/* Réseaux sociaux + Contact direct */}
              <GlassIcons
                className="cols-5"
                items={[
                  { icon: <FaInstagram />, color: 'purple', label: 'Instagram' },
                  { icon: <FaTiktok />, color: 'indigo', label: 'TikTok' },
                  { icon: <FaTelegram />, color: 'blue', label: 'Telegram' },
                  { icon: <GiPotato />, color: 'orange', label: 'Potato' },
                  { icon: <SiSignal />, color: 'green', label: 'Signal' },
                ]}
              />
            </div>

            {/* Séparateur "OU" avec ligne verte */}
            <div className="mt-6 sm:mt-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-green-500/50"></div>
              <span className="text-green-400 font-bold text-sm">OU</span>
              <div className="flex-1 h-px bg-green-500/50"></div>
            </div>

            {/* Box de connexion */}
            <div className="mt-6 sm:mt-8 bg-black/60 backdrop-blur-md border-2 border-green-500/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 w-full shadow-[0_0_30px_rgba(34,197,94,0.3),0_0_60px_rgba(34,197,94,0.2),inset_0_0_20px_rgba(34,197,94,0.1)]">

                {/* Icône cadenas */}
                <div className="flex justify-center mb-4">
                  <GlassIcons
                    className="cols-1"
                    items={[
                      {
                        icon: (
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1em', height: '1em' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        ),
                        color: 'dark',
                        label: 'Accès sécurisé',
                      },
                    ]}
                  />
                </div>

                {/* Titre */}
                <div className="mb-5 text-center space-y-1">
                  <p className="text-white/60 text-xs sm:text-sm uppercase tracking-widest font-semibold">Accès sécurisé</p>
                  <h3 className="text-sm sm:text-base font-semibold text-white/90 leading-relaxed">
                    Contactez le support pour obtenir votre code d'accès.
                  </h3>
                  <p className="text-white/50 text-xs">Sans celui-ci, la connexion est impossible.</p>
                </div>

                {/* Compteur */}
                <div className="mb-6 bg-black/40 border border-green-500/20 rounded-xl px-4 py-3 text-center">
                  <p className="text-white/50 text-[11px] uppercase tracking-wider mb-2">Votre code expire dans</p>
                  <div className="flex justify-center items-center gap-1 sm:gap-2">
                    <div className="flex flex-col items-center">
                      <div className="scale-75 sm:scale-90">
                        <SimpleCounter value={hours} fontSize={36} textColor="#22c55e" fontWeight={900} />
                      </div>
                      <span className="text-white/30 text-[9px] uppercase tracking-wider">heures</span>
                    </div>
                    <span className="text-green-500 font-bold text-xl mb-3">:</span>
                    <div className="flex flex-col items-center">
                      <div className="scale-75 sm:scale-90">
                        <SimpleCounter value={minutes} fontSize={36} textColor="#22c55e" fontWeight={900} />
                      </div>
                      <span className="text-white/30 text-[9px] uppercase tracking-wider">min</span>
                    </div>
                    <span className="text-green-500 font-bold text-xl mb-3">:</span>
                    <div className="flex flex-col items-center">
                      <div className="scale-75 sm:scale-90">
                        <SimpleCounter value={seconds} fontSize={36} textColor="#22c55e" fontWeight={900} />
                      </div>
                      <span className="text-white/30 text-[9px] uppercase tracking-wider">sec</span>
                    </div>
                  </div>
                </div>

                {/* Champ mot de passe */}
                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <label htmlFor="password" className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white/70 mb-2 uppercase tracking-wider">
                      <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      Mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 sm:px-5 py-3 sm:py-4 pr-12 text-sm sm:text-base bg-black/50 border-2 border-green-500/20 rounded-xl text-white focus:outline-none focus:border-green-500/60 transition-all placeholder-white/20 shadow-inner"
                        placeholder="Entrez votre code d'accès..."
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-green-400 transition-colors focus:outline-none"
                        aria-label={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                      >
                        {showPassword ? (
                          <FaEyeSlash className="w-5 h-5" />
                        ) : (
                          <FaEye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-center pt-2">
                    <div className="scale-90 sm:scale-95 md:scale-100">
                      <Button onClick={() => router.push('/shop')}>
                        SE CONNECTER
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </main>

    </div>
  );
}
