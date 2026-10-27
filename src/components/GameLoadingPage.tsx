import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { synthAudio } from '../utils/audio';

interface GameLoadingPageProps {
  onStartGame: () => void;
}

export default function GameLoadingPage({ onStartGame }: GameLoadingPageProps) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTipIndex, setActiveTipIndex] = useState(0);

  const tips = [
    { text: "Keep Mimi happy, healthy and full of love!", happy: "happy", healthy: "healthy", love: "love" },
    { text: "Play mini-games in the gaming room to earn gold coins!", happy: "mini-games", healthy: "gaming room", love: "gold coins" },
    { text: "Equip cool dresses, hats, and dyes in the room shop!", happy: "dresses", healthy: "hats", love: "room shop" },
    { text: "Check Mimi's stats: feed her when hungry, wash her when dirty!", happy: "stats", healthy: "feed her", love: "wash her" }
  ];

  // Rotate tips during loading
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setActiveTipIndex((prev) => (prev + 1) % tips.length);
    }, 3000);
    return () => clearInterval(tipInterval);
  }, []);

  // Increment progress
  useEffect(() => {
    let timer: any;
    const startLoading = () => {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setIsLoaded(true);
            synthAudio.playSuccess();
            return 100;
          }
          // Increments at variable speeds for premium retro feel
          const jitter = Math.random();
          let inc = 1;
          if (prev < 20) inc = Math.floor(jitter * 8) + 4;
          else if (prev < 60) inc = Math.floor(jitter * 6) + 2;
          else if (prev < 85) inc = Math.floor(jitter * 4) + 1;
          else inc = Math.floor(jitter * 2) + 1;
          
          const next = prev + inc;
          if (next >= 100) {
            clearInterval(timer);
            setIsLoaded(true);
            // Cute success tone on loaded!
            setTimeout(() => {
              synthAudio.playSuccess();
            }, 100);
            return 100;
          }
          return next;
        });
      }, 100 + Math.random() * 100);
    };

    startLoading();
    return () => clearInterval(timer);
  }, []);

  const handleEnterGame = () => {
    // Sound fx & start background music
    synthAudio.playMeow();
    synthAudio.startBGM();
    onStartGame();
  };

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col justify-between overflow-hidden rounded-[24px] z-50 select-none text-white font-sans" style={{
      background: 'linear-gradient(to bottom, #5bcaff 0%, #b8e7ff 55%, #16a34a 55%, #15803d 100%)',
    }}>
      {/* Decorative Sun, Clouds & Sparkles */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none animate-[pulse_3s_infinite]">
        <svg width="48" height="48" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="22" fill="#fbbf24" filter="drop-shadow(0 0 8px #f59e0b)" />
          {Array.from({ length: 8 }).map((_, i) => (
            <line
              key={i}
              x1="50" y1="12" x2="50" y2="2"
              stroke="#fbbf24" strokeWidth="4.5" strokeLinecap="round"
              transform={`rotate(${i * 45} 50 50)`}
            />
          ))}
        </svg>
      </div>

      <div className="absolute top-8 right-6 z-10 pointer-events-none opacity-90 animate-[bounce_5s_infinite] duration-1000">
        <div className="bg-white rounded-full w-14 h-6 relative shadow-xs">
          <div className="bg-white rounded-full w-8 h-8 absolute -top-4 left-3" />
          <div className="bg-white rounded-full w-6 h-6 absolute -top-2 -left-2" />
        </div>
      </div>

      <div className="absolute top-24 left-6 z-10 pointer-events-none opacity-70 animate-[bounce_7s_infinite] duration-500">
        <div className="bg-white rounded-full w-12 h-5 relative shadow-xs">
          <div className="bg-white rounded-full w-6 h-6 absolute -top-3 left-2" />
          <div className="bg-white rounded-full w-5 h-5 absolute -top-1.5 -left-1.5" />
        </div>
      </div>

      {/* Twinkling Stars */}
      <div className="absolute top-12 left-28 animate-ping opacity-40 duration-[4000ms]">⭐</div>
      <div className="absolute top-28 right-24 animate-pulse opacity-60">✨</div>
      <div className="absolute top-6 right-36 animate-ping opacity-30 duration-[3000ms]">⭐</div>

      {/* ================= HEADER: LOGO / BANNER ================= */}
      <div className="flex flex-col items-center mt-6 w-full px-4 z-20 text-center relative">
        <div className="relative flex flex-col items-center">
          {/* Logo container with sweet outline */}
          <h1 className="text-[52px] font-black tracking-tight leading-none text-white select-none filter drop-shadow-[0_4px_0_#4c1d95] drop-shadow-[0_5px_4px_rgba(76,29,149,0.5)] flex items-center justify-center gap-0.5">
            M
            <span className="relative inline-block">
              i
              <span className="absolute -top-3 left-[-2px] text-xl animate-pulse">🌸</span>
            </span>
            m
            <span className="relative inline-block">
              i
              <span className="absolute -top-2 left-[-2px] text-xs">🐾</span>
            </span>
          </h1>

          {/* Subtitle Pink Ribbon Banner */}
          <div className="relative mt-2 px-6 py-1 bg-pink-500 rounded-full border-2 border-white shadow-[0_4px_0_#9d174d] text-center max-w-[200px] animate-[pulse_2s_infinite]">
            <span className="text-white text-[11px] font-black tracking-wide uppercase select-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
              THE KITTEN
            </span>
          </div>

          {/* My Virtual Pet Pill */}
          <div className="mt-2.5 px-3 py-0.5 bg-purple-900/80 border border-purple-400 rounded-full flex items-center gap-1">
            <span className="text-[8.5px] font-extrabold text-purple-200 tracking-wider uppercase flex items-center gap-1">
              🐾 My Virtual Pet 🐾
            </span>
          </div>
        </div>
      </div>

      {/* ================= MIDDLE: ADORABLE MIMI WITH DETECTIVE CAP ================= */}
      <div className="flex-1 flex items-center justify-center relative w-full px-4 mt-2">
        
        {/* Grassy Garden Backdrop Elements */}
        {/* Left Tree */}
        <div className="absolute bottom-1.5 left-2 w-16 h-28 flex flex-col items-center pointer-events-none z-10">
          {/* Green leafy top */}
          <div className="w-16 h-16 bg-emerald-500 rounded-full border-2 border-emerald-700 shadow-md relative flex items-center justify-center">
            {/* Apple dots */}
            <span className="absolute top-3 left-4 text-[7px] animate-pulse">🍎</span>
            <span className="absolute bottom-4 right-3 text-[7px] animate-pulse">🍎</span>
            <span className="absolute top-5 right-5 text-[7px]">🍎</span>
          </div>
          {/* Trunk */}
          <div className="w-4 h-12 bg-amber-800 border-x-2 border-amber-950 shadow-inner" />
        </div>

        {/* Right Tree */}
        <div className="absolute bottom-1.5 right-2 w-16 h-28 flex flex-col items-center pointer-events-none z-10">
          {/* Yellow dotted orange tree */}
          <div className="w-16 h-16 bg-green-500 rounded-full border-2 border-green-700 shadow-md relative flex items-center justify-center">
            <span className="absolute top-4 left-3 text-[7px]">🍊</span>
            <span className="absolute bottom-3 right-4 text-[7px]">🍊</span>
          </div>
          <div className="w-3.5 h-12 bg-amber-800 border-x-2 border-amber-950 shadow-inner" />
          {/* White Fence */}
          <div className="absolute bottom-0 right-[-8px] flex gap-0.5 z-20">
            <div className="w-2 h-7 bg-white border border-slate-300 rounded-t-sm" />
            <div className="w-2 h-7 bg-white border border-slate-300 rounded-t-sm" />
            <div className="w-2 h-7 bg-white border border-slate-300 rounded-t-sm" />
          </div>
        </div>

        {/* Fluttering Monarch Butterfly on Left */}
        <motion.div 
          className="absolute left-16 top-14 text-lg z-20"
          animate={{
            y: [0, -6, 2, -4, 0],
            x: [0, 5, -3, 4, 0],
            rotate: [0, -10, 15, -5, 0]
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut"
          }}
        >
          🦋
        </motion.div>

        {/* Scattered Ground Flowers */}
        <div className="absolute bottom-2 left-20 text-[10px] z-15 animate-bounce">🌸</div>
        <div className="absolute bottom-3 left-28 text-[9px] z-15">🌼</div>
        <div className="absolute bottom-2 right-16 text-[10px] z-15 animate-pulse">🌸</div>
        <div className="absolute bottom-4 right-24 text-[8px] z-15">🪻</div>

        {/* Mimi Avatar in the center */}
        <div className="w-44 h-44 z-20 flex items-center justify-center relative">
          <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_8px_16px_rgba(21,128,61,0.3)]">
            {/* Mimi main shadow */}
            <ellipse cx="50" cy="88" rx="22" ry="5" fill="#14532d" opacity="0.35" />

            {/* Left Ear */}
            <path d="M 28 42 L 18 16 Q 28 24 38 32 Z" fill="#22d3ee" stroke="#0891b2" strokeWidth="1.8" />
            <path d="M 27 39 L 21 21 Q 28 26 34 31 Z" fill="#fecdd3" />

            {/* Right Ear */}
            <path d="M 72 42 L 82 16 Q 72 24 62 32 Z" fill="#22d3ee" stroke="#0891b2" strokeWidth="1.8" />
            <path d="M 73 39 L 79 21 Q 72 26 66 31 Z" fill="#fecdd3" />

            {/* Cyan body */}
            <circle cx="50" cy="74" r="18" fill="#22d3ee" stroke="#0891b2" strokeWidth="1.8" />

            {/* Tails */}
            <path d="M 66 76 C 76 76, 82 66, 82 60 C 82 56, 78 56, 78 60 C 78 63, 73 70, 66 71 Z" fill="#22d3ee" stroke="#0891b2" strokeWidth="1.8" />

            {/* Head (Round & big cute) */}
            <ellipse cx="50" cy="48" rx="28" ry="22" fill="#22d3ee" stroke="#0891b2" strokeWidth="1.8" />

            {/* Cute rosy cheeks */}
            <ellipse cx="29" cy="52" rx="4" ry="2.5" fill="#f43f5e" opacity="0.5" />
            <ellipse cx="71" cy="52" rx="4" ry="2.5" fill="#f43f5e" opacity="0.5" />

            {/* Tiny blossom on left cheek */}
            <g transform="translate(71, 48) scale(0.6)">
              <circle cx="0" cy="0" r="3" fill="#fda4af" />
              <circle cx="-3" cy="-1" r="2.5" fill="#fda4af" />
              <circle cx="3" cy="1" r="2.5" fill="#fda4af" />
              <circle cx="-1" cy="3" r="2.5" fill="#fda4af" />
              <circle cx="1" cy="-3" r="2.5" fill="#fda4af" />
              <circle cx="0" cy="0" r="1.5" fill="#fbbf24" />
            </g>

            {/* Whiskers */}
            <line x1="16" y1="50" x2="26" y2="52" stroke="#0891b2" strokeWidth="1.5" />
            <line x1="15" y1="54" x2="25" y2="55" stroke="#0891b2" strokeWidth="1.5" />
            <line x1="84" y1="50" x2="74" y2="52" stroke="#0891b2" strokeWidth="1.5" />
            <line x1="85" y1="54" x2="75" y2="55" stroke="#0891b2" strokeWidth="1.5" />

            {/* Squinty Smiling Eyes */}
            <path d="M 32 46 Q 38 42 44 46" fill="none" stroke="#0f172a" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M 56 46 Q 62 42 68 46" fill="none" stroke="#0f172a" strokeWidth="2.8" strokeLinecap="round" />

            {/* Nose & Mouth */}
            <polygon points="50,51 47,49 53,49" fill="#f43f5e" />
            <path d="M 45 52 Q 50 56 55 52" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
            <path d="M 47 54 C 47 54, 50 59, 53 54" fill="#f43f5e" stroke="#0f172a" strokeWidth="1.5" />

            {/* Cute Detective / Service cap */}
            <g id="loading-hat">
              {/* Cap base curve */}
              <path d="M 33 32 Q 50 24 67 32 C 67 32, 60 21, 50 21 C 40 21, 33 32, 33 32 Z" fill="#78350f" stroke="#451a03" strokeWidth="1.8" />
              {/* Red ribbon trim */}
              <path d="M 33 31 Q 50 24 67 31" fill="none" stroke="#dc2626" strokeWidth="3.5" />
              {/* Cap brim */}
              <ellipse cx="50" cy="31" rx="16" ry="3.5" fill="#451a03" />
              {/* Golden Star in center */}
              <path d="M 50 20 L 52 23.5 L 56 23.5 L 53 25.5 L 54 29 L 50 27 L 46 29 L 47 25.5 L 44 23.5 L 48 23.5 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
            </g>

            {/* White chest patch */}
            <ellipse cx="50" cy="76" rx="9" ry="10" fill="#ffffff" />

            {/* Red collar with bell */}
            <path d="M 38 72 Q 50 78 62 72" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="75" r="4.5" fill="#fbbf24" stroke="#d97706" strokeWidth="1.2" />
            <circle cx="50" cy="74" r="1" fill="#78350f" />

            {/* Paws */}
            {/* Front left */}
            <ellipse cx="40" cy="84" rx="4.5" ry="3.5" fill="#ffffff" stroke="#0891b2" strokeWidth="1.5" />
            {/* Front right */}
            <ellipse cx="60" cy="84" rx="4.5" ry="3.5" fill="#ffffff" stroke="#0891b2" strokeWidth="1.5" />
            {/* Back left */}
            <ellipse cx="30" cy="80" rx="6" ry="5.5" fill="#ffffff" stroke="#0891b2" strokeWidth="1.5" />
            <circle cx="30" cy="80" r="3.5" fill="#fda4af" />
            <circle cx="26" cy="76" r="1.5" fill="#fda4af" />
            <circle cx="30" cy="74" r="1.5" fill="#fda4af" />
            <circle cx="34" cy="76" r="1.5" fill="#fda4af" />
            {/* Back right */}
            <ellipse cx="70" cy="80" rx="6" ry="5.5" fill="#ffffff" stroke="#0891b2" strokeWidth="1.5" />
            <circle cx="70" cy="80" r="3.5" fill="#fda4af" />
            <circle cx="66" cy="76" r="1.5" fill="#fda4af" />
            <circle cx="70" cy="74" r="1.5" fill="#fda4af" />
            <circle cx="74" cy="76" r="1.5" fill="#fda4af" />
          </svg>
        </div>
      </div>

      {/* ================= LOADING STAGE BAR OR ENTER BUTTON ================= */}
      <div className="w-full px-6 flex flex-col items-center gap-4 mb-4 z-20">
        
        <AnimatePresence mode="wait">
          {!isLoaded ? (
            <motion.div 
              key="loading-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full flex flex-col items-center gap-1.5"
            >
              {/* LOADING... text in Telugu / English styled as image */}
              <span className="text-xs font-black tracking-widest text-white drop-shadow-[0_2px_0_#4c1d95] uppercase animate-pulse">
                LOADING...
              </span>

              {/* Progress bar background */}
              <div className="w-full bg-slate-100/30 p-1 rounded-full border-[3px] border-white shadow-md relative overflow-hidden flex items-center">
                
                {/* Slidable animated candy stripes */}
                <motion.div 
                  className="h-5 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500"
                  style={{ 
                    width: `${progress}%`,
                    backgroundImage: 'linear-gradient(45deg, rgba(255, 255, 255, 0.25) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0.25) 75%, transparent 75%, transparent)',
                    backgroundSize: '24px 24px',
                  }}
                  animate={{ backgroundPositionX: ['0px', '48px'] }}
                  transition={{ ease: 'linear', duration: 1.5, repeat: Infinity }}
                />

                {/* Percentage text right aligned */}
                <span className="absolute right-4 font-black text-xs text-purple-950 select-none drop-shadow-[0_1.5px_0_rgba(255,255,255,0.9)]">
                  {progress}%
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="start-btn"
              onClick={handleEnterGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                y: [0, -5, 0]
              }}
              transition={{
                scale: { type: 'spring', damping: 10 },
                y: { repeat: Infinity, duration: 1.2, ease: 'easeInOut' }
              }}
              className="w-full py-3.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-purple-950 text-sm font-black tracking-widest uppercase rounded-full border-[3.5px] border-white shadow-[0_5px_0_#9a3412] active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>START ADVENTURE 🐾</span>
              <span className="text-base">PLAY NOW</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* ================= BOTTOM TIP DASHED BOX ================= */}
        <div className="w-full py-3 px-4 bg-emerald-950/20 rounded-2xl border-2 border-dashed border-emerald-400/80 flex items-center gap-3 backdrop-blur-3xs text-left">
          {/* Paw print emblem */}
          <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center border border-white shrink-0 shadow-xs animate-bounce">
            <span className="text-pink-500 text-xs">🐾</span>
          </div>
          
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-black tracking-wider text-emerald-300 uppercase">
              Pro Tip • Mimi Tip
            </span>
            <span className="text-[9.5px] leading-relaxed font-bold text-slate-100 select-none">
              {tips[activeTipIndex].text.split(new RegExp(`(${tips[activeTipIndex].happy}|${tips[activeTipIndex].healthy}|${tips[activeTipIndex].love})`, 'g')).map((part, i) => {
                if (part === tips[activeTipIndex].happy) {
                  return <span key={i} className="text-yellow-300 font-extrabold">{part}</span>;
                }
                if (part === tips[activeTipIndex].healthy) {
                  return <span key={i} className="text-sky-300 font-extrabold">{part}</span>;
                }
                if (part === tips[activeTipIndex].love) {
                  return <span key={i} className="text-pink-300 font-extrabold">{part}</span>;
                }
                return part;
              })}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
