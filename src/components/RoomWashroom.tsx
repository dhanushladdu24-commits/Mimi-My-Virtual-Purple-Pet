import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShowerHead, Droplets, Smile, Zap, RefreshCw } from 'lucide-react';

interface RoomWashroomProps {
  hygiene: number;
  soapBubbles: boolean;
  showerOn: boolean;
  brushingActive: boolean;
  onApplySoap: () => void;
  onToggleShower: () => void;
  onBrushTeeth: () => void;
  onToiletSession: () => void;
}

export default function RoomWashroom({
  hygiene,
  soapBubbles,
  showerOn,
  brushingActive,
  onApplySoap,
  onToggleShower,
  onBrushTeeth,
  onToiletSession,
}: RoomWashroomProps) {
  const [toiletTimer, setToiletTimer] = useState(false);
  const [teethSparkles, setTeethSparkles] = useState(false);

  const handleToilet = () => {
    if (toiletTimer) return;
    setToiletTimer(true);
    onToiletSession();
    setTimeout(() => {
      setToiletTimer(false);
    }, 2500);
  };

  const handleBrush = () => {
    onBrushTeeth();
    if (!brushingActive) {
      setTimeout(() => {
        setTeethSparkles(true);
        setTimeout(() => setTeethSparkles(false), 2000);
      }, 3000);
    }
  };

  return (
    <div
      className="relative w-full h-full flex flex-col justify-between overflow-hidden p-2"
      style={{
        background: 'linear-gradient(to bottom, #bae6fd 0%, #e0f2fe 60%, #bae6fd 100%)', // fresh tiles look
      }}
    >
      {/* Bathroom tiles wall details */}
      <div className="absolute inset-0 opacity-15 pointer-events-none grid grid-cols-6 grid-rows-8 gap-1">
        {Array.from({ length: 48 }).map((_, i) => (
          <div key={i} className="border border-slate-900 rounded-sm" />
        ))}
      </div>

      {/* Towel hanging */}
      <div className="absolute top-12 left-6 pointer-events-none flex flex-col items-center">
        <div className="w-12 h-1 bg-slate-400 rounded-full" />
        <div className="w-10 h-16 bg-pink-300 border-x-2 border-b-4 border-pink-400 rounded-b-md shadow-xs" />
      </div>

      {/* Shower head faucet visual */}
      <div className="absolute top-4 right-1/2 translate-x-1/2 flex flex-col items-center pointer-events-none">
        <div className="w-4 h-12 bg-slate-300 border-x border-slate-400" />
        <div className="w-16 h-8 bg-slate-400 rounded-t-full flex items-center justify-center shadow-md">
          <ShowerHead className="w-5 h-5 text-slate-100" />
        </div>
        {showerOn && (
          <div className="flex gap-1.5 mt-1">
            <Droplets className="w-4 h-4 text-sky-400 animate-bounce" />
            <Droplets className="w-4 h-4 text-sky-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        )}
      </div>

      {/* Toilet seat visually on the right */}
      <div className="absolute bottom-[30%] right-6 flex flex-col items-center select-none pointer-events-none">
        {toiletTimer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-yellow-100 text-yellow-800 font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-yellow-200 mb-1 z-10 animate-pulse"
          >
            FLUSHING! 🚽
          </motion.div>
        )}
        {/* Toilet tank */}
        <div className="w-12 h-16 bg-white border-2 border-slate-300 rounded-md shadow-xs flex justify-end p-1">
          <div className="w-2.5 h-1.5 bg-slate-200 rounded-sm border" />
        </div>
        {/* Toilet bowl */}
        <div className="w-16 h-10 bg-slate-100 border-2 border-slate-300 rounded-b-full shadow-sm -mt-2" />
        {/* Toilet lid */}
        <div className="w-18 h-3 bg-white border-2 border-slate-300 rounded-full -mt-10" />
      </div>

      {/* Sparkles on teeth when polished */}
      <AnimatePresence>
        {teethSparkles && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-12 pointer-events-none z-30 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: [1, 1.3, 1], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5 }}
              className="bg-white text-sky-500 font-black text-xs px-3 py-1 rounded-full shadow-lg border border-sky-200 flex items-center gap-1"
            >
              ✨ Sparkly Clean Teeth!
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WASHROOM CONTROL PANEL */}
      <div className="w-full bg-white/95 border border-sky-300 rounded-xl p-2.5 shadow-lg z-20 flex flex-col gap-1.5 mt-auto">
        <div className="flex justify-between items-center">
          <span className="text-xs font-black text-sky-900 flex items-center gap-1">
            🧼 Mimi's Bath & Clean Room
          </span>
          <span className="text-[9px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full flex items-center gap-1">
            <RefreshCw className="w-2.5 h-2.5 text-sky-500 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Clean: {hygiene}%</span>
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border">
          <div
            className="bg-sky-400 h-full transition-all duration-500"
            style={{ width: `${hygiene}%` }}
          />
        </div>

        {/* Bath Utilities Grid */}
        <div className="grid grid-cols-4 gap-1.5">
          {/* Apply Soap */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onApplySoap}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-lg border transition-all ${
              soapBubbles
                ? 'bg-blue-100 border-blue-400 text-blue-900'
                : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="text-xl">🧼</span>
            <span className="text-[8.5px] font-black">Soap</span>
          </motion.button>

          {/* Toggle Shower */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onToggleShower}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-lg border transition-all ${
              showerOn
                ? 'bg-sky-400 border-sky-500 text-white animate-pulse'
                : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="text-xl">🚿</span>
            <span className="text-[8.5px] font-black">
              {showerOn ? 'Shower: ON' : 'Shower'}
            </span>
          </motion.button>

          {/* Toothbrush */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleBrush}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-lg border transition-all ${
              brushingActive
                ? 'bg-amber-100 border-amber-400 text-amber-900'
                : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="text-xl">🪥</span>
            <span className="text-[8.5px] font-black">Brush</span>
          </motion.button>

          {/* Use Toilet */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleToilet}
            disabled={toiletTimer}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-lg border transition-all ${
              toiletTimer
                ? 'bg-emerald-100 border-emerald-400 text-emerald-950 opacity-80'
                : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="text-xl">🚽</span>
            <span className="text-[8.5px] font-black">Toilet</span>
          </motion.button>
        </div>

        <div className="text-center text-[8.5px] text-sky-950 bg-sky-50 rounded-md py-0.5 px-1.5 border border-sky-200/50">
          💡 Soap 🧼 then click Shower 🚿 to wash Mimi clean!
        </div>
      </div>
    </div>
  );
}
