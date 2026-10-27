import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface MimiPetProps {
  status: 'idle' | 'eating' | 'sleeping' | 'washing' | 'brushing' | 'walking' | 'happy' | 'sad';
  hunger: number;
  hygiene: number;
  energy: number;
  happiness: number;
  isLightOff: boolean;
  soapBubbles: boolean; // whether covered in soap
  showerOn: boolean;    // whether water is running
  brushingActive: boolean; // whether teeth brushing is happening
  positionX: number; // 0 to 100 representing horizontal percentage of screen
  onTap?: () => void;
  message?: string;
  equippedHead?: string | null;
  equippedEyes?: string | null;
  equippedNeck?: string | null;
  equippedColor?: string | null;
  equippedClothes?: string | null;
  growthScale?: number;
}

const COLOR_GRADIENTS: Record<string, { start: string; end: string; belly: string; stroke: string; backPaw: string }> = {
  classicViolet: { start: '#c084fc', end: '#8b5cf6', belly: '#edd9ff', stroke: '#4c1d95', backPaw: '#7c3aed' },
  cherryPink: { start: '#fbcfe8', end: '#ec4899', belly: '#fff1f2', stroke: '#9f1239', backPaw: '#db2777' },
  mintMatcha: { start: '#a7f3d0', end: '#10b981', belly: '#ecfdf5', stroke: '#065f46', backPaw: '#059669' },
  cosmicCyan: { start: '#99f6e4', end: '#06b6d4', belly: '#ecfeff', stroke: '#155e75', backPaw: '#0891b2' },
  goldenCaramel: { start: '#fde68a', end: '#d97706', belly: '#fffbeb', stroke: '#78350f', backPaw: '#b45309' },
  sakuraRose: { start: '#fed7aa', end: '#f43f5e', belly: '#fff1f2', stroke: '#9f1239', backPaw: '#e11d48' },
  starryObsidian: { start: '#94a3b8', end: '#334155', belly: '#f1f5f9', stroke: '#0f172a', backPaw: '#1e293b' },
};

export default function MimiPet({
  status,
  hunger,
  hygiene,
  energy,
  happiness,
  isLightOff,
  soapBubbles,
  showerOn,
  brushingActive,
  positionX,
  onTap,
  message,
  equippedHead = null,
  equippedEyes = null,
  equippedNeck = null,
  equippedColor = null,
  equippedClothes = null,
  growthScale = 1.0,
}: MimiPetProps) {
  const colorConfig = (equippedColor && COLOR_GRADIENTS[equippedColor]) || COLOR_GRADIENTS.classicViolet;
  const [isBlinking, setIsBlinking] = useState(false);
  const [lookDirection, setLookDirection] = useState<'center' | 'left' | 'right'>('center');
  const [meowText, setMeowText] = useState<string | null>(null);

  // Blinking cycle
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 150);
    }, 4000 + Math.random() * 3000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Look around cycle
  useEffect(() => {
    const lookInterval = setInterval(() => {
      const r = Math.random();
      if (r < 0.6) setLookDirection('center');
      else if (r < 0.8) setLookDirection('left');
      else setLookDirection('right');
    }, 5000);

    return () => clearInterval(lookInterval);
  }, []);

  // Handle Mimi Tap Reaction
  const handlePetClick = () => {
    if (isLightOff) return; // don't wake up unless clicked bed
    const meowSounds = ['Meow! 🐾', 'Purrr... 💜', 'Mew! ✨', 'Prrrt! 🐱'];
    const randomMeow = meowSounds[Math.floor(Math.random() * meowSounds.length)];
    setMeowText(randomMeow);
    setTimeout(() => {
      setMeowText(null);
    }, 1500);

    if (onTap) {
      onTap();
    }
  };

  // Determine eyes and mouth states
  const getEyeDpath = () => {
    if (isLightOff || status === 'sleeping') {
      // Sleeping curved eyes closed
      return {
        left: 'M 25 50 Q 35 60 45 50',
        right: 'M 55 50 Q 65 60 75 50',
        isClosed: true,
      };
    }
    if (isBlinking) {
      // Blink lines
      return {
        left: 'M 25 50 L 45 50',
        right: 'M 55 50 L 75 50',
        isClosed: true,
      };
    }
    if (status === 'eating' || status === 'happy' || happiness > 80) {
      // Cute happy curved up eyes (^ ^)
      return {
        left: 'M 25 54 Q 35 44 45 54',
        right: 'M 55 54 Q 65 44 75 54',
        isClosed: true,
      };
    }
    if (hunger < 25 || hygiene < 25 || happiness < 25) {
      // Slightly sad looking eyes (downward slopes or just normal circular pupils)
      return {
        left: null,
        right: null,
        isClosed: false,
        isSad: true,
      };
    }
    return {
      left: null,
      right: null,
      isClosed: false,
    };
  };

  const eyeState = getEyeDpath();

  // Pupils horizontal displacement
  let pupilOffsetX = 0;
  if (lookDirection === 'left') pupilOffsetX = -3;
  if (lookDirection === 'right') pupilOffsetX = 3;

  return (
    <div 
      className="relative flex flex-col items-center select-none"
      style={{
        width: '100%',
        maxWidth: '460px',
        transform: `scale(${growthScale})`,
        transformOrigin: 'bottom center',
        transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* 2D Floating particles when happy, being pampered, washed or having high happiness */}
      <AnimatePresence>
        {(status === 'happy' || status === 'washing' || status === 'brushing' || happiness > 80) && (
          <div className="absolute inset-0 pointer-events-none z-25 overflow-visible">
            {[...Array(6)].map((_, idx) => {
              const symbols = ['❤️', '✨', '⭐', '🎵', '🌸', '💖'];
              const symbol = symbols[idx % symbols.length];
              return (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, scale: 0.4, y: 150, x: (idx - 2.5) * 25 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0.5, 1.2, 1, 0.7],
                    y: [150, -40],
                    x: [(idx - 2.5) * 25, (idx - 2.5) * 25 + (idx % 2 === 0 ? 15 : -15)],
                    rotate: [0, idx % 2 === 0 ? 45 : -45]
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    delay: idx * 0.35,
                    ease: 'easeOut'
                  }}
                  className="absolute text-lg select-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
                  style={{
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                >
                  {symbol}
                </motion.span>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Speech Bubble / Mimi Thoughts */}
      <AnimatePresence>
        {(message || meowText) && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            className="absolute -top-16 bg-white border-2 border-purple-300 text-purple-700 font-bold px-4 py-2 rounded-2xl shadow-lg z-30 flex items-center gap-1 text-sm md:text-base before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-t-white after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-10 after:border-transparent after:border-t-purple-300 after:-z-10"
          >
            {meowText || message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating ZZZ animation during sleep */}
      <AnimatePresence>
        {(isLightOff || status === 'sleeping') && (
          <div className="absolute top-0 right-10 pointer-events-none z-20">
            {[1, 2, 3].map((i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.5, y: 20, x: 0 }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0.6, 1.2, 0.8],
                  y: [-10, -80],
                  x: [0, i % 2 === 0 ? 15 : -15, i % 2 === 0 ? 30 : -30]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.8,
                  ease: 'easeOut',
                }}
                className="absolute text-purple-400 font-extrabold text-2xl"
              >
                Z
              </motion.span>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Grounded 2D flat shadow under Mimi's feet that breathes and moves dynamically */}
      <motion.div
        animate={
          status === 'sleeping' || isLightOff
            ? { scaleX: [0.92, 1.05, 0.92], opacity: [0.18, 0.22, 0.18] }
            : status === 'walking'
            ? { scaleX: [1.05, 0.85, 1.05], opacity: [0.15, 0.22, 0.15], y: [0, 1, 0] }
            : { scaleX: [1, 1.05, 1], opacity: [0.15, 0.18, 0.15] }
        }
        transition={{
          duration: status === 'walking' ? 0.35 : 3.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-2.5 w-[140px] h-[10px] bg-purple-950/20 rounded-full blur-[1px] pointer-events-none z-0"
      />

      {/* Main Mimi Body Animation Container */}
      <motion.div
        animate={
          status === 'sleeping' || isLightOff
            ? { 
                scaleY: [0.95, 0.98, 0.95],
                y: 10,
                rotate: [0, 0, 0]
              }
            : status === 'walking'
            ? {
                scaleY: [1, 1.05, 1],
                scaleX: [1, 0.98, 1],
                rotate: [-2, 2, -2],
                y: [0, -6, 0]
              }
            : status === 'eating'
            ? {
                scaleY: [1, 1.04, 1],
                scaleX: [1, 1.02, 1],
                y: [0, -3, 0],
              }
            : {
                // Idle breathing
                scaleY: [1, 1.02, 1],
                y: [0, -2, 0],
              }
        }
        transition={{
          duration: status === 'walking' ? 0.35 : status === 'eating' ? 0.25 : 3.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        onClick={handlePetClick}
        className="cursor-pointer relative w-full h-[320px] md:h-[400px] flex justify-center items-end"
      >
        {/* SVG Drawing of Mimi the Purple Kitten */}
        <svg
          viewBox="0 0 100 110"
          className="w-full h-full drop-shadow-[0_8px_16px_rgba(139,92,246,0.15)] overflow-visible"
        >
          {/* DEFINITIONS FOR GRADIENTS AND FILTERS */}
          <defs>
            <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colorConfig.start} />
              <stop offset="100%" stopColor={colorConfig.end} />
            </linearGradient>
            <linearGradient id="innerEarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fda4af" /> {/* Rose-300 */}
              <stop offset="100%" stopColor="#f43f5e" /> {/* Rose-500 */}
            </linearGradient>
            <linearGradient id="soapBubbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#e0f2fe" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          {/* TAIL */}
          <motion.path
            d="M 68 85 C 80 82, 88 65, 84 52 C 81 42, 73 40, 75 48 C 77 56, 73 75, 62 82 Z"
            fill="url(#purpleGrad)"
            stroke={colorConfig.stroke}
            strokeWidth="3"
            strokeLinejoin="round"
            animate={
              status === 'sleeping' || isLightOff
                ? { rotate: [0, 2, 0] }
                : status === 'happy' || happiness > 75
                ? { rotate: [-10, 15, -10], y: [0, -3, 0] }
                : { rotate: [-4, 6, -4] }
            }
            transition={{
              duration: status === 'happy' || happiness > 75 ? 0.6 : 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ originX: '65%', originY: '85%' }}
          />

          {/* EARS */}
          {/* Left Ear */}
          <motion.path
            d="M 15 42 L 10 12 Q 22 20 32 30 Z"
            fill="url(#purpleGrad)"
            stroke={colorConfig.stroke}
            strokeWidth="3"
            strokeLinejoin="round"
            animate={status === 'happy' ? { rotate: [0, -8, 0] } : { rotate: [0, 0, 0] }}
            transition={{ duration: 0.5, repeat: status === 'happy' ? 3 : 0 }}
            style={{ originX: '25%', originY: '35%' }}
          />
          {/* Left Inner Ear */}
          <path d="M 18 38 L 14 18 Q 23 24 29 30 Z" fill="url(#innerEarGrad)" stroke={colorConfig.stroke} strokeWidth="1" opacity="0.85" />

          {/* Right Ear */}
          <motion.path
            d="M 85 42 L 90 12 Q 78 20 68 30 Z"
            fill="url(#purpleGrad)"
            stroke={colorConfig.stroke}
            strokeWidth="3"
            strokeLinejoin="round"
            animate={status === 'happy' ? { rotate: [0, 8, 0] } : { rotate: [0, 0, 0] }}
            transition={{ duration: 0.5, repeat: status === 'happy' ? 3 : 0 }}
            style={{ originX: '75%', originY: '35%' }}
          />
          {/* Right Inner Ear */}
          <path d="M 82 38 L 86 18 Q 77 24 71 30 Z" fill="url(#innerEarGrad)" stroke={colorConfig.stroke} strokeWidth="1" opacity="0.85" />

          {/* PAWS BACK (Legs sitting or walking) */}
          <g>
            {/* Back paw Left */}
            <ellipse cx="28" cy="98" rx="8" ry="5" fill={colorConfig.backPaw} stroke={colorConfig.stroke} strokeWidth="3" />
            {/* Back paw Right */}
            <ellipse cx="72" cy="98" rx="8" ry="5" fill={colorConfig.backPaw} stroke={colorConfig.stroke} strokeWidth="3" />
          </g>

          {/* BODY */}
          <path
            d="M 25 70 C 20 85, 20 95, 30 100 C 40 102, 60 102, 70 100 C 80 95, 80 85, 75 70 C 72 58, 28 58, 25 70 Z"
            fill="url(#purpleGrad)"
            stroke={colorConfig.stroke}
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Cute Belly patch (lighter purple/lavender) */}
          <ellipse cx="50" cy="84" rx="16" ry="12" fill={colorConfig.belly} stroke={colorConfig.stroke} strokeWidth="1.5" />

          {/* EQUIPPED CLOTHES / DRESSES */}
          {equippedClothes === 'pinkTutu' && (
            <g id="acc-clothes-tutu">
              {/* Tutu body top */}
              <path d="M 30 71 Q 50 76 70 71 L 68 84 Q 50 87 32 84 Z" fill="#f472b6" stroke="#be185d" strokeWidth="2" />
              {/* frilly pink tutu skirt at bottom */}
              <path d="M 17 83 C 17 83, 21 97, 31 99 C 41 101, 59 101, 69 99 C 79 97, 83 83, 83 83 Q 50 89 17 83 Z" fill="#f472b6" stroke="#be185d" strokeWidth="2" opacity="0.95" />
              {/* skirt fold lines */}
              <path d="M 35 85 Q 32 94 34 97" fill="none" stroke="#db2777" strokeWidth="1.2" />
              <path d="M 50 86 Q 50 95 50 98" fill="none" stroke="#db2777" strokeWidth="1.2" />
              <path d="M 65 85 Q 68 94 66 97" fill="none" stroke="#db2777" strokeWidth="1.2" />
            </g>
          )}

          {equippedClothes === 'detectiveCoat' && (
            <g id="acc-clothes-detective">
              <path d="M 24 71 C 22 84, 21 94, 30 99 C 40 101, 60 101, 70 99 C 79 94, 78 84, 76 71 Q 50 77 24 71 Z" fill="#b45309" stroke="#451a03" strokeWidth="2" />
              {/* lapels */}
              <polygon points="32,70 42,80 34,80" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
              <polygon points="68,70 58,80 66,80" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
              {/* black belt */}
              <rect x="29" y="85" width="42" height="4.5" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
              <rect x="47" y="83" width="6" height="8.5" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
            </g>
          )}

          {equippedClothes === 'royalTunic' && (
            <g id="acc-clothes-royal">
              <path d="M 24 71 C 22 84, 21 94, 30 99 C 40 101, 60 101, 70 99 C 79 94, 78 84, 76 71 Q 50 77 24 71 Z" fill="#dc2626" stroke="#7f1d1d" strokeWidth="2" />
              {/* gold trim collar */}
              <path d="M 25 70 Q 50 77 75 70" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
              {/* golden star buttons */}
              <circle cx="50" cy="79" r="2" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
              <circle cx="50" cy="87" r="2" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
              {/* gold lace at bottom hem */}
              <path d="M 30 99 Q 50 101 70 99" fill="none" stroke="#fbbf24" strokeWidth="2" />
            </g>
          )}

          {equippedClothes === 'superHeroSuit' && (
            <g id="acc-clothes-hero">
              <path d="M 24 71 C 22 84, 21 94, 30 99 C 40 101, 60 101, 70 99 C 79 94, 78 84, 76 71 Q 50 77 24 71 Z" fill="#2563eb" stroke="#1e3a8a" strokeWidth="2" />
              {/* Yellow star on chest */}
              <path d="M 50 73 L 52 77 L 56 77 L 53 80 L 54 84 L 50 81 L 46 84 L 47 80 L 44 77 L 48 77 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
              {/* red sash belt */}
              <rect x="29" y="86" width="42" height="4" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
            </g>
          )}

          {/* FRONT PAWS (Walking steps or reaching up) */}
          {/* Left Front Leg/Paw */}
          <motion.ellipse
            cx="40"
            cy="97"
            rx="6"
            ry="4"
            fill={colorConfig.belly}
            stroke={colorConfig.stroke}
            strokeWidth="2.5"
            animate={
              status === 'walking'
                ? { y: [0, -6, 0], cx: [40, 38, 40] }
                : status === 'happy'
                ? { y: [0, -12, 0] }
                : {}
            }
            transition={{ duration: status === 'walking' ? 0.35 : 0.5, repeat: Infinity }}
          />
          {/* Right Front Leg/Paw */}
          <motion.ellipse
            cx="60"
            cy="97"
            rx="6"
            ry="4"
            fill={colorConfig.belly}
            stroke={colorConfig.stroke}
            strokeWidth="2.5"
            animate={
              status === 'walking'
                ? { y: [-6, 0, -6], cx: [60, 62, 60] }
                : status === 'happy'
                ? { y: [0, -12, 0], delay: 0.1 }
                : {}
            }
            transition={{ duration: status === 'walking' ? 0.35 : 0.5, repeat: Infinity }}
          />

          {/* HEAD */}
          <motion.ellipse
            cx="50"
            cy="48"
            rx="35"
            ry="26"
            fill="url(#purpleGrad)"
            stroke={colorConfig.stroke}
            strokeWidth="3"
            strokeLinejoin="round"
            animate={status === 'eating' ? { y: [0, -2, 1, 0] } : {}}
            transition={{ duration: 0.25, repeat: status === 'eating' ? Infinity : 0 }}
          />

          {/* EYE CHEEKS (Blushing) */}
          <circle cx="23" cy="54" r="5" fill="#f43f5e" opacity="0.3" />
          <circle cx="77" cy="54" r="5" fill="#f43f5e" opacity="0.3" />

          {/* EYES */}
          {eyeState.isClosed ? (
            // Closed / Blinking / Sleeping eyes (rendered as paths)
            <g>
              <path
                d={eyeState.left || ''}
                stroke={colorConfig.stroke}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d={eyeState.right || ''}
                stroke={colorConfig.stroke}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          ) : (
            // Open cute eyes
            <g>
              {/* Left Eye Ball */}
              <circle cx="33" cy="48" r="8" fill="#311b92" />
              {/* Right Eye Ball */}
              <circle cx="67" cy="48" r="8" fill="#311b92" />

              {/* Pupils with Looking Offset */}
              {/* Left Pupil */}
              <circle cx={33 + pupilOffsetX} cy="48" r="5" fill="#1e1b4b" />
              {/* Right Pupil */}
              <circle cx={67 + pupilOffsetX} cy="48" r="5" fill="#1e1b4b" />

              {/* Eye sparkle highlights (reflections) */}
              {/* Left highlights */}
              <circle cx={30.5 + pupilOffsetX} cy="45.5" r="2.2" fill="#ffffff" />
              <circle cx={34.5 + pupilOffsetX} cy="50.5" r="0.9" fill="#ffffff" />
              {/* Right highlights */}
              <circle cx={64.5 + pupilOffsetX} cy="45.5" r="2.2" fill="#ffffff" />
              <circle cx={68.5 + pupilOffsetX} cy="50.5" r="0.9" fill="#ffffff" />

              {/* Sad downward eyebrow hints if unhappy */}
              {eyeState.isSad && (
                <g>
                  {/* Left Eyebrow slanted */}
                  <path d="M 27 37 Q 33 41 38 41" stroke={colorConfig.stroke} strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  {/* Right Eyebrow slanted */}
                  <path d="M 73 37 Q 67 41 62 41" stroke={colorConfig.stroke} strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </g>
              )}
            </g>
          )}

          {/* NOSE */}
          <polygon points="48,55 52,55 50,57.5" fill="#ec407a" />

          {/* MOUTH */}
          {status === 'eating' ? (
            // Chewing open mouth
            <motion.ellipse
              cx="50"
              cy="62"
              rx="4"
              ry="3"
              fill="#881337"
              animate={{ ry: [1, 4, 1] }}
              transition={{ duration: 0.25, repeat: Infinity }}
            />
          ) : hunger < 30 || happiness < 30 ? (
            // Frown / Sad mouth
            <path
              d="M 46 64 Q 50 61 54 64"
              stroke={colorConfig.stroke}
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            // Happy "w" wavy kitten smile
            <path
              d="M 45 61 C 45 64, 50 64, 50 61 C 50 64, 55 64, 55 61"
              stroke={colorConfig.stroke}
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* WHISKERS */}
          {/* Left Whiskers */}
          <line x1="22" y1="56" x2="6" y2="54" stroke={colorConfig.stroke} strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          <line x1="21" y1="59" x2="5" y2="60" stroke={colorConfig.stroke} strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          <line x1="22" y1="62" x2="8" y2="66" stroke={colorConfig.stroke} strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />

          {/* Right Whiskers */}
          <line x1="78" y1="56" x2="94" y2="54" stroke={colorConfig.stroke} strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          <line x1="79" y1="59" x2="95" y2="60" stroke={colorConfig.stroke} strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          <line x1="78" y1="62" x2="92" y2="66" stroke={colorConfig.stroke} strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />

          {/* SMUDGE MARKS IF EXTREMELY DIRTY (hygiene < 35) */}
          {hygiene < 35 && (
            <g opacity="0.65">
              <path d="M 28 78 Q 29 82 25 83 Q 23 80 28 78 Z" fill="#8d5b4c" />
              <path d="M 64 88 Q 66 91 63 93 Q 61 90 64 88 Z" fill="#8d5b4c" />
              <circle cx="54" cy="40" r="2" fill="#8d5b4c" />
              {/* Fly insect buzzing */}
              <motion.g
                animate={{ x: [-2, 2, -2], y: [-3, 3, -3] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              >
                <circle cx="16" cy="30" r="1" fill="#222" />
                <ellipse cx="14" cy="29" rx="1.5" ry="0.8" fill="#e2e8f0" opacity="0.7" />
                <ellipse cx="18" cy="29" rx="1.5" ry="0.8" fill="#e2e8f0" opacity="0.7" />
              </motion.g>
            </g>
          )}

          {/* SOAP BUBBLES OVERLAY */}
          {soapBubbles && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Bunch of foam on body and head */}
              <circle cx="30" cy="85" r="7" fill="url(#soapBubbleGrad)" stroke="#cbd5e1" strokeWidth="0.5" />
              <circle cx="34" cy="89" r="5" fill="url(#soapBubbleGrad)" stroke="#cbd5e1" strokeWidth="0.5" />
              <circle cx="48" cy="80" r="8" fill="url(#soapBubbleGrad)" stroke="#cbd5e1" strokeWidth="0.5" />
              <circle cx="55" cy="82" r="6.5" fill="url(#soapBubbleGrad)" stroke="#cbd5e1" strokeWidth="0.5" />
              <circle cx="68" cy="87" r="8" fill="url(#soapBubbleGrad)" stroke="#cbd5e1" strokeWidth="0.5" />
              <circle cx="30" cy="40" r="6" fill="url(#soapBubbleGrad)" stroke="#cbd5e1" strokeWidth="0.5" />
              <circle cx="50" cy="30" r="7" fill="url(#soapBubbleGrad)" stroke="#cbd5e1" strokeWidth="0.5" />
              <circle cx="70" cy="38" r="5" fill="url(#soapBubbleGrad)" stroke="#cbd5e1" strokeWidth="0.5" />
            </motion.g>
          )}

          {/* WATER RUNNING DROPLETS (SHOWERING EFFECT) */}
          {showerOn && (
            <g>
              {[1, 2, 3, 4, 5, 6, 7].map((line, idx) => (
                <motion.line
                  key={idx}
                  x1={20 + idx * 10}
                  y1="5"
                  x2={20 + idx * 10}
                  y2="105"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="5,15"
                  strokeLinecap="round"
                  animate={{ strokeDashoffset: [0, -60] }}
                  transition={{ duration: 0.6, repeat: Infinity, ease: 'linear', delay: idx * 0.1 }}
                />
              ))}
            </g>
          )}

          {/* DENTAL FOAM IF BRUSHING */}
          {brushingActive && (
            <motion.g
              animate={{ scale: [0.9, 1.1, 0.9], x: [-1, 1, -1] }}
              transition={{ duration: 0.3, repeat: Infinity }}
            >
              <circle cx="46" cy="62" r="3.5" fill="#f8fafc" stroke="#38bdf8" strokeWidth="0.5" />
              <circle cx="50" cy="61" r="4.5" fill="#f8fafc" stroke="#38bdf8" strokeWidth="0.5" />
              <circle cx="54" cy="62" r="3.5" fill="#f8fafc" stroke="#38bdf8" strokeWidth="0.5" />
              <circle cx="50" cy="64" r="3.2" fill="#f8fafc" stroke="#38bdf8" strokeWidth="0.5" />
            </motion.g>
          )}

          {/* ================= ACCESSORIES LAYERS ================= */}
          {/* 1. NECK ACCESSORY */}
          {equippedNeck === 'goldBellCollar' && (
            <g id="acc-neck-collar">
              {/* Collar band */}
              <path d="M 32 71 Q 50 75 68 71" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
              {/* Gold bell */}
              <circle cx="50" cy="74" r="4.5" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" />
              <circle cx="50" cy="74" r="1" fill="#78350f" />
              <line x1="48" y1="75.5" x2="52" y2="75.5" stroke="#78350f" strokeWidth="1" />
            </g>
          )}

          {equippedNeck === 'redBowtie' && (
            <g id="acc-neck-bowtie">
              <path d="M 50 71 L 42 66 L 42 76 Z" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1.5" />
              <path d="M 50 71 L 58 66 L 58 76 Z" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1.5" />
              <rect x="48" y="68" width="4" height="6" rx="1" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1" />
            </g>
          )}

          {equippedNeck === 'royalCape' && (
            <g id="acc-neck-cape">
              {/* Fluffy white collar */}
              <ellipse cx="50" cy="71" rx="15" ry="3.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <circle cx="34" cy="71" r="3" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              <circle cx="66" cy="71" r="3" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              {/* Golden brooch */}
              <circle cx="50" cy="72" r="2.5" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
            </g>
          )}

          {/* 2. EYES ACCESSORY */}
          {equippedEyes === 'coolShades' && (
            <g id="acc-eyes-shades">
              <polygon points="22,44 44,44 40,54 26,54" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
              <polygon points="56,44 78,44 74,54 60,54" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
              <rect x="42" y="45" width="16" height="2.5" fill="#1e293b" stroke="#475569" strokeWidth="1" />
              <line x1="26" y1="46" x2="32" y2="52" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
              <line x1="60" y1="46" x2="66" y2="52" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
            </g>
          )}

          {equippedEyes === 'cuteMonocle' && (
            <g id="acc-eyes-monocle">
              <circle cx="67" cy="48" r="9.5" fill="none" stroke="#fbbf24" strokeWidth="2" />
              <path d="M 76.5 48 Q 84 56 80 66" fill="none" stroke="#fbbf24" strokeWidth="1.2" strokeDasharray="1.5,1.5" />
            </g>
          )}

          {equippedEyes === 'starGlasses' && (
            <g id="acc-eyes-star">
              {/* Left Star */}
              <path d="M 33 39 L 36 44 L 42 44.5 L 37.5 48.5 L 39 54 L 33 50.5 L 27 54 L 28.5 48.5 L 24 44.5 L 30 44 Z" fill="#ec4899" stroke="#9d174d" strokeWidth="1.5" opacity="0.9" />
              {/* Right Star */}
              <path d="M 67 39 L 70 44 L 76 44.5 L 71.5 48.5 L 73 54 L 67 50.5 L 61 54 L 62.5 48.5 L 58 44.5 L 64 44 Z" fill="#ec4899" stroke="#9d174d" strokeWidth="1.5" opacity="0.9" />
              {/* Bridge */}
              <line x1="40" y1="45" x2="60" y2="45" stroke="#9d174d" strokeWidth="2.5" />
            </g>
          )}

          {/* 3. HEAD ACCESSORY */}
          {equippedHead === 'crown' && (
            <g id="acc-head-crown">
              <path d="M 34 23 L 30 11 L 40 17 L 50 7 L 60 17 L 70 11 L 66 23 Z" fill="#f59e0b" stroke="#78350f" strokeWidth="2.5" strokeLinejoin="round" />
              <circle cx="50" cy="8.5" r="2" fill="#ef4444" />
              <circle cx="30" cy="12.5" r="2" fill="#3b82f6" />
              <circle cx="70" cy="12.5" r="2" fill="#3b82f6" />
              <circle cx="50" cy="18.5" r="1.5" fill="#10b981" />
              <circle cx="40" cy="18.5" r="1.5" fill="#8b5cf6" />
              <circle cx="60" cy="18.5" r="1.5" fill="#ec4899" />
            </g>
          )}

          {equippedHead === 'partyHat' && (
            <g id="acc-head-party">
              <path d="M 36 23 L 50 1 L 64 23 Z" fill="#a855f7" stroke="#581c87" strokeWidth="2.5" strokeLinejoin="round" />
              {/* Stripes */}
              <path d="M 40 17 Q 48 13 58 17" fill="none" stroke="#f43f5e" strokeWidth="2" />
              <path d="M 44 11 Q 49 9 55 11" fill="none" stroke="#10b981" strokeWidth="2" />
              {/* Pom-pom */}
              <circle cx="50" cy="1" r="3.5" fill="#fbbf24" stroke="#d97706" strokeWidth="1.2" />
            </g>
          )}

          {equippedHead === 'detectiveHat' && (
            <g id="acc-head-detective">
              <path d="M 32 23 C 32 11, 68 11, 68 23 Z" fill="#78350f" stroke="#451a03" strokeWidth="2.5" />
              <ellipse cx="50" cy="23" rx="20" ry="4" fill="#a16207" stroke="#451a03" strokeWidth="2" />
              {/* Ribon */}
              <rect x="33" y="19" width="34" height="3" fill="#dc2626" />
            </g>
          )}

          {equippedHead === 'redBow' && (
            <g id="acc-head-bow">
              {/* Bow on Left Ear base */}
              <path d="M 32 30 L 22 22 L 25 35 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M 32 30 L 42 22 L 39 35 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" strokeLinejoin="round" />
              <circle cx="32" cy="30" r="3.5" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
            </g>
          )}
        </svg>

        {/* BRUSH OBJECT VISUALIZED ON SCREEN DURING BRUSHING */}
        {brushingActive && (
          <motion.div
            className="absolute z-20 pointer-events-none"
            animate={{
              x: [-15, 15, -15],
              y: [20, 15, 20],
              rotate: [-10, 10, -10],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              top: '50%',
              left: '42%',
            }}
          >
            <div className="flex items-center">
              <div className="w-12 h-3 bg-sky-200 border border-sky-400 rounded-l-full" />
              <div className="w-4 h-6 bg-white border border-slate-300 rounded-r-md flex flex-col justify-between p-0.5">
                <div className="w-full h-1 bg-sky-400" />
                <div className="w-full h-1 bg-sky-400" />
                <div className="w-full h-1 bg-sky-400" />
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
