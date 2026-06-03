export interface WorkoutSet {
  reps: number;
  weight: number;
  unit: 'kg' | 'lbs';
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: WorkoutSet[];
  notes?: string;
}

export interface Workout {
  id: string;
  title: string;
  date: string;
  duration: number; // minutes
  exercises: Exercise[];
  totalVolume: number;
  caloriesBurned?: number;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: number;
  servingUnit: string;
  category: string;
}

export interface MealEntry {
  id: string;
  foodItem: FoodItem;
  quantity: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
}

export interface DailyNutrition {
  date: string;
  entries: MealEntry[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}
