export type Room = 'home' | 'lunch' | 'bedroom' | 'washroom' | 'gaming' | 'shop';

export interface PetStats {
  health: number;     // 0-100
  hunger: number;     // 0-100 (0 is starving, 100 is full)
  hygiene: number;    // 0-100 (0 is dirty, 100 is clean)
  happiness: number;  // 0-100 (0 is sad, 100 is happy)
  energy: number;     // 0-100 (0 is exhausted, 100 is energetic)
  coins: number;
}

export interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  hungerRestore: number;
  happinessBonus: number;
  cost: number;
}

export interface ToyItem {
  id: string;
  name: string;
  emoji: string;
  happinessRestore: number;
  energyCost: number;
  cost: number;
}
