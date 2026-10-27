import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Room, PetStats, FoodItem } from './types';
import MimiPet from './components/MimiPet';
import RoomHome from './components/RoomHome';
import RoomLunch from './components/RoomLunch';
import RoomBedroom from './components/RoomBedroom';
import RoomWashroom from './components/RoomWashroom';
import RoomGaming from './components/RoomGaming';
import RoomShop from './components/RoomShop';
import GameLoadingPage from './components/GameLoadingPage';
import { Heart, Utensils, BedDouble, ShowerHead, Gamepad2, Coins, RefreshCw, Volume2, VolumeX, Store, ArrowRight } from 'lucide-react';
import { synthAudio } from './utils/audio';

const LOCAL_STORAGE_KEY = 'mimi_pet_save_v1';

const INITIAL_STATS: PetStats = {
  health: 100,
  hunger: 80,
  hygiene: 75,
  happiness: 80,
  energy: 65,
  coins: 50,
};

export default function App() {
  const [room, setRoom] = useState<Room>('home');
  const [stats, setStats] = useState<PetStats>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved stats", e);
      }
    }
    return INITIAL_STATS;
  });

  // Accessories States & Persistence
  const [ownedAccessories, setOwnedAccessories] = useState<string[]>(() => {
    const saved = localStorage.getItem('mimi_accessories_owned');
    return saved ? JSON.parse(saved) : [];
  });
  const [equippedHead, setEquippedHead] = useState<string | null>(() => {
    return localStorage.getItem('mimi_accessory_head') || null;
  });
  const [equippedEyes, setEquippedEyes] = useState<string | null>(() => {
    return localStorage.getItem('mimi_accessory_eyes') || null;
  });
  const [equippedNeck, setEquippedNeck] = useState<string | null>(() => {
    return localStorage.getItem('mimi_accessory_neck') || null;
  });
  const [equippedColor, setEquippedColor] = useState<string | null>(() => {
    return localStorage.getItem('mimi_accessory_color') || null;
  });
  const [equippedClothes, setEquippedClothes] = useState<string | null>(() => {
    return localStorage.getItem('mimi_accessory_clothes') || null;
  });

  // Save accessories changes to LocalStorage
  useEffect(() => {
    localStorage.setItem('mimi_accessories_owned', JSON.stringify(ownedAccessories));
  }, [ownedAccessories]);

  useEffect(() => {
    if (equippedHead) {
      localStorage.setItem('mimi_accessory_head', equippedHead);
    } else {
      localStorage.removeItem('mimi_accessory_head');
    }
  }, [equippedHead]);

  useEffect(() => {
    if (equippedEyes) {
      localStorage.setItem('mimi_accessory_eyes', equippedEyes);
    } else {
      localStorage.removeItem('mimi_accessory_eyes');
    }
  }, [equippedEyes]);

  useEffect(() => {
    if (equippedNeck) {
      localStorage.setItem('mimi_accessory_neck', equippedNeck);
    } else {
      localStorage.removeItem('mimi_accessory_neck');
    }
  }, [equippedNeck]);

  useEffect(() => {
    if (equippedColor) {
      localStorage.setItem('mimi_accessory_color', equippedColor);
    } else {
      localStorage.removeItem('mimi_accessory_color');
    }
  }, [equippedColor]);

  useEffect(() => {
    if (equippedClothes) {
      localStorage.setItem('mimi_accessory_clothes', equippedClothes);
    } else {
      localStorage.removeItem('mimi_accessory_clothes');
    }
  }, [equippedClothes]);

  // Mimi's Growth System States & Persistence
  const [totalCoinsEarned, setTotalCoinsEarned] = useState<number>(() => {
    const savedTotal = localStorage.getItem('mimi_total_coins_earned');
    if (savedTotal) return parseInt(savedTotal, 10);
    const savedStats = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        if (parsed && typeof parsed.coins === 'number') {
          return parsed.coins;
        }
      } catch (e) {}
    }
    return 50;
  });

  const [totalGP, setTotalGP] = useState<number>(() => {
    const savedGP = localStorage.getItem('mimi_total_growth_points');
    if (savedGP) return parseInt(savedGP, 10);
    // Legacy conversion or fallback from total coins earned
    const savedTotal = localStorage.getItem('mimi_total_coins_earned');
    if (savedTotal) {
      return Math.min(60, parseInt(savedTotal, 10) * 2);
    }
    return 0;
  });

  const [playTimeSeconds, setPlayTimeSeconds] = useState<number>(() => {
    const saved = localStorage.getItem('mimi_play_time_seconds');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [growthCelebration, setGrowthCelebration] = useState<{ oldLevel: number; newLevel: number; stage: string } | null>(null);

  // Playtime background timer
  useEffect(() => {
    const timer = setInterval(() => {
      setPlayTimeSeconds((prev) => {
        const next = prev + 1;
        localStorage.setItem('mimi_play_time_seconds', next.toString());
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const increaseGP = (amount: number) => {
    setTotalGP((prev) => {
      const next = prev + amount;
      localStorage.setItem('mimi_total_growth_points', next.toString());
      return next;
    });
  };

  // Growth level calculations with fine-tuned difficulty curves
  // Level 1: Baby (0 - 60 GP) - Easy start
  // Level 2: Toddler (60 - 250 GP) - Moderate
  // Level 3: Junior (250 - 800 GP) - Hard
  // Level 4: Companion (800 - 2000 GP) - Very Hard
  // Level 5: Guardian (2000+ GP) - Ultimate
  let level = 1;
  let stageTitle = 'Newborn Baby 🍼';
  let nextLevelGP = 60;
  let prevLevelGP = 0;
  let growthScale = 0.95;

  if (totalGP < 60) {
    level = 1;
    stageTitle = 'Newborn Baby 🍼';
    prevLevelGP = 0;
    nextLevelGP = 60;
    growthScale = 0.95;
  } else if (totalGP < 250) {
    level = 2;
    stageTitle = 'Toddler Kitty 🧸';
    prevLevelGP = 60;
    nextLevelGP = 250;
    growthScale = 1.02;
  } else if (totalGP < 800) {
    level = 3;
    stageTitle = 'Playful Junior 🧶';
    prevLevelGP = 250;
    nextLevelGP = 800;
    growthScale = 1.10;
  } else if (totalGP < 2000) {
    level = 4;
    stageTitle = 'Sweet Companion 💜';
    prevLevelGP = 800;
    nextLevelGP = 2000;
    growthScale = 1.18;
  } else {
    level = 5;
    stageTitle = 'Magnificent Guardian ✨';
    prevLevelGP = 2000;
    nextLevelGP = 2000;
    growthScale = 1.25;
  }

  const growthPercentage = nextLevelGP === prevLevelGP 
    ? 100 
    : Math.min(100, Math.max(0, ((totalGP - prevLevelGP) / (nextLevelGP - prevLevelGP)) * 100));

  // Ref to track last processed level to trigger growth celebration
  const lastLevelRef = React.useRef<number>(level);

  // Handle Level Up Events
  useEffect(() => {
    if (level > lastLevelRef.current) {
      synthAudio.playHappyReward();
      synthAudio.playSparkle();
      setGrowthCelebration({
        oldLevel: lastLevelRef.current,
        newLevel: level,
        stage: stageTitle,
      });
    }
    // Sync ref whenever level changes
    lastLevelRef.current = level;
  }, [level, stageTitle]);

  // Bedroom light state
  const [isLightOff, setIsLightOff] = useState(false);
  const [hasStartedGame, setHasStartedGame] = useState(false);

  // Mimi Position & Walk details (on Home garden screen)
  const [positionX, setPositionX] = useState(50); // percentage 0-100
  const [targetX, setTargetX] = useState(50);
  const [mimiStatus, setMimiStatus] = useState<'idle' | 'eating' | 'sleeping' | 'washing' | 'brushing' | 'walking' | 'happy' | 'sad'>('idle');

  // Interactive pet adjustments to avoid blocking background options
  const [mimiSizeMultiplier, setMimiSizeMultiplier] = useState<number>(0.82); // Default slightly smaller
  const [mimiYOffset, setMimiYOffset] = useState<number>(0); // vertical height offset
  const [showMimiAdjustments, setShowMimiAdjustments] = useState<boolean>(false);

  // Audio volume settings state
  const [musicVol, setMusicVol] = useState(() => synthAudio.getMusicVolume());
  const [sfxVol, setSFXVol] = useState(() => synthAudio.getSFXVolume());
  const [showVolumeControls, setShowVolumeControls] = useState(false);

  // Sync volume state with the sound synthesizer
  useEffect(() => {
    synthAudio.setMusicVolume(musicVol);
  }, [musicVol]);

  useEffect(() => {
    synthAudio.setSFXVolume(sfxVol);
  }, [sfxVol]);

  // Autoplay background music after first user interaction (safari/chrome compliant)
  useEffect(() => {
    const handleFirstGesture = () => {
      synthAudio.startBGM();
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
    window.addEventListener('click', handleFirstGesture);
    window.addEventListener('touchstart', handleFirstGesture);
    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, []);

  // Soft snoring sound when sleeping
  useEffect(() => {
    if (mimiStatus === 'sleeping') {
      synthAudio.playSnore();
      const snoreTimer = setInterval(() => {
        synthAudio.playSnore();
      }, 3500);
      return () => clearInterval(snoreTimer);
    }
  }, [mimiStatus]);

  // Washroom states
  const [soapBubbles, setSoapBubbles] = useState(false);
  const [showerOn, setShowerOn] = useState(false);
  const [brushingActive, setBrushingActive] = useState(false);

  // Auto-save progress
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  // Walk loop with soft footsteps sound
  useEffect(() => {
    if (Math.abs(positionX - targetX) > 2) {
      setMimiStatus('walking');
      // Gentle occasional footstep thuds
      if (Math.random() < 0.35) {
        synthAudio.playFootsteps();
      }
      const step = targetX > positionX ? 2 : -2;
      const walkTimer = setTimeout(() => {
        setPositionX((prev) => prev + step);
      }, 50);
      return () => clearTimeout(walkTimer);
    } else {
      if (mimiStatus === 'walking') {
        setMimiStatus('idle');
        // Earn happiness on completing a walk
        adjustStat('happiness', 5);
      }
    }
  }, [positionX, targetX, mimiStatus]);

  // Passive stats drain / energy recovery loop
  useEffect(() => {
    const statTimer = setInterval(() => {
      setStats((prev) => {
        // 1. If light is OFF, sleep and restore energy
        let nextEnergy = prev.energy;
        let nextStatus = mimiStatus;

        if (isLightOff) {
          nextEnergy = Math.min(100, prev.energy + 4);
          nextStatus = 'sleeping';
        } else {
          nextEnergy = Math.max(0, prev.energy - 1);
        }

        // 2. Hunger drains
        const nextHunger = Math.max(0, prev.hunger - 1);

        // 3. Hygiene drains
        const nextHygiene = Math.max(0, prev.hygiene - 1);

        // 4. Compute Health from general status
        // If hunger is empty, or dirty, health decreases. Otherwise health slowly recovers
        let healthDiff = 1;
        if (nextHunger < 20) healthDiff -= 2;
        if (nextHygiene < 20) healthDiff -= 1;
        if (nextEnergy < 15) healthDiff -= 1;

        const nextHealth = Math.max(0, Math.min(100, prev.health + healthDiff));

        // 5. Compute Happiness based on stats
        let happinessDiff = 0;
        if (nextHunger > 60 && nextHygiene > 60 && nextEnergy > 50) {
          happinessDiff = 1;
        } else if (nextHunger < 30 || nextHygiene < 30 || nextEnergy < 30) {
          happinessDiff = -2;
        }
        const nextHappiness = Math.max(0, Math.min(100, prev.happiness + happinessDiff));

        return {
          ...prev,
          energy: nextEnergy,
          hunger: nextHunger,
          hygiene: nextHygiene,
          health: nextHealth,
          happiness: nextHappiness,
        };
      });
    }, 12000); // Trigger drain calculations every 12 seconds

    return () => clearInterval(statTimer);
  }, [isLightOff, mimiStatus]);

  // Trigger sleep action in bedroom
  useEffect(() => {
    if (isLightOff) {
      setMimiStatus('sleeping');
      synthAudio.playLampSwitch();
      synthAudio.playBlanketRustle();
    } else if (mimiStatus === 'sleeping') {
      setMimiStatus('idle');
      synthAudio.playLampSwitch();
      synthAudio.playWakeupStretch();
    }
  }, [isLightOff]);

  // Helper to adjust a state safely
  const adjustStat = (key: keyof PetStats, amount: number) => {
    if (key === 'coins' && amount > 0) {
      setTotalCoinsEarned((prev) => {
        const next = prev + amount;
        localStorage.setItem('mimi_total_coins_earned', next.toString());
        return next;
      });
    }
    setStats((prev) => ({
      ...prev,
      [key]: Math.max(0, Math.min(key === 'coins' ? 999999 : 100, prev[key] + amount)),
    }));
  };

  // Lunch feeding interaction
  const handleFeed = (food: FoodItem) => {
    setMimiStatus('eating');
    adjustStat('coins', -food.cost);
    adjustStat('hunger', food.hungerRestore);
    adjustStat('happiness', food.happinessBonus);
    increaseGP(8); // Feed +8 GP

    // Differentiate eating vs drinking cute sounds
    const nameLower = food.name.toLowerCase();
    if (nameLower.includes('milk') || nameLower.includes('water') || nameLower.includes('drink')) {
      synthAudio.playDrinking();
    } else {
      synthAudio.playEating();
    }

    // Play a happy kitty meow & reward sound halfway through eating
    setTimeout(() => {
      synthAudio.playHappyReward();
      synthAudio.playMeow();
    }, 1200);

    // Stop eating animation after 2.5 seconds
    setTimeout(() => {
      setMimiStatus('idle');
    }, 2500);
  };

  // Washroom operations
  const handleApplySoap = () => {
    setSoapBubbles(true);
    setMimiStatus('washing');
    adjustStat('happiness', 5);
    increaseGP(3); // Apply Soap +3 GP
    synthAudio.playSoapBubbles();
    synthAudio.playGiggle();
    setTimeout(() => {
      if (mimiStatus === 'washing' && !showerOn) {
        setMimiStatus('idle');
      }
    }, 1500);
  };

  const handleToggleShower = () => {
    const nextShowerState = !showerOn;
    setShowerOn(nextShowerState);
    if (nextShowerState) {
      setMimiStatus('washing');
      synthAudio.playShowerWater();
      synthAudio.playMeow();
      // Wash away soap and clean pet fully
      setTimeout(() => {
        synthAudio.playSparkle(); // clean sound!
        setSoapBubbles(false);
        adjustStat('hygiene', 45);
        adjustStat('health', 5);
        adjustStat('happiness', 10);
        increaseGP(5); // Rinse complete +5 GP
      }, 1500);
    } else {
      synthAudio.playLampSwitch();
      setMimiStatus('idle');
    }
  };

  const handleBrushTeeth = () => {
    setBrushingActive(true);
    setMimiStatus('brushing');
    adjustStat('hygiene', 15);
    adjustStat('happiness', 5);
    increaseGP(4); // Brush Teeth +4 GP
    synthAudio.playTeethBrushing();
    setTimeout(() => {
      synthAudio.playSparkle(); // sparkle brush sound
      setBrushingActive(false);
      setMimiStatus('idle');
    }, 3000);
  };

  const handleToilet = () => {
    setMimiStatus('happy');
    adjustStat('hygiene', 20);
    adjustStat('health', 5);
    adjustStat('happiness', 15);
    increaseGP(4); // Flush Toilet +4 GP
    synthAudio.playToiletFlush();
    setTimeout(() => {
      setMimiStatus('idle');
    }, 2000);
  };

  // Walk trigger
  const handleWalk = (targetPercent: number) => {
    setTargetX(targetPercent);
  };

  // Tap reaction
  const handlePetTap = () => {
    if (isLightOff) return;
    setMimiStatus('happy');
    adjustStat('happiness', 10);
    adjustStat('energy', -2); // a little playing exertion
    increaseGP(3); // Petting Mimi +3 GP
    
    // Play a cute tickle giggle and happy meow
    synthAudio.playGiggle();
    synthAudio.playMeow();

    setTimeout(() => {
      setMimiStatus('idle');
    }, 2000);
  };

  // Purchase and Equip accessory handlers
  const handlePurchaseAccessory = (id: string, cost: number) => {
    setOwnedAccessories((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
    adjustStat('coins', -cost);
  };

  const handleEquipAccessory = (category: 'head' | 'eyes' | 'neck' | 'dyes' | 'clothes', id: string | null) => {
    if (category === 'head') {
      setEquippedHead(id);
    } else if (category === 'eyes') {
      setEquippedEyes(id);
    } else if (category === 'neck') {
      setEquippedNeck(id);
    } else if (category === 'dyes') {
      setEquippedColor(id);
    } else if (category === 'clothes') {
      setEquippedClothes(id);
    }
  };

  // Reset progress helper
  const handleReset = () => {
    if (window.confirm("Do you want to reset Mimi's stats back to fresh startup stats?")) {
      synthAudio.playTransition();
      setStats(INITIAL_STATS);
      setRoom('home');
      setIsLightOff(false);
      setSoapBubbles(false);
      setShowerOn(false);
      setBrushingActive(false);
      setMimiStatus('idle');
      setPositionX(50);
      setTargetX(50);
      setOwnedAccessories([]);
      setEquippedHead(null);
      setEquippedEyes(null);
      setEquippedNeck(null);
      setEquippedColor(null);
      setEquippedClothes(null);
      setTotalCoinsEarned(50);
      setTotalGP(0);
      setPlayTimeSeconds(0);
      localStorage.setItem('mimi_total_coins_earned', '50');
      localStorage.setItem('mimi_total_growth_points', '0');
      localStorage.setItem('mimi_play_time_seconds', '0');
      localStorage.removeItem('mimi_accessory_clothes');
      lastLevelRef.current = 1;
    }
  };

  // Determine speech bubble text
  const getSpeechBubbleMessage = () => {
    if (stats.hunger < 30) return 'I am hungry! 🍔';
    if (stats.energy < 30) return 'I am sleepy! 🛏️';
    if (stats.hygiene < 30) return 'I need a bath! 🧼';
    if (stats.happiness < 30) return 'Play with me! 🥺';
    if (mimiStatus === 'eating') return 'Nom nom... Delicious! 🐟';
    if (mimiStatus === 'sleeping') return 'Zzz... 🛌';
    if (mimiStatus === 'washing') return 'Splish splash! 🚿';
    if (mimiStatus === 'brushing') return 'Gargle brush! ✨';
    if (stats.happiness > 85) return 'I love you! 💜';
    return undefined;
  };

  return (
    <div className="w-screen h-screen max-h-screen flex items-center justify-center overflow-hidden font-sans select-none relative" style={{
      backgroundColor: '#fbf7ff',
      backgroundImage: `radial-gradient(#e9d5ff 1.5px, transparent 1.5px), radial-gradient(#e9d5ff 1.5px, #fbf7ff 1.5px)`,
      backgroundSize: '24px 24px',
      backgroundPosition: '0 0, 12px 12px',
    }}>
      {/* Decorative cartoon desk elements visible on larger displays */}
      <div className="absolute top-10 left-10 opacity-30 pointer-events-none hidden lg:flex flex-col gap-1 bg-white/60 p-3.5 rounded-2xl border-2 border-dashed border-purple-300">
        <span className="text-xs font-black text-purple-950">🐾 DECO STICKER</span>
        <div className="flex gap-2">
          <span className="text-2xl animate-pulse">🐱</span>
          <span className="text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>💜</span>
          <span className="text-2xl animate-pulse" style={{ animationDelay: '0.4s' }}>🐟</span>
        </div>
        <span className="text-[9px] font-mono font-bold text-purple-700 text-center">Mimi's Chibi OS</span>
      </div>

      <div className="absolute bottom-10 right-10 opacity-30 pointer-events-none hidden lg:flex flex-col gap-1 bg-white/60 p-3.5 rounded-2xl border-2 border-dashed border-purple-300 items-center">
        <span className="text-xs font-black text-purple-950">✨ COLLECTIBLES</span>
        <div className="flex gap-2">
          <span className="text-2xl animate-bounce">⭐</span>
          <span className="text-2xl animate-pulse">🪙</span>
          <span className="text-2xl animate-bounce" style={{ animationDelay: '0.3s' }}>🌸</span>
        </div>
        <span className="text-[9px] font-mono font-bold text-purple-700">100% 2D Retro Game</span>
      </div>

      {/* MOBILE CONTAINER (Styled as a gorgeous physical retro kitty console toy) */}
      <div className="w-full h-full max-w-md bg-purple-50 flex flex-col justify-between relative shadow-[0_25px_60px_-15px_rgba(124,58,237,0.35)] overflow-hidden rounded-[32px] border-[8px] border-purple-950">
        
        {/* Game Loading Page overlay */}
        <AnimatePresence>
          {!hasStartedGame && (
            <GameLoadingPage onStartGame={() => setHasStartedGame(true)} />
          )}
        </AnimatePresence>

        {/* Adorable 2D Kitty Ears extending from the console head */}
        <div className="absolute top-[-4px] left-12 w-12 h-10 bg-purple-950 rounded-tl-[24px] rounded-tr-[12px] rotate-[-12deg] -z-10 flex items-center justify-center shadow-md">
          <div className="w-7 h-6 bg-rose-300 rounded-tl-[16px] rounded-tr-[6px]" />
        </div>
        <div className="absolute top-[-4px] right-12 w-12 h-10 bg-purple-950 rounded-tr-[24px] rounded-tl-[12px] rotate-[12deg] -z-10 flex items-center justify-center shadow-md">
          <div className="w-7 h-6 bg-rose-300 rounded-tr-[16px] rounded-tl-[6px]" />
        </div>
        
        {/* ==================== TOP HUD (Extremely compact layout) ==================== */}
        <div className="bg-white/95 backdrop-blur-md px-3 py-1 border-b border-purple-100 flex flex-col gap-1 z-30 shadow-xs">
          
          {/* Header Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-base">🐱</span>
              <span className="font-extrabold text-xs tracking-tight text-purple-950">
                Mimi the Kitten
              </span>
            </div>

            {/* Coins wallet */}
            <div className="flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-inner">
              <Coins className="w-3 h-3 text-amber-600 fill-amber-500" />
              <span>{stats.coins}</span>
            </div>

            <div className="flex items-center gap-1">
              {/* Volume Settings button */}
              <button
                onClick={() => {
                  synthAudio.playClick();
                  setShowVolumeControls(!showVolumeControls);
                }}
                title="Sound settings"
                className={`p-1 rounded-md border transition-all flex items-center justify-center cursor-pointer ${
                  showVolumeControls
                    ? 'bg-purple-600 border-purple-700 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                }`}
              >
                <Volume2 className="w-3 h-3" />
              </button>

              {/* Reset button */}
              <button
                onClick={handleReset}
                title="Reset progress"
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-1 rounded-md border transition-all flex items-center justify-center cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Stats Badges Grid */}
          <div className="grid grid-cols-4 gap-1 text-center">
            {/* Health stat */}
            <div className="bg-rose-50 border border-rose-100 px-1 py-0.5 rounded-md">
              <div className="flex items-center justify-center gap-0.5 text-[8.5px] font-bold text-rose-800">
                <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-600" />
                <span>Health</span>
              </div>
              <div className="w-full bg-slate-200 h-1 rounded-full mt-0.5 overflow-hidden">
                <div
                  className="bg-rose-500 h-full transition-all duration-300"
                  style={{ width: `${stats.health}%` }}
                />
              </div>
            </div>

            {/* Hunger stat */}
            <div className="bg-amber-50 border border-amber-100 px-1 py-0.5 rounded-md">
              <div className="flex items-center justify-center gap-0.5 text-[8.5px] font-bold text-amber-800">
                <span>🍔</span>
                <span>Hunger</span>
              </div>
              <div className="w-full bg-slate-200 h-1 rounded-full mt-0.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-full transition-all duration-300"
                  style={{ width: `${stats.hunger}%` }}
                />
              </div>
            </div>

            {/* Hygiene stat */}
            <div className="bg-sky-50 border border-sky-100 px-1 py-0.5 rounded-md">
              <div className="flex items-center justify-center gap-0.5 text-[8.5px] font-bold text-sky-800">
                <span>🧼</span>
                <span>Hygiene</span>
              </div>
              <div className="w-full bg-slate-200 h-1 rounded-full mt-0.5 overflow-hidden">
                <div
                  className="bg-sky-400 h-full transition-all duration-300"
                  style={{ width: `${stats.hygiene}%` }}
                />
              </div>
            </div>

            {/* Happiness stat */}
            <div className="bg-violet-50 border border-violet-100 px-1 py-0.5 rounded-md">
              <div className="flex items-center justify-center gap-0.5 text-[8.5px] font-bold text-violet-800">
                <span>😊</span>
                <span>Happy</span>
              </div>
              <div className="w-full bg-slate-200 h-1 rounded-full mt-0.5 overflow-hidden">
                <div
                  className="bg-violet-500 h-full transition-all duration-300"
                  style={{ width: `${stats.happiness}%` }}
                />
              </div>
            </div>
          </div>

          {/* 🌱 Mimi's Growth Tracker Row */}
          <div className="bg-purple-50/80 border border-purple-200/60 px-2.5 py-1 rounded-md flex items-center justify-between gap-2 mt-1 shadow-3xs">
            <div className="flex items-center gap-1.5">
              <span className="text-xs animate-pulse">🌱</span>
              <span className="text-[9.5px] font-black text-purple-950 uppercase">
                Growth: {stageTitle} (Lvl {level})
              </span>
            </div>
            
            {/* The XP bar */}
            <div className="flex-1 flex items-center gap-2 justify-end">
              <div className="w-24 md:w-32 bg-slate-200 h-1.5 rounded-full overflow-hidden relative shadow-inner" title={`Growth Points: ${totalGP} GP`}>
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full transition-all duration-500"
                  style={{ width: `${growthPercentage}%` }}
                />
              </div>
              <span className="text-[8px] font-black text-purple-700 whitespace-nowrap bg-purple-100/60 px-1.5 py-0.2 rounded">
                {level === 5 ? 'MAX LEVEL' : `${totalGP}/${nextLevelGP} GP`}
              </span>
            </div>
          </div>

          {/* Audio volume panel drawer */}
          <AnimatePresence>
            {showVolumeControls && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden bg-purple-50/95 border border-purple-200 rounded-lg p-2 flex flex-col gap-1.5 mt-1 shadow-sm"
              >
                <div className="flex justify-between items-center text-[10px] font-extrabold text-purple-950">
                  <span className="flex items-center gap-1 text-[10px]">🔊 Mimi Audio Settings</span>
                  <button
                    onClick={() => {
                      synthAudio.playClick();
                      setShowVolumeControls(false);
                    }}
                    className="text-[9px] text-purple-600 hover:text-purple-800 cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex justify-between text-[8px] font-bold text-purple-700 px-1">
                      <span>🎵 Music Volume</span>
                      <span>{Math.round(musicVol * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-1 bg-white p-1 rounded-md border border-purple-100 shadow-2xs">
                      <Volume2 className="w-3 h-3 text-purple-600 shrink-0" />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={musicVol}
                        onChange={(e) => setMusicVol(Number(e.target.value))}
                        className="w-full accent-purple-600 h-1 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <div className="flex justify-between text-[8px] font-bold text-purple-700 px-1">
                      <span>✨ SFX Volume</span>
                      <span>{Math.round(sfxVol * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-1 bg-white p-1 rounded-md border border-purple-100 shadow-2xs">
                      <Volume2 className="w-3 h-3 text-purple-600 shrink-0" />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={sfxVol}
                        onChange={(e) => setSFXVol(Number(e.target.value))}
                        className="w-full accent-purple-600 h-1 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ==================== MIDDLE VIEWPORT (GAMEPLAY CONTAINER) ==================== */}
        <div className="flex-1 relative flex flex-col justify-end overflow-hidden border-y-[6px] border-purple-950 bg-purple-50">
          
          {/* Active Room Component (Serves as canvas background) */}
          <div className="absolute inset-0 z-0">
            {room === 'home' && (
              <RoomHome onWalk={handleWalk} petPositionX={positionX} />
            )}
            {room === 'lunch' && (
              <RoomLunch coins={stats.coins} onFeed={handleFeed} />
            )}
            {room === 'bedroom' && (
              <RoomBedroom
                isLightOff={isLightOff}
                onToggleLight={() => setIsLightOff((prev) => !prev)}
                energy={stats.energy}
              />
            )}
            {room === 'washroom' && (
              <RoomWashroom
                hygiene={stats.hygiene}
                soapBubbles={soapBubbles}
                showerOn={showerOn}
                brushingActive={brushingActive}
                onApplySoap={handleApplySoap}
                onToggleShower={handleToggleShower}
                onBrushTeeth={handleBrushTeeth}
                onToiletSession={handleToilet}
              />
            )}
            {room === 'gaming' && (
              <RoomGaming
                onEarnCoins={(amt) => {
                  adjustStat('coins', amt);
                  increaseGP(amt); // Game Tasks +1 GP per coin won
                }}
                coins={stats.coins}
              />
            )}
            {room === 'shop' && (
              <RoomShop
                coins={stats.coins}
                ownedAccessories={ownedAccessories}
                equippedHead={equippedHead}
                equippedEyes={equippedEyes}
                equippedNeck={equippedNeck}
                equippedColor={equippedColor}
                equippedClothes={equippedClothes}
                onPurchaseAccessory={handlePurchaseAccessory}
                onEquipAccessory={handleEquipAccessory}
                growthScale={growthScale}
              />
            )}
          </div>

          {/* Mimi Kitten Character with interactive adjustable position & size */}
          {room !== 'gaming' && room !== 'shop' && (
            <div
              className="absolute z-10 pointer-events-auto transition-all duration-100 flex justify-center w-[300px] md:w-[340px]"
              style={{
                left: `${positionX}%`,
                transform: 'translateX(-50%)',
                bottom: `calc(${room === 'home' ? '23%' : '17%'} + ${mimiYOffset}px)`,
              }}
            >
              <MimiPet
                status={mimiStatus}
                hunger={stats.hunger}
                hygiene={stats.hygiene}
                energy={stats.energy}
                happiness={stats.happiness}
                isLightOff={isLightOff}
                soapBubbles={soapBubbles}
                showerOn={showerOn}
                brushingActive={brushingActive}
                positionX={positionX}
                onTap={handlePetTap}
                message={getSpeechBubbleMessage()}
                equippedHead={equippedHead}
                equippedEyes={equippedEyes}
                equippedNeck={equippedNeck}
                equippedColor={equippedColor}
                equippedClothes={equippedClothes}
                growthScale={growthScale * mimiSizeMultiplier}
              />
            </div>
          )}

          {/* 🐾 DETECTIVE PET CONTROLLER OVERLAY (Supports horizontal walking, vertical height, and size adjustments) */}
          {room !== 'gaming' && room !== 'shop' && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-25 flex flex-col items-center gap-1.5 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-purple-500/40 shadow-xl scale-90 w-[240px]">
              
              {/* Walking & Repositioning row */}
              <div className="flex items-center justify-between w-full gap-1">
                <button
                  onClick={() => handleWalk(Math.max(10, targetX - 15))}
                  className="bg-purple-600 hover:bg-purple-500 active:scale-95 text-white py-0.5 px-1.5 rounded-md text-[8px] font-extrabold cursor-pointer transition-transform select-none"
                  title="Move Left"
                >
                  ◀
                </button>

                <span className="text-[8.5px] text-purple-200 font-extrabold select-none">Position</span>

                <input
                  type="range"
                  min="10"
                  max="90"
                  value={Math.round(targetX)}
                  onChange={(e) => handleWalk(Number(e.target.value))}
                  className="w-14 accent-purple-400 h-1 cursor-pointer"
                  title="Reposition Mimi"
                />

                <button
                  onClick={() => handleWalk(Math.min(90, targetX + 15))}
                  className="bg-purple-600 hover:bg-purple-500 active:scale-95 text-white py-0.5 px-1.5 rounded-md text-[8px] font-extrabold cursor-pointer transition-transform select-none"
                  title="Move Right"
                >
                  ▶
                </button>

                {/* Adjustments gear icon button */}
                <button
                  onClick={() => {
                    synthAudio.playClick();
                    setShowMimiAdjustments(prev => !prev);
                  }}
                  className={`p-1.5 rounded-md text-[9px] leading-none transition-all cursor-pointer flex items-center justify-center ${
                    showMimiAdjustments
                      ? 'bg-purple-500 text-white shadow-inner'
                      : 'bg-slate-800 text-purple-300 hover:bg-slate-700'
                  }`}
                  title="Adjust Size and Height"
                >
                  ⚙️
                </button>
              </div>

              {/* Collapsible adjustment options for custom pet styling */}
              <AnimatePresence>
                {showMimiAdjustments && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden flex flex-col gap-1.5 w-full border-t border-slate-800 pt-1.5 mt-0.5"
                  >
                    {/* Height offset slider */}
                    <div className="flex flex-col gap-0.5 w-full">
                      <div className="flex justify-between text-[8px] font-black text-purple-300 px-0.5">
                        <span>↕️ Height (Up / Down)</span>
                        <span>{mimiYOffset > 0 ? `+${mimiYOffset}` : mimiYOffset}px</span>
                      </div>
                      <input
                        type="range"
                        min="-60"
                        max="110"
                        step="5"
                        value={mimiYOffset}
                        onChange={(e) => setMimiYOffset(Number(e.target.value))}
                        className="w-full accent-purple-400 h-1 cursor-pointer"
                      />
                    </div>

                    {/* Size offset slider */}
                    <div className="flex flex-col gap-0.5 w-full">
                      <div className="flex justify-between text-[8px] font-black text-purple-300 px-0.5">
                        <span>🔍 Size (Small / Large)</span>
                        <span>{Math.round(mimiSizeMultiplier * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.45"
                        max="1.2"
                        step="0.05"
                        value={mimiSizeMultiplier}
                        onChange={(e) => setMimiSizeMultiplier(Number(e.target.value))}
                        className="w-full accent-purple-400 h-1 cursor-pointer"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          )}
        </div>

        {/* ==================== BOTTOM NAVIGATION (Cohesive purple console controls) ==================== */}
        <div className="bg-purple-950 text-purple-200 grid grid-cols-6 p-1.5 gap-1 z-30 shadow-2xl">
          
          {/* 1. HOME BUTTON */}
          <button
            onClick={() => {
              synthAudio.playTransition();
              setRoom('home');
              setIsLightOff(false);
              setMimiStatus('idle');
            }}
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg transition-all cursor-pointer ${
              room === 'home'
                ? 'bg-purple-600 text-white font-extrabold shadow-md border border-purple-500'
                : 'text-purple-300/80 hover:text-white'
            }`}
          >
            <span className="text-base">🏠</span>
            <span className="text-[8.5px] font-bold tracking-tight mt-0.5">Home</span>
          </button>

          {/* 2. LUNCH BUTTON */}
          <button
            onClick={() => {
              synthAudio.playTransition();
              setRoom('lunch');
              setIsLightOff(false);
              setMimiStatus('idle');
            }}
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg transition-all cursor-pointer ${
              room === 'lunch'
                ? 'bg-purple-600 text-white font-extrabold shadow-md border border-purple-500'
                : 'text-purple-300/80 hover:text-white'
            }`}
          >
            <span className="text-base">🍽️</span>
            <span className="text-[8.5px] font-bold tracking-tight mt-0.5">Lunch</span>
          </button>

          {/* 3. BEDROOM BUTTON */}
          <button
            onClick={() => {
              synthAudio.playTransition();
              setRoom('bedroom');
              setMimiStatus(isLightOff ? 'sleeping' : 'idle');
            }}
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg transition-all cursor-pointer ${
              room === 'bedroom'
                ? 'bg-purple-600 text-white font-extrabold shadow-md border border-purple-500'
                : 'text-purple-300/80 hover:text-white'
            }`}
          >
            <span className="text-base">🛏️</span>
            <span className="text-[8.5px] font-bold tracking-tight mt-0.5">Bedroom</span>
          </button>

          {/* 4. WASHROOM BUTTON */}
          <button
            onClick={() => {
              synthAudio.playTransition();
              setRoom('washroom');
              setIsLightOff(false);
              setMimiStatus('idle');
            }}
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg transition-all cursor-pointer ${
              room === 'washroom'
                ? 'bg-purple-600 text-white font-extrabold shadow-md border border-purple-500'
                : 'text-purple-300/80 hover:text-white'
            }`}
          >
            <span className="text-base">🚿</span>
            <span className="text-[8.5px] font-bold tracking-tight mt-0.5">Washroom</span>
          </button>

          {/* 5. GAMING BUTTON */}
          <button
            onClick={() => {
              synthAudio.playTransition();
              setRoom('gaming');
              setIsLightOff(false);
              setMimiStatus('idle');
            }}
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg transition-all cursor-pointer ${
              room === 'gaming'
                ? 'bg-purple-600 text-white font-extrabold shadow-md border border-purple-500'
                : 'text-purple-300/80 hover:text-white'
            }`}
          >
            <span className="text-base">🎮</span>
            <span className="text-[8.5px] font-bold tracking-tight mt-0.5">Gaming</span>
          </button>

          {/* 6. SHOP BUTTON */}
          <button
            onClick={() => {
              synthAudio.playTransition();
              setRoom('shop');
              setIsLightOff(false);
              setMimiStatus('idle');
            }}
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg transition-all cursor-pointer ${
              room === 'shop'
                ? 'bg-purple-600 text-white font-extrabold shadow-md border border-purple-500'
                : 'text-purple-300/80 hover:text-white'
            }`}
          >
            <span className="text-base">🏪</span>
            <span className="text-[8.5px] font-bold tracking-tight mt-0.5">Shop</span>
          </button>

        </div>

        {/* 🌟 LEVEL UP CELEBRATION MODAL 🌟 */}
        <AnimatePresence>
          {growthCelebration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 pointer-events-auto"
            >
              <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 30 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="bg-gradient-to-b from-purple-100 to-white border-4 border-purple-500 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
              >
                {/* Confetti Sparks */}
                <div className="absolute top-0 inset-x-0 h-2 flex justify-center gap-1.5 pointer-events-none">
                  <span className="animate-bounce text-xl" style={{ animationDelay: '0.1s' }}>✨</span>
                  <span className="animate-bounce text-xl" style={{ animationDelay: '0.3s' }}>🎉</span>
                  <span className="animate-bounce text-xl" style={{ animationDelay: '0.2s' }}>💖</span>
                  <span className="animate-bounce text-xl" style={{ animationDelay: '0.4s' }}>⭐</span>
                </div>

                <div className="text-6xl my-4 animate-bounce">🌱</div>
                
                <h2 className="text-xl font-black text-purple-950 uppercase tracking-tight">
                  Mimi Has Grown!
                </h2>
                <p className="text-xs font-bold text-purple-700 mt-1">
                  Your loving care has made Mimi scale up!
                </p>

                <div className="my-5 bg-purple-50 border border-purple-200/80 rounded-2xl py-3 px-4 flex flex-col gap-2 shadow-inner">
                  <div className="flex justify-around items-center">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-black text-slate-400">Old Growth</span>
                      <span className="text-sm font-extrabold text-slate-500">Lvl {growthCelebration.oldLevel}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-purple-500 animate-pulse" />
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-black text-purple-400">New Growth</span>
                      <span className="text-sm font-black text-purple-700">Lvl {growthCelebration.newLevel}</span>
                    </div>
                  </div>

                  <div className="border-t border-purple-200/40 pt-2">
                    <span className="text-[9px] uppercase font-black text-purple-400 block mb-0.5">Current Stage</span>
                    <span className="text-sm font-black text-purple-950">{growthCelebration.stage}</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 font-bold leading-tight mb-4 px-2">
                  Mimi's physical size is now permanently scaled up! Continue earning coins and keeping her stats high to see her final majestic guardian form.
                </p>

                <button
                  onClick={() => {
                    synthAudio.playHappyReward();
                    setGrowthCelebration(null);
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-extrabold text-xs py-2.5 rounded-xl shadow-md border-b-4 border-purple-800 transition-all cursor-pointer"
                >
                  Yay! Wonderful! 🐾
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
