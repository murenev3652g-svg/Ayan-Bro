import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Save, X, RefreshCw, Plus, Trash, Image, Calendar, User, Key, FileText } from 'lucide-react';
import { RelationshipConfig, Memory } from '../types';

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
  const [letterTitle, setLetterTitle] = useState(config.letterTitle);
  const [letterText, setLetterText] = useState(config.letterText);
  const [memories, setMemories] = useState<Memory[]>([...config.memories]);

  const handleSave = () => {
    // Basic verification
    if (!boyName || !girlName || !startDate || !passcode || !letterTitle || !letterText) {
      alert('Please fill out all required configuration fields.');
      return;
    }
    if (passcode.length !== 4 || !/^\d+$/.test(passcode)) {
      alert('Passcode must be exactly 4 digits (e.g., 2026).');
      return;
    }

    onSave({
      boyName,
      girlName,
      startDate,
      passcode,
      letterTitle,
      letterText,
      memories,
      musicEnabled: config.musicEnabled
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
      title: 'Our New Memory',
      date: new Date().toISOString().split('T')[0],
      description: 'Describe this beautiful moment...'
    };
    setMemories(prev => [...prev, newMemory]);
  };

  const handleDeleteMemory = (id: string) => {
    if (memories.length <= 1) {
      alert('You must keep at least one memory in your album!');
      return;
    }
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 overflow-y-auto p-4 md:p-6 flex justify-center items-start">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="relative w-full max-w-2xl bg-neutral-950 border border-rose-950/45 rounded-[2rem] p-6 shadow-2xl glow-box-pink my-4"
      >
        {/* Header bar */}
        <div className="flex justify-between items-center border-b border-rose-950/30 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-rose-400 animate-spin-slow" />
            <h2 className="font-serif text-lg text-neutral-100 font-bold">Customize Relationship Portal</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-rose-950/20 text-neutral-400 hover:text-white transition-colors"
            id="admin-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
          Change names, starting dates, write your personalized unseal letter, and paste your actual couple image URLs below so they display in your memory album carousel!
        </p>

        <div className="space-y-6">
          {/* SECTION 1: CORE PARTNERS */}
          <div className="bg-neutral-900/40 border border-neutral-900 rounded-2xl p-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 mb-4 flex items-center gap-2">
              <User className="w-3.5 h-3.5" /> Partners & Access Code
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1.5">Boyfriend Name</label>
                <input
                  type="text"
                  value={boyName}
                  onChange={e => setBoyName(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-500/50"
                  placeholder="e.g. Ayan"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1.5">Girlfriend Name</label>
                <input
                  type="text"
                  value={girlName}
                  onChange={e => setGirlName(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-500/50"
                  placeholder="e.g. Niru"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1.5">Relationship Anniversary Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-500/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1.5 flex items-center justify-between">
                  <span>Pin Lock Passcode</span>
                  <span className="text-[9px] text-neutral-500">4-digit number</span>
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={passcode}
                  onChange={e => setPasscode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-black border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-500/50 font-mono tracking-widest"
                  placeholder="e.g. 2026"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: THE LOVE LETTER */}
          <div className="bg-neutral-900/40 border border-neutral-900 rounded-2xl p-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 mb-4 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" /> Anniversary Love Letter
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1.5">Letter Heading Title</label>
                <input
                  type="text"
                  value={letterTitle}
                  onChange={e => setLetterTitle(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-500/50"
                  placeholder="Happy Anniversary Heading..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1.5">Letter Body Text</label>
                <textarea
                  rows={6}
                  value={letterText}
                  onChange={e => setLetterText(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-500/50 leading-relaxed"
                  placeholder="Write your heart-melting message here..."
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: ALBUM MEMORIES */}
          <div className="bg-neutral-900/40 border border-neutral-900 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                <Image className="w-3.5 h-3.5" /> Album Cards Carousel ({memories.length})
              </h3>
              <button
                onClick={handleAddMemory}
                className="px-2.5 py-1 rounded-lg border border-rose-900/30 bg-rose-950/20 text-rose-300 hover:text-white hover:bg-rose-900/30 transition-all text-[10px] font-mono uppercase flex items-center gap-1.5 cursor-pointer"
                id="add-memory-btn"
              >
                <Plus className="w-3 h-3" /> Add Card
              </button>
            </div>

            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-1">
              {memories.map((m, index) => (
                <div key={m.id} className="relative bg-neutral-950 p-4 rounded-xl border border-neutral-900 flex flex-col gap-3 group">
                  <div className="absolute top-3 right-3 flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-neutral-500 font-mono font-bold">#{index + 1}</span>
                    <button
                      onClick={() => handleDeleteMemory(m.id)}
                      className="p-1 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-950/20 transition-colors cursor-pointer"
                      title="Delete card"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
                    <div>
                      <label className="block text-[9px] font-mono uppercase text-neutral-500 mb-1">Card Title</label>
                      <input
                        type="text"
                        value={m.title}
                        onChange={e => handleUpdateMemory(m.id, 'title', e.target.value)}
                        className="w-full bg-black border border-neutral-900 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-rose-500/30"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono uppercase text-neutral-500 mb-1">Card Date</label>
                      <input
                        type="date"
                        value={m.date}
                        onChange={e => handleUpdateMemory(m.id, 'date', e.target.value)}
                        className="w-full bg-black border border-neutral-900 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-rose-500/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono uppercase text-neutral-500 mb-1">Image URL (paste unsplash or direct image file link)</label>
                    <input
                      type="text"
                      value={m.imageUrl}
                      onChange={e => handleUpdateMemory(m.id, 'imageUrl', e.target.value)}
                      className="w-full bg-black border border-neutral-900 rounded-lg px-2.5 py-1.5 text-xs text-rose-300 font-mono focus:outline-none focus:border-rose-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono uppercase text-neutral-500 mb-1">Card Caption Paragraph</label>
                    <textarea
                      rows={2}
                      value={m.description}
                      onChange={e => handleUpdateMemory(m.id, 'description', e.target.value)}
                      className="w-full bg-black border border-neutral-900 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-rose-500/30 leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="flex gap-3 justify-end items-center border-t border-rose-950/30 pt-4 mt-6">
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
