import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Heart, Clock, ChevronRight, Milestone } from 'lucide-react';
import { RelationshipConfig } from '../types';
import SurpriseKit from './SurpriseKit';

interface CounterScreenProps {
  config: RelationshipConfig;
  onNext: () => void;
}

export default function CounterScreen({ config, onNext }: CounterScreenProps) {
  const [timePassed, setTimePassed] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(config.startDate);
      const now = new Date();

      let diffMs = now.getTime() - start.getTime();
      if (diffMs < 0) diffMs = 0; // Prevent negative values

      // Calculate complete years
      let years = now.getFullYear() - start.getFullYear();
      let months = now.getMonth() - start.getMonth();
      let days = now.getDate() - start.getDate();

      if (days < 0) {
        // Adjust month and borrow days from previous month
        months--;
        const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += previousMonth.getDate();
      }

      if (months < 0) {
        // Adjust year and borrow months
        years--;
        months += 12;
      }

      // Calculate hours, minutes, seconds remaining in the current day
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      setTimePassed({
        years: Math.max(0, years),
        months: Math.max(0, months),
        days: Math.max(0, days),
        hours,
        minutes,
        seconds
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [config.startDate]);

  // Generate milestone events based on start date
  const getMilestones = () => {
    const base = new Date(config.startDate);
    const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const m1 = new Date(base);
    const m2 = new Date(base);
    m2.setMonth(base.getMonth() + 1);
    const m3 = new Date(base);
    m3.setMonth(base.getMonth() + 3);
    const m4 = new Date(base);
    m4.setMonth(base.getMonth() + 6);

    return [
      {
        title: 'First Connection 💖',
        date: formatDate(m1),
        description: `Where the magic began! Ayan and Niru's souls crossed paths.`
      },
      {
        title: '1 Month Together 🥰',
        date: formatDate(m2),
        description: 'A month of sweet giggles, cute fights, and beautiful text logs.'
      },
      {
        title: '3 Months Milestone ✨',
        date: formatDate(m3),
        description: 'Our hearts became closer, talking till the birds started singing.'
      },
      {
        title: '6-Month Anniversary 🎉',
        date: formatDate(m4),
        description: 'Half a year of perfect pure love and beautiful memories together!'
      }
    ];
  };

  const milestones = getMilestones();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-lg mx-auto flex flex-col items-center px-4 py-8 z-10"
    >
      {/* Title block */}
      <motion.div variants={itemVariants} className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-950/30 border border-rose-900/30 rounded-full text-rose-400 text-xs mb-3 font-mono uppercase tracking-widest glow-box-pink animate-pulse">
          <Heart className="w-3.5 h-3.5 fill-current" /> Our Love Tracker
        </div>
        <h2 className="text-2xl font-serif text-neutral-100 tracking-wide">
          Happy 6-Month Anniversary, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500 font-bold glow-pink">
            {config.girlName}! 🎀
          </span>
        </h2>
      </motion.div>

      {/* Main Counter Card */}
      <motion.div
        variants={itemVariants}
        className="relative w-full glass-panel rounded-3xl p-6 border border-rose-950/40 glow-box-pink mb-8 overflow-hidden"
      >
        {/* Subtle background glow inside card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-6 border-b border-rose-950/40 pb-4">
          <span className="text-xs text-rose-400 font-mono tracking-widest uppercase flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Love Timer
          </span>
          <span className="text-[11px] text-neutral-500 font-mono">
            Since: {new Date(config.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        {/* Big digits rows */}
        <div className="grid grid-cols-3 gap-4 text-center mb-5">
          <div className="bg-neutral-950/40 rounded-2xl p-3 border border-neutral-900">
            <span className="block text-3xl font-serif font-bold text-rose-400 glow-pink">
              {timePassed.years}
            </span>
            <span className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider">Years</span>
          </div>
          <div className="bg-neutral-950/40 rounded-2xl p-3 border border-neutral-900">
            <span className="block text-3xl font-serif font-bold text-rose-400 glow-pink">
              {timePassed.months}
            </span>
            <span className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider">Months</span>
          </div>
          <div className="bg-neutral-950/40 rounded-2xl p-3 border border-neutral-900">
            <span className="block text-3xl font-serif font-bold text-rose-400 glow-pink">
              {timePassed.days}
            </span>
            <span className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider">Days</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-neutral-950/40 rounded-2xl p-3 border border-neutral-900">
            <span className="block text-2xl font-mono text-rose-300">
              {String(timePassed.hours).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase font-mono text-neutral-500 tracking-wider">Hours</span>
          </div>
          <div className="bg-neutral-950/40 rounded-2xl p-3 border border-neutral-900">
            <span className="block text-2xl font-mono text-rose-300">
              {String(timePassed.minutes).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase font-mono text-neutral-500 tracking-wider">Mins</span>
          </div>
          <div className="bg-neutral-950/40 rounded-2xl p-3 border border-neutral-900">
            <span className="block text-2xl font-mono text-rose-400 glow-pink">
              {String(timePassed.seconds).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase font-mono text-neutral-500 tracking-wider">Secs</span>
          </div>
        </div>
      </motion.div>

      {/* Love Journey Milestone Timeline */}
      <motion.div variants={itemVariants} className="w-full mb-8">
        <h3 className="text-sm font-serif tracking-wider text-rose-300 uppercase mb-5 flex items-center gap-2 px-1">
          <Milestone className="w-4 h-4 text-rose-400" /> Our Sweet Timeline
        </h3>

        <div className="relative border-l-2 border-rose-950/50 ml-3.5 pl-6 space-y-6">
          {milestones.map((milestone, idx) => {
            const isLast = idx === milestones.length - 1;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="relative"
              >
                {/* Timeline Dot Indicator */}
                <div className={`absolute -left-10 top-1 w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                  isLast 
                    ? 'bg-rose-900 border-rose-400 text-white shadow-[0_0_8px_#f43f5e]' 
                    : 'bg-neutral-950 border-rose-950 text-rose-500'
                }`}>
                  <Heart className={`w-3.5 h-3.5 ${isLast ? 'fill-current animate-pulse' : ''}`} />
                </div>

                <div className="glass-panel border border-neutral-900 rounded-2xl p-4 glow-box-pink">
                  <div className="flex justify-between items-start mb-1.5">
                    <h4 className="font-serif text-sm font-bold text-neutral-200">
                      {milestone.title}
                    </h4>
                    <span className="text-[10px] font-mono text-rose-400/80 bg-rose-950/20 px-2 py-0.5 rounded-full border border-rose-900/10">
                      {milestone.date}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Interactive Surprise Kit (Wish Bottle & Love Meter) */}
      <motion.div variants={itemVariants} className="w-full mb-8">
        <SurpriseKit
          boyName={config.boyName}
          girlName={config.girlName}
          customWishes={config.customWishes || []}
        />
      </motion.div>

      {/* Next Step Action Button */}
      <motion.button
        variants={itemVariants}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        className="relative py-4 w-full bg-neutral-900 hover:bg-rose-950/10 border border-rose-500/20 hover:border-rose-500/50 text-neutral-200 hover:text-white font-sans font-medium rounded-2xl cursor-pointer transition-all duration-300 shadow-[0_0_15px_rgba(244,63,94,0.05)] focus:outline-none flex items-center justify-center gap-2 group"
        id="counter-next-btn"
      >
        <span className="tracking-wider text-xs font-bold font-mono">NEXT - VIEW SPECIAL MEMORIES</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </motion.div>
  );
}
