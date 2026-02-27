'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logoSrc from '../Logo/logo.jpeg';
import { FaInstagram, FaTiktok, FaTelegram, FaWhatsapp, FaEye, FaEyeSlash } from 'react-icons/fa';
import { SiSignal } from 'react-icons/si';
import { GiPotato } from 'react-icons/gi';
import Button from '../components/Button';
import SimpleCounter from '../components/SimpleCounter';
import Aurora from '../components/Aurora';
import GlassIcons from '../components/GlassIcons';

export default function HomePage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [timeLeft, setTimeLeft] = useState(86400);
  const [modal, setModal] = useState<{ open: boolean; label: string; url: string } | null>(null); // 24 heures en secondes

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

      {/* Contenu au premier plan */}
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div className="text-center w-full max-w-4xl">
          {/* Box horizontale - Contact réseaux sociaux */}
          <div className="inline-block w-full">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 font-[family-name:var(--font-farisea)]">Retrouvez-nous Sur</h2>
            <div className="bg-black/40 backdrop-blur-sm border-2 border-pink-500/50 rounded-2xl px-6 sm:px-10 md:px-14 py-4 sm:py-6 md:py-8 shadow-[0_0_30px_rgba(236,72,153,0.3),0_0_60px_rgba(236,72,153,0.2),inset_0_0_20px_rgba(236,72,153,0.1)]">
              {/* Réseaux sociaux + Contact direct */}
              <GlassIcons
                className="cols-6"
                items={[
                  { icon: <FaInstagram />, color: 'purple', label: 'Instagram', onClick: () => setModal({ open: true, label: 'Instagram', url: 'https://instagram.com' }) },
                  { icon: <FaTiktok />, color: 'indigo', label: 'TikTok', onClick: () => setModal({ open: true, label: 'TikTok', url: 'https://tiktok.com' }) },
                  { icon: <FaTelegram />, color: 'blue', label: 'Telegram', onClick: () => setModal({ open: true, label: 'Telegram', url: 'https://t.me' }) },
                  { icon: <FaWhatsapp />, color: 'purple', label: 'WhatsApp', onClick: () => setModal({ open: true, label: 'WhatsApp', url: 'https://wa.me' }) },
                  { icon: <GiPotato />, color: 'orange', label: 'Potato', onClick: () => setModal({ open: true, label: 'Potato', url: 'https://potato.im' }) },
                  { icon: <SiSignal />, color: 'blue', label: 'Signal', onClick: () => setModal({ open: true, label: 'Signal', url: 'https://signal.me' }) },
                ]}
              />
            </div>

            {/* Séparateur "OU" avec ligne verte */}
            <div className="mt-6 sm:mt-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-pink-500/50"></div>
              <span className="text-pink-400 font-bold text-sm">OU</span>
              <div className="flex-1 h-px bg-pink-500/50"></div>
            </div>

            {/* Box de connexion */}
            <div className="mt-6 sm:mt-8 bg-black/60 backdrop-blur-md border-2 border-pink-500/50 rounded-2xl sm:rounded-3xl w-full overflow-hidden shadow-[0_0_30px_rgba(236,72,153,0.3),0_0_60px_rgba(236,72,153,0.2)]">

                {/* Logo bannière en haut avec texte par-dessus */}
                <div className="w-full h-72 relative">
                  <Image src={logoSrc} alt="Arai Farmers" className="w-full h-full object-cover" fill style={{ filter: 'blur(2px)' }} />
                  <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/50 to-black/90" />
                  {/* Texte centré sur l'image */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                    <div className="w-10 h-10 rounded-xl bg-black/60 border border-pink-500/30 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
                      <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <span className="text-pink-400 text-sm uppercase tracking-[0.2em] font-bold mb-2 drop-shadow-lg">Accès sécurisé</span>
                    <p className="text-white text-base font-bold text-center drop-shadow-lg">Contactez le support pour obtenir votre code d'accès.</p>
                    <p className="text-white/80 text-sm font-semibold mt-1 text-center drop-shadow-lg">Sans celui-ci, la connexion est impossible.</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-pink-500/40 shadow-[0_0_10px_rgba(236,72,153,0.6)]" />
                </div>

                {/* Contenu en dessous */}
                <div className="p-6 sm:p-8 md:p-12">

                {/* Séparateur */}
                <div className="h-px bg-pink-500/10 mb-6" />

                {/* Compteur */}
                <div className="mb-6">
                  <p className="text-white/40 text-[10px] uppercase tracking-[0.15em] text-center mb-3">Votre code expire dans</p>
                  <div className="flex justify-center items-end gap-2 sm:gap-4">
                    <div className="flex flex-col items-center bg-black/40 border border-pink-500/15 rounded-xl px-3 py-2 min-w-[64px]">
                      <SimpleCounter value={hours} fontSize={36} textColor="#ec4899" fontWeight={900} />
                      <span className="text-white/30 text-[9px] uppercase tracking-wider mt-1">heures</span>
                    </div>
                    <span className="text-pink-500/60 font-bold text-2xl pb-4">:</span>
                    <div className="flex flex-col items-center bg-black/40 border border-pink-500/15 rounded-xl px-3 py-2 min-w-[64px]">
                      <SimpleCounter value={minutes} fontSize={36} textColor="#ec4899" fontWeight={900} />
                      <span className="text-white/30 text-[9px] uppercase tracking-wider mt-1">min</span>
                    </div>
                    <span className="text-pink-500/60 font-bold text-2xl pb-4">:</span>
                    <div className="flex flex-col items-center bg-black/40 border border-pink-500/15 rounded-xl px-3 py-2 min-w-[64px]">
                      <SimpleCounter value={seconds} fontSize={36} textColor="#ec4899" fontWeight={900} />
                      <span className="text-white/30 text-[9px] uppercase tracking-wider mt-1">sec</span>
                    </div>
                  </div>
                </div>

                {/* Séparateur */}
                <div className="h-px bg-pink-500/10 mb-6" />

                {/* Champ mot de passe */}
                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <label htmlFor="password" className="flex items-center gap-2 text-sm font-bold text-white mb-2 uppercase tracking-[0.15em]">
                      <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        className="w-full px-4 py-3.5 pr-12 text-base bg-black/70 border-2 border-pink-500/50 rounded-xl text-white focus:outline-none focus:border-pink-500 focus:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all placeholder-white/50"
                        placeholder="Entrez votre code d'accès..."
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-pink-400 transition-colors focus:outline-none"
                        aria-label={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                      >
                        {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
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
                </div>{/* fin contenu z-10 */}
            </div>{/* fin login box */}
          </div>
        </div>
      </main>

      {/* Modal redirection */}
      {modal?.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setModal(null)}>
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Box */}
          <div
            className="relative z-10 bg-black/90 border-2 border-pink-500/50 rounded-2xl max-w-sm w-full overflow-hidden text-center shadow-[0_0_40px_rgba(236,72,153,0.4),inset_0_0_20px_rgba(236,72,153,0.05)]"
            style={{ animation: 'modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Logo pleine largeur en haut */}
            <div className="w-full h-48 relative">
              <Image src={logoSrc} alt="Arai Farmers" className="w-full h-full object-cover" fill />
              {/* Dégradé bas pour transition douce */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />
              {/* Glow border bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-pink-500/40 shadow-[0_0_10px_rgba(236,72,153,0.6)]" />
            </div>

            {/* Contenu */}
            <div className="px-6 pb-6 pt-4">
              <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Redirection</p>
              <h3 className="text-white font-bold text-xl mb-2">{modal.label}</h3>
              <p className="text-white/70 text-sm mb-6">
                Vous allez être redirigé vers notre page <span className="text-pink-400 font-semibold">{modal.label}</span>. Continuer ?
              </p>

              {/* Boutons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setModal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all text-sm font-semibold"
                >
                  Annuler
                </button>
                <button
                  onClick={() => { window.open(modal.url, '_blank'); setModal(null); }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all"
                >
                  Continuer →
                </button>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes modalIn {
              0%   { opacity: 0; transform: scale(0.85); }
              100% { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
