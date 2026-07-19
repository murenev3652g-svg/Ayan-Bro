import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings, Save, X, Plus, Trash, Image, Calendar, User, Key, FileText,
  Music, Sparkles, HelpCircle, BookOpen, ExternalLink, Flame, MessageCircle, Globe
} from 'lucide-react';
import { RelationshipConfig, Memory } from '../types';
import { romanticSynth } from '../utils/audio';
import ImageUpload from './ImageUpload';

interface AdminPanelProps {
  config: RelationshipConfig;
  onSave: (newConfig: RelationshipConfig) => void;
  onClose: () => void;
}

export default function AdminPanel({ config, onSave, onClose }: AdminPanelProps) {
  const [boyName, setBoyName] = useState(config.boyName);
  const [girlName, setGirlName] = useState(config.girlName);
  const [startDate, setStartDate] = useState(config.startDate);
  const [passcode, setPasscode] = useState(config.passcode);
  const [adminPasscode, setAdminPasscode] = useState(config.adminPasscode || config.passcode);
  const [girlImageUrl, setGirlImageUrl] = useState(config.girlImageUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop');
  const [boyImageUrl, setBoyImageUrl] = useState(config.boyImageUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop');
  const [letterTitle, setLetterTitle] = useState(config.letterTitle);
  const [letterText, setLetterText] = useState(config.letterText);
  const [memories, setMemories] = useState<Memory[]>([...config.memories]);

  // Expanded customization options
  const [musicType, setMusicType] = useState<'musicbox' | 'lullaby' | 'starlit'>(config.musicType || 'musicbox');
  const [customMusicUrl, setCustomMusicUrl] = useState(config.customMusicUrl || '');
  const [customMusicName, setCustomMusicName] = useState(config.customMusicName || '');
  const [floatingTheme, setFloatingTheme] = useState<'hearts' | 'roses' | 'stars' | 'none'>(config.floatingTheme || 'hearts');
  const [customTheme, setCustomTheme] = useState<'rose_midnight' | 'pastel_pink' | 'midnight_red' | 'sweet_lavender'>(config.customTheme || 'rose_midnight');

  // Stringified list of wishes & messages for easier textarea editing (one per line)
  const [wishesText, setWishesText] = useState((config.customWishes || []).join('\n'));
  const [pandaText, setPandaText] = useState((config.pandaMessages || []).join('\n'));

  // Guide helper tab
  const [activeGuideTab, setActiveGuideTab] = useState<'none' | 'images' | 'deploy'>('none');

  // Security Lock state for Admin panel
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const handleVerifyAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPinInput === (config.adminPasscode || config.passcode)) {
      setIsAdminUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
      setAdminPinInput('');
      setTimeout(() => setPinError(false), 2000);
    }
  };

  const handleSave = () => {
    if (!boyName || !girlName || !startDate || !passcode || !adminPasscode || !letterTitle || !letterText) {
      alert('Please fill out all required fields.');
      return;
    }
    if (passcode.length !== 4 || !/^\d+$/.test(passcode)) {
      alert('Welcome passcode PIN must be exactly 4 digits.');
      return;
    }
    if (adminPasscode.length !== 4 || !/^\d+$/.test(adminPasscode)) {
      alert('Admin panel PIN must be exactly 4 digits.');
      return;
    }

    // Process textarea inputs back to lists
    const parsedWishes = wishesText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const parsedPanda = pandaText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    onSave({
      boyName,
      girlName,
      startDate,
      passcode,
      adminPasscode,
      girlImageUrl,
      boyImageUrl,
      letterTitle,
      letterText,
      memories,
      musicEnabled: config.musicEnabled,
      musicType,
      floatingTheme,
      customTheme,
      customWishes: parsedWishes.length > 0 ? parsedWishes : config.customWishes,
      pandaMessages: parsedPanda.length > 0 ? parsedPanda : config.pandaMessages,
      customMusicUrl,
      customMusicName
    });
  };

  const handleUpdateMemory = (id: string, field: keyof Memory, value: string) => {
    setMemories(prev =>
      prev.map(m => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleAddMemory = () => {
    const newMemory: Memory = {
      id: String(Date.now()),
      imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop',
      title: 'Our Happy Day ❤️',
      date: new Date().toISOString().split('T')[0],
      description: 'Write a beautiful caption here...'
    };
    setMemories(prev => [...prev, newMemory]);
  };

  const handleDeleteMemory = (id: string) => {
    if (memories.length <= 1) {
      alert('Keep at least one photo card to make the album look beautiful!');
      return;
    }
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  if (!isAdminUnlocked) {
    return (
      <div className="fixed inset-0 bg-black/92 backdrop-blur-xl z-50 overflow-y-auto p-4 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 20 }}
          className="relative w-full max-w-sm bg-neutral-950 border border-rose-500/15 rounded-[2rem] p-6 text-center shadow-2xl glow-box-pink"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-neutral-900 text-neutral-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
            <Key className="w-6 h-6 animate-pulse" />
          </div>

          <h3 className="font-serif text-lg text-neutral-200 mb-1">Portal Setup Lock 🔒</h3>
          <p className="text-xs text-neutral-500 mb-6 px-4">
            সেটিংস পরিবর্তন করতে আপনার ৪-সংখ্যার সিক্রেট পাসকোডটি দিন।
          </p>

          <form onSubmit={handleVerifyAdmin} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                maxLength={4}
                value={adminPinInput}
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length !== adminPinInput.length) {
                    romanticSynth.playTouchSound();
                  }
                  setAdminPinInput(val);
                }}
                className={`w-full bg-black border ${pinError ? 'border-red-500/60' : 'border-neutral-800 focus:border-rose-500/40'} rounded-xl px-4 py-3 text-sm text-white text-center focus:outline-none font-mono tracking-[1em] text-lg transition-all`}
                placeholder="••••"
                autoFocus
              />
              {pinError && (
                <p className="text-[10px] text-red-500 mt-1.5 font-mono">ভুল পাসকোড! আবার চেষ্টা করুন।</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-medium text-xs tracking-wider font-mono cursor-pointer transition-all uppercase"
            >
              UNLOCK SETTINGS ⚡
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/92 backdrop-blur-xl z-50 overflow-y-auto p-3 md:p-6 flex justify-center items-start">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="relative w-full max-w-2xl bg-neutral-950 border border-rose-500/15 rounded-[2.2rem] p-5 md:p-7 shadow-2xl glow-box-pink my-4"
      >
        {/* Top Header Bar */}
        <div className="flex justify-between items-center border-b border-rose-500/10 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-rose-500 animate-spin-slow" />
            <h2 className="font-serif text-lg text-neutral-100 font-bold">Portal Setup Dashboard</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-neutral-900 text-neutral-400 hover:text-white transition-all cursor-pointer"
            id="admin-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Visual Guides / Quick Help Panel (Bengali Translation included!) */}
        <div className="mb-6 border border-rose-500/20 rounded-2xl bg-gradient-to-br from-rose-950/20 to-neutral-900/40 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-rose-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 animate-pulse" /> Guides & Tutorial Helpers (সহায়িকা)
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveGuideTab(activeGuideTab === 'images' ? 'none' : 'images')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-mono tracking-wider transition-all uppercase cursor-pointer ${activeGuideTab === 'images' ? 'bg-rose-500 text-white' : 'bg-black border border-neutral-800 text-neutral-400 hover:text-neutral-200'}`}
            >
              📸 Image Link Maker
            </button>
            <button
              onClick={() => setActiveGuideTab(activeGuideTab === 'deploy' ? 'none' : 'deploy')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-mono tracking-wider transition-all uppercase cursor-pointer ${activeGuideTab === 'deploy' ? 'bg-rose-500 text-white' : 'bg-black border border-neutral-800 text-neutral-400 hover:text-neutral-200'}`}
            >
              🚀 Vercel Deployment
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeGuideTab === 'images' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 bg-black/50 border border-neutral-800 rounded-xl p-3 text-[11px] text-neutral-300 leading-relaxed font-sans space-y-2"
              >
                <p className="font-bold text-rose-400">💡 ছবির লিংক বানানোর সহজ নিয়ম (Image Direct Link):</p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>আপনার ফোনের ব্রাউজারে গিয়ে <a href="https://imgbb.com" target="_blank" rel="noreferrer" className="text-pink-400 underline inline-flex items-center gap-0.5">imgbb.com <ExternalLink className="w-2.5 h-2.5" /></a> অথবা <a href="https://postimages.org" target="_blank" rel="noreferrer" className="text-pink-400 underline inline-flex items-center gap-0.5">postimages.org <ExternalLink className="w-2.5 h-2.5" /></a> ওয়েবসাইটে যান।</li>
                  <li>সেখানে আপনার এবং <b>Niru</b> এর ছবিগুলো সিলেক্ট করে Upload করুন।</li>
                  <li>আপলোড শেষ হলে নিচে <b>"Direct Link"</b> (বা ছবির আসল লিংক) কপি করুন। লিংকটি অবশ্যই <code>.jpg</code>, <code>.png</code> অথবা <code>.webp</code> দিয়ে শেষ হতে হবে।</li>
                  <li>কপি করা লিংকটি নিচের ছবির <b>Image URL</b> বক্সে পেস্ট করে দিন! ব্যাস, কাজ শেষ! ✨</li>
                </ol>
              </motion.div>
            )}

            {activeGuideTab === 'deploy' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 bg-black/50 border border-neutral-800 rounded-xl p-3 text-[11px] text-neutral-300 leading-relaxed font-sans space-y-2"
              >
                <p className="font-bold text-rose-400">🚀 ফ্রিতে লাইভ করার নিয়ম (Vercel & GitHub Deployment):</p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>উপরে ডানদিকের ৩-ডট মেনু বা সেটিংস (<b>Settings</b>) এ ক্লিক করুন। সেখানে আপনি <b>Export to GitHub</b> অথবা <b>Download ZIP</b> অপশন পাবেন।</li>
                  <li>আপনার কোডটি GitHub এ এক্সপোর্ট বা আপলোড করুন।</li>
                  <li><a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-pink-400 underline inline-flex items-center gap-0.5">Vercel.com <ExternalLink className="w-2.5 h-2.5" /></a> এ ফ্রিতে অ্যাকাউন্ট খুলে আপনার GitHub প্রজেক্টটি কানেক্ট করুন।</li>
                  <li>Vercel প্রজেক্টটি মাত্র ১ ক্লিকে Deploy করবে এবং আপনাকে একটি চমৎকার লাইভ ওয়েবসাইট লিংক দেবে, যা আপনি Niru-কে শেয়ার করতে পারবেন! 🎉</li>
                </ol>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Configurations Fields Accordion-like layout */}
        <div className="space-y-5">
          
          {/* SECTION 1: CORE PARTNERS */}
          <div className="bg-neutral-900/20 border border-neutral-900 rounded-2xl p-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 mb-3.5 flex items-center gap-2">
              <User className="w-3.5 h-3.5" /> Core Couple Info & Security
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-mono uppercase text-neutral-400 mb-1">Boyfriend Name</label>
                <input
                  type="text"
                  value={boyName}
                  onChange={e => setBoyName(e.target.value)}
                  className="w-full bg-black border border-neutral-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500/30"
                  placeholder="e.g. Ayan"
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono uppercase text-neutral-400 mb-1">Girlfriend Name</label>
                <input
                  type="text"
                  value={girlName}
                  onChange={e => setGirlName(e.target.value)}
                  className="w-full bg-black border border-neutral-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500/30"
                  placeholder="e.g. Niru"
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono uppercase text-neutral-400 mb-1">Anniversary Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full bg-black border border-neutral-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500/30"
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono uppercase text-neutral-400 mb-1 flex justify-between">
                  <span>Passcode Lock PIN</span>
                  <span className="text-[8px] text-neutral-500 font-normal">4-digit number</span>
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={passcode}
                  onChange={e => setPasscode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-black border border-neutral-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500/30 font-mono tracking-widest"
                  placeholder="e.g. 2026"
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono uppercase text-neutral-400 mb-1 flex justify-between">
                  <span>Admin Panel PIN</span>
                  <span className="text-[8px] text-rose-500/80 font-normal">4-digit (Only for Admin lock)</span>
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={adminPasscode}
                  onChange={e => setAdminPasscode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-black border border-rose-500/20 rounded-xl px-3 py-2 text-xs text-rose-300 focus:outline-none focus:border-rose-500/40 font-mono tracking-widest"
                  placeholder="e.g. 2026"
                />
              </div>

              <div className="space-y-4">
                <ImageUpload
                  value={girlImageUrl}
                  onChange={setGirlImageUrl}
                  label={`Girlfriend Photo (${girlName}'s Pic) 👩`}
                  aspectRatio="circle"
                />

                <ImageUpload
                  value={boyImageUrl}
                  onChange={setBoyImageUrl}
                  label={`Boyfriend Photo (${boyName}'s Pic) 👨`}
                  aspectRatio="circle"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: SURPRISES & AESTHETICS (NEW STUFF!) */}
          <div className="bg-neutral-900/20 border border-neutral-900 rounded-2xl p-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 mb-3.5 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> Music & Ambient Themes
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-mono uppercase text-neutral-400 mb-1.5 flex items-center gap-1">
                  <Music className="w-3 h-3 text-rose-400" /> Romantic Music Synth
                </label>
                <select
                  value={musicType}
                  onChange={e => setMusicType(e.target.value as any)}
                  className="w-full bg-black border border-neutral-900 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-rose-500/30 cursor-pointer"
                >
                  <option value="musicbox">Sweet Musicbox Bells 🎵</option>
                  <option value="lullaby">Cozy Sleepy Lullaby 🎹</option>
                  <option value="starlit">Sparkling Starlit Arpeggios ✨</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-mono uppercase text-neutral-400 mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-rose-400" /> Floating Particles Theme
                </label>
                <select
                  value={floatingTheme}
                  onChange={e => setFloatingTheme(e.target.value as any)}
                  className="w-full bg-black border border-neutral-900 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-rose-500/30 cursor-pointer"
                >
                  <option value="hearts">Glowing Hearts ❤️</option>
                  <option value="roses">Falling Rose Petals 🌹</option>
                  <option value="stars">Twinkling Stars ✨</option>
                  <option value="none">No Particles 🚫</option>
                </select>
              </div>
            </div>

            {/* Custom Background Music Upload / URL */}
            <div className="mt-4 border-t border-neutral-800/60 pt-4 space-y-3">
              <label className="block text-[9px] font-mono uppercase text-neutral-400 flex justify-between">
                <span>Custom Background Music (গান আপলোড করুন) 🎵</span>
                <span className="text-[8px] text-rose-500 font-normal">MP3 / WAV/ Device audio</span>
              </label>

              <div className="bg-black/60 p-3 rounded-xl border border-neutral-900 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-serif text-rose-300 truncate">
                      {customMusicName || "No custom song uploaded / কোনো গান যোগ করা নেই"}
                    </p>
                    <p className="text-[9px] text-neutral-500 font-mono mt-0.5">
                      {customMusicUrl ? "Using custom romance song! 💖" : "Using romantic oscillator synthesizer chords"}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 w-full sm:w-auto flex-shrink-0">
                    {/* Hidden input */}
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setCustomMusicName(file.name);
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setCustomMusicUrl(event.target.result as string);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      id="music-upload-input"
                    />
                    <label
                      htmlFor="music-upload-input"
                      className="flex-1 sm:flex-initial text-center bg-rose-500/10 hover:bg-rose-500/20 active:scale-95 text-rose-400 border border-rose-500/20 rounded-lg px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all"
                    >
                      Upload Audio 📲
                    </label>

                    {customMusicUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setCustomMusicUrl('');
                          setCustomMusicName('');
                        }}
                        className="p-1.5 text-xs text-neutral-500 hover:text-red-400 border border-neutral-800 hover:border-red-500/20 rounded-lg bg-neutral-900/50 cursor-pointer"
                        title="Remove custom audio"
                      >
                        Remove ❌
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={customMusicUrl}
                    onChange={(e) => {
                      setCustomMusicUrl(e.target.value);
                      if (e.target.value) {
                        setCustomMusicName("Pasted Link / ইন্টারনেট লিঙ্ক");
                      } else {
                        setCustomMusicName("");
                      }
                    }}
                    className="w-full bg-black/60 border border-neutral-900 rounded-lg px-2.5 py-1.5 text-[10px] text-rose-200 focus:outline-none focus:border-rose-500/30 font-mono pr-8"
                    placeholder="Or paste any direct music URL (.mp3 link)"
                  />
                  <Globe className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-neutral-600" />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: LOVE LETTER */}
          <div className="bg-neutral-900/20 border border-neutral-900 rounded-2xl p-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 mb-3.5 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" /> Special Love Letter
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[9px] font-mono uppercase text-neutral-400 mb-1">Letter Heading</label>
                <input
                  type="text"
                  value={letterTitle}
                  onChange={e => setLetterTitle(e.target.value)}
                  className="w-full bg-black border border-neutral-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500/30"
                  placeholder="Letter Heading Title..."
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono uppercase text-neutral-400 mb-1">Letter Text</label>
                <textarea
                  rows={5}
                  value={letterText}
                  onChange={e => setLetterText(e.target.value)}
                  className="w-full bg-black border border-neutral-900 rounded-xl px-3 py-2 text-xs text-neutral-300 focus:outline-none focus:border-rose-500/30 leading-relaxed"
                  placeholder="Write your beautiful love confession..."
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: CUSTOM MESSAGES LISTS */}
          <div className="bg-neutral-900/20 border border-neutral-900 rounded-2xl p-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 mb-3.5 flex items-center gap-2">
              <MessageCircle className="w-3.5 h-3.5" /> Interactive Surprises Dialogues
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-mono uppercase text-neutral-400 mb-1 flex justify-between">
                  <span>Wish Capsule Messages</span>
                  <span className="text-[8px] text-neutral-500 font-normal">One promise per line</span>
                </label>
                <textarea
                  rows={4}
                  value={wishesText}
                  onChange={e => setWishesText(e.target.value)}
                  className="w-full bg-black border border-neutral-900 rounded-xl p-2.5 text-xs text-neutral-300 focus:outline-none focus:border-rose-500/30 font-sans leading-relaxed"
                  placeholder="Enter promises (one per line)..."
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono uppercase text-neutral-400 mb-1 flex justify-between">
                  <span>Panda Speech Bubbles</span>
                  <span className="text-[8px] text-neutral-500 font-normal">One quote per line</span>
                </label>
                <textarea
                  rows={4}
                  value={pandaText}
                  onChange={e => setPandaText(e.target.value)}
                  className="w-full bg-black border border-neutral-900 rounded-xl p-2.5 text-xs text-neutral-300 focus:outline-none focus:border-rose-500/30 font-sans leading-relaxed"
                  placeholder="Enter cute quotes (one per line)..."
                />
              </div>
            </div>
          </div>

          {/* SECTION 5: ALBUM PHOTO CARDS */}
          <div className="bg-neutral-900/20 border border-neutral-900 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-3.5">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                <Image className="w-3.5 h-3.5" /> Album Photo Carousel Cards ({memories.length})
              </h3>
              <button
                onClick={handleAddMemory}
                className="px-2.5 py-1 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:text-white hover:bg-rose-500/30 transition-all text-[9px] font-mono uppercase flex items-center gap-1 cursor-pointer"
                id="add-memory-btn"
              >
                <Plus className="w-3 h-3" /> Add Image Slot
              </button>
            </div>

            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-1">
              {memories.map((m, index) => (
                <div key={m.id} className="relative bg-black border border-neutral-900 p-4 rounded-xl flex flex-col gap-3 group">
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <span className="text-[10px] text-neutral-600 font-mono font-bold">SLOT #{index + 1}</span>
                    <button
                      onClick={() => handleDeleteMemory(m.id)}
                      className="p-1 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-950/20 transition-all cursor-pointer"
                      title="Delete card"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                    <div>
                      <label className="block text-[8px] font-mono uppercase text-neutral-500 mb-1">Card Title</label>
                      <input
                        type="text"
                        value={m.title}
                        onChange={e => handleUpdateMemory(m.id, 'title', e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-900 rounded-lg px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-rose-500/30"
                      />
                    </div>

                    <div>
                      <label className="block text-[8px] font-mono uppercase text-neutral-500 mb-1">Date</label>
                      <input
                        type="date"
                        value={m.date}
                        onChange={e => handleUpdateMemory(m.id, 'date', e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-900 rounded-lg px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-rose-500/30"
                      />
                    </div>
                  </div>

                  <ImageUpload
                    value={m.imageUrl}
                    onChange={val => handleUpdateMemory(m.id, 'imageUrl', val)}
                    label="Card Photo 📸"
                    aspectRatio="square"
                  />

                  <div>
                    <label className="block text-[8px] font-mono uppercase text-neutral-500 mb-1">Card Caption Caption</label>
                    <textarea
                      rows={2}
                      value={m.description}
                      onChange={e => handleUpdateMemory(m.id, 'description', e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-900 rounded-lg px-2.5 py-1 text-xs text-neutral-300 focus:outline-none focus:border-rose-500/30 leading-relaxed font-sans"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="flex gap-3 justify-end items-center border-t border-rose-500/10 pt-4 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-900 text-xs font-semibold cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-rose-500/10 cursor-pointer transition-all"
            id="admin-save-btn"
          >
            <Save className="w-4 h-4" /> Save Changes 💖
          </button>
        </div>
      </motion.div>
    </div>
  );
}
