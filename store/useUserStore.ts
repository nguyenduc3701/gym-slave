import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WeightRecord {
  date: string;
  weight: number;
}

export type WeightLogs = Record<string, WeightRecord[]>;

interface UserProfile {
  name: string;
  avatar?: string;
  goal: 'weight_loss' | 'muscle_gain' | 'endurance' | 'general';
  dailyCalorieTarget: number;
  dailyProteinTarget: number;
  
  // Onboarding fields
  onboardingCompleted: boolean;
  gender: 'male' | 'female';
  age: number;
  weight: number;
  height: number;
  targetWeight: number;
  workoutDaysPerWeek: number;
  bodyType: 'ectomorph' | 'mesomorph' | 'endomorph' | '';
  trainingLocation: 'gym' | 'home';
  targetWeeks: number;
  
  // Calculated Metrics
  bmi: number;
  bmr: number;
  tdee: number;

  // Custom schedule state
  customSchedule: any[] | null;
  
  // Weight lifting log state
  weightLogs?: WeightLogs;
  weightUnit?: 'kg' | 'lbs';
  
  // Optional onboarding fields
  bodyFat?: number;
  avgDailyCalories?: number;
  focusMuscleGroups?: string[];
  supplements?: string[];
  sleepHours?: number;
}

interface UserState {
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  resetStore: () => void;
  addWeightLog: (exerciseName: string, weight: number, date: string) => void;
  clearWeightLogs: () => void;
}

const defaultProfile: UserProfile = {
  name: 'Athlete',
  goal: 'muscle_gain',
  dailyCalorieTarget: 2500,
  dailyProteinTarget: 180,
  onboardingCompleted: false,
  gender: 'male',
  age: 25,
  weight: 70,
  height: 170,
  targetWeight: 70,
  workoutDaysPerWeek: 4,
  bodyType: '',
  trainingLocation: 'gym',
  targetWeeks: 12,
  bmi: 24.2,
  bmr: 1600,
  tdee: 2200,
  customSchedule: null,
  weightUnit: 'kg',
};


export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      updateProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates },
        })),
      resetStore: () => set({ profile: defaultProfile }),
      addWeightLog: (exerciseName, weight, date) =>
        set((state) => {
          const currentLogs = state.profile.weightLogs || {};
          const exerciseLogs = currentLogs[exerciseName] || [];
          
          // Check if date already exists to overwrite, else append
          const existingIndex = exerciseLogs.findIndex(log => log.date === date);
          let newExerciseLogs = [...exerciseLogs];
          
          if (existingIndex >= 0) {
            newExerciseLogs[existingIndex] = { date, weight };
          } else {
            newExerciseLogs.push({ date, weight });
          }
          
          // Sort by date ascending
          newExerciseLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          
          return {
            profile: {
              ...state.profile,
              weightLogs: {
                ...currentLogs,
                [exerciseName]: newExerciseLogs,
              },
            },
          };
        }),
      clearWeightLogs: () =>
        set((state) => ({
          profile: { ...state.profile, weightLogs: {} },
        })),
    }),
    {
      name: 'ignite-user-store',
    }
  )
);


