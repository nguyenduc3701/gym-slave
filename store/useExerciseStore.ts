import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ExerciseInfo {
  name: string;
  target: string;
  tier: 'S' | 'A' | 'B' | 'C';
  priority?: 'low' | 'medium' | 'high';
  description?: string;
}

export type ExerciseLibraryMap = Record<string, ExerciseInfo[]>;

export interface ExerciseLibraryState {
  gym: ExerciseLibraryMap;
  home: ExerciseLibraryMap;
}

export interface ExerciseStore {
  library: ExerciseLibraryState;
  addExercise: (location: 'gym' | 'home', muscleKey: string, exercise: ExerciseInfo) => void;
  editExercise: (location: 'gym' | 'home', muscleKey: string, oldName: string, updated: Partial<ExerciseInfo>) => void;
  deleteExercise: (location: 'gym' | 'home', muscleKey: string, name: string) => void;
  updateTier: (location: 'gym' | 'home', muscleKey: string, name: string, tier: 'S' | 'A' | 'B' | 'C') => void;
  resetLibrary: () => void;
}

const defaultLibrary: ExerciseLibraryState = {
  gym: {
    nguc_tren: [
      { name: "Incline Dumbbell Press", target: "Ngực trên", tier: "S", priority: "high" },
      { name: "Incline Smith Machine Press", target: "Ngực trên", tier: "S", priority: "high" },
      { name: "Incline Barbell Bench Press", target: "Ngực trên", tier: "A", priority: "high" },
      { name: "Low-to-High Cable Fly", target: "Ngực trên & Ngực trong", tier: "A", priority: "medium" },
      { name: "Incline Dumbbell Fly", target: "Ngực trên", tier: "B", priority: "medium" }
    ],
    nguc_giua_duoi: [
      { name: "Bench Press", target: "Ngực giữa", tier: "S", priority: "high" },
      { name: "Chest Press Machine", target: "Ngực giữa (Cô lập)", tier: "A", priority: "high" },
      { name: "Chest Dips (Xà kép ngực)", target: "Ngực dưới & Vai trước", tier: "A", priority: "high" },
      { name: "Chest Fly Machine (Pec Deck)", target: "Ngực giữa (Cô lập)", tier: "A", priority: "medium" },
      { name: "Cable Crossover", target: "Ngực dưới", tier: "A", priority: "medium" },
      { name: "Push-Up (Chống đẩy)", target: "Ngực & Vai", tier: "B", priority: "medium" }
    ],
    lung_xo: [
      { name: "Pull-Up (Xà đơn)", target: "Lưng xô", tier: "S", priority: "high" },
      { name: "Lat Pulldown", target: "Lưng rộng", tier: "S", priority: "high" },
      { name: "Barbell Row", target: "Lưng xô", tier: "A", priority: "high" },
      { name: "Single-Arm Dumbbell Row", target: "Lưng xô (Đơn phương)", tier: "A", priority: "high" },
      { name: "Straight-Arm Cable Pull-Down", target: "Lưng xô (Cô lập kéo giãn)", tier: "A", priority: "medium" }
    ],
    lung_tren: [
      { name: "Chest-Supported T-Bar Row", target: "Lưng giữa & Lưng trên", tier: "S", priority: "high" },
      { name: "Seated Cable Row", target: "Lưng giữa", tier: "A", priority: "high" },
      { name: "T-Bar Row (Free Weight)", target: "Lưng giữa & Cầu vai", tier: "A", priority: "high" },
      { name: "Dumbbell Shrugs", target: "Cầu vai trên", tier: "B", priority: "low" }
    ],
    lung_duoi: [
      { name: "Deadlift", target: "Đùi sau & Toàn bộ chuỗi cơ sau", tier: "S", priority: "high" },
      { name: "Hyperextension (Ghế dốc lưng dưới)", target: "Lưng dưới & Mông", tier: "A", priority: "low" }
    ],
    vai_truoc: [
      { name: "Overhead Press", target: "Vai trước & Core", tier: "S", priority: "high" },
      { name: "Dumbbell Shoulder Press", target: "Vai trước", tier: "A", priority: "high" },
      { name: "Front Raise (Cáp hoặc Tạ đơn)", target: "Vai trước", tier: "C", priority: "medium" }
    ],
    vai_giua: [
      { name: "Cable Lateral Raise", target: "Vai giữa (Áp lực đều)", tier: "S", priority: "medium" },
      { name: "Lateral Raise (Dumbbell)", target: "Vai giữa", tier: "A", priority: "medium" },
      { name: "Dumbbell Upright Row", target: "Vai giữa & Cầu vai", tier: "B", priority: "high" }
    ],
    vai_sau: [
      { name: "Reverse Pec Deck Fly", target: "Vai sau (Cô lập)", tier: "S", priority: "medium" },
      { name: "Face Pull", target: "Vai sau & Lưng trên", tier: "A", priority: "medium" }
    ],
    tay_truoc: [
      { name: "Incline Dumbbell Curl", target: "Tay trước (Đầu dài - Kéo giãn)", tier: "S", priority: "medium" },
      { name: "Preacher Curl", target: "Tay trước (Đầu ngắn - Co thắt)", tier: "A", priority: "medium" },
      { name: "Hammer Curl", target: "Tay trước (Cơ cánh tay quay)", tier: "A", priority: "medium" },
      { name: "Dumbbell Curl", target: "Tay trước", tier: "B", priority: "medium" }
    ],
    tay_sau: [
      { name: "Tricep Rope Pushdown", target: "Tay sau (Đầu bên & đầu trong)", tier: "S", priority: "medium" },
      { name: "Overhead Cable Tricep Extension", target: "Tay sau (Đầu dài)", tier: "S", priority: "medium" },
      { name: "Close-Grip Bench Press", target: "Tay sau & Ngực", tier: "A", priority: "high" },
      { name: "JM Press", target: "Tay sau (Khối lượng nặng)", tier: "A", priority: "high" },
      { name: "Tricep Pushdown (Thanh thẳng)", target: "Tay sau", tier: "A", priority: "medium" },
      { name: "Tricep Kickback", target: "Tay sau", tier: "C", priority: "medium" }
    ],
    dui_truoc: [
      { name: "Barbell Squat", target: "Đùi trước & Mông", tier: "S", priority: "high" },
      { name: "Bulgarian Split Squat", target: "Đùi trước & Mông (Đơn phương)", tier: "S", priority: "high" },
      { name: "Leg Press", target: "Đùi trước & Mông", tier: "A", priority: "high" },
      { name: "Leg Extension (Máy đá đùi trước)", target: "Đùi trước (Cô lập)", tier: "A", priority: "medium" },
      { name: "Dumbbell Goblet Squat", target: "Đùi trước", tier: "B", priority: "high" }
    ],
    dui_sau_mong: [
      { name: "Romanian Deadlift", target: "Đùi sau & Mông (Kéo giãn)", tier: "S", priority: "high" },
      { name: "Barbell Hip Thrust", target: "Cơ mông lớn (Co thắt cực đại)", tier: "S", priority: "high" },
      { name: "Seated Leg Curl", target: "Đùi sau (Vị trí ngồi tối ưu hơn nằm)", tier: "S", priority: "medium" },
      { name: "Lying Leg Curl", target: "Đùi sau", tier: "A", priority: "medium" },
      { name: "Abductor Machine", target: "Mông nhỡ / Đùi ngoài", tier: "B", priority: "low" },
      { name: "Glute Bridge (Cầu mông)", target: "Mông", tier: "B", priority: "low" }
    ],
    bap_chan: [
      { name: "Calf Raise (Đứng máy/Leg Press)", target: "Bắp chân lớn (Gastrocnemius)", tier: "A", priority: "low" },
      { name: "Seated Calf Raise", target: "Bắp chân sâu (Soleus)", tier: "A", priority: "low" }
    ],
    bung: [
      { name: "Hanging Leg Raise", target: "Bụng dưới & Toàn bộ cơ bụng", tier: "S", priority: "low" },
      { name: "Cable Crunch (Quỳ kéo cáp)", target: "Bụng trên (Quá tải lũy tiến)", tier: "S", priority: "low" },
      { name: "Plank", target: "Cơ lõi (Core/Tĩnh)", tier: "B", priority: "low" }
    ],
    cardio: [
      { name: "Rowing Machine (Máy chèo thuyền)", target: "Toàn thân & Tim mạch", tier: "S", priority: "medium" },
      { name: "Treadmill Running (Chạy bộ máy)", target: "Tim mạch", tier: "A", priority: "medium" },
      { name: "Stationary Cycling (Đạp xe máy)", target: "Tim mạch", tier: "A", priority: "medium" },
      { name: "Elliptical Machine", target: "Tim mạch (Bảo vệ khớp gối)", tier: "A", priority: "medium" }
    ]
  },
  home: {
    nguc_tren: [
      { name: "Decline Push-Up (Chân trên ghế)", target: "Ngực trên", tier: "A", priority: "high" },
      { name: "Dumbbell Incline Press (với gối/đệm dốc)", target: "Ngực trên", tier: "A", priority: "high" },
      { name: "Incline Dumbbell Fly Floor", target: "Ngực trên", tier: "C", priority: "medium" }
    ],
    nguc_giua_duoi: [
      { name: "Push-Up (Chống đẩy)", target: "Ngực & Vai trước", tier: "S", priority: "high" },
      { name: "Dumbbell Floor Press", target: "Ngực giữa (An toàn cho vai)", tier: "A", priority: "high" },
      { name: "Knee Push-Up", target: "Ngực (Cho người mới)", tier: "B", priority: "high" },
      { name: "Incline Push-Up (Tay trên ghế)", target: "Ngực dưới", tier: "B", priority: "high" },
      { name: "Dumbbell Floor Fly", target: "Ngực trong", tier: "C", priority: "medium" }
    ],
    lung_xo: [
      { name: "Pull-Up (Xà đơn dán tường/cửa)", target: "Lưng xô", tier: "S", priority: "high" },
      { name: "Inverted Row (Dưới bàn chắc chắn)", target: "Lưng xô & Lưng giữa", tier: "A", priority: "high" },
      { name: "Doorframe Rows / Towel Rows", target: "Lưng xô bổ trợ", tier: "B", priority: "high" },
      { name: "Dumbbell Pullover Floor", target: "Lưng xô & Ngực", tier: "C", priority: "medium" }
    ],
    lung_tren: [
      { name: "Dumbbell Row", target: "Lưng giữa & Lưng trên", tier: "S", priority: "high" },
      { name: "Prone YTAs (Nằm sấp giơ tay)", target: "Lưng trên & Vai sau", tier: "A", priority: "low" }
    ],
    lung_duoi: [
      { name: "Dumbbell Romanian Deadlift", target: "Lưng dưới & Đùi sau", tier: "S", priority: "high" },
      { name: "Superman (Nằm sấp nâng người)", target: "Lưng dưới", tier: "B", priority: "low" }
    ],
    vai_truoc: [
      { name: "Dumbbell Shoulder Press", target: "Vai trước", tier: "S", priority: "high" },
      { name: "Pike Push-Up", target: "Vai trước (Calisthenics)", tier: "A", priority: "high" }
    ],
    vai_giua: [
      { name: "Dumbbell Lateral Raise", target: "Vai giữa", tier: "S", priority: "medium" },
      { name: "Plank Shoulder Taps", target: "Core & Vai ổn định", tier: "B", priority: "low" }
    ],
    vai_sau: [
      { name: "Rear Delt Dumbbell Fly", target: "Vai sau", tier: "A", priority: "medium" }
    ],
    tay_truoc: [
      { name: "Dumbbell Bicep Curl", target: "Tay trước", tier: "A", priority: "medium" },
      { name: "Dumbbell Hammer Curl", target: "Tay trước (Độ dày cẳng tay)", tier: "A", priority: "medium" },
      { name: "Dumbbell Concentration Curl", target: "Đỉnh cơ tay trước", tier: "B", priority: "medium" }
    ],
    tay_sau: [
      { name: "Diamond Push-Up", target: "Tay sau & Ngực trong", tier: "S", priority: "high" },
      { name: "Dumbbell Overhead Tricep Extension", target: "Tay sau (Đầu dài)", tier: "A", priority: "medium" },
      { name: "Bench Dips (Xà kép cạnh ghế)", target: "Tay sau (Cẩn thận khớp vai)", tier: "B", priority: "medium" }
    ],
    dui_truoc: [
      { name: "Bulgarian Split Squat", target: "Đùi trước & Mông", tier: "S", priority: "high" },
      { name: "Dumbbell Goblet Squat", target: "Đùi trước", tier: "A", priority: "high" },
      { name: "Bodyweight Sissy Squat", target: "Cô lập đùi trước", tier: "B", priority: "medium" }
    ],
    dui_sau_mong: [
      { name: "Dumbbell Romanian Deadlift", target: "Đùi sau & Mông", tier: "S", priority: "high" },
      { name: "Dumbbell Lunges", target: "Mông & Đùi", tier: "A", priority: "high" },
      { name: "Single-Leg Glute Bridge", target: "Mông & Đùi sau", tier: "A", priority: "low" },
      { name: "Glute Bridge (Cầu mông)", target: "Mông", tier: "B", priority: "low" },
      { name: "Dumbbell Donkey Kicks", target: "Cơ mông lớn", tier: "B", priority: "low" }
    ],
    bap_chan: [
      { name: "Single-Leg Calf Raise", target: "Bắp chân", tier: "A", priority: "low" },
      { name: "Calf Raise (Xách tạ đôi)", target: "Bắp chân", tier: "B", priority: "low" }
    ],
    bung: [
      { name: "Bicycle Crunch", target: "Cơ bụng chéo & Bụng giữa", tier: "A", priority: "low" },
      { name: "Lying Leg Raise (Nằm nhấc chân)", target: "Bụng dưới", tier: "A", priority: "low" },
      { name: "Mountain Climber", target: "Cơ lõi & Thể lực", tier: "B", priority: "low" },
      { name: "Plank", target: "Cơ bụng tĩnh", tier: "B", priority: "low" }
    ],
    cardio: [
      { name: "Burpees", target: "Cardio & Toàn thân", tier: "S", priority: "medium" },
      { "name": "Jump Rope (Nhảy dây)", target: "Cardio", tier: "S", priority: "medium" },
      { name: "Jumping Jacks", target: "Cardio", tier: "A", priority: "medium" },
      { name: "High Knees", "target": "Cardio", tier: "B", priority: "medium" }
    ]
  }
};

export const useExerciseStore = create<ExerciseStore>()(
  persist(
    (set) => ({
      library: defaultLibrary,
      addExercise: (location, muscleKey, exercise) =>
        set((state) => {
          const list = state.library[location][muscleKey] || [];
          // Avoid duplicate name
          if (list.some((e) => e.name.toLowerCase() === exercise.name.toLowerCase())) {
            return {};
          }
          return {
            library: {
              ...state.library,
              [location]: {
                ...state.library[location],
                [muscleKey]: [...list, exercise]
              }
            }
          };
        }),
      editExercise: (location, muscleKey, oldName, updated) =>
        set((state) => {
          const list = state.library[location][muscleKey] || [];
          const updatedList = list.map((e) =>
            e.name === oldName ? { ...e, ...updated } : e
          );
          return {
            library: {
              ...state.library,
              [location]: {
                ...state.library[location],
                [muscleKey]: updatedList
              }
            }
          };
        }),
      deleteExercise: (location, muscleKey, name) =>
        set((state) => {
          const list = state.library[location][muscleKey] || [];
          return {
            library: {
              ...state.library,
              [location]: {
                ...state.library[location],
                [muscleKey]: list.filter((e) => e.name !== name)
              }
            }
          };
        }),
      updateTier: (location, muscleKey, name, tier) =>
        set((state) => {
          const list = state.library[location][muscleKey] || [];
          return {
            library: {
              ...state.library,
              [location]: {
                ...state.library[location],
                [muscleKey]: list.map((e) => (e.name === name ? { ...e, tier } : e))
              }
            }
          };
        }),
      resetLibrary: () => set({ library: defaultLibrary }),
    }),
    {
      name: 'gym-slave-exercise-library-store',
    }
  )
);
