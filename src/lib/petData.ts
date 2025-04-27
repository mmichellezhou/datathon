
export type PetType = 'cat' | 'dog' | 'rabbit' | 'hamster' | 'bird';

export const PET_TYPES: PetType[] = ['cat', 'dog', 'rabbit', 'hamster', 'bird'];

// Pet visuals based on growth stage
export const PET_STAGES = {
  baby: {
    scale: 0.7,
    color: 'bg-pet-light',
  },
  teen: {
    scale: 0.85,
    color: 'bg-pet',
  },
  adult: {
    scale: 1,
    color: 'bg-pet-accent',
  }
};

interface GrowthResult {
  newGrowth: number;
  evolveReady: boolean;
}

export const calculatePetGrowth = (currentGrowth: number, happiness: number): GrowthResult => {
  // Calculate growth increment based on happiness
  // Higher happiness means faster growth
  const growthIncrement = happiness / 100;
  
  // Increment growth by a small percentage (faster when happiness is high)
  let newGrowth = currentGrowth + growthIncrement;
  
  // Cap growth at 100
  newGrowth = Math.min(newGrowth, 100);
  
  // Pet is ready to evolve at 100% growth
  const evolveReady = newGrowth >= 100;
  
  return { newGrowth, evolveReady };
};

export const getPetStage = (growth: number) => {
  if (growth < 33) return 'baby';
  if (growth < 67) return 'teen';
  return 'adult';
};

export const difficultyOptions = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' }
];

export const getPetEmoji = (type: PetType, stage: string): string => {
  // Basic emoji representations for different pets and growth stages
  const petEmojis: Record<PetType, Record<string, string>> = {
    cat: {
      baby: '🐱',
      teen: '🐱',
      adult: '😺'
    },
    dog: {
      baby: '🐶',
      teen: '🐶',
      adult: '🐕'
    },
    rabbit: {
      baby: '🐰',
      teen: '🐰',
      adult: '🐇'
    },
    hamster: {
      baby: '🐹',
      teen: '🐹',
      adult: '🐹'
    },
    bird: {
      baby: '🐤',
      teen: '🐦',
      adult: '🦜'
    }
  };

  return petEmojis[type][stage] || '🐾';
};
