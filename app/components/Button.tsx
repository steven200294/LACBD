'use client';

import { forwardRef } from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, onClick }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className="relative w-64 px-12 py-4 text-lg font-semibold text-white rounded-full
                   bg-gradient-to-r from-green-500 via-emerald-500 to-green-600
                   hover:from-green-400 hover:via-emerald-400 hover:to-green-500
                   transition-all duration-300 ease-in-out
                   shadow-[0_0_30px_rgba(34,197,94,0.6),0_0_60px_rgba(34,197,94,0.4)]
                   hover:shadow-[0_0_40px_rgba(34,197,94,0.8),0_0_80px_rgba(34,197,94,0.6)]
                   hover:scale-105
                   active:scale-95"
      >
      {/* Effet de lumière supplémentaire */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/20 via-emerald-400/20 to-green-500/20 blur-xl"></span>

        {/* Contenu du bouton */}
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
