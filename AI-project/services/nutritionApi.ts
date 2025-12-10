import { FoodItem, NutritionGoals } from '@/types/nutrition';


const mockFoodDatabase: FoodItem[] = [
  {
    id: '1',
    name: 'Apple',
    calories: 95,
    carbs: 25,
    protein: 0.5,
    fat: 0.3,
    fiber: 4,
    sugar: 19,
    sodium: 2,
  },
  {
    id: '2',
    name: 'Banana',
    calories: 105,
    carbs: 27,
    protein: 1.3,
    fat: 0.4,
    fiber: 3,
    sugar: 14,
    sodium: 1,
  },
  {
    id: '3',
    name: 'Grilled Chicken Breast',
    calories: 231,
    carbs: 0,
    protein: 43.5,
    fat: 5,
    fiber: 0,
    sugar: 0,
    sodium: 104,
  },
  {
    id: '4',
    name: 'Greek Yogurt',
    calories: 100,
    carbs: 6,
    protein: 17,
    fat: 0,
    fiber: 0,
    sugar: 6,
    sodium: 56,
  },
  {
    id: '5',
    name: 'Mixed Green Salad',
    calories: 45,
    carbs: 9,
    protein: 3,
    fat: 0.4,
    fiber: 4,
    sugar: 5,
    sodium: 15,
  },
  {
    id: '6',
    name: 'Salmon Fillet',
    calories: 280,
    carbs: 0,
    protein: 39,
    fat: 12,
    fiber: 0,
    sugar: 0,
    sodium: 98,
  },
];

export class NutritionApiService {

  static async identifyFood(imageUri: string): Promise<FoodItem> {

    await new Promise(resolve => setTimeout(resolve, 2000));
    

    const randomIndex = Math.floor(Math.random() * mockFoodDatabase.length);
    const foodItem = mockFoodDatabase[randomIndex];
    

    return {
      ...foodItem,
      confidence: Math.floor(Math.random() * 20) + 80, 
    };
  }


  static async searchFood(query: string): Promise<FoodItem[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockFoodDatabase.filter(food =>
      food.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  static async getFoodById(id: string): Promise<FoodItem | null> {
    const food = mockFoodDatabase.find(item => item.id === id);
    return food || null;
  }

 
  static calculateNutritionGoals(
    age: number,
    weight: number,
    height: number,
    activityLevel: string,
    goal: 'maintain' | 'lose' | 'gain' = 'maintain'
  ): NutritionGoals {
    
    const bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    
    
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };
    
    const multiplier = activityMultipliers[activityLevel as keyof typeof activityMultipliers] || 1.2;
    let calories = Math.round(bmr * multiplier);
    
    
    if (goal === 'lose') calories -= 500;
    if (goal === 'gain') calories += 500;
    
    
    const carbs = Math.round((calories * 0.45) / 4); 
    const protein = Math.round((calories * 0.25) / 4);
    const fat = Math.round((calories * 0.3) / 9); 
    const fiber = Math.round(14 * (calories / 1000)); 
    
    return {
      calories,
      carbs,
      protein,
      fat,
      fiber,
    };
  }


  static async getUSDANutrition(foodName: string): Promise<FoodItem | null> {
    
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    return this.searchFood(foodName).then(results => results[0] || null);
  }
}