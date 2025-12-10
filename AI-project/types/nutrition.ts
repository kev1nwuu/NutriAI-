export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  confidence?: number;
}

export interface NutritionGoals {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
}

export interface FoodEntry {
  id: string;
  foodId: string;
  name: string;
  date: Date;
  meal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  servingSize: number;
}

export interface DailyNutrition {
  date: Date;
  entries: FoodEntry[];
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFat: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  weight: number;
  height: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goals: NutritionGoals;
  createdAt: Date;
  updatedAt: Date;
}



export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';


export interface NutritionSnapshot {
  calories: number;  
  carbs: number;      
  protein: number;    
  fat: number;        
  fiber?: number;    
  sugar?: number;     
  sodium?: number;    
}


export interface FoodEntry extends NutritionSnapshot {
  id: string;             
  name: string;        
  meal: MealType;        
  scannedAt: string;      
  confidence?: number;    
}


export interface DailySummary {
  date: string;           
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFat: number;
  entries: FoodEntry[];
}


export interface NutritionGoals {
  calories: number;  
  carbs: number;
  protein: number;
  fat: number;
}
