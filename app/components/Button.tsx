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
        className="group relative w-64 h-14 text-lg font-semibold"
      >
        {/* Back panel */}
        <span
          className="absolute inset-0 rounded-2xl transition-transform duration-300 ease-out origin-bottom-right group-hover:rotate-[7deg] group-hover:-translate-x-1 group-hover:-translate-y-1"
          style={{
            background: 'linear-gradient(to right, #22c55e, #10b981, #16a34a)',
            transform: 'rotate(4deg)',
            boxShadow: '0.4em -0.4em 0.6em rgba(0,0,0,0.3), 0 0 30px rgba(34,197,94,0.4)',
            zIndex: 1,
          }}
        />

        {/* Front glass panel */}
        <span
          className="absolute inset-0 rounded-2xl flex items-center justify-center transition-transform duration-300 ease-out group-hover:-translate-y-0.5"
          style={{
            background: 'rgba(255,255,255,0.12)',
            boxShadow: '0 0 0 1.5px rgba(255,255,255,0.25) inset, 0 0 25px rgba(34,197,94,0.3)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            zIndex: 2,
          }}
        >
          <span className="text-white font-bold tracking-widest uppercase text-sm select-none">
            {children}
          </span>
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
