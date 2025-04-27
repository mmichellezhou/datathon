import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { calculatePetGrowth, PET_TYPES, PetType } from "@/lib/petData";

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Task {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  timeSpent: number; // minutes
  completedAt: Date;
}

export interface CompletedPet {
  id: string;
  type: PetType;
  name: string;
  happiness: number;
  score: number;
  completedAt: Date;
  tasks: Task[];
}

interface AppContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "completedAt">) => void;
  currentPet: {
    name: string;
    type: PetType;
    happiness: number;
    growth: number;
  };
  setCurrentPetName: (name: string) => void;
  completedPets: CompletedPet[];
  resetCurrentPet: () => void;
  lastSelectedDifficulty: DifficultyLevel | null;
}

const defaultPet = {
  name: "Buddy",
  type: "cat",
  happiness: 50,
  growth: 0,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  // Local storage keys
  const TASKS_KEY = "pet-tasks";
  const CURRENT_PET_KEY = "current-pet";
  const COMPLETED_PETS_KEY = "completed-pets";
  const LAST_DIFFICULTY_KEY = "last-difficulty";

  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentPet, setCurrentPet] = useState(defaultPet);
  const [completedPets, setCompletedPets] = useState<CompletedPet[]>([]);
  const [lastSelectedDifficulty, setLastSelectedDifficulty] = useState<DifficultyLevel | null>(null);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem(TASKS_KEY);
    const savedPet = localStorage.getItem(CURRENT_PET_KEY);
    const savedCompletedPets = localStorage.getItem(COMPLETED_PETS_KEY);
    const savedLastDifficulty = localStorage.getItem(LAST_DIFFICULTY_KEY);

    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks.map((task: any) => ({
          ...task,
          completedAt: new Date(task.completedAt)
        })));
      } catch (e) {
        console.error("Error parsing saved tasks:", e);
      }
    }

    if (savedPet) {
      try {
        setCurrentPet(JSON.parse(savedPet));
      } catch (e) {
        console.error("Error parsing saved pet:", e);
      }
    }

    if (savedCompletedPets) {
      try {
        const parsedPets = JSON.parse(savedCompletedPets);
        setCompletedPets(parsedPets.map((pet: any) => ({
          ...pet,
          completedAt: new Date(pet.completedAt),
          tasks: pet.tasks.map((task: any) => ({
            ...task,
            completedAt: new Date(task.completedAt)
          }))
        })));
      } catch (e) {
        console.error("Error parsing saved completed pets:", e);
      }
    }

    if (savedLastDifficulty) {
      try {
        setLastSelectedDifficulty(savedLastDifficulty as DifficultyLevel);
      } catch (e) {
        console.error("Error parsing saved last difficulty:", e);
      }
    }

    // Decay happiness with time
    const decayInterval = setInterval(() => {
      setCurrentPet(prevPet => {
        const newHappiness = Math.max(0, prevPet.happiness - 1);
        return {
          ...prevPet,
          happiness: newHappiness
        };
      });
    }, 900000); // 15 minutes

    return () => clearInterval(decayInterval);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(CURRENT_PET_KEY, JSON.stringify(currentPet));
  }, [currentPet]);

  useEffect(() => {
    localStorage.setItem(COMPLETED_PETS_KEY, JSON.stringify(completedPets));
  }, [completedPets]);

  useEffect(() => {
    if (lastSelectedDifficulty) {
      localStorage.setItem(LAST_DIFFICULTY_KEY, lastSelectedDifficulty);
    }
  }, [lastSelectedDifficulty]);

  // Add a new task
  const addTask = (task: Omit<Task, "id" | "completedAt">) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      completedAt: new Date(),
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setLastSelectedDifficulty(task.difficulty);

    // Calculate happiness and growth based on task difficulty and time spent
    let base = Math.min(Math.max(task.timeSpent/15, 1), 12); // 15 minutes x 12 = 3 hours max
    let boost = 0;

    switch(task.difficulty) {
      case 'easy':
        boost = 0.75;
        break;
      case 'medium':
        boost = 1;
        break;
      case 'hard':
        boost = 1.25;
        break;
    }
    
    let happinessBoost = Math.ceil(5 + base * boost);
    let growthBoost = Math.ceil(base * boost / 3);

    // Update pet happiness and growth
    setCurrentPet((prevPet) => {
      const newHappiness = Math.min(prevPet.happiness + happinessBoost, 100);

      let extraGrowthBoost = 0;
      if (prevPet.happiness >= 90) {
        extraGrowthBoost = 1;
      }

      const newGrowth = Math.min(prevPet.growth + growthBoost + extraGrowthBoost, 100);
      
      // Show toast for happiness increase
      toast({
        title: "Task completed!",
        description: `${prevPet.name}'s happiness increased by ${happinessBoost}!`,
      });
      
      // Check if pet is ready to evolve
      if (newGrowth >= 100 && prevPet.growth < 100) {
        toast({
          title: "Your pet is ready to evolve!",
          description: "Your pet has reached maximum growth. Get a new pet!",
          variant: "default",
        });
      }
      
      return {
        ...prevPet,
        happiness: newHappiness,
        growth: newGrowth,
      };
    });
  };

  // Set current pet name
  const setCurrentPetName = (name: string) => {
    setCurrentPet((prevPet) => ({
      ...prevPet,
      name,
    }));
  };

  // Reset current pet and add to completed pets
  const resetCurrentPet = () => {
    // Calculate pet score based on happiness and tasks
    const petScore = Math.round(currentPet.happiness + tasks.length * 5);
    
    // Add current pet to completed pets
    const completedPet: CompletedPet = {
      id: crypto.randomUUID(),
      type: currentPet.type,
      name: currentPet.name,
      happiness: currentPet.happiness,
      score: petScore,
      completedAt: new Date(),
      tasks: [...tasks],
    };

    setCompletedPets((prev) => [...prev, completedPet]);
    
    // Get next pet type randomly
    const availablePetTypes = PET_TYPES.filter(type => type !== currentPet.type);
    const nextPetType = availablePetTypes[Math.floor(Math.random() * availablePetTypes.length)];
    
    // Reset current pet
    setCurrentPet({
      name: "Buddy",
      type: nextPetType,
      happiness: 50,
      growth: 0,
    });
    
    // Clear tasks
    setTasks([]);

    // Show toast
    toast({
      title: "New pet acquired!",
      description: `${currentPet.name} has been added to your gallery. Meet your new pet!`,
      variant: "default",
    });
  };

  return (
    <AppContext.Provider
      value={{
        tasks,
        addTask,
        currentPet,
        setCurrentPetName,
        completedPets,
        resetCurrentPet,
        lastSelectedDifficulty,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
