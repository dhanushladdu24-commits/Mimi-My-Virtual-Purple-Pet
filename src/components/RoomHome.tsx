import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sun, Cloud, Sparkles } from 'lucide-react';
import { synthAudio } from '../utils/audio';

interface RoomHomeProps {
  onWalk: (targetPercent: number) => void;
  petPositionX: number;
}

export default function RoomHome({ onWalk, petPositionX }: RoomHomeProps) {
  const [butterflies, setButterflies] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([
    { id: 1, x: 15, y: 35, delay: 0 },
    { id: 2, x: 75, y: 45, delay: 1.5 },
    { id: 3, x: 45, y: 25, delay: 0.8 },
  ]);

  const [taps, setTaps] = useState<Array<{ id: number; x: number; y: number }>>([]);

  // Generate a random position movement for butterflies
  useEffect(() => {
    const interval = setInterval(() => {
      setButterflies((prev) =>
        prev.map((b) => ({
          ...b,
          x: Math.max(10, Math.min(90, b.x + (Math.random() * 20 - 10))),
          y: Math.max(20, Math.min(65, b.y + (Math.random() * 16 - 8))),
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Ambient Home Room Sound Effects Loop (birds chirping, leaves rustling/wind moving)
  useEffect(() => {
    const ambientTimer = setInterval(() => {
      if (Math.random() > 0.4) {
        synthAudio.playBirdChirp();
      } else {
        synthAudio.playWindSwoosh();
      }
    }, 6500); // play every 6.5 seconds

    // Initial chirp to breathe life into the scene
    synthAudio.playBirdChirp();

    return () => clearInterval(ambientTimer);
  }, []);

  const handleGardenTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const percentX = (clickX / rect.width) * 100;

    // Trigger tap indicator sound
    synthAudio.playClick();

    const newTap = { id: Date.now(), x: clickX, y: clickY };
    setTaps((prev) => [...prev, newTap]);
    setTimeout(() => {
      setTaps((prev) => prev.filter((t) => t.id !== newTap.id));
    }, 1000);

    // Call parents walk handler
    onWalk(percentX);
  };

  return (
    <div
      className="relative w-full h-full flex flex-col justify-end overflow-hidden cursor-pointer"
      style={{
        background: 'linear-gradient(to bottom, #bae6fd 0%, #e0f2fe 50%, #fef08a 100%)',
      }}
      onClick={handleGardenTap}
    >
      {/* SKY DECORATIONS */}
      <div className="absolute top-4 left-6 flex items-center gap-2 pointer-events-none">
        <Sun className="w-12 h-12 text-amber-400 animate-spin" style={{ animationDuration: '30s' }} />
        <div className="text-amber-800 font-bold text-xs bg-amber-100/80 px-2.5 py-1 rounded-full shadow-sm">
          Beautiful Day! ☀️
        </div>
      </div>

      {/* Clouds */}
      <motion.div
        className="absolute top-12 left-[10%] pointer-events-none"
        animate={{ x: [-10, 30, -10] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Cloud className="w-16 h-10 text-white fill-white opacity-90 filter drop-shadow-sm" />
      </motion.div>
      <motion.div
        className="absolute top-8 right-[15%] pointer-events-none"
        animate={{ x: [10, -40, 10] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Cloud className="w-20 h-12 text-white fill-white opacity-80 filter drop-shadow-sm" />
      </motion.div>

      {/* BIRDS FLYING IN BACKGROUND */}
      <div className="absolute top-20 left-1/3 pointer-events-none">
        <motion.div
          animate={{ x: [0, 200, 0], y: [0, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="text-lg text-sky-600 font-bold tracking-widest opacity-60"
        >
          {`v   v`}
        </motion.div>
      </div>

      {/* BACKGROUND TREES & FLOWERS */}
      <div className="absolute bottom-[28%] w-full flex justify-between px-6 pointer-events-none">
        {/* Left Tree */}
        <div className="flex flex-col items-center">
          <motion.div
            className="w-16 h-16 bg-emerald-400 rounded-full flex items-center justify-center relative shadow-md"
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Apples / Cherries */}
            <div className="absolute top-3 left-4 w-2 h-2 bg-red-500 rounded-full" />
            <div className="absolute top-8 right-3 w-2.5 h-2.5 bg-red-500 rounded-full" />
            <div className="absolute top-5 right-8 w-2 h-2 bg-red-500 rounded-full" />
          </motion.div>
          <div className="w-4 h-12 bg-amber-800 rounded-sm -mt-2 shadow-inner" />
        </div>

        {/* Right Tree */}
        <div className="flex flex-col items-center">
          <motion.div
            className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center relative shadow-md"
            animate={{ rotate: [2, -2, 2], scale: [1, 1.02, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="absolute top-4 right-5 w-2.5 h-2.5 bg-yellow-300 rounded-full animate-pulse" />
            <div className="absolute top-10 left-3 w-2 h-2 bg-yellow-300 rounded-full animate-pulse" />
          </motion.div>
          <div className="w-5 h-10 bg-amber-800 rounded-sm -mt-2 shadow-inner" />
        </div>
      </div>

      {/* BUTTERFLIES FLUTTERING */}
      {butterflies.map((b) => (
        <motion.div
          key={b.id}
          className="absolute text-xl pointer-events-none z-10"
          style={{ left: `${b.x}%`, top: `${b.y}%` }}
          animate={{
            y: [0, -6, 0],
            rotate: [-15, 15, -15],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: b.delay,
            ease: 'easeInOut',
          }}
        >
          🦋
        </motion.div>
      ))}

      {/* SWIMMING POOL */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          synthAudio.playWaterSplash();
        }}
        className="absolute left-4 bottom-[8%] w-36 h-20 bg-sky-200 border-4 border-slate-300 rounded-[50px] shadow-inner overflow-hidden flex items-center justify-center cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform z-10"
      >
        {/* Rippling Water */}
        <motion.div
          className="absolute inset-1 bg-sky-400/80 rounded-[45px]"
          animate={{
            scale: [0.95, 1, 0.95],
            opacity: [0.7, 0.9, 0.7],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Pool Duck */}
        <motion.div
          className="absolute text-xl pointer-events-none z-10"
          animate={{
            x: [-12, 12, -12],
            rotate: [-5, 5, -5],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          🦆
        </motion.div>
        <span className="text-[10px] text-sky-800 font-extrabold z-10 select-none pointer-events-none absolute bottom-1">
          SPLASH!
        </span>
      </div>

      {/* GARDEN GROUND (GRASS) */}
      <div className="w-full h-[32%] bg-gradient-to-b from-green-400 to-emerald-600 relative border-t-8 border-green-300 flex flex-col justify-between p-3">
        {/* Scattered Flowers */}
        <div className="flex justify-around w-full opacity-90 pointer-events-none">
          <div className="flex items-center gap-1">
            <span className="text-xl animate-bounce" style={{ animationDelay: '0.2s' }}>🌸</span>
            <span className="text-xs text-white/80 font-bold">Garden</span>
          </div>
          <span className="text-lg animate-pulse" style={{ animationDelay: '0.5s' }}>🌼</span>
          <span className="text-xl animate-bounce" style={{ animationDelay: '0.8s' }}>🌷</span>
          <span className="text-lg animate-pulse" style={{ animationDelay: '1.2s' }}>🌸</span>
        </div>

        {/* Small fence on the right */}
        <div className="absolute right-6 top-[-16px] flex gap-1 pointer-events-none">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-2 h-6 bg-amber-50 border-x border-t border-amber-200 rounded-t-sm shadow-sm" />
          ))}
        </div>

        {/* Tap/Click Spawners Indicator */}
        {taps.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 1, scale: 0.5 }}
            animate={{ opacity: 0, scale: 1.5 }}
            className="absolute z-30 pointer-events-none text-purple-500 font-extrabold flex flex-col items-center justify-center"
            style={{ left: t.x - 20, top: t.y - 20 }}
          >
            <Sparkles className="w-8 h-8 text-yellow-300 animate-spin" />
            <span className="text-[9px] bg-purple-900/80 text-white px-1.5 py-0.5 rounded-md shadow-sm -mt-1 font-mono">
              Walk Here!
            </span>
          </motion.div>
        ))}

        <div className="text-center text-xs text-emerald-950 font-bold bg-white/40 backdrop-blur-xs py-1 rounded-full max-w-[280px] mx-auto pointer-events-none shadow-xs">
          👇 Tap on the grass to guide Mimi!
        </div>
      </div>
    </div>
  );
}
