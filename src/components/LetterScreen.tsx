import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, RotateCcw, PartyPopper, Sparkles, X } from 'lucide-react';
import { RelationshipConfig } from '../types';

interface LetterScreenProps {
  config: RelationshipConfig;
  onRestart: () => void;
}

// Custom Heart & Star Particle interface for Canvas Confetti
interface ConfettiParticle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  type: 'heart' | 'star' | 'circle';
  opacity: number;
}

export default function LetterScreen({ config, onRestart }: LetterScreenProps) {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [isUnsealing, setIsUnsealing] = useState<boolean>(false);
  const [typedText, setTypedText] = useState<string>('');
  const [typewriterComplete, setTypewriterComplete] = useState<boolean>(false);
  const [showCelebrate, setShowCelebrate] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<ConfettiParticle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Typewriter effect logic
  useEffect(() => {
    if (!isOpened) {
      setTypedText('');
      setTypewriterComplete(false);
      return;
    }

    let currentIndex = 0;
    const fullText = config.letterText;
    
    // Fast-typing speed: 18ms per character
    const interval = setInterval(() => {
      setTypedText(prev => prev + fullText.charAt(currentIndex));
      currentIndex++;

      if (currentIndex >= fullText.length) {
        clearInterval(interval);
        setTypewriterComplete(true);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [isOpened, config.letterText]);

  // Canvas Confetti Particle System
  const triggerConfetti = () => {
    setShowCelebrate(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = [
      '#f43f5e', // rose-500
      '#fb7185', // rose-400
      '#fda4af', // rose-300
      '#ec4899', // pink-500
      '#f472b6', // pink-400
      '#f43f5e', // deep red-pink
      '#ef4444', // red-500
      '#ffedd5'  // warm soft white
    ];

    const particleTypes: ('heart' | 'star' | 'circle')[] = ['heart', 'star', 'circle'];

    // Generate 120 particles bursting from center and bottom
    const newParticles: ConfettiParticle[] = [];
    for (let i = 0; i < 150; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 4;
      
      newParticles.push({
        x: canvas.width / 2 + (Math.random() * 100 - 50),
        y: canvas.height * 0.7 + (Math.random() * 100 - 50),
        size: Math.random() * 14 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed - (Math.random() * 5 + 3), // lift up initially
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() * 0.1 - 0.05),
        type: particleTypes[Math.floor(Math.random() * particleTypes.length)],
        opacity: 1
      });
    }

    particlesRef.current = newParticles;

    // Animation Loop
    const drawHeart = (c: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      c.beginPath();
      const topCurveHeight = size * 0.3;
      c.moveTo(x, y + topCurveHeight);
      // Top left curve
      c.bezierCurveTo(
        x - size / 2, y - topCurveHeight, 
        x - size, y + topCurveHeight, 
        x, y + size
      );
      // Top right curve
      c.bezierCurveTo(
        x + size, y + topCurveHeight, 
        x + size / 2, y - topCurveHeight, 
        x, y + topCurveHeight
      );
      c.closePath();
      c.fill();
    };

    const drawStar = (c: CanvasRenderingContext2D, x: number, y: number, r: number, p = 5, m = 0.5) => {
      let angle = Math.PI / 2 * 3;
      let step = Math.PI / p;
      c.beginPath();
      c.moveTo(x, y - r);
      for (let i = 0; i < p; i++) {
        c.lineTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r);
        angle += step;
        c.lineTo(x + Math.cos(angle) * r * m, y + Math.sin(angle) * r * m);
        angle += step;
      }
      c.lineTo(x, y - r);
      c.closePath();
      c.fill();
    };

    const updateParticles = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Apply physics
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += 0.12; // gravity
        p.speedX *= 0.98; // air drag
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.006; // fade

        if (p.opacity <= 0 || p.y > canvas.height + 20) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.type === 'star' ? 10 : 0;

        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === 'heart') {
          drawHeart(ctx, 0, 0, p.size);
        } else if (p.type === 'star') {
          drawStar(ctx, 0, 0, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      if (particles.length > 0) {
        animationFrameRef.current = requestAnimationFrame(updateParticles);
      } else {
        setShowCelebrate(false);
      }
    };

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    updateParticles();
  };

  // Resize canvas when viewport size changes
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && showCelebrate) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [showCelebrate]);

  const handleOpenLetter = () => {
    setIsUnsealing(true);
    setTimeout(() => {
      setIsOpened(true);
      setIsUnsealing(false);
    }, 900); // Wait for envelope peel animation
  };

  const handleSkipTypewriter = () => {
    setTypedText(config.letterText);
    setTypewriterComplete(true);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden p-4">
      {/* Dynamic particles canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-50"
      />

      {/* Background ambient lighting */}
      <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-rose-950/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-red-950/15 rounded-full blur-[80px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {!isOpened ? (
          /* SECTION 1: THE ENVELOPE SEED CARD */
          <motion.div
            key="envelope"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-sm flex flex-col items-center text-center z-10"
          >
            <h2 className="text-2xl font-serif text-neutral-100 mb-2">A Letter, Just For You</h2>
            <p className="text-xs text-neutral-500 mb-10 tracking-wide">
              Tap the heart to unseal your message...
            </p>

            {/* Envelope Visual Area */}
            <div className="relative w-72 aspect-[4/3] bg-neutral-900/60 border border-rose-950/40 rounded-3xl p-4 flex flex-col items-center justify-center shadow-2xl glow-box-pink overflow-hidden">
              {/* Back triangular envelope seam shadow lines */}
              <div className="absolute inset-0 bg-gradient-to-tr from-neutral-900/40 via-transparent to-neutral-900/40 pointer-events-none" />
              
              {/* Pulsing seal wax button */}
              <motion.button
                onClick={handleOpenLetter}
                disabled={isUnsealing}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.9 }}
                animate={isUnsealing ? { rotate: [0, 15, -15, 15, 0], scale: 0.8 } : {}}
                className={`relative w-20 h-20 rounded-full bg-gradient-to-r from-rose-600 via-red-600 to-rose-600 flex items-center justify-center cursor-pointer shadow-[0_0_25px_rgba(244,63,94,0.4)] border border-rose-400/30 hover:shadow-[0_0_35px_rgba(244,63,94,0.6)] focus:outline-none z-10`}
                id="envelope-seal-btn"
              >
                {/* Heart in seal */}
                <Heart className="w-9 h-9 text-white fill-current animate-pulse" />
                <div className="absolute inset-0 rounded-full bg-white/10 scale-95 blur-xs animate-ping opacity-30" />
              </motion.button>

              {/* Tap to open tag */}
              <span className="absolute bottom-6 text-[10px] uppercase font-mono font-bold tracking-widest text-rose-400 animate-pulse">
                {isUnsealing ? 'OPENING...' : 'TAP TO OPEN'}
              </span>
            </div>
          </motion.div>
        ) : (
          /* SECTION 2: THE UNSEALED LETTER */
          <motion.div
            key="letter"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md flex flex-col items-center z-10"
          >
            {/* The Paper Scroll Card */}
            <div className="relative w-full glass-panel border border-rose-950/40 rounded-[2rem] p-6 shadow-2xl mb-6 overflow-hidden max-h-[75vh] flex flex-col glow-box-pink">
              {/* Header inside letter */}
              <div className="flex items-center justify-between border-b border-rose-950/30 pb-3 mb-4 flex-shrink-0">
                <span className="text-[10px] font-mono tracking-widest uppercase text-rose-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> From Ayan To Niru
                </span>
                <button
                  onClick={onRestart}
                  className="p-1 rounded-lg hover:bg-rose-950/30 text-neutral-500 hover:text-neutral-300 transition-colors"
                  id="close-letter-btn"
                  title="Close Letter"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Letter content area */}
              <div className="flex-1 overflow-y-auto pr-1">
                <h3 className="font-serif text-lg text-rose-300 mb-4 tracking-wide text-center">
                  {config.letterTitle}
                </h3>
                
                {/* Cursive text with typing output */}
                <p className="font-handwritten text-xl text-neutral-200 leading-relaxed whitespace-pre-wrap select-none min-h-[30vh]">
                  {typedText}
                  {!typewriterComplete && (
                    <span className="inline-block w-1.5 h-4 bg-rose-500 ml-1 animate-pulse" />
                  )}
                </p>
              </div>

              {/* Letter footer with click-to-complete */}
              {!typewriterComplete && (
                <button
                  onClick={handleSkipTypewriter}
                  className="mt-4 py-2 px-4 rounded-xl border border-neutral-800 bg-neutral-950 text-[10px] text-neutral-500 hover:text-rose-400 hover:border-rose-950 font-mono tracking-widest uppercase cursor-pointer text-center flex-shrink-0"
                  id="skip-typewriter-btn"
                >
                  Skip typing to read full 💖
                </button>
              )}
            </div>

            {/* Core Action buttons once letter is open */}
            <div className="flex flex-col gap-3 w-full">
              {typewriterComplete && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={triggerConfetti}
                  className="relative py-4 w-full bg-gradient-to-r from-rose-600 via-red-600 to-rose-600 hover:from-rose-500 hover:to-red-500 text-white font-sans font-medium rounded-2xl cursor-pointer transition-all duration-300 shadow-[0_4px_25px_rgba(244,63,94,0.35)] focus:outline-none flex items-center justify-center gap-2 group"
                  id="celebrate-btn"
                >
                  <PartyPopper className="w-5 h-5 group-hover:scale-125 transition-transform" />
                  <span className="tracking-wider text-xs font-bold font-mono">CELEBRATE ✨</span>
                </motion.button>
              )}

              <button
                onClick={onRestart}
                className="py-4 w-full bg-neutral-900 hover:bg-rose-950/20 border border-rose-950 text-neutral-400 hover:text-rose-400 font-sans font-semibold rounded-2xl cursor-pointer transition-all focus:outline-none flex items-center justify-center gap-2"
                id="restart-portal-btn"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="tracking-wider text-[11px] font-bold font-mono">RE-LOCK SURPRISE</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
