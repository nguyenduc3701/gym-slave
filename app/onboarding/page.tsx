'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';

// ── Step Definitions ───────────────────────────────────────────────────────────
type StepId =
  | 'gender'
  | 'age'
  | 'weight'
  | 'height'
  | 'targetWeight'
  | 'workoutDays'
  | 'bodyType'
  | 'location'
  | 'targetWeeks'
  | 'bodyFat'
  | 'avgCalories'
  | 'focusMuscles'
  | 'supplements'
  | 'sleep';

interface OnboardingStep {
  id: StepId;
  label: string;
  sublabel: string;
  required: boolean;
  hint: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  { id: 'gender', label: 'GIỚI TÍNH', sublabel: 'Xác định đặc tính sinh học', required: true, hint: 'TUỔI TÁC' },
  { id: 'age', label: 'TUỔI TÁC', sublabel: 'Tối ưu hóa phục hồi theo độ tuổi', required: true, hint: 'CÂN NẶNG HIỆN TẠI' },
  { id: 'weight', label: 'CÂN NẶNG HIỆN TẠI', sublabel: 'Chỉ số cân nặng hôm nay', required: true, hint: 'CHIỀU CAO' },
  { id: 'height', label: 'CHIỀU CAO', sublabel: 'Chiều cao đứng không giày', required: true, hint: 'MỤC TIÊU CÂN NẶNG' },
  { id: 'targetWeight', label: 'MỤC TIÊU CÂN NẶNG', sublabel: 'Cân nặng bạn muốn đạt tới', required: true, hint: 'TẦN SUẤT TẬP' },
  { id: 'workoutDays', label: 'TẦN SUẤT TẬP', sublabel: 'Số ngày tập luyện trong tuần', required: true, hint: 'TẠNG NGƯỜI' },
  { id: 'bodyType', label: 'TẠNG NGƯỜI', sublabel: 'Xác định tạng người qua kích cỡ cổ tay', required: true, hint: 'ĐỊA ĐIỂM TẬP LUYỆN' },
  { id: 'location', label: 'ĐỊA ĐIỂM TẬP LUYỆN', sublabel: 'Nơi thực hiện các bài tập', required: true, hint: 'THỜI HẠN MỤC TIÊU' },
  { id: 'targetWeeks', label: 'THỜI HẠN MỤC TIÊU', sublabel: 'Số tuần cam kết để đạt mục tiêu', required: true, hint: 'TỶ LỆ MỠ (TỰ CHỌN)' },
  { id: 'bodyFat', label: 'TỶ LỆ MỠ (BFR)', sublabel: 'Tỷ lệ mỡ ước lượng trong cơ thể', required: false, hint: 'CALO TRUNG BÌNH (TỰ CHỌN)' },
  { id: 'avgCalories', label: 'LƯỢNG CALO TIÊU THỤ', sublabel: 'Lượng calo trung bình ăn tuần này', required: false, hint: 'NHÓM CƠ TẬP TRUNG (TỰ CHỌN)' },
  { id: 'focusMuscles', label: 'NHÓM CƠ ƯU TIÊN', sublabel: 'Các vùng cơ bạn muốn tập trung phát triển', required: false, hint: 'DỰ PHÒNG SUPPLEMENT (TỰ CHỌN)' },
  { id: 'supplements', label: 'THỰC PHẨM BỔ SUNG', sublabel: 'Các thực phẩm bổ sung đang sử dụng', required: false, hint: 'GIẤC NGỦ (TỰ CHỌN)' },
  { id: 'sleep', label: 'GIẤC NGỦ HÀNG NGÀY', sublabel: 'Số tiếng ngủ mỗi đêm trung bình', required: false, hint: 'HOÀN THÀNH' },
];

const MUSCLE_GROUPS = [
  { id: 'nguc_tren', label: 'Ngực trên (Upper Chest)' },
  { id: 'nguc_giua_duoi', label: 'Ngực giữa & dưới (Mid/Lower Chest)' },
  { id: 'lung_xo', label: 'Lưng rộng / Xô (Lats)' },
  { id: 'lung_tren', label: 'Lưng trên / Giữa (Upper Back)' },
  { id: 'lung_duoi', label: 'Lưng dưới (Lower Back)' },
  { id: 'vai_truoc', label: 'Vai trước (Front Delts)' },
  { id: 'vai_giua', label: 'Vai giữa (Side/Lateral Delts)' },
  { id: 'vai_sau', label: 'Vai sau (Rear Delts)' },
  { id: 'tay_truoc', label: 'Tay trước (Biceps)' },
  { id: 'tay_sau', label: 'Tay sau (Triceps)' },
  { id: 'dui_truoc', label: 'Đùi trước (Quads)' },
  { id: 'dui_sau_mong', label: 'Đùi sau & Mông (Hamstrings/Glutes)' },
  { id: 'bap_chan', label: 'Bắp chân (Calves)' },
  { id: 'bung', label: 'Bụng & Cơ lõi (Abs/Core)' },
  { id: 'cardio', label: 'Cardio / Thể lực (Cardio)' },
];

const SUPPLEMENT_OPTIONS = [
  { id: 'whey', label: 'Whey Protein' },
  { id: 'creatine', label: 'Creatine' },
  { id: 'bcaa', label: 'BCAA / EAA' },
  { id: 'pre', label: 'Pre-Workout' },
  { id: 'vitamin', label: 'Vitamin / Omega 3' },
  { id: 'none', label: 'Không sử dụng' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, updateProfile } = useUserStore();
  const [hydrated, setHydrated] = useState(false);

  // ── Form State ───────────────────────────────────────────────────────────────
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(25);
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(170);
  const [targetWeight, setTargetWeight] = useState<number>(70);
  const [workoutDays, setWorkoutDays] = useState<number>(4);
  const [bodyType, setBodyType] = useState<'ectomorph' | 'mesomorph' | 'endomorph' | ''>('');
  const [trainingLocation, setTrainingLocation] = useState<'gym' | 'home'>('gym');
  const [targetWeeks, setTargetWeeks] = useState<number>(12);
  
  // Optional steps state
  const [bodyFat, setBodyFat] = useState<number>(18);
  const [avgCalories, setAvgCalories] = useState<string>('');
  const [focusMuscles, setFocusMuscles] = useState<string[]>([]);
  const [supplements, setSupplements] = useState<string[]>([]);
  const [sleepHours, setSleepHours] = useState<number>(8);

  // ── Sync with Store on mount ──────────────────────────────────────────────────
  useEffect(() => {
    setHydrated(true);
    if (profile.onboardingCompleted) {
      router.replace('/dashboard');
      return;
    }
    // Pre-populate if store has partial values
    if (profile.gender) setGender(profile.gender);
    if (profile.age) setAge(profile.age);
    if (profile.weight) setWeight(profile.weight);
    if (profile.height) setHeight(profile.height);
    if (profile.targetWeight) setTargetWeight(profile.targetWeight);
    if (profile.workoutDaysPerWeek) setWorkoutDays(profile.workoutDaysPerWeek);
    if (profile.bodyType) setBodyType(profile.bodyType);
    if (profile.trainingLocation) setTrainingLocation(profile.trainingLocation);
    if (profile.targetWeeks) setTargetWeeks(profile.targetWeeks);
    if (profile.bodyFat) setBodyFat(profile.bodyFat);
    if (profile.avgDailyCalories) setAvgCalories(profile.avgDailyCalories.toString());
    if (profile.focusMuscleGroups) setFocusMuscles(profile.focusMuscleGroups);
    if (profile.supplements) setSupplements(profile.supplements);
    if (profile.sleepHours) setSleepHours(profile.sleepHours);
  }, [profile, router]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0d0d0d' }}>
        <div className="w-8 h-8 border-4 border-t-red-600 border-r-transparent border-b-orange-500 border-l-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentStep = ONBOARDING_STEPS[currentStepIndex];
  const progressPct = ((currentStepIndex + 1) / ONBOARDING_STEPS.length) * 100;

  // ── Navigation logic ──────────────────────────────────────────────────────────
  const handleNext = () => {
    if (currentStep.id === 'bodyType' && !bodyType) {
      alert('Vui lòng chọn tạng người của bạn để tiếp tục!');
      return;
    }

    if (currentStepIndex < ONBOARDING_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleSkip = () => {
    if (!currentStep.required) {
      if (currentStep.id === 'avgCalories') setAvgCalories('');
      if (currentStep.id === 'focusMuscles') setFocusMuscles([]);
      if (currentStep.id === 'supplements') setSupplements([]);
      
      if (currentStepIndex < ONBOARDING_STEPS.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handleComplete = () => {
    // 1. BMI Calculation
    const heightInMeters = height / 100;
    const bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));

    // 2. BMR Calculation (Mifflin-St Jeor Equation)
    let bmr = 0;
    if (gender === 'male') {
      bmr = Math.round(10 * weight + 6.25 * height - 5 * age + 5);
    } else {
      bmr = Math.round(10 * weight + 6.25 * height - 5 * age - 161);
    }

    // 3. TDEE Calculation based on workout frequency
    let pal = 1.2; // Sedentary base
    if (workoutDays <= 2) {
      pal = 1.375; // Light activity
    } else if (workoutDays <= 4) {
      pal = 1.55;  // Moderate activity
    } else if (workoutDays === 5) {
      pal = 1.725; // Very active
    } else {
      pal = 1.9;   // Extra active
    }
    const tdee = Math.round(bmr * pal);

    // 4. Daily Calorie Target based on Weight Goals
    let dailyCalorieTarget = tdee;
    let goal: 'weight_loss' | 'muscle_gain' | 'general' = 'general';

    if (targetWeight < weight - 2) {
      dailyCalorieTarget = tdee - 500;
      goal = 'weight_loss';
    } else if (targetWeight > weight + 2) {
      dailyCalorieTarget = tdee + 300;
      goal = 'muscle_gain';
    }

    // Ensure target doesn't drop below safety limit
    const minCalories = gender === 'male' ? 1500 : 1200;
    if (dailyCalorieTarget < minCalories) {
      dailyCalorieTarget = minCalories;
    }

    // 5. Protein Target (g)
    // Male: 2.0g per kg bodyweight, Female: 1.6g per kg bodyweight
    const dailyProteinTarget = Math.round(weight * (gender === 'male' ? 2.0 : 1.6));

    // Save everything to store
    updateProfile({
      onboardingCompleted: true,
      gender,
      age,
      weight,
      height,
      targetWeight,
      workoutDaysPerWeek: workoutDays,
      bodyType: bodyType || 'mesomorph',
      trainingLocation,
      targetWeeks,
      bmi,
      bmr,
      tdee,
      dailyCalorieTarget,
      dailyProteinTarget,
      bodyFat: bodyFat,
      avgDailyCalories: avgCalories ? Number(avgCalories) : undefined,
      focusMuscleGroups: focusMuscles.length > 0 ? focusMuscles : undefined,
      supplements: supplements.length > 0 ? supplements : undefined,
      sleepHours: sleepHours,
      goal,
    });

    router.push('/dashboard');
  };

  const toggleMuscle = (muscle: string) => {
    setFocusMuscles((prev) =>
      prev.includes(muscle) ? prev.filter((m) => m !== muscle) : [...prev, muscle]
    );
  };

  const toggleSupplement = (sup: string) => {
    if (sup === 'none') {
      setSupplements(['none']);
      return;
    }
    setSupplements((prev) => {
      const filtered = prev.filter((s) => s !== 'none');
      return filtered.includes(sup) ? filtered.filter((s) => s !== sup) : [...filtered, sup];
    });
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#140707', color: '#ffdad8', fontFamily: 'var(--font-hanken)' }}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 md:px-12 border-b"
        style={{
          backgroundColor: 'rgba(20, 7, 7, 0.85)',
          backdropFilter: 'blur(16px)',
          borderColor: '#4e2a2a',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-anybody)',
            fontWeight: 800,
            fontSize: '20px',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
          }}
          className="gradient-text"
        >
          IRON_PULSE
        </div>
        <div
          className="flex items-center gap-2"
          style={{
            fontFamily: 'var(--font-jetbrains)',
            fontSize: '11px',
            letterSpacing: '0.1em',
            color: '#ffb3b2',
          }}
        >
          <span>BƯỚC</span>
          <span className="text-white font-bold" style={{ fontSize: '14px' }}>{currentStepIndex + 1}</span>
          <span className="opacity-50">/</span>
          <span className="opacity-50">{ONBOARDING_STEPS.length}</span>
        </div>
      </header>

      {/* ── Progress Bar ────────────────────────────────────────────────── */}
      <div className="fixed top-16 left-0 right-0 z-40 h-[3px]" style={{ backgroundColor: '#2e1414' }}>
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${progressPct}%`,
            background: 'linear-gradient(90deg, #ff003c, #fe6b00)',
            boxShadow: '0 0 10px #ff003c',
          }}
        />
      </div>

      {/* ── Main Content Area ────────────────────────────────────────────── */}
      <main className="flex-grow flex items-center justify-center pt-24 pb-32 px-4 md:px-8">
        <div className="w-full max-w-[1100px] grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left panel: Motivation */}
          <div className="hidden md:block md:col-span-5 lg:col-span-4">
            <div className="relative rounded-xl overflow-hidden aspect-[3/4]" style={{ border: '1px solid #4e2a2a' }}>
              <img
                src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop"
                alt="Gym Training Motivation"
                className="object-cover w-full h-full grayscale opacity-80"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, #140707 0%, rgba(20,7,7,0.4) 60%, transparent 100%)',
                }}
              />
              <div className="absolute bottom-8 left-6 right-6">
                <span
                  className="block mb-1"
                  style={{
                    fontFamily: 'var(--font-jetbrains)',
                    fontSize: '10px',
                    letterSpacing: '0.15em',
                    color: '#fe6b00',
                  }}
                >
                  {currentStep.required ? 'BẮT BUỘC NHẬP' : 'CÂU HỎI TỰ CHỌN'}
                </span>
                <h3 style={{ fontFamily: 'var(--font-anybody)', fontWeight: 700, fontSize: '20px', color: '#fff', textTransform: 'uppercase' }}>
                  {currentStep.label}
                </h3>
                <p className="mt-2 text-xs" style={{ color: '#e9bcba', lineHeight: 1.5 }}>
                  {currentStep.sublabel}
                </p>
              </div>
            </div>
          </div>

          {/* Right panel: Questions */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-6">
            <div className="space-y-1">
              <span className="text-xs uppercase px-2 py-0.5 rounded border border-[#ff003c] text-[#ff003c] font-semibold" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                {currentStep.required ? 'Bắt buộc' : 'Không bắt buộc'}
              </span>
              <h2
                className="pt-2"
                style={{
                  fontFamily: 'var(--font-anybody)',
                  fontWeight: 800,
                  fontSize: 'clamp(28px, 4vw, 36px)',
                  lineHeight: 1.1,
                  textTransform: 'uppercase',
                  color: '#fff',
                }}
              >
                {currentStep.label}
              </h2>
              <p style={{ color: '#e9bcba', fontSize: '15px' }}>{currentStep.sublabel}</p>
            </div>

            {/* Content Switcher */}
            <div className="py-4 min-h-[220px]">
              
              {/* STEP 1: GENDER */}
              {currentStep.id === 'gender' && (
                <div className="grid grid-cols-2 gap-4">
                  {(['male', 'female'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className="flex flex-col items-center justify-center py-8 rounded-xl border transition-all duration-300 card-glow"
                      style={{
                        backgroundColor: gender === g ? 'rgba(254,107,0,0.1)' : 'rgba(46,20,20,0.3)',
                        borderColor: gender === g ? '#fe6b00' : '#4e2a2a',
                        cursor: 'pointer',
                        color: gender === g ? '#fff' : '#ffdad8',
                      }}
                    >
                      <span className="text-4xl mb-2">{g === 'male' ? '♂' : '♀'}</span>
                      <span style={{ fontFamily: 'var(--font-jetbrains)', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase' }}>
                        {g === 'male' ? 'Nam (Male)' : 'Nữ (Female)'}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* STEP 2: AGE */}
              {currentStep.id === 'age' && (
                <div className="max-w-md space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-70">Nhập số tuổi thực tế</span>
                    <span className="text-2xl font-bold text-white font-mono">{age} tuổi</span>
                  </div>
                  <input
                    type="number"
                    min={10}
                    max={100}
                    value={age}
                    onChange={(e) => setAge(Math.max(10, Math.min(100, Number(e.target.value) || 25)))}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none transition-all"
                    style={{
                      backgroundColor: 'rgba(46,20,20,0.3)',
                      borderColor: '#4e2a2a',
                      color: '#fff',
                    }}
                  />
                  <div className="text-xs opacity-60 italic font-mono">Độ tuổi tập luyện tối ưu dao động từ 15 - 65 tuổi.</div>
                </div>
              )}

              {/* STEP 3: CURRENT WEIGHT */}
              {currentStep.id === 'weight' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <span className="text-sm opacity-70">Kéo slider hoặc điều chỉnh cân nặng</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-white font-mono">{weight}</span>
                      <span className="text-xs opacity-75 font-mono">KG</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={30}
                    max={200}
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full cursor-pointer h-2 rounded-lg appearance-none"
                    style={{
                      background: '#2e1414',
                      accentColor: '#ff003c',
                    }}
                  />
                  <div className="flex justify-between text-xs opacity-50 font-mono">
                    <span>30 KG</span>
                    <span>115 KG</span>
                    <span>200 KG</span>
                  </div>
                </div>
              )}

              {/* STEP 4: HEIGHT */}
              {currentStep.id === 'height' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <span className="text-sm opacity-70">Chiều cao đứng hiện tại của bạn</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-white font-mono">{height}</span>
                      <span className="text-xs opacity-75 font-mono">CM</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={220}
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full cursor-pointer h-2 rounded-lg appearance-none"
                    style={{
                      background: '#2e1414',
                      accentColor: '#ff003c',
                    }}
                  />
                  <div className="flex justify-between text-xs opacity-50 font-mono">
                    <span>100 CM</span>
                    <span>160 CM</span>
                    <span>220 CM</span>
                  </div>
                </div>
              )}

              {/* STEP 5: TARGET WEIGHT */}
              {currentStep.id === 'targetWeight' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <span className="text-sm opacity-70">Mục tiêu cân nặng hướng tới</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-white font-mono">{targetWeight}</span>
                      <span className="text-xs opacity-75 font-mono">KG</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={30}
                    max={200}
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(Number(e.target.value))}
                    className="w-full cursor-pointer h-2 rounded-lg appearance-none"
                    style={{
                      background: '#2e1414',
                      accentColor: '#ff003c',
                    }}
                  />
                  <div className="flex justify-between text-xs opacity-50 font-mono">
                    <span>30 KG</span>
                    <span>Cân nặng hiện tại: {weight} KG</span>
                    <span>200 KG</span>
                  </div>
                  <div className="p-3 rounded bg-red-950/20 border border-red-900/30 text-xs text-center text-[#ffb3b2]">
                    {targetWeight < weight - 2 ? 'Mục tiêu: Giảm cân / Định hình cơ bắp (Cut)' : 
                     targetWeight > weight + 2 ? 'Mục tiêu: Tăng cân / Tăng cơ nạc (Bulk)' : 
                     'Mục tiêu: Duy trì cân nặng / Tái cấu trúc cơ thể (Recomp)'}
                  </div>
                </div>
              )}

              {/* STEP 6: WORKOUT DAYS PER WEEK */}
              {currentStep.id === 'workoutDays' && (
                <div className="space-y-4">
                  <label className="text-sm opacity-70 block">Số ngày bạn có thể dành ra để tập luyện mỗi tuần</label>
                  <div className="grid grid-cols-7 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <button
                        key={day}
                        onClick={() => setWorkoutDays(day)}
                        className="py-4 rounded-xl text-lg font-bold transition-all"
                        style={{
                          backgroundColor: workoutDays === day ? '#ff003c' : 'rgba(46,20,20,0.3)',
                          border: workoutDays === day ? '1px solid #ff525c' : '1px solid #4e2a2a',
                          color: '#fff',
                          boxShadow: workoutDays === day ? '0 0 15px rgba(255, 0, 60, 0.4)' : 'none',
                          cursor: 'pointer',
                        }}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs opacity-60 text-center italic">Khuyên dùng: 3 - 5 ngày tập/tuần đối với người mới và trung cấp.</p>
                </div>
              )}

              {/* STEP 7: BODY TYPE (WITH WRIST MEASUREMENT GUIDE) */}
              {currentStep.id === 'bodyType' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-dashed border-[#fe6b00] bg-orange-950/10 space-y-2">
                    <span className="text-xs font-bold text-[#fe6b00]" style={{ fontFamily: 'var(--font-jetbrains)' }}>💡 HƯỚNG DẪN ĐO TẠNG NGƯỜI ĐƠN GIẢN:</span>
                    <p className="text-xs text-[#ffdad8] leading-relaxed">
                      Dùng <strong>ngón cái</strong> và <strong>ngón giữa</strong> của bàn tay thuận quấn quanh cổ tay của tay còn lại ở điểm nhô cao nhất (ngay khớp xương cổ tay).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      {
                        id: 'ectomorph',
                        name: 'Ectomorph (Tạng gầy)',
                        desc: 'Đầu ngón tay đè lên nhau đáng kể',
                        detail: 'Khung xương nhỏ, khó tăng cân, chuyển hóa nhanh.',
                      },
                      {
                        id: 'mesomorph',
                        name: 'Mesomorph (Cân đối)',
                        desc: 'Đầu hai ngón tay chạm khít nhau',
                        detail: 'Khung xương vừa, dễ tăng cơ giảm mỡ, thể hình lý tưởng.',
                      },
                      {
                        id: 'endomorph',
                        name: 'Endomorph (Tạng đậm)',
                        desc: 'Đầu hai ngón tay không chạm tới nhau',
                        detail: 'Khung xương to, dễ tích mỡ, chuyển hóa chậm.',
                      },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setBodyType(item.id as any)}
                        className="p-4 text-left rounded-xl border transition-all duration-300 card-glow flex flex-col justify-between"
                        style={{
                          backgroundColor: bodyType === item.id ? 'rgba(254,107,0,0.1)' : 'rgba(46,20,20,0.2)',
                          borderColor: bodyType === item.id ? '#fe6b00' : '#4e2a2a',
                          color: '#fff',
                        }}
                      >
                        <div>
                          <div className="font-bold text-sm mb-1">{item.name}</div>
                          <div className="text-[11px] text-[#fe6b00] font-medium mb-3 italic">Cách đo: {item.desc}</div>
                        </div>
                        <div className="text-[11px] text-[#e9bcba] leading-relaxed mt-2 border-t pt-2 border-[#4e2a2a]/40">
                          {item.detail}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 8: TRAINING LOCATION (NEW REQUIRED) */}
              {currentStep.id === 'location' && (
                <div className="grid grid-cols-2 gap-4">
                  {(['gym', 'home'] as const).map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setTrainingLocation(loc)}
                      className="flex flex-col items-center justify-center py-8 rounded-xl border transition-all duration-300 card-glow"
                      style={{
                        backgroundColor: trainingLocation === loc ? 'rgba(254,107,0,0.1)' : 'rgba(46,20,20,0.3)',
                        borderColor: trainingLocation === loc ? '#fe6b00' : '#4e2a2a',
                        cursor: 'pointer',
                        color: trainingLocation === loc ? '#fff' : '#ffdad8',
                      }}
                    >
                      <span className="text-4xl mb-2">{loc === 'gym' ? '🏢' : '🏠'}</span>
                      <span style={{ fontFamily: 'var(--font-jetbrains)', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase' }}>
                        {loc === 'gym' ? 'Phòng Gym' : 'Tập Tại Nhà (Home)'}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* STEP 9: TARGET DEADLINE IN WEEKS (NEW REQUIRED) */}
              {currentStep.id === 'targetWeeks' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <span className="text-sm opacity-70">Thời hạn cam kết thực hiện mục tiêu</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-white font-mono">{targetWeeks}</span>
                      <span className="text-xs opacity-75 font-mono">TUẦN</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={24}
                    step={4}
                    value={targetWeeks}
                    onChange={(e) => setTargetWeeks(Number(e.target.value))}
                    className="w-full cursor-pointer h-2 rounded-lg appearance-none"
                    style={{
                      background: '#2e1414',
                      accentColor: '#ff003c',
                    }}
                  />
                  <div className="grid grid-cols-6 text-center text-xs opacity-50 font-mono">
                    <span>4 Tuần</span>
                    <span>8 Tuần</span>
                    <span>12 Tuần</span>
                    <span>16 Tuần</span>
                    <span>20 Tuần</span>
                    <span>24 Tuần</span>
                  </div>
                  <div className="text-xs opacity-60 text-center italic mt-2">
                    Lộ trình chuẩn khoa học để thay đổi hình thể rõ rệt là 12 tuần.
                  </div>
                </div>
              )}

              {/* STEP 10: BODY FAT (OPTIONAL) */}
              {currentStep.id === 'bodyFat' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <span className="text-sm opacity-70">Ước lượng tỷ lệ mỡ cơ thể</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-white font-mono">{bodyFat}</span>
                      <span className="text-xs opacity-75 font-mono">%</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={50}
                    value={bodyFat}
                    onChange={(e) => setBodyFat(Number(e.target.value))}
                    className="w-full cursor-pointer h-2 rounded-lg appearance-none"
                    style={{
                      background: '#2e1414',
                      accentColor: '#ff003c',
                    }}
                  />
                  <div className="flex justify-between text-xs opacity-50 font-mono">
                    <span>5 %</span>
                    <span>25 %</span>
                    <span>50 %</span>
                  </div>
                </div>
              )}

              {/* STEP 11: AVERAGE CALORIES (OPTIONAL) */}
              {currentStep.id === 'avgCalories' && (
                <div className="max-w-md space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-70">Nhập lượng calo nạp vào ước tính</span>
                    <span className="text-2xl font-bold text-white font-mono">{avgCalories ? `${avgCalories} kcal` : 'Chưa thiết lập'}</span>
                  </div>
                  <input
                    type="number"
                    min={500}
                    max={6000}
                    placeholder="Ví dụ: 2200"
                    value={avgCalories}
                    onChange={(e) => setAvgCalories(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none transition-all"
                    style={{
                      backgroundColor: 'rgba(46,20,20,0.3)',
                      borderColor: '#4e2a2a',
                      color: '#fff',
                    }}
                  />
                </div>
              )}

              {/* STEP 12: FOCUS MUSCLES (OPTIONAL) */}
              {currentStep.id === 'focusMuscles' && (
                <div className="space-y-4">
                  <span className="text-sm opacity-70 block">Chọn tối đa các nhóm cơ muốn tập trung nhiều hơn (Chọn nhiều)</span>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {MUSCLE_GROUPS.map((item) => {
                      const selected = focusMuscles.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => toggleMuscle(item.id)}
                          className="py-3 px-4 rounded-xl border text-center font-semibold text-sm transition-all"
                          style={{
                            backgroundColor: selected ? 'rgba(255, 0, 60, 0.15)' : 'rgba(46,20,20,0.2)',
                            borderColor: selected ? '#ff003c' : '#4e2a2a',
                            color: selected ? '#fff' : '#ffdad8',
                            cursor: 'pointer',
                          }}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 13: SUPPLEMENTS (OPTIONAL) */}
              {currentStep.id === 'supplements' && (
                <div className="space-y-4">
                  <span className="text-sm opacity-70 block">Các chất bổ sung đang bổ trợ trong chế độ ăn hàng ngày</span>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {SUPPLEMENT_OPTIONS.map((item) => {
                      const selected = supplements.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => toggleSupplement(item.id)}
                          className="py-3 px-4 rounded-xl border text-center font-semibold text-sm transition-all"
                          style={{
                            backgroundColor: selected ? 'rgba(255, 0, 60, 0.15)' : 'rgba(46,20,20,0.2)',
                            borderColor: selected ? '#ff003c' : '#4e2a2a',
                            color: selected ? '#fff' : '#ffdad8',
                            cursor: 'pointer',
                          }}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 14: SLEEP (OPTIONAL) */}
              {currentStep.id === 'sleep' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <span className="text-sm opacity-70">Thời gian nghỉ ngơi phục hồi tối bình quân</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-white font-mono">{sleepHours}</span>
                      <span className="text-xs opacity-75 font-mono">TIẾNG</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={12}
                    value={sleepHours}
                    onChange={(e) => setSleepHours(Number(e.target.value))}
                    className="w-full cursor-pointer h-2 rounded-lg appearance-none"
                    style={{
                      background: '#2e1414',
                      accentColor: '#ff003c',
                    }}
                  />
                  <div className="flex justify-between text-xs opacity-50 font-mono">
                    <span>4 Tiếng</span>
                    <span>8 Tiếng</span>
                    <span>12 Tiếng</span>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

      {/* ── Fixed Footer Action Bar ──────────────────────────────────────── */}
      <footer
        className="fixed bottom-0 left-0 right-0 h-24 flex items-center justify-center px-6 z-50 border-t"
        style={{
          backgroundColor: 'rgba(20, 7, 7, 0.95)',
          backdropFilter: 'blur(20px)',
          borderColor: '#4e2a2a',
        }}
      >
        <div className="w-full max-w-[1100px] flex items-center justify-between">
          
          {/* Back Action */}
          <button
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2 uppercase transition-all hover:text-white disabled:opacity-30 disabled:pointer-events-none"
            style={{
              fontFamily: 'var(--font-jetbrains)',
              fontSize: '11px',
              letterSpacing: '0.1em',
              color: '#e9bcba',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ← QUAY LẠI
          </button>

          {/* Continue / Skip / Complete Action Group */}
          <div className="flex items-center gap-4">
            
            {/* Skip Option for Optional Steps */}
            {!currentStep.required && (
              <button
                onClick={handleSkip}
                className="px-6 py-3 rounded-lg border uppercase transition-all hover:bg-red-950/20 active:scale-95"
                style={{
                  borderColor: '#4e2a2a',
                  color: '#e9bcba',
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: '12px',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                }}
              >
                BỎ QUA
              </button>
            )}

            {/* Next / Submit */}
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-3 rounded-lg uppercase transition-all hover:brightness-110 active:scale-95 font-bold"
              style={{
                background: 'linear-gradient(90deg, #ff003c, #fe6b00)',
                color: '#fff',
                fontFamily: 'var(--font-jetbrains)',
                fontSize: '12px',
                letterSpacing: '0.08em',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(255,0,60,0.3)',
              }}
            >
              {currentStepIndex === ONBOARDING_STEPS.length - 1 ? 'HOÀN THÀNH ✓' : 'TIẾP TỤC →'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
