'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Modal, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useUserStore } from '@/store/useUserStore';
import { Header } from '@/components/layout/Header';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { routing } from '@/i18n/routing';
import { useExerciseStore } from '@/store/useExerciseStore';

interface Exercise {
  name: string;
  target: string;
  sets: number;
  reps: string;
  tier: 'S' | 'A' | 'B' | 'C';
  priority?: 'low' | 'medium' | 'high' | number;
  description?: string;
}

interface DaySchedule {
  day: string;
  label: string;
  isToday: boolean;
  isRest?: boolean;
  exercises: Exercise[];
}

interface FoodSuggestion {
  name: string;
  cal: number;
  protein: number;
  carbs: number;
  fat: number;
  per: string;
}

const foodPools: { [key: string]: FoodSuggestion[] } = {
  weight_loss: [
    { name: 'Ức gà áp chảo', cal: 165, protein: 31, carbs: 0, fat: 3.6, per: '100g' },
    { name: 'Thịt thăn heo nạc', cal: 143, protein: 26, carbs: 0, fat: 4.5, per: '100g' },
    { name: 'Cá rô phi hấp', cal: 128, protein: 26, carbs: 0, fat: 2.7, per: '100g' },
    { name: 'Lòng trắng trứng gà', cal: 52, protein: 11, carbs: 0.7, fat: 0.2, per: '100g' },
    { name: 'Đậu hũ non luộc', cal: 76, protein: 8, carbs: 1.9, fat: 4.8, per: '100g' },
  ],
  muscle_gain: [
    { name: 'Thịt bò nạc xào', cal: 250, protein: 26, carbs: 0, fat: 15, per: '100g' },
    { name: 'Cá hồi áp chảo', cal: 208, protein: 20, carbs: 0, fat: 13, per: '100g' },
    { name: 'Trứng gà nguyên quả', cal: 155, protein: 13, carbs: 1.1, fat: 11, per: '2 quả' },
    { name: 'Bơ sáp dầm hạt chia', cal: 160, protein: 2, carbs: 8.5, fat: 14.7, per: '100g' },
    { name: 'Yến mạch mix bơ đậu phộng', cal: 389, protein: 16.9, carbs: 66, fat: 6.9, per: '100g' },
  ],
  general: [
    { name: 'Cá hồi áp chảo', cal: 208, protein: 20, carbs: 0, fat: 13, per: '100g' },
    { name: 'Ức gà áp chảo', cal: 165, protein: 31, carbs: 0, fat: 3.6, per: '100g' },
    { name: 'Đậu hũ non', cal: 76, protein: 8, carbs: 1.9, fat: 4.8, per: '100g' },
    { name: 'Sữa chua Hy Lạp', cal: 59, protein: 10, carbs: 3.6, fat: 0.4, per: '100g' },
    { name: 'Hạt hạnh nhân sấy', cal: 579, protein: 21, carbs: 22, fat: 49, per: '100g' },
  ],
};

// Raw exercises library map for Gym & Home (by muscle group targets)
const MASTER_EXERCISES = {
  gym: {
    nguc_tren: [
      { name: "Incline Dumbbell Press", target: "Ngực trên", tier: "S" as const, priority: "high" as const },
      { name: "Incline Smith Machine Press", target: "Ngực trên", tier: "S" as const, priority: "high" as const },
      { name: "Incline Barbell Bench Press", target: "Ngực trên", tier: "A" as const, priority: "high" as const },
      { name: "Low-to-High Cable Fly", target: "Ngực trên & Ngực trong", tier: "A" as const, priority: "medium" as const },
      { name: "Incline Dumbbell Fly", target: "Ngực trên", tier: "B" as const, priority: "medium" as const }
    ],
    nguc_giua_duoi: [
      { name: "Bench Press", target: "Ngực giữa", tier: "S" as const, priority: "high" as const },
      { name: "Chest Press Machine", target: "Ngực giữa (Cô lập)", tier: "A" as const, priority: "high" as const },
      { name: "Chest Dips (Xà kép ngực)", target: "Ngực dưới & Vai trước", tier: "A" as const, priority: "high" as const },
      { name: "Chest Fly Machine (Pec Deck)", target: "Ngực giữa (Cô lập)", tier: "A" as const, priority: "medium" as const },
      { name: "Cable Crossover", target: "Ngực dưới", tier: "A" as const, priority: "medium" as const },
      { name: "Push-Up (Chống đẩy)", target: "Ngực & Vai", tier: "B" as const, priority: "medium" as const }
    ],
    lung_xo: [
      { name: "Pull-Up (Xà đơn)", target: "Lưng xô", tier: "S" as const, priority: "high" as const },
      { name: "Lat Pulldown", target: "Lưng rộng", tier: "S" as const, priority: "high" as const },
      { name: "Barbell Row", target: "Lưng xô", tier: "A" as const, priority: "high" as const },
      { name: "Single-Arm Dumbbell Row", target: "Lưng xô (Đơn phương)", tier: "A" as const, priority: "high" as const },
      { name: "Straight-Arm Cable Pull-Down", target: "Lưng xô (Cô lập kéo giãn)", tier: "A" as const, priority: "medium" as const }
    ],
    lung_tren: [
      { name: "Chest-Supported T-Bar Row", target: "Lưng giữa & Lưng trên", tier: "S" as const, priority: "high" as const },
      { name: "Seated Cable Row", target: "Lưng giữa", tier: "A" as const, priority: "high" as const },
      { name: "T-Bar Row (Free Weight)", target: "Lưng giữa & Cầu vai", tier: "A" as const, priority: "high" as const },
      { name: "Dumbbell Shrugs", target: "Cầu vai trên", tier: "B" as const, priority: "low" as const }
    ],
    lung_duoi: [
      { name: "Deadlift", target: "Đùi sau & Toàn bộ chuỗi cơ sau", tier: "S" as const, priority: "high" as const },
      { name: "Hyperextension (Ghế dốc lưng dưới)", target: "Lưng dưới & Mông", tier: "A" as const, priority: "low" as const }
    ],
    vai_truoc: [
      { name: "Overhead Press", target: "Vai trước & Core", tier: "S" as const, priority: "high" as const },
      { name: "Dumbbell Shoulder Press", target: "Vai trước", tier: "A" as const, priority: "high" as const },
      { name: "Front Raise (Cáp hoặc Tạ đơn)", target: "Vai trước", tier: "C" as const, priority: "medium" as const }
    ],
    vai_giua: [
      { name: "Cable Lateral Raise", target: "Vai giữa (Áp lực đều)", tier: "S" as const, priority: "medium" as const },
      { name: "Lateral Raise (Dumbbell)", target: "Vai giữa", tier: "A" as const, priority: "medium" as const },
      { name: "Dumbbell Upright Row", target: "Vai giữa & Cầu vai", tier: "B" as const, priority: "high" as const }
    ],
    vai_sau: [
      { name: "Reverse Pec Deck Fly", target: "Vai sau (Cô lập)", tier: "S" as const, priority: "medium" as const },
      { name: "Face Pull", target: "Vai sau & Lưng trên", tier: "A" as const, priority: "medium" as const }
    ],
    tay_truoc: [
      { name: "Incline Dumbbell Curl", target: "Tay trước (Đầu dài - Kéo giãn)", tier: "S" as const, priority: "medium" as const },
      { name: "Preacher Curl", target: "Tay trước (Đầu ngắn - Co thắt)", tier: "A" as const, priority: "medium" as const },
      { name: "Hammer Curl", target: "Tay trước (Cơ cánh tay quay)", tier: "A" as const, priority: "medium" as const },
      { name: "Dumbbell Curl", target: "Tay trước", tier: "B" as const, priority: "medium" as const }
    ],
    tay_sau: [
      { name: "Tricep Rope Pushdown", target: "Tay sau (Đầu bên & đầu trong)", tier: "S" as const, priority: "medium" as const },
      { name: "Overhead Cable Tricep Extension", target: "Tay sau (Đầu dài)", tier: "S" as const, priority: "medium" as const },
      { name: "Close-Grip Bench Press", target: "Tay sau & Ngực", tier: "A" as const, priority: "high" as const },
      { name: "JM Press", target: "Tay sau (Khối lượng nặng)", tier: "A" as const, priority: "high" as const },
      { name: "Tricep Pushdown (Thanh thẳng)", target: "Tay sau", tier: "A" as const, priority: "medium" as const },
      { name: "Tricep Kickback", target: "Tay sau", tier: "C" as const, priority: "medium" as const }
    ],
    dui_truoc: [
      { name: "Barbell Squat", target: "Đùi trước & Mông", tier: "S" as const, priority: "high" as const },
      { name: "Bulgarian Split Squat", target: "Đùi trước & Mông (Đơn phương)", tier: "S" as const, priority: "high" as const },
      { name: "Leg Press", target: "Đùi trước & Mông", tier: "A" as const, priority: "high" as const },
      { name: "Leg Extension (Máy đá đùi trước)", target: "Đùi trước (Cô lập)", tier: "A" as const, priority: "medium" as const },
      { name: "Dumbbell Goblet Squat", target: "Đùi trước", tier: "B" as const, priority: "high" as const }
    ],
    dui_sau_mong: [
      { name: "Romanian Deadlift", target: "Đùi sau & Mông (Kéo giãn)", tier: "S" as const, priority: "high" as const },
      { name: "Barbell Hip Thrust", target: "Cơ mông lớn (Co thắt cực đại)", tier: "S" as const, priority: "high" as const },
      { name: "Seated Leg Curl", target: "Đùi sau (Vị trí ngồi tối ưu hơn nằm)", tier: "S" as const, priority: "medium" as const },
      { name: "Lying Leg Curl", target: "Đùi sau", tier: "A" as const, priority: "medium" as const },
      { name: "Abductor Machine", target: "Mông nhỡ / Đùi ngoài", tier: "B" as const, priority: "low" as const },
      { name: "Glute Bridge (Cầu mông)", target: "Mông", tier: "B" as const, priority: "low" as const }
    ],
    bap_chan: [
      { name: "Calf Raise (Đứng máy/Leg Press)", target: "Bắp chân lớn (Gastrocnemius)", tier: "A" as const, priority: "low" as const },
      { name: "Seated Calf Raise", target: "Bắp chân sâu (Soleus)", tier: "A" as const, priority: "low" as const }
    ],
    bung: [
      { name: "Hanging Leg Raise", target: "Bụng dưới & Toàn bộ cơ bụng", tier: "S" as const, priority: "low" as const },
      { name: "Cable Crunch (Quỳ kéo cáp)", target: "Bụng trên (Quá tải lũy tiến)", tier: "S" as const, priority: "low" as const },
      { name: "Plank", target: "Cơ lõi (Core/Tĩnh)", tier: "B" as const, priority: "low" as const }
    ],
    cardio: [
      { name: "Rowing Machine (Máy chèo thuyền)", target: "Toàn thân & Tim mạch", tier: "S" as const, priority: "medium" as const },
      { name: "Treadmill Running (Chạy bộ máy)", target: "Tim mạch", tier: "A" as const, priority: "medium" as const },
      { name: "Stationary Cycling (Đạp xe máy)", target: "Tim mạch", tier: "A" as const, priority: "medium" as const },
      { name: "Elliptical Machine", target: "Tim mạch (Bảo vệ khớp gối)", tier: "A" as const, priority: "medium" as const }
    ]
  },
  home: {
    nguc_tren: [
      { name: "Decline Push-Up (Chân trên ghế)", target: "Ngực trên", tier: "A" as const },
      { name: "Incline Dumbbell Fly Floor", "target": "Ngực trên", tier: "B" as const }
    ],
    nguc_giua_duoi: [
      { name: "Push-Up (Chống đẩy)", target: "Ngực vai", tier: "S" as const },
      { name: "Dumbbell Floor Press", target: "Ngực giữa", tier: "S" as const },
      { name: "Knee Push-Up", target: "Ngực", tier: "A" as const },
      { name: "Dumbbell Floor Fly", target: "Ngực trong", tier: "B" as const },
      { name: "Incline Push-Up (Tay trên ghế)", target: "Ngực dưới", tier: "B" as const }
    ],
    lung_xo: [
      { name: "Pull-Up (Xà đơn)", target: "Lưng xô", tier: "S" as const },
      { name: "Inverted Row (Xà nghiêng bằng bàn/khăn)", target: "Lưng xô & Lưng giữa", tier: "A" as const },
      { name: "Dumbbell Pullover Floor", target: "Lưng xô & Ngực", tier: "B" as const }
    ],
    lung_tren: [
      { name: "Dumbbell Row", target: "Lưng giữa", tier: "S" as const },
      { name: "Prone YTAs (Nằm sấp giơ tay chữ Y/T/A)", target: "Lưng trên & Vai sau", tier: "B" as const }
    ],
    lung_duoi: [
      { name: "Dumbbell Romanian Deadlift", target: "Lưng dưới & Đùi sau", tier: "S" as const },
      { name: "Superman (Nằm sấp nâng người)", target: "Lưng dưới", tier: "B" as const }
    ],
    vai_truoc: [
      { name: "Dumbbell Shoulder Press", target: "Vai trước", tier: "S" as const },
      { name: "Pike Push-Up", target: "Vai trước", tier: "A" as const }
    ],
    vai_giua: [
      { name: "Dumbbell Lateral Raise", target: "Vai giữa", tier: "A" as const },
      { name: "Plank Shoulder Taps", target: "Cơ core & Vai trước", tier: "B" as const }
    ],
    vai_sau: [
      { name: "Rear Delt Dumbbell Fly", target: "Vai sau", tier: "B" as const }
    ],
    tay_truoc: [
      { name: "Dumbbell Bicep Curl", target: "Tay trước", tier: "B" as const },
      { name: "Dumbbell Concentration Curl (Cuốn tạ tập trung)", target: "Đỉnh cơ tay trước", tier: "B" as const }
    ],
    tay_sau: [
      { name: "Diamond Push-Up (Chống đẩy kim cương)", target: "Tay sau & Ngực", tier: "A" as const },
      { name: "Dumbbell Overhead Tricep Extension", target: "Tay sau (Đầu dài)", tier: "B" as const },
      { name: "Bench Dips (Xà kép ghế)", target: "Tay sau", tier: "B" as const }
    ],
    dui_truoc: [
      { name: "Dumbbell Goblet Squat", target: "Đùi trước", tier: "S" as const },
      { name: "Bulgarian Split Squat", target: "Đùi mông", tier: "S" as const },
      { name: "Bodyweight Sissy Squat", target: "Cô lập đùi trước", tier: "B" as const }
    ],
    dui_sau_mong: [
      { name: "Dumbbell Romanian Deadlift", target: "Đùi sau", tier: "S" as const },
      { name: "Dumbbell Lunges", target: "Mông đùi", tier: "A" as const },
      { name: "Single-Leg Glute Bridge (Cầu mông 1 chân)", target: "Mông & Đùi sau", tier: "A" as const },
      { name: "Glute Bridge (Cầu mông)", target: "Mông", tier: "B" as const },
      { name: "Dumbbell Donkey Kicks", target: "Cơ mông", tier: "B" as const }
    ],
    bap_chan: [
      { name: "Single-Leg Calf Raise (Nhón bắp chân 1 chân)", target: "Bắp chân", tier: "A" as const },
      { name: "Calf Raise (Xách tạ đơn)", target: "Bắp chân", tier: "B" as const }
    ],
    bung: [
      { name: "Mountain Climber", target: "Tim mạch & Cơ lõi", tier: "A" as const },
      { name: "Plank", target: "Cơ bụng", tier: "B" as const },
      { name: "Bicycle Crunch", target: "Cơ bụng chéo", tier: "B" as const },
      { name: "Lying Leg Raise (Nằm nhấc chân)", target: "Bụng dưới", tier: "B" as const }
    ],
    cardio: [
      { name: "Burpees (Nhảy cóc nằm xấp)", target: "Cardio & Thể lực", tier: "S" as const },
      { name: "Jump Rope (Nhảy dây)", target: "Cardio", tier: "S" as const },
      { name: "Jumping Jacks (Nhảy vung tay)", target: "Cardio", tier: "A" as const },
      { name: "High Knees (Chạy nâng cao đùi)", target: "Cardio", tier: "B" as const }
    ]
  }
};

function renderTierBadge(tier: 'S' | 'A' | 'B' | 'C') {
  const styles = {
    S: { bg: 'rgba(255, 0, 60, 0.2)', border: 'var(--color-primary)', color: '#ff525c' },
    A: { bg: 'rgba(254, 107, 0, 0.2)', border: 'var(--color-secondary)', color: '#ffb693' },
    B: { bg: 'rgba(108, 215, 216, 0.2)', border: '#6cd7d8', color: '#6cd7d8' },
    C: { bg: 'rgba(150, 150, 150, 0.2)', border: '#9e9e9e', color: '#cccccc' },
  }[tier];

  return (
    <span
      className="px-1.5 py-0.5 rounded text-[10px] font-bold border font-mono ml-2 uppercase"
      style={{
        backgroundColor: styles.bg,
        borderColor: styles.border,
        color: styles.color,
        letterSpacing: '0.05em',
      }}
    >
      TIER {tier}
    </span>
  );
}

const MUSCLE_MAP: { [key: string]: string[] } = {
  nguc_tren: ['Ngực trên'],
  nguc_giua_duoi: ['Ngực giữa', 'Ngực dưới', 'Ngực vai', 'Ngực'],
  lung_xo: ['Lưng xô', 'Lưng rộng', 'Lats'],
  lung_tren: ['Lưng giữa', 'Lưng trên'],
  lung_duoi: ['Lưng dưới'],
  vai_truoc: ['Vai trước'],
  vai_giua: ['Vai giữa', 'Cơ core & Vai giữa'],
  vai_sau: ['Vai sau'],
  tay_truoc: ['Tay trước'],
  tay_sau: ['Tay sau'],
  dui_truoc: ['Đùi trước', 'Đùi mông', 'Mông đùi trước', 'Toàn thân dưới'],
  dui_sau_mong: ['Đùi sau', 'Mông đùi sau', 'Cơ mông lớn', 'Mông đùi', 'Mông'],
  bap_chan: ['Bắp chân'],
  bung: ['Cơ bụng', 'Bụng', 'Cơ core', 'Cơ trọng tâm', 'Core'],
  cardio: ['Cardio', 'Tim mạch', 'Thể lực'],
};

// Helper to generate dynamic 7-day schedule with targeted boosters (max 3/week)
function generateWorkoutSchedule(
  daysPerWeek: number,
  location: 'gym' | 'home',
  gender: 'male' | 'female',
  focusMuscles: string[] = [],
  customLibrary?: any
): DaySchedule[] {
  const currentDayIndex = new Date().getDay();
  const orderedDays = ['THỨ 2', 'THỨ 3', 'THỨ 4', 'THỨ 5', 'THỨ 6', 'THỨ 7', 'CHỦ NHẬT'];

  const lib = customLibrary || MASTER_EXERCISES;
  const libLocation = lib[location] || MASTER_EXERCISES[location];

  const getSortedExercises = (list: any[]) => {
    const order = { S: 1, A: 2, B: 3, C: 4 };
    const priorityMap = { high: 3, medium: 2, low: 1 };
    
    const getPriorityVal = (p: any) => {
      if (typeof p === 'number') return p;
      if (p && typeof p === 'string' && p in priorityMap) {
        return priorityMap[p as keyof typeof priorityMap];
      }
      return 0;
    };

    return [...list].sort((x, y) => {
      const tierDiff = (order[x.tier as keyof typeof order] || 4) - (order[y.tier as keyof typeof order] || 4);
      if (tierDiff !== 0) return tierDiff;
      
      const priorityX = getPriorityVal(x.priority);
      const priorityY = getPriorityVal(y.priority);
      return priorityY - priorityX; // Higher priority first
    });
  };

  const getBestExercise = (
    category: string,
    excludeList: string[],
    defaultVal: any
  ) => {
    const list = libLocation[category] || [];
    if (list.length === 0) return { ...defaultVal };

    const sorted = getSortedExercises(list);
    const found = sorted.find(ex => !excludeList.includes(ex.name));
    if (found) {
      return {
        name: found.name,
        target: found.target,
        sets: defaultVal.sets,
        reps: defaultVal.reps,
        tier: found.tier
      };
    }
    return { ...defaultVal };
  };

  const selectedUpper: string[] = [];
  const selectedLower: string[] = [];
  const selectedFull: string[] = [];

  const dynamicUpper = location === 'gym' 
    ? (gender === 'male'
      ? [
          getBestExercise('nguc_giua_duoi', selectedUpper, { name: 'Bench Press', target: 'Ngực giữa', sets: 4, reps: '10', tier: 'S' }),
          getBestExercise('vai_truoc', selectedUpper, { name: 'Overhead Press', target: 'Vai trước', sets: 4, reps: '8', tier: 'S' }),
          getBestExercise('lung_xo', selectedUpper, { name: 'Barbell Row', target: 'Lưng xô', sets: 4, reps: '10', tier: 'A' }),
          getBestExercise('nguc_tren', selectedUpper, { name: 'Incline Dumbbell Fly', target: 'Ngực trên', sets: 3, reps: '12', tier: 'A' }),
          getBestExercise('tay_truoc', selectedUpper, { name: 'Dumbbell Curl', target: 'Tay trước', sets: 3, reps: '12', tier: 'B' }),
          getBestExercise('tay_sau', selectedUpper, { name: 'Tricep Pushdown', target: 'Tay sau', sets: 3, reps: '12', tier: 'B' }),
        ]
      : [
          getBestExercise('lung_xo', selectedUpper, { name: 'Lat Pulldown', target: 'Lưng rộng', sets: 4, reps: '10', tier: 'A' }),
          getBestExercise('nguc_giua_duoi', selectedUpper, { name: 'Bench Press', target: 'Ngực giữa', sets: 3, reps: '12', tier: 'S' }),
          getBestExercise('lung_tren', selectedUpper, { name: 'Seated Cable Row', target: 'Lưng giữa', sets: 3, reps: '12', tier: 'A' }),
          getBestExercise('vai_truoc', selectedUpper, { name: 'Dumbbell Shoulder Press', target: 'Vai trước', sets: 3, reps: '12', tier: 'A' }),
          getBestExercise('tay_sau', selectedUpper, { name: 'Tricep Kickback', target: 'Tay sau', sets: 3, reps: '15', tier: 'B' }),
        ])
    : (gender === 'male'
      ? [
          getBestExercise('nguc_giua_duoi', selectedUpper, { name: 'Dumbbell Floor Press', target: 'Ngực giữa', sets: 4, reps: '10', tier: 'S' }),
          getBestExercise('lung_xo', selectedUpper, { name: 'Pull-Up (Xà đơn)', target: 'Lưng xô', sets: 4, reps: '8', tier: 'S' }),
          getBestExercise('vai_truoc', selectedUpper, { name: 'Dumbbell Shoulder Press', target: 'Vai trước', sets: 4, reps: '10', tier: 'A' }),
          getBestExercise('lung_tren', selectedUpper, { name: 'Dumbbell Row', target: 'Lưng giữa', sets: 3, reps: '12', tier: 'A' }),
          getBestExercise('tay_truoc', selectedUpper, { name: 'Dumbbell Bicep Curl', target: 'Tay trước', sets: 3, reps: '12', tier: 'B' }),
          getBestExercise('tay_sau', selectedUpper, { name: 'Bench Dips (Xà kép ghế)', target: 'Tay sau', sets: 3, reps: '15', tier: 'B' }),
        ]
      : [
          getBestExercise('nguc_tren', selectedUpper, { name: 'Incline Push-Up (Chống đẩy quỳ)', target: 'Ngực trên', sets: 4, reps: '12', tier: 'S' }),
          getBestExercise('vai_truoc', selectedUpper, { name: 'Dumbbell Shoulder Press', target: 'Vai trước', sets: 3, reps: '12', tier: 'A' }),
          getBestExercise('lung_tren', selectedUpper, { name: 'Dumbbell Row', target: 'Lưng giữa', sets: 3, reps: '15', tier: 'A' }),
          getBestExercise('vai_giua', selectedUpper, { name: 'Plank Shoulder Taps', target: 'Cơ core & Vai giữa', sets: 3, reps: '20', tier: 'B' }),
        ]);

  const dynamicLower = location === 'gym'
    ? (gender === 'male'
      ? [
          getBestExercise('dui_truoc', selectedLower, { name: 'Barbell Squat', target: 'Đùi trước', sets: 4, reps: '8', tier: 'S' }),
          getBestExercise('lung_duoi', selectedLower, { name: 'Deadlift', target: 'Đùi sau & Lưng', sets: 4, reps: '6', tier: 'S' }),
          getBestExercise('dui_truoc', selectedLower, { name: 'Leg Press', target: 'Đùi mông', sets: 3, reps: '12', tier: 'A' }),
          getBestExercise('dui_sau_mong', selectedLower, { name: 'Romanian Deadlift', target: 'Mông đùi sau', sets: 4, reps: '10', tier: 'A' }),
          getBestExercise('dui_sau_mong', selectedLower, { name: 'Lying Leg Curl', target: 'Đùi sau', sets: 3, reps: '12', tier: 'B' }),
          getBestExercise('bap_chan', selectedLower, { name: 'Calf Raise', target: 'Bắp chân', sets: 3, reps: '15', tier: 'B' }),
        ]
      : [
          getBestExercise('dui_truoc', selectedLower, { name: 'Barbell Squat', target: 'Đùi trước', sets: 4, reps: '10', tier: 'S' }),
          getBestExercise('dui_sau_mong', selectedLower, { name: 'Barbell Hip Thrust', target: 'Cơ mông lớn', sets: 4, reps: '12', tier: 'S' }),
          getBestExercise('dui_truoc', selectedLower, { name: 'Bulgarian Split Squat', target: 'Mông đùi trước', sets: 3, reps: '10', tier: 'A' }),
          getBestExercise('dui_sau_mong', selectedLower, { name: 'Romanian Deadlift', target: 'Mông đùi sau', sets: 4, reps: '12', tier: 'A' }),
          getBestExercise('dui_sau_mong', selectedLower, { name: 'Abductor Machine', target: 'Mông đùi ngoài', sets: 3, reps: '15', tier: 'B' }),
        ])
    : (gender === 'male'
      ? [
          getBestExercise('dui_truoc', selectedLower, { name: 'Dumbbell Goblet Squat', target: 'Đùi trước', sets: 4, reps: '12', tier: 'S' }),
          getBestExercise('lung_duoi', selectedLower, { name: 'Dumbbell Romanian Deadlift', target: 'Đùi sau', sets: 4, reps: '10', tier: 'S' }),
          getBestExercise('dui_truoc', selectedLower, { name: 'Bulgarian Split Squat', target: 'Đùi mông', sets: 3, reps: '12', tier: 'A' }),
          getBestExercise('dui_sau_mong', selectedLower, { name: 'Dumbbell Lunges', target: 'Mông đùi', sets: 3, reps: '12', tier: 'A' }),
          getBestExercise('bap_chan', selectedLower, { name: 'Calf Raise (Xách tạ đơn)', target: 'Bắp chân', sets: 3, reps: '20', tier: 'B' }),
        ]
      : [
          getBestExercise('dui_truoc', selectedLower, { name: 'Dumbbell Goblet Squat', target: 'Đùi trước', sets: 4, reps: '15', tier: 'S' }),
          getBestExercise('dui_sau_mong', selectedLower, { name: 'Glute Bridge (Cầu mông)', target: 'Mông', sets: 4, reps: '20', tier: 'B' }),
          getBestExercise('dui_truoc', selectedLower, { name: 'Bulgarian Split Squat', target: 'Đùi mông', sets: 3, reps: '10', tier: 'A' }),
          getBestExercise('dui_sau_mong', selectedLower, { name: 'Dumbbell Donkey Kicks', target: 'Cơ mông', sets: 3, reps: '15', tier: 'B' }),
        ]);

  const dynamicFull = location === 'gym'
    ? (gender === 'male'
      ? [
          getBestExercise('dui_truoc', selectedFull, { name: 'Barbell Squat', target: 'Đùi trước', sets: 4, reps: '8', tier: 'S' }),
          getBestExercise('nguc_giua_duoi', selectedFull, { name: 'Bench Press', target: 'Ngực giữa', sets: 4, reps: '10', tier: 'S' }),
          getBestExercise('lung_xo', selectedFull, { name: 'Lat Pulldown', target: 'Lưng rộng', sets: 3, reps: '12', tier: 'A' }),
          getBestExercise('vai_giua', selectedFull, { name: 'Lateral Raise', target: 'Vai giữa', sets: 3, reps: '15', tier: 'A' }),
          getBestExercise('bung', selectedFull, { name: 'Plank', target: 'Cơ bụng', sets: 3, reps: '60s', tier: 'B' }),
        ]
      : [
          getBestExercise('dui_truoc', selectedFull, { name: 'Bulgarian Split Squat', target: 'Mông đùi trước', sets: 4, reps: '12', tier: 'A' }),
          getBestExercise('dui_sau_mong', selectedFull, { name: 'Barbell Hip Thrust', target: 'Cơ mông lớn', sets: 4, reps: '12', tier: 'S' }),
          getBestExercise('lung_xo', selectedFull, { name: 'Lat Pulldown', target: 'Lưng rộng', sets: 3, reps: '12', tier: 'A' }),
          getBestExercise('bung', selectedFull, { name: 'Plank', target: 'Cơ bụng', sets: 3, reps: '60s', tier: 'B' }),
        ])
    : (gender === 'male'
      ? [
          getBestExercise('nguc_giua_duoi', selectedFull, { name: 'Push-Up (Chống đẩy)', target: 'Ngực vai', sets: 4, reps: '15', tier: 'S' }),
          getBestExercise('dui_truoc', selectedFull, { name: 'Dumbbell Goblet Squat', target: 'Đùi trước', sets: 4, reps: '12', tier: 'S' }),
          getBestExercise('lung_xo', selectedFull, { name: 'Pull-Up (Xà đơn)', target: 'Lưng xô', sets: 3, reps: '8', tier: 'A' }),
          getBestExercise('bung', selectedFull, { name: 'Plank', target: 'Cơ bụng', sets: 3, reps: '60s', tier: 'B' }),
        ]
      : [
          getBestExercise('nguc_giua_duoi', selectedFull, { name: 'Knee Push-Up', target: 'Ngực', sets: 4, reps: '10', tier: 'S' }),
          getBestExercise('dui_truoc', selectedFull, { name: 'Dumbbell Goblet Squat', target: 'Đùi trước', sets: 4, reps: '12', tier: 'S' }),
          getBestExercise('cardio', selectedFull, { name: 'Mountain Climber', target: 'Tim mạch', sets: 3, reps: '30s', tier: 'A' }),
          getBestExercise('bung', selectedFull, { name: 'Plank', target: 'Cơ bụng', sets: 3, reps: '60s', tier: 'B' }),
        ]);

  const currentPool = {
    upper: dynamicUpper,
    lower: dynamicLower,
    full: dynamicFull
  };

  const allAvailableExercises = [
    ...currentPool.upper,
    ...currentPool.lower,
    ...currentPool.full,
  ];

  const isTodayName = (vietnameseDayName: string) => {
    const dayMap: { [key: number]: string } = {
      0: 'CHỦ NHẬT',
      1: 'THỨ 2',
      2: 'THỨ 3',
      3: 'THỨ 4',
      4: 'THỨ 5',
      5: 'THỨ 6',
      6: 'THỨ 7',
    };
    return dayMap[currentDayIndex] === vietnameseDayName;
  };

  const schedule: DaySchedule[] = [];

  if (daysPerWeek === 1) {
    orderedDays.forEach((day) => {
      if (day === 'THỨ 7') {
        schedule.push({ day, label: 'Full Body (Toàn Thân)', isToday: isTodayName(day), exercises: [...currentPool.full] });
      } else {
        schedule.push({ day, label: 'Nghỉ Ngơi', isToday: isTodayName(day), isRest: true, exercises: [] });
      }
    });
  } else if (daysPerWeek === 2) {
    orderedDays.forEach((day) => {
      if (day === 'THỨ 3' || day === 'THỨ 6') {
        schedule.push({ day, label: 'Full Body (Toàn Thân)', isToday: isTodayName(day), exercises: [...currentPool.full] });
      } else {
        schedule.push({ day, label: 'Nghỉ Ngơi', isToday: isTodayName(day), isRest: true, exercises: [] });
      }
    });
  } else if (daysPerWeek === 3) {
    orderedDays.forEach((day) => {
      if (day === 'THỨ 2') {
        const pull = currentPool.upper.filter(ex => ex.target.includes('Lưng') || ex.target.includes('trước'));
        schedule.push({ day, label: 'Kéo (Pull Day)', isToday: isTodayName(day), exercises: pull.length ? pull : [...currentPool.full] });
      } else if (day === 'THỨ 4') {
        const push = currentPool.upper.filter(ex => ex.target.includes('Ngực') || ex.target.includes('Vai') || ex.target.includes('sau'));
        schedule.push({ day, label: 'Đẩy (Push Day)', isToday: isTodayName(day), exercises: push.length ? push : [...currentPool.full] });
      } else if (day === 'THỨ 6') {
        schedule.push({ day, label: 'Chân & Bụng (Legs Day)', isToday: isTodayName(day), exercises: [...currentPool.lower] });
      } else {
        schedule.push({ day, label: 'Nghỉ Ngơi', isToday: isTodayName(day), isRest: true, exercises: [] });
      }
    });
  } else if (daysPerWeek === 4) {
    orderedDays.forEach((day) => {
      if (day === 'THỨ 2' || day === 'THỨ 6') {
        schedule.push({ day, label: 'Thân Trên (Upper Body)', isToday: isTodayName(day), exercises: [...currentPool.upper] });
      } else if (day === 'THỨ 4' || day === 'THỨ 7') {
        schedule.push({ day, label: 'Thân Dưới (Lower Body)', isToday: isTodayName(day), exercises: [...currentPool.lower] });
      } else {
        schedule.push({ day, label: 'Nghỉ Ngơi', isToday: isTodayName(day), isRest: true, exercises: [] });
      }
    });
  } else if (daysPerWeek === 5) {
    orderedDays.forEach((day) => {
      if (day === 'THỨ 2') {
        const pull = currentPool.upper.filter(ex => ex.target.includes('Lưng') || ex.target.includes('trước'));
        schedule.push({ day, label: 'Kéo (Pull Day)', isToday: isTodayName(day), exercises: pull.length ? pull : [...currentPool.full] });
      } else if (day === 'THỨ 3') {
        const push = currentPool.upper.filter(ex => ex.target.includes('Ngực') || ex.target.includes('Vai') || ex.target.includes('sau'));
        schedule.push({ day, label: 'Đẩy (Push Day)', isToday: isTodayName(day), exercises: push.length ? push : [...currentPool.full] });
      } else if (day === 'THỨ 4') {
        schedule.push({ day, label: 'Chân (Legs Day)', isToday: isTodayName(day), exercises: [...currentPool.lower] });
      } else if (day === 'THỨ 6') {
        schedule.push({ day, label: 'Thân Trên (Upper Body)', isToday: isTodayName(day), exercises: [...currentPool.upper] });
      } else if (day === 'THỨ 7') {
        schedule.push({ day, label: 'Thân Dưới (Lower Body)', isToday: isTodayName(day), exercises: [...currentPool.lower] });
      } else {
        schedule.push({ day, label: 'Nghỉ Ngơi', isToday: isTodayName(day), isRest: true, exercises: [] });
      }
    });
  } else if (daysPerWeek === 6) {
    orderedDays.forEach((day) => {
      if (day === 'THỨ 2' || day === 'THỨ 5') {
        const pull = currentPool.upper.filter(ex => ex.target.includes('Lưng') || ex.target.includes('trước'));
        schedule.push({ day, label: 'Kéo (Pull Day)', isToday: isTodayName(day), exercises: pull.length ? pull : [...currentPool.full] });
      } else if (day === 'THỨ 3' || day === 'THỨ 6') {
        const push = currentPool.upper.filter(ex => ex.target.includes('Ngực') || ex.target.includes('Vai') || ex.target.includes('sau'));
        schedule.push({ day, label: 'Đẩy (Push Day)', isToday: isTodayName(day), exercises: push.length ? push : [...currentPool.full] });
      } else if (day === 'THỨ 4' || day === 'THỨ 7') {
        schedule.push({ day, label: 'Chân & Bụng (Legs Day)', isToday: isTodayName(day), exercises: [...currentPool.lower] });
      } else {
        schedule.push({ day, label: 'Nghỉ Ngơi', isToday: isTodayName(day), isRest: true, exercises: [] });
      }
    });
  } else {
    orderedDays.forEach((day) => {
      if (day === 'THỨ 2' || day === 'THỨ 5') {
        const pull = currentPool.upper.filter(ex => ex.target.includes('Lưng') || ex.target.includes('trước'));
        schedule.push({ day, label: 'Kéo (Pull Day)', isToday: isTodayName(day), exercises: pull.length ? pull : [...currentPool.full] });
      } else if (day === 'THỨ 3' || day === 'THỨ 6') {
        const push = currentPool.upper.filter(ex => ex.target.includes('Ngực') || ex.target.includes('Vai') || ex.target.includes('sau'));
        schedule.push({ day, label: 'Đẩy (Push Day)', isToday: isTodayName(day), exercises: push.length ? push : [...currentPool.full] });
      } else if (day === 'THỨ 4' || day === 'THỨ 7') {
        schedule.push({ day, label: 'Chân & Bụng', isToday: isTodayName(day), exercises: [...currentPool.lower] });
      } else {
        const core = [{ name: 'Bicycle Crunch', target: 'Cơ bụng chéo', sets: 3, reps: '20', tier: 'B' as const }, { name: 'Plank', target: 'Cơ core', sets: 3, reps: '60s', tier: 'B' as const }];
        schedule.push({ day, label: 'Bụng & Cardio nhẹ', isToday: isTodayName(day), exercises: core });
      }
    });
  }

  // Post-process for female workouts: reduce upper body, increase lower body, add cardio
  if (gender === 'female') {
    schedule.forEach((dayObj) => {
      if (dayObj.isRest) return;

      // 1. If it's an Upper body day (or Push/Pull day)
      if (dayObj.label.includes('Thân Trên') || dayObj.label.includes('Đẩy') || dayObj.label.includes('Kéo')) {
        const upperExercises = dayObj.exercises.filter(ex => 
          !ex.target.includes('Mông') && !ex.target.includes('Đùi') && !ex.target.includes('Bắp chân') && !ex.target.includes('Cardio')
        );
        const nonUpperExercises = dayObj.exercises.filter(ex => 
          ex.target.includes('Mông') || ex.target.includes('Đùi') || ex.target.includes('Bắp chân') || ex.target.includes('Cardio')
        );

        const reducedUpper = upperExercises.slice(0, 3);
        
        const hasCardio = dayObj.exercises.some(ex => ex.target.includes('Cardio'));
        const cardioExercises: any[] = [];
        if (!hasCardio) {
          const libraryToUse = (customLibrary && customLibrary[location]) ? customLibrary : MASTER_EXERCISES;
          const cardioPool = libraryToUse[location]?.cardio || [];
          if (cardioPool.length > 0) {
            const cEx = cardioPool[0];
            cardioExercises.push({
              name: cEx.name,
              target: cEx.target,
              sets: 3,
              reps: '15-20 mins',
              tier: cEx.tier
            });
          }
        }
        
        dayObj.exercises = [...reducedUpper, ...nonUpperExercises, ...cardioExercises];
      }

      // 2. If it's a Lower body day (or Legs day)
      if (dayObj.label.includes('Thân Dưới') || dayObj.label.includes('Chân')) {
        const extraLower = location === 'gym' 
          ? [
              { name: "Glute Bridge (Cầu mông)", target: "Mông", sets: 4, reps: "15", tier: "B" as const },
              { name: "Abductor Machine", target: "Mông đùi ngoài", sets: 4, reps: "15", tier: "B" as const }
            ]
          : [
              { name: "Single-Leg Glute Bridge (Cầu mông 1 chân)", target: "Mông & Đùi sau", sets: 3, reps: "15", tier: "A" as const },
              { name: "Dumbbell Donkey Kicks", target: "Cơ mông", sets: 3, reps: "15", tier: "B" as const }
            ];

        extraLower.forEach(ex => {
          if (!dayObj.exercises.some(existing => existing.name === ex.name)) {
            dayObj.exercises.push(ex);
          }
        });
      }
    });
  }

  if (focusMuscles.length > 0) {
    let boosterCount = 0;
    
    for (let dayObj of schedule) {
      if (dayObj.isRest || boosterCount >= 3) continue;

      for (const focusM of focusMuscles) {
        if (boosterCount >= 3) break;

        const targetKeywords = MUSCLE_MAP[focusM] || [];
        const matchingBoosters = allAvailableExercises.filter((ex) =>
          targetKeywords.some((keyword) => ex.target.toLowerCase().includes(keyword.toLowerCase()))
        );

        const newBooster = matchingBoosters.find(
          (b) => !dayObj.exercises.some((existing) => existing.name === b.name)
        );

        if (newBooster) {
          dayObj.exercises.push(newBooster);
          boosterCount++;
          break;
        }
      }
    }
  }

  // Ensure all training days have an appropriate number of exercises based on workout frequency
  let targetExercises = 4;
  if (daysPerWeek <= 2) {
    targetExercises = 7;
  } else if (daysPerWeek === 3) {
    targetExercises = 6;
  } else if (daysPerWeek === 4) {
    targetExercises = 5;
  } else {
    targetExercises = 4;
  }

  schedule.forEach((dayObj) => {
    if (!dayObj.isRest && dayObj.exercises.length < targetExercises) {
      let fillerPool = allAvailableExercises.filter((ex) =>
        !dayObj.exercises.some((existing) => existing.name === ex.name)
      );

      // Try to match fillers to the day's focus
      const isUpperDay = dayObj.label.includes('Thân Trên') || dayObj.label.includes('Đẩy') || dayObj.label.includes('Kéo');
      const isLowerDay = dayObj.label.includes('Thân Dưới') || dayObj.label.includes('Chân');

      if (isUpperDay) {
        const specific = fillerPool.filter(ex => {
          const t = ex.target.toLowerCase();
          return !t.includes('đùi') && !t.includes('mông') && !t.includes('bắp chân');
        });
        const generic = fillerPool.filter(ex => !specific.includes(ex));
        fillerPool = [...specific, ...generic];
      } else if (isLowerDay) {
        const specific = fillerPool.filter(ex => {
          const t = ex.target.toLowerCase();
          return t.includes('đùi') || t.includes('mông') || t.includes('bắp chân');
        });
        const generic = fillerPool.filter(ex => !specific.includes(ex));
        fillerPool = [...specific, ...generic];
      }

      for (const filler of fillerPool) {
        if (dayObj.exercises.length >= targetExercises) break;
        dayObj.exercises.push({
          ...filler,
          sets: 3,
          reps: '12',
        });
      }
    }
  });

  const focusKeywords = focusMuscles.flatMap(focusM => {
    const keywords = MUSCLE_MAP[focusM] || [];
    return keywords.map(k => k.toLowerCase());
  });

  schedule.forEach((dayObj) => {
    if (!dayObj.isRest) {
      dayObj.exercises.sort((x, y) => {
        // Check if exercise target matches focus keywords
        const xFocus = focusKeywords.some(keyword => x.target.toLowerCase().includes(keyword));
        const yFocus = focusKeywords.some(keyword => y.target.toLowerCase().includes(keyword));

        if (xFocus && !yFocus) return -1;
        if (!xFocus && yFocus) return 1;

        // Fallback to sorting by tier and priority
        const order = { S: 1, A: 2, B: 3, C: 4 };
        const priorityMap = { high: 3, medium: 2, low: 1 };
        
        const getPriorityVal = (p: any) => {
          if (typeof p === 'number') return p;
          if (p && typeof p === 'string' && p in priorityMap) {
            return priorityMap[p as keyof typeof priorityMap];
          }
          return 0;
        };

        const tierDiff = (order[x.tier as keyof typeof order] || 4) - (order[y.tier as keyof typeof order] || 4);
        if (tierDiff !== 0) return tierDiff;
        
        const priorityX = getPriorityVal(x.priority);
        const priorityY = getPriorityVal(y.priority);
        return priorityY - priorityX; // Higher priority first
      });
    }
  });

  return schedule;
}

// Localized mappers for legacy/hardcoded database strings
function getLocalizedDay(day: string, t: any): string {
  if (!day) return '';
  const d = day.toUpperCase().trim();
  switch (d) {
    case 'THỨ 2': return t('dayMon');
    case 'THỨ 3': return t('dayTue');
    case 'THỨ 4': return t('dayWed');
    case 'THỨ 5': return t('dayThu');
    case 'THỨ 6': return t('dayFri');
    case 'THỨ 7': return t('daySat');
    case 'CHỦ NHẬT': return t('daySun');
    default: return day;
  }
}

function getLocalizedLabel(label: string, t: any): string {
  if (!label) return '';
  const l = label.toLowerCase();
  if (l.includes('nghỉ ngơi')) return t('sessionRest');
  if (l.includes('full body') || l.includes('toàn thân')) return t('sessionFullBody');
  if (l.includes('kéo') || l.includes('pull')) return t('sessionPull');
  if (l.includes('đẩy') || l.includes('push')) return t('sessionPush');
  if (l.includes('chân & bụng') || l.includes('chân') || l.includes('legs')) return t('sessionLegs');
  if (l.includes('thân trên') || l.includes('upper')) return t('sessionUpper');
  if (l.includes('thân dưới') || l.includes('lower')) return t('sessionLower');
  if (l.includes('bụng & cardio') || l.includes('cardio')) return t('sessionAbsCardio');
  if (l.includes('tùy chỉnh') || l.includes('custom')) return t('sessionCustom');
  return label;
}

function getLocalizedTarget(target: string, t: any): string {
  if (!target) return '';
  const lower = target.toLowerCase();
  
  if (lower.includes('ngực trên')) return t('muscleUpperChest');
  if (lower.includes('ngực giữa') || lower.includes('ngực dưới') || lower.includes('ngực trong')) return t('muscleMidLowerChest');
  if (lower.includes('lưng xô') || lower.includes('lưng rộng') || lower.includes('xô')) return t('muscleLats');
  if (lower.includes('lưng giữa') || lower.includes('lưng trên') || lower.includes('cầu vai')) return t('muscleUpperBack');
  if (lower.includes('lưng dưới')) return t('muscleLowerBack');
  if (lower.includes('vai trước')) return t('muscleFrontDelts');
  if (lower.includes('vai giữa')) return t('muscleSideDelts');
  if (lower.includes('vai sau')) return t('muscleRearDelts');
  if (lower.includes('tay trước')) return t('muscleBiceps');
  if (lower.includes('tay sau')) return t('muscleTriceps');
  if (lower.includes('đùi trước')) return t('muscleQuads');
  if (lower.includes('đùi sau') || lower.includes('mông') || lower.includes('đùi mông') || lower.includes('cơ mông')) return t('muscleHamGlutes');
  if (lower.includes('bắp chân')) return t('muscleCalves');
  if (lower.includes('bụng') || lower.includes('cơ core')) return t('muscleAbs');
  if (lower.includes('cardio') || lower.includes('tim mạch')) return t('muscleCardio');
  
  return target;
}

// ── ExerciseDetailModal ────────────────────────────────────────────────────────
function ExerciseDetailModal({
  exercise,
  dayName,
  opened,
  onClose,
}: {
  exercise: Exercise | null;
  dayName?: string;
  opened: boolean;
  onClose: () => void;
}) {
  const { profile, updateProfile } = useUserStore();
  const t = useTranslations('dashboard');
  const { library: exerciseLibraryRaw } = useExerciseStore() || {};
  const exerciseLibrary = exerciseLibraryRaw || MASTER_EXERCISES;

  if (!exercise) return null;

  const location = profile?.trainingLocation || 'gym';
  const currentLibrary = exerciseLibrary?.[location] || MASTER_EXERCISES[location];

  let sameGroupExercises: { name: string; target: string; tier: 'S' | 'A' | 'B' }[] = [];
  for (const [_, list] of Object.entries(currentLibrary)) {
    if (list.some((ex: any) => ex.name === exercise.name)) {
      sameGroupExercises = list as any;
      break;
    }
  }

  if (sameGroupExercises.length === 0) {
    for (const [_, list] of Object.entries(currentLibrary)) {
      if (list.some((ex: any) => ex.target.toLowerCase() === exercise.target.toLowerCase())) {
        sameGroupExercises = list as any;
        break;
      }
    }
  }

  const handleSwap = (newItem: { name: string; target: string; tier: 'S' | 'A' | 'B' }) => {
    if (!profile.customSchedule || !dayName) return;

    const updatedSchedule = profile.customSchedule.map((d: any) => {
      if (d.day === dayName) {
        return {
          ...d,
          exercises: d.exercises.map((ex: any) => {
            if (ex.name === exercise.name) {
              return {
                ...ex,
                name: newItem.name,
                target: newItem.target,
                tier: newItem.tier,
              };
            }
            return ex;
          }),
        };
      }
      return d;
    });

    updateProfile({ customSchedule: updatedSchedule });
    onClose();
  };

  const hasCurrent = sameGroupExercises.some((item) => item.name === exercise.name);
  const listToRender = hasCurrent 
    ? sameGroupExercises 
    : [{ name: exercise.name, target: exercise.target, tier: exercise.tier }, ...sameGroupExercises];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="1000px"
      padding={0}
      radius="xl"
      centered
      overlayProps={{ blur: 20, backgroundOpacity: 0.85, color: '#0d0d0d' }}
      styles={{
        content: { backgroundColor: '#1b0909', border: '1px solid var(--color-outline-variant)', overflow: 'hidden' },
        header: { display: 'none' },
        body: { padding: 0 },
      }}
    >
      <div className="flex flex-col md:flex-row" style={{ minHeight: 'auto' }}>
        {/* Left — Technique demo */}
        <div
          className="w-full md:w-[340px] flex-shrink-0 relative overflow-hidden aspect-video md:aspect-[9/16] h-48 md:h-auto"
          style={{ backgroundColor: '#000' }}
        >
          <img
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400"
            alt="Exercise demo"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #210e0e 0%, transparent 50%)', opacity: 0.7 }} />
          <div className="absolute inset-0 flex flex-col justify-end p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-10 rounded-full" style={{ background: 'linear-gradient(180deg,#ff525c,var(--color-secondary))' }} />
              <div>
                <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase' }}>{t('focusArea')}</div>
                <div style={{ fontFamily: 'var(--font-anybody)', fontWeight: 700, fontSize: '18px', color: '#fff' }}>{t('techniqueTitle')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Details */}
        <div className="flex-grow flex flex-col gap-6 p-6 md:p-8 overflow-y-auto" style={{ backgroundColor: '#1b0909' }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full transition-colors"
            style={{ backgroundColor: '#462f2e', color: 'var(--color-on-bg)', border: 'none', cursor: 'pointer', zIndex: 10 }}
          >
            ✕
          </button>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-1 rounded text-xs"
                style={{ fontFamily: 'var(--font-jetbrains)', backgroundColor: 'rgba(255,82,92,0.2)', color: '#ff525c', letterSpacing: '0.06em' }}
              >
                {t('strengthBadge')}
              </span>
              <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '11px', color: '#e9bcba', letterSpacing: '0.06em' }}>
                {getLocalizedTarget(exercise.target, t).toUpperCase()}
              </span>
              {renderTierBadge(exercise.tier)}
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-anybody)',
                fontWeight: 800,
                fontSize: 'clamp(24px,4vw,32px)',
                color: 'var(--color-on-bg)',
                textTransform: 'uppercase',
                lineHeight: 1.1,
              }}
            >
              {exercise.name}
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: t('setsStatLabel'), value: exercise.sets || 4 },
              { label: t('repsStatLabel'), value: exercise.reps || '12' },
              { label: t('restStatLabel'), value: 90 },
            ].map((s) => (
              <div
                key={s.label}
                className="flex flex-col gap-1 p-3 rounded-lg"
                style={{ background: 'rgba(46,26,26,0.4)', border: '1px solid rgba(175,135,134,0.1)' }}
              >
                <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', letterSpacing: '0.08em', color: '#e9bcba' }}>{s.label}</span>
                <span style={{ fontFamily: 'var(--font-anybody)', fontWeight: 700, fontSize: '24px', lineHeight: 1, color: 'var(--color-on-surface-variant)' }}>{s.value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <h3
              className="pl-3 border-l-2"
              style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '11px', letterSpacing: '0.08em', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', borderColor: 'var(--color-primary)' }}
            >
              {t('techniqueSectionTitle')}
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#e9bcba' }}>
              {t('techniqueNote')}
            </p>
          </div>

          <div className="flex flex-col gap-4 pt-4 border-t" style={{ borderColor: 'var(--color-outline-variant)' }}>
            <div className="flex justify-between items-center">
              <h3 style={{ fontFamily: 'var(--font-anybody)', fontWeight: 700, fontSize: '16px', textTransform: 'uppercase' }}>{t('sameGroupLabel')}</h3>
              <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '10px', color: '#e9bcba', letterSpacing: '0.06em' }}>{t('exerciseCount', { count: listToRender.length })}</span>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[220px] pr-1.5">
              {listToRender.map((item) => {
                const isCurrent = item.name === exercise.name;
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-3 rounded-xl border transition-all"
                    style={{
                      backgroundColor: isCurrent ? 'rgba(255, 0, 60, 0.05)' : '#2e1a1a',
                      borderColor: isCurrent ? 'var(--color-primary)' : 'var(--color-outline-variant)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: isCurrent ? 'var(--color-primary)' : 'var(--color-outline-variant)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: isCurrent ? 'var(--color-on-bg)' : '#e9bcba' }}>
                          {item.name} {isCurrent && <span className="text-[10px] text-[#ff525c] ml-2">{t('currentlyViewing')}</span>}
                        </div>
                        <div style={{ fontSize: '11px', color: '#a78584' }}>{getLocalizedTarget(item.target, t)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {renderTierBadge(item.tier)}
                      {!isCurrent && dayName && (
                        <Tooltip label={t('swapTooltip')} position="top" withArrow color="dark">
                          <button
                            onClick={() => handleSwap(item)}
                            className="w-8 h-8 rounded-lg text-sm font-bold transition-all duration-200 hover:bg-[var(--color-primary)] hover:border-transparent hover:text-white hover:scale-[1.05] hover:shadow-[0_0_12px_rgba(255,0,60,0.35)] flex items-center justify-center"
                            style={{
                              backgroundColor: 'rgba(255, 82, 92, 0.06)',
                              border: '1px solid rgba(255, 82, 92, 0.25)',
                              color: 'var(--color-on-surface-variant)',
                              cursor: 'pointer',
                            }}
                          >
                            ⇄
                          </button>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const { profile, updateProfile, resetStore } = useUserStore();
  const t = useTranslations('dashboard');
  const locale = useLocale();
  const { library: exerciseLibraryRaw } = useExerciseStore() || {};
  const exerciseLibrary = exerciseLibraryRaw || MASTER_EXERCISES;

  const [opened, { open, close }] = useDisclosure(false);
  const [addModalOpened, setAddModalOpened] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<{ dayName: string; index: number } | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedExerciseDay, setSelectedExerciseDay] = useState<string>('');
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const localePath = (path: string) =>
    locale === routing.defaultLocale ? path : `/${locale}${path}`;
  
  // Local state for dashboard adjustments
  const [weightInput, setWeightInput] = useState<number>(70);
  const [targetWeightInput, setTargetWeightInput] = useState<number>(70);
  const [workoutDaysInput, setWorkoutDaysInput] = useState<number>(4);
  const [locationInput, setLocationInput] = useState<'gym' | 'home'>('gym');
  const progressPct = 65;

  const isModified = 
    weightInput !== (profile?.weight || 70) ||
    targetWeightInput !== (profile?.targetWeight || 70) ||
    workoutDaysInput !== (profile?.workoutDaysPerWeek || 4) ||
    locationInput !== (profile?.trainingLocation || 'gym');

  // Add Custom Exercise State
  const [targetDayName, setTargetDayName] = useState<string>('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('nguc_tren');
  const [selectedExerciseName, setSelectedExerciseName] = useState<string>('');
  const [customSets, setCustomSets] = useState<number>(4);
  const [customReps, setCustomReps] = useState<string>('12');

  // Swap Day State
  const [swapSelectDay, setSwapSelectDay] = useState<string>('');

  // Hydrate local inputs from Zustand Store
  useEffect(() => {
    if (isHydrated && profile) {
      setWeightInput(profile.weight || 70);
      setTargetWeightInput(profile.targetWeight || 70);
      setWorkoutDaysInput(profile.workoutDaysPerWeek || 4);
      setLocationInput(profile.trainingLocation || 'gym');

      // Initialize schedule inside store if not yet created
      if (!profile.customSchedule) {
        const initialSchedule = generateWorkoutSchedule(
          profile.workoutDaysPerWeek || 4,
          profile.trainingLocation || 'gym',
          profile.gender || 'male',
          profile.focusMuscleGroups || [],
          exerciseLibrary
        );
        updateProfile({ customSchedule: initialSchedule });
      }
    }
  }, [isHydrated, profile, exerciseLibrary]);

  // Dropdown list filters matching selected muscle group
  const activeLocation = profile?.trainingLocation || 'gym';
  const availableExercisesList = exerciseLibrary?.[activeLocation]?.[selectedMuscle] || [];

  // Reset exercise selection whenever muscle category changes
  useEffect(() => {
    if (availableExercisesList.length > 0) {
      setSelectedExerciseName(availableExercisesList[0].name);
    } else {
      setSelectedExerciseName('');
    }
  }, [selectedMuscle, availableExercisesList]);

  const openModal = (exercise: Exercise, dayName: string) => {
    setSelectedExercise(exercise);
    setSelectedExerciseDay(dayName);
    open();
  };

  const handleRecreateWorkout = () => {
    resetStore();
    router.push('/onboarding');
  };

  const handleRecalculate = () => {
    const { height, age, gender, focusMuscleGroups } = profile;

    const heightInMeters = height / 100;
    const bmi = parseFloat((weightInput / (heightInMeters * heightInMeters)).toFixed(1));

    let bmr = 0;
    if (gender === 'male') {
      bmr = Math.round(10 * weightInput + 6.25 * height - 5 * age + 5);
    } else {
      bmr = Math.round(10 * weightInput + 6.25 * height - 5 * age - 161);
    }

    let pal = 1.2;
    if (workoutDaysInput <= 2) {
      pal = 1.375;
    } else if (workoutDaysInput <= 4) {
      pal = 1.55;
    } else if (workoutDaysInput === 5) {
      pal = 1.725;
    } else {
      pal = 1.9;
    }
    const tdee = Math.round(bmr * pal);

    let dailyCalorieTarget = tdee;
    let goal: 'weight_loss' | 'muscle_gain' | 'general' = 'general';

    if (targetWeightInput < weightInput - 2) {
      dailyCalorieTarget = tdee - 500;
      goal = 'weight_loss';
    } else if (targetWeightInput > weightInput + 2) {
      if (workoutDaysInput >= 4) {
        dailyCalorieTarget = tdee + 500;
      } else {
        dailyCalorieTarget = tdee + 300;
      }
      goal = 'muscle_gain';
    }

    const minCalories = gender === 'male' ? 1500 : 1200;
    if (dailyCalorieTarget < minCalories) {
      dailyCalorieTarget = minCalories;
    }

    const dailyProteinTarget = Math.round(weightInput * (gender === 'male' ? 2.0 : 1.6));

    // Regenerate fresh custom schedule since main parameters changed
    const freshSchedule = generateWorkoutSchedule(
      workoutDaysInput,
      locationInput,
      gender || 'male',
      focusMuscleGroups || [],
      exerciseLibrary
    );

    updateProfile({
      weight: weightInput,
      targetWeight: targetWeightInput,
      workoutDaysPerWeek: workoutDaysInput,
      trainingLocation: locationInput,
      bmi,
      bmr,
      tdee,
      dailyCalorieTarget,
      dailyProteinTarget,
      goal,
      customSchedule: freshSchedule,
    });
  };

  // Swap two days' schedules (exercises, label, isRest)
  const handleSwapDays = (day1: string, day2: string) => {
    if (!profile.customSchedule || day1 === day2) return;
    const schedule = profile.customSchedule;
    const d1 = schedule.find((d: any) => d.day === day1);
    const d2 = schedule.find((d: any) => d.day === day2);
    if (!d1 || !d2) return;

    const newSchedule = schedule.map((d: any) => {
      if (d.day === day1) return { ...d, label: d2.label, isRest: d2.isRest, exercises: d2.exercises };
      if (d.day === day2) return { ...d, label: d1.label, isRest: d1.isRest, exercises: d1.exercises };
      return d;
    });
    updateProfile({ customSchedule: newSchedule });
  };

  // Delete exercise handler
  const handleDeleteExercise = (dayName: string, exerciseIndex: number) => {
    if (!profile.customSchedule) return;

    const newSchedule = profile.customSchedule.map((day) => {
      if (day.day === dayName) {
        return {
          ...day,
          exercises: day.exercises.filter((_: any, idx: number) => idx !== exerciseIndex),
        };
      }
      return day;
    });

    updateProfile({ customSchedule: newSchedule });
  };

  // Open add exercise modal
  const handleOpenAddModal = (dayName: string) => {
    setTargetDayName(dayName);
    setAddModalOpened(true);
  };

  // Confirm custom exercise insertion
  const handleConfirmAddExercise = () => {
    if (!profile.customSchedule || !selectedExerciseName) return;

    // Retrieve full template properties (target muscle, tier)
    const exerciseTemplate = availableExercisesList.find(e => e.name === selectedExerciseName);
    if (!exerciseTemplate) return;

    const newExerciseItem: Exercise = {
      name: selectedExerciseName,
      target: exerciseTemplate.target,
      sets: customSets,
      reps: customReps,
      tier: exerciseTemplate.tier,
    };

    const newSchedule = profile.customSchedule.map((day) => {
      if (day.day === targetDayName) {
        // Append exercise
        const list = [...day.exercises, newExerciseItem];
        // Sort with S-Tier first
        const order = { S: 1, A: 2, B: 3 };
        const sorted = list.sort((x, y) => order[x.tier] - order[y.tier]);

        return {
          ...day,
          // If this was a rest day, convert it to a training day
          isRest: false,
          label: day.isRest ? 'Tùy chỉnh' : day.label,
          exercises: sorted,
        };
      }
      return day;
    });

    updateProfile({ customSchedule: newSchedule });
    setAddModalOpened(false);
  };

  const handleExportSchedule = () => {
    let content = `GYM SLAVE - WEEKLY WORKOUT SCHEDULE\n`;
    content += `Goal: ${profile.goal}\n`;
    content += `Frequency: ${profile.workoutDaysPerWeek} days/week\n`;
    content += `Location: ${profile.trainingLocation}\n`;
    content += `--------------------------------------------------\n\n`;

    const currentSchedule = profile.customSchedule || [];
    currentSchedule.forEach((dayObj) => {
      content += `${dayObj.day} - ${getLocalizedLabel(dayObj.label, t)}\n`;
      if (dayObj.isRest) {
        content += `  Rest Day\n\n`;
      } else if (dayObj.exercises.length === 0) {
        content += `  No exercises\n\n`;
      } else {
        dayObj.exercises.forEach((ex, idx) => {
          content += `  ${idx + 1}. ${ex.name} (${getLocalizedTarget(ex.target, t)})\n`;
          content += `     Sets: ${ex.sets} | Reps: ${ex.reps}\n`;
        });
        content += `\n`;
      }
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `weekly_schedule.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isHydrated || !profile.customSchedule) {
    return (
      <div 
        className="min-h-screen flex flex-col justify-center items-center"
        style={{ backgroundColor: '#140707', color: 'var(--color-on-bg)', fontFamily: 'var(--font-hanken)' }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-t-red-600 border-r-transparent border-b-orange-500 border-l-transparent animate-spin"></div>
            <div className="absolute inset-2 rounded-full bg-red-950/20 blur-sm"></div>
          </div>
          <div className="text-center space-y-1 mt-2">
            <h2 className="text-lg font-bold uppercase tracking-wider text-white font-mono animate-pulse">GYM SLAVE</h2>
            <p className="text-xs opacity-70 font-mono">{t('loadingText')}</p>
          </div>
        </div>
      </div>
    );
  }

  const currentSchedule = profile.customSchedule || [];

  const getBmiCategory = (val: number) => {
    if (val < 18.5) return { text: t('bmiUnderweight'), color: '#6cd7d8' };
    if (val < 24.9) return { text: t('bmiNormal'), color: '#4caf50' };
    if (val < 29.9) return { text: t('bmiOverweight'), color: 'var(--color-secondary)' };
    return { text: t('bmiObese'), color: 'var(--color-primary)' };
  };

  const bmiDetails = getBmiCategory(profile.bmi || 22.0);

  // Dynamic food list filtered by User Goal
  const activeFoods = foodPools[profile.goal] || foodPools.general;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: '#140707', color: 'var(--color-on-bg)', fontFamily: 'var(--font-hanken)' }}
    >
      {/* ── TopNav ────────────────────────────────────────────────────────── */}
      <Header />

      {/* ── Main ──────────────────────────────────────────────────────────── */}
      <main className="pt-24 pb-12 px-5 md:px-12 max-w-[1200px] mx-auto">
        
        {/* Profile greeting */}
        <div className="mb-12 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 style={{ fontFamily: 'var(--font-anybody)', fontWeight: 800, fontSize: 'clamp(32px,5vw,44px)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#fff' }}>
              {t('greeting')}
            </h1>
            <p style={{ fontSize: '16px', color: '#e9bcba', marginTop: '4px' }}>
              {t('profileGender')}: <span className="font-bold text-white uppercase">{profile.gender === 'male' ? t('genderMale') : t('genderFemale')}</span> • {t('profileLocation')}: <span className="font-bold text-white uppercase">{profile.trainingLocation === 'gym' ? t('locationGym') : t('locationHome')}</span> • {t('profileCommitment')}: <span className="font-bold text-white">{t('commitmentWeeks', { weeks: profile.targetWeeks || 12 })}</span>
            </p>
            {profile.focusMuscleGroups && profile.focusMuscleGroups.length > 0 && (
              <p style={{ fontSize: '13px', color: 'var(--color-secondary)', marginTop: '4px' }}>
                {t('focusMuscleLabel')}: <span className="font-bold text-white uppercase">{profile.focusMuscleGroups.join(', ')} {t('focusMuscleBoost')}</span>
              </p>
            )}
          </div>
          <div className="flex justify-end mt-2 md:mt-0">
            <button
              onClick={handleExportSchedule}
              className="flex items-center gap-2 px-4 py-2 rounded-lg uppercase transition-all active:scale-95 font-bold border hover:bg-white/5"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontFamily: 'var(--font-jetbrains)',
                fontSize: '11px',
                letterSpacing: '0.08em',
                cursor: 'pointer',
              }}
            >
              Export Schedule
            </button>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left — Dynamic Weekly Schedule */}
          <div className="lg:col-span-8 space-y-6">
            <section
              className="rounded-xl overflow-hidden border"
              style={{ backgroundColor: 'rgba(46, 20, 20, 0.3)', borderColor: 'var(--color-outline-variant)' }}
            >
              {/* Section header */}
              <div className="p-4 sm:p-6 flex items-center justify-between border-b" style={{ borderColor: 'var(--color-outline-variant)' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-anybody)', fontWeight: 700, fontSize: '20px', color: '#fff' }}>{t('weeklyScheduleTitle')}</h2>
                  <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '10px', letterSpacing: '0.08em', color: '#e9bcba', textTransform: 'uppercase', marginTop: '2px' }}>
                    {t('weeklyFrequency', { days: profile.workoutDaysPerWeek || 4 })}
                  </p>
                </div>
              </div>

              {/* Days list */}
              <div className="divide-y" style={{ borderColor: 'rgba(78, 42, 42, 0.3)' }}>
                {currentSchedule.map((day) => (
                  <div
                    key={day.day}
                    className="p-4 sm:p-6"
                    style={{
                      backgroundColor: day.isToday ? 'rgba(255,0,60,0.06)' : day.isRest ? 'transparent' : 'rgba(46, 20, 20, 0.15)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="px-2.5 py-0.5 rounded text-[10px] font-bold"
                          style={{
                            backgroundColor: day.isToday ? 'var(--color-primary)' : 'rgba(46, 20, 20, 0.8)',
                            color: '#fff',
                            border: day.isToday ? 'none' : '1px solid var(--color-outline-variant)',
                            fontFamily: 'var(--font-jetbrains)',
                            letterSpacing: '0.06em',
                          }}
                        >
                          {getLocalizedDay(day.day, t)}
                        </span>
                        <h3
                          style={{
                            fontFamily: 'var(--font-hanken)',
                            fontWeight: 700,
                            fontSize: '15px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            color: day.isRest ? '#af8786' : '#fff',
                          }}
                        >
                          {getLocalizedLabel(day.label, t)}
                        </h3>
                        {day.isToday && (
                          <span
                            className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                            style={{ backgroundColor: 'rgba(255,82,92,0.15)', color: '#ff525c', fontFamily: 'var(--font-jetbrains)', letterSpacing: '0.06em' }}
                          >
                            {t('todayBadge')}
                          </span>
                        )}
                      </div>

                      {/* Actions: swap + add exercise */}
                      <div className="flex items-center gap-2">
                        {/* Swap Day — icon-only compact select */}
                        <div className="relative" title={t('swapDayBtn')}>
                          {/* Visible icon button */}
                          <div
                            className="w-7 h-7 flex items-center justify-center rounded border pointer-events-none select-none"
                            style={{
                              background: 'rgba(30,10,10,0.8)',
                              borderColor: 'rgba(255,255,255,0.12)',
                              color: '#e9bcba',
                              fontSize: '13px',
                            }}
                          >
                            ⇄
                          </div>
                          {/* Invisible native select layered on top */}
                          <select
                            value=""
                            onChange={(e) => {
                              if (e.target.value) handleSwapDays(day.day, e.target.value);
                              setSwapSelectDay('');
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            style={{ fontSize: '13px' }}
                          >
                            <option value="" disabled>{t('swapDayBtn')}</option>
                            {currentSchedule
                              .filter((d) => d.day !== day.day)
                              .map((d) => (
                                <option
                                  key={d.day}
                                  value={d.day}
                                  style={{ background: '#1b0909', color: 'var(--color-on-bg)' }}
                                >
                                  {getLocalizedDay(d.day, t)} {d.isRest ? `(${t('rest')})` : ''}
                                </option>
                              ))}
                          </select>
                        </div>

                        {/* Add exercise button — always visible */}
                        <button
                          onClick={() => handleOpenAddModal(day.day)}
                          className="text-[10px] px-3 py-1 rounded border border-[var(--color-secondary)]/30 hover:border-[var(--color-secondary)] text-[var(--color-secondary)] font-bold uppercase transition-all font-mono"
                          style={{ background: 'none', cursor: 'pointer' }}
                        >
                          {t('addExerciseBtn')}
                        </button>
                      </div>
                    </div>

                    {day.isRest && day.exercises.length === 0 ? (
                      <p style={{ color: '#af8786', fontStyle: 'italic', fontSize: '13px' }}>{t('restDayDesc')}</p>
                    ) : day.exercises.length === 0 ? (
                      <p style={{ color: '#af8786', fontStyle: 'italic', fontSize: '12px' }}>{t('noExercisesDay')}</p>
                    ) : (
                      <>
                        {/* Mobile view: List of cards */}
                        <div className="block md:hidden space-y-3">
                          {day.exercises.map((ex, idx) => (
                            <div
                              key={`${ex.name}-${idx}`}
                              onClick={() => openModal(ex, day.day)}
                              className="p-4 rounded-xl border relative flex flex-col gap-2 active:scale-[0.99] transition-transform"
                              style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                borderColor: 'rgba(78, 42, 42, 0.4)',
                              }}
                            >
                              <div className="flex justify-between items-start pr-6">
                                <div>
                                  <span className="font-semibold text-white text-base block">
                                    {ex.name}
                                  </span>
                                  {renderTierBadge(ex.tier)}
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExerciseToDelete({ dayName: day.day, index: idx });
                                  }}
                                  className="absolute top-4 right-4 text-[#ff525c] hover:text-red-500 font-bold text-sm p-1"
                                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                  title={t('deleteExercise')}
                                >
                                  ✕
                                </button>
                              </div>
                              
                              <div className="flex justify-between text-xs text-[#e9bcba] pt-2 border-t border-dashed border-[var(--color-outline-variant)]/40">
                                <div>
                                  <span className="opacity-60">{t('tableMuscle')}:</span>{' '}
                                  <span className="font-medium text-white">{getLocalizedTarget(ex.target, t)}</span>
                                </div>
                                <div className="flex gap-4">
                                  <div>
                                    <span className="opacity-60">{t('tableSets')}:</span>{' '}
                                    <span className="font-mono font-bold text-white">{ex.sets}</span>
                                  </div>
                                  <div>
                                    <span className="opacity-60">{t('tableReps')}:</span>{' '}
                                    <span className="font-mono font-bold text-white">{ex.reps}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Desktop view: Table */}
                        <div className="hidden md:block overflow-x-auto">
                          <table className="w-full text-left text-sm border-collapse">
                            <thead>
                              <tr style={{ borderBottom: '1px solid rgba(78, 42, 42, 0.4)' }}>
                                {[t('tableExercise'), t('tableMuscle'), t('tableSets'), t('tableReps'), ''].map((h) => (
                                  <th
                                    key={h}
                                    className="py-2 pr-4 uppercase"
                                    style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', letterSpacing: '0.08em', color: '#e9bcba', fontWeight: 500 }}
                                  >
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {day.exercises.map((ex, idx) => (
                                <tr
                                  key={`${ex.name}-${idx}`}
                                  className="cursor-pointer transition-colors"
                                  style={{ borderBottom: '1px solid rgba(78, 42, 42, 0.15)' }}
                                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(78, 42, 42, 0.2)'; }}
                                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                                >
                                  <td className="py-3 pr-4 font-semibold text-white" onClick={() => openModal(ex, day.day)}>
                                    {ex.name}
                                    {renderTierBadge(ex.tier)}
                                  </td>
                                  <td className="py-3 px-4" style={{ color: '#e9bcba' }} onClick={() => openModal(ex, day.day)}>{getLocalizedTarget(ex.target, t)}</td>
                                  <td className="py-3 px-4" onClick={() => openModal(ex, day.day)}>{ex.sets}</td>
                                  <td className="py-3 px-4" onClick={() => openModal(ex, day.day)}>{ex.reps}</td>
                                  <td className="py-3 pl-4 text-right">
                                    {/* Delete action */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setExerciseToDelete({ dayName: day.day, index: idx });
                                      }}
                                      className="text-[#ff525c] hover:text-red-500 font-bold bg-none border-none text-xs transition-colors p-1"
                                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                      title={t('deleteExercise')}
                                    >
                                      ✕
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Dynamic Food Suggestions matching User Goal */}
            <section>
              <div className="flex items-center justify-between mb-3 mt-10">
                <h2 style={{ fontFamily: 'var(--font-anybody)', fontWeight: 700, fontSize: '20px', color: '#fff' }}>
                  {t('nutritionTitle')} ({profile.goal === 'weight_loss' ? t('nutritionWeightLoss') : profile.goal === 'muscle_gain' ? t('nutritionMuscleGain') : t('nutritionGeneral')})
                </h2>
                <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '10px', letterSpacing: '0.08em', color: '#e9bcba', textTransform: 'uppercase' }}>
                  {t('nutritionCurated')}
                </span>
              </div>
              <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'rgba(46,20,20,0.3)', borderColor: 'var(--color-outline-variant)' }}>
                {activeFoods.map((food, i) => (
                  <div
                    key={food.name}
                    className="flex items-center justify-between px-6 py-4 cursor-pointer transition-colors group"
                    style={{ borderBottom: i < activeFoods.length - 1 ? '1px solid rgba(78, 42, 42, 0.3)' : 'none' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(78, 42, 42, 0.2)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                  >
                    <div className="flex items-center gap-4">
                      <span style={{ fontSize: '20px', color: 'var(--color-secondary)' }}>🍽</span>
                      <div>
                        <span className="fontWeight-600 text-white" style={{ fontSize: '15px' }}>{food.name}</span>
                        <span className="block text-[11px] text-[#e9bcba] mt-0.5">
                          {t('nutritionPer')}: {food.per}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>{food.cal} kcal</span>
                      <div className="flex gap-2 text-[9px] font-mono justify-end text-[#e9bcba] mt-0.5 uppercase">
                        <span>P: {food.protein}g</span>
                        <span>•</span>
                        <span>C: {food.carbs}g</span>
                        <span>•</span>
                        <span>F: {food.fat}g</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right — Calorie & Target Tracker */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Calorie Goal Summary from Store */}
            <section
              className="rounded-xl p-6 border text-center"
              style={{ backgroundColor: 'rgba(46, 20, 20, 0.3)', borderColor: 'var(--color-outline-variant)' }}
            >
              <div className="flex flex-col items-center justify-center py-6">
                <span
                  className="block mb-2"
                  style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '10px', letterSpacing: '0.1em', color: '#e9bcba', textTransform: 'uppercase' }}
                >
                  {t('tdeeLabel')}
                </span>
                <h2 style={{ fontFamily: 'var(--font-anybody)', fontWeight: 800, fontSize: '42px', lineHeight: 1, letterSpacing: '-0.02em', color: '#fff' }}>
                  {profile.dailyCalorieTarget || 2200}{' '}
                  <span style={{ fontFamily: 'var(--font-anybody)', fontWeight: 700, fontSize: '18px', color: 'var(--color-secondary)' }}>{t('kcalPerDay')}</span>
                </h2>
                {profile.tdee && (
                  <span className="text-[11px] opacity-60 mt-1 font-mono">{t('bmrLabel', { bmr: profile.bmr })}</span>
                )}
              </div>
              <div className="flex justify-between px-2 pt-4 border-t border-[var(--color-outline-variant)]/40" style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '11px' }}>
                <div className="text-left">
                  <p style={{ color: '#6cd7d8', fontWeight: 700, fontSize: '15px' }}>{profile.dailyProteinTarget || 140}g</p>
                  <p style={{ color: '#e9bcba', textTransform: 'uppercase', fontSize: '9px' }}>{t('proteinLabel')}</p>
                </div>
                <div className="text-center">
                  <p style={{ color: '#ffb693', fontWeight: 700, fontSize: '15px' }}>~{Math.round((profile.dailyCalorieTarget * 0.5) / 4)}g</p>
                  <p style={{ color: '#e9bcba', textTransform: 'uppercase', fontSize: '9px' }}>{t('carbsLabel')}</p>
                </div>
                <div className="text-right">
                  <p style={{ color: '#ffb4ab', fontWeight: 700, fontSize: '15px' }}>~{Math.round((profile.dailyCalorieTarget * 0.2) / 9)}g</p>
                  <p style={{ color: '#e9bcba', textTransform: 'uppercase', fontSize: '9px' }}>{t('fatLabel')}</p>
                </div>
              </div>
            </section>

            {/* NEW PANEL: Adjust Weight, Target Weight, Frequency, and Location */}
            <section
              className="rounded-xl p-6 border space-y-4"
              style={{ backgroundColor: 'rgba(46, 20, 20, 0.3)', borderColor: 'var(--color-outline-variant)' }}
            >
              <h2 style={{ fontFamily: 'var(--font-anybody)', fontWeight: 700, fontSize: '18px', color: '#fff' }}>
                ⚙️ {t('quickAdjustTitle')}
              </h2>

              {/* Adjust Current Weight */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span style={{ color: '#e9bcba' }}>{t('currentWeightLabel')}</span>
                  <span className="font-bold text-white">{weightInput} KG</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={200}
                  value={weightInput}
                  onChange={(e) => setWeightInput(Number(e.target.value))}
                  className="w-full cursor-pointer h-1.5 rounded-lg appearance-none"
                  style={{
                    background: '#2e1414',
                    accentColor: 'var(--color-primary)',
                  }}
                />
              </div>

              {/* Adjust Weight Goal */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span style={{ color: '#e9bcba' }}>{t('targetWeightLabel')}</span>
                  <span className="font-bold text-white">{targetWeightInput} KG</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={200}
                  value={targetWeightInput}
                  onChange={(e) => setTargetWeightInput(Number(e.target.value))}
                  className="w-full cursor-pointer h-1.5 rounded-lg appearance-none"
                  style={{
                    background: '#2e1414',
                    accentColor: 'var(--color-secondary)',
                  }}
                />
              </div>

              {/* Adjust Location Gym/Home */}
              <div className="space-y-2">
                <label className="block text-xs font-mono" style={{ color: '#e9bcba' }}>
                  {t('locationLabel')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setLocationInput('gym')}
                    className="py-2.5 rounded-lg text-xs font-bold transition-all border"
                    style={{
                      backgroundColor: locationInput === 'gym' ? 'rgba(254,107,0,0.15)' : 'rgba(46, 20, 20, 0.3)',
                      borderColor: locationInput === 'gym' ? 'var(--color-secondary)' : 'var(--color-outline-variant)',
                      color: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    {t('locationGymBtn')}
                  </button>
                  <button
                    onClick={() => setLocationInput('home')}
                    className="py-2.5 rounded-lg text-xs font-bold transition-all border"
                    style={{
                      backgroundColor: locationInput === 'home' ? 'rgba(254,107,0,0.15)' : 'rgba(46, 20, 20, 0.3)',
                      borderColor: locationInput === 'home' ? 'var(--color-secondary)' : 'var(--color-outline-variant)',
                      color: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    {t('locationHomeBtn')}
                  </button>
                </div>
              </div>

              {/* Adjust Frequency */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono" style={{ color: '#e9bcba' }}>
                    {t('frequencyLabel')}
                  </label>
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/40 text-[#ff525c]">
                    {t('frequencyDays', { days: workoutDaysInput })}
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7].map((n) => {
                    const isSelected = workoutDaysInput === n;
                    const isRecommended = n >= 3 && n <= 5;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setWorkoutDaysInput(n)}
                        className="py-2.5 rounded-lg text-xs font-bold transition-all relative border active:scale-95"
                        style={{
                          background: isSelected 
                            ? 'linear-gradient(135deg, var(--preset-gradient-from), var(--preset-gradient-to))' 
                            : 'rgba(46, 20, 20, 0.3)',
                          borderColor: isSelected 
                            ? '#ff525c' 
                            : isRecommended ? '#8b4a4a' : 'var(--color-outline-variant)',
                          color: '#fff',
                          cursor: 'pointer',
                          boxShadow: isSelected ? '0 0 12px rgba(255, 0, 60, 0.4)' : 'none',
                        }}
                      >
                        {n}
                        {isRecommended && !isSelected && (
                          <span 
                            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                            style={{ backgroundColor: '#ff525c' }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="text-[10px] text-right font-mono" style={{ color: '#a38a8a' }}>
                  {workoutDaysInput <= 2 && t('frequencyLight')}
                  {workoutDaysInput >= 3 && workoutDaysInput <= 4 && t('frequencyOptimal')}
                  {workoutDaysInput === 5 && t('frequencyHard')}
                  {workoutDaysInput >= 6 && t('frequencyHardcore')}
                </div>
              </div>

              {/* Recalculate CTA */}
              <button
                disabled={!isModified}
                onClick={handleRecalculate}
                className="w-full py-3 rounded-xl uppercase font-bold transition-all active:scale-[0.98] mt-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                style={{
                  background: isModified ? 'linear-gradient(135deg, var(--preset-gradient-from), var(--preset-gradient-to))' : 'rgba(255, 0, 60, 0.15)',
                  color: isModified ? '#fff' : '#888',
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  border: isModified ? 'none' : '1px solid var(--color-outline-variant)',
                  cursor: isModified ? 'pointer' : 'not-allowed',
                  boxShadow: isModified ? '0 4px 15px rgba(255,0,60,0.2)' : 'none',
                }}
              >
                {t('recalculateBtn')}
              </button>
            </section>

            {/* Target Settings with BMI display */}
            <section className="rounded-xl p-6 border space-y-6" style={{ backgroundColor: 'rgba(46, 20, 20, 0.3)', borderColor: 'var(--color-outline-variant)' }}>
              <h2 style={{ fontFamily: 'var(--font-anybody)', fontWeight: 700, fontSize: '18px', color: '#fff' }}>{t('bodyStatsTitle')}</h2>

              {/* BMI Output */}
              <div>
                <label
                  className="block mb-2"
                  style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '10px', letterSpacing: '0.08em', color: '#e9bcba', textTransform: 'uppercase' }}
                >
                  {t('bmiLabel')}
                </label>
                <div
                  className="p-4 rounded-xl border flex justify-between items-center"
                  style={{ backgroundColor: 'rgba(46, 20, 20, 0.2)', borderColor: 'var(--color-outline-variant)' }}
                >
                  <div>
                    <span className="font-mono text-2xl font-bold text-white">{profile.bmi || 22.0}</span>
                    <p className="text-xs font-semibold mt-1" style={{ color: bmiDetails.color }}>
                      {bmiDetails.text}
                    </p>
                  </div>
                  <span className="text-3xl">⚖️</span>
                </div>
              </div>

              {/* Weight target details */}
              <div>
                <label
                  className="block mb-2"
                  style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '10px', letterSpacing: '0.08em', color: '#e9bcba', textTransform: 'uppercase' }}
                >
                  {t('weightGoalLabel')}
                </label>
                <div
                  className="flex items-center justify-between p-3 rounded-lg border"
                  style={{ backgroundColor: 'rgba(46, 20, 20, 0.2)', borderColor: 'var(--color-outline-variant)' }}
                >
                  <span style={{ fontWeight: 700, fontSize: '16px', color: '#fff' }}>{profile.targetWeight || 70} kg</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-orange-950/20 border border-[var(--color-secondary)] text-[var(--color-secondary)]" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                    {profile.goal === 'weight_loss' ? t('goalWeightLoss') : profile.goal === 'muscle_gain' ? t('goalMuscleGain') : t('goalMaintain')}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="pt-4 border-t" style={{ borderColor: 'rgba(78, 42, 42, 0.3)' }}>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#2e1414' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${progressPct}%`,
                      backgroundColor: 'var(--color-primary)',
                      boxShadow: '0 0 10px rgba(255, 0, 60, 0.5)',
                    }}
                  />
                </div>
                <p
                  className="mt-3 text-center uppercase"
                  style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', letterSpacing: '0.08em', color: '#e9bcba' }}
                >
                  {t('progressWeeks', { pct: progressPct, weeks: profile.targetWeeks || 12 })}
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* ── Exercise Detail Modal ────────────────────────────────────────── */}
      <ExerciseDetailModal exercise={selectedExercise} dayName={selectedExerciseDay} opened={opened} onClose={close} />

      {/* ── Add Custom Exercise Modal ────────────────────────────────────── */}
      <Modal
        opened={addModalOpened}
        onClose={() => setAddModalOpened(false)}
        title={`${t('addExerciseModalTitle')} - ${getLocalizedDay(targetDayName, t)}`}
        radius="lg"
        centered
        overlayProps={{ blur: 15, backgroundOpacity: 0.8, color: '#0d0d0d' }}
        styles={{
          content: { backgroundColor: '#1b0909', border: '1px solid var(--color-outline-variant)', color: 'var(--color-on-bg)' },
          header: { backgroundColor: '#1b0909', borderBottom: '1px solid var(--color-outline-variant)', color: '#fff', fontWeight: 'bold' },
        }}
      >
        <div className="space-y-4 pt-2">
          
          {/* Dropdown 1: Target Muscle */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-mono text-[#e9bcba]">{t('muscleGroupLabel')}</label>
            <select
              value={selectedMuscle}
              onChange={(e) => setSelectedMuscle(e.target.value)}
              className="px-3 py-2.5 rounded-lg border cursor-pointer focus:outline-none"
              style={{ backgroundColor: '#2e1414', borderColor: 'var(--color-outline-variant)', color: '#fff' }}
            >
              <option value="nguc_tren">{t('muscleUpperChest')}</option>
              <option value="nguc_giua_duoi">{t('muscleMidLowerChest')}</option>
              <option value="lung_xo">{t('muscleLats')}</option>
              <option value="lung_tren">{t('muscleUpperBack')}</option>
              <option value="lung_duoi">{t('muscleLowerBack')}</option>
              <option value="vai_truoc">{t('muscleFrontDelts')}</option>
              <option value="vai_giua">{t('muscleSideDelts')}</option>
              <option value="vai_sau">{t('muscleRearDelts')}</option>
              <option value="tay_truoc">{t('muscleBiceps')}</option>
              <option value="tay_sau">{t('muscleTriceps')}</option>
              <option value="dui_truoc">{t('muscleQuads')}</option>
              <option value="dui_sau_mong">{t('muscleHamGlutes')}</option>
              <option value="bap_chan">{t('muscleCalves')}</option>
              <option value="bung">{t('muscleAbs')}</option>
              <option value="cardio">{t('muscleCardio')}</option>
            </select>
          </div>

          {/* Dropdown 2: Exercises matching chosen Muscle Group */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-mono text-[#e9bcba]">{t('exerciseSelectLabel')}</label>
            <select
              value={selectedExerciseName}
              onChange={(e) => setSelectedExerciseName(e.target.value)}
              className="px-3 py-2.5 rounded-lg border cursor-pointer focus:outline-none"
              style={{ backgroundColor: '#2e1414', borderColor: 'var(--color-outline-variant)', color: '#fff' }}
            >
              {availableExercisesList.length === 0 ? (
                <option value="">{t('noExerciseOption')}</option>
              ) : (
                availableExercisesList.map((ex) => (
                  <option key={ex.name} value={ex.name}>
                    {ex.name} [Tier {ex.tier}]
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Sets and Reps inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-mono text-[#e9bcba]">{t('setsLabel')}</label>
              <input
                type="number"
                min={1}
                max={10}
                value={customSets}
                onChange={(e) => setCustomSets(Math.max(1, Number(e.target.value)))}
                className="px-3 py-2.5 rounded-lg border focus:outline-none"
                style={{ backgroundColor: '#2e1414', borderColor: 'var(--color-outline-variant)', color: '#fff' }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-mono text-[#e9bcba]">{t('repsLabel')}</label>
              <input
                type="text"
                value={customReps}
                onChange={(e) => setCustomReps(e.target.value)}
                className="px-3 py-2.5 rounded-lg border focus:outline-none"
                style={{ backgroundColor: '#2e1414', borderColor: 'var(--color-outline-variant)', color: '#fff' }}
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex gap-3 pt-4 border-t border-[var(--color-outline-variant)] justify-end">
            <button
              onClick={() => setAddModalOpened(false)}
              className="px-4 py-2.5 rounded-lg border transition-all text-xs font-bold uppercase font-mono"
              style={{ backgroundColor: 'transparent', borderColor: 'var(--color-outline-variant)', color: '#e9bcba', cursor: 'pointer' }}
            >
              {t('cancelBtn')}
            </button>
            <button
              onClick={handleConfirmAddExercise}
              disabled={!selectedExerciseName}
              className="px-6 py-2.5 rounded-lg transition-all text-xs font-bold uppercase font-mono text-white"
              style={{
                background: 'linear-gradient(90deg, var(--preset-gradient-from), var(--preset-gradient-to))',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {t('confirmAddBtn')}
            </button>
          </div>

        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={exerciseToDelete !== null}
        onClose={() => setExerciseToDelete(null)}
        title="Xác nhận xoá"
        centered
        overlayProps={{ blur: 3, backgroundOpacity: 0.5 }}
        styles={{
          content: { backgroundColor: '#1a1a1a', color: 'var(--color-on-bg)', border: '1px solid var(--color-outline-variant)' },
          header: { backgroundColor: '#1a1a1a' },
          title: { fontWeight: 'bold' }
        }}
      >
        <div style={{ fontSize: '14px', marginBottom: '20px' }}>
          Bạn có chắc chắn muốn xoá bài tập này khỏi lịch tập không?
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button 
            className="px-4 py-2 rounded-lg font-bold transition-all"
            style={{ backgroundColor: 'transparent', border: '1px solid var(--color-outline-variant)', color: 'var(--color-on-bg)', cursor: 'pointer' }}
            onClick={() => setExerciseToDelete(null)}
          >
            Hủy
          </button>
          <button 
            className="px-4 py-2 rounded-lg font-bold transition-all"
            style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', cursor: 'pointer' }}
            onClick={() => {
              if (exerciseToDelete) {
                handleDeleteExercise(exerciseToDelete.dayName, exerciseToDelete.index);
                setExerciseToDelete(null);
              }
            }}
          >
            Xoá
          </button>
        </div>
      </Modal>
    </div>
  );
}
