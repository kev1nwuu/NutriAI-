// hooks/NutritionLogContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';

export interface NutritionLogEntry {
  id: string;
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  timestamp: Date; 
}

interface NutritionLogContextValue {
  entries: NutritionLogEntry[];
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFat: number;
  addEntry: (entry: {
    name: string;
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
  }) => void;
}

const NutritionLogContext = createContext<NutritionLogContextValue | undefined>(
  undefined
);

export function NutritionProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<NutritionLogEntry[]>([]);

  const addEntry: NutritionLogContextValue['addEntry'] = (entry) => {
    const now = new Date();

    const newEntry: NutritionLogEntry = {
      id: now.getTime().toString(),
      name: entry.name,
      calories: entry.calories,
      carbs: entry.carbs,
      protein: entry.protein,
      fat: entry.fat,
      timestamp: now,   
    };

   
    setEntries((prev) => [newEntry, ...prev]);
  };

  const totalCalories = entries.reduce((sum, e) => sum + e.calories, 0);
  const totalCarbs = entries.reduce((sum, e) => sum + e.carbs, 0);
  const totalProtein = entries.reduce((sum, e) => sum + e.protein, 0);
  const totalFat = entries.reduce((sum, e) => sum + e.fat, 0);

  return (
    <NutritionLogContext.Provider
      value={{
        entries,
        totalCalories,
        totalCarbs,
        totalProtein,
        totalFat,
        addEntry,
      }}
    >
      {children}
    </NutritionLogContext.Provider>
  );
}


export function useNutritionLog() {
  const ctx = useContext(NutritionLogContext);
  if (!ctx) {
    throw new Error('useNutritionLog must be used within a NutritionProvider');
  }
  return ctx;
}
