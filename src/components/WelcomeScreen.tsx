import React from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { RelationshipConfig } from '../types';

interface WelcomeScreenProps {
  config: RelationshipConfig;
  onStart: () => void;
}

export default function WelcomeScreen({ config, onStart }: WelcomeScreenProps) {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden p-6">
      {/* Background ambient glowing spheres */}
      <div className="absolute top-1/4 left-1/3 w-[350px] h-[350px] bg-rose-950/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[350px] h-[350px] bg-red-950/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Main card box with animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-sm w-full glass-panel border border-rose-950/40 rounded-[32px] p-8 flex flex-col items-center text-center shadow-2xl z-10 glow-box-pink"
      >
        {/* Cute heart at top */}
        <Heart className="w-5 h-5 text-rose-500/50 mb-4 animate-pulse" />

        {/* Big Display Title */}
        <h1 className="text-3xl font-serif text-neutral-100 tracking-wide mb-8 leading-tight">
          It's Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-red-400 to-rose-400 font-bold glow-pink">
            Special Day 🎀
          </span>
        </h1>

        {/* Cozy Sleeping Character Image in glowing circle */}
        <div className="relative w-40 h-40 rounded-full p-[3px] bg-gradient-to-b from-rose-500/20 to-neutral-900 border border-rose-500/20 flex items-center justify-center mb-8 shadow-inner">
          <div className="absolute inset-0 rounded-full bg-rose-500/5 blur-md" />
          <div className="w-full h-full rounded-full overflow-hidden bg-neutral-950 flex items-center justify-center relative">
            
            {/* Sleeping Panda SVG */}
            <svg viewBox="0 0 100 100" className="w-28 h-28 opacity-90 drop-shadow-[0_4px_12px_rgba(244,63,94,0.15)]">
              {/* Sleeping zzz indicator */}
              <motion.text
                x="75"
                y="30"
                fill="#f43f5e"
                fontSize="8"
                fontWeight="bold"
                animate={{ opacity: [0.2, 1, 0.2], y: [30, 24, 30], scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                zZZ...
              </motion.text>
              <motion.text
                x="85"
                y="20"
                fill="#fb7185"
                fontSize="6"
                animate={{ opacity: [0, 0.8, 0], y: [20, 15, 20] }}
                transition={{ duration: 2.2, delay: 0.7, repeat: Infinity, ease: 'easeInOut' }}
              >
                zZ
              </motion.text>

              {/* Ears */}
              <circle cx="34" cy="40" r="9" fill="#1e1b1c" />
              <circle cx="66" cy="40" r="9" fill="#1e1b1c" />

              {/* Head */}
              <ellipse cx="50" cy="55" rx="24" ry="20" fill="#f5f5f5" />

              {/* Closed Sleeping Eye lines */}
              <path d="M34,54 Q40,58 44,54" stroke="#262626" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M56,54 Q60,58 66,54" stroke="#262626" strokeWidth="2" fill="none" strokeLinecap="round" />

              {/* Blush cheeks */}
              <circle cx="32" cy="62" r="4.5" fill="#fb7185" opacity="0.55" />
              <circle cx="68" cy="62" r="4.5" fill="#fb7185" opacity="0.55" />

              {/* Little cute nose */}
              <ellipse cx="50" cy="59" rx="3.5" ry="2" fill="#262626" />

              {/* Cute heart held in paws or blanket */}
              <rect x="25" y="65" width="50" height="20" rx="6" fill="#1e1b1c" />
              <path
                d="M50,71 C49.5,69 47,69 47,70.5 C47,71.5 50,73.5 50,73.5 C50,73.5 53,71.5 53,70.5 C53,69 50.5,69 50,71 Z"
                fill="#f43f5e"
                className="heart-beat origin-center"
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              />
            </svg>

          </div>
        </div>

        {/* Emotion helper line */}
        <p className="text-neutral-400 font-serif text-sm italic mb-8">
          "I made something special for you..."
        </p>

        {/* Action button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="relative px-8 py-3.5 w-full bg-gradient-to-r from-rose-600 via-red-600 to-rose-600 hover:from-rose-500 hover:to-red-500 text-white font-sans font-medium rounded-full cursor-pointer transition-all duration-300 shadow-[0_4px_25px_rgba(244,63,94,0.3)] focus:outline-none focus:ring-2 focus:ring-rose-500/50"
          id="welcome-start-btn"
        >
          {/* Subtle button glare glow */}
          <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 rounded-full transition-opacity duration-300 pointer-events-none" />
          <span className="flex items-center justify-center gap-2">
            START 👀
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
}
