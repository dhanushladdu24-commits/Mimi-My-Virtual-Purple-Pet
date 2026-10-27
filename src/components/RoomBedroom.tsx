import React from 'react';
import { motion } from 'motion/react';
import { Lightbulb, Moon, Star, RefreshCw } from 'lucide-react';

interface RoomBedroomProps {
  isLightOff: boolean;
  onToggleLight: () => void;
  energy: number;
}

export default function RoomBedroom({ isLightOff, onToggleLight, energy }: RoomBedroomProps) {
  return (
    <div
      className="relative w-full h-full flex flex-col justify-between overflow-hidden transition-all duration-700 p-2"
      style={{
        background: isLightOff
          ? 'linear-gradient(to bottom, #0f172a 0%, #1e1b4b 60%, #311b92 100%)' // Night dark blue/indigo
          : 'linear-gradient(to bottom, #ede9fe 0%, #ddd6fe 60%, #c084fc 100%)', // Day cozy lavender
      }}
    >
      {/* Night Sky / Moon */}
      {isLightOff ? (
        <div className="absolute inset-0 pointer-events-none">
          {/* Star particles */}
          {[1, 2, 3, 4, 5, 6].map((st) => (
            <motion.div
              key={st}
              className="absolute text-yellow-200"
              style={{
                top: `${15 + st * 12}%`,
                left: `${10 + (st * 17) % 80}%`,
              }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2 + st, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Star className="w-3 h-3 fill-yellow-200" />
            </motion.div>
          ))}
          {/* Big Moon */}
          <motion.div
            className="absolute top-6 left-8"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Moon className="w-14 h-14 text-yellow-100 fill-yellow-100 filter drop-shadow-[0_0_8px_rgba(253,224,71,0.4)]" />
          </motion.div>
        </div>
      ) : (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-6 left-8 bg-amber-100/50 rounded-full px-3 py-1 font-bold text-xs text-purple-900 border border-purple-200">
            ☀️ Morning Sleep Time
          </div>
        </div>
      )}

      {/* Cozy bedroom window */}
      <div
        className={`absolute top-10 right-10 w-24 h-32 rounded-t-full border-4 ${
          isLightOff ? 'bg-slate-950 border-slate-800' : 'bg-sky-100 border-white'
        } shadow-md overflow-hidden flex flex-col justify-end p-2`}
      >
        {!isLightOff && (
          <div className="w-full h-8 bg-gradient-to-t from-orange-300 to-transparent opacity-80" />
        )}
      </div>

      {/* BED & NIGHT LAMP GRAPHICS (Bottom side) */}
      <div className="w-full flex justify-between items-end relative z-10 mt-auto">
        {/* Nightstand with lamp */}
        <div className="flex flex-col items-center select-none pb-2">
          {/* Lamp shade & light glow */}
          <div className="relative flex flex-col items-center">
            {/* Light glow overlay */}
            {!isLightOff && (
              <motion.div
                className="absolute top-[-20px] w-28 h-28 bg-yellow-300/30 rounded-full blur-xl pointer-events-none"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            {/* Lamp shade */}
            <div className={`w-14 h-10 rounded-t-lg border ${isLightOff ? 'bg-amber-900 border-amber-950' : 'bg-yellow-100 border-yellow-300'} shadow-sm`} />
            {/* Lamp base */}
            <div className="w-2 h-8 bg-slate-400" />
            <div className="w-10 h-2 bg-slate-500 rounded-sm" />
          </div>
          {/* Little drawer table */}
          <div className="w-16 h-12 bg-purple-900 border border-purple-950 rounded-md mt-1 flex flex-col justify-center items-center">
            <div className="w-6 h-1 bg-yellow-400 rounded-full" />
          </div>
        </div>

        {/* Cozy Purple Bed */}
        <div className="relative w-44 h-24 bg-purple-100 border-t-4 border-purple-400 rounded-t-2xl shadow-lg flex flex-col justify-between overflow-hidden">
          {/* Wooden bed posts */}
          <div className="absolute left-0 bottom-0 top-0 w-3 bg-amber-800 border-r border-amber-950" />
          <div className="absolute right-0 bottom-0 top-0 w-3 bg-amber-800 border-l border-amber-950" />

          {/* Pillow */}
          <div className="absolute left-5 top-2 w-14 h-8 bg-rose-200 rounded-lg shadow-sm border border-rose-300 flex items-center justify-center text-xs font-bold text-rose-800">
            Mimi
          </div>

          {/* Mattress sheet / blanket cover */}
          <div className="absolute bottom-0 left-3 right-3 h-14 bg-gradient-to-t from-purple-400 to-purple-300 border-t border-purple-200 p-2 flex justify-between items-end">
            <span className="text-[10px] font-extrabold text-purple-900 bg-white/60 px-1.5 py-0.5 rounded-sm">
              Cozy Bed 💤
            </span>
            <div className="flex gap-0.5">
              <span className="text-xs">⭐</span>
              <span className="text-xs">✨</span>
            </div>
          </div>
        </div>
      </div>

      {/* LIGHT LAMP TOGGLER AND CONTROLS (Top side buttons) */}
      <div className="w-full flex flex-col items-center gap-1.5 z-20 mt-1">
        {/* Bedroom Dashboard */}
        <div className="w-full max-w-[280px] bg-white/95 border border-purple-300 rounded-xl p-2.5 shadow-lg flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-purple-900">🛏️ Bedroom Control</span>
            <span className={`text-[8.5px] font-bold px-1.5 py-0.2 rounded-full ${isLightOff ? 'bg-indigo-900 text-indigo-100 animate-pulse' : 'bg-yellow-100 text-yellow-800'}`}>
              {isLightOff ? 'Sleeping 💤' : 'Idle ☀️'}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-purple-50 p-1.5 rounded-lg border border-purple-100">
            <div className="p-1 bg-purple-100 rounded-md">
              <RefreshCw className={`w-4 h-4 text-purple-600 ${isLightOff ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold text-purple-800">Energy Level</span>
                <span className="font-black text-purple-900">{energy}%</span>
              </div>
              <div className="w-full bg-slate-200 h-1 rounded-full mt-0.5 overflow-hidden">
                <div
                  className="bg-purple-500 h-full transition-all duration-500"
                  style={{ width: `${energy}%` }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={onToggleLight}
            className={`w-full py-1.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 border transition-all shadow-xs ${
              isLightOff
                ? 'bg-yellow-400 border-yellow-500 text-slate-900 hover:bg-yellow-300'
                : 'bg-indigo-950 border-indigo-900 text-white hover:bg-indigo-900'
            }`}
          >
            <Lightbulb className={`w-3.5 h-3.5 ${isLightOff ? 'animate-bounce text-slate-950' : 'text-yellow-300 fill-yellow-300'}`} />
            <span>{isLightOff ? 'Turn light ON ☀️' : 'Turn light OFF 🌙'}</span>
          </button>
        </div>

        <div className="text-center text-[8.5px] text-purple-950/80 bg-purple-50/90 rounded-full py-0.5 px-3 border border-purple-200/50 shadow-xs max-w-[240px]">
          {isLightOff 
            ? "💤 Shh! Mimi is sleeping and recovering energy..." 
            : "💡 Turn the light OFF to start Mimi's sleeping animation!"}
        </div>
      </div>
    </div>
  );
}
