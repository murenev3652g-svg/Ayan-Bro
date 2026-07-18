import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Volume2, VolumeX, Heart, Edit2, RotateCcw } from 'lucide-react';
import { RelationshipConfig } from './types';
import { getRelationshipConfig, saveRelationshipConfig } from './utils/config';
import { romanticSynth } from './utils/audio';

// Import subcomponents
import PasscodeScreen from './components/PasscodeScreen';
import LoadingScreen from './components/LoadingScreen';
import WelcomeScreen from './components/WelcomeScreen';
import CounterScreen from './components/CounterScreen';
import MemoriesScreen from './components/MemoriesScreen';
import LetterScreen from './components/LetterScreen';
import AdminPanel from './components/AdminPanel';
import FloatingParticles from './components/FloatingParticles';
import VirtualPandaPet from './components/VirtualPandaPet';

type ActiveScreen = 'PASSCODE' | 'LOADING' | 'WELCOME' | 'COUNTER' | 'MEMORIES' | 'LETTER';

export default function App() {
  const [config, setConfig] = useState<RelationshipConfig>(getRelationshipConfig());
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('PASSCODE');
  const [musicPlaying, setMusicPlaying] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Sync music style configuration
  useEffect(() => {
    romanticSynth.setMusicType(config.musicType || 'musicbox');
  }, [config.musicType]);

  // Sync background music state
  useEffect(() => {
    if (musicPlaying) {
      romanticSynth.start();
    } else {
      romanticSynth.stop();
    }
  }, [musicPlaying]);

  const handleToggleMusic = () => {
    setMusicPlaying(prev => !prev);
  };

  const handlePasscodeSuccess = () => {
    setActiveScreen('LOADING');
  };

  const handleLoadingComplete = () => {
    setActiveScreen('WELCOME');
  };

  const handleWelcomeComplete = () => {
    setActiveScreen('COUNTER');
  };

  const handleCounterComplete = () => {
    setActiveScreen('MEMORIES');
  };

  const handleMemoriesComplete = () => {
    setActiveScreen('LETTER');
  };

  const handleRestart = () => {
    setActiveScreen('PASSCODE');
  };

  const handleSaveConfig = (newConfig: RelationshipConfig) => {
    setConfig(newConfig);
    saveRelationshipConfig(newConfig);
    setIsAdminOpen(false);
  };

  // Screen transition variants
  const screenVariants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 1.02, transition: { duration: 0.4, ease: 'easeIn' } }
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-neutral-100 flex flex-col items-center justify-between overflow-x-hidden">
      
      {/* Dynamic star dust sparkles in background */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-950 via-black to-black z-0" />

      {/* Premium Falling Hearts/Roses particles backdrop */}
      <FloatingParticles theme={config.floatingTheme || 'hearts'} />

      {/* Persistent Controls Overlay (only visible after unlocking) */}
      {activeScreen !== 'PASSCODE' && activeScreen !== 'LOADING' && (
        <div className="fixed top-6 right-6 flex items-center gap-3 z-30">
          
          {/* Customize Settings Toggle */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="p-3 rounded-full bg-neutral-900/70 border border-neutral-800 text-neutral-300 hover:text-rose-400 hover:border-rose-500/30 transition-all focus:outline-none glow-box-pink cursor-pointer"
            id="app-settings-btn"
            title="Configure Names & Photos"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Music Controller */}
          <button
            onClick={handleToggleMusic}
            className="p-3 rounded-full bg-neutral-900/70 border border-neutral-800 text-rose-400 hover:text-rose-300 hover:border-rose-500/30 transition-all focus:outline-none glow-box-pink cursor-pointer"
            id="app-music-btn"
            title="Toggle Romantic Music"
          >
            {musicPlaying ? (
              <Volume2 className="w-5 h-5 heart-beat" />
            ) : (
              <VolumeX className="w-5 h-5 text-neutral-500" />
            )}
          </button>
        </div>
      )}

      {/* Screen Render switch with AnimatePresence for transitions */}
      <div className="w-full flex-1 flex flex-col justify-center items-center relative z-10 py-6">
        <AnimatePresence mode="wait">
          {activeScreen === 'PASSCODE' && (
            <motion.div key="passcode" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="w-full">
              <PasscodeScreen
                config={config}
                onSuccess={handlePasscodeSuccess}
                musicPlaying={musicPlaying}
                onToggleMusic={handleToggleMusic}
              />
            </motion.div>
          )}

          {activeScreen === 'LOADING' && (
            <motion.div key="loading" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="w-full">
              <LoadingScreen onComplete={handleLoadingComplete} />
            </motion.div>
          )}

          {activeScreen === 'WELCOME' && (
            <motion.div key="welcome" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="w-full">
              <WelcomeScreen config={config} onStart={handleWelcomeComplete} />
            </motion.div>
          )}

          {activeScreen === 'COUNTER' && (
            <motion.div key="counter" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="w-full">
              <CounterScreen config={config} onNext={handleCounterComplete} />
            </motion.div>
          )}

          {activeScreen === 'MEMORIES' && (
            <motion.div key="memories" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="w-full">
              <MemoriesScreen config={config} onNext={handleMemoriesComplete} />
            </motion.div>
          )}

          {activeScreen === 'LETTER' && (
            <motion.div key="letter" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="w-full">
              <LetterScreen config={config} onRestart={handleRestart} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interactive Floating Virtual Pet Panda (unlock dependent) */}
      {activeScreen !== 'PASSCODE' && activeScreen !== 'LOADING' && (
        <VirtualPandaPet
          boyName={config.boyName}
          girlName={config.girlName}
          messages={config.pandaMessages || []}
        />
      )}

      {/* Customize Dialog Modal (Admin Panel) */}
      <AnimatePresence>
        {isAdminOpen && (
          <AdminPanel
            config={config}
            onSave={handleSaveConfig}
            onClose={() => setIsAdminOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Subtle signature footer at bottom center when not on passcode screen */}
      {activeScreen !== 'PASSCODE' && activeScreen !== 'LOADING' && (
        <footer className="w-full text-center pb-4 text-[10px] font-mono tracking-widest text-neutral-600 z-10 flex items-center justify-center gap-1">
          MADE WITH <Heart className="w-2.5 h-2.5 text-rose-500 fill-current animate-pulse" /> FOR {config.girlName.toUpperCase()} BY {config.boyName.toUpperCase()}
        </footer>
      )}
    </div>
  );
}
