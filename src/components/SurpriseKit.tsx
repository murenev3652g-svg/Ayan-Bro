import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, HelpCircle, Flame, Gift, AlertCircle, RefreshCw } from 'lucide-react';

interface SurpriseKitProps {
  boyName: string;
  girlName: string;
  customWishes: string[];
}

export default function SurpriseKit({ boyName, girlName, customWishes }: SurpriseKitProps) {
  const [activeModal, setActiveModal] = useState<'bottle' | 'meter' | null>(null);

  // Wish bottle state
  const [unsealedWish, setUnsealedWish] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  // Meter state
  const [partner1, setPartner1] = useState<string>(boyName);
  const [partner2, setPartner2] = useState<string>(girlName);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [calculatedScore, setCalculatedScore] = useState<number | null>(null);
  const [verdict, setVerdict] = useState<string>('');

  const handleDrawWish = () => {
    if (customWishes.length === 0) return;
    setIsShaking(true);
    setUnsealedWish(null);

    setTimeout(() => {
      setIsShaking(false);
      const randomWish = customWishes[Math.floor(Math.random() * customWishes.length)];
      setUnsealedWish(randomWish);
    }, 1200);
  };

  const handleCalculateMatch = () => {
    if (!partner1.trim() || !partner2.trim()) return;

    setIsCalculating(true);
    setCalculatedScore(null);

    setTimeout(() => {
      setIsCalculating(false);
      // If it's Ayan and Niru (case insensitive), give 1000% love match!
      const isTrueCouple = 
        (partner1.toLowerCase().includes('ayan') && partner2.toLowerCase().includes('niru')) ||
        (partner1.toLowerCase().includes('niru') && partner2.toLowerCase().includes('ayan'));

      if (isTrueCouple) {
        setCalculatedScore(1000);
        setVerdict(`Perfect Eternal Soulmates! ❤️ The universe has written ${boyName} & ${girlName}'s names in the stars. Your bond is absolute and everlasting!`);
      } else {
        const randomScore = Math.floor(Math.random() * 25) + 75; // 75% to 99%
        setCalculatedScore(randomScore);
        setVerdict(`Amazing Connection of ${randomScore}%! But wait... did you know that Ayan & Niru actually have a 1000% Eternal Soulmate connection? Check that out! ✨`);
      }
    }, 1800);
  };

  return (
    <div className="w-full mt-6 flex flex-col items-center">
      <div className="text-center mb-4">
        <span className="text-[10px] uppercase tracking-widest font-mono text-neutral-500">✦ Click to Open Surprises ✦</span>
      </div>

      <div className="flex gap-4 justify-center w-full max-w-sm px-2">
        {/* Wish Bottle Trigger */}
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setActiveModal('bottle');
            setUnsealedWish(null);
          }}
          className="flex-1 py-3 px-4 bg-gradient-to-br from-rose-950/40 to-neutral-900 border border-rose-500/20 hover:border-rose-500/50 text-neutral-200 rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-lg transition-all focus:outline-none relative overflow-hidden group"
          id="surprise-bottle-btn"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <div className="p-2 rounded-full bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/25 transition-colors">
            <Gift className="w-5 h-5 animate-bounce" />
          </div>
          <span className="text-[11px] font-bold font-mono tracking-wider">WISH BOTTLE</span>
          <span className="text-[9px] text-neutral-500">Unseal Sweet Promises</span>
        </motion.button>

        {/* Love Match Meter Trigger */}
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setActiveModal('meter');
            setCalculatedScore(null);
          }}
          className="flex-1 py-3 px-4 bg-gradient-to-br from-rose-950/40 to-neutral-900 border border-rose-500/20 hover:border-rose-500/50 text-neutral-200 rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-lg transition-all focus:outline-none relative overflow-hidden group"
          id="surprise-meter-btn"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <div className="p-2 rounded-full bg-pink-500/10 text-pink-400 group-hover:bg-pink-500/25 transition-colors">
            <Flame className="w-5 h-5 heart-beat" />
          </div>
          <span className="text-[11px] font-bold font-mono tracking-wider">DESTINY METER</span>
          <span className="text-[9px] text-neutral-500">Calculate Love Harmony</span>
        </motion.button>
      </div>

      {/* Surprises Modal Dialogs */}
      <AnimatePresence>
        {activeModal === 'bottle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              className="relative w-full max-w-sm bg-neutral-950 border border-rose-500/20 rounded-[2rem] p-6 text-center shadow-2xl glow-box-pink"
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 p-1 rounded-xl text-neutral-500 hover:text-white hover:bg-neutral-900 transition-all cursor-pointer"
              >
                <XIcon className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-950/30 border border-rose-900/30 rounded-full text-rose-400 text-[10px] mb-4 font-mono uppercase tracking-widest animate-pulse">
                <Sparkles className="w-3 h-3" /> প্রেমের ইচ্ছা বোতল
              </div>

              <h3 className="font-serif text-lg text-neutral-200 mb-2">Love Wish Capsule Bottle 🍾</h3>
              <p className="text-xs text-neutral-500 mb-6 px-4">
                Click to shake the glowing bottle and draw a beautiful sweet promise card unsealed by Ayan!
              </p>

              {/* Shaking Bottle Visual */}
              <div className="h-44 flex flex-col items-center justify-center relative mb-6">
                <AnimatePresence mode="wait">
                  {!unsealedWish ? (
                    <motion.div
                      key="bottle"
                      animate={isShaking ? {
                        rotate: [0, -20, 20, -20, 20, -10, 10, 0],
                        scale: [1, 1.1, 1.1, 1, 1.05, 1],
                        transition: { duration: 1.1, ease: 'easeInOut' }
                      } : {}}
                      className="w-24 h-24 text-rose-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.3)] relative cursor-pointer flex items-center justify-center"
                      onClick={handleDrawWish}
                    >
                      {/* Floating glowing aura behind bottle */}
                      <div className="absolute inset-0 rounded-full bg-rose-500/10 blur-xl animate-pulse" />
                      <svg viewBox="0 0 100 120" className="w-full h-full fill-current">
                        {/* Cork cap */}
                        <rect x="44" y="10" width="12" height="10" rx="2" fill="#78350f" />
                        {/* Neck */}
                        <path d="M42,20 L58,20 L56,40 L44,40 Z" fill="rgba(244,63,94,0.2)" stroke="#f43f5e" strokeWidth="2" />
                        {/* Body of bottle */}
                        <path d="M44,40 Q30,45 30,65 L30,105 Q30,115 40,115 L60,115 Q70,115 70,105 L70,65 Q70,45 56,40 Z" fill="rgba(244,63,94,0.1)" stroke="#f43f5e" strokeWidth="2" />
                        {/* Liquid/Hearts inside */}
                        <path d="M33,85 Q40,90 50,85 Q60,80 67,85 L67,105 Q67,112 60,112 L40,112 Q33,112 33,105 Z" fill="rgba(244,63,94,0.3)" />
                        {/* Glowing heart inside bottle */}
                        <path
                          d="M50,68 C49.5,66 47,66 47,67.5 C47,68.5 50,70.5 50,70.5 C50,70.5 53,68.5 53,67.5 C53,66 50.5,66 50,68 Z"
                          fill="#ffffff"
                          className="heart-beat origin-center"
                          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                        />
                      </svg>
                    </motion.div>
                  ) : (
                    /* The Unsealed Message Capsule Card */
                    <motion.div
                      key="wish"
                      initial={{ scale: 0.5, opacity: 0, y: 30 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.5, opacity: 0, y: 30 }}
                      transition={{ type: 'spring', damping: 15 }}
                      className="bg-rose-950/15 border border-rose-500/25 p-5 rounded-2xl glow-box-pink max-w-xs mx-auto shadow-xl"
                    >
                      <Heart className="w-5 h-5 text-rose-500 mx-auto mb-2 animate-bounce fill-current" />
                      <p className="font-sans text-sm font-medium text-neutral-100 leading-relaxed italic">
                        "{unsealedWish}"
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {!unsealedWish ? (
                <button
                  onClick={handleDrawWish}
                  disabled={isShaking}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-medium text-xs tracking-wider font-mono cursor-pointer transition-all uppercase"
                >
                  {isShaking ? 'SHAKING BOTTLE...' : 'SHAKE & DRAW CAPSULE'}
                </button>
              ) : (
                <button
                  onClick={() => setUnsealedWish(null)}
                  className="w-full py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white font-mono text-xs tracking-wider cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> DRAW ANOTHER
                </button>
              )}
            </motion.div>
          </motion.div>
        )}

        {activeModal === 'meter' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              className="relative w-full max-w-sm bg-neutral-950 border border-rose-500/20 rounded-[2rem] p-6 text-center shadow-2xl glow-box-pink"
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 p-1 rounded-xl text-neutral-500 hover:text-white hover:bg-neutral-900 transition-all cursor-pointer"
              >
                <XIcon className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-950/30 border border-rose-900/30 rounded-full text-pink-400 text-[10px] mb-4 font-mono uppercase tracking-widest animate-pulse">
                <Flame className="w-3 h-3" /> ভাগ্য মিলন মিটার
              </div>

              <h3 className="font-serif text-lg text-neutral-200 mb-2">Destiny Connection Meter 💘</h3>
              <p className="text-xs text-neutral-500 mb-6 px-4">
                Enter your names to test your magical love score written in the destiny files!
              </p>

              {/* Name Input Row */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div>
                  <label className="block text-[8px] font-mono text-neutral-400 uppercase text-left mb-1 pl-1">Partner One</label>
                  <input
                    type="text"
                    value={partner1}
                    onChange={e => setPartner1(e.target.value)}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-2.5 py-2 text-xs text-white text-center focus:outline-none focus:border-rose-500/40"
                    placeholder="e.g. Ayan"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-mono text-neutral-400 uppercase text-left mb-1 pl-1">Partner Two</label>
                  <input
                    type="text"
                    value={partner2}
                    onChange={e => setPartner2(e.target.value)}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-2.5 py-2 text-xs text-white text-center focus:outline-none focus:border-rose-500/40"
                    placeholder="e.g. Niru"
                  />
                </div>
              </div>

              {/* Score output gauge */}
              <div className="h-32 flex flex-col items-center justify-center mb-6 relative">
                <AnimatePresence mode="wait">
                  {isCalculating ? (
                    <motion.div
                      key="calculating"
                      className="flex flex-col items-center"
                      animate={{ scale: [0.95, 1.05, 0.95] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <RefreshCw className="w-10 h-10 text-pink-500 animate-spin mb-3" />
                      <span className="text-xs text-neutral-400 font-mono tracking-widest animate-pulse">REORDERING STARS...</span>
                    </motion.div>
                  ) : calculatedScore !== null ? (
                    /* Result visualization */
                    <motion.div
                      key="result"
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', damping: 12 }}
                      className="flex flex-col items-center"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-500 mb-2 glow-pink"
                      >
                        {calculatedScore}%
                      </motion.div>
                      <p className="text-xs text-neutral-200 px-4 leading-relaxed italic max-h-20 overflow-y-auto">
                        "{verdict}"
                      </p>
                    </motion.div>
                  ) : (
                    /* Initial state */
                    <motion.div key="ready" className="flex flex-col items-center text-neutral-600">
                      <Heart className="w-12 h-12 stroke-[1.2] mb-1.5" />
                      <span className="text-[10px] font-mono tracking-widest uppercase">METER UNCHARGED</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {calculatedScore === null ? (
                <button
                  onClick={handleCalculateMatch}
                  disabled={isCalculating}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-medium text-xs tracking-wider font-mono cursor-pointer transition-all uppercase"
                >
                  CALCULATE DESTINY INDEX ⚡
                </button>
              ) : (
                <button
                  onClick={() => setCalculatedScore(null)}
                  className="w-full py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white font-mono text-xs tracking-wider cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> TEST ANOTHER NAME
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Help utility components
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
