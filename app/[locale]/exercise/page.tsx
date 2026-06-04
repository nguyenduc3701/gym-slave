'use client';

import { useState, useMemo, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { TextInput, Select, Modal, Text, Badge } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch, IconInfoCircle, IconPlus, IconEdit, IconTrash, IconCheck, IconX } from '@tabler/icons-react';
import { useExerciseStore, ExerciseInfo } from '@/store/useExerciseStore';

interface ExerciseItem extends ExerciseInfo {
  muscleKey: string;
}

const localization = {
  vi: {
    title: 'Thư viện bài tập',
    subtitle: 'Khám phá kỹ thuật chuẩn và phân loại bài tập tối ưu',
    searchPlaceholder: 'Tìm kiếm bài tập...',
    allMuscles: 'Tất cả nhóm cơ',
    allTiers: 'Tất cả xếp hạng',
    gym: '🏢 Phòng Gym',
    home: '🏠 Tại Nhà',
    recommendedSets: 'Hiệp tập khuyên dùng',
    techniqueTitle: 'Hướng dẫn kỹ thuật chuyên sâu',
    techniqueBody: 'Hãy cố định khớp xương vai và giữ khuỷu tay góc chéo 45 độ so với cơ thể để tối ưu áp lực cơ bắp. Cố gắng phát lực dứt khoát và kiểm soát pha hạ tạ chậm trong khoảng 2 giây.',
    targetLabel: 'Cơ mục tiêu',
    close: 'Đóng',
    noExercises: 'Không tìm thấy bài tập nào phù hợp.',
    tierTitle: 'Xếp hạng phân loại (Tier)',
    tierDesc: 'S: Tối ưu nhất • A: Rất tốt • B: Lựa chọn thay thế tốt',
    addBtn: 'Thêm bài tập',
    editBtn: 'Chỉnh sửa',
    deleteBtn: 'Xoá bài tập',
    saveBtn: 'Lưu thay đổi',
    cancelBtn: 'Huỷ',
    confirmDelete: 'Bạn có chắc chắn muốn xoá bài tập này khỏi thư viện không?',
    addTitle: 'Thêm bài tập mới',
    nameLabel: 'Tên bài tập',
    categoryLabel: 'Nhóm cơ phân loại',
    tierLabel: 'Phân loại (Tier)',
    targetDetailedLabel: 'Cơ mục tiêu chi tiết (ví dụ: Ngực trên, Vai trước)',
    priorityLabel: 'Độ ưu tiên',
    priorityLow: 'Thấp',
    priorityMedium: 'Trung bình',
    priorityHigh: 'Cao',
    tierSLabel: 'S-Tier (Tối ưu nhất)',
    tierALabel: 'A-Tier (Rất tốt)',
    tierBLabel: 'B-Tier (Thay thế tốt)',
    tierCLabel: 'C-Tier (Phụ trợ)',
    descriptionLabel: 'Mô tả / Ghi chú (Description)',
    descriptionPlaceholder: 'Ví dụ: Tập trung siết cơ cuối động tác...',
    descriptionViewLabel: 'Mô tả / Hướng dẫn thêm',
    detailsEditBtn: 'CHI TIẾT & SỬA ➔',
  },
  en: {
    title: 'Exercise Library',
    subtitle: 'Explore standard techniques and optimal classifications',
    searchPlaceholder: 'Search exercises...',
    allMuscles: 'All Muscles',
    allTiers: 'All Tiers',
    gym: '🏢 Gym Exercises',
    home: '🏠 Home Exercises',
    recommendedSets: 'Recommended Sets',
    techniqueTitle: 'Advanced Technique Notes',
    techniqueBody: 'Keep your shoulder blades retracted and elbows at a 45-degree angle to protect your joints and maximize target muscle tension. Focus on controlled eccentric phase (2 seconds down).',
    targetLabel: 'Target Muscle',
    close: 'Close',
    noExercises: 'No matching exercises found.',
    tierTitle: 'Tier Classifications',
    tierDesc: 'S: Optimal / King • A: Highly Effective • B: Good Alternative',
    addBtn: 'Add Exercise',
    editBtn: 'Edit',
    deleteBtn: 'Delete Exercise',
    saveBtn: 'Save Changes',
    cancelBtn: 'Cancel',
    confirmDelete: 'Are you sure you want to delete this exercise from the library?',
    addTitle: 'Add New Exercise',
    nameLabel: 'Exercise Name',
    categoryLabel: 'Muscle Group Category',
    tierLabel: 'Tier Classifications',
    targetDetailedLabel: 'Detailed Target Muscle (e.g. Upper Chest, Side Delts)',
    priorityLabel: 'Priority',
    priorityLow: 'Low',
    priorityMedium: 'Medium',
    priorityHigh: 'High',
    tierSLabel: 'S-Tier (Optimal)',
    tierALabel: 'A-Tier (Great)',
    tierBLabel: 'B-Tier (Good Alternative)',
    tierCLabel: 'C-Tier (Accessory)',
    descriptionLabel: 'Description / Notes',
    descriptionPlaceholder: 'e.g. Focus on squeezing at the end...',
    descriptionViewLabel: 'Description / Additional Guide',
    detailsEditBtn: 'DETAILS & EDIT ➔',
  },
  fr: {
    title: 'Bibliothèque d\'exercices',
    subtitle: 'Explorez les techniques et les classifications optimales',
    searchPlaceholder: 'Rechercher...',
    allMuscles: 'Tous les muscles',
    allTiers: 'Tous les Tiers',
    gym: '🏢 Salle de sport',
    home: '🏠 À la maison',
    recommendedSets: 'Séries recommandées',
    techniqueTitle: 'Notes techniques avancées',
    techniqueBody: 'Gardez les omoplates rétractées et les coudes à 45 degrés pour maximiser la tension musculaire. Contrôlez la phase excentrique.',
    targetLabel: 'Muscle ciblé',
    close: 'Fermer',
    noExercises: 'Aucun exercice trouvé.',
    tierTitle: 'Classifications Tiers',
    tierDesc: 'S: Optimal • A: Très efficace • B: Bonne alternative',
    addBtn: 'Ajouter un exercice',
    editBtn: 'Modifier',
    deleteBtn: 'Supprimer',
    saveBtn: 'Enregistrer',
    cancelBtn: 'Annuler',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer cet exercice?',
    addTitle: 'Ajouter un nouvel exercice',
    nameLabel: 'Nom de l\'exercice',
    categoryLabel: 'Groupe musculaire',
    tierLabel: 'Tier',
    targetDetailedLabel: 'Muscle ciblé en détail',
    priorityLabel: 'Priorité',
    priorityLow: 'Faible',
    priorityMedium: 'Moyenne',
    priorityHigh: 'Élevée',
    tierSLabel: 'S-Tier (Optimal)',
    tierALabel: 'A-Tier (Très bien)',
    tierBLabel: 'B-Tier (Bonne alternative)',
    tierCLabel: 'C-Tier (Accessoire)',
    descriptionLabel: 'Description / Notes',
    descriptionPlaceholder: 'ex: Concentrez-vous sur la contraction...',
    descriptionViewLabel: 'Description / Guide supplémentaire',
    detailsEditBtn: 'DÉTAILS & MODIFIER ➔',
  },
  ko: {
    title: '운동 라이브러리',
    subtitle: '표준 기법 및 최적 분류 탐색',
    searchPlaceholder: '운동 검색...',
    allMuscles: '모든 근육 그룹',
    allTiers: '모든 등급',
    gym: '🏢 헬스장 운동',
    home: '🏠 홈 트레이닝',
    recommendedSets: '권장 세트 수',
    techniqueTitle: '고급 기술 주의사항',
    techniqueBody: '어깨뼈를 후인하고 팔꿈치를 45도 각도로 유지하여 타겟 근육의 긴장을 극대화하세요. 2초 동안 템포를 조절하여 내리세요.',
    targetLabel: '타겟 부위',
    close: '닫기',
    noExercises: '일치하는 운동이 없습니다.',
    tierTitle: '등급 분류',
    tierDesc: 'S: 최적/필수 • A: 매우 효과적 • B: 좋은 대체제',
    addBtn: '운동 추가',
    editBtn: '수정',
    deleteBtn: '운동 삭제',
    saveBtn: '변경사항 저장',
    cancelBtn: '취소',
    confirmDelete: '이 운동을 라이브러리에서 삭제하시겠습니까?',
    addTitle: '새 운동 추가',
    nameLabel: '운동 이름',
    categoryLabel: '근육 부류',
    tierLabel: '등급 (Tier)',
    targetDetailedLabel: '세부 타겟 근육',
    priorityLabel: '우선순위',
    priorityLow: '낮음',
    priorityMedium: '보통',
    priorityHigh: '높음',
    tierSLabel: 'S-Tier (최적)',
    tierALabel: 'A-Tier (우수)',
    tierBLabel: 'B-Tier (좋은 대안)',
    tierCLabel: 'C-Tier (보조)',
    descriptionLabel: '설명 / 참고',
    descriptionPlaceholder: '예: 동작의 끝에서 근육을 쥐어짜는 것에 집중...',
    descriptionViewLabel: '설명 / 추가 가이드',
    detailsEditBtn: '자세히 및 수정 ➔',
  },
  zh: {
    title: '动作库',
    subtitle: '探索标准动作与分类推荐',
    searchPlaceholder: '搜索训练动作...',
    allMuscles: '所有肌群',
    allTiers: '所有级别',
    gym: '🏢 健身房动作',
    home: '🏠 居家自重/哑铃',
    recommendedSets: '推荐组数',
    techniqueTitle: '专业动作要领',
    techniqueBody: '保持肩胛骨收紧，手肘与身体呈45度夹角以保护关节并最大化目标肌肉受力。着重控制离心收缩（慢下2秒）。',
    targetLabel: '目标肌群',
    close: '关闭',
    noExercises: '没有找到符合条件的动作。',
    tierTitle: '动作分级',
    tierDesc: 'S: 动作推荐 • A: 高效训练 • B: 良好替代',
    addBtn: '添加动作',
    editBtn: '编辑',
    deleteBtn: '删除动作',
    saveBtn: '保存修改',
    cancelBtn: '取消',
    confirmDelete: '确定要从动作库中删除该动作吗？',
    addTitle: '添加新动作',
    nameLabel: '动作名称',
    categoryLabel: '所属肌群分类',
    tierLabel: '动作分级',
    targetDetailedLabel: '详细目标肌肉',
    priorityLabel: '优先级',
    priorityLow: '低',
    priorityMedium: '中',
    priorityHigh: '高',
    tierSLabel: 'S-Tier (最优)',
    tierALabel: 'A-Tier (优秀)',
    tierBLabel: 'B-Tier (良好替代)',
    tierCLabel: 'C-Tier (辅助)',
    descriptionLabel: '描述 / 备注',
    descriptionPlaceholder: '例如：在动作的最后集中挤压肌肉...',
    descriptionViewLabel: '描述 / 额外指南',
    detailsEditBtn: '详情与编辑 ➔',
  },
  ja: {
    title: 'エクササイズライブラリ',
    subtitle: '標準的なフォームと最適な分類의 확인',
    searchPlaceholder: 'エクササイズを検索...',
    allMuscles: 'すべての部位',
    allTiers: 'すべてのティア',
    gym: '🏢 ジムトレーニング',
    home: '🏠 自宅トレーニング',
    recommendedSets: '推奨セット数',
    techniqueTitle: '詳細なフォーム解説',
    techniqueBody: '肩甲骨を寄せて固定し、肘を体に対して45度の角度に保ちます。負荷をコントロールしながら、2秒かけて下ろします。',
    targetLabel: '対象部位',
    close: '閉じる',
    noExercises: '一致するエクササイズが見つかりません。',
    tierTitle: 'ティア分類',
    tierDesc: 'S: 最適 • A: 非常に効果的 • B: 良い代替案',
    addBtn: 'エクササイズ追加',
    editBtn: '編集',
    deleteBtn: '削除',
    saveBtn: '変更を保存',
    cancelBtn: 'キャンセル',
    confirmDelete: 'このエクササイズを削除してもよろしいですか？',
    addTitle: '新しいエクササイズを追加',
    nameLabel: 'エクササイズ名',
    categoryLabel: '対象部位カテゴリ',
    tierLabel: 'ティア分類',
    targetDetailedLabel: '詳細なターゲット部位',
    priorityLabel: '優先度',
    priorityLow: '低',
    priorityMedium: '中',
    priorityHigh: '高',
    tierSLabel: 'S-Tier (最適)',
    tierALabel: 'A-Tier (素晴らしい)',
    tierBLabel: 'B-Tier (良い代替)',
    tierCLabel: 'C-Tier (補助)',
    descriptionLabel: '説明 / メモ',
    descriptionPlaceholder: '例: 動作の最後に筋肉を収縮させることに集中...',
    descriptionViewLabel: '説明 / 追加ガイド',
    detailsEditBtn: '詳細と編集 ➔',
  },
  pt: {
    title: 'Biblioteca de Exercícios',
    subtitle: 'Explore técnicas padrão e classificações ideais',
    searchPlaceholder: 'Buscar exercícios...',
    allMuscles: 'Todos os músculos',
    allTiers: 'Todos os Tiers',
    gym: '🏢 Academia',
    home: '🏠 Em Casa',
    recommendedSets: 'Séries recomendadas',
    techniqueTitle: 'Notas Técnicas Avançadas',
    techniqueBody: 'Mantenha as escápulas retraídas e os cotovelos a 45 graus para maximizar a tensão no músculo alvo. Controle a fase excêntrica (2 segundos de descida).',
    targetLabel: 'Músculo Alvo',
    close: 'Fechar',
    noExercises: 'Nenhum exercício encontrado.',
    tierTitle: 'Classificações de Tier',
    tierDesc: 'S: Excelente • A: Muito Eficiente • B: Boa Alternativa',
    addBtn: 'Adicionar Exercício',
    editBtn: 'Editar',
    deleteBtn: 'Excluir Exercício',
    saveBtn: 'Salvar Alterações',
    cancelBtn: 'Cancelar',
    confirmDelete: 'Tem certeza de que deseja excluir este exercício da biblioteca?',
    addTitle: 'Adicionar Novo Exercício',
    nameLabel: 'Nome do Exercício',
    categoryLabel: 'Categoria de Músculo',
    tierLabel: 'Classificação Tier',
    targetDetailedLabel: 'Músculo Alvo Detalhado',
    priorityLabel: 'Prioridade',
    priorityLow: 'Baixa',
    priorityMedium: 'Média',
    priorityHigh: 'Alta',
    tierSLabel: 'S-Tier (Ideal)',
    tierALabel: 'A-Tier (Ótimo)',
    tierBLabel: 'B-Tier (Boa Alternativa)',
    tierCLabel: 'C-Tier (Acessório)',
    descriptionLabel: 'Descrição / Notas',
    descriptionPlaceholder: 'ex. Concentre-se em contrair o músculo no final...',
    descriptionViewLabel: 'Descrição / Guia Adicional',
    detailsEditBtn: 'DETALHES E EDITAR ➔',
  }
};

const getLocalizedMuscleGroup = (muscleKey: string, locale: string) => {
  const map: Record<string, Record<string, string>> = {
    vi: {
      nguc_tren: 'Ngực trên',
      nguc_giua_duoi: 'Ngực giữa & dưới',
      lung_xo: 'Lưng xô',
      lung_tren: 'Lưng trên',
      lung_duoi: 'Lưng dưới',
      vai_truoc: 'Vai trước',
      vai_giua: 'Vai giữa',
      vai_sau: 'Vai sau',
      tay_truoc: 'Tay trước',
      tay_sau: 'Tay sau',
      dui_truoc: 'Đùi trước',
      dui_sau_mong: 'Đùi sau & Mông',
      bap_chan: 'Bắp chân',
      bung: 'Bụng',
      cardio: 'Thể lực / Cardio',
    },
    en: {
      nguc_tren: 'Upper Chest',
      nguc_giua_duoi: 'Mid/Lower Chest',
      lung_xo: 'Lats & Mid Back',
      lung_tren: 'Upper Back',
      lung_duoi: 'Lower Back',
      vai_truoc: 'Front Delts',
      vai_giua: 'Side Delts',
      vai_sau: 'Rear Delts',
      tay_truoc: 'Biceps',
      tay_sau: 'Triceps',
      dui_truoc: 'Quads',
      dui_sau_mong: 'Hamstrings & Glutes',
      bap_chan: 'Calves',
      bung: 'Abs & Core',
      cardio: 'Cardio & Conditioning',
    }
  };

  const translations = map[locale] || map.en;
  return translations[muscleKey] || muscleKey;
};

export default function ExercisePage() {
  const locale = useLocale();
  const strings = localization[locale as keyof typeof localization] || localization.en;

  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true);
  }, []);

  const { library, addExercise, editExercise, deleteExercise } = useExerciseStore();

  const [activeLocation, setActiveLocation] = useState<'gym' | 'home'>('gym');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');

  // Modal disclosures
  const [opened, { open, close }] = useDisclosure(false);
  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false);

  // Selected exercise detail / edit state
  const [selectedExercise, setSelectedExercise] = useState<ExerciseItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit inputs
  const [editName, setEditName] = useState('');
  const [editTarget, setEditTarget] = useState('');
  const [editTier, setEditTier] = useState<'S' | 'A' | 'B' | 'C'>('B');
  const [editPriority, setEditPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [editDescription, setEditDescription] = useState('');

  // Add form inputs
  const [newName, setNewName] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newMuscleKey, setNewMuscleKey] = useState('nguc_tren');
  const [newTier, setNewTier] = useState<'S' | 'A' | 'B' | 'C'>('B');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newDescription, setNewDescription] = useState('');

  // Flatten the exercise database into a list of queryable exercise objects
  const allExercises = useMemo(() => {
    if (!isHydrated) return [];
    const db = library[activeLocation] || {};
    const list: ExerciseItem[] = [];

    Object.entries(db).forEach(([muscleKey, exercises]) => {
      exercises.forEach((ex) => {
        list.push({
          ...ex,
          muscleKey,
        });
      });
    });

    return list;
  }, [library, activeLocation, isHydrated]);

  // Filter and sort exercises by query, target muscle, tier, and priority
  const filteredExercises = useMemo(() => {
    const list = allExercises.filter((ex) => {
      const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.target.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMuscle = selectedMuscle === 'all' || ex.muscleKey === selectedMuscle;
      const matchesTier = selectedTier === 'all' || ex.tier === selectedTier;

      return matchesSearch && matchesMuscle && matchesTier;
    });

    const tierOrder = { S: 1, A: 2, B: 3, C: 4 };
    const priorityMap = { high: 3, medium: 2, low: 1 };

    return list.sort((x, y) => {
      const tierDiff = (tierOrder[x.tier] || 5) - (tierOrder[y.tier] || 5);
      if (tierDiff !== 0) return tierDiff;
      const px = x.priority ? (priorityMap[x.priority] || 0) : 0;
      const py = y.priority ? (priorityMap[y.priority] || 0) : 0;
      return py - px; // Higher priority first
    });
  }, [allExercises, searchQuery, selectedMuscle, selectedTier]);

  // Generate selector lists
  const muscleGroupsList = useMemo(() => {
    const db = library[activeLocation] || {};
    return [
      { value: 'all', label: strings.allMuscles },
      ...Object.keys(db).map((key) => ({
        value: key,
        label: getLocalizedMuscleGroup(key, locale),
      })),
    ];
  }, [library, activeLocation, locale, strings]);

  const addMuscleGroupsList = useMemo(() => {
    const db = library[activeLocation] || {};
    return Object.keys(db).map((key) => ({
      value: key,
      label: getLocalizedMuscleGroup(key, locale),
    }));
  }, [library, activeLocation, locale]);

  const tiersList = [
    { value: 'all', label: strings.allTiers },
    { value: 'S', label: strings.tierSLabel },
    { value: 'A', label: strings.tierALabel },
    { value: 'B', label: strings.tierBLabel },
    { value: 'C', label: strings.tierCLabel },
  ];

  const handleOpenDetails = (ex: ExerciseItem) => {
    setSelectedExercise(ex);
    setEditName(ex.name);
    setEditTarget(ex.target);
    setEditTier(ex.tier);
    setEditPriority(ex.priority || 'medium');
    setEditDescription(ex.description || '');
    setIsEditing(false);
    open();
  };

  const handleSaveEdit = () => {
    if (!selectedExercise || !editName.trim() || !editTarget.trim()) return;
    editExercise(activeLocation, selectedExercise.muscleKey, selectedExercise.name, {
      name: editName.trim(),
      target: editTarget.trim(),
      tier: editTier,
      priority: editPriority,
      description: editDescription.trim(),
    });
    
    // Update local state in modal
    setSelectedExercise({
      ...selectedExercise,
      name: editName.trim(),
      target: editTarget.trim(),
      tier: editTier,
      priority: editPriority,
      description: editDescription.trim(),
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!selectedExercise) return;
    if (confirm(strings.confirmDelete)) {
      deleteExercise(activeLocation, selectedExercise.muscleKey, selectedExercise.name);
      close();
    }
  };

  const handleAddSubmit = () => {
    if (!newName.trim()) return;
    const targetVal = getLocalizedMuscleGroup(newMuscleKey, 'vi');
    addExercise(activeLocation, newMuscleKey, {
      name: newName.trim(),
      target: targetVal,
      tier: newTier,
      priority: newPriority,
      description: newDescription.trim(),
    });
    
    // Reset Form
    setNewName('');
    setNewTarget('');
    setNewTier('B');
    setNewPriority('medium');
    setNewDescription('');
    closeAdd();
  };

  const renderTierBadge = (tier: 'S' | 'A' | 'B' | 'C') => {
    const styles = {
      S: { bg: 'rgba(255, 0, 60, 0.15)', border: '#ff003c', color: '#ff525c' },
      A: { bg: 'rgba(254, 107, 0, 0.15)', border: '#fe6b00', color: '#ffb693' },
      B: { bg: 'rgba(108, 215, 216, 0.15)', border: '#6cd7d8', color: '#6cd7d8' },
      C: { bg: 'rgba(150, 150, 150, 0.15)', border: '#9e9e9e', color: '#cccccc' },
    }[tier];

    return (
      <Badge
        variant="outline"
        size="xs"
        style={{
          backgroundColor: styles.bg,
          borderColor: styles.border,
          color: styles.color,
          fontFamily: 'var(--font-jetbrains)',
          fontWeight: 700,
        }}
      >
        {tier}-TIER
      </Badge>
    );
  };

  const renderPriorityBadge = (priority?: 'low' | 'medium' | 'high') => {
    const p = priority || 'medium';
    const styles = {
      low: { bg: 'rgba(255, 255, 255, 0.06)', border: 'rgba(255, 255, 255, 0.15)', color: '#af8786', label: strings.priorityLow },
      medium: { bg: 'rgba(108, 215, 216, 0.1)', border: '#6cd7d8', color: '#6cd7d8', label: strings.priorityMedium },
      high: { bg: 'rgba(254, 107, 0, 0.1)', border: '#fe6b00', color: '#ffb693', label: strings.priorityHigh },
    }[p];

    return (
      <Badge
        variant="outline"
        size="xs"
        style={{
          backgroundColor: styles.bg,
          borderColor: styles.border,
          color: styles.color,
          fontSize: '9px',
          fontWeight: 600,
        }}
      >
        {styles.label}
      </Badge>
    );
  };

  if (!isHydrated) return null;

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-10">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <Text
            className="label-caps"
            style={{
              color: '#ff003c',
              fontSize: '11px',
              fontFamily: 'var(--font-jetbrains)',
              letterSpacing: '0.12em',
            }}
          >
            GYM SLAVE DATABASE
          </Text>
          <h1
            style={{
              fontFamily: 'var(--font-anybody)',
              fontSize: '32px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              color: '#fff',
              marginTop: '4px',
            }}
          >
            {strings.title}
          </h1>
          <p className="text-xs opacity-75 mt-1" style={{ color: '#ffdad8' }}>
            {strings.subtitle}
          </p>
        </div>

        {/* Action Button & Switcher group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Add Exercise Button */}
          <button
            onClick={() => {
              if (addMuscleGroupsList.length > 0) {
                setNewMuscleKey(addMuscleGroupsList[0].value);
              }
              openAdd();
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 text-white"
            style={{
              background: 'linear-gradient(135deg, #bf002a, #fe6b00)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <IconPlus size={15} />
            {strings.addBtn}
          </button>

          {/* Location Switcher */}
          <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <button
              onClick={() => {
                setActiveLocation('gym');
                setSelectedMuscle('all');
              }}
              className="px-4 py-2 rounded-lg text-xs font-bold transition-all"
              style={{
                backgroundColor: activeLocation === 'gym' ? 'rgba(255, 0, 60, 0.15)' : 'transparent',
                color: activeLocation === 'gym' ? '#ff525c' : '#a78584',
                border: activeLocation === 'gym' ? '1px solid rgba(255, 0, 60, 0.25)' : '1px solid transparent',
                cursor: 'pointer',
              }}
            >
              {strings.gym}
            </button>
            <button
              onClick={() => {
                setActiveLocation('home');
                setSelectedMuscle('all');
              }}
              className="px-4 py-2 rounded-lg text-xs font-bold transition-all"
              style={{
                backgroundColor: activeLocation === 'home' ? 'rgba(254, 107, 0, 0.15)' : 'transparent',
                color: activeLocation === 'home' ? '#ffb693' : '#a78584',
                border: activeLocation === 'home' ? '1px solid rgba(254, 107, 0, 0.25)' : '1px solid transparent',
                cursor: 'pointer',
              }}
            >
              {strings.home}
            </button>
          </div>
        </div>
      </div>

      {/* Info Banner about Tiers */}
      <div
        className="flex items-center gap-3 p-4 rounded-xl border"
        style={{
          backgroundColor: 'rgba(108, 215, 216, 0.03)',
          borderColor: 'rgba(108, 215, 216, 0.1)',
        }}
      >
        <IconInfoCircle size={18} color="#6cd7d8" />
        <div className="text-xs">
          <span className="font-bold text-[#6cd7d8] uppercase tracking-wider block mb-0.5" style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '10px' }}>
            {strings.tierTitle}
          </span>
          <span style={{ color: '#ffdad8', opacity: 0.8 }}>
            {strings.tierDesc}
          </span>
        </div>
      </div>

      {/* Filters & Search Control bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search */}
        <div className="md:col-span-6">
          <TextInput
            placeholder={strings.searchPlaceholder}
            leftSection={<IconSearch size={16} color="#af8786" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            styles={{
              input: {
                backgroundColor: 'rgba(46, 20, 20, 0.2)',
                borderColor: '#4e2a2a',
                color: '#ffdad8',
                height: '42px',
                borderRadius: '10px',
              },
            }}
          />
        </div>

        {/* Muscle Filter */}
        <div className="md:col-span-3">
          <Select
            value={selectedMuscle}
            onChange={(val) => setSelectedMuscle(val || 'all')}
            data={muscleGroupsList}
            styles={{
              input: {
                backgroundColor: 'rgba(46, 20, 20, 0.2)',
                borderColor: '#4e2a2a',
                color: '#ffdad8',
                height: '42px',
                borderRadius: '10px',
              },
              dropdown: {
                backgroundColor: '#140707',
                borderColor: '#4e2a2a',
              },
              option: {
                color: '#ffdad8',
                '&[data-selected]': {
                  backgroundColor: '#ff003c',
                  color: '#fff',
                },
                '&:hover': {
                  backgroundColor: 'rgba(78, 42, 42, 0.3)',
                },
              },
            }}
          />
        </div>

        {/* Tier Filter */}
        <div className="md:col-span-3">
          <Select
            value={selectedTier}
            onChange={(val) => setSelectedTier(val || 'all')}
            data={tiersList}
            styles={{
              input: {
                backgroundColor: 'rgba(46, 20, 20, 0.2)',
                borderColor: '#4e2a2a',
                color: '#ffdad8',
                height: '42px',
                borderRadius: '10px',
              },
              dropdown: {
                backgroundColor: '#140707',
                borderColor: '#4e2a2a',
              },
              option: {
                color: '#ffdad8',
                '&[data-selected]': {
                  backgroundColor: '#ff003c',
                  color: '#fff',
                },
                '&:hover': {
                  backgroundColor: 'rgba(78, 42, 42, 0.3)',
                },
              },
            }}
          />
        </div>
      </div>

      {/* Grid List of Exercises */}
      {filteredExercises.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-dashed border-[#4e2a2a]/60">
          <p className="text-sm opacity-60" style={{ color: '#ffdad8' }}>{strings.noExercises}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map((ex, idx) => (
            <div
              key={`${ex.name}-${idx}`}
              onClick={() => handleOpenDetails(ex)}
              className="group p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.01] hover:bg-[#220d0d] cursor-pointer flex flex-col justify-between"
              style={{
                backgroundColor: 'rgba(46, 20, 20, 0.15)',
                borderColor: '#4e2a2a',
              }}
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span
                    className="px-2 py-0.5 rounded text-[9px] font-bold"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#af8786',
                      fontFamily: 'var(--font-jetbrains)',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {getLocalizedMuscleGroup(ex.muscleKey, locale)}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {renderPriorityBadge(ex.priority)}
                    {renderTierBadge(ex.tier)}
                  </div>
                </div>

                <h3
                  className="group-hover:text-white transition-colors"
                  style={{
                    fontFamily: 'var(--font-hanken)',
                    fontWeight: 700,
                    fontSize: '17px',
                    color: '#ffdad8',
                    lineHeight: 1.25,
                  }}
                >
                  {ex.name}
                </h3>

                <p className="text-[12px] opacity-70 mt-2">
                  <span className="opacity-60">{strings.targetLabel}:</span>{' '}
                  <span className="font-semibold" style={{ color: '#ffb3b2' }}>{ex.target}</span>
                </p>
              </div>

              <div className="flex items-center justify-between mt-5 pt-3 border-t border-white/[0.04] text-[11px] font-mono text-[#a78584]">
                <span>{strings.recommendedSets}: 4 Sets</span>
                <span className="group-hover:text-[#ff003c] transition-colors flex items-center gap-1 font-bold uppercase">
                  {strings.detailsEditBtn}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Exercise Modal */}
      <Modal
        opened={addOpened}
        onClose={closeAdd}
        title={strings.addTitle}
        centered
        overlayProps={{
          backgroundOpacity: 0.65,
          blur: 10,
        }}
        styles={{
          content: {
            backgroundColor: '#140707',
            color: '#ffdad8',
            border: '1px solid #4e2a2a',
            borderRadius: '20px',
            padding: '8px',
          },
          header: {
            backgroundColor: '#140707',
            borderBottom: '1px solid rgba(78, 42, 42, 0.4)',
            paddingBottom: '16px',
            color: '#fff',
          },
          title: {
            fontFamily: 'var(--font-anybody)',
            fontWeight: 800,
            fontSize: '20px',
          },
        }}
      >
        <div className="space-y-4 pt-4">
          <TextInput
            label={strings.nameLabel}
            placeholder="e.g. Incline DB Bench Press"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            withAsterisk
            styles={{
              input: { backgroundColor: 'rgba(46, 20, 20, 0.3)', borderColor: '#4e2a2a', color: '#fff' },
              label: { color: '#ffdad8', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }
            }}
          />

          <Select
            label={strings.categoryLabel}
            value={newMuscleKey}
            onChange={(val) => setNewMuscleKey(val || 'nguc_tren')}
            data={addMuscleGroupsList}
            required
            withAsterisk
            styles={{
              input: { backgroundColor: 'rgba(46, 20, 20, 0.3)', borderColor: '#4e2a2a', color: '#fff' },
              label: { color: '#ffdad8', fontSize: '12px', fontWeight: 600, marginBottom: '4px' },
              dropdown: { backgroundColor: '#140707', borderColor: '#4e2a2a' },
              option: { color: '#ffdad8', '&[data-selected]': { backgroundColor: '#ff003c' } }
            }}
          />

          <TextInput
            label={strings.descriptionLabel}
            placeholder={strings.descriptionPlaceholder}
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            styles={{
              input: { backgroundColor: 'rgba(46, 20, 20, 0.3)', borderColor: '#4e2a2a', color: '#fff' },
              label: { color: '#ffdad8', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }
            }}
          />

          <Select
            label={strings.tierLabel}
            value={newTier}
            onChange={(val) => setNewTier((val as 'S' | 'A' | 'B' | 'C') || 'B')}
            data={[
              { value: 'S', label: strings.tierSLabel },
              { value: 'A', label: strings.tierALabel },
              { value: 'B', label: strings.tierBLabel },
              { value: 'C', label: strings.tierCLabel },
            ]}
            required
            withAsterisk
            styles={{
              input: { backgroundColor: 'rgba(46, 20, 20, 0.3)', borderColor: '#4e2a2a', color: '#fff' },
              label: { color: '#ffdad8', fontSize: '12px', fontWeight: 600, marginBottom: '4px' },
              dropdown: { backgroundColor: '#140707', borderColor: '#4e2a2a' },
              option: { color: '#ffdad8', '&[data-selected]': { backgroundColor: '#ff003c' } }
            }}
          />

          <Select
            label={strings.priorityLabel}
            value={newPriority}
            onChange={(val) => setNewPriority((val as 'low' | 'medium' | 'high') || 'medium')}
            data={[
              { value: 'low', label: strings.priorityLow },
              { value: 'medium', label: strings.priorityMedium },
              { value: 'high', label: strings.priorityHigh },
            ]}
            required
            withAsterisk
            styles={{
              input: { backgroundColor: 'rgba(46, 20, 20, 0.3)', borderColor: '#4e2a2a', color: '#fff' },
              label: { color: '#ffdad8', fontSize: '12px', fontWeight: 600, marginBottom: '4px' },
              dropdown: { backgroundColor: '#140707', borderColor: '#4e2a2a' },
              option: { color: '#ffdad8', '&[data-selected]': { backgroundColor: '#ff003c' } }
            }}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.04]">
            <button
              onClick={closeAdd}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              {strings.cancelBtn}
            </button>
            <button
              onClick={handleAddSubmit}
              disabled={!newName.trim()}
              className="px-5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 text-white"
              style={{
                background: 'linear-gradient(135deg, #bf002a, #fe6b00)',
                border: 'none',
                opacity: (!newName.trim()) ? 0.5 : 1,
                cursor: (!newName.trim()) ? 'not-allowed' : 'pointer'
              }}
            >
              {strings.addBtn}
            </button>
          </div>
        </div>
      </Modal>

      {/* Detail / Edit Modal popup */}
      <Modal
        opened={opened}
        onClose={close}
        title={isEditing ? strings.editBtn : selectedExercise?.name}
        centered
        overlayProps={{
          backgroundOpacity: 0.65,
          blur: 10,
        }}
        styles={{
          content: {
            backgroundColor: '#140707',
            color: '#ffdad8',
            border: '1px solid #4e2a2a',
            borderRadius: '20px',
            padding: '8px',
          },
          header: {
            backgroundColor: '#140707',
            borderBottom: '1px solid rgba(78, 42, 42, 0.4)',
            paddingBottom: '16px',
            color: '#fff',
          },
          title: {
            fontFamily: 'var(--font-anybody)',
            fontWeight: 800,
            fontSize: '22px',
            lineHeight: 1.2,
          },
        }}
      >
        {selectedExercise && (
          <div className="space-y-5 pt-4">
            {isEditing ? (
              // EDIT MODE
              <div className="space-y-4">
                <TextInput
                  label={strings.nameLabel}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  withAsterisk
                  styles={{
                    input: { backgroundColor: 'rgba(46, 20, 20, 0.3)', borderColor: '#4e2a2a', color: '#fff' },
                    label: { color: '#ffdad8', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }
                  }}
                />

                <TextInput
                  label={strings.targetDetailedLabel}
                  value={editTarget}
                  onChange={(e) => setEditTarget(e.target.value)}
                  required
                  withAsterisk
                  styles={{
                    input: { backgroundColor: 'rgba(46, 20, 20, 0.3)', borderColor: '#4e2a2a', color: '#fff' },
                    label: { color: '#ffdad8', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }
                  }}
                />

                <Select
                  label={strings.tierLabel}
                  value={editTier}
                  onChange={(val) => setEditTier((val as 'S' | 'A' | 'B' | 'C') || 'B')}
                  data={[
                    { value: 'S', label: strings.tierSLabel },
                    { value: 'A', label: strings.tierALabel },
                    { value: 'B', label: strings.tierBLabel },
                    { value: 'C', label: strings.tierCLabel },
                  ]}
                  required
                  withAsterisk
                  styles={{
                    input: { backgroundColor: 'rgba(46, 20, 20, 0.3)', borderColor: '#4e2a2a', color: '#fff' },
                    label: { color: '#ffdad8', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' },
                    dropdown: { backgroundColor: '#140707', borderColor: '#4e2a2a' },
                    option: { color: '#ffdad8', '&[data-selected]': { backgroundColor: '#ff003c' } }
                  }}
                />

                <Select
                  label={strings.priorityLabel}
                  value={editPriority}
                  onChange={(val) => setEditPriority((val as 'low' | 'medium' | 'high') || 'medium')}
                  data={[
                    { value: 'low', label: strings.priorityLow },
                    { value: 'medium', label: strings.priorityMedium },
                    { value: 'high', label: strings.priorityHigh },
                  ]}
                  required
                  withAsterisk
                  styles={{
                    input: { backgroundColor: 'rgba(46, 20, 20, 0.3)', borderColor: '#4e2a2a', color: '#fff' },
                    label: { color: '#ffdad8', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' },
                    dropdown: { backgroundColor: '#140707', borderColor: '#4e2a2a' },
                    option: { color: '#ffdad8', '&[data-selected]': { backgroundColor: '#ff003c' } }
                  }}
                />

                <TextInput
                  label={strings.descriptionLabel}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  styles={{
                    input: { backgroundColor: 'rgba(46, 20, 20, 0.3)', borderColor: '#4e2a2a', color: '#fff' },
                    label: { color: '#ffdad8', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }
                  }}
                />

                <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.04]">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    <IconX size={14} />
                    {strings.cancelBtn}
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={!editName.trim() || !editTarget.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all text-white"
                    style={{
                      backgroundColor: '#ff003c',
                      border: 'none',
                      opacity: (!editName.trim() || !editTarget.trim()) ? 0.5 : 1,
                      cursor: (!editName.trim() || !editTarget.trim()) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <IconCheck size={14} />
                    {strings.saveBtn}
                  </button>
                </div>
              </div>
            ) : (
              // DETAILS VIEW MODE
              <>
                {/* Meta Group and Tier */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs uppercase font-bold px-3 py-1 rounded-lg bg-white/5 border border-white/10" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                      {getLocalizedMuscleGroup(selectedExercise.muscleKey, locale)}
                    </span>
                    {renderTierBadge(selectedExercise.tier)}
                  </div>

                  {/* Actions for editing and deleting */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 rounded-lg transition-colors hover:bg-white/10 text-white"
                      style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                      title={strings.editBtn}
                    >
                      <IconEdit size={16} />
                    </button>
                    <button
                      onClick={handleDelete}
                      className="p-2 rounded-lg transition-colors hover:bg-red-500/20 text-red-400"
                      style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                      title={strings.deleteBtn}
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                </div>

                {/* Muscle target detail & Priority */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl flex flex-col justify-between text-xs" style={{ backgroundColor: 'rgba(46, 20, 20, 0.4)', border: '1px solid rgba(78, 42, 42, 0.3)' }}>
                    <span className="opacity-75 mb-1">{strings.targetLabel}</span>
                    <span className="font-bold text-white text-sm">{selectedExercise.target}</span>
                  </div>
                  <div className="p-3.5 rounded-xl flex flex-col justify-between text-xs" style={{ backgroundColor: 'rgba(46, 20, 20, 0.4)', border: '1px solid rgba(78, 42, 42, 0.3)' }}>
                    <span className="opacity-75 mb-1">{strings.priorityLabel}</span>
                    <div className="mt-1">{renderPriorityBadge(selectedExercise.priority)}</div>
                  </div>
                </div>

                {/* Technique / Description block */}
                <div className="space-y-2">
                  <h4
                    className="pl-3 border-l-2 text-[11px] font-bold tracking-wider uppercase"
                    style={{
                      fontFamily: 'var(--font-jetbrains)',
                      color: '#ffb3b2',
                      borderColor: '#ff003c',
                    }}
                  >
                    {strings.techniqueTitle}
                  </h4>
                  <p className="text-sm leading-relaxed opacity-85 whitespace-pre-wrap" style={{ color: '#ffdad8' }}>
                    {selectedExercise.description || strings.techniqueBody}
                  </p>
                </div>

                {/* Modal actions */}
                <div className="flex justify-end pt-4 border-t border-white/[0.04]">
                  <button
                    onClick={close}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-95"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    {strings.close}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
