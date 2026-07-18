import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Heart, Calendar, Mail } from 'lucide-react';
import { RelationshipConfig } from '../types';

interface MemoriesScreenProps {
  config: RelationshipConfig;
  onNext: () => void;
}

export default function MemoriesScreen({ config, onNext }: MemoriesScreenProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleNext = () => {
    setCurrentIndex(prev => (prev === config.memories.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? config.memories.length - 1 : prev - 1));
  };

  const currentMemory = config.memories[currentIndex] || config.memories[0];

  const pageVariants = {
    initial: (direction: number) => ({
      opacity: 0,
      scale: 0.95,
      x: direction > 0 ? 80 : -80
    }),
    animate: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    },
    exit: (direction: number) => ({
      opacity: 0,
      scale: 0.95,
      x: direction > 0 ? -80 : 80,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    })
  };

  const [direction, setDirection] = useState<number>(1);

  const triggerNext = () => {
    setDirection(1);
    handleNext();
  };

  const triggerPrev = () => {
    setDirection(-1);
    handlePrev();
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center px-4 py-8 z-10">
      
      {/* Header section */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-950/30 border border-rose-900/30 rounded-full text-rose-400 text-xs mb-3 font-mono uppercase tracking-widest glow-box-pink animate-pulse">
          <Heart className="w-3.5 h-3.5 fill-current" /> Album of Love
        </div>
        <h2 className="text-2xl font-serif text-neutral-100 tracking-wide mb-1">
          Special Memories
        </h2>
        <p className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase">
          Click arrows or swipe for more ✦
        </p>
      </div>

      {/* Main Memory Card Container */}
      <div className="relative w-full aspect-[4/5] mb-8 group">
        
        {/* Glow behind the active card */}
        <div className="absolute -inset-1 bg-gradient-to-b from-rose-950/20 to-neutral-950/40 rounded-3xl blur-lg opacity-80 pointer-events-none" />

        <AnimatePresence mode="wait" custom={direction}>
          {currentMemory && (
            <motion.div
              key={currentMemory.id}
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0 w-full h-full glass-panel border border-rose-950/35 rounded-3xl overflow-hidden p-4 flex flex-col shadow-2xl glow-box-pink justify-between"
            >
              {/* Photo Area with Polaroid/Museum style frame */}
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-900 relative shadow-inner">
                <img
                  src={currentMemory.imageUrl}
                  alt={currentMemory.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual grid Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

                {/* Sweet heart icon over the photo */}
                <div className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-rose-400">
                  <Heart className="w-3.5 h-3.5 fill-current animate-pulse" />
                </div>
              </div>

              {/* Text Description Area inside the card */}
              <div className="flex-1 flex flex-col pt-4 pb-2 px-1">
                {/* Title and Date Row */}
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-serif text-base font-bold text-neutral-100 group-hover:text-rose-300 transition-colors">
                    {currentMemory.title}
                  </h3>
                  <span className="text-[9px] font-mono font-semibold text-rose-400 bg-rose-950/35 border border-rose-900/30 px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
                    <Calendar className="w-2.5 h-2.5" />
                    {new Date(currentMemory.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                {/* Description paragraph with comfortable typography */}
                <p className="text-xs text-neutral-400 leading-relaxed overflow-y-auto max-h-24 pr-1">
                  {currentMemory.description}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Carousel Navigation Indicators Left/Right */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-4 z-20">
          <button
            onClick={triggerPrev}
            className="p-2 rounded-full bg-neutral-950/80 hover:bg-rose-950 border border-neutral-800 text-rose-400 hover:text-white transition-all shadow-lg shadow-black/50 cursor-pointer focus:outline-none"
            id="prev-memory-btn"
            title="Previous Memory"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 -right-4 z-20">
          <button
            onClick={triggerNext}
            className="p-2 rounded-full bg-neutral-950/80 hover:bg-rose-950 border border-neutral-800 text-rose-400 hover:text-white transition-all shadow-lg shadow-black/50 cursor-pointer focus:outline-none"
            id="next-memory-btn"
            title="Next Memory"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Slide dots at the bottom */}
      <div className="flex gap-2 justify-center mb-8">
        {config.memories.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1);
              setCurrentIndex(idx);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'w-5 bg-rose-500 shadow-[0_0_8px_#f43f5e]' : 'w-1.5 bg-neutral-800 hover:bg-rose-950'
            }`}
            id={`dot-${idx}`}
          />
        ))}
      </div>

      {/* Navigation to next stage: envelope unsealing */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        className="relative py-4 w-full bg-gradient-to-r from-rose-950/40 via-neutral-900 to-rose-950/40 hover:from-rose-900/30 hover:to-rose-900/30 border border-rose-500/20 hover:border-rose-500/50 text-neutral-200 hover:text-white font-sans font-medium rounded-2xl cursor-pointer transition-all duration-300 shadow-[0_0_15px_rgba(244,63,94,0.05)] focus:outline-none flex items-center justify-center gap-2 group"
        id="memories-next-btn"
      >
        <Mail className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
        <span className="tracking-wider text-xs font-bold font-mono">NEXT - UNSEAL MY LETTER</span>
      </motion.button>

    </div>
  );
}
