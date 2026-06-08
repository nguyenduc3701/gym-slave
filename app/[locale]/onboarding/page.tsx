'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { useUserStore } from '@/store/useUserStore';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useLocale, useTranslations } from 'next-intl';

// ── Onboarding Dictionary ──────────────────────────────────────────────────────
const ONBOARDING_I18N: Record<string, Record<string, string>> = {
  vi: {
    step: "BƯỚC",
    required: "Bắt buộc",
    requiredInput: "BẮT BUỘC NHẬP",
    optional: "Không bắt buộc",
    optionalQuestion: "CÂU HỎI TỰ CHỌN",
    back: "← QUAY LẠI",
    skip: "BỎ QUA",
    continue: "TIẾP TỤC →",
    finish: "HOÀN THÀNH ✓",
    male: "Nam (Male)",
    female: "Nữ (Female)",
    enterAge: "Nhập số tuổi thực tế",
    yearsOld: "tuổi",
    ageOptNote: "Độ tuổi tập luyện tối ưu dao động từ 15 - 65 tuổi.",
    dragWeight: "Kéo slider hoặc điều chỉnh cân nặng",
    currentHeight: "Chiều cao đứng hiện tại của bạn",
    targetWeightGoal: "Mục tiêu cân nặng hướng tới",
    currentWeightLabel: "Cân nặng hiện tại: {weight} KG",
    goalCut: "Mục tiêu: Giảm cân / Định hình cơ bắp (Cut)",
    goalBulk: "Mục tiêu: Tăng cân / Tăng cơ nạc (Bulk)",
    goalRecomp: "Mục tiêu: Duy trì cân nặng / Tái cấu trúc cơ thể (Recomp)",
    workoutDaysLabel: "Số ngày bạn có thể dành ra để tập luyện mỗi tuần",
    workoutDaysNote: "Khuyên dùng: 3 - 5 ngày tập/tuần đối với người mới và trung cấp.",
    bodyTypeGuideTitle: "💡 HƯỚNG DẪN ĐO TẠNG NGƯỜI ĐƠN GIẢN:",
    bodyTypeGuideDesc: "Dùng ngón cái và ngón giữa của bàn tay thuận quấn quanh cổ tay của tay còn lại ở điểm nhô cao nhất (ngay khớp xương cổ tay).",
    wristOverlapping: "Đầu ngón tay đè lên nhau đáng kể",
    wristTouching: "Đầu hai ngón tay chạm khít nhau",
    wristNotTouching: "Đầu hai ngón tay không chạm tới nhau",
    ectomorphDetail: "Khung xương nhỏ, khó tăng cân, chuyển hóa nhanh.",
    mesomorphDetail: "Khung xương vừa, dễ tăng cơ giảm mỡ, thể hình lý tưởng.",
    endomorphDetail: "Khung xương to, dễ tích mỡ, chuyển hóa chậm.",
    locationGym: "Phòng Gym",
    locationHome: "Tập Tại Nhà (Home)",
    commitmentLabel: "Thời hạn cam kết thực hiện mục tiêu",
    weeksUnit: "TUẦN",
    weeksLabel: "Tuần",
    commitmentNote: "Lộ trình chuẩn khoa học để thay đổi hình thể rõ rệt là 12 tuần.",
    bodyFatLabel: "Ước lượng tỷ lệ mỡ cơ thể",
    avgCalorieInputLabel: "Nhập lượng calo nạp vào ước tính",
    notSet: "Chưa thiết lập",
    caloriePlaceholder: "Ví dụ: 2200",
    focusMuscleSub: "Chọn tối đa các nhóm cơ muốn tập trung nhiều hơn (Chọn nhiều)",
    supplementsSub: "Các chất bổ sung đang bổ trợ trong chế độ ăn hàng ngày",
    sleepLabel: "Thời gian nghỉ ngơi phục hồi tối bình quân",
    hoursUnit: "TIẾNG",
    hoursLabel: "Tiếng",
    ageAlert: "Độ tuổi đăng ký tập luyện phải từ 10 đến 65 tuổi!",
    bodyTypeAlert: "Vui lòng chọn tạng người của bạn để tiếp tục!"
  },
  en: {
    step: "STEP",
    required: "Required",
    requiredInput: "REQUIRED INPUT",
    optional: "Optional",
    optionalQuestion: "OPTIONAL QUESTION",
    back: "← BACK",
    skip: "SKIP",
    continue: "CONTINUE →",
    finish: "FINISH ✓",
    male: "Male",
    female: "Female",
    enterAge: "Enter your actual age",
    yearsOld: "years old",
    ageOptNote: "Optimal training age ranges from 15 to 65 years old.",
    dragWeight: "Drag slider or adjust weight",
    currentHeight: "Your current standing height",
    targetWeightGoal: "Your target weight",
    currentWeightLabel: "Current weight: {weight} KG",
    goalCut: "Goal: Fat Loss / Definition (Cut)",
    goalBulk: "Goal: Weight Gain / Muscle Gain (Bulk)",
    goalRecomp: "Goal: Weight Maintenance / Recomposition (Recomp)",
    workoutDaysLabel: "Days you can spend training per week",
    workoutDaysNote: "Recommended: 3 - 5 training days/week for beginners & intermediates.",
    bodyTypeGuideTitle: "💡 SIMPLE BODY TYPE MEASUREMENT:",
    bodyTypeGuideDesc: "Wrap the thumb and middle finger of your dominant hand around your opposite wrist at the highest point of the joint.",
    wristOverlapping: "Fingers overlap significantly",
    wristTouching: "Fingers touch exactly",
    wristNotTouching: "Fingers do not touch",
    ectomorphDetail: "Small frame, hard gainer, fast metabolism.",
    mesomorphDetail: "Medium frame, easy muscle gain/fat loss, athletic build.",
    endomorphDetail: "Large frame, easy fat gain, slow metabolism.",
    locationGym: "Gym / Fitness Center",
    locationHome: "Home Training",
    commitmentLabel: "Goal commitment timeline",
    weeksUnit: "WEEKS",
    weeksLabel: "Weeks",
    commitmentNote: "The standard scientific timeline for visible body change is 12 weeks.",
    bodyFatLabel: "Estimated body fat percentage",
    avgCalorieInputLabel: "Enter estimated daily calorie intake",
    notSet: "Not set",
    caloriePlaceholder: "e.g., 2200",
    focusMuscleSub: "Select target muscle groups you want to prioritize (Select multiple)",
    supplementsSub: "Dietary supplements you are currently using",
    sleepLabel: "Average nightly rest/recovery time",
    hoursUnit: "HOURS",
    hoursLabel: "Hours",
    ageAlert: "Training age must be between 10 and 65 years old!",
    bodyTypeAlert: "Please select your body type to continue!"
  },
  fr: {
    step: "ÉTAPE",
    required: "Obligatoire",
    requiredInput: "REQUIS",
    optional: "Facultatif",
    optionalQuestion: "QUESTION FACULTATIVE",
    back: "← RETOUR",
    skip: "PASSER",
    continue: "CONTINUER →",
    finish: "TERMINER ✓",
    male: "Homme",
    female: "Femme",
    enterAge: "Entrez votre âge réel",
    yearsOld: "ans",
    ageOptNote: "L'âge optimal d'entraînement est de 15 à 65 ans.",
    dragWeight: "Glissez ou ajustez le poids",
    currentHeight: "Votre taille actuelle",
    targetWeightGoal: "Poids cible",
    currentWeightLabel: "Poids actuel: {weight} KG",
    goalCut: "Objectif: Perte de graisse (Cut)",
    goalBulk: "Objectif: Prise de masse (Bulk)",
    goalRecomp: "Objectif: Recomposition corporelle (Recomp)",
    workoutDaysLabel: "Jours d'entraînement par semaine",
    workoutDaysNote: "Recommandé: 3 à 5 jours/semaine pour débutants & intermédiaires.",
    bodyTypeGuideTitle: "💡 MESURE DU TYPE DE CORPS:",
    bodyTypeGuideDesc: "Enroulez le pouce et le majeur autour de votre poignet opposé à l'endroit le plus large.",
    wristOverlapping: "Les doigts se superposent",
    wristTouching: "Les doigts se touchent exactement",
    wristNotTouching: "Les doigts ne se touchent pas",
    ectomorphDetail: "Structure fine, métabolisme rapide, prise de poids difficile.",
    mesomorphDetail: "Structure moyenne, athlétique, prise de muscle facile.",
    endomorphDetail: "Structure large, métabolisme lent, prise de graisse facile.",
    locationGym: "Salle de sport",
    locationHome: "À la maison",
    commitmentLabel: "Durée d'engagement",
    weeksUnit: "SEMAINES",
    weeksLabel: "Semaines",
    commitmentNote: "Le délai standard pour un changement corporel visible est de 12 semaines.",
    bodyFatLabel: "Taux de graisse corporelle estimé",
    avgCalorieInputLabel: "Apport calorique quotidien estimé",
    notSet: "Non défini",
    caloriePlaceholder: "Ex: 2200",
    focusMuscleSub: "Sélectionnez les muscles prioritaires (Plusieurs choix possibles)",
    supplementsSub: "Compléments alimentaires utilisés",
    sleepLabel: "Temps de sommeil moyen par nuit",
    hoursUnit: "HEURES",
    hoursLabel: "Heures",
    ageAlert: "L'âge d'entraînement doit être compris entre 10 et 65 ans!",
    bodyTypeAlert: "Veuillez sélectionner votre morphologie pour continuer!"
  },
  ko: {
    step: "단계",
    required: "필수",
    requiredInput: "필수 입력사항",
    optional: "선택",
    optionalQuestion: "선택 질문",
    back: "← 뒤로 가기",
    skip: "건너뛰기",
    continue: "계속하기 →",
    finish: "완료 ✓",
    male: "남성",
    female: "여성",
    enterAge: "실제 나이 입력",
    yearsOld: "세",
    ageOptNote: "최적의 운동 연령은 15세에서 65세 사이입니다.",
    dragWeight: "슬라이더를 드래그하거나 체중을 조절하세요",
    currentHeight: "현재 신장",
    targetWeightGoal: "목표 체중",
    currentWeightLabel: "현재 체중: {weight} KG",
    goalCut: "목표: 체지방 감소 / 데피니션 (Cut)",
    goalBulk: "목표: 체중 증가 / 근육량 증가 (Bulk)",
    goalRecomp: "목표: 체중 유지 / 상승 다이어트 (Recomp)",
    workoutDaysLabel: "일주일간 운동 가능한 일수",
    workoutDaysNote: "권장사항: 초보자 및 중급자는 주 3~5일을 권장합니다.",
    bodyTypeGuideTitle: "💡 간단한 체형 자가 진단법:",
    bodyTypeGuideDesc: "한쪽 손의 엄지와 중지로 반대쪽 손목의 가장 뼈가 돌출된 부분을 감싸 봅니다.",
    wristOverlapping: "손가락 끝이 겹침",
    wristTouching: "손가락 끝이 딱 맞닿음",
    wristNotTouching: "손가락 끝이 닿지 않음",
    ectomorphDetail: "외배엽: 좁은 골격, 체중 증가가 어려움, 빠른 대사.",
    mesomorphDetail: "중배엽: 균형 잡힌 골격, 운동 효과가 빠름, 이상적 체형.",
    endomorphDetail: "내배엽: 넓은 골격, 지방 축적이 쉬움, 느린 대사.",
    locationGym: "헬스장",
    locationHome: "홈 트레이닝",
    commitmentLabel: "목표 달성 약속 기간",
    weeksUnit: "주",
    weeksLabel: "주",
    commitmentNote: "신체 변화가 눈에 띄게 나타나는 과학적인 표준 기간은 12주입니다.",
    bodyFatLabel: "예상 체지방률",
    avgCalorieInputLabel: "하루 예상 칼로리 섭취량 입력",
    notSet: "설정 안 됨",
    caloriePlaceholder: "예: 2200",
    focusMuscleSub: "더 집중하고 싶은 목표 근육 부위 선택 (다중 선택)",
    supplementsSub: "현재 섭취 중인 건강기능식품 / 보충제",
    sleepLabel: "하루 평균 수면 / 회복 시간",
    hoursUnit: "시간",
    hoursLabel: "시간",
    ageAlert: "운동 등록 연령은 10세에서 65세 사이여야 합니다!",
    bodyTypeAlert: "계속하려면 체형을 선택해 주세요!"
  },
  zh: {
    step: "步骤",
    required: "必填",
    requiredInput: "必填项目",
    optional: "选填",
    optionalQuestion: "选填问题",
    back: "← 返回",
    skip: "跳过",
    continue: "继续 →",
    finish: "完成 ✓",
    male: "男性",
    female: "女性",
    enterAge: "输入实际年龄",
    yearsOld: "岁",
    ageOptNote: "最佳运动年龄在 15 至 65 岁之间。",
    dragWeight: "拖动滑块或调整体重",
    currentHeight: "当前身高",
    targetWeightGoal: "目标体重",
    currentWeightLabel: "当前体重: {weight} KG",
    goalCut: "目标: 减脂 / 塑形 (Cut)",
    goalBulk: "目标: 增重 / 增肌 (Bulk)",
    goalRecomp: "目标: 维持体重 / 重组身体成分 (Recomp)",
    workoutDaysLabel: "每周可以进行训练的天数",
    workoutDaysNote: "推荐: 建议初学者和中级者每周训练 3 - 5 天。",
    bodyTypeGuideTitle: "💡 简易体型测量指南:",
    bodyTypeGuideDesc: "用常用手的拇指和中指环绕另一只手腕最突出的骨关节处。",
    wristOverlapping: "手指有明显重叠",
    wristTouching: "手指刚好碰到",
    wristNotTouching: "手指无法碰在一起",
    ectomorphDetail: "外胚型: 骨架小，不易增加体重，代谢快。",
    mesomorphDetail: "中胚型: 骨架适中，易增肌减脂，运动体型。",
    endomorphDetail: "内胚型: 骨架大，易堆积脂肪，代谢慢。",
    locationGym: "健身房",
    locationHome: "居家训练",
    commitmentLabel: "目标执行承诺时间",
    weeksUnit: "周",
    weeksLabel: "周",
    commitmentNote: "产生明显体型变化的标准科学周期为 12 周。",
    bodyFatLabel: "预计体脂率",
    avgCalorieInputLabel: "输入每日估计摄入热量",
    notSet: "未设置",
    caloriePlaceholder: "例如: 2200",
    focusMuscleSub: "选择想要重点加强的肌肉群 (可多选)",
    supplementsSub: "日常饮食中正在使用的营养补剂",
    sleepLabel: "平均每晚睡眠与恢复时间",
    hoursUnit: "小时",
    hoursLabel: "小时",
    ageAlert: "训练注册年龄必须在 10 至 65 岁之间！",
    bodyTypeAlert: "请选择您的体型以继续！"
  },
  ja: {
    step: "ステップ",
    required: "必須",
    requiredInput: "必須入力",
    optional: "任意",
    optionalQuestion: "任意質問",
    back: "← 戻る",
    skip: "スキップ",
    continue: "次へ →",
    finish: "完了 ✓",
    male: "男性",
    female: "女性",
    enterAge: "実年齢を入力",
    yearsOld: "歳",
    ageOptNote: "最適な運動年齢は15〜65歳です。",
    dragWeight: "スライダーをドラッグするか、体重を調整します",
    currentHeight: "現在の身長",
    targetWeightGoal: "目標体重",
    currentWeightLabel: "現在の体重: {weight} KG",
    goalCut: "目標: 減量 / 引き締め (Cut)",
    goalBulk: "目標: 増量 / バルクアップ (Bulk)",
    goalRecomp: "目標: 維持 / リコンプ (Recomp)",
    workoutDaysLabel: "週に運動できる日数",
    workoutDaysNote: "推奨: 初心者および中級者は週3〜5日を推奨します。",
    bodyTypeGuideTitle: "💡 簡単な体型測定ガイド:",
    bodyTypeGuideDesc: "利き手の親指と中指で、反対側の手首の最も骨が出っ張っている部分を囲みます。",
    wristOverlapping: "指先が重なる",
    wristTouching: "指先がちょうどくっつく",
    wristNotTouching: "指先が届かない",
    ectomorphDetail: "外胚葉型: 骨組みが小さく、太りにくい、代謝が早い。",
    mesomorphDetail: "中胚葉型: 標準的な骨組み、筋肉がつきやすく脂肪が落ちやすい。",
    endomorphDetail: "内胚葉型: 骨組みが大きく、脂肪がつきやすい、代謝が遅い。",
    locationGym: "ジム",
    locationHome: "自宅トレーニング",
    commitmentLabel: "目標コミット期間",
    weeksUnit: "週間",
    weeksLabel: "週間",
    commitmentNote: "顕著な体型変化が現れる科学的基準期間は12週間です。",
    bodyFatLabel: "推定体脂肪率",
    avgCalorieInputLabel: "一日あたりの推定摂取カロリー",
    notSet: "未設定",
    caloriePlaceholder: "例: 2200",
    focusMuscleSub: "より集中したいターゲット筋肉部位を選択 (複数可)",
    supplementsSub: "現在使用しているサプリメント",
    sleepLabel: "平均夜間睡眠・回復時間",
    hoursUnit: "時間",
    hoursLabel: "時間",
    ageAlert: "対象年齢は10歳から65歳までです！",
    bodyTypeAlert: "続けるには体型を選択してください！"
  },
  pt: {
    step: "PASSO",
    required: "Obrigatório",
    requiredInput: "CAMPO OBRIGATÓRIO",
    optional: "Opcional",
    optionalQuestion: "PERGUNTA OPCIONAL",
    back: "← VOLTAR",
    skip: "IGNORAR",
    continue: "CONTINUAR →",
    finish: "CONCLUIR ✓",
    male: "Masculino",
    female: "Feminino",
    enterAge: "Digite sua idade real",
    yearsOld: "anos",
    ageOptNote: "A idade ideal para treinar varia entre 15 e 65 anos.",
    dragWeight: "Arraste o controle ou ajuste o peso",
    currentHeight: "Sua altura atual",
    targetWeightGoal: "Meta de peso",
    currentWeightLabel: "Peso atual: {weight} KG",
    goalCut: "Meta: Perda de gordura / Definição (Cut)",
    goalBulk: "Meta: Ganho de peso / Hipertrofia (Bulk)",
    goalRecomp: "Meta: Manutenção / Recomposição Corporal (Recomp)",
    workoutDaysLabel: "Dias por semana disponíveis para treinar",
    workoutDaysNote: "Recomendado: 3 a 5 dias/semana para iniciantes e intermediários.",
    bodyTypeGuideTitle: "💡 GUIA SIMPLES DE MEDIÇÃO CORPORAL:",
    bodyTypeGuideDesc: "Envolva o polegar e o dedo médio da mão dominante ao redor do pulso oposto no ponto mais alto da articulação.",
    wristOverlapping: "Dedos se sobrepõem bastante",
    wristTouching: "Dedos se tocam exatamente",
    wristNotTouching: "Dedos não se tocam",
    ectomorphDetail: "Ectomorfo: Estrutura pequena, dificuldade para ganhar peso, metabolismo rápido.",
    mesomorphDetail: "Mesomorfo: Estrutura média, facilidade para ganhar músculo e perder gordura.",
    endomorphDetail: "Endomorfo: Estrutura grande, facilidade para acumular gordura, metabolismo lento.",
    locationGym: "Academia",
    locationHome: "Treino em Casa",
    commitmentLabel: "Tempo de compromisso com a meta",
    weeksUnit: "SEMANAS",
    weeksLabel: "Semanas",
    commitmentNote: "O prazo científico padrão para mudança corporal visível é de 12 semanas.",
    bodyFatLabel: "Percentual estimado de gordura",
    avgCalorieInputLabel: "Consumo calórico diário estimado",
    notSet: "Não definido",
    caloriePlaceholder: "Ex: 2200",
    focusMuscleSub: "Selecione os grupos musculares prioritários (Múltipla escolha)",
    supplementsSub: "Suplementos alimentares que utiliza atualmente",
    sleepLabel: "Tempo médio de sono e recuperação por noite",
    hoursUnit: "HORAS",
    hoursLabel: "Horas",
    ageAlert: "A idade de treino deve ser entre 10 e 65 anos!",
    bodyTypeAlert: "Por favor, selecione seu biotipo para continuar!"
  }
};

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
  
  const locale = useLocale();
  const t = useTranslations('onboarding');
  const tDash = useTranslations('dashboard');
  const dict = ONBOARDING_I18N[locale] || ONBOARDING_I18N.en;

  const ONBOARDING_STEPS: OnboardingStep[] = [
    { id: 'gender', label: t('steps.gender.label'), sublabel: t('steps.gender.sublabel'), required: true, hint: t('steps.age.label') },
    { id: 'age', label: t('steps.age.label'), sublabel: t('steps.age.sublabel'), required: true, hint: t('steps.weight.label') },
    { id: 'weight', label: t('steps.weight.label'), sublabel: t('steps.weight.sublabel'), required: true, hint: t('steps.height.label') },
    { id: 'height', label: t('steps.height.label'), sublabel: t('steps.height.sublabel'), required: true, hint: t('steps.targetWeight.label') },
    { id: 'targetWeight', label: t('steps.targetWeight.label'), sublabel: t('steps.targetWeight.sublabel'), required: true, hint: t('steps.workoutDays.label') },
    { id: 'workoutDays', label: t('steps.workoutDays.label'), sublabel: t('steps.workoutDays.sublabel'), required: true, hint: t('steps.bodyType.label') },
    { id: 'bodyType', label: t('steps.bodyType.label'), sublabel: t('steps.bodyType.sublabel'), required: true, hint: t('steps.location.label') },
    { id: 'location', label: t('steps.location.label'), sublabel: t('steps.location.sublabel'), required: true, hint: t('steps.targetWeeks.label') },
    { id: 'targetWeeks', label: t('steps.targetWeeks.label'), sublabel: t('steps.targetWeeks.sublabel'), required: true, hint: t('steps.bodyFat.label') },
    { id: 'bodyFat', label: t('steps.bodyFat.label'), sublabel: t('steps.bodyFat.sublabel'), required: false, hint: t('steps.avgCalories.label') },
    { id: 'avgCalories', label: t('steps.avgCalories.label'), sublabel: t('steps.avgCalories.sublabel'), required: false, hint: t('steps.focusMuscles.label') },
    { id: 'focusMuscles', label: t('steps.focusMuscles.label'), sublabel: t('steps.focusMuscles.sublabel'), required: false, hint: t('steps.supplements.label') },
    { id: 'supplements', label: t('steps.supplements.label'), sublabel: t('steps.supplements.sublabel'), required: false, hint: t('steps.sleep.label') },
    { id: 'sleep', label: t('steps.sleep.label'), sublabel: t('steps.sleep.sublabel'), required: false, hint: dict.finish },
  ];

  const dynamicMuscleGroups = [
    { id: 'nguc_tren', label: tDash('muscleUpperChest') },
    { id: 'nguc_giua_duoi', label: tDash('muscleMidLowerChest') },
    { id: 'lung_xo', label: tDash('muscleLats') },
    { id: 'lung_tren', label: tDash('muscleUpperBack') },
    { id: 'lung_duoi', label: tDash('muscleLowerBack') },
    { id: 'vai_truoc', label: tDash('muscleFrontDelts') },
    { id: 'vai_giua', label: tDash('muscleSideDelts') },
    { id: 'vai_sau', label: tDash('muscleRearDelts') },
    { id: 'tay_truoc', label: tDash('muscleBiceps') },
    { id: 'tay_sau', label: tDash('muscleTriceps') },
    { id: 'dui_truoc', label: tDash('muscleQuads') },
    { id: 'dui_sau_mong', label: tDash('muscleHamGlutes') },
    { id: 'bap_chan', label: tDash('muscleCalves') },
    { id: 'bung', label: tDash('muscleAbs') },
    { id: 'cardio', label: tDash('muscleCardio') },
  ];

  const dynamicSupplements = [
    { id: 'whey', label: 'Whey Protein' },
    { id: 'creatine', label: 'Creatine' },
    { id: 'bcaa', label: 'BCAA / EAA' },
    { id: 'pre', label: 'Pre-Workout' },
    { id: 'vitamin', label: 'Vitamin / Omega 3' },
    { id: 'none', label: locale === 'vi' ? 'Không sử dụng' : locale === 'fr' ? 'Aucun' : locale === 'ko' ? '사용 안 함' : locale === 'zh' ? '未使用' : locale === 'ja' ? '不使用' : locale === 'pt' ? 'Não utilizo' : 'None' },
  ];

  const bodyTypesList = [
    {
      id: 'ectomorph',
      name: t('bodyType.ectomorph'),
      desc: dict.wristOverlapping,
      detail: dict.ectomorphDetail,
    },
    {
      id: 'mesomorph',
      name: t('bodyType.mesomorph'),
      desc: dict.wristTouching,
      detail: dict.mesomorphDetail,
    },
    {
      id: 'endomorph',
      name: t('bodyType.endomorph'),
      desc: dict.wristNotTouching,
      detail: dict.endomorphDetail,
    },
  ];

  // ── Form State ───────────────────────────────────────────────────────────────
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(25);
  const [ageError, setAgeError] = useState<string | null>(null);
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(170);
  const [targetWeight, setTargetWeight] = useState<number>(70);
  const [workoutDays, setWorkoutDays] = useState<number>(4);
  const [bodyType, setBodyType] = useState<'ectomorph' | 'mesomorph' | 'endomorph' | ''>('mesomorph');
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
    if (currentStep.id === 'age' && (age < 10 || age > 65)) {
      alert(dict.ageAlert);
      return;
    }
    if (currentStep.id === 'bodyType' && !bodyType) {
      alert(dict.bodyTypeAlert);
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
      if (workoutDays >= 4) {
        dailyCalorieTarget = tdee + 500;
      } else {
        dailyCalorieTarget = tdee + 300;
      }
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
      customSchedule: null,
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
          GYM SLAVE
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <div
            className="flex items-center gap-2"
            style={{
              fontFamily: 'var(--font-jetbrains)',
              fontSize: '11px',
              letterSpacing: '0.1em',
              color: '#ffb3b2',
            }}
          >
            <span>{dict.step}</span>
            <span className="text-white font-bold" style={{ fontSize: '14px' }}>{currentStepIndex + 1}</span>
            <span className="opacity-50">/</span>
            <span className="opacity-50">{ONBOARDING_STEPS.length}</span>
          </div>
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
                  {currentStep.required ? dict.requiredInput : dict.optionalQuestion}
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
                {currentStep.required ? dict.required : dict.optional}
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
                        {g === 'male' ? dict.male : dict.female}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* STEP 2: AGE */}
              {currentStep.id === 'age' && (
                <div className="max-w-md space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-70">{dict.enterAge}</span>
                    <span className="text-2xl font-bold text-white font-mono">{age} {dict.yearsOld}</span>
                  </div>
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={age}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setAge(val);
                      if (val < 10) {
                        setAgeError(t('ageError.tooYoung'));
                      } else if (val > 65) {
                        setAgeError(t('ageError.tooOld'));
                      } else {
                        setAgeError(null);
                      }
                    }}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none transition-all"
                    style={{
                      backgroundColor: 'rgba(46,20,20,0.3)',
                      borderColor: ageError ? '#ff003c' : '#4e2a2a',
                      color: '#fff',
                    }}
                  />
                  {ageError && (
                    <div className="text-xs font-bold text-[#ff525c] font-mono mt-1">
                      ⚠️ {ageError}
                    </div>
                  )}
                  <div className="text-xs opacity-60 italic font-mono">{dict.ageOptNote}</div>
                </div>
              )}

              {/* STEP 3: CURRENT WEIGHT */}
              {currentStep.id === 'weight' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <span className="text-sm opacity-70">{dict.dragWeight}</span>
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
                    <span className="text-sm opacity-70">{dict.currentHeight}</span>
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
                    <span className="text-sm opacity-70">{dict.targetWeightGoal}</span>
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
                    <span>{dict.currentWeightLabel.replace('{weight}', String(weight))}</span>
                    <span>200 KG</span>
                  </div>
                  <div className="p-3 rounded bg-red-950/20 border border-red-900/30 text-xs text-center text-[#ffb3b2]">
                    {targetWeight < weight - 2 ? dict.goalCut : 
                     targetWeight > weight + 2 ? dict.goalBulk : 
                     dict.goalRecomp}
                  </div>
                </div>
              )}

              {/* STEP 6: WORKOUT DAYS PER WEEK */}
              {currentStep.id === 'workoutDays' && (
                <div className="space-y-4">
                  <label className="text-sm opacity-70 block">{dict.workoutDaysLabel}</label>
                  <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <button
                        key={day}
                        onClick={() => setWorkoutDays(day)}
                        className="py-2.5 sm:py-4 rounded-xl text-sm sm:text-lg font-bold transition-all"
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
                  <p className="text-xs opacity-60 text-center italic">{dict.workoutDaysNote}</p>
                </div>
              )}

              {/* STEP 7: BODY TYPE (WITH WRIST MEASUREMENT GUIDE) */}
              {currentStep.id === 'bodyType' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-dashed border-[#fe6b00] bg-orange-950/10 space-y-2">
                    <span className="text-xs font-bold text-[#fe6b00]" style={{ fontFamily: 'var(--font-jetbrains)' }}>{dict.bodyTypeGuideTitle}</span>
                    <p className="text-xs text-[#ffdad8] leading-relaxed">
                      {dict.bodyTypeGuideDesc}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {bodyTypesList.map((item) => {
                      const measureLabel = locale === 'vi' ? 'Cách đo: ' : locale === 'fr' ? 'Mesure : ' : locale === 'ko' ? '측정 방법: ' : locale === 'zh' ? '测量方法: ' : locale === 'ja' ? '測定方法: ' : locale === 'pt' ? 'Medição: ' : 'Measure: ';
                      return (
                        <button
                          key={item.id}
                          onClick={() => setBodyType(item.id as any)}
                          className="p-4 text-left rounded-xl border transition-all duration-300 card-glow flex flex-col justify-between"
                          style={{
                            backgroundColor: bodyType === item.id ? 'rgba(254,107,0,0.1)' : 'rgba(46,20,20,0.2)',
                            borderColor: bodyType === item.id ? '#fe6b00' : '#4e2a2a',
                            color: '#fff',
                            cursor: 'pointer',
                          }}
                        >
                          <div>
                            <div className="font-bold text-sm mb-1">{item.name}</div>
                            <div className="text-[11px] text-[#fe6b00] font-medium mb-3 italic">{measureLabel}{item.desc}</div>
                          </div>
                          <div className="text-[11px] text-[#e9bcba] leading-relaxed mt-2 border-t pt-2 border-[#4e2a2a]/40">
                            {item.detail}
                          </div>
                        </button>
                      );
                    })}
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
                        {loc === 'gym' ? dict.locationGym : dict.locationHome}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* STEP 9: TARGET DEADLINE IN WEEKS (NEW REQUIRED) */}
              {currentStep.id === 'targetWeeks' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <span className="text-sm opacity-70">{dict.commitmentLabel}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-white font-mono">{targetWeeks}</span>
                      <span className="text-xs opacity-75 font-mono">{dict.weeksUnit}</span>
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
                    <span>4 {dict.weeksLabel}</span>
                    <span>8 {dict.weeksLabel}</span>
                    <span>12 {dict.weeksLabel}</span>
                    <span>16 {dict.weeksLabel}</span>
                    <span>20 {dict.weeksLabel}</span>
                    <span>24 {dict.weeksLabel}</span>
                  </div>
                  <div className="text-xs opacity-60 text-center italic mt-2">
                    {dict.commitmentNote}
                  </div>
                </div>
              )}

              {/* STEP 10: BODY FAT (OPTIONAL) */}
              {currentStep.id === 'bodyFat' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <span className="text-sm opacity-70">{dict.bodyFatLabel}</span>
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
                    <span className="text-sm opacity-70">{dict.avgCalorieInputLabel}</span>
                    <span className="text-2xl font-bold text-white font-mono">{avgCalories ? `${avgCalories} kcal` : dict.notSet}</span>
                  </div>
                  <input
                    type="number"
                    min={500}
                    max={6000}
                    placeholder={dict.caloriePlaceholder}
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
                  <span className="text-sm opacity-70 block">{dict.focusMuscleSub}</span>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {dynamicMuscleGroups.map((item) => {
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
                  <span className="text-sm opacity-70 block">{dict.supplementsSub}</span>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {dynamicSupplements.map((item) => {
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
                    <span className="text-sm opacity-70">{dict.sleepLabel}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-white font-mono">{sleepHours}</span>
                      <span className="text-xs opacity-75 font-mono">{dict.hoursUnit}</span>
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
                    <span>4 {dict.hoursLabel}</span>
                    <span>8 {dict.hoursLabel}</span>
                    <span>12 {dict.hoursLabel}</span>
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
            {dict.back}
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
                {dict.skip}
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
              {currentStepIndex === ONBOARDING_STEPS.length - 1 ? dict.finish : dict.continue}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

