import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FoodItem } from '../types';
import { Sparkles, Coins, ChefHat, Flame, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { synthAudio } from '../utils/audio';

interface RoomLunchProps {
  coins: number;
  onFeed: (food: FoodItem) => void;
}

const QUICK_FOODS: FoodItem[] = [
  { id: 'fish', name: 'Fresh Fish', emoji: '🐟', hungerRestore: 25, happinessBonus: 10, cost: 0 },
  { id: 'milk', name: 'Creamy Milk', emoji: '🥛', hungerRestore: 15, happinessBonus: 8, cost: 5 },
  { id: 'tuna', name: 'Premium Tuna', emoji: '🥫', hungerRestore: 45, happinessBonus: 20, cost: 15 },
  { id: 'cake', name: 'Rainbow Cake', emoji: '🍰', hungerRestore: 30, happinessBonus: 40, cost: 25 },
  { id: 'catnip', name: 'Catnip Treat', emoji: '🌿', hungerRestore: 10, happinessBonus: 60, cost: 35 },
];

export interface Ingredient {
  id: string;
  name: string;
  emoji: string;
  cost: number;
}

const COOKING_INGREDIENTS: Ingredient[] = [
  { id: 'fish', name: 'Raw Fish', emoji: '🐟', cost: 0 },
  { id: 'milk', name: 'Fresh Milk', emoji: '🥛', cost: 3 },
  { id: 'cheese', name: 'Cheddar Cheese', emoji: '🧀', cost: 6 },
  { id: 'berry', name: 'Sweet Berry', emoji: '🍓', cost: 5 },
  { id: 'carrot', name: 'Organic Carrot', emoji: '🥕', cost: 3 },
];

const MIXER_INGREDIENTS: Ingredient[] = [
  { id: 'berry', name: 'Strawberry 🍓', emoji: '🍓', cost: 5 },
  { id: 'banana', name: 'Banana 🍌', emoji: '🍌', cost: 4 },
  { id: 'mango', name: 'Mango 🥭', emoji: '🥭', cost: 6 },
  { id: 'milk', name: 'Fresh Milk 🥛', emoji: '🥛', cost: 3 },
  { id: 'honey', name: 'Honey 🍯', emoji: '🍯', cost: 4 },
];

interface CustomDish {
  name: string;
  emoji: string;
  hungerRestore: number;
  happinessBonus: number;
}

export default function RoomLunch({ coins, onFeed }: RoomLunchProps) {
  const [activeMode, setActiveMode] = useState<'quick' | 'cook' | 'mixer'>('quick');
  const [flyParticles, setFlyParticles] = useState<Array<{ id: number; emoji: string; x: number; y: number }>>([]);

  // Cooking state
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [cookingState, setCookingState] = useState<'idle' | 'chopping' | 'stirring' | 'cooking' | 'done'>('idle');
  const [cookedDish, setCookedDish] = useState<CustomDish | null>(null);
  const [chopProgress, setChopProgress] = useState<number>(0);
  const [stirProgress, setStirProgress] = useState<number>(0);
  const [gameParticles, setGameParticles] = useState<Array<{ id: number; emoji: string; x: number; y: number }>>([]);

  const triggerGameParticle = (emoji: string, x: number, y: number) => {
    const p = {
      id: Date.now() + Math.random(),
      emoji,
      x,
      y,
    };
    setGameParticles((prev) => [...prev, p]);
    setTimeout(() => {
      setGameParticles((prev) => prev.filter((item) => item.id !== p.id));
    }, 800);
  };

  // Mixer state
  const [selectedMixerIngredients, setSelectedMixerIngredients] = useState<Ingredient[]>([]);
  const [mixingState, setMixingState] = useState<'idle' | 'mixing' | 'done'>('idle');
  const [mixedDrink, setMixedDrink] = useState<CustomDish | null>(null);

  const triggerFeedParticles = (emoji: string) => {
    const newParticle = {
      id: Date.now(),
      emoji: emoji,
      x: 35 + Math.random() * 30,
      y: 120,
    };
    setFlyParticles((prev) => [...prev, newParticle]);
    setTimeout(() => {
      setFlyParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 1200);
  };

  const handleUseQuickFood = (food: FoodItem) => {
    if (coins < food.cost) {
      synthAudio.playSadMeow();
      alert("Oops! You don't have enough coins for this treat! 🪙 Earn more in the Gaming Room.");
      return;
    }
    synthAudio.playEating();
    onFeed(food);
    triggerFeedParticles(food.emoji);
  };

  // Add ingredient to pot
  const handleSelectIngredient = (ing: Ingredient) => {
    if (cookingState !== 'idle') return;
    if (selectedIngredients.length >= 2) {
      synthAudio.playSadMeow();
      return;
    }
    if (coins < ing.cost) {
      synthAudio.playSadMeow();
      alert(`Oops! You need ${ing.cost} coins to buy this ingredient!`);
      return;
    }

    synthAudio.playClick();
    setSelectedIngredients((prev) => [...prev, ing]);
  };

  // Remove ingredient from pot
  const handleRemoveIngredient = (index: number) => {
    if (cookingState !== 'idle') return;
    synthAudio.playClick();
    setSelectedIngredients((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Clear pot
  const handleClearPot = () => {
    if (cookingState !== 'idle') return;
    synthAudio.playClick();
    setSelectedIngredients([]);
  };

  // Determine cooked dish based on combined ingredients
  const calculateDish = (ings: Ingredient[]): CustomDish => {
    if (ings.length === 0) {
      return { name: 'Boiled Air Soup', emoji: '💨', hungerRestore: 5, happinessBonus: 1 };
    }
    if (ings.length === 1) {
      return { 
        name: `Steamed ${ings[0].name}`, 
        emoji: ings[0].emoji === '🥛' ? '🥣' : ings[0].emoji, 
        hungerRestore: 20, 
        happinessBonus: 15 
      };
    }

    const ids = ings.map(i => i.id).sort();
    const [id1, id2] = ids;

    if (id1 === 'fish' && id2 === 'milk') {
      return { name: 'Creamy Fish Chowder', emoji: '🍲', hungerRestore: 55, happinessBonus: 35 };
    }
    if (id1 === 'fish' && id2 === 'cheese') {
      return { name: 'Cheesy Baked Catfish', emoji: '🍤', hungerRestore: 60, happinessBonus: 40 };
    }
    if (id1 === 'milk' && id2 === 'milk') {
      return { name: 'Hot Milk Froth Cup', emoji: '☕', hungerRestore: 30, happinessBonus: 25 };
    }
    if (id1 === 'berry' && id2 === 'milk') {
      return { name: 'Strawberry Milkshake', emoji: '🥤', hungerRestore: 45, happinessBonus: 50 };
    }
    if (id1 === 'berry' && id2 === 'cheese') {
      return { name: 'Berry Cheesecake Slice', emoji: '🍰', hungerRestore: 45, happinessBonus: 55 };
    }
    if (id1 === 'cheese' && id2 === 'milk') {
      return { name: 'Warm Cheese Fondue', emoji: '🫕', hungerRestore: 50, happinessBonus: 35 };
    }
    if (id1 === 'carrot' && id2 === 'milk') {
      return { name: 'Sweet Carrot Puree', emoji: '🥣', hungerRestore: 40, happinessBonus: 35 };
    }
    if (id1 === 'berry' && id2 === 'carrot') {
      return { name: 'Fruity Garden Salad', emoji: '🥗', hungerRestore: 35, happinessBonus: 45 };
    }
    if (id1 === 'berry' && id2 === 'fish') {
      return { name: 'Salmon Sweet Berry Glaze', emoji: '🍣', hungerRestore: 55, happinessBonus: 40 };
    }
    if (id1 === 'carrot' && id2 === 'cheese') {
      return { name: 'Baked Cheesy Carrots', emoji: '🧆', hungerRestore: 45, happinessBonus: 40 };
    }
    if (id1 === 'carrot' && id2 === 'fish') {
      return { name: 'Nutri-Kitten Fish Soup', emoji: '🍜', hungerRestore: 50, happinessBonus: 35 };
    }

    return {
      name: `Fried Double ${ings[0].name}`,
      emoji: '🍡',
      hungerRestore: 40,
      happinessBonus: 30,
    };
  };

  // Determine mixed smoothie based on combined ingredients
  const calculateMixedDrink = (ings: Ingredient[]): CustomDish => {
    if (ings.length === 0) {
      return { name: 'Plain Water', emoji: '💧', hungerRestore: 5, happinessBonus: 5 };
    }
    if (ings.length === 1) {
      const ing = ings[0];
      if (ing.id === 'berry') return { name: 'Strawberry Juice 🍓', emoji: '🥤', hungerRestore: 25, happinessBonus: 30 };
      if (ing.id === 'banana') return { name: 'Banana Shake 🍌', emoji: '🥤', hungerRestore: 30, happinessBonus: 25 };
      if (ing.id === 'mango') return { name: 'Mango Pulp 🥭', emoji: '🍹', hungerRestore: 35, happinessBonus: 35 };
      if (ing.id === 'milk') return { name: 'Cold Milk 🥛', emoji: '🥛', hungerRestore: 20, happinessBonus: 15 };
      if (ing.id === 'honey') return { name: 'Sweet Honey Syrup 🍯', emoji: '🍯', hungerRestore: 15, happinessBonus: 40 };
      return { name: `Mimi Pureed ${ing.name}`, emoji: '🥤', hungerRestore: 20, happinessBonus: 20 };
    }

    const ids = ings.map(i => i.id).sort();
    const [id1, id2] = ids;

    if (id1 === 'berry' && id2 === 'milk') {
      return { name: 'Strawberry Milkshake 🍓🥛', emoji: '🥤', hungerRestore: 50, happinessBonus: 50 };
    }
    if (id1 === 'banana' && id2 === 'milk') {
      return { name: 'Creamy Banana Smoothie 🍌🥛', emoji: '🥤', hungerRestore: 45, happinessBonus: 40 };
    }
    if (id1 === 'mango' && id2 === 'milk') {
      return { name: 'Sweet Mango Lassi 🥭🥛', emoji: '🍹', hungerRestore: 55, happinessBonus: 50 };
    }
    if (id1 === 'berry' && id2 === 'honey') {
      return { name: 'Honey Glazed Berry Blast 🍓🍯', emoji: '🍹', hungerRestore: 45, happinessBonus: 55 };
    }
    if (id1 === 'banana' && id2 === 'honey') {
      return { name: 'Honey Banana Puree 🍌🍯', emoji: '🍯', hungerRestore: 40, happinessBonus: 45 };
    }
    if (id1 === 'honey' && id2 === 'mango') {
      return { name: 'Honey Mango Delight 🥭🍯', emoji: '🍹', hungerRestore: 50, happinessBonus: 60 };
    }
    if (id1 === 'banana' && id2 === 'berry') {
      return { name: 'Strawberry Banana Blend 🍓🍌', emoji: '🥤', hungerRestore: 45, happinessBonus: 50 };
    }
    if (id1 === 'berry' && id2 === 'mango') {
      return { name: 'Mango Berry Punch 🥭🍓', emoji: '🍹', hungerRestore: 50, happinessBonus: 50 };
    }
    if (id1 === 'banana' && id2 === 'mango') {
      return { name: 'Tropical Sunshine Smoothie 🍌🥭', emoji: '🧉', hungerRestore: 55, happinessBonus: 50 };
    }
    if (id1 === 'honey' && id2 === 'milk') {
      return { name: 'Warm Honey Milk 🥛🍯', emoji: '🥛', hungerRestore: 35, happinessBonus: 35 };
    }

    return {
      name: `Double Sweet Blend ${ings[0].name} 🍹`,
      emoji: '🍹',
      hungerRestore: 40,
      happinessBonus: 35,
    };
  };

  // Trigger cooking action (Starts chopping minigame)
  const handleCook = () => {
    if (selectedIngredients.length === 0) return;
    
    synthAudio.playSparkle();
    setChopProgress(0);
    setStirProgress(0);
    setCookingState('chopping');
  };

  const handleChopAction = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, isTap = false) => {
    if (cookingState !== 'chopping') return;
    
    let clientX = 0;
    let clientY = 0;
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    const now = Date.now();
    const lastSound = (window as any)._lastChopSound || 0;
    
    let addedProgress = 0;
    if (isTap) {
      addedProgress = 10;
      synthAudio.playChop();
      (window as any)._lastChopSound = now;
      
      // Spawn particles
      selectedIngredients.forEach((ing) => {
        triggerGameParticle(ing.emoji, x + (Math.random() * 20 - 10), y + (Math.random() * 20 - 10));
      });
    } else {
      const lastX = (window as any)._lastChopX || 0;
      const lastY = (window as any)._lastChopY || 0;
      const dist = Math.hypot(x - lastX, y - lastY);
      
      if (dist > 8) {
        addedProgress = 1.8;
        if (now - lastSound > 90) {
          synthAudio.playChop();
          (window as any)._lastChopSound = now;
          
          const randomIng = selectedIngredients[Math.floor(Math.random() * selectedIngredients.length)];
          if (randomIng) {
            triggerGameParticle(randomIng.emoji, x, y);
          }
        }
        (window as any)._lastChopX = x;
        (window as any)._lastChopY = y;
      }
    }

    if (addedProgress > 0) {
      setChopProgress((prev) => {
        const next = Math.min(100, prev + addedProgress);
        if (next >= 100) {
          setTimeout(() => {
            synthAudio.playSparkle();
            setCookingState('stirring');
          }, 300);
        }
        return next;
      });
    }
  };

  const handleStirAction = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, isClick = false) => {
    if (cookingState !== 'stirring') return;

    let clientX = 0;
    let clientY = 0;
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    const now = Date.now();
    const lastSound = (window as any)._lastStirSound || 0;

    let addedProgress = 0;
    if (isClick) {
      addedProgress = 8;
      synthAudio.playStir();
      (window as any)._lastStirSound = now;
      triggerGameParticle('🫧', x, y);
    } else {
      const lastX = (window as any)._lastStirX || 0;
      const lastY = (window as any)._lastStirY || 0;
      const dist = Math.hypot(x - lastX, y - lastY);

      if (dist > 5) {
        addedProgress = 1.5;
        if (now - lastSound > 150) {
          synthAudio.playStir();
          (window as any)._lastStirSound = now;
          triggerGameParticle('🫧', x, y);
        }
        (window as any)._lastStirX = x;
        (window as any)._lastStirY = y;
      }
    }

    if (addedProgress > 0) {
      setStirProgress((prev) => {
        const next = Math.min(100, prev + addedProgress);
        if (next >= 100) {
          setTimeout(() => {
            synthAudio.playSparkle();
            setCookingState('cooking');
            
            const interval = setInterval(() => {
              synthAudio.playClick();
            }, 300);

            setTimeout(() => {
              clearInterval(interval);
              synthAudio.playHappyReward();
              const result = calculateDish(selectedIngredients);
              setCookedDish(result);
              setCookingState('done');
            }, 1500);

          }, 300);
        }
        return next;
      });
    }
  };

  // Serve custom cooked dish
  const handleFeedCustomDish = () => {
    if (!cookedDish) return;

    synthAudio.playEating();
    
    const totalCost = selectedIngredients.reduce((acc, ing) => acc + ing.cost, 0);
    const mockFood: FoodItem = {
      id: 'custom_cooked',
      name: cookedDish.name,
      emoji: cookedDish.emoji,
      hungerRestore: cookedDish.hungerRestore,
      happinessBonus: cookedDish.happinessBonus,
      cost: totalCost,
    };

    onFeed(mockFood);
    triggerFeedParticles(cookedDish.emoji);

    setSelectedIngredients([]);
    setCookedDish(null);
    setCookingState('idle');
  };

  // Add mixer ingredient
  const handleSelectMixerIngredient = (ing: Ingredient) => {
    if (mixingState !== 'idle') return;
    if (selectedMixerIngredients.length >= 2) {
      synthAudio.playSadMeow();
      return;
    }
    if (coins < ing.cost) {
      synthAudio.playSadMeow();
      alert(`Oops! You need ${ing.cost} coins to buy this ingredient!`);
      return;
    }

    synthAudio.playClick();
    setSelectedMixerIngredients((prev) => [...prev, ing]);
  };

  // Clear Mixer jar
  const handleClearMixer = () => {
    if (mixingState !== 'idle') return;
    synthAudio.playClick();
    setSelectedMixerIngredients([]);
  };

  // Mix blender action
  const handleMix = () => {
    if (selectedMixerIngredients.length === 0) return;

    synthAudio.playMixerBuzz();
    setMixingState('mixing');

    setTimeout(() => {
      synthAudio.playSparkle();
      const result = calculateMixedDrink(selectedMixerIngredients);
      setMixedDrink(result);
      setMixingState('done');
    }, 1600);
  };

  // Feed blended juice
  const handleFeedMixedDrink = () => {
    if (!mixedDrink) return;

    synthAudio.playDrinking();
    
    const totalCost = selectedMixerIngredients.reduce((acc, ing) => acc + ing.cost, 0);
    const mockFood: FoodItem = {
      id: 'custom_mixed',
      name: mixedDrink.name,
      emoji: mixedDrink.emoji,
      hungerRestore: mixedDrink.hungerRestore,
      happinessBonus: mixedDrink.happinessBonus,
      cost: totalCost,
    };

    onFeed(mockFood);
    triggerFeedParticles(mixedDrink.emoji);

    setSelectedMixerIngredients([]);
    setMixedDrink(null);
    setMixingState('idle');
  };

  return (
    <div
      className="relative w-full h-full flex flex-col justify-end overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #fef3c7 0%, #ffedd5 60%, #fed7aa 100%)',
      }}
    >
      {/* Kitchen Background Decors */}
      <div className="absolute top-14 right-3 pointer-events-none text-right z-10">
        <span className="text-3xl">🍳</span>
        <div className="text-[9px] text-amber-900 font-bold bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded-md mt-1 shadow-2xs border border-amber-200">
          Mimi's Kitchen Stove
        </div>
      </div>

      <div className="absolute top-14 left-4 pointer-events-none opacity-20 z-0 select-none">
        <span className="text-6xl">🍽️</span>
      </div>

      {/* Floating NOM particles */}
      <AnimatePresence>
        {flyParticles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 0.5, y: 150 }}
            animate={{ 
              opacity: [1, 1, 0], 
              scale: [0.8, 1.6, 1.2],
              y: [120, -100],
              x: [0, Math.random() * 40 - 20]
            }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute z-40 text-4xl pointer-events-none left-1/2 -ml-6"
          >
            {p.emoji}
            <div className="text-[9px] bg-yellow-400 text-amber-950 px-1.5 py-0.5 rounded-full font-extrabold text-center mt-1 border border-yellow-500 shadow-md">
              YUMMY!
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Mode Switches: Lunch Bar vs Custom Stove vs Mixer */}
      <div className="absolute top-2.5 left-2 z-20 flex gap-1 bg-amber-950/10 p-0.5 rounded-full border border-amber-950/5 max-w-[95%] overflow-x-auto whitespace-nowrap scrollbar-none">
        <button
          onClick={() => { synthAudio.playClick(); setActiveMode('quick'); }}
          className={`px-2.5 py-1 rounded-full text-[9px] font-black tracking-tight transition-all cursor-pointer ${
            activeMode === 'quick'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-amber-950/70 hover:text-amber-950'
          }`}
        >
          🍕 Quick Lunch
        </button>
        <button
          onClick={() => { synthAudio.playClick(); setActiveMode('cook'); }}
          className={`px-2.5 py-1 rounded-full text-[9px] font-black tracking-tight transition-all cursor-pointer flex items-center gap-0.5 ${
            activeMode === 'cook'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-amber-950/70 hover:text-amber-950'
          }`}
        >
          <ChefHat className="w-2.5 h-2.5" /> Stove 🍳
        </button>
        <button
          onClick={() => { synthAudio.playClick(); setActiveMode('mixer'); }}
          className={`px-2.5 py-1 rounded-full text-[9px] font-black tracking-tight transition-all cursor-pointer flex items-center gap-0.5 ${
            activeMode === 'mixer'
              ? 'bg-pink-500 text-white shadow-xs'
              : 'text-amber-950/70 hover:text-amber-950'
          }`}
        >
          🍹 Mixie (మిక్సీ) 🔄
        </button>
      </div>

      {/* ================= MAIN PANEL ================= */}
      <div className="w-full bg-orange-100/95 border-t-4 border-amber-500 rounded-t-2xl p-2 z-10 shadow-xl flex flex-col gap-1.5 relative">
        
        {/* Banner with Coin display */}
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-black text-amber-950 flex items-center gap-1">
            {activeMode === 'quick' && '🍕 Standard Food Bar'}
            {activeMode === 'cook' && '🍳 Custom Stove Pot'}
            {activeMode === 'mixer' && '🍹 Sweet Mixie / Blender'}
          </span>
          <span className="text-[9px] font-bold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-full flex items-center gap-0.5 shrink-0">
            <Coins className="w-3 h-3 text-amber-600 fill-amber-500" />
            <span>{coins} coins</span>
          </span>
        </div>

        {/* ----------------- MODE A: QUICK FEED TREATS ----------------- */}
        {activeMode === 'quick' && (
          <div className="flex flex-col gap-1.5">
            <div className="grid grid-cols-5 gap-1.5 justify-center items-stretch">
              {QUICK_FOODS.map((food) => {
                const canAfford = coins >= food.cost;
                return (
                  <motion.div
                    key={food.id}
                    whileTap={{ scale: 0.92 }}
                    className={`relative flex flex-col items-center justify-between p-1.5 rounded-lg border transition-colors cursor-pointer select-none text-center ${
                      canAfford
                        ? 'bg-white border-amber-300 hover:border-amber-400 shadow-3xs'
                        : 'bg-slate-100/80 border-slate-200 opacity-60'
                    }`}
                    onClick={() => handleUseQuickFood(food)}
                  >
                    {/* Cost Tag */}
                    <div className="absolute top-0.5 right-0.5 text-[7.5px] font-black text-amber-800">
                      {food.cost === 0 ? (
                        <span className="text-emerald-600">FREE</span>
                      ) : (
                        <span>{food.cost}🪙</span>
                      )}
                    </div>

                    {/* Draggable or Tappable food emoji */}
                    <motion.div
                      drag
                      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                      dragElastic={0.6}
                      onDragEnd={(e, info) => {
                        if (info.offset.y < -65) {
                          handleUseQuickFood(food);
                        }
                      }}
                      className="text-2xl my-0.5 active:cursor-grabbing hover:scale-110 transition-transform"
                      title="Drag up to feed Mimi!"
                    >
                      {food.emoji}
                    </motion.div>

                    {/* Stats details */}
                    <div className="w-full flex flex-col items-center">
                      <span className="text-[8.5px] font-bold text-slate-800 truncate max-w-full">
                        {food.name}
                      </span>
                      <div className="mt-0.5 flex flex-col gap-0.2">
                        <span className="text-[7.5px] bg-orange-50 text-orange-800 font-extrabold px-0.5 rounded-xs">
                          🍔 +{food.hungerRestore}
                        </span>
                        <span className="text-[7.5px] bg-rose-50 text-rose-800 font-extrabold px-0.5 rounded-xs mt-0.5">
                          😊 +{food.happinessBonus}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="text-center text-[8.5px] text-amber-900/80 bg-amber-50 rounded-md py-0.5 px-1 border border-amber-200/40">
              💡 Drag food items <strong>UPWARDS</strong> to Mimi or <strong>TAP</strong> to feed!
            </div>
          </div>
        )}

        {/* ----------------- MODE B: INTERACTIVE COOKING (కుకింగ్) ----------------- */}
        {activeMode === 'cook' && (
          <div className="grid grid-cols-12 gap-2">
            
            {/* Left side: The boiling pot on the stove */}
            <div className="col-span-5 bg-orange-900/10 border border-orange-950/10 rounded-xl p-1.5 flex flex-col justify-between items-center relative overflow-hidden bg-white/50">
              
              <div className="text-center w-full">
                <span className="text-[8px] font-black uppercase text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 shadow-3xs">
                  🍲 Cooking Pot
                </span>
              </div>

              {/* The Pot Representation */}
              <div className="flex-1 flex flex-col justify-center items-center my-1.5 relative w-full">
                {/* Cooking / Boiling Steam Particles */}
                {(cookingState === 'cooking' || cookingState === 'stirring') && (
                  <div className="absolute -top-3 inset-x-0 flex justify-center gap-1">
                    <motion.span animate={{ y: [-2, -15, -2], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="text-xs">💨</motion.span>
                    <motion.span animate={{ y: [-2, -20, -2], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.7, delay: 0.15 }} className="text-xs">💨</motion.span>
                    <motion.span animate={{ y: [-2, -12, -2], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.3 }} className="text-xs">💨</motion.span>
                  </div>
                )}

                {/* The Pot SVG/Emoji */}
                <motion.div
                  animate={
                    cookingState === 'cooking'
                      ? { rotate: [-2, 2, -2], scale: [1, 1.05, 1], y: [0, -2, 0] }
                      : cookingState === 'stirring'
                      ? { rotate: [-1, 1, -1], scale: [1, 1.02, 1] }
                      : { rotate: 0, scale: 1 }
                  }
                  transition={{ duration: 0.25, repeat: (cookingState === 'cooking' || cookingState === 'stirring') ? Infinity : 0 }}
                  className="text-4xl drop-shadow-md relative"
                >
                  🥣
                  {selectedIngredients.length > 0 && cookingState !== 'done' && (
                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-0.5 text-[10px]">
                      {selectedIngredients.map((ing, idx) => (
                        <span key={idx}>{ing.emoji}</span>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Stove Flame */}
                <div className="mt-1 flex items-center justify-center gap-0.5">
                  <Flame className={`w-3.5 h-3.5 transition-colors ${
                    cookingState === 'cooking'
                      ? 'text-red-500 fill-red-500 animate-bounce'
                      : cookingState === 'stirring'
                      ? 'text-amber-500 fill-amber-500 animate-pulse'
                      : 'text-slate-300'
                  }`} />
                  <span className="text-[7.5px] font-extrabold text-slate-500">Stove Heat</span>
                </div>
              </div>

              {selectedIngredients.length > 0 && cookingState === 'idle' && (
                <button
                  onClick={handleClearPot}
                  className="px-1.5 py-0.5 text-[7.5px] font-black text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded flex items-center gap-0.5 cursor-pointer"
                >
                  <Trash2 className="w-2.5 h-2.5" /> Dump Pot
                </button>
              )}
            </div>

            {/* Right side: Pantry ingredients selection & Minigames */}
            <div className="col-span-7 flex flex-col justify-between relative overflow-hidden">
              
              {cookingState === 'idle' && (
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h3 className="text-[9px] font-extrabold text-purple-950 mb-1">Pantry Ingredients (Click to Add):</h3>
                    
                    <div className="grid grid-cols-5 gap-1">
                      {COOKING_INGREDIENTS.map((ing) => {
                        const countInPot = selectedIngredients.filter(i => i.id === ing.id).length;
                        const isFull = selectedIngredients.length >= 2;
                        return (
                          <button
                            key={ing.id}
                            onClick={() => handleSelectIngredient(ing)}
                            disabled={isFull}
                            className={`p-1 border rounded-lg flex flex-col items-center justify-between text-center select-none cursor-pointer transition-all relative ${
                              isFull
                                ? 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed'
                                : 'bg-white border-amber-300 hover:border-amber-400 shadow-3xs'
                            }`}
                          >
                            <span className="text-lg">{ing.emoji}</span>
                            <span className="text-[7px] font-black text-slate-700 leading-none truncate max-w-full mt-0.5">
                              {ing.cost === 0 ? 'FREE' : `${ing.cost}🪙`}
                            </span>
                            
                            {countInPot > 0 && (
                              <div className="absolute -top-1 -right-1 bg-purple-600 text-white font-extrabold text-[7px] w-3 h-3 rounded-full flex items-center justify-center">
                                {countInPot}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-1 flex items-center gap-1">
                    {selectedIngredients.length > 0 ? (
                      <button
                        onClick={handleCook}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-black text-[9px] py-1 rounded-lg shadow-sm flex items-center justify-center gap-1 cursor-pointer animate-pulse"
                      >
                        <ChefHat className="w-3 h-3 shrink-0" />
                        <span>Stir & Cook! ({selectedIngredients.length}/2)</span>
                      </button>
                    ) : (
                      <div className="flex-1 bg-amber-50 border border-amber-200 text-amber-900/80 rounded-lg p-1 text-[8.5px] font-bold text-center italic">
                        🍳 Select 1 or 2 items to put into the stove pot!
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* CHOPPING MINI-GAME */}
              {cookingState === 'chopping' && (
                <div className="flex flex-col h-full justify-between bg-amber-50 border border-amber-200 rounded-xl p-1.5 relative overflow-hidden">
                  <div className="text-center">
                    <span className="text-[8px] font-black bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300 uppercase">
                      STEP 1: CHOP INGREDIENTS 🔪
                    </span>
                    <p className="text-[8px] font-bold text-slate-500 mt-1">
                      Swipe across or Tap rapidly to CHOP!
                    </p>
                  </div>

                  {/* Wood Cutting Board Area */}
                  <div
                    onMouseMove={(e) => handleChopAction(e, false)}
                    onTouchMove={(e) => handleChopAction(e, false)}
                    onClick={(e) => handleChopAction(e, true)}
                    className="flex-1 my-1.5 border-4 border-amber-900/20 rounded-lg relative overflow-hidden cursor-crosshair flex items-center justify-center bg-[radial-gradient(#fed7aa_1px,transparent_1px)] [background-size:16px_16px] bg-orange-100 active:scale-[0.99] transition-all select-none"
                  >
                    {/* Floating game particles */}
                    {gameParticles.map((gp) => (
                      <motion.span
                        key={gp.id}
                        initial={{ scale: 1.5, opacity: 1, rotate: 0 }}
                        animate={{ scale: [1.2, 0.6], opacity: [1, 0], y: [0, 15], rotate: [0, 90] }}
                        transition={{ duration: 0.6 }}
                        className="absolute text-sm pointer-events-none z-30"
                        style={{ left: `${gp.x}%`, top: `${gp.y}%`, transform: 'translate(-50%, -50%)' }}
                      >
                        {gp.emoji}
                      </motion.span>
                    ))}

                    {/* Ingredients to be chopped */}
                    <div className="flex gap-4 items-center justify-center relative">
                      {selectedIngredients.map((ing, idx) => (
                        <motion.div
                          key={idx}
                          animate={
                            chopProgress < 100
                              ? { rotate: [-5, 5, -5], scale: [1, 1.05, 1] }
                              : { rotate: 0, scale: 0.8 }
                          }
                          transition={{ repeat: Infinity, duration: 1.2, delay: idx * 0.2 }}
                          className="text-4xl filter drop-shadow-md relative select-none"
                        >
                          {ing.emoji}
                          {/* Sliced slash overlay when chopped a bit */}
                          {chopProgress > 15 && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 0.4 }}
                              className="absolute inset-0 bg-red-600/40 h-1 top-1/2 -translate-y-1/2 rotate-45 rounded"
                            />
                          )}
                          {chopProgress > 50 && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 0.4 }}
                              className="absolute inset-0 bg-red-600/40 h-1 top-1/2 -translate-y-1/2 -rotate-45 rounded"
                            />
                          )}
                        </motion.div>
                      ))}

                      {/* Floating Knife Indicator */}
                      <span className="absolute text-2xl -top-6 -right-2 animate-bounce pointer-events-none select-none">🔪</span>
                    </div>

                    {/* Sliced bits effect overlay */}
                    {chopProgress > 0 && (
                      <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="w-full">
                    <div className="flex justify-between items-center text-[7.5px] font-extrabold text-amber-950 mb-0.5">
                      <span>CHOP PROGRESS</span>
                      <span>{Math.round(chopProgress)}%</span>
                    </div>
                    <div className="w-full bg-amber-200/50 rounded-full h-2.5 overflow-hidden border border-amber-300">
                      <motion.div
                        className="bg-amber-600 h-full rounded-full"
                        animate={{ width: `${chopProgress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STIRRING MINI-GAME */}
              {cookingState === 'stirring' && (
                <div className="flex flex-col h-full justify-between bg-purple-50 border border-purple-200 rounded-xl p-1.5 relative overflow-hidden">
                  <div className="text-center">
                    <span className="text-[8px] font-black bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded border border-purple-300 uppercase">
                      STEP 2: STIR THE POT 🥄
                    </span>
                    <p className="text-[8px] font-bold text-slate-500 mt-1">
                      Drag in CIRCLES or swipe around to stir!
                    </p>
                  </div>

                  {/* Stir Bowl Area */}
                  <div
                    onMouseMove={(e) => handleStirAction(e, false)}
                    onTouchMove={(e) => handleStirAction(e, false)}
                    onClick={(e) => handleStirAction(e, true)}
                    className="flex-1 my-1.5 border-4 border-purple-900/20 rounded-full relative overflow-hidden cursor-pointer flex items-center justify-center bg-purple-100/50 active:scale-[0.99] transition-all select-none max-w-[120px] mx-auto aspect-square"
                  >
                    {/* Bubbles particles */}
                    {gameParticles.map((gp) => (
                      <motion.span
                        key={gp.id}
                        initial={{ scale: 0.5, opacity: 0.8 }}
                        animate={{ scale: [0.8, 1.4], opacity: [0.8, 0], y: [-15, -30] }}
                        transition={{ duration: 0.7 }}
                        className="absolute text-sm pointer-events-none z-30"
                        style={{ left: `${gp.x}%`, top: `${gp.y}%`, transform: 'translate(-50%, -50%)' }}
                      >
                        {gp.emoji}
                      </motion.span>
                    ))}

                    {/* Spoon & swirling ingredients */}
                    <div className="relative flex flex-col items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                        className="w-14 h-14 rounded-full border-2 border-dashed border-purple-400 flex items-center justify-center"
                      >
                        <span className="text-lg">🥣</span>
                      </motion.div>
                      
                      {/* Stir spoon icon rotating around */}
                      <motion.div
                        animate={{
                          x: [0, 20, 0, -20, 0],
                          y: [-20, 0, 20, 0, -20],
                          rotate: [0, 90, 180, 270, 360]
                        }}
                        transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
                        className="absolute text-xl select-none pointer-events-none"
                      >
                        🥄
                      </motion.div>
                    </div>
                  </div>

                  {/* Stirring Progress bar */}
                  <div className="w-full">
                    <div className="flex justify-between items-center text-[7.5px] font-extrabold text-purple-950 mb-0.5">
                      <span>STIR PROGRESS</span>
                      <span>{Math.round(stirProgress)}%</span>
                    </div>
                    <div className="w-full bg-purple-200/50 rounded-full h-2.5 overflow-hidden border border-purple-300">
                      <motion.div
                        className="bg-purple-600 h-full rounded-full"
                        animate={{ width: `${stirProgress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {cookingState === 'cooking' && (
                <div className="flex flex-col justify-center items-center h-full py-4 bg-purple-950/5 border border-purple-950/5 rounded-xl">
                  <div className="relative w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin flex items-center justify-center">
                    <span className="text-base animate-pulse">🔥</span>
                  </div>
                  <p className="text-[9px] font-black text-purple-950 mt-2 animate-bounce">Mixing & Cooking Custom Food...</p>
                  <p className="text-[7px] font-bold text-purple-600">Generating a yummy recipe combination!</p>
                </div>
              )}

              {cookingState === 'done' && cookedDish && (
                <div className="flex flex-col justify-between h-full bg-emerald-50 border border-emerald-200 rounded-xl p-1.5">
                  <div className="flex gap-2 items-center">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-2xl shadow-inner border border-emerald-200">
                      <span>{cookedDish.emoji}</span>
                    </div>
                    <div className="overflow-hidden leading-tight flex-1">
                      <div className="text-[7px] font-extrabold uppercase bg-emerald-100 border border-emerald-200 text-emerald-800 px-1 py-0.2 rounded w-fit">
                        Recipe Success!
                      </div>
                      <h4 className="text-[10px] font-black text-emerald-950 truncate">{cookedDish.name}</h4>
                      <div className="flex gap-1.5 mt-0.5">
                        <span className="text-[7.5px] text-orange-800 bg-orange-100 font-extrabold px-1 rounded">
                          🍔 +{cookedDish.hungerRestore} Hunger
                        </span>
                        <span className="text-[7.5px] text-rose-800 bg-rose-100 font-extrabold px-1 rounded">
                          😊 +{cookedDish.happinessBonus} Joy
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1.5 mt-2">
                    <button
                      onClick={() => {
                        synthAudio.playClick();
                        setSelectedIngredients([]);
                        setCookedDish(null);
                        setCookingState('idle');
                      }}
                      className="px-2 py-1 text-[8.5px] font-extrabold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
                    >
                      Cook New
                    </button>
                    <button
                      onClick={handleFeedCustomDish}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[9px] py-1 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Feed Mimi! 🐾</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ----------------- MODE C: MIXER GRINDER / BLENDER (మిక్సీ) ----------------- */}
        {activeMode === 'mixer' && (
          <div className="grid grid-cols-12 gap-2 animate-[fadeIn_0.3s_ease]">
            
            {/* Left side: The Mixer Machine (Occupies 5 columns) */}
            <div className="col-span-5 bg-pink-900/10 border border-pink-950/10 rounded-xl p-1.5 flex flex-col justify-between items-center relative overflow-hidden bg-white/50">
              
              <div className="text-center w-full">
                <span className="text-[8px] font-black uppercase text-pink-700 bg-pink-50 px-1.5 py-0.5 rounded border border-pink-200 shadow-3xs">
                  🍹 Mixie Grinder
                </span>
              </div>

              {/* The Animated Mixie Container */}
              <motion.div
                animate={
                  mixingState === 'mixing'
                    ? { x: [-1.5, 1.5, -1.5, 1.5, -1], y: [-1, 1, -1, 1, 0] }
                    : { x: 0, y: 0 }
                }
                transition={{ duration: 0.08, repeat: mixingState === 'mixing' ? Infinity : 0 }}
                className="flex-1 flex flex-col justify-center items-center my-1.5 relative w-full"
              >
                {/* Glass Jar of the mixer */}
                <div className="w-18 h-22 bg-cyan-50/70 border-[3px] border-cyan-300 rounded-t-xl relative flex flex-col justify-between items-center shadow-inner overflow-hidden">
                  
                  {/* Lid of the jar */}
                  <div className="w-full h-2.5 bg-slate-700 border-b border-slate-900 flex items-center justify-center shrink-0">
                    <div className="w-3 h-1 bg-slate-500 rounded-t-xs" />
                  </div>

                  {/* Liquid Swirling Animation when mixing */}
                  {mixingState === 'mixing' && (
                    <motion.div 
                      className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-pink-400 to-fuchsia-300/90 z-10"
                      initial={{ height: '20%' }}
                      animate={{ height: ['40%', '85%', '65%', '80%'] }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                      style={{
                        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, transparent 60%)'
                      }}
                    >
                      <div className="absolute top-2 inset-x-0 flex justify-around">
                        <span className="w-1 h-1 bg-white rounded-full animate-ping" />
                        <span className="w-0.5 h-0.5 bg-white rounded-full animate-bounce delay-100" />
                        <span className="w-1 h-1 bg-pink-100 rounded-full animate-bounce delay-300" />
                      </div>
                    </motion.div>
                  )}

                  {/* Finished smoothie visual inside jar when done */}
                  {mixingState === 'done' && mixedDrink && (
                    <div className="absolute inset-x-0 bottom-0 bg-pink-400/90 h-[70%] z-10 flex flex-col items-center justify-end pb-2">
                      <span className="text-xl animate-bounce">{mixedDrink.emoji}</span>
                      <div className="w-full h-1 bg-white/40 absolute top-0 left-0" />
                    </div>
                  )}

                  {/* Jar handle */}
                  <div className="absolute right-0.5 top-5 w-2.5 h-8 border-2 border-l-transparent border-cyan-300 rounded-r-lg z-25" />

                  {/* Inside jar items */}
                  {selectedMixerIngredients.length > 0 && mixingState === 'idle' && (
                    <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1 z-20">
                      {selectedMixerIngredients.map((ing, idx) => (
                        <motion.span 
                          key={idx}
                          animate={{ y: [0, -3, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5, delay: idx * 0.3 }}
                          className="text-lg filter drop-shadow-md"
                        >
                          {ing.emoji}
                        </motion.span>
                      ))}
                    </div>
                  )}

                  {/* Blades at the bottom */}
                  <div className="w-full h-1.5 bg-slate-600/40 absolute bottom-0 z-5 flex items-center justify-center">
                    <div className="w-10 h-0.5 bg-slate-700" />
                  </div>

                </div>

                {/* Mixer Base */}
                <div className="w-20 h-10 bg-rose-500 rounded-b-xl border-t-2 border-rose-700 flex flex-col justify-center items-center shadow-md relative shrink-0">
                  <span className="text-[6px] font-black text-rose-100 uppercase tracking-wider leading-none mb-1">Mimi Mix</span>
                  
                  {/* Control Knob */}
                  <button 
                    disabled={selectedMixerIngredients.length === 0 || mixingState !== 'idle'}
                    onClick={handleMix}
                    className={`w-5 h-5 rounded-full border border-rose-800 flex items-center justify-center cursor-pointer transition-all ${
                      mixingState === 'mixing'
                        ? 'bg-amber-400 rotate-90 shadow-inner'
                        : selectedMixerIngredients.length > 0
                          ? 'bg-emerald-500 hover:bg-emerald-400 animate-pulse'
                          : 'bg-slate-300 cursor-not-allowed'
                    }`}
                  >
                    {mixingState === 'mixing' ? (
                      <span className="text-[5.5px] font-black text-rose-950">ON</span>
                    ) : (
                      <span className="text-[5.5px] font-black text-white">GO</span>
                    )}
                  </button>
                </div>
              </motion.div>

              {selectedMixerIngredients.length > 0 && mixingState === 'idle' && (
                <button
                  onClick={handleClearMixer}
                  className="px-1.5 py-0.5 text-[7px] font-black text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded flex items-center gap-0.5 cursor-pointer"
                >
                  <Trash2 className="w-2.5 h-2.5" /> Empty Jar
                </button>
              )}
            </div>

            {/* Right side: Mixer Pantry (fruits, honey, milk) */}
            <div className="col-span-7 flex flex-col justify-between">
              
              {mixingState === 'idle' && (
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h3 className="text-[9px] font-extrabold text-pink-950 mb-1">Select Fruit & Liquid (యాడ్ చేయి):</h3>
                    
                    <div className="grid grid-cols-5 gap-1">
                      {MIXER_INGREDIENTS.map((ing) => {
                        const countInJar = selectedMixerIngredients.filter(i => i.id === ing.id).length;
                        const isFull = selectedMixerIngredients.length >= 2;
                        return (
                          <button
                            key={ing.id}
                            onClick={() => handleSelectMixerIngredient(ing)}
                            disabled={isFull}
                            className={`p-1 border rounded-lg flex flex-col items-center justify-between text-center select-none cursor-pointer transition-all relative ${
                              isFull
                                                    ? 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed'
                                : 'bg-white border-pink-200 hover:border-pink-300 shadow-3xs'
                            }`}
                          >
                            <span className="text-lg">{ing.emoji}</span>
                            <span className="text-[6.5px] font-black text-pink-900 leading-none truncate max-w-full mt-1 bg-pink-50 px-0.5 py-0.2 rounded">
                              {ing.name.split(' ')[0]}
                            </span>
                            <span className="text-[7px] font-black text-slate-500 mt-0.5">
                              {ing.cost}🪙
                            </span>
                            
                            {countInJar > 0 && (
                              <div className="absolute -top-1 -right-1 bg-pink-500 text-white font-extrabold text-[7px] w-3 h-3 rounded-full flex items-center justify-center">
                                {countInJar}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-1 flex items-center gap-1">
                    {selectedMixerIngredients.length > 0 ? (
                      <button
                        onClick={handleMix}
                        className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black text-[9px] py-1 rounded-lg shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>🔄 Mix Fruits! ({selectedMixerIngredients.length}/2)</span>
                      </button>
                    ) : (
                      <div className="flex-1 bg-pink-50 border border-pink-200/50 text-pink-900/80 rounded-lg p-1 text-[8.5px] font-bold text-center italic">
                        🍹 Select 1 or 2 items to grind in the mixer!
                      </div>
                    )}
                  </div>
                </div>
              )}

              {mixingState === 'mixing' && (
                <div className="flex flex-col justify-center items-center h-full py-4 bg-pink-950/5 border border-pink-950/5 rounded-xl text-center">
                  <div className="relative w-8 h-8 rounded-full border-2 border-pink-500 border-t-transparent animate-spin flex items-center justify-center">
                    <span className="text-sm animate-bounce">⚡</span>
                  </div>
                  <p className="text-[9.5px] font-black text-pink-950 mt-2 animate-pulse">మిక్సీ తిరుగుతోంది... 🔄</p>
                  <p className="text-[7.5px] font-bold text-pink-600 leading-none mt-0.5">Grinding & blending tasty fruits!</p>
                </div>
              )}

              {mixingState === 'done' && mixedDrink && (
                <div className="flex flex-col justify-between h-full bg-emerald-50 border border-emerald-200 rounded-xl p-1.5">
                  <div className="flex gap-2 items-center">
                    <div className="w-9 h-9 rounded-lg bg-pink-100 flex items-center justify-center text-2xl shadow-inner border border-pink-200">
                      <span>{mixedDrink.emoji}</span>
                    </div>
                    <div className="overflow-hidden leading-tight flex-1">
                      <div className="text-[7px] font-extrabold uppercase bg-pink-100 border border-pink-200 text-pink-800 px-1 py-0.2 rounded w-fit mb-0.5">
                        Juice is Ready! (జ్యూస్ రెడీ!) 🍹
                      </div>
                      <h4 className="text-[9.5px] font-black text-pink-950 truncate">{mixedDrink.name}</h4>
                      <div className="flex gap-1 mt-1">
                        <span className="text-[7px] text-orange-800 bg-orange-100 font-extrabold px-1 py-0.2 rounded">
                          🍔 +{mixedDrink.hungerRestore} Hunger
                        </span>
                        <span className="text-[7px] text-rose-800 bg-rose-100 font-extrabold px-1 py-0.2 rounded">
                          😊 +{mixedDrink.happinessBonus} Joy
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1.5 mt-2">
                    <button
                      onClick={() => {
                        synthAudio.playClick();
                        setSelectedMixerIngredients([]);
                        setMixedDrink(null);
                        setMixingState('idle');
                      }}
                      className="px-2 py-1 text-[8.5px] font-extrabold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
                    >
                      Blend New
                    </button>
                    <button
                      onClick={handleFeedMixedDrink}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[9px] py-1 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Feed Mimi! (మిమికి తినిపించు) 🐾</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
