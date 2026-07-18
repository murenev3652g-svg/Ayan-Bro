import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, HelpCircle, Eye, EyeOff, Heart, Music, Volume2, VolumeX } from 'lucide-react';
import { RelationshipConfig } from '../types';
import { romanticSynth } from '../utils/audio';

interface PasscodeScreenProps {
  config: RelationshipConfig;
  onSuccess: () => void;
  musicPlaying: boolean;
  onToggleMusic: () => void;
}

export default function PasscodeScreen({
  config,
  onSuccess,
  musicPlaying,
  onToggleMusic,
}: PasscodeScreenProps) {
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Handle keypresses on physical keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (error) return;
      if (/^[0-9]$/.test(e.key)) {
        handleNumberPress(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, error]);

  const handleNumberPress = (num: string) => {
    romanticSynth.playTouchSound();
    if (code.length < 4) {
      const newCode = code + num;
      setCode(newCode);

      if (newCode.length === 4) {
        if (newCode === config.passcode) {
          // Success! Trigger short vibration or audio and exit
          setTimeout(() => {
            onSuccess();
          }, 300);
        } else {
          // Failure
          setTimeout(() => {
            setError(true);
            // Shake and clear after 800ms
            setTimeout(() => {
              setCode('');
              setError(false);
            }, 800);
          }, 250);
        }
      }
    }
  };

  const handleBackspace = () => {
    romanticSynth.playTouchSound();
    setCode(prev => prev.slice(0, -1));
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden p-4">
      {/* Dynamic Background ambient lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-rose-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[300px] h-[300px] bg-red-950/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating Sparkles/Hearts in background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-rose-500/40"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              animation: `heartbeat ${Math.random() * 3 + 2}s infinite ease-in-out`
            }}
          />
        ))}
      </div>

      {/* Music and Hint Controls in Header */}
      <div className="absolute top-6 right-6 flex items-center gap-3 z-30">
        <button
          onClick={onToggleMusic}
          className="p-3 rounded-full bg-neutral-900/70 border border-neutral-800 text-rose-400 hover:text-rose-300 hover:border-rose-500/30 transition-all focus:outline-none glow-box-pink"
          id="toggle-music"
          title="Toggle Background Music"
        >
          {musicPlaying ? <Volume2 className="w-5 h-5 heart-beat" /> : <VolumeX className="w-5 h-5 text-neutral-500" />}
        </button>
      </div>

      {/* Core Passcode Box Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm z-10"
      >
        {/* Glowing aura around card */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-rose-900/20 to-red-900/25 rounded-3xl blur-xl opacity-80 pointer-events-none" />

        <div className="relative glass-panel rounded-3xl p-6 flex flex-col items-center border border-rose-950/30 glow-box-pink">
          {/* Subtle Heart top right of container */}
          <Heart className="absolute top-4 right-4 w-4 h-4 text-rose-800/60" />

          {/* Profile Picture Frame */}
          <button
            onClick={() => setShowHint(true)}
            className="group relative w-24 h-24 rounded-full p-[3px] bg-gradient-to-r from-rose-500/30 via-red-500/40 to-rose-500/30 hover:scale-105 active:scale-95 transition-all focus:outline-none duration-300 mb-6 cursor-pointer"
            id="avatar-btn"
          >
            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-full bg-rose-500/20 blur-md group-hover:bg-rose-500/30 transition-all" />
            <div className="w-full h-full rounded-full overflow-hidden bg-neutral-950 border-2 border-black relative">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop"
                alt="Niru avatar"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-rose-950/20 group-hover:bg-transparent transition-all duration-300 flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-rose-300 opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </button>

          {/* Locked Status Header */}
          <h1 className="text-xl font-serif tracking-widest text-neutral-200 uppercase mb-1">
            Locked
          </h1>
          <p className="text-xs text-neutral-500 tracking-wide text-center mb-6">
            Hint: Click on picture to know passkey!
          </p>

          {/* Indicator Lights for Passcode */}
          <motion.div
            animate={error ? { x: [-10, 10, -10, 10, -5, 5, -2, 2, 0] } : {}}
            transition={{ duration: 0.6 }}
            className="flex gap-4 justify-center items-center h-10 mb-8"
          >
            {[...Array(4)].map((_, idx) => {
              const isActive = idx < code.length;
              return (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                    error
                      ? 'bg-red-500 shadow-[0_0_10px_#ef4444]'
                      : isActive
                      ? 'bg-rose-500 shadow-[0_0_12px_#f43f5e]'
                      : 'bg-neutral-800'
                  }`}
                />
              );
            })}
          </motion.div>

          {/* Keypad Layout */}
          <div className="grid grid-cols-3 gap-3.5 w-full max-w-[280px]">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
              <button
                key={num}
                onClick={() => handleNumberPress(num)}
                disabled={code.length >= 4 || error}
                className="w-full aspect-square flex items-center justify-center text-lg font-medium text-neutral-300 bg-neutral-900/40 hover:bg-rose-950/10 active:bg-rose-950/25 border border-neutral-800/60 hover:border-rose-500/30 rounded-2xl cursor-pointer hover:text-white transition-all duration-150 focus:outline-none"
                id={`btn-${num}`}
              >
                {num}
              </button>
            ))}
            {/* Backspace Button */}
            <button
              onClick={handleBackspace}
              disabled={code.length === 0 || error}
              className="w-full aspect-square flex items-center justify-center text-neutral-400 hover:text-rose-400 bg-transparent rounded-2xl focus:outline-none cursor-pointer transition-all disabled:opacity-20"
              id="btn-backspace"
              title="Delete last digit"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414A2 2 0 0010.828 19H20a2 2 0 002-2V7a2 2 0 00-2-2h-9.172a2 2 0 00-1.414.586L3 12z" />
              </svg>
            </button>
            {/* Zero Button */}
            <button
              onClick={() => handleNumberPress('0')}
              disabled={code.length >= 4 || error}
              className="w-full aspect-square flex items-center justify-center text-lg font-medium text-neutral-300 bg-neutral-900/40 hover:bg-rose-950/10 active:bg-rose-950/25 border border-neutral-800/60 hover:border-rose-500/30 rounded-2xl cursor-pointer hover:text-white transition-all duration-150 focus:outline-none"
              id="btn-0"
            >
              0
            </button>
            {/* Info / Hint Trigger */}
            <button
              onClick={() => setShowHint(true)}
              className="w-full aspect-square flex items-center justify-center text-neutral-400 hover:text-rose-400 bg-transparent rounded-2xl focus:outline-none cursor-pointer transition-all"
              id="btn-hint"
              title="View Hint"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Secret Passkey Hint Dialog Backdrop */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="relative w-full max-w-xs glass-panel rounded-3xl p-6 text-center border border-rose-500/20 shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden mx-auto border-2 border-rose-500/40 shadow-lg mb-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop"
                  alt="Niru"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <h3 className="font-serif text-lg text-rose-300 mb-2">My Sweet Niru 🎀</h3>
              <p className="text-neutral-300 text-sm leading-relaxed mb-6">
                "Shhh... our relationship anniversary year is the secret key. Give it a try! It's <span className="text-rose-400 font-bold tracking-wider">{config.passcode}</span>."
              </p>

              <button
                onClick={() => {
                  setShowHint(false);
                  // Auto fill or let them type
                  setCode(config.passcode);
                  setTimeout(() => {
                    onSuccess();
                  }, 400);
                }}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-medium hover:from-rose-500 hover:to-red-500 hover:shadow-lg hover:shadow-rose-500/20 cursor-pointer active:scale-95 transition-all text-xs"
                id="hint-close-btn"
              >
                Unlock Automatically 💖
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
