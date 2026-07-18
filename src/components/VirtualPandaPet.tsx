import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, X } from 'lucide-react';
import { romanticSynth } from '../utils/audio';

interface VirtualPandaPetProps {
  boyName: string;
  girlName: string;
  messages: string[];
}

export default function VirtualPandaPet({ boyName, girlName, messages }: VirtualPandaPetProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(0);
  const [bounce, setBounce] = useState<boolean>(false);

  useEffect(() => {
    // Staggered bounce timer every 10 seconds to catch Niru's eye
    const interval = setInterval(() => {
      setBounce(true);
      setTimeout(() => setBounce(false), 1200);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handlePandaClick = () => {
    romanticSynth.playTouchSound();
    setBounce(true);
    setTimeout(() => setBounce(false), 800);

    if (!isOpen) {
      // Pick a message
      const randIdx = Math.floor(Math.random() * messages.length);
      setCurrentMessageIndex(randIdx);
      setIsOpen(true);
    } else {
      // Rotate message
      setCurrentMessageIndex(prev => (prev === messages.length - 1 ? 0 : prev + 1));
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      
      {/* Speech Bubble */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 15, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15, x: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="mb-3 max-w-[220px] bg-neutral-950 border border-rose-500/35 p-3.5 rounded-2xl shadow-2xl relative glow-box-pink cursor-pointer"
            onClick={handlePandaClick}
          >
            {/* Close Cross */}
            <button
              onClick={handleClose}
              className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-neutral-900 border border-rose-500/20 text-neutral-500 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>

            {/* Bubble arrow down to panda */}
            <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-neutral-950 border-r border-b border-rose-500/35 rotate-45" />

            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono font-bold tracking-wider text-rose-400 uppercase flex items-center gap-1">
                <Heart className="w-2.5 h-2.5 fill-current animate-pulse text-rose-500" /> Cutest Panda
              </span>
              <p className="text-xs text-neutral-100 leading-relaxed italic">
                "{messages[currentMessageIndex]}"
              </p>
              <span className="text-[8px] text-neutral-500 text-right mt-1 font-mono">Tap for next sweet talk ✨</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Animated Circle with SVG Panda inside */}
      <motion.button
        animate={bounce ? {
          y: [0, -18, 0, -8, 0],
          scale: [1, 1.05, 0.95, 1.02, 1]
        } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        onClick={handlePandaClick}
        className="w-14 h-14 rounded-full p-[2.5px] bg-gradient-to-tr from-rose-500/30 via-neutral-900 to-rose-500/30 border border-rose-500/30 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center relative shadow-[0_4px_20px_rgba(244,63,94,0.25)] focus:outline-none"
        id="panda-pet-floating-btn"
        title="Interactive Panda Pet"
      >
        <div className="absolute inset-0 rounded-full bg-rose-500/10 blur-xs" />
        
        {/* Chat badge */}
        {!isOpen && (
          <span className="absolute -top-1 -left-1 flex h-4 w-4 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[8px] font-bold text-white items-center justify-center">?</span>
          </span>
        )}

        <div className="w-full h-full rounded-full overflow-hidden bg-neutral-950 flex items-center justify-center relative">
          
          {/* Animated Panda Face */}
          <svg viewBox="0 0 100 100" className="w-11 h-11 drop-shadow-[0_2px_8px_rgba(244,63,94,0.1)]">
            {/* Ears (Interactive animated twitching) */}
            <g className="animate-panda-ear-l">
              <circle cx="28" cy="30" r="10" fill="#1e1b1c" />
              <circle cx="28" cy="30" r="5" fill="#f43f5e" opacity="0.1" />
            </g>
            <g className="animate-panda-ear-r">
              <circle cx="72" cy="30" r="10" fill="#1e1b1c" />
              <circle cx="72" cy="30" r="5" fill="#f43f5e" opacity="0.1" />
            </g>

            {/* Bobbing Head and Face Group */}
            <g className="animate-panda-bob">
              {/* Head Base */}
              <circle cx="50" cy="52" r="28" fill="#f5f5f5" />

              {/* Eye Patches */}
              <ellipse cx="38" cy="50" rx="9" ry="11" fill="#1e1b1c" transform="rotate(-15 38 50)" />
              <ellipse cx="62" cy="50" rx="9" ry="11" fill="#1e1b1c" transform="rotate(15 62 50)" />

              {/* Eyes with blink logic */}
              <g className="animate-panda-eye">
                {isOpen ? (
                  // Open Happy Eyes with stars/twinkles
                  <>
                    <circle cx="38" cy="48" r="3" fill="#ffffff" />
                    <path d="M59,48 Q62,45 65,48" stroke="#ffffff" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                  </>
                ) : (
                  // Cute winking/happy curved closed eyes
                  <>
                    <path d="M33,48 Q37,51 41,48" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M59,48 Q63,51 67,48" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </>
                )}
              </g>

              {/* Glowing Blush Cheeks (continuous pulse) */}
              <circle cx="26" cy="58" r="4.5" fill="#fb7185" className="animate-panda-blush" />
              <circle cx="74" cy="58" r="4.5" fill="#fb7185" className="animate-panda-blush" />

              {/* Snout & Cute Triangular Nose */}
              <ellipse cx="50" cy="57" rx="5.5" ry="3.5" fill="#ffffff" />
              <polygon points="48,55 52,55 50,58" fill="#1e1b1c" />

              {/* Sweet happy mouth */}
              <path d="M47,59 Q50,61 53,59" stroke="#1e1b1c" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            </g>
          </svg>
        </div>
      </motion.button>
    </div>
  );
}
