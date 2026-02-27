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
                   bg-gradient-to-r from-pink-500 via-fuchsia-500 to-pink-600
                   hover:from-pink-400 hover:via-fuchsia-400 hover:to-pink-500
                   transition-all duration-300 ease-in-out
                   shadow-[0_0_30px_rgba(236,72,153,0.6),0_0_60px_rgba(236,72,153,0.4)]
                   hover:shadow-[0_0_40px_rgba(236,72,153,0.8),0_0_80px_rgba(236,72,153,0.6)]
                   hover:scale-105
                   active:scale-95"
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400/20 via-fuchsia-400/20 to-pink-500/20 blur-xl"></span>
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
