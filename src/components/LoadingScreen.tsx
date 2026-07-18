import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    // Fill progress bar smoothly over 2.8 seconds
    const duration = 2800; 
    const intervalTime = 40;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          // Wait a bit to experience the 100% completion before moving forward
          setTimeout(() => {
            onComplete();
          }, 300);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden p-6">
      {/* Background radial soft lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-rose-950/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative flex flex-col items-center max-w-sm w-full z-10">
        
        {/* Cute Panda SVG Drawing with Speach Bubble */}
        <div className="relative mb-8 flex flex-col items-center">
          {/* Glowing Speech Bubble "Hmm" */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="absolute -top-10 -right-6 bg-neutral-900 border border-rose-500/30 text-rose-300 font-sans font-bold text-xs px-3.5 py-1.5 rounded-2xl shadow-[0_0_15px_rgba(244,63,94,0.15)] glow-box-pink"
          >
            Hmm ❤️
            {/* Arrow */}
            <div className="absolute bottom-[-5px] left-3 w-2.5 h-2.5 bg-neutral-900 border-r border-b border-rose-500/30 rotate-45" />
          </motion.div>

          {/* SVG Panda */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-32 h-32 relative"
          >
            {/* Soft pink outer glow */}
            <div className="absolute inset-2 bg-rose-500/15 rounded-full blur-xl pointer-events-none" />
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(244,63,94,0.25)]">
              {/* Ears */}
              <circle cx="30" cy="30" r="11" fill="#171717" />
              <circle cx="70" cy="30" r="11" fill="#171717" />
              <circle cx="30" cy="30" r="6" fill="#0a0a0a" />
              <circle cx="70" cy="30" r="6" fill="#0a0a0a" />

              {/* Head */}
              <circle cx="50" cy="52" r="28" fill="#f5f5f5" />

              {/* Eye patches */}
              <ellipse cx="39" cy="50" rx="9" ry="11" fill="#171717" transform="rotate(-15 39 50)" />
              <ellipse cx="61" cy="50" rx="9" ry="11" fill="#171717" transform="rotate(15 61 50)" />

              {/* Eyes */}
              <circle cx="39" cy="48" r="3.5" fill="#ffffff" />
              <circle cx="61" cy="48" r="3.5" fill="#ffffff" />
              {/* Eye twinkles */}
              <circle cx="40" cy="47" r="1.2" fill="#000000" />
              <circle cx="62" cy="47" r="1.2" fill="#000000" />
              <circle cx="38" cy="49" r="0.8" fill="#ffffff" />
              <circle cx="60" cy="49" r="0.8" fill="#ffffff" />

              {/* Rosy blush cheeks */}
              <circle cx="28" cy="58" r="4.5" fill="#fb7185" opacity="0.65" />
              <circle cx="72" cy="58" r="4.5" fill="#fb7185" opacity="0.65" />

              {/* Snout and Cute Nose */}
              <ellipse cx="50" cy="57" rx="6" ry="4" fill="#ffffff" />
              <polygon points="47,56 53,56 50,59" fill="#171717" />

              {/* Smile line */}
              <path d="M48,60 Q50,61 52,60" stroke="#171717" strokeWidth="1.2" fill="none" strokeLinecap="round" />

              {/* Little Red Heart on Forehead or Body */}
              <path
                d="M50,71 C49,67 44,67 44,70 C44,72 50,76 50,76 C50,76 56,72 56,70 C56,67 51,67 50,71 Z"
                fill="#fb7185"
                className="heart-beat origin-center"
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              />
            </svg>
          </motion.div>
        </div>

        {/* Text Description */}
        <h2 className="text-neutral-200 font-serif text-lg tracking-widest text-center mb-1">
          Loading something special...
        </h2>
        <p className="text-[10px] text-rose-500/80 font-mono tracking-[0.2em] uppercase mb-8">
          ✦ Just For You ✦
        </p>

        {/* Glowing Progress Bar */}
        <div className="w-full max-w-[240px] h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800/60 p-[1px]">
          <motion.div
            className="h-full bg-gradient-to-r from-rose-600 via-red-500 to-rose-600 rounded-full shadow-[0_0_10px_#fb7185]"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>

        {/* Loading percentage text */}
        <span className="text-[11px] font-mono text-neutral-500 mt-2">
          {Math.min(100, Math.floor(progress))}%
        </span>
      </div>
    </div>
  );
}
