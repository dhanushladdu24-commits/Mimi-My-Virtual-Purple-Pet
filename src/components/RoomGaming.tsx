import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, Award, Coins, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Zap } from 'lucide-react';
import { synthAudio } from '../utils/audio';

interface RoomGamingProps {
  onEarnCoins: (amount: number) => void;
  coins: number;
}

type MiniGame = 'none' | 'ballCatch' | 'bubblePop' | 'memoryMatch' | 'snake' | 'kittenRun';

export default function RoomGaming({ onEarnCoins, coins }: RoomGamingProps) {
  const [activeGame, setActiveGame] = useState<MiniGame>('none');
  const [earnedInSession, setEarnedInSession] = useState(0);

  // General return to arcade menu
  const exitToArcade = () => {
    synthAudio.playTransition();
    setActiveGame('none');
    setEarnedInSession(0);
  };

  const claimCoins = (amount: number) => {
    synthAudio.playCoinCollect();
    onEarnCoins(amount);
    setEarnedInSession((prev) => prev + amount);
  };

  return (
    <div
      className="relative w-full h-full flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #ddd6fe 0%, #c4b5fd 50%, #a78bfa 100%)', // vibrant gaming violet
      }}
    >
      <AnimatePresence mode="wait">
        {activeGame === 'none' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full h-full flex flex-col justify-between p-6"
          >
            {/* Header */}
            <div className="text-center">
              <span className="text-4xl">🎮</span>
              <h2 className="text-2xl font-extrabold text-purple-950 mt-1 tracking-tight">
                Mimi's Arcade
              </h2>
              <p className="text-xs text-purple-900 font-bold bg-white/40 px-4 py-1 rounded-full inline-block mt-1">
                Play games, win coins, buy delicious treats! 🪙
              </p>
            </div>

            {/* Scrollable list of games to prevent any overflow issues on mobile screens */}
            <div className="flex flex-col gap-2.5 my-auto overflow-y-auto max-h-[290px] pr-1 scrollbar-none py-1">
              {/* Ball Catch Card */}
              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  synthAudio.playPopup();
                  setActiveGame('ballCatch');
                }}
                className="bg-white hover:bg-purple-50 p-3 rounded-xl border-2 border-purple-400 shadow-sm flex items-center gap-3 cursor-pointer"
              >
                <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center text-2xl">
                  🧶
                </div>
                <div className="flex-1">
                  <h3 className="font-extrabold text-xs text-purple-950">Ball Catch</h3>
                  <p className="text-[9px] text-slate-500 font-medium">Catch falling yarn balls. Don't let them drop!</p>
                </div>
                <div className="bg-purple-100 text-purple-700 p-1.5 rounded-full">
                  <Play className="w-3 h-3 fill-purple-700" />
                </div>
              </motion.div>

              {/* Bubble Pop Card */}
              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  synthAudio.playPopup();
                  setActiveGame('bubblePop');
                }}
                className="bg-white hover:bg-purple-50 p-3 rounded-xl border-2 border-purple-400 shadow-sm flex items-center gap-3 cursor-pointer"
              >
                <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center text-2xl">
                  🫧
                </div>
                <div className="flex-1">
                  <h3 className="font-extrabold text-xs text-purple-950">Bubble Pop</h3>
                  <p className="text-[9px] text-slate-500 font-medium">Pop floating bubbles fast before the timer runs out!</p>
                </div>
                <div className="bg-purple-100 text-purple-700 p-1.5 rounded-full">
                  <Play className="w-3 h-3 fill-purple-700" />
                </div>
              </motion.div>

              {/* Memory Match Card */}
              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  synthAudio.playPopup();
                  setActiveGame('memoryMatch');
                }}
                className="bg-white hover:bg-purple-50 p-3 rounded-xl border-2 border-purple-400 shadow-sm flex items-center gap-3 cursor-pointer"
              >
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-2xl">
                  🧩
                </div>
                <div className="flex-1">
                  <h3 className="font-extrabold text-xs text-purple-950">Memory Match</h3>
                  <p className="text-[9px] text-slate-500 font-medium">Flip cards and pair identical kitty treats!</p>
                </div>
                <div className="bg-purple-100 text-purple-700 p-1.5 rounded-full">
                  <Play className="w-3 h-3 fill-purple-700" />
                </div>
              </motion.div>

              {/* Cute Snake Card */}
              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  synthAudio.playPopup();
                  setActiveGame('snake');
                }}
                className="bg-white hover:bg-purple-50 p-3 rounded-xl border-2 border-purple-400 shadow-sm flex items-center gap-3 cursor-pointer"
              >
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-2xl">
                  🐍
                </div>
                <div className="flex-1">
                  <h3 className="font-extrabold text-xs text-purple-950">Mimi Snake</h3>
                  <p className="text-[9px] text-slate-500 font-medium">Guide Mimi to eat delicious treats and grow longer!</p>
                </div>
                <div className="bg-purple-100 text-purple-700 p-1.5 rounded-full">
                  <Play className="w-3 h-3 fill-purple-700" />
                </div>
              </motion.div>

              {/* Kitten Run Card */}
              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  synthAudio.playPopup();
                  setActiveGame('kittenRun');
                }}
                className="bg-white hover:bg-purple-50 p-3 rounded-xl border-2 border-purple-400 shadow-sm flex items-center gap-3 cursor-pointer"
              >
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-2xl">
                  🏃‍♀️
                </div>
                <div className="flex-1">
                  <h3 className="font-extrabold text-xs text-purple-950">Kitten Run</h3>
                  <p className="text-[9px] text-slate-500 font-medium">Jump over obstacles in this fast endlessly scrolling runner!</p>
                </div>
                <div className="bg-purple-100 text-purple-700 p-1.5 rounded-full">
                  <Play className="w-3 h-3 fill-purple-700" />
                </div>
              </motion.div>
            </div>

            {/* Current Balance Footer */}
            <div className="text-center bg-white/80 border border-purple-300 py-2.5 rounded-xl">
              <span className="text-xs font-bold text-purple-900 flex items-center justify-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-500 fill-amber-400 animate-bounce" />
                Wallet Balance: <strong className="text-sm text-amber-800">{coins} coins</strong>
              </span>
            </div>
          </motion.div>
        )}

        {/* ==================== 1. BALL CATCH GAME ==================== */}
        {activeGame === 'ballCatch' && (
          <BallCatchGame onExit={exitToArcade} onWinCoins={claimCoins} earnedCoins={earnedInSession} />
        )}

        {/* ==================== 2. BUBBLE POP GAME ==================== */}
        {activeGame === 'bubblePop' && (
          <BubblePopGame onExit={exitToArcade} onWinCoins={claimCoins} earnedCoins={earnedInSession} />
        )}

        {/* ==================== 3. MEMORY MATCH GAME ==================== */}
        {activeGame === 'memoryMatch' && (
          <MemoryMatchGame onExit={exitToArcade} onWinCoins={claimCoins} earnedCoins={earnedInSession} />
        )}

        {/* ==================== 4. MIMI SNAKE GAME ==================== */}
        {activeGame === 'snake' && (
          <SnakeGame onExit={exitToArcade} onWinCoins={claimCoins} earnedCoins={earnedInSession} />
        )}

        {/* ==================== 5. KITTEN RUN GAME ==================== */}
        {activeGame === 'kittenRun' && (
          <KittenRunGame onExit={exitToArcade} onWinCoins={claimCoins} earnedCoins={earnedInSession} />
        )}
      </AnimatePresence>
    </div>
  );
}

// -----------------------------------------------------------------
// BALL CATCH MINI-GAME IMPLEMENTATION
// -----------------------------------------------------------------
interface GameSubProps {
  onExit: () => void;
  onWinCoins: (amount: number) => void;
  earnedCoins: number;
}

function BallCatchGame({ onExit, onWinCoins, earnedCoins }: GameSubProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [basketX, setBasketX] = useState(50); // percentage: 0 to 100
  const [ball, setBall] = useState({ x: 30 + Math.random() * 40, y: 0, speed: 4 });
  const [gameOver, setGameOver] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const gameLoop = setInterval(() => {
      setBall((prev) => {
        let nextY = prev.y + prev.speed;
        let nextSpeed = prev.speed;

        // Check catch at bottom
        if (nextY >= 88) {
          // Check collision
          const diff = Math.abs(prev.x - basketX);
          if (diff <= 15) {
            // Caught!
            setScore((s) => s + 1);
            onWinCoins(5);
            nextY = 0;
            return {
              x: 10 + Math.random() * 80,
              y: nextY,
              speed: Math.min(8, prev.speed + 0.25), // speed up slightly
            };
          } else {
            // Drop! Game Over
            synthAudio.playLose();
            setGameOver(true);
            setIsPlaying(false);
            return prev;
          }
        }

        return { ...prev, y: nextY };
      });
    }, 45);

    return () => clearInterval(gameLoop);
  }, [isPlaying, gameOver, basketX]);

  const moveLeft = () => {
    synthAudio.playFootsteps();
    setBasketX((x) => Math.max(10, x - 12));
  };
  
  const moveRight = () => {
    synthAudio.playFootsteps();
    setBasketX((x) => Math.min(90, x + 12));
  };

  // Also support tapping anywhere on screen to teleport basket there
  const handleTouchArea = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPlaying || gameOver) return;
    if (gameAreaRef.current) {
      synthAudio.playClick();
      const rect = gameAreaRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentX = (clickX / rect.width) * 100;
      setBasketX(Math.max(10, Math.min(90, percentX)));
    }
  };

  const restart = () => {
    synthAudio.playTransition();
    setScore(0);
    setBasketX(50);
    setBall({ x: 20 + Math.random() * 60, y: 0, speed: 4 });
    setGameOver(false);
    setIsPlaying(true);
  };

  return (
    <div ref={gameAreaRef} onClick={handleTouchArea} className="w-full h-full flex flex-col justify-between bg-sky-900 text-white relative p-4 select-none">
      {/* Top HUD */}
      <div className="flex justify-between items-center z-10">
        <button onClick={onExit} className="bg-white/20 p-2 rounded-lg text-white hover:bg-white/30 flex items-center gap-1 text-xs font-bold">
          <ArrowLeft className="w-4 h-4" /> Arcade
        </button>
        <span className="font-extrabold text-xs bg-amber-500 px-3 py-1 rounded-full text-slate-900 flex items-center gap-1 shadow-sm">
          <Coins className="w-3.5 h-3.5" />
          <span>+{earnedCoins} earned</span>
        </span>
      </div>

      {/* Game Canvas */}
      <div className="flex-1 relative overflow-hidden rounded-2xl bg-gradient-to-b from-sky-950 to-sky-900 border-4 border-sky-950 my-3 flex items-center justify-center">
        {!isPlaying && !gameOver && (
          <div className="text-center p-4 bg-slate-900/90 border border-sky-800 rounded-2xl max-w-[280px]">
            <span className="text-5xl">🧶</span>
            <h3 className="font-extrabold text-lg mt-2">Ball Catch</h3>
            <p className="text-[11px] text-sky-200 mt-1">Catch falling yarn balls into Mimi's basket. Teleport by tapping left/right!</p>
            <button
              onClick={() => {
                synthAudio.playTransition();
                setIsPlaying(true);
              }}
              className="mt-4 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black py-2 px-6 rounded-full text-sm shadow-md transition-all"
            >
              Start Game! 🚀
            </button>
          </div>
        )}

        {gameOver && (
          <div className="text-center p-4 bg-red-950/95 border border-red-700 rounded-2xl max-w-[280px] z-20">
            <span className="text-5xl">💥</span>
            <h3 className="font-extrabold text-lg mt-2">Ouch! Dropped!</h3>
            <p className="text-[11px] text-red-200 mt-1">Great attempt! You got {score} balls!</p>
            <div className="mt-2 text-yellow-300 font-bold text-xs flex items-center justify-center gap-1">
              <Coins className="w-4 h-4" />
              <span>You earned {score * 5} coins!</span>
            </div>
            <div className="flex gap-2 mt-4 justify-center">
              <button onClick={restart} className="bg-yellow-400 hover:bg-yellow-300 text-yellow-950 font-black py-1.5 px-4 rounded-full text-xs shadow-md flex items-center gap-1">
                <RotateCcw className="w-3 h-3" /> Retry
              </button>
              <button onClick={onExit} className="bg-white/20 hover:bg-white/30 text-white font-bold py-1.5 px-4 rounded-full text-xs">
                Exit
              </button>
            </div>
          </div>
        )}

        {/* Falling Ball */}
        {isPlaying && (
          <motion.div
            className="absolute text-4xl"
            style={{
              left: `${ball.x}%`,
              top: `${ball.y}%`,
              transform: 'translateX(-50%)',
            }}
          >
            🧶
          </motion.div>
        )}

        {/* Player Basket */}
        {(isPlaying || gameOver) && (
          <div
            className="absolute bottom-4 h-8 bg-amber-500 border-2 border-amber-600 rounded-b-xl rounded-t-sm flex items-center justify-center font-bold text-[10px] text-amber-950 transition-all duration-75 shadow-lg"
            style={{
              left: `${basketX}%`,
              width: '64px',
              transform: 'translateX(-50%)',
            }}
          >
            🧺 Mimi's Toy
          </div>
        )}

        {/* Score display */}
        {isPlaying && (
          <div className="absolute top-4 left-4 bg-white/15 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-extrabold text-sky-200 border border-sky-400/20">
            Score: <span className="text-white text-sm">{score}</span>
          </div>
        )}
      </div>

      {/* Touch controls */}
      {isPlaying && (
        <div className="flex justify-between gap-6 px-4 pb-2 z-10">
          <button onClick={moveLeft} className="flex-1 py-3 bg-white/20 active:bg-white/40 rounded-xl flex items-center justify-center border">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button onClick={moveRight} className="flex-1 py-3 bg-white/20 active:bg-white/40 rounded-xl flex items-center justify-center border">
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------
// BUBBLE POP MINI-GAME IMPLEMENTATION
// -----------------------------------------------------------------
interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

function BubblePopGame({ onExit, onWinCoins, earnedCoins }: GameSubProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);

  // Time Countdown
  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) {
      if (timeLeft === 0) {
        synthAudio.playLevelComplete();
        setGameOver(true);
        setIsPlaying(false);
      }
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isPlaying, timeLeft]);

  // Bubble Spawning
  useEffect(() => {
    if (!isPlaying) return;

    const spawnInterval = setInterval(() => {
      const colors = ['#38bdf8', '#fb7185', '#34d399', '#facc15', '#c084fc'];
      const newBubble: Bubble = {
        id: Date.now() + Math.random(),
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 70,
        size: 40 + Math.random() * 25,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
      setBubbles((b) => [...b, newBubble]);
    }, 450);

    return () => clearInterval(spawnInterval);
  }, [isPlaying]);

  const handlePop = (id: number) => {
    synthAudio.playSoapBubbles();
    setScore((s) => s + 1);
    onWinCoins(2);
    setBubbles((prev) => prev.filter((b) => b.id !== id));
  };

  const restart = () => {
    synthAudio.playTransition();
    setScore(0);
    setTimeLeft(15);
    setBubbles([]);
    setGameOver(false);
    setIsPlaying(true);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-sky-950 text-white relative p-4 select-none">
      {/* HUD */}
      <div className="flex justify-between items-center z-10">
        <button onClick={onExit} className="bg-white/20 p-2 rounded-lg text-white hover:bg-white/30 flex items-center gap-1 text-xs font-bold">
          <ArrowLeft className="w-4 h-4" /> Arcade
        </button>
        <span className="font-extrabold text-xs bg-amber-500 px-3 py-1 rounded-full text-slate-900 flex items-center gap-1 shadow-sm">
          <Coins className="w-3.5 h-3.5" />
          <span>+{earnedCoins} earned</span>
        </span>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden rounded-2xl bg-gradient-to-b from-sky-950 to-blue-900 border-4 border-sky-950 my-3 flex items-center justify-center">
        {!isPlaying && !gameOver && (
          <div className="text-center p-4 bg-slate-900/95 border border-sky-800 rounded-2xl max-w-[280px]">
            <span className="text-5xl">🫧</span>
            <h3 className="font-extrabold text-lg mt-2">Bubble Pop</h3>
            <p className="text-[11px] text-sky-200 mt-1">Tap floating bubbles to pop them before the clock runs out! Popping rewards coins.</p>
            <button
              onClick={() => {
                synthAudio.playTransition();
                setIsPlaying(true);
              }}
              className="mt-4 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black py-2 px-6 rounded-full text-sm shadow-md"
            >
              Play Bubble Pop! 🚀
            </button>
          </div>
        )}

        {gameOver && (
          <div className="text-center p-4 bg-indigo-950/95 border border-indigo-700 rounded-2xl max-w-[280px] z-20">
            <span className="text-5xl">🏆</span>
            <h3 className="font-extrabold text-lg mt-2">Times Up!</h3>
            <p className="text-[11px] text-indigo-200 mt-1">Awesome! You popped {score} bubbles!</p>
            <div className="mt-2 text-yellow-300 font-bold text-xs flex items-center justify-center gap-1">
              <Coins className="w-4 h-4" />
              <span>You earned {score * 2} coins!</span>
            </div>
            <div className="flex gap-2 mt-4 justify-center">
              <button onClick={restart} className="bg-yellow-400 hover:bg-yellow-300 text-yellow-950 font-black py-1.5 px-4 rounded-full text-xs shadow-md flex items-center gap-1">
                <RotateCcw className="w-3 h-3" /> Replay
              </button>
              <button onClick={onExit} className="bg-white/20 hover:bg-white/30 text-white font-bold py-1.5 px-4 rounded-full text-xs">
                Exit
              </button>
            </div>
          </div>
        )}

        {/* Floating Bubbles */}
        {isPlaying &&
          bubbles.map((b) => (
            <motion.div
              key={b.id}
              onClick={() => handlePop(b.id)}
              initial={{ scale: 0.3, opacity: 0, y: 150 }}
              animate={{ 
                scale: [1, 1.1, 1], 
                opacity: [0.9, 1, 0.9],
                y: [80, -20, 80],
                x: [0, Math.sin(b.id) * 15, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute rounded-full border-2 border-white/40 flex items-center justify-center font-bold cursor-pointer hover:bg-white/15"
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                width: `${b.size}px`,
                height: `${b.size}px`,
                background: `radial-gradient(circle, ${b.color}aa 0%, rgba(255,255,255,0.1) 85%)`,
              }}
            >
              <div className="w-3.5 h-1.5 bg-white/50 rounded-full absolute top-2 left-2 transform -rotate-45" />
            </motion.div>
          ))}

        {/* Floating HUD elements */}
        {isPlaying && (
          <>
            <div className="absolute top-4 left-4 bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-sky-200">
              Pops: <span className="text-white font-black text-sm">{score}</span>
            </div>
            <div className="absolute top-4 right-4 bg-rose-500/80 px-3 py-1 rounded-full text-xs font-bold text-white">
              Timer: <span className="font-black text-sm">{timeLeft}s</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// MEMORY MATCH MINI-GAME IMPLEMENTATION
// -----------------------------------------------------------------
interface MemoryCard {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CARDS_POOL = ['🐱', '🐟', '🧶', '🥛', '🥎', '👑'];

function MemoryMatchGame({ onExit, onWinCoins, earnedCoins }: GameSubProps) {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [selected, setSelected] = useState<number[]>([]); // indexes
  const [matchesCount, setMatchesCount] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [moves, setMoves] = useState(0);

  // Initialize Cards
  const initGame = () => {
    const shuffledSymbols = [...CARDS_POOL, ...CARDS_POOL].sort(() => Math.random() - 0.5);
    const newCards = shuffledSymbols.map((sym, idx) => ({
      id: idx,
      symbol: sym,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(newCards);
    setSelected([]);
    setMatchesCount(0);
    setGameWon(false);
    setMoves(0);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (idx: number) => {
    if (cards[idx].isFlipped || cards[idx].isMatched || selected.length >= 2) return;

    // Flip card click
    synthAudio.playClick();

    const updated = [...cards];
    updated[idx].isFlipped = true;
    setCards(updated);

    const newSelected = [...selected, idx];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newSelected;
      if (cards[firstIdx].symbol === cards[secondIdx].symbol) {
        // MATCH!
        setTimeout(() => {
          synthAudio.playSuccess();
          const matchedCards = [...cards];
          matchedCards[firstIdx].isMatched = true;
          matchedCards[secondIdx].isMatched = true;
          setCards(matchedCards);
          setSelected([]);
          setMatchesCount((c) => {
            const nextCount = c + 1;
            onWinCoins(10); // 10 coins per pair match!
            if (nextCount === CARDS_POOL.length) {
              synthAudio.playLevelComplete();
              setGameWon(true);
              onWinCoins(30); // 30 bonus coins for complete match!
            }
            return nextCount;
          });
        }, 600);
      } else {
        // NO MATCH -> Flip back
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstIdx].isFlipped = false;
          resetCards[secondIdx].isFlipped = false;
          setCards(resetCards);
          setSelected([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-purple-950 text-white relative p-4 select-none">
      {/* HUD */}
      <div className="flex justify-between items-center z-10">
        <button onClick={onExit} className="bg-white/20 p-2 rounded-lg text-white hover:bg-white/30 flex items-center gap-1 text-xs font-bold">
          <ArrowLeft className="w-4 h-4" /> Arcade
        </button>
        <span className="font-extrabold text-xs bg-amber-500 px-3 py-1 rounded-full text-slate-900 flex items-center gap-1 shadow-sm">
          <Coins className="w-3.5 h-3.5" />
          <span>+{earnedCoins} earned</span>
        </span>
      </div>

      {/* Grid Canvas */}
      <div className="flex-1 relative overflow-hidden rounded-2xl bg-gradient-to-b from-purple-950 to-indigo-900 border-4 border-purple-950 my-3 flex flex-col justify-between p-4">
        {gameWon ? (
          <div className="m-auto text-center p-5 bg-purple-900/90 border border-purple-500 rounded-2xl max-w-[280px]">
            <span className="text-5xl">👑</span>
            <h3 className="font-extrabold text-lg mt-2">Well Done!</h3>
            <p className="text-[11px] text-purple-200 mt-1">Matched all kitten treats in {moves} moves!</p>
            <div className="mt-2 text-yellow-300 font-bold text-xs flex flex-col gap-1 items-center">
              <span className="flex items-center gap-1">
                <Coins className="w-4 h-4" /> Earned: {CARDS_POOL.length * 10} matching
              </span>
              <span className="text-[10px] bg-purple-800 text-yellow-300 px-2 py-0.5 rounded-md">
                🎉 +30 Complete Bonus!
              </span>
            </div>
            <div className="flex gap-2 mt-4 justify-center">
              <button onClick={initGame} className="bg-yellow-400 hover:bg-yellow-300 text-yellow-950 font-black py-1.5 px-4 rounded-full text-xs shadow-md flex items-center gap-1">
                <RotateCcw className="w-3 h-3" /> Play Again
              </button>
              <button onClick={onExit} className="bg-white/20 hover:bg-white/30 text-white font-bold py-1.5 px-4 rounded-full text-xs">
                Exit
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl border border-white/10 text-xs mb-3">
              <span>Pairs Matched: <strong className="text-yellow-300">{matchesCount} / {CARDS_POOL.length}</strong></span>
              <span>Moves: <strong className="text-yellow-300">{moves}</strong></span>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-4 gap-2 flex-1 items-center justify-center">
              {cards.map((card, idx) => (
                <motion.div
                  key={card.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCardClick(idx)}
                  className={`aspect-square rounded-xl border-2 cursor-pointer flex items-center justify-center text-3xl font-bold transition-all ${
                    card.isFlipped || card.isMatched
                      ? 'bg-purple-100 border-yellow-300 text-slate-900 rotate-y-180'
                      : 'bg-purple-700 border-purple-500 text-purple-300 hover:bg-purple-600'
                  }`}
                >
                  {card.isFlipped || card.isMatched ? card.symbol : '❓'}
                </motion.div>
              ))}
            </div>

            <div className="text-center text-[9px] text-purple-200 mt-3 bg-purple-900/40 py-1 rounded-full border border-purple-800/50">
              💡 Turn over cards and match pairs of kitten items! Matches reward 10 coins + 30 coin bonus.
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// MIMI SNAKE GAME IMPLEMENTATION
// -----------------------------------------------------------------
function SnakeGame({ onExit, onWinCoins, earnedCoins }: GameSubProps) {
  const GRID_SIZE = 15;
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([
    { x: 7, y: 5 },
    { x: 7, y: 6 },
    { x: 7, y: 7 },
  ]);
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('UP');
  const [food, setFood] = useState({ x: 7, y: 2, type: '🐟' });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return Number(localStorage.getItem('mimi_snake_highscore') || '0');
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(180);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;
      if (['ArrowUp', 'KeyW'].includes(e.key) && direction !== 'DOWN') {
        e.preventDefault();
        setDirection('UP');
      } else if (['ArrowDown', 'KeyS'].includes(e.key) && direction !== 'UP') {
        e.preventDefault();
        setDirection('DOWN');
      } else if (['ArrowLeft', 'KeyA'].includes(e.key) && direction !== 'RIGHT') {
        e.preventDefault();
        setDirection('LEFT');
      } else if (['ArrowRight', 'KeyD'].includes(e.key) && direction !== 'LEFT') {
        e.preventDefault();
        setDirection('RIGHT');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isPlaying, gameOver]);

  // Gameloop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = () => {
      setSnake((prev) => {
        const head = prev[0];
        let newHead = { ...head };

        if (direction === 'UP') newHead.y -= 1;
        else if (direction === 'DOWN') newHead.y += 1;
        else if (direction === 'LEFT') newHead.x -= 1;
        else if (direction === 'RIGHT') newHead.x += 1;

        // Wall collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true);
          synthAudio.playSadMeow();
          return prev;
        }

        // Body collision
        if (prev.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          synthAudio.playSadMeow();
          return prev;
        }

        const nextSnake = [newHead, ...prev];

        // Eat food
        if (newHead.x === food.x && newHead.y === food.y) {
          synthAudio.playCoinCollect();
          onWinCoins(5);
          setScore((s) => {
            const ns = s + 10;
            if (ns > highScore) {
              setHighScore(ns);
              localStorage.setItem('mimi_snake_highscore', String(ns));
            }
            return ns;
          });

          // Relocate food
          let valid = false;
          let rx = 0;
          let ry = 0;
          while (!valid) {
            rx = Math.floor(Math.random() * GRID_SIZE);
            ry = Math.floor(Math.random() * GRID_SIZE);
            valid = !nextSnake.some(segment => segment.x === rx && segment.y === ry);
          }
          const foods = ['🐟', '🥛', '🌿', '🥩', '🧶'];
          setFood({
            x: rx,
            y: ry,
            type: foods[Math.floor(Math.random() * foods.length)],
          });

          // Increase speed
          setSpeed((prevSpeed) => Math.max(90, prevSpeed - 5));
        } else {
          nextSnake.pop();
        }

        return nextSnake;
      });
    };

    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [direction, food, isPlaying, gameOver, speed]);

  const resetGame = () => {
    setSnake([
      { x: 7, y: 5 },
      { x: 7, y: 6 },
      { x: 7, y: 7 },
    ]);
    setDirection('UP');
    setFood({ x: 7, y: 2, type: '🐟' });
    setScore(0);
    setSpeed(180);
    setGameOver(false);
    setIsPlaying(true);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-purple-950 text-white relative p-4 select-none">
      {/* HUD */}
      <div className="flex justify-between items-center z-10">
        <button onClick={onExit} className="bg-white/20 p-2 rounded-lg text-white hover:bg-white/30 flex items-center gap-1 text-xs font-bold">
          <ArrowLeft className="w-4 h-4" /> Arcade
        </button>
        <span className="font-extrabold text-xs bg-amber-500 px-3 py-1 rounded-full text-slate-900 flex items-center gap-1 shadow-sm">
          <Coins className="w-3.5 h-3.5" />
          <span>+{earnedCoins} earned</span>
        </span>
      </div>

      {/* Grid Canvas */}
      <div className="flex-1 relative overflow-hidden rounded-2xl bg-gradient-to-b from-purple-950 to-indigo-900 border-4 border-purple-950 my-3 flex flex-col justify-between p-3">
        {!isPlaying ? (
          <div className="m-auto text-center p-4 bg-purple-900/90 border border-purple-500 rounded-2xl max-w-[260px]">
            <span className="text-4xl">🐍</span>
            <h3 className="font-extrabold text-base mt-2">Mimi Snake</h3>
            <p className="text-[10px] text-purple-200 mt-1">Guide Mimi to collect treats & grow longer without hitting walls or herself!</p>
            <div className="bg-purple-800/80 p-2 rounded-lg text-[10px] text-yellow-300 font-bold my-3">
              🏆 High Score: {highScore} pts
            </div>
            <button
              onClick={() => { synthAudio.playPopup(); setIsPlaying(true); }}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-yellow-950 font-black py-2 rounded-full text-xs shadow-md flex items-center justify-center gap-1"
            >
              <Play className="w-3 h-3 fill-yellow-950" /> Start Game
            </button>
          </div>
        ) : gameOver ? (
          <div className="m-auto text-center p-4 bg-purple-900/90 border border-purple-500 rounded-2xl max-w-[260px]">
            <span className="text-4xl">😿</span>
            <h3 className="font-extrabold text-base mt-2">Game Over!</h3>
            <p className="text-[10px] text-purple-200 mt-1">Mimi bumped into something!</p>
            <div className="my-2 bg-purple-800 p-2 rounded-lg">
              <div className="text-xs text-yellow-300 font-bold">Score: {score} pts</div>
              <div className="text-[9px] text-purple-300">High Score: {highScore}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={resetGame} className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-yellow-950 font-black py-2 rounded-full text-xs shadow-md flex items-center justify-center gap-1">
                <RotateCcw className="w-3 h-3" /> Retry
              </button>
              <button onClick={onExit} className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-full text-xs">
                Exit
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="flex justify-between items-center bg-white/5 p-1.5 rounded-lg border border-white/10 text-[10px]">
              <span>Score: <strong className="text-yellow-300">{score}</strong></span>
              <span>Best: <strong className="text-yellow-300">{highScore}</strong></span>
              <span className="text-emerald-400 font-bold">⭐ +5 coins / treat</span>
            </div>

            {/* Snake Grid container */}
            <div
              className="bg-purple-950/40 p-1.5 rounded-xl aspect-square w-full max-w-[210px] mx-auto border border-purple-800/80 mt-1"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(15, minmax(0, 1fr))',
                gap: '1px'
              }}
            >
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
                const x = idx % GRID_SIZE;
                const y = Math.floor(idx / GRID_SIZE);
                const isHead = snake[0]?.x === x && snake[0]?.y === y;
                const isBody = snake.slice(1).some((seg) => seg.x === x && seg.y === y);
                const isFood = food.x === x && food.y === y;

                return (
                  <div
                    key={idx}
                    className={`aspect-square rounded-[2px] flex items-center justify-center text-[9px] ${
                      isHead
                        ? 'bg-amber-400 z-10 text-xs shadow-xs'
                        : isBody
                        ? 'bg-purple-500 border-[0.5px] border-purple-600'
                        : 'bg-purple-900/10'
                    }`}
                  >
                    {isHead ? '🐱' : isFood ? food.type : ''}
                  </div>
                );
              })}
            </div>

            {/* Cute virtual controls */}
            <div className="flex flex-col items-center gap-0.5 mt-2">
              <button
                onClick={() => direction !== 'DOWN' && setDirection('UP')}
                className="w-8 h-8 bg-purple-800 active:bg-purple-600 rounded-lg flex items-center justify-center border border-purple-600 shadow-sm"
              >
                <ArrowUp className="w-4 h-4 text-white" />
              </button>
              <div className="flex gap-4">
                <button
                  onClick={() => direction !== 'RIGHT' && setDirection('LEFT')}
                  className="w-8 h-8 bg-purple-800 active:bg-purple-600 rounded-lg flex items-center justify-center border border-purple-600 shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4 text-white" />
                </button>
                <div className="w-8 h-8 bg-purple-900/30 rounded-lg" />
                <button
                  onClick={() => direction !== 'LEFT' && setDirection('RIGHT')}
                  className="w-8 h-8 bg-purple-800 active:bg-purple-600 rounded-lg flex items-center justify-center border border-purple-600 shadow-sm"
                >
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
              <button
                onClick={() => direction !== 'UP' && setDirection('DOWN')}
                className="w-8 h-8 bg-purple-800 active:bg-purple-600 rounded-lg flex items-center justify-center border border-purple-600 shadow-sm"
              >
                <ArrowDown className="w-4 h-4 text-white" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// KITTEN RUN GAME IMPLEMENTATION
// -----------------------------------------------------------------
interface Obstacle {
  id: number;
  x: number;
  symbol: string;
  scored: boolean;
}

function KittenRunGame({ onExit, onWinCoins, earnedCoins }: GameSubProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return Number(localStorage.getItem('mimi_run_high') || '0');
  });

  const [mimiY, setMimiY] = useState(0); // 0 to 100
  const [velocity, setVelocity] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [spawnTimer, setSpawnTimer] = useState(40);
  const [speed, setSpeed] = useState(2.8);

  // Jump handler
  const handleJump = () => {
    if (mimiY === 0) {
      synthAudio.playClick();
      setVelocity(11);
    }
  };

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        if (isPlaying && !gameOver) {
          handleJump();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver, mimiY]);

  // Gameloop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const gameLoop = setInterval(() => {
      // 1. Gravity & Physics
      setMimiY((y) => {
        let nextY = y + velocity;
        if (nextY <= 0) {
          nextY = 0;
          setVelocity(0);
        } else {
          setVelocity((v) => v - 0.75); // Gravity pull
        }
        return nextY;
      });

      // 2. Spawn Obstacles
      setSpawnTimer((timer) => {
        if (timer <= 0) {
          // Spawn obstacle
          const items = ['🔌', '💦', '🧶', '📦', '🧹'];
          const newObs: Obstacle = {
            id: Date.now() + Math.random(),
            x: 100,
            symbol: items[Math.floor(Math.random() * items.length)],
            scored: false,
          };
          setObstacles((prev) => [...prev, newObs]);
          // random next spawn
          return 55 + Math.floor(Math.random() * 45);
        }
        return timer - 1;
      });

      // 3. Move and Collision Check
      setObstacles((prev) => {
        return prev
          .map((obs) => {
            const nextX = obs.x - speed;
            
            // Check collision: Mimi is around X = 20 to 28
            // If obstacle is in Mimi's footprint, and Mimi's height is low, we hit!
            if (nextX >= 16 && nextX <= 28) {
              if (mimiY < 32) {
                setGameOver(true);
                synthAudio.playSadMeow();
              }
            }

            // Score point if successfully passed
            if (nextX < 16 && !obs.scored) {
              obs.scored = true;
              synthAudio.playCoinCollect();
              onWinCoins(2);
              setScore((s) => {
                const ns = s + 1;
                if (ns > highScore) {
                  setHighScore(ns);
                  localStorage.setItem('mimi_run_high', String(ns));
                }
                return ns;
              });
              // Slightly increase speed
              setSpeed((prevSpeed) => Math.min(6, prevSpeed + 0.08));
            }

            return { ...obs, x: nextX };
          })
          .filter((obs) => obs.x > -15);
      });
    }, 20); // 50 FPS

    return () => clearInterval(gameLoop);
  }, [isPlaying, gameOver, velocity, mimiY, speed, highScore]);

  const startGame = () => {
    setScore(0);
    setMimiY(0);
    setVelocity(0);
    setObstacles([]);
    setSpawnTimer(40);
    setSpeed(2.8);
    setGameOver(false);
    setIsPlaying(true);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-purple-950 text-white relative p-4 select-none">
      {/* HUD */}
      <div className="flex justify-between items-center z-10">
        <button onClick={onExit} className="bg-white/20 p-2 rounded-lg text-white hover:bg-white/30 flex items-center gap-1 text-xs font-bold">
          <ArrowLeft className="w-4 h-4" /> Arcade
        </button>
        <span className="font-extrabold text-xs bg-amber-500 px-3 py-1 rounded-full text-slate-900 flex items-center gap-1 shadow-sm">
          <Coins className="w-3.5 h-3.5" />
          <span>+{earnedCoins} earned</span>
        </span>
      </div>

      {/* Grid Canvas */}
      <div 
        onClick={isPlaying && !gameOver ? handleJump : undefined}
        className="flex-1 relative overflow-hidden rounded-2xl bg-gradient-to-b from-sky-300 via-sky-200 to-indigo-900 border-4 border-purple-950 my-3 flex flex-col justify-between p-3 cursor-pointer"
      >
        {!isPlaying ? (
          <div className="m-auto text-center p-4 bg-purple-900/95 border border-purple-500 rounded-2xl max-w-[260px] text-white">
            <span className="text-4xl">🏃‍♀️</span>
            <h3 className="font-extrabold text-base mt-2">Kitten Run</h3>
            <p className="text-[10px] text-purple-200 mt-1">Help Mimi leap over vacuums, puddles & prickly troubles! Jump to survive.</p>
            <div className="bg-purple-800/80 p-2 rounded-lg text-[10px] text-yellow-300 font-bold my-3">
              🏆 High Score: {highScore} dodges
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); synthAudio.playPopup(); setIsPlaying(true); }}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-yellow-950 font-black py-2 rounded-full text-xs shadow-md flex items-center justify-center gap-1"
            >
              <Play className="w-3 h-3 fill-yellow-950" /> Start Running
            </button>
          </div>
        ) : gameOver ? (
          <div className="m-auto text-center p-4 bg-purple-900/95 border border-purple-500 rounded-2xl max-w-[260px] text-white">
            <span className="text-4xl">💥</span>
            <h3 className="font-extrabold text-base mt-2">Crash!</h3>
            <p className="text-[10px] text-purple-200 mt-1">Mimi ran into an obstacle!</p>
            <div className="my-2 bg-purple-800 p-2 rounded-lg">
              <div className="text-xs text-yellow-300 font-bold">Score: {score} dodges</div>
              <div className="text-[9px] text-purple-300">Best Run: {highScore}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={(e) => { e.stopPropagation(); startGame(); }} className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-yellow-950 font-black py-2 rounded-full text-xs shadow-md flex items-center justify-center gap-1">
                <RotateCcw className="w-3 h-3" /> Run Again
              </button>
              <button onClick={(e) => { e.stopPropagation(); onExit(); }} className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-full text-xs">
                Exit
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="flex justify-between items-center bg-slate-900/40 backdrop-blur-xs p-1.5 rounded-lg border border-white/20 text-[10px] text-white z-10">
              <span>Score: <strong className="text-yellow-300">{score}</strong></span>
              <span>Best: <strong className="text-yellow-300">{highScore}</strong></span>
              <span className="text-yellow-300 font-extrabold">🪙 +2 coins / dodge</span>
            </div>

            {/* Parallax moving Clouds (decorative) */}
            <div className="absolute top-8 left-0 right-0 h-8 overflow-hidden pointer-events-none opacity-40">
              <div className="absolute left-[10%] text-xl animate-pulse">☁️</div>
              <div className="absolute left-[65%] text-lg" style={{ animationDelay: '1s' }}>☁️</div>
            </div>

            {/* Scrolling Sun */}
            <div className="absolute top-4 right-6 w-8 h-8 rounded-full bg-amber-200 blur-[2px]" />

            {/* Main Stage */}
            <div className="flex-1 relative flex items-end justify-start min-h-[120px]">
              {/* Mimi */}
              <motion.div
                className="absolute left-[20%] text-3xl z-10 origin-bottom"
                style={{
                  bottom: `${mimiY}px`,
                }}
                animate={mimiY > 0 ? { rotate: [0, 15, -15, 0] } : { y: [0, -2, 0] }}
                transition={mimiY > 0 ? { duration: 0.4 } : { repeat: Infinity, duration: 0.18 }}
              >
                🐱
              </motion.div>

              {/* Obstacles */}
              {obstacles.map((obs) => (
                <div
                  key={obs.id}
                  className="absolute bottom-0 text-2xl z-10 text-center"
                  style={{
                    left: `${obs.x}%`,
                    transform: 'translateX(-50%)',
                  }}
                >
                  {obs.symbol}
                </div>
              ))}

              {/* Ground line */}
              <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-emerald-700" />
            </div>

            {/* Jump Button area */}
            <div className="flex flex-col items-center gap-1 mt-1 z-10">
              <button
                onClick={(e) => { e.stopPropagation(); handleJump(); }}
                className="w-full max-w-[140px] bg-purple-600 active:bg-purple-800 text-white font-black py-2 px-4 rounded-xl border-2 border-purple-400 shadow-md text-xs tracking-wider flex items-center justify-center gap-1 animate-pulse"
              >
                JUMP 🚀
              </button>
              <span className="text-[8px] text-purple-200">Tip: Press SPACEBAR or tap anywhere to Jump!</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
