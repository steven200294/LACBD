'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface SimpleCounterProps {
  value: number;
  fontSize?: number;
  textColor?: string;
  fontWeight?: number | string;
}

export default function SimpleCounter({
  value,
  fontSize = 40,
  textColor = '#22c55e',
  fontWeight = 900
}: SimpleCounterProps) {
  const formattedValue = value.toString().padStart(2, '0');

  return (
    <div
      style={{
        display: 'flex',
        gap: '4px',
        fontSize: `${fontSize}px`,
        color: textColor,
        fontWeight: fontWeight,
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1
      }}
    >
      {formattedValue.split('').map((digit, index) => (
        <div
          key={index}
          style={{
            width: '1ch',
            textAlign: 'center',
            position: 'relative',
            height: `${fontSize * 1.2}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <AnimatePresence mode="popLayout">
            <motion.span
              key={digit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 25
              }}
              style={{
                position: 'absolute',
                width: '100%',
                display: 'block'
              }}
            >
              {digit}
            </motion.span>
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
