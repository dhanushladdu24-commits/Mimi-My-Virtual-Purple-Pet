import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coins, Sparkles, Check, ArrowRight, Star, ShoppingBag, Eye, EyeOff } from 'lucide-react';
import { synthAudio } from '../utils/audio';
import MimiPet from './MimiPet';

export interface Accessory {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  category: 'head' | 'eyes' | 'neck' | 'dyes' | 'clothes';
  description: string;
  themeColor: string;
}

export const SHOP_ACCESSORIES: Accessory[] = [
  // HEAD
  {
    id: 'redBow',
    name: 'Cute Red Bow',
    emoji: '🎀',
    cost: 15,
    category: 'head',
    description: 'A cute red ribbon bow that sits gracefully on Mimi\'s left ear base!',
    themeColor: 'from-rose-500 to-red-600',
  },
  {
    id: 'partyHat',
    name: 'Party Hat',
    emoji: '🥳',
    cost: 35,
    category: 'head',
    description: 'Celebrate every day! Conical hat with colorful stripes and a golden pom-pom.',
    themeColor: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'detectiveHat',
    name: 'Detective Hat',
    emoji: '🕵️',
    cost: 65,
    category: 'head',
    description: 'Elementary, dear meow! Classic brown deerstalker hat for serious case solving.',
    themeColor: 'from-amber-600 to-amber-800',
  },
  {
    id: 'crown',
    name: 'Royal Crown',
    emoji: '👑',
    cost: 120,
    category: 'head',
    description: 'Fits for a true kitty empress. Golden crest set with glowing ruby and sapphire jewels.',
    themeColor: 'from-yellow-400 to-amber-500',
  },

  // EYES
  {
    id: 'cuteMonocle',
    name: 'Cute Monocle',
    emoji: '🧐',
    cost: 25,
    category: 'eyes',
    description: 'Adds a massive boost of kitten elegance. Complete with a dainty golden chain.',
    themeColor: 'from-blue-400 to-sky-600',
  },
  {
    id: 'coolShades',
    name: 'Cool Shades',
    emoji: '🕶️',
    cost: 50,
    category: 'eyes',
    description: 'Instant coolness multiplier. Midnight black lenses with dynamic sleek lens flares.',
    themeColor: 'from-slate-700 to-slate-900',
  },
  {
    id: 'starGlasses',
    name: 'Star Glasses',
    emoji: '⭐',
    cost: 85,
    category: 'eyes',
    description: 'Be the pop star you were born to be! Retro star frames with vibrant pink style.',
    themeColor: 'from-pink-500 to-rose-600',
  },

  // NECK
  {
    id: 'goldBellCollar',
    name: 'Bell Collar',
    emoji: '🔔',
    cost: 20,
    category: 'neck',
    description: 'A classic scarlet leather strap holding a highly polished ringable gold bell.',
    themeColor: 'from-red-500 to-orange-500',
  },
  {
    id: 'redBowtie',
    name: 'Red Bowtie',
    emoji: '👔',
    cost: 45,
    category: 'neck',
    description: 'Extremely dapper, polite, and handsome. Ideal for receiving guests at teatime.',
    themeColor: 'from-red-600 to-rose-700',
  },
  {
    id: 'royalCape',
    name: 'Royal Cape',
    emoji: '🧣',
    cost: 95,
    category: 'neck',
    description: 'Luxurious velvet cloak featuring fluffy ermine trim and a secure golden brooch.',
    themeColor: 'from-red-700 to-purple-900',
  },

  // DYES / DRESS COLORS
  {
    id: 'classicViolet',
    name: 'Classic Violet Dye',
    emoji: '🧪',
    cost: 0,
    category: 'dyes',
    description: 'The sweet standard lavender-violet coat Mimi loves!',
    themeColor: 'from-purple-400 to-purple-600',
  },
  {
    id: 'cherryPink',
    name: 'Cherry Pink Dye',
    emoji: '🌸',
    cost: 20,
    category: 'dyes',
    description: 'Sweet, charming cherry blossom pink fur color!',
    themeColor: 'from-pink-300 to-rose-400',
  },
  {
    id: 'mintMatcha',
    name: 'Matcha Green Dye',
    emoji: '🍵',
    cost: 35,
    category: 'dyes',
    description: 'Refreshing matcha green coat. Natural and vibrant look!',
    themeColor: 'from-emerald-300 to-emerald-500',
  },
  {
    id: 'cosmicCyan',
    name: 'Cosmic Cyan Dye',
    emoji: '🌌',
    cost: 50,
    category: 'dyes',
    description: 'Glowing, high-energy neon cyan color from outer space!',
    themeColor: 'from-cyan-300 to-cyan-500',
  },
  {
    id: 'goldenCaramel',
    name: 'Honey Caramel Dye',
    emoji: '🍯',
    cost: 75,
    category: 'dyes',
    description: 'Rich golden honey-caramel coat. Shiny and delicious look!',
    themeColor: 'from-amber-300 to-orange-500',
  },
  {
    id: 'sakuraRose',
    name: 'Sakura Rose Dye',
    emoji: '🌹',
    cost: 100,
    category: 'dyes',
    description: 'Sunset peach-rose dual-tone gradient. Exceptionally lovely!',
    themeColor: 'from-orange-300 to-rose-500',
  },
  {
    id: 'starryObsidian',
    name: 'Obsidian Dark Dye',
    emoji: '🖤',
    cost: 130,
    category: 'dyes',
    description: 'Sleek, dark starry obsidian coat. Elegant, mysterious and dapper!',
    themeColor: 'from-slate-400 to-slate-800',
  },

  // CLOTHES / DRESSES
  {
    id: 'pinkTutu',
    name: 'Pink Tutu 👗',
    emoji: '🩰',
    cost: 30,
    category: 'clothes',
    description: 'A gorgeous pink ballerina tutu skirt with sweet ruffles and pink folds!',
    themeColor: 'from-pink-400 to-rose-400',
  },
  {
    id: 'detectiveCoat',
    name: 'Detective Coat 🧥',
    emoji: '🕵️‍♂️',
    cost: 60,
    category: 'clothes',
    description: 'A classic brown detective trench coat complete with a sleek dark belt!',
    themeColor: 'from-amber-600 to-amber-800',
  },
  {
    id: 'royalTunic',
    name: 'Royal Tunic 👑',
    emoji: '🏰',
    cost: 110,
    category: 'clothes',
    description: 'A rich crimson royal dress trimmed with gold stitching and shiny star buttons!',
    themeColor: 'from-red-600 to-amber-500',
  },
  {
    id: 'superHeroSuit',
    name: 'Hero Costume 🦸',
    emoji: '⚡',
    cost: 70,
    category: 'clothes',
    description: 'A high-flying neon blue athletic suit with a glowing star insignia and red power sash!',
    themeColor: 'from-blue-500 to-indigo-600',
  },
];

interface RoomShopProps {
  coins: number;
  ownedAccessories: string[];
  equippedHead: string | null;
  equippedEyes: string | null;
  equippedNeck: string | null;
  equippedColor: string | null;
  equippedClothes: string | null;
  onPurchaseAccessory: (id: string, cost: number) => void;
  onEquipAccessory: (category: 'head' | 'eyes' | 'neck' | 'dyes' | 'clothes', id: string | null) => void;
  growthScale?: number;
}

export default function RoomShop({
  coins,
  ownedAccessories,
  equippedHead,
  equippedEyes,
  equippedNeck,
  equippedColor,
  equippedClothes,
  onPurchaseAccessory,
  onEquipAccessory,
  growthScale = 1.0,
}: RoomShopProps) {
  const [activeTab, setActiveTab] = useState<'head' | 'eyes' | 'neck' | 'dyes' | 'clothes'>('head');
  const [purchaseSuccessId, setPurchaseSuccessId] = useState<string | null>(null);

  // Filter items based on active tab
  const currentItems = SHOP_ACCESSORIES.filter((item) => item.category === activeTab);

  const handleBuy = (item: Accessory) => {
    if (coins < item.cost) {
      synthAudio.playSadMeow(); // Cannot afford sound
      return;
    }

    // Process purchase
    synthAudio.playCoinCollect();
    synthAudio.playSparkle();
    onPurchaseAccessory(item.id, item.cost);

    // Auto-equip purchased item
    onEquipAccessory(item.category, item.id);

    // Trigger visual confetti/sparkle success overlay for the item card
    setPurchaseSuccessId(item.id);
    setTimeout(() => {
      setPurchaseSuccessId(null);
    }, 1800);
  };

  const handleEquipToggle = (item: Accessory) => {
    synthAudio.playClick();
    const isEquipped =
      (item.category === 'head' && equippedHead === item.id) ||
      (item.category === 'eyes' && equippedEyes === item.id) ||
      (item.category === 'neck' && equippedNeck === item.id) ||
      (item.category === 'dyes' && equippedColor === item.id) ||
      (item.category === 'clothes' && equippedClothes === item.id);

    if (isEquipped) {
      onEquipAccessory(item.category, null);
    } else {
      // Equip
      onEquipAccessory(item.category, item.id);
    }
  };

  const getEquippedIdForCategory = (cat: 'head' | 'eyes' | 'neck' | 'dyes' | 'clothes') => {
    if (cat === 'head') return equippedHead;
    if (cat === 'eyes') return equippedEyes;
    if (cat === 'neck') return equippedNeck;
    if (cat === 'clothes') return equippedClothes;
    return equippedColor;
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-gradient-to-b from-amber-50/90 via-amber-100/60 to-purple-900/10 p-3 select-none relative overflow-hidden">
      
      {/* Whimsical Boutique Background Styling */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] z-0">
        <div className="absolute top-12 left-6 text-5xl">👚</div>
        <div className="absolute top-24 right-8 text-5xl">👒</div>
        <div className="absolute bottom-20 left-12 text-6xl">🕶️</div>
        <div className="absolute bottom-16 right-16 text-5xl">🎀</div>
      </div>

      {/* Header Banner */}
      <div className="flex justify-between items-center bg-white/80 backdrop-blur-md px-3 py-2 rounded-2xl border border-amber-200/50 shadow-xs z-10">
        <div className="flex items-center gap-1.5">
          <span className="text-xl">🏪</span>
          <div>
            <h2 className="text-xs font-black tracking-tight text-purple-950 uppercase flex items-center gap-1">
              Mimi's Boutique <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
            </h2>
            <p className="text-[8.5px] font-bold text-amber-800 leading-tight">Dress up your cute purple companion!</p>
          </div>
        </div>

        {/* Current Coin Balance */}
        <div className="bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300 shadow-2xs flex items-center gap-1">
          <Coins className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
          <span className="text-xs font-extrabold text-amber-950">{coins}</span>
        </div>
      </div>

      {/* Main Interactive Dressing / Shopping Interface */}
      <div className="flex-1 grid grid-cols-12 gap-2 my-2 z-10 overflow-hidden">
        
        {/* Left Side: Live Mini Dressing Room Preview (Occupies 5 columns) */}
        <div className="col-span-5 bg-white/90 backdrop-blur-sm rounded-2xl border border-amber-200/50 p-2 shadow-xs flex flex-col justify-between items-center relative overflow-hidden">
          {/* Background Dressing Mirror Glow */}
          <div className="absolute inset-x-2 top-2 bottom-12 rounded-xl bg-gradient-to-b from-purple-100/40 via-sky-50/20 to-amber-50/30 border border-purple-200/20 shadow-inner pointer-events-none" />

          <div className="w-full text-center z-10">
            <span className="text-[8px] font-extrabold uppercase bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
              🪞 Fit Mirror
            </span>
          </div>

          {/* Interactive Live Character Display */}
          <div className="flex-1 flex items-center justify-center w-full relative">
            <div className="scale-65 origin-center w-full h-full flex items-center justify-center">
              <MimiPet
                status="happy"
                hunger={100}
                hygiene={100}
                energy={100}
                happiness={100}
                isLightOff={false}
                soapBubbles={false}
                showerOn={false}
                brushingActive={false}
                positionX={50}
                equippedHead={equippedHead}
                equippedEyes={equippedEyes}
                equippedNeck={equippedNeck}
                equippedColor={equippedColor}
                equippedClothes={equippedClothes}
                growthScale={growthScale}
              />
            </div>
          </div>

          {/* Unequip-All helper button */}
          {(equippedHead || equippedEyes || equippedNeck || equippedColor || equippedClothes) ? (
            <button
              onClick={() => {
                synthAudio.playClick();
                onEquipAccessory('head', null);
                onEquipAccessory('eyes', null);
                onEquipAccessory('neck', null);
                onEquipAccessory('dyes', null);
                onEquipAccessory('clothes', null);
              }}
              className="z-10 w-full py-1 text-[8.5px] font-black text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              <EyeOff className="w-3 h-3" /> Strip Outfit
            </button>
          ) : (
            <span className="z-10 text-[8px] text-slate-400 font-bold italic py-1 flex items-center gap-1">
              <Eye className="w-3 h-3 text-purple-300" /> Naked as a kitten!
            </span>
          )}
        </div>

        {/* Right Side: Tabbed Accessory Browser (Occupies 7 columns) */}
        <div className="col-span-7 flex flex-col overflow-hidden bg-purple-950/5 p-1 rounded-2xl border border-purple-950/5">
          
          {/* Accessory Category Tabs */}
          <div className="grid grid-cols-5 gap-0.5 bg-purple-950/10 p-0.5 rounded-xl border border-purple-950/5">
            <button
              onClick={() => { synthAudio.playClick(); setActiveTab('head'); }}
              className={`py-1.5 rounded-lg text-[8px] md:text-[9px] font-extrabold transition-all cursor-pointer text-center ${
                activeTab === 'head'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-purple-950/70 hover:bg-purple-950/5 hover:text-purple-950'
              }`}
            >
              👒 Head
            </button>
            <button
              onClick={() => { synthAudio.playClick(); setActiveTab('eyes'); }}
              className={`py-1.5 rounded-lg text-[8px] md:text-[9px] font-extrabold transition-all cursor-pointer text-center ${
                activeTab === 'eyes'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-purple-950/70 hover:bg-purple-950/5 hover:text-purple-950'
              }`}
            >
              🕶️ Eyes
            </button>
            <button
              onClick={() => { synthAudio.playClick(); setActiveTab('neck'); }}
              className={`py-1.5 rounded-lg text-[8px] md:text-[9px] font-extrabold transition-all cursor-pointer text-center ${
                activeTab === 'neck'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-purple-950/70 hover:bg-purple-950/5 hover:text-purple-950'
              }`}
            >
              🔔 Neck
            </button>
            <button
              onClick={() => { synthAudio.playClick(); setActiveTab('clothes'); }}
              className={`py-1.5 rounded-lg text-[8px] md:text-[9px] font-extrabold transition-all cursor-pointer text-center ${
                activeTab === 'clothes'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-purple-950/70 hover:bg-purple-950/5 hover:text-purple-950'
              }`}
            >
              👗 Dress
            </button>
            <button
              onClick={() => { synthAudio.playClick(); setActiveTab('dyes'); }}
              className={`py-1.5 rounded-lg text-[8px] md:text-[9px] font-extrabold transition-all cursor-pointer text-center ${
                activeTab === 'dyes'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-purple-950/70 hover:bg-purple-950/5 hover:text-purple-950'
              }`}
            >
              🎨 Colors
            </button>
          </div>

          {/* List of accessories in selected category */}
          <div className="flex-1 overflow-y-auto pr-0.5 mt-1.5 space-y-1.5 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {currentItems.map((item) => {
                const isOwned = ownedAccessories.includes(item.id) || item.id === 'classicViolet';
                const isEquipped = getEquippedIdForCategory(item.category) === item.id || (item.id === 'classicViolet' && !equippedColor);
                const canAfford = coins >= item.cost;
                const isSuccess = purchaseSuccessId === item.id;

                return (
                  <motion.div
                    key={item.id}
                    layoutId={`item-card-${item.id}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`relative flex gap-2 p-2 rounded-xl border transition-all ${
                      isEquipped
                        ? 'bg-gradient-to-r from-purple-50 to-indigo-50/50 border-purple-400 shadow-xs'
                        : isOwned
                        ? 'bg-white border-slate-200'
                        : 'bg-white/75 border-slate-200/70'
                    }`}
                  >
                    {/* Success Sparkle Flash Overlay */}
                    {isSuccess && (
                      <div className="absolute inset-0 bg-emerald-500/10 border border-emerald-500 rounded-xl flex items-center justify-center z-10 animate-pulse pointer-events-none">
                        <span className="text-emerald-600 font-extrabold text-[10px] bg-white px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 shadow-md">
                          🎉 Purchased & Applied!
                        </span>
                      </div>
                    )}

                    {/* Left: Item Avatar Circle */}
                    <div className={`w-11 h-11 shrink-0 rounded-lg bg-gradient-to-br ${item.themeColor} flex items-center justify-center text-xl shadow-inner relative`}>
                      <span>{item.emoji}</span>
                      {isEquipped && (
                        <div className="absolute -top-1 -right-1 bg-emerald-500 border-2 border-white text-white p-0.5 rounded-full shadow-xs">
                          <Check className="w-2 h-2 stroke-[4]" />
                        </div>
                      )}
                    </div>

                    {/* Right: Item Details & Action Button */}
                    <div className="flex-1 flex flex-col justify-between overflow-hidden">
                      <div className="leading-none mb-0.5">
                        <h4 className="text-[10px] font-black text-purple-950 flex items-center justify-between">
                          <span>{item.name}</span>
                          {isOwned && !isEquipped && (
                            <span className="text-[7.5px] font-bold text-purple-500 uppercase bg-purple-50 px-1.5 py-0.2 rounded border border-purple-100">
                              Owned
                            </span>
                          )}
                        </h4>
                        <p className="text-[8px] text-slate-500 font-bold mt-0.5 leading-tight line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      {/* Buy / Equip Button Footer */}
                      <div className="flex justify-end items-center mt-1">
                        {isOwned ? (
                          <button
                            onClick={() => handleEquipToggle(item)}
                            className={`px-3 py-1 rounded-lg text-[9px] font-black cursor-pointer shadow-2xs transition-all flex items-center gap-1 ${
                              isEquipped
                                ? 'bg-rose-500 text-white hover:bg-rose-600'
                                : 'bg-purple-600 text-white hover:bg-purple-700'
                            }`}
                          >
                            {isEquipped ? 'Unequip ❌' : 'Equip 👚'}
                          </button>
                        ) : (
                          <button
                            disabled={!canAfford}
                            onClick={() => handleBuy(item)}
                            className={`px-2.5 py-1 rounded-lg text-[9px] font-black cursor-pointer shadow-2xs transition-all flex items-center gap-1 ${
                              canAfford
                                ? 'bg-amber-400 text-amber-950 hover:bg-amber-300'
                                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                            }`}
                          >
                            <ShoppingBag className="w-2.5 h-2.5 shrink-0" />
                            <span>Buy for</span>
                            <div className="flex items-center gap-0.5 text-amber-950 font-black">
                              <Coins className="w-2.5 h-2.5 text-amber-600 fill-amber-500" />
                              <span>{item.cost}</span>
                            </div>
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Wardrobe stats tip bar */}
      <div className="bg-purple-900 text-purple-200 px-3 py-1.5 rounded-xl text-[8.5px] font-bold leading-tight flex items-center gap-2 border border-purple-800">
        <span className="text-base animate-bounce">💡</span>
        <span>
          <strong>Dressing Tips:</strong> Mimi keeps her customized outfit permanently across all rooms! Try pairing hats with glasses and neck collars for the ultimate kitty styling.
        </span>
      </div>

    </div>
  );
}
